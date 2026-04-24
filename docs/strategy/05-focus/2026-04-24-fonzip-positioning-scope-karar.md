# Fonzip-Benzeri Positioning mu Embedded Hibrit mi — Stratejik Scope Kararı

**Tarih:** 2026-04-24
**Yazar:** product-analyst (strateji seviyesi soru, strategy-consultant ile ortak)
**Bağlam:** Kullanıcı fonzip pricing ekranını paylaştı (₺499-799/ay Standart/Pro, %1.5 platform fee, 0,05₺/email) ve sordu: "fonzip gibi konumlanıp ödeme kurgusunu üstüme çevirmem çok büyük bir iş mi?" Bu karar İyiBiri'nin 12-aylık yol haritasını tamamen şekillendirir. ADR-008 v2 embedded hibrit modunu mühendislik katmanında çözdü; bu memo **pazarlama/konumlama/scope** sorusunu çözüyor.

---

## Yönetim Özeti

**Fonzip'in B2B SaaS modelini tamamen üstlenmek mümkün ama V1'de yapılırsa 9-12 ay yazılım + hukuki süreç demek — pazar momentum'u kaybedilir. ADR-008 v2 embedded hibrit mod bu sorunu 3-4 ayda V1 lansmanı + Yıl 2'ye kadar fonzip-benzeri eksikleri kapatacak şekilde çözer. Yol C (Hibrit Evrim) önerisi.** Üç bulgu:

1. **Fonzip'in çekirdek özellikleri 8-10 modül** — bunlardan 4'ünü İyiBiri zaten mevcut altyapısıyla karşılıyor; 4-6'sı yeni geliştirme gerektiriyor. **%40-50 zaten var.**
2. **"Fonzip olmak" + "tüketici uygulaması olmak" stratejik olarak güçlü ama pazarlama karmaşası yaratabilir.** Fonzip "STK SaaS" satıyor, İyiBiri "kullanıcı uygulaması" satıyor. İkisi birden aynı anda çıkarsa STK "Bu bir SaaS mi app mi?" karışıklığı yaşar.
3. **Fonzip'in pricing'i fırsat alanı açıyor.** ₺499-799/ay + %1.5 fee ortalama-büyük STK için makul ama küçük STK için yüksek. İyiBiri "ilk yıl ücretsiz + referral-only" modeli ile küçük-orta STK'yı fonzip'ten çeker.

**Öneri: Yol C (Hibrit Evrim).** V1'de embedded hibrit modla hızlı çık (3-4 ay), STK admin tool'larını aşamalı olarak ekle, Yıl 2'nin sonunda fonzip parite ulaş ve "fonzip'ten geç" kampanyası yap.

---

## 1. Fonzip Feature Envanteri (saptanmış)

Fonzip'in resmi sayfasından + yardım dokümanlarından çıkan feature listesi:

### Çekirdek modüller
1. **CRM — Contact Management** (kişi + kurum yönetimi, tag, segment)
2. **Üyelik Aidatları** (membership dues, multiple tier)
3. **Dijital Üyelik Kartları** (QR / barkod, digital wallet)
4. **Bağış Formları** (customizable per-organization donation forms)
5. **Düzenli Ödeme Otomasyonu** (recurring card subscription, auto-retry)
6. **Otomasyon Robotları** (debt reminder, weekly report, automated workflow)
7. **E-mail Kampanyaları** (mass email + transactional — per email 0,05₺)
8. **Raporlama + Analytics** (STK dashboard)
9. **Özelleştirilebilir Alan Adı** (Pro tier — custom subdomain)
10. **Yüz Yüze & Telemarketing** (Pro tier — offline contact integration)

### Entegrasyonlar
Stripe, Mailchimp, Google Analytics, Facebook (reklam + pixel).

### Fiyat yapısı (Türkiye)
- Standart: ₺499/ay + %1.5 platform + 0,05₺/email
- Pro: ₺799/ay + %1.5 platform + 0,05₺/email (+ custom domain + donation forms + telemarketing)

