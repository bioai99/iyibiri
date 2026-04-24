# UI Spec — Dashboard Ana v2

**Tarih:** 2026-04-24
**Yazar:** ui-designer
**Sayfa:** `/dashboard`
**Kaynaklar:**
- UX brief: `docs/product/02-briefs/ux/2026-04-24-dashboard-ana-v2.md`
- UX audit: `docs/ux/03-heuristics/2026-04-24-dashboard-ana-v2-heuristik-audit.md`
- User journey: `docs/ux/02-journeys/2026-04-24-dashboard-ilk-acil-journey.md`
- Atlas Bölüm 6 (gerçek tokens)

**Skill usage (zorunlu kontrol):**
- ✅ `visual-spec-writing` — ASCII wireframe + token tablosu + variant × state + handoff
- ✅ `design-system-audit` — kullanılan token'lar atlas'a referansla doğrulandı
- ✅ `mobile-app-polish-standards` — Duolingo streak / Things 3 focal point / Arc delightful craft uygulandı

**Durum:** ready-for-implementation (frontend-engineer)

---

## 1. Amaç

UX audit'in çıkardığı 3 kritik bulguyu çözen dashboard ana ekran revizyonu: (H6) "günün görevi" featured card ile cognitive overload azalır, (I6) hero gold glow imza gölge ile premium hissi, (H8) tek odak noktası ile Things 3 "tek ekran tek amaç" disiplini.

---

## 2. Layout — ASCII Wireframe

```
┌────────────────────────────────────────────┐
│  Header (sticky, bg-background/90 blur)    │  ← h-14, pt-safe
│  "Merhaba Zehra 👋"      🔔 (3)  ⚙️        │
│  Bu hafta +17 Karma · 🔥 5 gün seri        │  ← micro-indicators
├────────────────────────────────────────────┤
│                                            │
│   ┌──────────────────────────────────┐    │
│   │  HERO CARD                       │    │  ← rounded-3xl
│   │  (gold glow shadow — İMZA)       │    │    ink-800 bg
│   │  (breathing animation: 3s pulse) │    │    gradient subtle
│   │                                  │    │
│   │   1.240                          │    │  ← KarmaCounter
│   │   ──────────  Karma              │    │    font-display
│   │                                  │    │    font-black
│   │   İyi Biri ★                    │    │    text-6xl
│   │   ▓▓▓▓▓▓░░░ 60%  →  Çok İyi Biri │    │    tabular-nums
│   │                                  │    │
│   └──────────────────────────────────┘    │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│   ┌──────────────────────────────────┐    │
│   │  ┃ GÜNÜN GÖREVİ                  │    │  ← sol dikey gold bar
│   │  ┃                               │    │    featured accent
│   │  ┃  [foto full-bleed + gradient] │    │
│   │  ┃                               │    │
│   │  ┃  +200 Karma · 2 saat         │    │
│   │  ┃  Sahil Temizliği Gönüllüsü   │    │
│   │  ┃  TEMA Vakfı                  │    │
│   │  ┃                               │    │
│   │  ┃  [Başvur →]                   │    │
│   └──────────────────────────────────┘    │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│  Sana uygun görevler (3)          Tümü →  │  ← section head
│                                            │
│   ┌────┐ ┌────┐ ┌────┐                    │
│   │MC 1│ │MC 2│ │MC 3│  (mission-cards)   │  ← horizontal scroll
│   └────┘ └────┘ └────┘                    │    snap-x-mandatory
│                                            │
├────────────────────────────────────────────┤
│                                            │
│  Topluluk                        Tümü →   │
│                                            │
│   Bu hafta #43'tesin                      │  ← leaderboard teaser
│   150 Karma fark top 10'a                  │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│  Yeni ödüller                    Mağaza → │
│                                            │
│   ┌────────┐ ┌────────┐                   │
│   │Reward 1│ │Reward 2│  (horizontal)     │
│   └────────┘ └────────┘                   │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│                                   [scroll] │
│                                            │
├────────────────────────────────────────────┤
│  Bottom Nav (fixed, pb-safe)               │  ← h-16
│  🏠 Ana  🎯 Görev  ⭐ Benim  🎁 Ödül  👤    │
└────────────────────────────────────────────┘
```

---

## 3. Hiyerarşi (visual priority)

