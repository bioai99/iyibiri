---
name: consulting-methodology
description: McKinsey/BCG/Bain tarzı stratejik analiz için framework ve metodoloji kılavuzu. Pazar büyüklüğü (TAM/SAM/SOM), rekabet (Porter 5, SCP, Strategy Canvas), müşteri (Value Prop Canvas, JTBD, Kano), iç organizasyon (7S, VRIO), makro (PESTEL, senaryo), karar (Where-to-Play/How-to-Win, 2×2 matrisler) ve iletişim (Pyramid Principle, MECE, Issue Tree, Hypothesis-Driven) için ne zaman hangi aracı kullanacağını bu kılavuz söyler. Strateji, pazar, rekabet, iş modeli, value prop, segmentasyon, fiyatlandırma, odak/önceliklendirme analizi yaparken bu kılavuzu oku ve ilgili framework'ü seç.
---

# Danışmanlık Metodolojisi — Framework Cheat-Sheet

Bu skill tek bir soruyu cevaplar: **"Şu an ne tür bir analiz yapıyorum, hangi framework'ü kullanmalıyım?"**

Framework **soruya hizmet eder** — tersi değil. Her analiz bir framework'e zorlanmaz. Aşağıdaki tablo, soru tipinden framework'e en kısa köprüdür.

## 1. Hangi soruya hangi araç?

| Stratejik soru | Birincil framework | İkincil |
|---|---|---|
| Pazar ne kadar büyük? Biz ne kadarını alabiliriz? | TAM / SAM / SOM (top-down × bottom-up) | Fermi estimation, benchmark extrapolation |
| Rakipler kim? Kim kazanıyor, neden? | Porter's 5 Forces, SCP (Structure-Conduct-Performance) | Strategy Canvas (Blue Ocean), Benchmarking grid |
| Müşteri neyi derinden istiyor? | Jobs-to-be-Done (JTBD), Value Proposition Canvas | Kano Model, Empathy Map, Customer Journey |
| Hangi müşteri segmentine odaklanalım? | Segmentasyon matrisi (ihtiyaç × ödeme gücü × erişilebilirlik) | Behavioral / demographic / firmographic clustering |
| Biz kimiz, hangi yeteneğimiz eşsiz? | VRIO, McKinsey 7S | Core competence, Resource-based view |
| Makro bağlam değişiyor mu? | PESTEL | Senaryo planlama 2×2 (iki belirsizlik ekseni) |
| Nerede oynayalım, nasıl kazanalım? | Playing-to-Win (Lafley & Martin) | Strategy Diamond, Where-to-Play canvas |
| Hangi iş kolu hayatta kalır? | BCG Growth-Share Matrix, GE-McKinsey 9-box | MECE kill/keep |
| Fiyatı nereye koyalım? | Van Westendorp Price Sensitivity | Conjoint analysis, Value-based pricing |
| Ürün / pazar ne kadar uyumlu? | PMF sinyalleri (retention curve, Sean Ellis testi) | NPS, cohort analizi |
| Büyüme nereden gelir? | Ansoff Matrix (pazar × ürün) | AARRR pirate metrics |
| Gelir modelini nasıl seçelim? | Business Model Canvas + Revenue Streams haritası | Unit economics tablosu (CAC / LTV / gross margin) |
| Önceliklendirme — ilk hangi iş? | ICE (Impact × Confidence × Effort), RICE | Eisenhower matrix (acil × önemli) |
| Stratejik pivot mu, devam mı? | Decision tree + beklenen değer | Real options, scenario tree |

## 2. Hipotez-Odaklı Çalışma (McKinsey standardı)

Her analiz bir hipotezle başlar, veriyle biter. Sıra:

1. **Soru** — cevaplamaya çalıştığın iş kararı.
2. **Hipotez** — cevap için bir iddia (örn. "TR STK bağış pazarı X TL'dir ve yıllık %Y büyüyor, 18-34 şehirli segment çekirdek"). Net, test edilebilir, yanlışlanabilir.
3. **İspat planı** — hipotezi çürütecek en hızlı 2–3 test. "Ne görürsem bu hipotez yanlış?" sorusunu sor.
4. **Veri** — testleri yürüt. MECE bölümlendir.
5. **Sonuç** — hipotez onaylandı / revize / çürüdü. Açık uçlu bırakma.

