# Vol-62 Master Sprint Plan — Cross-Cutting P0 Synthesis

**Tarih:** 2026-05-03 | **Vol-61 Audit Sonrası** | **Scope:** 12 paket, 3 paralel track  
**Owner:** Coordinator | **Effort estimate:** 6.5–8 hafta paralel (critical path ~5.5 hafta)

---

## Sprint Hedefi

Vol-61'de 9 agent paralel audit → **34 P0 bulgu** (10 cross-cutting tekil tema). Vol-62'de bu bulguları **3 paralel track** (Donation→Karma, Form Auth, Performance+Data) halinde organize edip, **V1.1 pilot hazırlığı** (Ay 5 bitmesinde) + **geliştirilmiş test framework** + **production deployment readiness** hedefliyor.

---

## Cross-Cutting P0 Synthesis — Tekil Temalar (34 bulgu → 10 kategori)

| # | Tema | Agent Doğrulaması | Bloke Eden | Paket # |
|---|---|---|---|---|
| **T1** | **BUG-066 Form Double-Submit (signup/forgot/reset auth)** | Frontend + Auth-Capacitor + UX | Kritik bug fix | Pkg-1 |
| **T2** | **Donation→Karma trigger YOK** (donor reward alma yok) | Supabase + Frontend | Donation flow işlemiyor | Pkg-3 |
| **T3** | **KVKK consent kayıt yok** (profiles.kvkk_accepted_at column) | Auth-Capacitor + Supabase + UX | Yasal compliance | Pkg-4 |
| **T4** | **TIERS drift 8 dosya × 3 isim seti** | System-Architect + Frontend | Canonical karar (ADR-014) | Pkg-1 |
| **T5** | **Form validation + UX consistency** (custom amount yok, loading invisible) | UX + UI + Frontend | UX inconsistency | Pkg-2 |
| **T6** | **Performance: TD-004 monolith 1103 line (2049ms → %36 az gerek)** | Performance + Frontend | V1.1 speed | Pkg-5 |
| **T7** | **Server action auth guard (35/43 unguarded)** | System-Architect + Auth + Frontend | Security | Pkg-1 |
| **T8** | **Payment webhook prod stub (TODO)** | Supabase + Product-Analyst | Payment processing | Pkg-6 |
| **T9** | **Loading.tsx missing (11 sayfa)** | UI-Designer + Frontend | UX gap | Pkg-2 |
| **T10** | **Test framework yok (vitest/jest/eslint)** | System-Architect + Test-Engineer | CI/CD baseline | Pkg-7 |

---

## Vol-62 Sprint Scope — 12 Paket × Effort × Dependency

### **Critical Path: T1 → T4 → T7 (Form auth + guards) → T2 (Donation)**

```
┌─ Pkg-1: BUG-066 + TIERS + Auth Guards (Seq A)
│  ├─ Pkg-2: UX + Loading states (Parallel with A, dep: Pkg-1 TIERS)
│  ├─ Pkg-3: Donation trigger + RLS (Seq, dep: Pkg-1 guards)
│  └─ Pkg-4: KVKK column + consent UX (Seq, dep: Pkg-3)
│
├─ Pkg-5: Performance monolith split (Parallel B, independent)
├─ Pkg-6: Payment webhook prod (Parallel B, dep: user decision)
├─ Pkg-7: Vitest + CI (Parallel B, no deps)
│
└─ Pkg-8–12: V1.1 STK admin + polish (Sequential C, dep: A+B+C complete)
```

**Critical path bottleneck:** Pkg-1 (Form auth) — 3 days → impacts Pkg-2, Pkg-3, Pkg-4  
**Total timeline:** 40 days paralel (T1 start → T2/T3/T4 seq → polish Pkg-8+)

---

## Paketler Detay

### **TRACK A: Authentication + Donation (Sequential, Critical Path)**

