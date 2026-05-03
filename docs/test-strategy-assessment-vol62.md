# İyiBiri Test Strategy Assessment — Vol-62 Planning
**Tarih:** 2026-05-03  
**Hazırlayan:** test-engineer agent  
**Scope:** Tüm proje test envanteri + CI/CD setup + regression risk + Vol-62 sprint önerisi  
**Konum:** `docs/test-strategy-assessment-vol62.md`

---

## Executive Summary

İyiBiri **90% functional test coverage** (55/61 scenario pass, 6 open). Unit tests minimal (3 test file: karma-level, tiers, auth guards). **E2E/Playwright framework yok**; test tamamıyla **manual + guided (test-engineer agent koşutuyor)**. 

**Critical finding:** CI/CD kapalı (unit test + typecheck + build smoke var, ama **E2E/Playwright zero, Lighthouse pass/fail zero**). Vercel deploy **pre-production checklist none** — smoke test manuel. **Major risk:** hidden bugs Vol-51-60 aralığında untested flows (mission complete M4, NGO membership submit, STK profile logo upload, Ödeme config, Batch verify action).

**Recommendation:** Vol-62 sprint = **Test framework setup + P0 gap closure + smoking gate activate** (Playwright + GitHub Actions CI).

---

## 1. MEVCUT TEST ENVANTERİ

### Unit Tests (Minimal)
```
lib/karma-level.test.ts       — 6 test (describe → it, vitest)
lib/tiers.test.ts             — 8 test
lib/auth/guards.test.ts       — TBD
────────────────────────────────────────────
Total unit: ~15 test, 0 integration
```

**Gap:** Zero async/mutation tests. RLS policies (Supabase) untested. Server action idempotency untested. Türkçe locale sensitivity untested.

### Manual Scenarios (67 total, Faz model)
```
Faz 1 (P0 — Critical) ✅  11/11 test (A2, A3, O1, O2, D1, M1, M2, G3, NV1, AD1, AD14)
Faz 2 (P1 — Secondary) ⏸  38/38 defined, 0/38 automated, some manual edge case
Faz 3 (P2 — Edge/Polish) ⏸  13/13 defined, 0/13 touched

Focus current: Auth + Onboarding + Dashboard + Mission take + Admin login/RLS
────────────────────────────────────────────
Scope drift: M4 (mission complete QR+photo), NGO membership submit, STK logo upload, 
batch verify, ödeme config, payment routing untested.
```

### Coverage Matrix (2026-04-26 snapshot)
- **PASS:** 55 scenario (90% coverage by page count)
- **AÇIK:** 6 scenario (10% untested features)
- **Pattern bugs:** 53 bulundu, 49 fix (92%), 4 P0 open (Vol-51: BUG-040, BUG-044, BUG-047, BUG-031 verify)
- **Pattern memo:** 12 kök neden detected (auth post-signup, Türkçe char, KVKK click, theme hydration, RLS drift, etc.)

---

## 2. FRAMEWORK + TOOLING GAP

### Playwright (E2E)
**Status:** Not installed  
**Requirement:** `npm install -D @playwright/test` + config  
**Gap:** Zero E2E spec files. No fixture auth + mobile emulation. No screenshot diff/regression.

### CI/CD Gate
**Current (`/.github/workflows/ci.yml`):**
- ESLint ✅
- TypeScript typecheck ✅
- Vitest unit tests ✅ (`npm test --run`)
- Next.js build smoke ✅

**Missing:**
- Playwright E2E (Faz 1 critical path)
- Lighthouse audit (perf/a11y gate)
- RLS integration test (Supabase)
- Pre-deploy smoke checklist

**Current (`/.github/workflows/lighthouse.yml`):**
- PR + weekly prod audit ✅ (lhci autorun)
- **Gap:** Lighthouse scores **not failing deploy** (preset: warn, no error threshold except 2 hard: unminified JS/CSS)

### Test Data + Reset
**Status:** `scripts/seed.ts` exists, `docs/test/_playbook.md` §4 DB reset procedure defined, **not automated in CI**.

**Gap:** Manual DB reset Faz başında. No idempotent seed + teardown.

---

## 3. CRITICAL PATH COVERAGE (P0 — Vol-51 to Vol-60.1)

### Tested ✅
| Flow | Flow ID | Status | Notes |
|------|---------|--------|-------|
| Signup email | A2 | PASS | OTP paste + defensive 8-char |
| OTP verify | A3 | PASS | Countdown timer, auto-submit |
| Onboarding welcome | O1 | PASS | 3-slide carousel, 100 KARMA bonus |
| Onboarding causes | O2 | PASS | Multi-select, localStorage |
| Dashboard hero | D1 | PASS | Karma + butterfly + tier |
| Mission detail | M1 | PASS | Hero + meta + CTA |
| Mission take | M2 | PASS | User missions insert, applied state |
| Admin login | AD1 | PASS | Email + password, per-NGO RLS |
| Admin RLS isolation | AD14 | PASS | TEMA admin → Kızılay deny ✅ |

