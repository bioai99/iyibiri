# Gamma Sunum Prompt'u — İyiBiri

**Tarih:** 2026-04-24
**Owner:** strategy-consultant
**Amaç:** Gamma.app (gamma.app) içine yapıştırıldığında 15 slide'lık profesyonel deck üreten tek prompt. İki ayrı variant:

- **Variant A — Partner/STK Deck** (TEMA, LÖSEV, sponsor markalar için)
- **Variant B — Investor Deck** (angel / pre-seed / YC-TR / Startup Wise)

Her iki variant aynı temele dayanıyor, ama call-to-action ve numerik detay farklı.

**Kullanım:** Gamma dashboard → "Create new" → "Generate with AI" → prompt'u yapıştır → generate. Üretilen deck'i aç, 10-15 dakika manuel polish (logo, görsel seçimi, numeric'lerin son hali). 1 saatte paylaşıma hazır.

> **Not:** Gamma TR destekliyor ama ekrandaki bazı UI metinleri İngilizce kalıyor. Deck TR yapmak istiyorsan prompt'ta dil zorunlu belirtilecek.

---

## Ortak Style Guide (her iki variant için)

Gamma prompt'unda aşağıdaki style kurallarını SON bölümde tekrarla — Gamma bunları uygular:

```
STYLE:
- Language: Turkish (tüm metinler Türkçe)
- Tone: güvenilir, sıcak, insan-odaklı (jargon'suz, "biz" dili)
- Colors: warm earth tones — gold (#E8C268), deep ink (#24201B), cream (#F4EEDF), clay (#C8553D)
- Typography: serif for headlines (Fraunces tarzı), sans-serif for body (Plus Jakarta Sans tarzı)
- Visual style: minimal, generous white space, warm paper texture
- Imagery: Turkey-based NGO volunteer work photos, gen-z users, nature + community
- Avoid: stock corporate imagery, generic handshake photos, tech-bro aesthetics
- Avoid: emojis in headlines (ok in body max 1-2 per slide)
- Density: 3 key points per slide max; headline + short paragraph + visual
```

---

## VARIANT A — Partner / STK Deck (15 slide)

**Hedef kitle:** TEMA/LÖSEV/TEGV gibi STK karar vericileri veya sponsor markanın CSR sorumlusu.
**Tone:** İşbirliği, karşılıklı değer, "biz birlikte daha iyisini yapabiliriz".
**Call to action:** Pilot görüşme talep.

**Gamma'ya yapıştırılacak tam prompt:**

```
Create a 15-slide professional pitch deck in Turkish for "İyiBiri" — a
mobile good-deeds platform for Gen Z in Turkey. This deck is for STK
(NGO) partnership meetings — the audience is a foundation like TEMA,
LÖSEV, or TEGV considering a pilot partnership.

BUSINESS CONTEXT:
İyiBiri is a mobile-first app (PWA + iOS/Android) launching in Istanbul
in May 2026. Users discover missions from NGOs, complete them (plant a
tree, donate blood, read with children, clean a beach), earn "Karma"
points, and redeem Karma for real rewards from sponsor brands
(Starbucks, Migros, Nike). It is a 3-sided marketplace: users get
purpose + rewards; NGOs get younger volunteers + donors; brands get
authentic CSR visibility.

SLIDE-BY-SLIDE STRUCTURE (Turkish):

Slide 1 — COVER
Headline: "İyiBiri — İyilik alışkanlık olsun"
Subhead: "Mobil iyilik platformu · Türkiye · 2026"
Visual: warm photo — young person planting a sapling at sunset

Slide 2 — PROBLEM (STK perspective)
Headline: "STK'lar genç gönüllüye ulaşamıyor"
Three points:
- 18-34 yaş TR'de %63 sosyal medya aktif ama gönüllülük oranı %13
- Mevcut STK kanalları (web, e-posta) Gen Z için görünmez
- Gönüllü kaybı — ilk etkinlikten sonra %70'i geri dönmüyor
Visual: stat infographic, warm colors

Slide 3 — SOLUTION
Headline: "Mobil, gamified, ödüllü — Gen Z'nin dili"
Three points:
- Görev seç → tamamla → Karma kazan → gerçek ödül
- STK'ya doğrulanmış gönüllü + bağışçı akışı
- Markaya ölçülebilir, etkili CSR
Visual: 3-adım akış ikonları; sağda mobil app mockup

Slide 4 — HOW IT WORKS (user journey)
Headline: "Kullanıcı 4 adımda gönüllü oluyor"
1. Keşfet (harita ve öneri feed)
2. Katıl (tek-tık, KVKK korumalı)
3. Tamamla (QR / kod / fotoğraf doğrulama)
4. Kazan (Karma + sponsor marka ödülü)
Visual: app screen mockups, left-to-right flow

Slide 5 — MARKET (Türkiye)
Headline: "Türkiye'de dijital iyilik ekonomisi hazır"
Three stats:
- Bireysel bağış hacmi: ~9 milyar TL yıllık, dijital %38
- Gençlerde gönüllülük oranı 20 yılda 2x arttı (%6 → %13)
- Deprem sonrası STK'ya doğrudan bağış %25'e çıktı (TÜSEV 2024)
Visual: rising bar chart, warm palette

Slide 6 — WHY NOW
Headline: "Kategori lideri yok — şu an pozisyon alınıyor"
Three points:
- fonzip = altyapı sağlayıcı (bağış geçidi), kullanıcı arayüzü değil
- change.org = advocacy platformu, gönüllülük değil
- Türkiye'de gamified iyilik platformu yok — ilk hareketin avantajı
Visual: rakip haritası 2x2 matrix (altyapı vs kullanıcı deneyimi × lokal vs global)

Slide 7 — PARTNERSHIP MODEL (3-sided)
Headline: "3 tarafın da kazandığı ekosistem"
Three columns:
- Kullanıcı: amaç + ödül + topluluk
- STK: genç gönüllü + yeni üye + sıfır ek operasyon
- Sponsor marka: ölçülebilir CSR + genç tüketici erişimi
Visual: 3-sided marketplace diagram

Slide 8 — STK VALUE (detay)
Headline: "STK'ya ne sunuyoruz"
Four bullets:
- Yeni üye/gönüllü hacmi — mobile-native Gen Z
- Sıfır operasyonel yük — biz tasarlarız, siz onaylarsınız
- Mevcut altyapınıza dokunmayız (fonzip/iyzico korunur)
- Aylık analitik rapor (kaç kullanıcı, kaç görev, kaç yeni üye)
Visual: dashboard önizlemesi — "TEMA bu ay 234 yeni gönüllü"

Slide 9 — PILOT TEKLİF
Headline: "6 ay pilot, %0 komisyon"
Three points:
- Mayıs-Ekim 2026
- Sadece: 1 kişi haftalık 2 saat admin (görev yayınla, onay kontrol)
- Pilot sonu birlikte ROI değerlendirmesi; devam kararı ortak
Visual: timeline — Mayıs pilot başı, Ekim review, Kasım+ rollout

Slide 10 — TRUST + COMPLIANCE
Headline: "KVKK + yasal standartlara tam uyum"
Three points:
- Çifte KVKK onayı (veri paylaşımı + üyelik sözleşmesi)
- 14 gün cayma hakkı (Tüketici Kanunu 6502)
- Supabase + Türkiye merkezli ödeme altyapısı
Visual: shield icon + KVKK/6502 rozet

Slide 11 — PRODUCT (ekran görüntüleri)
Headline: "Ürün hazır — Mayıs 2026 lansman"
3 screenshot:
- Dashboard (Karma + günün görevi)
- Mission detay (fidan dikimi örneği)
- Celebration (+80 Karma kazandın!)
Visual: 3 phone mockup yan yana

Slide 12 — ROADMAP
Headline: "İstanbul pilot, sonra ulusal"
Timeline:
- Q1 2026: Kapalı beta
- Q2 2026: İstanbul açık pilot (3 STK)
- Q3-Q4 2026: İstanbul ölçeklendirme + Ankara/İzmir
- 2027: Ulusal genişleme + sponsor marka çeşitliliği
Visual: Türkiye haritası + timeline

Slide 13 — SOSYAL ETKİ
Headline: "3 yılda hedef"
Three big numbers:
- 200.000+ aktif kullanıcı
- 1 milyon+ tamamlanmış görev
- 50+ STK partneri
Visual: gold big-number display

Slide 14 — NEDEN BİZ
Headline: "Teknoloji + sosyal vizyon"
Three points:
- Kurucu ekip: ürün tasarımı + mühendislik + nonprofit deneyimi
- Türkiye-odaklı — global copy paste değil, yerel bağlam
- Uzun vadeli — STK ortaklıkları 5+ yıl perspektifi
Visual: founder + ekip fotoğrafı (placeholder — sen fotoğraf ekle)

Slide 15 — NEXT STEP
Headline: "15 dakika konuşalım mı?"
Subhead: "Pilot için ön görüşme — bağlayıcı değil, fit'i birlikte ölçelim"
Contact:
- Bahadır Oylumlu, Kurucu
- bahadiroylumluu@gmail.com
- iyibiri.app
Visual: calm warm color, QR to iyibiri.app

STYLE:
- Language: Turkish (tüm metinler)
- Tone: güvenilir, sıcak, insan-odaklı
- Colors: warm earth — gold (#E8C268), deep ink (#24201B), cream (#F4EEDF), clay (#C8553D)
- Typography: serif headlines, clean sans-serif body
- Visual: minimal, Turkey-based NGO photography, avoid stock corporate
- Density: 3 key points per slide max
```

---

## VARIANT B — Investor Deck (15 slide)

**Hedef kitle:** Angel, pre-seed fund, accelerator (Startup Wise, Keiretsu, Vestel Ventures), YC-TR.
**Tone:** Confident, numeric, market-sized; "we are building a category".
**Call to action:** Funding ask + team introduction.

**Gamma'ya yapıştırılacak tam prompt:**

```
Create a 15-slide investor pitch deck in Turkish for "İyiBiri" — a
mobile good-deeds platform. This is for seed-stage investors (angel,
pre-seed fund) in Turkey.

BUSINESS CONTEXT:
İyiBiri is launching May 2026 in Istanbul. 3-sided marketplace: Gen Z
users earn "Karma" by completing NGO missions; redeem Karma for real
rewards from sponsor brands. Revenue: sponsor brand CSR fees + optional
NGO platform fee + donation processing margin. TAM: Turkish digital
donation + volunteer activation market ~9B TL/year, growing 18% YoY.

SLIDE STRUCTURE (Turkish):

Slide 1 — COVER
Headline: "İyiBiri"
Subhead: "Türkiye'de Gen Z için ilk gamified iyilik platformu"
Small: "Seed ronda 1M USD arıyor · Mayıs 2026 lansman"
Visual: warm young-person-volunteering photo

Slide 2 — PROBLEM
Headline: "İyilik ekonomisi Gen Z için kırık"
Three points:
- Bireysel bağış artıyor, ama STK'lar 18-34 yaş erişiminde başarısız
- Gönüllülük retention %30 — "tek seferlik" olarak kalıyor
- Karma/ödül yok, motivasyon sürdürülemez
Visual: fragmented user journey diagram

Slide 3 — SOLUTION
Headline: "Karma ekonomisi — ölçülebilir iyilik"
Three points:
- Mission-based gamification (Duolingo for good)
- Sponsor brand reward loop — kendi kendini fonlar
- STK tarafında otomatik gönüllü/bağışçı CRM
Visual: Karma flywheel diagram (user → NGO → brand → user)

Slide 4 — HOW IT WORKS
Headline: "4 adım — 2 dakika"
Mobile app screens: discover → join → verify → celebrate
Visual: 4-phone wide layout

Slide 5 — MARKET
Headline: "TAM: 9B TL digital good economy"
Three numeric boxes:
- Bireysel bağış: 9B TL (TÜSEV 2024), dijital %38 → ~3.4B TL SAM
- Gen Z digital penetration: 6.5M kişi
- Retention gap: %70 drop-off → %30 hedef (3x iyileştirme)
Visual: TAM/SAM/SOM pyramid

Slide 6 — BUSINESS MODEL
Headline: "Üçlü gelir akışı"
Three columns:
- Sponsor marka CSR tier: ₺15K-₺150K/ay
- NGO platform fee: bağış GMV'nin %2-4 (opt-in)
- Donation processing margin: iyzico Marketplace %0.5
Visual: revenue stacked bar (Y1 projection)

Slide 7 — TRACTION
Headline: "Hazırız — pilot başlıyor"
Four points:
- Ürün kodbase hazır (10+ migration, 83 unit test, 3 NGO pilot'a uygun)
- 5 NGO ilişki ağı (TEMA, TEGV, LÖSEV, HAYTAP, Kodluyoruz)
- Sponsor marka görüşmeleri başladı (3 görüşme aktif)
- İstanbul pilot Mayıs 2026
Visual: progress bar milestones

Slide 8 — COMPETITIVE LANDSCAPE
Headline: "Kategoride lider yok"
2x2 matrix:
- X axis: Altyapı sağlayıcı ↔ Kullanıcı deneyimi
- Y axis: Global ↔ Lokal (TR)
- Fonzip: altyapı + lokal; Change.org: UX + global; İyiBiri: UX + lokal (empty quadrant)
Visual: competitive matrix

Slide 9 — DEFENSIBILITY
Headline: "6 moat — zamanla derinleşir"
Bullets:
- NGO exclusive pilot ilişkileri
- Sponsor marka multi-year contracts
- Kullanıcı Karma balance switching cost
- Mission data taxonomy (TR'de eşsiz)
- Marka + güven (KVKK tam uyum)
- Turkish product-market craft
Visual: layered moat diagram

Slide 10 — GO-TO-MARKET
Headline: "3 aşama, 18 ay"
Timeline:
- Ay 0-3: Kapalı beta (100 kullanıcı, 3 STK)
- Ay 3-6: İstanbul açık pilot (10K kullanıcı hedef)
- Ay 6-12: İstanbul ölçek + Ankara/İzmir (50K)
- Ay 12-18: Ulusal (200K+)
Visual: hockey stick user growth

Slide 11 — UNIT ECONOMICS
Headline: "Birim ekonomi — Ay 12 hedef"
Three numbers:
- CAC: ~₺25 (sosyal organik ağırlıklı)
- ARPU: ₺8/ay (marka CSR + bağış margin)
- LTV/CAC: 6x (24 ay retention)
Visual: waterfall chart

Slide 12 — FINANCIALS (3 yıl)
Headline: "3 yıl mali projeksiyon"
Table veya line chart:
- Yıl 1: 50K kullanıcı, ₺4M revenue, -₺3M loss
- Yıl 2: 300K kullanıcı, ₺25M revenue, +₺2M EBIT
- Yıl 3: 800K kullanıcı, ₺80M revenue, +₺15M EBIT
Visual: revenue + user growth dual chart

Slide 13 — TEAM
Headline: "Kurucu ekip"
Founder + 2 kilit kişi:
- Bahadır Oylumlu — Kurucu, Product/Engineering
- [2 kişi eklenecek — CTO ve growth/operations]
Visual: founder photos + 1-line bio

Slide 14 — ASK
Headline: "Seed ronda: 1M USD"
Three use of funds:
- %40 ürün + mühendislik (mobile app, admin panel, AI moderation)
- %35 büyüme (user acquisition, STK onboarding, brand partnerships)
- %25 operasyon (legal, KVKK, ekip genişleme)
18 ay runway, 300K kullanıcı + breakeven hedef
Visual: pie chart

Slide 15 — CONTACT
Headline: "Sonraki adım — deep dive"
Subhead: "2 hafta içinde ürün demo + detaylı financials için görüşelim"
Contact:
- Bahadır Oylumlu, Kurucu
- bahadiroylumluu@gmail.com
- iyibiri.app
Visual: calm warm, QR

STYLE:
- Language: Turkish
- Tone: confident, numeric, market-sized
- Colors: warm earth — gold (#E8C268), deep ink (#24201B), cream (#F4EEDF)
- Typography: serif headlines, clean sans body
- Density: metric-heavy; numbers prominently displayed
```

---

## Post-Gamma Polish Checklist

Gamma deck üretilince elle kontrol edilecekler:

- [ ] Tüm fiyat/rakamlar strateji memolarıyla tutarlı
  - Bireysel bağış: 9B TL (TÜSEV)
  - Gönüllülük: %6 → %13 (20 yıl)
  - TEMA üyelik: ₺15/yıl genç, ₺256/yıl yetişkin
- [ ] "YC-TR" yerine spesifik hedef fon adı yaz (başvuruya özel)
- [ ] Slide 13 team — gerçek foto + bio. Şu an co-founder yoksa "advisor" olarak hocalarınızı/mentorlarını ekle
- [ ] Slide 15 — QR kodu çalışıyor mu kontrol et (iyibiri.app canlı olana kadar örnek URL)
- [ ] Screenshot'lar güncel — dashboard v2 + mission detail FSM + celebration canlı olduğunda bunları çek
- [ ] Logo eksik — 16-slide deck'te Gamma placeholder logo koyuyor, gerçek logoyla değiştir
- [ ] TR imla/noktalama — AI bazen i/ı, ş/s karıştırabiliyor
- [ ] Gamma "Export to PDF" — yatırımcıya gönderirken PDF tercihli (Gamma link her zaman değil)
- [ ] Dark mode preview — Gamma light tema üretiyor, dark mode'da nasıl görünüyor kontrol

---

## Alternatif Format Önerileri (Gamma dışı)

Gamma AI-generated bir mecra. İstediğin tam kontrol isteyebilirsin:

- **Pitch.com** — daha fazla manuel tasarım kontrolü
- **Beautiful.ai** — data-heavy slide template
- **Google Slides + [Slidesgo](https://slidesgo.com) template** — klasik ama herkese gönderilebilir
- **Figma slide template + export PDF** — tam kontrol; ama 3-4x zaman

İlk hareket için **Gamma en hızlı** — 1 saatte draft, 1 saat polish, gönderilebilir. Yatırımcı görüşmesi pekişince Figma'da "hero deck" yap.

---

## Deck Kullanım Kuralı

**İki deck aynı zamanda güncel tutulur mu?**

Hayır. Variant A (partner) ilk kullanım, Variant B (investor) sonra. Başlangıçta kaynaklar sınırlı, tek odak. Pilot ortaklar bağlandıktan sonra (Mayıs-Haziran 2026), traction slide'ı gerçek numaralarla dolunca investor deck anlamlı.

**Sıra:**
1. Variant A ile 3 STK pilot görüşmesi (Mayıs)
2. Pilot data geldikçe Variant A slide 7 (traction) + slide 11 (product) güncellenir
3. 3 ay içinde Variant B yaratılır, aynı Gamma prompt ama traction slide'ı canlı verilerle
