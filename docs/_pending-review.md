# Beklenen İncelemeler — Bahadır

> Claude tarafından yazılan ama henüz senin onayından geçmemiş deliverable'lar. Döndüğünde buradan başla.

**Güncelleme tarihi:** 2026-04-24 11:30

---

## 🟡 1. TEMA Açılış E-postası (gönderilmeye hazır)

**Dosya:** [docs/strategy/04-value-prop/2026-04-24-tema-intro-email.md](./strategy/04-value-prop/2026-04-24-tema-intro-email.md)

**Ne yaptık:** 140 kelimelik, gönderilebilir e-posta mesajı. İki ton variant'ı var:
- Samimi ton (önerilen)
- Resmi ton (yönetim kurulu düzeyi için alternatif)

**Senin kontrolünde:**
- [ ] Muhatabın adı/unvanı başa → hangi ton seçilecek belirlenir
- [ ] LinkedIn'den muhatabı bul (Saha / Gönüllülük / Kurumsal İletişim Müdürü seviyesi)
- [ ] Mutual connection var mı diye bak → varsa 1 satırlık açılış ekle
- [ ] Telefon numaranı imzaya eklemek ister misin?

**Gönderme sonrası:** 7 gün yanıt yoksa nazik takip mesajı (dosyada örneği var).

---

## 🟡 2. TEMA Pitch Dokümanı (görüşme öncesi/sonrası paylaşılacak)

**Dosya:** [docs/strategy/04-value-prop/2026-04-24-tema-partnership-pitch.md](./strategy/04-value-prop/2026-04-24-tema-partnership-pitch.md)

**Ne yaptık:** Zaten 129 satırlık solid draft vardı, sadece iletişim bilgileri güncellendi (Bahadır Oylumlu / bahadiroylumluu@gmail.com).

**Senin kontrolünde:**
- [ ] Ton ve uzunluk senin tercihinde mi (daha kısa isteyebilirsin)
- [ ] "İç Not" bölümü (satır 114-127) — bu TEMA'ya gönderilmeyecek, sadece senin görüşme hazırlığın için. Silmek gerekiyorsa sil.
- [ ] Ekler listesi (satır 105-110) — görüşmeye gelirken bu ekleri hazır bulundurmak istiyorsan haber ver, tek tek üretebiliriz.

**Olası kullanım:**
- E-posta yanıtı olumlu geldiğinde → görüşmeden önce gönder
- Görüşme sonrası → yazılı takip olarak paylaş

---

## 🟡 3. Gamma Sunum Prompt'u (AI deck üretmek için)

**Dosya:** [docs/strategy/06-memos/2026-04-24-gamma-sunum-prompt.md](./strategy/06-memos/2026-04-24-gamma-sunum-prompt.md)

**Ne yaptık:** Gamma.app'e girip "Generate with AI" bölümüne yapıştırınca 15 slide'lık deck üreten iki tam prompt:
- **Variant A Partner Deck** → TEMA, sponsor markalara (kullanım zamanı: ŞİMDİ)
- **Variant B Investor Deck** → angel/pre-seed fonlara (kullanım zamanı: pilot data geldikten sonra)

**Senin kontrolünde:**
- [ ] Gamma account aç (gamma.app, ücretsiz başlayabilir)
- [ ] Variant A prompt'unu kopyala → yapıştır → generate
- [ ] 1 saatlik polish — logo, 2-3 placeholder fotoğraf, son rakam kontrolü
- [ ] Slide 13 (Team) — gerçek foto + 1-satır bio ekle. Co-founder yoksa "advisor" olarak mentorları ekle
- [ ] Slide 11 (Product screenshots) — canlı dashboard v2 + mission detail screenshot çek (bu kod bitti ama migration 014 apply etmeden canlı görmezsin)

**Post-Gamma checklist** dosyada (8 madde) — üretildikten sonra o checklist'ten geç.

---

## 📌 Bunları İncelerken Aklında Tutulacaklar

- **İlk kullanım sırası**: A1 (TEMA e-mail) → paralel A3 (Gamma deck draft) → TEMA yanıt gelirse A2 (pitch paylaşılır)
- **Acele etmek zorunda değilsin** — TEMA ile ilk görüşme ayarlamak için kritik olan iyi seçilmiş muhatap + güvenli ton. İki e-posta arası 3 gün boşluk bırak.
- **Migration 014 apply etmedin** — bu 3 dokümanın sağlıkla çalışması için şart değil (dokümanlar bağımsız) ama App'i Gamma slide'ları için screenshot çekmek istediğinde gerekli.

---

## ⏭ Claude'un Sıradaki Çalışması (sen yokken)

**P0 #1 Dashboard v2 wire-in** — `hero-card-v2` + `daily-mission-card` component'leri `dashboard-client.tsx`'e entegre ediliyor. Login olduğunda hero glow breathing + count-up animate + daily mission gerçekten çalışacak.

Döndüğünde göreceğin değişiklik: `/dashboard` route'u.

**İlerisi:** P0 #4 loading/empty/error library (yarım gün iş) + open decisions (Q40-Q42 senin kararını bekliyor).
