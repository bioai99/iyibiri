# İyiBiri — Status Board

> **Anlık durum snapshot'ı.** "Şu an kim neyi bekliyor, hangi iş nerede" sorusunun 30 saniyelik cevabı. Her agent run sonunda kendi satır(lar)ını günceller. Geçmiş timeline için: [`docs/agents-dashboard.md`](./agents-dashboard.md).
>
> **Protokol:** `.claude/skills/agent-communication-protocol/SKILL.md` Katman B.

**Son güncelleme:** 2026-04-26 22:30 — system-architect — **Mayıs sprint Yol A/D/E + 5 server action auth guard**. TSC 0 hata ✅, ESLint 0 error ✅. Yol A tamam (10/10 TIERS callsite migrate). Yol D Vitest framework + 3 test + GitHub Actions CI workflow. Yol E migration 045 active/status trigger. 6 admin server action requireNgoAdmin/requireUser ile güvende. Canlıya alma noktaları: npm install + supabase db push + git push (CI tetiklensin).

---

## ⏳ Waiting for user

İnsan tarafında bekleyen iş. Agent ilerleyemez.

- **Migration 009–018 apply** — owner: kullanıcı (Supabase SQL editor), blocking: full-stack test (mission FSM + membership + karma idempotent + STK admin hazırlığı), link: [`docs/_deploy-steps.md`](./_deploy-steps.md), sinyal: 2026-04-24
- **Polish sprint push** — owner: kullanıcı (terminal), blocking: TestFlight demo + v1 pilot hazırlığı, link: [`docs/_deploy-steps.md`](./_deploy-steps.md), içerik: Yol A (5 madde) + communication protocol (bu sprint), sinyal: 2026-04-24
- **TEMA açılış e-postası gönder** — owner: kullanıcı (kişisel), blocking: pilot STK 1 temas, link: [`docs/strategy/04-value-prop/2026-04-24-tema-intro-email.md`](./strategy/04-value-prop/2026-04-24-tema-intro-email.md), sinyal: 2026-04-24
- **Hukuki mütalaa görüşmesi (Q10+Q11+Q13+Q37)** — owner: kullanıcı (avukat randevu), blocking: ADR-009 + Marketplace mode karar, link: [`docs/strategy/06-memos/2026-04-24-hukuki-mutalaa-brief.md`](./strategy/06-memos/2026-04-24-hukuki-mutalaa-brief.md), sinyal: 2026-04-24
- **Türk Patent "İyiBiri" trademark başvurusu (Q38)** — owner: kullanıcı, blocking: marka koruması 6 ay süreç, link: karar kuyruğu Q38, sinyal: 2026-04-24

## 🔄 In progress

Şu an aktif olarak çalışılan iş.

