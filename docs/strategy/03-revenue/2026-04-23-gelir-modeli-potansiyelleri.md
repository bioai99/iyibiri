# Gelir Modeli Potansiyelleri — İlk Tur Analiz

**Tarih:** 2026-04-23
**Yazar:** strategy-consultant
**Bağlam:** İyiBiri'nin 5 olası gelir kolunu analiz etmek — her biri için mekanizma, unit economics, benchmark, risk, ve öncelik. Bu memo karar vermek için değil, 🔴Q2 (ödeme) + NSM ilişkisini netleştirmek için karar verici araç.

---

## Yönetim Özeti

**İyiBiri'nin 5 potansiyel gelir kolu arasında, Yıl 1-2 primary aday Sponsor Marka Aracılık (Charity Miles benzeri), Yıl 3+ ekleme aday Kurumsal CSR B2B (Benevity light).** Bağış fee ve premium subscription sekonder kalır (küçük ama sürdürülebilir); NGO üyelik komisyonu ilk yıllarda düşük volüm, ideal Yıl 2+. Üç bulgu:

1. **Sponsor marka modeli Charity Miles'ta %50 platform fee — yıllık milyonlarca dolar.** İyiBiri'de TR CSR bütçesinin %0.5-1'ini yakalamak yıllık 25-100M TL ölçeğinde aracılık geliri potansiyeli.
2. **Duolingo %8.8 MAU → premium dönüşümü** İyiBiri için gerçekçi hedef; 500k MAU × %5 × ₺29/ay = yıllık ~87M TL (orta senaryo).
3. **NGO üyelik komisyonu (ayda ₺29-79 × %10 İyiBiri pay)** 50k aktif üye × yıllık 12 × ortalama ₺3.6 → yıllık ~2M TL. İlk yıllarda küçük, recurring olarak değerli.

**Öneri:** Sponsor marka havuzu birinci kol, premium ikinci, NGO komisyonu üçüncü, bağış fee dördüncü, B2B CSR beşinci (Yıl 3+).

---

## Hipotezler

| # | Hipotez | Sonuç |
|---|---|---|
| R1 | Sponsor marka aracılık primary gelir kolu. | ✅ Kanıta dayalı destekleniyor (Charity Miles benchmark). |
| R2 | Premium subscription Yıl 2-3'te kar marjının ana kaldıracı. | 🟡 Hipotez — Duolingo örneği destekliyor ama "iyilik" segmentinde premium willingness henüz test edilmedi. |
| R3 | Bağış fee primary olmayacak, destek rolü. | ✅ TÜSEV data destekliyor — bağış fee'e direnç yüksek. |
| R4 | NGO üyelik komisyonu ilk yıllar küçük ama sürdürülebilir. | 🟡 Recurring revenue premium üzerindeki ikincil kaldıraç. |
| R5 | Kurumsal CSR B2B Yıl 3+ katkı yapar — önce ürün olgunlaşmalı. | ✅ Benevity ölçek gerekir, olgun müşteri temsilcisi olmadan kapı açılmaz. |

---

## Gelir Kolları Detaylı

### R.1 — Sponsor Marka Aracılık (Charity Miles modeli)

**Mekanizma:** Sponsor marka (Starbucks, Nike, Migros gibi) İyiBiri'ye fon verir → kullanıcı görev tamamladığında marka fon havuzundan Karma değerine denk bağış/ödül akışı gerçekleşir → bir kısmı platform ücreti olarak İyiBiri'de kalır.

**Benchmark (Charity Miles [S08]):**
- Platform fee: sponsorship fee'nin **%50'si**.
- Sponsorlar ~$50k-$500k/yıl marka fonu aktarır.
- ABD pazarında Charity Miles yıllık milyonlarca dolar aracılık geliri sağlıyor.

**Unit economics (TR kalibre):**

| Parametre | Konservatif | Orta | Agresif |
|---|---|---|---|
| Sponsor marka sayısı (Yıl 2) | 10 | 25 | 50 |
| Ortalama yıllık sponsor fonu | ₺500k | ₺1.5M | ₺3M |
| Toplam sponsor havuzu | ₺5M | ₺37.5M | ₺150M |
| Platform fee (%30-50) | %30 | %40 | %50 |
| **İyiBiri geliri (Yıl 2)** | **₺1.5M** | **₺15M** | **₺75M** |

