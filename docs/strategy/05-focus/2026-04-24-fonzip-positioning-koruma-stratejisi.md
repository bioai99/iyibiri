# Fonzip Görüşmesinde Fikri / Pozisyonu Koruma Stratejisi

**Tarih:** 2026-04-24
**Yazar:** strategy-consultant / product-analyst ortak
**Bağlam:** Kullanıcı kritik endişe dile getirdi: "Fonzip'e partnership teklif ederek bu fikri yapma hissi uyandırır mıyım? Onların konumu iyi biri yapmak için çok daha avantajlı. Kendimi nasıl korurum?" Bu memo: risk analizi + somut koruma katmanları + müzakere taktik + Yol D'yi iki alt-yola ayırma.

---

## Yönetim Özeti

**Kullanıcının endişesi doğru. Fonzip 10 yıllık STK ağı, oturmuş ödeme altyapısı, güvenilir marka ile İyiBiri'nin ürün vizyonunu yapmaya teoride İyiBiri'den daha avantajlı pozisyonda.** Çözüm: **Yol D'yi iki ayrı alt-yola ayırmak:**

- **Yol D.1 — Formal Partnership (riskli):** Fonzip'le imzalı anlaşma, ürün vizyonunu kısmen paylaşma, referral commission. Hem ifşa hem bağımlılık riski.
- **Yol D.2 — Silent Technical Integration (güvenli):** Fonzip'in **zaten public** embed altyapısını kullanma; STK ile ayrı ticari ilişki; fonzip'e hiç gitmeme. Kontrol tamamen İyiBiri'de.

**Öneri:** **Yol D.2 ile başla, Yol D.1'e sadece volume kanıtlandıktan sonra git.** Fonzip görüşmesi kaçınılmaz değil — STK'lar zaten fonzip müşterisi olsa bile, İyiBiri STK ile ikili anlaşma yapabilir.

Üç kritik koruma katmanı:
1. **Hukuki moat:** Trademark "İyiBiri" + spesifik terimler, mutual NDA sadece gerektiğinde.
2. **Hız moat:** Görüşme öncesi kanıtlanmış traction (1000+ user + 2-3 sponsor marka + 3 STK aktif).
3. **Ürün moat:** Fonzip'in taklit etmesi yıllar alacak alanlar — sponsor marka ağı, mobile native, user community, Karma ekonomisi.

---

## 1. Risk analizi — fonzip ne kadar tehlikeli?

### Fonzip'in teoride İyiBiri'yi yapma kapasitesi

| Yetenek | Fonzip'te var mı? | İyiBiri yaparsa süre |
|---|---|---|
| STK ağı (TEMA, Kızılay, AKUT…) | ✅ 10 yıllık | İyiBiri 3+ yıl |
| Ödeme altyapısı + makbuz + KDV/KVKK | ✅ Oturmuş | İyiBiri 6-9 ay |
| NGO CRM + admin tools | ✅ Olgun | İyiBiri 6+ ay |
| Mobile-first user app | ❌ Yok | İyiBiri **zaten var** |
| Gamification (Karma, seri, seviye) | ❌ Yok | İyiBiri **zaten var** |
| Sponsor marka ağı | ❌ Yok | İyiBiri inşa ediyor |
| User community + brand equity | ❌ Yok | İyiBiri inşa ediyor |
| B2C UX / marketing DNA | ❌ Yok (B2B uzmanı) | Fonzip için 1-2 yıl |
| Gen Z cultural resonance | ❌ Yok | Fonzip için sektörel switch |

**Fonzip'in İyiBiri'yi yapması 12-18 ay tedbirli tahmin.** Ama İyiBiri'nin fonzip yapması 9-12 ay (önceki memo).

**Paradoks:** İki yön de zor. Fonzip B2C tarafına girmek zorunda; İyiBiri B2B STK tarafını derinleştirmek zorunda. Mevcut konumları gereği **her iki yönde de birbirine karşı büyüyecekler.**

### "Fikri Pompalama" Riski Gerçek mi?

**Kısmen evet:**
- Fonzip kendi pazarına doymuş — büyüme için B2C tarafını düşünüyor olabilir (hazır düşündüğü bir yön).
- İyiBiri ile görüşme "B2C + gamification'ın mümkün olduğu" hissi uyandırabilir.
- Ama fonzip'in B2C yapması için Gen Z + mobile + user acquisition + brand building yatırımı gerek — bu fonzip'in DNA'sı değil.