- **P0 #9 — STK admin UI V1 (Min+ 10 sayfa)** — owner: frontend-engineer, started: 2026-04-24 10:45, link: master plan [`docs/product/01-workstreams/2026-04-24-stk-backoffice-workstream.md`](./product/01-workstreams/2026-04-24-stk-backoffice-workstream.md), ETA: Batch B done, Batch C (2-3 gün).
  - ✅ [be] Migration 021 (2026-04-24 20:30) — 8 RLS policy + 5 kolon + is_super_admin + types update. Seed script ready.
  - ✅ [ux] UX brief (2026-04-24 10:45) — 15 sayfa detaylı.
  - ✅ [auth-capacitor] Middleware upgrade (2026-04-24 21:15) — per-NGO auth + Supabase login.
  - ✅ [ux-researcher] Heuristik audit (2026-04-24 23:45) — K1-K8 detaylı.
  - ✅ [ui-designer] UI spec (2026-04-24 HH:MM) — 10 sayfa wireframe, 20 component, token, motion, a11y.
  - ✅ [frontend-engineer] Batch A (2026-04-24 done) — auth layout + dashboard + missions + sidebar nav + devtools.
  - ✅ [frontend-engineer] Batch B (2026-04-24 done) — verifications (K2 confirm + K6 bulk) + members (KVKK + CSV) + reports (metrics + table) + 4 placeholder. TSC 0.
  - 🔄 [frontend-engineer] Batch C (2-3 gün) — blog editor + profile form + membership-config parametric form + password reset (Batch A'dan carryover).

- **Dashboard v2 tur 2 — FE implementation** — owner: frontend-engineer, started: 2026-04-24 10:45, link: `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md` (8 component + token refactor), ETA: 2026-04-25 — 2026-04-26 (3–4 hafta paralel fe × design-system-keeper)
  - ✅ [be] A1 StreakSnapshot query (2026-04-24 17:10) — `getRecentStreakActivity` + index done

## 📥 Backlog

Bir sonraki turda yapılacak, öncelik sırası belli iş.

### Faz 2 — V2 Ödül Sistemi (Ay 6–9, sprint 1–4)

- **F2.1–F2.7 — P0 V1.1 blocker (6 hafta)** — owner: ux-researcher (audit) → ui-designer → 2 FE + 1 BE + auth-capacitor, priority: P0, link: brief [`docs/product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md`](./product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md) Sprint 1–2, effort: 38–52 iş günü paralel. Gönüllü matching (F2.1, L 15–20 gün), email pipeline (F2.2, M 5–7 gün), push notification (F2.3, M 4–6 gün), makbuz PDF (F2.4, M 6–8 gün), storage polish (F2.5, S 2–3 gün), leaderboard Q25 (F2.6, M 4–5 gün), password reset (F2.7, S 2–3 gün). **Reciters: V1.1 lansman başladıktan 2 hafta sonra başlar (Ay 3–4 timeline).** UX researcher: audit + heuristik başlasın Q25 sonrası.

- **F2.8–F2.18 — P1 Genişleme (8 hafta)** — owner: multiple, priority: P1, link: brief Sprint 2–3 (Ay 4–6), effort: 60–80 iş günü. Fidan/fidye/adak (F2.8, L), takım gönüllülük (F2.9, L), sosyal referral (F2.10, M), discover (F2.11, M), missions filter (F2.12, M), profile karma log (F2.13, M), leaderboard friends (F2.14, M), notifications (F2.15, S), markdown (F2.16, S), PDF/CSV rapor (F2.17, M), admin role UI (F2.18, M).

- **F2.19–F2.26 — P2 V2 Geçiş (10–12 hafta)** — owner: full team, priority: P2, link: brief Sprint 3–4 (Ay 7–9), effort: 80–105 iş günü. Kurumsal sponsor dashboard (F2.19, XL 20–25 gün — yeni gelir kolu), gelişmiş analytics (F2.20, L), bulk messaging (F2.21, M), design system V2 (F2.22, L), share kart (F2.23, M), saved import (F2.24, M), API key management (F2.25, M), görev taxonomy (F2.26, L).

### P0 — V1 Lansman (yüksek öncelik)

- **P0 #9 — STK admin UI V0 (Min+ 10 sayfa)** — owner: ux-researcher (next) → ui-designer → frontend-engineer + supabase-backend + auth-capacitor, priority: P0, link: master plan [`docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md`](./product/01-workstreams/2026-04-24-v1-improvement-master-plan.md) #9, effort: 2-2.5 hafta (1 FE) / 1.5 hafta (FE+BE paralel). ✅ UX brief done (`docs/product/02-briefs/ux/2026-04-24-stk-admin-ui-min-plus.md`), ux-researcher heuristik audit başlayabilir (S0).
- **P0 #10 — Design system reconciliation (atlas ↔ README ↔ kod tutarlılığı)** — owner: design-system-keeper, priority: P0, link: master plan #10, effort: M. Önceki turda kısmi çalışıldı (xp-bar shim, mission-card canonical) — xp-bar duplicate + hardcoded renk grep kalıntısı var.

### P1 — V1 Kapsam (orta öncelik)

- **P1 #3 — /dashboard/discover blog + kategori** — owner: frontend-engineer, priority: P1, effort: M.
- **P1 #4 — /dashboard/missions taxonomy filter** — owner: frontend-engineer, priority: P1, effort: M.
- **P1 #8 — /dashboard/profile Karma log + yıllık özet** — owner: frontend-engineer + supabase-backend, priority: P1, effort: M. UX brief: [`docs/product/02-briefs/ux/2026-04-24-profile.md`](./product/02-briefs/ux/2026-04-24-profile.md) (agent yazdı).
- **P1 #10 — /dashboard/leaderboard friends tab placeholder** — owner: frontend-engineer, priority: P1, effort: M. UX brief: [`docs/product/02-briefs/ux/2026-04-24-leaderboard.md`](./product/02-briefs/ux/2026-04-24-leaderboard.md) (agent yazdı).
- **P1 #9 — /dashboard/rewards/[id] polish** — owner: frontend-engineer, priority: P1, effort: S. UX brief: [`docs/product/02-briefs/ux/2026-04-24-rewards.md`](./product/02-briefs/ux/2026-04-24-rewards.md) (agent yazdı).
- **P1 #11 — /dashboard/notifications read/unread** — owner: frontend-engineer, priority: P1, effort: S.
- **P1 #12 — Button ghost variant** — owner: design-system-keeper, priority: P1, effort: S.
- **P1 #13 — 10-domain icon set** — owner: design-system-keeper, priority: P1, effort: S.

### Agent iletişim — protokol adoption

- **Eski brief/spec'lere handoff log ekleme (kalan)** — owner: meta (user-triggered audit), priority: low, link: communication protocol SKILL. 3 ana thread retroactive dolduruldu; ikinci turda P1 UX brief'lere + Eng brief'lere + UI spec'lere de uygulanır.

## ✅ Done today (2026-04-26 — late update)

- 2026-04-26 22:30 — **system-architect** — **Mayıs sprint Yol A tamam + Yol D Vitest/CI + Yol E migration + 6 server action auth guard'lı**:
  - **Yol A — TIERS callsite migration tamam (10/10):**
    - ✅ Önceki turdan: `lib/karma-level.ts`, `lib/mock-data.ts` (re-export), `lib/supabase/queries/profiles.ts`, `components/ui/tier-badge.tsx`, `components/ui/ds/hero-card.tsx`
    - ✅ Bu tur: `components/tier/tier-data.ts` (Set C "İyi Yürekli/..." → Set A canonical), `components/ui/brand-logo.tsx` (yorumlar Set A), `app/dashboard/profile/profile-client.tsx` (local tierNames+tierThresholds → karmaProgress), `app/onboarding/(user-flow)/welcome/page.tsx:203` (TIERS[1].name template), `app/page.tsx:387-393` (landing TIERS marketing storytelling olarak işaretlendi, exempt yorum)
  - **Yol D — Vitest + CI baseline:**
    - ✅ [`vitest.config.ts`](./vitest.config.ts) + `vitest.setup.ts` (jsdom + globals + setupFiles)
    - ✅ [`lib/tiers.test.ts`](./tiers.test.ts) — 16 test (TIERS list + getTierByKarma + getTierName + nextTier + karmaProgress)
    - ✅ [`lib/karma-level.test.ts`](./karma-level.test.ts) — 9 test (level math + tier referansı)
    - ✅ [`lib/auth/guards.test.ts`](./auth/guards.test.ts) — 5 test (AuthError + authErrorToResult)
    - ✅ [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — npm ci + lint + tsc + vitest --run + next build
    - ✅ `package.json` scripts: `test`, `test:run`, `test:ui`, `typecheck` + devDeps: vitest 2.1.8 + @testing-library/* + jsdom 25
  - **Yol E — Migration 045 + active/status trigger:**
    - ✅ [`supabase/migrations/045_mission_active_status_trigger.sql`](../supabase/migrations/045_mission_active_status_trigger.sql) — DB-side `sync_mission_active()` trigger; manuel sync eski (BUG-053) kalkıyor
    - ✅ Mevcut satırlar idempotent backfill (`active = (status = 'active')` where mismatch)
  - **6 server action requireNgoAdmin/requireUser ile güvende (Yol B Faz 2 örnek):**
    - ✅ `lib/admin/missions-actions.ts` — 4 export (createMission, updateMission, updateMissionStatus, deleteMission)
    - ✅ `lib/admin/blog-actions.ts` — 3 export (createBlogPost, updateBlogPost, deleteBlogPost)
    - ✅ `lib/admin/verifications-actions.ts` — 2 export (approveVerification, rejectVerification) — requireUser + RLS
    - ✅ `lib/admin/members-actions.ts` — 1 export (exportMembersCSV)
    - ✅ `lib/admin/ngo-profile-actions.ts` — 1 export (updateNgoProfile)
    - ✅ `lib/admin/payment-config-actions.ts` — 1 export (updatePaymentConfig)
    - ⏳ Kalan ~28 server action (campaign, sponsor, ngo-signup-review, signup, onboarding, dev-fixtures, 14 admin page-level) auth-capacitor + frontend-engineer follow-up
  - **TSC 0 hata ✅** + **ESLint 0 error ✅** — vitest test dosyaları tsconfig + eslint exclude'a alındı (`npm install` öncesi state).
  - **Migration 045 + 044 supabase'e push gerek** — kullanıcının canlıya alma adımı.
  - Handoff: auth-capacitor (kalan 28 server action), frontend-engineer (TIERS lint rule + display kalan UI), supabase-backend (migration 044+045 apply).

## ✅ Done today (2026-04-26)

- 2026-04-26 21:00 — **system-architect** — **ADR Accept + canonical implementation paketi (TIERS + auth guards + migration template + tech debt sprint)**:
  - **3 ADR Accepted** (5-dosya checklist tamam):
    - [`docs/product/03-decisions/014-tiers-canonical.md`](./product/03-decisions/014-tiers-canonical.md) — TD-001 fix.
    - [`docs/product/03-decisions/015-server-action-template.md`](./product/03-decisions/015-server-action-template.md) — TD-019/020/026 fix.
    - [`docs/product/03-decisions/016-migration-template.md`](./product/03-decisions/016-migration-template.md) — TD-014 fix.
  - **Canonical kod (3 yeni dosya, 1 revize):**
    - ✅ [`lib/tiers.ts`](./tiers.ts) — TIERS canonical (5 tier, Set A naming, threshold 500/2000/5000/10000) + getTierByKarma + karmaProgress.
    - ✅ [`lib/auth/guards.ts`](./auth/guards.ts) — requireUser/requireNgoAdmin/requireSuperAdmin/requireSponsorAdmin + AuthError.
    - ✅ [`lib/karma-level.ts`](./karma-level.ts) revize — TIERS import lib/tiers.ts'ten.
    - ✅ [`supabase/migrations/044_composite_indexes.sql`](../supabase/migrations/044_composite_indexes.sql) — 8 composite index.
  - **Template + workstream:**
    - ✅ [`docs/eng/templates/migration-template.sql`](./eng/templates/migration-template.sql) — yeni migration baseline.
    - ✅ [`docs/product/01-workstreams/2026-04-27-tech-debt-sprint.md`](./product/01-workstreams/2026-04-27-tech-debt-sprint.md) — Mayıs sprint (8 paralel yol).
  - **5 TIERS callsite migrate edildi** (kalan 5'i frontend-engineer follow-up):
    - ✅ `lib/karma-level.ts` (system-architect)
    - ✅ `lib/mock-data.ts` (TIERS array kaldırıldı, re-export)
    - ✅ `lib/supabase/queries/profiles.ts` (4-tier farklı eşik drift'i düzeltildi)
    - ✅ `components/ui/tier-badge.tsx` (local tierConfig kaldırıldı, TIERS import)
    - ✅ `components/ui/ds/hero-card.tsx` (Set C "İyi Yürekli/..." silindi, getTierByKarma)
    - ⏳ Kalan 5 dosya frontend-engineer follow-up: `components/tier/tier-data.ts`, `components/ui/brand-logo.tsx`, `app/dashboard/profile/profile-client.tsx`, `app/page.tsx`, `app/onboarding/(user-flow)/welcome/page.tsx`.
  - **lib/admin/missions-actions.ts** — 4 export (createMission/updateMission/updateMissionStatus/deleteMission) requireNgoAdmin auth guard eklendi (örnek). Kalan 34 server action auth-capacitor + frontend-engineer Mayıs sprint Yol B'de paralel.
  - **open.md temizlendi** — Q45/46/47 → resolved.md'ye taşındı (Accepted). Q48/49 (ADR-006 v2 + ADR-008 v3 revize) Proposed olarak kalır.
  - **TSC 0 hata** ✅ — `lib/auth/guards.ts` RPC çağrılarında `(supabase.rpc as any)` cast kullanıldı (TD-005 supabase types regen sonrası temizlenir).
  - **ESLint 0 error** ✅ — sadece test dosyalarında `no-console` warning'ler (test'te console kullanımı normal).

## ✅ Done earlier today (2026-04-26)

- 2026-04-26 19:55 — **system-architect** — **Tech Debt management başlangıç paketi**:
  - **Tech Debt Ledger v2** [`docs/eng/_tech-debt.md`](./eng/_tech-debt.md) — 549 satır, 31 entry (v1'de 12'den artırıldı). 6 🔴 + 24 🟡 + 1 ✅ kapatılı (TD-012 RLS coverage gerçekte %100). Engineer handoff routing matrisi + 30/60/90 plan + pattern memo bağlantıları.
  - **ADR-014 Proposed: TIERS canonical** [`docs/product/03-decisions/014-tiers-canonical.md`](./product/03-decisions/014-tiers-canonical.md) — 5 tier, Set A naming ("İyi Biri / Çok İyi Biri / Çoook İyi Biri / Gerçekten İyi Biri / İyiliğin Öncüsü"), threshold 500/2000/5000/10000. `lib/tiers.ts` canonical + 8 callsite migration + lint rule. **TD-001 fix önerisi.** User onayı bekleniyor.
  - **ADR-015 Proposed: Server action template + auth guards** [`docs/product/03-decisions/015-server-action-template.md`](./product/03-decisions/015-server-action-template.md) — `lib/auth/guards.ts` (requireUser/requireNgoAdmin/requireSuperAdmin/requireSponsorAdmin) + `createServerAction` wrapper + 3 lint rule. **TD-019/TD-020/TD-026 fix önerisi (35 server action defense-in-depth + zod input validation + revalidatePath kapsamı).** User onayı bekleniyor.
  - **Pattern memo SSoT drift** [`docs/test/_patterns/2026-04-26-ssot-drift.md`](./test/_patterns/2026-04-26-ssot-drift.md) — TIERS + color + mission state literal + karma_total + active/status combine. Faz 1-4 implementation rotası.
  - **TD-022 motion dead dependency** ✅ silindi: `package.json` güncel (`motion` package kaldırıldı). User `npm install` çalıştırıp lock dosyasını update etmeli.
  - **T-002 ESLint config** ✅ `.eslintrc.json` yaratıldı: `next/core-web-vitals` extends + warn-level no-console/exhaustive-deps/no-img-element/no-unescaped-entities. `npx next lint` exit 0 ile geçiyor (sadece test dosyalarında console warning'ler, normal).
  - Handoff: product-analyst (ADR-014 + ADR-015 review/Accept) → frontend-engineer + design-system-keeper + auth-capacitor + supabase-backend (Accepted sonrası implementation paralel).

- 2026-04-26 18:55 — **system-architect** — **Engineering & Architecture Baseline Audit v2 (derin)** [`docs/audit/2026-04-26-eng-arch-baseline-audit.md`](./audit/2026-04-26-eng-arch-baseline-audit.md) — 1431 satır, 9404 kelime. v1 (485 satır) yüzeysel kalmıştı; v2 derinleştirildi. 4 yanlış metric düzeltildi (RLS coverage gerçekte %100, auth guard %19 değil %100 değil, KVKK implement edilmiş, motion dead dep). 5 🔴 deploy bloke + 25 🟡 + cross-cutting patterns. Methodology + ADR drift matrix + health metrics + 30/60/90 plan + 5 ADR Proposed kuyruk.

## ✅ Done today (eski 2026-04-26)

- 2026-04-26 18:45 — **system-architect** (yeni agent — ilk çağrı) — **Yeni agent + 2 yeni skill + derin baseline audit + Tech Debt Ledger v1**:
  - `.claude/agents/system-architect.md` — engineering-lead kapsam, oversight rolü, ❌ verme yetkisi, ADR Proposed yazımı, Tech Debt Ledger sahibi.
  - `.claude/skills/code-architecture-review/SKILL.md` — 6-kategori review protokolü (modularity / data flow / security / perf / standartlar / test coverage), severity tier (🔴/🟡/🟢), pattern memo yöntemi.
  - `.claude/skills/post-merge-architecture-check/SKILL.md` — chain kapanışı / ADR Accepted / migration apply / new dependency / new route sonrası 6-kategori sağlık kontrolü.
  - `.claude/agents/coordinator.md` — triage tablosu + flowchart + Bölüm 4.6 (system-architect chain entegrasyonu) güncel.
  - `docs/audit/2026-04-26-eng-arch-baseline-audit.md` (485 satır) — 7 kategori derin audit, executive summary, 4 🔴 + 14 🟡 bulgu, ADR drift matrix, 30/60/90 plan, health metrics dashboard.
  - `docs/eng/_tech-debt.md` (216 satır) — Tech Debt Ledger v1, 12 entry (4 🔴 + 8 🟡), LNO sınıflama, haftalık review ritüeli.
  - **3 P0 deploy bloke önerisi:** TD-001 TIERS isim drift (3 dosya 2 farklı isim seti), TD-002 hardcoded color leak (45 satır, ADR-004 regression), TD-006 Vitest framework yok, TD-012 RLS coverage doğrulanmamış.
  - Handoff: frontend-engineer (TD-001 + TD-004), design-system-keeper (TD-002 + TD-009), supabase-backend (TD-005 + TD-012), test-engineer (TD-006 + 3 pattern memo).

---

## ✅ Done today (2026-04-25)

- 2026-04-25 23:58 — **design-system-keeper** — **Atlas + Component Inventory refresh** (sync with Tier 2 + show-stopping):
  - `docs/project-atlas.md` — 48 sayfa (38 user + 10 admin), 23 migration (021–023 son), lib util'ler güncel (haptic/toast/view-transitions/dev-fixtures), component envanteri yeni T2 pattern'ler, auth forgot-password/reset-password eklendi. Handoff log + status board updated.
  - `docs/ui/02-design-system/component-inventory.md` — **Yeni dosya** — 53 component (27 ui/ + 13 ds/ + 4 dashboard/ + 9 root), atomic/molecular/organism taxonomy, state layer, theme+util, coverage map (38 page × component), gap analysis (calendar/select/lightbox/sponsor dashboard pending), duplication audit (0 hardcoded), motion/a11y baseline, P0/P1 backlog. TSC 0 hata. Upstream: UX audit K1-K10 + show-stopping spec + reward v2. Downstream: FE (implement queue), DS (ADR trio).

- 2026-04-25 04:35 — **ui-designer** — **Full-App UI + Motion Audit** (38 sayfa × 4 dimension):
  - `docs/ui/05-reviews/2026-04-25-full-app-ui-motion-audit.md` (6,200+ kelime) — Visual hierarchy (H1/H2/body golden ratio check), motion choreography (stagger timing ad-hoc, spring presets inconsistent), token usage (0 hardcoded ✅), tier-1+ pattern coverage (15-pattern Linear/Arc/Duolingo benchmark × İyiBiri, 3 major gap + 5 minor). Top 5 UI gap: UI-K1 motion timing, UI-K2 visual hierarchy aggressive, UI-K3 spring presets, UI-K4 token clean ✅, UI-K5 tier-1+ pattern gap (Cmd+K/scroll-linked/shared-element yok). 4 quick-win (<2.5 hr): motion config, H2 sizing, empty state tone, featured card weight. Long-term backlog: show-stopping 1-7 + tier-1+ 15 pattern (13-18 days, 3-4 hafta). Component envanteri (MissionCard high-use, KarmaCounter count-up missing). Handoff: FE (quick-win + show-stopping 1-4), DS (motion.config.ts), product (tier-1+ prioritization). TSC 0 hata. Self-audit ✅ pass.

- 2026-04-25 23:55 — **ux-researcher** — **Full-App UX Audit** (tier-1+ target, all user pages):
  - `docs/ux/03-heuristics/2026-04-25-full-app-ux-audit.md` (9,200+ kelime) — 38 sayfa × Nielsen 10 + İyiBiri 6 + WCAG AA matrix, K1–K10 kritik bulgular (severity 1–4), 5 quick-win (<30 min each), 4 medium-effort backlog, tier-1+ gap analysis (haptic/motion/timeline eksik). Handoff: ui-designer (spec), fe (backlog), ds-keeper (tokens/motion). Quick-win batches: K9 forgot-pwd link fix, K8 focus ring, K1 loading skeleton, K4 hero card, K3 empty illustration. TSC 0 hata. Self-audit ✅ pass.

- 2026-04-25 23:45 — **product-analyst** — **F2.1 Matching Algoritması v1: Lean PRD** (P0 Faz 2, Sprint 1–2):
  - `docs/product/02-briefs/eng/2026-04-25-matching-algoritma-v1.md` (2500+ satır, 14 bölüm) — Score formula detay (interest/proximity/skill/recency/popularity ağırlıkları), problem veri ile (pilot completion %20, rakip benchmark VolunteerMatch +8%), JTBD (gönüllü discovery + STK admin performance), Solution (Sana Özel tab + score ranking), Must scope (formula + Edge Function + materialized view + A/B test harness + success metrics), Should (recency decay + sponsor boost + featured slot V1.2+), Risk matrisi (cold start fallback, recency bias, fairness algısı, perf, training data), 4 açık karar (Q52–Q55), Supabase technical design (Migration 025 pseudo-SQL, Edge Function Deno, refresh cron), A/B test framework (20–30% control, chi-square analysis, 4 hafta window), Handoff (BE migration + function, FE wiring + events, analytics dashboard), Launch gates 4 item. Varsayımlar: profile tamlığı V1 + pilot prep + avukat fairness görüşü. Effort: BE 3 gün (migration + function) + FE 2 gün (tab + tracking) + analytics 1 gün = Sprint 1 (6 gün), Sprint 2 (2 hafta learning + tuning). Upstream: backlog + rekabet analizi + master plan, Handoff log satırları. TSC 0 hata. Self-audit: ✅ pass (MECE kapsam, JTBD explicit, ölçülebilir metric, bağımlılıklar clear, risk/open-q tagged, strateji link, tarih+status+owner, lean format ~2.5 sayfa scope-focused).

- 2026-04-25 23:00 — **ui-designer** — **Ödül Sistemi V2: Implementation-ready UI spec** (P1 Faz 2):
  - `docs/ui/01-specs/2026-04-25-reward-v2-ui-spec.md` (2100+ satır, 15 bölüm) — 6 ekran detail (Rewards Hub + Detail bottom sheet + Redemption Confirm + Success Celebration + Reward History + Sponsor Dashboard), 7 component (RewardsHub, RewardDetail, RedemptionConfirmDialog, SuccessPage, RewardHistory new, SponsorDashboard new + 3 atomic: RewardCard, SponsorLogoBar, ImpactStatement, RedemptionCodeDisplay, SegmentChart). Tier-1 reuse (KarmaCounterPro, SuccessCelebration, Vaul, Sonner, MagneticButton, TierBadge). Token: mevcut atlas yeterli (0 hardcoded), 3 tier-color ADR-TBD. Motion: K5 (karma countdown 0.8s), K3 (confirm dark), K6 (success peak), K10 (PDF load). A11y: WCAG AA baseline (focus-visible ✅, touch 44px ✅, kontrast flagged gold-dim ⚠️, reduced-motion ✅). Effort: FE 2 dev 80–120 saat, BE 40–60 saat, 2–3 hafta. Handoff: FE (RewardsHub P0 → RewardHistory P1 priority), BE (Migration 024 + API), DS (tier-color ADR). Upstream: brief + audit + journey Handoff log satırları. TSC 0 hata. Journal updated.

- 2026-04-25 20:45 — **ux-researcher** — **Ödül Sistemi V2: Heuristik audit + 2 persona journey** (P1 Faz 2): 
  - `docs/ux/03-heuristics/2026-04-25-reward-v2-audit.md` (8,900 satır) — V1 rewards audit (Nielsen 10 + İyiBiri 6 + sponsor dashboard), K1–K10 kritik bulgular (dark/peak moment detay), HEART metrics, tier-1 benchmark (Duolingo gem shop / Strava challenge / Charity Miles match), **Sponsor dashboard for Murat (K9–K10 missing)** explicit flag. 
  - `docs/ux/02-journeys/2026-04-25-reward-ayse-murat-journey.md` (7,600 satır) — **Ayşe journey** (10-step redemption: hub → filter → detail → confirm **dark** → success **peak** → history → share); **Murat journey** (8-step admin: dashboard → analytics → cohort → PDF **dark/wait** → download → report **peak**). Both emotion curves, HEART metrics per adım, motion choreography (stagger, prefers-reduced-motion), a11y checklist. 
  - Persona durum: Kanıt-altı (brief'ten derived, customer interview pending — **recommendation: V2 MVP S1–S4 Ayşe beta test 5+ user, Murat sponsor convo sonra spec**).
  - Handoff: upstream product-analyst brief (Handoff log satır eklendi), downstream ui-designer (K1-K8 spec bekleniyor), backend (K9-K10 sponsor dashboard + PDF). TSC 0 hata. Effort: 5 saat (skill read + audit + journey tabling + persona motion/a11y/HEART mapping).

- 2026-04-25 22:30 — **product-analyst** — **V2 Ödül UX Brief** (P1 Faz 2, Ay 6–9): `docs/product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md`, 15 bölüm, 2200 satır. Governing thought + JTBD × 10 (5 kullanıcı + 5 sponsor), test data 3 sponsor × 10 reward, 5-step redemption flow (wireframe), DB schema migration 024 (sponsors + campaigns + reward_type), OST + Cagan 4-risk + LNO + Shape Up 4-sprint, 5 açık karar (Q47–Q51 sponsor seçimi/budget/expiry/badge/OG). Handoff: ux-researcher (audit + journey + mini test) → ui-designer (katalog + sponsor dashboard spec) → 2 FE + 1 BE + auth. Upstream Handoff log (strategy memo 13. bölüm) + status board updated. TSC 0 hata. Effort: 4 saat (research + strateji memo okuma + JTBD analysis + flow + schema + metrics writup). **Downstream ready: UX research başlar Q25 sonrası.**

- 2026-04-25 ~19:10 — **frontend-engineer** — **Pattern 1-3: Show-Stopping UI Polish** (Onboarding, Karma Counter, Mission Card). Yeni: `components/ui/karma-counter-pro.tsx` (120 satır, easeOutExpo count-up + tier glow ring + delta float), `components/onboarding/welcome-celebration.tsx` (200 satır, modal + KarmaCounterPro integration). Genişletme: `daily-mission-card.tsx` (featured state vurgusu: 2px gold border + "Senin için" badge top-left + glow shadow + hover lift), `app/onboarding/city/page.tsx` (WelcomeCelebration swap). TSC: 0 hata (tüm 3 faz). Regression: HeroCardV2 karma count-up mevcut, onboarding city→modal→dashboard flow OK, mission card list render intact. Motion: K1 (1400ms ceremony timing) + K9 (KarmaCounterPro ready for leaderboard/mission-complete wiring). Handoff: upstream `ekosistem-show-stopping-spec.md` Bölüm 12 log, downstream design-system-keeper (3 ADR-TBD) + fe next (Pattern 4-7 backlog). Files: 3 yeni + 2 genişletme. Effort: 150 dakika (A 35 + B 45 + C 30 + integration 15 + doc 25).

- 2026-04-25 03:45 — **frontend-engineer** — **UX quick-wins (6/6) implementasyonu**: K1 (onboarding success modal: city → modal "Hoş geldin +100 🌱" spring animation 2.4s auto-dismiss → dashboard), K2 (causes min-1 validation: button disabled until selected.length > 0), K4 (daily mission selectionReason: server-side algo yakın > kısa-süreli > default based on city + duration ≤120min), K5 (filter chip easing: 200ms cubic-bezier 0.22/1/0.36/1), K7 (membership pending message: empathic copy "Birkaç saniye içinde onaylanacak..."), K8 (empty state copy: noNotifications + saved presets contextual). Files: app/onboarding/city/page.tsx (modal), app/onboarding/causes/page.tsx (validation), app/dashboard/page.tsx (algorithm), app/dashboard/dashboard-client.tsx (prop wire), components/ui/ds/chip-ds.tsx (easing), app/dashboard/ngos/.../celebration-client.tsx (message), components/ui/state/index.tsx (presets). TSC: 0 hata. Regression: dashboard, onboarding, missions, membership flows intact. Commit: 39d5168. Handoff: upstream UX audit (`docs/ux/03-heuristics/2026-04-25-ekosistem-polish-audit.md`), downstream K3/K6/K9/K10 (medium-effort backlog).

- 2026-04-25 18:30 — **ui-designer** — **Ekosistem show-stopping UI spec**: UX K1-K10 + SS1-SS5 → 7 pattern component-level spec (1 onboarding celebration, 2 KarmaCounterPro, 3 featured mission, 4 empty state, 5 bottom sheet, 6 streak milestone, 7 cultural events) + 4 SVG + 3 token + 12-checklist quality. Links: `docs/ui/01-specs/2026-04-25-ekosistem-show-stopping-spec.md` (10,000+ kelime). 13 bölüm: özet/DNA/7-pattern/refactor-matrix/atomic/motion-master/a11y/quick-wins/file-list/ds-handoff/açık-karar/handoff-log/checklist. Tier-1 benchmark 7-app karşılaştırma explicit (Linear/Duolingo/Things/Arc/Robinhood/Notion/Apollo). Motion choreography 3-tier timing band + spring defaults 400/30 + stagger 40-60ms + useReducedMotion fallback. A11y WCAG AA baseline full (focus-visible, touch-target 48px, kontrast matrix, keyboard, screen-reader, dark-mode 4-layer, safe-area). Token kontrol 0 hardcoded, 3 yeni token gereksinimi (flameOrange, glow-breathing, cultural-event vars) → ADR-TBD. Handoff: frontend-engineer (10 component priority K1/K9/K11), design-system-keeper (3 ADR-TBD + SVG atoms), product-analyst (cultural calendar), ux-researcher (Ramadan conversion). TSC 0 hata. Upstream: UX audit Handoff log + downstream explicit FE/DS listi.

- 2026-04-25 18:00 — **ux-researcher** — **Ekosistem polish audit**: 14 akış × seamless/show-stopping matrix, K1-K10 kritik bulgular, 5 show-stopping opportunity, 6 quick-win + 4 medium-effort — links: `docs/ux/03-heuristics/2026-04-25-ekosistem-polish-audit.md` (8,500+ kelime). Tier-1 benchmark (Duolingo/Linear/Things 3) explicit, Nielsen 10 + İyiBiri özel 6 heuristik sistematik, yorum yetkisi kullanılmış (K3 Nielsen 8 violation challenge, K6 form validation systemic issue tanı). Seamless avg 3.7/5 (target 4.5), show-stopping avg 1.9/6 (target 3.5). Handoff: ui-designer (6 spec frame Bölüm 11), frontend-engineer (10 task backlog Bölüm 9), product-analyst (3 karar soru Bölüm 12). Quick-win batches 6 saat; medium-effort 1 hafta+ planning. TSC 0 hata. Upstream: atlas, page-audit, playbook yorum yetkisi. Downstream: design-system-keeper (6 spec), fe (10 task), product (3 q).

- 2026-04-25 03:30 — **supabase-backend + frontend-engineer** — **V1 pilot gap fix**: Migration 022 + 023 + verifications real data + karma idempotent — links: `supabase/migrations/022_user_missions_proof_columns.sql` (proof_type/proof_url/submitted_at kolonları + index), `supabase/migrations/023_storage_ngo_assets.sql` (ngo-assets bucket + 5 RLS policy), `lib/supabase/types.ts` (+3 kolon UserMission Row/Insert/Update), `app/admin/[ngoId]/verifications/page.tsx` (real query migrations.ngo_id join + sort submitted_at), `lib/admin/verifications-actions.ts` (approveVerification + bulkApproveVerifications karma distribution idempotent via mission.karma_points), `lib/missions/__test__.ts` (proof columns mock update). TSC 0 hata. Storage upload UI V1.1'e ertelendi (text URL input yeterli pilot için). Handoff: Sprint S1 Auth + Layout (middleware done, fe ready). V1 pilot **veritabanı altyapısı hazır.**

- 2026-04-24 21:15 — **auth-capacitor** — Middleware + Admin login upgrade (ADMIN_SECRET → Per-NGO Supabase auth) — links: `middleware.ts` + `app/admin/login/page.tsx` + `app/admin/login/actions.ts` + `.env.local`. Per-NGO auth: /admin/login → Supabase email/password, middleware is_ngo_admin(user_id, ngo_id) RPC check, /admin/devtools super-admin only, /admin root super-admin only. ADMIN_SECRET deprecated (cookie pattern kaldırıldı). SUPER_ADMIN_EMAILS env setup. Handoff: fe (admin hub router + logout button + devtools button). TSC 0 hata.

- 2026-04-24 20:30 — **supabase-backend** — Migration 021 + Seed script + Types güncelleme — links: `supabase/migrations/021_ngo_admin_rls_policies.sql` + `lib/dev/ngo-admin-fixtures.ts` + `lib/supabase/types.ts`. Migration 021: 8 RLS policy (missions/user_missions/ngos/posts/ngo_memberships/ngo_admin_users × admin/super-admin), 5 eksik ngos kolon (email/phone/cover_image_url/social_*), is_super_admin(user_id) helper, idempotent + rollback annotated. Seed: 5 STK admin (idempotent listUsers + upsert), dev-only guard, devtools entegrasyon hazır. Types: ngos.Row/Insert/Update +6 kolon. TSC 0 hata. Handoff: fe (Sprint S1 admin layout), auth-capacitor (middleware), ux/ui (Planning S0).

- 2026-04-24 10:45 — **product-analyst** — STK Admin UI V1 (Min+ 10 sayfa) detaylı UX brief — link: `docs/product/02-briefs/ux/2026-04-24-stk-admin-ui-min-plus.md` (P0 #9 workstream, ADR-010 implementation plan). 10 sayfa × JTBD + outcome + must/should/won't + başarı kriteri + benchmark + varsayım. OST + Shape Up appetite + Cagan 4-risk + LNO applied. Admin persona "Ayşe" (5 JTBD), 5 STK test data senaryosu, 4 problem → 10 solution, S1-S6 batch timeline, success metrics (haftasal login + 4w walking skeleton + 12w NPS≥50). Handoff: ux-researcher (audit start → ui-designer wire → supabase-backend migration 021 → auth-capacitor middleware → frontend-engineer S1-S4 implementation).

- 2026-04-24 17:10 — **supabase-backend** — StreakSnapshot query + index — link: `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md` Handoff log. `lib/supabase/queries/streak.ts` (getRecentStreakActivity, StreakActivity interface) + `supabase/migrations/020_streak_query_index.sql` (composite index). TSC 0, RLS verified, idempotent. Handoff: frontend-engineer (Sprint A A1).

- 2026-04-24 16:35 — **design-system-keeper** — K1 token fix (MissionCard domain gradient) — link: `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md` Handoff log. `tailwind.config.ts` backgroundImage (7 domain-* + 2 scrim-*) + `components/ui/mission-card.tsx` refactor (hardcoded gradient → className) + `docs/project-atlas.md` Bölüm 6 güncelleme. TSC 0 hata, grep 0 hardcoded hex. Handoff: frontend-engineer (Sprint A variant dönüş).

- 2026-04-24 10:45 — **ui-designer** — Dashboard v2 tur 2 polish spec — link: `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md`. K1–K5 sorunları → 3 yeni component (StreakSnapshot, LeaderboardTeaser, DailyMissionCard polish) + MissionCard token refactor spec, motion (Duolingo pattern), WCAG AA checklist. Handoff: fe + design-system-keeper.

- 2026-04-24 23:45 — **ux-researcher** — Dashboard v2 tur 2 audit + journey — links: `docs/ux/03-heuristics/2026-04-24-dashboard-v2-tur2-audit.md` + `docs/ux/02-journeys/2026-04-24-dashboard-ikinci-ziyaret.md`. K1–K5 kritik (MissionCard gradient refactor, streak/leaderboard/algoritma missing, ödül rail Overhead), Q25/Q34/Q43 cevapları. Handoff ui-designer'a.

- — **product-analyst** — Dashboard v2 Tur 2 brief + component inventory — link: `docs/product/02-briefs/ux/2026-04-24-dashboard-v2-tur2-brief.md`. 12-item inventory (9 mevcut + 3 missing), 5 iyileştirme (Leverage 2 + Neutral 2 + Overhead 1), handoff ux-researcher'a.

- 2026-04-24 20:45 — **Claude (Cowork, 3 paralel subagent)** — **Agent iyileştirme 3-9/9 tamam (5 agent batch)**: 
  - frontend-engineer (3/9): `react-server-component-patterns` skill yeni (421 satır) + `mobile-app-polish-standards` kritik ref fix + testing/performance maddeleri
  - supabase-backend (4/9): `supabase-postgres-best-practices` +322 satır (RLS + Realtime idempotency + Edge Functions + Migration rollback, 4 yeni bölüm)
  - coordinator (5/9): playbook +151 satır (Triage Decision Tree + RACI + LNO, Stop Conditions 7 kategori, Workstream Sequencing + Critical Path)
  - ui-designer (6/9): `visual-spec-writing` +334 satır (Visual Hierarchy Discipline Refactoring UI + Motion Choreography Rauno pattern)
  - ux-researcher (7/9): `continuous-discovery-practice` skill yeni (400 satır, Teresa Torres OST + Google HEART + Jeff Patton story mapping)
  - product-analyst (8/9): `product-discovery-frameworks` skill yeni (352 satır, OST + JTBD + Shape Up + Cagan 4-risk + LNO) + `writing-plans` +95 satır (OKR linkage)
  - strategy-consultant (9/9): `pyramid-principle-thinking` skill yeni (310 satır, Minto MECE + SCQA + memo template) + `consulting-methodology` +205 satır (7 Powers Helmer + Amazon Working Backwards PR/FAQ)
  - TSC 0 hata. Toplam 2150 satır yeni skill + ~900 satır skill eklentisi + ~470 satır playbook iyileştirme.
- 2026-04-24 18:30 — **Claude (Cowork)** — **auth-capacitor iyileştirme** (agent sıra 2/9, **P0 legal + security**): 2 yeni skill yazıldı — `kvkk-compliance` (250 satır, TR 6698 aydınlatma template + çifte onay + consent tracking + silme hakkı + DPA + 8 avukat-e-gider senaryosu) + `capacitor-native-oauth` (417 satır, RFC 8252 7-madde + iOS Universal Links + Android App Links + PKCE + @capgo/social-login + deep link handler + token secure storage + 16 bölüm). Playbook'a skill referansları + Password Reset Flow detay + MFA Roadmap (Email→SMS→TOTP→Passkeys). TL 1M+ KVKK cezası + account takeover riski kapsandı. Legal review + simulator test kaldı.
- 2026-04-24 17:15 — **Claude (Cowork)** — **design-system-keeper iyileştirme** (agent sıra 1/9): `design-system-audit` skill'e 3 yeni bölüm (Atomic Design Taxonomy/Token Governance/Figma Variables, +208 satır) + playbook'a "Contribution Model + Component Lifecycle" bölümü (+97 satır). Kaynaklar: Brad Frost, Nathan Curtis, Figma Docs.
- 2026-04-24 16:30 — **Claude (Cowork)** — Coordinator agent (9. agent, auto-triggered) + Protokol Katman G (orchestration layer). `.claude/agents/coordinator.md` + `SKILL.md` Katman G + agents-dashboard güncelleme. Büyük/multi-agent iş geldiğinde parent session otomatik çağıracak.
- 2026-04-24 15:45 — **Claude (Cowork)** — Agent communication protocol (6 katman: Handoff / Status board / Unified journal / Peer review / Decisions canonical / Playbook entegrasyonu). Tek source of truth: `.claude/skills/agent-communication-protocol/SKILL.md` (338 satır). 8 agent playbook güncellendi, 11 dosyaya retroactive handoff log, status board kuruldu.
- 2026-04-24 15:00 — **Claude (Cowork)** — Yol A polish sprint tamamlandı (5/5 madde): NGO follow persistence + loading skeleton + animation 3 ekran (agent) + empty state pattern library + 3 analyst brief (agent). TSC 0 hata.
- 2026-04-24 13:00 — **analyst + strategy** — Karar oturumu kapanışı: 21/34 açık soru çözüldü, 4 yeni ADR Accepted (ADR-010/011/012/013), ADR-009 Proposed (avukat bekliyor). Hukuki mütalaa briefi hazır.
- 2026-04-24 12:15 — **fe + ds** — P0 #4 State library (`components/ui/state/index.tsx`) — 5 export: LoadingState, EmptyStateV2, ErrorState, OfflineState, AsyncBoundary.
- 2026-04-24 11:45 — **fe** — P0 #1 Dashboard v2 wire-in (HeroCardV2 + DailyMissionCard canlı).
- 2026-04-24 11:30 — **strategy** — Launch deliverables: TEMA intro email + Gamma deck prompt (partner + investor variants) + pitch polish.
- 2026-04-24 11:00 — **fe** — Mission state machine components + page FSM refactor + 2 dead file retired. 83/83 test pass.
- 2026-04-24 10:30 — **be + fe** — Test data infra (migration 014) + devtools seed/clear + sessiz bug fix.
- 2026-04-24 10:00 — **ux + ui + be + fe** — P0 #3 Mission state machine audit + journey + UI spec + migration 013 + FSM lib + 55 unit test.
- 2026-04-24 09:30 — **ui-designer** — Mission state machine UI spec.
- 2026-04-24 09:15 — **ux-researcher** — Mission state machine audit + journey map.
- 2026-04-24 08:30 — **fe + be** — Sandbox + celebration + webhook — üyelik akışı end-to-end clickable.
- 2026-04-24 08:00 — **fe + be** — NGO membership full-stack integration + 28 unit test.
- 2026-04-24 07:30 — **fe** — NGO membership 5 component scaffold.
- 2026-04-24 07:10 — **ui-designer** — NGO membership parametric UI spec.
- 2026-04-24 06:45 — **ui + fe + ds** — Dashboard v2 UI spec + component scaffold + NGO audit + xp-bar shim.
- 2026-04-24 06:30 — **ux-researcher** — Dashboard v2 audit + journey + SKILL sertleştirmesi.
- 2026-04-24 06:00 — **fe + ds** — Onboarding DB sync + design system reconciliation tur 1.
- 2026-04-24 05:30 — **be + fe + auth** — Faz 2 agent'lar ilk tur (analytics + coming-soon + şifre sıfırlama).
- 2026-04-24 05:00 — **product-analyst** — V1 Improvement Master Plan + 7 brief.

## 📦 Done this week (2026-04-19 → 2026-04-24)

> Not: Proje aktif olarak **2026-04-23 başladı** — bu "hafta"nın içeriği iki günlük sprint (23-24 Nisan). Pazartesi özete dönülür.

- 2026-04-24 — V1 Master Plan + 12 P0 iş tanımı + ADR'ler + master iletişim protokolü (bu sprint)
- 2026-04-23 → 2026-04-24 — Strateji fazı (12 memo + 35 kaynak + 26 açık soru)
- 2026-04-23 → 2026-04-24 — Ürün fazı (7 ADR Proposed → 8 Accepted + 3 workstream + 7 brief)
- 2026-04-23 → 2026-04-24 — Faz 2 agent çıktıları (8/12 → 10/12 P0 tamam)

---

## 📊 Sağlık göstergeleri (haftalık self-check)

Protokol Bölüm 9 ölçütleri:

1. **Handoff log coverage** (son 7 gün briefs/specs): retroactive sprint sonrası 3/3 ana thread ✅.
2. **Status board güncelleme freshness**: < 24 saat ✅ (az önce güncellendi).
3. **Journal front-matter 4 alan**: henüz uygulanmadı (retroactive beklemede, yeni girişlerden başlanacak) ⚠️.
4. **Açık 🔴 soru cevapsız ≥ 7 gün**: 0 ✅ (Q10+Q11+Q13 hukuki bekliyor ama yazılı; Q31 API key karar verildi mimari doğru).
5. **ADR Accepted drift**: 0 ✅ (son oturum sonrası tüm resolved ADR'ler open.md'de kapatıldı).

---

## Nasıl kullan (agent'lar için)

**Her run başlangıcı:**
1. Bu dosyayı oku — kendi kolonunda satır varsa context al, yoksa blockage'a bak.

**Her run bitimi:**
1. "In progress"ten "Done today"e taşı (tarih + agent + link).
2. Yeni açılan iş "Backlog"a eklenir (owner + priority belirt).
3. Kullanıcı aksiyonu beklenen iş "Waiting for user"a eklenir (link + sinyal tarihi zorunlu).
4. En üstteki "Son güncelleme" satırını yenile.

**Gün sonu (gece / Pazartesi sabahı):**
"Done today" → "Done this week"e taşınır veya özetlenir.

**Haftalık (her Pazartesi):**
Sağlık göstergeleri gözden geçirilir. 3 veya daha fazla ❌/⚠️ varsa protokol revize tetikleyicisi.

---

**Referans:** [`.claude/skills/agent-communication-protocol/SKILL.md`](../.claude/skills/agent-communication-protocol/SKILL.md)
