# İyiBiri Full Rebuild Design Spec

> **For agentic workers:** Bu spec tamamlandıktan sonra writing-plans skill ile implementation planına geçilecek.

**Goal:** İyiBiri'yi mock data'dan tam Supabase entegrasyonuna taşımak, tüm doğrulama yöntemlerini çalıştırmak ve Duolingo-DNA'sına sahip sıfırdan bir UI inşa etmek — 1 hafta içinde demo kalitesinde.

**Architecture:** Next.js 14 App Router üzerinde Supabase PostgreSQL backend. Kullanıcıya özgü tüm state (karma, misyonlar, ödüller) Supabase'de yaşar. UI sıfırdan design system ile inşa edilir, subagent yapısıyla paralel geliştirme.

**Tech Stack:** Next.js 14, TypeScript, Supabase (Auth + DB + Storage), Tailwind CSS, Framer Motion (animasyonlar), qrcode + html5-qrcode (QR üretme/tarama)

---

## 1. Hedef & Kapsam

### Demo için çalışması gerekenler
- Kullanıcı kaydı ve girişi
- Misyon listeleme, detay görüntüleme, misyon alma
- Tüm doğrulama yöntemleri: otomatik, kod, fotoğraf, QR
- Karma kazanma ve bakiye takibi
- Ödül listeleme ve kullanma
- Kullanıcı profili (karma, level, streak, rozetler)
- Minimal backoffice: QR üretme + misyon yönetimi

### Kapsam dışı (şimdilik)
- Gerçek ödül teslimatı (email, SMS kodu)
- Push notification
- Sosyal özellikler (arkadaş, leaderboard)
- STK / firma full backoffice

---

## 2. Supabase Veritabanı Şeması

### `profiles`
```sql
id          uuid references auth.users PK
name        text
avatar_url  text
karma_total integer default 0
level       integer default 1
streak      integer default 0  -- aylık
last_active date
created_at  timestamptz
```

### `ngos`
```sql
id           text PK  -- 'tema', 'haytap', vb.
name         text
short_name   text
tagline      text
description  text
category     text
color_accent text
logo_url     text
website      text
```

### `missions`
```sql
id              text PK
title           text
description     text
long_description text
ngo_id          text references ngos
category        text
difficulty      text  -- easy/medium/hard
karma           integer
duration        text
domain          text  -- nature/education/social/financial
style           text  -- remote/outside/both
verify_method   text  -- auto/code/photo/qr
verify_code     text  -- kod ve QR için geçerli kod
verify_hint     text
featured        boolean default false
active          boolean default true
steps           jsonb -- adım listesi
impact_statement text
qr_code_data    text  -- üretilmiş QR kod base64
```

### `rewards`
```sql
id            text PK
title         text
brand         text
brand_logo    text
description   text
karma_required integer
category      text
active        boolean default true
```

### `user_missions`
```sql
id              uuid PK
user_id         uuid references profiles
mission_id      text references missions
status          text  -- available/taken/completed
taken_at        timestamptz
completed_at    timestamptz
verification_data jsonb  -- fotoğraf url, girilen kod, vb.
karma_awarded   integer
```

### `karma_transactions`
```sql
id          uuid PK
user_id     uuid references profiles
amount      integer  -- pozitif: kazanıldı, negatif: harcandı
type        text     -- mission_complete/reward_redemption
reference_id text    -- mission_id veya reward_id
description text
created_at  timestamptz
```

### `reward_redemptions`
```sql
id         uuid PK
user_id    uuid references profiles
reward_id  text references rewards
karma_spent integer
status     text  -- pending/completed
created_at timestamptz
```

---

## 3. Doğrulama Akışı

### auto
Kullanıcı "Tamamladım" der → `user_missions.status = completed` → karma yazılır.

### code
Kullanıcı bir kod girer → `missions.verify_code` ile karşılaştırılır → eşleşirse tamamlanır.

### photo
Kullanıcı fotoğraf yükler → Supabase Storage'a kaydedilir (`verification-photos/{user_id}/{mission_id}`) → demo için otomatik onaylanır, `verification_data.photo_url` doldurulur.

### qr
Backoffice `missions.verify_code` değerini QR koda encode eder → `missions.qr_code_data` olarak saklar.
Kullanıcı mobil uygulamada kamerayı açar (html5-qrcode) → QR taranır → code akışına düşer.

---

## 4. UI Design System

### Renk Paleti
```
Primary:     #F4B942  (amber — mevcut)
Primary Dark:#E09B20
Success:     #22C55E  (karma kazanma, tamamlama)
Danger:      #EF4444
Background:  #FAFAF9  (warm white)
Surface:     #FFFFFF
Text:        #1C1917  (stone-900)
Muted:       #78716C  (stone-500)
Border:      #E7E5E4  (stone-200)

Domain renkleri (mevcut korunur):
Nature:      #10B981 (emerald)
Education:   #3B82F6 (blue)
Social:      #F43F5E (rose)
Financial:   #F59E0B (amber)
```

### Tipografi
```
Heading:  Plus Jakarta Sans, Bold/ExtraBold
Body:     Inter, Regular/Medium
Mono:     JetBrains Mono (kod girişleri için)
```

