# UX Brief — Dashboard Ana v2 (Tur 2 İyileştirme ve Boşluk Analizi)

**Tarih:** 2026-04-24
**Sahip:** product-analyst
**Sonraki sahip:** ux-researcher → ui-designer → frontend-engineer
**Bağlı plan:** master plan P0 #1 (dashboard ana v2)
**Bağlı ADR:** ADR-001 (NSM = MAKE), ADR-004 (dark-only V1)
**Tur 1 ref:** `docs/product/02-briefs/ux/2026-04-24-dashboard-ana-v2.md` (canlı duruma geçti 2026-04-24 11:45)

---

## 1. Özet (İçeriği)

Tur 1 (2026-04-24 sabah) dashboard v2 **canlıya çıktı**: HeroCardV2 (gold glow breathing + Karma count-up + tier progress) + DailyMissionCard (Things 3 focal point) + mission cards tab switcher ("Senin için" / "Katıldıkların") + NGO rail + bottom nav. **Tur 2 amacı:** canlı component'lerin inventory polonya + eksik kullanıcı sinyalleri tespiti + MAKE KPI'ye tam hizalama kontrolü. **Çıktı:** component değerlendirme tablosu + 3-5 iyileştirme önerisi (Leverage/Neutral/Overhead prioritizasyonu) + handoff UX researcher'a.

---

## 2. JTBD + MAKE Uyum Analizi

**Tur 1 hedef (ADR-001 + 2026-04-24-dashboard-ana-v2.md):**
- Kullanıcı dashboard açtığında "ne yapabilirim, nasıl ilerliyorum, seri durum" soruları 3 saniyede çözülür.
- Primary KPI: dashboard açan kullanıcının %35+ aynı oturum içinde mission page'e tıklaması.
- Metric: MAKE (aylık Karma kazanan aktif user) → dashboard landing page **kritik conversion funnel**.

