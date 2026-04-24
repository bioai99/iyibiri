---
name: brainstorming
description: Feature scope, alternatif çözüm, isim, yaklaşım üretimi için yapılandırılmış beyin fırtınası teknikleri. Crazy-8s (8 fikir 8 dakika), SCAMPER (Substitute/Combine/Adapt/Modify/Put-to-other-use/Eliminate/Reverse), Worst Possible Idea (tersine), Reverse Brainstorm (problemi büyütme), Analogous Inspiration (başka sektörden örnek), Six Thinking Hats (De Bono — rol değiştirerek). Tek bir cevap yerine 3–5 alternatif gerektiğinde, bir feature için scope seçeneği düşünürken, yaratıcı bir engelde, veya "tek çözüm aklıma geliyor" riskine karşı bu skill'i kullan.
---

# Yapılandırılmış Beyin Fırtınası

"Bir fikrim var" cümlesi tehlikelidir. İyi bir analist/danışman bir cevabı değil, **çeşitli cevapları** üretip elenme sürecini gösterir. Bu skill sürtüşmesiz bir ortamda iyi fikir yakalamak için değil, **sistemin garanti altına aldığı bir çeşitlilik** üretmek için.

## 1. Ne zaman hangi teknik?

| Durum | Birincil teknik | İkincil |
|---|---|---|
| Feature için 5 alternatif lazım | Crazy-8s | SCAMPER |
| Var olan bir feature'ı zenginleştirme | SCAMPER | Analogous |
| Takılma / "aklıma hiçbir şey gelmiyor" | Worst Possible Idea | Reverse Brainstorm |
| Karar yorgunluğu / aynı pattern tekrar | Analogous Inspiration | Six Thinking Hats |
| Problemi daha derin anlama | Reverse Brainstorm (5 Whys kombine) | — |
| Rol değişikliği gereken kritik karar | Six Thinking Hats | — |
| Hızlı eliminasyon gereken | ICE matrix (brainstorm sonrası) | — |

## 2. Crazy-8s (Google Ventures Design Sprint)

**Kural:** 8 fikir, 8 dakika. Bir kağıt 8'e katlanır (veya markdown'da 8 madde hazırla), her 1 dakikada 1 fikir çiz/yaz.

**Uygulama (metinle):**
1. Bir problem cümlesi yaz.
2. Timer 8 dakikaya. 1 dakikaya bir fikir zorlaması.
3. Sansür yok. Saçma gelen kalsın. 3. ve 4. fikirden sonra "tıkanma" noktası gelir — oradan sonra ilginç olanlar çıkar.
4. 8'in hepsini kaydet. Sıralama yok.
5. Eleme ayrı bir adımdır (ICE veya filtreler), karıştırma.

**İyiBiri örnek: "Kullanıcıya günlük aktif kalma motivasyonu"**
1. Sabah push bildirim ("Bugün 5 dakika")
2. Arkadaş streak'i paylaşma kartı
3. "Haftanın en çok Karma kazananı" leaderboard snapshot
4. Coğrafi görev önerisi (yakınınızda)
5. Kilitli görev — "bir arkadaşını davet edince açılır"
6. 3 günlük combo → +50 Karma bonus
7. Seviye atlama ön izlemesi
8. STK'nın kısa teşekkür mesajı

Sıralama yok. Sonra ICE'la ele.

## 3. SCAMPER

Var olan bir şeyi 7 lens'ten değiştirir. Problem: var olan mission card'ı nasıl zenginleştirelim?

| Harf | Soru | Örnek (mission card) |
|---|---|---|
| **S** — Substitute | Ne yerine ne? | Karma ödülü yerine direkt parasal iade mi? |
| **C** — Combine | Neyi neyle birleştirelim? | Mission + arkadaş daveti tek akışta |
| **A** — Adapt | Başka yerden ne uyarlayabiliriz? | Duolingo streak mantığı görev tamamlamaya |
| **M** — Modify / Magnify / Minify | Ne büyütsek, ne küçültsek? | Mission detayı tek ekrana sığsın, scroll yok |
| **P** — Put to another use | Başka ne için? | Mission card = ödül önizleme taşıyıcısı |
| **E** — Eliminate | Neyi çıkarsak? | "Katıl" butonu yerine otomatik katılım |
| **R** — Reverse / Rearrange | Sırayı tersine çevirsek? | Önce ödül göster, sonra görev aç |

Her harften en az 1 fikir. Sıraya önem verme.

## 4. Worst Possible Idea

**Kural:** Soru: **"Bu problemi en berbat nasıl çözerim?"** Sansür tamamen kapalı. Kötü, tuhaf, komik, etik olmayan fikirler kabul.

Sonra ters çevir: her berbat fikrin opposite'i, nadiren de olsa iyi fikirdir. Ya da en azından neyi yapmadığımızı berraklaştırır.

**Örnek: "Kullanıcıyı Karma harcamaya teşvik et"**
- Worst: Karma'yı her gece otomatik %10 azalt.
- Flip: → Karma'nın "kullanılmadığında azaldığı" hissi (expiration yerine, "yakmayı" göster) — pozitif urgency.

Etik olmayan flipler uygulanmaz; ama "neden böyle değil" sorusunu netleştirir.

## 5. Reverse Brainstorm (Problemi büyüt)

**Kural:** "Bu problemi çöz" yerine **"Bu problemi nasıl daha kötü yaparım?"** Eklenen her "kötüleştirme" aslında şu anki çözümde var olan bir risk.

