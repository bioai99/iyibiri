# Vol-31 Backlog — Sponsor markalar tam ekosistem

> **Oluşturuldu:** 2026-04-26 (Vol-30.1 sırasında)
> **Bağlam:** Bahadır kararı — "Reward'lar her zaman sponsor markalar tarafından verilecek." Vol-30 sponsor şemasını + dashboard rail'lerini kuruyor; Vol-31 sponsor self-service ve admin tarafını açacak.

## Kapsam

Vol-30 sponsor entity'sini kurar (Migration 037: `sponsors` tablosu + `posts.author_type` + `rewards.sponsor_id NOT NULL`) ve dashboard'da SponsorPostsRail ile gösterir. Sponsor admin/onboarding/profile akışları **Vol-31'de** ele alınacak.

## Vol-31 Çalışma Paketleri

### V31-1 — Sponsor admin role + RLS

- Migration: `sponsor_admin_users (user_id, sponsor_id, role)` tablosu (NGO admin pattern)
- RPC: `is_sponsor_admin(u uuid, s text) returns boolean`
- RLS write policy: sponsor admin'leri kendi `sponsors` + `posts (sponsor)` + `rewards` kayıtlarını güncelleyebilir
- Super-admin (`is_super_admin`) override

### V31-2 — Sponsor admin backoffice

- Route: `/admin/sponsor/[sponsorId]`
- Sayfa: brand info edit (logo, color, kapak, açıklama, website)
- Posts CRUD (sponsor-author postlar)
- Rewards CRUD (sponsor'a bağlı ödüller — NGO admin'in mission CRUD'u gibi)
- Layout: NGO admin pattern'i (`/admin/ngo/[ngoId]`) ile birebir

### V31-3 — Sponsor self-signup

- Route: `/onboarding/sponsor` — Vol-26 NGO signup pattern (Migration 035 SECURITY DEFINER pattern)
- Form alanları: marka adı, logo, brand color, website, sorumlu kişi e-posta + telefon, vergi no
- Tablo: `sponsor_signup_requests` (status: pending/approved/rejected)
- Süper admin onaylama: `/admin/devtools/sponsor-requests`

### V31-4 — Public sponsor profile

- Route: `/dashboard/sponsors/[id]`
- Sayfa: brand kapak + logo + açıklama + website + sponsor'un postları + sponsor'un ödülleri
- Rewards rail filtresi: bu sponsor'a bağlı tüm ödüller

### V31-5 — Mission sponsorship (opsiyonel)

- Soru: NGO mission'larını sponsor finanse edebilir mi? (örn: TEMA fidan dikme — Patagonia sponsorlu)
- Şema kararı: `missions.sponsor_id` nullable mı yoksa `mission_sponsorships` ara tablosu mı?
- ADR gerekli — Vol-31 başlamadan önce Bahadır + product-analyst karar versin

## Vol-30'da yapılan ve Vol-31'in bağlı olduğu hazırlık

| Vol-30 | Vol-31 bağlılığı |
|---|---|
| Migration 037: `sponsors` tablosu | V31-1, V31-2, V31-3, V31-4 — entity zaten var |
| `posts.author_type` + `posts.sponsor_id` + XOR check | V31-2 sponsor admin'in post yazması |
| `rewards.sponsor_id NOT NULL` | V31-2 sponsor admin'in reward CRUD'u |
| `getAllSponsors / getSponsorBriefs / getSponsorById` query helper | V31-4 public profile sayfası |
| `SponsorPostsRail` (dashboard) | V31-2 admin yazma → rail'de görünür |

## Açık sorular (Vol-31 başlamadan netleşmeli)

1. Sponsor admin'i sadece **kendi markasının postlarını** mı yoksa kendi markasının **ödüllerini de** yönetir? (Default: ikisi de)
2. Sponsor signup onaylama akışı super-admin only mi yoksa otomatik mi? (Default: super-admin onayı, NGO signup pattern)
3. Mission sponsorship olacak mı? (V31-5 ADR şart)
4. Sponsor'ın blog post'una NGO tag'i eklenebilir mi (cross-promo)? (Default: hayır, basitlik için tek author)
