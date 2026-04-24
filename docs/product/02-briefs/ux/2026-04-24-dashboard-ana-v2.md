# UX Brief — Dashboard Ana v2

**Tarih:** 2026-04-24
**Sahip (brief):** product-analyst
**Sonraki sahip:** ux-researcher → ui-designer → frontend-engineer
**Master plan:** `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md` #12
**Priority:** P0 · **Effort:** L (2-3 hafta toplam)
**Bağlı ADR:** ADR-001 (NSM = MAKE), ADR-004 (dark-only V1)

## 1. Özet (1 paragraf)

Dashboard ana ekranı (`/dashboard`) şu an production durumunda (atlas Bölüm 3) ama **North-Star Metric MAKE (Monthly Active Karma Earner)** kavramıyla tam hizalanmış değil. Kullanıcı ilk açtığında "bugün ne yapabilirim, nasıl ilerledim" sorularına 3 saniyede cevap bulmalı. Bu brief dashboard'u "aktif Karma kazanımı" merkezine çeken iyileştirmeyi çerçeveler.

## 2. Hedef kullanıcı + JTBD

- **Persona:** P1 (18-28 genç dijital) + P2 (28-40 orta-gelir profesyonel) — atlas Bölüm 1.
- **JTBD:** "İyiBiri'yi açtığımda: (a) kaç Karma'm var + seviye ne, (b) bugün hangi görevi yapabilirim, (c) seri kırılmaması için ne gerek, (d) yeni bir keşif var mı — tek bakışta anlamak istiyorum."

## 3. Mevcut durum — gözlem

**Kod:** `app/dashboard/page.tsx` + `app/dashboard/dashboard-client.tsx`. Dark mode altında (ADR-004 fix sonrası). Hero + mission card'lar + bottom nav.

**Eksikler (hipotez, UX researcher doğrulayacak):**
- **H1:** Hero MAKE sinyali zayıf — Karma toplamı var ama "bu ayın ivmesi" yok.
- **H2:** Günlük görev CTA belirsiz — kullanıcı ne yapmalı ilk 10 sn.
- **H3:** Streak durumu hero'da görünmüyor — motivasyon kaldıracı zayıf (Duolingo benchmark: streak 7-gün consecutive 3-4x retention).
- **H4:** Leaderboard teaser yok — sosyal motivasyon kaldıracı kullanılmamış.
- **H5:** Sponsor marka ödül önizleme eksik — R1 gelir kolu kullanıcı algısında zayıf.

## 4. Önerilen akış (delta)

```
┌─────────────────────────────────────┐
│  header: "Merhaba, Zehra 👋"         │  sticky
│  +17 bu hafta · seri 🔥 5 gün       │
├─────────────────────────────────────┤
│                                     │
│   HERO CARD (gold glow)             │
│   1.240 Karma · İyi Biri seviye     │
│   ▓▓▓▓▓▓░░░ 60% sonraki seviye     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   GÜNÜN GÖREVİ                      │
│   [mission-card — featured]         │
│   "2 saatte 200 Karma kazan"        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   SANA UYGUN GÖREVLER (3)           │
│   [mission-card × 3]                │
│   [Tümü →]                          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   SERİ DURUMU                       │
│   [streak snapshot — 7 gün dots]    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   LEADERBOARD TEASER                │
│   "Bu hafta #43'tesin — 150 Karma   │
│    fark top 10'a"                   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   YENİ ÖDÜLLER                      │
│   [reward-card × 2]                 │
│   [Mağaza →]                        │
│                                     │
├─────────────────────────────────────┤
│   bottom nav (fixed)                │
└─────────────────────────────────────┘
```

**Scroll mantığı:** Hero ilk ekranda tam görünür. Günün görevi ikinci scroll. Seri + leaderboard üçüncü. Bottom nav her zaman.

## 5. Cognitive load (taşınan yük)

**Azalan:**
- Hero'da tek büyük Karma sayısı + seviye + ilerleme = tek bilgi yoğunluğu.
- Günün görevi vurgulu = decision fatigue azalır.

**Yeni eklenen:**
- Streak hatırlatıcısı → "seri kırılmasın" motivasyonu.
- Leaderboard teaser → sosyal karşılaştırma stresi dengeli sunulmalı (aşırıya kaçmaz).

## 6. Başarı kriterleri

- **Primary (MAKE KPI):** Dashboard açan kullanıcının %35+ aynı oturumda en az 1 mission page'e tıklaması.
- **Secondary:** Ortalama oturum süresi dashboard'a **+15 saniye** (ilk 10 saniye okumadan iterasyon sonrası).
- **Nitel:** 5-second test → "Burada ne var?" sorusuna %80+ "Karma kazanmak / görev yapmak" cevabı.

## 7. Kısıtlar

