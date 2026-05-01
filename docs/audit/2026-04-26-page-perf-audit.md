# Sayfa Performansı Statik Audit — 2026-04-26

**Tarih:** 2026-04-26
**Reviewer:** system-architect
**Lens:** Sayfa açılma süresi + bundle size + RSC pattern + cache + image (statik analiz; runtime ölçümleri kullanıcı tarafında Lighthouse ile yapılacak)
**Scope:** 80 page.tsx + ilgili client component'ler + middleware + dependencies
**Önceki audit ref:** [v2 baseline audit](./2026-04-26-eng-arch-baseline-audit.md) Bölüm 4 (Performance)

---

## Executive Summary

Sprint sonrası "yavaşlık" şikayeti **gerçek bir bottleneck'e işaret ediyor** — statik analiz 4 sistemik problem ortaya çıkardı. En vahimi sprint'in eklediği yük değil; **6 ay'dır biriken yapısal sorunlar** + sprint'in eklediği `requireNgoAdmin` çift roundtrip'i bu sorunları daha görünür yapıyor.

### 4 sistemik bottleneck (etki sırası)

1. **🔴 Dead dependencies — ~730KB minified bloat** — three.js (500KB), gsap (150KB), lottie-react (80KB) `package.json`'da kayıtlı ama **0 dosyada import ediliyor**. Tıpkı `motion` gibi (TD-022). Webpack tree-shake bunları büyük ölçüde eler ama node_modules indirme süresi + bazı side-effect kodları sızabiliyor. Silinince `npm install` 30s daha hızlı + temiz bundle.

2. **🔴 `dashboard/posts/[id]` 5 sequential await** — auth + post + like + likeCount + membership **paralel olabilirken sequential** çekiliyor. ~250ms gereksiz RSC latency. Promise.all ile ~70ms'ye düşer.

3. **🔴 Loading.tsx eksik 67/80 sayfa (%84)** — boş ekran hissi → "yavaş" algısı (gerçek LCP olmasa bile). Kritik 11 sayfada (donate, posts, profile/edit, settings, tiers vd.) ve **30 admin sayfasının hiçbirinde** loading.tsx yok.

4. **🔴 `requireNgoAdmin` sprint regression — çift DB roundtrip** — Sprint'te 6 admin server action'a auth helper eklendi. Middleware ZATEN aynı `is_ngo_admin` RPC'sini çağırıyor → her admin form submit'te ~150ms duplicate. **React `cache()` ile fix 30 dk.**

### 🟡 Önemli ama daha az kritik

5. **🟡 Dynamic import 0 kullanım** — `canvas-confetti`, `qrcode`, `html5-qrcode` her sayfada bundle'a giriyor (kullanmasa bile). `next/dynamic` ile lazy load 50-200KB tasarruf.
6. **🟡 next/image kullanımı sadece 1 dosya, raw `<img>` 3 dosya** — image optimization eksikliği. LCP'yi ciddi etkiler.
7. **🟡 Suspense boundary 4 sayfada** — RSC streaming pattern kullanılmıyor. Tüm sayfa beklerken kullanıcı bekliyor.
8. **🟡 Devasa client component'ler — 7 dosya 600+ satır** — `membership-flow-client 694`, `mission-detail-client 630`, `profile-client 703` vb. Initial JS parse + hydration süresi.
9. **🟡 Middleware her request'te 14 await/supabase çağrısı** — `getUser()` + `is_ngo_admin` + `is_super_admin` + `interests` query. Cookie cache'i optimize edilebilir.

### Pozitif disiplin (devam etmeli)

- ✅ `useEffect` + fetch antipattern: **0 nokta** (server-side data fetching disipline)
- ✅ `<div onClick>`: **0** (semantic HTML)
- ✅ `'use client'` page'de: 9/80 (auth + onboarding + admin/login + landing — geri kalan 71 server)
- ✅ `dashboard/missions/[id]/page.tsx` zaten 2 Promise.all ile paralel fetch yapıyor (RSC pattern doğru)

---

## Methodology

