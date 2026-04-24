# Fikri Koruma Stratejisi — İyiBiri

**Tarih:** 2026-04-24
**Owner:** strategy-consultant
**Aktarım:** Bahadır'ın Q43 talebi — "Fikri patentini de almak isterim rekabeti minimize etmek için" üzerine yazılan açıklayıcı memo

## Özet (1 paragraf)

Türkiye'de (ve hemen hiçbir ülkede) **iş modeli patenti yok**. SMK m.82 açıkça "bilgisayar programları" ve "iş yapma yöntemleri"ni patent kapsamı dışında bırakıyor. İyiBiri'nin "kullanıcı iyilik yapar, Karma kazanır, sponsor markadan ödül alır" fikri bir iş modeli — patentlenemez. Ancak fikri korumanın **4 gerçek yolu** vardır: trademark, copyright, trade secret ve ürün moat'ı. Bunların toplamı, herhangi bir patent ofisinin vereceği korumadan **daha güçlü** ve zamanla derinleşir. Bu memo, İyiBiri için uygulanacak 4 katmanlı fikri koruma planını ve tahmini maliyetlerini/takvimini sunar.

---

## 1. Patent Hakkında Net Bilgi

### Patent nedir (sanılan vs gerçek)

| Kavram | Sanılan | Gerçek |
|---|---|---|
| "Fikir patenti" | "Fikrimi koruyayım, kimse taklit etmesin" | Yok — patent fikri değil **buluşu** korur |
| "İş modeli patenti" | "Ben Uber'e benzer bir şey yapacağım, patentleyeyim" | SMK m.82 iş yapma yöntemlerini açıkça dışarıda bırakıyor |
| "Yazılım patenti" | "Ürünümü patentleyeyim" | TR'de saf yazılım patentlenmez; donanım-yazılım kombin edilen teknik buluş kısmen patentlenir |

### İyiBiri için patent uygunluğu

**Tamamen patentlenemez alanlar:**
- İş modeli (3-sided marketplace, Karma economy, sponsor reward loop)
- Yazılımın kendisi (React components, server actions, API logic)
- Kullanıcı deneyimi tasarımı (UI patterns, workflow)

