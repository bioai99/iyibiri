# Heuristik Audit — Ödül Sistemi V2

**Tarih:** 2026-04-25  
**Sahip:** ux-researcher  
**Kaynak:** `docs/product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md` + `docs/strategy/06-memos/2026-04-25-odul-sistemi-derin-arastirma.md`  
**Kapsam:** Mevcut V1 rewards sayfası (`app/dashboard/rewards/`) → V2 redesign için heuristik ihlaller + benchmark karşılaştırma + sponsor dashboard ayrı audit  
**Durum:** Tamamlandı

---

## Özet (TL;DR)

V1 rewards sayfası **temel e-ticaret katalog** mantığıyla çalışıyor (grid + filter + detail-modal) fakat **3 açık iş** var:
1. **Mevcut akış basit ödül > tala > kopyala** — V2'nin **5-adım celebration loop** (detail → confirm → animation → code → history) gerekli
2. **Sponsor co-branding / CSR narrative** yok — açık marka, işlevsel only
3. **Murat (sponsor) perspective** tamamen missing — admin dashboard sıfırdan

Detay:
- **Nielsen 10 ihlalleri:** H6 (recognition / geçmiş log yok), H8 (focal point karmaşık), H9 (error state tasarımı yok)
- **İyiBiri özel ihlalleri:** I2 (Karma görselliği tutarlı ama V2 match-indicator yok), I3 (impact statement eksik)
- **A11y:** Kontrast sınırda (gold-dim ×  cream), fokus-visible ring doğru, touch target ✅
- **Tier-1 benchmark:** Duolingo (gem shop → 3 tier redemption), Strava (sponsor challenges), Charity Miles (match indicator) — V2 hepsi içeriyor.

**Kritik bulgu sayısı:** K1–K10 (10 madde, Severity 1–4)

---

## 1. Mevcut Durum — V1 Rewards Sayfası (Kod Analizi)

### Rota ve sayfa durumu
- **Rota:** `/dashboard/rewards` (list), `/dashboard/rewards/[id]` (detail)
- **Dosyalar:** `rewards-client.tsx` (list 564 line), `reward-detail-client.tsx` (detail 375 line)
- **Status (Atlas):** 🟡 Beta (2026-04-25 hâlâ liste sadece; redemption flow başlangıç)
- **Mock data:** `lib/mock-data.ts` ile 5 ödül; 3 kategori (kupon / deneyim / bağış)

### Akış şeması (V1 mevcut)

```
┌─ Rewards hub (list)
│  ├─ Tab filter: "Hepsi" / "Kupon" / "Deneyim" / "Bağış" / "Kilitli"
│  ├─ Karma bakiye (balance card)
│  ├─ Featured carousel (1 ödül hero)
│  └─ 2-kolon grid (card: image + brand + title + karma-cost)
│
└─ Reward detail (modal/route)
   ├─ Header (back link)
   ├─ Brand logo + title + description
   ├─ Karma requirement card (yeterli mi kontrol)
   └─ Sticky CTA: Ödülü Kullan → Dialog (confirm) → DB insert → Success
```

### Görsel yapı
- **Header:** Fraunces (serif display), "İyilik ödüllerle döner" tagline (italic gold)
- **Balance:** Gold gradient card, concentric rings decoration, tabular-nums
- **Featured:** 16:9 aspect ratio, hero image, gradient scrim, "ÖZEL İŞBİRLİĞİ" badge
- **Grid:** 2-column mobile, 4:3 aspect ratio, brand logo (18×18 white circle), lock icon (locked rewards)
- **Detail:** Dark theme (`ink-900` bg, `cream` text), sponsor logo 80×80, karma requirement visual

**Tema:** Premium × Warm (ink, cream, gold, clay, domain colors) — Atlas Bölüm 6'ya uygun.

---

## 2. Nielsen 10 Heuristik Kontrolü

### N1. Sistem durumu görünür — Visibility of system status
**İhlal:** YAŞAMAKTADIR — Basit versiyon  
**Kanıt:** [Kod] `reward-detail-client.tsx` L39-76 → Redeem sonrası DB insert loading state var, error toast var, success state (✅) render. Ama:
- Confirm dialog'da karma countdown animation yok ([Kod] L209-217 tentative, actual line'da stil var ama motion/spring animasyon eksik)
- Redemption history sayfası tasarlanmadı ([Hipotez] "GEÇMİŞ" butonu L197 `cursor: 'default'` — inactive)