**Kural:** Hipotez kuramıyorsan, analiz **brief muğlak demektir** — önce brief'e dön, hipoteze zorla yazma.

## 3. MECE — Mutually Exclusive, Collectively Exhaustive

Bir listede:
- **Mutually Exclusive:** Maddeler çakışmaz (bir öğe iki kategoriye aynı anda düşmez).
- **Collectively Exhaustive:** Birlikte tüm evreni kapsar (boşluk yok).

MECE ihlali = strateji hatası. Her listede kontrol et: "Bir şey iki yerde mi var? Bir boşluk kaldı mı?"

**Örnek (iyi MECE — İyiBiri gelir kolları):**
1. NGO üyelik komisyonu
2. Sponsor marka aracılık
3. Premium kullanıcı aboneliği
4. Bağış üzerinden hizmet bedeli
5. Kurumsal B2B SaaS
6. *Diğer / gelecekteki kollar*

6. madde "catch-all" — collectively exhaustive olmayı sağlar.

## 4. Issue Tree (Sorun Ağacı)

Büyük soruyu MECE alt-sorulara böl, altına veri sorularına in. Her dal ya cevaplanır ya elenerek kaldırılır.

Örnek yapı:
```
Ana soru: İyiBiri hangi gelir koluna odaklanmalı?
├── Pazar büyüklüğü hangi kolda en büyük? (01-market)
│   ├── NGO fee market → TAM, penetrasyon
│   ├── Sponsor marka CSR → TR CSR harcaması
│   └── Bağış fee → TR online bağış hacmi
├── Kazanma olasılığımız hangi kolda en yüksek? (kabiliyet eşleşmesi)
│   ├── Tech avantajımız nerede kritik?
│   └── Network etkisi hangi kolda self-reinforcing?
└── Risk / downside hangi kolda en düşük?
    ├── Regülasyon (KVKK, BDDK, vergi)
    └── Rakip atağı, zaman baskısı
```

## 5. Pyramid Principle (Minto)

Yazarken ve sunarken:
- **Tepe:** Ana cevap (tek cümle).
- **İkinci katman:** 3 (2–4) destek argümanı.
- **Üçüncü katman:** Her argümanın altında kanıt.

**Asla** kronolojik veya "önce kanıt sonra sonuç" yazma. **Cevap her zaman önce gelir.** Yönetici 10 saniyede anlamalı, kalan detayı isteyen okur.

**Formül:**
> [İddia]. Çünkü [1] ..., [2] ..., [3] ... Birlikte bu, [sonuç / aksiyon] demek.

## 6. "So What?" Disiplini

Her bölüm sonunda kendine sor: "So what? Bu bilgi hangi karara nasıl hizmet ediyor?" Cevap yoksa bölüm gereksiz — sil.

## 7. Triangulation (3'leme)

Kritik sayısal bulgu için en az **2 bağımsız kaynak** ara. Çelişirse:
- Uç değerleri göster (düşük-yüksek aralık).
- "Orta tahmin" öner.
- Yöntem farkını açıkla (top-down vs bottom-up, vendor vs bağımsız).

Tek kaynaklı büyük rakam = risk. Memo'da uyar.

## 8. 80/20 ve Önceliklendirme

**ICE Skor:** Impact × Confidence × Ease (1–10 her biri). En yüksek ICE'lıdan başla.

**Sınırlama:** 10 bulgudan 3'ünü ön plana çıkar, kalan 7'yi ek (appendix) kıl. Yönetici 3'ü okur, mühendis 7'yi okur. İkisine de hizmet et.

## 9. 2×2 Matris Araçları

Strateji sunumu için en güçlü görsel. Örnekler:
- **Eisenhower:** Acil × Önemli → Yap / Planla / Delege / Çıkar.
- **BCG:** Pazar payı × Pazar büyümesi → Star / Cash Cow / Question Mark / Dog.
- **GE-McKinsey 9-box:** Sektör çekiciliği × rekabet avantajı.
- **McKinsey DCF:** Risk × Getiri.

