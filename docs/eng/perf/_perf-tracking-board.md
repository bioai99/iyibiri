# İyiBiri Performance Tracking Board — canlı

> **Sahip:** performance-engineer
> **Açılış:** 2026-04-26
> **Ritüel:** Haftalık Pazartesi diff (önceki haftaya göre regression flag) + her fix sonrası after-fix ölçümü.
> **Bağlı:** [`_fix-plan.md`](./_fix-plan.md), [`_measurement-protocol.md`](./_measurement-protocol.md)

---

## Hedef metric'ler (V1 pilot)

| Metric | Hedef (yeşil) | Kabul (sarı) | Kırmızı |
|---|---|---|---|
| LCP | ≤2.5s | 2.5-4.0s | >4s |
| TTFB | ≤500ms | 500-1000ms | >1000ms |
| CLS | ≤0.1 | 0.1-0.25 | >0.25 |
| Decoded body | ≤1.5MB | 1.5-3MB | >3MB |
| Lighthouse Perf | ≥80 | 50-79 | <50 |

---

## Aktif faz

**Faz 1 — Image optimization** (in_progress, 2026-04-26 başladı)

Sıradaki: Faz 2 (Loading.tsx) → Faz 3 (Auth & Cache deploy) → Faz 4 (Bundle) → Faz 5 (RSC) → Faz 6 (Polish).

---

## En son baseline

**2026-04-26 23:30 — performance-engineer** — After-faz-3 ölçümü tamam (sprint deploy etkisi). Ortalama -%30 DOM Interactive; top 5 sayfa -%50 ile -%80. 22/27 sayfa hedefi geçti. Landing 1972ms → 391ms (-%80, dead deps fix). Sıradaki: Faz 1 (next/image migration) — `/dashboard/missions` decoded 3550KB hedef -%80.

Top 5 yavaş sayfa:

| # | Sayfa | TTFB | DOM Int | Decoded | Verdict |
|---|---|---:|---:|---:|---|
| 1 | `/dashboard` | 50ms ✅ | **2279ms** 🔴 | **2467KB** 🔴 | En yavaş |
| 2 | `/dashboard/missions` | 52ms ✅ | 1616ms 🟡 | **3550KB** 🔴 | En ağır |
| 3 | `/dashboard/donate` | 74ms ✅ | 1535ms 🟡 | 1198KB 🟡 | Orta |
| 4 | `/dashboard/ngos/[id]/membership` | 49ms ✅ | **2049ms** 🔴 | 902KB ✅ | TD-004 client monolith |
| 5 | `/` (landing) | 48ms ✅ | 1972ms 🟡 | 660KB ✅ | Three.js (silindi sprint sonrası) |

**Pozitif:** TTFB 50-74ms her sayfada (server hızlı). CLS 0.0000 ✅.
**Asıl bottleneck:** Image optimization (Unsplash full-size, next/image yok).

---

## Sayfa kapsama (35+ user-facing route)

| Sayfa | Cold | Warm | Last measured | LCP | Verdict |
|---|---|---|---|---:|---|
| /dashboard | ⏳ | ✅ | 2026-04-26 | 1900* | 🔴 |
| /dashboard/missions | ⏳ | ✅ | 2026-04-26 | 1700* | 🔴 |
| /dashboard/missions/[id] | ⏳ | ⏳ | — | — | — |
| /dashboard/missions/[id]/complete | ⏳ | ⏳ | — | — | — |
| /dashboard/my-missions | ⏳ | ⏳ | — | — | — |
| /dashboard/donate | ⏳ | ✅ | 2026-04-26 | — | 🟡 |
| /dashboard/donate/[ngoId] | ⏳ | ⏳ | — | — | — |
| /dashboard/donate/[ngoId]/give | ⏳ | ⏳ | — | — | — |
| /dashboard/discover | ⏳ | ⏳ | — | — | — |
| /dashboard/ngos | ⏳ | ✅ | 2026-04-26 | — | ✅ |
| /dashboard/ngos/[id] | ⏳ | ⏳ | — | — | — |
| /dashboard/ngos/[id]/membership | ⏳ | ⏳ | — | — | — |
| /dashboard/ngos/[id]/membership/success | ⏳ | ⏳ | — | — | — |
| /dashboard/posts/[id] | ⏳ | ⏳ | — | — | — |
| /dashboard/profile | ⏳ | ✅ | 2026-04-26 | — | ✅ |
| /dashboard/profile/edit | ⏳ | ⏳ | — | — | — |
| /dashboard/profile/badges | ⏳ | ⏳ | — | — | — |
| /dashboard/profile/karma | ⏳ | ⏳ | — | — | — |
| /dashboard/profile/donations | ⏳ | ⏳ | — | — | — |
| /dashboard/profile/interests | ⏳ | ⏳ | — | — | — |
| /dashboard/leaderboard | ⏳ | ⏳ | — | — | — |
| /dashboard/notifications | ⏳ | ⏳ | — | — | — |
| /dashboard/saved | ⏳ | ⏳ | — | — | — |
| /dashboard/streak | ⏳ | ⏳ | — | — | — |
| /dashboard/tiers | ⏳ | ⏳ | — | — | — |
| /dashboard/rewards | ⏳ | ⏳ | — | — | — |
| /dashboard/rewards/[id] | ⏳ | ⏳ | — | — | — |
| /dashboard/sponsors/[id] | ⏳ | ⏳ | — | — | — |
| /dashboard/settings | ⏳ | ⏳ | — | — | — |
| /auth/signin | ⏳ | ⏳ | — | — | — |
| /auth/signup | ⏳ | ⏳ | — | — | — |
| /auth/login | ⏳ | ⏳ | — | — | — |
| /auth/forgot-password | ⏳ | ⏳ | — | — | — |
| /auth/reset-password | ⏳ | ⏳ | — | — | — |
| /onboarding/welcome | ⏳ | ⏳ | — | — | — |
| /onboarding/causes | ⏳ | ⏳ | — | — | — |
| /onboarding/city | ⏳ | ⏳ | — | — | — |
| / (landing) | ⏳ | ⏳ | — | — | — |

