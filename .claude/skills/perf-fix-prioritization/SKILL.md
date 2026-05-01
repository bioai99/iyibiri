---
name: perf-fix-prioritization
description: performance-engineer agent'ın bulgularını fix-plan'a dönüştürürken kullandığı önceliklendirme matrisi. Etki (LCP/decoded/request azalımı tahmini) × Effort (saat) × LNO (Leverage/Neutral/Overhead) kombinasyonu. Her bulguya severity (🔴/🟡/🟢) + faz no + bağlı pattern memo. Fix planı 5-7 fazlı; her faz tek odak alanı (image / bundle / RSC / cache / network / hydration).
---

# Perf Fix Prioritization — performance-engineer protokol

> Amaç: Ölçümden çıkan 20-50 fix önerisini **eyleme dönüştürülebilir 5-7 fazlı plan**a indirgemek; her faz tek odak alanı, ölçülebilir etki, hızlı kazanım sırası.

---

## 0. Aktivasyon

performance-engineer:
1. Yeni baseline ölçümü çıktığında.
2. After-faz ölçümü etki düşükse hipotez revizesi gerek.
3. Regression watch'ta yeni bottleneck tespit edildiğinde.

---

## 1. Etki / Effort matrisi (LNO çerçevesi)

Her fix önerisi 4 boyutta puanlanır:

### A. Etki (Impact)
- **🌟🌟🌟 High (≥30%)** — LCP %30+ düşürür, decoded %40+ azaltır, score +20.
- **🌟🌟 Medium (10-30%)** — LCP %10-30 düşürür, score +5-20.
- **🌟 Low (<10%)** — Polish, micro-optimization.

### B. Effort (saat)
- **XS** — 5-30 dk (config, copy-paste).
- **S** — 30 dk - 2 saat (1-2 dosya migration).
- **M** — 2-8 saat (multi-file refactor).
- **L** — 1-3 gün (sprint task).
- **XL** — 1+ hafta.

### C. LNO sınıflama
- **Leverage (L)** — düşük effort + yüksek etki → **önce yap**.
- **Neutral (N)** — orta effort + orta etki → backlog sıraya gir.
- **Overhead (O)** — yüksek effort + düşük etki ya da zorunlu → quarterly planlanır.

### D. Severity (kullanıcıya etki)
- **🔴 Blocker** — kullanıcı şikayeti var, LCP >4s, score <50.
- **🟡 Major** — sprint içinde adresle.
- **🟢 Minor** — backlog.

---

## 2. Faz şablonu

Her faz tek bir **kategorik odak**:

| Faz | Kategori | Tipik fix'ler |
|---|---|---|
| 1 | **Image** | next/image migration, remotePatterns, lazy loading, WebP/AVIF, sized URLs |
| 2 | **Loading State** | loading.tsx ekleme, Suspense boundary, skeleton component |
| 3 | **Auth & Cache** | requireUser cache, middleware optimize, RSC cache, revalidate strategy |
| 4 | **Bundle** | dynamic import, dead deps, code splitting, lazy components |
| 5 | **RSC & Network** | Promise.all parallel fetch, N+1 query, composite index |
| 6 | **Hydration** | Client component refactor, server-component-first |
| 7 | **Polish** | font preload, prefetch links, prerendering, ISR |

Her faz **2-8 saat scoped**. 8 saati aşıyorsa böl.

---

## 3. Fix planı template

`docs/eng/perf/_fix-plan.md`:

```markdown
# İyiBiri Perf Fix Plan — canlı doküman

**Sahip:** performance-engineer
**Açılış:** YYYY-MM-DD
**Bağlı:** docs/eng/perf/YYYY-MM-DD-baseline.md

## Hedef metric'ler (sprint sonu)
- LCP ≤2.5s tüm dashboard sayfalarında
- Decoded body ≤1.5MB
- Lighthouse Performance ≥80

## Faz tablosu

| Faz | Konu | Status | Effort | Etki | Owner | Bağlı TD |
|---|---|---|---|---|---|---|
| 1 | next/image migration top 5 | 🟡 in_progress | 2h | High | perf-eng | TD-038 |
| 2 | Loading.tsx top 15 sayfa | ⏳ pending | 1h | Medium | perf-eng | TD-036 |
| 3 | requireNgoAdmin cache + posts/[id] Promise.all | ✅ done | 0h (deploy gerek) | Medium | system-architect | TD-034, TD-035 |
| 4 | Dynamic import (canvas-confetti, qrcode) | ⏳ pending | 30m | Medium | frontend-eng | TD-037 |
| 5 | Suspense boundary top 5 | ⏳ pending | 2h | Medium | frontend-eng | TD-039 |
| 6 | Middleware optimize | ⏳ pending | 1h | Low | auth-cap | TD-040 |
| 7 | Bundle analyzer + ileri optimize | ⏳ backlog | 1d | TBD | perf-eng | TD-011 |

## Faz 1 — next/image migration (örnek detay)

**Bağlı bulgu:** baseline `/dashboard/missions` 5 Unsplash görüntü her biri ~850ms.

**Fix:**
1. `next.config.mjs` — images.remotePatterns += ['images.unsplash.com', '*.supabase.co']
2. `components/ui/mission-card.tsx` — `<img src={cover} />` → `<Image src={cover} width={400} height={250} alt="..." loading="lazy" />`
3. `components/dashboard/mission-carousel.tsx` — aynı pattern
4. `components/dashboard/posts-rail-vol30.tsx` — post cover image
5. `components/dashboard/ngo-rail-vol30.tsx` — NGO logo
6. `app/dashboard/discover/discover-client.tsx` — post + sponsor

**Beklenen etki:**
- /dashboard/missions decoded 3550KB → ~700KB (-80%)
- /dashboard decoded 2467KB → ~1200KB (-50%)
- LCP -800ms ortalama (image lazy + WebP)

**Test:**
- Faz 1 implement sonrası web-vitals-measurement aynı 5 sayfa
- Beklenen vs gerçek delta tablosu
- Etki düşükse: hipotez yanlış, faz uzatılır veya değişir

**Bağlı pattern memo:** `docs/test/_patterns/2026-04-26-perf-image-optimization.md` (açılacak)
```

