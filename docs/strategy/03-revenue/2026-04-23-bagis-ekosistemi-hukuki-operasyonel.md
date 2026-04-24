# Bağış Ekosistemi — Hukuki + Operasyonel Kurgu

**Tarih:** 2026-04-23
**Yazar:** strategy-consultant
**Bağlam:** İyiBiri üzerinden STK'lara bağış akışı kurmak mümkün mü, yasal olarak hangi yoldan, ne kadar ücretle, hangi risklerle? Bu memo "mock 4 sayfa" akışının gerçek versiyonu için ön-analiz. V1'de bağış yok kararı (Q3 ön-önerim) hâlâ geçerli; bu memo **V2 için hazırlık** niteliğindedir. **Bu memo hukuki mütalaa değildir — uzman görüşü şart.**

---

## Yönetim Özeti

**İyiBiri üzerinden bağış yasal olarak mümkündür, ama kritik mimari karar var: kim makbuz keser?** TR vergi sistemi (GVK m.89/4, KVK m.10/1-c) [S25] **kamu yararına dernek + Bakanlar Kurulu vakıf muafiyetli kuruluşlara** bağışta %5 matrahtan indirim tanıyor (kalkınmada öncelikli yöreler %10, kültür/turizm %100). **Makbuz zorunludur; makbuzsuz bağış vergi indirimi getirmez.** Bağışı kimin kestiği (İyiBiri vs STK doğrudan) akış mimarisini belirler. Üç bulgu:

1. **Statülü STK ayırt edilmeli.** Türkiye'deki binlerce dernek/vakıftan sadece **Bakanlar Kurulu muafiyet vermiş olanlar** vergi indirimi sağlıyor. Kullanıcı "vergi düşsün" beklerken, STK statüsü kontrol edilmediyse aldatılmış olur. **Ürün tarafında net etiketleme zorunlu.**
2. **Üç mimari seçenek, risk/kontrol trade-off'u ile.** (A) Yönlendirici — kart bilgisi STK'nın ödeme sayfasına gider, İyiBiri sadece keşfet. (B) Escrow/aracı — İyiBiri ödemeyi toplar, STK'ya aktarır (makbuz sorunu). (C) Vakıf kurma — İyiBiri bir vakfı ortak/kurar, kendi makbuzunu keser (uzun vade).
3. **Komisyon yapısı net olmalı.** Patreon modeli: %10 platform + %2.9 payment = ~%13-14 toplam [S26]. İyiBiri "100% aktarım" marka vaadini korumak için **opsiyonel tip + sponsor kapsamalı maliyet** modeli ile %0-5 kullanıcı dostu hedeflenir. iyzico %2.99 + 0.25 TL [S11] unsurları mutlak.

**Öneri:** V2'de Seçenek A (yönlendirici) ile başla → 12 ay sonra Seçenek B'ye evrim (makbuz teknik çözüm gelince) → Yıl 3+ Seçenek C değerlendirilebilir. **Hukuk danışmanı ile çerçeve netleştirilmeden kod yazılmaz.**

---

## 1. TR Vergi Çerçevesi (GİB + PwC referansları)

### Bireysel (Gelir Vergisi — GVK m.89)

| Bağış türü | İndirim oranı | Şart |
|---|---|---|
| Kamu yararına dernek + Bakanlar Kurulu vakıf muafiyeti | Gelirinin **%5**'ine kadar | Makbuz zorunlu [S25] |
| Kalkınmada öncelikli yörelerde | **%10** | Aynı |
| Kültür / turizm amaçlı (statülü) | **%100** | GVK 89/7 |
| Cumhurbaşkanı yardım kampanyaları | **%100** | Özel kararname |

### Kurumsal (Kurumlar Vergisi — KVK m.10)

| Bağış türü | İndirim oranı |
|---|---|
| Kamu yararı / vakıf muafiyetli | Kurumlar kazancının **%5**'ine kadar |
| Kültür/turizm statülü | **%100** |

### Kritik detay — makbuz

**Makbuz, bağış yapanın vergi indirimi için zorunludur.** Makbuzu ya:
- STK doğrudan bağışçıya keser (klasik yol)
- Yetkili aracı keser (fonzip, GlobalGiving gibi platformlar nasıl çözüyor kontrol edilmeli — genelde STK makbuz keser, platform sadece bağışı toplar+aktarır)

**Hata alanı:** Eğer bağışçı İyiBiri'ye (tüzel kişiliği ticari şirket) öderse, İyiBiri makbuz keserse vergi indirimi geçerli değil (İyiBiri statülü değil). Makbuz STK'dan gelmeli.