**Kısmen hayır:**
- Fonzip 10 yıl B2B yaptı — odaktan ayrılmak yatırımcı riski.
- 2-10 kişilik ekip B2C için fazla küçük.
- "İyiBiri yapabilir, biz yapamayız" Fonzip'in algısı olabilir.

**Risk seviyesi:** Orta. Ama önleyebilir seviyede.

---

## 2. Yol D'yi İki Alt-Yol Olarak Ayırmak

### Yol D.1 — Formal Partnership (ifşa riski yüksek)

**Tanım:** Emre Danacı ile toplantı → partnership anlaşması → referral commission → ortak pazarlama.

**Ne paylaşılır (kaçınılmaz):**
- İyiBiri'nin var olduğu gerçeği.
- Kullanıcı tabanı ölçeği.
- Kullanıcı edinme stratejisi (marketing channel olarak İyiBiri).
- Entegrasyon gereksinimleri (deep link, attribution, callback).
- Referral commission oranı müzakeresi.

**Ne saklanmalı ama zor:**
- Sponsor marka ağı detayları.
- Roadmap (Yıl 2-3 fonzip parite planı).
- Karma ekonomi spesifikleri (tier, fiyatlandırma, bonus).
- User cohort davranış verisi.
- Büyüme planı.

**Risk:** Paylaşılan bilgi fonzip'in roadmap'ini etkiler. "Biz de B2C'ye genişleyelim" tetikleyici olabilir.

### Yol D.2 — Silent Technical Integration (güvenli) 🆕

**Tanım:** Fonzip'in zaten public embed altyapısını kullanma — **fonzip ile hiç konuşmadan.**

**Nasıl çalışır:**
1. STK (örn. TEMA) İyiBiri ile ayrı ticari anlaşma imzalar (pilot ücretsiz, sonra SaaS+referral).
2. STK'nın fonzip sayfası zaten public (`fonzip.com/tema/bagis`). Fonzip'in embed dokümanı (help.fonzip.com) STK'ların kendi bağış sayfasını başka sitelere embed etmesini destekliyor.
3. İyiBiri, STK'nın fonzip bağış sayfasını **STK'nın izniyle** İyiBiri içinde iframe ile embed eder.
4. Fonzip teknik olarak çalışır (ödeme, makbuz); arka planda fonzip STK'dan kendi %1.5'ini alır.
5. İyiBiri, STK'dan **kendi SaaS fee + referral fee**'sini ayrı alır — fonzip bunu görmez.
6. Fonzip hiç konuşulmaz. Fonzip'in bilgisi olmaz ki rahatsız olsun.

**Ne paylaşılır:**
- STK ile konuşuyorsun, fonzip ile değil.
- STK İyiBiri'den haberdar — zaten olması gereken.
- Fonzip sadece teknik altyapı (embed target).

**Ne saklanır:**
- Partnership pitch yok — ürün vizyonu, roadmap, sponsor ağı hiç paylaşılmaz.
- Fonzip İyiBiri'yi "channel" veya "tehdit" olarak görecek konuma gelmez.
- İyiBiri'nin tüm özgün değeri (gamification, Karma, sponsor) fonzip'e hiç söylenmez.

**Yasal durum:**
- Fonzip User Agreement'ı kontrol edilmeli (ben erişemedim — egress blocked). Eğer "3. taraf embed kullanımı" yasaklanmamışsa (muhtemelen değil — fonzip zaten STK'lara public embed özelliği sunuyor), bu yol yasal.
- STK İyiBiri'ye izin veriyor, fonzip STK'ya izin vermiş → zincir tamam.