---

## 4. Faz başlatma kararı

Bir faz başlatılmadan önce:

- [ ] Önceki faz kapanmış (ölçüm yapılmış, etki kanıtlanmış).
- [ ] Bu fazın bağlı pattern memo'su var (3+ benzer bulgu doğrulanmış).
- [ ] Tech Debt entry açık (TD-XXX).
- [ ] Owner net (perf-eng kendi mi, frontend-engineer mi, system-architect ile koordineli mi).
- [ ] Effort estimate (2-8h scope).
- [ ] Beklenen etki tahmini (LCP/decoded/score delta).
- [ ] Test plan (hangi sayfalar yeniden ölçülecek).

Eksik varsa **faz başlamaz** — önce eksiklik tamamlanır.

---

## 5. Pattern detection — 3+ sayfa kuralı

3+ sayfada aynı kök neden tespit edilirse pattern memo açılır:

`docs/test/_patterns/YYYY-MM-DD-perf-<konu>.md` template:

```markdown
# Pattern: [Konu] (örn. Image optimization eksik)

**Tarih:** YYYY-MM-DD
**Tespit eden:** performance-engineer
**Severity:** 🔴/🟡

## Etkilenen sayfalar
- /dashboard/missions — 5 Unsplash 850ms each
- /dashboard — 4 mission carousel image
- /dashboard/discover — 8 post cover
- /dashboard/posts/[id] — 2 post cover
- /dashboard/ngos — NGO logo

## Kök neden
- next/image kullanılmıyor (raw `<img>`)
- Image transform parameters yok (`?w=400&fit=crop`)
- Lazy loading yok

## Sistemik fix
- Faz 1 (kapsam tablosu)

## Routing
- Sahip: frontend-engineer + perf-eng
- Effort: 2 saat
- Sprint: Mayıs sonu

## Handoff log
- ...
```

---

## 6. Anti-patterns (önceliklendirme hatası)

❌ **High effort, low impact'i öne almak.** Sprint kapasiteni boşa harcar. LNO matrisinde **L (Leverage)** önce.
❌ **Pattern olmadan tek-tek fix.** 5 sayfada aynı sorun → 5 ayrı PR yerine 1 sistemik fix.
❌ **Etki ölçmeden faz kapatmak.** "Yapıldı" yetmez; **kanıtlandı** olmalı.
❌ **Tier-1 benchmark hedefi V1'de.** Premature optimization. V1 sarı eşik OK.
❌ **Tek kişilik faz çoklu kategori.** Image + bundle aynı fazda → focus kaybolur.
❌ **Backlog sınırsız büyütmek.** 30+ entry → planlanması zor; her faz sonu yeniden öncelendir.

---

## 7. Etki tahmini formülleri

Tahmin için pratik kurallar (Lighthouse + WebPageTest data):

| Fix | LCP delta | Decoded delta |
|---|---|---|
| next/image migration (5+ image) | -300 ile -1000ms | -50% ile -80% |
| Loading.tsx + Suspense | -200ms (algılanan) | 0 |
| Dynamic import 100KB | -100ms | -100KB |
| RSC sequential → parallel | -200 ile -500ms (her await) | 0 |
| Composite index | -50 ile -200ms | 0 |
| `next/font` (eksikse) | -200ms (FCP) | -50KB |
| `prefetch` (Link) | -300ms (next page) | 0 |
| Image WebP/AVIF dönüşüm | -50ms | -30% |
| `<img>` width+height attribute | 0 | 0 (CLS düşürür) |

Toplam tahmin = sayfa başına fix'lerin lineer toplamı (gerçekte synergy + interaction var, kabul edilebilir hata).

---

## 8. Self-check (her fix planı sonunda)

- [ ] 5-7 faz, her biri tek kategori odak.
- [ ] Her fix etki tahmini + effort ile.
- [ ] LNO sınıflandırma her fix için.
- [ ] Severity (🔴/🟡/🟢) atanmış.
- [ ] Bağlı Tech Debt entry referansı.
- [ ] Bağlı pattern memo referansı (varsa).
- [ ] Owner atanmış.
- [ ] Test plan (hangi sayfa sonra ölçülecek).
- [ ] Beklenen vs gerçek delta tablosu kuruldu (after-fix ölçümü için).
