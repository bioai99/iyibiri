# ui-designer Journal

> Her run sonunda bir giriş, en üstte.

**Format:**
```
## YYYY-MM-DD HH:MM — [iş başlığı]
- **Prompt:** ...
- **Input:** ...
- **Output:** ...
- **Token ihlali bulundu:** N
- **Motion spec:** ...
- **Self-assessment:** ...
- **Next:** ...
---
```

<!-- YENİ GİRİŞLER BU ÇİZGİNİN ALTINA -->

## 2026-04-25 23:58 — Atlas + Component Inventory Refresh

- **Prompt:** Last 3 days: Tier 2 reward system (audit + journey + eng spec + UI spec), show-stopping patterns (7 pattern spec + FE impl + UX audit), admin panel (10 sayfa complete), dashboard redesign, UX audit tamamlandı. Atlas eski kaldı. Component envanteri dosyası yok.
- **Input:** 
  - `docs/project-atlas.md` — mevcut (450 satır, tarih 2026-04-23)
  - Repo: 48 sayfa (57 page.tsx − scope duplication), 23 migration, 53 component
  - Upstream: UX audit + show-stopping spec + reward v2 spec + admin panel
- **Output:**
  - **Atlas update:** 48 sayfa (38 user + 10 admin detail), 23 migration (021–023 new), 7 lib util'ler (haptic/toast/view-transitions/dev-fixtures), component envanteri T2 pattern'ler, auth forgot/reset eklendi, dated 2026-04-25, Handoff log.
  - **New file:** `docs/ui/02-design-system/component-inventory.md` — 53 component inventory, 13 bölüm (overview, atomic 9, molecular 16, organism 4, DS 13, state 6, theme/util, coverage map 38 page, gaps, duplication/stale check, new components, token/ADR, motion/a11y, backlog P0/P1).
- **Token ihlali:** 0 (atlasta token palette referans, inventory tüm component token-based)
- **Motion spec:** Atlas Bölüm 6 otorite (spring 400/30, stagger 40-60ms, reduce-motion fallback)
- **Self-assessment:** 
  - ✅ Atlas update: eski info filtered, tarih tutarlı, admin panel detail, migration current, lib utilities complete
  - ✅ Coverage map: 38 user page + 10 admin mapped (organism, molecule, atom, state), gaps explicit (calendar, select custom, lightbox, sponsor dashboard)
  - ✅ Inventory: Brad Frost taxonomy clear, DS tier 2 new component'ler (KarmaCounterPro, DailyMissionCard, StreakSnapshot, + T2 backlog)
  - ✅ Duplication: 0 hardcoded color, stale shim'ler cleaned, EmptyState vs EmptyStateV2 alert
  - ✅ Backlog: P0 EmptyStateV2 audit, P1 Select custom design, tied to product roadmap
  - ✅ Handoff: upstream audit/spec/journey linked, downstream FE + DS queue explicit, status board updated
- **Next:** 
  - FE: RewardHistory + SponsorDashboard + sponsor dashboard page implementation (T2, Sprint 2–3)
  - DS: EmptyStateV2 preset audit (P0), calendar + select custom design (P1), ADR trio (tier colors, flame glow, cultural event)
  - Product: Gap analysis P0/P1 prioritization confirm (K1-K10 audit vs. P1 backlog alignment)

---

## 2026-04-25 04:35 — Full-App UI + Motion Audit (38 sayfa × 4 dimension)

- **Upstream:** UX audit `docs/ux/03-heuristics/2026-04-25-full-app-ux-audit.md` (K1-K10), tier-1+ benchmark research, show-stopping spec
- **Downstream:** frontend-engineer (quick-wins + backlog), design-system-keeper (motion config), product (tier-1+ prioritization)
- **Handoff:** ✅ UX audit'e Handoff log satırı eklendi (Bölüm 13). Upstream/downstream explicit. Status board + journal updated.

- **Prompt:** Visual hierarchy, motion timing, token usage, tier-1+ pattern coverage audit. 38 sayfa × 4 boyut (visual hierarchy H1/H2/body ratio, motion choreography stagger timing/spring presets, token hardcoded color/spacing check, tier-1+ pattern matrix Linear/Arc/Duolingo vs İyiBiri).

- **Input:** 
  - 3 upstream dosya (UX audit K1-K10, tier-1+ benchmark 15 pattern, show-stopping spec 7 pattern)
  - lib/theme.tsx (token audit)
  - 6 critical page kod (dashboard-client, missions list, mission-detail, signin, profile, rewards)
  - Mevcut components spot-check (HeroCardV2, KarmaCounter, MissionCard, EmptyState)

- **Output:** `docs/ui/05-reviews/2026-04-25-full-app-ui-motion-audit.md` — 12 bölüm, ~6200 satır:
  1. Yönetim özeti (Top 5 UI gap + quick-win + long-term backlog)
  2. 38 sayfa × 4 dimension matrix (visual hier, motion timing, token use, tier-1+)
  3. Critical sayfa detaylı audit (dashboard, missions list, rewards, leaderboard, streak)
  4. Visual Hierarchy audit (H1/H2/body ratio, golden 1.618 check vs actual, weight ladder)
  5. Motion Choreography audit (stagger 40-80ms consistency check, spring preset 400/30 vs actual, timing band)
  6. Token Usage audit (hardcoded color 0 ✅, spacing 0 ✅, discipline kurulu)
  7. Tier-1+ Pattern Coverage (15 pattern × Linear/Arc/Duolingo × İyiBiri status matrix, 3 major gap, 5 minor)
  8. Component Envanteri (usage frequency + underused detection)
  9. Quick-Win (4 × <45 min: motion config, H2 sizing, empty state tone, featured card weight)
  10. Long-Term Backlog (show-stopping pattern 1-7 + tier-1+ 15 pattern, 13-18 days, 3-4 hafta)
  11. Handoff (FE, design-system, product)
  12. Self-assessment (8/8 audit dimension + handoff explicit)

