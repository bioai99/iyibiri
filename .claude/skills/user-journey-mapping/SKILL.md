---
name: user-journey-mapping
description: User journey map yazma metodu. Persona × senaryo üzerinden adım adım touchpoint, kullanıcı düşüncesi, eylemi, duygu eğrisi (+/-), dark moment (kullanıcı terk eder), fırsat noktası (iyileştirme açılır). İyiBiri'ye özgü rota + component referansları ile gerçek kod akışına bağlanır. Onboarding, mission flow, NGO membership, donation gibi akışları haritalarken kullan.
---

# User Journey Mapping

Journey map "kullanıcı ne yaşıyor" sorusunun tablosu. Bir persona, bir senaryo, adım adım; her adımda ekran + eylem + düşünce + duygu + fırsat. Amaç: ürün ekibinin "akıştan memnunum" sanısını **kullanıcı gerçeği**yle yüzleştirmek.

## 1. Yapısı

| Adım | Ekran / Touchpoint | Kullanıcı eylemi | Düşünce ("İçinden geçen") | Duygu | Fırsat / sorun |
|---|---|---|---|---|---|
| 1 | `/` landing | Sayfa scroll'u | "İyi bir şey gibi görünüyor, kime güveneceğim?" | 😐 | Testimonials azsa trust düşer |
| 2 | `/auth/signup` | E-posta + KVKK | "KVKK ne imzalıyorum?" | 😟 | KVKK linkti aç — uzun metin  |
| 3 | `/auth/verify` | OTP yapıştır | "6 hane tamam." | 🙂 | Auto-submit iyi |
| ... | ... | ... | ... | ... | ... |

## 2. Emotion curve (duygu eğrisi)

Adımları sırayla Y-ekseninde `[-3, -2, -1, 0, +1, +2, +3]` skorla. Eğri çizimini markdown'da skor tablosu + açıklama ile temsil et:

```
Adım   1    2    3    4    5    6    7    8
Duygu  0   -2   +1   +2   -1   +2   +1   +3
         😟         ↓ dark moment  ↑ reward
```

**Dark moment** = en düşük skor. Kullanıcı burada terk eder. Ürün için kırmızı bayrak — ilk fix önceliği bu.

## 3. Journey tipleri (İyiBiri özel)

### A. Yeni kullanıcı ilk görev
- Landing → signup → KVKK → OTP → onboarding (welcome, causes, city) → dashboard → mission listesi → mission detail → take → complete → Karma kazanım celebration.
- **Tipik dark moment adayları:**
  - KVKK uzun metin → terk
  - Onboarding causes → 10+ seçenek → decision fatigue
  - Dashboard'a ilk gelişte → ne yapacağını anlamama
  - Mission detail → "benim için uygun mu?" → çıkış

### B. Aktivasyon haftası (1. hafta)
- Gün 1 tamamlanan görev → Karma → dashboard geri dönüş
- Gün 2–3: push bildirim? → aç → mission tekrar
- Gün 4–7: streak bozulur mu? → motivasyon düşüş
- **Dark moment adayları:** Gün 2 bildirim yoksa "unutuluyor", Gün 4 streak bozulursa "ben yapamam" hissi.

### C. NGO üyelik
- NGO listesi → profil → üyelik formu (parametrik) → KVKK → submit → pending → (gün X) active/reject.
- **Dark moment adayları:** Parametrik form uzun → abandonment. Pending durum net değil → "işlendi mi" belirsiz.

### D. Karma harcama (ödül)
- Dashboard → rewards → rewards detail → "Karma yeterli mi?" → redeem → success.
- **Dark moment adayları:** Karma yetmiyorsa "nasıl kazanırım" gitmek zor. Redeem sonrası "kodumu nerede kullanırım" belirsiz.

### E. Bağış akışı (mock, hedef)
- Campaign detail → amount select → review → payment → thanks.
- **Dark moment adayları:** 4-ekran akışı çok uzun. Kart bilgisi güveni düşürür. Review ekranında vazgeçme riski yüksek.

## 4. Şablon

```markdown
# [Persona × Senaryo] — User Journey Map

**Tarih / Sahip / Hipotez mi Kanıtlı mı / İlgili strateji memosu**

## Persona
- Ad (hipotetik): "Zehra, 27, İstanbul"
- Bağlam: "ilk kez bir gönüllülük app'i indiriyor"
- Motivasyon: "arkadaşı önerdi, ne kadar kolay olduğunu görmek istiyor"
- Kısıt: "zamanı sınırlı, iş molasında kurcalıyor"

## Senaryo
[Bir cümle: ne yapmaya çalışıyor?]

## Journey table

| # | Ekran (path) | Eylem | Düşünce | Duygu | Fırsat |
|---|---|---|---|---|---|
| 1 | `/` | scroll | "..." | 😐 0 | ... |
| 2 | ... | ... | ... | ... | ... |

## Emotion curve
```
Adım    1   2   3   4   5   6   7
Skor    0  -1  +2  +3  -2  -3  +1
                      ↓ dark moment
```

## Dark moment(lar)
- **Adım X:** [ne oldu] — [neden] — [fırsat]

## Peak moment(lar)
- **Adım Y:** [ne oldu] — [neden güçlü hissettirdi] — [koru]

## Bulgu özeti
1. En kritik friction nerede?
2. En güçlü delight nerede?
3. İlk iyileştirme önerisi (UX brief konusu).

## Kaynaklar
- [Kod] Hangi dosyalar okundu.
- [Hipotez] Hangi varsayımlar yapıldı.
- [Gözlem] Kullanıcı görüşü (varsa).
```

## 5. Kurallar

- **Varsayımları sakla etiketli.** Kanıtsız bir duygu skoru = hipotez.
- **Kod bazlı doğrula.** Bir adımda "kullanıcı şunu gördü" diyorsan, ilgili `.tsx` dosyasını Read et, tutarlı mı kontrol et.
- **3–10 adım.** Çok az = detay yok. Çok çok = odak kaybı.
- **Emotion curve zorunlu.** Hiç yoksa map yarım.
- **Dark moment en az 1 tane bul.** "Hiç sorun yok" cevabı = araştırma yüzeyde.
- **Fırsat her adımda bir tane.** Tıkır-tıkır çalışan adımlar için "koru" yazabilirsin.

## 6. Anti-pattern

- **Pembe tablolar.** Tüm duygular +2/+3 olan map = pazarlama broşürü, araştırma değil.
- **Detay yerine generic.** "Kullanıcı onboarding yapar" yerine "3 swipe sonra 4. adımda bile anlamaz".
- **Çözüm önerileri journey map'te.** Fırsat sütunu sorun işaretleme, çözüm UX brief'in işidir.

## 7. Kontrol listesi

- [ ] Persona var ve etiketli (hipotez/kanıt).
- [ ] Senaryo tek cümle.
- [ ] Adım sayısı 3–10.
- [ ] Her adımda eylem + düşünce + duygu + fırsat.
- [ ] Emotion curve görsel tablo halinde.
- [ ] En az 1 dark moment işaretli.
- [ ] En az 1 peak moment işaretli.
- [ ] Bulgu özeti 3 madde ile kapanmış.
- [ ] Kaynaklar listelenmiş.

Checklist tam değilse journey map olgun değil.
