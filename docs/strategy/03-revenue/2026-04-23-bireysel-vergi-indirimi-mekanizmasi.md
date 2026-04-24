# Bireysel Bağış Vergi İndirimi — Mekanizma ve UX İmplikasyonu

**Tarih:** 2026-04-23
**Yazar:** strategy-consultant
**Bağlam:** Önceki `2026-04-23-bagis-ekosistemi-hukuki-operasyonel.md` memosunda vergi çerçevesi üst-seviyede yazıldı (GVK m.89, %5 limit, makbuz zorunlu). Bu memo bireysel kullanıcı açısından **"nasıl gerçekten çalışıyor, kim faydalanabilir, İyiBiri UI'da ne gösterilmeli"** sorularını cevaplıyor. **Kritik bulgu:** çoğu kullanıcı bu indirimi hiç göremeyecek. Ürün pitch'i buna göre düzenlenmeli.

---

## Yönetim Özeti

**İyiBiri'nin hedef kitlesinin (18-34 şehirli dijital yerli) büyük çoğunluğu vergi indiriminden faydalanamaz.** Sebep: TR vergi sistemi **ücret gelirini stopajla** kesiyor — işveren brut maaştan ilgili vergiyi keserek devlete ödüyor — ve bu grup **yıllık beyanname vermek zorunda değil.** Bağış indirimi sadece **beyanname veren mükellefler** (ticari kazanç, serbest meslek, kira, yüksek ücret tarifesi) için işliyor [S31]. Üç bulgu:

1. **Ücret gelirine stopaj → beyanname yok → indirim yok.** TR'de çalışanların ezici çoğunluğu bu durumda. İyiBiri'nin birincil kullanıcı segmentinin %80-90'ı vergi indirimi bekleyip elde edemez.
2. **Beyanname verenlere %5 avantaj korunuyor.** Serbest meslek, kira geliri, yüksek ücret (belirli tarife üstü) olanlar faydalanır. Bu kullanıcılar genelde P2 segmenti (28-40, orta-üst gelir).
3. **UX'ta "vergi indirimi" vaadi riskli.** Kullanıcı "+%5 tasarruf" bekleyip "ama benim için geçerli değilmiş" çıkınca trust'ı zayıflar. **Daha dürüst mesaj:** "Beyanname veriyorsan, vergi indirimi de var. Detay: [link]."

**Öneri:** İyiBiri'de **vergi indirimi** ikincil bir bilgi olsun, primary satış noktası değil. Profil'de "Vergi beyannamesi veriyorum" opsiyonel field; sadece o seçilirse "Vergi indirimli STK" etiketleri öne çıkar.

---

## 1. Kim beyanname verir, kim vermez? (Kritik ayırım)

### Beyanname VERMEK ZORUNDA olanlar [S31]
- Ticari kazanç sahibi (esnaf, tacir, şirket ortağı).
- Serbest meslek erbabı (avukat, doktor, muhasebeci, danışman, freelancer).
- Kira geliri olan (gayrimenkul sermaye iradı).
- Yüksek ücret elde edenler (belirli tarife üstü — 2025 için ~₺1.5M/yıl üstü tek işveren; birden fazla işveren toplamı limiti).
- Sermaye iradı (menkul kıymet), değer artış kazancı, arızi kazanç olanlar.

### Beyanname VERMEYEN — sadece stopaj
- **Tek işverenden ücret alan ortalama çalışan** (ayda ₺30k net civarında tutturan çoğunluk).
- Stopaj işveren aracılığıyla maaştan kesilir, nihai vergi olarak işlenir.
- **Yıllık beyan yok → bağış indirimi hakkı yok** (stopaj zaten "bitti" sayılıyor).

**TR işgücü kompozisyonu:** 30M+ çalışan, çoğunluğu tek işveren ücretli. Beyanname verenler **15-20 milyon civarı mükellef** ama bu genellikle çok-kaynaklı gelir gerektiren küçük bir dilim.

**İyiBiri hedef P1 (18-28 genç dijital) için tahmin:** %10-15'i beyanname verir (daha çok freelancer, kiracı gelir sahibi, kendi işini yapan). %85-90 stopaj grubu.

**İyiBiri hedef P2 (28-40 profesyonel) için tahmin:** %25-35 beyanname verir (daha çok serbest meslek, ikinci iş, kira).

---

## 2. İndirimli bağış — mekanizma

**Şartlar:**
1. Bağış **makbuzla** belgelenmeli [S31].
2. Alıcı kuruluş **GVK m.89'da tanımlı** olmalı (kamu yararına dernek + Bakanlar Kurulu muafiyetli vakıf + kamu kurumu + eğitim/sağlık/dini tesisler).
3. Yıllık beyanda ayrıca gösterilmeli.

**Hesap mantığı (örnek):**
- Kullanıcı 2025 yılında 100k TL beyan edilebilir gelir elde etti.
- Kamu yararı TEMA'ya 10k TL bağış yaptı, makbuzlu.
- Matrah indiriminde tavan: 100k × %5 = 5k TL.
- Bu durumda 5k TL indirim hakkı (fazlası düşmez).
- Vergi tarifesi %20 ise → cepte kalan avantaj: 5k × %20 = **1.000 TL**.

