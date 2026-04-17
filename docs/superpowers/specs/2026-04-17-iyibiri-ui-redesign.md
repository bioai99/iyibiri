# İyiBiri — UI Redesign Spec
**Date:** 2026-04-17
**Scope:** Full visual redesign of all main screens — Dashboard, Missions, Rewards, Profile
**Approach:** "Living Cards" — gradient/white split cards, Lucide icon system, premium animations

---

## Design Philosophy

Top-tier reference apps: Duolingo (playful energy, chunky cards, gamification ön planda), VividVocab (card richness, bold typography), Midas (premium feel, gold accents).

**Core principle:** Every screen should feel like a considered product decision, not assembled from defaults. Cards breathe, numbers command attention, animations have physical weight.

No emojis as UI elements. All iconography uses Lucide React icons with styled colored backgrounds.

---

## Design Tokens

### Colors
```
Background:     #FAFAF7  (warm cream — replaces #F4F4F0)
Card:           #FFFFFF  with shadow-[0_4px_24px_rgba(0,0,0,0.08)]
Primary:        #F4B942  (existing amber — unchanged)
Text primary:   #1C1917
Text muted:     #78716C
Border:         #E7E5E0
```

### Domain Gradients
```
nature:    from-emerald-500 to-teal-400     (Leaf icon)
education: from-blue-500 to-indigo-400      (BookOpen icon)
social:    from-rose-500 to-pink-400        (Heart icon)
financial: from-amber-500 to-orange-400     (Coins icon)
default:   from-stone-400 to-stone-500      (Sparkles icon)
```

### Typography
```
Karma display:    text-6xl font-black tracking-tight
Page title:       text-3xl font-extrabold
Section title:    text-xl font-bold
Card title:       text-base font-bold
Body:             text-sm
Muted label:      text-xs text-muted
```

### Cards
```
Border radius:    rounded-3xl
Padding:          p-5 (standard), p-4 (compact)
Shadow:           shadow-[0_4px_24px_rgba(0,0,0,0.08)]
Hover shadow:     shadow-[0_12px_40px_rgba(0,0,0,0.13)]
Hover translate:  -translate-y-1.5
Tap scale:        scale(0.97) spring
```

---

## Icon System

All icons are from `lucide-react`. No emoji used in UI (exception: CelebrationOverlay only).

### Domain Icon Map
```
nature    → Leaf
education → BookOpen
social    → Heart
financial → Coins
default   → Sparkles
```

### Icon Container Styles
- **On gradient background:** `bg-white/20 rounded-xl p-2.5` with white icon
- **On white background:** `bg-[domain-color]/10 rounded-xl p-2.5` with domain-colored icon

### UI Icons (non-domain)
```
Streak:       Flame       (amber-500 on white bg)
Karma:        Sparkles    (amber-500)
Duration:     Clock       (stone-400)
Difficulty:   Zap         (color varies)
Arrow:        ChevronRight
Locked:       Lock        (stone-400)
Completed:    CheckCircle2 (emerald-500)
Profile:      User
Settings:     Settings2
Logout:       LogOut
```

---

## Animations

All animations use Framer Motion.

### Entrance (all cards/sections)
```typescript
initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0 }}
transition={{ type: 'spring', stiffness: 400, damping: 30, delay: index * 0.05 }}
```

### Tap Feedback
```typescript
whileTap={{ scale: 0.97 }}
transition={{ type: 'spring', stiffness: 500, damping: 30 }}
```

### Hover (desktop/large screen)
```typescript
whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.13)' }}
```

### Karma Counter Change
```typescript
animate={{ scale: [1, 1.1, 1] }}
transition={{ type: 'spring', stiffness: 500, damping: 15 }}
```

### Page Entrance
```typescript
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ type: 'spring', stiffness: 380, damping: 30 }}
```

### XP Bar Fill
```typescript
initial={{ width: 0 }}
animate={{ width: `${percent}%` }}
transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.3 }}
```

---

## Screen 1: Dashboard

### Hero Card
Full-width gradient card (`from-amber-400 to-orange-500`, `rounded-3xl`):

```
┌─────────────────────────────────────┐
│ Merhaba, Bahadır          [🔥 3 gün] │  ← Flame icon in bg-white/20 pill
│                                     │
│         ✦  0                        │  ← text-6xl font-black text-white
│                                     │
│  [İyi Biri ·Tier 1]                 │  ← white pill badge
│  ████░░░░░░░░░  Tier 2'ye 500 karma │  ← white XP bar
└─────────────────────────────────────┘
```

- Streak pill: `bg-white/20 rounded-full px-3 py-1.5` — Flame icon + count + "gün"
- Karma icon: Sparkles lucide, `text-white/70`, inline before number
- XP bar track: `bg-white/20`, fill: `bg-white`, `rounded-full h-1.5`
- Tier badge: `bg-white/20 text-white rounded-full px-3 py-1 text-xs font-bold`

### In-Progress Missions
Horizontal scroll (`overflow-x-auto`, `flex gap-3`, `pb-2`):
- Compact mission cards (width ~260px)
- Shows 1.3 cards to signal scrollability (peek effect)

### Featured Missions
Vertical stack, full-width mission cards with stagger animation.

Section header: title left + "Tümü →" right in primary color.

