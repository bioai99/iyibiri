# İyiBiri — Plan 2: Design System

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Duolingo-DNA'lı design system: animasyonlu base bileşenler, renk tokenleri ve Framer Motion kurulumu.

**Architecture:** Tailwind CSS token'ları + Framer Motion animasyonları. Her bileşen kendi dosyasında, `components/ui/` altında. Plan 1'e bağımlılık yok — paralel çalışabilir.

**Tech Stack:** Framer Motion, Tailwind CSS, TypeScript, canvas-confetti

---

### Task 1: Bağımlılıkları Kur

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Framer Motion ve canvas-confetti kur**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm install framer-motion canvas-confetti
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm install --save-dev @types/canvas-confetti
```

- [ ] **Step 2: Kurulumu doğrula**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
node -e "require('framer-motion'); console.log('framer-motion OK')"
```

Expected: `framer-motion OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install framer-motion and canvas-confetti"
```

---

### Task 2: Design Tokens (Tailwind Config)

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: tailwind.config.ts'i güncelle**

`tailwind.config.ts`:

```typescript
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
        primary: {
          DEFAULT: '#F4B942',
          dark: '#E09B20',
          light: '#FDE68A',
        },
        success: '#22C55E',
        danger: '#EF4444',
        background: '#FAFAF9',
        surface: '#FFFFFF',
        'text-primary': '#1C1917',
        'text-muted': '#78716C',
        border: '#E7E5E4',
        domain: {
          nature: '#10B981',
          education: '#3B82F6',
          social: '#F43F5E',
          financial: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
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

- [ ] **Step 2: Build kontrol**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm run build 2>&1 | tail -5
```

Expected: Build geçmeli.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: update tailwind design tokens for iyibiri design system"
```

---

### Task 3: KarmaCounter Bileşeni

**Files:**
- Create: `components/ui/karma-counter.tsx`

- [ ] **Step 1: karma-counter.tsx yaz**

`components/ui/karma-counter.tsx`:

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface KarmaCounterProps {
  value: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

const sizeClasses = {
  sm: 'text-lg font-bold',
  md: 'text-2xl font-extrabold',
  lg: 'text-4xl font-extrabold',
}

export function KarmaCounter({ value, className = '', size = 'md', animate: shouldAnimate = true }: KarmaCounterProps) {
  const count = useMotionValue(shouldAnimate ? 0 : value)
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString('tr-TR'))
  const prevValue = useRef(value)

  useEffect(() => {
    if (!shouldAnimate) {
      count.set(value)
      return
    }
    const from = prevValue.current
    prevValue.current = value
    const controls = animate(count, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    })
    return controls.stop
  }, [value, count, shouldAnimate])

  return (
    <motion.span
      className={`font-display tabular-nums ${sizeClasses[size]} ${className}`}
      initial={shouldAnimate ? { scale: 1 } : false}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      key={value}
    >
      {rounded}
    </motion.span>
  )
}
```

- [ ] **Step 2: Bileşeni test et — geçici test sayfasında görsel kontrol**

`app/test-ds/page.tsx` (geçici, sonra silinecek):

```typescript
import { KarmaCounter } from '@/components/ui/karma-counter'

export default function TestDS() {
  return (
    <div className="p-8 space-y-4">
      <KarmaCounter value={1250} size="lg" />
      <KarmaCounter value={500} size="md" />
      <KarmaCounter value={50} size="sm" />
    </div>
  )
}
```

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm run dev &
```

Tarayıcıda `localhost:3000/test-ds` aç → sayaçlar görünüyor mu?

---

### Task 4: XPBar Bileşeni

**Files:**
- Create: `components/ui/xp-bar.tsx`

- [ ] **Step 1: xp-bar.tsx yaz**

`components/ui/xp-bar.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface XPBarProps {
  current: number
  max: number
  label?: string
  color?: string
  className?: string
}

