# İyiBiri Perf Fix Plan — canlı

**Sahip:** performance-engineer
**Açılış:** 2026-04-26
**Bağlı:** [`_perf-tracking-board.md`](./_perf-tracking-board.md), [`2026-04-26-baseline.md`](./2026-04-26-baseline.md)

## Hedef metric'ler (sprint sonu — Mayıs)

- **LCP ≤2.5s** tüm dashboard sayfalarında
- **Decoded body ≤1.5MB** ortalama
- **DOM Interactive ≤1500ms** her sayfada
- **Lighthouse Performance ≥80** (V2 hedef ≥90)
- **CLS ≤0.1** ✅ (zaten hedefe uygun)
- **TTFB ≤500ms** ✅ (zaten hedefe uygun)

## Fix planı — 7 faz

| Faz | Konu | Status | Effort | Etki | Owner | Bağlı TD |
|---|---|---|---|---|---|---|
| **1** | **next/image migration top 5 component** | 🟡 in_progress | 2h | High (LCP -%50) | perf-eng (config) + frontend-eng (component) | TD-038 |
| 2 | Loading.tsx top 11 + error.tsx top 5 | ⏳ pending | 1.5h | Medium (algılanan +%30) | perf-eng | TD-036, TD-043 |
| 3 | Auth & Cache deploy (kod hazır) | ⏳ pending | 0h kod (deploy gerek) | Medium (admin -150ms, post -200ms) | user (deploy) | TD-034, TD-035 |
| 4 | Dynamic import (canvas-confetti, qrcode, html5-qrcode) | ⏳ pending | 30m | Medium (bundle -250KB) | perf-eng + frontend-eng | TD-037 |
| 5 | Suspense boundary top 5 + RSC streaming | ⏳ pending | 2-3h | Medium (FCP) | frontend-eng + system-architect | TD-039 |
| 6 | Middleware optimize (onboarding sub-route exempt) | ⏳ pending | 1h | Low-Medium (her route -30-60ms) | auth-cap | TD-040 |
| 7 | Bundle analyzer + Lighthouse CI + Web Vitals reporting | ⏳ backlog | 1d | Long-term | perf-eng + frontend-eng | TD-041, TD-042 |

**Kritik path:** Faz 1 → 2 → 3. Mayıs sonu hedef bunlarla yakalanır. Faz 4-6 Haziran. Faz 7 Temmuz.

---

## Faz 1 — next/image migration (aktif)

### Hedef
- `/dashboard/missions` decoded **3550KB → ~700KB** (-%80)
- `/dashboard` decoded **2467KB → ~1200KB** (-%50)
- LCP ortalaması **~1900ms → ~1100ms** (-%42)

### Yapılacak

**Adım 1 — `next.config.mjs` (5 dk, perf-eng)**

```js
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ... mevcut config
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: 'cdn.iyibiri.app' },  // gelecekte
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
}

export default nextConfig
```

**Adım 2 — Top 5 component migration (~1.5 saat, frontend-eng)**

| Component | Mevcut | Yeni | Sayfalar etkilenir |
|---|---|---|---|
| `components/ui/mission-card.tsx` | `<img src={cover}>` | `<Image src={cover} width={400} height={250} loading="lazy" />` | /missions, /my-missions, /dashboard |
| `components/dashboard/mission-carousel.tsx` | `<img>` | `<Image>` | /dashboard |
| `components/dashboard/posts-rail-vol30.tsx` | `<img src={post.cover_image_url}>` | `<Image fill sizes="320px" />` | /dashboard, /discover |
| `components/dashboard/ngo-rail-vol30.tsx` | NGO logo `<img>` | `<Image width={64} height={64}>` | /dashboard, /ngos |
| `app/dashboard/discover/discover-client.tsx` | post + sponsor `<img>` | `<Image>` | /discover |

Pattern (Unsplash sized URL):
```tsx
// Eski
<img src="https://images.unsplash.com/photo-..." />

// Yeni
<Image
  src="https://images.unsplash.com/photo-...?w=400&h=250&fit=crop&q=75"
  width={400}
  height={250}
  alt={mission.title}
  loading="lazy"
  className="..."
/>
```

**Adım 3 — Test (~15 dk, perf-eng)**

Faz 1 sonrası `web-vitals-measurement` SKILL ile aynı 5 sayfa yeniden ölç:
- `/dashboard`, `/dashboard/missions`, `/dashboard/donate`, `/dashboard/ngos`, `/dashboard/profile`
- Beklenen: missions decoded -%80, LCP -800ms

Sonuç: `docs/eng/perf/2026-04-XX-after-faz-1.md`

### Riskler
- Supabase Storage URL'leri `images.remotePatterns` sözdizimine uymuyorsa fail (`pathname` regex kontrol).
- `<Image>` `width/height` zorunlu; dynamic boyut için `fill` prop + sized parent.
- Capacitor static export'ta image optimization farklı çalışıyor olabilir (test gerek).

---

## Faz 2 — Loading.tsx + error.tsx (sıradaki)

### Hedef
- 11 dashboard + 30 admin sayfada boş ekran → skeleton
- Algılanan LCP +%30

### Yapılacak

**Generic skeleton component zaten var:** `components/ui/state/loading-skeleton.tsx`

11 dashboard route için copy-paste:
```tsx
// app/dashboard/donate/loading.tsx (örnek)
import { DashboardLoadingSkeleton } from '@/components/ui/state'
export default function Loading() {
  return <DashboardLoadingSkeleton />
}
```

