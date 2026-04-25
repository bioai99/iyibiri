# User Journey Map — Ayşe (Gönüllü) + Murat (Sponsor) — Ödül Sistemi V2

**Tarih:** 2026-04-25  
**Sahip:** ux-researcher  
**Kaynak:** `docs/product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md` + `docs/strategy/06-memos/2026-04-25-odul-sistemi-derin-arastirma.md`  
**Persona durum:** Kanıt-altı (persona brief'den, henüz customer interview yok)  
**İlgili strateji:** Murat NSM (MAKE) + Ödül sistem memos

---

## Özet (TL;DR)

**Ayşe (28, gönüllü):** 10-adımlı redemption journey — rewards hub açılışından Instagram paylaşımına kadar. **Dark moment:** Adım 4'te (confirm dialog'da karma harcama tereddütü, "bunu hak ettim mi"); **Peak:** Adım 6'da (success celebration + kupon kod kopyalandığında dopamine loop).

**Murat (42, Migros CSR):** 8-adımlı sponsor admin journey — dashboard açılışından quarterly rapor PDF indir. **Dark:** Adım 3'te (campaign performansı düşükse); **Peak:** Adım 7'de (CSR PDF otomatik generate, "bunu raporlayabilirim").

Emotion curves, motion choreography (stagger + countdown + celebration reuse), HEART metrics, accessibility checklist içerir.

---

## A. Ayşe Journey — Gönüllü Ödül Redemption

**Persona:** Ayşe, 28, İstanbul, İTÖ, 2000 karma birikmiş, haftada 1–2 görev yapıyor.  
**Senaryo:** "Migros kuponuyla arkadaşlarıyla alışveriş yapmak istiyor. Karma'sını harcayıp kupon alacak, sonra Instagram'da paylaşacak."  
**Başlangıç durumu:** Dashboard'da; 2000 karma, Migros ödülü bilmiyor.  
**Hedefe varış:** Kupon kodu almış, Instagram story'de paylaşmış, yeterli karma var, arkadaş gönderildi.

### Journey Table

| Adım | Ekran / Touchpoint | Ayşe'nin Eylemi | Düşüncesi ("İçinden geçen") | Duygu | HEART Metric | Fırsat / Problem |
|---|---|---|---|---|---|---|
| 1 | `/dashboard` (ana tab) | "Ödüller" butonuna klikleme | "Karma'yı bir şeye çevirebilir miyim? Bi bakalım." | 0 (merak) | Engagement | Ödüller tab'ı bariz mi? CTA belgin mi? |
| 2 | `/dashboard/rewards` (rewards hub — list) | Sayfa scroll, tab filter ("Kupon") klikleme, Migros kartını ara | "Migros kuponı var mı? Kaç karma lazım?" | +1 (keşif) | Engagement | Filter önemsiz, arama var mı? (Yok) |
| 3 | Migros kupon card görünüm (featured grid item) | Karta tıklama, hero image + "₺100 Kupon" başlık okuması | "500 karma? Benim 2000'im var. Şimdi almaya değer mi?" | +1 (hak etme duygusu) | Happiness | Ödülün değeri net mi? ("₺100 değer" açık mı?) |
| 4 | `/dashboard/rewards/migros-100` (detail bottom sheet) | Detay oku: geçerlilik (30 gün), nerede kullan (Migros), şartlar (promo hariç) | "30 gün içinde kullanmalıyım. Arkadaşlarla planlayabilirim." | +2 (karar verme) | Task success (detail view) | Şartlar anlaşılır mı? (Uzun metin) |
| 5 | "ŞIMDI TALEP ET" butonu → Confirm dialog | Button'a klikleme, dialog açılması ("Migros ₺100 Kupon / Karma: 500 / Senin Karma'n: 1200 → 700") | **"Bunu hak ettim mi? Bu karma başka nerede kullanabilirdim?" (tereddüt)** | -1 (dark moment) | Adoption | Confirm dialog netliği, "Kanaatkar Ol" tooltip, iptal yolu |
| 6 | "ONAYLA" butonu → Success celebration screen | Tıklama; confetti animation + kod görünüm ("IYBIBIERI-2026-50001") + "Kopyala" butonu | "Evet! Kod kopya oldu. Kurtuluş! Arkadaşlarıma gösterebilirim." | +3 (peak dopamine) | Task success (redemption) | Celebration motion, code clarity, copy feedback |
| 7 | Kupon detay screen — talimatlar (step 1–4) | Adım oku: "1. Migros app'ini aç (link) / 2. Kupon Gir → Kodu yapıştır / 3. Kasada 'Yönetilen Kupon' seç / 4. Öde" | "Ok, bu kolay. Migros app linki burada var, tıklayabilirim." | +2 (rehberlik) | Task success | 4-adımlı talimatlar TL;DR mı? (Özet CTA) |
| 8 | Kupon geçmişi tab (`/dashboard/rewards/history`) — redeemed item | Scroll, "2026-04-25 Migros ₺100 Kupon / Status: ✅ Talep Edildi / Expire: 2026-05-25" kartını görme | "Başka biri de bunu görebilir mi? Instagram'da paylaşabilirim." | +1 (share intent) | Engagement (intent-to-share) | History item'ın shareability (OG image) |
| 9 | "Instagram'da Paylaş" butonu → Instagram deeplink (OG image creator) | Button tıklaması, "Kanaatkar Ol! İyiBiri ile ₺100 kupon kazandım" template + image | "Harika, OG image var. Hikaye'de paylaşacağım. Arkadaşlarımla ilginç bulur." | +3 (peak social validation) | Engagement (social sharing) | OG image shareability (WCAG: alt text, contrast) |
| 10 | Instagram app → Story paylaşım tamamı | Paylaş buttonu, story'ye ekleme, "Beni etiketle" kısmı | "Yapıldı! Yorum geleceğini tahmin ediyorum." | +2 (closure) | Retention (next-mission willingness) | Paylaşım sonrası İyiBiri'ye geri dönüş (deep link) |

