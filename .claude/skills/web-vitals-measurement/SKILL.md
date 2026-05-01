---
name: web-vitals-measurement
description: performance-engineer agent'ın Chrome MCP üzerinden production veya dev server'a bağlanıp Web Vitals (TTFB / FCP / LCP / CLS / INP / DOM Interactive) + Network panel + slow resources + decoded body size ölçümü yaparken kullandığı standart protokol. Tek script + tek output format → her sayfa karşılaştırılabilir, fix öncesi/sonrası diff alınabilir, regression yakalanır. Lighthouse Performance kategorisinin %90'ını sandbox dışından koşturmadan toplar (Chrome MCP'nin javascript_tool + read_network_requests tool'ları ile).
---

# Web Vitals Measurement — performance-engineer protokol

> Amaç: Sayfaların gerçek runtime performansını **standart, tekrarlanabilir, kıyaslanabilir** ölçüm pipeline'ıyla topla. Lighthouse koşturmaksızın Chrome MCP üzerinden Performance API + Network panel verisi.
> Süre: sayfa başı ~10-15 sn; 35+ sayfa ~10-15 dk.
> Çıktı: `docs/eng/perf/YYYY-MM-DD-{baseline,after-faz-N}.md` standart format.

---

## 0. Aktivasyon

performance-engineer şu durumlarda bu skill'i okur:

1. **Yeni baseline gerek** — sprint başı, audit, regression check.
2. **Per-page deep dive** — tek sayfada bottleneck tespit.
3. **After-fix ölçüm** — fix uygulandı, etki kanıtı.
4. **Regression watch** — haftalık diff (Pazartesi ritüeli).

---

## 1. Önkoşullar