### Bileşenler (Design System)
- `KarmaCounter` — animated sayaç, +karma kazanınca yukarı zıplar
- `MissionCard` — fotoğraflı, domain renkli, difficulty badge
- `XPBar` — sayfa açılışında dolan animasyonlu progress bar
- `TierBadge` — tier ismi + rengi + icon
- `StreakFlame` — yanıp sönen ateş animasyonu
- `RewardCard` — kilitli/açık state, karma eşiği progress
- `VerificationSheet` — bottom sheet, yönteme göre içerik değişir
- `CelebrationOverlay` — konfeti + karma animasyonu tam ekran

### Animasyon Prensipleri (Framer Motion)
```
Sayfa geçişi:    fade + slide (150ms ease-out)
Card hover:      scale(1.02) + shadow (100ms)
Bottom sheet:    y: 100% → 0 spring animasyonu
Karma sayacı:    spring, bounce: 0.4
Konfeti:         canvas-confetti, 2 saniyelik burst
Level-up:        tam ekran overlay, scale + fade sekansı
Progress bar:    0 → hedef, 800ms ease-in-out, sayfa mount'ta
```

---

## 5. Ekran Listesi (Sıfırdan İnşa)

### Public
- `/` — Landing (mevcut korunabilir, ufak polish)
- `/auth/login` — Giriş
- `/auth/signup` — Kayıt

### Onboarding
- `/onboarding` — Hoşgeldin, app turu
- `/onboarding/quiz` — İlgi alanı seçimi (NGO/domain bazlı)

### Dashboard
- `/dashboard` — Ana ekran: karma hero, streak, misyon kartları
- `/dashboard/missions` — Tüm misyonlar, filtreli
- `/dashboard/missions/[id]` — Misyon detay (immersive tam ekran)
- `/dashboard/missions/[id]/complete` — Doğrulama akışı
- `/dashboard/my-missions` — Aldığım / tamamladıklarım
- `/dashboard/ngos` — STK listesi
- `/dashboard/ngos/[id]` — STK detay
- `/dashboard/rewards` — Ödüller (kilitli/açık)
- `/dashboard/profile` — Profil, tier, rozetler
- `/dashboard/profile/edit` — Profil düzenleme

### Backoffice (minimal)
- `/admin` — Giriş korumalı
- `/admin/missions` — Misyon listesi + QR üretme
- `/admin/missions/[id]/qr` — QR görüntüle + indir

---

## 6. Veri Akışı

```
Supabase Auth → profiles tablosu (trigger ile otomatik create)
mock-data.ts → Supabase seed (ngos, missions, rewards tabloları)
Kullanıcı akışı:
  login → session cookie → middleware kontrolü
  mission al → user_missions satırı oluşur (status: taken)
  tamamla → verify → user_missions güncellenir (status: completed)
           → karma_transactions satırı eklenir
           → profiles.karma_total güncellenir (trigger veya client)
  ödül kullan → karma yeterliyse reward_redemptions satırı
              → karma_transactions negatif satır
              → profiles.karma_total düşer
```

---

## 7. Subagent Yapısı (Paralel Geliştirme)

Her sub-proje bağımsız, sırayla veya paralel çalışabilir:

| Sub-proje | Kapsam | Bağımlılık |
|-----------|--------|------------|
| **1. DB & Seed** | Supabase şema, migration, seed data | Yok |
| **2. Auth & Profil** | Kayıt/giriş, profil sayfası, onboarding | DB |
| **3. Design System** | Tüm base bileşenler, animasyonlar, tokens | Yok |
| **4. Dashboard & Misyonlar** | Listeleme, detay, filtre | DB + Design System |
| **5. Doğrulama Akışı** | auto/code/photo/QR tamamlama, karma yazımı | DB + Misyonlar |
| **6. Ödüller** | Listeleme, unlock, redemption | DB + Karma |
| **7. Backoffice** | Misyon yönetimi, QR üretme/indirme | DB |

---

## 8. Teknik Notlar

- **Supabase RLS:** Her tablo için Row Level Security — kullanıcı sadece kendi `user_missions`, `karma_transactions`, `reward_redemptions` satırlarını görebilir
- **Karma hesabı:** `profiles.karma_total` Supabase trigger ile otomatik güncellenir (karma_transactions INSERT'te)
- **QR kütüphanesi:** `qrcode` (npm) → backoffice'te üretim; `html5-qrcode` → mobil tarama
- **Fotoğraf upload:** Supabase Storage bucket `verification-photos`, public değil, signed URL ile erişim
- **Seed script:** `scripts/seed.ts` — mock-data.ts'i okur, Supabase'e yazar
- **Admin koruması:** `/admin` prefix'i middleware'de ayrı cookie ile korunur

---

## 9. Doğrulama (Demo Test Planı)

1. Yeni kullanıcı kaydı → profil oluştu mu? (Supabase dashboard'dan kontrol)
2. Otomatik misyon tamamla → karma bakiyesi arttı mı?
3. Kod doğrulamalı misyon → yanlış kod reddedildi, doğru kod kabul edildi mi?
4. Fotoğraf yükle → Storage'da dosya var mı, misyon tamamlandı mı?
5. QR tara → backoffice'teki QR'ı tara, misyon tamamlandı mı?
6. Ödül kullan → karma düştü mü, redemption kaydı oluştu mu?
7. Level-up animasyonu tetiklendi mi?
8. Streak doğru güncelleniyor mu?