---

## 2. İyiBiri'de Şu An Ne Var, Ne Yok

### Zaten mevcut (mevcut kod + atlas Bölüm 4-6)

| Fonzip feature | İyiBiri'de durum |
|---|---|
| Kişi Yönetimi (CRM) — **parçalı** | `profiles` tablosu + üyelik kaydı var, STK-tarafı segment yok. |
| Üyelik Aidatları | `ngo_memberships` tablosu + tier enum + form_data jsonb. **ADR-007 parametric fee** ile tamamen parametric. |
| Bağış Formları | `/dashboard/ngos/[id]/membership` + `/dashboard/donations/*` mock sayfaları. ADR-008 v2 embedded ile işlevsel. |
| Raporlama (kullanıcı-yüzey) | Profil karma geçmişi + streak + leaderboard. STK-yüzey raporu yok. |
| Entegrasyon (Supabase MCP) | Supabase bağlı, veri katmanı hazır. |

### Eksik (yeni geliştirme gerekir)

| Fonzip feature | Tahmini effort |
|---|---|
| STK-yüzü CRM (segment, tag, custom field) | 3-4 hafta |
| Dijital Üyelik Kartı (QR/barkod, Wallet) | 2 hafta |
| Bağış formları (tam customizable, per-NGO branded) | 2-3 hafta |
| Recurring billing auto-retry engine | 2-3 hafta (iyzico subscription API) |
| E-mail altyapısı (campaign + transactional) | 3-4 hafta + ongoing email service cost |
| Otomasyon robotları (workflow engine) | 4-6 hafta |
| STK-yüzü Analytics dashboard | 3-4 hafta |
| Custom domain / subdomain | 1-2 hafta (CDN + SSL + DNS) |
| Makbuz generator + KVKK arşiv | 2-3 hafta |
| Telemarketing / offline contact tool | 3-4 hafta (Pro tier ekstra) |

**Toplam yeni iş: ~25-35 hafta sequential → 5-7 ay paralel çalışma ile.**

Plus hukuki + operasyonel:
- BDDK payment facilitator görüşme (veya iyzico Marketplace ile çözüm) — 2-3 ay hukuki.
- KVKK multi-tenant veri işleme çerçevesi — 1-2 ay mütalaa + dokümantasyon.
- KDV / vergi muhasebe modeli — uzman görüşü.
- STK destek + onboarding ekibi operasyonel.

**Gerçekçi tam-fonzip-parite timeline: 9-12 ay.**

### İyiBiri'nin fonzip'te OLMAYAN avantajları

| İyiBiri özel | Fonzip'te yok |
|---|---|
| Karma gamification + seri + seviye | Yok |
| Cross-NGO keşif (kullanıcı merkezli) | Fonzip STK-tek, cross yok |
| Sponsor marka ödül ekosistemi | Yok |
| Mobil-öncelikli PWA + Capacitor | Fonzip web-only |
| Görev + gönüllülük modülü | Yok |

**Kritik:** İyiBiri'nin **user-side hikayesi** fonzip'in olmadığı tamamen boş alan. Fonzip'i düşünmeden önce bu alanın İyiBiri için birincil değer olduğunu hatırla.

---

## 3. Üç Yol Karşılaştırma

### Yol A — ADR-008 v2 Embedded Hibrit (mevcut karar)

**Tanım:** Embedded default + Passthrough fallback + Marketplace opt-in. STK mevcut processor'ını kullanmaya devam eder; İyiBiri discovery + gamification + Karma + light integration.

**Scope:** Processor adapter katmanı (iyzico + PayTR + fonzip) + referral attribution + mevcut `ngo_memberships` parametric fee UI.

**Timeline:** V1 lansmanı **3-4 ay.**

**Gelir modeli:** İyiBiri'den STK'ya aylık SaaS fee (₺0 pilot → ₺2-5k sonra) + referral success fee %3-5.

