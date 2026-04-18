# Core UI Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the dashboard hero card, add NGO identity to mission cards, rename the "STK'lar" section to "Kuruluşlar", and update the NGO list to a logo-based design.

**Architecture:** The mission query is extended with a JOIN on the `ngos` table so every mission carries its NGO's name and logo URL. A new `MissionWithNGO` type is threaded through the component tree (query → page → client → card). All other changes are isolated UI edits.

**Tech Stack:** Next.js 14 App Router, Supabase JS v2, TypeScript, Tailwind CSS, Framer Motion, lucide-react

---

## File Map

| File | Change |
|---|---|
| `lib/supabase/types.ts` | Add `NGOBrief` and `MissionWithNGO` types |
| `lib/supabase/queries/missions.ts` | Update `getAllMissions()` to join NGO fields |
| `components/ui/mission-card.tsx` | Accept `MissionWithNGO`, render NGO logo + name |
| `app/dashboard/dashboard-client.tsx` | Use `MissionWithNGO[]`, simplify hero, rename "Kuruluşlar" |
| `app/dashboard/missions/missions-client.tsx` | Use `MissionWithNGO[]` type |
| `components/bottom-nav.tsx` | Rename "STK'lar" → "Kuruluşlar" |
| `app/dashboard/ngos/page.tsx` | Logo-based card design, rename header copy |

---

## Task 1: MissionWithNGO type + updated query

**Files:**
- Modify: `lib/supabase/types.ts`
- Modify: `lib/supabase/queries/missions.ts`

- [ ] **Step 1: Add NGOBrief and MissionWithNGO to the types file**

Open `lib/supabase/types.ts`. After the last `export type` line (currently `export type RewardRedemption = ...`), append:

```typescript
// Extended types for joined queries
export type NGOBrief = {
  id: string
  name: string
  short_name: string | null
  logo_url: string | null
  color_accent: string | null
}

export type MissionWithNGO = Mission & { ngos: NGOBrief | null }
```

- [ ] **Step 2: Update getAllMissions to join NGO data**

Replace the `getAllMissions` function in `lib/supabase/queries/missions.ts`:

```typescript
import type { Mission, MissionWithNGO, UserMission } from '../types'

export async function getAllMissions(): Promise<MissionWithNGO[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*, ngos(id, name, short_name, logo_url, color_accent)')
    .eq('active', true)
    .order('featured', { ascending: false })
  if (error) throw error
  return data as MissionWithNGO[]
}
```

Leave `getMissionById`, `getUserMissions`, `takeMission`, `completeMission` unchanged.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit
```

Expected: no errors (or only pre-existing unrelated errors — do not introduce new ones).

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/types.ts lib/supabase/queries/missions.ts
git commit -m "feat: add MissionWithNGO type and join NGO data in getAllMissions"
```

---

## Task 2: MissionCard — NGO identity row

**Files:**
- Modify: `components/ui/mission-card.tsx`

The bottom white section currently shows: title → description → chips row.
Add an NGO identity row between the title and the chips.

- [ ] **Step 1: Update MissionCard props and add NGO row**

Replace the full file `components/ui/mission-card.tsx` with:

```typescript
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, ChevronRight, CheckCircle2 } from 'lucide-react'
import { DomainIcon } from './domain-icon'
import type { MissionWithNGO } from '@/lib/supabase/types'

interface MissionCardProps {
  mission: MissionWithNGO
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
  const ngo = mission.ngos

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

            {/* NGO identity */}
            {ngo && (
              <div className="flex items-center gap-1.5 mt-1">
                {ngo.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ngo.logo_url}
                    alt={ngo.name}
                    className="w-4 h-4 rounded object-contain flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
                    style={{ backgroundColor: ngo.color_accent ?? '#F4B942' }}
                  >
                    {(ngo.short_name ?? ngo.name)[0]}
                  </div>
                )}
                <span className="text-xs text-stone-400 font-medium truncate">
                  {ngo.short_name ?? ngo.name}
                </span>
              </div>
            )}

            {!compact && (
              <p className="text-sm text-stone-500 mt-1 line-clamp-1">
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

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/mission-card.tsx
git commit -m "feat: show NGO logo and name on mission cards"
```

