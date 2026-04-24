# ux-researcher Journal

> Her run sonunda bir giriş, en üstte.

**Format:**
```
## YYYY-MM-DD HH:MM — [iş başlığı]
- **Prompt:** ...
- **Input:** ...
- **Output:** ...
- **Kanıt sınıfı:** [Kod / Kaynak / Hipotez / Gözlem]
- **Açık karar:** N
- **Self-assessment:** [kendine ne notu verirsin]
- **Next:** ...
---
```

<!-- YENİ GİRİŞLER BU ÇİZGİNİN ALTINA -->

## 2026-04-24 09:15 — Mission detail state machine audit + journey (SKILL-DRIVEN)
- **Prompt:** P0 #3 mission detail state machine. Skill-driven zincir. Mevcut 1709 satır 3 client'ı analiz et.
- **Input:** 3 skill okundu (ux-heuristics + user-journey-mapping + mobile-app-polish-standards). Mevcut `mission-detail-client.tsx` 648 satır + `states-client.tsx` 714 satır + `verification-client.tsx` 236 satır + `take-mission.tsx` 23 satır dead code.
- **Output:**
  - `docs/ux/03-heuristics/2026-04-24-mission-detail-state-machine-heuristik-audit.md` — Nielsen 10 × İyiBiri 6 × 3 benchmark (Duolingo lesson / Strava activity / Apple Fitness). State envanteri 9 state × 5 eksik. Kritik 5 + Yüksek 4 + Orta 3. Risk matrix. Q40-Q42 açık sorular. Karma race condition tespiti + migration 013 önerisi.
  - `docs/ux/02-journeys/2026-04-24-mission-lifecycle-journey.md` — Zehra persona 10-touchpoint + emotion curve (grafik çizildi). Dark moment adım 4 (take mission belirsizliği). Peak moment adım 8 (celebration). 3 persona spectrum (engaged/hesitant/busy). Motion choreography 3 aşama. A11y notları.
- **Kanıt sınıfı:** Kod + Gözlem (mevcut 1709 satır okundu, tema debt + state fragmentation + race condition).
- **Açık karar:** 3 (Q40 mission-only volunteer Yol A/B, Q41 admin review trust-first mi, Q42 cancelled mission Karma geri almak).
- **Self-assessment:** 3 skill tam uygulandı. Audit → journey → UI spec → implementation zinciri test edildi. Karma race condition tespiti (K4) infra-level bulgu, bu işin en kritik çıktısı. Tema debt (K2) ikinci kritik çıktı — tier-1 hissi için lansman blocker.
- **Next:** UI spec hazır (başka tur), frontend-engineer implementation aldı.
---

## 2026-04-24 06:30 — Dashboard ana v2 heuristik audit + journey map (SKILL-DRIVEN)
- **Prompt:** Kullanıcı UX/UI quality obsession; agent'ların skill'leri kullandığını teyit + app ecosystem kalite standardı.
- **Input:** 3 skill okundu (ux-heuristics, user-journey-mapping, mobile-app-polish-standards). UX brief dashboard-ana-v2. Master plan P0 #12.
- **Output:**
  - **YENİ SKILL:** `.claude/skills/mobile-app-polish-standards/SKILL.md` — Linear/Arc/Duolingo/Things 3 benchmark + motion choreography timing band'ları + dark mode layering + typography hierarchy + haptic + 11 bölüm + 12-maddelik checklist.
  - `docs/ux/03-heuristics/2026-04-24-dashboard-ana-v2-heuristik-audit.md` — Nielsen 10 × İyiBiri 6 özel × Duolingo/Things/Arc benchmark karşılaştırma. Kritik 3 bulgu (H6 günün görevi, I6 hero glow, H8 focal point). 10 aksiyon öncelik sırası.
  - `docs/ux/02-journeys/2026-04-24-dashboard-ilk-acil-journey.md` — Zehra persona 8-step journey + emotion curve + dark moment (Adım 3) + peak moment (Adım 8) deep-dive.
  - ux-researcher.md playbook Adım 0 — **zorunlu skill okuma ritüeli** (3 skill before any output).
  - ui-designer.md playbook aynı — 3 skill zorunlu.
- **Kanıt sınıfı:** [Kod] + [Hipotez] + [Kaynak] (skill referansları).
- **Açık karar:** 0 yeni; bulgular zaten master plan P0'lara bağlı.
- **Self-assessment:** Skill usage transparent: heuristik audit 16 heuristik tablo, journey map emotion curve + 2 moment deep-dive, 3 app benchmark karşılaştırma. Quality checklist tam.
- **Next:** ui-designer bu iki dökümandan UI spec yazsın (`docs/ui/01-specs/2026-04-24-dashboard-ana-v2-ui-spec.md`). Zorunlu: 3 skill oku + mobile-app-polish-standards Bölüm 4+5+3 (typography, dark layering, motion). Sonra frontend-engineer implement.
---

## 2026-04-23 21:15 — kurulum
- **Prompt:** ux-researcher agent + klasör iskeleti + playbook
- **Input:** `docs/project-atlas.md`, `docs/page-audit.md`
- **Output:** `docs/ux/**`, `.claude/agents/ux-researcher.md`
- **Kanıt sınıfı:** Kurulum — deliverable yok.
- **Açık karar:** 0
- **Self-assessment:** İlk kurulum; ilk gerçek işte test edilecek.
- **Next:** Kullanıcıdan ilk ux işini bekle: dashboard audit mi, mission journey mi, state spec mi?
---