**Risk:**
- Fonzip eğer sonradan ToS'a "3. taraf embed yasak" maddesi eklerse yol kapanabilir.
- Fonzip attribution görmesi zor — STK'nın yılda %X bağışının İyiBiri'den geldiğini anlaması için ekstra analiz gerekir; muhtemelen fark etmez uzun süre.
- Moral risk: bazı etik sorgulama ("fonzip'in altyapısını onların izin olmadan kullanmak") — ama **STK'nın altyapısını STK'nın izin ile kullanıyoruz** (fonzip STK'nın servis sağlayıcısı).

**Kilit avantaj:** Kontrol tamamen İyiBiri'de. Fonzip görünmez tutulur.

---

## 3. Kontrol Karşılaştırması

| Faktör | Yol D.1 Partnership | Yol D.2 Silent Technical |
|---|---|---|
| Fonzip'e görünürlük | Yüksek (stratejik ortak) | **Sıfır** ⭐ |
| Fikri paylaşma riski | Orta-yüksek | **Sıfır** ⭐ |
| Fonzip rekabet tetikleme | Olası | **Olası değil** ⭐ |
| Gelir kontrolü | Fonzip-bağımlı (%0.5) | **Kendi kontrolümüz** (STK'dan fee) ⭐ |
| Lansman hızı | 2-3 ay | **1-2 ay** ⭐ |
| Hukuki karmaşa | Partnership sözleşme | STK kontrat standart |
| Bağımlılık | Fonzip | Sadece STK |
| Yıl 3 bağımsızlaşma | Zor (moral + ilişki) | Kolay |

**Yol D.2 baskın kazanç.** Yol D.1 sadece gerçekten gerekli olduğunda düşünülür.

---

## 4. "Ne Paylaşılır / Ne Saklanır" Risk Matrisi (Yol D.1 gerekliyse)

Eğer formal partnership gerekli olursa, görüşmede:

### Paylaş (rahat)
- İyiBiri varlığı ve konsepti (zaten public ürün olacak).
- Entegrasyon isteği (deep link + attribution).
- Referral commission müzakeresi.
- Kullanıcı ölçeği (public PR için zaten söylenecek).

### Dikkatli paylaş (yüksek seviye, detay değil)
- "Gamification yapıyoruz" — ama Karma ekonomi spesifik formul **paylaşma.**
- "Sponsor marka'larla çalışıyoruz" — ama liste **paylaşma.**
- "Mobile-first'iz" — ama tech stack detay **paylaşma.**

### Hiç paylaşma (tehlike)
- Product roadmap (özellikle Yıl 2-3 fonzip-parite planı — bu en kritik!).
- Sponsor marka anlaşmaları (Migros/Garanti vb.).
- Karma ekonomi tasarım detayları (base × skill × impact formülü).
- Cohort data ve retention curve.
- Fiyat stratejisi uzun vade.
- Faz 2-3 STK admin tool planı (bu doğrudan fonzip ürününün üstüne çıkar).

**Kural:** Görüşmeye PM veya ürün detayını bilen gitme. Sadece **entegrasyon + ticari** konuş. Mühendislik veya ürün detayı sorularsa "bu seviyede karar noktasında değiliz, sonraki turda konuşalım" de.

---

## 5. Hukuki Katmanlar (eğer Yol D.1'e geçilecekse)

### Zorunlu adımlar — partnership görüşmesinden ÖNCE

1. **Trademark — "İyiBiri" markası.**
   - Türk Patent ve Marka Kurumu'nda başvuru.
   - Nice sınıfları: 9 (mobile app), 35 (online services), 36 (donation services), 42 (SaaS).
   - 3-6 ay süreç, yaklaşık ₺3-5k maliyet.
   - **Görüşmeden önce başvurulmalı** (markayı korumak + "tescil ettik" kartı).

2. **Mutual NDA — Non-Disclosure Agreement.**
   - **Her iki tarafı bağlar** — sadece fonzip İyiBiri'yi değil, İyiBiri de fonzip bilgisini koruyacak.
   - 24-ay süre.
   - Confidential information tanımı dar tutulur (roadmap, customer list, fiyatlandırma, tasarım).
   - **Non-compete clause eklenebilir:** "Bu görüşmeden 12 ay içinde fonzip gamified+user-side ürün piyasaya süremez." (agresif, fonzip kabul etmeyebilir — ama denemek değerli).
   - Template Türkiye hukukuna uygun — avukat şablonu.
   - **Görüşmenin BAŞINDA imzalanır.** Hiç NDA yok derse geri çekil; "bize bu konuda rahat değiliz" de.

3. **Patent araştırması.**
   - "Gamified charity platform with sponsor brand rewards" — benzeri var mı?
   - US ve TR patent araması (PatentScope, Turkpatent).
   - Özgün element varsa (spesifik algoritma, Karma formülü, tier interaction) patent başvurusu düşünülebilir.
   - Genelde yazılım patenti TR'de zor, ABD'de mümkün. Danışman görüşü gerek.
   - Budget: patent başvurusu ₺20-50k + avukat. Pilot traction sonrası düşünülebilir.

4. **Confidentiality in Communications.**
   - Email imzasında "BU E-POSTA VE EKLERİ GİZLİDİR" vb. standart.
   - Güvenli paylaşım araçları (Notion shared with specific person, password-protected PDF).
   - Hiç Slack genel kanala yazılmaz.

### Önlemler — görüşme anında

5. **Meeting format:**
   - Yüz yüze (İstanbul) veya 1-1 video (Zoom recording disable).
   - Ses kayıt yok (varsa ikisi de bilir).
   - Notlar sen alırsın — fonzip senin notlarını almaz.
   - Whiteboard/ekran paylaşımı — minimal slayt.

6. **"Anahtar bilgi" filtresi:**
   - Her cümle kurmadan önce: "Bu bilgi fonzip yarın ürününe koyabilir mi?" Evet ise söyleme.

---

## 6. İyiBiri'nin Özgün Moat Katmanları (fonzip'in kolayca kopyalayamayacağı)

Paranoyak olma — İyiBiri'nin gerçek moat'ları var. Bunları bilmek güven verir.

### Moat 1 — User Acquisition & Brand DNA
Fonzip 10 yıldır B2B sattı — B2C Gen Z kullanıcıyla konuşma kası yok. İyiBiri doğuştan B2C. Bu switch Fonzip için 1-2 yıl kültürel dönüşüm demek.

### Moat 2 — Sponsor Marka Ağı
Fonzip'in marka anlaşması yok. İyiBiri Starbucks/Migros/Garanti gibi markalarla anlaşma yaparsa, fonzip'in benzerini kurması ayrı bir kas. Sales + biz dev tamamen farklı. Bu moat **tek tek anlaşma imzalayarak inşa edilir** — fonzip'in kısa vadede taklit edemediği.

### Moat 3 — Karma Ekonomisi Tasarım Sermayesi
Karma formül + tier × skill × impact mimari + seri mekaniği — fonzip bunu tasarlamaya başlasa bile 6-12 ay tasarım + test gerek. İyiBiri zaten çalışan versiyonu ile öne geçer.

### Moat 4 — Mobile-Native Deneyim
Capacitor iOS/Android + PWA + push bildirim + offline-first — fonzip bunu yapması teknik değişim demek. Ekip 2-10 → mobile kası minimal.

### Moat 5 — Cross-STK Discovery Engine
İyiBiri'nin keşif algoritması (kullanıcı × STK eşleşmesi, Karma ekonomisi ile optimize) — fonzip'te tamamen yok (onların iş model STK-merkezli, kullanıcı-gözü yok).

### Moat 6 — Velocity Advantage
İyiBiri daha genç, daha hızlı iterate edebilir. Fonzip 10 yıllık müşteri tabanını kırmadan ürün değiştiremez (legacy kod + risk). İyiBiri greenfield.

**Bu 6 moat birleşince fonzip'in "aynısını yapayım" dönüşümü 18-24 ay demek. İyiBiri bu süre içinde 5-10x büyüyebilir.** Yol D.2 ile paralel olarak sponsor marka + user base inşası İyiBiri'yi taklit edilemez kılar.

---

## 7. Pratik Eylem Planı (revize)

### Hafta 1-2 (Hemen)
- [ ] Trademark başvurusu — "İyiBiri" + "Karma ekonomi" varyantları.
- [ ] Fonzip User Agreement okuma (kullanıcı veya avukat) — 3. taraf embed yasak mı kontrol.
- [ ] İlk STK temasına hazırlık — TEMA ile ayrı anlaşma önerimi hazırla (fonzip'ten söz etmeden).

### Hafta 3-6 (Yol D.2 pilot)
- [ ] TEMA ile anlaşma — "Bizim platformdan gelen bağışlar senin fonzip sayfanda akar, biz sizden ayrı SaaS+referral fee alırız" pitch.
- [ ] Technical integration — TEMA fonzip widget'ı İyiBiri'de embed.
- [ ] Pilot: ilk 100 bağış, attribution test.

### Ay 2-3 (Momentum)
- [ ] Başarı → 2-3 STK daha (AÇEV, Haytap — hepsi fonzip müşterisi).
- [ ] Sponsor marka anlaşmaları paralel (Moat 2 inşa).
- [ ] Kullanıcı traction — ilk 1000 Karma kazanan kullanıcı.

### Ay 4+ (Yol D.1 opsiyonu)
- Yol D.2 gücü kanıtlandı → Yol D.1 (formal partnership) fonzip'e teklif edilebilir **güç pozisyonundan:** "Zaten X STK üzerinden akıyor, formalleştirelim, daha büyük ölçek için anlaşalım."
- Bu pozisyon fikri pompalama riski yok — çünkü fikir zaten canlı.
- NDA + trademark + moat inşaatı — görüşmeden önce tamamı hazır.

### Ay 6+ (Alternatif: fonzip'siz devam)
- Yol D.2 + Yol C embedded hibrit ile 6 ay sonra fonzip'e ihtiyaç ortadan kalkabilir.
- Kendi altyapı (iyzico Marketplace veya native) olgunlaştığında STK'ları İyiBiri'nin altına migrasyonu teklif ediliyor.
- Partnership hiç yapılmayabilir.

---

## 8. Sonuç ve Öneriler

1. **Kullanıcının endişesi gerçek — fonzip'e partnership teklif etmek "fikri pompalama" riski taşır.**
2. **Çözüm: Yol D.1 (partnership) yerine Yol D.2 (silent technical integration) ile başla.** Fonzip ile hiç konuşmadan, STK ile doğrudan anlaş, fonzip'in public altyapısını kullan.
3. **Yol D.2 + Yol C paralel** — her ikisi de bağımsız. Tek başına ikisi de tamam.
4. **Yol D.1 sadece Ay 4+ güç pozisyonundan** düşünülür, zayıf pozisyondan başvuran gibi değil.
5. **Hukuki adımlar şimdiden başlatılır:** trademark + fonzip ToS check + mutual NDA hazırlığı (kullanılmayabilir ama hazır olsun).
6. **İyiBiri'nin 6 moat'ı** gerçek. Paranoyak olma, ama sezgisel olarak da savunma.
7. **STK görüşmelerinde "fonzip ile rakip misin" sorgulaması gelirse:** "Hayır, biz kullanıcı tarafıyız, fonzip STK altyapınızın devamı. Biz yeni bağışçı hacmi getiriyoruz, onlar işi işleyecek — tamamlayıcı roller."

---

## 9. Açık Sorular

- **Q37 🟡 (yeni):** Fonzip User Agreement embed 3. taraf kısıtı — avukat okuma gerekiyor.
- **Q38 🟡 (yeni):** Trademark başvurusu bu ay mı gelecek ay mı — budget + zaman planlaması.
- **Q39 🟢 (yeni):** Mutual NDA template hazırlama — partnership olasılığında hazır olsun.
- **Q40 🔴 (revize Q33):** Yol E (C + D.1 + D.2) birleşimi — D.2 primary, C paralel, D.1 ay 4+ opsiyonel.

## Revize Öneri — Yol F (nihai)

Önceki Yol E (C + D) → güncellendi: **Yol F = Yol C + Yol D.2 paralel; Yol D.1 sadece güç pozisyonundan sonra**.

- **Faz 0 (şimdi):** Trademark + fonzip ToS check + STK temasına hazırlık.
- **Faz 1 (Ay 1-3):** Yol D.2 ile TEMA pilot + Yol C embedded iyzico adapter (TEGV, LÖSEV için).
- **Faz 2 (Ay 3-6):** 5-10 STK aktif, 2-3 sponsor marka, 2000+ user.
- **Faz 3 (Ay 6-12):** Yol D.1 (formal fonzip partnership) opsiyonu — güç pozisyonundan.
- **Faz 4 (Yıl 2):** Fonzip parite tam + fonzip-independent altyapı.

---

## 10. Referanslar

- Fonzip company profili: `docs/strategy/02-competitors/2026-04-24-fonzip-sirket-profili.md`
- NDA best practice: Capbase + Stripe + Alejandro Cremades — startup NDA ilkeleri
- Moat tasarımı: ADR-008 v2 + ADR-007 zaten moat temeli
- Trademark TR: Türk Patent ve Marka Kurumu (turkpatent.gov.tr) — başvuru süreci
