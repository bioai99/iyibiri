# 015. Server action template + auth guards — defense-in-depth zorunluluğu

**Tarih:** 2026-04-26
**Durum:** **Accepted (2026-04-26)** ✅ (system-architect, 2026-04-26)
**Önerici:** system-architect
**Bağlı:** TD-019, TD-020, TD-026 ([Tech Debt Ledger](../../eng/_tech-debt.md#td-019-)), [v2 audit S-002 + S-006 + D-002](../../audit/2026-04-26-eng-arch-baseline-audit.md#s-002-)

## Bağlam

v2 audit tespiti — **server action disiplini sistemik olarak eksik:**

| Metrik | Mevcut | Hedef |
|---|---|---|
| Server action sayısı | 43 | — |
| `supabase.auth.getUser()` çağrılan | **8** (%19) | 43 (%100) |
| `revalidatePath/revalidateTag` çağrılan | **12** (%28) | 43 (%100) |
| Zod / input validation | **0** (%0) | 43 (%100) |

35 server action defense-in-depth eksik. Middleware (`/admin/*` ile `/dashboard/*`) auth check yapıyor ✅, ama:

1. **Middleware bypass** — internal route call, test fixture, edge runtime case'lerde server action korumasız.
2. **Parameter manipulation** — `createMission(ngoId, data)` çağrısında middleware path'teki `ngoId`'yi check eder; server action `ngoId` parametre olarak alır; eğer admin user kendi NGO'su yerine başka NGO'nun `ngoId`'sini geçerse RLS son kapı.
3. **RLS gap riski** — `missions` INSERT policy `is_ngo_admin(auth.uid(), ngo_id)` olmalı; eğer bu policy yoksa cross-tenant insert mümkün.

Plus mutation sonrası UI stale: 31 action `revalidatePath` çağırmıyor → form submit sonrası cache invalidate olmuyor → kullanıcı "kaydedildi mi" şüphesinde refresh atıyor.

Plus zero input validation: `data: Partial<MissionData>` parametre `as any` cast ile DB'ye yazılıyor → type-coercion / SQL injection riski.

## Karar (Proposed)

**3 katmanlı disiplin:**

### Katman 1 — `lib/auth/guards.ts` helper modül

```ts
// lib/auth/guards.ts
//
// Server action defense-in-depth — auth + tenant authorization.
// Middleware'in kapısı sağlam ama bu helper'lar son güvenlik katmanı.

import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'

export class AuthError extends Error {
  constructor(public code: 'AUTH_REQUIRED' | 'NGO_ADMIN_REQUIRED' | 'SUPER_ADMIN_REQUIRED' | 'SPONSOR_ADMIN_REQUIRED') {
    super(code)
  }
}

/** Tüm protected server action'ların başında çağrılır. */
export async function requireUser(): Promise<User> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new AuthError('AUTH_REQUIRED')
  return user
}

/** NGO admin işlemleri için. RLS'e ek olarak server-side double-check. */
export async function requireNgoAdmin(ngoId: string): Promise<User> {
  const user = await requireUser()
  const supabase = await createClient()
  const { data: isAdmin, error } = await supabase.rpc('is_ngo_admin', { u: user.id, n: ngoId })
  if (error || !isAdmin) throw new AuthError('NGO_ADMIN_REQUIRED')
  return user
}

export async function requireSuperAdmin(): Promise<User> {
  const user = await requireUser()
  const supabase = await createClient()
  const { data: isSuper, error } = await supabase.rpc('is_super_admin', { u: user.id })
  if (error || !isSuper) throw new AuthError('SUPER_ADMIN_REQUIRED')
  return user
}

export async function requireSponsorAdmin(sponsorId: string): Promise<User> {
  const user = await requireUser()
  const supabase = await createClient()
  const { data: isAdmin, error } = await supabase.rpc('is_sponsor_admin', { u: user.id, s: sponsorId })
  if (error || !isAdmin) throw new AuthError('SPONSOR_ADMIN_REQUIRED')
  return user
}
```

### Katman 2 — `createServerAction` template (opsiyonel ama tavsiye)

```ts
// lib/server-action.ts
//
// Server action template — auth + zod + revalidate'i tek wrapper'da.

import { ZodSchema } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireUser, requireNgoAdmin, requireSuperAdmin, AuthError } from './auth/guards'

interface ServerActionOpts<I, O> {
  auth: 'public' | 'user' | { type: 'ngoAdmin'; ngoIdFrom: keyof I } | 'superAdmin'
  schema?: ZodSchema<I>
  revalidate?: string[]
  handler: (input: I, user: User | null) => Promise<O>
}

export function createServerAction<I, O>(opts: ServerActionOpts<I, O>) {
  return async (input: I): Promise<O | { ok: false; error: string; code?: string }> => {
    try {
      // 1. Auth
      let user: User | null = null
      if (opts.auth === 'user') {
        user = await requireUser()
      } else if (opts.auth === 'superAdmin') {
        user = await requireSuperAdmin()
      } else if (typeof opts.auth === 'object' && opts.auth.type === 'ngoAdmin') {
        const ngoId = (input as Record<string, unknown>)[opts.auth.ngoIdFrom as string] as string
        user = await requireNgoAdmin(ngoId)
      }

      // 2. Input validation
      if (opts.schema) {
        const parsed = opts.schema.safeParse(input)
        if (!parsed.success) {
          return { ok: false, error: parsed.error.message, code: 'VALIDATION' }
        }
        input = parsed.data
      }

      // 3. Handler
      const result = await opts.handler(input, user)

      // 4. Revalidate
      if (opts.revalidate) {
        for (const path of opts.revalidate) revalidatePath(path)
      }

      return result
    } catch (err) {
      if (err instanceof AuthError) {
        return { ok: false, error: 'Yetkisiz işlem', code: err.code }
      }
      throw err
    }
  }
}
```

Kullanım örneği:

```ts
// lib/admin/missions-actions.ts
'use server'

import { z } from 'zod'
import { createServerAction } from '@/lib/server-action'

const MissionSchema = z.object({
  ngoId: z.string(),
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  domain: z.enum(['nature', 'education', 'social', 'financial']),
  karma_points: z.number().int().min(0).max(10000),
  event_date: z.string().datetime(),
  location: z.string().max(500),
  image_url: z.string().url().optional(),
  status: z.enum(['draft', 'active']),
})

export const createMission = createServerAction({
  auth: { type: 'ngoAdmin', ngoIdFrom: 'ngoId' },
  schema: MissionSchema,
  revalidate: ['/admin/[ngoId]/missions', '/admin/[ngoId]'],
  async handler(input, user) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('missions')
      .insert({
        ngo_id: input.ngoId,
        title: input.title,
        description: input.description,
        domain: input.domain,
        karma: input.karma_points,
        event_date: input.event_date,
        location: input.location,
        image_url: input.image_url,
        status: input.status,
        active: input.status === 'active',
        verify_method: 'photo',
      })
      .select('id')
      .single()
    if (error) return { ok: false, error: error.message, code: 'DB' }
    return { ok: true, missionId: data.id }
  },
})
```

### Katman 3 — Lint rule paketi (TD-009 paralel)

ESLint custom plugin (`@iyibiri/eslint-plugin`):
- `auth-guard-required` — `'use server'` direktifli dosyada export edilen async function'ın ilk 3 satırında `requireUser` / `requireNgoAdmin` / `requireSuperAdmin` / `createServerAction` çağrısı zorunlu. Yoksa lint error.
- `revalidate-after-mutation` — server action içinde `.insert()` / `.update()` / `.delete()` çağrısı varsa, return'den önce `revalidatePath` veya `createServerAction.revalidate` zorunlu.
- `zod-input-validation` — server action input parametre type'ı `any` veya `Partial<*>` ise warn; `safeParse` yoksa warn.

## Implementation

### Faz 1 — `lib/auth/guards.ts` (yarım gün, auth-capacitor)

1. Helper modül yaz (yukarıdaki kod).
2. `is_sponsor_admin` RPC kontrol et — yoksa migration ile ekle (`042_vol32_sponsor_admin_role.sql` muhtemelen var).
3. Test (`lib/auth/guards.test.ts`).

### Faz 2 — 35 server action update (1 hafta, frontend-engineer + supabase-backend paralel)

35 server action başına `await requireUser()` / `requireNgoAdmin(ngoId)` ekle:

| Owner | Dosya sayısı | Tahmin (saat) |
|---|---|---|
| frontend-engineer | 14 admin page action | 6 |
| supabase-backend | 11 lib/admin/*-actions.ts | 6 |
| auth-capacitor | lib/sponsors, lib/onboarding, lib/dev | 4 |

### Faz 3 — `createServerAction` wrapper (yarım gün, frontend-engineer)

`lib/server-action.ts` yaz; **opsiyonel** olarak yeni server action'larda kullan. Mevcut 43 action'ı toplu refactor zorunlu değil (kademeli adoption).

### Faz 4 — Zod schema'lar (1-2 hafta, multi-agent)

10 kritik server action için Zod schema:
- Membership (`initiateMembership`, `confirmMembership`, `cancelMembership`)
- Donations (`initiateDonation`, `confirmDonation`)
- Missions admin (`createMission`, `updateMission`, `deleteMission`)
- Verifications admin (`approveVerification`, `rejectVerification`, `bulkVerify`)
- Members admin (`exportMembers`, `updateMembership`)

### Faz 5 — Lint rule paketi (1 hafta, frontend-engineer + system-architect)

`@iyibiri/eslint-plugin` package — 3 rule. ADR-014 lint rule paketi ile birleşik (TD-009 ana).

## Sonuçlar

**İyi:**
- Defense-in-depth — middleware bypass durumunda server action son kapı.
- Cross-tenant attack surface kapanır.
- Form submit sonrası UI stale problem ortadan kalkar.
- Type safety + injection koruması (Zod) kazanılır.
- Yeni engineer'lar template ile aynı pattern'i kullanır — drift önlenir.

**Kötü:**
- 35 dosya update emek (~16 saat multi-agent paralel).
- `createServerAction` wrapper kullanmak optional (uyumlama eğrisi).
- RPC `is_ngo_admin` her server action başına ek DB roundtrip → minor perf cost (<10ms).
- Mevcut server action'ların testi yoksa refactor regression riski yaratabilir (TD-008 ile birlikte ele alınmalı).

**Operasyonel (Accepted sonrası 5-dosya checklist):**

1. Bu ADR — `Proposed` → `Accepted`.
2. `docs/product/04-questions/open.md` → resolved.
3. `docs/product/04-questions/resolved.md` → yeni satır.
4. Workstream — `docs/product/01-workstreams/2026-04-26-server-action-discipline.md` aç.
5. Status board — TD-019 + TD-020 + TD-026 in-progress.

## Bağlı kararlar

- ADR-014 (TIERS) — lint rule paketi paralel.
- ADR-008 (Payment routing) — server action template stub'ları (TD-013) implement ederken kullan.
- ADR-009 (KVKK) — KVKK consent zod schema'ya dahil edilebilir.

## Açık sorular

- **Q48 🟡** — `createServerAction` wrapper kullanımı zorunlu mu (lint rule level error) yoksa opsiyonel (warn)? **Önerim:** Yeni action'larda warn-level; mevcut 35 action'da kademeli adoption.
- **Q49 🟡** — `is_sponsor_admin` RPC ekleme migration'ı (043) gerekli mi? Mevcut sponsor admin auth nasıl?
- **Q50 🟢** — Zod ekstra dependency (~25KB minified) bundle bloat mı? **Önerim:** Server-only kullanım → server bundle'da; client bundle'a sızmaz.

## Referanslar

- v2 audit: [`docs/audit/2026-04-26-eng-arch-baseline-audit.md`](../../audit/2026-04-26-eng-arch-baseline-audit.md) Bölüm 3 S-002, S-006, S-007 + Bölüm 2 D-002
- Tech Debt Ledger TD-019, TD-020, TD-026: [`docs/eng/_tech-debt.md`](../../eng/_tech-debt.md)
- Pattern memo: `docs/test/_patterns/2026-04-26-server-action-discipline.md`
- Middleware referansı: `middleware.ts`

**İlgili sorular:** Q48-50.

## Handoff log

- 2026-04-26 19:35 — **system-architect** ⏸ Proposed — `docs/product/03-decisions/015-server-action-template.md`. User/coordinator onayı bekleniyor; Accept sonrası auth-capacitor Faz 1 + frontend-engineer/supabase-backend Faz 2-4 paralel.
