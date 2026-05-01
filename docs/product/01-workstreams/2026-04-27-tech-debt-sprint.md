# Workstream — Tech Debt Mayıs Sprint (2026-04-27 başlangıç)

**Açılış:** 2026-04-26 (system-architect)
**Sahip (Owner):** system-architect (orchestration) + multi-agent paralel
**Bağlı:** v2 audit ([`docs/audit/2026-04-26-eng-arch-baseline-audit.md`](../../audit/2026-04-26-eng-arch-baseline-audit.md)), Tech Debt Ledger v2 ([`docs/eng/_tech-debt.md`](../../eng/_tech-debt.md)), ADR-014/015/016 Accepted (2026-04-26)
**Hedef:** Mayıs lansman blocker'ları kapanmış, V1 production-ready (fonzip-only payment) durumu.

## Amaç

V1 lansman öncesi 5 🔴 tech debt blocker'ını sıralı/paralel kapatma. Audit v2 + Ledger v2 sonrası ürün-mimari sağlığını "amber-üst" → "yeşil" eşiğine taşıma.

## Hedef metrikler (sprint sonu)

| Metrik | Sprint başı | Hedef | Track |
|---|---|---|---|
| 🔴 Tech debt entry | 6 | ≤2 | TD-013 V1.5'e push (V1 fonzip-only güvenli) |
| TIERS dosya tutarlılığı | 8 farklı yerde | 1 canonical + lint enforce | TD-001 |
| Hardcoded color satır | 45 | ≤10 | TD-002 |
| Server action auth guard kapsamı | 8/43 | 43/43 (%100) | TD-019 |
| revalidatePath kapsamı | 12/43 | 30+/43 | TD-026 |
| ESLint custom rule | 0 | 5 active | TD-009 |
| Vitest framework | yok | kuruldu + 5 test | TD-006 |
| RLS policy detay audit | 0 tablo | 8+ tablo (yeni eklenenler) | TD-032 |
| TSC error | 0 ✅ | 0 (korunmalı) | — |

## Sprint zinciri (kritik path)

### Hafta 1 (2026-04-27 → 05-03)

**Paralel Yol A — TIERS canonical (TD-001):**
1. ✅ `lib/tiers.ts` canonical yarat (system-architect, 2026-04-26 done).
2. 🔄 5 callsite migration (frontend-engineer, ~1 gün):
   - ✅ `lib/karma-level.ts` (system-architect)
   - ✅ `lib/supabase/queries/profiles.ts` (system-architect)
   - ✅ `components/ui/tier-badge.tsx` (system-architect)
   - ✅ `components/ui/ds/hero-card.tsx` (system-architect)
   - ⏳ `lib/mock-data.ts` (TIERS array kaldır + `getTierName` re-export — frontend-engineer)
   - ⏳ `components/tier/tier-data.ts` (5 tier name field → TIERS lookup — frontend-engineer)
   - ⏳ `components/ui/brand-logo.tsx` (yorumları Set A ile güncelle — frontend-engineer)
   - ⏳ `app/dashboard/profile/profile-client.tsx` (33-37 local sil → TIERS import)
   - ⏳ `app/page.tsx` (388-389,552 → TIERS[0].name + TIERS[1].name)
   - ⏳ `app/onboarding/(user-flow)/welcome/page.tsx:203` → `TIERS[1].name`
3. ⏳ TSC + UI smoke test 3 sayfa (test-engineer, yarım gün).
4. ⏳ Cross-screen tier display regression test (test-engineer pattern memo handoff).

