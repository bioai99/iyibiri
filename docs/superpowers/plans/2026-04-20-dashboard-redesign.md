# Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign dashboard HeroCard with animated tier-based butterfly, replace QuickAction with smart mission tabs, fix UI quality issues.

**Architecture:** Add `tierLevel` prop to BrandLogo for tier-specific animations. Rewrite HeroCard with centered butterfly layout. Replace filter chips with "Senin için" / "Katıldıkların" functional tabs. Server component fetches recommended missions using membership + interest + city signals.

**Tech Stack:** Next.js 14, Framer Motion, Supabase, TypeScript, inline styles with theme tokens.

---

### Task 1: BrandLogo — Add tierLevel prop with tier-specific animations

**Files:**
- Modify: `components/ui/brand-logo.tsx`

- [ ] **Step 1: Add tier configuration constants and tierLevel prop**

Add the tier animation config above the component function and the new prop:

```tsx
// Add after the interface BrandLogoProps definition (line ~6-12)

interface BrandLogoProps {
  size?: number
  animate?: boolean
  idle?: boolean
  showWordmark?: boolean
  tierLevel?: number  // 1-5, overrides idle with tier-specific animation
  style?: React.CSSProperties
}

const TIER_CONFIG = [
  // Tier 1: İyi Biri
  { size: 48, wingDeg: 3, cycleDur: 3, flutter: null, glowOpacity: 0, particles: 0, saturation: 0.6 },
  // Tier 2: İyi Yürekli
  { size: 54, wingDeg: 5, cycleDur: 2.6, flutter: [0, 15, -8, 5, 0], glowOpacity: 0, particles: 0, saturation: 0.85 },
  // Tier 3: İyilik Elçisi
  { size: 60, wingDeg: 6, cycleDur: 2.4, flutter: [0, 18, -10, 6, 0], glowOpacity: 0.3, particles: 0, saturation: 1 },
  // Tier 4: İyilik Savaşçısı
  { size: 66, wingDeg: 8, cycleDur: 2.2, flutter: [0, 25, -15, 10, -5, 0], glowOpacity: 0.4, particles: 4, saturation: 1 },
  // Tier 5: İyiliğin Işığı
  { size: 72, wingDeg: 10, cycleDur: 2, flutter: [0, 30, -20, 15, -8, 3, 0], glowOpacity: 0.6, particles: 8, saturation: 1 },
]
```

- [ ] **Step 2: Update the component to use tierLevel when set**

Inside the component function, add tier resolution logic right after the existing color definitions:

```tsx
export function BrandLogo({ size: sizeProp = 120, animate = false, idle = false, showWordmark = false, tierLevel, style }: BrandLogoProps) {
  const { mode } = useTheme()

  // Tier overrides
  const tier = tierLevel ? TIER_CONFIG[Math.min(Math.max(tierLevel, 1), 5) - 1] : null
  const size = tier ? tier.size : sizeProp
  const isTier = !!tier
```

- [ ] **Step 3: Update wing idle animation to use tier config**

Replace the existing left wing `motion.g` idle animation (the `{...(idle ? ...)}` spread) with tier-aware logic. Apply to both left and right wing groups:

```tsx
// Left wings motion.g — replace the idle spread
<motion.g
  {...((isTier || idle) ? {
    animate: { rotate: [0, (tier?.wingDeg ?? 5), 0] },
    transition: { duration: tier?.cycleDur ?? 2.6, repeat: Infinity, ease: 'easeInOut' },
  } : {})}
  style={{ transformOrigin: '248px 250px' }}
>

// Right wings motion.g — same pattern but negative rotation
<motion.g
  {...((isTier || idle) ? {
    animate: { rotate: [0, -(tier?.wingDeg ?? 5), 0] },
    transition: { duration: tier?.cycleDur ?? 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.1 },
  } : {})}
  style={{ transformOrigin: '264px 250px' }}
>
```

- [ ] **Step 4: Update glow to use tier opacity**