#### **Pkg-1: BUG-066 Fix + TIERS Canonical + Server Action Guards**
- **Owner:** frontend-engineer + auth-capacitor + system-architect
- **Secondary:** design-system-keeper (TIERS display)
- **Effort:** 24 hours (3 days)
- **Dependencies:** None (start immediately)
- **Scope:**
  - BUG-066 form double-submit (auth pages): reproduction → cookie fail root cause → client-side dedup + server idempotent → test
  - TIERS canonical validation (ADR-014): 10 callsite migrate complete (lib/tiers.ts import) + lint rule (no inline TIERS)
  - Server action auth guard template: 10 critical actions (createMission, updateMission, approveVerification, exportMembers, updateNgo, updatePayment + 4 admin) wrapped with requireUser/requireNgoAdmin
  - TSC 0 + ESLint 0
- **Success criteria:** 
  - Form submit 1× guarantee (network tab shows 1 request max)
  - All TIERS callsite use canonical lib/tiers.ts
  - 10/35 server actions guarded + test coverage ≥80%
- **Handoff to:** Pkg-2, Pkg-3
- **Files:** `auth/` page actions, `lib/auth/guards.ts` (if not done), `lib/tiers.ts`, 3 layout server actions

---

#### **Pkg-2: UX Consistency + Loading States (11 pages)**
- **Owner:** ui-designer + frontend-engineer
- **Secondary:** design-system-keeper (loading skeleton atoms)
- **Effort:** 18 hours (2.5 days)
- **Dependencies:** Pkg-1 TIERS (canonical form display)
- **Scope:**
  - Inline padding normalization: 10 component audit → Tailwind utility replacement (grid, card, form)
  - Loading.tsx template: auth (2 page), onboarding (4 page), detail (2 page) — skeleton + breathing animation
  - Dashboard hero italic accent (Fraunces): missing on /donate, /rewards, /missions — style fix + regression
  - H2 hierarchy: 8/38 page h2 inconsistent weight/color → style guide enforcement
  - Heart pattern: consolidate 4-page variant → single atom component
  - Donation custom amount: hardcoded → form field with preset buttons (ui-designer spec → frontend implement)
  - Profile sub-nav clarity: icon + label redundancy → label-only option
- **Success criteria:**
  - 0 inline padding in app dir (grep 0 px-[0-9]+)
  - 11/11 loading.tsx exist + animated
  - Hero accent consistent across 3 pages
  - Component library: 1 Heart pattern canonical
- **Files:** 10 component, 11 page files, components/loading-skeleton.tsx (new)

---

#### **Pkg-3: Donation→Karma Trigger + NGO Admin RLS (Migration 046)**
- **Owner:** supabase-backend + frontend-engineer
- **Secondary:** auth-capacitor (NGO scope)
- **Effort:** 16 hours (2 days)
- **Dependencies:** Pkg-1 (auth guards for donation routes)
- **Scope:**
  - Migration 046: NEW TABLE `donation_karma_snapshot` (user_id, karma_amount, donated_at, ngo_id) OR add column to `donations` + TRIGGER on insert/update
  - Donation form POST handler: (a) Supabase rpc call create_donation + trigger karma, (b) test idempotent (2× submit = 1 karma), (c) webhook callback endpoint for processor
  - NGO admin query RLS: donations filtered by ngo_id (admin can see own NGO donors), payment_config visible only to super-admin
  - FK index: donations.campaign_id, donations.ngo_id (performance)
  - Types.ts manual sync: generate types after migration apply (supabase gen-types)
  - Seed script idempotent: Vol-59 random raised_amount → fixed test data
- **Success criteria:**
  - Donor receives +X karma after donation created (logged in activity)
  - NGO admin sees donation list filtered by ngo_id (RLS verified)
  - 2× submit test: same user same amount = 1 karma entry
- **Files:** Migration 046, lib/supabase/queries/donations.ts, lib/supabase/rpc/create-donation.sql

---

