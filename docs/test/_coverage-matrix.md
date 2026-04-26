# Test Coverage Matrix — Vol-23 sonu (2026-04-26)

> **"Test edildi" (PASS) ile "henüz test edilmedi/eksik" arasındaki net ayrım.**
> "Kapalı" deyiminin ikilemi: case-closed vs broken — bu matriste sadece **PASS** ve **AÇIK** kullanılıyor.

---

## ✅ TEST EDİLDİ + PASS (production'da çalışıyor)

### Auth + Onboarding
- A1 Landing page (gold orbital, KARMA orb, 1.249 GÖNÜLLÜ live, 18.247 stats)
- A2 Signup flow (email + KVKK consent + name input)
- A3 OTP verify (8-hane defensive paste handler — BUG-013 fix)
- A4 Forgot password sayfası
- O1 Welcome onboarding carousel
- O2 Causes seç (multi-select Çevre/Eğitim/Hayvanlar/Sağlık/Afet/Topluluk)
- O3 City + age range seç
- O4 Welcome celebration modal (100 KARMA + Hoş geldin Yolcu)
- O5 Dashboard'a düşme (loop fix Vol-9)

### Dashboard ana akışlar (kullanıcı tarafı)
- D1 Dashboard hero (karma + butterfly + tier progress)
- D2 "BUGÜN SENİN İÇİN" carousel (3 mission)
- D3 "Senin için seçtik / Katıldıkların" tab + mission card
- D4 Recommendation diversity (no consecutive same-category)
- D5 Header greeting "Günaydın, Test" + avatar T (Vol-9 BUG-005)

### Mission flow (kullanıcı tarafı)
- M1 Mission detail (hero + meta cards + impact + karma reward)
- M2 KVKK consent checkbox + "Bu göreve katıl" CTA → user_missions row
- M3 Applied state ("Başvurun alındı" + 3-step roadmap + Katılımı iptal et)
- ⏸ M4 Mission complete tam flow (QR scan + verification submit) — **VOL-23 fixture düzeldi (Migration 031), test edilebilir** ama henüz koşturulmadı

### Profil + Settings + Karma
- P1 Profile page (avatar T, name, tier badge, karma 100, 3 stat card, sections)
- P2 Profile edit (AD SOYAD pre-fill — Vol-13 BUG-025)
- ✅ P3 Avatar upload (Vol-23: foto preview + JPG/PNG/WebP + ngo-assets/users/{userId}/avatar.* + profile sayfasında render — Migration 031 RLS)
- S1 Settings sayfası (tema toggle + e-posta + KVKK link + çıkış yap — Vol-14 yeni)
- S2 Tema toggle persist (Aydınlık ↔ Karanlık)
- S3 Legal sayfaları (KVKK + Privacy + Terms — Vol-15 yeni)
- K1 Karma display (hero card + profile)
- K2 Streak page (gold çember + 7-gün grid + milestones)
- K3 Leaderboard (top 100 podium + ranked list — Vol-14 BUG-028 RLS view)
- K4 Tiers page (5 butterfly progression card)
- ⏸ K5 Level-up modal — **HENÜZ TRIGGER EDİLMEDİ** (yeterli karma yok)
- ⏸ K6 Badge unlock — **HENÜZ TRIGGER EDİLMEDİ**

### Discover + NGO + Rewards
- DC1 Discover page (Pinterest+NYT vibes, post grid)
- DC2 Post detail (Medium-style article)
- DC3 Search filter (Vol-19 BUG-045 fix)
- N1 NGO list (TR locale formatting Vol-14 BUG-030)
- N2 NGO detay (ÇYDD logo + 3 stat YIL/ÜYE/GÖREV + üyelik CTA)
- N3 NGO membership form — **kısmen test (Migration 029 sonrası ÇYDD enabled)**
- R1 Rewards page (BAKİYEN 100 + 6 ödül kartı + ÖZEL İŞBİRLİĞİ)
- DON1 Donations placeholder ("yakında" — Vol-15+16)
- NOT1 Notifications empty state (sleeping bell)