### Discover Grid (2×2)
Each cell: `rounded-3xl p-5` with domain gradient background:
- Lucide icon in `bg-white/20 rounded-xl p-2.5` (white)
- Label: `text-white font-bold text-sm` below icon
- Tap scale animation

Cells: STK'lar (Handshake), Ödüller (Gift), Görevler (ClipboardList), Profil (User)

---

## Screen 2: Mission Card Component

Two-part card, no emojis:

### Top Gradient Band (40% height, `min-h-[100px]`)
```
┌─────────────────────────────────────┐
│ [Icon bg-white/20]      ✦ 150 karma │  ← karma in bg-white/20 pill
│                                     │
│ ÇEVRE & DOĞA STK                    │  ← NGO name, text-white/70 text-xs
└─────────────────────────────────────┘
```

### Bottom White Section (60%)
```
┌─────────────────────────────────────┐
│ Fidan Dikimi Kampanyası             │  ← font-bold text-stone-900
│ İstanbul genelinde 1000 fidan...    │  ← text-sm text-muted, 1 line clamp
│                                     │
│ [Clock 2 saat] [Zap Kolay]    [›]  │  ← chips + arrow
└─────────────────────────────────────┘
```

### States
- **Completed:** green `CheckCircle2` icon overlay top-right of gradient band, card `opacity-80`
- **In progress:** `ring-2 ring-primary` around card, "Devam Ediyor" badge in bottom section
- **Locked (future):** gradient desaturated, lock icon

### Difficulty Badge Colors
```
easy:   bg-emerald-100 text-emerald-700
medium: bg-amber-100 text-amber-700
hard:   bg-red-100 text-red-700
```

---

## Screen 3: Missions List Page

### Header
```
Görevler          [6]   ← count in primary-colored badge
```

### Filter Chips (horizontal scroll)
```
[Tümü] [Doğa] [Eğitim] [Sosyal] [Finansal]
```
- Inactive: `bg-white border border-border rounded-full px-4 py-2 text-sm`
- Active: `bg-[domain-gradient]` (gradient background) `text-white rounded-full px-4 py-2 text-sm font-semibold`
- Domain icon (16px Lucide) left of label when active

### Mission List
Full-width cards, stagger entrance animation.

### Empty State
Centered: large `ClipboardX` Lucide icon in `bg-stone-100 rounded-3xl p-6`, title, muted description.

---

## Screen 4: Rewards Page

### Header
```
Ödüller
Karma bakiyen: ✦ 0    ← small pill showing current karma
```

### Reward Card — Ticket Design

```
┌──┬────────────────────────────┬╌╌╌┬──────────┐
│  │ Cinemaximum Sinema Bileti  │   │  Kullan  │ ← primary bg button
│▓▓│ Bir film keyfi seni bekl. │ ╌ │          │   OR
│▓▓│ ✦ 400 karma               │   │  🔒      │ ← locked
│  │                            │   │  400 ›   │
└──┴────────────────────────────┴╌╌╌┴──────────┘
 ↑
 Domain gradient vertical strip (w-3, rounded-l-3xl)
```

- Left strip: `w-3 rounded-l-3xl bg-gradient-to-b from-[domain]`
- Body: `flex-1 p-4`
- Divider: `border-r border-dashed border-border`
- Right action: `w-20 flex items-center justify-center`
- Locked state: strip desaturated (`grayscale`), card `opacity-60`
- Sufficient karma: `bg-primary text-white font-bold rounded-r-3xl`

---

## Screen 5: Profile Page

### Hero Section (`bg-stone-900`, `rounded-b-3xl`)
```
        [Avatar ring-4 ring-primary]
           Bahadır Öylümlü
         [İyi Biri · Tier 1]           ← amber pill

              ✦  0                     ← text-4xl font-black text-white
         Toplam Karma
```

### Stats Grid (2×2)
White cards, `rounded-3xl`, each:
- Top: Lucide icon in domain-colored `rounded-xl bg-[color]/10 p-2`
- Middle: big number `text-3xl font-black`
- Bottom: label `text-xs text-muted`

Stats: Tamamlanan (CheckCircle2, emerald), Karma (Sparkles, amber), Streak (Flame, orange), Rozet (Trophy, purple)

### Tier Progress Card
Full-width white card:
- Header: current tier name + next tier name
- XP bar (spring animated, primary color fill)
- Below bar: "X karma daha kazan" label

### Logout
Bottom of page: text button with `LogOut` icon, `text-stone-400` — understated, not destructive-looking.

---

## Files to Create/Modify

### New shared components
- `components/ui/domain-icon.tsx` — DomainIcon component (icon + styled container)
- `components/ui/mission-card.tsx` — full rewrite
- `components/ui/reward-card.tsx` — ticket design rewrite

### Page rewrites
- `app/dashboard/dashboard-client.tsx`
- `app/dashboard/missions/missions-client.tsx` (extract from page if needed)
- `app/dashboard/rewards/rewards-client.tsx`
- `app/dashboard/profile/page.tsx`

### Tailwind tokens
- `tailwind.config.ts` — add warm cream background token, domain gradient utilities
- `app/globals.css` — update background default

---

## What Does NOT Change

- Supabase queries and data fetching logic
- Routing and middleware
- Auth pages (login/signup) — acceptable as-is for now
- CelebrationOverlay — keep existing, only minor visual polish
- Bottom navigation — keep existing structure, minor icon update
- Admin panel — out of scope