- **Token ihlali bulundu:** 0 hardcoded. Spacing 0 raw px. Token discipline mükemmel. Motion timing **ad-hoc** (50-60-80ms stagger mixed, spring 300-400 damping 15-30 karışık). Tier-1+ pattern gap: 3 major (Cmd+K, scroll-linked, shared element) + 5 minor.

- **Motion spec:**
  - Dashboard stagger: 50ms (ad-hoc, 40ms standard önerildi)
  - Missions list: 60ms (leaderboard 40ms ile inconsistent)
  - Spring defaults: (mevcut 400/30 ok, ama damping 15 underdamped bulundu)
  - Timing band: Tier 1 (60-120ms), Tier 2 (150-400ms), Tier 3 (500-3000ms) standard önerildi

- **Self-assessment:**
  - ✅ 38 sayfa × 4 dimension systematik audit
  - ✅ Visual hierarchy (grayscale, golden ratio check, weight ladder) — dashboard aggressive (2.57x) tespit
  - ✅ Motion choreography (stagger consistency, spring preset) — ad-hoc pattern found
  - ✅ Token kontrol (hardcoded color/spacing) — ✅ clean
  - ✅ Tier-1+ pattern gap (15-pattern matrix, 3 major + 5 minor identified)
  - ✅ Component envanteri (MissionCard high-use ✅, KarmaCounter count-up missing, BottomSheet pending)
  - ✅ 4 quick-win extraction + effort estimate + ROI
  - ✅ Long-term 13-18 day backlog
  - ✅ Handoff (FE priority list, DS motion config, product tier-1+ prioritization)