**Paralel Yol B — Server action defense-in-depth (TD-019/026):**
1. ✅ `lib/auth/guards.ts` yarat (system-architect, 2026-04-26 done).
2. 🔄 `is_sponsor_admin` RPC kontrol — yoksa migration ekle (supabase-backend, yarım gün).
3. ⏳ 35 server action başına `requireNgoAdmin/requireUser/requireSponsorAdmin` ekle (auth-capacitor + frontend-engineer + supabase-backend, ~3 gün paralel):
   - ✅ `lib/admin/missions-actions.ts` 4 export (system-architect örnek)
   - ⏳ `lib/admin/{blog,verifications,members,ngo-profile,membership-config,payment-config,ngo-signup-review,sponsor,campaign}-actions.ts`
   - ⏳ `lib/sponsors/signup-actions.ts`
   - ⏳ `lib/onboarding/ngo-signup-actions.ts`
   - ⏳ `lib/dev/ngo-admin-fixtures.ts` — env guard (TD-030 paralel)
   - ⏳ 14 admin page-level server action
4. ⏳ revalidatePath bulk fix matrisi (frontend-engineer, ~2 gün).
5. ⏳ Test (test-engineer, half-day RLS + cross-tenant insert).

**Paralel Yol C — Hardcoded color sweep (TD-002):**
1. ⏳ Atlas Bölüm 6 token genişletme (`c.scrim`, `c.success`, `c.warning`, `c.danger`, `c.tier{Bronze,Silver,Gold,Platinum,Diamond}`) — design-system-keeper, 1 gün.
2. ⏳ 4 pattern sweep (~1 hafta paralel):
   - Pattern A — `bg-black/50` modal (8 dosya) → `c.scrim`.
   - Pattern B — Admin tarafı dark migration (devtools/login/missions).
   - Pattern C — Inline SVG `#FFFFFF` → CSS variable.
   - Pattern D — Tailwind palette → atlas token.
3. ⏳ ESLint `no-hardcoded-color` rule (frontend-engineer + system-architect, 2 gün).

**Paralel Yol D — Vitest + CI baseline (TD-006/T-003):**
1. ⏳ Vitest setup (`vitest.config.ts` + `package.json` script) — frontend-engineer, 1 gün.
2. ⏳ İlk 5 test (`lib/tiers.test.ts`, `lib/karma-level.test.ts`, `lib/missions/karma-formula.test.ts` migrate, `lib/auth/guards.test.ts`, `lib/missions/state.test.ts`) — frontend-engineer, 2 gün.
3. ⏳ GitHub Actions CI workflow — frontend-engineer, 1 gün.

### Hafta 2 (2026-05-04 → 05-10)

**Yol A devam — TIERS sprint kapanış:**
- ESLint `no-magic-tier-name` + `prefer-tier-import-from-tiers` rule (frontend-engineer, 1 gün).
- Pattern memo SSoT drift fix-confirm satırı (system-architect).

**Yol B devam — Server action sprint kapanış:**
- `lib/donations/actions.ts` revalidatePath ekleme (TD-021 KVKK kontrolü paralel).
- `lib/dev/ngo-admin-fixtures.ts` env guard (TD-030).
- ESLint `auth-guard-required` + `revalidate-after-mutation` rule.

**Yeni Yol E — Quick wins:**
- ✅ TD-022 `motion` dead dep silindi (package.json güncel) — user `npm install` çalıştırır.
- ✅ T-002 ESLint config kuruldu.
- ⏳ `is_sponsor_admin` RPC migration (supabase-backend, yarım gün).
- ⏳ TD-029 `active`/`status` trigger migration (supabase-backend, 1 gün).
- ⏳ TD-028 `karma`/`karma_total` audit (supabase-backend, yarım gün).
- ⏳ TD-031 `lib/dev/ngo-admin-fixtures.ts` env guard.
- ⏳ TD-024 mission state literal → `MISSION_STATE` enum migration (frontend-engineer, 1 gün).

### Hafta 3 (2026-05-11 → 05-17)

**Yol F — RLS detay audit + KVKK donate (TD-032/021):**
- Per-table RLS policy detay audit (yeni eklenen `donations`, `donation_subscriptions`, `tax_receipts`, `campaigns`, `sponsor_*`).
- Donate akışında KVKK çifte onay UI (`lib/donations/actions.ts` + flow component).