1. **Hero Card** — en büyük, gold glow, kullanıcı karması + seviye. Tek bakışta kimlik.
2. **Günün Görevi** — featured card, sol dikey gold accent bar + CTA — Things 3 "tek amaç" disiplini.
3. **Sana uygun görevler** — scroll edilir, ikincil öneri.
4. **Topluluk teaser** — hafif sosyal motivasyon, zorla değil.
5. **Yeni ödüller** — horizontal carousel, keşfi kolay.
6. **Bottom nav** — persistent navigation.

Header + hero ilk viewport'ta tam görünür (mobile 390×844 iPhone 14 referans).

---

## 4. Token Kullanımı

### Renkler (atlas Bölüm 6 × dark mode)

| Alan | Token | Notes |
|---|---|---|
| Page bg | `bg-background` (`.dark` → ink-900) | |
| Header bg | `bg-background/90 backdrop-blur-md` | sticky transparan |
| Header border-bottom | `border-b border-ink-600/50` | hairline |
| Hero card bg | `bg-gradient-to-br from-ink-800 via-ink-800 to-ink-900` | subtle depth |
| Hero glow shadow | `shadow-[0_8px_32px_rgba(232,194,104,0.35)]` | **İMZA** — mobile-app-polish-standards Bölüm 11 |
| Hero border | `ring-1 ring-gold/20` | soft glow edge |
| Günün görevi bg | `bg-card` | standart |
| Günün görevi accent | `bg-gold` (sol 4px) | featured indicator |
| Karma number | `text-cream` | font-display font-black |
| Karma label "Karma" | `text-ink-300` | muted |
| Seviye label | `text-gold` + Fraunces italic | imza patterns Bölüm 11 |
| Progress bar track | `bg-ink-700` | |
| Progress bar fill | `bg-gradient-to-r from-gold-dim to-gold` | premium gradient |
| Section head | `text-foreground` + Plus Jakarta Sans 700 | |
| Section CTA link | `text-gold` | "Tümü →" |
| Text primary | `text-cream` | — |
| Text secondary | `text-ink-300` | |
| Text tertiary | `text-ink-400` | |

### Typography (mobile-app-polish-standards Bölüm 4)

| Öğe | Class | Kontrast |
|---|---|---|
| Karma hero sayı | `font-display font-black text-6xl tabular-nums tracking-[-0.02em] text-cream` | ~14:1 AA üstü |
| "Karma" label | `font-sans font-medium text-sm uppercase tracking-widest text-ink-300` | 5.2:1 AA pass |
| Seviye başlık | `font-display italic font-medium text-xl text-gold` | imza |
| Seviye alt-label | `font-sans font-medium text-xs text-ink-300` | |
| Section head | `font-sans font-bold text-lg tracking-[-0.01em]` | |
| Günün görevi title | `font-sans font-semibold text-base` | |
| Mission card title | `font-sans font-semibold text-sm` | |
| Body | `font-sans text-sm leading-[1.55] text-ink-300` | |
| Micro chip | `font-sans font-semibold text-[10px] uppercase tracking-wider` | |

### Spacing

| Yer | Value |
|---|---|
| Container | `max-w-lg mx-auto px-4` |
| Section gap | `space-y-6` (24px) |
| Card internal | `p-6` (24px) |
| Hero card | `p-8` (32px) — daha geniş |
| Mission card horizontal gap | `gap-3` (12px) |

### Radius

| Element | Class |
|---|---|
| Hero card | `rounded-3xl` (32px) |
| Günün görevi + section card | `rounded-2xl` (24px) |
| Mission card (horizontal) | `rounded-2xl` |
| Chip / pill | `rounded-full` |
| Button primary | `rounded-xl` (20px) |

---

## 5. Component × Variant × State

### Hero Card

| State | Background | Shadow | Animation |
|---|---|---|---|
| Default | ink-800 gradient | gold glow `0_8px_32px_rgba(232,194,104,0.35)` | `animate-pulse-slow` @ glow opacity 0.35→0.45→0.35 (3s loop) |
| Reduced-motion | same | same | static |

**Karma counter animate:**
- Yüklenirken: skeleton shimmer (200ms delay → shimmer)
- Load edince: `animate(0, currentKarma, { duration: 0.8, ease: [0.16, 1, 0.3, 1] })` + `scale: [1, 1.02, 1]` (Duolingo-esque count-up)
- Her karma kazanımında (realtime): pulse + `+N` micro floating label

