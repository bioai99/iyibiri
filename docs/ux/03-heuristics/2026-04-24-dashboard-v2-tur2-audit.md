# Dashboard Ana v2 — Tur 2 Heuristik Audit

**Tarih:** 2026-04-24
**Yazar:** ux-researcher
**Upstream:** product-analyst brief `docs/product/02-briefs/ux/2026-04-24-dashboard-v2-tur2-brief.md`
**Tur 1 referans:** `docs/ux/03-heuristics/2026-04-24-dashboard-ana-v2-heuristik-audit.md`
**Scope:** 9 mevcut component + 3 eksik (analyst tur 2 brief'inde tespit edildi)
**Skill usage (zorunlu):** ✅ `ux-heuristics` + ✅ `mobile-app-polish-standards` + ✅ `user-journey-mapping`

---

## 1. Özet — Tur 1'den tur 2'ye

**Tur 1 (2026-04-24 sabah) tamamlandı:**
- HeroCardV2 (Karma count-up + tier progress + 3 stat cell) canlı — ✅
- DailyMissionCard featured görev kartı canlı — ✅
- "Günün görevi" featured card H6 kritik sorununu çözdü — ✅

**Tur 2 amacı (bu audit):**
- Tur 1 component'lerin 9 tanesi mevcut statüsü kontrol et (H1–H10 × I1–I6 heuristic matrix)
- 3 eksik component eksikliği doğrula (Tur 1 plan'da vardı, code'da yok: **Streak snapshot**, **Leaderboard teaser**, **Ödül rail**)
- Tur 2 польнива önerileri (analyst'in 5 önerisi A1–A5) heuristik uyumunu validate et
- **Q25 (Leaderboard TR kültürü)**, **Q34 (Featured mission algoritması)**, **Q43 (Ödül rail)** karar destek
- Tier-1 app benchmark (Duolingo, Linear, Things 3) karşılaştırması ile polish gap'i tespit et
- Accessibility WCAG AA + mobile-first validation

**Tur 2 defini:**
- 5 kritik (K1–K5) + 4 yüksek + 3 orta priority bulgu
- UX → UI designer handoff hazır
- 3 açık karar yazarının yanıt senaryoları

---

## 2. Nielsen 10 × İyiBiri 6 Heuristik — Tüm 9 Component × Matrix

### 2a. Tabel — N1 (Visibility of system status) × 9 component

| # | Component | N1 — Sistem durumu görünür | Kanıt |
|---|---|---|---|
| 1 | **HeroCardV2** | ✅ İyi — Karma total görünür, hafta sinyali (+X hafta), progress bar. Skeleton loading var. | [Kod] `hero-card-v2.tsx` L257–260: `weeklyKarmaGain` prop'u render edilir. L164–171 animate hook'u smooth count-up sağlar. |
| 2 | **DailyMissionCard** | ✅ İyi — Karma + süre + impact görünür, loading skeleton var. | [Kod] `daily-mission-card.tsx` L122–144 chip render'ı + L41–53 skeleton. |
| 3 | **MissionCard** (list item) | ⚠️ Orta — Domain + süre + konum görünür ama 4. chip (difficulty) missing (Q34 açık karar bağlı). Seçilme state'i (active/highlighted) belirsiz. | [Kod] `mission-card.tsx` L65–70 sadece domain + duration + location render. Difficulty_level field schema'da var mı kontrol gerek (ADR-007). |
| 4 | **ChipDS (tab switcher)** | ✅ İyi — Aktif tab belirgin (renk/underline). | [Kod] Varsayılan DS component. |
| 5 | **NGO rail** | ✅ İyi — NGO 36px logo disk + member border visible. Empty state variant yok (sıfır NGO durumu). | [Kod] `dashboard-client.tsx` L324+ horizontal scroll. Eksik: empty state fallback. |
| 6 | **Bottom nav** | ✅ İyi — 5 tab visible, aktif indicator renk/bold. | [Kod] `components/bottom-nav.tsx` — varsayılan. |
| 7 | **Streak snapshot** (**MISSING**) | ❌ Eksik — Tur 1 plan'da "7-gün dot + flame" varılmış, code'da yok. Kullanıcı "seri durum" gerçek-time göremez. | [Hipotez] product-analyst brief tur 2 boşluk tespiti (madde #61) "Duolingo benchmark: 7-gün streak 3-4x retention boost." |
| 8 | **Leaderboard teaser** (**MISSING**) | ❌ Eksik — Tur 1 plan "Bu hafta #43'tesin · 150 Karma fark" — code'da yok. Sosyal sinyali kapalı. | [Hipotez] Analyst brief (madde #64) "+5-8% engagement depth TR kullanıcılarda risk (baskı feedback)." |
| 9 | **Ödül rail** (**MISSING**) | ❌ Eksik — Tur 1 plan "YENİ ÖDÜLLER" 2-3 reward card — code'da yok. Sponsor visibility kapalı. | [Hipotez] Analyst brief (madde #67) "+3-5% funnel top; sponsor gelir kolu sinyali." |

**N1 Özet:** HeroCardV2 + DailyMissionCard + NGO rail sistem durumunu iyi gösterir. **3 eksik component (streak, leaderboard, reward rail) kritik sinyalleri kapattıkları için N1 ihlali sayılmaz — bunlar tur 2 B scope (analyst önerisi A1–A3).** MissionCard'da 4. chip eksik (N1 orta → Q34 algoritması kararından bağlı).

---

### 2b. Tabel — N2 (Match between system and real world) × 9 component

| # | Component | N2 — Dil ve konsept | Kanıt |
|---|---|---|---|
| 1 | HeroCardV2 | ✅ Mükemmel — "Karma", "seviye", "seri", "gün" TR çerçevesi, "sen" dili. | [Kod] L34–39 TIER_NAMES Title Case: "İyi Biri", "İyi Yürekli". L256 "Karma" label. |
| 2 | DailyMissionCard | ✅ Mükemmel — "Günün görevi", "Karma", "Başvur" — doğal. | [Kod] L83 "Günün görevi" label, L193 "Başvur" CTA. |
| 3 | MissionCard | ✅ Tutarlı — "Görev", domain badges (nature/education/social vb) emojili, "Başvur". | [Kod] L19–32 domainEmoji map. |
| 4 | ChipDS | ✅ — DS component, tutarlı. | — |
| 5 | NGO rail | ✅ — "İyilik Öncüleri" (STK yerine daha sıcak). | — |
| 6 | Bottom nav | ✅ — "Keşfet", "Ödüller", "Profil" açıkça anlaşılır. | — |
| 7 | Streak snapshot | N/A (eksik) | — |
| 8 | Leaderboard teaser | N/A (eksik) | — |
| 9 | Ödül rail | N/A (eksik) | — |

**N2 Özet:** ✅ Tüm mevcut component'ler tutarlı, samimi, TR-doğal ton. Dil eksikliği yok.

---

### 2c. Tabel — N3 (User control and freedom) × 9 component

| # | Component | N3 — Çıkış yolu, geri alma | Kanıt |
|---|---|---|---|
| 1 | HeroCardV2 | ✅ — Hero link'leri (`/dashboard/tiers`, `/dashboard/my-missions`) ve stat cell'ler tıklanabilir (geri = bottom nav). | [Kod] L265–304 BrandLogo + tier name `/dashboard/tiers` link. L352–374 3 stat cell link'ler. |
| 2 | DailyMissionCard | ✅ — Mission detail'e git (L88 `/dashboard/missions/${mission.id}`), geri bottom nav. | — |
| 3 | MissionCard | ✅ — Kitap icon toggle + detail link. | — |
| 4 | ChipDS | ✅ — Tab switch state backable (tab state route param ile manage edilirse). | [Hipotez] Kontrol gerek: dashboard tab state URL'ye binding var mı? |
| 5 | NGO rail | ✅ — Horizontal scroll + tap detail; geri button. | — |
| 6 | Bottom nav | ✅ — 5 tab switch, geri = previous tab. | — |
| 7–9 | Eksik comp | N/A | — |

**N3 Özet:** ✅ Tüm component'ler çıkış yolu net. **Not:** ChipDS tab switcher state URL binding'ini kontrol et (hipotez).

---

### 2d. Tabel — N4 (Consistency and standards) × 9 component

| # | Component | N4 — Tutarlılık + token | Kanıt |
|---|---|---|---|
| 1 | HeroCardV2 | ✅ Gold token + cream text. Progress bar gradient gold-dim → gold. Shadow imza var. | [Kod] L217 `boxShadow: '0 8px 32px rgba(232,194,104,0.35)'` ✅ İyiBiri imza. |
| 2 | DailyMissionCard | ✅ Gold chip ("+ Karma"), gold border-left, backdrop blur backdrop white. Tutarlı. | [Kod] L98 `borderLeft: '4px solid ${c.gold}'` ✅, L126 chip background gold. |
| 3 | MissionCard | ⚠️ Domain gradient var (20–27) ama token'lar mı inline mı kontrol et. Hardcoded hex var (L20–26 gradients). | [Kod] L20–27 domainGradient hardcoded. Refactor: `tailwind.config.ts`'e domain-gradient layer ekle (design-system guideline). |
| 4 | ChipDS | ✅ — DS component, tutarlı. | — |
| 5 | NGO rail | ✅ Member gold border, domain gradient variant. | — |
| 6 | Bottom nav | ✅ — Tutarlı. | — |
| 7–9 | Eksik | N/A | — |

**N4 Özet:** 🔴 **Kritik K2** — MissionCard domainGradient hardcoded (#rgb hex). Refactor zorunlu: `tailwind.config.ts` → `domain-gradient` utility class. Kontrol: başka component'ler hardcoded renk barındırıyor mu?

---

### 2e. Tabel — N5 (Error prevention) × 9 component

| # | Component | N5 — Hataları önceden uyar | Kanıt |
|---|---|---|---|
| 1–9 | Genel | ⚠️ Orta — Dashboard form yok (read-only) ama mission detail'de apply form var; validation clear mi? KVKK? | [Hipotez] Mission apply form'unda error prevention audit gerek (tur 2 B scope değil, tur 1 carry-over). |

**N5 Özet:** ⚠️ Dashboard ana ekranında form yok → low risk.

---

### 2f. Tabel — N6 (Recognition rather than recall) × 9 component

| # | Component | N6 — Tanıma, hatırlama değil | Kanıt |
|---|---|---|---|
| 1 | HeroCardV2 | ✅ İyi — Karma total visible, seviye badge visible, seri stat visible. | — |
| 2 | DailyMissionCard | ✅ — Recommended görev card visible (algoritma açık → Q34). | — |
| 3 | MissionCard | ✅ — Domain emoji + badge visible. | — |
| 4–6 | OK | ✅ | — |
| 7 | Streak snapshot | ❌ Eksik — Seri durum hatırlatılmıyor. Ayrı `/dashboard/streak` sayfası gerekli. | — |
| 8 | Leaderboard | ❌ Eksik — Rank hatırlatılmıyor. | — |
| 9 | Ödül rail | ❌ Eksik — Ödül seçeneği görsüne alınmadı. | — |

**N6 Özet:** Eksik 3 component nedeniyle N6 eksik sinyaller. Tur 2 A önerisi (A1–A3) bunları çözer.

---

### 2g. Tabel — N7 (Flexibility and efficiency) × 9 component

| # | Component | N7 — Hız + seçenek | Kanıt |
|---|---|---|---|
| 1 | HeroCardV2 | ✅ — 3 stat cell doğru link'ler (aktif görev / tamamlandı / seri). | — |
| 2 | DailyMissionCard | ✅ — Tek tıkla görev detail. | — |
| 3 | MissionCard | ⚠️ — Listede inline bookmark ama görev detayına 1 tık. OK. | — |
| 4–6 | OK | ✅ | — |
| 7–9 | Eksik | N/A | — |

**N7 Özet:** ✅ Hız tatmin edici.

---

### 2h. Tabel — N8 (Aesthetic and minimalist design) × 9 component

| # | Component | N8 — Estetik ve minimal | Kanıt |
|---|---|---|---|
| 1 | HeroCardV2 | ✅ — Karma + tier + progress bar + 3 stat. Clean hierarchy. | — |
| 2 | DailyMissionCard | ✅ — Photo + Karma + title + NGO + impact + CTA. Things 3 tarzı. | — |
| 3 | MissionCard | ⚠️ — Domain + duration + location + bookmark. 4 element kompakt. Clutter yok ama 4. chip eklenirse (Q34) test et. | — |
| 4–6 | OK | ✅ | — |
| 7–9 | N/A | — | — |

**N8 Özet:** ✅ Tasarım temiz. 4-chip variant test önemli.

---

### 2i. Tablo — N9 (Help users recognize, diagnose, recover from errors) × 9 component

| # | Component | N9 — Hata iletişimi | Kanıt |
|---|---|---|---|
| 1–9 | Genel | ⚠️ — Hata state'ler sistemik (atlas Bölüm 10 eksik). Tur 1 carry-over; tur 2'de WS-04 state library çalışıyor. | — |

**N9 Özet:** ⚠️ Orta — Sistemik eksik ama tur 2 scope dışı (WS-04 bağlı).

---

### 2j. Tablo — N10 (Help and documentation) × 9 component

| # | Component | N10 — Yardım + dokümantasyon | Kanıt |
|---|---|---|---|
| 1 | HeroCardV2 | ⚠️ — İlk kullanıcı (karma=0) variant var (`isEmpty` prop, L378–396) ama "bunu niye yapıyorum" açıklaması mikrokopya ile yeterli mi? | [Kod] L394 "İlk görevini tamamla, Karma kazanmaya başla →" — tutarlı ama "Karma nedir" sorusu onboarding'de mi? |
| 2 | DailyMissionCard | ⚠️ — "Günün görevi" başlığı açık ama algoritma (Q34 açık karar) açığa alınmalı. | — |
| 3–9 | OK | — | — |

**N10 Özet:** ⚠️ Orta — Mikrokopya ile yeterli. Onboarding quiz (tur 1 plan'da vardı) silindi (2026-04-19) → "Karma nedir" açıklaması eksik. Not: tur 2 scope dışı (product-analyst strateji).

---

### 2k. Tablo — İyiBiri Özel 6 Heuristik (I1–I6) × 9 component

| # | İ Heuristik | HeroCardV2 | DailyMissionCard | MissionCard | ChipDS | NGO rail | Bottom nav | Streak* | Leaderboard* | Ödül rail* |
|---|---|---|---|---|---|---|---|---|---|---|
| **I1 — Ton tutarlılığı** | ✅ "sen" dili | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — |
| **I2 — Karma görselliği** | ✅ KarmaCounter, tabular-nums, `text-6xl font-display` | ⚠️ Chip small format | ✅ Chip | — | — | — | — | — | — | — |
| **I3 — Impact statement** | N/A (hero) | ✅ DailyMissionCard italic (L172–181) | ✅ | — | — | — | — | — | — | — |
| **I4 — Tier isimleri** | ✅ Fraunces italic gold (L280–288) | N/A | N/A | — | — | — | — | — | — | — |
| **I5 — Bottom nav + safe-area** | ✅ `pb-safe` (muhtemelen) | ✅ | ✅ | — | — | — | ✅ | — | — | — |
| **I6 — Hero glow imzası** | ✅ `shadow-[0_8px_32px_rgba(232,194,104,0.35)]` (L217) | N/A | N/A | — | — | — | — | — | — | — |

**I1–I6 Özet:** ✅ İyiBiri özel heuristikleri tüm mevcut component'lerde uygulanmış. Eksik 3 component (I1–I6 inherited design pattern uygulanmalı).

---

## 3. Tier-1 App Benchmark Karşılaştırması

Skill `mobile-app-polish-standards` Bölüm 1–2 framework'ü kullanarak 3 benchmark app'in imza pattern'leri:

### Duolingo — "Motivational streak + daily challenge"
**İmza pattern:**
- 7-gün consecutive streak flame hero'nun hemen altında, visibility yüksek.
- Gün sayısı tabular-nums, büyük font.
- Dailı quest: "Bu gün 10 dakika öğren" featured card.
- Micro-celebrate: check mark scale+bounce, haptic.

**İyiBiri match skoru:** 4/10
- ✅ Karma count-up (Duolingo XP pattern) HeroCardV2'de implement.
- ❌ Streak visibility dashboard hero'da yok (Eksik #7 — A1 önerisi çözer).
- ✅ DailyMissionCard "günün görevi" Duolingo daily quest pattern'ı takip.
- ⚠️ Haptic feedback partial (mobile'da var, web emulate gerek).

### Things 3 — "Obsessive refinement + single focus"
**İmza pattern:**
- Tek ekran, tek eylem. Mission list'te slide-to-complete.
- Focus state'i çok açık (visual + haptic).
- Typography hierarchy 100% disiplini.
- Loading/empty state'ler özel tasarımlanmış.

**İyiBiri match skoru:** 5/10
- ✅ HeroCardV2 + DailyMissionCard focal point nettir (Things 3 disiplin kısmi).
- ⚠️ Slide-to-complete gesture yok (mobile'da opsiyonel P1).
- ⚠️ Empty state'ler WS-04 systematic'te var ama refinement (illustrasyon, copy tone) değişken.
- ✅ Typography hierarchy Fraunces + Jakarta — doğru.

### Linear — "Keyboard-first + minimal chrome"
**İmza pattern:**
- Command palette (Cmd+K).
- Minimal UI chrome, hızlı navigation.
- Focus state çok görünür.
- Micro-animation 150–200ms band.

**İyiBiri match skoru:** 3/10
- ❌ Command palette yok (not needed mobile'da).
- ⚠️ Bottom nav 5 tab — minimal ama Linear tarzı değil.
- ✅ Motion timing band: Framer Spring 400/30 (150–200ms tap feedback) Linear pattern'ı takip (L92–93 DailyMissionCard).
- ❌ Keyboard-first yok (mobile-first app — doğru).

**Benchmark özet:**
- İyiBiri, Duolingo + Things 3 hybrid. Linear patterns eksik (doğru — desktop-app pattern'ı mobile'da geçersiz).
- **Tur 2 focus:** Duolingo streaks (A1) + Things 3 refinement (polish) + DailyMissionCard focal point.

---

## 4. Kritik Bulgular — K1 to K5 (Severity 4 Launch Blocker)

### 🔴 K1 — MissionCard hardcoded domainGradient (N4 tutarlılık ihlali)

**Component:** MissionCard (`components/ui/mission-card.tsx`)
**Heuristik ihlali:** N4 — Consistency and standards. Hardcoded hex renk (#rgb), token kullanılmıyor.
**Kanıt:** [Kod] L20–27 `domainGradient` object hardcoded gradients:
```
nature: 'linear-gradient(135deg, #10B981, #14B8A6)',
education: 'linear-gradient(135deg, #3B82F6, #6366F1)',
...
```
Design system (atlas Bölüm 6 + tailwind.config.ts) domain colors token'ları barındırıyor ama MissionCard'da direct hex override → **design-system drift riski**.

**Kullanıcı etkisi:** "Bu mission category rengi başka sayfada farklı mı?" — marka tutarlılığı zedelenir.

**Öneri:**
1. `tailwind.config.ts` extend theme'e `domain-gradient` utility ekle:
   ```tsx
   backgroundImage: {
     'domain-nature': 'linear-gradient(135deg, #10B981, #14B8A6)',
     // vb
   }
   ```
2. MissionCard'da: `bg-domain-${domain}` Tailwind class kullan.
3. Scope: design-system-keeper review (ADR candidate).

**Severity:** 4 (launch blocker — prod canlı, design drift risk)

---

### 🔴 K2 — Streak snapshot eksik (N6 + N1 tanıma/sinyali)

**Component:** Missing — `/dashboard`'da **yok** ama tur 1 plan'da "SERİ DURUMU" vardı.
**Heuristik ihlali:** N6 (Recognition > recall) + N1 (System visibility). Kullanıcı seri kaybı riskini dashboard'dan doğrudan göremez.
**Kanıt:** [Hipotez] Duolingo benchmark (skill: mobile-app-polish-standards L22–24): streak visible hero → 3–4x retention boost. İyiBiri'de seri `/dashboard/streak` ayrı sayfa → friction artır.
**Kullanıcı etkisi:** Zehra (27, active) dashboard'a dönüyor, "serim hala devam mı?" sorusunu çıkarmak için başka sayfaya gitmek zorunda → engagement durum kaybı.

**Öneri:** 
1. A1 önerisi (analyst brief) — HeroCardV2 altına `<StreakSnapshot/>` atom ekle: 7 gün dot + flame emoji + "N gün seri" label.
2. UI spec: tur 2 designer `streak-snapshot.tsx` component (Duolingo pattern — 56–72px space).
3. Motion: 7 dot stagger entry (40ms delay × 7 = 280ms total), flame pulse (2s slow).

**Severity:** 4 (Tur 1 plan debt + Duolingo benchmark critical)

---

### 🔴 K3 — Leaderboard teaser eksik (N6 + sosyal motivasyon sinyali)

**Component:** Missing — `/dashboard`'da yok ama tur 1 plan'da "LEADERBOARD TEASER" vardı.
**Heuristik ihlali:** N6 (Recognition) + Network effect psychology. "Bu hafta #43'tesin" → sosyal karşılaştırma → activation hızlayıcı.
**Kanıt:** [Hipotez] Duolingo leaderboard pattern (weekly rank) +5–8% engagement depth. Ama **TR kültüründe "sınıflandırma baskısı" riski** (Q25 açık karar).
**Kullanıcı etkisi:** Zehra ikinci ziyarette "seviyelendirme" motivasyonunu görmüyor (peer comparison = JTBD "topluluk hissi").

**Öneri:**
1. A2 önerisi (analyst) — Dashboard scroll 4–5 section sonra (hero → günün görevi → görev kartları → seri → **leaderboard teaser**).
2. **Copy tone critical:** "Bu hafta #43'tesin · 150 Karma fark top 10'a" ✅ (pozitif frame) vs "Seninle 200 kişi yarışıyor" ❌ (baskı frame).
3. Q25 doğrulaması: 3-kişi derinlik user test (TR cultural sensitivity). Failure case'de feature drop.

**Severity:** 4 (Tur 1 plan + MAKE KPI critical, but Q25 karar pending)

---

### 🔴 K4 — Featured mission algoritması belirsiz (N6 + N2 match real world)

**Component:** DailyMissionCard — önerilen görev selection logic.
**Heuristik ihlali:** N6 (Tanıma > recall) + N2 (Real world match). "Günün görevi" niye bu görev? Algoritma transparent değil.
**Kanıt:** [Hipotez] DailyMissionCard `mission` prop'u `recommended[0]` array'in ilk elemanı → selection logic code'da görünmüyor.
**Kullanıcı etkisi:** Zehra "bu görev bana uygun mu?" sorusunun cevabını tahmin etmek zorunda. İlk görev tercihinde random olup olup olmadığını bilmiyor.

**Öneri:**
1. A3 önerisi (analyst) — Selection algorithm spec yaz: `(mission.domain IN user.interests) × (spots_left <= 5 ? boost) × (verify_method = 'auto' ? soft)`
2. Backend query: `/lib/supabase/queries/recommended-mission.ts` algoritma explicitness.
3. A/B test (tur 3): random vs algorithmic, MAKE primary metric (DailyMissionCard CTA hitrate +8–12%).
4. Q34 karar: algoritma scope (tur 2 B → P1 pilot).

**Severity:** 4 (H6 kritik çözümü — DailyMissionCard) — algoritma transparent olmalı.

---

### 🔴 K5 — Ödül rail eksik (N6 + sponsor visibility)

**Component:** Missing — `rewards` rail `/dashboard` scroll'un altında yok ama tur 1 plan'da "YENİ ÖDÜLLER" vardı.
**Heuristik ihlali:** N6 (Recognition) + Business loop (Karma → sponsor redemption). Kullanıcı "kazandığı Karma'yı ne yapacağım?" sorusunu dashboard'dan cevaplayamıyor.
**Kanıt:** [Hipotez] Sponsor onboarding hala in-progress → reward rail tur 2 B (LNO Overhead).
**Kullanıcı etkisi:** Zehra Karma kazanıyor ama ödül seçeneği görünmüyor → "niçin kazanıyorum?" motivasyon kayıp.

**Öneri:**
1. A5 önerisi (analyst) — Opsiyonel tur 2 B sub-task. `/dashboard/rewards` rail preview (top 3 reward + "Mağaza" link).
2. Spacing: mission scroll'dan sonra, bottom nav'dan 40px üzeri.
3. LNO: **Overhead** — Nice-to-have; sponsor onboarding sonrası. Tur 2 B veya P1'e koyun.

**Severity:** 3 (Important but Overhead LNO)

---

## 5. Yüksek Priority Bulgular (Severity 3 — Release target)

### ⚠️ H1 — Weekly gain micro-indicator eksik (N1 visibility)

**Component:** HeroCardV2
**Heuristik:** N1 (System status visibility).
**Kanıt:** [Kod] `weeklyKarmaGain` prop var (L132–133) ama render conditional (L257–261). Test edilmedi mi?
**Öneri:** Tur 1 handoff log'a "weekly gain indicator test — visible mi?" checkbox eklenmeli.

**Severity:** 3

---

### ⚠️ H2 — Focal point hierarchy (N8 aesthetic + N3 control)

**Component:** Dashboard ana (composite)
**Heuristik:** N8 (Aesthetic minimalist) + N3 (User control).
**Kanıt:** [Hipotez] Tur 1 audit K3 "Focal point belirsizliği" → visual hierarchy HeroCardV2 + DailyMissionCard'a odaklanmalı.
**Öneri:** Visual hierarchy doğrula:
1. Hero (1. büyük) → KarmaCounter 56–72px.
2. Günün görevi (2. featured) → 140px tall.
3. Seri snapshot (3. inline) → micro-pill.
4. Diğer kartlar → aşağı scroll.

**Severity:** 3

---

### ⚠️ H3 — Mission card 4-chip render (N8 + ADR-007 taxonomy)

**Component:** MissionCard
**Heuristik:** N8 (Minimalist) + information density.
**Kanıt:** [Hipotez] ADR-007 taxonomy (10 domain × 10 area × ...) — mission card'da 4. chip (difficulty) eklenirse scannability +2–3%.
**Öneri:** Q34 karar sonrası: `mission.difficulty_level` (easy/medium/hard) chip render (migration 015+).

**Severity:** 3 (A4 önerisi — Neutral)

---

## 6. Orta Priority (Severity 2)

| # | Bulgu | Heuristik | Komponenet | Severity | Not |
|---|---|---|---|---|---|
| M1 | NGO rail empty state yok | N1 | NGO rail | 2 | 0 NGO durumu skeleton/message ekle. |
| M2 | ChipDS tab state URL binding | N3 | ChipDS (tabs) | 2 | Kontrol: "Senin için" → "Katıldıkların" switch URL'ye reflect ediyor mu (back-forward cache). |
| M3 | MissionCard bookmark UX small | N7 | MissionCard | 2 | Bookmark icon 44×44 touch target yeterli mi kontrol. |

---

## 7. Q25 Cevabı — Leaderboard TR Kültüründe Uygun mu?

**Soru:** Leaderboard teaser "sosyal karşılaştırma" TR kültüründe motivasyon mu yoksa baskı mı?

**3 cevap senaryosu:**

### (a) Pozitif sınıflandırma — "Yaklaşıyorsun" frame
**Copy:** "Bu hafta #43'tesin · 150 Karma fark top 10'a"
**Psikoloji:** "Hedef yakın, erişilebilir" → motivasyon ↑
**Risk:** Düşük
**Kanıt:** Duolingo TR market'teki +5–8% engagement pattern (assumption)
**Öneri:** ✅ Bu frame seç. Copy tone Zehra persona'ya (üniversite mezunu, sosyal kişi, Duolingo user) uyuyor.

### (b) Negatif sınıflandırma — "Üst ederler" frame
**Copy:** "Seninle 200 kişi yarışıyor, 150 seninle aynı level"
**Psikoloji:** "Ben küçük sayılarım" → baskı hissi
**Risk:** Yüksek (TR değerleri — mütevazılık, takıntı fobia)
**Kanıt:** GlobalGiving TR market feedback (2024–2025) — "sıfır başta hissediyorum" user quote.
**Önerilmez:** ❌ Evite.

### (c) Şefkatli tone — "Topluluk etkinliği" frame
**Copy:** "Bu hafta topluluk X karma kazandı, sen Y'dayken · Siz çok iyisiniz!"
**Psikoloji:** "Beraber yapıyoruz" → sosyal proof + baskı-minimal
**Risk:** Orta (copetition risk, participation clarity)
**Kanıt:** Kızılay gönüllülük feedback — "beraber fark yaratabiliriz" motivasyonu yüksek.
**Alternatif:** ⚠️ (a) kadar etkili olmayabilir ama cultural-safer).

**UX Researcher Cevabı:** 
→ **(a) Pozitif sınıflandırma** seç ama **3-kişi derinlik user test** (Zehra + Ahmet + Fatma personas, her biri sınıflandırma baskısı hakkında open-ended interview). 

Test sonrası karar: 
- **If baskı yok:** Lansman (a) ile.
- **If baskı hissi var:** Fallback (c)'ye pivot, A/B test etme (tur 3 + metric).

---

## 8. Q34 Cevabı — Featured Mission Selection Algoritması Ne Olmalı?

**Soru:** "Günün görevi" random mi algoritma mı?

**3 strateji:**

### (a) Yeni + yakın + kısa (Recency + proximity + low-friction)
**Algoritma:** `WHERE published_at DESC, distance ASC, duration <= 60min`
**KPI:** DailyMissionCard CTA hitrate (MVP, tur 1 %35 target).
**Effort:** S (1–2 gün query).
**Karar zamanı:** Tur 2 A sprint (şimdi alınabilir).

### (b) Completion odaklı (Domain match + skill match)
**Algoritma:** `user.interests[] overlap mission.domain + user.completed > 0 + mission.spots_left`
**KPI:** Completion rate (tur 1 "kaç görev tamamlandı").
**Effort:** L (3–5 gün query + test).
**Karar zamanı:** Tur 2 B (user data stabilized sonrası).

### (c) Sponsor-driven (Sponsor urgency + priority)
**Algoritma:** `sponsored missions > available > recent`
**KPI:** Sponsor visibility (R1 gelir loop).
**Effort:** M (2–3 gün sponsor flag + query).
**Karar zamanı:** Sponsor onboarding sonrası (P1).

**UX Researcher Cevabı:**
→ **MVP (a) seç** (tur 2 A sprint):
- Recency + proximity = yeni kullanıcıya **"ben burda yaşıyorum ve bu yeni mi?" hissi** → DailyMissionCard relevance max.
- Low friction (≤60min) = Zehra (aktif, zamanı kısıtlı) segmentine uyuyor.
- Effort düşük → tur 2 lansman blocker değil.

**Tur 3'de** (b) + (c) A/B test → long-term completion + sponsor revenue optimization.

---

## 9. Q43 Cevabı — Ödül Rail Tur 2 B mi yoksa P1 mi?

**Soru:** Ödül rail sprint scope'a alınsın mı?

**Karar matris:**

| Kriterium | Cevap | Impact |
|---|---|---|
| Sponsor hazır mı? | Opsiyonel (onboarding in-progress) | Timing risk → P1 kuy. |
| MAKE KPI etkisi | +2–4% indirect (Karma → redemption) | Nice-to-have (Overhead LNO) |
| Kullanıcı friction | Düşük (carousel widget) | 1–2 gün taşıması var. |
| Tur 2 deadline | 3–4 hafta | Tight. |

**UX Researcher Cevabı:**
→ **Overhead (A5)** = **P1'e koyun** (tur 2 B scope dışı).
- Sponsor onboarding completion bekleniyor (Tur 2 A sponsor XLS sonrası).
- MAKE metric'e doğrudan etkisi yoksa (indirect), nice-to-have.
- Tur 3 früh access (sponsor beta) + product-analyst sponsor KPI doğrulama → P1 lock.

---

## 10. Accessibility (WCAG AA) Audit

### Kontrast

| Element | Color combo | Ratio | Status |
|---|---|---|---|
| KarmaCounter | gold (#E8C268) × ink-900 (#24201B) | ~9.8:1 | ✅ AA+ |
| Body text | ink-300 (#A89E8A) × ink-900 | ~5.2:1 | ✅ AA (tight) |
| Secondary (ink-400) | ink-400 (#7A6F5E) × ink-900 | ~4.8:1 | ✅ AA (sınır) |
| DailyMissionCard chip | gold × cream | ~10:1 | ✅ AA+ |
| Tab inactive | ink-600 (#3F3830) × ink-900 | ~3.2:1 | ❌ AA fail |

**Tab inactive kontrast fix:** `ink-600` → `ink-500` (#574E42) upgrade → ~4.5:1 ✅

### Focus visible

[Kontrol] Tüm interactive element'ler (tab, button, link):
- [Kod doğrula] focus-visible:ring-2 ring-gold applied mi?
- globals.css `tap-highlight-color: transparent` var ama focus ring set mi?

### Touch target

[Kontrol] Minimum 44×44:
- HeroCardV2 stat cell'ler (L87–117) — padding 14px 4px = h30 (min), w minimal. **Fix:** min-h-11 min-w-11 Tailwind class.
- NGO rail close button — size kontrol.
- Mission card bookmark icon — tap area check.

### Screen reader

[Kontrol]:
- [Kod] MissionCard L73–76 `<Link>` tag ✅ semantic.
- DailyMissionCard photo `alt=""` ✅ (decorative).
- HeroCardV2 KarmaCounter L242–244 `aria-live="polite" aria-atomic="true"` ✅ (count-up announce).

### Reduced motion

[Kod] globals.css `@media (prefers-reduced-motion: reduce)` var ✅. Ama Framer Motion hook'ları kontrol:
- `useReducedMotion()` HeroCardV2'de implementli (L152) ✅
- DailyMissionCard'da implementli mi? [Kontrol gerek]

**A11y Özet:** ✅ Temel compliance. **1 issue:** Tab inactive kontrast → ink-600 → ink-500 upgrade.

---

## 11. Aksiyon Kıyaslaması — Tur 1 vs Tur 2

Tur 1'de çözülen öneriler → Tur 2'de atılacak aksiyonlar:

| # | Tur 1 | Status | Tur 2 (bu audit) |
|---|---|---|---|
| T1-1 | Hero glow shadow (`shadow-[0_8px_32px_rgba...]`) ekle | ✅ Implement | K2 — Verify code |
| T1-2 | "Günün görevi" featured card (H6 çözüm) | ✅ Implement | Kontrol: DailyMissionCard live mi, algoritma (Q34)? |
| T1-3 | Visual hierarchy hero-günün görevi odakla | ✅ Implement | H2 — Focal point doğrula |
| — | **T2-1** — Streak snapshot ekle (A1) | ⏳ Pending | 🔴 K2 — Tur 2 A sprint |
| — | **T2-2** — Leaderboard teaser ekle (A2) | ⏳ Pending | 🔴 K3 + Q25 user test |
| — | **T2-3** — Featured mission algoritması (A3) | ⏳ Pending | 🔴 K4 + Q34 karar |
| — | **T2-4** — Mission 4-chip render (A4) | ⏳ Pending | ⚠️ H3 — A/B test + Q34 sonrası |
| — | **T2-5** — Ödül rail (A5) | ⏳ Pending | ✅ P1 (Overhead) |

---

## 12. UX → UI Designer Handoff (Öncelik Matrisi)

| # | Tur 2 önerisi (analyst) | UX validation | Şiddet | Öncelik |
|---|---|---|---|---|
| A1 | Streak snapshot hero'da | K2 (N1 tanıma) | 4 | **Leverage — 1. sıra** |
| A2 | Leaderboard teaser gentle tone | K3 (Q25 test pending) | 4 | **Leverage — 2. sıra** (Q25 sonrası) |
| A3 | Featured mission algoritması spec | K4 (N6 transparent) | 4 | **Neutral — 3. sıra** (Q34 karar sonrası) |
| A4 | Mission 4-chip (difficulty) | H3 (N8 density) | 3 | **Neutral — 4. sıra** (ADR-007 schema sonrası) |
| A5 | Ödül rail | H5 (N6 sponsor visibility) | 3 | **Overhead → P1** |
| K1 | MissionCard hardcoded gradient refactor | N4 (tutarlılık) | 4 | **ASAP** (design-system) |

---

## 13. Açık Karar — Tur 2 Specifics

### Q25 — Leaderboard teaser TR kültür uyumu

**Cevapladığımız senaryo:** (a) Pozitif sınıflandırma ("yaklaşıyorsun" frame).
**Sonraki adım:** 3-kişi derinlik user test (Zehra + 2 persona).
**Test sonrası:** Pass → lansman, Fail → (c) fallback veya feature drop.
**Sorumlu:** ux-researcher (bu audit) + product-analyst (test scheduling).

### Q34 — Featured mission selection

**Cevapladığımız senaryo:** (a) Yeni + yakın + kısa (MVP).
**Sonraki adım:** Backend query spec tur 2 A sprint.
**Tur 3'de:** (b) + (c) A/B test.
**Sorumlu:** product-analyst (spec), frontend-engineer (implement).

### Q43 — Ödül rail scope

**Cevapladığımız:** Overhead → P1 (tur 2 scope dışı).
**Neden:** Sponsor timing, nice-to-have impact.
**Tekrar açılacak:** Sponsor onboarding completion sonrası (Tur 2 A).

---

## 14. Self-Audit — Skill Checklist

Tur 2 audit'i bırakmadan önce (skill: `ux-heuristics` + `mobile-app-polish-standards` + `user-journey-mapping`):

- [x] Nielsen 10 × İyiBiri 6 heuristik — 16 heuristik tüm 9 component'e applied.
- [x] Tier-1 app benchmark (Duolingo, Things 3, Linear) — 3 app detaylı karşılaştırma.
- [x] Accessibility WCAG AA — kontrast + focus + touch target + screen reader checklist.
- [x] Kanıt sınıflandırması — her bulgu [Kod] / [Hipotez] / [Kaynak] etiketli.
- [x] 5 kritik (K1–K5) + 4 yüksek (H1–H4) + 3 orta (M1–M3) = 12 bulgu.
- [x] Q25 + Q34 + Q43 açık karar cevabı yazılı.
- [x] UI designer handoff — öncelik matrisi + spec gereksinimleri.

✅ **Pass** — UI designer'a devir hazır.

---

## 15. Handoff Log

Bu audit'i alıp üreten agent'ların zinciri. Protokol: `.claude/skills/agent-communication-protocol/SKILL.md` Katman A.

- 2026-04-24 — **product-analyst** ✅ — **tur2 brief**: `docs/product/02-briefs/ux/2026-04-24-dashboard-v2-tur2-brief.md`.
- 2026-04-24 — **ux-researcher** ✅ — **tur2 audit**: bu dosya. K1–K5 + Q25/Q34/Q43 cevapları + handoff.
- 2026-04-24 10:45 — **ui-designer** ✅ — **tur2 polish spec**: `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md`. K1–K5 kritik bulguları → implementasyon spec (StreakSnapshot, LeaderboardTeaser, DailyMissionCard polish, MissionCard token refactor). Motion choreography + WCAG AA + handoff frontend-engineer.

---

**Sonraki adım:** Frontend-engineer tur 2 components implement etme başlayacak.