Her 2×2'de:
- Eksenler tek-boyutludur (karışık değişken yok).
- Kuadrantların adı aksiyon önermeli ("Kill", "Scale", "Watch", "Invest").
- Her varlık (ürün, rakip, pazar) tek bir kuadranda konumlandırılır.

## 10. Senaryo Planlama (Shell metodu)

Büyük belirsizlik varsa:
1. En kritik 2 belirsizliği bul (örn. "TR ekonomisi büyür mü?", "Sponsor markaların CSR bütçesi artar mı?").
2. 2×2 → 4 senaryo.
3. Her senaryoyu 1 isimle etiketle, 1 paragraf anlat.
4. İyiBiri'nin her senaryoda nasıl davranacağını yaz.

Planlama "bir senaryoya bet etmek" değildir — her senaryoda **hangi opsiyon** açık kalacak, onu görürsün.

## 11. Yaygın tuzaklar (anti-pattern)

- **Framework for framework's sake** — her memo'ya Porter 5 yapıştırma. Araç soruya hizmet eder.
- **False precision** — "Pazar 4.73 milyar TL" yazmak tahminken. Yanlış bir güven yaratır. Aralık ver.
- **Confirmation bias** — hipotezi onaylayan veriyi aramak, çürütücüyü görmezden gelmek. "Ne olursa bu yanlış olur?" sorusunu her zaman sor.
- **Analysis paralysis** — 10. kaynaktan sonra yeni bilgi gelmiyorsa dur, yaz.
- **Recommendations without trade-offs** — her öneri bir maliyet içerir. Fırsat maliyetini yazmadan öneri tam değil.
- **Strateji = plan değil.** Strateji "kazanmanın yolu"dur; plan uygulama takvimidir. Memo'lar strateji üretir, takvimi başka agent yapar.

## 12. Çıktı kalite kontrol listesi

Memo'yu bitirmeden sor:
- [ ] Yönetim özetini tek başına okuyan ana cevabı alır mı?
- [ ] Her sayısal iddia kaynaklı mı?
- [ ] Belirsizlikler görünür mü?
- [ ] Hipotezlerin her biri onaylandı / çürütüldü / açık?
- [ ] "So what?" her bölüm için cevaplı mı?
- [ ] Öneri alternatiflerle karşılaştırıldı mı?
- [ ] Açık sorular listelendi mi (eksik veri / sonraki araştırma)?

Checklist tam değilse memo yayına hazır değildir.

## 13. 7 Powers — Persistent Competitive Advantage (Hamilton Helmer)

**Nedir:** Bir iş "neden başarılı oluyor, rakipler neden takip edemiyor" sorusunun cevabı 7 mekanizmadan biridir. Diğer hiçbir şey persistent advantage'ın kaynağı değildir.

**7 Power:**

### 1. Scale Economies
Daha büyük → birim maliyet düşer → fiyat avantajı veya margin avantajı.

**İyiBiri örneği:**
- Gönüllü network büyüdükçe, volunteer-finding mühendislik sabit maliyeti dilimiş olur.
- STK sayısı arttıkça, STK onboarding operasyon maliyeti per-STK düşer.
- Moat: Türkiye'de bize 1000+ STK network'ü kurmamızı takip etmek rakibe 3x pahalı.

**Test:** Birim ekonomi (CAC, LTV, COGS) şekli (J, L, C). L-shape = scale economies.

### 2. Network Effects
Ağ büyüdükçe, her yeni üyenin değeri artar. Viral growth.

**İyiBiri örneği:**
- Gönüllü sayısı arttı → STK'ya daha faydalı → daha fazla STK katılır.
- STK sayısı arttı → gönüllülere daha fazla görev → gönüllü active'i artar.
- Two-sided network feedback loop.

**Test:** Growth rate aksiyel mi? Saturation noktası var mı (S-curve)?

### 3. Switching Costs
Müşteri "seni bırakıp başkasına geçmek pahalı" hisseder.

**İyiBiri örneği:**
- STK 3 ay üyeler, görevler, sponsor aracılıklar topladı → başka platforma taşımak operasyon yükü.
- Gönüllü "sevdiği STK'lar favorite'a aldı" → başka uygulamaya geçişte data lock-in.
- Not legal binding, ama friction = moat.

**Test:** Churn ne sebeple oluyor? Yeni rakip girince churn rate'i arttı mı?