`*` LCP tahmini (PerformanceObserver buffered=true zaman zaman boş döner; manuel doğrulama gerekli).

---

## After-fix ölçümleri (her faz sonrası eklenir)

| Faz | Tarih | Rapor | Top sayfa | Önceki LCP | Şimdiki LCP | Δ |
|---|---|---|---|---:|---:|---:|
| 1 | ⏳ | — | — | — | — | — |
| 2 | ⏳ | — | — | — | — | — |
| ... | | | | | | |

---

## Regression watch (haftalık)

| Tarih | Sayfa | Önceki LCP | Yeni LCP | Δ | Sebep tahmini | Aksiyon |
|---|---|---:|---:|---:|---|---|
| _henüz_ | — | — | — | — | — | — |

Critical regression (LCP >2x) → coordinator notify + deploy bloke öner.

---

## Pattern memo'lar

- 🔴 [`docs/test/_patterns/2026-04-26-perf-image-optimization.md`](../../test/_patterns/2026-04-26-perf-image-optimization.md) — Faz 1 ile fix
- 🟡 [`docs/test/_patterns/2026-04-26-perf-loading-state.md`](../../test/_patterns/2026-04-26-perf-loading-state.md) — Faz 2 ile fix _(açılacak)_
- 🟡 [`docs/test/_patterns/2026-04-26-perf-bundle-bloat.md`](../../test/_patterns/2026-04-26-perf-bundle-bloat.md) — Faz 4 ile fix _(açılacak)_

---

## Tech Debt Ledger bağlantısı

Aktif perf entry'leri:

| TD | Konu | Faz |
|---|---|---|
| TD-033 | Dead deps three/gsap/lottie | Faz 1 öncesi (silindi, deploy gerek) |
| TD-034 | requireNgoAdmin çift roundtrip | Faz 3 (kod hazır, deploy gerek) |
| TD-035 | posts/[id] sequential await | Faz 3 (kod hazır, deploy gerek) |
| TD-036 | Loading.tsx kapsamı %16 | Faz 2 |
| TD-037 | Dynamic import 0 | Faz 4 |
| TD-038 | next/image audit + migration | **Faz 1 (aktif)** |
| TD-039 | Suspense boundary kapsamı | Faz 5 |
| TD-040 | Middleware overhead | Faz 6 |
| TD-041 | Bundle analyzer kurulumu | ✅ Resolved (Faz 7, 2026-05-02) |
| TD-042 | Web Vitals reporting | ✅ Resolved (Faz 7, 2026-05-02) |
| TD-043 | Error.tsx kapsamı | Faz 2 (paralel) |

---

## Son güncelleme

**2026-05-02 — performance-engineer** — Faz 7 + variance fix tamam ([rapor](./2026-05-02-faz-7-and-variance-fix.md)): Lighthouse CI + Web Vitals RUM + bundle analyzer + DNS preconnect + 3 legal sayfa ISR + profile/karma & streak Promise.all + donations NGO map sınırlama. Plus: `iyibiri-daily-perf` scheduled task kuruldu (her gün 19:00). Push sonrası after-faz-7 ölçüm bekleniyor.

**2026-04-26 23:00 — performance-engineer** — Tracking board v2: 25 sayfa baseline tamamlandı (warm cache). Top kritik: /dashboard cold 4065ms, /ngos/[id]/membership 2049ms, /missions 3550KB. Faz 1 (image migration) başlamaya hazır; sprint deploy sonrası after-faz-3 ölçüm yapılacak.