---

## Task 3: Update type references in Dashboard and Missions clients

Both `dashboard-client.tsx` and `missions-client.tsx` import `Mission` and declare `missions: Mission[]`. Update them to use `MissionWithNGO`.

**Files:**
- Modify: `app/dashboard/dashboard-client.tsx`
- Modify: `app/dashboard/missions/missions-client.tsx`

- [ ] **Step 1: Update dashboard-client.tsx imports and props**

In `app/dashboard/dashboard-client.tsx`, change:

```typescript
// OLD import line 6:
import type { Profile, Mission, UserMission } from '@/lib/supabase/types'

// NEW:
import type { Profile, MissionWithNGO, UserMission } from '@/lib/supabase/types'
```

Change the Props interface (around line 12–16):

```typescript
// OLD:
interface Props {
  profile: Profile
  missions: Mission[]
  userMissions: UserMission[]
}

// NEW:
interface Props {
  profile: Profile
  missions: MissionWithNGO[]
  userMissions: UserMission[]
}
```

- [ ] **Step 2: Update missions-client.tsx imports and props**

In `app/dashboard/missions/missions-client.tsx`, change:

```typescript
// OLD import line 6:
import type { Mission, UserMission } from '@/lib/supabase/types'

// NEW:
import type { MissionWithNGO, UserMission } from '@/lib/supabase/types'
```

Change the Props interface (around line 9–12):

```typescript
// OLD:
interface Props {
  missions: Mission[]
  userMissions: UserMission[]
}

// NEW:
interface Props {
  missions: MissionWithNGO[]
  userMissions: UserMission[]
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/dashboard-client.tsx app/dashboard/missions/missions-client.tsx
git commit -m "refactor: use MissionWithNGO type in dashboard and missions clients"
```

---

## Task 4: Simplify Dashboard hero card

Remove the tier badge and XP bar. Add a completed-missions count pill next to the streak pill.

**Files:**
- Modify: `app/dashboard/dashboard-client.tsx`

- [ ] **Step 1: Remove unused imports**

In `app/dashboard/dashboard-client.tsx`, remove the following imports (they are no longer needed after this task):

```typescript
// Remove these two lines:
import { XPBar } from '@/components/ui/xp-bar'
import { getTierFromKarma } from '@/components/ui/tier-badge'
```

Also remove `CheckCircle2` if it's not in the imports yet — add it from lucide-react:

```typescript
// Existing line 5 (update):
import { Flame, Sparkles, Handshake, Gift, ClipboardList, User, CheckCircle2 } from 'lucide-react'
```

- [ ] **Step 2: Remove tier/XP logic from component body**

In `DashboardClient`, remove these lines from the top of the function body (around lines 35–38):

```typescript
// REMOVE these lines:
const tier = getTierFromKarma(profile.karma_total)
const nextThreshold = tierThresholds[tier]
const prevThreshold = tier === 1 ? 0 : tierThresholds[tier - 1]
```

Also remove the `tierThresholds` constant at the top of the file (around line 25):

```typescript
// REMOVE:
const tierThresholds: Record<number, number> = { 1: 500, 2: 1500, 3: 3000, 4: Infinity }
```

- [ ] **Step 3: Replace hero card content**

Find the hero card JSX block (from `{/* Hero Card */}` to its closing `</motion.div>`, around lines 53–99). Replace it entirely with:

```tsx
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

  {/* Completed missions pill */}
  <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 w-fit">
    <CheckCircle2 size={14} className="text-white" />
    <span className="text-white font-bold text-sm">{completedIds.size}</span>
    <span className="text-white/70 text-xs">görev tamamlandı</span>
  </div>
</motion.div>
```

Also remove the `tierName` constant at the top of the file since it's no longer used:

