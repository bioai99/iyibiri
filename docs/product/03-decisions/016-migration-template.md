# 016. Migration template — begin/commit + idempotency + RLS + index zorunluluğu

**Tarih:** 2026-04-26
**Durum:** **Accepted (2026-04-26)** ✅ (system-architect, 2026-04-26)
**Önerici:** system-architect
**Bağlı:** TD-014 ([Tech Debt Ledger](../../eng/_tech-debt.md#td-014-)), [v2 audit TD-014](../../audit/2026-04-26-eng-arch-baseline-audit.md#td-014-)

## Bağlam

v2 audit migration disiplinini ölçtü:

| Disiplin metriği | Mevcut | Hedef |
|---|---|---|
| Toplam migration | 43 | — |
| `begin/commit` wrap | 35 (%81) | 43 (%100) |
| `if not exists` / `on conflict do nothing` | 22 (%51) | 43 (%100) |
| `enable row level security` (yaratılan tablolar için) | 22/22 ✅ | %100 ✅ |
| Index coverage (single-column) | 25 | — |
| Composite index | 0 | en az 5-10 |

**Sorunlar:**

1. **Transaction wrap eksik (8 migration):** Yarısı tamamlanan migration partial state bırakır.
2. **Idempotency eksik (21 migration):** Re-apply'da `relation already exists` veya `duplicate key` hata.
3. **Composite index 0:** `(user_id, status='completed')` veya `(ngo_id, created_at desc)` gibi sık kombinasyonlar scan + filter olur.

Atlas Bölüm 11 konvansiyonu ad hoc — engineer'ın kendi disiplinine bağlı. Lint/CI enforcement yok.

## Karar (Proposed)

**Yeni migration `begin/commit` + `if not exists` + RLS + index pattern'lerini zorunlu kullanır. Template dosyası (`docs/eng/templates/migration-template.sql`) ile baseline.** Mevcut 43 migration'a dokunulmaz (apply edildi).

### Migration template (`docs/eng/templates/migration-template.sql`):

```sql
-- migration NNN_konu.sql
-- Tarih: YYYY-MM-DD
-- Owner: supabase-backend
-- Bağlı ADR / Workstream: ADR-XXX, WS-XX
--
-- Amaç: [1-2 cümle açıklama]
--
-- Rollback notu:
--   - drop table public.X cascade;  // rollback gerekirse
--   - alter table public.Y drop column Z;  // kolon ekleme rollback'i

begin;

-- ─────────────────────────────────────────────────────────────
-- 1. Schema (DDL)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.X (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('pending', 'active', 'cancelled')),
  amount numeric(10, 2) not null check (amount >= 0),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- Idempotent kolon ekleme:
-- alter table public.Y
--   add column if not exists new_col text,
--   add column if not exists another_col integer not null default 0;

-- ─────────────────────────────────────────────────────────────
-- 2. RLS — yeni tabloda zorunlu
-- ─────────────────────────────────────────────────────────────

alter table public.X enable row level security;

-- Drop-then-create pattern idempotent policy için:
drop policy if exists "Users view own X" on public.X;
create policy "Users view own X" on public.X
  for select using (auth.uid() = user_id);

drop policy if exists "Users insert own X" on public.X;
create policy "Users insert own X" on public.X
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own X" on public.X;
create policy "Users update own X" on public.X
  for update using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 3. Index — FK + sık where koşulu kolonları
-- ─────────────────────────────────────────────────────────────

create index if not exists X_user_idx on public.X(user_id);
create index if not exists X_status_idx on public.X(status);
create index if not exists X_created_idx on public.X(created_at desc);

-- Composite index — sık (user_id, status) kombinasyonu
create index if not exists X_user_status_idx on public.X(user_id, status);

-- ─────────────────────────────────────────────────────────────
-- 4. Trigger / Function (gerekiyorsa)
-- ─────────────────────────────────────────────────────────────

create or replace function public.update_X_timestamp()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists on_X_update on public.X;
create trigger on_X_update
  before update on public.X
  for each row execute procedure public.update_X_timestamp();

-- ─────────────────────────────────────────────────────────────
-- 5. Seed (opsiyonel)
-- ─────────────────────────────────────────────────────────────

insert into public.X (user_id, status, amount)
values
  ('uuid-1', 'active', 100.00),
  ('uuid-2', 'pending', 50.00)
on conflict do nothing;  -- idempotent

-- ─────────────────────────────────────────────────────────────
-- 6. Sonradan eklenen kolonlar için backfill
-- ─────────────────────────────────────────────────────────────

-- update public.Y
--   set new_col = 'default_value'
--   where new_col is null;

commit;
```

### Zorunlu disiplinler

1. **`begin;` ile başla, `commit;` ile bitir.** Kısmi fail yerine atomic state.
2. **`create table if not exists`** — re-apply güvenliği.
3. **`add column if not exists`** — kolon ekleme idempotent.
4. **`drop policy if exists` then `create policy`** — RLS policy idempotent.
5. **`create or replace function`** — function idempotent.
6. **`drop trigger if exists` then `create trigger`** — trigger idempotent.
7. **`insert ... on conflict do nothing`** — seed idempotent.
8. **Yeni tabloda `enable row level security`** — security default.
9. **FK + sık filter kolonu için index.**
10. **Composite index** sık kombinasyonlar için.
11. **Rollback notu** dosyanın başında yorum olarak.

### Lint rule (TD-009 paralel)

`@iyibiri/eslint-plugin-sql`:
- `migration-must-have-transaction` — `.sql` dosyası `begin;` ile başlamalı, `commit;` ile bitmeli.
- `migration-must-be-idempotent` — `create table` → `if not exists`; `create policy` → `drop policy if exists` öncesi; `insert` → `on conflict do nothing`.
- `new-table-requires-rls` — `create table` ifadesi varsa, aynı dosyada `enable row level security` zorunlu.

## Implementation

### Faz 1 — Template dosyası + atlas Bölüm 11 update (yarım gün, supabase-backend + system-architect)

1. `docs/eng/templates/migration-template.sql` yarat (yukarıdaki içerik).
2. Atlas Bölüm 11 (konvansiyon) → migration template referansı eklenir.
3. supabase-backend playbook (`agent-md`) → "1. Her işe başlamadan" ritüele template referansı.

### Faz 2 — Mevcut migration'lara dokunma; gelecek için zorunlu (sürekli)

Eski 43 migration apply edildi → değiştirilmez. Yeni migration'lar template kullanır.

### Faz 3 — Lint rule (TD-009 ile birleşik, 1 hafta)

`@iyibiri/eslint-plugin-sql` package — 3 SQL rule.

### Faz 4 — Composite index audit + migration (TD-023, 1 gün)

Sık sorgu pattern matrisi (yarım gün) → 5-10 composite index migration:
```sql
-- migration 044_composite_indexes.sql
begin;

create index if not exists user_missions_user_status_idx on public.user_missions(user_id, status);
create index if not exists missions_ngo_active_event_idx on public.missions(ngo_id, active, event_date);
create index if not exists referrals_user_status_created_idx on public.referrals(user_id, status, created_at desc);
create index if not exists ngo_memberships_user_status_idx on public.ngo_memberships(user_id, status);
create index if not exists karma_transactions_user_type_date_idx on public.karma_transactions(user_id, type, created_at desc);

commit;
```

EXPLAIN ANALYZE ile validate (test instance).

## Sonuçlar

**İyi:**
- Re-apply güvenliği — partial fail riski sıfır.
- RLS default — security drift sıfır.
- Index coverage tutarlı — perf öngörülebilir.
- Engineer'a baseline — ad hoc disiplin yerine zorunlu pattern.
- Yeni engineer onboarding kolay — template referansla.

**Kötü:**
- Eski 43 migration template ile uyumsuz (kalır, ama drift olarak kalmaz çünkü apply edildi, geri dönülemez).
- SQL lint rule kuruluması ekstra setup (1 hafta).
- Composite index ekleme migration'lar test instance'da EXPLAIN ANALYZE gerektirir (yarım gün).

**Operasyonel (Accepted sonrası 5-dosya checklist):**

1. Bu ADR — `Proposed` → `Accepted`.
2. `docs/product/04-questions/open.md` → resolved.
3. `docs/product/04-questions/resolved.md` → yeni satır.
4. atlas Bölüm 11 update + supabase-backend agent playbook update.
5. Status board — TD-014 + TD-023 in-progress.

## Bağlı kararlar

- ADR-014, ADR-015 (lint rule paketi paralel — `@iyibiri/eslint-plugin` + `@iyibiri/eslint-plugin-sql`).
- ADR-007 (parametric fee) — migration 009 mevcut, template'le geriye dönük uyumlama yok.
- ADR-008 (payment routing) — migration 010 + 040 mevcut.

## Açık sorular

- **Q51 🟢** — `update public.X set ... where ... is null` backfill pattern'i her zaman idempotent mi? **Önerim:** Evet, `where ... is null` koşulu ikinci çalıştırmada 0 satır günceller.
- **Q52 🟢** — Composite index 5-10 yeterli mi? **Önerim:** Yarım gün audit ile gerçek sayı belirlenir. `lib/supabase/queries/` pattern'leri kanıt.

## Referanslar

- v2 audit: [`docs/audit/2026-04-26-eng-arch-baseline-audit.md`](../../audit/2026-04-26-eng-arch-baseline-audit.md) Bölüm 6 TD-014
- Tech Debt Ledger TD-014, TD-023: [`docs/eng/_tech-debt.md`](../../eng/_tech-debt.md)
- Skill: `supabase-postgres-best-practices` (atlas Bölüm 12 + skill'in kendisi)

**İlgili sorular:** Q51-52.

## Handoff log

- 2026-04-26 20:20 — **system-architect** ⏸ Proposed — `docs/product/03-decisions/016-migration-template.md`. User/coordinator onayı bekleniyor; Accept sonrası supabase-backend Faz 1 (template) + Faz 4 (composite index) paralel.