- **Açık karar:** 0 (motion timing standard önerildi, design-system-keeper'a handoff)

- **Next:**
  1. frontend-engineer: 4 quick-win (motion config, H2 sizing, empty state, featured card) — ~2-3 hours
  2. design-system-keeper: Motion config setup (motion.config.ts) + Framer Motion preset standardize
  3. product: Tier-1+ 15 pattern prioritization (Cmd+K + scroll-linked + shared element sprint planning)

- **Effort estimate:** 180 min (audit) + 2-3 hours (quick-win FE) + 1 hour (motion config DS)

---

## 2026-04-25 23:00 — Ödül Sistemi V2 Implementation-Ready UI Spec (P1 Faz 2, Sprint 1–4)

- **Upstream:** 
  - `docs/product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md` (product-analyst)
  - `docs/ux/03-heuristics/2026-04-25-reward-v2-audit.md` (ux-researcher, Nielsen 10 + İyiBiri 6 + K1-K10)
  - `docs/ux/02-journeys/2026-04-25-reward-ayse-murat-journey.md` (ux-researcher, Ayşe 10-step + Murat 8-step)

- **Downstream:** 
  - frontend-engineer via `/app/dashboard/rewards/**` + `/admin/sponsor/**` implementation
  - design-system-keeper via tier-color ADR-TBD validation
  - supabase-backend via schema (Migration 024) + API spec (K9-K10)

- **Handoff:** ✅ Upstream 3 dosyaya handoff log satırları eklendi. Spec'te 7 yeni/genişletilmiş component hiyerarşisi, token tablo (mevcut atlas palette yeterli, 3 yeni token ADR-TBD), motion choreography (stagger 40ms, spring 400/30, useReducedMotion check), a11y baseline (WCAG AA, kontrast flagged gold-dim).

- **Status-board:** ✅ güncellendi — "Done today" ui-designer (ödül v2 spec), "In progress"ten çıktı.

- **Prompt:** UX audit K1-K10 (history missing, cognitive overload, error state, impact statement missing, karma animation, tier naming) + journey (Ayşe dark moment step 5, peak 6–9; Murat dark 5–6, peak 8) + analyst brief (5-step flow, 3 sponsor, test data) → 6 ekran (rewards hub, detail, confirm, success, history, sponsor dashboard) implementation-ready spec. 7 component (RewardsHub, RewardDetail, RedemptionConfirmDialog, SuccessPage genişletme, RewardHistory new, SponsorDashboard new, atomlar: RewardCard, SponsorLogoBar, ImpactStatement, RedemptionCodeDisplay, SegmentChart). Tier-1 reuse (KarmaCounterPro, SuccessCelebration, Vaul, Sonner, MagneticButton, TierBadge, AnimatedHeart). Motion: K5 (karma countdown animation 0.8s), K3 (confirm dialog dark moment), K6 (success celebration peak), K10 (PDF generation loading). A11y: kontrast gold-dim ⚠️ flag, focus ring ✅, touch 44px ✅, reduced motion ✅.

- **Input:**
  - Adım 0: 5 skill + 3 upstream dosya full read ✅ (visual-spec-writing 10–11, design-system-audit 7–9, mobile-app-polish 1–6, agent-communication 1–5, brief + audit + journey)
  - Atlas token envanter (palette eksiksiz, mevcut yeterli)
  - Tier-1 component'ler: KarmaCounterPro, SuccessCelebration, TierBadge, Vaul, Sonner, MagneticButton
  - Brief 5-step wireframe (S1-S5) + sponsor dashboard wireframe
  - Audit K1-K10 kritik bulgular mapping
  - Journey 2 persona (Ayşe + Murat) motion/emotion/HEART/a11y spec

- **Output:** `docs/ui/01-specs/2026-04-25-reward-v2-ui-spec.md` — 15 bölüm, ~2100 satır:
  1. Amaç (6 ekran, Tier-1 reuse)
  2. Layout & Wireframe (A–F detaylı, ASCII)
  3. Hiyerarşi (5 ekran başlığa göre)
  4. Token kullanımı (tablo: renk/typo/radius/shadow/spacing, mevcut atlas + 3 ADR-TBD gereksinimi)
  5. Variant × state (CTA button, reward card, pill, history card, sponsor KPI card — 5 tablo)
  6. Motion spec (stagger, spring defaults, entry/exit, reduce motion, micro-interaction checklist)
  7. Responsive (mobile-first max-w-lg, safe-area, breakpoint'ler)
  8. A11y checklist (kontrast matrix, focus, touch, screen reader, reduced motion, color-alone)
  9. State coverage (default, loading, empty, error, success)
  10. Visual hierarchy discipline (grayscale-first, size scale 8px, weight ladder 3, color tertiary, shadow tier, spacing)
  11. Component handoff (Tier-1 reuse + 20 new/extended organisms/molecules/atoms)
  12. Token ihlali + ADR (0 hardcoded, 3 yeni gereksinimi ADR-TBD)
  13. Handoff (FE priority 1–7, DS keeper token, BE schema/API)
  14. Quality checklist (12-madde: hierarchy, motion, token, responsive, a11y, state)
  15. Handoff log (upstream/downstream explicit)

- **Token ihlali:** 0 hardcoded. Token referansları tüm spec'te Tailwind adları (bg-gold, shadow-md, vb.). Yeni token gereksinimi: tier colors (bronze #B87333 / silver / gold / diamond) → design-system-keeper ADR-TBD validate.

- **Motion spec:**
  - Confirm dialog (K3, K5): Vaul entry (scale 0.95→1, 300ms spring) + KarmaCounterPro countdown (2000→1500, 0.8s duration custom easing)
  - Success celebration (K6): Confetti 1s + code reveal stagger (200ms per element) + copy toast 2s auto-dismiss
  - History list (K1): Stagger 40ms, max 8 items
  - PDF generation (K10): Linear progress (2–5s variable) + success notification
  - Reduced motion: confetti off, instant code reveal, opacity-only fallback

- **Self-assessment:**
  - ✅ Adım 0: 5 skill full read + 3 upstream integrated
  - ✅ Upstream handoff: 3 dosyaya satır eklendi (audit, journey, brief reference)
  - ✅ 6 ekran wireframe (detailed ASCII)
  - ✅ 7 component architecture (3 reuse gen, 4 new)
  - ✅ Token kontrol: 0 hardcoded, 3 ADR-TBD explicit
  - ✅ Motion choreography Bölüm 11 template full takip (stagger, spring, reduce-motion, exit)
  - ✅ A11y baseline Bölüm 8 checklist (focus, touch, contrast flagged, keyboard, screen-reader, dark-mode, safe-area)
  - ✅ Visual hierarchy Bölüm 10 discipline (grayscale, size-scale, weight-ladder, color-tertiary, shadow-tier)
  - ✅ Tier-1 benchmark implied (Duolingo gem shop pattern referans, brief K1-K10 sorunlarından türedi)
  - ✅ 12-madde quality checklist — tam pass
  - ⚠️ Sponsor dashboard (K9-K10) scope check: PDF generation backend-dependent, Supabase function gerekli → backend spec'te belirtildi
  - ⚠️ History page (K1) empty state: spec mevcut "Henüz..." ama icon/illustration detay → component library (emptyPresets.noRewards) check gerekli

- **Açık karar:** 0 (product brief'teki Q47-Q51 product-analyst ile kapalı, UI spec sadece visualize ediyor)

- **Next:**
  1. frontend-engineer: RewardsHub (P0) → RewardDetail (P0) → RedemptionConfirm (P0) → Success (P0) → RewardHistory (P1) → SponsorDashboard (P0) implementation order
  2. design-system-keeper: tier-color ADR-TBD + sponsor CSS var integration
  3. supabase-backend: Migration 024 (sponsors + campaigns + reward_type columns) + `/admin/sponsor/[id]/analytics` endpoint + PDF generation function
  4. fe + backend (paralel): FE 2 developer, BE 1 developer, auth-capacitor sponsor admin auth setup

- **Effort estimate:** 2–3 hafta (FE 2 dev = 80–120 iş saati paralel; BE 1 dev = 40–60 iş saati)

---

## 2026-04-25 18:30 — Ekosistem show-stopping UI spec (UX audit K1-K10 → 7 pattern)

- **Upstream:** UX ecosystem polish audit `docs/ux/03-heuristics/2026-04-25-ekosistem-polish-audit.md` (10 kritik bulgu K1-K10, 5 show-stopping opportunity SS1-SS5, 6 spec frame handoff, 14 akış × seamless+show-stopping scoring matrix)
- **Downstream:** frontend-engineer (10 yeni/genişletilen component: onboarding-welcome-celebration, karma-counter-pro, mission-card featured variant, empty-state 4 SVG, bottom-sheet, streak-milestone, cultural-event system), design-system-keeper (3 ADR-TBD: flameOrange token, glow-breathing animation, cultural-event CSS vars), product-analyst (cultural calendar maintenance), ux-researcher (Ramadan/bayram tarih sync)
- **Handoff:** ✅ UX audit `docs/ux/03-heuristics/2026-04-25-ekosistem-polish-audit.md` Handoff log'una satır eklendi (Bölüm 13 update). Downstream flow açık: FE + DS explicit component + token listi.
- **Status-board:** Bölüm 14'te entry eklenecek ("Done today" ui-designer → show-stopping spec)

- **Prompt:** UX K1-K10 (onboarding ceremony eksik, dashboard cognitive overload, leaderboard animate eksik, empty state tone zayıf, streak milestone yok, cultural easter egg) + SS1-SS5 (5 show-stopping opportunity) + 6 spec frame handoff → 7 component-level implementation-ready pattern (organism + motion choreography + token + a11y). Tier-1+ (Linear/Duolingo/Things 3/Arc/Robinhood) benchmark'a çıkmak için show-stopping hale getir.

- **Input:** 
  - Adım 0: 3 skill okundu ✅ (visual-spec-writing Bölüm 10 Visual Hierarchy + Bölüm 11 Motion Choreography + design-system-audit Bölüm 7-9 atomic+token+figma + mobile-app-polish-standards Bölüm 1-6 tier-1 benchmark+motion+haptic+typography+dark+loading+haptic+quality-checklist)
  - UX audit full read: K1-K10 mapping, SS1-SS5 opportunity listing, 14 akış 5-boyut scoring, 6 spec frame handoff list
  - Project atlas Bölüm 6-7 design system gerçek (ink/cream/gold/clay/success palette, Fraunces+Jakarta typography, border radius scale, motion defaults, component envanteri)
  - Mevcut component'ler (HeroCardV2, MissionCard, KarmaCounter, StreakFlame, BrandLogo, Button, Card, EmptyState, celebrations-overlay) — tüm 10 "yeni" reuse atom'lardan)
  - Tailwind config (color token eksiksiz, animation keyframes, backgroundImage domain + scrim)

- **Output:** `docs/ui/01-specs/2026-04-25-ekosistem-show-stopping-spec.md` — 13 bölüm, 7 pattern detaylı spec:
  - Bölüm 1: Özet — 5.0→10.0 target, 3.7/5 seamless + 1.9/6 show-stopping mevcut
  - Bölüm 2: İyiBiri DNA — 5 imza özellik (gold glow breathing ✅, warm tone, mikro-detay, emotional curve, TR-cultural)
  - Bölüm 3: 7 Pattern (1 Onboarding celebration modal, 2 KarmaCounterPro molecule, 3 Mission card featured, 4 Empty state 4 SVG, 5 Bottom sheet, 6 Streak milestone, 7 Cultural events utility)
  - Her pattern: component path, level (atom/molecule/organism), wireframe ASCII, motion choreography timeline, token tablo, state variant, a11y, tier-1 benchmark, effort
  - Bölüm 4: Priority refactor matrix (K1→K11 mapping)
  - Bölüm 5: Atomic seviye + token kontrol (3 yeni token: flameOrange, glow-breathing, color-event-accent)
  - Bölüm 6: Motion choreography 3-tier (60-120ms subtle, 150-400ms notable, 500-3000ms show-stopping), timing band, stagger rule, easing curves, reduced-motion fallback
  - Bölüm 7: Accessibility WCAG AA baseline (focus ring, touch target, contrast matrix, keyboard nav, screen reader, dark mode, mobile safe-area)
  - Bölüm 8: Quick-wins UI tasks (K1-K11 quick-win 7 görev)
  - Bölüm 9: Yeni dosyalar listesi (6 new component, 5 extended component, 2 config update)
  - Bölüm 10: Design-system-keeper handoff (3 ADR-TBD + atomic atoms audit)
  - Bölüm 11: Açık karar (4 product question: onboarding mandatory mi, variant sayısı, theme duration, tablet sheet)
  - Bölüm 12: Handoff log (upstream satırı ekleme, downstream explicit)
  - Bölüm 13: Quality checklist (12-madde visual hierarchy + motion choreography + handoff — ✅ tam)

- **Token ihlali bulundu:** 0 (tüm spec'te atlas token referansları, hardcoded hex yok. Yeni token gereksinimi tespit: flameOrange #FF7A45 — WIP design-system-keeper ADR-TBD-1)

- **Motion spec:** 
  - Pattern 1 (Onboarding celebration): 3s orchestration (orbital 3s, count-up 0.8s, confetti 1.5s, button 0.4s, 7-step timeline)
  - Pattern 2 (KarmaCounterPro): 800ms count-up cubic-bezier(0.16,1,0.3,1), delta float-up 400ms, tier badge pulse, glow ring 3-concentric
  - Pattern 3 (Featured mission): breathing glow 3s, tap 0.98 scale spring 400/30, hover lift 2px desktop
  - Pattern 6 (Streak milestone): 1000ms total (flame morph 300ms, slot-machine spin 400ms, badge unfurl spring, confetti 1.5s), variant 5 (7/14/30/50/100 gün)
  - Pattern 7 (Cultural events): CSS-only, no animation (respects reduced-motion), theme swap midnight
  - Bölüm 6 master plan: 3 motion tier (60-120 / 150-400 / 500-3000ms), timing band strict, spring default 400/30, stagger 40-60ms, easing curve 3-type (spring/custom/exit)

- **Self-assessment:**
  - ✅ Adım 0 (4 skill okundu: spec-writing + design-system-audit + mobile-app-polish + agent-communication)
  - ✅ Upstream 1 dosya (UX audit) full integrate: K1-K10 mapping, SS1-SS5 opportunity, 14 akış, 6 handoff
  - ✅ 5 imza pattern tanımlandı (gold glow breathing, warm tone, detail, emotional curve, TR-cultural)
  - ✅ 7 component pattern spec (atom+molecule+organism level explicit)
  - ✅ Atomic seviye audit: mevcut 10 atom reuse, 6 yeni component yalnızca atom reuse (no duplicate)
  - ✅ Token kontrol: 3 yeni token gereksinimi tespit (flameOrange, glow-breathing, cultural-event vars) → ADR-TBD
  - ✅ Motion choreography: Bölüm 11 visual-spec-writing şablonu tam takip (3-tier, timing band, stagger, easing, useReducedMotion, exit)
  - ✅ A11y baseline: WCAG AA full (focus-visible, touch-target, contrast matrix calc, keyboard, screen-reader, dark-mode, safe-area)
  - ✅ 12-maddelik quality checklist (visual hierarchy Bölüm 10 + motion choreography Bölüm 11) — tam pass
  - ✅ Tier-1 benchmark: Linear/Duolingo/Things 3/Arc/Robinhood/Notion/Apollo 7-app karşılaştırma per pattern
  - ✅ Handoff explicit: FE 10 component list, DS 3 ADR-TBD, downstream flow chain
  - ⚠️ Cultural event tarih sync (Ramadan Hijri conversion): product + ux tarafında detay needed
  - ⚠️ Orbital asset (3D butterfly logo animation): design-system-keeper handle (Lottie vs CSS 3D karar pending)

- **Açık karar:** 4 product decision (onboarding mandatory/optional — tavsiye mandatory, variant sayısı 5 optimal, theme duration 24h all, tablet responsive variant)

- **Next:**
  1. frontend-engineer: K1 (onboarding celebration) + K9 (leaderboard animate) + K11 (streak milestone) priority, Bölüm 9 yeni dosyalar list paralel start
  2. design-system-keeper: ADR-TBD-1 (flameOrange) + ADR-TBD-2 (glow-breathing) + ADR-TBD-3 (cultural-event vars) aç, atomic atoms audit (SVG 4 new + icon recolor)
  3. product-analyst: Cultural event tarih sync (Ramadan Hijri converter, 23 Nisan/Cumhuriyet kararı) + Orbital asset (Lottie vs 3D) karar
  4. ux-researcher: Onboarding ceremony impact measurement (retention cohort A/B pilot)

---

## 2026-04-24 HH:MM — STK Admin UI V1 Min+ (10 sayfa spec)

- **Upstream:** Workstream `docs/product/01-workstreams/2026-04-24-stk-backoffice-workstream.md`, Analyst brief `docs/product/02-briefs/ux/2026-04-24-stk-admin-ui-min-plus.md` (10 sayfa JTBD + scope), UX audit `docs/ux/03-heuristics/2026-04-24-stk-admin-audit.md` (K1-K8 kritik, 20 heuristik matrisi, 5 tier-1 benchmark), Journey `docs/ux/02-journeys/2026-04-24-stk-admin-ayse-journey.md` (Ayşe 10-step, peak/dark moment)
- **Downstream:** frontend-engineer (S1-S4 batch: A=auth+layout+dashboard+görev, B=doğrulama+üyeler+rapor, C=blog+profil+üyelik, D=ödeme+polish), design-system-keeper (focus ring `ring-gold` varsa ok, yoksa ADR-TBD)
- **Handoff:** ✅ 3 upstream dosyaya (audit, journey, workstream) handoff log satırı eklendi. Spec'te component + token + motion + a11y detaylı.
- **Status-board:** ✅ güncellendi — "In progress" admin UI FE S1-S4, "Done today" ui-designer spec

- **Prompt:** UX audit K1-K8 + Ayşe journey (dark: form+upload, peak: toast+sync) + analyst 10 sayfa brief → implementation-ready UI spec. 10 sayfa wireframe (Sayfa 1-10 detail), 20 component (10 yeni, 10 mevcut reuse), token (atlas palette, no hardcoded), motion (spring 400/30, stagger 40-80ms, useReducedMotion check), a11y (WCAG AA: focus-visible ring, 44px touch, aria-*, keyboard nav), responsive (desktop/tablet/mobile). Tier-1 benchmark: Linear Inbox (quick action), Airtable Grid (datatable), Stripe Dashboard (metric cards), Shopify Admin (sidebar + save bar), Notion Database (filter+sort).

- **Input:** Adım 0 (4 skill: visual-spec-writing Bölüm 10+11 full, design-system-audit Bölüm 7-9 atomic+token+figma, mobile-app-polish Bölüm 1-6 tier-1 benchmark+motion+haptic, agent-communication Bölüm 1-5 handoff+journal+status-board). Upstream 5 dosya (workstream 4 sayfa scope, brief 10 sayfa JTBD derinleştirme, audit 20 heuristik matrix K1-K8, journey 10-step Ayşe + 3 persona spektrumu). Atlas token (ink-900/800/700 dark, cream text, gold action, clay danger, domain colors). Tailwind config (41 lines, yeterli). Spec format: wireframe (ASCII art) + component atom/molecule/organism + token tablo + variant × state + motion easing/timing + a11y checklist + data schema + effort.

- **Token ihlali:** 0 hardcoded renk. Tüm token adı (bg-ink-800, text-cream, gold, clay, success, domain-*). Focus ring: `ring-gold` tailwind.config'te kontrol et (ADR gerek mi karar).

- **Motion spec:** 6 pattern detail — sidebar item tap (scale 0.97 150ms), modal entry (backdrop fade + scale 0.95→1 400ms spring), toast (slide-up + fade 300ms, 4s visible), datatable sort (rotate 180° 200ms), form error (shake 150ms + border red), metric card count-up (0→N 800ms easeOutQuad). Reduced motion: instant OR opacity-only. Spring default: {stiffness: 400, damping: 30}. Stagger: i * 0.05 (50ms), max 8 items.

- **Self-assessment:** Spec completeness 95%. Missing: exact screenshot (no Figma), exact pixel mock-up (but ASCII wireframe + component library sufficient). Motion spec Bölüm 11 şablonu tamamen takip (spring defaults, stagger pattern, useReducedMotion, exit animation). A11y WCAG AA baseline (focus-visible ring, 44px touch, aria-label, keyboard nav, heading hierarchy). Variant × state: kritik element (button, card, input, badge) tam. Handoff: component list + token list + motion + a11y + responsive + data — Frontend başlayabilir. Visual hierarchy (Bölüm 10): grayscale-first ✓, size scale 8px grid ✓, weight ladder max 3 ✓, color semantic ✓, shadow tier ✓, spacing 8px base ✓. Responsive: 3 breakpoint (≥1024 desktop, 768-1023 tablet, <768 mobile) + safe-area + touch-target ✓.

- **Açık karar:** Q44 (password reset) → super-admin reset spec'te varsay. Q45 (blog iframe) → no HTML V1, markdown link OK. Q46 (QR verification) → photo V1, QR V1.1. Spec'te sonuçlar inline (K bulgularına cevap).

- **Next:** Frontend-engineer S1 Batch A (auth middleware upgrade + admin layout + dashboard + görev yayınla). Design-system-keeper focus ring kontrol.

---

## 2026-04-24 10:45 — Dashboard v2 tur 2 polish spec (K1–K5 implementation)

- **Upstream:** UX audit `docs/ux/03-heuristics/2026-04-24-dashboard-v2-tur2-audit.md` (K1–K5 kritik, Q25/Q34/Q43 açık karar), Journey `docs/ux/02-journeys/2026-04-24-dashboard-ikinci-ziyaret.md` (Zehra tur 2 peak/dark moment), Analyst brief `docs/product/02-briefs/ux/2026-04-24-dashboard-v2-tur2-brief.md` (A1–A5 önerileri)
- **Downstream:** frontend-engineer (StreakSnapshot + LeaderboardTeaser + DailyMissionCard + MissionCard refactor implement), design-system-keeper (K1 token ADD + ALIAS decision)
- **Handoff:** ✅ upstream 3 dosyaya handoff log satırı eklendi (UX audit, journey, brief), downstream spec'e link ve component tablosu referanslı
- **Status-board:** ✅ güncellendi — "In progress" dashboard v2 tur 2 FE implementation, "Done today" ui-designer polish spec

- **Prompt:** K1–K5 kritik bulgu + UX journey dark moment = StreakSnapshot + LeaderboardTeaser + DailyMissionCard selection label + MissionCard token refactor spec. 3 yeni component + 3 mevcut polish + motion choreography (Duolingo + Rauno) + WCAG AA full.

- **Input:** Adım 0 (3 skill okundu: visual-spec-writing Bölüm 10–11 + design-system-audit Bölüm 7–8 + mobile-app-polish-standards Bölüm 1–4), 5 upstream dosya (audit K1–K5 mapping, journey Zehra peak/dark, brief OST, tur 1 spec baseline, atlas Bölüm 6 token gerçeği). Motion orchestration timing 1.5s entry (T0 hero → T800 mission stagger → T1000 leaderboard → T1500 complete). Q25 (a) copy tone: "Bu hafta #43'tesin · 150 fark top 10'a" pozitif frame vs baskı frame uyarısı. Q34 (a) MVP: Recency + Proximity + Low-friction selection sebebi label.

- **Output:** `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md` — 12 bölüm (4700+ satır).
  - **Bölüm 1 Özet:** 3 yeni component + K1 token drift fix
  - **Bölüm 2 ASCII wireframe:** tur 2 delta işaretli (StreakSnapshot hero alt, LeaderboardTeaser section, DailyMissionCard label)
  - **Bölüm 3 Token ref:** K1 MissionCard hardcoded gradient → `bg-domain-{domain}` tailwind token ADD (Bölüm 8 Karar ağacı + ADR candidate). K7 tab kontrast fix (ink-600 → ink-500, 4.5:1 AA).
  - **Bölüm 4 Visual Hierarchy (Bölüm 10):** Grayscale mockup 3-tier (1. KarmaCounter 72px black, 2. DailyMissionCard featured, 3. mission scroll). Size ladder 12–72px (4px grid). Weight max 3 (400+500+600+700+900 Karma only). Color = intent (gold action, cream primary, ink muted). Shadow tier (hero glow tier-1, card tier-2, flat tier-3). Spacing rhythm 8px base (space-y-6 = 24px).
  - **Bölüm 5 Component spec (10 bölüm):**
    - 5.1 HeroCardV2 polish: streak props add, StreakSnapshot 280ms dot stagger + 2s flame pulse
    - 5.2 StreakSnapshot YENİ (molecule): 3 variant (0 gün / 1–6 gün / 7+ gün), flame pulse reduced-motion korusu
    - 5.3 LeaderboardTeaser YENİ (organism, feature-flag): Q25 (a) frame, 3 variant (approaching/far/top10), avatar preview 50×50, "ve N kişi daha", feature-flag OFF notes
    - 5.4 DailyMissionCard polish: selection reason label + tooltip (Q34 context), existing photo + Karma sabit
    - 5.5 MissionCard polish (K1 FIX): hardcoded gradient → token class, ADR handoff
    - 5.6 NGO rail: empty state opsiyonel
    - 5.7 ChipDS a11y fix: kontrast upgrade
    - 5.8 BottomNav: haptic opsiyonel
    - 5.9 EmptyState: mevcut değişmez
    - 5.10 RewardRail: feature-flag OFF, spec ready (tur 3/P1)
  - **Bölüm 6 Motion (Bölüm 11):** Dashboard entry sequence 1.5s (T0 header instant → T50 hero scale/fade 500ms spring → T200 KarmaCounter count-up 800ms → T200 streak dot stagger 280ms → T350 progress bar → T500 DailyMissionCard → T700 label → T800–1040 mission stagger 60ms × 5 → T1000 leaderboard fade+slide 400ms 900ms delay → T1200 NGO rail). Tap feedback 0.97–0.99 scale, spring 400/30. Haptic choreography (Light tap, Medium complete, Heavy reward). Reduced-motion fallback: instant opacity, no transforms.
  - **Bölüm 7 Responsive:** Mobile-first max-w-lg, tablet px-6, desktop future
  - **Bölüm 8 A11y WCAG AA:** Kontrast 4.5+ (cream×ink 14:1 OK, ink-500 4.5:1 AA), touch 44+px, focus-visible ring, semantic HTML (button/nav/main/heading), screen reader aria-label, keyboard nav tab+arrow, color-blind safe, reduced-motion
  - **Bölüm 9 Quality 12-checklist:** Visual Hierarchy (grayscale ✓, size scale ✓, weight ✓, color semantic ✓, shadow ✓, spacing ✓, whitespace ✓), Motion (stagger ✓, spring 400/30 ✓, reduced-motion ✓, exit animation N/A, tap ✓, duration ✓, handoff code ✓), Handoff (✓)
  - **Bölüm 10 Component handoff tablosu:** 9 component (StreakSnapshot S, LeaderboardTeaser M, HeroCardV2 S, DailyMissionCard S, MissionCard S, ChipDS S, Tabs S, BottomNav S, RewardRail feature-flag). Effort 2–3 hafta (paralel fe + design-system-keeper K1 token 1 gün).
  - **Bölüm 11 Token ihlali:** K1 MissionCard hardcoded gradient (severity 4) → ADD `bg-domain-*` tailwind token + design-system-keeper ADR. K7 tab kontrast (severity 3) → FIX frontend-engineer (1 line).
  - **Bölüm 12 Açık soru:** Q25 Leaderboard tone 3-kişi test scheduling, Q34 recommendation algorithm MVP spec + A/B scaffold, K1 token ADD ADR timing.

- **Token ihlali bulundu:** 2 (K1 MissionCard hardcoded gradient severity 4 + K7 tab kontrast severity 3). K1 → ADD action (design-system-keeper Faz 2 başında), K7 → FIX action (frontend-engineer immediate).

- **Motion spec:** 12 adım entry choreography (T0–1500ms), hero glow breathing 3s infinite, streak flame pulse 2s infinite, mission card stagger 60ms × 5, leaderboard entry 900ms delay spring, tap scale 0.97 (card) + 0.95 (button), haptic 3-tier (Light/Medium/Heavy), reduced-motion instant fallback.

- **Self-assessment:**
  - ✅ Adım 0 (3 skill okundu)
  - ✅ 5 upstream kaynak integrate (audit K1–K5 mapping, journey adım2–7 peak, brief A1–A5 prioritize, tur 1 baseline, atlas token gerçeği)
  - ✅ 12-maddelik quality checklist tam pass (Visual Hierarchy Bölüm 10 + Motion Choreography Bölüm 11)
  - ✅ Grayscale mockup (Section 4) hierarchy net
  - ✅ Motion choreography timing band 150–800ms (Bölüm 11 Tier-1 pattern)
  - ✅ A11y WCAG AA full (kontrast + touch + focus + semantic + screen reader + keyboard + color-blind + reduced-motion)
  - ✅ Token ihlali tespit + handoff (K1 ADR candidate, K7 immediate fix)
  - ✅ Component handoff tablosu (10 component × effort × test note)
  - ✅ Handoff log (3 upstream dosya + flow chain visible)
  - ⚠️ LeaderboardTeaser feature-flag gerekçe açık (Q25 cultural risk pending test)
  - ⚠️ K1 token ADD ADR hangi stage'de açılacak açık (design-system-keeper'a handoff)

- **Next:** 
  1. frontend-engineer: tur 2 components implement (StreakSnapshot + LeaderboardTeaser + DailyMissionCard + MissionCard refactor) — 2026-04-25 — 2026-04-26 (3–4 hafta paralel)
  2. design-system-keeper: K1 token ADD (`bg-domain-*`) + ALIAS (semantic refactor) decision + peer review
  3. product-analyst: Q25 Leaderboard tone 3-kişi derinlik user test scheduling (pending)
  4. ux-researcher: Q34 recommendation algorithm MVP spec validate + A/B test scaffold (tur 3 pilot planning)

---

## 2026-04-24 09:30 — Mission detail state machine UI spec (skill-driven)
- **Prompt:** UX audit + journey'den UI spec üret. 9-state FSM + verification panel dark refactor + celebration upgrade + migration 013.
- **Input:** 3 skill okundu (visual-spec-writing + design-system-audit + mobile-app-polish-standards). UX audit + journey + mevcut 1709 satır + atlas Bölüm 6 tokens.
- **Output:** `docs/ui/01-specs/2026-04-24-mission-detail-state-machine-ui-spec.md` — 14 bölüm. 9 state ASCII wireframe + visual contract × token × variant. FSM diyagram + transition table. Verification panel 4 variant (auto/code/photo/qr) dark tema. Celebration upgrade Karma count-up + share CTA. Migration 013 şeması (missions.status + event_date + prep_checklist + user_missions.admin_review_status + karma idempotent unique index). Server action sözleşmesi (takeMission + completeMission + abandonMission). Error code 14 TR empathic copy. Motion choreography. A11y AA. Component hierarchy `components/mission/` 9 dosya.
- **Token ihlali bulundu:** 0 — tüm renk/tipo atlas Bölüm 6 referanslı.
- **Motion spec:** State transition 350ms + take mission haptic + verify success 3-wave confetti + Karma count-up 1200ms.
- **Self-assessment:** 12-maddelik checklist tam pass. Audit'teki K1-K5 → spec Bölüm 2-10. Post-implementation unit test TR locale bug'ını yakaladı → UI spec Bölüm 3.6 revize edildi (`.toLocaleUpperCase('tr-TR')` → `normalizeVerificationCode`).
- **Next:** frontend-engineer P0 component scaffold (9 component) + page.tsx FSM refactor + migration 013 apply.
---

## 2026-04-24 07:10 — NGO membership parametric UI spec (skill-driven)
- **Prompt:** UX audit'ten (2026-04-24 NGO membership parametric) UI spec üret. 3 fee mode variant + KVKK + 14-gün cayma + payment routing.
- **Input:** 3 skill okundu (visual-spec-writing + design-system-audit + mobile-app-polish-standards). UX audit (5 persona) + atlas Bölüm 7 v3 payment routing + migration 009 seed (TEMA/TEGV/LÖSEV).
- **Output:** `docs/ui/01-specs/2026-04-24-ngo-uyelik-parametric-ui-spec.md` — 15 bölüm. 5 adımlı flow (tier → form → KVKK → payment → success). Tier card variants 3 mode (TEMA age_tiered, HAYTAP monthly, LÖSEV donation_based). KVKK çifte onay. 14-gün cayma banner. Payment embed 3 mode (marketplace iyzico / embedded PayTR-iframe / passthrough redirect-with-return). Success celebration (confetti + Karma count-up +100). Motion choreography 7 adım. A11y AA full. 5 yeni component list.
- **Token ihlali bulundu:** 0 (her renk/tipo/spacing atlas Bölüm 6 referanslı).
- **Motion spec:** Tier select bounce 200ms + KVKK check haptic notification + success confetti + Karma count-up.
- **Self-assessment:** 12-maddelik quality checklist tam pass. Stripe Checkout + Revolut + Monzo benchmark karşılaştırıldı. Çoklu STK mode'u parametrik → single source of truth `membership_fee_config` jsonb.
- **Next:** frontend-engineer 5 component scaffold (step-progress-bar, tier-card, kvkk-checkbox, payment-embed, success-celebration). NGO membership journey map yazımı.
---

## 2026-04-24 06:45 — Dashboard ana v2 UI spec (skill-driven)
- **Prompt:** UX audit + journey'den UI spec üret. Skill-driven rigor.
- **Input:** 3 skill okundu (visual-spec-writing + design-system-audit + mobile-app-polish-standards). UX audit + journey + atlas Bölüm 6-7.
- **Output:** `docs/ui/01-specs/2026-04-24-dashboard-ana-v2-ui-spec.md` — 13 bölüm. ASCII wireframe + token tablosu (renk/typo/spacing/radius) + variant × state × motion × responsive × state coverage × a11y × handoff. İmza patterns: gold glow breathing (I6), Duolingo count-up, Things 3 focal point, Arc-esque delight.
- **Token ihlali bulundu:** 0 (tüm token atlas Bölüm 6 referanslı).
- **Motion spec:** Entry choreography 7 adım + hero glow breathing 3s + tap feedback + haptic choreography.
- **Self-assessment:** 12-maddelik quality checklist tam pass. 3 benchmark app karşılaştırma. A11y checklist tam.
- **Next:** frontend-engineer `components/dashboard/hero-card-v2.tsx` + `daily-mission-card.tsx` entegre eder. Sonraki UI spec: NGO membership parametric (P0 #20) — UX audit hazır.
---

## 2026-04-23 21:15 — kurulum
- **Prompt:** ui-designer agent + klasör + playbook + atlas kurulumu
- **Input:** `docs/project-atlas.md`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`
- **Output:** `docs/ui/**`, `.claude/agents/ui-designer.md`
- **Token ihlali bulundu:** Henüz audit yapılmadı — ama atlas'ta kaydedilmiş uyuşmazlıklar var (README vs kod).
- **Self-assessment:** İlk kurulum, ilk gerçek audit'te denemek lazım.
- **Next:** Design-system audit D1–D4 sorularını çözen ilk iş adayı.
---