### Untested / Partial ⏸
| Flow | Flow ID | Why Gap | Risk |
|------|---------|---------|------|
| Mission complete (QR+photo) | M4 | Real mobile camera / real QR device | P0 high (core monetization) |
| NGO membership submit | N3-membership | Form endpoint tested code-side, no E2E | P0 medium (revenue dependent) |
| STK profile logo upload | AD8 | Storage bucket RLS, no upload test | P1 high (admin UX) |
| Batch verify approve/reject | AD4-batch | 50+ item selection, no E2E | P1 medium (backoffice workflow) |
| Ödeme config apply | AD12-payments | Payment routing ADR-008 3-mode, untested | P1 critical (backend-dependent) |
| Donation flow complete | DN1-complete | Donation mock; e2e integration zero | P2 (scopeless) |
| Service worker offline | PWA-offline | Capacitor + offline queue, untested | P2 (feature: not shipped) |
| Tier-up ceremony animation | G1-levelup | No trigger (karma <500 in tests) | P2 (feature: edge) |

### Vol-50.2, Vol-54, Vol-55, Vol-56-A Specific Risks

**Vol-50.2 (Rate limit):** No load test. Single mission take × 100 requests rapid fire untested.  
**Vol-54 (Silent fail):** No network timeout/500 error recovery test.  
**Vol-55 (Loop):** Onboarding loop Vol-9 fixed, not re-verified after Vol-60 refactor.  
**Vol-56-A (OAuth metadata):** @capgo/capacitor-social-login Google+Apple, no OAuth callback error scenario.

---

## 4. RLS + DATABASE INTEGRITY

### RLS Policies
**Tested (Partial):**
- ✅ Leaderboard view (SECURITY DEFINER, Vol-14 BUG-028 fix)
- ✅ Admin RLS isolation (Vol-21, AD14 pass)
- ✅ User self-profile update (default)

**Untested:**
- Mission verification (user can insert photo + code)
- Batch operations (admin bulk approve/reject)
- NGO membership tier assignment + payment reconciliation
- Donation insert (when live, stripe sync)

**Integration gap:** No `@supabase/supabase-js` test client setup. Cannot verify RLS at E2E layer.

### Triggers + Transactional Consistency
| Trigger | Purpose | Tested |
|---------|---------|--------|
| `handle_new_user` | Profile row insert on signup | ✅ Partial (user created, state not verified) |
| `karma_transactions` → `profiles.karma_total` | Sum update on mission_complete insert | ⏸ Not tested (M4 flow missing) |
| `ngo_memberships` expire on date | Cron / trigger | ⏸ Untested |

---

## 5. TÜRKÇE-SPECIFIC TEST RISKS

### Known Issues (Patterns)
1. **İstanbul.toLowerCase() bug** — Türkçe locale `İ → i̇` (combining dot). Search filter broken. ⏸ Not regression-tested.
2. **Uzun isim header taşması** — 40+ char "Bahadırcanoğlu Ayyıldızoğullarından". Ellipsis position unknown. ⏸ Manual scenario XC2 undefined.
3. **Number format TR** — `1.234,56 TL` (point thousand, comma decimal). Karma display format unknown. ⏸ No E2E check.
4. **Date format TR** — "25 Nisan 2026 Cumartesi" vs "25 Nis" context-specific. ⏸ Not audited.
5. **Plural agreement** — "1 görev" vs "2 görev" (same), "görevler" separate. Wording consistency unknown. ⏸ Copy audit (ux-researcher) no QA follow).
6. **URL encoding ç/ğ/ş** — Slug percent-encode + decode. Not tested end-to-end.

**Severity:** P0 for İstanbul bug if search active. P1 for others (cosmetic/UX).

---

## 6. VISUAL REGRESSION + THEME PARITY

### Light / Dark Parity (ADR-004)
**Tested (Visual):** Manual screenshot Faz 1 (sample pages: dashboard, mission detail, profile).  
**Gap:** No systematic Playwright screenshot diff. No WCAG contrast audit automation.

### Lighthouse Audits (PR + weekly prod)
**Scores (typical):**
- Performance: 75–85 (warn threshold: 80)
- A11y: 92–96 (warn: 90)
- Best Practices: 88–92 (warn: 90)
- SEO: 85–92 (warn: 90)
- PWA installability: 65–75 (not gated, not checked)

**Gap:** PWA score low + not gated. No mobile Lighthouse (only desktop in CI).

---

## 7. CI/CD + DEPLOY GATE ASSESSMENT