**Kısmen patentlenebilir alanlar (şu an İyiBiri'de YOK, sonradan çıkarsa başvuru imkanı):**
- Yeni bir kriptografik Karma token imza algoritması
- Görev verification için özel bir AI/ML moderasyon yöntemi (donanım + yazılım kombini)
- Coğrafi konum + zaman bazlı yeni bir mission routing algoritması

Hiçbiri şu anda yok. Varsa sonradan başvurulabilir.

**Sonuç:** İyiBiri'nin patent stratejisi = **patent değil, 4 katmanlı moat**.

---

## 2. 4 Katmanlı Fikri Koruma Planı

### Katman 1 — Trademark (Marka) ✅ Aktif süreç

**Koruma:** Marka adı "İyiBiri" + logo + slogan

**Durum:** Bahadır marka ajansıyla görüşmede, teklif bekliyor (Q38)

**Öneriler:**
- İlk başvuru: 3 sınıf (9 mobile app / 35 online platform / 41 gamification)
- Maliyet: ₺2.500-4.500 (3 sınıf + ajans fee)
- Süre: Filing date koruması anında, tam tescil 3-6 ay
- İkinci dalga (6-12 ay sonra): 36 sınıf (finansal/bağış aracılık) eklemesi

**Risk:** Başka biri "İyiBiri" benzer adı tescil ederse önceliği kaybedebiliriz. Bu yüzden bu ay başvuru kritik.

---

### Katman 2 — Copyright (Telif) ✅ Otomatik aktif

**Koruma:** Kod (TypeScript, SQL, config), yazılı içerik (memo'lar, UI spec'ler), orijinal tasarımlar (component'ler, wireframe'ler), UI illustration'lar

**Başvuru gerekmez** — Türkiye'de **Fikir ve Sanat Eserleri Kanunu 5846** kapsamında, eser yaratıldığında otomatik korunur. Başvuru değil, **ispat** önemli.

**İyiBiri için ispat araçları:**
- **Git commit history** — Tüm kod commit'leri + tarih + imza (Bahadır GPG signing kurmalı, şu an yok)
- **Dokümantasyon kayıtları** — `docs/` dizini git'te, bu memo'lar tarihlenmiş
- **Deposit** — Önemli kritik dokümanlar (stratejik sentez memo'su, master plan, ADR'ler) PDF olarak **Türk Patent Enstitüsü'nün Eser Kayıt Sistemi'ne** (EKOS) ücret karşılığı deposit edilebilir: yaklaşık ₺200-500/eser, kronolojik damga çok güçlü ispat
- **Yurtdışı:** GitHub private repo + timestamp → US DMCA korumasına da hak kazandırır

**Aksiyon (opsiyonel, ₺500-1000):**
- Stratejik sentez memo'su + V1 Master Plan + fee config schema (3 ana eser) EKOS'a deposit
- Git GPG signing açılması (ücretsiz, 10 dakika setup)

---

### Katman 3 — Trade Secret (Ticari Sır) 🔒 Disiplin gerektirir

**Koruma:** Rakibin bilmemesi gereken operasyonel bilgiler:

**İyiBiri için kritik trade secret'lar:**

1. **Karma formülü tam detayı** — `lib/missions/karma-formula.ts` içindeki multipliers + duration parsing logic. **Şu an açık kaynakta.** Bu kod repo'da public olursa rakip alır.
2. **Sponsor marka fiyatlandırma oranları** — CSR tier pricing bandları, müzakere skalası
3. **STK müzakere taktikleri** — "TEMA'ya şu argümanı kullanmış, LÖSEV'e bu yaklaşım işledi" öğrenim
4. **Kullanıcı acquisition formülü** — hangi kanal CAC düşük, hangi içerik viral
5. **Retention + engagement internal benchmark'ları** — hangi seviyede streak break happens, hangi mission tiplerinin completion oranı yüksek

**Kural ve prosedür (hepsi kullanıcının yapması gereken):**

1. **NDA disiplini:**
   - Tüm çalışanlar, kontraktörler, advisor'lar NDA imzalasın (Q39 avukat şablonu hazırlanıyor)
   - NDA süre: İşten çıktıktan sonra 2 yıl gizlilik

2. **Bilgi sınıflandırması:**
   - Public (web'de paylaşılabilir — feature'lar, pricing genel, misyon)
   - Internal (çalışan görür — roadmap detay, sponsor ilişkileri)
   - Restricted (sadece Bahadır + 1-2 kilit kişi — Karma formülü, sponsor pricing, müzakere stratejisi)

3. **Repo güvenliği:**
   - İyiBiri ana repo'sunu **private** tut. Open source yapma (şu an da private)
   - Karma formülünün **gerçek multipliers** production env'de secret olarak, kodda placeholder olabilir — ileri adım
   - Git GPG commit signing açık olsun (şu an yok)

4. **Pazarlama tutumu:**
   - Medium blog, Linkedin post'larda yüksek seviye anlatım — "Karma ekonomisi kullanıyoruz" EVET, "formülümüz şu" HAYIR
   - Investor deck'te formula slide'ı olmaz — "proprietary Karma scoring" yeter

**Maliyet:** 0 ₺ (disiplin + zaman)

---

### Katman 4 — Ürün Moat (Gerçek Savunma) 🏰 Zamanla derinleşir

**Koruma:** Rakibin **kolayca taklit edemeyeceği** yapısal avantajlar. Patent ofisinden çok daha değerli.

**İyiBiri için 6 moat (fonzip-positioning-koruma-stratejisi memo'sundan):**

| # | Moat | Nasıl derinleşir |
|---|---|---|
| 1 | **NGO exclusive ilişkiler** | Pilot sözleşmelerinde "ilk 12 ay başka benzer platform ortaklığı verme" maddesi — her STK için tek TR platform = biz |
| 2 | **Sponsor marka multi-year kontratlar** | 2-3 yıl CSR taahhüdü → rakip sponsor kaybeder, switching cost marka tarafında |
| 3 | **Kullanıcı Karma bakiyesi** | Kullanıcı 2,000 Karma biriktirince platform değiştiremez; data moat. Portable Karma V3 özelliği — şimdi değil |
| 4 | **Mission taxonomy + Karma formülü** | 10 domain × multipliers × duration factor = trade secret. Rakip taklit edebilir ama calibration verisi bizde |
| 5 | **Marka + güven** | Trademark (Katman 1) + KVKK tam uyum + tier-1 UX = "güvendiğim app" konumu. Rakip 2-3 yıl kovalar |
| 6 | **Turkish product-market craft** | TR kültür, fonzip bilinci, STK psikolojisi, KVKK locale sezgisi — global oyuncular taklit edemez |

**Zaman çizelgesi:**
- **Ay 0-6 (pilot):** Moat #1 (exclusive STK) + #5 (trademark) temelleri atılır
- **Ay 6-12 (pilot ölçek):** Moat #2 (sponsor multi-year) + #3 (Karma balance) şekillenir
- **Yıl 2+:** Moat #4 (calibrated taxonomy) + #6 (craft) olgunlaşır

---

## 3. Defensive Publication (Bonus koruma)

**Nedir?** Fikri *public'e açıkça ilan ederek* başka birinin aynı fikri patentleyemez hale getirmek. "Prior art" (önceki sanat) oluşturuyorsun.

**İyiBiri için uygulanabilir:**
- Medium veya kişisel blog post: "How İyiBiri works — our approach to Karma-based volunteer activation in Turkey"
- LinkedIn yazı: "İyiBiri Karma economy açıklaması" (yüksek seviye, formüle girmeden)
- Konferans sunumu (Startup Istanbul, Teknofest): Pitch deck + ürün açıklaması

**Maliyet:** 0 ₺ + 2-4 saat yazım

**Kritik not:** Defensive publication ≠ trade secret paylaşımı. Yüksek seviye fikir ilanı (**herkes bilsin ki prior art**), detay korunur (Karma formülü, sponsor bilgisi).

**Önerilen zamanlama:** Trademark başvurusundan SONRA (filing date korunduktan sonra). Önce marka, sonra defensive publication.

---

## 4. Hangi Adım Ne Zaman — 6 Ay Takvimi

| Ay | Aksiyon | Maliyet | Kim |
|---|---|---|---|
| **Ay 0 (Nisan-Mayıs)** | Trademark başvurusu 3 sınıf | ₺2.500-4.500 | Bahadır + ajans |
| Ay 0 | Git GPG commit signing açılsın | ₺0 | Bahadır, 10 dakika |
| Ay 0-1 | Mutual NDA şablonu avukattan | ₺500-1500 | Avukat paketi Q39 |
| Ay 1 | Advisor/kontraktör NDA'ları imzalama | ₺0 | Bahadır |
| Ay 1-2 | 3 kritik eser EKOS deposit (memo'lar, spec'ler) | ₺600-1500 | Bahadır |
| **Ay 2 (pilot başı)** | Pilot STK sözleşmesinde exclusivity maddesi | Sözleşme sarf | Bahadır + avukat |
| **Ay 3** | İlk defensive publication blog post | ₺0 | Bahadır veya ben yazarım |
| Ay 3-6 | Sponsor marka multi-year kontratları | Müzakere değeri | Bahadır |
| **Ay 6** | Trademark tescil tamamlanır | — | Türk Patent |
| Ay 6 | 4. sınıf (36 finansal) marka eklemesi | ₺800-1200 | Ajans |

**Toplam maliyet 6 ay:** ₺4.400-8.700

---

## 5. "Fikir çalındı" korkusu için gerçekçi çerçeve

### Gerçek riskler (sıralı):

1. **Rakip aynı fikri paralel geliştirir** (en yüksek olasılık) — 2-5 yıl içinde 1-2 oyuncu çıkabilir. **Koruma:** Moat'lar (Katman 4)
2. **Teknik yetenekli birisi kaynak kodu sızdırır** — repo özel, GPG signing, NDA varsa düşük risk
3. **Sponsor marka/STK ilişkilerimizi taklit eder** — exclusivity maddeleri
4. **Marka ismini başkası tescil eder** — Trademark
5. **fonzip bizi rakip olarak algılar ve bloklamaya çalışır** — Yol E (silent integration) mitige ediyor, Q37 avukat onayı güvence

### Gerçek olmayan riskler:

- "Patent alırım, kimse benzer şey yapamaz" → Patent yok, anlamsız
- "Fikrim açıklanırsa çalınır" → Fikirler zaten havada, **execution** kritik
- "Herkes İyiBiri benzeri yapmak isteyecek" → TR market dar, tam zamanlı pilot operasyon yapabilecek 3-5 rakip maksimum, hepsini de moat engelliyor

---

## 6. Bahadır için pratik checklist

**Bu hafta:**
- [ ] Trademark ajansıyla teklifi kapatır, başvuru başlat
- [ ] Git GPG commit signing kur (github.com/settings/keys, 10 dk)

**Bu ay:**
- [ ] Avukat paketi görüşmesinde Q39 NDA şablonu talep
- [ ] Varsa co-founder/advisor ile NDA imzala (şablon gelince)

**Pilot öncesi:**
- [ ] EKOS deposit (3 memo: strateji, master plan, fee config)
- [ ] Pilot STK sözleşmesine exclusivity madde eklet (avukat)

**Pilot sırasında:**
- [ ] Defensive publication blog post — "İyiBiri'nin yaklaşımı" (formüle girmeden)
- [ ] Sponsor marka müzakerelerinde 2-3 yıl süre hedefi

**Pilot sonrası:**
- [ ] Trademark 4. sınıf ekleme (finansal/bağış)
- [ ] Karma formula production env'de secret'a taşıma

---

## 7. Kapanış — 1 cümlelik mesaj

**Fikri koruma = patent değil, 6 moat + 3 disiplin (trademark + copyright + trade secret).** İyiBiri'nin gerçek savunması zamanla şekillenir; bugünkü tek kritik iş trademark başvurusunu kilitlemek ve NDA disiplinini kurmak.

---

## Referanslar

- SMK m.82 (Patent kapsamı dışındakiler) — sinai-mulkiyet-kanunu-m-82
- FSEK 5846 (Fikir ve Sanat Eserleri Kanunu) — otomatik telif
- EKOS (Eser Kayıt Sistemi) — turkpatent.gov.tr/EKOS
- fonzip-positioning-koruma-stratejisi memo'su (6 moat analizi)
- Q38 (trademark) + Q39 (NDA) + Q43 (bu memo'nun kaynağı) — karar kuyruğu
