# Faz 7 + Variance Investigation — UX-Neutral Performance Improvements

**Reviewer:** performance-engineer
**Tarih:** 2026-05-02
**Tip:** UX'e sıfır risk taşıyan iyileştirmeler — kullanıcı tarafında görsel/etkileşim değişikliği yok.
**Bağlı:** [`_perf-tracking-board.md`](./_perf-tracking-board.md), [`2026-04-26-sprint-closure.md`](./2026-04-26-sprint-closure.md)

---

## Özet

Mayıs sprint'i kapanışından sonra geriye kalan UX-neutral iyileştirmeleri tek seansta tamamladık. 5 başlık altında 9 dosyada değişiklik:

1. Lighthouse CI workflow (PR + weekly cron)
2. Web Vitals RUM reporting
3. Bundle analyzer kurulumu
4. DNS preconnect / preconnect resource hints
5. Legal sayfalar ISR (revalidate 86400)
6. Variance fix: profile/karma + profile/donations + streak

Plus: günlük 19:00 scheduled task kuruldu — Cowork tarafında her akşam 35+ sayfayı Chrome MCP ile ölçer, regression flag'ler.

## Değişiklik tablosu

| Dosya | Değişiklik | Beklenen etki |
|---|---|---|
| `.github/workflows/lighthouse.yml` | Lighthouse CI workflow (PR + weekly cron) | Kalıcı PR koruma; LCP >2.5s veya CLS >0.1 = error → PR block |
| `lighthouserc.json` | PR config (build + start, public sayfalar) | Build başına 6 sayfa Lighthouse audit |
| `lighthouserc.production.json` | Weekly cron config (production hit) | Pazartesi 09:00 TR, production audit |
| `app/web-vitals.tsx` (yeni) | useReportWebVitals → /api/vitals beacon | Real User Monitoring — gerçek kullanıcı LCP/CLS/INP datası |
| `app/api/vitals/route.ts` (yeni) | Edge runtime POST endpoint | Beacon receiver; şimdilik Vercel function log'u, ileride DB |
| `app/layout.tsx` | WebVitals component mount + DNS preconnect headers | Unsplash + Supabase için TLS handshake önceden; -50-150ms ilk image fetch |
| `next.config.mjs` | @next/bundle-analyzer opsiyonel integration | `npm run analyze` ile bundle audit; default build davranışı değişmez |
| `package.json` | analyze script + @next/bundle-analyzer devDep | Tooling |
| `app/legal/kvkk/page.tsx` | export const revalidate = 86400 | ISR; edge cache'de servis, server load = 0 |
| `app/legal/terms/page.tsx` | export const revalidate = 86400 | aynı |
| `app/legal/privacy/page.tsx` | export const revalidate = 86400 | aynı |
| `app/dashboard/profile/karma/page.tsx` | Sequential await → Promise.all | -%50 server response (~300ms → 150ms) |
| `app/dashboard/profile/donations/page.tsx` | NGO map: tüm NGO'lar → `.in(subscription_ngo_ids)` | Decoded -%80 NGO map portion |
| `app/dashboard/streak/page.tsx` | Sequential await → Promise.all | -%50 server response |

## Doğrulama

- `tsc --noEmit` ✅ exit=0, 0 hata
- `next lint` 9 dosya için ✅ 0 warning/error
- `next.config.mjs` ESM import ✅ defansif yüklendi (ANALYZE=true değilse paket gerekmiyor)
- Visual regression: yok — sadece RSC kod yolu değişti, render output aynı

## Beklenen impact (deploy sonrası)

| Sayfa | Mevcut DOM | Beklenen DOM | Δ |
|---|---:|---:|---:|
| /dashboard/profile/karma | 1537ms (variance) | ~900-1100ms | -%30-40 |
| /dashboard/profile/donations | 989ms | ~700-850ms | -%20 + decoded -%30 |
| /dashboard/streak | 1050ms | ~700-850ms | -%20-30 |
| /legal/* | ~210-525ms | <50ms (cache hit) | -%80+ ilk hit dışında |
| Tüm Unsplash-heavy sayfa ilk image | — | -50-150ms TLS handshake savings | TTFB-side |

## Lighthouse CI threshold'ları (PR'da error veren)

- LCP > 2500ms → error
- CLS > 0.1 → error
- Performance score < 0.8 → warn (PR'ı bloklamaz ama görünür)
- Accessibility/Best Practices/SEO score < 0.9 → warn
- unminified-javascript / unminified-css → error

## Push gereken commit

Sprint kapanışından sonraki tüm değişiklikler tek commit'e konsolide edilebilir:

```
git add .github/workflows/lighthouse.yml lighthouserc*.json \
        app/web-vitals.tsx app/api/vitals/route.ts \
        app/layout.tsx next.config.mjs package.json \
        app/legal/{kvkk,terms,privacy}/page.tsx \
        app/dashboard/profile/{karma,donations}/page.tsx \
        app/dashboard/streak/page.tsx \
        docs/eng/perf/2026-05-02-faz-7-and-variance-fix.md \
        docs/eng/perf/_perf-tracking-board.md

git commit -m "perf(faz-7): Lighthouse CI + Web Vitals RUM + DNS preconnect + ISR + variance fix"
git push origin main
```

`npm install` ileri sürüm push'unda gerekiyor (yeni devDep `@next/bundle-analyzer`). Vercel `npm ci` çalıştırırken otomatik yüklenir.

## Açık kalan iş (UX-neutral kalmayan, ayrı session)

- Faz 5 — Suspense boundary top 5 sayfa (RSC streaming pattern, görsel flicker riski; review gerek)
- TD-004 — membership-flow client monolith refactor (1103 → ~300 satır; regression test gerek)
- Landing ISR follow-up — `app/page.tsx` 'use client' → server/client split
- Mobile viewport ölçümü — sprint baseline'ı sadece desktop'tu
- Admin tarafı next/image migration — son kullanıcıyı etkilemiyor ama NGO admin UX'i için backlog
- Font subsetting — Türkçe karakter için `latin` yerine `latin-ext` test (riskli — bazı karakterler düşebilir)

## Scheduled task

`iyibiri-daily-perf` — her gün 19:00 TR çalışır:
- Chrome MCP ile 35+ user-facing route ölçer
- Rapor `docs/eng/perf/YYYY-MM-DD-daily.md`
- Önceki güne göre regression varsa tracking board'a flag
- Critical regression'da rapor başında ⚠️ uyarı

İlk run için Cowork'te "Run now" tetiklemek tool approval'ları pre-confirm eder, sonraki otomatik run'lar permission prompt'una takılmaz.

## Self-check

- [x] Tüm değişiklikler UX-neutral (görsel/etkileşim değişmedi)
- [x] TypeScript compile ✅
- [x] ESLint pass ✅
- [x] next.config.mjs defansif (paket olmasa da build çalışır)
- [x] CI/CD altyapısı eklendi (PR koruma)
- [x] Real User Monitoring aktif
- [x] Recurring perf test scheduled (günlük 19:00)
- [ ] Deploy + after-faz-7 ölçüm — kullanıcı push sonrası
- [ ] Mobile viewport baseline — sonraki session