- **Chrome MCP bağlı** (`mcp__Claude_in_Chrome__*` tool'ları yüklü).
  - Yoksa: `list_connected_browsers` → kullanıcıdan extension yükletme talebi.
- **Hedef URL erişilebilir** — production (`https://www.iyibiri.app`) ya da dev (`http://localhost:3000`).
  - Dev server kapalıysa kullanıcıya `npm run dev` koşturma talebi.
- **Login session** (dashboard auth gerek): kullanıcı zaten browser'da login.

---

## 2. Standart ölçüm script

**Her sayfa için 1 navigate + 1 wait + 1 javascript_tool çağrısı:**

```js
// PerformanceObserver standart metric script — JSON döner
(() => {
  const nav = performance.getEntriesByType('navigation')[0] || {}
  const paints = performance.getEntriesByType('paint')
  const fp = paints.find(p => p.name === 'first-paint')
  const fcp = paints.find(p => p.name === 'first-contentful-paint')
  const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
  const lcp = lcpEntries.length ? lcpEntries[lcpEntries.length-1] : null
  const cls = performance.getEntriesByType('layout-shift')
    .filter(e => !e.hadRecentInput)
    .reduce((s, e) => s + e.value, 0)

  const r = performance.getEntriesByType('resource')
  const fresh = r.filter(x => (x.transferSize || 0) > 100)
  const totalKB = Math.round(r.reduce((s, x) => s + (x.transferSize || 0), 0) / 1024)
  const decodedKB = Math.round(r.reduce((s, x) => s + (x.decodedBodySize || 0), 0) / 1024)

  const byType = { js: 0, css: 0, img: 0, font: 0, xhr: 0, other: 0 }
  const sizeKB = { js: 0, css: 0, img: 0, font: 0, xhr: 0, other: 0 }
  r.forEach(x => {
    const s = x.transferSize || x.encodedBodySize || 0
    if (x.initiatorType === 'fetch' || x.initiatorType === 'xmlhttprequest') {
      byType.xhr++; sizeKB.xhr += s
    } else if (x.name.match(/\.(js|mjs)(\?|$)/)) { byType.js++; sizeKB.js += s }
    else if (x.name.match(/\.css(\?|$)/)) { byType.css++; sizeKB.css += s }
    else if (x.name.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)(\?|$)/i)) { byType.img++; sizeKB.img += s }
    else if (x.name.match(/\.(woff2?|ttf)(\?|$)/)) { byType.font++; sizeKB.font += s }
    else { byType.other++; sizeKB.other += s }
  })
  Object.keys(sizeKB).forEach(k => sizeKB[k] = Math.round(sizeKB[k] / 1024))

  const slowest = r.filter(x => x.duration > 200)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 8)
    .map(x => ({
      u: x.name.split('?')[0].split('/').slice(-2).join('/').slice(0, 60),
      dur: Math.round(x.duration),
      kb: Math.round((x.transferSize || 0) / 1024),
    }))

  return JSON.stringify({
    url: location.pathname + location.search,
    timestamp: new Date().toISOString(),
    ttfb: Math.round((nav.responseStart || 0) - (nav.requestStart || 0)),
    fp: fp ? Math.round(fp.startTime) : null,
    fcp: fcp ? Math.round(fcp.startTime) : null,
    lcp: lcp ? Math.round(lcp.startTime) : null,
    lcpEl: lcp?.element?.tagName ? lcp.element.tagName + '.' + (lcp.element.className || '').split(' ')[0] : null,
    domInteractive: Math.round(nav.domInteractive || 0),
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
    loadEvent: Math.round(nav.loadEventEnd || 0),
    cls: Number(cls.toFixed(4)),
    cacheStatus: { totalRequests: r.length, fromNetwork: fresh.length, fromCache: r.length - fresh.length },
    transfer: { totalKB, decodedKB, byType, sizeKB },
    slowResources: slowest,
  }, null, 2)
})()
```

### Kullanım — browser_batch ile peş peşe

```js
mcp__Claude_in_Chrome__browser_batch({
  actions: [
    { name: 'navigate', input: { url: 'https://www.iyibiri.app/dashboard?fresh=' + Date.now(), tabId } },
    { name: 'computer', input: { action: 'wait', duration: 7, tabId } },
    { name: 'javascript_tool', input: { action: 'javascript_exec', tabId, text: STANDARD_SCRIPT } }
  ]
})
```

`?fresh=<timestamp>` query — Next.js soft navigation cache'ini bypass.

---

## 3. Cold / warm / repeat 3 state ölçümü

| State | Tetik | Ne ölçer |
|---|---|---|
| **Cold** | Yeni tab + cache disable + ilk visit | İlk kullanıcı LCP / TTFB / network bağımlı |
| **Warm** | Aynı tab + soft refresh (`?bust=<ts>`) | Browser cache + RSC payload |
| **Repeat** | Aynı tab + reload | bfcache + service worker cache |

Top 5 sayfa için 3'ü de; geri kalan için **warm** yeterli (en gerçekçi tekrar ziyaret senaryosu).

**Cold ölçüm için:**
```js
// Yeni tab oluştur
mcp__Claude_in_Chrome__tabs_create_mcp()
// DevTools cache disable yapamayız MCP'den; bunun yerine timestamp query ile cache miss tetikle
navigate('https://www.iyibiri.app/dashboard?fresh=' + Date.now() + '&_v=' + Math.random())
```

---

## 4. Network panel kullanımı

Slow resources detayı için `read_network_requests`:

```js
mcp__Claude_in_Chrome__read_network_requests({
  tabId,
  limit: 50,
  urlPattern: 'iyibiri.app',  // ya da specific path
})
```

Sonuçtan top N yavaş request + büyük transfer çıkar. PerformanceObserver script ile kıyas.

---

## 5. Output format — ölçüm raporu

`docs/eng/perf/YYYY-MM-DD-{baseline,after-faz-N}.md`:

```markdown
# Web Vitals Ölçümü — YYYY-MM-DD (baseline / after-faz-N)

**Reviewer:** performance-engineer
**Tetik:** baseline | after-faz-N | regression watch | per-page deep
**Browser:** Chrome MCP — production / dev
**Login:** [user]
**Sayfa sayısı:** N
**Cache state:** cold / warm / repeat

## Executive Summary

- Top 3 yavaş: [sayfa A 2.3s], [sayfa B 1.9s], [sayfa C 1.7s]
- Top 3 ağır: [sayfa A 3.5MB], [sayfa B 2.4MB], [sayfa C 1.8MB]
- En kritik bottleneck: [image / bundle / RSC waterfall / hydration]
- Hedef metric'ler:
  - LCP ≤2.5s ✗ (ortalama 3.2s)
  - Decoded ≤1.5MB ✗ (ortalama 2.4MB)
  - CLS ≤0.1 ✓
  - TTFB ≤500ms ✓ (ortalama 80ms)

## Sayfa karşılaştırma matrisi

| Sayfa | TTFB | FCP | LCP | DOM Int | Load | Decoded KB | Req | Verdict |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| /dashboard | 50 | 800 | 1900 | 2279 | 2363 | 2467 | 46 | 🔴 |
| /dashboard/missions | 52 | 700 | 1700 | 1616 | 2533 | 3550 | 61 | 🔴 |
| ... | | | | | | | | |

## Slow resources (cross-page top 10)

| URL | Sayfa | Dur (ms) | Size (KB) | Tip |
|---|---|---:|---:|---|
| photo-...unsplash | /missions | 857 | 0 | img |
| ... | | | | |

## Pattern detection

- **Image optimization eksik**: 5 sayfada Unsplash full-size çekiliyor (TD-038)
- **Bundle her sayfada heavy**: dynamic import 0 (TD-037)
- **Loading.tsx eksik**: 11 dashboard sayfa (TD-036)

## Fix önerileri (prioritized)

| ID | Konu | Etki | Effort | LNO | Sayfa |
|---|---|---|---|---|---|
| F-001 | next/image migration top 5 | -%80 image transfer | 2h | L | /missions, /dashboard, /donate |
| F-002 | Loading.tsx top 11 | algılanan +%30 | 1h | L | /donate, /posts, /profile/* |
| ... | | | | | |

## Bir önceki ölçüme göre delta (after-faz-N için)

| Sayfa | Önceki LCP | Şimdiki LCP | Δ | Önceki Decoded | Şimdiki Decoded | Δ |
|---|---:|---:|---:|---:|---:|---:|
| /dashboard | 1900 | 1100 | **-42%** ✅ | 2467 | 1200 | **-51%** ✅ |
| ... | | | | | | |

## Self-check

- [x] Standart script kullanıldı (web-vitals-measurement SKILL Bölüm 2)
- [x] Tüm hedef sayfalar test edildi
- [x] Cold/warm/repeat ayrımı yapıldı (top 5 için)
- [x] Pattern detection 3+ sayfa kuralı
- [x] Fix önerileri etki tahmini ile
- [ ] Lighthouse CI tetiklemesi (Faz 4'te kurulduğunda)

## Handoff log

- YYYY-MM-DD HH:MM — performance-engineer ✅ — measurement: docs/eng/perf/YYYY-MM-DD-*.md
```

---

## 6. Hedef metric'ler (tier-2 İyiBiri V1 pilot)

| Metric | Yeşil | Sarı | Kırmızı | Notu |
|---|---|---|---|---|
| **TTFB** | ≤500ms | 500-1000 | >1000 | Server response süresi |
| **FCP** | ≤1.8s | 1.8-3.0 | >3.0 | İlk içerik paint |
| **LCP** | ≤2.5s | 2.5-4.0 | >4.0 | Largest content paint (kritik!) |
| **CLS** | ≤0.1 | 0.1-0.25 | >0.25 | Layout shift |
| **INP** | ≤200ms | 200-500 | >500 | Interaction to Next Paint |
| **DOM Interactive** | ≤1.5s | 1.5-3.0 | >3.0 | Sayfa interactive |
| **Decoded body** | ≤1.5MB | 1.5-3.0 | >3.0 | Toplam decode edilen |
| **Total requests** | ≤30 | 30-60 | >60 | Network çağrı sayısı |
| **Lighthouse Perf** | ≥90 | 50-89 | <50 | Lighthouse score |

V2 hedef = tier-1 (≥90 perf score). V1 pilotta sarı kabul.

---

## 7. Cold start vs hot path

Production'da iki ölçüm önemli:

- **Cold start (first visit):** kullanıcı ilk kez geliyor; tüm asset'ler network'ten + RSC server-render. Lighthouse'un ölçtüğü genelde bu.
- **Hot path (return visit):** browser cache + service worker. Kullanıcı app'i tekrar açıyor.

İyiBiri PWA olduğu için **hot path daha kritik** — günlük kullanım. Ama cold start = ilk izlenim.

---

## 8. Lighthouse CI entegrasyon (Faz 4 hedefi)

Sprint Q3'te kurulduğunda:

`.github/workflows/lighthouse.yml`:
```yaml
name: Lighthouse CI
on: [pull_request]
jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            http://localhost:3000/dashboard
            http://localhost:3000/dashboard/missions
            http://localhost:3000/dashboard/donate
          configPath: ./lighthouserc.json
          uploadArtifacts: true
```

`lighthouserc.json` threshold:
```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.7 }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

---

## 9. Anti-patterns

❌ **Tek state ölçüm.** Cache hit'le karışmış data → fix etkisini yanlış raporlar. Cold + warm ayrı ölç.
❌ **PerformanceObserver buffered=false.** Page load'dan sonra çalıştırılınca entry kaçar. Her zaman buffered ya da `getEntriesByType`.
❌ **Network panel kullanmadan slow resources tahmin.** PerformanceObserver duration alanı sınırlı; gerçek timing için Network panel.
❌ **Fix sonrası aynı script ile ölçmeden raporlamak.** Etki kanıtsız → güvenilmez.
❌ **Tek browser/cihaz.** Mobile + desktop farklıdır; en azından top 10 sayfa için ikisi de.

---

## 10. Self-check (her ölçüm sonunda)

- [ ] Standart script kullanıldı.
- [ ] Tüm hedef sayfalar tarandı.
- [ ] Cache state belirtildi (cold/warm/repeat).
- [ ] Slow resources top 10 listesi var.
- [ ] Pattern detection 3+ sayfa kuralı uygulandı.
- [ ] Fix önerileri etki tahmini ile.
- [ ] Önceki ölçümle delta alındı (varsa).
- [ ] Status board + tracking board güncellendi.
- [ ] Tech Debt entry'leri açıldı (gerekiyorsa).
