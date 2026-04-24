# Eng Brief — Bağış Mock Sayfalarına ComingSoonBanner Entegrasyonu

**Tarih:** 2026-04-24
**Sahip (brief):** product-analyst
**Sonraki sahip:** frontend-engineer
**Master plan:** `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md` #P0.5 + #23-26
**Priority:** P0 · **Effort:** S (1-2 gün)
**Bağlı ADR:** ADR-006 (V1'de bağış yok, V2 yönlendirici)

## 1. Problem

Mevcut 4 donation sayfası (`/dashboard/donations/[id]`, `/amount`, `/review`, `/thanks`) tamamen mock — canlı kullanıcı bu sayfalara girerse "gerçek bağış yapılıyor" izlenimi alır ve frustration olur. ADR-006 gereği V1'de bağış kapalı; V2 lansmanında yönlendirici mod açılacak.

## 2. Çözüm

Her 4 donation sayfasının üstüne `ComingSoonBanner` (2026-04-24 yazıldı, `components/ui/coming-soon-banner.tsx`) ekle. Banner:
- Hero variant — sayfa üstünde büyük
- Mesaj: "Bağış yakında — V2 lansmanı"
- Sayfa geri kalanı görünür kalır (development preview)

Alternatif (daha sert): sayfayı tamamen bir "coming soon" placeholder'a dönüştür.
**Karar:** Hero variant banner + kalan içerik muted opacity (0.5). Hem preview hem net mesaj.

## 3. Scope

### Must
- 4 sayfaya `<ComingSoonBanner size="hero" feature="Bağış akışı" />` ekle.
- Sayfa altında kalan mock içerik opacity-50 ile muted.
- "Geri" veya "Ana sayfa" butonu + bottom nav bozulmaz.

### Should
- Banner tıklanınca bekleme listesi ("Beni bildir") — V2 lansmanı için. (P1 — ayrı brief.)

### Won't
- Route'ları silme veya redirect — V2'de geri açılacak, korunsun.
- Mock data temizleme — `lib/mock-data.ts` V2 için kalsın.

## 4. Başarı metriği

- 4 sayfaya banner eklendi ✓.
- Kullanıcı dev preview'da mesajı net görüyor.
- Banner responsive (mobile + tablet).
- Dark mode uyumlu.

## 5. Teknik detay

### Sayfa 1: `/dashboard/donations/[id]/page.tsx`
```tsx
'use client'

import { ComingSoonBanner } from '@/components/ui/coming-soon-banner'
// ... existing imports

export default function DonationCampaignPage({ params }) {
  // ... existing logic

  return (
    <div>
      {/* Banner */}
      <div className="mx-4 mt-4">
        <ComingSoonBanner size="hero" feature="Bağış akışı" />
      </div>

      {/* Existing content, muted */}
      <div className="opacity-50 pointer-events-none">
        {/* ... existing JSX */}
      </div>
    </div>
  )
}
```

Aynı yapı 3 diğer sayfada:
- `/dashboard/donations/[id]/amount/page.tsx`
- `/dashboard/donations/[id]/review/page.tsx`
- `/dashboard/donations/[id]/thanks/page.tsx`

### Donation layout (varsa, yoksa oluştur)

Daha temiz yaklaşım: `/dashboard/donations/layout.tsx` oluştur, tüm donation route'lara ortak banner.

```tsx
// app/dashboard/donations/layout.tsx
import { ComingSoonBanner } from '@/components/ui/coming-soon-banner'

export default function DonationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-4 mt-4">
        <ComingSoonBanner size="hero" feature="Bağış akışı" />
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </>
  )
}
```

**Tercih:** Layout yaklaşımı — DRY.

## 6. Test

- Her 4 sayfaya giriş — banner görünüyor mu?
- Dark mode uyumu.
- Mobile + tablet responsive.
- `pointer-events-none` dev console test — CTA'lar tıklanamaz.
- Bottom nav hala çalışıyor (layout dışı).

## 7. Dependencies

- `components/ui/coming-soon-banner.tsx` ✓ (yazıldı 2026-04-24).
- 4 donation sayfa file yapısı ✓ (atlas Bölüm 3).

## 8. Handoff

**frontend-engineer:**
1. `app/dashboard/donations/layout.tsx` oluştur.
2. Test — banner görünür, içerik muted.
3. Journal + dashboard güncelle.

**Toplam:** 1-2 saat iş. En küçük P0.
