# Web Vitals Measurement Protocol — quick reference

> **Detay:** [`.claude/skills/web-vitals-measurement/SKILL.md`](../../.claude/skills/web-vitals-measurement/SKILL.md)
> **Bu dosya:** quick reference + standart script kopyalanabilir formda.

## 1. Önkoşullar

- Chrome MCP bağlı (`list_connected_browsers` → 1+ device).
- Production URL: `https://www.iyibiri.app` (login gerekiyorsa kullanıcı browser'da login).
- Dev URL: `http://localhost:3000` (gerekiyorsa `npm run dev`).

## 2. Tek sayfa ölçüm pattern

```
mcp__Claude_in_Chrome__browser_batch({
  actions: [
    { name: 'navigate', input: { url: 'https://www.iyibiri.app/dashboard?fresh=' + Date.now(), tabId } },
    { name: 'computer', input: { action: 'wait', duration: 7, tabId } },
    { name: 'javascript_tool', input: { action: 'javascript_exec', tabId, text: STANDARD_SCRIPT } }
  ]
})
```

## 3. Standart script (kopya kullanım)

```js
(() => {
  const nav = performance.getEntriesByType('navigation')[0] || {}
  const paints = performance.getEntriesByType('paint')
  const fp = paints.find(p => p.name === 'first-paint')
  const fcp = paints.find(p => p.name === 'first-contentful-paint')
  const lcp = performance.getEntriesByType('largest-contentful-paint').slice(-1)[0]
  const cls = performance.getEntriesByType('layout-shift')
    .filter(e => !e.hadRecentInput)
    .reduce((s, e) => s + e.value, 0)
  const r = performance.getEntriesByType('resource')
  const fresh = r.filter(x => (x.transferSize || 0) > 100)
  const totalKB = Math.round(r.reduce((s,x) => s + (x.transferSize||0), 0) / 1024)
  const decodedKB = Math.round(r.reduce((s,x) => s + (x.decodedBodySize||0), 0) / 1024)
  const slowest = r.filter(x => x.duration > 200)
    .sort((a,b) => b.duration - a.duration)
    .slice(0, 8)
    .map(x => ({ u: x.name.split('?')[0].split('/').slice(-2).join('/').slice(0,60), dur: Math.round(x.duration), kb: Math.round((x.transferSize||0)/1024) }))
  return JSON.stringify({
    url: location.pathname + location.search,
    timestamp: new Date().toISOString(),
    ttfb: Math.round((nav.responseStart||0) - (nav.requestStart||0)),
    fp: fp ? Math.round(fp.startTime) : null,
    fcp: fcp ? Math.round(fcp.startTime) : null,
    lcp: lcp ? Math.round(lcp.startTime) : null,
    lcpEl: lcp?.element?.tagName ? lcp.element.tagName + '.' + (lcp.element.className||'').split(' ')[0] : null,
    domInteractive: Math.round(nav.domInteractive||0),
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd||0),
    loadEvent: Math.round(nav.loadEventEnd||0),
    cls: Number(cls.toFixed(4)),
    cacheStatus: { totalRequests: r.length, fromNetwork: fresh.length, fromCache: r.length - fresh.length },
    transfer: { totalKB, decodedKB },
    slowResources: slowest,
  }, null, 2)
})()
```

## 4. Hedef sayfa listesi (35+ user-facing)

```
/dashboard
/dashboard/missions
/dashboard/missions/[id]
/dashboard/missions/[id]/complete
/dashboard/my-missions
/dashboard/donate
/dashboard/donate/[ngoId]
/dashboard/donate/[ngoId]/give
/dashboard/discover
/dashboard/ngos
/dashboard/ngos/[id]
/dashboard/ngos/[id]/membership
/dashboard/ngos/[id]/membership/success
/dashboard/posts/[id]
/dashboard/profile
/dashboard/profile/edit
/dashboard/profile/badges
/dashboard/profile/karma
/dashboard/profile/donations
/dashboard/profile/interests
/dashboard/leaderboard
/dashboard/notifications
/dashboard/saved
/dashboard/streak
/dashboard/tiers
/dashboard/rewards
/dashboard/rewards/[id]
/dashboard/sponsors/[id]
/dashboard/settings
/auth/signin
/auth/signup
/auth/login
/auth/forgot-password
/auth/reset-password
/onboarding/welcome
/onboarding/causes
/onboarding/city
/ (landing)
```

`[id]` parametreli route'lar için sample ID gerekli (Test user'ın profilinden alınabilir veya admin/devtools fixture'ları).

## 5. Output rapor lokasyon

`docs/eng/perf/YYYY-MM-DD-{baseline,after-faz-N}.md` — `web-vitals-measurement` SKILL Bölüm 5 template.

## 6. Ölçüm sırası (35 sayfa için optimum)

1. **Anonim sayfalar önce** (login gerekmez): /, /auth/*, /onboarding/* (8 sayfa, ~80 sn)
2. **Dashboard ana liste sayfaları:** /dashboard, /missions, /ngos, /donate, /discover, /rewards, /leaderboard, /notifications, /saved, /streak, /tiers, /profile, /settings (13 sayfa, ~130 sn)
3. **Detay sayfalar (sample ID gerek):** /missions/[id], /ngos/[id], /posts/[id], /donate/[ngoId], /rewards/[id], /sponsors/[id], /membership, /membership/success (8 sayfa, ~80 sn)
4. **Profile alt sayfalar:** /profile/{edit,badges,karma,donations,interests} (5 sayfa, ~50 sn)
5. **Mission complete:** /missions/[id]/complete + /donate/[ngoId]/give (2 sayfa, ~20 sn)

**Total:** ~360 sn = 6 dk + ara verme + retry = ~10 dk full baseline.

## 7. Edge case'ler

- **Sayfa redirect ediyor (auth/onboarding):** ölçüm sayfanın final URL'inden olmalı. Login session kontrol et.
- **404 / not found:** sample ID'ler önceden test edilmeli.
- **Mobil viewport:** `mcp__Claude_in_Chrome__resize_window` ile 390×844 (iPhone) + 1280×720 (desktop) ayrı ölçüm.
- **Slow 3G simülasyon:** Chrome DevTools'tan manuel; MCP'den henüz desteklenmiyor → kullanıcıya talep.
- **bfcache (back/forward cache):** repeat visit ölçümü için tarayıcı history navigation.