#### **Pkg-4: KVKK Consent Column + Soft Transition UX**
- **Owner:** supabase-backend + auth-capacitor + ux-researcher
- **Secondary:** frontend-engineer, ui-designer
- **Effort:** 14 hours (2 days)
- **Dependencies:** Pkg-3 (RLS policy update if KVKK scope filtering)
- **Scope:**
  - Migration 047: ALTER TABLE profiles ADD COLUMN kvkk_accepted_at TIMESTAMP, ADD COLUMN kvkk_version VARCHAR(10)
  - KVKK consent capture: (a) onboarding step (soft modal, not harsh), (b) donation flow (pre-button check), (c) profile settings (edit consent anytime)
  - Consent UI: toggle + "last accepted [date]" + link to current KVKK doc + version tracking (ADR-009 post-legal)
  - Logout invalidate: cookie cache clear on consent revoke (if applicable)
  - KVKK harsh → soft transition: current harsh text "Bunu kabul etmelisiniz" → empathic "Verileriniz gizlidir. Daha fazla bilgi için…"
  - City deny fallback: if city not saved on KVKK reject → offer "skip for now" button (fallback step)
- **Success criteria:**
  - profiles.kvkk_accepted_at ≠ NULL for ≥98% active users
  - Onboarding KVKK modal dismiss not required to progress (soft)
  - City selection fallback if KVKK skip
- **Files:** Migration 047, onboarding/kvkk/page.tsx (new), lib/supabase/queries/profile-update.ts, components/kvkk-consent.tsx

---

### **TRACK B: Performance + Infrastructure (Parallel)**

#### **Pkg-5: Performance: Monolith Split + RSC Streaming**
- **Owner:** performance-engineer + frontend-engineer
- **Secondary:** system-architect (arch review)
- **Effort:** 20 hours (2.5 days)
- **Dependencies:** None (independent)
- **Scope:**
  - TD-004 membership-flow-client 1103-line analyze: identify high-compute (karma calc, stats) vs low-compute (UI render)
  - RSC streaming: app/dashboard/[section] → split into client boundary; Suspense + skeleton for stats fetch
  - Font subsetting: Türkçe charset (@font-face unicode-range) → verify load time (phonetic chars ş/ğ/ç/ı)
  - Mobile baseline: 3G-slow on iPhone 12 baseline (no device emulation yet, target "Time to Interactive" < 2.5s)
  - Monolith → 2 boundary split: [section]-stats (Suspense) + [section]-ui (client)
  - Vitest perf benchmark: getRecentStreakActivity + karma calc unit test perf (target: ≤50ms per call)
- **Success criteria:**
  - app/dashboard DOM parse ≤1.5s (was 2049ms, target -%36)
  - Font subsetting: zero layout shift on Türkçe text (no invisible period)
  - Mobile CI test: simulated 3G TTI < 2.5s
  - Monolith file: 500 lines (from 1103)
- **Files:** `app/dashboard/[section]/page.tsx` (split), `lib/perf/*` (benchmarks), tailwind font-loading

---

#### **Pkg-6: Payment Webhook Prod Endpoint**
- **Owner:** supabase-backend + product-analyst
- **Secondary:** system-architect (security review)
- **Effort:** 12 hours (1.5 days)
- **Dependencies:** Product decision on processor priority (ADR-008 v3 Accepted)
- **Scope:**
  - Webhook stub removal: `/api/webhooks/fonzip` (current stub "TODO prod") → real payload handler
  - Processor TBD until ADR-008: if fonzip → signature verify + upsert payments table. If iyzico (ADR-008 v2) → different schema
  - Idempotent handler: webhook retry 3× → webhook_event_id dedup table
  - Error logging: silent fail → webhook_logs table with status/error_code
  - Test: mock webhook payload × 3 processor (fonzip/iyzico/paytr) → integration test
  - Security: validate webhook secret from env, rate-limit /api/webhooks (100 req/min)
