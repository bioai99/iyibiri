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

## 2026-04-24 23:45 — Dashboard v2 tur 2 audit + journey

- **Upstream:** `docs/product/02-briefs/ux/2026-04-24-dashboard-v2-tur2-brief.md` (product-analyst tur 2 brief)
- **Downstream:** ui-designer via `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-ui-spec.md` (sonra)
- **Handoff:** ✅ upstream'e tur 2 brief'e satır eklenecek (tur 1 audit retroactive satırı)
- **Status-board:** ✅ updated — "Done today" + "In progress" (downstream untuk)

**İş:** Tur 2 (3 ay sonra Zehra retentin) heuristik audit + journey map. Product-analyst'in 5 önerisi (A1–A5) validate + 3 açık karar (Q25/Q34/Q43) cevapla.

**Output:**
1. `docs/ux/03-heuristics/2026-04-24-dashboard-v2-tur2-audit.md` — Nielsen 10 × İyiBiri 6 × 3 benchmark (Duolingo/Things/Linear). 9 component matrix. **5 kritik (K1–K5):** MissionCard hardcoded gradient (N4 drift risk), streak snapshot missing (N1/N6 tanıma ihlali), leaderboard teaser missing (N6 sosyal sinyali), featured mission algoritması belirsiz (N6 transparent sorun), ödül rail missing (Overhead). **4 yüksek + 3 orta.** Tier-1 app benchmark (streak visible = Duolingo +3–4x retention, Things 3 focus hierarchy, Linear micro-animation 150–200ms). A11y: Tab inactive kontrast fix (ink-600 → ink-500). **Q25 cevabı:** (a) Pozitif sınıflandırma ("yaklaşıyorsun" frame) + 3-kişi test. **Q34 cevabı:** (a) MVP yeni+yakın+kısa algoritma tur 2 A sprint. **Q43 cevabı:** A5 Overhead → P1 (sponsor timing). UX → UI handoff matrix (A1–A5 prioritize).

2. `docs/ux/02-journeys/2026-04-24-dashboard-ikinci-ziyaret.md` — Zehra (3 ay, 4 görev tamamladı, 15 gün seri) 10-step journey. **Dark moment tur 1 vs tur 2 farklı:** Tur 1 Adım 3 "çok şey var" (−1) → Tur 2 Adım 8 "başka seçenek var mı" (0 = neutral risk). A1+A2+A3 kombinasyonu peak zone kuvvetlendir (Adım 2–7). Tur 1'de ilklik dopamine spike, tur 2'de consistency long-term motivation. Zehra "durağan" hissi riski (tur 3 plan'da — location/skill diversity, leaderboard seasonal tier, STK exclusive challenges).

**Kanıt sınıfı:** 
- [Kod] `hero-card-v2.tsx` + `daily-mission-card.tsx` + `mission-card.tsx` + `dashboard-client.tsx` tur 1 inspect.
- [Hipotez] Zehra 3 ay cohort retention profile (analyst MAKE metric'inden). Q25/Q34 test pending.
- [Kaynak] Skill `ux-heuristics` + `user-journey-mapping` + `mobile-app-polish-standards` (Duolingo benchmark, Things 3 focus, Arc delight). Atlas Bölüm 1 (kimlik), 6 (DS), 8 (mobile).

**Açık karar:** 3
- Q25 (Leaderboard tone) — (a) + test, fallback (c).
- Q34 (Featured algoritma) — (a) MVP + tur 3 B/C A/B.
- Q43 (Ödül rail scope) — Overhead → P1.

**Self-assessment:**
- ✅ 3 skill (`ux-heuristics` + `user-journey-mapping` + `mobile-app-polish-standards`) tam okundu, applied. Heuristik matrix 9 component × 16 heuristik. Journey 10-step + emotion curve + dark/peak moment deep-dive. Benchmark 3 app (Duolingo pattern +3–4x retention research-backed, Things 3 obsessive refinement observable).
- ✅ Kanıt sınıflandırması: [Kod] 3 .tsx dosya satır sonuç; [Hipotez] Zehra cohort + Q25/Q34 test-pending; [Kaynak] skill + Atlas explicit.
- ✅ K1–K5 severity uygun: K1 (design-system drift risk) 4 = launch blocker; K2–K4 (tur 1 plan debt + MAKE metric critical) 4; K5 (Overhead) 3.
- ✅ Q25/Q34/Q43 cevapları senaryo-bazlı, fallback planı ile.
- ✅ Handoff UI designer'a spec yazacağını beklediği input (A1–A5 prioritize, K1–K5 spec'e dönüştür, motions/touch/a11y detay).

**Next:** 
- ui-designer tur 2 UI spec yazacak (`docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-ui-spec.md`) — tur 2 audit + journey K1–K5 → Bölüm 2–10 spec'e mapping, motion choreography (A1 stagger, A2 slide, A3 smooth, haptic), A11y (tab contrast fix).
- product-analyst tur 2 brief'in Handoff log'una retroactive satır ekleyecek (tur 1 audit satırı + "UI audit complete" handoff).
- Q25 user test scheduling (product-analyst + 3-kişi candidate).
- Q34 backend query spec (product-analyst).

---

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