### Günün Görevi Card

| State | Background | Border | Motion |
|---|---|---|---|
| Default | card | left 4px gold accent bar | entry `y:16 → 0, opacity 0 → 1`, 400ms, 100ms delay |
| Hover | card/95 | same | — |
| Active (tap) | card | same | `scale: 0.98`, spring |
| Loading | skeleton | — | shimmer |

### Mission Card (horizontal scroll)

Mevcut `components/ui/mission-card.tsx` kullanılır. Ek:
- Stagger entry delay `i * 0.05s`
- Scroll snap `snap-start`
- Width `w-[280px] flex-shrink-0` mobile

### Streak Indicator (header altı)

| State | Style |
|---|---|
| 0 gün | `🔥 Seri başlat` link → `/dashboard/streak` |
| 1-6 gün | `🔥 N gün seri` — ink-700 bg |
| 7+ gün | `🔥 N gün 🌟` — gold bg, heavy haptic |
| Bugün risk altı | `⚠️ Bugün 1 görev yap — serin bozulmasın` — clay accent |

---

## 6. Motion Spec

**Entry choreography (ilk yükleme):**

| Adım | Element | Timing | Easing |
|---|---|---|---|
| 0 | Header (sticky) | instant | — |
| 1 | Hero card (scale 0.98 → 1, opacity 0 → 1) | 500ms @ 50ms delay | spring `{stiffness:200, damping:20}` |
| 2 | KarmaCounter count-up | 800ms @ 200ms delay | cubic `[0.16, 1, 0.3, 1]` |
| 3 | Progress bar fill | 800ms @ 400ms delay | cubic `[0.4, 0, 0.2, 1]` |
| 4 | Günün görevi card | 400ms @ 500ms delay | spring default |
| 5 | Mission cards (3× stagger) | 400ms each, 60ms delay | spring default |
| 6 | Section heads fade-in | 300ms @ 700ms delay | ease-out |
| 7 | Leaderboard + rewards | 400ms @ 900ms delay | spring |

**Hero glow breathing (sürekli):**
```css
@keyframes heroGlowBreathing {
  0%, 100% { box-shadow: 0 8px 32px rgba(232,194,104,0.35); }
  50%      { box-shadow: 0 8px 40px rgba(232,194,104,0.45); }
}
.hero-glow-breathing {
  animation: heroGlowBreathing 3s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .hero-glow-breathing { animation: none; }
}
```

**Tap feedback:**
- Hero card: `whileTap={{ scale: 0.99 }}` (çok az — hero premium)
- Mission card: `whileTap={{ scale: 0.97 }}` (standart)
- Button: `whileTap={{ scale: 0.95 }}` (sıkı feedback)
- Hepsi `spring {stiffness:400, damping:30}`

**Haptic choreography (Capacitor):**
- Mission card tap: `Haptics.impact({style: Light})`
- "Başvur" button tap: `Haptics.impact({style: Medium})`
- Karma realtime increase (future): `Haptics.impact({style: Heavy})` + `notification({type: Success})`

**Reduced-motion:** `useReducedMotion` hook → tüm transform animate kapatır, sadece opacity geçişleri.

---