### Emotion Curve (ASCII)

```
Adım    1   2   3   4   5   6   7   8   9   10
Skor    0  +1  +1  +2  -1  +3  +2  +1  +3  +2
         🤔         ↓         ✨           📱

                     dark moment (adım 5)
                     ↓
                     "Bunu hak ettim mi?"
                    
Peak moments:
- Adım 6: Success confetti + dopamine (code kopyalı)
- Adım 9: Instagram paylaşım + peer validation
```

### Dark Moment Detay

**Adım 5 — Confirm Dialog:**
- **Ne oldu?** Ayşe "ONAYLA" öncesi tereddüt: 500 karma = 2 saat iyi iş. Başka amaçlara (sezon seçeneği, challenge, tier jump) kullanabilirdi.
- **Neden?** Karma sınırsız görünmüyor; "tükenme" korkusu (scarcity psychology).
- **Olabilir:** %10–15 abandonment rate (S70 Duolingo; gem satın alınmada similar hesitation).
- **Çözüm:** 
  - Confirm dialog'da: "Kanaatkar Ol" tooltip + recommendation ("senin karma'n yeterli, başka seçeneklere bak?")
  - Post-redemption: "500 karma bittikten sonra hızlı yenile tepsisi? (3 görev = 150 karma)" — reengagement hint
  - HEART: Adoption rate (% complete → confirm) ölç (target: 80%+)

### Peak Moment Detay

**Adım 6 — Success Celebration:**
- **Ne oldu?** Confetti animation + code görünüm + "Kopyalandı!" toast.
- **Neden güçlü?** Immediate feedback (confirmatory dopamine) + tangible artifact (code).
- **Olabilir:** Duolingo'da gem purchase completion after 0.3–0.5s → 90%+ purchase-to-engagement loop (S75).
- **Motion spec:** 
  - Confetti: `canvas-confetti` lib, 1s duration, scale out
  - Code reveal: Stagger (title → code → buttons), 200ms delay per
  - Copy toast: "Kopyalandı!" 2s auto-dismiss
- **HEART:** Task success rate (redemption_completed) — target 95%+ (K1 audit'ten: geçmiş yok; K4'ten: talimatlar boşluk).

### Bulgu Özeti

