# UX Brief — Leaderboard (Sıralama)

**Tarih:** 2026-04-24
**Sahip (brief):** product-analyst
**Sonraki sahip:** ux-researcher → ui-designer → frontend-engineer
**Priority:** P1 · **Effort:** M (1-2 hafta)
**Bağlı ADR:** ADR-001 (NSM = MAKE), ADR-004 (dark-only V1), ADR-008 (sosyal dinamik)

## 1. Özet (1 paragraf)

Leaderboard (`/dashboard/leaderboard`) sıralama + sosyal karşılaştırma merkezi. NSM MAKE üzerinde **rekabet motivasyonu** kaldıracını oluşturan birincil girdi. Kullanıcı açtığında "top 3 kimler, ben nerede, gap ne" 3 saniyede görüp yeni görev yapma motivasyonu almalı. Arkadaş vs STK (NGO member) karşılaştırma, haftalık/aylık filtreleme, ve current user highlight (self-comparison) uygulanmalı.

## 2. Hedef kullanıcı + JTBD

- **Persona:** P1 (18-28 rekabetçi genç) + P2 (28-40 sosyal bağlı profesyonel) — atlas Bölüm 1.
- **JTBD:** 
  - "Top 3'ü görmek istiyorum — kim lider, nereden Karma kazanıyor?"
  - "Benim sıram kaçıncı, top 10'a kaç Karma uzağım?"
  - "Arkadaşlarım ile karşılaştırmak istiyorum (eğer varsa)."
  - "Bu hafta vs bu ay karşılaştırmasını görmek istiyorum."

## 3. Mevcut durum — gözlem

**Kod:** `app/dashboard/leaderboard/leaderboard-client.tsx`. Podium (top 3) + ranked list (4+). Dark mode. Bugün: top 20 global list.

**Eksikler (hipotez, UX researcher doğrulayacak):**
- **H1:** Filtreleme yok — sadece all-time sıralama. Haftalık/aylık momentum momentum görmek isteyenler bırakılmış.
- **H2:** Arkadaş tab yok — social comparison işlevselliği veya arkadaş discovery cue bulunmuyor (Strava benchmark: Friend leaderboard engagement +40%).
- **H3:** STK membership context eksik — kullanıcı "bu ay Çevre öncülerine destek veren kişiler" filtresini isteyebilir.
- **H4:** Self-rank highlight zayıf — current user #43 ise alt tarafta basit row. Motivasyon signal düşük (Things 3 analoji: "Your list" vs "Everyone's").
- **H5:** Podium rank badge visual hierarchy — #1 gold animasyon vs #2, #3 tekniksel highlight eksik (Duolingo: podium pulsing glow).

## 4. Önerilen akış (delta)

```
┌──────────────────────────────────────────┐
│ HEADER: "Topluluğun en iyileri"          │
│ Subtitle: "Bu hafta seri 🔥 sırala"      │
├──────────────────────────────────────────┤
│                                          │
│ TAB CHIPS: [Bu Hafta] [Bu Ay] [Tümü]    │
│ (SUB-FILTER: [Tümü] [Arkadaşlar] [STK]) │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  PODIUM (top 3)                          │
│  [#2]     [#1]     [#3]                  │
│  Avatar   Avatar   Avatar                │
│  Name     Name     Name                  │
│  Karma    Karma    Karma                 │
│  Bar      Bar      Bar                   │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  RANKED LIST (4-20)                      │
│  #4  [Avatar] Ahmet    2.100 Karma      │
│  #5  [Avatar] Nur      1.980 Karma      │
│  ...                                     │
│                                          │
├──────────────────────────────────────────┤
│  CURRENT USER (eğer #20 dışında)         │
│  ...                                     │
│  #43 [Avatar] Sen (benim profil)         │
│      1.200 Karma "250 fark #40"          │
│                                          │
└──────────────────────────────────────────┘
```

**Filter mantığı:**
- Ana tab: **Bu Hafta** (Mon-Sun weekly cohort), **Bu Ay** (1-end of month), **Tümü** (all-time).
- Alt sub-filter (future V1.1): **Tümü**, **Arkadaşlar** (friend list), **STK** (member NGO cohort).

## 5. Cognitive load

**Azalan:**
- Tablar → "hangi zaman dilimine bakıyorum" açık.
- Podium visual prominence → top 3 anında ayırt edilir.
- Current user highlight → "ben neredeyim" 1 saniyede bulunur.

**Yeni eklenen:**
- Filter seçenekleri → oka basit tutulan UI ama state yönetimi gerek.

## 6. Başarı kriterleri