- **Success criteria:**
  - Real webhook test with processor sandbox (fonzip, iyzico TBD by user)
  - Webhook event logged + idempotent
  - No silent failures (500s logged + alerted)
- **Files:** `api/webhooks/fonzip.ts` (or iyzico), `supabase/migrations/048_webhook_logs.sql`, `lib/webhooks/processor.ts`

---

#### **Pkg-7: Vitest + ESLint + CI/CD Pipeline**
- **Owner:** test-engineer + system-architect
- **Secondary:** frontend-engineer (fixture maintenance)
- **Effort:** 16 hours (2 days)
- **Dependencies:** None (independent)
- **Scope:**
  - Vitest config finalize: jsdom + globals + setupFiles (from Vol-61, complete test scaffold)
  - Test suite: 3 key areas: (a) lib/karma-level.test.ts + lib/tiers.test.ts + lib/auth/guards.test.ts (unit), (b) lib/admin/missions-actions.test.ts (server action integration), (c) components/ui/hero-card.test.tsx (snapshot)
  - ESLint rule enforcement: no-console warn (except test), exhaustive-deps warn, no-unescaped-entities error
  - CI workflow finalize: `.github/workflows/ci.yml` — npm ci → lint → tsc → vitest --run → next build → deploy (when merged)
  - Error boundary coverage: currently 3/31 (10%) → target ≥15 (50%), test all error paths
  - Any audit: 173 `any` usage → triage: (a) supabase.rpc cast (TD-005, defer to supabase gen-types), (b) legacy code, (c) test mock. Prioritize 20 high-impact, aim ≤50 remaining.
  - 75 `'use client'` audit: verify all client boundary justified (state, event handler, browser API) vs mistaken RSC.
- **Success criteria:**
  - CI pipeline green on PR (0 lint/tsc/test failures)
  - Error boundary ≥15/31 (50%) with test
  - `any` count ≤50 (from 173)
  - `'use client'` audit doc + 5 unjustified → candidate for RSC conversion
- **Files:** `vitest.config.ts`, `lib/**/*.test.ts`, `.github/workflows/ci.yml`, `.eslintrc.json`

---

### **TRACK C: Polish + Launch Readiness (Sequential after A+B)**

#### **Pkg-8: STK Admin V1 Min+ Polish (10 sayfa Batch C)**
- **Owner:** frontend-engineer + ui-designer
- **Secondary:** supabase-backend (dashboard query), auth-capacitor (permission check)
- **Effort:** 20 hours (2.5 days)
- **Dependencies:** Pkg-1 (form auth fix), Pkg-2 (loading states), Pkg-7 (CI pipeline)
- **Scope:**
  - Batch C carry-over: blog editor, profile form, membership-config parametric, password reset
  - Blog editor: WYSIWYG → markdown (textarea + preview) or Slate.js lite (tbd by ui-designer)
  - Membership parametric form: renewal terms (auto/manual), pricing (fixed/tiered), perks list builder
  - Password reset: "forgot" link flow (resend, clear), "reset" page UX (new password + confirm + success modal)
  - Dashboard K1 (admin view): donations chart, members trend, verifications pending count
  - Leaderboard rank visual: tie-break rule (same karma, same rank → icon) + tie-breaking story (optional Faz 2)
  - Tier-up celebration: level-up notification (new tier reached) + confetti modal + "share on WhatsApp" button (ready for Faz 2 integration)
  - STK admin RLS audit: verify 15 queries filtered by ngo_id (no data leak)
- **Success criteria:**
  - Batch C 4 forms callable (submit → success) + TSC 0
  - Dashboard K1 charts render (data from migrations 022–047)
  - STK admin user can only see own NGO data (RLS audit pass)
  - Tier-up event created in activity log
- **Files:** `app/admin/[ngoId]/blog/*.tsx`, `app/admin/[ngoId]/membership/page.tsx`, `app/auth/password-reset/page.tsx`, `components/celebrations/tier-up.tsx`

---

