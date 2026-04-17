# İyiBiri UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all main screens (Dashboard, Missions, Rewards, Profile) with premium "Living Cards" visual language — gradient/white split cards, Lucide icon system, bold typography, and spring animations.

**Architecture:** Each task is a self-contained file change. Tasks 2–7 depend on Task 1 (tokens) and Task 2 (DomainIcon). MissionCard (Task 3) is shared by Dashboard (Task 4) and Missions list (Task 5). No DB or routing changes.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, lucide-react (already installed v1.6.0)

---

## File Map

| File | Action | Task |
|------|--------|------|
| `app/globals.css` | Modify — warm cream background token | 1 |
| `components/ui/domain-icon.tsx` | Create — icon + styled container | 2 |
| `components/ui/mission-card.tsx` | Rewrite — gradient/white split card | 3 |
| `app/dashboard/dashboard-client.tsx` | Rewrite — hero, discover grid | 4 |
| `app/dashboard/missions/missions-client.tsx` | Rewrite — filter chips with icons | 5 |
| `app/dashboard/rewards/rewards-client.tsx` | Rewrite — ticket-style cards | 6 |
| `app/dashboard/profile/page.tsx` | Rewrite — dark hero, stats grid | 7 |

---

### Task 1: Design Tokens — Warm Cream Background

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Update background CSS variable to warm cream**

In `app/globals.css`, find the `:root` block and replace the `--background` value:

```css
/* BEFORE */
--background: 220 20% 97%;

/* AFTER */
--background: 60 22% 98%;
```

The full `:root` block after the change (show only the changed line in context):
```css
:root {
  --background: 60 22% 98%;   /* warm cream #FAFAF7 — was cool blue-gray */
  --foreground: 220 30% 10%;
  /* ... rest unchanged ... */
}
```

- [ ] **Step 2: Verify dev server picks up change**

Run: `npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm run dev`

Open `localhost:3000` — background should look warm cream (not blue-gray). Compare: old `hsl(220 20% 97%)` is cool blue-white, new `hsl(60 22% 98%)` is warm off-white like #FAFAF7.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: update background token to warm cream #FAFAF7"
```

---

### Task 2: DomainIcon Component

**Files:**
- Create: `components/ui/domain-icon.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/ui/domain-icon.tsx
import { Leaf, BookOpen, Heart, Coins, Sparkles, type LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  nature: Leaf,
  education: BookOpen,
  social: Heart,
  financial: Coins,
}

const onWhiteColor: Record<string, string> = {
  nature: 'bg-emerald-100 text-emerald-600',
  education: 'bg-blue-100 text-blue-600',
  social: 'bg-rose-100 text-rose-600',
  financial: 'bg-amber-100 text-amber-600',
  default: 'bg-stone-100 text-stone-500',
}

const sizeConfig = {
  sm: { wrapper: 'p-2 rounded-xl', px: 16 },
  md: { wrapper: 'p-2.5 rounded-xl', px: 20 },
  lg: { wrapper: 'p-3 rounded-2xl', px: 24 },
}

interface DomainIconProps {
  domain: string
  size?: 'sm' | 'md' | 'lg'
  /** 'onGradient' = white icon on gradient bg. 'onWhite' = colored icon on white bg */
  variant?: 'onGradient' | 'onWhite'
  className?: string
}