**Güçlü yan:**
- Hızlı market-to-market.
- STK partnership düşük friction (mevcut altyapı değişmez).
- V1'de odak kullanıcı-yüzüne (Karma, görev, ödül) — İyiBiri'nin asıl farkı.

**Zayıf yan:**
- STK admin tool'ları minimum (fonzip'e göre zayıf).
- Büyük STK'lar "tam SaaS lazım" derse çekilirler.
- Fonzip pazarını doğrudan ele geçirmez.

### Yol B — Tam Fonzip Pariteli (baştan heavy)

**Tanım:** V1'de CRM + admin + email + automation + custom domain + makbuz + analytics — fonzip feature parite. STK İyiBiri'ye taşınır, fonzip'ten çıkar.

**Scope:** Yukarıdaki 10 modül + iyzico Marketplace primary + hukuki süreç.

**Timeline:** V1 lansmanı **9-12 ay.**

**Gelir modeli:** Fonzip benzeri ₺499/₺799 SaaS + %1.5 fee. Plus İyiBiri'nin kendi kolları (R1/R2/R6).

**Güçlü yan:**
- Fonzip'e doğrudan rekabet.
- Tek yerden her şey → STK için gerçek SaaS value.
- Uzun vade defansif (fonzip'ten STK çalınır).

**Zayıf yan:**
- 9-12 ay kullanıcı-yüzey hiç çıkmaz — pazar momentum kaybı.
- Hukuki bürokratic süreç (BDDK payment facilitator).
- "Bir başka fonzip" algısı — İyiBiri'nin Karma/gamification özgünlüğü arkaplana düşer.
- Sermaye yoğun — email infrastructure, custom domain, telemarketing tool — hepsi ongoing maliyet.
- Fonzip'in TR dernekler federasyonlarıyla yıllardır kurduğu güveni kısa sürede aşmak zor.

### Yol D — Fonzip Partnership (affiliate/referral) 🆕

**Tanım:** İyiBiri fonzip ile stratejik ortaklık kurar. Fonzip müşterisi STK'lardan (TEMA, AÇEV, WWF, Kızılay, Haytap...) İyiBiri üzerinden gelen bağışlar fonzip altyapısında işlenir; fonzip İyiBiri'ye referral commission öder (%0.5-1 bağış üzerinden).

**Bağlam:** Kullanıcı tespiti — "fonzip'le anlaşıcam, STK'lara seni kullanma zorunluluğu veriyorum diyeceğim ve bana %0.5 ayır." Pilot 3 STK'nın ikisi + 2. dalgadan 2 tanesi **zaten fonzip müşterisi** (TEMA, AÇEV, Haytap + Kızılay kısmen + WWF + UNICEF TR + AKUT — bkz. `docs/strategy/02-competitors/2026-04-24-fonzip-sirket-profili.md`).

**Scope:**
- Fonzip ile partnership müzakere (Emre Danacı ile direkt temas).
- Deep link + attribution API (İyiBiri → fonzip widget veya URL → callback).
- Referral commission akışı (ay sonu fonzip → İyiBiri hesabı).
- ADR-008 v2 embedded mode kullanılır (fonzip widget iframe embed).

**Timeline:** V1 lansmanı **1-2 ay** (sadece deep link + callback + attribution; ürün dev minimum).

**Gelir modeli:**
- İyiBiri'nin gelirinin önemli kısmı fonzip referral commission.
- Örnek: TEMA yıllık 10M TL bağış → İyiBiri'nin getirdiği %10 share → 1M TL referral üstünden %0.5 fonzip komisyonu → **İyiBiri yıllık ~5k TL/STK**.
- 20 STK aktifse: ~100k TL/yıl fonzip referral.
- Az. Ama hız + düşük risk.

**Güçlü yan:**
- **En hızlı lansman** (1-2 ay).
- Ürün geliştirme yükü minimum.
- STK operasyonu sıfır değişiklik (fonzip kullanıyor zaten).
- Pilot 3 STK'nın fonzip üzerinden erişimi direkt.
- Hukuki karmaşa fonzip'in omzunda.
- **Doğrulama hızlı** — user-side değeri (Karma + gamification + keşif) fonzip backend'inde test edilir.

**Zayıf yan:**
- **Fonzip'e stratejik bağımlılık** — fiyat, ürün, devamlılık onların kararı.
- **Gelir tavanı düşük** — %0.5 referral commission ölçeği sınırlar. TEMA 10M bağış × %0.5 = 50k TL yıllık (küçük).
- **Fonzip reddederse** — Plan B şart (→ Yol C).
- **"Fonzip'in channel'ı olmak"** — ileride bağımsızlaşmak yeniden tüm dev yapmak demek.
- **Fonzip'in kontrolü altında** — özellik isteyemez, roadmap paylaşamayız.
- **Fonzip İyiBiri'yi rakip görürse** partnership reddeder veya sınırlar.
- **Fonzip ekibi küçük (2-10)** — partnership'e ayıracak dedicated resource az.

**Fonzip müşterisi olmayan STK'lar için mod:** Fonzip'te olmayan STK (TEGV kendi altyapı, LÖSEV kendi) için Yol D çalışmaz — Yol C fallback gerekir. Yani Yol D hiçbir zaman **tek başına** olmaz; Yol C + Yol D birleşimi gerekli.

### Yol C — Hibrit Evrim (önerim) ⭐

**Tanım:**
- **Faz 1 (Ay 1-4):** ADR-008 v2 embedded hibrit ile V1 lansmanı. Karma + user-side full + STK admin minimum.
- **Faz 2 (Ay 4-9):** STK admin tool'larını aşamalı ekle — CRM basic, email basic (transactional + receipt only), recurring billing, reporting. Embedded mode korunur.
- **Faz 3 (Ay 9-18):** Fonzip pariteyi tamamla — automation bots, custom domain, telemarketing, tam analytics. "Fonzip'ten geç" kampanyası başlar.

**Timeline:**
- V1 lansmanı: **3-4 ay** (Yol A gibi).
- Fonzip parite: **12-15 ay** (Yol B'den biraz daha uzun ama risksiz).

**Gelir modeli:** Zamanla evrilir:
- Ay 1-6: Yol A modeli (pilot ücretsiz + sonra SaaS referral mix).
- Ay 6-12: SaaS tier genişler (Starter ₺0, Growth ₺2k, Premium ₺5k) — fonzip'ten daha uygun.
- Ay 12+: Tam fonzip-parite + "ilk yıl ücretsiz" lansman kampanyası.

**Güçlü yan:**
- **Momentum korunur** — kullanıcı-yüzey Ay 4'te lansman.
- **STK öğrenme döngüsü** Faz 1'de başlar → Faz 2'deki admin tool tasarımı veri-odaklı.
- **Fonzip değiştirme maliyeti riski** aşamalı — pilot STK'lar fonzip'i terk etmek zorunda değil, embedded kullanmaya devam edebilir.
- Hukuki süreç paralel yürür — Faz 3 başlamadan tamamlanır.
- **İyiBiri'nin özgünlüğü korunur** — "Karma platform + STK araçları" vs "bir başka fonzip."

**Zayıf yan:**
- Fonzip lider konumu uzun tutar — kesin rakip olmak Yıl 2'yi bekler.
- Faz 2'de embedded mode'dan tam SaaS'a geçerken bazı STK'lar için karışıklık olabilir (migration path şart).
- "Tam SaaS" pitching gücü Faz 3'e kadar yok.

---

## 4. Trade-off Tablosu (4-yollu)

| Kriter | Yol A embedded | Yol B tam fonzip | **Yol C hibrit evrim** | Yol D fonzip ortak |
|---|---|---|---|---|
| V1 time-to-market | 3-4 ay | 9-12 ay | 3-4 ay | **1-2 ay** ⭐ |
| Dev effort | Orta (~15 hafta) | Yüksek (~40 hafta) | Yüksek dağılmış | **Minimum (~4 hafta)** ⭐ |
| Gelir Yıl 1 | Orta | Yüksek (SaaS) | Orta | Düşük (~100k TL) |
| Gelir Yıl 3 | Orta | Yüksek | **Yüksek (~1.2M+)** ⭐ | Düşük-Orta (~500k) |
| Strategik kontrol | **Tam** ⭐ | **Tam** ⭐ | **Tam** ⭐ | Düşük (fonzip bağımlı) ⚠️ |
| Partnership risk | Yok | Yok | Yok | **Fonzip reddi riski** ⚠️ |
| Pilot STK onboarding | Kolay | Zor (migration) | Kolay | **En kolay (fonzip müşterileri)** ⭐ |
| Fonzip müşterisi olmayan STK | Destekli (embed iyzico) | Destekli | Destekli | **Desteklenmiyor** ⚠️ |
| Hukuki yük | Düşük | Yüksek | Orta, yayılmış | **En düşük (fonzip'te)** ⭐ |
| Uzun vade esneklik | Yüksek | Yüksek | Yüksek | Düşük (bağımsızlaşmak = yeniden yapma) |
| İyiBiri özgünlüğü | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

---

### Yol C + Yol D birleşimi (super-önerim) ⭐⭐

**En iyi yaklaşım iki yolu birleştirmek:**

- **Faz 0 (Ay 1-2, hemen):** Fonzip ile görüşme + partnership girişimi. Kabul ederse deep link + attribution hızlı kuruluma.
- **Faz 1 (Ay 2-4):** Paralel olarak Yol C embedded hibrit altyapısı kurulur (fonzip olmayan STK'lar — TEGV, LÖSEV gibi — için iyzico Checkout Form adapter).
- **Faz 2-3 (Ay 6-18):** Yol C'nin aşamalı fonzip parite planı devam eder. Fonzip partnership devam ederken, İyiBiri bağımsız altyapıyı da büyütür.

Bu yaklaşım:
- Fonzip kabul ederse → hızlı lansman (Yol D hızı) + uzun vade bağımsızlık hazırlığı (Yol C plan)
- Fonzip reddederse → Yol C zaten devreye girmiş, kayıp minimum
- **Sıfır single-point-of-failure.**

**Bu yüzden nihai önerim: Yol C + Yol D paralel.** Buna **Yol E** diyebiliriz (hibrit partnership + bağımsız evrim).

---

## 5. Öneri — **Yol E: Yol C + Yol D paralel (revize)**

**Kullanıcının Yol D sorusu analizin derinliğini artırdı. Nihai önerim Yol C + Yol D paralel kombinasyon.**

**Neden C ve D birlikte:**
- Fonzip müşterisi olan STK'larda (TEMA, AÇEV, Haytap, Kızılay — bkz. fonzip şirket profili) Yol D hızlı lansman sağlar.
- Fonzip müşterisi olmayan STK'larda (TEGV, LÖSEV) Yol C embedded iyzico/kendi adapter devreye girer.
- İki yol paralel çalışır, İyiBiri iki taraftan da gelir alır.
- Fonzip partnership reddedilirse Yol C hazır.

---

### Eski tekil Yol C gerekçesi (hala geçerli):

**Yol C (Hibrit Evrim) ürünün ruhuna en uygun + finansal olarak en düşük risk.**

Sebepleri:
1. V1 hızlı çıkmalı — 9 ay bekleyen bir startup pazar momentum'unu kaybeder. TR'de 2024-2025 bağış/STK pazarı dijital kanala daha yeni açılıyor (TÜSEV'e göre gönüllülük %13'e çıktı).
2. İyiBiri'nin **farklılaşma noktası user-side** (Karma + gamification + cross-NGO). Bunu fonzip-parite yaparak gölgelemeyelim.
3. STK'lar fonzip'i Çok Sevmiyor genelde (fiyat + UI şikayetleri ekşi sözlük referansları) — ama switch cost yüksek. Fonzip'ten memnuniyetsiz olan küçük-orta STK'lar için İyiBiri "ilk yıl ücretsiz + migration yardımı" ile cazip.
4. BDDK/KVKK/KDV hukuki süreç paralel yürür, Faz 3 hazır olduğunda tamamlanır.
5. Faz 2'deki STK admin tool'ları, Faz 1 verisinden öğrenilerek tasarlanır — hayali değil kullanıcı-odaklı.

**Faz geçişlerinde dikkat:**
- Faz 1 → Faz 2: STK için zorunlu değil (isteyen embedded kalır, isteyen SaaS'a geçer). İkisi paralel desteklensin.
- Faz 2 → Faz 3: Fonzip'ten çekmek için "migration tool" (CSV import, kullanıcı aktarım otomasyonu) şart.

---

## 6. Gelir Modeli — Üç Yol Karşılaştırma

### Yıl 1 sonu senaryo (50 STK aktif tahmin)

| Yol | V1 çıkış | Aktif STK | Avg STK geliri | Toplam Yıl 1 |
|---|---|---|---|---|
| A (embedded) | Ay 4 | 50 | ₺400/ay × 8 ay (pilot karma fee sonrası) | **~₺160k** |
| B (tam fonzip) | Ay 10 | 20 | ₺500/ay × 3 ay | **~₺30k** (geç lansman) |
| C (hibrit) | Ay 4 | 50 | ₺400/ay × 8 ay | **~₺160k** |

Yol C + Yol A identical Yıl 1. Fark Yıl 2+:
- Yol A: aktif STK 100, avg ₺500/ay → ₺600k/yıl
- Yol C: aktif STK 150 (fonzip migrasyonu başlar), avg ₺700/ay → ₺1.26M/yıl

Yol C **Yıl 2-3'te 2x gelir** — evrim stratejisi karşılığını alıyor.

---

## 7. Açık sorular

- **Q33 🔴 (yeni):** Yol C (Hibrit Evrim) onay mı? V1 embedded hibrit, Faz 2-3 aşamalı fonzip parite.
- **Q34 🟡 (yeni):** Faz 2 STK admin tool'ları kapsamı (CRM basic mi, orta mı, tam mı) — Faz 1 pilot verisi sonrası karar.
- **Q35 🟡 (yeni):** Fonzip migration tool (CSV import + data mapping) Yıl 2'de aday workstream.

## 8. Sonraki adımlar (onaylanırsa)

- ADR-008 v2 + bu memo birlikte referans olarak WS-02 + WS-03'ü besler.
- Yol C seçilince **ADR-009 "Aşamalı Fonzip Parite Strategisi" açılır** — faz tanımı + timeline + milestones.
- Ay 4'te V1 lansman planı fazla değişmez (embedded hibrit); Ay 6'da Faz 2 STK admin tool planı başlar.
- Fonzip'e karşı **konumlandırma dokümanı** content-tr-voice agent'ı (Faz 4) tarafından yazılır — "İyiBiri neden fonzip'ten farklı" kullanıcı-yüzü + STK-yüzü mesaj seti.

## 9. Referanslar

- Kullanıcı ekran görüntüsü (fonzip Türkiye pricing) + `https://fonzip.com/tr/ucretlendirme`
- Araştırma: [fonzip.com/en](https://fonzip.com/en) + feature sayfaları (CRM, donation forms, automation bots, recurring payments)
- Strateji: `docs/strategy/03-revenue/2026-04-23-gelir-modeli-potansiyelleri.md`
- ADR-008 v2: `docs/product/03-decisions/008-payment-routing-pass-through.md`
