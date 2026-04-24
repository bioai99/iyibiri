# Blue Ocean ve Stratejik Odak — İlk Tur

**Tarih:** 2026-04-23
**Yazar:** strategy-consultant
**Bağlam:** Pazar memo'su (01-market) + rakip haritası (02-competitors) + gelir modeli (03-revenue) sonuçlarını bir araya getirip, İyiBiri'nin hangi alanda "mavi okyanus" (rekabetsiz beyaz alan) yarattığını, hangi alanda "kırmızı okyanus" (rekabetli) olduğunu belirlemek; stratejik odak önerisi sunmak.

---

## Yönetim Özeti

**İyiBiri mevcut pazarda tek başına bir kategori tanımlıyor: "Gamified İyilik Ekosistemi" — gönüllülük + Karma + marka ödülü + STK üyelik tek uygulamada.** Bu dört alan ayrı ayrı rakiplerle dolu ama **birleşik deneyim blue ocean.** Mevcut oyuncuların hiçbiri bu dört özelliği aynı uygulamada sunmuyor. Üç bulgu:

1. **Blue ocean şu 3 kesişimde:** (a) gamified volunteering + brand reward, (b) multi-NGO unified dashboard, (c) cultural Turkish warmth + transparent attribution.
2. **Kırmızı okyanuslar:** saf bağış toplama (fonzip, GlobalGiving), tek STK app'leri, charity running (Adım Adım).
3. **Stratejik odak önerisi: "Türkiye'nin Strava+Duolingo+Charity Miles'ı"** — tek cümlelik konumlanma.

**Önerilen stratejik pozisyon:**
> "İyiBiri — 18-34 yaş dijital yerli Türkler için, gündelik iyi eylemleri anlamlı bir ritüele ve gerçek ödüllere dönüştürerek; Türkiye STK ekosistemini gamified Karma ekonomisi ile bir araya getiren ilk mobil iyilik platformu."

---

## Strategy Canvas (rakip × özellik)

Rakip memo'sundan özet tabloyu buraya da alıyorum — blue ocean görsel olarak net görünsün:

```
ÖZELLİK                    Adım  CharMiles Benevity Banka  ShareMeal Treedom İyiBiri
──────────────────────────────────────────────────────────────────────────────
Görev çeşitliliği           1      1         3       1      1          1       5
Gamification (Karma/seri)   1      2         1       0      1          2       5
Sponsor marka ödül          0      3         0       0      0          1       5
STK üyelik yönetimi         0      0         3       0      0          0       5
Mobile-first                2      4         4       2      5          3       5
Türkçe + TR STK             5      0         0       4      0          0       5
Transparent attribution     2      3         2       1      3          5       4
Passive (düşük effort)      1      5         2       5      5          4       3
──────────────────────────────────────────────────────────────────────────────
Toplam beyaz alan zoom:     (0-5 skalası, 5 = en güçlü)
```

**Blue ocean (0-1 skorları):** Görev çeşitliliği + Gamification + Sponsor ödül + STK üyelik = **hiçbir rakipte dördü birden yok**. İyiBiri tamamını hedefliyor.

---

## Blue Ocean alanlar (detaylı)

### BO.1 — Gamified Volunteering + Brand Reward kesişimi

**Neden blue ocean:** Charity Miles aktivite → sponsor ödüyor (görev yok). Habitica + Duolingo görev var (iyilik yok). Adım Adım koşu + bağış (gamification zayıf). **Üç özelliğin birleşimi kimsede yok.**

**Neden güçlü:**
- Kullanıcı psikolojisi: "Her tıklama bir şey kazandırıyor" feedback loop.
- Sponsor markalar: "Gen Z / millennial erişimi + CSR reportable" iki yönlü değer.
- STK: "Yeni dalgada gönüllü + motivated base" garanti.

**İyiBiri Hamlesi:**
- İlk 5 sponsor marka anlaşması hand-sold (Starbucks, Migros, Nike, Garanti, Trendyol tahmini aday).
- Mission card → complete → +Karma → Marka havuzuna $X katkı transparency.
- Kullanıcıya gösterilen: "Bu görevle Starbucks'ın CSR fonundan 50 TL TEMA'ya aktarıldı."

### BO.2 — Multi-NGO Unified Dashboard (kullanıcı gözü)