**Örnek: "Kullanıcı ilk 7 günü geçmiyor"**
Kötüleştirme listesi:
- Onboarding 10 dakika yapalım
- İlk görev için en az 3 ekran atlayalım
- Kullanıcıdan e-posta doğrulaması Anında isteyelim
- İlk Karma'yı 7. günde verelim

Flip: Şu anki üründe bunların hangileri aslında var? Vardıysa, sebep (düşük retention) dolaylı olarak belli oluyor.

## 6. Analogous Inspiration

Başka sektörden nasıl çözüldüğüne bakarsın. Sıradan benzerlik değil, **derin strüktürel benzerlik**.

**Çerçeve sorular:**
- Hangi başka ürün aynı **davranış**ı ödüllendiriyor?
- Hangi ürün benzer bir **sosyal dinamik** kuruyor?
- Bu problem genel olarak "X problem ailesinin" üyesi mi? (Örn: retention → streak problemi → Snapchat, Duolingo, Headspace'e bak.)

**Örnek: "STK'lar İyiBiri'yi niye tercih etsin?"**
- Benzer iş: Etsy satıcılarının Etsy'yi niye tercihi — müşteri akışı + araç paketi.
- Benzer iş: LinkedIn'in şirketlere sağladığı HR değeri — bedava profil + premium tool.
- Flip: İyiBiri STK'ya "gönüllü akışı + üyelik yönetimi" sağlıyorsa, **hangisini baştan bedava**?

## 7. Six Thinking Hats (Edward de Bono)

Bir karar masasında 6 rol. Sırayla (veya bir toplantıda kişilere atayarak) her rolü dene:

| Şapka | Rol | Soru |
|---|---|---|
| 🟦 Mavi | Süreç yöneticisi | "Karar nasıl alınacak, tartışma nasıl yönetilecek?" |
| ⚪ Beyaz | Veri / objektif | "Hangi veri ile destekli? Hangi veri eksik?" |
| 🟥 Kırmızı | Sezgi / duygu | "İçgüdüm ne diyor? Bu kullanıcıya nasıl hissettiriyor?" |
| 🟨 Sarı | İyimser | "Bu neden işe yarar? En iyi senaryoda ne olur?" |
| ⬛ Siyah | Kötümser / eleştirmen | "Neden başarısız olur? Ne gözden kaçtı?" |
| 🟩 Yeşil | Yaratıcı | "Başka ne yapılabilirdi? Hibrit çözüm var mı?" |

Bir analist/agent için en değerli yol: **kendi kararını yazdıktan sonra** siyah şapkayı tek başına dener — her iddiaya "neden yanlış olur?" sorar.

## 8. Brainstorm → Eleme (ICE)

Fikirleri ürettikten sonra elemek ayrı adımdır. ICE:

| Kriter | Tanım | Skala |
|---|---|---|
| Impact | Kullanıcıya / metriğe etki | 1–10 |
| Confidence | Başarılı olacağından ne kadar eminim | 1–10 |
| Ease | Ne kadar kolay (tersine effort) | 1–10 |

**Skor = I × C × E / 1000** (normalize 0–1).

Üst 30%'u al, kalanı "Düşünüldü ama yapılmadı" olarak workstream'e not düş.

## 9. Brainstorm disiplini

- **Sansür süreçten önce gelmez.** Üretirken elemeyen. Eleme ayrı, üretme ayrı.
- **Quantity before quality.** Önce 8–12 fikir, sonra 3 seç. 3'le başlamak tekleşmedir.
- **Documentation.** Üretilen fikirlerin hepsini kaydet. Sadece seçileni değil. "Neden seçilmedi"yi unutmamak değerli.
- **Bağlam sıralaması.** Problem yazmadan brainstorm etme. Ne çözdüğünü bilmeyen çözüm üreten bir kafa çıktısı üretir.
- **Zaman sınırla.** Sınırsız brainstorm kötü fikir fabrikasına döner. Crazy-8s'in 8 dakikası kutsaldır.
- **Paralel, sonra seri.** Önce herkes/her ağız ayrı düşünsün (paralel), sonra bir araya gelip kıyaslansın (seri).

## 10. İyiBiri'ye özgü tetikleyiciler

Brainstorm çağırmak için iyi durumlar:

- Bir workstream içinde "feature ne olsun?" — Crazy-8s
- Var olan feature'ı pivotlamak — SCAMPER
- "Bu niye başarısız oluyor?" — Reverse Brainstorm
- Marka sponsoru, STK partnerliği gibi ilişki tasarımı — Analogous
- Karar masasında herkes aynı fikri savunuyor (tehlikeli homogeneity) — Six Thinking Hats, özellikle siyah şapka
- "Tek cevap görüyorum" riski — Worst Possible Idea

## 11. Kontrol listesi — brainstorm bitmeden

- [ ] En az 5 (tercihen 8) alternatif var mı?
- [ ] Sansürsüz tur yapıldı mı (veya sadece "mantıklı" olanlar mı üretildi)?
- [ ] Elenen fikirler "niye elendi" notlu mu?
- [ ] En az 2 farklı teknik (örn. Crazy-8 + Analogous) kullanıldı mı?
- [ ] Seçilen(ler) ICE ile gerekçelendirilmiş mi?
- [ ] Seçilen(ler) orijinal problem cümlesine hâlâ cevap veriyor mu?

Checklist tam değilse brainstorm olgunlaşmamış demektir.