export function DomainIcon({ domain, size = 'md', variant = 'onWhite', className = '' }: DomainIconProps) {
  const Icon = iconMap[domain] ?? Sparkles
  const { wrapper, px } = sizeConfig[size]
  const colorClass = variant === 'onGradient'
    ? 'bg-white/20 text-white'
    : (onWhiteColor[domain] ?? onWhiteColor.default)

  return (
    <div className={`flex items-center justify-center flex-shrink-0 ${wrapper} ${colorClass} ${className}`}>
      <Icon size={px} strokeWidth={2} />
    </div>
  )
}
```

- [ ] **Step 2: Verify it renders**

Temporarily import and render in `app/dashboard/dashboard-client.tsx` at the top of the return:
```typescript
import { DomainIcon } from '@/components/ui/domain-icon'
// inside JSX:
<DomainIcon domain="nature" size="md" variant="onWhite" />
<DomainIcon domain="education" size="md" variant="onGradient" />
```

Open `localhost:3000/dashboard` — two icon containers should appear. Remove the test import after verifying.

- [ ] **Step 3: Commit**

```bash
git add components/ui/domain-icon.tsx
git commit -m "feat: add DomainIcon component with Lucide icons"
```

---

### Task 3: MissionCard Redesign

**Files:**
- Modify: `components/ui/mission-card.tsx`

The card is split: top 40% is a domain gradient band, bottom 60% is white. No emojis — Lucide icons only.

Domain labels (used in gradient band):
```
nature    → 'DOĞA'
education → 'EĞİTİM'
social    → 'SOSYAL'
financial → 'FİNANSAL'
default   → 'GÖNÜLLÜLÜK'
```

- [ ] **Step 1: Rewrite mission-card.tsx**

```typescript
// components/ui/mission-card.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, ChevronRight, CheckCircle2, Zap } from 'lucide-react'
import { DomainIcon } from './domain-icon'
import type { Mission } from '@/lib/supabase/types'

interface MissionCardProps {
  mission: Mission
  isCompleted?: boolean
  isTaken?: boolean
  compact?: boolean
}

const domainGradient: Record<string, string> = {
  nature: 'from-emerald-500 to-teal-400',
  education: 'from-blue-500 to-indigo-400',
  social: 'from-rose-500 to-pink-400',
  financial: 'from-amber-500 to-orange-400',
  default: 'from-stone-400 to-stone-500',
}

const domainLabel: Record<string, string> = {
  nature: 'DOĞA',
  education: 'EĞİTİM',
  social: 'SOSYAL',
  financial: 'FİNANSAL',
  default: 'GÖNÜLLÜLÜK',
}

const difficultyConfig = {
  easy: { label: 'Kolay', color: 'bg-emerald-100 text-emerald-700' },
  medium: { label: 'Orta', color: 'bg-amber-100 text-amber-700' },
  hard: { label: 'Zor', color: 'bg-red-100 text-red-700' },
}