### 4. Branding
Müşterinin zihni "= iyiBiri" oluşur. Qualitative trust / preference.

**İyiBiri örneği:**
- "Türkiye'de gönüllüler iyiBiri'de bağlı" (brand position).
- "STK'lar İyiBiri'den bağış + gönüllü bulur" (market positioning).
- Zamanla, brand = moat.

**Test:** Blind test — logo olmadan, seçim aynı mı?

### 5. Cornered Resource
Eşsiz kaynak (insan, veri, network, IP) sahipliği.

**İyiBiri örneği:**
- Türkiye'de STK + gönüllü + sponsor ağını ilk kurduysak, ağ "cornered."
- STGM, TÜSEV, İPM ortaklıkları kurumsallaştığında, yeni rakip kopya edemez (13 yıl ilişki).
- Data (gönüllü davranış, STK tercihler) benzer öğrenilmesi zor.

**Test:** Rakip bu kaynağı kopyalayabilir mi, ne kadar zaman / para gerektir?

### 6. Process Power
"Biz bu işi daha iyi yapıyoruz" disiplini.

**İyiBiri örneği:**
- STK onboarding process optimized (6w → 2w).
- Gönüllü matching algoritması (vs. manual).
- Sponsor KYC flow (compliance + speed).
- Rakip bu prosesleri copy etse, iki yıl gerisinde kalır (learning curve).

**Test:** Process benchmark (ör. speed, quality, cost per unit). Biz 2x mi daha iyiyiz?

### 7. Counter-Positioning
Rakip bir avantajdan vazgeçiyorsa, onu copy edemez.

**İyiBiri örneği:**
- Biz "İnsan-odaklı, long-tail STK'lara hizmet" modeli.
- Rakip "Kurumsal, büyük NGO'lar x Kurumsal sponsorlar" modeline giderse, biz abandon edilir mi?
- İyiBiri için Counter-Positioning = "Ben long-tail, rakip enterprise" = alana bölünme.

**Test:** Rakip bizim modeli takip ederse, kendi core bisinesinde başarısız mı olur?

**Analiz yapısı:**

```markdown
# [İyiBiri] — 7 Powers Moat Analizi

## Mevcut Powers (hangileri var, ne kadar güçlü)
- Scale economies: ⭐⭐⭐ (1000+ STK → unit economics)
- Network effects: ⭐⭐⭐⭐ (two-sided, self-reinforcing)
- Switching costs: ⭐⭐ (veri lock-in, operasyon friction)
- Branding: ⭐⭐ (early, kuruluşsal bağlama ihtiyaç)
- Cornered resource: ⭐⭐⭐ (STK + gönüllü + sponsor network)
- Process power: ⭐⭐⭐ (onboarding, matching optimized)
- Counter-positioning: ⭐ (long-tail positioning eşsiz, ama çakışabilir)

## Rakip Karşılaştırması
[Üç rakip için her power'ı sınıfla]

## Stratejik çıkarım
- Şu 3 power'i güçlendir: [X, Y, Z] (18 ay)
- Şu 2 power'i yeni kur: [A, B] (24 ay)
- Dikkat: [risk]
```

---

## 14. Amazon Working Backwards — PR/FAQ Framework

**Nedir:** Amazon "yeni iş / feature'ı" müşteri gözüyle başdan yazarak karar verir. Mekanizma:
1. Press Release (müşteriye duyuru) yazdır.
2. FAQ (iç + dış sorgular) hazırla.
3. Reconsider — soruların cevaplarını okuyup "hâlâ yapalım mı?" de.

**Neden faydalı:** Feature spec'ten başlamak (inside-out), müşteri pressinden başlamak (outside-in) daha güçlü. PR/FAQ yazarken, "bunu neden yapıyoruz, müşteri ne kazanıyor" zorla cevapla. Cevap saçmalıysa, iş de saçma demektir.

**Format:**