#### **Pkg-9: Leaderboard Rank + Heart Pattern UI Fix**
- **Owner:** ui-designer + frontend-engineer
- **Secondary:** design-system-keeper (animation token)
- **Effort:** 8 hours (1 day)
- **Dependencies:** Pkg-2 (component consolidation)
- **Scope:**
  - Leaderboard rank visual: tie-breaking icon (trophy + plus icon side-by-side if same rank), rank number color (gold/silver/bronze tier color, not hardcoded)
  - Heart pattern 4-page consolidation: `/dashboard/causes`, `/dashboard/profile`, `/admin/[ngoId]/members`, `/admin/[ngoId]/beneficiaries` → single `components/heart-pattern.tsx` (SVG + motion)
  - Animation: heart pulse 1.2s cycle (ready-motion baseline) + stagger per row (60ms offset)
  - A11y: aria-label "Featured" or "Organization focus area"
- **Success criteria:**
  - 4 pages all use single Heart component
  - Rank tie visual tested (same karma scores)
  - Animation plays on mount, respects prefers-reduced-motion
- **Files:** `components/heart-pattern.tsx`, 4 page files (refactor import)

---

#### **Pkg-10: Tier-Up Notification + Leaderboard Friends Placeholder**
- **Owner:** frontend-engineer + product-analyst
- **Secondary:** ux-researcher (journey confirmation)
- **Effort:** 10 hours (1.25 days)
- **Dependencies:** Pkg-8 (dashboard activity log), Pkg-9 (leaderboard UI)
- **Scope:**
  - Tier-up event trigger: karma crossing threshold → publish `user_events` row (type: "tier_up", metadata: { tier_name, milestone_karma })
  - Notification UI: toast + modal "You reached [Tier]! 🌟" + "Share achievement" button → coming-soon banner (ADR-006 v2) for social share Faz 2
  - Leaderboard friends tab placeholder: "Coming soon — follow friends' karma" message + "Enable notifications" prompt (badge count)
  - Optional: notification count badge on leaderboard tab icon (activity counter)
- **Success criteria:**
  - Tier-up event created in DB on karma crossing
  - Toast shows with correct tier name + timing < 2s
  - Friends tab shows coming-soon banner (not empty)
- **Files:** `lib/supabase/rpc/check-tier-up.sql`, `components/notifications/tier-up-toast.tsx`, `app/dashboard/leaderboard/friends-placeholder.tsx`

---