- **Mobile-first:** max-w-lg mx-auto. Desktop geniş boşluk.
- **Dark-only V1** (ADR-004).
- **Design system token'ları** — hardcoded renk yok (atlas Bölüm 6). Hero glow imza gölge.
- **Motion:** Framer Motion spring default. KarmaCounter animate (atlas örnek).
- **Safe area:** pb-safe bottom nav.
- **Loading state:** skeleton (WS-04 sistemik, paralel iş).

## 8. UI ipuçları (tasarımcıya, prescriptive değil)

- **Hero:** `rounded-3xl` + gold glow shadow + bg ink-800 gradient, 32px padding. KarmaCounter tabular-nums font-display font-black text-5xl.
- **Mission card:** mevcut `components/ui/mission-card.tsx` (canonical karar sonrası) kullanılır, 4 chip (aktivite/alan/süre/skill — ADR-007 taxonomy).
- **Streak snapshot:** 7 gün dot — aktif gün gold, boş gün ink-600. Flame icon 🔥.
- **Leaderboard teaser:** mesaj ton gentle ("fark az" değil "yaklaşıyorsun" pozitif).

## 9. Test önerisi (UX researcher için)

- **5-second test** — 5 saniye sonra "Burada ne var, ne yapabilirsin?"
- **1. tıklama testi** — "Bugün bir görev yapmak istiyorsun, nereye tıklarsın?"
- **Tree test (varsa)** — hiyerarşi anlaşılır mı.
- **A/B test aday:** Streak snapshot hero altı vs aşağı scroll yeri.

## 10. Açık sorular (UX researcher için)

- Sponsor marka ödül önizleme dashboard'a mı, `/rewards` altı mı? (1. scroll çok yükleniyor mu?)
- Leaderboard teaser TR kültüründe gerçekten motivasyon mu yoksa baskı mı? Küçük kullanıcı testi ile doğrula.
- "Günün görevi" random mi algoritma mi? NSM impact farkı ne?

## 11. Kısıtlı kaynaklar / bağımlılık

- `components/ui/mission-card.tsx` canonical karar gerek (design-system-keeper, P0, master plan #3.A).
- Streak snapshot component (yeni atom veya `streak-flame.tsx` genişletme).
- Leaderboard teaser veri — `lib/supabase/queries/` yeni query.
- `009_parametric_ngo_fee.sql` + `010_payment_routing.sql` apply edilmiş olmalı (bazı rozet/tier gösterimi için).

## 12. Handoff

- **UX researcher:** bu brief'i heuristik audit + journey map + visual wireframe'le derinleştir (1 hafta iş).
- **UI designer:** UX brief'ten UI spec yaz — token × variant × state tablosu + motion + responsive (5 gün iş).
- **frontend-engineer:** UI spec'ten implement (5-7 gün iş).
- **Visual QA:** ui-designer review (2 gün).

**Toplam:** 2-3 hafta paralel iş.

## Handoff log

Bu brief'i alıp üreten agent'ların zinciri. Protokol: `.claude/skills/agent-communication-protocol/SKILL.md` Katman A.

- 2026-04-24 06:30 — **ux-researcher** ✅ — **audit + journey**: `docs/ux/03-heuristics/2026-04-24-dashboard-ana-v2-heuristik-audit.md` + `docs/ux/02-journeys/2026-04-24-dashboard-ilk-acil-journey.md`. Kritik 3 bulgu (H6 günün görevi, I6 hero glow, H8 focal point). *(retroactive)*
- 2026-04-24 06:45 — **ui-designer** ✅ — **spec**: `docs/ui/01-specs/2026-04-24-dashboard-ana-v2-ui-spec.md`. Audit K1-K5 → spec Bölüm 2-10. 12-maddelik quality checklist pass. *(retroactive)*
- 2026-04-24 06:45 — **frontend-engineer** ✅ — **component scaffold**: `components/dashboard/hero-card-v2.tsx` + `daily-mission-card.tsx` + `app/globals.css` heroGlowBreathing. *(retroactive)*
- 2026-04-24 11:45 — **frontend-engineer** ✅ — **wire-in**: `app/dashboard/dashboard-client.tsx` HeroCard→HeroCardV2 + DailyMissionCard section. `lib/karma-level.ts` helper. Weekly karma gain query. TSC 0 hata + 83/83 test. *(retroactive)*
- 2026-04-24 15:00 — **frontend-engineer** ⚠️ — **regression + fix**: HeroCardV2 tier sistemi (5 tier dots) + BrandLogo + 3 stat cells kayboldu, restore edildi. User feedback ile tespit. *(retroactive)*
- 2026-04-24 — **product-analyst** ✅ — **tur2 brief + inventory audit**: `docs/product/02-briefs/ux/2026-04-24-dashboard-v2-tur2-brief.md`. 9 mevcut component inventory + 3 missing (streak snapshot, leaderboard teaser, reward rail) + 5 improvement (Leverage 2 + Neutral 2 + Overhead 1). Next: UX researcher tur 2 heuristik audit.