```markdown
# [Feature] — Working Backwards PR/FAQ

## Press Release (müşteriye duyuru, 1 sayfa)

### Başlık
[Kisa, benefit-forward]

Örn: "İyiBiri STK'lara Member Bulk Import Sundu — Hergün 1 Saatini Geri Kazanacaklar"

### Alt başlık
[1 cümlelik özet]

Örn: "CSV / Excel'den üyeleri toplu aktarmak, sağlaştırma senkronizasyonu artık 5 dakika."

### Bölüm 1 — Problem (müşterinin acı nokta)
STK müdürü neden istiyor? Ne sorunu çözeceğiz?

Örn: "Manisa STK'sı 800 üyesini Whatsapp + Excel'de tutuyor. Her ay senkronizasyon hatası = aktif olmayan üyelere bildirim. Yedekleme = saatler zaman."

### Bölüm 2 — Çözüm (biz ne yapıyoruz)
High-level feature.

Örn: "İyiBiri artık CSV import desteği sunuyor. Şablon indir, kendi kaynağından doldur, import et, match et (biz 95% otomatik buluruz), kaydet."

### Bölüm 3 — Avantajlar (müşteri faydasına göre)
- Avantaj 1: "Zaman tasarrufu — 10 saatlik iş 30 dakikada."
- Avantaj 2: "Senkronizasyon hataları %95 azalır — algoritma geçersiz e-mail vb. bayraklar."
- Avantaj 3: "Toplu aktarımdan sonra, otomatik welcome email gider, onboarding hızlanır."

### Bölüm 4 — Başlamak (call-to-action)
"STK müdürü Settings > Import Member sekmesine girer, template indir, doldur, save."

### Bölüm 5 — Quote (sponsor / STK feedback — varsa)
"Bu feature bize 10+ saat/ay tasarrufu sağlayacak, onboarding hızlandıracak." — [STK müdürü adı]

## FAQ — Internal (iç kullanım, sorgular)

### Q1. Neden şimdi? (market timing)
A: [Talep signals: 30+ STK istemişti, TÜSEV workshop'ta öne çıkmıştı, rakip X de sunuyor]

### Q2. Kaç STK / Gönüllü etkilenir?
A: [Direct: 50+ STK, Indirect: 500+ gönüllü]

### Q3. Revenue impact?
A: [Doğru: adoption +25%. Yanlış: new revenue stream (onboarding hızlı ama paid değil)]

### Q4. Technical debt / risk?
A: [Data matching algoritması (false positive risk), CSV parsing (character encoding). Mitigations: test, fallback to manual]

### Q5. Success metric?
A: [Import adopters 40+ STK (3 ay), average session time import +5 min, retention week-2 +5%]

### Q6. Kill criteria?
A: [Import fail rate >%5, adoption <20 STK/ay, technical debt >2 sprint]

## FAQ — External (müşteri / market basında sorulabilecek)

### Q1. Rival X'de de var, ne fark?
A: [Ama theirs manual, ours 95% otomatik matching. Dokunmatik vs. otomatik.]

### Q2. Bizde data secure kalır mı?
A: [Evet. Şifreleme [standard], audit log [yes], KVKK [compliant]]

### Q3. Sonra neler?
A: [API support (Q3), Salesforce sync (Q4), real-time sync (Q5)]

---

**Disiplin:**
- PR okuyunca "ben customer'ım, bunu kullanmak isteyecek miyim?" sorusunu cevapla.
- FAQ'de "kill criteria" (ne olursa başarısız demektir) yazmak zorunlu.
- Spec'ten PR/FAQ çıkması değil, PR/FAQ'den spec'i çıkar.
```

---

## 15. Kontrol Listesi — Stratejik Analiz Hazırlık

- [ ] Ana soru net / test edilebilir hipotez yazılmış mı?
- [ ] Framework seçimi soruya hizmet ediyor mu?
- [ ] MECE bölümleme — çakışma / boşluk var mı?
- [ ] Critical sayılar 2+ bağımsız kaynaktan verified mi?
- [ ] Yönetim özeti 1 sayfaya sığdı mı (cevap ilk cümle)?
- [ ] Her öneriye alternatif yazılmış mı?
- [ ] Risk / belirsizlikler görünür mü?
- [ ] Açık sorular / sonraki araştırma listelendi mi?
- [ ] 7 Powers analizi varsa, moat kuvveti ⭐ ile scored mi?
- [ ] PR/FAQ varsa, kill criteria ve success metric'ler açık mı?

Checklist eksikse analiz incomplete — revize et.