#### **Pkg-11: ADR-006 v2 + ADR-008 v3 Review + Finalize**
- **Owner:** product-analyst + system-architect
- **Secondary:** strategy-consultant (if market decision needed)
- **Effort:** 8 hours (1 day)
- **Dependencies:** Pkg-1 (tech foundation), user decision (product/legal)
- **Scope:**
  - ADR-006 v2 (donate routes status): current 3 routes active (app/dashboard/donate/*) → ADR decision: (a) V1.1 canlı, (b) coming-soon banner kullan, (c) remove for Faz 2. User pick + Accepted.
  - ADR-008 v3 (payment processor priority): fonzip V1.1, iyzico/paytr V1.5+ timeline. Processor order ranked by: readiness (fonzip), market (iyzico). Webhook prod per processor. Accepted + tech debt link.
  - 2 ADR → 5-file checklist (ADR file, open.md delete, resolved.md add, workstream link, status board move).
  - No new code, decision + documentation only.
- **Success criteria:**
  - ADR-006 v2 Accepted + action clear (banner or live)
  - ADR-008 v3 Accepted + processor roadmap linked
  - open.md Q48/Q49 removed
- **Files:** `docs/product/03-decisions/006-v2.md`, `docs/product/03-decisions/008-v3.md`, open.md, resolved.md, status board

---

#### **Pkg-12: Launch Readiness Audit + Test Gate**
- **Owner:** test-engineer + system-architect
- **Secondary:** all engineers (final review)
- **Effort:** 12 hours (1.5 days)
- **Dependencies:** Pkg-1 through Pkg-11 (all complete)
- **Scope:**
  - Pre-launch checklist: (a) TSC 0 + ESLint 0, (b) 50+ unit test + ≥80% critical path coverage, (c) Sentry/error logging enabled, (d) Environment variables (prod secrets ready), (e) Database migration rollback tested.
  - P0 bug sweep: any remaining crash/data-loss bug from Vol-61 audit → hot fix or defer to Vol-63.
  - Performance final check: lighthouse score ≥80 (Faz 5 RSC pending), mobile baseline TTI < 2.5s.
  - Security audit: RLS policies reviewed (Pkg-3, Pkg-4, Pkg-8), webhook signature verified, API rate limits applied.
  - Go/no-go decision: 🟢 ready for V1.1 pilot (migration apply + npm install + deploy) or 🔴 one more sprint (document blocker).
- **Success criteria:**
  - Launch readiness report: 4 check items ✅ or documented 🔴
  - Critical P0 bug list = 0 (Vol-61 audit complete)
  - Rollback procedure documented + tested
- **Files:** `docs/_deploy-steps.md` (update), `docs/_launch-readiness.md` (new)

---

## Critical Path Timeline

```
Day 1-3:   Pkg-1 (BUG-066 + TIERS + guards)
           ├─ Day 4-6: Pkg-2 (loading + UX)
           ├─ Day 4-6: Pkg-5 (performance)
           ├─ Day 4-6: Pkg-7 (vitest + CI)
Day 7-8:   Pkg-3 (donation trigger)
           ├─ Day 9-10: Pkg-4 (KVKK)
Day 9-10:  Pkg-6 (webhook)
Day 11-13: Pkg-8 (STK admin)
           ├─ Day 14-15: Pkg-9 (leaderboard)
           ├─ Day 14-15: Pkg-10 (tier-up)
Day 16-17: Pkg-11 (ADR finalize)
Day 18-20: Pkg-12 (launch readiness)

TOTAL: 20 days sequential bottleneck (T1-T2-T3-T4-T8-T12)
PARALLEL: +4 days (B track parallel with A day 4-6)
ACTUAL WALL CLOCK: ~28 calendar days (4 weeks with buffers)
```

---

## Ownership Matrix

| Paket | Owner | Secondary | Effort | Priority |
|---|---|---|---|---|
| Pkg-1 | frontend-engineer + auth-capacitor | system-architect | 24h | P0 |
| Pkg-2 | ui-designer + frontend-engineer | design-system-keeper | 18h | P0 |
| Pkg-3 | supabase-backend + frontend-engineer | auth-capacitor | 16h | P0 |
| Pkg-4 | supabase-backend + auth-capacitor | ux-researcher | 14h | P0 |
| Pkg-5 | performance-engineer + frontend-engineer | system-architect | 20h | P0 |
| Pkg-6 | supabase-backend + product-analyst | system-architect | 12h | P0 |
| Pkg-7 | test-engineer + system-architect | frontend-engineer | 16h | P0 |
| Pkg-8 | frontend-engineer + ui-designer | supabase-backend | 20h | P0 |
| Pkg-9 | ui-designer + frontend-engineer | design-system-keeper | 8h | P0 |
| Pkg-10 | frontend-engineer + product-analyst | ux-researcher | 10h | P0 |
| Pkg-11 | product-analyst + system-architect | strategy-consultant | 8h | P0 |
| Pkg-12 | test-engineer + system-architect | all | 12h | P0 |

**Total effort:** 158 hours ≈ **6 hafta × 1 FTE paralel** (or 4 hafta × 2 FTE)

---

## Parallelizable Tracks

### **Track A (Sequential, critical path):** Pkg-1 → Pkg-2 → Pkg-3 → Pkg-4 → Pkg-8 → Pkg-9 → Pkg-10 → Pkg-12 = 20 days

### **Track B (Parallel with A day 4-6):** Pkg-5, Pkg-6, Pkg-7 = 7.5 days (compressed into A's day 4-6 window)

### **Track C (Sequential after A):** Pkg-11 → Pkg-12 (overlap possible, 1 day before Pkg-12 start)

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| **BUG-066 root cause çıkmazda** (cookie/network timing unknown) | Medium | High | Day 1 timebox 6h; if unclear, escalate to browser DevTools deep-dive + cookie logger | frontend-engineer |
| **KVKK legal feedback gecikirse** (Pkg-4 blocker) | Low | High | Day 7 start Pkg-4 code prep (column + migration) without legal text; legal approved 48h deadline | product-analyst |
| **Payment processor decision delayed** (ADR-008 v3) | Medium | Medium | Start Pkg-6 fonzip endpoint only; iyzico stub for Day 10; processor swap on ADR Accepted | supabase-backend |
| **Vitest setup complexity** (173 any, 75 'use client') | Low | Medium | Use Vol-61 baseline; audit paralel (Pkg-7 splits: test writing vs cleanup) | test-engineer |
| **Performance: monolith split causes data-fetch race** | Low | Medium | Test with network throttling (3G slow); Suspense boundary test (skeleton then data) | performance-engineer |
| **STK admin RLS policy miss** (data leak) | Low | High | Pkg-8 + Pkg-12 RLS audit 2-pass; Supabase RLS simulator test | supabase-backend |
| **Scope creep: Tier-up celebration + leaderboard friends** | Medium | Low | Pkg-10 time-box 10h; friends tab placeholder only (no backend sorting) | frontend-engineer |

---

## Go/No-Go Gate (Sprint Sonu, Day 20)

### **Yeşil → V1.1 Pilot Ready**
- ✅ TSC 0 + ESLint 0 + Vitest ≥80% critical coverage
- ✅ 34 P0 bulgu Vol-61'den 30+ fixed (max 4 deferred to Vol-63)
- ✅ Donation→Karma idempotent tested
- ✅ KVKK consent ≥98% users (profiles table updated)
- ✅ Performance TTI < 2.5s mobile baseline
- ✅ RLS audit: 0 data-leak risk
- ✅ Migrations 046–048 rollback tested
- ✅ Launch readiness report ✅

### **Kırmızı → 1 hafta extra**
- ❌ ≥5 P0 unresolved (critical fix needed)
- ❌ BUG-066 duplicate-submit still happens
- ❌ Payment webhook silent fail logged
- ❌ RLS audit 🔴 gap found
- **Action:** Triage which P0 deferrable to Vol-63, which needs sprint extension

---

## Stop Conditions — Sprint Durması Gereken Şartlar

1. **Critical security bug** (RLS leak, SQL injection) → immediate stop, system-architect review + hot fix + audit
2. **Legal blocker** (KVKK hukuki mütalaa delayed ≥7 days) → Pkg-4 pause; continue A tracks
3. **Processor decision (ADR-008) blocked ≥3 days** → Pkg-6 stub remain; decision escalate to user
4. **Test coverage fail** (CI red ≥2 consecutive merges) → stop feature merges, fix test suite (Pkg-7 refocus)
5. **Performance regression** (TTI >3s from Pkg-5) → performance-engineer deep-dive, block Pkg-8+
6. **User approval needed** (ADR-006/008 decision) → wait outside sprint, parallel work continue

---

## Vol-63 Öngörüsü — Post Vol-62

Şu iş Vol-62'de bitmiş olacak:
- ✅ V1.1 pilot hazır (form, donation, KVKK, performance, test baseline)
- ✅ 30+ P0 fixed
- ✅ STK admin 10 sayfa (Batch C) canlı
- ✅ CI/CD pipeline green

Vol-63'de yapılacak (~Ay 5 ortası → sonu):
- **Faz 2 kickoff:** Matching algoritması (F2.1) + Reward v2 (F2.2-F2.4) + Push notifications + makbuz PDF
- **Remaining P1:** Discover, missions filter, karma log, leaderboard friends (real), notifications, markdown support
- **Test framework expansion:** ≥200 test (from 50), snapshot tests, E2E (Playwright/Cypress)
- **V1.1 pilot launch → V1.2 iteration** (user feedback loop)
- **Payment processors Faz 2:** iyzico integration, PayTR roadmap
- **Design system V2:** Comprehensive token system, 3 tier-color ADR
- **Marketplace mode prep** (ADR-009 + ADR-010 post-legal)

---

## İlk Hareket — Bu Hafta Paralel 4 Paket

### **Start immediately (Day 1 concurrent):**

1. **Pkg-1 (BUG-066 + TIERS + guards)** — frontend-engineer + auth-capacitor
   - Task: Timebox 6h to BUG-066 form reproduce + root cause
   - Parallel: TIERS canonical callsite list + 10 guard template
   - Goal: Day 3 done, Pkg-2/Pkg-3 unblock

2. **Pkg-5 (Performance monolith)** — performance-engineer + frontend-engineer
   - Task: TD-004 1103-line file analysis (profile code path)
   - Parallel: Font subsetting audit (Türkçe charset)
   - Goal: Day 3 split boundary identified, benchmark baseline

3. **Pkg-7 (Vitest setup)** — test-engineer + system-architect
   - Task: Complete vitest config (from Vol-61 scaffold), add 10 unit tests
   - Parallel: ESLint any/use-client audit list (no fixes, scan only)
   - Goal: Day 3 CI pipeline green on feature branch

4. **Pkg-2 preliminary** — ui-designer (background task)
   - Task: Inline padding grep + 10 component candidates
   - Task: 11 loading.tsx page list (priority order)
   - Goal: Day 3 spec ready for Day 4 frontend-engineer merge

**Parallel threads start Day 4:**
- Pkg-2 frontend implement (Day 4-6, after Pkg-1 done)
- Pkg-6 webhook stub removal (Day 4-6, independent)
- Pkg-3 migration 046 write (Day 4-6, pending Pkg-1 guards test)

---

## Status Board Update Format (her paket done'da)

```markdown
## 2026-05-DD HH:MM — [Agent Name]
**İş:** Pkg-N [başlık]
**Durum:** ✅ Done | 🔄 In progress | ⏸ Paused
**Çıktı:** [files changed, handoff link]
**Bloke eden:** [if any]
**Sıradaki:** Pkg-M ready to start (dependency met)
**Effort used:** X hours / Y hours estimate
```

---

## Doküman Referansları

- **ADR-014:** `docs/product/03-decisions/014-tiers-canonical.md` (Pkg-1)
- **ADR-015:** `docs/product/03-decisions/015-server-action-template.md` (Pkg-1)
- **ADR-006 v2:** TBD (Pkg-11)
- **ADR-008 v3:** TBD (Pkg-11)
- **ADR-009:** Post-legal (Pkg-4 prereq)
- **Tech Debt Ledger:** `docs/eng/_tech-debt.md` (TD-001, TD-004, TD-005, TD-006 references)
- **Master plan:** This document (Vol-62)
- **Launch readiness:** `docs/_launch-readiness.md` (Pkg-12 output)

---

## İletişim Protokolü (Zorunlu)

Bkz. `.claude/skills/agent-communication-protocol/SKILL.md`:
- **Handoff log:** Her paket selesai → upstream dosyaya handoff satırı
- **Status board:** `docs/_status-board.md` Pkg-N → Done taşı
- **Peer review:** Critical path Pkg-1 + Pkg-7 + Pkg-12 → system-architect review trigger
- **Stop condition:** Pkg sonu P0 karar/blocker varsa → coordinator pause + user approval

---

**Prepared by:** Coordinator | **Date:** 2026-05-03  
**Next update:** Day 4 checkpoint (Pkg-1/5/7 progress) | **Handoff to:** Frontend Engineer + System Architect (Day 1 start)