**Avantaj:**
- Sponsor markanın bütçesi marketing+CSR kesişiminden geliyor — "ads dollars for good" Charity Miles pitch'i [S08].
- Kullanıcı için **görünmez** gelir kolu (bağışını etkilemez).
- Scalable: marka sayısı arttıkça gelir lineer.

**Risk:**
- Makro ekonomik baskı → marka CSR bütçesi ilk kısıntıya gider.
- Rakip marka anlaşması çakışması (Nike+Adidas aynı anda olamaz — kategori eksklüzüvlük).
- Türk markaların CSR sofistikasyonu global markadan düşük — "fon tahsisatı" konsepti satılmakta zorlanabilir.

**Öncelik:** 🟢 **PRIMARY Yıl 1-2.** İlk 5 marka anlaşması kurulum dönemi; hand-sold.

### R.2 — Premium Kullanıcı Aboneliği

**Mekanizma:** Ücretsiz temel + "Super İyiBiri" premium tier. Benefit adayları:
- Seri koruma (1 gün kaçırırsan seri bozulmasın)
- Özel rozet / avatar
- İlk erişim görevlere (popüler doldurmadan önce)
- Reklamsız (varsa in-app ads)
- Karma boost (1.5x hafta sonu)
- Detaylı karma istatistik / geçmiş
- Sponsor marka ödüllerinde ek indirim

**Benchmark (Duolingo [S10]):**
- MAU → premium dönüşümü: %8.8 (2025); %3 başlangıç (2020).
- Freemium B2C ortalama %2-4 → Duolingo best-in-class %8.8.
- Fiyat: Duolingo Plus ~$7/ay, yıllık ~$83.
- 7-gün consecutive streak kullanıcı 3-4x premium'a yükseliyor.

**Unit economics (TR kalibre):**

| Parametre | Konservatif | Orta | Agresif |
|---|---|---|---|
| Yıl 2 MAU | 150k | 500k | 1.5M |
| Premium conversion oranı | %2 | %5 | %8 |
| Premium kullanıcı sayısı | 3k | 25k | 120k |
| Aylık fiyat (TL) | ₺29 | ₺39 | ₺49 |
| Yıllık ARPU | ₺348 | ₺468 | ₺588 |
| **Yıllık gelir (Yıl 2)** | **₺1M** | **₺11.7M** | **₺70.6M** |

**Avantaj:**
- **Recurring** revenue — hesap dönemlerine yayılır.
- Yüksek kullanıcı motivasyonu = yüksek retention (birleştirir).
- Sabit maliyet yapısı → marginal yüksek.

**Risk:**
- "İyilik üzerinden para kazanmak yanlış" kültürel algısı — mesajlama dikkat.
- Türkiye'de aylık subscription ödeme direnci yüksek (Netflix bile %5-10 churn).
- TR premium willingness benchmark yok — Duolingo rakamı ABD; TR'de %3-5 daha gerçekçi.

**Öncelik:** 🟡 **SECONDARY Yıl 2.** Ürün olgunlaşınca (seri + Karma derinliği) premium açılır.

### R.3 — Bağış Hizmet Bedeli (Bağış Fee)

**Mekanizma:** Kullanıcı bir STK'ya bağış yapar → toplam tutardan %X platform ücreti kesilir (veya kullanıcı "tip" olarak opsiyonel öder).

**Benchmark:**
- GlobalGiving: %5-10 platform fee + %3 ödeme processor.
- fonzip (TR): yaklaşık %2-5 tahmini (kamuya açık değil).
- **İyiBiri konumu:** "100% aktarım" vaadi — bağış fee eklemek marka tonuyla ÇATIŞIR.

**Unit economics:**

