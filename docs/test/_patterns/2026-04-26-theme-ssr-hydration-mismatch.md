# Pattern J — Theme SSR + Hydration Mismatch (BUG-022/024)

**Tespit eden:** test-engineer (Faz 2 P1 + Faz 2 M1, 2026-04-26)
**Tarih:** 2026-04-26
**Etkilenen bug'lar:** BUG-022 (mission detail dark), BUG-024 (profil dark) ve potansiyel olarak TÜM inner page'ler
**Severity:** P1 sistemik (UX bozuk — light mode kullanıcısı dark page görüyor)
**Etkilenen kullanıcı segmenti:** Light mode tercih eden tüm kullanıcılar

## Kök neden

`lib/theme.tsx` ThemeProvider:

```typescript
function getInitialMode(initial: Mode): Mode {
  if (typeof window === 'undefined') return initial
  const stored = localStorage.getItem('iyibiri-theme') as Mode | null
  return (stored === 'light' || stored === 'dark') ? stored : initial
}

const [mode, setModeState] = useState<Mode>(() => getInitialMode(initial))
```

**`useState` lazy init React hydration semantiği:**
- **Server-side:** `getInitialMode('dark')` çalışır, `typeof window === 'undefined'` → `'dark'` döner. SSR HTML'i mode='dark' ile render edilir, inline styles `background: '#24201B'` (dark `c.ink900`) baked olur.
- **Client-side hydration:** `useState` HER ZAMAN server'dan gelen state'i kullanır. **Lazy init function (`() => getInitialMode(initial)`) client'da TEKRAR ÇAĞRILMAZ.** Yani client `localStorage.getItem('iyibiri-theme')` hiç okumuyor!
- Sonuç: mode='dark' kalıyor, inline styles dark renkler. Dashboard çalışmasının sebebi: kullanıcı önce dashboard'a giriyor ve **manuel theme toggle** ile setMode çağırıyor → mode='light' state'e geçiyor → dashboard re-render LIGHT olur. Ama navigate edilen profil/mission detail önceki cached state'i kullanıyor (yeni component mount'unda mode'u alıyor — light, ama yeni page mount **route navigation'dan önce** SSR yapılıyor → yine dark...).

Aslında daha kötüsü: **navigation sonrası** mission detail/profile için fresh SSR mode='dark' baked ile geliyor. Client hydrate olduğunda Provider state `'light'` (toggle'dan), context `'light'` döner, ama **inline style değerleri zaten render edilmiş HTML'de dark olarak duruyor** ve React reconciliation inline style'ları RE-RENDER yaparak güncellemeli. Eğer component re-render olmuyorsa style güncellenmez.

Hipotez ama: React reconciliation inline styles'ı inline'a güncellemiyor olabilir ya da useTheme hook çağrı sırasında stale snapshot dönüyor.

## Kanıt

### Light mode kullanıcı için ölçümler

```javascript
localStorage.getItem('iyibiri-theme')  // → 'light'
document.body.style.backgroundColor    // → 'rgb(247, 246, 242)' cream (light) ✅

// Profile main container
const main = document.querySelector('div[clientHeight > 1500]')
getComputedStyle(main).backgroundColor // → 'rgb(36, 32, 27)' DARK (`c.ink900` from DARK theme)
getComputedStyle(main).color           // → 'rgb(244, 238, 223)' DARK cream
```

**Body cream (light) + container dark.** Container `useTheme()` çağırıyor ama dark colors alıyor.

### Etkilenen sayfalar

- ✅ Dashboard (theme toggle direkt orada → mode flips immediately)
- ❌ /dashboard/profile
- ❌ /dashboard/missions/[id] (not-yet-taken state)
- ❌ /dashboard/streak (muhtemelen)
- ❌ /dashboard/leaderboard (muhtemelen)
- Diğer inner page'ler de aynı pattern'le kırılmış olabilir

## Önerilen sistemik fix

### A — useEffect ile post-hydration localStorage read ✅ APPLIED

Eski (yanlış):
```typescript
const [mode, setModeState] = useState<Mode>(() => getInitialMode(initial))
```

Yeni (Vol-12):
```typescript
const [mode, setModeState] = useState<Mode>(initial)  // Always 'dark' on hydration

useEffect(() => {
  const stored = localStorage.getItem('iyibiri-theme') as Mode | null
  if ((stored === 'light' || stored === 'dark') && stored !== mode) {
    setModeState(stored)
  }
}, [])  // run once after mount
```

**Trade-off:** First paint dark olur (SSR + initial hydration), sonra useEffect çalışınca light'a flip eder (FOUC — flash of unstyled content). 50-100ms görünür. Acceptable trade-off için "instant" çalışan sistemik fix.

### B — Daha temiz alternatif: cookie-based SSR theme (Vol-13)

next-themes kütüphanesi pattern:
1. ThemeProvider setMode'da `document.cookie = 'iyibiri-theme=light; path=/'` set eder
2. `app/layout.tsx` Server Component'te cookie okur: `const cookieStore = cookies(); const theme = cookieStore.get('iyibiri-theme')?.value`
3. `<ThemeProvider initial={theme}>` ile geçer
4. Server zaten doğru tema ile render eder, FOUC yok

Bu daha kalıcı çözüm ama 30 dk eklenecek effort. Vol-13 öncelikli.

### C — script tag ile inline pre-hydration

```html
<!-- app/layout.tsx body öncesi -->
<script dangerouslySetInnerHTML={{ __html: `
  (function() {
    var stored = localStorage.getItem('iyibiri-theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
  })();
`}} />
```

Sonra theme tokens CSS variable ile `[data-theme="light"]` selector kullansın. Bu en hızlı paint ama büyük refactor (inline styles → CSS variables).

## Estimated effort

- A) useEffect post-hydration: ✅ 5 dk (yapıldı, FOUC trade-off)
- B) Cookie-based SSR: 30 dk (Vol-13)
- C) CSS variable refactor: 2 saat (Vol-14, full DS taxonomy gözden geçirme)

## Dosyalar etkilenen

- `lib/theme.tsx` — useState lazy → useEffect pattern (A applied)
- (Vol-13) `app/layout.tsx` — Server Component cookie okuma
- (Vol-13) `lib/theme.tsx` — setMode'da document.cookie set

## Handoff

- **Lead:** design-system-keeper (B + C kararı) + frontend-engineer (B impl)
- **Acil mi:** P1 sistemik — UX bozuk ama site çalışıyor

## Handoff Log

- 2026-04-26 03:00 — test-engineer ✅ — Pattern memo açıldı + A fix uygulandı.
- (bekleniyor) — Vol-12 push + +t5 ile profile/mission detail dark→light flip verify.
- (bekleniyor) — Vol-13 cookie-based SSR (kalıcı fix) — design-system-keeper review.