**Not:** Kültür/turizm amaçlı statülü bağışlar %100 indirilir (GVK 89/7). Cumhurbaşkanı yardım kampanyaları %100.

---

## 3. İyiBiri UI'da ne göstermek gerek

### Seçenek 1 — Hiç göstermeme (en sade)
Pro: Yanlış beklenti oluşmaz.
Eksi: P2 segmenti için gerçek bir fırsat kaçırılır.

### Seçenek 2 — Opsiyonel beyannamesi tag'i (önerim)
- Profil settings: "Yıllık vergi beyannamesi veriyorum" checkbox.
- Checked ise:
  - Statülü STK'ların kartında "Vergi indirimli ✓" etiketi.
  - Profil'de "Yıllık bağış toplamı: ₺X — beyannamede kullanabilirsin" tracker.
  - Yıl sonu özet: "2025 yılında ₺4.200 bağış yaptın. Makbuzların e-posta arşivinde."
- Unchecked ise etiketler gösterilmez, mesaj dengeli kalır.

### Seçenek 3 — Herkese gösterme, detayda "şartlı" yaz
- Kart: "Vergi indirimli ✓ (beyanname verenler için)"
- Tıklandığında modal: "TR vergi sistemi gereği bağış indirimi sadece yıllık beyanname verenler için uygulanır. Ücret geliri stopaj ile kesilenler beyanname vermezse indirimden faydalanamaz. Detaylı bilgi için muhasebecine danış."
- Pro: Şeffaf, trust-friendly.

**Öneri:** **Seçenek 2** — profil'de opsiyonel; UI default temiz. Seçim yapan kullanıcılar için ekstra değer, seçmeyenler için gürültü yok.

---

## 4. Makbuz saklama + yıllık limit takibi

**Kullanıcı yükümlülüğü:**
- Makbuzu **5 yıl boyunca** saklamak gerekir (denetimde istenebilir).
- Beyannamede satır bazında gösterilmeli.

**İyiBiri katma değer:**
- Dijital makbuz arşivi (kullanıcının profilinde).
- Yıllık toplam tracker (₺X / beyannamedeki %5 limit).
- Export: muhasebeciye CSV + makbuz klasörü.

Bu özellik **yıl sonunda değerli** olur; yıl boyunca minimal friction. Duolingo'nun yıl sonu "2025 yılında sen" ekranı benzeri delight moment.

---

## 5. Ürün mesajlaması — ne yazılır, ne yazılmaz

### ✅ Doğru mesaj (önerim)
- "Bağışlarının her kuruşu STK'ya gidiyor."
- "Vergi beyannamesi veriyorsan, yıllık bağışlarını matrahtan düşebilirsin (kamu yararı STK'ları için %5'e kadar)."
- "Makbuzların dijital arşivde, ne zaman istersen ulaşabilirsin."

### ❌ Yanlış / yanıltıcı
- "Bağış yap, vergi avantajı kazan!" (çoğu kullanıcı faydalanamayacak)
- "+%5 tasarruf garantisi" (tavan var, tarife düşükse avantaj küçük)
- "Sen öderken devlet ödüyor" (fazla abartılı)

**Content-tr-voice agent'ı (Faz 4)** bu ton rehberine uymalı.

---

## 6. Sonuç ve Öneriler

1. **Vergi indirimi primary değer değil, ikincil bilgi olsun.** Primary satış: Karma + gerçek ödüller + anlamlı katkı.
2. **UI: opsiyonel beyanname tag'i** — Seçenek 2, profil setting üzerinden kontrollü deneyim.
3. **Yıllık bağış toplam tracker + makbuz arşivi** P2 segmenti için yüksek değer.
4. **Yıl sonu "Sen 2025" özet ekranı** — Duolingo benzeri delight + bağış-vergi indirimi hatırlatma.
5. **Content dili dürüst ve şartlı olsun** — "vergi avantajı" vaadi abartmama.
6. **STK kartında "Vergi indirimli ✓" etiketi** sadece opt-in profillerde; herkeste gösterme.

---

## 7. Açık Sorular

- **Q20 🟡** "Beyanname veriyorum" checkbox ürün onboarding'de mi, profil'de mi, bağış akışının içinde mi?
- **Q21 🟢** Yıllık makbuz özeti email mi, PDF mı, ikisi de mi?
- **Q22 🟢** Muhasebeciye otomatik gönderim (Entegra, QNB e-defter gibi entegrasyonlar) Yıl 3+ aday mı?

---

## Referanslar (yeni)

- [S31] TR 2025 Gelir Vergisi Beyanname Kılavuzu (defterbeyan.gov.tr) + BD Turkey + Vizyon Grubu "Beyan mı Stopaj mı"

Detay: `docs/strategy/99-sources/index.md`.
