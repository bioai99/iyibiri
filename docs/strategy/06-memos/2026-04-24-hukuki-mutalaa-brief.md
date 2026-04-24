# Hukuki Mütalaa Brief — İyiBiri Platformu

**Gönderen:** Bahadır Oylumlu, Kurucu — İyiBiri
**Tarih:** 2026-04-24
**Amaç:** 1 saatlik mütalaa görüşmesi için **4 spesifik soru + bağlam**
**Talep:** Yazılı görüş değil, öncelikli **sözlü değerlendirme** (görüşme sonrası 1-2 sayfalık özet yazılı de alabilirim).
**Hedeflenen görüşme süresi:** 60 dakika

---

## 1. İyiBiri'yi 30 Saniyede Anlama

İyiBiri, **Türkiye'deki Gen Z kullanıcıların STK'larla gerçek dünya gönüllülük faaliyetlerine katılmasını sağlayan bir mobil uygulamadır** (PWA + iOS/Android). Kullanıcı uygulamada:

1. STK'ya **gönüllü olur** (ör. TEMA üyelik — yıllık sembolik ücret ₺15-256; bazı STK'lar donation-based)
2. O STK'nın yayınladığı görevlere **katılır** (fidan dikimi, kan bağışı, okuma atölyesi)
3. Görev tamamladığında **Karma puanı** kazanır
4. Karma'yı sponsor markalardan **gerçek ödüllere** dönüştürür (Starbucks, Migros vb.)