**Yol G — Migration 044 composite indexes (TD-023):**
- ✅ Migration dosyası hazır (system-architect).
- ⏳ User test instance'da apply (kullanıcı).
- ⏳ EXPLAIN ANALYZE validate (supabase-backend, yarım gün).

**Yol H — Lighthouse + bundle analyzer (P-002/P-003):**
- ⏳ Bundle analyzer kur + audit (frontend-engineer, yarım gün).
- ⏳ Lighthouse top 10 sayfa × dark/light (test-engineer, half-day).

### Hafta 4 (2026-05-18 → 05-24) — sprint kapanış + V1 launch hazırlık

- Tech debt ledger update — kapanan entry'ler.
- v3 audit (system-architect, half-day delta).
- V1 lansman go/no-go karar.
- ADR-006 v2 + ADR-008 v3 product-analyst kararı (V1.5'e push veya banner).

## Owner matrisi

| Yol | Owner (primary) | Support | Effort (sprint içi) |
|---|---|---|---|
| A — TIERS canonical | frontend-engineer | design-system-keeper, test-engineer | 2 gün |
| B — Server action defense | auth-capacitor (helper) + frontend-engineer + supabase-backend | system-architect (review) | ~5 gün paralel |
| C — Color sweep | design-system-keeper + frontend-engineer | system-architect | ~1 hafta |
| D — Vitest + CI | frontend-engineer + test-engineer | system-architect | 4 gün |
| E — Quick wins | mixed | — | ~3 gün toplam |
| F — RLS detail + KVKK donate | supabase-backend + frontend-engineer | product-analyst | 2 gün |
| G — Migration 044 | supabase-backend | system-architect | 1 gün |
| H — Bundle + Lighthouse | frontend-engineer + test-engineer | — | 1 gün |

**Toplam paralel sprint:** 4 hafta (Mayıs ayı). Critical path: A → D (TIERS + Vitest base + lint rule paketi).

## Stop condition'lar

- 🔴 Yeni audit bulgu (system-architect haftalık review).
- 🔴 TSC error ortaya çıkarsa (CI yakalar).
- 🔴 RLS leak / cross-tenant insert test'te (test-engineer).
- 🔴 Hukuki mütalaa beklenen Q (Q10/Q11/Q13) cevabı kritik karar getirirse.

## Bağlı kararlar

- ADR-014 Accepted ✅ — TIERS canonical.
- ADR-015 Accepted ✅ — Server action template + auth guards.
- ADR-016 Accepted ✅ — Migration template.
- ADR-006 v2 revize Proposed ⏸ — V1 bağış akışı statüsü (product-analyst karar).
- ADR-008 v3 revize Proposed ⏸ — Payment routing roadmap (product-analyst + system-architect ortak).

## Çıktı dosyaları (sprint kapanışında)

- ✅ `lib/tiers.ts` canonical
- ✅ `lib/auth/guards.ts` helper
- ✅ `supabase/migrations/044_composite_indexes.sql`
- ✅ `docs/eng/templates/migration-template.sql`
- ✅ ADR-014/015/016 Accepted
- ⏳ ESLint custom rule paketi (`@iyibiri/eslint-plugin` 5 rule)
- ⏳ Vitest framework + 5 sample test
- ⏳ GitHub Actions CI workflow
- ⏳ 35 server action auth guard updated
- ⏳ revalidatePath kapsamı 30+/43
- ⏳ Hardcoded color ≤10 satır
- ⏳ Per-table RLS audit raporu

## Handoff log

- 2026-04-26 20:30 — **system-architect** ✅ — Workstream açıldı. Yol A başlangıç (5/10 callsite migrate ✅). Yol B `lib/auth/guards.ts` ✅ + `lib/admin/missions-actions.ts` örnek ✅. Yol G migration 044 dosyası ✅.
- ⏸ Next — frontend-engineer Yol A devam (5 callsite kalan), auth-capacitor Yol B (35 action bulk update), design-system-keeper Yol C (color sweep + token genişletme).