Replace the glow `motion.div`'s animate/transition with tier-aware values:

```tsx
<motion.div
  style={{
    position: 'absolute',
    width: size * 1,
    height: size * 0.8,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(232,194,104,0.25) 0%, rgba(232,194,104,0.08) 45%, transparent 70%)',
    filter: `blur(${size * 0.12}px)`,
    pointerEvents: 'none',
  }}
  initial={animate ? { opacity: 0, scale: 0.2 } : { opacity: tier?.glowOpacity ?? (idle ? 0.5 : 0) }}
  animate={
    isTier && tier.glowOpacity > 0
      ? { opacity: [tier.glowOpacity * 0.7, tier.glowOpacity, tier.glowOpacity * 0.7], scale: [0.95, 1.05, 0.95] }
      : idle
        ? { opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.05, 0.95] }
        : animate
          ? { opacity: 0.6, scale: 1 }
          : { opacity: 0 }
  }
  transition={
    (isTier && tier.glowOpacity > 0) || idle
      ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
      : animate
        ? { duration: 1.5, ease: 'easeOut', delay: 0.2 }
        : undefined
  }
/>
```

- [ ] **Step 5: Add tier-based orbiting particles**

Add this block right after the existing particle burst (`{particles}`) and before the `<motion.svg>`:

```tsx
{/* Tier orbiting particles */}
{isTier && tier.particles > 0 && Array.from({ length: tier.particles }).map((_, i) => (
  <motion.div
    key={`orbit-${i}`}
    style={{
      position: 'absolute',
      width: size * 0.03,
      height: size * 0.03,
      borderRadius: '50%',
      background: i % 2 === 0 ? '#E8C268' : '#F4D98A',
      boxShadow: '0 0 4px rgba(232,194,104,0.6)',
    }}
    animate={{
      x: Math.cos((i / tier.particles) * Math.PI * 2) * size * 0.45,
      y: Math.sin((i / tier.particles) * Math.PI * 2) * size * 0.45,
      rotate: 360,
    }}
    transition={{
      rotate: { duration: 6 + i * 0.5, repeat: Infinity, ease: 'linear' },
      x: { duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: i * 0.3 },
      y: { duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: i * 0.3 },
    }}
  />
))}
```

- [ ] **Step 6: Add idle float for tier mode**

Update the SVG wrapper `motion.div` to also float in tier mode:

```tsx
<motion.div
  style={{
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
  {...((isTier || idle) ? {
    animate: { y: [0, -(isTier ? 5 : 4), 0] },
    transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
  } : {})}
>
```

- [ ] **Step 7: Build and verify**

Run: `npx next build 2>&1 | grep -E "error|Error|✓"`
Expected: `✓ Compiled successfully`

- [ ] **Step 8: Commit**

```bash
git add components/ui/brand-logo.tsx
git commit -m "feat: add tierLevel prop to BrandLogo with tier-specific animations"
```

---

### Task 2: Rewrite HeroCard with centered butterfly layout

**Files:**
- Modify: `components/ui/ds/hero-card.tsx`

- [ ] **Step 1: Update imports and add tier helpers**

Replace the entire hero-card.tsx file content:

```tsx
'use client'

import React from 'react'
import { Flame } from 'lucide-react'
import { KarmaDotToken } from './karma-dot-token'
import { BrandLogo } from '@/components/ui/brand-logo'
import { useTheme } from '@/lib/theme'

const TIER_THRESHOLDS = [0, 500, 2000, 5000, 10000]
const TIER_NAMES = ['İyi Biri', 'İyi Yürekli', 'İyilik Elçisi', 'İyilik Savaşçısı', 'İyiliğin Işığı']

function getTierLevel(karma: number): number {
  let level = 1
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (karma >= TIER_THRESHOLDS[i]) { level = i + 1; break }
  }
  return level
}

interface HeroCardProps {
  profile: {
    karma: number
    completed: number
    streak: number
  }
}

export function HeroCard({ profile }: HeroCardProps) {
  const { colors: c } = useTheme()
  const p = profile
  const tierLevel = getTierLevel(p.karma)
  const tierName = TIER_NAMES[tierLevel - 1]
  const nextTierName = tierLevel < 5 ? TIER_NAMES[tierLevel] : ''
  const karmaToNext = tierLevel < 5 ? TIER_THRESHOLDS[tierLevel] - p.karma : 0
  const pct = tierLevel >= 5 ? 100 : Math.round((p.karma / (p.karma + karmaToNext)) * 100)

  return (
    <div
      style={{
        background: c.ink800,
        borderRadius: 20,
        padding: '24px 22px 18px',
        border: `1px solid ${c.ink600}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative arcs */}
      <svg
        width="240" height="240" viewBox="0 0 240 240"
        style={{ position: 'absolute', right: -80, top: -80, opacity: 0.15, pointerEvents: 'none' }}
      >
        {[110, 80, 50, 20].map(r => (
          <circle key={r} cx="120" cy="120" r={r} stroke={c.gold} strokeWidth="0.8" fill="none" />
        ))}
      </svg>

      {/* Butterfly — centered hero */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: 4 }}>
        <BrandLogo tierLevel={tierLevel} />
      </div>

      {/* Tier name */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{
          fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
          fontStyle: 'italic',
          fontSize: 14,
          fontWeight: 500,
          color: c.gold,
          letterSpacing: '-0.01em',
        }}>
          {tierName}
        </span>
      </div>

      {/* Karma number */}
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <KarmaDotToken size={14} />
          <span style={{
            fontSize: 48,
            fontWeight: 700,
            color: c.gold,
            lineHeight: 1,
            letterSpacing: '-0.035em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {p.karma.toLocaleString('tr-TR')}
          </span>
        </div>
        <div style={{ fontSize: 12, color: c.ink300, marginTop: 4 }}>Karma</div>
      </div>

      {/* Progress bar */}
      {tierLevel < 5 && (
        <div style={{ marginTop: 16 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            fontSize: 11, marginBottom: 8, gap: 12,
          }}>
            <span style={{ color: c.ink300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              <span style={{
                fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
                fontStyle: 'italic', color: c.cream,
              }}>
                {nextTierName}
              </span>
              &apos;ye
            </span>
            <span style={{ color: c.gold, fontWeight: 700, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {karmaToNext.toLocaleString('tr-TR')} kaldı
            </span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,.08)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: `linear-gradient(90deg, ${c.goldDim}, ${c.gold})`,
              borderRadius: 999, transition: 'width 220ms cubic-bezier(.2,.8,.2,1)',
            }} />
          </div>
        </div>
      )}

      {/* Stats: 2 columns */}
      <div style={{
        display: 'flex', marginTop: 18, paddingTop: 16,
        borderTop: `1px solid ${c.ink600}`,
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: c.ink300 }}>
            GÖREV
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: c.cream, marginTop: 5, fontVariantNumeric: 'tabular-nums' }}>
            {p.completed}
          </div>
          <div style={{ fontSize: 10, color: c.ink300, marginTop: 3 }}>tamamlandı</div>
        </div>
        <div style={{ width: 1, background: c.ink600 }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: c.ink300 }}>
            SERİ
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 5 }}>
            <Flame size={11} color={c.gold} />
            <span style={{ fontSize: 16, fontWeight: 700, color: c.cream, fontVariantNumeric: 'tabular-nums' }}>
              {p.streak} gün
            </span>
          </div>
          <div style={{ fontSize: 10, color: c.ink300, marginTop: 3 }}>kesintisiz</div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build and verify**

