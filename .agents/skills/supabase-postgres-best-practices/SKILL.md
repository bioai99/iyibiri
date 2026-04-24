---
name: supabase-postgres-best-practices
description: Postgres performance optimization and best practices from Supabase. Use this skill when writing, reviewing, or optimizing Postgres queries, schema designs, or database configurations.
license: MIT
metadata:
  author: supabase
  version: "1.1.1"
  organization: Supabase
  date: January 2026
  abstract: Comprehensive Postgres performance optimization guide for developers using Supabase and Postgres. Contains performance rules across 8 categories, prioritized by impact from critical (query performance, connection management) to incremental (advanced features). Each rule includes detailed explanations, incorrect vs. correct SQL examples, query plan analysis, and specific performance metrics to guide automated optimization and code generation.
---

# Supabase Postgres Best Practices

Comprehensive performance optimization guide for Postgres, maintained by Supabase. Contains rules across 8 categories, prioritized by impact to guide automated query optimization and schema design.

## When to Apply

Reference these guidelines when:
- Writing SQL queries or designing schemas
- Implementing indexes or query optimization
- Reviewing database performance issues
- Configuring connection pooling or scaling
- Optimizing for Postgres-specific features
- Working with Row-Level Security (RLS)

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Query Performance | CRITICAL | `query-` |
| 2 | Connection Management | CRITICAL | `conn-` |
| 3 | Security & RLS | CRITICAL | `security-` |
| 4 | Schema Design | HIGH | `schema-` |
| 5 | Concurrency & Locking | MEDIUM-HIGH | `lock-` |
| 6 | Data Access Patterns | MEDIUM | `data-` |
| 7 | Monitoring & Diagnostics | LOW-MEDIUM | `monitor-` |
| 8 | Advanced Features | LOW | `advanced-` |

## How to Use

Read individual rule files for detailed explanations and SQL examples:

```
references/query-missing-indexes.md
references/query-partial-indexes.md
references/_sections.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect SQL example with explanation
- Correct SQL example with explanation
- Optional EXPLAIN output or metrics
- Additional context and references
- Supabase-specific notes (when applicable)

## 9. RLS Patterns — Multi-tenant Safety + Performance

**Kaynak:** [Supabase RLS Docs](https://supabase.com/docs/guides/database/postgres/row-level-security) · [pganalyze — RLS Performance](https://www.crunchydata.com/blog/author/craig-kerstiens) · [Supabase Discussions](https://github.com/orgs/supabase/discussions/14576)

Row-Level Security (RLS) her tablo'da açıktır. Policy yazılışı performance'ı doğrudan etkiler — hatalı RLS = full table scan + slow query.

### Pattern 1: User-Own CRUD (Single-tenant row)

```sql
-- profiles — kullanıcı kendi profilini görebilir
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ✅ DOĞRU: Direct UUID match
-- SELECT count(*) FROM profiles WHERE id = auth.uid(); -- index on id → O(1)
```

### Pattern 2: Multi-tenant STK (via metadata)

```sql
-- missions — STK üyeleri kendi STK'nın mission'larını görsün
-- Problem: mission.ngo_id = TEXT, auth.uid() = UUID. Çözüm: auth.user_metadata JSONB field.

ALTER TABLE profiles ADD COLUMN ngo_id TEXT REFERENCES ngos(id);

CREATE POLICY "Users can view own ngo missions" ON missions
  FOR SELECT USING (ngo_id = auth.user_metadata ->> 'ngo_id');

-- ✅ Index kritik
CREATE INDEX idx_missions_ngo_id ON missions(ngo_id);
```

**Hata:**
```sql
-- ❌ YANLIŞ: Subquery RLS'de
CREATE POLICY "slow_rls" ON missions
  FOR SELECT USING (
    ngo_id IN (SELECT ngo_id FROM ngo_memberships WHERE user_id = auth.uid())
  );
-- Her row'da subquery → N+1 + slow
```

### Pattern 3: Public Read (INSERT/UPDATE controlled)

```sql
-- ngos — herkes okuyabilir, sadece admin ekleyebilir
CREATE POLICY "Anyone can view ngos" ON ngos
  FOR SELECT USING (true);