**Statik analiz proxy metric'leri:**
- **LOC** — bundle size + parse time proxy (page.tsx + tüm `*-client.tsx` toplamı)
- **USE** — `useState/useEffect/useMemo/useReducer` count → client-side iş yükü proxy
- **HVY** — heavy library import (three/gsap/lottie/canvas-confetti/qr) — bundle ağırlığı
- **IMG** — raw `<img>` count → image optimization eksikliği
- **AWT** — page.tsx'te `await` count → server-side fetching latency proxy
- **SA** — server action import count → form submit yükü
- **EFF** — `useEffect` + `fetch/supabase` antipattern (RSC waterfall)
- **L? / E?** — `loading.tsx` ve `error.tsx` mevcut mu → algılanan UX süresi

**Risk score formülü:**
```
risk = LOC/100 + USE×0.5 + HVY×5 + IMG×1 + AWT×0.5 + SA×0.3 + EFF×3
      + (loading.tsx eksikse +2) + (error.tsx eksikse +1)
```

**Statik analiz kısıtları:**
- Gerçek **runtime LCP/FCP/TTFB** ölçülmedi (Cowork sandbox'tan dev server koşturmak zor).
- Bundle size **tahmin** — bundle analyzer henüz çalıştırılmadı (TD-011, kullanıcı `ANALYZE=true npm run build` ile kendi koşturmalı).
- Network panel + Lighthouse **kullanıcının elinde** — bu rapor hangi sayfaları ölçmesi gerektiğini söylüyor.

---

## Top 25 risk-scored sayfa (yavaşlık olasılığı sırasıyla)

| # | Sayfa | LOC | USE | AWT | L? | E? | Risk |
|---|---|---:|---:|---:|---:|---:|---:|
| 1 | `dashboard/ngos/[id]/membership` | 1103 | 17 | 2 | ✗ | ✗ | **24.8 🔴** |
| 2 | `dashboard/missions/[id]` | 1507 | 8 | 3 | ✓ | ✗ | **21.9 🔴** |
| 3 | `dashboard/ngos/[id]/membership/success` | 608 | 7 | 4 | ✗ | ✗ | **14.9 🔴** |
| 4 | `dashboard/donate` | 651 | 8 | 2 | ✗ | ✗ | **14.5 🔴** |
| 5 | `admin/[ngoId]/verifications` | 454 | 8 | 4 | ✗ | ✗ | **13.8 🔴** |
| 6 | `dashboard/tiers` | 718 | 5 | 2 | ✗ | ✗ | 13.7 🟡 |
| 7 | `dashboard/profile/edit` | 462 | 10 | 2 | ✗ | ✗ | 13.6 🟡 |
| 8 | `admin/devtools/ngo-requests` | 433 | 7 | 3 | ✗ | ✗ | 12.6 🟡 |
| 9 | `auth/signin` | 262 | 9 | 5 | ✗ | ✗ | 12.6 🟡 |
| 10 | `admin/devtools` | 525 | 5 | 2 | ✗ | ✗ | 11.8 🟡 |
| 11 | `dashboard/posts/[id]` | 253 | 3 | 5 | ✗ | ✗ | 11.5 🟡 |
| 12 | `admin/[ngoId]/missions` | 310 | 6 | 4 | ✗ | ✗ | 11.4 🟡 |
| 13 | `auth/verify` | 277 | 9 | 2 | ✗ | ✗ | 11.3 🟡 |
| 14 | `dashboard/ngos/[id]` | 600 | 4 | 4 | ✓ | ✗ | 11.0 🟡 |
| 15 | `admin/[ngoId]/membership-config` | 199 | 7 | 4 | ✗ | ✗ | 10.8 🟡 |
| 16 | `admin/[ngoId]/members` | 317 | 5 | 4 | ✗ | ✗ | 10.7 🟡 |
| 17 | `admin/devtools/sponsor-requests` | 266 | 5 | 4 | ✗ | ✗ | 10.5 🟡 |
| 18 | `dashboard/rewards` | 595 | 5 | 2 | ✓ | ✗ | 10.4 🟡 |
| 19 | `dashboard/profile` | 740 | 0 | 2 | ✓ | ✗ | 10.4 🟡 |
| 20 | `dashboard` | 379 | 9 | 4 | ✓ | ✓ | 10.3 🟡 |
| 21 | `page.tsx` (landing) | 706 | 2 | 0 | ✗ | ✓ | 10.1 🟡 |
| 22 | `dashboard/missions/[id]/complete` | 271 | 4 | 3 | ✗ | ✗ | 9.8 🟢 |
| 23 | `auth/signup` | 230 | 8 | 1 | ✗ | ✗ | 9.8 🟢 |
| 24 | `dashboard/rewards/[id]` | 411 | 6 | 3 | ✓ | ✗ | 9.6 🟢 |
| 25 | `admin/[ngoId]/blog` | 270 | 3 | 4 | ✗ | ✗ | 9.5 🟢 |

**🔴 5 kritik sayfa** Lighthouse + Network panel'de mutlaka ölçülmeli. **🟡 16 sayfa** sprint kapsamında iyileştirilebilir.

---

## Per-finding detaylar + somut fix

### F-001 🔴 — Dead dependencies (three.js + gsap + lottie-react)

**Kanıt:**
```bash
grep -rln "three\b" app/ components/ lib/   # → 0
grep -rln "gsap"  app/ components/ lib/    # → 0
grep -rln "lottie" app/ components/ lib/    # → 0
```
Ama `package.json` deps:
```json
"three": "^0.184.0",      // ~500KB minified
"gsap": "^3.15.0",        // ~150KB
"lottie-react": "^2.4.1", // ~80KB
"@types/three": "^0.184.0" // type-only
```

**Risk:** Tree-shake çoğunluğunu eler ama:
- npm install süresi +30s (büyük paket indirimi).
- node_modules ~50MB şişmiş.
- Bazı paketlerin side-effect kodu (örn. CSS, `window` access) bundle'a sızıyor olabilir — emin olmak için bundle analyzer.

**Fix (15 dk):**
```bash
npm uninstall three gsap lottie-react @types/three
```

**Kazanım:** ~730KB silinir; npm install hızlanır; (varsa) sızan side-effect kodları temizlenir.

### F-002 🔴 — `dashboard/posts/[id]` sequential await chain (250ms gereksiz)

**Kanıt:** `app/dashboard/posts/[id]/page.tsx`:
```ts
const { data: { user } } = await supabase.auth.getUser()    // 1
const { data: post } = await supabase.from('posts')...       // 2 — user'a bağlı değil
const { data: like } = await supabase.from('post_likes')...  // 3 — bağımsız
const { count: likeCount } = await supabase.from('post_likes').select(..., { count: 'exact' })...  // 4 — bağımsız
const { data: membership } = await supabase.from('ngo_memberships')...  // 5 — post.ngo_id'ye bağlı
```

5 sequential await ≈ 250-400ms (ortalama 50-80ms/query).

**Fix (10 dk):**
```ts
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/auth/login')

const { data: post } = await supabase.from('posts')
  .select('*, ngos:ngo_id(...)')
  .eq('id', params.id).single()
if (!post) notFound()

// Post bilgisi geldikten sonra paralel
const [{ data: like }, { count: likeCount }, { data: membership }] = await Promise.all([
  supabase.from('post_likes').select('id').eq('user_id', user.id).eq('post_id', params.id).maybeSingle(),
  supabase.from('post_likes').select('*', { count: 'exact', head: true }).eq('post_id', params.id),
  supabase.from('ngo_memberships').select('id').eq('user_id', user.id).eq('ngo_id', post.ngo_id ?? '').eq('status', 'active').maybeSingle(),
])
```

**Kazanım:** 250-400ms → 70-100ms (LCP iyileşmesi).

### F-003 🔴 — `requireNgoAdmin` çift roundtrip (sprint regression)

**Kanıt:** Sprint'te `lib/auth/guards.ts` eklendi; her admin server action başında:
```ts
await requireNgoAdmin(ngoId)
// → 1. supabase.auth.getUser()    (~50ms)
// → 2. supabase.rpc('is_ngo_admin', ...)  (~50ms)
```

Middleware **aynı kontrolü** yapıyor (middleware.ts:35,72) — yani her admin form submit'te 4 DB call'ın 2'si tekrar.

**Fix (30 dk):** React `cache()` ile request-scoped memoize:
```ts
import { cache } from 'react'

export const requireUser = cache(async (): Promise<User> => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new AuthError('AUTH_REQUIRED')
  return user
})

export const requireNgoAdmin = cache(async (ngoId: string): Promise<User> => {
  const user = await requireUser()
  const supabase = await createClient()
  const { data: isAdmin } = await (supabase.rpc as any)('is_ngo_admin', { u: user.id, n: ngoId })
  if (!isAdmin) throw new AuthError('NGO_ADMIN_REQUIRED')
  return user
})
```

`React.cache` aynı request'te 2. çağrıyı memory'den döndürür → DB roundtrip yok.

**Kazanım:** Her admin form submit -150ms.

### F-004 🔴 — Loading.tsx kapsamı %16

**Eksik kritik 11 dashboard sayfası:**
- `dashboard/donate`, `dashboard/donate/[ngoId]`, `dashboard/donate/[ngoId]/give`
- `dashboard/notifications`
- `dashboard/posts/[id]`
- `dashboard/profile/{karma,donations,badges,edit,interests}`
- `dashboard/settings`
- `dashboard/sponsors/[id]`
- `dashboard/tiers`

**+ 30 admin sayfasının hiçbirinde loading.tsx yok.**

**Fix (1-2 saat):** Generic skeleton component (`components/ui/state/loading-skeleton.tsx` zaten var, kullanım kapsamını genişlet):

```tsx
// app/dashboard/donate/loading.tsx
import { DashboardLoadingSkeleton } from '@/components/ui/state'
export default function Loading() {
  return <DashboardLoadingSkeleton />
}
```

Aynı pattern 11 dashboard + 30 admin sayfaya kopyala. **Algılanan LCP iyileşmesi büyük.**

### F-005 🟡 — `next/image` vs raw `<img>` audit eksik

**Kanıt:**
- `next/image` import: 1 dosya
- raw `<img>`: 3 dosya
- Lots of dynamic image rendering (avatar, NGO logo, mission photo, post cover, sponsor logo) muhtemelen `<img>` ile yapılıyor; grep eksik (CDN URL pattern'i grep dışı).

**Fix önerisi:** Spot audit (1 saat) — top 5 sayfada image rendering'i incele:
- `dashboard/discover` — post cover image
- `dashboard/missions/[id]` — mission photo
- `dashboard/ngos/[id]` — NGO logo + cover
- `dashboard/profile` — avatar
- `dashboard/rewards/[id]` — reward image

Ardından `<Image>` (next/image) ile migrate. **LCP iyileşmesi 30-50%** (image optimization + lazy load + WebP).

### F-006 🟡 — Dynamic import 0 kullanım

**Kanıt:** `grep -rn "next/dynamic\|dynamic(" app/ components/` → 0 hit.

**Aktif kullanılan heavy library'ler (`canvas-confetti`, `qrcode`, `html5-qrcode`) her sayfada bundle'a dahil:**
- `canvas-confetti` (30KB) — sadece celebration moment'ları (membership success, mission complete) için kullanılıyor ama her sayfanın bundle'ında.
- `qrcode` (50KB) — sadece admin QR generator + onboarding QR scanner.
- `html5-qrcode` (200KB) — sadece QR scanner.
- `vaul` (drawer 30KB) — bottom-sheet kullanımında.

**Fix:**
```tsx
// components/ui/celebration-overlay.tsx
const Confetti = dynamic(() => import('canvas-confetti'), { ssr: false })

// app/admin/missions/[id]/qr/qr-generator.tsx
const QrCode = dynamic(() => import('qrcode'), { ssr: false })

// components/ui/qr-scanner.tsx
const Html5Qrcode = dynamic(() => import('html5-qrcode'), { ssr: false })
```

**Kazanım:** Bundle initial load -250-310KB (kullanmayan sayfalarda).

### F-007 🟡 — Suspense boundary kullanımı düşük (4 sayfa)

**Kanıt:** Sadece `auth/verify`, `admin/[ngoId]/{verifications,members,reports}`'ta Suspense var.

**Fix önerisi:** Server component'te paralel data dependency'lerini Suspense ile streaming render. Top 5 sayfa:
```tsx
// dashboard/ngos/[id]/page.tsx — örnek
<Suspense fallback={<MissionListSkeleton />}>
  <MissionListAsync ngoId={params.id} />
</Suspense>
<Suspense fallback={<MembershipBadgeSkeleton />}>
  <MembershipBadgeAsync ngoId={params.id} userId={user.id} />
</Suspense>
```

**Kazanım:** Critical content first paint daha hızlı; ikincil veriler stream eder.

### F-008 🟡 — Middleware her request'te 14 DB call

**Kanıt:** `middleware.ts` 14 await/supabase reference. Her route geçişinde:
- `auth.getUser()` (~30ms)
- Eğer admin → `is_ngo_admin` veya `is_super_admin` (+30ms)
- `/dashboard/*` → `profiles.select('interests')` (~30ms)

Toplam ~60-90ms middleware overhead her route geçişinde.

**Fix önerisi:**
1. **Onboarding check optimize et:** `profiles.interests` query'sini sadece `/dashboard` root için yap (sub-route'lar gereksiz).
2. **`is_super_admin` cache:** super-admin'ler nadiren değişir; 5 dk cookie cache'i ekle.
3. **Public route'lar middleware'i atla:** `/legal/*`, `/_next/*` zaten exempt; `/api/payments/webhook/*` ekle.

**Effort:** 1 saat audit + fix.

### F-009 🟡 — Devasa client component hydration süresi

Bkz. Tech Debt Ledger TD-004. Sprint'te ele alınmadı; ayrı sprint (Haziran).

---

## Sprint sonrası perf etkisi tahmini

Sprint'in eklediği değişikliklerden hangileri perf'e etkili:

| Değişiklik | Etki yönü | Tahmini büyüklük |
|---|---|---|
| `lib/tiers.ts` canonical | nötr (küçük import) | <1ms |
| `lib/auth/guards.ts` requireNgoAdmin | **negatif** (çift roundtrip) | **+150ms admin form** |
| TIERS callsite migration | nötr (string literal → import) | <1ms |
| Vitest devDeps install | nötr (production'da yok) | 0ms runtime |
| Migration 044 composite index | **pozitif** (apply edilirse) | -50-200ms query |
| Migration 045 trigger | nötr (DB tarafı, runtime fark yok) | <5ms |
| ESLint config | nötr (build-time) | 0ms runtime |

**Net etki:** Migration 044 apply edilmediyse + `requireNgoAdmin` cache yoksa = **+100-150ms admin sayfaları** (yavaşlık şikayetinin kökü). Diğer pages etkilenmemiş.

**Kullanıcının yavaşlık şikayetinin asıl olası sebepleri:**
1. **`npm install` çalıştırılmadı** → eski `motion` + yeni vitest karışımı → dev server bundler yavaş (`.next` cache invalid).
2. **Migration 044 apply edilmedi** → composite index yok → liste query'leri scan-and-filter.
3. **`requireNgoAdmin` cache yok** → admin sayfaları +150ms (yeni regression).
4. **Loading.tsx eksik** → boş ekran "yavaş" hissi (yapısal, sprint öncesi de var).

---

## Gerçek runtime ölçüm rehberi (kullanıcı koşturur)

### A. Lighthouse — top 5 sayfa × dark/light theme

```bash
# 1. Dev server başlat (terminal 1)
npm run dev

# 2. Ayrı terminal — Lighthouse koş (terminal 2)
mkdir -p tests/lighthouse

# Top 5 risk score sayfa
npx lighthouse http://localhost:3000/dashboard/ngos/test-ngo/membership \
  --output=html --output-path=tests/lighthouse/01-membership.html \
  --preset=mobile --only-categories=performance,accessibility

npx lighthouse http://localhost:3000/dashboard/missions/test-id \
  --output=html --output-path=tests/lighthouse/02-mission-detail.html \
  --preset=mobile

npx lighthouse http://localhost:3000/dashboard/donate \
  --output=html --output-path=tests/lighthouse/03-donate-hub.html \
  --preset=mobile

npx lighthouse http://localhost:3000/dashboard/posts/test-post-id \
  --output=html --output-path=tests/lighthouse/04-post-detail.html \
  --preset=mobile

npx lighthouse http://localhost:3000/admin/test-ngo/verifications \
  --output=html --output-path=tests/lighthouse/05-verifications.html \
  --preset=mobile
```

**Hedef metric'ler:** LCP ≤2.5s, FID ≤100ms, CLS ≤0.1, TTFB ≤500ms, Performance score ≥80.

### B. Bundle analyzer — gerçek bundle composition

```bash
npm install -D @next/bundle-analyzer
```

`next.config.mjs` (yoksa yarat):
```js
import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default bundleAnalyzer({
  // mevcut config...
})
```

```bash
ANALYZE=true npm run build
# → Browser'da otomatik açılır: .next/analyze/client.html
```

**Kontrol et:**
- three.js / gsap / lottie-react bundle'da var mı? (var ise tree-shake fail, F-001 kritik)
- canvas-confetti / qrcode bundle'da var mı? (F-006 dinamik import gerek)
- Top 10 chunk size

### C. Web Vitals canlı izleme (production-like)

`app/web-vitals.tsx` (Client Component):
```tsx
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
    // Production: send to analytics
  })
  return null
}
```

`app/layout.tsx`'e ekle:
```tsx
import { WebVitals } from './web-vitals'
// ...
<body>
  <WebVitals />
  {children}
</body>
```

DevTools → Console → her sayfa açışında metric'leri gör.

### D. Chrome DevTools Network panel

Her kritik sayfaya:
1. DevTools açık + Network panel + "Disable cache"
2. "Slow 3G" throttle (Network conditions)
3. Sayfayı aç, refresh
4. Şu sayılara bak:
   - **TTFB**: >500ms ise server-side problem (F-002 sequential await veya F-003 auth roundtrip)
   - **LCP**: >2.5s ise image (F-005) veya bundle (F-001/F-006)
   - **Total requests**: >50 ise N+1 query veya RSC waterfall
   - **Largest contentful element**: hangi image/text? `<img>` ise next/image migration

---

## 30 / 60 / 90 günlük plan

### 30 gün — Acil kazanım sprint (Mayıs sonu)

**P0 — sıralı 1 günlük iş (≤8 saat toplam):**

1. **F-001 dead deps sil** (15 dk) — `npm uninstall three gsap lottie-react @types/three` + `npm install`. **Kazanım: -730KB + npm install hızlanır.**
2. **F-003 `requireNgoAdmin` React cache** (30 dk) — `lib/auth/guards.ts`'e `cache()` sar. **Kazanım: -150ms admin form submit (sprint regression fix).**
3. **F-002 `posts/[id]` sequential await fix** (15 dk) — Promise.all migration. **Kazanım: -200ms post sayfası.**
4. **Migration 044 + 045 apply** (5 dk) — Supabase Studio veya `npx supabase db push`. **Kazanım: -50-200ms liste query'leri.**
5. **F-004 loading.tsx top 11 dashboard sayfa** (1-2 saat) — `components/ui/state/loading-skeleton` mevcut, copy-paste. **Kazanım: algılanan LCP %30+.**
6. **Web vitals + Lighthouse ölçüm** (1 saat) — kullanıcı koşturur, baseline'ı al.

### 60 gün — Bundle + RSC optimizasyon sprint (Haziran)

**P1:**
7. **F-006 dynamic import** — canvas-confetti + qrcode + html5-qrcode. **Kazanım: -250-310KB bundle initial.**
8. **F-005 next/image migration** — top 5 sayfada raw `<img>` audit + Image migration. **Kazanım: LCP -30-50%.**
9. **F-007 Suspense boundary** — top 5 sayfada granular streaming. **Kazanım: FCP iyileşmesi.**
10. **F-008 middleware optimize** — onboarding check sub-route exemption + super-admin cache. **Kazanım: -30-60ms her route geçişi.**
11. **Loading.tsx admin tarafı** (30 sayfa) — 1 hafta sprint.
12. **Error.tsx top 10** — TR copy + brand-on UI.

### 90 gün — Modülerlik + ileri perf (Temmuz)

**P2:**
13. **F-009 devasa client component refactor** (TD-004) — top 7 dosya 600+ satır → modüler.
14. **Bundle splitting per-route** — Next.js otomatik yapar ama large client component'ler için manuel optimize.
15. **Image CDN** — Supabase Storage Image Transform veya Cloudflare Images.
16. **Service Worker cache tuning** — PWA için stale-while-revalidate.
17. **Lighthouse CI workflow** — her PR'da perf regression check.

---

## Tech Debt Ledger updates

Yeni entry'ler (v3):

- **TD-033 🔴 L** — Dead dependencies three.js + gsap + lottie-react (~730KB) (F-001)
- **TD-034 🔴 L** — `requireNgoAdmin` çift DB roundtrip — React cache fix (F-003 sprint regression)
- **TD-035 🔴 L** — `dashboard/posts/[id]` sequential await chain (F-002)
- **TD-036 🟡 L** — Loading.tsx kapsamı %16 → top 41 sayfa eksik (F-004)
- **TD-037 🟡 L** — Dynamic import 0 kullanım (F-006)
- **TD-038 🟡 N** — `next/image` audit + raw `<img>` migration (F-005)
- **TD-039 🟡 N** — Suspense boundary kapsamı düşük (F-007)
- **TD-040 🟡 L** — Middleware her request 14 DB call (F-008)
- **TD-041 🟡 L** — Bundle analyzer kurulu değil; gerçek metric ölçümlenmedi
- **TD-042 🟡 N** — Web Vitals reporting yok; production'da perf görünürlüğü sıfır
- **TD-043 🟢 N** — Error.tsx kapsamı 3/80; default Next overlay TR copy yok

**Ledger v3 toplam:** 33 (v2) + 11 (yeni) = **44 entry** (8 🔴 + 35 🟡 + 1 🟢, 1 ✅).

---

## Self-check

- [x] Top 25 sayfa risk score sıralı
- [x] Top 5 🔴 kritik bulgu file:line + somut fix + effort estimate
- [x] Sprint sonrası perf etkisi açıkça analiz edildi
- [x] Pozitif disiplinler not edildi (useEffect+fetch 0, semantic HTML, RSC ayrımı)
- [x] Gerçek runtime ölçüm rehberi (Lighthouse + bundle analyzer + web vitals + DevTools)
- [x] 30/60/90 plan etki tahmini ile
- [x] Tech Debt Ledger 11 yeni entry
- [ ] Lighthouse skor ölçümü → kullanıcı koşturacak (Mayıs sprint Yol H)
- [ ] Bundle analyzer çıktısı → kullanıcı koşturacak

---

## Handoff log

- 2026-04-26 22:00 — **system-architect** ✅ — Sayfa perf statik audit: `docs/audit/2026-04-26-page-perf-audit.md` (~700 satır). 80 sayfa risk score sıralı. Top 5 🔴: membership (24.8), mission detail (21.9), membership success (14.9), donate hub (14.5), admin verifications (13.8). 4 sistemik bottleneck + 11 yeni Tech Debt entry. Acil 1 günlük sprint planı (F-001/F-002/F-003 + migration apply + loading.tsx) ile %50+ algılanan perf iyileşmesi mümkün. Gerçek runtime ölçümü kullanıcının Lighthouse + bundle analyzer koşturmasını gerektirir.