**Gözlem (tur 1 handoff log'dan):**
- ✅ HeroCardV2 deploy + Karma count-up görünüyor.
- ✅ DailyMissionCard featured "günün görevi" şekilde render ediliyor.
- ⚠️ Weekly gain micro-indicator (kod'da `weeklyKarmaGain` pass var) — component state'te gösteriyor mu?
- ⚠️ "Sana uygun görevler" → recommendation engine açık (statik mock mi, dinamik mi).
- ❌ **Leaderboard teaser (tur 1 plan'da var)** — UI spec'te kalıp implement edilmemiş gibi gözüküyor.
- ❌ **Sponsor marka ödül preview** (tur 1 plan "YENİ ÖDÜLLER rail") — dashboard'da görünmüyor.
- ❌ **Başarı kriteri çalışıyor mu test edildi mi** (5-second test, 1. tıklama testi)?

---

## 3. Mevcut Component Envanteri (Tur 1 Canlı)

| # | Component | Dosya | Rol | MAKE fit (1-5) | Polish seviye (1-5) | Sorun/Boşluk |
|---|---|---|---|---|---|---|
| 1 | **HeroCardV2** | `components/dashboard/hero-card-v2.tsx` | Hero — Karma toplam, tier progress, 3 stat cell (aktif/tamamlanmış/seri) | 5 | 4 | Tier dots (1-5) + BrandLogo geri getirildi tur 1 revizede; breathing glow çalışıyor. Eksik: tier name italic renk toggle (dark-mode contrast check). |
| 2 | **DailyMissionCard** | `components/dashboard/daily-mission-card.tsx` | Featured "günün görevi" (Things 3 pattern) | 5 | 4 | Photo hero + impact statement + CTA ("Başvur"). Eksik: featured görev selection (random mi, algorithmic mi?). |
| 3 | **MissionCard** | `components/ui/mission-card.tsx` (canonical karar D4) | Mission list item (aktivite × alan × süre × beceri 4 chip, varsa) | 4 | 3 | Kategori badge + bookmark + stats. Eksik: mission.category field ve 4-chip render (ADR-007 taxonomy 10 aktivite × 10 alan). |
| 4 | **ChipDS (tab switcher)** | `components/ui/ds/chip.tsx` | Tab toggle ("Senin için" / "Katıldıkların") | 5 | 5 | Varsayılan DS component. OK. |
| 5 | **NGO rail** | `app/dashboard/dashboard-client.tsx` satır 324 (horizontal scroll) | 1:1 cover + 36px logo disk + member gold border. Fotograf eksikse domain gradient fallback. | 4 | 3 | Logo disk doğru; member border çalışıyor. Eksik: NGO rail empty state (0 NGO durumu test). |
| 6 | **Bottom nav** | `components/bottom-nav.tsx` | Fixed sticky nav (5 tab). | 4 | 4 | Taşıma "Keşfet" → "Ödüller" pending (P1 usage data sonrası). |
| 7 | **Streak snapshot (referans tur 1 plan)** | — | 7-gün dot + flame — **PLANNED AMA MISSING** | — | — | Tur 1 plan'da var ("SERİ DURUMU" bölüm), code'da görünmüyor. |
| 8 | **Leaderboard teaser (referans tur 1 plan)** | — | "Bu hafta #43'tesin" + top-10 fark — **PLANNED AMA MISSING** | — | — | Tur 1 plan'da var ("LEADERBOARD TEASER" bölüm), code'da eksik. |
| 9 | **Ödül rail (referans tur 1 plan)** | — | "YENİ ÖDÜLLER" 2-3 reward-card + mağaza link — **PLANNED AMA MISSING** | — | — | Tur 1 plan'da var, code'da görünmüyor. |
| 10 | **EmptyStateV2** | `components/ui/state/index.tsx` (WS-04 new) | "Sana uygun görev yok" / "Aktif görev yok" | 3 | 4 | State library recent; render var (dashboard-client.tsx satır 253-256). OK. |
| 11 | **KarmaDotToken** | `components/ui/ds/karma-dot-token.tsx` | Karma icon (hero'da). | 5 | 5 | OK. |
| 12 | **ImpactSummary** | `components/ui/ds/impact-summary.tsx` | En alttaki "X görev tamamladınız, Y Karma kazandınız" snippet. | 3 | 3 | Basit; ekstra değer düşük. |

---

## 4. Boşluk Tespiti — MAKE Drive'da Eksik Sinyaller

**MAKE (Monthly Active Karma Earner) = ay içinde en az 1 görev tamamlayıp ≥1 Karma kazanan kullanıcı.** Dashboard'ın tur 1 task'ları %35 mission-page tıklama KPI — tur 2'de "niye kalan %65 konuşmuyor?"

| Sinyali | Sorun | Impact (MAKE üzerine) | Severity |
|---|---|---|---|
| **Streak visible in hero** | Tur 1 plan'da var, code'da yoksa. Duolingo benchmark: 7-gün streak 3-4x retention boost. | Motivasyon kaldıracı — seri kaybından korku MAKE'e +10-15% etkili. | 🔴 Kritik |
| **Leaderboard teaser** | Tur 1 plan'da ("Bu hafta #43'tesin"), code'da missing. Sosyal motivasyon. | Network effect; +5-8% engagement depth TR kullanıcılarda risk (baskı feedback). | 🟡 Important |
| **Reward rail visible** | Tur 1 plan'da "YENİ ÖDÜLLER", code'da missing. Sponsor gelir kolu sinyali. | Ödül redemption rate; MAKE→sponsor loop; +3-5% funnel top. | 🟡 Important |
| **Weekly gain micro-indicator** | Kod'da `weeklyKarmaGain` prop'ta var; component'te render ediliyor mu? | Ivme gösterimi → "momentum" psikolojisi; +2-3% session extension. | 🟢 Nice-to-have |
| **Featured mission selection** | "Günün görevi" random mi algoritma mı? (Bağlı Q: user preferences × NGO prominence × verification_method = 3 axis). | DailyMissionCard CTA hitrate; %35 tıklama hedefine doğrudan etkisi. | 🔴 Kritik |
| **Mission card 4-chip rendering** | ADR-007 taxonomy (10 aktivite × 10 alan × 7 zaman × 5 lokasyon) — mission.domain + ne daha? | Scannability; "kendime uygun bulma" kolay mı; UI clutter vs info density. | 🟡 Important |

---

## 5. Opportunity Solution Tree (OST) — Tur 2 Scope

```
Outcome: MAKE monthly ↑ (→ 10k+ Ay 12)
│
├─ Opportunity 1: Motivasyon kaldıraçları tam görsüne alınmış mı?
│  └─ Solution: Streak visible hero → 7-gün dot + flame emoji + "seri kırılma" riski göster
│
├─ Opportunity 2: Sosyal karşılaştırma (risky but proven Duolingo pattern)
│  └─ Solution: Leaderboard teaser → "fark az" (gentle tone) positioned bottom hero bölmesi altında
│
├─ Opportunity 3: Sponsor-brand visibility (gelir loop; R1 pillar)
│  └─ Solution: Reward rail bottom section — top 3 ödül + "Mağaza" link (P1 usage sonrası opsiyonel)
│
├─ Opportunity 4: Featured daily mission + recommendation logic
│  └─ Solution: Selection algorithm (JTBD + schema: user interests × NGO urgency × verification_method) + A/B test (random vs algorithmic)
│
└─ Opportunity 5: Mission card scannability (taxonomy chip density)
   └─ Solution: 4-chip render (domain + time + location + difficulty?) vs clutter trade-off; audit tur 2 wireframe
```

---

## 6. Önerilen İyileştirmeler (3 P madde, Leverage/Neutral/Overhead)

### **Öneri 1 — Streak Visibility Hero'da Tekrar Ekle (Tur 1 Plan'da Vardı)**

**Problem:** Duolingo benchmark (7-gün consecutive streak → 3-4x retention), tur 1 plan'da "SERİ DURUMU" snapshot (7 gün dot + flame) vardı; code'da missing. Kullanıcı "seri kaybı riski" hissetmiyor.

**Solution (outcome):** HeroCardV2 altına "Seri durumu" micro-section ekle: 7-gün dot bar + flame emoji + "gün seri" label (eski 3. stat cell ile paralel). Motivasyon psikolojisi: "seri kırılmasın" → MAKE consistency +10-15%.

**MAKE impact:** Haftalık retention cohort W4 improvement %8-12 (Duolingo parallel).

**Effort:** S (2-3 gün — component scaffold var, HeroCardV2'ye section ekle, responsive layout).

**LNO:** **Leverage** — düşük effort, yüksek impact, tur 1 plan'da zaten redline kurgusu var. İlk yap.

**UI ipucu:** HeroCardV2 progress bar'dan sonra `<StreakSnapshot/>` atom (yeni) veya mevcut `streak-flame.tsx` + `lib/streak-dots.tsx` genişletme.

---

### **Öneri 2 — Leaderboard Teaser Gentle Ton'la Ekle**

**Problem:** Tur 1 plan'da "LEADERBOARD TEASER" bölüm vardı; code'da missing. Sosyal motivasyon — naif ama Duolingo'da kanıtlanmış (+5-8% engagement).

**Solution (outcome):** Dashboard scroll 4-5 bölüm sonra (hero → günün görevi → görev kartları → seri/leaderboard teaser) "Bu hafta #43'tesin · 150 Karma fark top 10'a" gentle message'ı ekle. **Tone critical:** "seni alt et" değil "yaklaşıyorsun" pozitif frame. 

**MAKE impact:** Sosyal loop → referral chain; +3-5% friend-initiated signups (ikincil).

**Effort:** M (1 hafta — query /lib/supabase/queries/leaderboard-teaser.ts yeni, component minimal, responsive test).

**LNO:** **Leverage** — JTBD match (sosyal karşılaştırma = user psychology); tur 1 plan'da redline. İkinci yap (tur 1 streak'ten sonra).

**Uyarı:** TR kültüründe "seni sınıflandır" baskı olabilir — UX researcher'ın 3-kişi user test'te doğrulama zorunlu.

---

### **Öneri 3 — Featured Mission Selection Algoritması Belirt**

**Problem:** DailyMissionCard (recommended[0]) — selection logic belirsiz. Recommendation engine (user_interests ↔ mission domain × ngo_urgency × verification_method) gerekir; plan'da açık soru Q34.

**Solution (outcome):** Selection algorithm spec yaz: `(mission.domain IN user.interests) × (mission.spots_left <= 5 ? boost +2 : 0) × (verification_method = 'auto' ? soft : 0)` — MVP. A/B test plan: random vs algorithmic (2 hafta, MAKE primary metric).

**MAKE impact:** DailyMissionCard CTA hitrate (tur 1 %35 target) — +8-12% algorithmic tarafından (recommendation personalization).

**Effort:** L (2-3 hafta — query + A/B test infra + 2 haftalık pilot + metric dashboard).

**LNO:** **Neutral** — iyilik, ama tur 1 lansman blocker değil (random da çalışır). Sprint 2'de alın.

---

### **Öneri 4 — Mission Card 4-Chip Render (ADR-007 Taxonomy)**

**Problem:** Master plan'da ADR-007 (expanded taxonomy) tanımlanmış — 10 aktivite × 10 alan × 7 zaman × 5 lokasyon × 4 skill × 4 verify × 9 beneficiary. MissionCard current'de domain (4 seçenek) + duration + location. Eksik chip'ler (skill level, beneficiary type)?

**Solution (outcome):** MissionCard mission.domain + mission.duration + mission.location + (yeni) mission.difficulty_level (easy/medium/hard) render et. Schema: `missions.difficulty` + `missions.beneficiary_type` migration 015+ ile eklenirse, chip density balanced tut (4 chip max — UI clutter).

**MAKE impact:** Scannability → "kendime uygun" bulma hızı; session-per-mission +2-3%.

**Effort:** M (1 hafta — migration + MissionCard component update + query).

**LNO:** **Neutral** — iyilik; ADR-007 bağlı ama tur 1 V1 lansman kritik değil. P1 sprint sonrası.

---

### **Öneri 5 — Ödül Rail (Optional, Tur 1 Plan'da Var)**

**Problem:** Tur 1 plan "YENİ ÖDÜLLER" rail → bottom section (hero, günün görevi, missions, seri, leaderboard sonra). Sponsor visibility + R1 gelir kolu loop. Code'da **missing**.

**Solution (outcome):** `/dashboard/rewards` rail preview (top 3 ödül + "Mağaza" link). Spacing: mission scroll'dan sonra; bottom nav'dan 40px üzeri.

**MAKE impact:** Ödül redemption loop; indirect — MAKE→sponsor→redemption rate +2-4%.

**Effort:** S-M (3-4 gün — `/lib/supabase/queries/top-rewards.ts` query + `reward-card` component + rail layout).

**LNO:** **Overhead** — nice-to-have; sponsor onboarding bekleniyor. Tur 2 B sub-task veya P1'e koyun.

---

## 7. Must / Should / Won't (MoSCoW)

**Must (MAKE → Tur 2 blocker yok ama tur 1 plan debt):**
- Streak visibility (Levergage #1)
- Weekly gain micro-indicator çalışıyor mu test (feedback)

**Should (Tur 2 sprint):**
- Leaderboard teaser algorithm (Leverage #2) + UX test
- Mission selection algorithm spec + A/B setup (Neutral #3)
- Mission card 4-chip (Neutral #4)

**Won't (V1.1 veya P2):**
- Ödül rail (Overhead #5) — sponsor onboarding sonrası
- Push bildirim integration
- Arkadaş sistemi leaderboard

---

## 8. Başarı Kriterleri (Tur 2 → Tur 3 hangover)

**Tur 2 defini (UX researcher'a gidince):**
- [ ] Handoff log'a tur 1 component inventory audit retroactive handoff satırı eklendi
- [ ] 5-second test (5 kişi, görüş) — "bu sayfada ne var?" → "Karma, görev, ödül, seri" ≥80%
- [ ] 1. tıklama testi — "bugün bir görev yap" → mission page ≥60%
- [ ] Streak placement (hero vs scroll bölüm) A/B → WH? test (small sample)
- [ ] Leaderboard tone UX research (TR cultural sensitivity 3-kişi derinlik)

**Implementation side (tur 3+ engineering):**
- MAKE dashboard cohort week-0 → week-1 retention +5% baseline (2 hafta gözlem)
- Mission CTA hitrate ≥35% (tur 1 target, tur 2 doğrula)
- DailyMissionCard featured selection algoritması decision

---

## 9. Bağımlılıklar + Risk

**Migration bağımlılıklar:**
- Migration 009 (`parametric_ngo_fee`) — tier system render'a etkili ✅ (zaten tur 1'de apply)
- Migration 015+ (`mission.difficulty_level`) — opsiyonel tur 2 B

**Design system:**
- Dark-only V1 (ADR-004) ✅ — kod tur 1'de match
- Token usage (gold, ink-*) ✅
- Motion Framer Spring defaults ✅

**Auth / data:**
- `profiles.current_streak` → HeroCardV2 streak render ✅ (tur 1 geçiyor)
- `karma_transactions` leaderboard query — performance risk (< 100ms query target)

**Risk:**
- Leaderboard teaser TR cultural pushback — gentle tone UX test zorunlu (Q25).
- Mission recommendation engine scope creep → tur 2 blocker olabilir (Q34 decision gerek).
- Weekly gain query (Supabase compute) — cold start lag (30-day rolling); caching or denormalization (P2).

---

## 10. Açık Karar

🟡 **Q25** — Leaderboard teaser "sosyal karşılaştırma" TR kültüründe gerçekten motivasyon mu yoksa baskı mı? 3-kişi derinlik user test ile doğrula tur 2'de; failure case'de feature drop.

🔴 **Q34** — Featured mission selection: random (MVP) vs algorithmic (tur 2 sprint)? Karar verildi → algorithmic + A/B test tur 3'de pilot.

🟢 **Q43** — Ödül rail tur 2 B mi yoksa P1 mi? → P1 (Overhead LNO; sponsor onboarding bekleniyor).

---

## 11. Handoff

**UX researcher:**
- Bu brief'i derinleştir — heuristik audit (tur 1 component'lere S1-S7 heuristic check) + user journey (first-open → mission click) + wireframe (tur 2 δ components: streak snapshot, leaderboard teaser).
- **Tur 2 audit checklist:** Streaks visible? Recommendation signal clear? Social signal tone appropriate? Bottom nav flow? Empty state'ler?
- User test (5 kişi, 5-second + 1-click): JTBD coverage.

**UI designer:**
- UX brief → UI spec: stroke snapshot component (7-dot variant list), leaderboard teaser card (gentle frame), mission card 4-chip variant.
- Token review (dark mode contrast: tier name italic gold on ink-800).
- Motion choreography (streak dot entrance, leaderboard teaser slide).

**Frontend engineer:**
- UI spec → implement: HeroCardV2 `<StreakSnapshot/>` section, dashboard-client leaderboard teaser positioning, mission-card 4-chip variant.
- Query: leaderboard weekly rank, top-rewards rail.
- A/B test scaffold (mission selection random vs algorithmic flags).

**Toplam:** 3-4 hafta paralel (tur 1 sprint pacing).

---

## Handoff log

Bu brief'i alıp üreten agent'ların zinciri. Protokol: `.claude/skills/agent-communication-protocol/SKILL.md` Katman A.

- 2026-04-24 23:45 — **ux-researcher** ✅ — **tur2 audit + journey**: `docs/ux/03-heuristics/2026-04-24-dashboard-v2-tur2-audit.md` + `docs/ux/02-journeys/2026-04-24-dashboard-ikinci-ziyaret.md`. K1–K5 (MissionCard hardcoded gradient refactor, streak/leaderboard/algoritma missing, ödül rail Overhead), Q25/Q34/Q43 cevapları, A1–A5 prioritize. Handoff ui-designer spec'e.

- 2026-04-24 — **product-analyst** ✅ — **tur2 brief**: bu dosya. Tur 1 inventory review + boşluk tespiti (9 mevcut component + 3 missing = 12) + 5 iyileştirme önerisi (Leverage 2 + Neutral 2 + Overhead 1) + OST + handoff plan.

- 2026-04-24 10:45 — **ui-designer** ✅ — **tur2 polish spec**: `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md`. A1–A5 önerileri + K1–K5 bulgularının implementasyon detayı (StreakSnapshot 3 variant + 280ms dot stagger, LeaderboardTeaser (a) copy tone + feature-flag, DailyMissionCard selection label + tooltip, MissionCard token refactor). Handoff: frontend-engineer + design-system-keeper.

- 2026-04-24 14:30 — **frontend-engineer** ✅ — **implementation plan**: `docs/eng/_journal.md` entry. Sprint A/B/C breakdown, 5 madde (StreakSnapshot, HeroCardV2, MissionCard K1, DailyMissionCard, Tab fix + LeaderboardTeaser), 2–3 hafta, 4 dependency. Kod yok, sadece plan.

---

**Sonraki adım:** Kullanıcı onayı sonrası Sprint A başlat. Paralel design-system-keeper K1 token, sonra StreakSnapshot+HeroCardV2, sonra DailyMissionCard+Tab fix. Sprint B user test sonrası.
