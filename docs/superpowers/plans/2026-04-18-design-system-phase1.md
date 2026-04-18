# İyiBiri Design System Phase 1 — Foundation + Core 5 Screens

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Premium × Warm" dark design system across the foundation and all 5 core dashboard screens (Dashboard, Görevler, Ödüller, Profil, and a placeholder Keşfet).

**Architecture:** We keep the existing Next.js 14 + Tailwind + Framer Motion stack. The visual overhaul is achieved by (1) adding new ink/cream/gold tokens to Tailwind, (2) forcing `dark` class on the dashboard layout so Tailwind's dark variants apply, (3) rewriting the core components one by one while keeping all existing prop interfaces and routing intact. Nothing in Supabase or auth flows changes.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS v3 with `darkMode: ['class']`, Framer Motion, `next/font/google` (Fraunces + Plus Jakarta Sans), lucide-react, lottie-react.

---

## File Map

| Action | File | What changes |
|--------|------|-------------|
| Modify | `tailwind.config.ts` | Add ink/cream/gold/domain color tokens, add `font-display` = Fraunces, fix radii |
| Modify | `app/globals.css` | Update `.dark` CSS vars to ink/gold palette; add `scrollbar-hide` utility |
| Modify | `app/layout.tsx` | Add Fraunces font import, expose `--font-display` CSS var |
| Modify | `app/dashboard/layout.tsx` | Wrap children in `dark` class container |
| Modify | `components/ui/tier-badge.tsx` | Gold/goldSoft aesthetic for all 5 tiers |
| Modify | `components/bottom-nav.tsx` | Glass blur, gold active state, Keşfet tab replaces Kuruluşlar |
| Create | `app/dashboard/discover/page.tsx` | Placeholder Keşfet screen (so nav link works) |
| Modify | `components/ui/mission-card.tsx` | Airbnb-style dark card with photo, NGO disk, category badge |
| Modify | `app/dashboard/dashboard-client.tsx` | Dark HeroCard, gold karma, stat strip, dark section headers, dark NGO rail |
| Modify | `app/dashboard/missions/missions-client.tsx` | Dark filter chips, dark empty state, dark text |
| Modify | `app/dashboard/rewards/rewards-client.tsx` | Dark layout, gold karma balance, dark reward cards |
| Modify | `app/dashboard/profile/page.tsx` (client part) | Dark profile card, tier badge, stat strip, dark mission list |

---

## Task 1: Tailwind Config — Add Design Tokens

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace the `colors` block in tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens (CSS-var backed, used by shadcn-style components)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        // İyiBiri design tokens — "Premium × Warm"
        ink: {
          DEFAULT: '#1A1612',
          900: '#24201B',
          800: '#2E2923',
          700: '#36302A',
          600: '#3F3830',
          500: '#574E42',
          400: '#7A6F5E',
          300: '#A89E8A',
          200: '#CEC5B2',
          100: '#E6DEC9',
        },
        cream: '#F4EEDF',
        gold: {
          DEFAULT: '#E8C268',
          dim: '#B58F3D',
        },
        clay: '#C8553D',
        success: '#6B8E4E',
        // Domain palette
        domain: {
          nature: '#10B981',
          education: '#3B82F6',
          social: '#F43F5E',
          financial: '#F59E0B',
          animals: '#F97316',
          culture: '#A855F7',
        },
        // Legacy aliases (keep so existing pages don't break)
        primary: {
          DEFAULT: '#E8C268',
          dark: '#B58F3D',
          light: '#FDE68A',
          foreground: '#24201B',
        },
        'text-primary': '#F4EEDF',
        'text-muted': '#A89E8A',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-headline)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '10px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        pill: '9999px',
      },
      animation: {
        'bounce-sm': 'bounce-sm 0.4s ease-in-out',
        'fade-in': 'fade-in 0.15s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'bounce-sm': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit 2>&1 | head -20`
Expected: No errors related to tailwind.config.ts (there may be pre-existing errors in other files — that's OK for now)

- [ ] **Step 3: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add tailwind.config.ts
git commit -m "feat: add Premium×Warm design tokens to Tailwind config"
```

---

## Task 2: Font Loading — Add Fraunces Display Font

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update layout.tsx to add Fraunces and expose as CSS variable**

Replace the entire `app/layout.tsx` with:

```tsx
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "İyiBiri",
  description: "İyiBiri — İyi insanlarla bağlantı kur",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "İyiBiri",
  },
};

export const viewport: Viewport = {
  themeColor: "#E8C268",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={cn(jakarta.variable, fraunces.variable)}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Verify dev server starts**

Run: `cd /Users/bahadiroylumlu/Desktop/iyibiri && npm run dev &` then check `curl -s http://localhost:3000 | grep -o "Fraunces" | head -3`
Expected: The page loads. Fraunces loads via Google Fonts (network tab shows fonts.googleapis.com request).

- [ ] **Step 3: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add app/layout.tsx
git commit -m "feat: add Fraunces display font via next/font/google"
```

---

## Task 3: CSS Variables — Update Dark Theme Palette

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css with updated dark palette variables**

Replace the entire `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Light mode (landing page, auth) — warm paper palette */
  :root {
    --background: 43 25% 96%;       /* #FAF5E9 paper */
    --foreground: 26 23% 18%;       /* #3E3830 heading on light */
    --card: 0 0% 100%;
    --card-foreground: 26 23% 18%;
    --border: 38 22% 83%;           /* #D9CFB4 paper300 */
    --input: 38 22% 83%;
    --ring: 42 73% 66%;             /* gold */
    --muted: 43 25% 92%;
    --muted-foreground: 26 14% 48%; /* paper500 */
    --radius: 1rem;
  }

  /* Dark mode — "Premium × Warm" (applied to dashboard via .dark class on layout) */
  .dark {
    --background: 26 16% 13%;       /* #24201B ink900 */
    --foreground: 42 50% 93%;       /* #F4EEDF cream */
    --card: 24 14% 17%;             /* #2E2923 ink800 */
    --card-foreground: 42 50% 93%;  /* cream */
    --border: 25 13% 22%;           /* #3F3830 ink600 */
    --input: 25 13% 22%;
    --ring: 42 73% 66%;             /* #E8C268 gold */
    --muted: 25 13% 20%;            /* ink700 */
    --muted-foreground: 34 18% 60%; /* #A89E8A ink300 */
    --radius: 1rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Scrollbar hide utility */
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  /* safe area bottom padding for notched phones */
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
}

/* ── Landing page animations (unchanged) ── */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}