```typescript
// REMOVE:
const tierName: Record<number, string> = {
  1: 'İyi Biri',
  2: 'Çok İyi Biri',
  3: 'Gerçekten İyi Biri',
  4: 'İyiliğin Öncüsü',
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add app/dashboard/dashboard-client.tsx
git commit -m "feat: simplify dashboard hero — karma + completed count only"
```

---

## Task 5: Rename "STK'lar" → "Kuruluşlar" and redesign NGO list

**Files:**
- Modify: `components/bottom-nav.tsx`
- Modify: `app/dashboard/dashboard-client.tsx`
- Modify: `app/dashboard/ngos/page.tsx`

- [ ] **Step 1: Update bottom nav label**

In `components/bottom-nav.tsx`, change line 11:

```typescript
// OLD:
{ href: '/dashboard/ngos', label: "STK'lar", icon: Heart },

// NEW:
{ href: '/dashboard/ngos', label: 'Kuruluşlar', icon: Heart },
```

- [ ] **Step 2: Update discover grid label in dashboard-client.tsx**

In `app/dashboard/dashboard-client.tsx`, in the `discoverItems` array (around line 28):

```typescript
// OLD:
{ href: '/dashboard/ngos', Icon: Handshake, label: "STK'lar", gradient: 'from-blue-500 to-indigo-400' },

// NEW:
{ href: '/dashboard/ngos', Icon: Handshake, label: 'Kuruluşlar', gradient: 'from-blue-500 to-indigo-400' },
```

- [ ] **Step 3: Rewrite the NGO list page with logo-based design**

Replace the full content of `app/dashboard/ngos/page.tsx` with:

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { NGO } from '@/lib/supabase/types'

async function getNGOs(): Promise<NGO[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('ngos').select('*')
  if (error) throw error
  return data
}

export default async function NGOsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const ngos = await getNGOs()

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-white border-b border-border px-4 pt-12 pb-4">
        <h1 className="font-display font-extrabold text-2xl text-stone-900">Kuruluşlar</h1>
        <p className="text-stone-500 text-sm mt-1">STK, vakıf, dernek ve belediyeler</p>
      </div>
      <div className="px-4 py-4 space-y-3">
        {ngos.map(ngo => (
          <Link key={ngo.id} href={`/dashboard/ngos/${ngo.id}`}>
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)] transition-shadow p-4 flex items-center gap-4">
              {/* Logo */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-stone-100"
                style={{ backgroundColor: ngo.logo_url ? '#FFFFFF' : (ngo.color_accent ?? '#F4B942') }}
              >
                {ngo.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ngo.logo_url}
                    alt={ngo.name}
                    className="w-full h-full object-contain p-1.5"
                  />
                ) : (
                  <span className="text-white font-black text-xl">
                    {(ngo.short_name ?? ngo.name)[0]}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-stone-900 truncate">{ngo.name}</h2>
                <p className="text-sm text-stone-500 truncate mt-0.5">{ngo.tagline}</p>
              </div>

              <span className="text-stone-300 text-lg flex-shrink-0">›</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add components/bottom-nav.tsx app/dashboard/dashboard-client.tsx app/dashboard/ngos/page.tsx
git commit -m "feat: rename STK'lar to Kuruluşlar and redesign NGO list with logo cards"
```

---

## Final verification

- [ ] **Start dev server and visually verify**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri && npm run dev
```

Open http://localhost:3000 and check:
1. Dashboard hero shows only: greeting, streak pill, karma number, completed count pill — no tier badge, no XP bar
2. Mission cards show a small NGO logo/monogram + NGO short name below the mission title
3. Bottom nav shows "Kuruluşlar" (not "STK'lar")
4. Discover grid shows "Kuruluşlar"
5. NGO list shows 56×56px logo cards with proper images (or colored monogram fallback)
6. NGO list header reads "Kuruluşlar" with subtitle "STK, vakıf, dernek ve belediyeler"