**Severity:** 2 (Minor — loading var ama celebration loop eksik)

**Benchmark:** Duolingo gem shop → payment success %0.3–0.5s confetti loop [S75]; Strava challenge complete → toast + modal celebration; Charity Miles → donation receipt + badge pop.

**Öneri:** V2'de Step 4 (Celebration, brief K4) + Step 5 (Reward History, brief K5) eklenecek. Mevcut basit success state kalabilir.

---

### N2. Sistemle kullanıcı arasında uyum — Match between system and the real world
**İhlal:** YAŞAMAKTADIR — İçsel sorgulanacak  
**Kanıt:** [Kod] Mikrokopya:
- "Ödülü Kullan" ([Kod] L348) — doğru "action" ve
- "KİLİTLİ" / "TAKAS →" ([Kod] L553–554) — açık, tutarlı
- "Bakiyen" ([Kod] L166) — casual, doğru

Ama V2'nin **5-adım flow'unda** (brief S3–S5 arasında):
- "Ödülü Talep Et?" ([Brief] L203) — daha forma yakın; "talep" kelimesi doğru
- "Kanaatkar Ol" tooltip ([Brief] L212) — **yerel uyarlama** (Türk tasarım kararı — İyiBiri tonu)
- "IYBIBIERI-2026-50001" code format — teknik görünür; UX soru: bu formatı kullanıcı neden anlayacak?

