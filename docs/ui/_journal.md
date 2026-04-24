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