| Parametre | Konservatif | Orta | Agresif |
|---|---|---|---|
| Yıl 2 bağış hacmi (pazar memo SOM) | ₺50M | ₺150M | ₺400M |
| Platform fee (opsiyonel tip) | %0 | %2 | %5 |
| Ortalama tip oranı (benimseyen %) | %10 | %25 | %40 |
| Efektif yield | %0 | %0.5 | %2 |
| **Yıllık gelir (Yıl 2)** | **₺0** | **₺750k** | **₺8M** |

**Avantaj:**
- Scale büyüdükçe volümle artar.
- "Opsiyonel tip" + transparent — "100% aktarım" vaadi korunur.

**Risk:**
- "İyilikten para kazanıyor" eleştirisi.
- Fee optin düşük olursa efektif gelir kaybolur.
- **ÖDEME SAĞLAYICI SEÇİMİ (🔴Q2) bağlı.** iyzico corporate %2.99 + 0.25 TL [S11]. Bu komisyon üstüne İyiBiri katkısı zor.

**Öncelik:** 🔴 **MINIMAL Yıl 1-2.** Bağış fee yerine "opsiyonel tip" tercih edilir. Primary değil.

### R.4 — NGO Üyelik Komisyonu

**Mekanizma:** Kullanıcı STK'ya aylık üyelik ödeyerek gelir → İyiBiri üye akışını sağladığı için STK'dan %X komisyon alır.

**İç veri (kod):** İyiBiri'de zaten `ngo_memberships` tablosu var; tier enum (free/basic/premium).

**Benchmark:**
- Patreon benzer: %8-12 platform fee + ödeme.
- Üyelik yönetimi SaaS'lar: $50-500/ay flat + %.

**Unit economics:**

| Parametre | Konservatif | Orta | Agresif |
|---|---|---|---|
| Yıl 2 aktif üye sayısı | 10k | 50k | 200k |
| Ortalama aylık üyelik (TL) | ₺29 | ₺49 | ₺79 |
| Yıllık üyelik hacmi (TL) | ₺3.5M | ₺29.4M | ₺189M |
| Komisyon oranı | %8 | %10 | %12 |
| **Yıllık gelir (Yıl 2)** | **₺278k** | **₺2.9M** | **₺22.7M** |

**Avantaj:**
- **Recurring** revenue.
- STK'ların zaten aradığı çözüm (üye yönetimi zor) → ikna kolay.
- Churn düşük (kullanıcı üyeliği kalıcı).

**Risk:**
- STK'lar %8-12 komisyonu "zorunlu" olarak kabul etmeyebilir — müzakere.
- Üyelik akışının ilk ödeme setup'ı uzun (Q2 ödeme sağlayıcı beklenirken).
- Gerçek volüm için STK ortaklık dalgası gerekli → birkaç dalga yayılır.

**Öncelik:** 🟡 **TERTIARY Yıl 2+.** Ürün tarafı `ngo_memberships` hazır, ama pilot STK grubu kuruluncaya kadar tutarsız gelir.

### R.5 — Kurumsal CSR B2B (Benevity-light)

**Mekanizma:** Şirket yıllık bir anlaşma imzalar → çalışanları İyiBiri'den gönüllülük + match programlarına erişir → şirket SaaS lisans ücreti + success fee öder.

**Benchmark (Benevity [S09]):**
- Fortune 1000 focused, $10B+ lifetime processed.
- Enterprise SaaS: yıllık deal $25k-$500k.

**TR uyarlama:**
- Capital 500 şirket sayısı 500.
- İlk 3 yılda 5-20 müşteri yakalamak realistik (hand-sold).

**Unit economics:**

| Parametre | Konservatif | Orta | Agresif |
|---|---|---|---|
| Yıl 3 müşteri sayısı | 3 | 10 | 25 |
| Yıllık ortalama kontrat | ₺100k | ₺300k | ₺600k |
| **Yıllık gelir (Yıl 3)** | **₺300k** | **₺3M** | **₺15M** |

**Avantaj:**
- Sürdürülebilir, predictible gelir.
- Müşteri başına yüksek değer; CAC ödenir.
- İyiBiri'yi "hızlı büyüyen startup" değil "kurumsal çözüm" kategorisine taşır.

