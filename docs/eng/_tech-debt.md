# İyiBiri — Tech Debt Ledger

> **Sahip:** system-architect
> **Açılış:** 2026-04-26 v1 (ilk derin baseline audit) → **v2 (revize, derin)**
> **Kaynak:** [`docs/audit/2026-04-26-eng-arch-baseline-audit.md`](../audit/2026-04-26-eng-arch-baseline-audit.md)
> **Ritüel:** Haftalık review (Pazartesi sabahı, system-architect). Yeni entry her engineer kısa-vadeli kısayol oluşturduğunda.
> **Format:** ID + tarih + kategori + başlık + severity + LNO + ödeme planı + owner + kanıt + status.

## Severity tier
- 🔴 **Blocker** — production risk; V1 lansman öncesi kapanmalı.
- 🟡 **Major** — sistem sağlığı için 1-3 ay içinde kapanmalı.
- 🟢 **Minor** — polish; backlog'da bekler, sprint kapasitesinde alınır.

## LNO sınıflama (Shreyas Doshi)
- **L (Leverage):** Düşük effort, yüksek impact → önce yap.
- **N (Neutral):** Orta effort, orta impact → backlog sıraya gir.
- **O (Overhead):** Yüksek effort, düşük impact veya zorunlu → quarterly planlanır.

---

## Open (aktif borç) — 30 entry

