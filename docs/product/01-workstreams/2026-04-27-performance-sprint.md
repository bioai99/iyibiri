# Workstream — Performance Sprint (2026-04-27 başlangıç)

**Açılış:** 2026-04-26 (performance-engineer)
**Owner (primary):** performance-engineer + system-architect (review)
**Bağlı:** [v2 baseline audit](../../audit/2026-04-26-eng-arch-baseline-audit.md), [page perf audit](../../audit/2026-04-26-page-perf-audit.md), [`docs/eng/perf/_fix-plan.md`](../../eng/perf/_fix-plan.md)
**Hedef:** Mayıs sonu — LCP ≤2.5s tüm dashboard, decoded ≤1.5MB, Lighthouse Perf ≥80.

## Amaç

Sayfa açılma sürelerini iteratif fix-test döngüsüyle düşürmek. 7 fazlı plan, her faz tek kategori odak, her faz sonrası before/after kanıtla doğrulanır. Asıl bottleneck (image optimization) sprint'in ilk 2 saatinde adresleniyor.

## Sprint zinciri

### Hafta 1 (2026-04-27 → 05-03) — Faz 1 + 2

**Yol 1 — next/image migration (Faz 1, 2 saat):**
1. ⏳ `next.config.mjs` images.remotePatterns + formats — perf-eng
2. ⏳ `components/ui/mission-card.tsx` `<Image>` migration — frontend-eng
3. ⏳ `components/dashboard/mission-carousel.tsx` — frontend-eng
4. ⏳ `components/dashboard/posts-rail-vol30.tsx` — frontend-eng
5. ⏳ `components/dashboard/ngo-rail-vol30.tsx` — frontend-eng
6. ⏳ `app/dashboard/discover/discover-client.tsx` — frontend-eng
7. ⏳ Test: aynı 5 sayfa Chrome MCP yeniden ölç → `docs/eng/perf/YYYY-MM-DD-after-faz-1.md`

**Yol 2 — Loading.tsx + error.tsx (Faz 2, 1.5 saat):**
1. ⏳ 11 dashboard sayfa için `loading.tsx` ekleme (perf-eng)
2. ⏳ 5 kritik sayfa için `error.tsx` ekleme
3. ⏳ Test: aynı sayfalar yeniden ölç (algılanan LCP)

**Yol 3 — Sprint deploy (Faz 3, kod hazır):**
1. ⏳ User: `npm install` (motion + dead deps temizle, vitest install)
2. ⏳ User: `npx supabase db push` (migration 044 + 045)
3. ⏳ User: `git push` (CI tetikle)
4. ⏳ Test: admin verifications + posts/[id] ölçüm; kazanım kanıtı

### Hafta 2 (2026-05-04 → 05-10) — Faz 4 + 5

**Yol 4 — Dynamic import (Faz 4, 30 dk):**
1. ⏳ `components/ui/celebration-overlay.tsx` canvas-confetti dynamic
2. ⏳ `app/admin/missions/[id]/qr/qr-generator.tsx` qrcode dynamic
3. ⏳ `components/ui/qr-scanner.tsx` html5-qrcode dynamic
4. ⏳ Bundle analyzer kurulum (paralel) + bundle size ölçüm

**Yol 5 — Suspense boundary (Faz 5, 2-3 saat):**
1. ⏳ Top 5 sayfa için section-bazlı Suspense + skeleton
2. ⏳ system-architect review (RSC pattern uyumu)
3. ⏳ Test: FCP iyileşmesi ölçüm

### Hafta 3 (2026-05-11 → 05-17) — Faz 6 + tüm sayfalar baseline

**Yol 6 — Middleware optimize (Faz 6, 1 saat):**
1. ⏳ `interests` query sub-route exempt
2. ⏳ `is_super_admin` cookie cache (5 dk)
3. ⏳ Test: her route geçişi delta

**Yol 7 — Tüm sayfa baseline (kalan 30 sayfa):**
1. ⏳ Chrome MCP ile 30+ sayfa peş peşe (~10 dk)
2. ⏳ Tracking board güncelle
3. ⏳ Yeni regression / pattern tespit varsa Faz 8 önerisi

### Hafta 4 (2026-05-18 → 05-24) — sprint kapanış + V1 launch

**Yol 8 — Lighthouse CI + Web Vitals reporting (Faz 7 başlangıç):**
1. ⏳ `.github/workflows/lighthouse.yml` Lighthouse CI eklenmesi
2. ⏳ `app/web-vitals.tsx` analytics
3. ⏳ Threshold: LCP ≤2.5s = error, score <80 = warn
4. ⏳ Final baseline + sprint kapanış raporu

## Owner matrisi

| Yol | Owner (primary) | Support | Effort |
|---|---|---|---|
| 1 — next/image | perf-eng (config) + frontend-eng (component) | system-architect (review) | 2h |
| 2 — Loading.tsx | perf-eng | — | 1.5h |
| 3 — Sprint deploy | user | perf-eng (test) | 0h iş, deploy gerek |
| 4 — Dynamic import | frontend-eng + perf-eng | — | 30m + bundle analyzer 1h |
| 5 — Suspense | frontend-eng | system-architect | 2-3h |
| 6 — Middleware | auth-cap | system-architect | 1h |
| 7 — Tüm sayfa baseline | perf-eng | — | 30m (Chrome MCP) |
| 8 — Lighthouse CI | perf-eng + frontend-eng | — | 1d |

**Total sprint:** ~12-15 saat aktif iş + deploy bekleme.

## Stop condition'ları

- Faz 1 sonrası decoded -%30'dan az → image optimization yeterli değil, hipotez revize.
- Critical regression (LCP >2x) → revert + coordinator notify + deploy bloke öner.
- 7 gün cache regression → Pazartesi flag.
- TSC / ESLint fail → faz pause.

## Bağlı kararlar

- Hiçbir faz mimari karar (cache strategy, plugin) değiştirmiyor; system-architect onay'ı sadece review.
- Sprint sonrası `docs/audit/2026-05-XX-perf-after-sprint.md` kapanış raporu.

## Çıktı dosyaları (sprint sonu)

- ✅ Faz 1-7 her biri için `docs/eng/perf/YYYY-MM-DD-after-faz-N.md`
- ✅ `docs/eng/perf/_perf-tracking-board.md` güncel (35+ sayfa kapsamı)
- ✅ Tech Debt Ledger: TD-033 → TD-043 entry'lerinde status'leri "✅ Resolved" veya kalan kısım belirtili
- ✅ `next.config.mjs` images config
- ✅ `.github/workflows/lighthouse.yml`
- ✅ `app/web-vitals.tsx`

## Handoff log

- 2026-04-26 22:40 — **performance-engineer** ✅ — Workstream açıldı. Tracking board + fix plan + measurement protocol hazır. Faz 1 (next/image) başlamaya hazır; perf-eng + frontend-eng paralel.
- ⏸ Pending — Faz 1 implementation kullanıcı onayı bekliyor; veya sprint deploy (Faz 3) önce tamamlanırsa Faz 1 daha temiz baseline'da yapılır.