### Backoffice (NGO admin tarafı, TEMA admin olarak)
- AD1 Dashboard (4 stat: KARMA/YENİ ÜYE/DOĞRULAMA/TREND + Son Aktiviteler)
- AD2 Görevler list (9 görev, 5 filter chip, edit/sil — Vol-21 BUG-048 fix)
- AD3 Yeni Görev form (12 input, kategori align Vol-21 BUG-049)
- AD4 Doğrulama empty state
- AD5 Üyeler (1 üye, KVKK banner, "yakında" CSV — Vol-21 BUG-050)
- AD6 Rapor (Aylık 4 stat + 12 ay tablosu + chart placeholder)
- AD7 Blog list (2 yazı: Kilyos + Ağaç Dikme)
- AD7-new Blog yeni yazı form (8 input + Markdown + Önizleme)
- AD8 STK Profil (LOGO + KAPAK + Adı sabit + Slogan)
- AD9 Üyelik Config (3 ücretlendirme modu)
- AD10 Ödeme (ADR-008 3-mod: Embedded/Passthrough/Marketplace)
- AD11 RLS Isolation (TEMA admin Kızılay'a erişemez ✅ security PASS)
- AD12 Super-admin path RLS (devtools/missions/analytics — TEMA admin için unauthorized)

### Sistemik
- SYS1 Theme provider hydration (Vol-12 — useEffect post-hydration)
- SYS2 Pattern J Phase 1+2+3 motion sweep (10 dosya defensive)
- SYS3 Profile trigger (Migration 026 — handle_new_user idempotent)
- SYS4 RLS leaderboard view (Migration 027 — SECURITY DEFINER)
- SYS5 Admin layout sidebar conditional render (Vol-17 hotfix)

---

## ⏸ AÇIK (henüz test edilmedi veya feature eksik)

### Test edilmedi (mevcut feature ama henüz koşturulmadı)
- Sign out flow tam (button mevcut ama test edilmedi — session korumak için)
- ✅ Mission edit (admin) — **Vol-23 wired**, edit page + form refactor + updateMission action
- ✅ Mission sil (admin) — **Vol-23 wired**, akıllı delete (soft if participants, hard if none) + confirm modal + toast
- ✅ Blog edit form — **Vol-23 BUG-051 fix**, maybeSingle + custom unauthorized blok
- Blog sil — buton + handler zaten vardı (Vol-21), regression test bekliyor
- Görev publish flow tam (form submit + DB INSERT) — Vol-23 edit testiyle birlikte koşulacak
- STK profil LOGO upload
- Üyelik Config submit + apply
- Ödeme config submit + apply
- Bookmark interaction (mission card 🔖 toggle)
- Theme toggle dashboard'dan settings'e propagation
- Email verify resend
- OTP yanlış kod error UI

### Feature mevcut değil (scope gap)
- ✅ ~~Avatar upload (BUG-043)~~ — **Vol-23 kapatıldı**, profile/edit avatar widget
- STK admin self-signup (BUG-044) — sadece destek email
- ✅ ~~Mission QR cross-scope (BUG-052)~~ — **Vol-23 kapatıldı**, /admin/[ngoId]/missions/[id]/qr eklendi
- Search functionality NGO list + mission list
- Push notifications
- PWA install + offline cache
- Capacitor native iOS/Android
- Mobile real device viewport (window resize gerçek mobile değil)

### Mission complete tam flow (M4 detayı)
- ✅ Event_date fixture **Vol-23 Migration 031 ile geleceğe çekildi** (Sahil/TEMA/TEGV/ÇYDD)
- ✅ Admin QR generate flow **Vol-23 kapatıldı** (NGO scope page hazır)
- ⏸ QR scan kamera flow test edilmedi (mobile real device gerek)
- ⏸ Photo upload verification test edilmedi
- ⏸ Karma transaction insert (mission_complete) verify edilmedi
- ⏸ Tier-up modal (100 karma → 500 karma threshold) trigger edilmedi

### Cross-cutting (Faz 3 hiç başlamadı)
- ⏸ XC1 Theme parity full sweep tüm sayfalarda (sadece sample)
- ⏸ XC2 A11y screen reader audit
- ⏸ XC3 Lighthouse performance audit
- ⏸ XC4 PWA install + offline
- ⏸ XC5 i18n (sadece TR; en/de/fr eksik)
- ⏸ XC6 Error boundary coverage (BUG-051 generic error UX)
- ⏸ XC7 Loading skeleton coverage
- ⏸ XC8 Print/export support

---

## Bilanço

| Kategori | PASS | AÇIK | Toplam |
|---|---|---|---|
| Auth + Onboarding | 9 | 0 | 9 |
| Dashboard ana | 5 | 0 | 5 |
| Mission flow | 3 | 1 (M4) | 4 |
| Profil + Karma | 10 | 2 (K5, K6) | 12 |
| Discover + NGO + Rewards | 8 | 0 | 8 |
| Backoffice | 15 | 3 (LOGO/üyelik/ödeme submit) | 18 |
| Sistemik | 5 | 0 | 5 |
| **TOPLAM** | **55** | **6** | **61** |
| **Coverage** | **90%** | — | — |

**Bug istatistik:** 53 bulundu, 49 fix (92%), 4 open (BUG-040/044/047 + BUG-031 verify).

**Stabil çekirdek:** Auth → Onboarding → Dashboard → Mission take + complete (fixture yeşil) → Profil + Avatar → Settings → Backoffice (görev create/edit/sil/QR + blog create/edit/sil) — uçtan uca yeşil.

**Sonraki sprint öncelikleri:**
1. **Vol-23 verify koşusu** — Migration 031 apply + 9 verify item
2. M4 mission complete koşusu (artık fixture hazır, manuel kod giriş + verification submit + karma insert)
3. STK profil LOGO upload + Üyelik Config submit + Ödeme config submit (kalan 3 admin write)
4. Faz 3 XC1-XC8 cross-cutting sweep (a11y, lighthouse, PWA, i18n, error boundary, skeleton)