**Hedef sayfalar:**
- /dashboard/donate, /dashboard/donate/[ngoId], /dashboard/donate/[ngoId]/give
- /dashboard/notifications, /dashboard/posts/[id]
- /dashboard/profile/{karma,donations,badges,edit,interests}
- /dashboard/settings, /dashboard/sponsors/[id], /dashboard/tiers

**Plus error.tsx top 5:**
- /dashboard/missions/[id], /dashboard/donate, /dashboard/profile, /dashboard/ngos/[id], /dashboard/posts/[id]

---

## Faz 3 — Auth & Cache deploy (kod hazır)

Sprint sonunda kullanıcı `npm install` + `npx supabase db push` + `git push` yaptığında otomatik aktif olur.

**Etki:**
- `requireNgoAdmin` React.cache → admin form submit -150ms
- `posts/[id]` Promise.all → post detail -200ms
- Migration 044 composite index → liste query'leri -50-200ms
- Dead deps silme → npm install -30s + potansiyel bundle -730KB

**Test:** Deploy sonrası aynı 5 sayfa yeniden ölç + admin verifications sayfası özel.

---

## Faz 4 — Dynamic import

### Yapılacak

```tsx
// components/ui/celebration-overlay.tsx
import dynamic from 'next/dynamic'
const Confetti = dynamic(() => import('canvas-confetti').then(m => m.default), { ssr: false })

// app/admin/missions/[id]/qr/qr-generator.tsx
const QRCode = dynamic(() => import('qrcode'), { ssr: false })

// components/ui/qr-scanner.tsx
const Html5QrCode = dynamic(() => import('html5-qrcode').then(m => m.Html5Qrcode), { ssr: false })
```

**Etki:** Initial bundle -250-310KB; ilgili sayfalarda async load.

---

## Faz 5 — Suspense boundary

### Yapılacak

Top 5 sayfada granular streaming:

```tsx
// app/dashboard/page.tsx (örnek)
<Suspense fallback={<MissionCarouselSkeleton />}>
  <MissionCarouselAsync userId={user.id} />
</Suspense>
<Suspense fallback={<PostsRailSkeleton />}>
  <PostsRailAsync />
</Suspense>
```

**Etki:** Critical content first paint, ikincil veriler stream eder. FCP iyileşmesi.

---

## Faz 6 — Middleware optimize

### Yapılacak

`middleware.ts` `interests` query optimizasyonu:
- Sadece `/dashboard` root için profile.interests check (sub-route exempt).
- `is_super_admin` 5 dk cookie cache.

**Etki:** Her route geçişi -30-60ms.

---

## Faz 7 — Long-term (Temmuz)

- Bundle analyzer (`@next/bundle-analyzer`) kurulumu.
- Lighthouse CI (`treosh/lighthouse-ci-action`) PR threshold.
- Web Vitals reporting (`useReportWebVitals` → analytics).
- Image CDN (Supabase Storage Image Transform veya Cloudflare Images).
- Service Worker cache tuning.

---

## Test plan (faz başına)

| Faz | Test sayfaları | Beklenen Δ | Rapor |
|---|---|---|---|
| 1 | /dashboard, /missions, /donate, /ngos, /profile + 3 image-heavy ek | LCP -800ms ortalama, decoded -%50+ | `2026-04-XX-after-faz-1.md` |
| 2 | 11 yeni loading.tsx eklenen sayfa | Algılanan LCP +%30 | `2026-04-XX-after-faz-2.md` |
| 3 | Admin form submit + posts/[id] | Admin -150ms, post -200ms | `2026-04-XX-after-faz-3.md` |
| 4 | Dashboard + admin/qr + onboarding QR | Bundle -250KB | `2026-04-XX-after-faz-4.md` |
| 5 | Top 5 sayfa | FCP iyileşmesi | `2026-04-XX-after-faz-5.md` |
| 6 | Tüm dashboard route'lar | Her route -30-60ms | `2026-04-XX-after-faz-6.md` |
| 7 | Lighthouse CI baseline | Score ≥80 | `2026-04-XX-after-faz-7.md` |

Her faz raporunda **before/after delta tablosu** zorunlu.

---

## Stop condition'ları

- Faz 1 sonrası decoded -%30'dan az → image optimization fix yetersiz, hipotez yanlış. Bundle veya RSC waterfall'a geç.
- Critical regression (LCP >2x artış herhangi bir sayfada) → revert + coordinator notify.
- 7 gün cache regression yakalanırsa → Pazartesi diff'te flag, ilgili faz pause.

---

## Tahmini toplam etki (tüm fazlar uygulanırsa)

| Metric | Şimdi (5 sayfa ortalama) | Hedef sprint sonu |
|---|---:|---:|
| LCP | 1500-2000ms | ≤1200ms |
| DOM Interactive | 1523ms | ≤1200ms |
| Decoded body | 1793KB | ≤900KB |
| Bundle (initial JS) | 260KB | ≤200KB |
| Loading state coverage | 16% | 80%+ |
| Lighthouse Performance | ~65 (tahmin) | ≥80 |

---

## Self-check

- [x] 7 faz, her biri tek kategori odak
- [x] Her fix etki tahmini + effort + LNO
- [x] Severity (🔴/🟡/🟢) atanmış
- [x] Bağlı Tech Debt entry'ler referansta
- [x] Faz başına test plan
- [x] Owner atanmış
- [x] Stop condition tanımlı
- [x] Tracking board ile bağlantı

---

**Son güncelleme:** 2026-04-26 22:35 — performance-engineer