**Risk:**
- Enterprise sales cycle 3-6 ay.
- Ürün mimarisi çift-taraflı (B2C + B2B) olmak zorunda — artan karmaşıklık.
- Benevity global ölçekte çoktan var — TR özgüllük satış argümanı olmalı.

**Öncelik:** 🟢 **POST-LAUNCH, Yıl 3+.** İlk yıl B2C odaklı kal, B2B evrim olur.

---

## 5-yıl Toplam Gelir Projeksiyonu (orta senaryo)

| Kol | Yıl 1 | Yıl 2 | Yıl 3 | Yıl 4 | Yıl 5 |
|---|---|---|---|---|---|
| Sponsor aracılık | ₺2M | ₺15M | ₺40M | ₺80M | ₺150M |
| Premium subscription | ₺0 | ₺11.7M | ₺35M | ₺60M | ₺95M |
| NGO üyelik komisyonu | ₺0 | ₺2.9M | ₺8M | ₺18M | ₺35M |
| Bağış fee (opsiyonel tip) | ₺0 | ₺750k | ₺3M | ₺7M | ₺15M |
| Kurumsal B2B SaaS | ₺0 | ₺0 | ₺3M | ₺12M | ₺30M |
| **Toplam yıllık gelir** | **~₺2M** | **~₺30M** | **~₺89M** | **~₺177M** | **~₺325M** |

**Not:** Bu rakamlar **orta** senaryo + sadece gelir (maliyet yok). Brüt kar marjı %60-75 tahmin (platform business); net marjı ölçek olgunlaşana kadar düşük.

## Sensitivity — hangi koldaki aksaklık en çok acıtır?

| Senaryo | Yıl 3 etki |
|---|---|
| Sponsor marka havuzu kurulamazsa (R1 başarısız) | **-60% total** — ana motor kopar |
| Premium dönüşüm %5 yerine %2 olsa | **-30% R2, -10% total** |
| NGO komisyonu kabul edilmezse | **-10% R4, -3% total** |
| Bağış fee kaldırılırsa | minimal |
| B2B gecikmesi 1 yıl | **-3% Yıl 3, -8% Yıl 5** |

**Ana ders:** **R1 (sponsor aracılık) risk düşmesin diye ilk yıl odağı.** R2 ikinci. R4 ve R5 destek.

---

## Sonuç ve Öneriler

1. **R1 (Sponsor Aracılık) = Primary Yıl 1-2.** İlk 5 marka hand-sold; İyiBiri ekosistem liderliği buradan kurulur.
2. **R2 (Premium Subscription) = Ayakları güçlendir.** Yıl 2 lansman; Duolingo-tarzı gamified churn azaltma.
3. **R4 (NGO Komisyonu) = Slow burn.** STK partnership dalgasıyla.
4. **R3 (Bağış Fee) = Opsiyonel tip olarak.** "100% aktarım" vaadini bozma.
5. **R5 (B2B CSR) = Yıl 3+ evrim.** Önce B2C olgunlaşsın.
6. **🔴Q2 ödeme sağlayıcı kararı kritik** — Sponsor havuzu akışı ödeme sağlayıcının subscription + marketplace desteğini gerektirir. iyzico corporate %2.99 [S11] kabul edilebilir; Craftgate B2B fokus daha uygun olabilir — ayrı memo gerek.
7. **NSM (🔴Q1) seçimi "Aylık Karma Kazanan Kullanıcı"** bu gelir modeli için optimal — her gelir kolu MAU × aktiflik × yoğunluğa bağlı.

---

## Açık Sorular / Sonraki Adımlar

- R1 için: 3-5 aday Türk marka (Starbucks TR, Migros, Garanti BBVA, Nike TR) ile ilk müzakere brief'i (product-analyst'e devir önerilir).
- R2 için: Duolingo-benzeri premium benefit listesi validate edilmeli — UX researcher'a 5 benefit kullanıcı testi briefi.
- R3-R4 ödeme altyapı: iyzico corporate + Craftgate (subscription) karşılaştırma memo'su.
- R5 için: Benevity fiyatlandırma detay (enterprise deal avg) sızan veri aranmalı.
- **Sonraki memo:** 05-focus/blue-ocean ve 06-memos/sentez.