export function XPBar({ current, max, label, color = '#F4B942', className = '' }: XPBarProps) {
  const [mounted, setMounted] = useState(false)
  const percentage = Math.min((current / max) * 100, 100)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-text-muted">{label}</span>
          <span className="text-xs font-bold text-text-primary">
            {current.toLocaleString('tr-TR')} / {max.toLocaleString('tr-TR')}
          </span>
        </div>
      )}
      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: mounted ? `${percentage}%` : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: test-ds sayfasına ekle**

`app/test-ds/page.tsx`'e ekle:

```typescript
import { XPBar } from '@/components/ui/xp-bar'
// ...
<XPBar current={750} max={1500} label="Çok İyi Biri'ne" />
```

`localhost:3000/test-ds` → XPBar mount'ta dolarak animasyon yapıyor mu?

---

### Task 5: TierBadge Bileşeni

**Files:**
- Create: `components/ui/tier-badge.tsx`

- [ ] **Step 1: tier-badge.tsx yaz**

`components/ui/tier-badge.tsx`:

```typescript
import { cn } from '@/lib/utils'

type Tier = 1 | 2 | 3 | 4

interface TierBadgeProps {
  tier: Tier
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const tierConfig: Record<Tier, { label: string; emoji: string; color: string; bg: string }> = {
  1: { label: 'İyi Biri', emoji: '🌱', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  2: { label: 'Çok İyi Biri', emoji: '⭐', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  3: { label: 'Gerçekten İyi Biri', emoji: '🌟', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  4: { label: 'İyiliğin Öncüsü', emoji: '🏆', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

export function TierBadge({ tier, showLabel = true, size = 'md', className }: TierBadgeProps) {
  const config = tierConfig[tier]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        config.color,
        config.bg,
        sizeClasses[size],
        className
      )}
    >
      <span>{config.emoji}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}

export function getTierFromKarma(karma: number): Tier {
  if (karma < 500) return 1
  if (karma < 1500) return 2
  if (karma < 3000) return 3
  return 4
}
```

---

### Task 6: StreakFlame Bileşeni

**Files:**
- Create: `components/ui/streak-flame.tsx`

- [ ] **Step 1: streak-flame.tsx yaz**

`components/ui/streak-flame.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'

interface StreakFlameProps {
  streak: number
  className?: string
}

export function StreakFlame({ streak, className = '' }: StreakFlameProps) {
  const isActive = streak > 0

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <motion.span
        className="text-2xl select-none"
        animate={isActive ? {
          scale: [1, 1.2, 1],
          rotate: [-3, 3, -3],
        } : { scale: 1, rotate: 0 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ filter: isActive ? undefined : 'grayscale(1)' }}
      >
        🔥
      </motion.span>
      <div className="flex flex-col">
        <span className={`text-lg font-extrabold font-display leading-none ${isActive ? 'text-orange-500' : 'text-stone-400'}`}>
          {streak}
        </span>
        <span className="text-xs text-text-muted leading-none">aylık seri</span>
      </div>
    </div>
  )
}
```

---

### Task 7: MissionCard Bileşeni

**Files:**
- Create: `components/ui/mission-card.tsx`

- [ ] **Step 1: mission-card.tsx yaz**