export function MissionCard({ mission, isCompleted, isTaken, compact = false }: MissionCardProps) {
  const domain = mission.domain ?? 'default'
  const gradient = domainGradient[domain] ?? domainGradient.default
  const label = domainLabel[domain] ?? domainLabel.default
  const difficulty = difficultyConfig[mission.difficulty ?? 'easy']

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={compact ? 'w-[260px] flex-shrink-0' : 'w-full'}
    >
      <Link href={`/dashboard/missions/${mission.id}`}>
        <div
          className={`rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)] transition-shadow ${
            isCompleted ? 'opacity-75' : ''
          }`}
        >
          {/* Gradient Band */}
          <div className={`bg-gradient-to-br ${gradient} px-4 pt-4 pb-3 relative`}>
            <div className="flex items-start justify-between">
              <DomainIcon domain={domain} size="md" variant="onGradient" />
              <div className="bg-white/20 rounded-full px-3 py-1 flex items-center gap-1">
                <span className="text-white font-bold text-sm">✦ {mission.karma}</span>
              </div>
            </div>
            <p className="text-white/70 text-xs font-semibold mt-3 tracking-widest">{label}</p>
            {isCompleted && (
              <div className="absolute top-3 right-14">
                <CheckCircle2 size={20} className="text-white drop-shadow" />
              </div>
            )}
          </div>

          {/* White Body */}
          <div className="bg-white px-4 py-3">
            <h3 className="font-display font-bold text-stone-900 text-base leading-snug line-clamp-1">
              {mission.title}
            </h3>
            {!compact && (
              <p className="text-sm text-stone-500 mt-0.5 line-clamp-1">
                {mission.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2.5">
              {mission.duration && (
                <span className="flex items-center gap-1 text-xs text-stone-400">
                  <Clock size={12} />
                  {mission.duration}
                </span>
              )}
              {mission.difficulty && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficulty.color}`}>
                  {difficulty.label}
                </span>
              )}
              {isTaken && !isCompleted && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 ml-auto">
                  Devam ediyor
                </span>
              )}
              <ChevronRight size={16} className="text-stone-300 ml-auto" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
```

- [ ] **Step 2: Check on missions page**

Open `localhost:3000/dashboard/missions` — mission cards should now show gradient top band with domain icon and karma pill, white bottom with title and chips. No emojis.

- [ ] **Step 3: Commit**

```bash
git add components/ui/mission-card.tsx
git commit -m "feat: redesign MissionCard with gradient/white split and Lucide icons"
```

---

### Task 4: Dashboard Redesign

**Files:**
- Modify: `app/dashboard/dashboard-client.tsx`

Key changes:
- Hero card: full-width amber gradient, `text-6xl` karma, Flame icon streak pill
- Discover grid: gradient cells with Lucide icons (no emojis)
- In-progress: horizontal scroll with `compact` mission cards
- Section headers: bolder, larger

- [ ] **Step 1: Rewrite dashboard-client.tsx**

```typescript
// app/dashboard/dashboard-client.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flame, Sparkles, Handshake, Gift, ClipboardList, User } from 'lucide-react'
import type { Profile, Mission, UserMission } from '@/lib/supabase/types'
import { KarmaCounter } from '@/components/ui/karma-counter'
import { XPBar } from '@/components/ui/xp-bar'
import { getTierFromKarma } from '@/components/ui/tier-badge'
import { MissionCard } from '@/components/ui/mission-card'

interface Props {
  profile: Profile
  missions: Mission[]
  userMissions: UserMission[]
}

const tierName: Record<number, string> = {
  1: 'İyi Biri',
  2: 'Çok İyi Biri',
  3: 'Gerçekten İyi Biri',
  4: 'İyiliğin Öncüsü',
}

const tierThresholds: Record<number, number> = { 1: 500, 2: 1500, 3: 3000, 4: Infinity }

const discoverItems = [
  { href: '/dashboard/ngos', Icon: Handshake, label: "STK'lar", gradient: 'from-blue-500 to-indigo-400' },
  { href: '/dashboard/rewards', Icon: Gift, label: 'Ödüller', gradient: 'from-amber-500 to-orange-400' },
  { href: '/dashboard/missions', Icon: ClipboardList, label: 'Görevler', gradient: 'from-emerald-500 to-teal-400' },
  { href: '/dashboard/profile', Icon: User, label: 'Profil', gradient: 'from-rose-500 to-pink-400' },
]

export function DashboardClient({ profile, missions, userMissions }: Props) {
  const tier = getTierFromKarma(profile.karma_total)
  const nextThreshold = tierThresholds[tier]
  const prevThreshold = tier === 1 ? 0 : tierThresholds[tier - 1]

  const completedIds = new Set(
    userMissions.filter(m => m.status === 'completed').map(m => m.mission_id)
  )
  const takenIds = new Set(
    userMissions.filter(m => m.status === 'taken').map(m => m.mission_id)
  )

  const featuredMissions = missions.filter(m => m.featured && !completedIds.has(m.id)).slice(0, 3)
  const inProgressMissions = missions.filter(m => takenIds.has(m.id) && !completedIds.has(m.id))
  const firstName = profile.name?.split(' ')[0] ?? 'Kullanıcı'

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-12 pb-6">
        {/* Hero Card */}
        <motion.div
          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-5 shadow-[0_8px_32px_rgba(251,146,60,0.35)]"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm font-medium">Merhaba,</p>
              <h1 className="font-display font-extrabold text-white text-2xl leading-tight">
                {firstName}
              </h1>
            </div>
            {/* Streak pill */}
            <div className="bg-white/20 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Flame size={16} className="text-white" />
              <span className="text-white font-bold text-sm">{profile.streak}</span>
              <span className="text-white/70 text-xs">gün</span>
            </div>
          </div>

          <div className="flex items-end gap-2 mb-1">
            <Sparkles size={20} className="text-white/70 mb-1" />
            <KarmaCounter
              value={profile.karma_total}
              size="lg"
              className="text-white font-black !text-5xl"
            />
          </div>
          <p className="text-white/70 text-xs font-medium mb-4">toplam karma</p>

          {/* Tier badge */}
          <div className="inline-flex items-center bg-white/20 rounded-full px-3 py-1 mb-4">
            <span className="text-white text-xs font-bold">{tierName[tier] ?? 'İyi Biri'} · Tier {tier}</span>
          </div>

          {/* XP Bar */}
          {nextThreshold !== Infinity && (
            <div>
              <XPBar
                current={profile.karma_total - prevThreshold}
                max={nextThreshold - prevThreshold}
                label={`${tierName[(tier + 1) as keyof typeof tierName] ?? 'Sonraki'}'e`}
                color="#FFFFFF"
              />
            </div>
          )}
        </motion.div>
      </div>

      <div className="px-4 space-y-7">
        {/* In-Progress */}
        {inProgressMissions.length > 0 && (
          <section>
            <h2 className="font-display font-extrabold text-xl text-stone-900 mb-3">
              Devam Eden
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

        {/* Featured */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-extrabold text-xl text-stone-900">Öne Çıkanlar</h2>
            <Link href="/dashboard/missions" className="text-sm text-primary font-bold">
              Tümü →
            </Link>
          </div>
          <div className="space-y-3">
            {featuredMissions.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-sm">
                Tüm öne çıkan görevleri tamamladın!
              </div>
            ) : (
              featuredMissions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.07 }}
                >
                  <MissionCard
                    mission={mission}
                    isCompleted={completedIds.has(mission.id)}
                    isTaken={takenIds.has(mission.id)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Discover Grid */}
        <section>
          <h2 className="font-display font-extrabold text-xl text-stone-900 mb-3">Keşfet</h2>
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
                  <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-5 flex flex-col gap-3`}>
                    <div className="bg-white/20 rounded-xl p-2.5 w-fit">
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="font-display font-bold text-white text-sm">{label}</span>
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

- [ ] **Step 2: Verify dashboard**

Open `localhost:3000/dashboard`:
- Hero card: amber/orange gradient with large karma number, streak pill (Flame icon), tier badge, XP bar
- Discover grid: 4 gradient cells with Lucide icons, no emojis
- Featured missions: new gradient/white split cards

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/dashboard-client.tsx
git commit -m "feat: redesign dashboard with gradient hero and Lucide icon discover grid"
```

---

### Task 5: Missions List Redesign

**Files:**
- Modify: `app/dashboard/missions/missions-client.tsx`

Changes: remove emojis from filter chips, add Lucide domain icons, styled active state with domain gradient.

- [ ] **Step 1: Rewrite missions-client.tsx**

```typescript
// app/dashboard/missions/missions-client.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, BookOpen, Heart, Coins, LayoutGrid, ClipboardX } from 'lucide-react'
import type { Mission, UserMission } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'

interface Props {
  missions: Mission[]
  userMissions: UserMission[]
}

const filters = [
  { value: 'all', label: 'Tümü', Icon: LayoutGrid, activeGradient: 'from-stone-700 to-stone-600' },
  { value: 'nature', label: 'Doğa', Icon: Leaf, activeGradient: 'from-emerald-500 to-teal-400' },
  { value: 'education', label: 'Eğitim', Icon: BookOpen, activeGradient: 'from-blue-500 to-indigo-400' },
  { value: 'social', label: 'Sosyal', Icon: Heart, activeGradient: 'from-rose-500 to-pink-400' },
  { value: 'financial', label: 'Finansal', Icon: Coins, activeGradient: 'from-amber-500 to-orange-400' },
]

export function MissionsClient({ missions, userMissions }: Props) {
  const [activeFilter, setActiveFilter] = useState('all')

  const completedIds = new Set(
    userMissions.filter(m => m.status === 'completed').map(m => m.mission_id)
  )
  const takenIds = new Set(
    userMissions.filter(m => m.status === 'taken').map(m => m.mission_id)
  )

  const filtered = activeFilter === 'all'
    ? missions
    : missions.filter(m => m.domain === activeFilter)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Header */}
      <div className="bg-background px-4 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="font-display font-extrabold text-3xl text-stone-900">Görevler</h1>
          <span className="bg-primary/15 text-primary font-bold text-sm px-2.5 py-0.5 rounded-full">
            {missions.length}
          </span>
        </div>
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {filters.map(({ value, label, Icon, activeGradient }) => {
            const isActive = activeFilter === value
            return (
              <motion.button
                key={value}
                onClick={() => setActiveFilter(value)}
                whileTap={{ scale: 0.93 }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${activeGradient} text-white shadow-md`
                    : 'bg-white border border-stone-200 text-stone-500'
                }`}
              >
                <Icon size={14} />
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
            className="flex flex-col items-center py-16 gap-4"
          >
            <div className="bg-stone-100 rounded-3xl p-6">
              <ClipboardX size={32} className="text-stone-400" />
            </div>
            <p className="text-stone-400 text-sm font-medium">Bu kategoride görev bulunamadı</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Open `localhost:3000/dashboard/missions`:
- Header: "Görevler" large + count badge
- Filter chips: icon + label, active chip shows domain gradient, no emojis
- Empty state: ClipboardX icon in stone container

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/missions/missions-client.tsx
git commit -m "feat: redesign missions list with gradient filter chips and Lucide icons"
```

---

### Task 6: Rewards Redesign — Ticket Style

**Files:**
- Modify: `app/dashboard/rewards/rewards-client.tsx`

Reward cards become tickets: vertical gradient strip left side, white body, dashed divider, action right side.

- [ ] **Step 1: Rewrite rewards-client.tsx**

```typescript
// app/dashboard/rewards/rewards-client.tsx
'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react'
import type { Reward, RewardRedemption } from '@/lib/supabase/types'
import { KarmaCounter } from '@/components/ui/karma-counter'
import { createClient } from '@/lib/supabase/client'

interface Props {
  rewards: Reward[]
  redemptions: RewardRedemption[]
  currentKarma: number
  userId: string
}

// Each reward category gets a gradient — fall back to amber
const rewardGradient = 'from-amber-500 to-orange-400'

export function RewardsClient({ rewards, redemptions, currentKarma, userId }: Props) {
  const [karma, setKarma] = useState(currentKarma)
  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(
    () => new Set<string>(redemptions.map(r => r.reward_id))
  )
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])

  async function handleRedeem(reward: Reward) {
    if (karma < reward.karma_required) return
    if (redeemedIds.has(reward.id)) return
    setLoading(reward.id)
    setError(null)

    const { error: karmaError } = await supabase
      .from('karma_transactions')
      .insert({
        user_id: userId,
        amount: -reward.karma_required,
        type: 'reward_redemption',
        reference_id: reward.id,
        description: `${reward.title} ödülü kullanıldı`,
      })

    if (karmaError) {
      setError('Karma güncellenemedi')
      setLoading(null)
      return
    }

    const { error: redemptionError } = await supabase
      .from('reward_redemptions')
      .insert({ user_id: userId, reward_id: reward.id, karma_spent: reward.karma_required })

    if (redemptionError) {
      setError('Ödül kaydedilemedi')
      setLoading(null)
      return
    }

    setKarma(prev => prev - reward.karma_required)
    setRedeemedIds(prev => new Set(Array.from(prev).concat(reward.id)))
    setSelectedReward(null)
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <h1 className="font-display font-extrabold text-3xl text-stone-900 mb-2">Ödüller</h1>
        <div className="flex items-center gap-1.5">
          <Sparkles size={16} className="text-primary" />
          <KarmaCounter value={karma} size="sm" className="text-primary font-bold" />
          <span className="text-sm text-stone-400">karma bakiyen</span>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {rewards.map((reward, i) => {
          const unlocked = karma >= reward.karma_required
          const redeemed = redeemedIds.has(reward.id)

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.06 }}
              whileTap={unlocked && !redeemed ? { scale: 0.98 } : undefined}
              onClick={() => unlocked && !redeemed && setSelectedReward(reward)}
              className={`flex bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] cursor-pointer ${
                !unlocked && !redeemed ? 'opacity-60' : ''
              }`}
            >
              {/* Left gradient strip */}
              <div
                className={`w-3 flex-shrink-0 bg-gradient-to-b ${redeemed ? 'from-stone-200 to-stone-300' : rewardGradient}`}
              />

              {/* Body */}
              <div className="flex-1 px-4 py-4 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  {reward.brand_logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={reward.brand_logo}
                      alt={reward.brand}
                      className="w-10 h-10 rounded-xl object-contain border border-stone-100 p-1 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-sm text-stone-500 flex-shrink-0">
                      {reward.brand[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-stone-900 text-sm leading-snug truncate">
                      {reward.title}
                    </h3>
                    <p className="text-xs text-stone-400">{reward.brand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles size={12} className={redeemed ? 'text-stone-300' : 'text-primary'} />
                  <span className={`text-sm font-bold ${redeemed ? 'text-stone-400' : 'text-primary'}`}>
                    {reward.karma_required.toLocaleString('tr-TR')} karma
                  </span>
                  {!unlocked && !redeemed && (
                    <span className="text-xs text-stone-400 ml-1">
                      · {(reward.karma_required - karma).toLocaleString('tr-TR')} daha
                    </span>
                  )}
                </div>
              </div>

              {/* Dashed divider */}
              <div className="w-px border-r border-dashed border-stone-200 my-3" />

              {/* Right action */}
              <div className="w-16 flex items-center justify-center flex-shrink-0">
                {redeemed ? (
                  <CheckCircle2 size={22} className="text-emerald-500" />
                ) : unlocked ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-primary font-bold text-xs">Kullan</span>
                    <Sparkles size={14} className="text-primary" />
                  </div>
                ) : (
                  <Lock size={18} className="text-stone-300" />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Redemption Bottom Sheet */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReward(null)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              className="relative w-full bg-white rounded-t-3xl p-6 pb-10"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-6" />
              <h2 className="font-display font-extrabold text-xl text-stone-900 text-center mb-1">
                {selectedReward.title}
              </h2>
              <p className="text-stone-400 text-sm text-center mb-6">{selectedReward.description}</p>
              <div className="bg-primary/10 rounded-2xl p-4 flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-primary/80">Harcanacak karma</span>
                <div className="flex items-center gap-1">
                  <Sparkles size={16} className="text-primary" />
                  <span className="font-extrabold text-xl text-primary font-display">
                    -{selectedReward.karma_required.toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
              <motion.button
                onClick={() => handleRedeem(selectedReward)}
                disabled={!!loading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-display font-bold text-base disabled:opacity-60"
                whileTap={{ scale: 0.97 }}
              >
                {loading === selectedReward.id ? 'İşleniyor...' : 'Ödülü Kullan'}
              </motion.button>
              <button
                onClick={() => setSelectedReward(null)}
                className="w-full py-3 mt-2 text-stone-400 font-semibold text-sm"
              >
                Vazgeç
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Open `localhost:3000/dashboard/rewards`:
- Each reward: amber vertical strip left, white body with brand logo + title, dashed divider, action right
- Locked: gray strip, lock icon
- Redeemed: CheckCircle2 icon

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/rewards/rewards-client.tsx
git commit -m "feat: redesign rewards with ticket-style cards"
```

---

### Task 7: Profile Redesign

**Files:**
- Modify: `app/dashboard/profile/page.tsx`

Changes: dark hero section (`bg-stone-900`), 2×2 stats grid with Lucide icons, tier progress card, understated logout.

- [ ] **Step 1: Rewrite profile page.tsx**

```typescript
// app/dashboard/profile/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getUserMissions } from '@/lib/supabase/queries/missions'
import { getTierFromKarma } from '@/components/ui/tier-badge'
import { XPBar } from '@/components/ui/xp-bar'
import { CheckCircle2, Sparkles, Flame, Trophy, LogOut, User } from 'lucide-react'
import Link from 'next/link'

const tierName: Record<number, string> = {
  1: 'İyi Biri',
  2: 'Çok İyi Biri',
  3: 'Gerçekten İyi Biri',
  4: 'İyiliğin Öncüsü',
}

const tierThresholds: Record<number, number> = { 1: 500, 2: 1500, 3: 3000, 4: Infinity }

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, userMissions] = await Promise.all([
    getProfile(user.id),
    getUserMissions(user.id),
  ])

  if (!profile) redirect('/onboarding')

  const completedCount = userMissions.filter(m => m.status === 'completed').length
  const tier = getTierFromKarma(profile.karma_total)
  const nextThreshold = tierThresholds[tier]
  const prevThreshold = tier === 1 ? 0 : tierThresholds[tier - 1]
  const xpCurrent = profile.karma_total - prevThreshold
  const xpMax = nextThreshold === Infinity ? prevThreshold : nextThreshold - prevThreshold

  async function handleLogout() {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  const stats = [
    { Icon: CheckCircle2, iconClass: 'bg-emerald-100 text-emerald-600', value: completedCount, label: 'Görev' },
    { Icon: Sparkles, iconClass: 'bg-amber-100 text-amber-600', value: profile.karma_total, label: 'Karma' },
    { Icon: Flame, iconClass: 'bg-orange-100 text-orange-600', value: profile.streak, label: 'Streak' },
    { Icon: Trophy, iconClass: 'bg-purple-100 text-purple-600', value: tier, label: 'Tier' },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Dark Hero */}
      <div className="bg-stone-900 rounded-b-3xl px-4 pt-12 pb-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full ring-4 ring-primary bg-stone-700 flex items-center justify-center mb-3 overflow-hidden">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.name ?? ''} className="w-full h-full object-cover" />
          ) : (
            <User size={32} className="text-stone-400" />
          )}
        </div>
        <h1 className="font-display font-extrabold text-white text-2xl">
          {profile.name ?? 'İsimsiz Kullanıcı'}
        </h1>
        <div className="inline-flex items-center bg-primary/20 rounded-full px-3 py-1 mt-1 mb-4">
          <span className="text-primary text-xs font-bold">{tierName[tier]} · Tier {tier}</span>
        </div>
        <div className="flex items-end gap-2">
          <Sparkles size={18} className="text-white/50 mb-0.5" />
          <span className="font-display font-black text-white text-5xl leading-none">
            {profile.karma_total.toLocaleString('tr-TR')}
          </span>
        </div>
        <p className="text-stone-500 text-xs font-medium mt-1">toplam karma</p>
        <Link href="/dashboard/profile/edit" className="text-primary text-sm font-semibold mt-3">
          Profili Düzenle
        </Link>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ Icon, iconClass, value, label }) => (
            <div key={label} className="bg-white rounded-3xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
              <div className={`w-fit rounded-xl p-2 mb-3 ${iconClass}`}>
                <Icon size={18} />
              </div>
              <p className="font-display font-black text-stone-900 text-3xl leading-none">
                {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
              </p>
              <p className="text-xs text-stone-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tier Progress */}
        {nextThreshold !== Infinity && (
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-bold text-stone-900 text-sm">Sonraki Tier</p>
              <span className="text-xs text-stone-400 font-medium">{tierName[(tier + 1) as keyof typeof tierName]}</span>
            </div>
            <XPBar current={xpCurrent} max={xpMax} label={`${xpMax - xpCurrent} karma kaldı`} />
          </div>
        )}

        {/* Logout */}
        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full py-3 flex items-center justify-center gap-2 text-stone-400 font-semibold text-sm"
          >
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Open `localhost:3000/dashboard/profile`:
- Dark stone-900 hero with avatar ring, white name, amber tier pill, large karma number
- 2×2 stats grid with colored icon containers
- Tier progress card
- Subtle logout at bottom (no destructive red)

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/profile/page.tsx
git commit -m "feat: redesign profile with dark hero and stats grid"
```

---

### Task 8: Build Check

- [ ] **Step 1: Run build**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm run build 2>&1 | tail -30
```

Expected: no TypeScript errors, successful build. If errors appear, fix the specific file mentioned.

- [ ] **Step 2: Visual smoke test**

Open each screen and verify no emojis appear as primary UI elements and all Lucide icons render correctly:
- `/dashboard` — hero gradient, Lucide icons in discover grid
- `/dashboard/missions` — gradient filter chips, new mission cards
- `/dashboard/rewards` — ticket-style cards
- `/dashboard/profile` — dark hero, stats grid

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete Living Cards UI redesign — premium gradients, Lucide icons, bold typography"
```
