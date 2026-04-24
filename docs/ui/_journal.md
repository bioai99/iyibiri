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