**Para akışı 3 farklı modelle çalışır** (STK'ya göre değişir):
- **Marketplace (iyzico sub-merchant):** Kullanıcı İyiBiri üzerinden öder, iyzico parayı ayırıp STK'ya transfer eder. İyiBiri aracı.
- **Embedded (STK'nın kendi processor'ı — ör. fonzip):** Kullanıcı İyiBiri'de iframe'de STK'nın ödeme sayfasını görür, para doğrudan STK'ya gider, İyiBiri yalnızca teknik aracı (DOKUNMAZ).
- **Passthrough:** Kullanıcı İyiBiri'den STK sitesine yönlendirilir, İyiBiri sonucu sadece dinler (webhook/attribution).

**Pilot:** Mayıs 2026, İstanbul, 3-5 STK (TEMA, TEGV, LÖSEV, HAYTAP, Kodluyoruz).

**Gelir modeli:** Primary = **sponsor marka CSR ücreti**. Secondary = platform fee (STK'dan, opt-in). Tersiary = iyzico Marketplace processing margin.

---

## 2. Hukuki Bağlam — Bu 4 Soruyu Neden Soruyoruz

- **BDDK 6493 sayılı Kanun** — Ödeme ve Menkul Kıymet Mutabakat Sistemleri, Ödeme Hizmetleri ve Elektronik Para Kuruluşları Hakkında Kanun. Ödeme aracılığı muafiyeti kapsamında miyiz?
- **KVKK 6698** — Kişisel verilerin STK ile paylaşımı rejimi.
- **Tüketici Kanunu 6502** — Mesafeli sözleşmelerde 14 gün cayma. Bağış "tüketici işlemi" sayılır mı?
- **GVK m.89/4, KVK m.10/1-c** — Bağış makbuzu + vergi indirimi. Makbuz sorumluluğu kimde?
- **fonzip Kullanıcı Sözleşmesi** — 3. taraf embed kullanım kısıtları (fonzip'in izni olmadan onların public embed URL'lerini iframe ile platformumuzda kullanıyoruz).

---

## 3. Soru 1 — Bağış Aracılığı BDDK / KDV Çerçevesi

**Kod adı:** Q10

### Bağlam

ADR-008 (Payment Routing) altında **3 mod** tanımlı:

| Mod | Para akışı | İyiBiri rolü |
|---|---|---|
| **Embedded** (fonzip kullanan STK'lar — TEMA) | User → fonzip → STK | **Pasif teknik aracı** — biz hiç para tutmuyoruz |
| **Passthrough** (Kızılay gibi) | User → STK'nın sitesi | **Yönlendirici** — sadece tracking attribution |
| **Marketplace** (fonzip-dışı STK'lar — TEGV, LÖSEV) | User → iyzico → STK (iyzico transfer) | **İyiBiri sub-merchant iyzico altında** — dolaylı aracı |

### Özel soru

- **Embedded + Passthrough modları için:** Biz hiçbir şekilde kullanıcının parasını elimize almıyoruz — sadece iframe yerleştiriyoruz veya yönlendiriyoruz. Bu "aracı" sayılır mı BDDK 6493 kapsamında? Sanırım hayır (ödeme işlemi yoktur).
- **Marketplace modu için:** İyzico sub-merchant olarak bağış tahsilat yapıyoruz. BDDK'nın "aggregator muafiyeti" bizi kapsıyor mu? Yoksa ödeme kuruluşu lisansı mı gerek?
- **Her üç mod için:** Bağışçıya kesilen **makbuzun KDV muhatabı kim?** İyiBiri mi STK mı?

### Önerilen pozisyon (onayınız bekleniyor)

- **Embedded + Passthrough → BDDK kapsamında değil** (para aracılığımız yok)
- **Marketplace → aggregator muafiyeti yeterli, lisans gereksiz** (iyzico lisanslı, biz onun müşterisiyiz)
- **KDV → STK muhatabı** (para onun hesabına giriyor, biz servis faturası keser STK'dan platform fee alır)

### Risk toleransı

**V1 lansmanda Marketplace modunu kullanmayabiliriz** (Q10 netleşene kadar ertelenebilir). Embedded + Passthrough ile lansmanı yaparız. Bu sürecin iddialı sonuçlanması 2-3 hafta bekleyebilir mi?

---

## 4. Soru 2 — KVKK: Kişisel veri STK ile paylaşım rejimi

**Kod adı:** Q11 + kısmen Q13

### Bağlam

Kullanıcı İyiBiri'de 2 farklı durumda kişisel verisini STK ile paylaşıyor:

**A) Üyelik (ngo_memberships):** Paralı üyelik yapıyor — ad + e-posta + şehir + TEMA gibi STK özel formları (TC kimlik, telefon vs). Bu "sürekli ilişki" niteliğinde.

**B) Görev katılımı (user_missions):** Tek seferlik bir göreve katılıyor (ör. sahil temizliği) — ad + e-posta + şehir paylaşılıyor. Paralı üyelik yok.

**V1 iki farklı KVKK onay mekanizması planladık:**

- **(A) için:** "Çifte onay" + 14 gün cayma + üyelik sözleşmesi + aydınlatma metni + STK-spesifik PDF doküman (sistemde upload edilen) → tam kapsamlı akış
- **(B) için:** Tek satır inline metin — *"Bu göreve katıldığında ad, e-posta ve şehir bilgin [STK adı] ile paylaşılacak. [Detaylı metin ↗]"* + 1 checkbox → hafif akış

### Özel soru

- **(B) hafif KVKK onayı yeterli mi, yoksa (A)'daki tam aydınlatma şart mı?** Hukuki görüşüm: tek seferlik + gerekli minimum veri (ad, e-posta, şehir) = açık rıza yeterli. **Onay bekliyorum.**
- **STK'nın kullanıcı verilerini kendi sistemine (CRM, excel dosyası, vb.) kaydetmesi** durumunda, veri sorumlusu kim — İyiBiri mi STK mi? Ortak veri sorumlusu mu?
- **Kullanıcı "verimi sil" talep ederse** (KVKK m.11 hak), hem İyiBiri hem STK'nın ayrı ayrı silmesi mi, yoksa İyiBiri bir "forward to STK" zinciri mi?

### Önerilen pozisyon

- **(B) hafif onay yeterli** — 1 checkbox + inline text + detay PDF link. Kayıt olmadan bu çerçeveyi kullanacağız.
- **Ortak veri sorumlusu** kabul edilirse, STK ile bir **"Veri Paylaşım Sözleşmesi"** imzalarız — her pilot STK için standart şablon.
- **Silme talebi** her iki tarafa: İyiBiri sisteminden siler (hemen), STK'ya bildirir (manual çözüm). V2'de otomatik API.

---

## 5. Soru 3 — Bağışta 14 Gün Cayma Hakkı

**Kod adı:** Q13

### Bağlam

Tüketici Kanunu 6502 m.48 mesafeli sözleşmelerde 14 gün cayma hakkı tanıyor. Bir STK'ya **yıllık üyelik ücreti** ödenmesi bu kapsamda mı? Ya da bir **bağış**?

### Özel soru

- **Paralı üyelik** (yıllık ₺256 TEMA gibi): Tüketici işlemi gibi görünüyor, 14 gün cayma hakkı tanımalı mıyız?
- **Bağış** (LÖSEV gibi miktar belirlenmemiş bağış): "Tüketici işlemi" değil — bağış. Cayma hakkı yok, bağış geri alınmaz. **Ama** KVKK rızası (data) geri alınabilir?

### Önerilen pozisyon

- **Paralı üyelik için 14 gün cayma hakkı tanı** (yasal zorunluluğu aşsan bile güvenli yol + kullanıcı güveni).
- **Bağış için cayma hakkı tanıma** — bağış iade gelenekseldir, istisnai.
- **KVKK rızası geri alma** her iki durumda da her zaman mümkün (KVKK m.7).

### Mevcut UI

Membership flow'da **CaymaBanner** component'i var — "14 gün cayma hakkı" metnini gösteriyor. Paralı üyelikte bu aktif, bağış-based üyelikte gizlenmeli. Onayladığınızda buna göre ayarlarız.

---

## 6. Soru 4 — fonzip User Agreement 3. Taraf Embed Kısıtı

**Kod adı:** Q37

### Bağlam

Bazı pilot STK'larımız (TEMA) bağışlarını **fonzip** aracılığıyla topluyor. Fonzip'in kullanıcıya açtığı public URL'ler (örn. `fonzip.com/tema/bagis`) mevcut.

**Biz ne yapıyoruz:**
- İyiBiri uygulaması içinde bir **iframe** içinde bu public URL'i açıyoruz
- Kullanıcı fonzip'in kendi ödeme formu ile bağış/üyelik yapıyor
- Para doğrudan STK'ya gidiyor (bize uğramıyor)
- Biz sadece "arka planda bir iframe" olarak pozisyonlanıyoruz
- fonzip ile doğrudan bir sözleşme yapmıyoruz

**Stratejik bağlam (önemli):** fonzip bizi rakip olarak görebilir — doğrudan partnership konuşması yapmak fikri ifşa edebilir. Bu yüzden "silent technical integration" yolunu seçtik. Ama fonzip ToS'u bunu yasaklıyor olabilir.

### Özel soru

- **fonzip Kullanıcı Sözleşmesi** bir 3. tarafın (İyiBiri) fonzip public URL'lerini iframe ile embed etmesini yasaklıyor mu?
- Eğer yasaklıyorsa — **STK'nın explicit onayı** (TEMA resmi olarak "İyiBiri platformunda embed olabilir" dediğinde) bu riski kaldırır mı?
- Eğer ToS açıkça yasaklamıyorsa — **risk tahmini ne?** fonzip bir "cease and desist" çekerse ne gibi sonuçları olabilir?

### Ekler (görüşmeden önce paylaşacağım)

- fonzip kullanıcı sözleşmesi PDF (halka açık, fonzip.com sitesinden indirilir)
- Mevcut iframe entegrasyonu — kod snippet'ı: `components/membership/payment-embed.tsx`
- Migration 010 (payment_routing.sql) — veri modelinde fonzip için `embed_config` jsonb'si var

### Önerilen pozisyon (doğrulanmayı bekleyen)

- ToS'ta açık yasak yoksa → devam ediyoruz (düşük risk)
- ToS yasaklarsa → **STK'dan explicit onay al** ("TEMA olarak İyiBiri'de embed olmamıza onay veriyoruz" — bir e-posta yeterli olmalı)
- fonzip'ten cease & desist riski: teknik olarak iframe'i kapatırız, D.2 yolundan C yoluna (kendi payment processor'ı) geçeriz. Ürün kırılmaz, geçiş süresi 1-2 hafta.

---

## 7. Öncelik Sırası (1 Saatlik Görüşme İçin)

Eğer tüm 4 soruya yanıt veremezseniz, öncelik:

1. **Soru 4 (fonzip ToS)** — 10 dakika. Bu cevap pilot başlatma kararını etkiler. Yasaklıyorsa D.2 yolunu terk ederiz.
2. **Soru 2 (KVKK)** — 20 dakika. Hafif onay yeterli mi sorusu, UI akışını etkiler.
3. **Soru 3 (cayma hakkı)** — 10 dakika. Mevcut UI zaten doğru yönde, netleştirilecek detay var.
4. **Soru 1 (BDDK/KDV)** — 20 dakika. Yalnızca Marketplace modu etkilenir; V1'de bu modu kullanmayabiliriz.

**Toplam:** 60 dakika.

---

## 7b. Bonus Talep — Mutual NDA Şablonu (Q39)

Görüşmeye ek olarak, **partnership ve sponsor marka görüşmelerinde kullanabileceğim tek yönlü veya karşılıklı gizlilik sözleşmesi (NDA) şablonu** hazırlanmasını istiyorum.

**Bağlam:** TEMA/LÖSEV gibi STK'larla pilot görüşmeleri başladığında ticari veriler (iyzico rakamları, sponsor marka ilişkileri, yol haritamız) paylaşılacak. Standart bir mutual NDA şablonu hazırda olması güven veriyor.

**İhtiyaç:**
- 1-2 sayfalık, Türkçe
- Karşılıklı ve tek yönlü versiyonlar (duruma göre seçerim)
- 2 yıl gizlilik süresi makul
- Anlaşmazlık durumunda İstanbul mahkemeleri yetkili

**Maliyet beklentim:** ₺500-1500. Ayrı iş olabilir veya hukuki mütalaa fiyatının içine dahil edilebilir.

---

## 8. Görüşme Sonrası Eylemler

Cevaplarınızdan sonra:

- **Q10:** ADR-008 revizyonu → Marketplace modu V1'de aktif mi değil mi karar
- **Q11:** ADR-009 yazımı → KVKK çifte onay + hafif onay + veri sorumlusu sözleşme şablonu
- **Q13:** CaymaBanner component'i parametric hale gelir (paralı için göster, bağış için gizle)
- **Q37:** fonzip ToS'a göre Yol E konfirme veya revize

---

## 9. Ücret Yapısı + Format

Ücretinizin belirlemesi için:
- 1 saatlik sözlü mütalaa — X TL
- İsteğe bağlı 1-2 sayfalık yazılı özet — +Y TL
- Takip soruları için e-posta saat hesabı — Z TL/saat

Hangi format olursa olsun, en geç 2 hafta içinde cevaplara ihtiyacım var (pilot Mayıs ayı ortasında başlayacak).

---

## İletişim

**Bahadır Oylumlu**
📧 bahadiroylumluu@gmail.com
🌐 iyibiri.app (yakında)

---

## Ekler (ayrı dosyalar)

Görüşmeden önce talep edildiğinde gönderilecekler:

- **Ek A:** ADR-008 (Payment Routing 3-modlu) — `docs/product/03-decisions/008-payment-routing-pass-through.md`
- **Ek B:** Stratejik sentez (iş modeli derinleştirmesi) — `docs/strategy/06-memos/2026-04-23-stratejik-manzara-sentez.md`
- **Ek C:** KVKK component kodu (çifte onay akışı) — `components/membership/kvkk-checkbox.tsx`
- **Ek D:** fonzip ToS PDF (public, fonzip.com)
- **Ek E:** Migration 010 payment_routing.sql — schema + seed