### Hangi STK'lar statülü?

- **Kamu yararına dernek (KYD)** — Bakanlar Kurulu (Cumhurbaşkanlığı kararı) ile tanınır. Örnek: Kızılay, TEMA, ÇYDD, TOG, AÇEV, TEGV, LÖSEV.
- **Vergi muafiyetli vakıf** — ayrı onay süreci. Örnek: TÜSEV, Sabancı, Vehbi Koç, Aydın Doğan vakıfları.

**Tüm STK'lar statülü değil.** Özellikle yeni dernekler ve küçük yerel inisiyatifler muafiyetsiz. İyiBiri'de statü tag'i (`ngos.tax_exempt: boolean`) zorunlu alan.

---

## 2. Yasal Aracılık Seçenekleri

### Seçenek A — Yönlendirici (Passthrough)

**Akış:** Kullanıcı İyiBiri'de STK'yı keşfeder → "Bağış yap" butonu → STK'nın kendi ödeme sayfasına yönlendirilir → STK tahsil eder + makbuz keser → İyiBiri sadece "yönlendirme" yapmış olur.

**Artı:**
- Yasal en basit yol.
- Para İyiBiri'yi hiç görmez — escrow riski yok.
- Makbuz sorunu yok (STK kendi keser).
- Lansman hızlı.

**Eksi:**
- Kullanıcı deneyimi parçalanır (STK sitesine gidiş/dönüş).
- Attribution — İyiBiri'nin getirdiği bağışı ölçmek zor.
- Platform gelir elde edemez (komisyon yok; sponsor aracılık üzerinden indirect).
- Tüm STK'ların kendi ödeme altyapısı olmayabilir.

**Kime uygun:** V2'nin **lansman versiyonu**. İlk 6 ay böyle çıksın, veri toplansın.

### Seçenek B — Escrow / Aracı

**Akış:** Kullanıcı İyiBiri'de öder → İyiBiri tahsil eder → İyiBiri STK'ya (komisyon sonrası) aktarır → makbuz kim keser?

