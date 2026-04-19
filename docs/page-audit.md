# İyiBiri — Sayfa Audit Raporu

> Son güncelleme: 2026-04-19
> Bu dosya iyileştirmeler yapıldıkça güncellenir.

## Özet

| Seviye | Sayfa | Oran |
|--------|-------|------|
| 🟢 Production | 21 | %52 |
| 🟡 Beta | 7 | %18 |
| 🔴 Prototype | 9 | %22 |
| ⚫ Broken | 1 | %3 |
| **Toplam** | **40** | |

## Sistemik Sorunlar

- [ ] Sıfır `loading.tsx` — hiçbir sayfada yükleniyor durumu yok
- [ ] 6 sayfa eski beyaz tema (quiz, ngos list, badges, interests, my-missions, teşekkürler)
- [ ] Bağış akışı (4 sayfa) tamamen sahte — güzel UI ama sıfır backend
- [ ] Leaderboard + Notifications + Streak — güzel mockup, sıfır gerçek veri
- [ ] my-missions — tamamen legacy, gerçek user_missions tablosundan bağımsız
- [ ] interests sayfası kırık — kaydet butonu çalışmıyor

---

## Sayfa Detayları

### AUTH

| # | Sayfa | Route | Durum | UI | Veri | Not |
|---|-------|-------|-------|-----|------|-----|
| 1 | Landing | `/` | 🟢 | 9/10 | Statik | Three.js, GSAP, scroll animations |
| 2 | Splash | `/app-start` | 🟢 | 7/10 | Gerçek | Auth check + redirect |
| 3 | Login | `/auth/login` | 🟢 | 8/10 | Gerçek | Google + Apple OAuth |
| 4 | Signin | `/auth/signin` | 🟡 | 8/10 | Gerçek | "Şifremi unuttum" ölü link |
| 5 | Signup | `/auth/signup` | 🟢 | 8/10 | Gerçek | KVKK + password strength |
| 6 | Verify OTP | `/auth/verify` | 🟢 | 9/10 | Gerçek | Auto-submit, paste, countdown |

### ONBOARDING

| # | Sayfa | Route | Durum | UI | Veri | Not |
|---|-------|-------|-------|-----|------|-----|
| 7 | Redirect | `/onboarding` | 🟢 | — | — | Sadece redirect |
| 8 | Welcome | `/onboarding/welcome` | 🟢 | 8/10 | Statik | 3-slide carousel, animasyonlu |
| 9 | Causes | `/onboarding/causes` | 🟡 | 8/10 | localStorage | DB'ye sync dashboard'da yapılıyor |
| 10 | City | `/onboarding/city` | 🟡 | 8/10 | localStorage | DB'ye sync dashboard'da yapılıyor |
| 11 | Quiz | `/onboarding/quiz` | 🟡 | 6/10 | localStorage | Eski tasarım dili, kullanılmıyor olabilir |

### DASHBOARD — ANA

| # | Sayfa | Route | Durum | UI | Veri | Not |
|---|-------|-------|-------|-----|------|-----|
| 12 | Dashboard | `/dashboard` | 🟢 | 8/10 | Gerçek | Ana ekran, tam entegre |
| 13 | Discover | `/dashboard/discover` | 🟡 | 7/10 | Gerçek | Blog + kategoriler + sponsorlar |
| 14 | Missions List | `/dashboard/missions` | 🟢 | 7/10 | Gerçek | Filter + liste |
| 15 | Mission Detail | `/dashboard/missions/[id]` | 🟢 | 8/10 | Gerçek | Katıl + state management |
| 16 | Mission Complete | `/dashboard/missions/[id]/complete` | 🟢 | 7/10 | Gerçek | QR/kod doğrulama + karma |
| 17 | My Missions | `/dashboard/my-missions` | 🟢 | 7/10 | Gerçek | Aktif/Tamamlanan tab, gerçek user_missions |

### DASHBOARD — İYİLİK ÖNCÜLERİ

| # | Sayfa | Route | Durum | UI | Veri | Not |
|---|-------|-------|-------|-----|------|-----|
| 18 | NGO List | `/dashboard/ngos` | 🟢 | 7/10 | Gerçek | Yeni tema, search, kart tasarımı |
| 19 | NGO Detail | `/dashboard/ngos/[id]` | 🟢 | 7/10 | Gerçek | Profil + üyelik yönetimi |
| 20 | Membership Form | `/dashboard/ngos/[id]/membership` | 🟢 | 7/10 | Gerçek | Parametrik form + KVKK |
| 21 | Membership Success | `/dashboard/ngos/[id]/membership/success` | 🟢 | 7/10 | Gerçek | Konfeti + pending/active |

### DASHBOARD — BLOG

| # | Sayfa | Route | Durum | UI | Veri | Not |
|---|-------|-------|-------|-----|------|-----|
| 22 | Post Detail | `/dashboard/posts/[id]` | 🟢 | 7/10 | Gerçek | Like + paylaş + üyelik CTA |

### DASHBOARD — BAĞIŞ (TAMAMEN MOCK)

