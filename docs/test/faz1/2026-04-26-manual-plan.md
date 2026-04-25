# Test Plan — Faz 1 (Critical Path Manual) — 2026-04-26

## Executive summary

**İlk koşu manual+guided modu.** Test-engineer, kullanıcının kendi cihazından adım adım test etmesini rehber ederek yapacak. Playwright otomasyonu henüz kurulu değil; onun yerine web/mobil browser üzerinden etkileşimli test.

---

## Scope

### Trigger: Dashboard overhaul (Job 1-7)
- **Commit'ler:** 248d930, d476066, 975782a ve sonrası
- **Etkilenen flow'lar:** D1, M1, M2, XC1, TR1-TR7 (inbox'tan)
- **Karar:** Routine deploy (P0 kırıcılık riski medium)

### Flow listesi (manual-test-scenarios.md'den seçilmiş)

| ID | Akış | Bağlantı | Test tipi |
|---|---|---|---|
| **D1** | Dashboard ilk render | Hero karma kart (minimal) + carousel + light mode 3-katman | Critical |
| **M1** | Mission detail görüntüleme | Hero photo + meta chip'ler (tarih/süre/konum/kontenjan) + safe-area | Critical |
| **M2** | Mission take + applied state | "Başvurun alındı" theme-aware + timeline + cancel button | Critical |
| **XC1** | Theme parity (light + dark) | D1 + M1 + M2'de tema geçişi + orphan renk trakı | Critical |
| **TR2** | Long isim header overflow | Optional quick check — uzun Türkçe isim ellipsis testi | Optional |

**Toplam flow'lar:** 5 (1 optional)

### Out of scope (ilk koşu)

| Kapar | Sebep |
|---|---|
| **A2, A3, O1, O2** (auth + onboarding) | Mevcut user fixture'lardan login yeterli; signup/onboarding 12 saatte değişmedi |
| **G3** (leaderboard güncellemesi) | Mission complete trigger yapılması gerekir; manual flow'da zaman az |
| **Lighthouse otomasyonu** | Manual mode — score'lar elle kontrol edilebilir ama test otomasyonu değil |
| **Slow 3G** | Manual'da network throttle zor; opsiyonel spot check |
| **Capacitor/PWA** | Desktop browser'dan test edilecek |
| **Cross-device matrix** | Sadece kullanıcının mevcut cihazı (desktop/mobil) |
| **DB doğrulama** | Supabase test instance yok; prod read-only spot check opsiyonel |

---

## Cihaz ve tarayıcı

- **Test platform:** Kullanıcının mevcut cihazı (desktop Chrome/Safari/Firefox veya mobil tarayıcı)
- **Viewport:** Gerçek cihaz natif viewport
- **URL:** `https://iyibiri.app` (production) VEYA `https://iyibiri-<branch>.vercel.app` (preview deploy) — **kullanıcı belirtecek**

---

## Kullanıcı fixture

| Fixture | Email | Durum | Kullanım |
|---|---|---|---|
| `user-fresh` | `fresh@test.iyibiri.app` | Onboarding bitti, 0 karma, 0 görev | D1, M1, M2 (hiç görev yok senaryosu) |
| Prod user | `user@example.com` | Kullanıcının kendi account'u | Opsiyonel: real-world data spot check |

**Not:** Fixture credential'ları test-engineer'ın `.env.test.local` dosyasında veya production'da mevcut olduğu varsayılmıştır. Eğer yoksa kullanıcıya belirtilecektir.

---

## Test plan detayları

### 1. D1 — Dashboard ilk render (10-15 dakika)

**Hedef:** Hero karma kart minimal + carousel + light mode 3-katman terkisi doğru.

**Prerequisite:**
- Kullanıcı `/dashboard`'a login'li erişebilir

**Steps:**
1. `/dashboard` aç → loading skeleton + ~500ms → hero karma kart + carousel render
2. **Functional kontrol:**
   - Hero kart: "0 Karma" sayı görünüyor mu, butterfly (120px) görünüyor mu
   - Tier badge "İyi Biri" görünüyor mu
   - Progress bar (0/500) animasyonsuz görünüyor mu (ambient breath yok reduced-motion'da)
   - Empty CTA "İlk görevini tamamla →" gold link görünüyor mu
3. **Carousel kontrol:**
   - 3 mission kartı göz at (başlık + domain color + avatar)
   - Horizontal scroll → dot indicator senkron çalışıyor mu
   - Scroll snap'ler mi (mobile'da smooth snap)
