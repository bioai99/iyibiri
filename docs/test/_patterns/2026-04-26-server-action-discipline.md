# Pattern: Server Action Discipline Eksikliği

**Tarih:** 2026-04-26
**Tespit eden:** system-architect (v2 baseline audit)
**Severity:** 🔴 (auth guard) + 🟡 (revalidate + zod)
**Audit ref:** [`docs/audit/2026-04-26-eng-arch-baseline-audit.md`](../../audit/2026-04-26-eng-arch-baseline-audit.md) Bölüm 3 S-002, S-006, S-007 + Bölüm 2 D-002

## Etkilenen entry'ler

- TD-019 🔴 — Server action defense-in-depth eksik (35/43 action `getUser()` çağırmıyor)
- TD-020 🟡 — Zod / input validation kullanımı 0
- TD-026 🟡 — revalidatePath kapsamı 12/43

## Sayılar

| Disiplin alanı | Mevcut | Hedef | Gap |
|---|---|---|---|
| Server action toplam | 43 | — | — |
| `supabase.auth.getUser()` çağıran | 8 (%19) | 43 (%100) | **35 dosya** |
| `revalidatePath`/`revalidateTag` çağıran | 12 (%28) | 43 (%100) | **31 dosya** |
| Zod input validation | 0 (%0) | 43 (%100) | **43 dosya** |

## Kök neden

**Server action template'i yok; ad-hoc yazılıyor.** Engineer Next.js `'use server'` direktifini ekliyor, sonra direkt Supabase client çağrısı yapıyor — ne auth guard ne input validation ne cache invalidation. Middleware (`/admin/*` + `/dashboard/*`) auth check yaptığı için "yeterli" hissi var; ama:

1. **Middleware ile server action ayrı katmanlar.** Middleware request path'ine göre çalışır; server action programatik çağrı (test, internal call, edge runtime) ile bypass edilebilir.
2. **Parameter manipulation.** `createMission(ngoId, data)` server action'ında middleware path'teki `ngoId`'yi check eder; `ngoId` parametre olarak alınınca admin user kendi NGO'su yerine başka NGO'nun ID'sini geçerse RLS son kapı.
3. **Zod yok = type-coercion riski.** `data: Partial<MissionData>` parametre `as any` cast ile DB'ye yazılıyor. `karma: -1000` veya `karma: "999999999"` gibi malformed input'a karşı koruma yok.
4. **revalidatePath yok = UI stale.** Form submit sonrası cache invalidate olmuyor; kullanıcı "kaydedildi mi" şüphesinde refresh atıyor.

## Spesifik bulgu detayları

### A. Auth guard gap matrisi (TD-019)

**35 server action `supabase.auth.getUser()` çağırmıyor:**

```
lib/admin/membership-config-actions.ts
lib/admin/missions-actions.ts
lib/admin/blog-actions.ts
lib/admin/verifications-actions.ts
lib/admin/ngo-profile-actions.ts
lib/admin/members-actions.ts
lib/admin/payment-config-actions.ts
lib/admin/ngo-signup-review-actions.ts
lib/admin/sponsor-actions.ts
lib/admin/campaign-actions.ts
lib/sponsors/signup-actions.ts
lib/dev/ngo-admin-fixtures.ts
lib/onboarding/ngo-signup-actions.ts
+ 14 admin page-level server action (sayfa içinde 'use server' direktifli)
```

Örnek `lib/admin/missions-actions.ts:33-34`:
```ts
export async function createMission(ngoId: string, data: MissionData) {
  const supabase = await createClient()
  // ❌ NO supabase.auth.getUser() CHECK
  // ❌ NO requireNgoAdmin(ngoId) CHECK
  const { data: mission, error } = await supabase.from('missions').insert(...)
}
```

Karşılaştırma `lib/membership/actions.ts:84-90` (✅ doğru pattern):
```ts
export async function initiateMembership(input: InitiateMembershipInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Önce giriş yap.', code: 'AUTH_REQUIRED' }
  }
  // ...
}
```

### B. revalidatePath gap matrisi (TD-026)

**31 server action mutation yapıyor ama UI invalidate etmiyor:**

```
lib/donations/actions.ts            ❌ — bağış sonrası dashboard güncellenmiyor olabilir
lib/admin/members-actions.ts        ❌ — üye düzenleme sonrası liste stale
lib/sponsors/signup-actions.ts      ❌ — sponsor başvuru sonrası queue stale
lib/dev/ngo-admin-fixtures.ts       ❌ — fixture sonrası UI yenilemiyor
lib/onboarding/ngo-signup-actions.ts ❌ — STK başvuru sonrası queue stale
lib/membership/actions.ts           ❌ — confirmMembership sonrası dashboard yenilemiyor
+ 26 admin page action
```

Mevcut iyi örnek `lib/admin/missions-actions.ts:60-61`:
```ts
revalidatePath(`/admin/${ngoId}/missions`)
revalidatePath(`/admin/${ngoId}`)
```

### C. Zod input validation gap (TD-020)

**43 server action, 0'ı zod kullanıyor.** `grep -rln "from 'zod'" → 0`.

`lib/admin/missions-actions.ts:43` örneği:
```ts
domain: data.domain as any,  // ❌ type coercion bypass
```

Yani `data.domain` `string` olabilir ama runtime'da `'malformed_value'` gönderilirse DB constraint'e takılır (defense-in-depth değil), ya da `'<script>'` gibi XSS payload'ları geçer (UI'da render edilirse risk).

## Önerilen sistemik fix