| # | Sayfa | Route | Durum | UI | Veri | Not |
|---|-------|-------|-------|-----|------|-----|
| 23 | Campaign Detail | `/dashboard/donations/[id]` | 🔴 | 8/10 | **MOCK** | Güzel UI, sıfır backend |
| 24 | Amount Select | `/dashboard/donations/[id]/amount` | 🔴 | 8/10 | **MOCK** | Hardcoded tutarlar |
| 25 | Review | `/dashboard/donations/[id]/review` | 🔴 | 8/10 | **MOCK** | Sahte kart bilgisi |
| 26 | Thanks | `/dashboard/donations/[id]/thanks` | 🔴 | 9/10 | **MOCK** | Güzel animasyon, sahte veri |

### DASHBOARD — PROFİL

| # | Sayfa | Route | Durum | UI | Veri | Not |
|---|-------|-------|-------|-----|------|-----|
| 27 | Profile | `/dashboard/profile` | 🟢 | 7/10 | Gerçek | Karma, üyelikler, timeline boş state |
| 28 | Edit Profile | `/dashboard/profile/edit` | 🟢 | 8/10 | Gerçek | Form + kaydet |
| 29 | Badges | `/dashboard/profile/badges` | 🟢 | 8/10 | Gerçek | 6 rozet gerçek kriterlerle, yeni tema |
| 30 | Interests | `/dashboard/profile/interests` | 🟢 | 8/10 | Gerçek | Çalışan toggle + kaydet, yeni tema |

### DASHBOARD — ÖDÜLLER

| # | Sayfa | Route | Durum | UI | Veri | Not |
|---|-------|-------|-------|-----|------|-----|
| 31 | Rewards List | `/dashboard/rewards` | 🟢 | 7/10 | Gerçek | Ödül listesi |
| 32 | Reward Detail | `/dashboard/rewards/[id]` | 🟢 | 7/10 | Gerçek | Redeem akışı |

### DASHBOARD — DİĞER

| # | Sayfa | Route | Durum | UI | Veri | Not |
|---|-------|-------|-------|-----|------|-----|
| 33 | Saved Missions | `/dashboard/saved` | 🟡 | 7/10 | Gerçek | Kayıtlı görevler |
| 34 | Leaderboard | `/dashboard/leaderboard` | 🔴 | 8/10 | **MOCK** | Güzel podium, sıfır veri |
| 35 | Notifications | `/dashboard/notifications` | 🔴 | 8/10 | **MOCK** | Güzel kartlar, sıfır veri |
| 36 | Streak | `/dashboard/streak` | 🔴 | 9/10 | **MOCK** | Güzel coin, sıfır veri |

### ADMİN

| # | Sayfa | Route | Durum | UI | Veri | Not |
|---|-------|-------|-------|-----|------|-----|
| 37 | Admin Login | `/admin/login` | 🟢 | 5/10 | Gerçek | Basit ama çalışıyor |
| 38 | Admin Missions | `/admin/missions` | 🟢 | 5/10 | Gerçek | Görev listesi |
| 39 | QR Generator | `/admin/missions/[id]/qr` | 🟢 | 5/10 | Gerçek | QR kodu oluşturucu |

### DİĞER

| # | Sayfa | Route | Durum | UI | Veri | Not |
|---|-------|-------|-------|-----|------|-----|
| 40 | Teşekkürler | `/tesekkurler` | 🟡 | 6/10 | Gerçek | Eski tema, waitlist onay |

---

## Aksiyon Önerileri (Öncelik Sırasıyla)

### Öncelik 1: Kırık/Legacy Temizliği ✅
- [x] `/dashboard/profile/interests` — tamamen yeniden yazıldı, gerçek DB kayıt (2026-04-19)
- [x] `/dashboard/my-missions` — mock kaldırıldı, gerçek user_missions'a bağlandı (2026-04-19)
- [x] `/onboarding/quiz` — kullanılmıyordu, kaldırıldı (2026-04-19)

### Öncelik 2: Eski Tema Güncellemesi ✅
- [x] `/dashboard/ngos` list — yeni tema'ya taşındı, search + kart tasarımı (2026-04-19)
- [x] `/dashboard/profile/badges` — yeni tema + gerçek veri, 6 rozet gerçek kriterlerle (2026-04-19)
- [x] `/tesekkurler` — dead code, silindi (2026-04-19)

### Öncelik 3: Mock → Gerçek Veri
- [ ] `/dashboard/streak` — profiles.current_streak + last_mission_week kullan
- [ ] `/dashboard/leaderboard` — gerçek karma sıralaması query'si
- [ ] `/dashboard/notifications` — bildirim tablosu + tetikleyiciler

### Öncelik 4: Bağış Akışı
- [ ] Ödeme entegrasyonu araştırması (iyzico/Stripe)
- [ ] Bağış kampanya tablosu + CRUD
- [ ] 4 sayfalık akışı gerçek backend'e bağla

### Öncelik 5: Eksik Altyapı
- [ ] `loading.tsx` dosyaları — en azından dashboard altına
- [ ] "Şifremi unuttum" akışı (auth/signin'de ölü link)