CREATE POLICY "Only admins create ngos" ON ngos
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
```

### Testing RLS

```sql
-- Test: user_1 olarak queries
SET session "request"."jwt.claims" TO '{"sub": "user_1", "role": "authenticated"}';

-- Expect: user_1'in missions'larını, user_2'ninkileri değil
SELECT count(*) FROM missions;  -- x rows (only user_1's)
RESET session "request"."jwt.claims";

-- Without RLS check, expect: all rows (dangerous!)
SET session pgrole TO 'authenticated';
-- ...
```

---

## 10. Realtime + Idempotency — Webhook Reliability

**Kaynak:** [Supabase Realtime](https://supabase.com/docs/guides/realtime) · [Stripe Webhooks Best Practices](https://stripe.com/docs/webhooks/best-practices) · [Idempotency Key Pattern](https://stripe.com/docs/api/idempotent_requests)

Webhook'lar at-least-once delivery garantisi → duplicate event handling zorunlu. Idempotency key (UUID + timestamp) duplicate request'i detect eder.

### Webhook Flow

```sql
-- Event table — webhook'un ne zaman gönderileceği log
CREATE TABLE webhook_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending, sent, failed, processed
  idempotency_key UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_webhook_events_status ON webhook_events(status);
CREATE INDEX idx_webhook_events_idempotency ON webhook_events(idempotency_key);

-- Trigger: mission complete → webhook event
CREATE OR REPLACE FUNCTION trigger_mission_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO webhook_events (
      event_type, resource_id, payload, idempotency_key
    ) VALUES (
      'mission.completed',
      NEW.id,
      jsonb_build_object('mission_id', NEW.id, 'ngo_id', NEW.ngo_id),
      gen_random_uuid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Idempotency Check (Client side)

```typescript
// Edge function veya server action
async function handleMissionCompleted(
  event: WebhookEvent
) {
  // 1. Idempotency check
  const existing = await db.webhookEvents.findUnique({
    where: { idempotency_key: event.idempotency_key }
  });
  
  if (existing?.processed_at) {
    return { status: 'already_processed' };  // 200 OK (idempotent)
  }
  
  // 2. Business logic (mutation)
  const transaction = await db.$transaction(async tx => {
    // Mission → karma update
    await tx.profiles.update({
      where: { id: event.ngo_id },
      data: { karma_total: { increment: 100 } }
    });
    
    // 3. Mark processed
    await tx.webhookEvents.update({
      where: { id: event.id },
      data: { status: 'processed', processed_at: new Date() }
    });
    
    return { success: true };
  });
  
  return transaction;
}
```

### Retry + Exponential Backoff

```typescript
// Worker (Node + Bull queue, Supabase functions, veya Temporal)
for (let attempt = 1; attempt <= 5; attempt++) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: JSON.stringify(event),
      headers: { 'Idempotency-Key': event.idempotency_key }
    });
    
    if (response.ok) {
      // Mark sent
      await db.webhookEvents.update({
        where: { id: event.id },
        data: { status: 'sent' }
      });
      break;
    }
  } catch (err) {
    const delay = Math.pow(2, attempt) * 1000;  // 2s, 4s, 8s, 16s, 32s
    await sleep(delay);
  }
}
```

---

## 11. Edge Functions — Trusted Edge Logic

**Kaynak:** [Supabase Edge Functions](https://supabase.com/docs/guides/functions) · [Deno Runtime](https://deno.com/) · [Serverless Best Practices](https://www.serverless.com/blog)

Edge Functions (Deno runtime) serverless logic sunur — RLS bypass edebilir (service_role token), authentication yönetilir, cold start minimized.

### Use Case: QR Code Verification → Mission Complete

```typescript
// supabase/functions/verify-qr/index.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')  // ✅ Service role — RLS bypass
);

Deno.serve(async req => {
  const { qr_code, user_id } = await req.json();
  
  // 1. Auth + validation
  const auth = req.headers.get('authorization');
  if (!auth) return new Response('Unauthorized', { status: 401 });
  
  // 2. Verify QR
  const { data: mission } = await supabase
    .from('missions')
    .select('*')
    .eq('qr_code', qr_code)
    .single();
  
  if (!mission) return new Response('QR not found', { status: 404 });
  
  // 3. Atomic update — mission complete + karma award
  const { error } = await supabase.rpc('complete_mission_atomic', {
    mission_id: mission.id,
    user_id: user_id
  });
  
  if (error) return new Response(error.message, { status: 400 });
  
  return new Response(JSON.stringify({ success: true }), { status: 200 });
});

// supabase/migrations/NNN_complete_mission_atomic.sql
CREATE OR REPLACE FUNCTION complete_mission_atomic(
  mission_id TEXT,
  user_id UUID
)
RETURNS void AS $$
BEGIN
  UPDATE missions SET status = 'completed' WHERE id = mission_id;
  UPDATE profiles SET karma_total = karma_total + 100 WHERE id = user_id;
  -- Trigger webhook event
  INSERT INTO webhook_events (event_type, resource_id, payload, idempotency_key)
    VALUES ('mission.completed', mission_id, jsonb_build_object(...), gen_random_uuid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Constraints

- **Cold start:** ~500ms–1s (first request slow). Async pattern tercih.
- **Timeout:** 60s limit (long-running = async job yönlendir).
- **Memory:** ~512MB (heavy compute = backend server'a).
- **Deno:** TypeScript + Deno stdlib (npm package'ler limited).

---

## 12. Migration Versioning + Rollback

**Kaynak:** [Supabase Migrations](https://supabase.com/docs/guides/database/migrations) · [Liquibase Best Practices](https://docs.liquibase.com/concepts/bestpractices.html) · [Database Versioning](https://wiki.postgresql.org/wiki/Versioning)

Migration'lar commit'te versioned, rollback-safe olmalı. Backward compatibility şart.

### Naming + Structure

```
supabase/migrations/
  20260424120000_create_profiles.sql
  20260424120100_add_ngos_table.sql
  20260424120200_rls_missions.sql
  20260424120300_add_ngo_tier_column.sql
```

**Naming:** `YYYYMMDDHHMMSS_description.sql` (timestamp → deploy sıraları unique + sortable).

### Template — Forward + Backward Compatible

```sql
-- supabase/migrations/20260424120300_add_ngo_tier_column.sql

-- Rollback strategy: down() executed via `supabase db reset`
-- Migration: add column (safe), backfill data (batched), then NOT NULL constraint

BEGIN;

-- 1. ADD COLUMN (nullable, safe)
ALTER TABLE ngo_memberships
ADD COLUMN tier_start_date TIMESTAMPTZ DEFAULT now();

-- Comment: kolonu backfill yöntemini dokümante et
COMMENT ON COLUMN ngo_memberships.tier_start_date IS 
  'Tier start date. Backfilled from created_at on 2026-04-24.';

-- 2. CREATE INDEX (data migration öncesi)
CREATE INDEX idx_ngo_memberships_tier_start_date 
ON ngo_memberships(tier_start_date);

-- 3. Idempotent backfill (chunked, 10k rows per batch)
-- Production'da: ALTER SYSTEM SET max_wal_size = '4GB' (WAL growth prevent)
UPDATE ngo_memberships
SET tier_start_date = created_at
WHERE tier_start_date IS NULL
LIMIT 10000;

-- Repeat for remaining rows (script dışında, manual staging check)

-- 4. NOT NULL constraint (data migration tamamlandıktan sonra)
ALTER TABLE ngo_memberships
ALTER COLUMN tier_start_date SET NOT NULL;

COMMIT;
```

### Rollback Checklist

- [ ] Schema change backward compat mi? (ADD OK, DROP hard)
- [ ] Index var mı (backfill performance)?
- [ ] Data migration idempotent mi (rerun safe)?
- [ ] Staging deploy'dan sonra production test?
- [ ] Rollback script var mı?

---

## References

- https://www.postgresql.org/docs/current/
- https://supabase.com/docs
- https://wiki.postgresql.org/wiki/Performance_Optimization
- https://supabase.com/docs/guides/database/overview
- https://supabase.com/docs/guides/auth/row-level-security
- https://supabase.com/docs/guides/realtime
- https://supabase.com/docs/guides/functions
- https://supabase.com/docs/guides/database/migrations
- https://www.crunchydata.com/blog/author/craig-kerstiens
- https://stripe.com/docs/webhooks/best-practices
