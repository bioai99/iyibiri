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