4. **Light mode parity kontrol:**
   - Page bg (#F4EEDF cream)
   - Card bg (cream veya slight elevation)
   - Text color (ink siyah)
   - Gold accent'ler görünür mü (karma sayısı, CTA, progress fill)
5. **Screenshot al:** Light mode — desktop ve mobile viewport'u

**Edge cases:**
- Theme toggle (sağ-üst veya ayarlarda) → Dark mode geç → karşılaştır
- Dark modda: bg koyu (#1A1612), text cream (#F4EEDF), orphan renk yok mu (hardcoded black/white)
- Screenshot al: Dark mode
- Refresh et → state korunmuş mu, loading skeleton tekrar görünür mü

---

### 2. M1 — Mission detail (10-12 dakika)

**Hedef:** Hero photo + meta chip'ler + safe-area doğru, kategori chip kategori gösteriyor.

**Prerequisite:**
- D1 başarılı + en az 1 mission var

**Steps:**
1. Carousel'dan veya grid'den bir mission kartı tap
2. Mission detail aç → hero photo scroll (3:2 ratio)
3. **Functional kontrol:**
   - Photo üstünde soft gradient overlay görünüyor mu
   - Back button (top-left) + share button (top-right) + favorite icon → frosted glass
   - Kategori chip dolu (mission.category var ise): mission.category enum (nature/education/social/financial/animals/culture)
   - H1 başlık (28px serif Fraunces)
   - NGO satırı: logo + isim + "Takip et" outline button
4. **Meta kartlı kontrol (4 tanesi 2×2):**
   - "TARIH": "Esnek" yerine "Sen seç" mi yazıyor (rework kontrolü)
   - "SÜRE": görünüyor mu
   - "KONUM": görünüyor mu
   - "KONTENJAN": "999 yer" yerine "Sınırsız" mi yazıyor (rework kontrolü)
5. **Impact section:**
   - "BU GÖREVİN ETKİSİ" heading görünüyor mu
   - Impact statement italic → body description
6. **CTA kontrol:**
   - "Bu göreve katıl" (gold) sticky bottom görünüyor mu
   - Safe-area padding (`paddingBottom: calc(120px + env(safe-area-inset-bottom))`) — iOS notch veya home indicator taşıyor mı
   - Bottom nav overlay veya gizli mi
7. **Screenshot al:** Light mode

**Edge cases:**
- Theme toggle → dark mode → "BU GÖREVİN ETKİSİ" gold accent okunuyor mu
- Screenshot al: Dark mode
- Çok uzun başlık için (test verisinde varsa) → wrap düzgün mü, ellipsis taşması yok mu
- Photo null durumu (test verisinde yoksa skip) → fallback gradient + emoji

---

### 3. M2 — Mission take + applied state (12-15 dakika)

**Hedef:** "Başvurun alındı" theme-aware, timeline adımlar, cancel button.

**Prerequisite:**
- M1 açık + user henüz katılmamış

**Steps:**
1. "Bu göreve katıl" tap
2. **Optimistic UI kontrol:**
   - Button "Başvuruluyor..." spinner (200ms loading)
   - Backend response → page state değişir
3. **Applied state kontrol:**
   - Status card görünür: "Başvurun alındı"
   - Card bg: `c.ink800` (dark tonlu — THEME-AWARE, light mode'da dark veya light tema'ya göre)
   - Title: `c.cream` (açık renk)
   - Subtitle: `c.ink300` (orta-açık)
4. **Timeline kontrol:**
   - "SIRADA NE VAR" başlık görünüyor mu
   - 3 adım (gold / outline / outline):
     - Step 1 (gold): "NGO onayı"
     - Step 2 (outline): "Hazırlık SMS'i"
     - Step 3 (outline): "Görev günü check-in"
   - Dairelerin (32px) çizgileri ve rakamları ("{1,2,3}") görünüyor mu
5. **Cancel button kontrol:**
   - "Katılımı iptal et" outline button görünüyor mu
   - Hover/tap'de border + text rengi değişiyor mu (`c.danger`)
6. **Screenshot al:** Light mode
7. **Theme toggle → Dark mode:**
   - "Başvurun alındı" card dark mode'da okunaklı mı (black-on-dark bug'ı kapatıldı mı)
   - Timeline daireleri (`c.ink300`) visible mı dark'ta
8. **Screenshot al:** Dark mode

**Edge cases:**
- Aynı butona 5 kere hızlı tap → idempotent (tek satır insert, 2. basış'ta "zaten katıldı" mesajı)
- Network kesik iken tap → loading sonsuza kadar mı, yoksa error toast mı
- Refresh et → applied state korunuyor mu

---

### 4. XC1 — Theme parity (light + dark) — integrated test

**Hedef:** Light + dark her ekranda (D1, M1, M2) uyumlu, orphan renk yok.

**Prerequisite:**
- D1 + M1 + M2 test'leri tamamlandı ve screenshot'lar var

**Steps:**
1. **İncelemeler (her ekranı 2 mod'da aç):**
   - D1 light screenshot vs D1 dark screenshot → renkler fark mı
   - M1 light vs M1 dark → başlık / meta / impact seçilebilir mi
   - M2 light vs M2 dark → status card / timeline / button renkler tutarlı mı
2. **Orphan renk arama:**
   - Light mode'da black text gözünün altından kaçmış mı (hardcoded `#000`)
   - Dark mode'da white bg gözünün altından kaçmış mı (hardcoded `#fff`)
   - Gold accent'ler her ikisinde parlak mı vs mat mı (intentional fark)
3. **Accessibility kontrol (gözle):**
   - Text color contrast: light'ta ink/cream fark belli mi, dark'ta cream/ink fark belli mi
   - Küçük buttonlar (32px) tappable mı (minimum 44px kural — visual check)
4. **Sonuç:**
   - Hepsi OK → **XC1 Pass**
   - Bir orphan renk → bug raporu (BUG-XC1-nnn)

**Edge cases:**
- Sayfa `prefers-reduced-motion: reduce` aktifse test et (Mac System Preferences → Accessibility → Display → Reduce motion; Chrome DevTools → rendering → Emulate CSS media feature prefers-reduced-motion)

---

### 5. TR2 — Long isim header overflow (optional, 5-7 dakika)

**Hedef:** Uzun Türkçe isim header taşması kontrol (opsiyonel quick check).

**Prerequisite:**
- M1 açık, mission başlığı düşük uzunlukta olabilir (test verisine bağlı)

**Steps:**
1. Test verisi / fixture'de uzun başlık varsa (`mission.title` 50+ karakter):
   - M1 detail'de başlık wrap mı, ellipsis nereye düşüyor
   - Mobile viewport'ta 1 satır mı, 2 satır mı
2. Türkçe karakterler (ç/ğ/ı/ö/ş/ü): doğru encode/decode mı (URL bar'da veya veri olarak)
3. **Sonuç:**
   - Okunabilir mi → **TR2 Pass**
   - Kırılmış mı → bug raporu (BUG-TR2-nnn)

**If no long-title data → skip ve note yaz "no test data"**

---

## Beklenen runtime

- **Total:** 45-60 dakika (5 flow + screenshots + theme toggle'lar)
- **Breakdown:**
  - D1: 10-15 dk
  - M1: 10-12 dk
  - M2: 12-15 dk
  - XC1: 8-10 dk
  - TR2: 5-7 dk (opsiyonel)

---

## Çıktılar (manual mode)

1. **Test raporunda her adım:**
   - Ne yap? (adım)
   - Ne bekliyorsun? (expected)
   - Ne gördün? (actual)
   - Screenshot (light + dark ayrı)

2. **Bug listesi (varsa):**
   - Format: `BUG-nnn — [başlık] — Severity [P0/P1/P2] — Screenshot path`
   - Detailed bug format: `_playbook.md` Bölüm 5'de

3. **Faz raporu:**
   - `docs/test/faz1/2026-04-26-rapor.md`
   - Pass/fail tablo (D1/M1/M2/XC1/TR2 light/dark)
   - Bug listesi (varsa)
   - Pattern detection (3+ bug aynı kök neden)
   - Self-assessment checklist

4. **Journal entry:**
   - `docs/test/_journal.md`

---

## Setup kontrol listesi

Koşmadan önce doğrula:

- [ ] Kullanıcı `/dashboard`'a erişebiliyor (production veya preview deploy)
- [ ] Tarayıcı dev tools mevcut (F12 / right-click → Inspect)
- [ ] Screenshot yöntemi hazır (built-in screenshot veya tool)
- [ ] Dark mode toggle erişilebilir (cihazda veya app'te)
- [ ] Test verisi var: en az 1 mission görünür

---

## Onay istiyorum

**Bu plan uygun mu? Bir şey çıkarsın, eklessin, değiştirsem — buradan yazın.**

Onay verdikten sonra test başlayacak. Manual mode notu her rapor bölümüne konacak.

Onay bekliyor...