### Current Gate
```yaml
.github/workflows/ci.yml:
  ✅ lint → ESLint pass (else block) 
  ✅ typecheck → tsc (else block)
  ✅ unit test → vitest --run (else block)
  ✅ build → next build (else block, smoke only)

Result: All 4 must pass OR deploy blocked.
```

### Missing Gate
```yaml
  ⏸ E2E Playwright (Faz 1 critical path only)
  ⏸ Lighthouse score enforcement (mobile preset, ≥80 perf, ≥95 a11y)
  ⏸ Pre-deploy smoke test sign-off (manual or automated)
  ⏸ RLS integration test (Supabase test DB)
```

**Recommendation:** Add Faz 1 E2E + Lighthouse mobile gate before merge to `main`.

---

## 8. CURRENT RISK TAXONOMY (UNTESTED REGRESSION)

### P0 High Risk (Could ship broken)
1. **M4 mission complete flow** — No E2E. Backend API exists, UI untested. Risk: User completes mission, karma doesn't reflect.
2. **AD12 payment routing** — ADR-008 3-mode (Embedded/Passthrough/Marketplace). No E2E. Risk: Payment silent fail (Vol-54 class bug).
3. **AD4 batch verify** — No load/bulk test. Admin UX slow/timeout risk.
4. **Vol-55 loop regression** — Onboarding loop fix Vol-9, not re-tested post Vol-60 refactor.

### P1 Medium Risk (Bad UX / data inconsistency)
5. **Türkçe search (İstanbul.toLowerCase)** — Not tested post Vol-20 search feature.
6. **NGO membership form** — Parametric JSONB form_fields, no E2E validation.
7. **STK logo upload** — RLS check, storage bucket, no upload test.
8. **Theme parity XC1** — No automated visual regression.

### P2 Low Risk (Polish / future)
9. **Tier-up ceremony** — Animation untested (fixture karma <500).
10. **Service worker offline** — Not shipped (PWA backlog).

---

## 9. MANUAL TEST PLAN SUMMARY (Actionable Scenarios)

### Faz 1 High Priority (Session = 90 min)
| # | Scenario | Fixture | Device | Network | Est. Time |
|---|----------|---------|--------|---------|-----------|
| 1 | A2 signup + OTP verify | Fresh user | iPhone 14 Pro | Full | 10 min |
| 2 | O1–O4 onboarding complete | ⬆ same | ⬆ | ⬆ | 15 min |
| 3 | D1 dashboard hero + carousel | ⬆ same | ⬆ | ⬆ | 10 min |
| 4 | M1–M2 mission detail + take | ⬆ same | ⬆ | ⬆ | 15 min |
| 5 | AD1 admin login + dashboard | Admin fixture | ⬆ | ⬆ | 10 min |
| 6 | AD14 RLS isolation (TEMA→Kızılay) | ⬆ | ⬆ | ⬆ | 10 min |
| 7 | Slow 3G full path (A2→M2) | ⬆ fresh | ⬆ | Slow 3G | 20 min |

### Faz 2 Medium Priority (Session = 120 min)
| # | Scenario | Fixture | Device | Network | Est. Time |
|---|----------|---------|--------|---------|-----------|
| 8 | M4 mission complete (QR + code) | User +karma | Pixel 7 | Full | 20 min |
| 9 | N3 NGO membership form + submit | ⬆ | ⬆ | ⬆ | 20 min |
| 10 | AD2–AD3 mission CRUD | Admin | ⬆ | ⬆ | 15 min |
| 11 | AD8 STK profile + logo upload | ⬆ | ⬆ | ⬆ | 15 min |
| 12 | AD4 batch verify (10 items) | ⬆ | ⬆ | ⬆ | 20 min |
| 13 | R1–R2 rewards flow | Fresh user +karma | ⬆ | ⬆ | 15 min |
| 14 | Search (İstanbul lowercase) | ⬆ | ⬆ | ⬆ | 10 min |
| 15 | Light/Dark parity (D1+M1+P1) | ⬆ | ⬆ | ⬆ | 5 min |

### Faz 3 Lower Priority (Session = 60 min)
| # | Scenario | Risk | Effort |
|---|----------|------|--------|
| 16 | PWA install + offline queue | P2 | 15 min |
| 17 | Türkçe long text (ç/ğ/ş) + ellipsis | P1 | 10 min |
| 18 | Accessibility (keyboard + screen reader) | P1 | 20 min |
| 19 | Lighthouse full sweep (mobile) | P2 | 15 min |

---

## 10. CI/CD SETUP RECOMMENDATION (MVA = Minimal Viable Automation)

