# İyiBiri Manual Test Scenarios

> 42 flow + 8 cross-cutting concern
> Son güncelleme: 2026-04-25

## Özet

| Kategori | Flow Sayısı |
|----------|-------------|
| Auth (login/signup/verify/forgot/reset) | 6 |
| Onboarding (welcome/causes/city) | 4 |
| Dashboard (feed/hero/carousel/tabs) | 1 |
| Mission (detail/take/states/verify/abandon) | 6 |
| NGO (profile/membership/success) | 3 |
| Browse (missions list/discover/ngos) | 3 |
| Gamification (tiers/streak/leaderboard/badges) | 4 |
| Rewards (list/detail+redeem) | 2 |
| Profile (view/edit/interests) | 3 |
| Content (saved/my-missions/notifications/posts) | 4 |
| Donation (campaign flow) | 1 |
| Admin (login/dashboard/routes) | 3 |
| Navigation + State Machine | 2 |
| Cross-cutting (theme/motion/safe-area/native/empty/optimistic/idempotent/errors) | 8 |

---

## Kritik Akışlar (Öncelikli Test)

### 1. Yeni Kullanıcı Tam Yolculuğu
`/app-start` → onboarding (welcome → causes → city) → auth (signup → verify) → dashboard (karma=0, empty state) → ilk görev al → tamamla → karma kazan

### 2. Görev Alma + Tamamlama
Dashboard → görev detay → "Bu göreve katıl" → applied state → complete → verification → celebration → dashboard (karma artmış)

### 3. STK Üyelik + Görev
NGO profil → "Gönüllü ol" → üyelik form → KVKK → ödeme → success → members_only görev al

### 4. Ödül Kullanma
Dashboard → ödüller → detay → "Ödülü Kullan" → karma düşer → kullanıldı state

---