### Faz 1 — `lib/auth/guards.ts` helper modül (ADR-015 Faz 1)

```ts
// lib/auth/guards.ts
import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'

export class AuthError extends Error {
  constructor(public code: 'AUTH_REQUIRED' | 'NGO_ADMIN_REQUIRED' | 'SUPER_ADMIN_REQUIRED' | 'SPONSOR_ADMIN_REQUIRED') {
    super(code)
  }
}

export async function requireUser(): Promise<User> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new AuthError('AUTH_REQUIRED')
  return user
}

export async function requireNgoAdmin(ngoId: string): Promise<User> {
  const user = await requireUser()
  const supabase = await createClient()
  const { data: isAdmin } = await supabase.rpc('is_ngo_admin', { u: user.id, n: ngoId })
  if (!isAdmin) throw new AuthError('NGO_ADMIN_REQUIRED')
  return user
}

export async function requireSuperAdmin(): Promise<User> { /* ... */ }
export async function requireSponsorAdmin(sponsorId: string): Promise<User> { /* ... */ }
```

### Faz 2 — Bulk update 35 server action (ADR-015 Faz 2)

Her server action başına ekle:
```ts
export async function createMission(ngoId: string, data: MissionData) {
  await requireNgoAdmin(ngoId)  // ← defense-in-depth
  const supabase = await createClient()
  // ...
}
```

### Faz 3 — `createServerAction` wrapper template (ADR-015 Faz 3, opsiyonel)

```ts
export const createMission = createServerAction({
  auth: { type: 'ngoAdmin', ngoIdFrom: 'ngoId' },
  schema: MissionSchema,  // Zod
  revalidate: ['/admin/[ngoId]/missions', '/admin/[ngoId]'],
  async handler(input, user) { /* ... */ },
})
```

### Faz 4 — 10 kritik server action için Zod schema (TD-020)

```ts
// lib/admin/missions/schemas.ts
import { z } from 'zod'

export const CreateMissionSchema = z.object({
  ngoId: z.string().uuid(),
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  domain: z.enum(['nature', 'education', 'social', 'financial']),
  karma_points: z.number().int().min(0).max(10000),
  event_date: z.string().datetime(),
  location: z.string().max(500),
  image_url: z.string().url().optional(),
  status: z.enum(['draft', 'active']),
})
```

10 kritik server action'a uygula:
- Membership: initiate, confirm, cancel
- Donations: initiate, confirm
- Missions admin: create, update, delete
- Verifications: approve, reject, bulkVerify

### Faz 5 — revalidatePath bulk fix (TD-026)

Matrix:

| Server action | Hangi route invalidate |
|---|---|
| `createMission(ngoId)` | `/admin/${ngoId}/missions`, `/admin/${ngoId}`, `/dashboard/missions` |
| `updateMission` | aynı |
| `deleteMission` | aynı |
| `createBlogPost(ngoId)` | `/admin/${ngoId}/blog`, `/dashboard/discover` |
| `approveVerification(ngoId)` | `/admin/${ngoId}/verifications`, `/admin/${ngoId}` |
| `confirmMembership(referralId)` | `/dashboard`, `/dashboard/ngos/${ngoId}` |
| `confirmDonation(referralId)` | `/dashboard`, `/dashboard/profile/donations` |
| `signupNgo` | `/admin/devtools/ngo-requests` |
| `signupSponsor` | `/admin/devtools/sponsor-requests` |
| ... | ... |

### Faz 6 — Lint rule paketi (TD-009 paralel)

`@iyibiri/eslint-plugin`:
- `auth-guard-required` — `'use server'` direktifli dosyada export edilen async function'ın ilk 3 satırında auth helper çağrısı zorunlu.
- `revalidate-after-mutation` — `.insert()/.update()/.delete()` çağrısı varsa, `revalidatePath` zorunlu.
- `zod-input-validation` — server action input parametre type'ı `any` veya `Partial<*>` ise warn.

## Routing

| Bulgu | Sahip | Effort | Sprint |
|---|---|---|---|
| TD-019 35 action defense-in-depth | auth-capacitor (helper) + frontend-engineer + supabase-backend (bulk update) | M (1 hafta) | Mayıs P0 |
| TD-026 revalidate bulk fix | frontend-engineer | S (2 gün — matrix + bulk add) | Mayıs P0 |
| TD-020 Zod 10 schema | frontend-engineer + supabase-backend | M (1-2 hafta) | Haziran P1 |
| TD-009 Lint rule (3 rule) | frontend-engineer + system-architect | M (1 hafta) | Mayıs P0 base + Haziran P1 custom |

## Bağlı ADR'ler

- **ADR-015 Proposed** [`docs/product/03-decisions/015-server-action-template.md`](../../product/03-decisions/015-server-action-template.md) — bu pattern'in implementation roadmap'i.
- **ADR-014 Proposed** (TIERS) — paralel lint rule paketi.

## Dependency

- `npm i zod` (~25KB minified, server-only kullanım, client bundle'a sızmaz).
- `is_sponsor_admin` RPC kontrol et (Migration 042 muhtemelen var).

## Handoff log

- 2026-04-26 20:10 — **system-architect** 📥 — Pattern memo açıldı. Routing: auth-capacitor (helper modül) + frontend-engineer + supabase-backend + system-architect (review). ADR-015 Proposed kuyruğa girdi. User onayı bekleniyor.
- ⏸ Pending — User onay sonrası Faz 1 (helper) + Faz 2 (35 action bulk) + Faz 5 (revalidate matrix) paralel başlar. Faz 4 (Zod) Haziran sprint.