**Neden blue ocean:** Her STK kendi app'i (TEMA, TOG, Kızılay). Kullanıcı 5-6 app indirmek istemez. Fonzip + GlobalGiving sadece bağış, gönüllülük yok.

**Neden güçlü:**
- Mobile home-screen savaşı kazanılır (tek indirme).
- Cross-STK karşılaştırma + keşif — kullanıcı tanımadığı bir STK'yı "çevre" kategorisinde bulur.
- Search/filter cennet.

**İyiBiri Hamlesi:**
- `/dashboard/ngos` zaten var — geliştir.
- Keşfet (`discover`) blog içeriği ile tanımlama.
- Onboarding `causes` seçimi persona'ya uygun STK önerisi.

### BO.3 — Transparent Attribution with Cultural Warmth

**Neden blue ocean:** TÜSEV [S06] net — trust açığı sistemik. Ama TR kültüründe "iyi eylem" yüksek duygu yüklü. Adım Adım bunu fiziksel koşuyla kotarıyor; dijitalde kimse yapmıyor.

**Neden güçlü:**
- Her kullanıcı hareketi ("sen 50 kitap okuttun") somutlaşır.
- Impact_statement alanı zaten DB'de (`missions.impact_statement`) — kullanılmakta ama altyapısal.
- Türkçe "sen" dili + cultural resonance.

**İyiBiri Hamlesi:**
- Her görev sonunda: "Bu görevle bir kıyı şeridi temizlendi" (hikaye + fotoğraf/video opsiyon).
- Profil: "Bu yıl 847 Karma kazandın — şu etkiyi yaptın" (annual recap).
- Paylaşım kartı: "Ben İyiBiri'de [şunu] yaptım" Instagram story template.

---

## Kırmızı okyanus — girmeyelim

### RO.1 — Saf bağış toplama (fonzip, GlobalGiving, STK web formları)
**Neden kırmızı:** Pazar olgun, müşteri edinme maliyeti yüksek, farklılaştırma zor. İyiBiri bağışı **destek** olarak kullanır, primary kol yapmaz.

### RO.2 — Tek-STK kendi app'leri
**Neden kırmızı:** Benimsemek = bir STK'nın müşteri tabanı + sınırlı görev kapsamı. Zaten TEMA/TOG/Kızılay yapıyor.

### RO.3 — Charity running (Adım Adım)
**Neden kırmızı:** Adım Adım 17 yıllık kale. İyiBiri koşucuya değil "gündelik iyilik yapana" odaklanıyor.

### RO.4 — Global corporate CSR (Benevity)
**Neden kırmızı:** $10B+ lifetime, enterprise sales, TR SMB için aşırı. İyiBiri Yıl 3+ **light** versiyonu hedefler.

---

## 2×2 Stratejik Matris — Where-to-Play / How-to-Win

X-ekseni: Pazar çekiciliği (büyüklük × büyüme × direnç)
Y-ekseni: İyiBiri'nin kazanma kabiliyeti (ürün uyumu × operasyon × dağıtım)

```
Yüksek kazanma
  kabiliyeti
    │
    │    [BO.1 Gamified+Brand]    [BO.2 Multi-NGO]
    │    ★ PRIMARY                ★ SECONDARY
    │
    │    [BO.3 Transparent]       [R4 NGO komisyon]
    │    ★ UYGULA HEMEN           ☆ Yıl 2 aç
    │
    ├───────────────────────────────────────
    │
    │    [R3 Bağış fee]           [RO.1 Saf bağış]
    │    ☆ Destek kolu             ✗ Girme
    │
    │    [RO.4 Benevity B2B]      [RO.2 Tek-STK]
    │    ✗ Yıl 3+                  ✗ Girme
    │
Düşük ─────────────────────────────────────── Yüksek pazar çekiciliği
```

**Okuma:** Sol-üst alan (yüksek kabiliyet + yüksek çekicilik) = odak. BO.1, BO.2, BO.3 bu kuadranda.

---

## Stratejik Odak — 3 Pillar

### PILLAR 1 — Karma Engagement Loop (Core Experience)

**Amaç:** Kullanıcı her gün açmak isteyeceği gamified görev akışı.

**Elementler:**
- Günlük görev listesi (domain × zorluk × coğrafya)
- Seri (streak) motivation — Duolingo-benzeri
- Karma counter + leaderboard (sağlıklı karşılaştırma)
- Avatar progress — seviye ilerleme hikayesi