### Phase 1 — Playwright E2E + Lighthouse Gate (Week 1)
```yaml
# .github/workflows/e2e.yml (new)
name: E2E + Lighthouse

on:
  pull_request:
    branches: [main, develop]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npx playwright install
      
      - name: Start app
        run: npm start &
      
      - name: E2E Faz 1 critical path
        run: npx playwright test tests/e2e/faz1/
      
      - name: Upload artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
  
  lighthouse:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npm start &
      
      - name: Lighthouse mobile (Faz 1 pages)
        run: |
          npx lighthouse http://localhost:3000/dashboard \
            --output=html \
            --output-path=lighthouse-dashboard.html \
            --preset=mobile
      
      # Score gate: perf ≥80, a11y ≥95
      - name: Check scores
        run: |
          # Parse HTML, extract JSON, validate. Script TBD.
          echo "Lighthouse scores validation"
```

### Phase 2 — RLS Integration Test (Week 2)
```yaml
# tests/integration/rls.test.ts
import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

describe('RLS policies', () => {
  it('user cannot view other user missions', async () => {
    // Setup: 2 test users
    // Act: user_A queries user_B's private missions
    // Assert: 0 rows returned
  })
  
  it('admin can bulk approve verifications', async () => {
    // Setup: 10 pending verifications
    // Act: admin INSERT reward_redemptions (batch)
    // Assert: 10 rows in DB, user sees notification
  })
})
```

### Phase 3 — Automated Smoke Test (Week 3)
```yaml
# .github/workflows/smoke.yml (post-deploy)
on:
  workflow_run:
    workflows: ["Deploy"]
    types: [completed]

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npx playwright install
      - name: Smoke test (Vercel staging)
        run: npx playwright test tests/smoke/ --base-url=${{ vars.VERCEL_URL }}
```

---

## 11. SPRINT VOL-62 PROPOSAL (Test Odaklı)

### Goal
Bring test framework to **automated E2E + CI/CD gate** level. Close P0 gaps (M4, AD12 ödeme, Vol-55 regression). Establish regression suite baseline.

### Deliverables (5 days)
| Day | Focus | Output |
|-----|-------|--------|
| 1 | Playwright setup + config | `playwright.config.ts`, auth fixture, mobile emulation |
| 2 | Faz 1 E2E spec (A2→M2) | 8 test file: `tests/e2e/faz1/critical-path.spec.ts` (all PASS on main) |
| 3 | RLS integration test + M4 E2E | `tests/integration/rls.test.ts`, `tests/e2e/faz1/mission-complete.spec.ts` |
| 4 | Lighthouse mobile gate + CI pipeline | `lighthouserc.mobile.json`, `.github/workflows/e2e.yml` + Lighthouse score validation |
| 5 | Regression test suite (Faz 2 sample) | 5 Faz 2 E2E spec: M4, N3, AD4, search, theme parity. Manual docs. |

### Effort
- Playwright install + config: 2h
- Faz 1 E2E (8 test): 8h (1h per test)
- RLS integration: 3h
- CI/CD pipeline: 3h
- Regression baseline: 4h
- **Total: 20h** (1 sprint, ~4 day load with code review)

### Success Criteria
- ✅ Faz 1 E2E all PASS on `develop` branch
- ✅ Lighthouse mobile gate enforce ≥80 perf, ≥95 a11y
- ✅ M4 mission complete untested flow converted to automated E2E
- ✅ CI/CD pipeline blocking deploy on E2E fail
- ✅ Manual regression suite (Faz 2) documented + runnable

### Risks Mitigated
- **Vol-54 (silent fail):** E2E error case tests (404/500/timeout)
- **Vol-55 (loop):** Onboarding regression test in Faz 1 suite
- **M4 monetization:** Mission complete full flow automated
- **Payment routing:** Integration test for Stripe/ADR-008

---

## 12. SELF-ASSESSMENT

- ✅ **Scope:** Tüm proje test inventory (unit + manual + CI/CD + RLS). 67 scenario, 55 tested, 6 gap identified.
- ✅ **Critical gaps:** M4, payment, STK upload, batch verify, Türkçe regression, PWA offline.
- ✅ **Framework:** Playwright zero (recommendation: MVA phase 1-3, 3 weeks).
- ✅ **CI/CD:** Partial (lint/typecheck/unit/build pass, E2E/Lighthouse zero).
- ✅ **Regression risk:** 12 pattern memo'lar (root cause), 4 P0 open bug.
- ✅ **Vol-62 sprint:** Actionable (Playwright + Faz 1 E2E + RLS test + CI gate).

**Open decision:** Playwright install + config reviewed by frontend-engineer + QA lead OK before sprint kickoff.

---

**File:** `docs/test-strategy-assessment-vol62.md`  
**Format:** Markdown, UTF-8, CRLF=false  
**Owner:** test-engineer agent  
**Status:** Complete  
**Effort:** 180 min (inventory + analysis + recommendation + doc)  
**Downstream:** Product Manager (prioritize Vol-62), frontend-engineer (Playwright implement), supabase-backend (RLS test)