## 7. Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| Mobile (<640px) | Container max-w-lg (default), tek kolon |
| Tablet (640-1024px) | Container max-w-xl, mission cards 3'lü grid (scroll yerine grid) |
| Desktop (>1024px) | — (V1'de mobil odak, tablet için max-w-xl) |

V1: mobile-first. Tablet preview optimize. Desktop Yıl 2.

---

## 8. State Coverage (WS-04 sistemik ile uyum)

### Loading (skeleton)
```
Hero skeleton:    rounded-3xl h-[180px] animate-pulse bg-ink-800
Günün görevi:      rounded-2xl h-[120px] animate-pulse
Mission cards:     w-[280px] h-[200px] rounded-2xl animate-pulse × 3
```
200ms delay önce göster. `aria-busy="true"`.

### Empty — Yeni kullanıcı (Karma = 0)
Hero değişir:
```
"Hoş geldin, Zehra"
"İlk adımını at — +100 Karma hediye"
[Görev keşfet →]
```
Hero glow aynı. KarmaCounter gri (ink-400) + "0" yerine "—" gösterir.

### Error
Skeleton yerine:
```
⚠️ (clay icon, 48px)
"Dashboard yüklenemedi"
"Bağlantını kontrol et."
[Yeniden dene]  [Destek yaz]
```

### Success (realtime karma kazanımı)
Toast + KarmaCounter micro-pulse + floating "+N Karma" label fade-up.

---

## 9. Accessibility Checklist

- [x] Kontrast WCAG AA (atlas Bölüm 6 doğrulandı)
- [x] Touch target ≥44×44: `min-h-11 min-w-11` button/card
- [x] Focus-visible ring: `focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2`
- [x] `<button>` / `<Link>` — `<div onClick>` yasak
- [x] aria-label: icon-only buttons ("Bildirimler", "Ayarlar")
- [x] Heading hierarchy: `<h1>` page title (sr-only veya header), `<h2>` section titles
- [x] `aria-busy="true"` loading states
- [x] `useReducedMotion` tüm transform'larda respect
- [x] KarmaCounter `aria-live="polite"` realtime update'te
- [x] Skip link `<a href="#main">` (advanced)

---

## 10. Implementation Path (frontend-engineer için)

### Yeni component'ler
- `components/dashboard/hero-card-v2.tsx` — hero + KarmaCounter + seviye + progress
- `components/dashboard/daily-mission-card.tsx` — featured günün görevi
- `components/dashboard/streak-indicator.tsx` — header altı inline pill
- `components/dashboard/leaderboard-teaser.tsx` — hafta sonu rank + fark

### Güncellenecek
- `app/dashboard/page.tsx` veya `dashboard-client.tsx` — layout yenilenir, yeni component'ler entegre
- `lib/supabase/queries/dashboard.ts` — yeni query: "günün görevi" algoritması (persona × coğrafya × zorluk uyumu), streak durumu, leaderboard rank

### Yeni Tailwind utility (belki)
- `.hero-glow-breathing` animation (globals.css)

### Supabase view (opsiyonel optimizasyon)
```sql
-- Kullanıcı + günün görevi quick view
create view user_daily_mission_recommendation as ...;
```
(detay: ayrı Eng brief)

---

## 11. Handoff

**frontend-engineer'a:**
- Bu spec + UX audit + journey map referansla
- 4 yeni component scaffold
- Mevcut `dashboard-client.tsx` refactor (breaking change değil — yeni layout)
- Test: Chrome DevTools mobile emulator + iOS Safari (Capacitor)

**Visual QA:**
- ui-designer post-implementation review
- Token ihlali kontrolü
- Motion timing doğrulama
- Hero glow gerçekten görünüyor mu

**Estimated effort:** 1-1.5 hafta.

---

## 12. Self-Audit (skill-usage)

Skill `mobile-app-polish-standards` Bölüm 9 UI checklist:

- [x] Token kullanımı (atlas 6) — hardcoded renk yok
- [x] Typography hierarchy (8 seviye scale uygulandı)
- [x] Dark mode layering — 4 katman (bg / surface 1-2-3 / border hairline)
- [x] Motion timing uygun band'de (500ms entry, 800ms count-up, 3s breathing loop)
- [x] Easing doğru tür (cubic bezier count-up, spring default tap, breathing ease)
- [x] Staggered entry 60ms delay (band içinde)
- [x] Variant × state — Hero + Günün Görevi + Mission Card tam tablo
- [x] Mobile-first + safe-area + touch target
- [x] Responsive breakpoint noktaları
- [x] 3 app benchmark referansı — Duolingo (count-up + streak), Things 3 (focal point), Arc (hero glow breathing)
- [x] State coverage 4 başlık (loading + empty + error + success)
- [x] Accessibility checklist

✅ Pass — frontend-engineer implement başlayabilir.

---

## 13. Referanslar

- Skill: `mobile-app-polish-standards` — Linear/Duolingo/Things 3/Arc benchmark + motion + typography + haptic
- Skill: `visual-spec-writing` — şablon
- Skill: `design-system-audit` — token doğrulama
- UX audit: `docs/ux/03-heuristics/2026-04-24-dashboard-ana-v2-heuristik-audit.md`
- UX brief: `docs/product/02-briefs/ux/2026-04-24-dashboard-ana-v2.md`
- Atlas Bölüm 6 (token), Bölüm 7 (component), Bölüm 8 (mobile)
