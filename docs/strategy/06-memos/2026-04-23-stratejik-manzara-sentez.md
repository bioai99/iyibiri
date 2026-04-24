# Stratejik Manzara — Sentez (İlk Tur)

**Tarih:** 2026-04-23
**Yazar:** strategy-consultant
**Bağlam:** Dört ayrı memo'nun (pazar + rakip + gelir modeli + blue ocean) yönetim kuruluna sunulabilir executive özeti. Karar tablosu + 90 günlük aksiyon planı.

---

## 1-Paragraf Özet

**İyiBiri, Türkiye'de 25-50 milyar TL bireysel bağış + CSR pazarının dijital-yakalanabilir %15'i (SAM ~5 milyar TL) içinden 5-yılda 150-400 milyon TL işlem hacmi yakalama potansiyeli olan bir platform fırsatıdır.** Pazarda doğrudan rakibi yok — komşular var (Adım Adım koşu-bağışta, Charity Miles aktivite-sponsor modelinde, Benevity kurumsal B2B'de) ama **gamification + görev çeşitliliği + sponsor ödül + STK üyelik** kesişiminde kimse yok. Bu kesişim İyiBiri'nin mavi okyanusudur. Primary gelir kolu Sponsor Marka Aracılık (Charity Miles benchmark: platform fee %50), sekonder Premium Subscription (Duolingo benchmark: %5-8 MAU dönüşümü). Üç pillar üzerine kurulan ürün + 6 maddelik "no-go" listesi + tek cümlelik stratejik pozisyon, takımın 12 ay boyunca odağını sağlar.

---

## 3 Kritik Bulgu (80/20)

### Bulgu 1 — Pazar büyük ama dağınık; dijital yakalanma çok düşük

**Kanıt:** Bireysel bağış yıllık ~20-30 milyar TL tahmin aralığında [S13], gönüllülük %13'e çıkmış (20 yılda 2x) [S06], gençlik segmenti (18-34) mobil-yoğun [S07][S16]. **Ama organize dijital platform yakalanma oranı tahmin <%5.** Adım Adım 11 yılda 70M TL → tek bir maratonda 166M TL (2024) — kanıtı sıçramalı büyüme mümkün olduğu.

**So what?** Pazar eğitilmemiş değil, **erişilmemiş**. İyiBiri iknadan çok ulaşabilirliğe + kalıcılığa yatırım yapmalı.

### Bulgu 2 — Rakip boşluğu kategorik

**Kanıt:** 10 rakip incelendi. Hiçbiri (gamified + brand reward + STK membership + Turkish ton) dördünü birden yapıyor. Adım Adım koşuya bağlı, Charity Miles aktiviteye, Benevity B2B'ye, tek-STK app'leri dar.

**So what?** İyiBiri yeni bir **kategori** tanımlıyor: "Gamified İyilik Ekosistemi". Kategori sahibi olmak marka + ekonomik avantaj.

### Bulgu 3 — Sponsor brand aracılık modeli birinci tercih

**Kanıt:** Charity Miles model: Platform fee sponsorship'ın %50'si [S08]. Benevity $10B+ işlem hacmi [S09]. TR'de kimse bu modeli denemiyor. Orta senaryo Yıl 2 geliri ~₺15M.

**So what?** İlk 5 sponsor marka kontratı **Yıl 1 primary stratejik hedef**. Başarısızlık durumunda pivot zor.

---

## Karar Tablosu (kuyruktaki 5 soruya gerçek cevap)

| # | Soru | Önerim (bu memolar sonrası) | Gerekçe |
|---|---|---|---|
| Q1 | North-star metrik? | **Aylık Karma Kazanan Kullanıcı** | Tüm gelir kolu buna bağlı: sponsor aracılık, premium, üyelik, bağış — hepsi aktif Karma kazanımına dokunuyor. |
| Q2 | Ödeme sağlayıcı? | **iyzico (birincil) + Craftgate B2B hazırlık** | iyzico %2.99 corporate + MCC 8398 destek [S11]. Craftgate kurumsal için Yıl 2. |
| Q3 | Bağış V1'de mi post-launch mı? | **Post-launch (B)** | Karma + sponsor + ödül ekosistemi önce kurulsun. Bağış Yıl 2 eki. |
| Q4 | Pilot şehir? | **İstanbul (B)** | Sponsor marka + STK + kullanıcı yoğunluğu İstanbul'da ~%30. Test hızı yüksek. |
| Q5 | Dark-only mu light opt-in mi? | **Dark-only (A)** | Disiplin korunur; light ileride eklenebilir. |

Bu tablo + gerekçeler **product-analyst'e iletilmeli** — ADR'ler açılsın, workstream başlasın.

---

## Stratejik Pozisyon (tek cümle — kategori tanımı)

> **"İyiBiri — 18-34 yaş dijital yerli Türkler için; gündelik iyilik eylemlerini anlamlı bir ritüele ve gerçek ödüllere dönüştürerek; Türkiye STK ekosistemini gamified Karma ekonomisi ile bir araya getiren ilk mobil iyilik platformu."**

Bu cümle yeni feature'lar, mesajlar, ortaklıklar için **filter** — "Bu bu cümleye uyuyor mu?" sorusu her kararın başlangıcı.

---

## 3 Pillar (ürün)

1. **Karma Engagement Loop** (gamification + seri + seviye) — çekirdek deneyim
2. **Sponsor Brand Reward Economy** (primary gelir motoru)
3. **STK Ekosistem** (supply tarafı + NGO üyelik)

V1 kapsamı = PILLAR 1 tam + PILLAR 3 merkez + PILLAR 2 küçük test (2-3 sponsor marka).

---

## 6 "No-Go" (disiplin)

1. V1'de bağış akışı yok.
2. V1'de kurumsal B2B SaaS yok.
3. V1'de light mode yok.
4. V1 tüm Türkiye değil, İstanbul pilot.
5. Charity running modelini kopyalamıyoruz.
6. Sponsor markaya reklam banner satmıyoruz — havuz modeli.

---

## 90-Günlük Aksiyon Planı

Bu memolar sonrası ilk 3 ay için önerilen sıralama:

### Ay 1 — Karar ve ADR
- Product-analyst: Q1-Q5 cevapları workstream'e dönüştürür.
- ADR-001: iyzico ödeme sağlayıcı.
- ADR-002: North-star metrik = Aylık Karma Kazanan Kullanıcı.
- ADR-003: Pilot şehir İstanbul.
- Sponsor marka aday listesi (5 hedef marka) — strategy-consultant next memo.
- STK onboarding playbook ilk taslak — product-analyst.

### Ay 2 — Foundation
- Karma economy kalibre (görev oranları final kararı).
- UX/UI: dashboard heuristik audit + ilk pillar spec'leri.
- Supabase: NGO onboarding admin akışı tamamı.
- Sponsor marka ilk temas (3 marka brief görüşmesi).

### Ay 3 — Lansman Hazırlığı
- İstanbul pilot kapsamı tamamlandı.
- İlk 50 aktif görev + 5 STK + 2-3 sponsor marka anlaşması.
- Content + ton final (content-tr-voice agent yardımı — Faz 4'te).
- Page audit tüm sayfalar "production" seviye (QA agent — Faz 4).
- Private beta → lansman.

---

## Riskler — Ana

1. **Sponsor marka havuz modeli TR'de satılmazsa** (R1 başarısız) → gelir -60% (sensitivity analizi).
2. **Trust açığı [S06] ürün-tarafında çözümlenmezse** → büyüme başlamaz.
3. **Makro ekonomik baskı** → bağış + CSR bütçeleri ilk kesilenler.
4. **Adım Adım gibi yerel oyuncunun benzer ürün lansmanı** → pivot gereksinimi.
5. **Ödeme sağlayıcı entegrasyon gecikmesi (Q2 kararı belirsizlik devam ederse)** → V1 geç.

---

## Delegeler ve Sonraki Memolar

**Strategy-consultant sonraki memo listesi (öncelik sırasıyla):**
- `02-competitors/2026-04-XX-adim-adim-deep-dive.md` — partnership keşfi
- `02-competitors/2026-04-XX-charity-miles-deep-dive.md` — model benchmark
- `03-revenue/2026-04-XX-sponsor-marka-aday-liste.md` — ilk 5 marka
- `03-revenue/2026-04-XX-iyzico-craftgate-karsilastirma.md` — Q2 detay karar memo
- `04-value-prop/2026-04-XX-value-prop-uclu.md` — kullanıcı × STK × sponsor

**Product-analyst'e devir:**
- Bu 5 soru cevaplandı → ADR'ler aç → workstream'ler başlat.
- NSM (Aylık Karma Kazanan Kullanıcı) → measurement plan.
- Pilot İstanbul → kapsam workstream.

**UX-researcher'a devir:**
- Kullanıcı × STK × sponsor üçlü persona araştırması.
- Onboarding heuristik audit (Karma loop kritik başlangıç).

**UI-designer'a devir:**
- Design system audit öncelikli (D1-D4).
- Pillar 1 engagement loop görsel spec.

---

## Son Söz

**Önümüzdeki 12 ayın en büyük riski "her şeyi aynı anda yapmak."** Üç pillar + dört memo = 12 workstream aday. Disiplin — yukarıdaki 6 "no-go" listesini koru, Q1-Q5 cevaplarına sadık kal, sponsor marka kollarıyla başla, Karma loop'u perfectionize et. Charity Miles 13 yılda kategori öğretti; Duolingo 10 yılda %8.8'e ulaştı. İyiBiri 3 yılda Türkiye'de kategori olur.

**Tek ölçü ne kadar iyi geldiğimizin: Ay sonunda aktif Karma kazanan kaç kullanıcı var, bu hangi ivmede artıyor?**

---

## Referanslar

[S06] TÜSEV 2024 Individual Giving report · [S07] Datareportal Digital 2024 Turkey · [S08] Charity Miles business model (Vizologi + charitymiles.org) · [S09] Benevity Wikipedia + G2 · [S10] Duolingo conversion (Medium + Correlated) · [S11] iyzico + MCC 8398 · [S12] Adım Adım Halk TV + gonulluhareketi.org · [S13] TÜSEV Bireysel Bağışçılık 2021 raporu · [S15] Treedom Growjo · [S16] GönüllüyüzBİZ EU Youth Wiki.

Detaylar: `docs/strategy/99-sources/index.md`.