`components/ui/mission-card.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Mission } from '@/lib/supabase/types'

interface MissionCardProps {
  mission: Mission
  isCompleted?: boolean
  isTaken?: boolean
}

const difficultyConfig = {
  easy: { label: 'Kolay', color: 'text-emerald-600 bg-emerald-50' },
  medium: { label: 'Orta', color: 'text-amber-600 bg-amber-50' },
  hard: { label: 'Zor', color: 'text-red-600 bg-red-50' },
}

const domainColors: Record<string, string> = {
  nature: 'border-l-emerald-400',
  education: 'border-l-blue-400',
  social: 'border-l-rose-400',
  financial: 'border-l-amber-400',
}

export function MissionCard({ mission, isCompleted, isTaken }: MissionCardProps) {
  const difficulty = difficultyConfig[mission.difficulty ?? 'easy']
  const domainColor = domainColors[mission.domain ?? 'social']

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <Link href={`/dashboard/missions/${mission.id}`}>
        <div className={`bg-white rounded-2xl border border-border shadow-sm border-l-4 ${domainColor} overflow-hidden relative`}>
          {isCompleted && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-text-primary text-base leading-snug truncate">
                  {mission.title}
                </h3>
                <p className="text-sm text-text-muted mt-0.5 line-clamp-2">
                  {mission.description}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-lg">✨</span>
                  <span className="font-extrabold text-primary font-display text-lg leading-none">
                    {mission.karma}
                  </span>
                </div>
                <span className="text-xs text-text-muted">karma</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              {mission.difficulty && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficulty.color}`}>
                  {difficulty.label}
                </span>
              )}
              {mission.duration && (
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <span>⏱</span> {mission.duration}
                </span>
              )}
              {isTaken && !isCompleted && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-blue-600 bg-blue-50 ml-auto">
                  Devam ediyor
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
```

---

### Task 8: CelebrationOverlay Bileşeni

**Files:**
- Create: `components/ui/celebration-overlay.tsx`

- [ ] **Step 1: celebration-overlay.tsx yaz**

`components/ui/celebration-overlay.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface CelebrationOverlayProps {
  show: boolean
  karmaEarned: number
  missionTitle: string
  onClose: () => void
}

export function CelebrationOverlay({ show, karmaEarned, missionTitle, onClose }: CelebrationOverlayProps) {
  useEffect(() => {
    if (!show) return
    // Konfeti patlaması
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...opts,
        origin: { y: 0.6 },
        particleCount: Math.floor(200 * particleRatio),
      })
    }
    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#F4B942', '#22C55E', '#3B82F6'] })
    fire(0.2, { spread: 60, colors: ['#F4B942', '#E09B20'] })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#F4B942', '#22C55E'] })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })

    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl"
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              🎉
            </motion.div>
            <h2 className="font-display font-extrabold text-2xl text-text-primary mb-1">
              Tebrikler!
            </h2>
            <p className="text-text-muted text-sm mb-4">
              <span className="font-semibold text-text-primary">{missionTitle}</span> görevini tamamladın
            </p>
            <motion.div
              className="flex items-center justify-center gap-2 bg-primary/10 rounded-2xl py-3 px-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              <span className="text-3xl">✨</span>
              <span className="font-display font-extrabold text-3xl text-primary">+{karmaEarned}</span>
              <span className="font-semibold text-primary/80">karma</span>
            </motion.div>
            <p className="text-xs text-text-muted mt-4">Devam etmek için dokun</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

### Task 9: BottomNav Güncelle

**Files:**
- Modify: `components/bottom-nav.tsx`

- [ ] **Step 1: bottom-nav.tsx'i animasyonlu hale getir**

`components/bottom-nav.tsx`:

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, ListChecks, Heart, Gift, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Ana Sayfa', icon: Home },
  { href: '/dashboard/missions', label: 'Görevler', icon: ListChecks },
  { href: '/dashboard/ngos', label: 'STK\'lar', icon: Heart },
  { href: '/dashboard/rewards', label: 'Ödüller', icon: Gift },
  { href: '/dashboard/profile', label: 'Profil', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className="flex-1">
              <motion.div
                className="flex flex-col items-center gap-0.5 py-1"
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.1 }}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute -inset-1.5 bg-primary/10 rounded-full -z-10"
                      layoutId="nav-active"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}>
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

- [ ] **Step 2: Geçici test sayfasını sil**

```bash
rm -rf /Users/bahadiroylumlu/Desktop/iyibiri/app/test-ds
```

- [ ] **Step 3: Build kontrol**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm run build 2>&1 | tail -10
```

Expected: Build geçmeli, TypeScript hatası olmamalı.

- [ ] **Step 4: Commit**

```bash
git add components/
git commit -m "feat: add design system components with framer motion animations"
```