@keyframes slideInRight {
  from { transform: translateX(24px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
@keyframes slideInUp {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes fillBar {
  from { width: 0%; }
  to   { width: 78%; }
}
@keyframes floatBadge {
  0%, 100% { transform: translateY(0px);  }
  50%       { transform: translateY(-5px); }
}
@keyframes pulseDot {
  0%, 100% { opacity: 1;   transform: scale(1);   }
  50%       { opacity: 0.6; transform: scale(0.85); }
}
.mockup-bar    { animation: fillBar      1.8s cubic-bezier(0.4,0,0.2,1) 0.4s both; }
.mockup-badge  { animation: slideInRight 0.6s cubic-bezier(0.34,1.56,0.64,1) 2.2s both,
                             floatBadge  3s ease-in-out 2.8s infinite; }
.mockup-card-1 { animation: slideInUp   0.5s ease-out 0.7s both; }
.mockup-card-2 { animation: slideInUp   0.5s ease-out 1.0s both; }
.mockup-reward { animation: slideInUp   0.5s ease-out 1.3s both; }
.mockup-dot    { animation: pulseDot    2s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .animate-marquee,
  .mockup-bar, .mockup-badge, .mockup-card-1,
  .mockup-card-2, .mockup-reward { animation: none; }
}
```

- [ ] **Step 2: Verify dev server renders without CSS errors**

Run: `curl -s http://localhost:3000/dashboard 2>/dev/null | grep -c "class=" | head -1`
Expected: A number > 0 (page renders HTML). No CSS build errors in the terminal.

- [ ] **Step 3: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add app/globals.css
git commit -m "feat: update CSS variables to Premium×Warm dark palette"
```

---

## Task 4: Dashboard Layout — Force Dark Mode

**Files:**
- Modify: `app/dashboard/layout.tsx`

- [ ] **Step 1: Add `dark` class to dashboard layout wrapper**

Replace `app/dashboard/layout.tsx` with:

```tsx
import { BottomNav } from "@/components/bottom-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen bg-background">
      <div className="pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
```

- [ ] **Step 2: Verify dashboard loads with dark background**

Open `http://localhost:3000/dashboard` in browser. The background should be `#24201B` (very dark warm ink), not white.

- [ ] **Step 3: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add app/dashboard/layout.tsx
git commit -m "feat: force dark mode on dashboard via .dark class"
```

---

## Task 5: TierBadge Redesign

**Files:**
- Modify: `components/ui/tier-badge.tsx`

The new design uses a single gold aesthetic for all tiers — `goldSoft` background + `goldLine` border + star icon + tier name in gold. The tier emoji still appears but the color treatment is consistent gold, not per-tier hues.

- [ ] **Step 1: Replace tier-badge.tsx**

```tsx
import { cn } from '@/lib/utils'

type Tier = 1 | 2 | 3 | 4 | 5

interface TierBadgeProps {
  tier: Tier
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const tierConfig: Record<Tier, { label: string; emoji: string }> = {
  1: { label: 'İyi Biri',            emoji: '🌱' },
  2: { label: 'Çok İyi Biri',        emoji: '⭐' },
  3: { label: 'Çoook İyi Biri',      emoji: '🌟' },
  4: { label: 'Gerçekten İyi Biri',  emoji: '🏆' },
  5: { label: 'İyiliğin Öncüsü',     emoji: '👑' },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 gap-1 text-[10px]',
  md: 'px-2.5 py-1 gap-1.5 text-[11px]',
  lg: 'px-3 py-1.5 gap-2 text-xs',
}

// Inline star SVG to match design spec exactly
function StarIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path
        d="M6 1l1.5 3L11 4.5l-2.5 2L9 10 6 8.3 3 10l.5-3.5L1 4.5 4.5 4z"
        fill="#E8C268"
      />
    </svg>
  )
}

export function TierBadge({ tier, showLabel = true, size = 'md', className }: TierBadgeProps) {
  const config = tierConfig[tier] ?? tierConfig[1]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-bold tracking-wide flex-shrink-0 whitespace-nowrap',
        'bg-[rgba(232,194,104,0.12)] border border-[rgba(232,194,104,0.32)]',
        'text-gold',
        sizeClasses[size],
        className
      )}
    >
      <StarIcon size={size === 'lg' ? 11 : 9} />
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}

export function getTierFromKarma(karma: number): Tier {
  if (karma < 500)   return 1
  if (karma < 2000)  return 2
  if (karma < 5000)  return 3
  if (karma < 10000) return 4
  return 5
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit 2>&1 | grep "tier-badge" | head -5`
Expected: No errors from tier-badge.tsx

- [ ] **Step 3: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add components/ui/tier-badge.tsx
git commit -m "feat: redesign TierBadge with gold Premium×Warm aesthetic"
```

---

## Task 6: BottomNav Redesign — Glass Blur + Keşfet Tab

**Files:**
- Modify: `components/bottom-nav.tsx`
- Create: `app/dashboard/discover/page.tsx`

The new design: glass blur background (`bg-ink/85 backdrop-blur-xl`), gold active state with a radial goldSoft glow behind the active icon, 5 tabs: Ana Sayfa / Keşfet / Görevler / Ödüller / Profil.

"Kuruluşlar" tab is replaced by "Keşfet" (`/dashboard/discover`). NGOs are still accessible from the home screen.

- [ ] **Step 1: Replace bottom-nav.tsx**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Search, ListChecks, Gift, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard',          label: 'Ana Sayfa', icon: Home },
  { href: '/dashboard/discover', label: 'Keşfet',    icon: Search },
  { href: '/dashboard/missions', label: 'Görevler',  icon: ListChecks },
  { href: '/dashboard/rewards',  label: 'Ödüller',   icon: Gift },
  { href: '/dashboard/profile',  label: 'Profil',    icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe"
      style={{
        background: 'rgba(26,22,18,0.88)',
        backdropFilter: 'blur(18px) saturate(140%)',
        borderTop: '1px solid #3F3830',
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === href
              : pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} className="flex-1 block">
              <motion.div
                className="flex flex-col items-center gap-1 py-1"
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.1 }}
              >
                <div className="relative flex items-center justify-center w-9 h-9">
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'rgba(232,194,104,0.14)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={20}
                    className="relative transition-colors"
                    style={{ color: isActive ? '#E8C268' : '#A89E8A' }}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold tracking-wide transition-colors"
                  style={{ color: isActive ? '#E8C268' : '#A89E8A' }}
                >
                  {label}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create the Keşfet placeholder page**

Create `app/dashboard/discover/page.tsx`:

```tsx
export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-background px-4 pt-14 pb-24">
      <h1 className="font-display font-bold text-3xl text-cream mb-2">Keşfet</h1>
      <p className="text-ink-300 text-sm">Yakındaki görevler ve kuruluşlar burada görünecek.</p>
    </div>
  )
}
```

- [ ] **Step 3: Verify nav renders in browser**

Open `http://localhost:3000/dashboard`. The bottom nav should be dark/glass, active tab icon gold, other tabs muted stone. Clicking "Keşfet" should navigate to `/dashboard/discover` without 404.

- [ ] **Step 4: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add components/bottom-nav.tsx app/dashboard/discover/page.tsx
git commit -m "feat: redesign BottomNav with glass blur + gold active, add Keşfet tab"
```

---

## Task 7: MissionCard Redesign — Airbnb Dark Style

**Files:**
- Modify: `components/ui/mission-card.tsx`

The new card: dark ink800 background, 4:3 photo-dominant header with gradient overlay, NGO logo disk bottom-left of photo, category badge top-left, optional heart save top-right (visual only — no persistence yet), karma pill bottom-right of photo. Body: title (cream, Plus Jakarta Sans bold) + impact (ink300) + meta row (duration chip, difficulty chip) + karma pill bottom-right.

If `mission.photo_url` is null/undefined, fall back to a domain-gradient div with the domain icon centered.

- [ ] **Step 1: Replace mission-card.tsx**

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, Heart, Flame } from 'lucide-react'
import type { MissionWithNGO } from '@/lib/supabase/types'

interface MissionCardProps {
  mission: MissionWithNGO
  isCompleted?: boolean
  isTaken?: boolean
  compact?: boolean
}

const domainGradient: Record<string, string> = {
  nature:    'linear-gradient(135deg, #10B981, #14B8A6)',
  education: 'linear-gradient(135deg, #3B82F6, #6366F1)',
  social:    'linear-gradient(135deg, #F43F5E, #EC4899)',
  financial: 'linear-gradient(135deg, #F59E0B, #F97316)',
  animals:   'linear-gradient(135deg, #F97316, #F59E0B)',
  culture:   'linear-gradient(135deg, #A855F7, #D946EF)',
  default:   'linear-gradient(135deg, #574E42, #3F3830)',
}

const domainEmoji: Record<string, string> = {
  nature: '🌿', education: '📖', social: '❤️',
  financial: '🪙', animals: '🐾', culture: '🎭', default: '✦',
}

const domainLabel: Record<string, string> = {
  nature: 'DOĞA', education: 'EĞİTİM', social: 'SOSYAL',
  financial: 'FİNANSAL', animals: 'HAYVANLAR', culture: 'KÜLTÜR',
  default: 'GÖNÜLLÜLÜK',
}

const difficultyConfig: Record<string, { label: string; bg: string; fg: string }> = {
  easy:   { label: 'Kolay', bg: 'rgba(107,142,78,0.18)',  fg: '#6B8E4E' },
  medium: { label: 'Orta',  bg: 'rgba(209,155,60,0.18)',  fg: '#D19B3C' },
  hard:   { label: 'Zor',   bg: 'rgba(184,78,59,0.18)',   fg: '#B84E3B' },
}

export function MissionCard({ mission, isCompleted, isTaken, compact = false }: MissionCardProps) {
  const [saved, setSaved] = useState(false)
  const domain = mission.domain ?? 'default'
  const gradient = domainGradient[domain] ?? domainGradient.default
  const emoji = domainEmoji[domain] ?? domainEmoji.default
  const label = domainLabel[domain] ?? domainLabel.default
  const difficulty = difficultyConfig[mission.difficulty ?? 'easy']
  const ngo = mission.ngos
  const photoUrl = (mission as MissionWithNGO & { photo_url?: string | null }).photo_url

  return (
    <motion.div
      whileTap={{ scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={compact ? 'w-[230px] flex-shrink-0' : 'w-full'}
      style={{ opacity: isCompleted ? 0.65 : 1 }}
    >
      <Link href={`/dashboard/missions/${mission.id}`}>
        <article
          style={{
            background: '#2E2923',
            borderRadius: 16,
            overflow: 'hidden',
            border: isTaken && !isCompleted
              ? '1.5px solid #E8C268'
              : '1px solid #3F3830',
          }}
        >
          {/* ── Photo / Domain gradient header ── */}
          <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={mission.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div
                style={{
                  width: '100%', height: '100%',
                  background: gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: compact ? 36 : 48,
                }}
              >
                {emoji}
              </div>
            )}

            {/* Gradient scrim — bottom fade */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(26,22,18,0) 45%, rgba(26,22,18,0.72) 100%)',
              pointerEvents: 'none',
            }} />

            {/* Top-left: category badge */}
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: 'rgba(26,22,18,0.65)',
              backdropFilter: 'blur(6px)',
              borderRadius: 999,
              padding: '3px 8px',
              fontSize: 10, fontWeight: 700,
              color: '#F4EEDF',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {emoji} {label}
            </div>

            {/* Top-right: heart save */}
            <button
              onClick={(e) => { e.preventDefault(); setSaved(s => !s) }}
              style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(26,22,18,0.55)',
                backdropFilter: 'blur(6px)',
                border: 'none', cursor: 'pointer',
                borderRadius: 999, width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Heart
                size={14}
                style={{
                  fill: saved ? '#E8C268' : 'none',
                  color: saved ? '#E8C268' : '#F4EEDF',
                  transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
                }}
              />
            </button>

            {/* Bottom-left: NGO logo disk + name */}
            {ngo && (
              <div style={{
                position: 'absolute', left: 10, bottom: 10,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}>
                  {ngo.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ngo.logo_url}
                      alt={ngo.name}
                      style={{ width: '72%', height: '72%', objectFit: 'contain' }}
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 700, color: ngo.color_accent ?? '#E8C268' }}>
                      {(ngo.short_name ?? ngo.name)[0]}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: '#F4EEDF',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  letterSpacing: '-0.01em',
                }}>
                  {ngo.short_name ?? ngo.name}
                </span>
              </div>
            )}

            {/* Taken indicator */}
            {isTaken && !isCompleted && (
              <div style={{
                position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(232,194,104,0.15)',
                border: '1px solid rgba(232,194,104,0.4)',
                borderRadius: 999,
                padding: '2px 10px',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Flame size={10} style={{ color: '#E8C268' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#E8C268', letterSpacing: '0.04em' }}>
                  DEVAM EDİYOR
                </span>
              </div>
            )}
          </div>

          {/* ── Body ── */}
          <div style={{ padding: '14px 16px 14px' }}>
            <h3 style={{
              margin: 0,
              fontSize: 15, fontWeight: 700, lineHeight: 1.3,
              color: '#F4EEDF',
              letterSpacing: '-0.015em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {mission.title}
            </h3>

            {!compact && mission.description && (
              <p style={{
                margin: '5px 0 0',
                fontSize: 13, lineHeight: 1.5,
                color: '#A89E8A',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {mission.description}
              </p>
            )}

            {/* Meta row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, marginTop: 12,
              flexWrap: 'wrap',
            }}>
              {mission.duration && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 500, color: '#A89E8A',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '4px 8px', borderRadius: 999,
                  border: '1px solid #3F3830',
                }}>
                  <Clock size={10} style={{ color: '#A89E8A' }} />
                  {mission.duration}
                </span>
              )}
              {mission.difficulty && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  fontSize: 11, fontWeight: 700,
                  background: difficulty.bg, color: difficulty.fg,
                  padding: '4px 8px', borderRadius: 999,
                }}>
                  {difficulty.label}
                </span>
              )}
              <span style={{
                marginLeft: 'auto',
                fontSize: 12, fontWeight: 800,
                color: '#E8C268',
                letterSpacing: '-0.01em',
                fontVariantNumeric: 'tabular-nums',
              }}>
                +{mission.karma} Karma
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit 2>&1 | grep "mission-card" | head -5`
Expected: No errors from mission-card.tsx

- [ ] **Step 3: Verify card renders in browser**

Open `http://localhost:3000/dashboard`. Mission cards should show dark ink800 background, domain gradient when no photo, NGO logo disk, gold karma amount.

- [ ] **Step 4: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add components/ui/mission-card.tsx
git commit -m "feat: redesign MissionCard — Airbnb dark style with photo, NGO disk, gold karma"
```

---

## Task 8: Dashboard Hero + Layout Redesign

**Files:**
- Modify: `app/dashboard/dashboard-client.tsx`

The HeroCard becomes a dark ink800 card with:
- Concentric gold arcs SVG decoration (top-right corner, 10% opacity)
- "Karma Hesabın" eyebrow label (ink300, uppercase, tracked)
- Gold karma dot (6px circle) + big gold karma number (56px, tabular-nums)
- TierBadge top-right
- Progress bar to next tier (goldDim → gold gradient)
- Stat strip: GÖREV | SERİ | SIRA separated by ink600 dividers

The mascot/avatar picker remains. Section headers update to cream text. NGO rail updates to dark cards. Discover grid tiles update to dark.

- [ ] **Step 1: Replace dashboard-client.tsx**

```tsx
'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Lottie from 'lottie-react'
import { Flame, Pencil, Handshake, Gift, ClipboardList, User } from 'lucide-react'
import type { Profile, MissionWithNGO, UserMission, NGO } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'
import { TierBadge, getTierFromKarma } from '@/components/ui/tier-badge'
import { createClient } from '@/lib/supabase/client'

import catAnim from '@/public/animations/cat.json'
import dogAnim from '@/public/animations/dog.json'
import foxAnim from '@/public/animations/fox.json'
import robotAnim from '@/public/animations/robot.json'
import partyAnim from '@/public/animations/party.json'

type AvatarType = 'cat' | 'dog' | 'fox' | 'robot' | 'party'

const avatarOptions: { type: AvatarType; label: string; anim: object }[] = [
  { type: 'cat',   label: 'Kedi 🐱',  anim: catAnim },
  { type: 'dog',   label: 'Köpek 🐕', anim: dogAnim },
  { type: 'fox',   label: 'Tilki 🦊', anim: foxAnim },
  { type: 'robot', label: 'Robot 🤖', anim: robotAnim },
  { type: 'party', label: 'Parti 🥳', anim: partyAnim },
]

// Tier thresholds to calculate progress
const tierThresholds = [0, 500, 2000, 5000, 10000, Infinity]

function getKarmaProgress(karma: number): { pct: number; toNext: number; nextTierName: string } {
  const tierNames = ['İyi Biri', 'Çok İyi Biri', 'Çoook İyi Biri', 'Gerçekten İyi Biri', 'İyiliğin Öncüsü']
  let tierIndex = 0
  for (let i = 1; i < tierThresholds.length; i++) {
    if (karma >= tierThresholds[i - 1] && karma < tierThresholds[i]) {
      tierIndex = i - 1
      break
    }
    if (karma >= tierThresholds[tierThresholds.length - 2]) {
      tierIndex = tierThresholds.length - 2
      break
    }
  }
  const min = tierThresholds[tierIndex]
  const max = tierThresholds[tierIndex + 1]
  if (max === Infinity) return { pct: 100, toNext: 0, nextTierName: '' }
  const pct = Math.round(((karma - min) / (max - min)) * 100)
  return { pct, toNext: max - karma, nextTierName: tierNames[tierIndex + 1] ?? '' }
}

interface Props {
  profile: Profile
  missions: MissionWithNGO[]
  userMissions: UserMission[]
  ngos: NGO[]
}

const discoverItems = [
  { href: '/dashboard/ngos',    Icon: Handshake,   label: 'Kuruluşlar', gradient: 'linear-gradient(135deg,#3B82F6,#6366F1)' },
  { href: '/dashboard/rewards', Icon: Gift,         label: 'Ödüller',   gradient: 'linear-gradient(135deg,#E8C268,#B58F3D)' },
  { href: '/dashboard/missions',Icon: ClipboardList,label: 'Görevler',  gradient: 'linear-gradient(135deg,#10B981,#14B8A6)' },
  { href: '/dashboard/profile', Icon: User,         label: 'Profil',    gradient: 'linear-gradient(135deg,#A855F7,#D946EF)' },
]

export function DashboardClient({ profile, missions, userMissions, ngos }: Props) {
  const completedIds = new Set(userMissions.filter(m => m.status === 'completed').map(m => m.mission_id))
  const takenIds     = new Set(userMissions.filter(m => m.status === 'taken').map(m => m.mission_id))

  const featuredMissions   = missions.filter(m => m.featured && !completedIds.has(m.id)).slice(0, 6)
  const inProgressMissions = missions.filter(m => takenIds.has(m.id) && !completedIds.has(m.id))
  const firstName = profile.name?.split(' ')[0] ?? 'Kullanıcı'

  const karma = profile.karma_total ?? 0
  const tier = getTierFromKarma(karma)
  const { pct, toNext, nextTierName } = getKarmaProgress(karma)

  const [avatarType, setAvatarType] = useState<AvatarType>((profile.avatar_type as AvatarType) ?? 'cat')
  const [showPicker, setShowPicker] = useState(false)
  const supabase = useMemo(() => createClient(), [])
  const currentAvatar = avatarOptions.find(a => a.type === avatarType) ?? avatarOptions[0]

  async function handleAvatarSelect(type: AvatarType) {
    setAvatarType(type)
    setShowPicker(false)
    await supabase.from('profiles').update({ avatar_type: type }).eq('id', profile.id)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-12 pb-6">
        {/* ── Hero Card ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          style={{
            background: '#2E2923',
            borderRadius: 20,
            border: '1px solid #3F3830',
            padding: '22px 22px 18px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Concentric gold arcs decoration */}
          <svg
            width="240" height="240" viewBox="0 0 240 240"
            style={{ position: 'absolute', right: -80, top: -80, opacity: 0.1, pointerEvents: 'none' }}
            aria-hidden
          >
            {[110, 80, 50, 20].map(r => (
              <circle key={r} cx="120" cy="120" r={r} stroke="#E8C268" strokeWidth="0.8" fill="none" />
            ))}
          </svg>

          <div style={{ position: 'relative' }}>
            {/* Top row: eyebrow + tier badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{
                  margin: 0, fontSize: 10, fontWeight: 700,
                  color: '#A89E8A', letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}>
                  Karma Hesabın
                </p>
                {/* Karma number */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  {/* Gold dot */}
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E8C268, #B58F3D)',
                    flexShrink: 0,
                    boxShadow: '0 0 0 3px rgba(232,194,104,0.2)',
                  }} />
                  <span style={{
                    fontSize: 52, fontWeight: 700, lineHeight: 0.95,
                    letterSpacing: '-0.035em',
                    color: '#E8C268',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {karma.toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>
              <TierBadge tier={tier} size="sm" />
            </div>

            {/* Progress bar */}
            {toNext > 0 && (
              <div style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 7, gap: 8 }}>
                  <span style={{ color: '#A89E8A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <em style={{ fontStyle: 'italic', color: '#F4EEDF', fontFamily: 'var(--font-display)' }}>{nextTierName}</em>
                    {`'ye`}
                  </span>
                  <span style={{ color: '#E8C268', fontWeight: 700, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                    {toNext.toLocaleString('tr-TR')} kaldı
                  </span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #B58F3D, #E8C268)',
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Stat strip */}
            <div style={{
              display: 'flex', marginTop: 18, paddingTop: 16,
              borderTop: '1px solid #3F3830',
            }}>
              {[
                { label: 'GÖREV', value: completedIds.size, sub: 'tamamlandı' },
                { label: 'SERİ', value: `${profile.streak ?? 0} gün`, sub: 'kesintisiz', flame: true },
                { label: 'SIRA', value: `#-`, sub: 'bu ay' },
              ].map((stat, i) => (
                <div key={stat.label} style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
                  {i > 0 && <div style={{
                    position: 'absolute', width: 1, height: '100%', background: '#3F3830',
                    // Note: divider achieved via borderLeft on non-first items
                  }} />}
                  <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: '#A89E8A', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    {stat.label}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 5 }}>
                    {stat.flame && <Flame size={11} style={{ color: '#E8C268' }} />}
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}>
                      {stat.value}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: 10, color: '#A89E8A', marginTop: 3 }}>{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Avatar (mascot) — floating over hero */}
        <motion.button
          onClick={() => setShowPicker(true)}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'absolute',
            top: 48 + 16, right: 16 + 16,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0,
          }}
        >
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <Lottie animationData={currentAvatar.anim} loop autoplay style={{ width: 64, height: 64 }} />
            <div style={{
              position: 'absolute', top: -4, right: -4,
              background: 'rgba(46,41,35,0.8)',
              borderRadius: '50%', width: 18, height: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #3F3830',
            }}>
              <Pencil size={9} style={{ color: '#A89E8A' }} />
            </div>
          </div>
        </motion.button>
      </div>

      {/* Avatar Picker Bottom Sheet */}
      <AnimatePresence>
        {showPicker && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPicker(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-5 pb-10"
              style={{ background: '#2E2923', borderRadius: '24px 24px 0 0', borderTop: '1px solid #3F3830' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            >
              <div style={{ width: 40, height: 4, background: '#574E42', borderRadius: 999, margin: '0 auto 20px' }} />
              <h3 style={{ margin: '0 0 16px', textAlign: 'center', fontSize: 17, fontWeight: 700, color: '#F4EEDF' }}>
                Maskotunu Seç
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {avatarOptions.map(option => (
                  <motion.button
                    key={option.type}
                    onClick={() => handleAvatarSelect(option.type)}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      padding: 8, borderRadius: 16, border: 'none', cursor: 'pointer',
                      background: avatarType === option.type
                        ? 'rgba(232,194,104,0.14)'
                        : 'rgba(255,255,255,0.03)',
                      outline: avatarType === option.type
                        ? '2px solid rgba(232,194,104,0.5)'
                        : 'none',
                    }}
                  >
                    <Lottie animationData={option.anim} loop autoplay style={{ width: 52, height: 52 }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#A89E8A' }}>
                      {option.label.split(' ')[0]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="px-4 space-y-8">
        {/* In-Progress */}
        {inProgressMissions.length > 0 && (
          <section>
            <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.02em' }}>
              🔥 Devam Eden
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {inProgressMissions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
                >
                  <MissionCard mission={mission} isTaken compact />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Featured missions */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.02em' }}>
              Senin İçin Seçtiklerimiz
            </h2>
            <Link href="/dashboard/missions" style={{ fontSize: 13, fontWeight: 700, color: '#E8C268', textDecoration: 'none' }}>
              Tümü →
            </Link>
          </div>
          {featuredMissions.length === 0 ? (
            <p style={{ color: '#574E42', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>
              Tüm öne çıkan görevleri tamamladın! 🎉
            </p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {featuredMissions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.06 }}
                >
                  <MissionCard
                    mission={mission}
                    isCompleted={completedIds.has(mission.id)}
                    isTaken={takenIds.has(mission.id)}
                    compact
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* NGO Rail */}
        {ngos.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.02em' }}>
                Kuruluşlardan
              </h2>
              <Link href="/dashboard/ngos" style={{ fontSize: 13, fontWeight: 700, color: '#E8C268', textDecoration: 'none' }}>
                Tümü →
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {ngos.map((ngo, i) => {
                const coverUrl = (ngo as NGO & { cover_image_url?: string | null }).cover_image_url
                return (
                  <motion.div
                    key={ngo.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ flexShrink: 0, width: 158 }}
                  >
                    <Link href={`/dashboard/ngos/${ngo.id}`}>
                      <div style={{
                        background: '#2E2923',
                        borderRadius: 14,
                        overflow: 'hidden',
                        border: '1px solid #3F3830',
                      }}>
                        <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: '100%', height: '100%',
                              backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                              backgroundColor: coverUrl ? undefined : (ngo.color_accent ?? '#3F3830'),
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(180deg, rgba(26,22,18,0) 45%, rgba(26,22,18,0.85) 100%)',
                          }} />
                          {/* Logo disk */}
                          <div style={{
                            position: 'absolute', left: 10, bottom: 10,
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          }}>
                            {ngo.logo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={ngo.logo_url}
                                alt={ngo.name}
                                style={{ width: '72%', height: '72%', objectFit: 'contain' }}
                                onError={e => { e.currentTarget.style.display = 'none' }}
                              />
                            ) : (
                              <span style={{ fontSize: 12, fontWeight: 700, color: ngo.color_accent ?? '#E8C268' }}>
                                {(ngo.short_name ?? ngo.name)[0]}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ padding: '11px 12px 13px' }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#F4EEDF', letterSpacing: '-0.015em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ngo.short_name ?? ngo.name}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#A89E8A' }}>
                            {missions.filter(m => m.ngos?.id === ngo.id).length} aktif görev
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {/* Quick access grid */}
        <section>
          <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.02em' }}>
            Keşfet
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {discoverItems.map(({ href, Icon, label, gradient }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.1 + i * 0.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link href={href}>
                  <div style={{
                    background: '#2E2923',
                    borderRadius: 16,
                    border: '1px solid #3F3830',
                    padding: '18px 16px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} style={{ color: 'white' }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.01em' }}>
                      {label}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Fix the `position: relative` wrapper for the floating avatar**

The avatar button needs to be positioned relative to the hero card container. Wrap the hero card + avatar in a relative div. Update the `pt-12` section div:

Find this block in the newly written file:
```tsx
<div className="px-4 pt-12 pb-6">
  {/* ── Hero Card ── */}
  <motion.div
```

Wrap as:
```tsx
<div className="px-4 pt-12 pb-6">
  <div style={{ position: 'relative' }}>
    {/* ── Hero Card ── */}
    <motion.div
      ...
    </motion.div>

    {/* Avatar (mascot) — floating over hero */}
    <motion.button
      ...
    </motion.button>
  </div>
</div>
```

And remove `position: 'absolute'` from the avatar button, replacing with:
```tsx
style={{
  position: 'absolute',
  top: 22, right: 22,
  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  zIndex: 10,
}}
```

- [ ] **Step 3: Verify TypeScript**

Run: `cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit 2>&1 | grep "dashboard-client" | head -5`
Expected: No errors from dashboard-client.tsx

- [ ] **Step 4: Verify in browser**

Open `http://localhost:3000/dashboard`. Should see:
- Dark ink900 background throughout
- Dark hero card with gold karma number and concentric arcs
- Gold tier badge
- Progress bar to next tier
- Stat strip with GÖREV / SERİ / SIRA
- Lottie mascot in top-right of hero
- Dark mission cards with domain gradient placeholders
- Dark NGO rail tiles with logo disks
- Dark discover grid with gradient icon tiles
- Gold bottom nav active state

- [ ] **Step 5: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add app/dashboard/dashboard-client.tsx
git commit -m "feat: redesign dashboard hero card and all sections for Premium×Warm dark theme"
```

---

## Task 9: MissionsClient Redesign

**Files:**
- Modify: `app/dashboard/missions/missions-client.tsx`

Update filter chips (active = domain gradient bg, inactive = ink700 bg + ink600 border) and text colors for dark background.

- [ ] **Step 1: Replace missions-client.tsx**

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MissionWithNGO, UserMission } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'

interface Props {
  missions: MissionWithNGO[]
  userMissions: UserMission[]
}

const filters = [
  { value: 'all',       label: '✦ Tümü',     gradient: 'linear-gradient(90deg,#574E42,#3F3830)' },
  { value: 'nature',    label: '🌿 Doğa',     gradient: 'linear-gradient(90deg,#10B981,#14B8A6)' },
  { value: 'education', label: '📖 Eğitim',   gradient: 'linear-gradient(90deg,#3B82F6,#6366F1)' },
  { value: 'social',    label: '❤️ Sosyal',   gradient: 'linear-gradient(90deg,#F43F5E,#EC4899)' },
  { value: 'financial', label: '🪙 Finansal', gradient: 'linear-gradient(90deg,#F59E0B,#F97316)' },
  { value: 'animals',   label: '🐾 Hayvanlar',gradient: 'linear-gradient(90deg,#F97316,#F59E0B)' },
  { value: 'culture',   label: '🎭 Kültür',   gradient: 'linear-gradient(90deg,#A855F7,#D946EF)' },
]

export function MissionsClient({ missions, userMissions }: Props) {
  const [activeFilter, setActiveFilter] = useState('all')

  const completedIds = new Set(userMissions.filter(m => m.status === 'completed').map(m => m.mission_id))
  const takenIds     = new Set(userMissions.filter(m => m.status === 'taken').map(m => m.mission_id))

  const filtered = activeFilter === 'all'
    ? missions
    : missions.filter(m => m.domain === activeFilter)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky header */}
      <div className="bg-background sticky top-0 z-10 px-4 pt-12 pb-4" style={{ borderBottom: '1px solid #3F3830' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.025em' }}>
            Görevler
          </h1>
          <span style={{
            background: 'rgba(232,194,104,0.14)',
            border: '1px solid rgba(232,194,104,0.3)',
            color: '#E8C268',
            fontSize: 12, fontWeight: 700,
            padding: '2px 10px', borderRadius: 999,
          }}>
            {missions.length}
          </span>
        </div>
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {filters.map(({ value, label, gradient }) => {
            const isActive = activeFilter === value
            return (
              <motion.button
                key={value}
                onClick={() => setActiveFilter(value)}
                whileTap={{ scale: 0.93 }}
                style={{
                  flexShrink: 0,
                  padding: '7px 14px',
                  borderRadius: 999,
                  fontSize: 12, fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  background: isActive ? gradient : '#36302A',
                  color: isActive ? 'white' : '#7A6F5E',
                  outline: isActive ? 'none' : '1px solid #3F3830',
                  transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
                }}
              >
                {label}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((mission, i) => (
            <motion.div
              key={mission.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.04 }}
            >
              <MissionCard
                mission={mission}
                isCompleted={completedIds.has(mission.id)}
                isTaken={takenIds.has(mission.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 0', gap: 12 }}
          >
            <div style={{
              background: '#2E2923', borderRadius: 20, width: 72, height: 72,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #3F3830', fontSize: 28,
            }}>
              🔍
            </div>
            <p style={{ color: '#574E42', fontSize: 13, fontWeight: 500, margin: 0 }}>
              Bu kategoride görev bulunamadı
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit 2>&1 | grep "missions-client" | head -5`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add app/dashboard/missions/missions-client.tsx
git commit -m "feat: redesign MissionsClient for dark theme with domain filter chips"
```

---

## Task 10: RewardsClient Redesign

**Files:**
- Modify: `app/dashboard/rewards/rewards-client.tsx`

Read the current file first. Then apply dark theme: ink900 background, gold karma balance card, dark reward tiles.

- [ ] **Step 1: Read current rewards-client.tsx**

Run: `cat /Users/bahadiroylumlu/Desktop/iyibiri/app/dashboard/rewards/rewards-client.tsx`

- [ ] **Step 2: Apply dark theme to RewardsClient**

The header becomes a dark HeroBar showing available karma:

```tsx
'use client'

import { motion } from 'framer-motion'
import type { Profile } from '@/lib/supabase/types'

// Reward type matches Supabase schema — adjust if field names differ
interface Reward {
  id: string
  brand: string
  title: string
  description?: string | null
  karma_cost: number
  image_url?: string | null
  brand_logo_url?: string | null
  gradient?: string | null
  icon?: string | null
}

interface Props {
  profile: Profile
  rewards: Reward[]
  claimedIds?: Set<string>
  onClaim?: (rewardId: string) => void
}

export function RewardsClient({ profile, rewards, claimedIds = new Set(), onClaim }: Props) {
  const karma = profile.karma_total ?? 0

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <h1 style={{ margin: '0 0 16px', fontSize: 28, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.025em' }}>
          Ödüller
        </h1>

        {/* Karma balance card */}
        <div style={{
          background: '#2E2923',
          borderRadius: 16,
          border: '1px solid rgba(232,194,104,0.25)',
          padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 4,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #E8C268, #B58F3D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>
            🎁
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#A89E8A', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Kullanabileceğin
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 700, color: '#E8C268', letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums' }}>
              {karma.toLocaleString('tr-TR')} Karma
            </p>
          </div>
        </div>
      </div>

      {/* Rewards grid */}
      <div className="px-4 space-y-3">
        {rewards.map((reward, i) => {
          const canClaim = karma >= reward.karma_cost
          const claimed = claimedIds.has(reward.id)
          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
            >
              <div style={{
                background: '#2E2923',
                borderRadius: 16,
                border: '1px solid #3F3830',
                overflow: 'hidden',
                opacity: claimed ? 0.6 : 1,
              }}>
                {/* Photo / gradient header */}
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                  {reward.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={reward.image_url}
                      alt={reward.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      background: reward.gradient ?? 'linear-gradient(135deg, #E8C268, #B58F3D)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 48,
                    }}>
                      {reward.icon ?? '🎁'}
                    </div>
                  )}
                  {/* Brand logo disk */}
                  {reward.brand_logo_url && (
                    <div style={{
                      position: 'absolute', left: 12, bottom: 12,
                      width: 32, height: 32, borderRadius: '50%', background: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={reward.brand_logo_url} alt={reward.brand} style={{ width: '72%', height: '72%', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: '14px 16px' }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#A89E8A', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {reward.brand}
                  </p>
                  <p style={{ margin: '4px 0 8px', fontSize: 16, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.015em' }}>
                    {reward.title}
                  </p>
                  {reward.description && (
                    <p style={{ margin: '0 0 12px', fontSize: 13, color: '#A89E8A', lineHeight: 1.5 }}>
                      {reward.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#E8C268', fontVariantNumeric: 'tabular-nums' }}>
                      {reward.karma_cost.toLocaleString('tr-TR')} Karma
                    </span>
                    <button
                      onClick={() => onClaim?.(reward.id)}
                      disabled={!canClaim || claimed}
                      style={{
                        padding: '8px 20px',
                        borderRadius: 999,
                        fontSize: 13, fontWeight: 700,
                        border: 'none', cursor: canClaim && !claimed ? 'pointer' : 'default',
                        background: claimed
                          ? '#36302A'
                          : canClaim
                            ? 'linear-gradient(90deg, #B58F3D, #E8C268)'
                            : '#36302A',
                        color: claimed ? '#574E42' : canClaim ? '#24201B' : '#574E42',
                        transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
                      }}
                    >
                      {claimed ? 'Alındı ✓' : canClaim ? 'Al' : `${(reward.karma_cost - karma).toLocaleString('tr-TR')} eksik`}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
```

> **Note:** The actual `Reward` type may differ from the Supabase schema. Check `lib/supabase/types.ts` and adjust field names (`karma_cost` might be `cost`, `brand_logo_url` might not exist yet). The logic stays the same — only field names need aligning.

- [ ] **Step 3: Check existing rewards-client.tsx for actual Supabase field names**

Run: `cat /Users/bahadiroylumlu/Desktop/iyibiri/app/dashboard/rewards/rewards-client.tsx`
Then align field names in the new component with what the current file uses (e.g., `reward.cost` vs `reward.karma_cost`).

- [ ] **Step 4: Verify TypeScript**

Run: `cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit 2>&1 | grep "rewards-client" | head -5`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add app/dashboard/rewards/rewards-client.tsx
git commit -m "feat: redesign RewardsClient for dark theme with gold karma balance"
```

---

## Task 11: Profile Page Redesign

**Files:**
- Modify: `app/dashboard/profile/page.tsx` (or the relevant `-client.tsx` inside that folder)

- [ ] **Step 1: Find the profile client component**

Run: `ls /Users/bahadiroylumlu/Desktop/iyibiri/app/dashboard/profile/`
Expected: A `page.tsx` that either renders inline or imports a `profile-client.tsx`.

- [ ] **Step 2: Read the file**

Run: `cat /Users/bahadiroylumlu/Desktop/iyibiri/app/dashboard/profile/page.tsx`

- [ ] **Step 3: Apply dark theme to profile**

The profile screen layout per design spec:
- Cover photo area (domain gradient or placeholder, 120px tall)
- Avatar disk overlapping cover (56px circle, gold gradient bg with emoji or Lottie)
- Name (Fraunces italic, cream)
- TierBadge
- Karma progress bar (same as HeroCard)
- 3-stat strip: KARMA / GÖREV / SERİ
- "Tamamladığın Görevler" section with MissionCard list

Since the exact current code varies, apply these principles:
- All `text-stone-900` → `text-cream` / `style={{ color: '#F4EEDF' }}`
- All `bg-white` → `bg-[#2E2923]` / `style={{ background: '#2E2923' }}`
- All `border-stone-100/200` → `style={{ border: '1px solid #3F3830' }}`
- All `text-stone-400/500` → `style={{ color: '#A89E8A' }}`
- Gradient header bar with domain gold gradient
- Add `getTierFromKarma` and `TierBadge` imports

- [ ] **Step 4: Verify TypeScript**

Run: `cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit 2>&1 | grep "profile" | head -5`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add app/dashboard/profile/
git commit -m "feat: apply dark theme to profile screen"
```

---

## Task 12: Full Build Verification

**Files:** None — verification only

- [ ] **Step 1: Run full TypeScript check**

Run: `cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit 2>&1 | grep "error TS" | wc -l`
Expected: 0 (or same count as before this plan started — we don't introduce new errors)

- [ ] **Step 2: Run Next.js build**

Run: `cd /Users/bahadiroylumlu/Desktop/iyibiri && npm run build 2>&1 | tail -20`
Expected: "Route (app)" table printed, no build failures. Warnings about `img` elements are OK.

- [ ] **Step 3: Smoke test key routes on dev server**

Ensure dev server is running (`npm run dev`), then check these pages load without console errors:
- `http://localhost:3000/dashboard`
- `http://localhost:3000/dashboard/missions`
- `http://localhost:3000/dashboard/rewards`
- `http://localhost:3000/dashboard/profile`
- `http://localhost:3000/dashboard/discover`

- [ ] **Step 4: Final commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add -A
git commit -m "chore: Phase 1 design system complete — Premium×Warm dark theme on all core screens"
```

---

## What's NOT in This Plan (Phase 2)

The following screens exist in the design system but are not implemented here. They require a separate plan:
- **Keşfet / Discover** — Full map view with gold pins (needs Mapbox/Google Maps decision)
- **Mission state machine** — Applied, Check-in (QR code), Completed states on mission detail
- **Onboarding** — 4-step redesign (welcome, interests, location, 100 Karma gift)
- **Bildirimler (Notifications)** — Notification feed screen
- **Seri (Streak)** — 7-day flame streak screen
- **Leaderboard** — Podium + ranked list
- **NGO Membership** — NGO profile, monthly plans, membership started
- **Donations** — Campaign, amount selector, summary, thank you

These can be built on top of the Phase 1 foundation without conflicts.