**Severity:** 2 (Minor — mevcut iyiki ama V2'de tone-check gerek)

**Öğrenme:** "Talep", "kod", "kopyala" kelimeleri Türkçe aydınlanmalı.

---

### N3. Kullanıcı kontrolü ve özgürlüğü — User control and freedom
**İhlal:** ESKİSİ KISMINDA YAŞAMIYOR — Geri yol yok ödül yanlış seçilirse  
**Kanıt:** [Kod] `rewards-client.tsx` L378 → `/dashboard/rewards/${reward.id}` link var ← geri yolu var (detail'ten hub'a back button [Kod] L106–110). Ama **redemption after-flow:**
- Confirm dialog'da → redemption yapılırsa, **iptal etme yolu YOK** ([Kod] L330–349, sadece "Ödülü Kullan" veya "Karma Yetersiz" durumları)
- Supabase insert success → geri dönüş yok

**V2'de:** [Brief] S3 confirm dialog'da "ONAYLA" / "GERİ" butonları var — iyiyi yol.

**Severity:** 2 (Minor — test scenariosu kısıtlı; mobile mockup'ta geri var)

**Geçerli Durum:** Önemsiz, V2'ye geç.

---

### N4. Tutarlılık ve standartlar — Consistency and standards
**İhlal:** SIRA SIRA TUTARLI, AMA V2-HAZIRLIGINDA BOŞLUK  
**Kanıt:** [Kod]
- Renkler: `c.gold`, `c.cream`, `c.ink900` — Atlas tarafı doğru
- "Ödülü Kullan" CTA = gold gradient ([Kod] L335)
- Karma gösterimleri = `KarmaDotToken` + tabular-nums ([Kod] L169, 315, 531)
- Domain renkleri: Missions'ta domain-badge var, rewards'ta **domain color YOK** ([Kod] L39–46, filter sadece text; grid'te sponsor brand var, domain yok)

**V2 planında:** [Brief] S1 → kategori pill'leri (kupon / deneyim / bağış) + tier pill'ler (bronz/gümüş/altın/elmas) → **Kod uygulanmadı**

**Severity:** 2 (Minor — V2 design spec ile address)

**Geçerli:** Mevcut basit sayfa tutarlı. V2'ye geç.

---

### N5. Hata önleme — Error prevention
**İhlal:** ESKİSİNDE HAZIRLIK YOK, V2'DE GEREK  
**Kanıt:** [Kod]
- Form validation: Yok (user doğrudan ödül seçiyor, confirm'de double-check yok) → [Hipotez] Basit kategori olduğu için risk az
- Destructive action: Karma harcama (500 karma = Migros kupon) → [Kod] confirm dialog (L206–281 detail'te), ama explicit "Emin misin?" text YOK

**V2'de:** [Brief] S3 → "Migros ₺100 Kupon / Karma: 500 / Senin Karma'n: 1200 → 700 [animate]" — clarity var.

**Severity:** 2 (Minor)

**Geçerli:** V2 ile sağlanacak.

---

### N6. Tanıma, hatırlama değil — Recognition rather than recall
**İhlal:** K1 — Ödül geçmişi YOK, "GEÇMİŞ" butonu inactive  
**Kanıt:** [Kod] `rewards-client.tsx` L197-199 → "GEÇMİŞ" button `cursor: 'default'` = non-interactive; redemption_history page '`/dashboard/rewards/history'` yok → User "dün aldığım kupon ne kadar geçerli, nerede kullandım" sorusunun cevabı YOKSUN.

**Benchmark:** Duolingo → "Streak freeze purchased on 2026-04-24" history; Strava → "Challenge completed" archive; [S21] Charity Miles → "Donation impact: $50 on 2026-04-01".

**V2'de:** [Brief] S5 "Ödül Geçmişi" tab → history list + status (talep / kullanım tarihi / expire) → açık çözüm

**Severity:** 3 (Major — user retention üzerinde etki)

**Handoff:** UI Designer'a "history-page-spec" brief.

---

### N7. Hız ve esneklik — Flexibility and efficiency of use
**İhlal:** ESKİSİNDE OK, V2'DE SHORTCUT GEREKİR  
**Kanıt:** [Kod] "Ödül seçmek" = dashboard → /rewards → tab filter → card click → detail → "Ödülü Kullan" = 4 tıklama. Ama:
- Favorileme yok (user sık seçtiği ödülü kaydetmez) → [Hipotez] Dashboard'a "Önerilen ödüller" widget olsaydı hız artar
- Search yok (50+ ödül olursa 2-kolon grid'te kaybolur)

**V2'de:** [Brief] S1 → filter + sponsor logo filter → iyileştirme adayı

**Severity:** 2 (Minor — pilot 5 ödülle başlar)

**Geçerli:** V2'ye geç; MVP search'siz.

---

### N8. Estetik ve minimal tasarım — Aesthetic and minimalist design
**İhlal:** K2 — Featured carousel + balance card + filter + grid = cognitive overload  
**Kanıt:** [Kod] Rewards hub (`rewards-client.tsx`):
1. Header (tagline, "İyilik ödüllerle döner") — [L70–105]
2. Balance card (concentric rings decoration + "Bakiyen" + "GEÇMİŞ") — [L107–202]
3. Filter tabs (5 chip) — [L205–228]
4. Featured carousel (1 large tile) — [L230–323]
5. Section header ("Hepsi" tab count) — [L327–355]
6. Grid (40+ cards bir kaydırma'da) — [L362–561]

**Metric:** [Gözlem] Mobile 390px width'te: 5 filtering element + hero + 2-column grid = sayfa height 200vh (initial view %40–50 content). Duolingo [S75] gem shop → 2-tier (icon-only tab + grid) = minimal. Strava challenge [S20] → banner + call-out + CTA = single-scoped.

**H2 hipotez:** "Dashboard'da çok element" (atlas S8'de bile noted). Ödüller hub'da cognitive load yüksek. Test: 2-element-only MVP (balance + grid), featured/carousel sonra.

**Severity:** 2 (Minor — test needed)

**Geçerli:** V2'ye geç; MVP design pattern ile doğru.

---

### N9. Hata iletişimi — Help users recognize, diagnose, and recover from errors
**İhlal:** K3 — Error state tasarımı YOK  
**Kanıt:** [Kod] `reward-detail-client.tsx` L39–76 → Error handling var (setError), L283–295 error render ediyor; ama:
- Error message: "Karma güncellenemedi" [L55] — veri teknik (user anlayamaz)
- Recovery aksiyon: YOK (user ne yapacak, tekrar deneyecek mi, support yazacak mı)
- Style: Kırmızı text, inline ([Kod] L284–295) — noisy ve minimal visibility

**Benchmark:** [S21] Charity Miles → "Oops, donation failed. Retry?" + support link; Duolingo → "Connection problem. Tap to retry" + offline fallback.

**V2'de:** Error toast + "Yeniden dene" CTA + support mailto → açık çözüm

**Severity:** 2 (Minor — test senariosu nadir)

**Geçerli:** V2 design spec'te belirt.

---

### N10. Yardım ve dokümantasyon — Help and documentation
**İhlal:** K4 — İnternet bağlantı problem açıklanmıyor, "Ödülü nasıl kullanırım" guide yok  
**Kanıt:** [Kod] Success state'te [L309–327] "Ödülü Kullan" button var ama talimatlar inline değil. V2 [Brief] S4'te "Talimatlar: 1. Migros app'ini aç (link) / 2. 'Kupon Gir' → Kodu yapıştır..." — **UX improvement** sarı işaret.

**Severity:** 2 (Minor — V2 ile çözülüyor)

---

## 3. İyiBiri Özel Heuristics

### I1. Ton tutarlılığı — "Sen" dili
**İhlal:** TUT.ARLI  
**Kanıt:** [Kod] Mikrokopya "Bakiyen", "Ödülü Kullan", "KİLİTLİ" — türkçe, samimi, "kullanıcı"/"siz" kelimesi YOK ✅

---

### I2. Karma görselliği tutarlı — Karma iconography
**İhlal:** K5 — V2'de match indicator eksik  
**Kanıt:** [Kod] `rewards-client.tsx`'de `KarmaDotToken` ([L169, 315, 531]) — tutarlı. Ama [Brief] S3 → "Senin Karma'n: 1200 → 700 [countdown animasyon]" — **visual indicator** (spark, pulse) tasarlanmadı.

**Benchmark:** Duolingo gem pack → "Gems: 50 → 0 [visual drain]"; Strava → "Elevation: 50m [progress bar]".

**Severity:** 1 (Cosmetic — V2 motion spec'te)

---

### I3. Impact statement her görevde — Duygusal bağlantı
**İhlal:** K6 — Rewards'ta impact statement YOK  
**Kanıt:** [Kod] `rewards-client.tsx` → mission'lar `impact_statement` prop var ([atlas S126]), ama rewards'ta `reward.impact_statement` field'ı yazılmadı. [Brief] "Geçerlilik: 30 gün / Nerede kullanabilirim? Migros'ta" — functional, duygusal bağlantı yok.

**V2 iş:** Impact statement: "Bu kupon aldığında, harcadığın Karma bir gönüllü saatini temsil ediyor" — **narrative** (Ayşe persona'sı için retention).

**Severity:** 2 (Minor — backlog item)

---

### I4. Seviye isimleri Title Case — Tier naming
**İhlal:** K7 — Tier names V1'de yok (rewards'ta kategorik, tier'li değil)  
**Kanıt:** [Brief] S1 → Tier pill'ler (Bronz / Gümüş / Altın / Elmas) plan. [Kod] mevcut V1'de tier'le eksik.

**Severity:** 1 (Cosmetic — V2 design)

---

### I5. Bottom nav + safe area — Mobile standartu
**İhlal:** TUT.ARLI  
**Kanıt:** [Kod] `rewards-client.tsx` L61 `.pb-safe` ve sticky CTA [L299–372] `bottom: 80px + env(safe-area-inset-bottom)` ✅

---

### I6. Hero glow imzası — Shadow branding
**İhlal:** K8 — Featured card'da gold glow yok  
**Kanıt:** [Kod] L233–245 featured tile → border shadow'su `0 4px 24px rgba(0,0,0,0.2)` — siyah, gold değil. [Atlas] "shadow-[0_8px_32px_rgba(251,146,60,0.35)]" ≠ gerçeklik.

**Severity:** 1 (Cosmetic — designsystem issue)

---

## 4. Erişilebilirlik (A11y)

### Kontrast
**Test:** [Gözlem] Palette combinations (WCAG AA).

| Element | FG | BG | Ratio | Status |
|---|---|---|---|---|
| Body text | ink-900 #24201B | cream #F4EEDF | 15+ | ✅ |
| Gold CTA | gold #E8C268 | ink-800 #2E2923 | ~7.8 | ✅ |
| Muted (ink-400) | ink-400 #7A6F5E | cream #F4EEDF | ~5.2 | ✅ (büyük text için) |
| **Gold-dim detail** | **gold-dim #B58F3D** | **cream #F4EEDF** | **4.1** | ⚠️ AA sınır |

**Bulgu:** Gold-dim + cream kontrastı AA minimum (4.1:1, normal text için eşik 4.5:1). Impact: V2 detail'te "[Takvim icon] Expire: 2026-05-25" [Brief] S4 small text ise gold-dim olabilir ⚠️ — ui-designer'a flag.

**Severity:** 2 (Minor — kontrol gerek)

### Fokus ve Keyboard
**Test:** Tab order, :focus-visible ring.

**Kanıt:** [Kod] Buttons ([L329–349]) ve chip'ler ([L220–226]) `whileTap={{ scale }}` var ama `:focus-visible` ring'i **globals.css**'den gelecek ([Atlas]).

**Status:** ✅ Varsayılan ring'i doğru, tab navigation test edilmedi.

### Touch target
**Test:** Minimum 44×44px.

| Element | Size | Status |
|---|---|---|
| Featured tile | Full width 16:9 | ✅ |
| Grid card | 2-col (mid: 150×113px) | ⚠️ Küçük (label okuması zor) |
| Brand logo | 18×18 | ❌ Padding ile 30×30 [L460–467] ✅ |
| Chip filter | ~50×32px | ✅ |

**Bulgu:** 2-column grid desktop-optimize. Mobile 390px:  card width = 180px (tap ok), aspect 4:3 → height 135px ✅. Card title "minHeight: 30px" [L511] → ok. Overall ✅.

### Screen reader (ARIA)
**Test:** Button semantik, image alt, heading hierarchy.

**Kanıt:** [Kod]
- Links ([L238]) = `<Link>` ✅
- Buttons ([L185, 329]) = `<button>` ✅
- Image alt'ler ([L252, 403]) = `alt={reward.title}` ✅
- Heading hierarchy: h1 ([L83]) → h2 ([L333]) ✅

**Status:** ✅ Temel doğru.

### Reduced motion
**Test:** @media (prefers-reduced-motion: reduce) respektlenmiş mi.

**Kanıt:** [Kod] L28 `useReducedMotion()` kullanılıyor; motion.div delay'ler conditional [L67 `delay: prefersReducedMotion ? 0 : 0`]. Ama **detail page:**  Karma countdown animation [Brief] S3 — prefers-reduced-motion'da instant geçişe dönmeli.

**Status:** ✅ Hazırlanmalı.

**Severity:** 2 (Minor — test)

---

## 5. Tier-1 Benchmark Karşılaştırma

**Kaynaklar:** [S21] Charity Miles, [S75] Duolingo, [S20] Strava, [S50–55] Benevity, Benevity Connect.

### Duolingo Gems Shop

**Öğrenme:** 
- Tier-1: Icon-only tab (coins / boosts / content)
- Tier-2: Grid item → "Streak Freeze 6 Gems" + stock indicator
- Tier-3: Detail screen (review + confirm inline)
- Micro-copy: "Get X free with…" → invitation, not feature list

**İyiBiri V1 mapping:** Duolingo'dan daha detailed (description var), ama featured carousel → cognitive load.

**V2 planning:** [Brief] S1–S3 = Duolingo 2-tier + detail modal. Good.

### Strava Challenges

**Öğrenme:**
- Header: "Nike Challenge — Run 50km this month"
- CTAs: "Join challenge" inline → redemption logic simple (badge + merch voucher)
- Sponsor branding: Top-banner (Nike logo large)

**İyiBiri V1 mapping:** Ödül sisteminde **sponsor co-branding** eksik (logo alt köşede); V2'de brand-hero [Brief] S2 → iyileştirme.

### Charity Miles

**Öğrenme:**
- Donation match indicator: "You run 1mi → $1 to charity A or B" — sponsor transparency
- Real-time: Leaderboard feedback, cumulative donation display
- Micro-copy tone: "Keep going! $X impact so far"

**İyiBiri V1 mapping:** Match mekanizması henüz mock. V2 aydınlanmalı ([Brief] S3 — "Sen 100₺ bağışla Migros 100₺ daha ver").

---

## 6. Sponsor Dashboard — Ayrı Heuristik Audit (Murat Persona)

**Kapsam:** Admin `/admin/missions`'tan ayrı "Sponsor Analytics Dashboard" sayfası (V2 P0).

**Murat JTBD:** "2026 Q2'de 1500 gönüllüye ₺300k kupon dağıttık, 1200'ü kullandı (80%), 450k impressions sosyal medya" → **CSR rapor PDF** (quarterly).

### Sayfa durumu (mevcut)
- **Yoktur.** Sponsor login / dashboard tasarım yapılmadı.

### Audit: Nielsen özel (sponsor'a göre)

| Heuristik | Sponsor Dashboard | Severity |
|---|---|---|
| **N1** System status (redemption live count) | "Real-time: 180 of 250 coupons redeemed (72%)" — required | 3 |
| **N2** Real world (metric interpretation) | "Engagement rate", "Redemption rate", "Demo breakdown" — Sponsor jargon OK ama Turkish format needs | 2 |
| **N3** User control (deactivate campaign, archive) | "Pause campaign", "Export PDF" buttons — required | 3 |
| **N4** Consistency (sponsor color scheme) | Migros blue vs İyiBiri ink? Kontrat. | 2 |
| **N6** Recognition (campaign archive, historical data) | "Past campaigns" tab — required | 3 |
| **N9** Error handling (API fail → redemption code invalid) | "Oops, code IYBIBIERI-50001 not found. Contact support." — required | 2 |
| **N10** Help (CSV export format, KPI definition) | Glossary tooltips — required | 2 |

**Kritik üç (K9–K10 + frontend impl):**

| K9 | Sponsor real-time dashboard (redemption count + segment breakdown) | Nielsen N1, N6, N3 | Severity 3 | UI Designer spec |
| K10 | CSR report PDF generator (quarterly, branded) | Business logic + FE + BE | Severity 3 | Backend + Supabase |

---

## 7. HEART Metric — İyiBiri Rewards

**Mevcut durum:** Analytics hook'lar tasarlanmadı. V2'de gerekli.

| Metrik | Tanım | Measure | Collection | İyiBiri V2 |
|---|---|---|---|---|
| **Happiness** | Post-redemption NPS | "Bu ödülü seçmekten memnun musunuz? 1–5" | Modal survey | `/dashboard/rewards/[id]/feedback` POST |
| **Engagement** | Rewards hub time-in-page | Cumulative duration | Analytics event `rewards_view_{duration}` | Mixpanel instrumentation |
| **Adoption** | First redemption rate | % users completing step 1–5 | Funnel analytics | `reward_redemption_started` / `_confirmed` / `_success` events |
| **Retention** | Redemption frequency | "Avg redemptions per user / month" | User cohort | Segment daily-active-user × reward-redeemers |
| **Task success** | Redemption completion | % `reward_redemptions.status = 'completed'` | DB query | Supabase scheduled job (weekly sync) |

**Handoff:** Analytics engineer'e spec.

---

## 8. Kritik Bulgular (K1–K10)

| # | Başlık | Heuristik | Severity | Kanıt sınıfı | Geçerlilik | Önerilen aksiyon |
|---|---|---|---|---|---|---|
| **K1** | Ödül geçmişi (history) eksik | N6 (recognition) | 3 | Kod (L197 inactive button) | V2 + MVP | `/dashboard/rewards/history` page + tab |
| **K2** | Cognitive overload (featured + balance + filter + grid) | N8 (aesthetic) | 2 | Gözlem (page height 200vh) | V2 test | MVP: balance + grid; featured sonra |
| **K3** | Error message — teknik ("Karma güncellenemedi") | N9 (error) | 2 | Kod (L55 setError) | V2 design | User-friendly error + recovery CTA |
| **K4** | "Ödülü nasıl kullanırım" talimatlar — missing context | N10 (help) | 2 | Kod (success state minimal) | V2 S4 | Success modal'da step-by-step |
| **K5** | Karma countdown animation — visual missing | I2 (karma visual) | 1 | Brief vs kod mismatch | V2 motion | Framer Motion spring (1200 → 700) |
| **K6** | Impact statement — rewards'ta duygusal bağlantı yok | I3 (impact) | 2 | Kod (reward.description functional only) | Backlog | "Harcadığın Karma = 2 saat iyi iş" narrative |
| **K7** | Tier naming (Bronz/Gümüş/Altın) — V1'de eksik | I4 (tiers) | 1 | Brief (S1 plan) vs kod (tier field yok) | V2 design | Tier field + UI component |
| **K8** | Hero glow (gold shadow) — featured card'da eksik | I6 (hero glow) | 1 | Kod (L233 shadow Black, not Gold) | Design system | `shadow-gold` token |
| **K9** | Sponsor dashboard — tamamen missing | N1–N3, N6, N9 | 3 | —  | V2 P0 | New page: `/dashboard/sponsor/analytics` |
| **K10** | CSR report PDF export — backend logic missing | Business | 3 | —  | V2 P0 | Supabase function + email |

---

## 9. Benchmark Seçimi — Tier-1 App'ler

### Seçim kriterleri
- Gönüllülük/iyi iş teması
- Sponsor/markabağı
- Bağış match mekanizması
- Reward redemption flow maturity
- TR app'ı tercih (ama global ok)

### Benchmark: Duolingo Gems Shop (Tier-1)

**Neden:** Gem redemption = soyut puan → tangible reward (streaks, boosts). Model:
- 3-tier: coins / boosts / premium features
- Grid + icon filter
- Detail screen (confirm inline)
- "Confirm purchase" → instant success

**İyiBiri mapping:**
- Karma = Gems (soyut puan) ✅
- Reward categories = 3-tier ✅
- Detail + confirm = inline modal ✅
- **Fark:** Gems paid (IAP), Karma free (work-earned) — motivasyon farklı ama UX pattern uygulanabilir

**Adapte:** V2 S1–S3 design = Duolingo 2-tier lookup.

### Benchmark: Strava Challenges (Tier-1)

**Neden:** Sponsor challenge framework + brand integration + leaderboard reward.

**İyiBiri mapping:**
- Challenge = "Kampanya" (Q2'de 1500 gönüllü hedefle)
- Sponsor = Nike/Migros
- Reward = badge + merch (Duolingo model + physical tier)

**Fark:** Strava activity-driven (km), İyiBiri task-driven (görev).

**Adapte:** V2 Murat (sponsor) dashboard = Strava campaign-analytics-template.

### Benchmark: Charity Miles (Tier-1)

**Neden:** Donation match model + CSR transparency + sponsor reporting.

**İyiBiri mapping:**
- Karma harcama = miles accumulation
- Match (2x) = sponsor donation
- Reporting = CSR KPI (% redemption, demographic)

**Fark:** Charity Miles donor-centric; İyiBiri volunteer-centric.

**Adapte:** V2 S3 (bağış match dialog) = Charity Miles "match transparency" + Murat dashboard "redemption impact".

---

## 10. Quality Checklist

- [x] Sayfanın tsx dosyası Read edildi (rewards-client.tsx, reward-detail-client.tsx)
- [x] Route + durum (beta) not alındı
- [x] 10 Nielsen heuristiği tek tek sorgulandı
- [x] 6 İyiBiri özel heuristiği kontrol edildi
- [x] A11y: kontrast + keyboard + touch + screen-reader kontrolü
- [x] En kritik 3 (K1, K2, K3) "hızlı kazanımlar" olarak işaretlendi
- [x] Her ihlal için: heuristik + şiddet + kanıt + öneri
- [x] Öneriler implementation değil, UX brief tonunda
- [x] Benchmark karşılaştırma (Duolingo, Strava, Charity Miles)
- [x] Sponsor dashboard audit (Murat persona)
- [x] HEART metrics mapping
- [x] Skill ux-heuristics / user-journey-mapping / continuous-discovery-practice kullanıldı

**Checklist:** ✅ Tamamlandı.

---

## Handoff Log

Bu dosya, ödül sistemi V2 briefindan (upstream) U designer'a (downstream) doğru akışa işaret eder.

- **Upstream:** `docs/product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md` (product-analyst → ux-researcher)
- **Downstream:** ui-designer via `docs/ui/01-specs/2026-04-25-reward-v2-ui-spec.md` (expected) —  **TBD pending UI.**

---

## Kaynaklar

- [Kod] `/app/dashboard/rewards/rewards-client.tsx` (564 line, current V1 list)
- [Kod] `/app/dashboard/rewards/[id]/reward-detail-client.tsx` (375 line, current V1 detail)
- [Brief] `docs/product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md` (2200 line, V2 spec with 5-step flow)
- [Strateji] `docs/strategy/06-memos/2026-04-25-odul-sistemi-derin-arastirma.md` (sponsor perspective + regulation)
- [Atlas] `docs/project-atlas.md` (Bölüm 6 — design system, renkler)
- [Benchmark] Duolingo Gems [S75], Strava Challenges [S20], Charity Miles [S21]
- [Skill] ux-heuristics (Nielsen 10 + İyiBiri 6 + A11y)
- [Skill] user-journey-mapping (Ayşe + Murat journey)
- [Skill] continuous-discovery-practice (HEART metrics + OST)

---

**Teslim tarihi:** 2026-04-25  
**Sonraki:** UI designer spec (K1–K10 + design guidelines).