### TD-001 🔴 L — TIERS catastrophic drift (8 dosya, 3 isim seti, 4 threshold)
- **Tarih:** 2026-04-26
- **Kategori:** SSoT / Standartlar
- **Audit ref:** [SS-001](../audit/2026-04-26-eng-arch-baseline-audit.md#ss-001-)
- **Kanıt:** v2 audit Bölüm 5 SS-001 — full matrix.
  - `lib/mock-data.ts:191-204` 6 tier ("Oldukça İyi Biri" eklenmiş)
  - `lib/karma-level.ts:9` `KARMA_PER_LEVEL = 500` level-tabanlı
  - `lib/supabase/queries/profiles.ts:28-31` 4 tier (karma 500/1500/3000)
  - `components/ui/tier-badge.tsx:13-17` 5 tier (karma 500/2000/5000/10000)
  - `components/ui/ds/hero-card.tsx:11` 5 tier "İyi Yürekli/İyilik Elçisi/İyilik Savaşçısı/İyiliğin Işığı"
  - `components/tier/tier-data.ts:32-104` 5 tier alternatif isimler
  - `components/ui/brand-logo.tsx:18-34` (yorumlar) alternatif
  - `app/dashboard/profile/profile-client.tsx:33-37` 5 tier
- **Risk:** Brand integrity, kullanıcı her sayfada farklı tier ismi/sayısı görüyor; QA + analytics belirsiz.
- **Plan:** P0 sprint (Mayıs).
- **Effort:** L (3 gün — ADR-014 onayı + `lib/tiers.ts` + 8 dosya migration + lint rule).
- **Owner:** product-analyst (ADR-014 onay) + frontend-engineer (fix) + design-system-keeper (canonical doğrulama).
- **Çözüm yolu:** ADR-014 Proposed → Accepted → `lib/tiers.ts` canonical → 8 callsite import → lint rule.
- **Pattern memo:** [`docs/test/_patterns/2026-04-26-ssot-drift.md`](../test/_patterns/2026-04-26-ssot-drift.md)
- **Status:** Open — ADR-014 Proposed kuyruğa girdi, user kararı bekliyor.

### TD-002 🔴 L — Hardcoded color leak 45 satır (ADR-004 ihlali regression)
- **Tarih:** 2026-04-26
- **Kategori:** Standartlar / Design system
- **Audit ref:** [SS-002](../audit/2026-04-26-eng-arch-baseline-audit.md#ss-002-)
- **Kanıt:** `grep -c "bg-white\|bg-black\|text-white\|text-black\|bg-stone\|#FFFFFF\|#000000" → 45`. Önceki audit (2026-04-24) 15+ idi; **3x büyüdü.**
  - `app/admin/devtools/devtools-client.tsx` — 8+ leak
  - `app/admin/[ngoId]/{missions,verifications,blog,campaigns}` — `bg-black/50` modal pattern (4 dosya)
  - `app/admin/missions/[id]/qr/qr-generator.tsx` — `bg-white` + `#FFFFFF`
  - `app/admin/login/page.tsx` — `bg-stone-900` + `bg-white` light kalıntı
  - `app/payments/sandbox/sandbox-client.tsx` — `bg-white` + `bg-emerald`
  - `components/ui/{mission-card,qr-scanner,domain-icon,command-palette}.tsx`
- **Risk:** ADR-004 (dark-only V1) ihlali; admin sayfaları light; brand inconsistency.
- **Plan:** P0 sprint (Mayıs, 1-2 hafta).
- **Effort:** M-L.
- **Owner:** design-system-keeper (sweep) + frontend-engineer (callsite migrasyonu).
- **Çözüm yolu (4 pattern):**
  - Pattern A — `bg-black/50` modal overlay (8 dosya) → `c.scrim` token.
  - Pattern B — Admin tarafı light kalıntısı → ADR revize gerekirse Proposed; yoksa dark migration.
  - Pattern C — Inline SVG `#FFFFFF` (3+ dosya) → CSS variable.
  - Pattern D — Tailwind palette spam (`bg-emerald/amber/rose/stone-*`) → atlas token.
- **Pattern memo:** [`docs/test/_patterns/2026-04-26-ssot-drift.md`](../test/_patterns/2026-04-26-ssot-drift.md) (combined)
- **Status:** Open

### TD-003 🟡 N — 96 `any` / `as any` kullanımı
- **Tarih:** 2026-04-26
- **Kategori:** Type safety
- **Audit ref:** [M-005](../audit/2026-04-26-eng-arch-baseline-audit.md#m-005-)
- **Kanıt:** `grep -c ": any\|as any" → 96`. Top 5: `lib/supabase/types.ts` 6, `lib/admin/sponsor-actions.ts` 6, `lib/auth/oauth-native.ts` 5, `lib/admin/sponsor-request-actions.ts` 5, `lib/admin/missions-actions.ts` 4.
- **Risk:** Type bug yakalama yeteneği zayıflıyor.
- **Plan:** P1 backlog (rolling — sprint başına 5-10 düş).
- **Effort:** O (uzun vadeli).
- **Owner:** frontend-engineer + supabase-backend.
- **Çözüm yolu:** Lint rule `@typescript-eslint/no-explicit-any: warn` (T-002 ile birlikte) + sprint başına 5-10 düşürme hedefi.
- **Status:** Open

### TD-004 🟡 N — 7 dosya 600+ satır client component
- **Tarih:** 2026-04-26
- **Kategori:** Modularity
- **Audit ref:** [M-001](../audit/2026-04-26-eng-arch-baseline-audit.md#m-001-)
- **Kanıt:** `states-client 724`, `tiers-client 703`, `profile-client 703`, `app/page.tsx 701` (landing — istisna), `membership-flow-client 694`, `mission-detail-client 630`, `donate-hub-client 604`, `verification-panel 545`.
- **Risk:** Test edilebilirlik + reusability + merge conflict.
- **Plan:** P1 sprint (Haziran), top 3 refactor.
- **Effort:** L (2-3 hafta paralel).
- **Owner:** frontend-engineer.
- **Çözüm yolu:** mission-detail → 4 sub-component, membership-flow → 3, profile-client → 3.
- **Pattern memo:** [`docs/test/_patterns/2026-04-26-client-monolith.md`](../test/_patterns/2026-04-26-client-monolith.md)
- **Status:** Open

### TD-005 🟡 N — `lib/supabase/types.ts` 1053 satır tek devasa dosya
- **Tarih:** 2026-04-26
- **Kategori:** Modularity
- **Audit ref:** [M-002](../audit/2026-04-26-eng-arch-baseline-audit.md#m-002-)
- **Risk:** Merge conflict, IDE yavaşlama.
- **Plan:** P1 sprint (Haziran, 1 hafta).
- **Effort:** M.
- **Owner:** supabase-backend.
- **Çözüm yolu:** Domain split (`lib/supabase/types/{profiles,missions,ngos,memberships,donations,sponsors,posts,storage}.ts`) + index re-export.
- **Status:** Open

### TD-006 🔴 L — Vitest framework kurulu değil
- **Tarih:** 2026-04-26
- **Kategori:** Test / DX
- **Audit ref:** [T-001](../audit/2026-04-26-eng-arch-baseline-audit.md#t-001-)
- **Kanıt:** `package.json` devDependencies'te vitest/jest yok. Mevcut 2 test `tsx` ile manuel script.
- **Risk:** CI'da test step yok; PR'larda regression yakalanmıyor.
- **Plan:** P0 sprint (Mayıs, 3-4 gün).
- **Effort:** M.
- **Owner:** frontend-engineer + test-engineer.
- **Çözüm yolu:** Vitest + React Testing Library + `vitest.config.ts` + ilk 5 sample test.
- **Status:** Open

### TD-007 🟡 N — E2e Playwright suite yok
- **Tarih:** 2026-04-26
- **Kategori:** Test
- **Audit ref:** [T-004](../audit/2026-04-26-eng-arch-baseline-audit.md#t-004-)
- **Plan:** Faz 4 başlangıcı (Temmuz).
- **Effort:** L (2 hafta).
- **Owner:** test-engineer.
- **Status:** Open

### TD-008 🟡 N — Kritik logic test eksik
- **Tarih:** 2026-04-26
- **Kategori:** Test
- **Audit ref:** [T-005](../audit/2026-04-26-eng-arch-baseline-audit.md#t-005-)
- **Mevcut:** `lib/missions/__test__.ts` (549 satır, karma formula) sağlam; `karma-level.ts`, `membership/actions.ts` (530 satır), `membership/fee-config.ts`, `auth/oauth-native.ts`, 10 admin action'lar, donations actions, middleware test'siz.
- **Plan:** TD-006 sonrası 2 hafta.
- **Effort:** L.
- **Owner:** frontend-engineer + supabase-backend.
- **Status:** Open

### TD-009 🟡 L — ESLint custom rule paketi yok
- **Tarih:** 2026-04-26
- **Kategori:** Standartlar / DX
- **Audit ref:** [T-002](../audit/2026-04-26-eng-arch-baseline-audit.md#t-002-)
- **Mevcut:** `eslint-config-next` 14.2.35 default — özel rule yok.
- **Plan:** P0 başlangıç (T-002 paralel) + P1 (Haziran, 1 hafta custom rules).
- **Effort:** M.
- **Owner:** frontend-engineer + system-architect (review).
- **Çözüm yolu:** Rule paketi:
  - `no-hardcoded-color`
  - `no-magic-tier-name`
  - `prefer-tier-import-from-tiers`
  - `require-revalidate-after-mutation`
  - `prefer-mission-state-enum`
- **Status:** Open — T-002 base config bu turda kuruldu; custom rules sprint Q2.

### TD-010 🟡 L — ADR-006 implementation drift (donate route'lar canlı)
- **Tarih:** 2026-04-26
- **Kategori:** ADR drift / Product
- **Audit ref:** [TD-015](../audit/2026-04-26-eng-arch-baseline-audit.md#td-015-)
- **Kanıt:** `app/dashboard/donate/*` (3 route + 604 satır donate-hub-client) + migration 040 (donations + tax_receipts schema). ADR-006 niyet "V1'de bağış canlı değil".
- **Risk:** ADR ↔ implementation gap; QA belirsiz; legal compliance soru işaretleri.
- **Plan:** P1 (Mayıs içinde).
- **Effort:** S (ADR revize) ya da L (V2 implementation).
- **Owner:** product-analyst (ADR-006 v2 revize) veya frontend-engineer (banner + guard).
- **Çözüm yolu:** ADR-006 Q44 — "donate route'lar V1.1'de aktif mi?" — answered ise banner; aktif ise ADR revize.
- **Status:** Open — Proposed ADR-006 v2 kuyruğa girdi.

### TD-011 🟡 L — Bundle analyzer yok, heavy library spreading riski
- **Tarih:** 2026-04-26
- **Kategori:** Performance
- **Audit ref:** [P-002](../audit/2026-04-26-eng-arch-baseline-audit.md#p-002-)
- **Kanıt:** `three.js 0.184` (~500KB), `gsap 3.15` (~150KB), `lottie-react 2.4` (~80KB), `framer-motion 12.38` (~80KB), `html5-qrcode 2.3.8` (~200KB). Sızma audit edilmemiş.
- **Plan:** P1 (Mayıs içinde 1 gün audit).
- **Effort:** S.
- **Owner:** frontend-engineer.
- **Çözüm yolu:** `@next/bundle-analyzer` kur + audit + dynamic import.
- **Status:** Open

### TD-012 ✅ Resolved — RLS coverage doğrulanmamış (kapatıldı)
- **Tarih:** 2026-04-26 açıldı, **2026-04-26 v2 kapatıldı**.
- **Kategori:** Security
- **Çözüm:** Per-table audit script çalıştırıldı; **22 yaratılan tablonun hepsinde `enable row level security` var**. v1 audit'in "10/43 migration" tahmini yüzeyseldi (migration grep'te yakalanan; gerçek per-table coverage %100).
- **Status:** ✅ Resolved (v2 audit S-001).

### TD-013 🔴 L — Ödeme webhook + initiator production stub
- **Tarih:** 2026-04-26
- **Kategori:** Security / Payment
- **Audit ref:** [S-005](../audit/2026-04-26-eng-arch-baseline-audit.md#s-005-)
- **Kanıt:**
  - `app/api/payments/webhook/[processor]/route.ts:135-152` — `verifySignature` her processor için "TODO(prod)" → her zaman 401.
  - `lib/membership/actions.ts:472` — `throw new Error('iyzico marketplace production entegrasyonu eksik')`.
  - `lib/membership/actions.ts:489` — `throw new Error('PayTR production entegrasyonu eksik')`.
- **Risk:** Production'da ödeme akışı çalışmaz. Webhook 401, marketplace mode exception, PayTR exception. Sadece fonzip embed + sandbox çalışıyor.
- **Plan:** P0 (V1.5 lansman blocker, Mayıs sonu - Haziran).
- **Effort:** L (3-4 hafta — iyzico SDK + PayTR + fonzip + env + test).
- **Owner:** supabase-backend + frontend-engineer.
- **Çözüm yolu:**
  1. iyzico SDK entegrasyonu (`iyzipay` paketi) → `lib/membership/payment-adapters/iyzico.ts` Checkout Form initialize + HMAC-SHA1 webhook verify.
  2. PayTR adapter → token endpoint + `merchant_oid` HMAC-SHA256 verify.
  3. fonzip — embed URL pattern + custom webhook.
  4. Env vars: `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_WEBHOOK_SECRET`, `PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT`, `FONZIP_API_KEY`. Supabase Vault.
  5. Test — sandbox + production smoke.
- **Pattern memo:** `docs/test/_patterns/2026-04-26-payment-stubs.md`
- **Status:** Open — ADR-008 v3 revize Proposed (fonzip-V1, iyzico-V1.5, PayTR-V2 priority).

### TD-014 🟡 L — Migration begin/commit + idempotency eksik
- **Tarih:** 2026-04-26
- **Kategori:** Migration / DX
- **Audit ref:** v2 TD-014.
- **Kanıt:**
  - `Total migrations: 43`
  - `With begin/commit: 35` (8 missing)
  - `With if-not-exists / on-conflict: 22` (21 missing)
- **Risk:** Re-apply'da partial fail veya `relation already exists` hata.
- **Plan:** P1 (1 gün audit + template).
- **Effort:** S.
- **Owner:** supabase-backend.
- **Çözüm yolu:**
  1. Audit (yarım gün): hangi 8 migration begin/commit'siz, hangi 21 idempotent değil.
  2. Eski migration'lara dokunma (apply edildi); ama gelecek için template yaz.
  3. ADR-016 Proposed: Migration template zorunluluğu.
  4. `docs/eng/templates/migration-template.sql` referans.
- **Status:** Open — ADR-016 Proposed kuyruğa girdi.

### TD-015 🟡 L — `lib/membership/actions.ts` 530 satır + stub'lar iç içe
- **Tarih:** 2026-04-26
- **Kategori:** Modularity
- **Audit ref:** [M-003](../audit/2026-04-26-eng-arch-baseline-audit.md#m-003-)
- **Plan:** TD-013 ile birleşik (1-2 hafta).
- **Effort:** M-L.
- **Owner:** supabase-backend.
- **Çözüm yolu:** Adapter pattern — `lib/membership/payment-adapters/{iyzico,paytr,fonzip,sandbox}.ts` + orchestration ana dosyada kalır.
- **Status:** Open

### TD-016 🟡 N — `<img>` vs `<Image>` (next/image) audit
- **Tarih:** 2026-04-26
- **Kategori:** Performance
- **Audit ref:** [P-004](../audit/2026-04-26-eng-arch-baseline-audit.md#p-004-)
- **Mevcut:** Belirsiz; spot audit gerek.
- **Plan:** P2 (sprint kapasitesinde 1 oturum).
- **Effort:** S.
- **Owner:** frontend-engineer.
- **Status:** Open

### TD-017 🟡 L — 9 TODO/FIXME/HACK marker (5'i payment, 1'i sertifika PDF, 1'i refund)
- **Tarih:** 2026-04-26
- **Kategori:** Tech debt
- **Audit ref:** [TD-017](../audit/2026-04-26-eng-arch-baseline-audit.md#td-017-)
- **Kanıt:**
  - `app/api/payments/webhook/[processor]/route.ts` — 4 TODO (payment, S-005 ana)
  - `lib/membership/actions.ts` — 3 TODO (payment, S-005 ana)
  - `app/dashboard/ngos/[id]/membership/success/celebration-client.tsx:215` — sertifika PDF üretim TODO
  - `app/api/payments/webhook/[processor]/route.ts:102` — refund logic TODO
- **Plan:** TD-013 ile birleşik (5'i payment) + 1 hafta sertifika PDF + 1 hafta refund.
- **Effort:** L (TD-013 kapsamında).
- **Owner:** frontend-engineer (sertifika PDF) + supabase-backend (refund + payment).
- **Status:** Open

### TD-018 🟡 N — Sponsor module type sweep (13 `any`)
- **Tarih:** 2026-04-26
- **Kategori:** Type safety
- **Audit ref:** [TD-020](../audit/2026-04-26-eng-arch-baseline-audit.md#td-020-)
- **Kanıt:** sponsor module 13 `any`: sponsor-actions.ts 6, sponsor-request-actions.ts 5, sponsor-auth.ts 2.
- **Plan:** P1 sprint (Haziran).
- **Effort:** M (1 hafta).
- **Owner:** frontend-engineer.
- **Status:** Open

### TD-019 🔴 L — Server action defense-in-depth eksik (35/43 action `getUser()` çağırmıyor)
- **Tarih:** 2026-04-26
- **Kategori:** Security
- **Audit ref:** [S-002](../audit/2026-04-26-eng-arch-baseline-audit.md#s-002-)
- **Kanıt:** Audit script 8/43 auth-guard'lı, 35 admin/sponsor/onboarding action gap. Detay:
  - `lib/admin/{membership-config,missions,blog,verifications,ngo-profile,members,payment-config,ngo-signup-review,sponsor,campaign}-actions.ts`
  - `lib/sponsors/signup-actions.ts`, `lib/onboarding/ngo-signup-actions.ts`
  - `lib/dev/ngo-admin-fixtures.ts`
  - 14 admin page-level server action
- **Risk:** Middleware bypass + parameter manipulation = full tenant isolation bypass.
- **Plan:** P0 sprint (Mayıs, 1 hafta).
- **Effort:** M.
- **Owner:** auth-capacitor + system-architect (review).
- **Çözüm yolu:**
  1. `lib/auth/guards.ts` — `requireUser`, `requireNgoAdmin(ngoId)`, `requireSuperAdmin` helper'ları.
  2. 35 server action başına `await requireNgoAdmin(ngoId)` ekle.
  3. Lint rule (TD-009): `'use server'` direktifli dosyada export edilen async function'ın ilk 5 satırında auth helper çağrısı zorunlu.
  4. RLS policy detail audit (S-007 paralel).
- **Pattern memo:** `docs/test/_patterns/2026-04-26-server-action-discipline.md`
- **Status:** Open — ADR-015 Proposed kuyruğa girdi.

### TD-020 🟡 L — Zod / input validation kullanımı 0
- **Tarih:** 2026-04-26
- **Kategori:** Security
- **Audit ref:** [S-006](../audit/2026-04-26-eng-arch-baseline-audit.md#s-006-)
- **Kanıt:** 43 server action, 0'ı zod kullanıyor.
- **Risk:** Type-coercion / SQL injection riski tek koruma RLS.
- **Plan:** P1 sprint (Haziran, 1-2 hafta).
- **Effort:** M.
- **Owner:** frontend-engineer + supabase-backend.
- **Çözüm yolu:** `npm i zod` + schema'lar + `safeParse` bağlama. ADR-015 Proposed (server action template) kapsamında.
- **Status:** Open

### TD-021 🟡 L — KVKK donate akışı belirsiz
- **Tarih:** 2026-04-26
- **Kategori:** Security / Legal
- **Audit ref:** [S-004](../audit/2026-04-26-eng-arch-baseline-audit.md#s-004-)
- **Kanıt:** `donate-hub-client.tsx` (604 satır) + `flow-step-payment.tsx` (537 satır) — KVKK keyword grep'te yakalanmadı.
- **Risk:** ADR-009 ihlali olası; legal compliance açığı.
- **Plan:** P0 (Mayıs, 1-2 gün).
- **Effort:** S-M.
- **Owner:** frontend-engineer + product-analyst (legal review).
- **Çözüm yolu:** UI'da `<KvkkDoubleConsent />` ortak component ekle; `lib/donations/actions.ts` server tarafında `kvkkConsent + termsConsent` hard gate ekle.
- **Status:** Open

### TD-022 🟢 L — `motion` paketi dead dependency (kolay kazanım)
- **Tarih:** 2026-04-26
- **Kategori:** Performance / DX
- **Audit ref:** [P-001](../audit/2026-04-26-eng-arch-baseline-audit.md#p-001-)
- **Kanıt:** `package.json` deps'te `"motion": "^12.38.0"` var, ama `grep -rln "from 'motion'" → 0`. `framer-motion` 46 dosyada kullanılıyor.
- **Plan:** **2026-04-26 v2 — paket package.json'dan silindi (bu ledger ile birlikte).** User `npm install` çalıştırınca lock dosyası temizlenecek.
- **Effort:** XS (1 dakika).
- **Owner:** ✅ system-architect (bu turda).
- **Status:** **Pending user `npm install`** (package.json güncel, lock file regenerate gerek).

### TD-023 🟡 L — Composite index 0 (sadece single-column 25)
- **Tarih:** 2026-04-26
- **Kategori:** Performance / DB
- **Audit ref:** [P-003](../audit/2026-04-26-eng-arch-baseline-audit.md#p-003-)
- **Kanıt:** `grep "create.*index.*\(.*,.*\)" → 0`. Sık `(user_id, status='completed')` veya `(ngo_id, created_at desc)` kombinasyonları index'siz.
- **Plan:** P1 (Haziran, 1-2 gün).
- **Effort:** S-M.
- **Owner:** supabase-backend.
- **Çözüm yolu:**
  1. Sorgu pattern matrisi (yarım gün) `lib/supabase/queries/`.
  2. 5-10 composite index migration.
  3. EXPLAIN ANALYZE validate.
- **Status:** Open

### TD-024 🟡 L — Mission state literal hardcoded 30+ noktada
- **Tarih:** 2026-04-26
- **Kategori:** SSoT / Standartlar
- **Audit ref:** [D-007 / SS-004](../audit/2026-04-26-eng-arch-baseline-audit.md#d-007-)
- **Kanıt:** `'taken'`, `'completed'`, `'cancelled'`, `'expired'`, `'applied'` literal'ları 30+ noktada (admin/missions/dashboard).
- **Plan:** P1 (1 gün).
- **Effort:** S.
- **Owner:** frontend-engineer.
- **Çözüm yolu:**
  1. `lib/missions/state.ts` (var, 8580 byte) `MISSION_STATE` enum export.
  2. 30+ literal callsite import'a çek.
  3. Lint rule (TD-009): `prefer-mission-state-enum`.
- **Pattern memo:** `docs/test/_patterns/2026-04-26-ssot-drift.md` (kombine)
- **Status:** Open

### TD-025 🟡 L — Loading + error state coverage zayıf
- **Tarih:** 2026-04-26
- **Kategori:** UX / Resilience
- **Audit ref:** [D-003](../audit/2026-04-26-eng-arch-baseline-audit.md#d-003-)
- **Kanıt:**
  - `loading.tsx`: 13/80 (%16)
  - `error.tsx`: 3/80 (%3.7)
  - `not-found.tsx`: 1
- **Risk:** Yavaş bağlantıda 67 sayfa boş ekran; failure'da default Next overlay.
- **Plan:** P1 sprint (Haziran, 1-2 hafta).
- **Effort:** M.
- **Owner:** frontend-engineer.
- **Çözüm yolu:** Top 20 dashboard route için (atlas Bölüm 3) loading + error + not-found ekle. Generic component'ler (`components/ui/state/` 579 satır) kullanım kapsamı genişlet.
- **Status:** Open

### TD-026 🟡 L — revalidatePath kapsamı 12/43 server action
- **Tarih:** 2026-04-26
- **Kategori:** Data flow
- **Audit ref:** [D-002](../audit/2026-04-26-eng-arch-baseline-audit.md#d-002-)
- **Kanıt:** 31 server action mutation yapıyor ama UI cache invalidate etmiyor. Specifically:
  - `lib/donations/actions.ts`, `lib/admin/members-actions.ts`, `lib/sponsors/signup-actions.ts`
  - `lib/onboarding/ngo-signup-actions.ts`, `lib/membership/actions.ts`, `lib/dev/*`
  - 26 admin page action
- **Plan:** P0 (Mayıs, 1-2 gün).
- **Effort:** S.
- **Owner:** frontend-engineer.
- **Çözüm yolu:**
  1. Matriks (yarım gün): her server action'ın hangi route'u invalidate etmesi gerek.
  2. Bulk fix (1 gün).
  3. Lint rule (TD-009): `require-revalidate-after-mutation`.
- **Status:** Open

### TD-027 🟡 N — `'use client'` overuse 147 dosya
- **Tarih:** 2026-04-26
- **Kategori:** Performance / RSC
- **Audit ref:** [D-001](../audit/2026-04-26-eng-arch-baseline-audit.md#d-001-)
- **Plan:** P2 (rolling — sprint kapasitesinde dosya başı 2-4 saat).
- **Effort:** M.
- **Owner:** frontend-engineer.
- **Çözüm yolu:** Top 7 client component (TD-004 listesi) — data fetching server'a, UI client'a ayır. Skill `react-server-component-patterns`.
- **Status:** Open

### TD-028 🟡 L — `karma` vs `karma_total` dual kolon (SS-005)
- **Tarih:** 2026-04-26
- **Kategori:** SSoT / Schema
- **Audit ref:** [SS-005](../audit/2026-04-26-eng-arch-baseline-audit.md#ss-005-)
- **Kanıt:** Migration 024 `alter table profiles add column if not exists karma integer`. Plus 001 original `profiles.karma_total`. **Dual kolon mu?**
- **Risk:** Hangi kolon canonical? Trigger hangini günceller?
- **Plan:** P1 (yarım gün audit).
- **Effort:** S.
- **Owner:** supabase-backend.
- **Çözüm yolu:** Migration 024 oku + canonical karar + drop unused column migration.
- **Status:** Open

### TD-029 🟡 L — `active` vs `status` manuel sync (SS-006)
- **Tarih:** 2026-04-26
- **Kategori:** SSoT / Schema
- **Audit ref:** [SS-006](../audit/2026-04-26-eng-arch-baseline-audit.md#ss-006-)
- **Kanıt:** `lib/admin/missions-actions.ts:17-24` — `missions.active` boolean ile `missions.status` enum **manuel sync** ediliyor. Race condition / drift adayı.
- **Plan:** P1 (1 gün).
- **Effort:** S.
- **Owner:** supabase-backend.
- **Çözüm yolu:** DB trigger ile otomatize (status change → active sync).
- **Status:** Open

### TD-030 🟡 L — `lib/dev/ngo-admin-fixtures.ts` env guard kontrolü
- **Tarih:** 2026-04-26
- **Kategori:** Security
- **Audit ref:** [S-010](../audit/2026-04-26-eng-arch-baseline-audit.md#s-010-)
- **Kanıt:** Server action gap listesinde, auth guard yok. Dev-only ise env guard şart.
- **Plan:** P0 (1 saat).
- **Effort:** XS.
- **Owner:** auth-capacitor.
- **Çözüm yolu:** Dosyayı oku + `process.env.NODE_ENV !== 'production'` guard veya tüm fonksiyonları rename `__dev_only__*`.
- **Status:** Open

### TD-031 🟡 L — Capacitor static export server action audit
- **Tarih:** 2026-04-26
- **Kategori:** Mobile
- **Audit ref:** [P-006](../audit/2026-04-26-eng-arch-baseline-audit.md#p-006-)
- **Kanıt:** `capacitor.config.ts: webDir: 'out'` — mobile build static. Server action'lar mobile'da nasıl çalışıyor?
- **Plan:** P1 (Haziran, 1 hafta — mobile blocker).
- **Effort:** M.
- **Owner:** auth-capacitor + frontend-engineer.
- **Çözüm yolu:**
  1. Capacitor build'de server action davranışını test et.
  2. API route handler'a fallback (`app/api/membership/initiate/route.ts`) — fetch ile çağrılabilir.
  3. Dökümantasyon: hangi action mobile-compatible.
- **Status:** Open

### TD-032 🟡 L — RLS policy detail audit (INSERT/UPDATE özelinde)
- **Tarih:** 2026-04-26
- **Kategori:** Security
- **Audit ref:** [S-007](../audit/2026-04-26-eng-arch-baseline-audit.md#s-007-)
- **Mevcut:** RLS açık ✅ ama her tablonun her CRUD policy detay-doğrulanmamış. Özellikle `donations`, `donation_subscriptions`, `tax_receipts`, `campaigns`, `sponsor_*` (yeni eklendi).
- **Plan:** P0 (Mayıs, yarım gün).
- **Effort:** S.
- **Owner:** supabase-backend.
- **Status:** Open

---

## Resolved (kapatılmış borç) — 1 entry

### TD-012 ✅ — RLS coverage doğrulanmamış (kapatıldı 2026-04-26 v2)
- **Açılış:** 2026-04-26 v1 audit
- **Kapanış:** 2026-04-26 v2 audit (per-table audit script)
- **Sonuç:** 22 yaratılan tablonun hepsinde `enable row level security` ifadesi mevcut. RLS coverage gerçek %100.
- **Notu:** v1 audit'in "10/43 migration" tahmini yüzeyseldi (migration grep yakalamadı; ALTER TABLE migration'ları RLS açma satırı içermez ama tablonun yaratıldığı migration'da açar). v2 per-table audit doğru sonucu verdi.

---

## İstatistik (2026-04-26 v2)

- **Toplam open:** 30 (1 ✅ kapalı)
- **🔴 Blocker:** 6 (TD-001, TD-002, TD-006, TD-013, TD-019, +TD-022 tamam'a yakın)
- **🟡 Major:** 23
- **🟢 Minor:** 1 (TD-022 motion)
- **L (Leverage, önce yap):** 19
- **N (Neutral, backlog):** 10
- **O (Overhead, quarterly):** 1 (TD-003 `any` reduction)

**Plan:**
- **30 günde kapanması beklenen:** 9 (P0 sprint — TD-001, TD-002, TD-006, TD-009 base, TD-013 V1 fonzip-only, TD-019, TD-022 ✅, TD-026, TD-030)
- **60 günde:** 8 (P1 — TD-004, TD-005, TD-008, TD-014, TD-018, TD-020, TD-021, TD-023, TD-024, TD-025, TD-029)
- **90 gün+:** 6 (TD-007, TD-011, TD-016, TD-027, TD-028, TD-031, TD-032)

---

## Pattern memos (3+ entry aynı kök neden)

### `docs/test/_patterns/2026-04-26-ssot-drift.md` — SSoT erozyonu
- TD-001 (TIERS), TD-002 (color), TD-009 (lint rules), TD-024 (mission state), TD-028 (karma), TD-029 (active/status)
- **Kök neden:** Lint/CI enforcement yok; engineer'lar lokal kopya yapma alışkanlığında.
- **Sistemik fix:** ADR-014 (TIERS) + ADR-016 (migration template) + lint rule paketi (TD-009).

### `docs/test/_patterns/2026-04-26-server-action-discipline.md` — Server action discipline
- TD-019 (auth guard), TD-020 (zod), TD-026 (revalidate)
- **Kök neden:** Server action template yok; ad-hoc yazılıyor.
- **Sistemik fix:** ADR-015 — `lib/auth/guards.ts` + `createServerAction` template + 3 lint rule.

### `docs/test/_patterns/2026-04-26-payment-stubs.md` — Production stubs
- TD-013 (webhook + initiator), TD-015 (membership actions modülerlik), TD-017 (9 TODO)
- **Kök neden:** "V1 mock, V2 production" stratejisi takvim sorunu.
- **Sistemik fix:** ADR-008 v3 revize (fonzip-V1, iyzico-V1.5, PayTR-V2) + adapter pattern.

### `docs/test/_patterns/2026-04-26-client-monolith.md` — Modülerlik gevşemesi
- TD-004 (7 dosya 600+), TD-005 (`types.ts` 1053), TD-015 (membership 530), TD-027 (use client overuse)
- **Kök neden:** UX brief'te component breakdown alanı yok.
- **Sistemik fix:** Brief template + 400 satır PR rule + Storybook (Faz 4).

### `docs/test/_patterns/2026-04-26-no-ci-discipline.md` — Test/CI/Lint sıfır
- TD-006 (Vitest), TD-007 (Playwright), TD-008 (kritik logic test), TD-009 (lint custom), T-002 (config kuruldu) ✅, T-003 (CI workflow)
- **Kök neden:** Faz 4 askıda.
- **Sistemik fix:** Faz 4 master plan + pre-commit hook + CI blocking.

---

## ADR Proposed kuyruğu (system-architect tarafından açıldı)

### ADR-014 — TIERS canonical (Proposed 2026-04-26)
- **Konu:** TIERS tek source of truth.
- **Çözüm önerisi:** 5 tier, Set A names ("İyi Biri / Çok İyi Biri / Çoook İyi Biri / Gerçekten İyi Biri / İyiliğin Öncüsü"), threshold 500/2000/5000/10000 (`tier-badge.tsx` ile uyumlu).
- **Bağlı:** TD-001.
- **Dosya:** [`docs/product/03-decisions/014-tiers-canonical.md`](../product/03-decisions/014-tiers-canonical.md)

### ADR-015 — Server action template + auth guards (Proposed 2026-04-26)
- **Konu:** `lib/auth/guards.ts` + `createServerAction` template zorunluluğu.
- **Bağlı:** TD-019, TD-020, TD-026.
- **Dosya:** [`docs/product/03-decisions/015-server-action-template.md`](../product/03-decisions/015-server-action-template.md)

### ADR-016 — Migration template (Proposed 2026-04-26)
- **Konu:** Yeni migration `begin/commit` + `if not exists` zorunluluğu.
- **Bağlı:** TD-014.
- **Dosya:** _(sonraki tur)_

### ADR-006 v2 revize — V1 bağış akışı statüsü (Proposed)
- **Konu:** Donate route'lar V1.1'de aktif mi pasif mi.
- **Bağlı:** TD-010.
- **Owner:** product-analyst.

### ADR-008 v3 revize — Payment routing implementation roadmap (Proposed)
- **Konu:** fonzip-V1, iyzico-V1.5, PayTR-V2 priority.
- **Bağlı:** TD-013.
- **Owner:** product-analyst + system-architect.

---

## Yöntem (engineer'lar için)

Her engineer kısa-vadeli kısayol oluşturduğunda (örn. "şimdilik `any` koyayım", "şimdilik token bypass") **kendi journal entry'sinin altına** notify yazar; system-architect haftalık review'da ledger'a entry açar.

Format (engineer journal'da):
```
**Tech Debt notify:** [kısa açıklama] — system-architect ledger'a alsın. Severity tahminim: 🟡.
```

Pazartesi review'unda system-architect:
1. Yeni entry'leri ledger'a açar.
2. Resolved entry'leri kapatır (commit ref).
3. 30/60/90 sırasını günceller.
4. 3+ aynı kök neden → pattern memo.
5. Status board "Done this week"e Tech Debt özetiyle satır ekler.