Run: `npx next build 2>&1 | grep -E "error|Error|✓"`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add components/ui/ds/hero-card.tsx
git commit -m "feat: redesign HeroCard with centered butterfly and tier system"
```

---

### Task 3: Update dashboard page.tsx — fetch recommended missions

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Add recommended missions query and pass new props**

Replace the entire `app/dashboard/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getAllMissions, getUserMissions } from '@/lib/supabase/queries/missions'
import { DashboardClient } from './dashboard-client'
import type { NGO, MissionWithNGO } from '@/lib/supabase/types'

async function getNGOs(): Promise<NGO[]> {
  const supabase = createClient()
  const { data } = await supabase.from('ngos').select('*').limit(10)
  return data ?? []
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, missions, userMissions, ngos, savedMissionsResult, membershipsResult] = await Promise.all([
    getProfile(user.id),
    getAllMissions(),
    getUserMissions(user.id),
    getNGOs(),
    supabase.from('user_saved_missions').select('mission_id').eq('user_id', user.id),
    supabase.from('ngo_memberships').select('ngo_id').eq('user_id', user.id).eq('status', 'active'),
  ])

  if (!profile) redirect('/onboarding')

  const savedMissionIds = (savedMissionsResult.data ?? []).map(s => s.mission_id)
  const memberNgoIds = (membershipsResult.data ?? []).map(m => m.ngo_id)

  // Build recommended missions (member NGO > interest match > city match)
  const takenOrCompleted = new Set(userMissions.map(m => m.mission_id))
  const available = missions.filter(m => !takenOrCompleted.has(m.id))

  const scored = available.map(m => {
    let score = 0
    if (m.ngo_id && memberNgoIds.includes(m.ngo_id)) score += 100
    if (m.domain && profile.interests?.includes(m.domain)) score += 50
    if (m.location && profile.city && m.location.toLowerCase().includes(profile.city.toLowerCase())) score += 25
    if (m.featured) score += 10
    return { mission: m, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const recommendedMissions = scored.slice(0, 5).map(s => s.mission)

  // User active missions (taken + completed, most recent)
  const userActiveMissions = userMissions
    .filter(um => um.status === 'taken' || um.status === 'completed')
    .slice(0, 10)

  // Find the full mission data for user's active missions
  const activeMissionIds = new Set(userActiveMissions.map(um => um.mission_id))
  const activeMissionsWithNGO = missions.filter(m => activeMissionIds.has(m.id))

  return (
    <DashboardClient
      profile={profile}
      missions={missions}
      userMissions={userMissions}
      ngos={ngos}
      savedMissionIds={savedMissionIds}
      memberNgoIds={memberNgoIds}
      recommendedMissions={recommendedMissions}
      userActiveMissions={userActiveMissions}
      activeMissionsWithNGO={activeMissionsWithNGO}
    />
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: add recommended + active mission queries to dashboard page"
```

---

### Task 4: Rewrite dashboard-client.tsx — remove QuickAction, new tabs, fixes

**Files:**
- Modify: `app/dashboard/dashboard-client.tsx`

- [ ] **Step 1: Replace the entire dashboard-client.tsx**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import type { Profile, MissionWithNGO, UserMission, NGO } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'
import { EmptyState } from '@/components/ui/empty-state'
import {
  HeroCard,
  ChipDS,
  IconButtonDS,
  ThemeToggle,
  ImpactSummary,
} from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'

// ── Date helpers ───────────────────────────────────────────────

const TR_MONTHS = [
  'OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN',
  'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK',
]
const TR_DAYS = [
  'PAZAR', 'PAZARTESİ', 'SALI', 'ÇARŞAMBA',
  'PERŞEMBE', 'CUMA', 'CUMARTESİ',
]

function formatDateEyebrow(): string {
  const d = new Date()
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} · ${TR_DAYS[d.getDay()]}`
}

// ── Props ──────────────────────────────────────────────────────

interface Props {
  profile: Profile
  missions: MissionWithNGO[]
  userMissions: UserMission[]
  ngos: NGO[]
  savedMissionIds?: string[]
  memberNgoIds?: string[]
  recommendedMissions: MissionWithNGO[]
  userActiveMissions: UserMission[]
  activeMissionsWithNGO: MissionWithNGO[]
}

// ── Tab types ──────────────────────────────────────────────────

type TabKey = 'recommended' | 'active'

// ── Component ─────────────────────────────────────────────────

export function DashboardClient({
  profile, missions, userMissions, ngos,
  savedMissionIds = [], memberNgoIds = [],
  recommendedMissions, userActiveMissions, activeMissionsWithNGO,
}: Props) {
  const { colors: c } = useTheme()

  // Save pending onboarding data from localStorage
  useEffect(() => {
    const interests = localStorage.getItem('iyibiri_onboarding_interests')
    if (!interests) return
    const { createClient } = require('@/lib/supabase/client')
    const supabase = createClient()
    const city = localStorage.getItem('iyibiri_onboarding_city')
    const radius = localStorage.getItem('iyibiri_onboarding_radius')
    const age = localStorage.getItem('iyibiri_onboarding_age')
    supabase.from('profiles').update({
      interests: JSON.parse(interests),
      city: city || null,
      search_radius: radius ? Number(radius) : 10,
      age_range: age || null,
    }).eq('id', profile.id).then(() => {
      localStorage.removeItem('iyibiri_onboarding_interests')
      localStorage.removeItem('iyibiri_onboarding_city')
      localStorage.removeItem('iyibiri_onboarding_radius')
      localStorage.removeItem('iyibiri_onboarding_age')
    })
  }, [profile.id])

  const completedIds = new Set(userMissions.filter(m => m.status === 'completed').map(m => m.mission_id))
  const karma = profile.karma_total ?? 0
  const firstName = (profile.name ?? 'Biri').split(' ')[0]

  const [activeTab, setActiveTab] = useState<TabKey>('recommended')

  // Build mission list based on active tab
  const displayMissions = activeTab === 'recommended'
    ? recommendedMissions
    : activeMissionsWithNGO

  const sectionTitle = activeTab === 'recommended' ? 'Senin için seçtik' : 'Görevlerin'

  return (
    <div style={{ minHeight: '100vh', background: c.ink900, color: c.cream, paddingBottom: 100 }}>
      {/* ── 1. Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div>
          <p style={{
            margin: 0, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: c.ink300,
          }}>
            {formatDateEyebrow()}
          </p>
          <p style={{
            margin: '4px 0 0',
            fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
            fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', color: c.cream,
          }}>
            Günaydın,{' '}
            <em style={{ fontStyle: 'italic' }}>{firstName}</em>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/dashboard/notifications" style={{ textDecoration: 'none' }}>
            <IconButtonDS
              size={38}
              theme="dark"
              icon={<Bell size={18} color={c.gold} />}
            />
          </Link>
          <ThemeToggle size={38} />
          <Link href="/dashboard/profile" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.25)',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
                fontSize: 16, fontWeight: 600, color: '#FFFFFF',
              }}>
                {firstName[0].toUpperCase()}
              </span>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* ── 2. HeroCard ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
        style={{ padding: '20px 16px 0' }}
      >
        <HeroCard profile={{
          karma,
          completed: completedIds.size,
          streak: profile.current_streak ?? profile.streak ?? 0,
        }} />
      </motion.div>

      {/* ── 3. Tab chips ── */}
      <div style={{ padding: '24px 0 4px' }}>
        <div style={{
          display: 'flex', gap: 8, paddingLeft: 20, paddingRight: 20,
        }}>
          <ChipDS
            active={activeTab === 'recommended'}
            onClick={() => setActiveTab('recommended')}
          >
            Senin için
          </ChipDS>
          <ChipDS
            active={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
          >
            Katıldıkların
          </ChipDS>
        </div>
      </div>

      {/* ── 4. Section header ── */}
      <div style={{
        padding: '24px 20px 12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <h2 style={{
          margin: 0,
          fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
          fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', color: c.cream,
        }}>
          {sectionTitle}
        </h2>
        <Link
          href="/dashboard/missions"
          style={{ fontSize: 11, fontWeight: 700, color: c.gold, letterSpacing: '0.06em', textDecoration: 'none' }}
        >
          TÜMÜ →
        </Link>
      </div>

      {/* ── 5. Mission cards ── */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {displayMissions.length === 0 ? (
          <EmptyState
            title={activeTab === 'recommended' ? 'Henüz öneri yok' : 'Henüz katıldığın görev yok'}
            description={activeTab === 'recommended'
              ? 'İlgi alanlarını ve şehrini profilinden belirle, sana özel görevler önerelim.'
              : 'Görevlere katılarak burada takip edebilirsin.'}
            action={{ label: activeTab === 'recommended' ? 'Görevleri keşfet' : 'Görev bul', href: '/dashboard/missions' }}
          />
        ) : (
          displayMissions.map(mission => {
            const userMission = userActiveMissions.find(um => um.mission_id === mission.id)
            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                isSaved={savedMissionIds.includes(mission.id)}
                isMember={memberNgoIds.includes(mission.ngo_id ?? '')}
                userId={profile.id}
              />
            )
          })
        )}
      </div>

      {/* ── 6. NGO rail ── */}
      {ngos.length > 0 && (
        <div style={{ padding: '32px 0 0' }}>
          <div style={{
            padding: '0 20px 14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          }}>
            <div>
              <p style={{
                margin: '0 0 3px', fontSize: 10, fontWeight: 700,
                color: c.gold, letterSpacing: '0.22em', textTransform: 'uppercase',
              }}>
                İyilik Öncüleri
              </p>
              <h2 style={{
                margin: 0,
                fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
                fontSize: 22, fontWeight: 500, color: c.cream,
              }}>
                İyiliğin öncüleri
              </h2>
            </div>
            <Link
              href="/dashboard/ngos"
              style={{ fontSize: 11, fontWeight: 700, color: c.gold, letterSpacing: '0.06em', textDecoration: 'none' }}
            >
              TÜMÜ →
            </Link>
          </div>

          <div style={{
            display: 'flex', gap: 12, overflowX: 'auto',
            padding: '0 20px 20px', scrollbarWidth: 'none',
          }}>
            {ngos.filter(ngo => ngo.category !== 'sponsor').map(ngo => {
              const coverUrl = ngo.cover_image_url
              const activeMissionCount = missions.filter(m => m.ngos?.id === ngo.id).length
              return (
                <Link
                  key={ngo.id}
                  href={`/dashboard/ngos/${ngo.id}`}
                  style={{ flexShrink: 0, width: 158, textDecoration: 'none' }}
                >
                  <div style={{
                    background: c.ink800, borderRadius: 14,
                    overflow: 'hidden', border: `1px solid ${c.ink600}`,
                  }}>
                    <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                      <div style={{
                        width: '100%', height: '100%',
                        backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                        backgroundColor: coverUrl ? undefined : (ngo.color_accent ?? c.ink600),
                        backgroundSize: 'cover', backgroundPosition: 'center',
                      }} />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, rgba(26,22,18,0) 45%, rgba(26,22,18,.85) 100%)',
                      }} />
                      <div style={{
                        position: 'absolute', left: 10, bottom: 10,
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        border: memberNgoIds.includes(ngo.id) ? `2px solid ${c.gold}` : undefined,
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
                          <span style={{ fontSize: 13, fontWeight: 700, color: ngo.color_accent ?? c.gold }}>
                            {(ngo.short_name ?? ngo.name)[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ padding: '11px 12px 13px' }}>
                      <p style={{
                        margin: 0, fontSize: 14, fontWeight: 600, color: c.cream,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {ngo.short_name ?? ngo.name}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: c.ink300 }}>
                        {activeMissionCount} aktif görev
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── 7. Impact summary ── */}
      <div style={{ padding: '8px 16px 20px' }}>
        <ImpactSummary completed={completedIds.size} karma={karma} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build and verify**

Run: `npx next build 2>&1 | grep -E "error|Error|✓"`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/dashboard-client.tsx
git commit -m "feat: dashboard tabs, remove QuickAction, bell icon gold fix"
```

---

### Task 5: Fix ImpactSummary — use real data

**Files:**
- Modify: `components/ui/ds/impact-summary.tsx`

- [ ] **Step 1: Replace with real data version**

```tsx
'use client'

import { useTheme } from '@/lib/theme'

interface ImpactSummaryProps {
  completed: number
  karma: number
}

export function ImpactSummary({ completed, karma }: ImpactSummaryProps) {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(233,207,194,.12), rgba(196,203,172,.08))',
        border: `1px solid ${c.ink600}`,
        borderRadius: 18,
        padding: '22px 22px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '.22em',
        textTransform: 'uppercase', color: c.ink300, marginBottom: 8,
      }}>
        Senin etkin
      </div>
      <div style={{
        fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
        fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em',
        color: c.cream, marginTop: 8, lineHeight: 1.2,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <span style={{ color: c.gold }}>{completed}</span> görev ·
        <span style={{ color: c.gold }}> {karma.toLocaleString('tr-TR')}</span> Karma
      </div>
      <div style={{
        fontSize: 13, color: c.ink300, marginTop: 6, maxWidth: 280, lineHeight: 1.5,
      }}>
        Her görev bir fark yaratıyor.
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build and verify**

Run: `npx next build 2>&1 | grep -E "error|Error|✓"`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add components/ui/ds/impact-summary.tsx
git commit -m "fix: ImpactSummary uses real completed/karma data"
```

---

### Task 6: Update HeroCard props in dashboard-client

**Files:**
- Verify: `app/dashboard/dashboard-client.tsx`

The HeroCard in Task 2 now expects `{ karma, completed, streak }` without `tierName`, `nextTier`, `karmaToNext` — those are computed internally. Verify the call in dashboard-client.tsx matches:

- [ ] **Step 1: Verify HeroCard call is correct**

The dashboard-client.tsx from Task 4 already has:
```tsx
<HeroCard profile={{
  karma,
  completed: completedIds.size,
  streak: profile.current_streak ?? profile.streak ?? 0,
}} />
```

This matches the new HeroCard interface `{ karma: number; completed: number; streak: number }`. No changes needed.

- [ ] **Step 2: Remove old tier helpers from dashboard-client**

The tier helpers (`TIER_THRESHOLDS`, `TIER_NAMES`, `TIER_NEXT`, `getTierIndex`, `getTierName`, `getNextTierName`, `getKarmaToNext`) were in the old dashboard-client.tsx. The Task 4 rewrite already removed them since they moved into hero-card.tsx. Verify they're not duplicated.

- [ ] **Step 3: Final build and verify everything works together**

Run: `npx next build 2>&1 | grep -E "error|Error|✓"`
Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit if any changes**

```bash
git add -A
git commit -m "chore: verify dashboard integration, remove stale code"
```

---

## Self-Review Checklist

| Spec Requirement | Task |
|-----------------|------|
| BrandLogo tierLevel prop | Task 1 |
| Tier-specific animations (wing, glow, particles) | Task 1 |
| HeroCard centered butterfly layout | Task 2 |
| Tier names (İyi Biri → İyiliğin Işığı) | Task 2 |
| Remove SIRA stat | Task 2 |
| 2-column stats (GÖREV + SERİ) | Task 2 |
| Progress bar with next tier | Task 2 |
| Remove QuickAction cards | Task 4 |
| New tabs: "Senin için" + "Katıldıkların" | Task 4 |
| Recommended missions scoring (NGO > interest > city) | Task 3 |
| Bell icon color fix (c.gold) | Task 4 |
| Remove UserPen import | Task 4 |
| Section header adapts to tab | Task 4 |
| ImpactSummary real data | Task 5 |
| Integration verification | Task 6 |