**Metrik:** NSM = **Monthly Active Karma Earners** (Q1 önerim buradan kalkıyor).

### PILLAR 2 — Sponsor Brand Reward Economy

**Amaç:** Kazanılan Karma'nın gerçek ödüle dönüşmesi — platformun gelir motoru.

**Elementler:**
- 5-10 aday marka anlaşması ilk yıl
- Marka × Karma eşleşme (50 Karma = Starbucks küçük kahve)
- Ödül envanteri gerçek zamanlı
- Redemption flow + kupon

**Metrik:** Redemption per MAU, sponsor marka sayısı (kontrat), sponsor havuzu ($/yıl).

### PILLAR 3 — STK Ekosistem (Supply tarafı)

**Amaç:** Görev çeşitliliği + NGO üyelik altyapısı — supply tarafının besin kaynağı.

**Elementler:**
- STK onboarding (admin tools — Q2 dalgası)
- Görev katalog & kalite (verify method, impact statement)
- NGO profil + üye yönetimi
- İçerik (posts) STK seçtirir

**Metrik:** Aktif STK sayısı, aktif görev sayısı, NGO üyelik dönüşümü.

---

## Ne yapmayacağız — stratejik "No-Go"

Strateji ne yapacağın kadar ne yapmayacağını belirler:

1. **V1'de bağış akışı yok** (🟡Q3 önerim B) — odak kullanıcı ekonomisi ve Karma loop.
2. **V1'de corporate B2B yok** — B2C olgunlaşsın.
3. **V1'de light mode yok** (🟢Q5 önerim A) — dark-only, disiplin.
4. **V1'de tüm Türkiye geografisi** değil (🟡Q4 önerim B) — İstanbul pilot yoğun topluluk yaratır.
5. **Charity running modelini kopyalamıyoruz** — Adım Adım'a saygıyla yan yana.
6. **Marka logosu satmıyoruz** — Sponsor markalar havuz üzerinden etkilenir, reklam banner'ı değil.

---

## Stratejik Pozisyon Beyanı (tek cümle)

> **"İyiBiri — 18-34 yaş dijital yerli Türkler için; gündelik iyilik eylemlerini anlamlı bir ritüele ve gerçek ödüllere dönüştürerek; Türkiye STK ekosistemini gamified Karma ekonomisi ile bir araya getiren ilk mobil iyilik platformu."**

Bu cümle:
- **Kime** (18-34 dijital yerli Türkler)
- **Hangi acıya** (iyilik yapmak istiyorum ama kime güveneceğim, zamanı nasıl ayıracağım, karşılığı ne belirsiz)
- **Nasıl** (gamified Karma ekonomisi + ödül)
- **Hangi avantajla** (ilk mobil iyilik platformu + TR STK ağı)

Tüm mesajlar, feature kararları, partnership stratejileri bu cümleye referansla doğrulanır.

---

## Sonuç ve Öneriler

1. **İyiBiri "Gamified İyilik Ekosistemi" kategorisini kendisi yaratıyor — kategoriyi tanımla, sahibi ol.**
2. **Üç pillar üzerine inşaat:** Karma loop (PILLAR 1), Sponsor reward economy (PILLAR 2), STK ekosistem (PILLAR 3).
3. **V1 kapsamı dar:** Sadece PILLAR 1 + PILLAR 3'ün merkezi + PILLAR 2'nin küçük test versiyonu (2-3 sponsor marka).
4. **Yıl 2'de PILLAR 2 tam açılımı + premium subscription.**
5. **Yıl 3+ B2B CSR** opsiyonel evrim (doğrudan ürün dönüşmeden).
6. **Ne yapmayacağımız listesi 6 madde** — disiplini koruyun.

---

## Açık Sorular / Sonraki Adımlar

- Stratejik pozisyon cümlesi product-analyst'ten onay almalı → workstream north-star metriği ile eşleşsin.
- Pillar 1 için MOP (Minimum Openable Product) brief'i product-analyst'e devredilecek.
- Pillar 2 için ilk 3-5 sponsor marka aday listesi + yaklaşım hipotezi ayrı memo.
- Pillar 3 için STK onboarding akışı + admin tools brief'i — product-analyst'e.
- **Sonraki:** 06-memos/sentez — dört memo'yu executive 1-pager olarak topla.