- **Primary (MAKE KPI):** Leaderboard açan kullanıcının %45+, görüntüledikten sonra aynı oturumda en az 1 mission page'e geri tıklaması.
- **Secondary:** Ortalama zaman leaderboard'da **+20 saniye** (top 3'ü ve self-rank keşfetme).
- **Engagement:** Weekly filter, haftalık %15+ tıklama oranı (momentum tracking).
- **Nitel:** 5-second test → "Burada ne var?" sorusuna %75+ "Sıralama / kim lider" cevabı.

## 7. Kısıtlar

- **Mobile-first:** max-w-lg mx-auto.
- **Dark-only V1** (ADR-004).
- **Design system token'ları** — gold highlights consistency.
- **Motion:** Podium #1 subtle pulsing glow. List item stagger entry (50ms offset).
- **Safe area:** pb-safe.
- **Loading state:** skeleton podium + list rows (WS-04 sistemik).

## 8. UI ipuçları (tasarımcıya)

- **Podium:** 
  - #1 center, taller bar (170px), 64px avatar, gold border + inset glow.
  - #2, #3 sides, 130/110px bars, 52px avatars, ink-600 border.
  - Rank badge (#1/#2/#3) podium bar üst tarafında centered.
  - Podium bar ile avatar arası 8px gap.

- **Ranked list:**
  - Row: bg ink-800, border ink-600, 1px.
  - Current user row: bg rgba(232,194,104,.08), border gold.
  - Rank # left (32px tabular-nums), avatar 36px, name flex 1, karma right (gold).
  - Row padding 12px 14px, rounded 12px.

- **Separator (user dışında #20):** "..." centered, color ink-400, padding 8px 0.

- **Tabs:**
  - ChipDS usage (mevcut component).
  - Active: bg gold text dark, inactive: bg transparent border ink-600.

## 9. Test önerisi (UX researcher için)

- **5-second test** — "Burada kimler, ben neredeyim?"
- **Task-based:** "Bu hafta #5'e kaç Karma kaldı? Tıkla, bul."
- **Scroll behavior:** Podium yeterli mi yoksa extra visual urgency gerek?
- **Filter clarity:** Tablar anlaşılır mı, sub-filter future-ready mi?

## 10. State coverage (MECE)

- **idle:** Initial render, user rank + top 20 fetch complete.
- **loading:** Leaderboard data fetching. Skeleton podium + list rows (16 rows min).
- **empty:** No users (impossible realistic, ama edge case handling). Message: "Henüz veri yok."
- **error:** Fetch failed. Retry button.
- **success:** Podium + list + current user rank (out of top 20).

## 11. Tier-1 Benchmark

- **Strava:** "Global leaderboard" — weekly cohort toggle, friend filter, segment-based ranking.
  - **Insight:** Sub-filter (all vs friend) critical engagement driver; weekly momentum >all-time.
  
- **Duolingo:** "Global leagues" — score, streak prominence, visual badge hierarchy (#1 animation).
  - **Insight:** Podium visual distinction (animation + glow) psychological separation; #1 dopamine trigger.

- **Linear:** "Teams" — member list, sorted by activity. Inline achievement badge.
  - **Insight:** Context-based leaderboard (team scope) trust-building; badges authority signal.

## 12. Open decisions (product-analyst karar kuyruğu)

- **Q-1:** Sub-filter (arkadaş / STK) V1.0 in mi V1.1 future mi? (Friend list infra ready; STK member tracking ready.)
- **Q-2:** Current user rank "below fold" vs "sticky footer" (mobile scroll UX tradeoff).
- **Q-3:** Tie-breaking rule (aynı Karma) — created_at ascending mi descending mi? (Fairness vs retention signal).
- **Q-4:** Podium #1 animated glow — CSS animation (performant) mi Framer Motion mi?

## 13. Kısıtlı kaynaklar / bağımlılık

- Leaderboard data query (`lib/supabase/queries/leaderboard.ts`) — weekly/monthly cohort filtering logic.
- ChipDS usage (filter tabs) — mevcut design system.
- Skeleton loader component (WS-04 sistemik, paralel iş).

## 14. Handoff

- **UX researcher:** Heuristik audit (Nielsen 10 + İyiBiri heuristic 6). Arkadaş/STK filter demand signal testi. Journey map (leaderboard entry path). **1 hafta**.
- **UI designer:** UX brief'ten UI spec. Podium variant × state tablosu. Filter state machine. Motion spec (pulsing glow timing). Responsive behavior (tablet/desktop). **4-5 gün**.
- **Frontend engineer:** UI spec → implement. Weekly cohort calculation + Supabase query. Filter logic + re-fetch. Stagger animation. **5-7 gün**.
- **Visual QA:** ui-designer review + animation verify. **2 gün**.

**Toplam:** 1-2 hafta paralel iş.