1. **En kritik friction:** Dark moment adım 5 (confirm dialog'da tereddüt). **Çözüm:** "Kanaatkar Ol" tooltip + post-redemption reengagement hint.
2. **En güçlü delight:** Peak adım 6–9 (success + social sharing). **Koru:** Motion choreography, OG image quality.
3. **İlk iyileştirme:** [K1 audit] History page + [K4 audit] step-by-step talimatlar → UI Designer spec.

---

## B. Murat Journey — Sponsor (Migros CSR) Admin Flow

**Persona:** Murat, 42, Migros Kurumsal CSR Yöneticisi, Migros ödül kampanyası organize.  
**Senaryo:** "2026 Q2 CSR raporuna gönüllülerin Karma redemption istatistiklerini koymak istiyor. Dashboard'dan redemption sayısı, segment breakdown (yaş/cinsiyet/şehir), PDF rapor oluşturacak."  
**Başlangıç durumu:** İyiBiri sponsor dashboard'a erişim (auth doğrulandı). Campaign active (April).  
**Hedefe varış:** Quarterly rapor PDF indir, "1500 gönüllü, 1200 kupon kullanılmış (80%), Gen Z 45%" — rapor hazır.

### Journey Table

| Adım | Ekran / Touchpoint | Murat'ın Eylemi | Düşüncesi ("İçinden geçen") | Duygu | HEART Metric | Fırsat / Problem |
|---|---|---|---|---|---|---|
| 1 | `/dashboard/sponsor` (sponsor analytics hub) | Dashboard açılış, "Migros Kampanyası Q2 2026" başlık görünüm | "Hoş, burası analytics dashboard. Kimlerin kupon aldığını görebilir miyim?" | 0 (merak) | Engagement | Dashboard overview berrak mi? Campaign active mi? |
| 2 | KPI cards (overview) | Scroll, "Dağıtılan: 250 / Kullanılan: 180 (72%)" sayılarını oku | "72% redemption iyi mi? Hedef ne? Başka kampanya ne kadar?" | +1 (data-driven) | Happiness | Real-time data güvenilir mi? Last update ne zaman? |
| 3 | Campaign detail section → Toggle "Performance metrics on/off" | Altında detay tablarını aç: "Redemption timeline", "Segment cohort" | "Zaman içinde trend var mı? Hangi yaş grubu aktif?" | +1 (analysis start) | Task success (data exploration) | Segmentation seçenekleri (yaş/cinsiyet/şehir) var mı? |
| 4 | Cohort breakdown table (Age × Redemption) | Scroll table: "18–25: 180 redemption / 25–35: 60 / 35+: 5" + pie chart | "Gen Z %72 (180/250). Bu beklemiş. Raporlamaya değer." | +1 (insight) | Happiness | Cohort chart clarity, export button visible? |
| 5 | "Quarterly Report" panel → PDF export button | Button görünüm, "Generate Q2 2026 CSR Report (Migros branded)" | **"PDF otomatik generate olacak mı? Yoksa custom field girmem gerek?" (uncertainty)** | 0 (dark moment — mild) | Task success (expectation) | PDF generation workflow clear mi? Timeframe? |
| 6 | Generate button tıklaması → "Processing... (2–5s)" loading | Ekran loading spinner; backend `pdf-generation` job çalışıyor | "Bekle, render oluyor. Migros logolu, İyiBiri branding + metric'ler + STK impact." | -1 (friction: bekleme) | Adoption (patience) | Loading UX: spinner, ETA, cancel option? |
| 7 | PDF download link görünüm ("Q2-2026-Migros-CSR-Report.pdf") | "İndir" button tıklaması, tarayıcı download | "Yapıldı! Desktop'a kaydetti. Outlook'ta eki açıp review et." | +2 (relief + control) | Task success (download) | File naming, email-ready format (inline attachment)? |
| 8 | Quarterly rapor PDF açma (local) — review | Adobe Reader / browser PDF viewer → "Impact Summary" bölüm oku: "2026 Q2: 1500 gönüllü, ₺300k kupon dağıtıldı, 450k sosyal medya impression" | "Harika. CSR raporumda "Digital volunteer program" section'a yapıştır. Sustainability commitment gösterebilirim." | +3 (peak — CSR narrative complete) | Happiness (outcome) | PDF content quality: branding, metrics layout, readability? |

### Emotion Curve (ASCII)

```
Adım    1   2   3   4   5   6   7   8
Skor    0  +1  +1  +1   0  -1  +2  +3
         📊                    ⏳      📄

                  mild dark moment (adım 5–6)
                  ↓
                  "PDF otomatik mi? Ne kadar sürecek?"
                    
Peak moment:
- Adım 8: CSR narrative complete, "Raporlamaya hazır" (outcome validation)
```

### Dark Moment Detay

**Adım 5–6 — PDF Generation Uncertainty:**
- **Ne oldu?** Murat "Generate PDF" butonu bastığında, workflow belirsiz: batch job mi, sync mi, kaç dakika?
- **Neden?** Sponsor'lar product engingeringini bilmez; user expectation = instant ("tıkla, hemen indir").
- **Olabilir:** %5–10 "contact support" yollanması, if ETA > 10s.
- **Çözüm:**
  - Loading modal: "Raporunuz hazırlanıyor... (2/5s)" + linear progress bar
  - Email option: "PDF'yi e-posta ile gönder" fallback (asenkron iş ≤ 30min)
  - Post-completion notification: "Q2 rapor ready! Download link [expires: 7 days]"
- **HEART:** Task success (completion rate) — target 95%+ (K10 audit: backend missing; V2 P0).

### Peak Moment Detay

**Adım 8 — CSR Narrative Complete:**
- **Ne oldu?** Murat PDF'de "Impact Summary" okuduktan sonra: "2026 Q2 Migros CSR kampanyası başarılı. Katılımcı sayısı, demographic, social impact..." — **outcome validation**.
- **Neden güçlü?** Sponsor'ın CSR raporlama hedefi başarıyla gerçekleşti. Brand reputation + regülatör compliance + stakeholder confidence.
- **Olabilir:** Q4 2026'da "next year budget increase" karar — downstream business impact.
- **Content spec:**
  - PDF title: "[Sponsor Logo] CSR Impact Report — Q2 2026 İyiBiri Campaign"
  - Sections: Executive summary (1 sayfa) + Metrics table + Cohort breakdown + Social impact narrative + Appendix (T&Cs)
  - Branding: Migros blue + İyiBiri ink + gold accents
  - Quantitative: "1500 volunteers, 1200 active, 72% redemption, 450k impressions"
  - Qualitative: "Through the İyiBiri platform, Migros reached Gen Z volunteers (72% 18–25) and created meaningful social impact via [STK list]"
- **HEART:** Happiness (outcome satisfaction) — target 4.5/5 NPS post-quarter.

### Bulgu Özeti

1. **En kritik friction:** Dark moment adım 5–6 (PDF generation workflow belirsiz). **Çözüm:** Loading UX + email option + notification.
2. **En güçlü delight:** Peak adım 8 (CSR narrative complete, reporting confidence). **Koru:** PDF design quality, timeliness, email delivery.
3. **İlk iyileştirme:** [K9 audit] Sponsor real-time dashboard + [K10 audit] CSR report PDF generator → Backend + Supabase spec.

---

## C. HEART Metrics Mapping (Both Personas)

### Ayşe (Gönüllü) — Ödül redemption journey

| HEART | Measure | Adım(lar) | Target | Collection method | V2 spec |
|---|---|---|---|---|---|
| **Happiness** | Post-redemption satisfaction NPS | 6–7 | 4.5/5 + | Modal survey post-success | `/dashboard/rewards/[id]/feedback` form |
| **Engagement** | Rewards hub browsing duration | 2–3 | 60–120s median | Analytics event `rewards_view_time` | Mixpanel / Supabase instrumentation |
| **Adoption** | First redemption completion (% reach step 10) | 1–10 | 60%+ | Funnel `rewards_step_1 → step_10` | Analytics event per step (`_started`, `_confirmed`, `_success`, `_shared`) |
| **Retention** | Redemption frequency (avg/user/month) | 8–10 | 2+ per month | User cohort analytics | Segment daily-active × reward-redeemers |
| **Task success** | Redemption completion rate (% `status='completed'`) | 5–10 | 90%+ | DB: `reward_redemptions` status count | Supabase scheduled job (weekly sync Mixpanel) |

### Murat (Sponsor) — Admin campaign analytics journey

| HEART | Measure | Adım(lar) | Target | Collection method | V2 spec |
|---|---|---|---|---|---|
| **Happiness** | CSR report quality satisfaction (NPS) | 8 | 4.5/5 + | Email survey post-PDF download | "Rate this report" form (1–5 stars) |
| **Engagement** | Dashboard visit frequency (sponsor logins/month) | 1–8 | 8+ | Auth log `sponsor_login_event` | Supabase session tracking |
| **Adoption** | First CSV/PDF export completion | 7 | 80%+ | Funnel `export_started → export_success` | Analytics event `admin_export_initiated` / `_completed` |
| **Retention** | Campaign reactivation (sponsor renews contract Q3) | 8 | 85%+ contract renewal | Business metric (legal/sales) | Manual tracking + CRM sync |
| **Task success** | Report generation completion (% PDF success) | 5–7 | 99%+ | Backend logs (`pdf_generation_success`) | Sentry / Supabase functions logs |

---

## D. Motion Choreography Spec (UI Designer handoff)

### Ayşe's Journey — Key animations

**Step 5 → 6 (Confirm → Success):**
```
Timeline: 0ms — 1200ms

0–400ms:   Dialog close + Success modal in (fade + scale 0.95 → 1.0)
400–800ms: Confetti animation (canvas-confetti lib, 100 particles, 1s duration)
600–1000ms: Code reveal (stagger: title → code-box → buttons)
  - Title: fade + slideDown (200ms)
  - Code-box: fade + scale (200ms, delay 200ms)
  - Buttons: fade + slideUp (200ms, delay 400ms)
1000–1200ms: Copy button highlight (pulse 2x)

Audio: (opsiyonel) Success chime 200–600ms window

Accessibility: prefers-reduced-motion → skip confetti, instant code reveal
```

**Step 7 → 9 (History → Instagram share):**
```
Timeline: 0ms — 800ms

0–300ms: History card appear (fade + slideUp, stagger for multiple items)
300–800ms: Share button hover → pulse highlight
On share-click: Deep link + success toast (2s auto-dismiss)

Accessibility: Keyboard navigation (Tab → Enter to share), screen-reader: "Share to Instagram, opens social app"
```

### Murat's Journey — Key animations

**Step 5 → 7 (Generate → Download):**
```
Timeline: 0ms — 5000ms (backend time variable)

0–2000ms:   Loading modal in (fade + scale)
2000–4500ms: Linear progress bar fill (simulated; actual ETA backend-driven)
4500–5000ms: Success state (checkmark icon, "Ready to download")
5000–5200ms: Download link appearance (fade + slide)

Accessibility: aria-live region announces progress ("Generating PDF... Step 2 of 3")
prefers-reduced-motion → instant completion (skip progress animation)
```

---

## E. Accessibility Checklist

### Ayşe's Journey (User-facing mobile flow)

| Aspekt | Check | Status |
|---|---|---|
| **Kontrast** | Gold CTA text vs dark bg (7.8:1) | ✅ AA |
| **Kontrast** | Error text vs bg (if error state) | ⚠️ Check (K3 audit) |
| **Keyboard** | Tab order through all inputs (dialog, buttons) | 📋 Design-time check |
| **Focus ring** | `:focus-visible` on buttons, links | 📋 Globals.css default |
| **Touch target** | CTA buttons ≥44×44px | 📋 Design check |
| **Screen reader** | Button labels ("Onayla", "Geri", "Paylaş") | 📋 HTML semantics |
| **Reduced motion** | Animations off when `prefers-reduced-motion: reduce` | 📋 Framer Motion hook |
| **Image alt** | OG image alt text (Instagram share) | 📋 Brand asset |
| **Heading hierarchy** | h1 (page title) → h2 (section) → p (body) | 📋 Semantic HTML |
| **Color alone** | Lock icon + "KİLİTLİ" text (not color-only) | ✅ Icon + text |

### Murat's Journey (Admin desktop flow)

| Aspekt | Check | Status |
|---|---|---|
| **Kontrast** | Table text vs background | ⚠️ Check (grid: 390px mobile test) |
| **Keyboard** | Tab through table, buttons, export links | 📋 Data table semantics |
| **Focus ring** | Export buttons, pagination | 📋 Globals.css default |
| **Touch target** | (Desktop mouse-driven) N/A — design for mouse accuracy | ✅ N/A |
| **Screen reader** | Table headers (`<th>`) correctly marked | 📋 HTML semantics |
| **Reduced motion** | PDF generation bar instant if preference | 📋 Custom logic |
| **Data table export** | CSV alt format (not PDF-only) | 📋 Spec requirement (K10) |
| **Color alone** | "Success" badge + checkmark (not color-only) | 📋 Icon + label |

---

## F. Kaynaklar ve Kanıt Sınıflandırması

### Ayşe Journey — Kanıt sınıfları

- **[Kod]** V1 apps: `rewards-client.tsx` (list), `reward-detail-client.tsx` (detail) — mevcut state
- **[Brief]** V2 spec: `docs/product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md` S1–S5 (5-adım flow wireframes)
- **[Hipotez]** Dark moment adım 5: "Karma tereddütü (scarcity)" — Deci-Ryan SDT, TR kültür [S71–S72] (hediye verme + emeğin karşılığı expectation)
- **[Hipotez]** Peak moment adım 6–9: Celebration loop → Duolingo gem purchase model [S75] (0.3–0.5s success feedback)
- **[Benchmark]** Duolingo gems shop → 3-tier redemption model; Charity Miles → donation match transparency; Strava → challenge impact narrative

### Murat Journey — Kanıt sınıfları

- **[Hipotez]** Dark moment adım 5–6: "PDF generation workflow uncertainty" — product UX best-practice (slow operations → loading UX + alternatives)
- **[Strateji]** Peak moment adım 8: CSR narrative completion → Murat persona JTBD [Brief] ("CSR raporunda ölçülebilir göstermek istiyorum")
- **[Benchmark]** Charity Miles platform [S21] → sponsor dashboard, real-time metrics, data export
- **[Benchmark]** GlobalGiving [S83] → quarterly report structure + grant narrative

---

## G. Kritik Noktalar (Journey audit'ten flaşlanan)

1. **Ayşe's dark moment (adım 5):** Confirm dialog'da tereddüt. **Çözüm:** [K3 audit] "Kanaatkar Ol" tooltip + post-redemption reengagement → UI spec K3.
2. **Murat's dark moment (adım 5–6):** PDF generation uncertainty. **Çözüm:** [K10 audit] Loading UX + email fallback → Backend spec.
3. **Both:** No history / no reporting = churn risk. **Çözüm:** [K1 audit] Ayşe history page + [K9–K10 audit] Murat dashboard → separate UI/BE sprints.

---

## H. HANDOFF log

- **Upstream:** `docs/product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md` (product-analyst)
- **This:** `docs/ux/02-journeys/2026-04-25-reward-ayse-murat-journey.md` (ux-researcher — journeys)
- **Downstream:** 
  - UI Designer via `docs/ui/01-specs/2026-04-25-reward-v2-ui-spec.md` (expected next)
  - Backend via `docs/product/02-briefs/eng/2026-04-25-reward-v2-backend.md` (TBD)

---

## I. Quality Checklist

- [x] Persona var ve etiketli (hipotez/kanıt) — Ayşe + Murat, BR + kanıt-altı
- [x] Senaryo tek cümle — Ayşe: kupon alma + share; Murat: Q2 rapor oluşturma
- [x] Adım sayısı 3–10 — Ayşe 10, Murat 8 ✅
- [x] Her adımda eylem + düşünce + duygu + fırsat — Tablo columns
- [x] Emotion curve görsel tablo — ASCII art + skor
- [x] ≥1 dark moment işaretli — Ayşe (5), Murat (5–6)
- [x] ≥1 peak moment işaretli — Ayşe (6, 9), Murat (8)
- [x] Bulgu özeti 3 madde — Friction + delight + first improvement
- [x] Kaynaklar listelenmiş — Kod, brief, hipotez, benchmark
- [x] HEART metric mapping — Tablo
- [x] Motion spec + A11y checklist — Sections D–E
- [x] Skill: user-journey-mapping kullanıldı ✅

**Checklist:** ✅ Tamamlandı.

---

## Tarihçe

- **2026-04-25:** Birinci yazma (ux-researcher) — Ayşe 10-step + Murat 8-step complete.
- **Sonraki:** UI designer handoff (S1–S5 wireframe → spec); Backend spec (K9–K10).