**İki alt-varyant:**
- **B.1:** STK her bağışçıya otomatik makbuz keser (İyiBiri'den liste gelir). Teknik olarak uygulanabilir ama STK'nın muhasebe sistemi entegrasyon ister.
- **B.2:** İyiBiri kendi bir makbuz (vergi indirimsiz) keser; bağışçı vergi indirimi için STK'dan ayrıca ister. Kullanıcı için kötü deneyim.

**Artı:**
- Kullanıcı deneyimi tek akışta.
- Attribution, analytics, cross-STK raporlama güçlü.
- Platform komisyon alabilir.
- Aggregated reporting kurumsal sponsor için altın.

**Eksi:**
- Ödeme alımı İyiBiri'nin ticari operasyonu → muhasebe + vergi yükümlülüğü artar (ticari şirket bağış üzerinden KDV meselesi; uzman görüşü şart).
- Escrow'da parayı tutmak → fiduciary yükümlülük.
- KVKK: bağışçı kişisel veri İyiBiri'de işlenir + STK'ya aktarılır → **çifte aydınlatma**.
- STK makbuz süreci geç çalışırsa kullanıcı şikayeti artar.

**Kime uygun:** V2 ikinci dalga, lansmanın 12 ay sonrası.

### Seçenek C — Vakıf Yapısı

**Akış:** İyiBiri bir vakıf (İyiBiri Vakfı veya iş ortağı vakıfla birlikte) kurar → kullanıcı vakfa bağış yapar → vakıf STK'lara redistribute eder.

**Artı:**
- Vakıf vergi muafiyet alabilir (3-5 yıl sonra) → İyiBiri kendisi makbuz keser ve vergi indirimi tanır.
- "Trusted" status artar (kullanıcı vakfa güven daha kolay).
- TPF modeli: community foundation, vetted partners [S27].

**Eksi:**
- Vakıf kurmak + vergi muafiyeti almak 2-3 yıl süreç.
- Yönetim yapısı değişir — ticari şirketten ayrı.
- Vakıf net değer sahibi olamaz (fiktif mülkiyet sorunu).
- Karmaşık muhasebe.

**Kime uygun:** Yıl 3+ değerlendirilebilir. V1/V2'de değil.

---

## 3. Ödeme Processor Karşılaştırma (TR)

Bağış akışı ödeme processor'larıyla kritik bağlı. Üç aday:

| Kriter | iyzico | PayTR | Craftgate |
|---|---|---|---|
| Komisyon | %2.19-3.09 + 0.25 TL [S11] | %1.99-2.99 | Kurumsal özel |
| Corporate fee | %2.99 + 0.25 TL | Değişken | Müzakere |
| MCC 8398 (charity) destek | Var [S28] | Var | Var |
| Recurring subscription | Zayıf (bazı kart bankaları sorun) | Sınırlı | Daha stabil |
| Marketplace split payment (aracılık için kritik) | Var (İyiPay) | Sınırlı | Güçlü |
| Onboarding hızı | Orta (1-2 hafta) | Hızlı (3-5 gün) | Yavaş (2-4 hafta) |
| API + dokümantasyon kalitesi | İyi | Orta-İyi | Orta |

**Ek opsiyonlar:**
- **EFT / FAST (banka havalesi):** Kullanıcı banka uygulamasından STK'ya doğrudan gönderir. %0 komisyon ama kullanıcı deneyimi kötü (IBAN yazma, fotoğraf yükleme, STK tarafında manuel eşleştirme).
- **Papara / Ininal / Tosla** (mikro ödeme cüzdan): Küçük meblağlar için uygulanabilir; limit var.
- **Apple Pay / Google Pay:** iyzico + PayTR destekliyor; UX üstün.

### Komisyon senaryoları (100 TL bağışta)

| Yapı | Platform payı | Processor | STK'ya gider |
|---|---|---|---|
| iyzico direct → STK (Seçenek A) | %0 | %2.99 + 0.25 | ₺96.76 |
| iyzico → İyiBiri → STK (Seçenek B, %0 platform) | %0 | %2.99 + 0.25 | ₺96.76 |
| iyzico → İyiBiri → STK (Seçenek B, %3 platform) | %3 | %2.99 + 0.25 | ₺93.76 |
| iyzico → İyiBiri → STK (Seçenek B, %5 "opsiyonel tip") | %5 (optin) | %2.99 + 0.25 | ₺91.76 |

**Öneri:** V2 lansmanında **Seçenek A, %0 platform fee** ile başla. Marka mesajı "100% aktarım — havuzun tamamı STK'ya gidiyor, biz hiç kesmiyoruz." Platform geliri R1 (sponsor), R2 (premium), R6 (kurumsal) kollarından.

---

## 4. KVKK — Bağışçı Veri Koruması

**Kritik konu:** Bağışçı İyiBiri'ye kart + kişisel bilgi verir; bu bilgi STK'ya aktarılır mı, nasıl aydınlatılır?

**Seçenek A (yönlendirici)** — STK kendi KVKK onayını alır; İyiBiri minimum (isim, email) iç kayıt tutar.

**Seçenek B (aracı)** — İyiBiri + STK çifte aydınlatma. İyiBiri'nin gizlilik politikasında "STK paylaşımı" + her STK için ayrı onay.

**Bağış makbuzu için** STK'ya bağışçının adı + TC kimlik / vergi no (%bireysel için gerekli değil, kurumsal için gerekli) aktarılır — bu KVKK kapsamında **kişisel veri işleme**, açık rıza şart.

**Öneri:** Her STK için ayrı KVKK onay checkbox (İyiBiri zaten ngo_memberships'te parametrik form yapısı var; bağışa da uygulanır).

---

## 5. V2 Bağış Akışı — Önerilen Model

### Faz 1 (V2 lansmanı, 6 ay): Seçenek A + Akıllı Yönlendirme

**Ürün akışı:**
1. Kullanıcı `/dashboard/discover` veya görev detayında STK'yı keşfeder.
2. "Bağış yap" butonu → embedded iframe veya deep link STK'nın ödeme sayfasına.
3. İyiBiri kullanıcıyı "return URL" ile geri alır + STK confirmation ile Karma verir (opsiyonel bonus).
4. Makbuz STK tarafından bağışçıya e-posta ile gider.

**Technical stack:**
- `missions.impact_statement` benzeri `ngos.donation_url` text alan.
- Deep link handler: mobilde Capacitor in-app browser.
- Attribution tracking: `?source=iyibiri&user_id=x` query param → STK webhook.

### Faz 2 (V2 + 12 ay): Seçenek B + Marketplace Split

**Ürün akışı:**
1. Kullanıcı İyiBiri içinde öder (card form İyiBiri'de).
2. iyzico Marketplace API: ödeme %2.99 processor → split %X STK + %0-5 İyiBiri (opsiyonel tip).
3. STK otomatik bilgilendirilir + makbuz kesme trigger'ı tetiklenir (STK sisteminin API'si varsa otomatik, yoksa İyiBiri STK admin dashboard'unda kuyruk).
4. Bağışçı hem İyiBiri hem STK'dan e-posta alır.

**Bu modelin ön koşulu:** STK'nın makbuz otomasyon kabiliyeti (API veya admin panel üzerinden). İyiBiri STK onboarding programında bu kabiliyeti kontrol eder.

### Faz 3 (Yıl 3+): Vakıf/Muafiyet yolu

- İyiBiri Vakfı kurulumu için değerlendirme.
- TPF gibi community foundation modeli — **ayrı ADR + hukuki çalışma**.

---

## 6. Riskler ve Açık Hukuki Sorular

### Riskler

1. **Makbuz zinciri kırılırsa** — kullanıcı vergi indirimi bekliyor, STK geç makbuz gönderiyor → şikayet + itibar riski.
2. **İyiBiri aracılık lisans sorunu** — BDDK ödeme hizmetleri kapsamında İyiBiri'nin "ödeme hizmeti" tanımına girip girmediği netleştirilmeli (iyzico üzerinden ödeme → İyiBiri merchant, ara mı vari?).
3. **Vergi denetimi** — ticari şirket bağış aracılık ederse KDV meselesi (bağış KDV'siz, ama komisyon KDV'li).
4. **KVKK çifte ihlali** — bağışçı veri STK'ya yanlış aktarılır.
5. **14 gün cayma hakkı** — tüketici bağışımı iade etme isterse ne olur? (STK parayı zaten aldı; iade zor.) Bağış "tüketici işlemi" mi, "hayır işlemi" mi — mütalaa gerek.

### Açık hukuki sorular (Q10+ — product-analyst kuyruğuna)

- **Q10 🔴** Bağış aracılığı ticari şirket üzerinden yapılırsa KVKK + BDDK + Vergi (KDV) nasıl ayrışıyor?
- **Q11 🔴** Makbuz STK tarafından kesilecekse, İyiBiri hangi veri akışını garantiler?
- **Q12 🟡** Statülü olmayan STK'ya bağış için kullanıcı "vergi indirimi yok" uyarısı nasıl gösterilir (UI karar)?
- **Q13 🟡** Bağışta 14 gün cayma hakkı geçerli mi — hukuki mütalaa?
- **Q14 🟢** Kurumsal bağışçılar (şirketler) için ayrı akış mi aynı mı?

---

## 7. Sonuç ve Öneriler

1. **V1'de bağış yok kararını koru (Q3 ön-önerim).** V2 için çerçeve hazırlığı bu memodur.
2. **V2 lansmanı = Seçenek A (yönlendirici) + %0 platform fee.** "100% aktarım" marka vaadi.
3. **STK onboarding**'e zorunlu alan ekle: statü (kamu yararı? vakıf muafiyeti?), donation_url, makbuz otomasyon kabiliyeti.
4. **UI'da her STK için vergi indirimi etiketi** — statülü olanlar "Vergi indirimli ✓".
5. **Faz 2 (yıl 2)** = Seçenek B escrow'a evrim; iyzico Marketplace API + otomatik makbuz trigger.
6. **Faz 3 (yıl 3+)** = Vakıf yapısı değerlendirilir, ayrı çalışma.
7. **Hukuk danışmanı şimdiden devrede olsun** — özellikle BDDK ödeme hizmetleri + KVKK + vergi boyutu. Bu memo kod yazmadan önce hukuk süzgecinden geçmeli.
8. **Komisyon modeli:** platform fee yok; gelir R1/R2/R6'dan. Bağış akışı **engagement sürdürücü**, primary revenue değil (gelir memosu ile uyumlu).

---

## 8. Sonraki Memolar ve Delegeler

- `2026-04-XX-iyzico-marketplace-api-detay.md` — Faz 2 için teknik fizibilite.
- `2026-04-XX-stk-statu-doğrulama-surec.md` — onboarding'de statü kontrolü nasıl.
- **Product-analyst'e:** Q10-Q14 açık sorular + V2 bağış workstream önerisi (post-launch için).
- **Hukuk danışmanı (dış):** Seçenek B BDDK + KDV + KVKK çerçevesi.
- **UX-researcher:** Bağış akışı Faz 1 (yönlendirici) için user journey map.

## Referanslar (yeni)

- [S25] GVK m.89/4 + KVK m.10/1-c — PwC TR + GİB rehber
- [S26] Patreon fees — support.patreon.com
- [S27] TPF community foundation modeli — tpfund.org
- [S28] MCC 8398 + iyzico TR — (S11 ile birlikte okunmalı)

Detay: `docs/strategy/99-sources/index.md`.
