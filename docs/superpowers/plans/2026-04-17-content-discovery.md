# Content & Discovery — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add image support to missions and NGOs, redesign the mission detail page with a hero band, add an NGO feed section to the dashboard, and migrate the NGO detail page from mock data to Supabase.

**Architecture:** Two new DB columns (`image_url` on missions, `cover_image_url` on ngos) seeded with Unsplash URLs. The mission detail gets a full-width hero band. The dashboard gets a new horizontal-scroll NGO feed section. The NGO detail page is rewritten to use Supabase instead of mock data.

**Tech Stack:** Next.js 14, Supabase JS v2, TypeScript, Tailwind CSS, Framer Motion, Supabase Management API (for DB migrations)

**Environment:**
- Project ref: `oskenoydnhscegrnrqca`
- SUPABASE_URL: `https://oskenoydnhscegrnrqca.supabase.co`
- SERVICE_ROLE_KEY: in `/Users/bahadiroylumlu/Desktop/iyibiri/.env.local` as `SUPABASE_SERVICE_ROLE_KEY`
- ACCESS_TOKEN: in `/Users/bahadiroylumlu/Desktop/iyibiri/.env.local` as `SUPABASE_ACCESS_TOKEN`

---

## File Map

| File | Change |
|---|---|
| `lib/supabase/types.ts` | Add `image_url` to Mission type, `cover_image_url` to NGO type, update `NGOBrief` |
| `lib/supabase/queries/missions.ts` | Update `getAllMissions` join to include `cover_image_url` |
| `app/dashboard/missions/[id]/mission-detail-client.tsx` | Full redesign: hero band with image/gradient, remove emojis, premium stat chips |
| `app/dashboard/dashboard-client.tsx` | Add NGO feed section (horizontal scroll NGO cards) |
| `app/dashboard/page.tsx` | Also fetch NGOs to pass to DashboardClient |
| `app/dashboard/ngos/[id]/page.tsx` | Migrate from mock data to Supabase, dynamic route |

---

## Task 1: DB migrations + type updates + seeding

**Files:**
- Modify: `lib/supabase/types.ts`

### DB Migration

- [ ] **Step 1: Add columns via Supabase Management API**

```bash
ACCESS_TOKEN=$(grep SUPABASE_ACCESS_TOKEN /Users/bahadiroylumlu/Desktop/iyibiri/.env.local | cut -d= -f2)

curl -s -X POST "https://api.supabase.com/v1/projects/oskenoydnhscegrnrqca/database/query" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "ALTER TABLE missions ADD COLUMN IF NOT EXISTS image_url TEXT; ALTER TABLE ngos ADD COLUMN IF NOT EXISTS cover_image_url TEXT;"}'
```

Expected: `{"results":[]}` or similar success response (no error field).

- [ ] **Step 2: Seed mission image_url by domain**

```bash
ACCESS_TOKEN=$(grep SUPABASE_ACCESS_TOKEN /Users/bahadiroylumlu/Desktop/iyibiri/.env.local | cut -d= -f2)

curl -s -X POST "https://api.supabase.com/v1/projects/oskenoydnhscegrnrqca/database/query" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "UPDATE missions SET image_url = CASE domain WHEN '\''nature'\'' THEN '\''https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80'\'' WHEN '\''education'\'' THEN '\''https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'\'' WHEN '\''social'\'' THEN '\''https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80'\'' WHEN '\''financial'\'' THEN '\''https://images.unsplash.com/photo-1579621970590-9d152b5d6a0c?w=800&q=80'\'' ELSE '\''https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80'\'' END WHERE image_url IS NULL;"}'
```

Expected: success response.

- [ ] **Step 3: Seed NGO cover_image_url**

```bash
ACCESS_TOKEN=$(grep SUPABASE_ACCESS_TOKEN /Users/bahadiroylumlu/Desktop/iyibiri/.env.local | cut -d= -f2)

curl -s -X POST "https://api.supabase.com/v1/projects/oskenoydnhscegrnrqca/database/query" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "UPDATE ngos SET cover_image_url = CASE WHEN category = '\''Çevre'\'' OR category = '\''nature'\'' THEN '\''https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80'\'' WHEN category = '\''Eğitim'\'' OR category = '\''education'\'' THEN '\''https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80'\'' WHEN category = '\''Hayvanlar'\'' THEN '\''https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80'\'' WHEN category = '\''Sağlık'\'' THEN '\''https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80'\'' ELSE '\''https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80'\'' END WHERE cover_image_url IS NULL;"}'
```

Expected: success response.

- [ ] **Step 4: Update lib/supabase/types.ts**

In `lib/supabase/types.ts`, find the missions Row type (around lines 100-130) and add `image_url: string | null` to it.

Find the ngos Row type (around lines 40-65) and add `cover_image_url: string | null` to it.

Also update `NGOBrief` (near end of file) to include `cover_image_url`:

```typescript
export type NGOBrief = {
  id: string
  name: string
  short_name: string | null
  logo_url: string | null
  color_accent: string | null
  cover_image_url: string | null
}
```

Also update the Insert and Update types for both tables to include the new optional columns:
- missions Insert/Update: `image_url?: string | null`
- ngos Insert/Update: `cover_image_url?: string | null`

- [ ] **Step 5: Update getAllMissions join to include cover_image_url**

In `lib/supabase/queries/missions.ts`, update the select query in `getAllMissions()`:

```typescript
.select('*, ngos(id, name, short_name, logo_url, color_accent, cover_image_url)')
```

- [ ] **Step 6: Verify TypeScript**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 7: Commit**

```bash
git add lib/supabase/types.ts lib/supabase/queries/missions.ts
git commit -m "feat: add image_url to missions and cover_image_url to NGOs, update types and query"
```

---

## Task 2: Mission detail page redesign

**Files:**
- Modify: `app/dashboard/missions/[id]/mission-detail-client.tsx`

The current design has a flat white header. Redesign with a hero band: full-width gradient (using domain color) with optional image overlay, title and NGO name overlaid on it. Remove all emojis. Use Lucide icons for stats.

- [ ] **Step 1: Read the current file**

Read `/Users/bahadiroylumlu/Desktop/iyibiri/app/dashboard/missions/[id]/mission-detail-client.tsx` to understand the full current state.

- [ ] **Step 2: Replace the file**

Write the new version of `app/dashboard/missions/[id]/mission-detail-client.tsx`:

```typescript
'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Clock, Zap, CheckCircle2, Camera, QrCode, Hash, Zap as AutoIcon } from 'lucide-react'
import type { Mission, UserMission } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

interface Props {
  mission: Mission & { ngos?: { name: string; color_accent: string | null; logo_url: string | null } | null }
  userMission: UserMission | null
  userId: string
}

const domainGradient: Record<string, string> = {
  nature: 'from-emerald-500 to-teal-400',
  education: 'from-blue-500 to-indigo-400',
  social: 'from-rose-500 to-pink-400',
  financial: 'from-amber-500 to-orange-400',
  default: 'from-stone-500 to-stone-600',
}

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: 'Kolay', color: 'bg-emerald-100 text-emerald-700' },
  medium: { label: 'Orta', color: 'bg-amber-100 text-amber-700' },
  hard: { label: 'Zor', color: 'bg-red-100 text-red-700' },
}

const verifyIcon: Record<string, React.ElementType> = {
  auto: AutoIcon,
  code: Hash,
  photo: Camera,
  qr: QrCode,
}

const verifyLabel: Record<string, string> = {
  auto: 'Otomatik',
  code: 'Kod girişi',
  photo: 'Fotoğraf',
  qr: 'QR kod',
}

export function MissionDetailClient({ mission, userMission, userId }: Props) {
  const [loading, setLoading] = useState(false)
  const [takeError, setTakeError] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  const isTaken = !!userMission
  const isCompleted = userMission?.status === 'completed'

  const domain = mission.domain ?? 'default'
  const gradient = domainGradient[domain] ?? domainGradient.default
  const difficulty = difficultyConfig[mission.difficulty ?? 'easy']
  const VerifyIcon = verifyIcon[mission.verify_method ?? 'auto']

  let steps: string[] = []
  try {
    steps = Array.isArray(mission.steps)
      ? mission.steps as string[]
      : JSON.parse((mission.steps as string) ?? '[]')
  } catch {
    steps = []
  }

  async function handleTakeMission() {
    setLoading(true)
    setTakeError(null)
    const { error } = await supabase
      .from('user_missions')
      .insert({ user_id: userId, mission_id: mission.id, status: 'taken' })
    setLoading(false)
    if (error) {
      setTakeError('Görev alınamadı, tekrar dene')
      return
    }
    router.push(`/dashboard/missions/${mission.id}/complete`)
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Band */}
      <div className={`relative bg-gradient-to-br ${gradient} pt-12 pb-8 px-4`}>
        {(mission as Mission & { image_url?: string | null }).image_url && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${(mission as Mission & { image_url?: string | null }).image_url})` }}
          />
        )}
        <div className="relative">
          <Link
            href="/dashboard/missions"
            className="inline-flex items-center gap-1.5 text-white/80 text-sm mb-6"
          >
            <ArrowLeft size={16} />
            Görevler
          </Link>
          {mission.ngos && (
            <div className="flex items-center gap-2 mb-2">
              {mission.ngos.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mission.ngos.logo_url}
                  alt={mission.ngos.name}
                  className="w-5 h-5 rounded object-contain bg-white/90 p-0.5"
                />
              ) : (
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold"
                  style={{ backgroundColor: mission.ngos.color_accent ?? '#00000040' }}
                >
                  {mission.ngos.name[0]}
                </div>
              )}
              <span className="text-white/80 text-sm font-medium">{mission.ngos.name}</span>
            </div>
          )}
          <h1 className="font-display font-extrabold text-white text-2xl leading-tight">
            {mission.title}
          </h1>
          {/* Stat chips */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <div className="bg-white/20 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-white" />
              <span className="text-white font-bold text-sm">{mission.karma} karma</span>
            </div>
            {mission.duration && (
              <div className="bg-white/20 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <Clock size={14} className="text-white" />
                <span className="text-white text-sm">{mission.duration}</span>
              </div>
            )}
            {mission.difficulty && (
              <div className={`rounded-full px-3 py-1.5 text-sm font-semibold ${difficulty.color}`}>
                {difficulty.label}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-4">
        {/* Description */}
        <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
          <h2 className="font-display font-bold text-base text-stone-900 mb-2">Görev Detayı</h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            {mission.long_description ?? mission.description}
          </p>
        </div>

        {/* Steps */}
        {steps.length > 0 && (
          <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
            <h2 className="font-display font-bold text-base text-stone-900 mb-3">Adımlar</h2>
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-stone-500">
                  <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Verification */}
        <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
          <h2 className="font-display font-bold text-base text-stone-900 mb-2">Doğrulama</h2>
          <div className="flex items-center gap-2 mb-1">
            <VerifyIcon size={16} className="text-stone-400" />
            <span className="text-sm font-semibold text-stone-700">{verifyLabel[mission.verify_method ?? 'auto']}</span>
          </div>
          <p className="text-sm text-stone-500">{mission.verify_hint}</p>
        </div>

        {/* Impact */}
        {mission.impact_statement && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5">
            <div className="flex items-start gap-2">
              <Zap size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-semibold text-emerald-700">{mission.impact_statement}</p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {takeError && (
        <motion.div
          className="mx-4 bg-red-50 border border-red-100 rounded-2xl p-3 text-sm text-red-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {takeError}
        </motion.div>
      )}

      {/* CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        {isCompleted ? (
          <div className="bg-emerald-500 text-white text-center py-4 rounded-2xl font-display font-bold flex items-center justify-center gap-2">
            <CheckCircle2 size={20} />
            Tamamlandı
          </div>
        ) : isTaken ? (
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href={`/dashboard/missions/${mission.id}/complete`}
              className="block w-full bg-primary text-white text-center py-4 rounded-2xl font-display font-bold text-base shadow-[0_4px_20px_rgba(244,185,66,0.4)]"
            >
              Tamamlamaya Devam Et →
            </Link>
          </motion.div>
        ) : (
          <motion.button
            onClick={handleTakeMission}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-2xl font-display font-bold text-base shadow-[0_4px_20px_rgba(244,185,66,0.4)] disabled:opacity-60"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Göreve Alınıyor...' : 'Görevi Al →'}
          </motion.button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/missions/[id]/mission-detail-client.tsx
git commit -m "feat: redesign mission detail page with hero band, remove emojis"
```

---

## Task 3: Dashboard NGO feed section

Add a horizontal-scroll NGO feed section to the dashboard, appearing after "Öne Çıkanlar".

**Files:**
- Modify: `app/dashboard/page.tsx` — fetch NGOs
- Modify: `app/dashboard/dashboard-client.tsx` — add NGO feed section + update props

- [ ] **Step 1: Update dashboard/page.tsx to also fetch NGOs**

Read the current `app/dashboard/page.tsx`. Add a Supabase query for NGOs and pass it to `DashboardClient`.

Replace the full file with:

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getAllMissions, getUserMissions } from '@/lib/supabase/queries/missions'
import { DashboardClient } from './dashboard-client'
import type { NGO } from '@/lib/supabase/types'

async function getNGOs(): Promise<NGO[]> {
  const supabase = createClient()
  const { data } = await supabase.from('ngos').select('*').limit(10)
  return data ?? []
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, missions, userMissions, ngos] = await Promise.all([
    getProfile(user.id),
    getAllMissions(),
    getUserMissions(user.id),
    getNGOs(),
  ])

  if (!profile) redirect('/onboarding')

  return (
    <DashboardClient
      profile={profile}
      missions={missions}
      userMissions={userMissions}
      ngos={ngos}
    />
  )
}
```

- [ ] **Step 2: Add NGO feed to dashboard-client.tsx**

Read the current `app/dashboard/dashboard-client.tsx`.

At the top, add `NGO` to the imports:
```typescript
import type { Profile, MissionWithNGO, UserMission, NGO } from '@/lib/supabase/types'
```

Update the Props interface to include `ngos: NGO[]`:
```typescript
interface Props {
  profile: Profile
  missions: MissionWithNGO[]
  userMissions: UserMission[]
  ngos: NGO[]
}
```

Update the function signature:
```typescript
export function DashboardClient({ profile, missions, userMissions, ngos }: Props) {
```

Add the NGO feed section JSX after the "Öne Çıkanlar" section (after the `</section>` closing the Featured section and before the Discover Grid section):

```tsx
{/* NGO Feed */}
{ngos.length > 0 && (
  <section>
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-display font-extrabold text-xl text-stone-900">Kuruluşlardan</h2>
      <Link href="/dashboard/ngos" className="text-sm text-primary font-bold">
        Tümü →
      </Link>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {ngos.map((ngo, i) => (
        <motion.div
          key={ngo.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex-shrink-0 w-[200px]"
        >
          <Link href={`/dashboard/ngos/${ngo.id}`}>
            <div className="rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
              {/* Cover image */}
              <div
                className="h-28 bg-cover bg-center relative"
                style={{
                  backgroundImage: (ngo as NGO & { cover_image_url?: string | null }).cover_image_url
                    ? `url(${(ngo as NGO & { cover_image_url?: string | null }).cover_image_url})`
                    : undefined,
                  backgroundColor: (ngo as NGO & { cover_image_url?: string | null }).cover_image_url
                    ? undefined
                    : (ngo.color_accent ?? '#F4B942'),
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              {/* Info */}
              <div className="bg-white px-3 py-3">
                <div className="flex items-center gap-2">
                  {ngo.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ngo.logo_url}
                      alt={ngo.name}
                      className="w-7 h-7 rounded-lg object-contain border border-stone-100 p-0.5 flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: ngo.color_accent ?? '#F4B942' }}
                    >
                      {(ngo.short_name ?? ngo.name)[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-display font-bold text-stone-900 text-xs truncate">{ngo.short_name ?? ngo.name}</p>
                    <p className="text-[10px] text-stone-400 truncate">{ngo.tagline}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/page.tsx app/dashboard/dashboard-client.tsx
git commit -m "feat: add NGO feed section to dashboard"
```

---

## Task 4: NGO detail page — migrate from mock data to Supabase

The current `app/dashboard/ngos/[id]/page.tsx` uses static `lib/mock-data` imports. Rewrite it to fetch from Supabase and remove the `generateStaticParams` call.

**Files:**
- Modify: `app/dashboard/ngos/[id]/page.tsx`

- [ ] **Step 1: Read the current file**

Read `/Users/bahadiroylumlu/Desktop/iyibiri/app/dashboard/ngos/[id]/page.tsx`.

- [ ] **Step 2: Replace the file**

Write the new `app/dashboard/ngos/[id]/page.tsx`:

```typescript
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Users, Globe, Calendar, Heart, ChevronRight } from 'lucide-react'
import type { NGO, MissionWithNGO } from '@/lib/supabase/types'

async function getNGOWithMissions(id: string): Promise<{ ngo: NGO; missions: MissionWithNGO[] } | null> {
  const supabase = createClient()
  const [{ data: ngo }, { data: missions }] = await Promise.all([
    supabase.from('ngos').select('*').eq('id', id).single(),
    supabase
      .from('missions')
      .select('*, ngos(id, name, short_name, logo_url, color_accent, cover_image_url)')
      .eq('ngo_id', id)
      .eq('active', true)
      .order('created_at', { ascending: true }),
  ])
  if (!ngo) return null
  return { ngo, missions: (missions ?? []) as MissionWithNGO[] }
}

const domainGradient: Record<string, string> = {
  nature: 'from-emerald-500 to-teal-400',
  education: 'from-blue-500 to-indigo-400',
  social: 'from-rose-500 to-pink-400',
  financial: 'from-amber-500 to-orange-400',
  default: 'from-stone-400 to-stone-500',
}

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: 'Kolay', color: 'bg-emerald-100 text-emerald-700' },
  medium: { label: 'Orta', color: 'bg-amber-100 text-amber-700' },
  hard: { label: 'Zor', color: 'bg-red-100 text-red-700' },
}

export default async function NGODetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const result = await getNGOWithMissions(params.id)
  if (!result) notFound()

  const { ngo, missions } = result
  const coverImageUrl = (ngo as NGO & { cover_image_url?: string | null }).cover_image_url

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <div className="relative">
        {/* Cover image / gradient */}
        <div
          className="h-48 bg-cover bg-center relative"
          style={{
            backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : undefined,
            backgroundColor: coverImageUrl ? undefined : (ngo.color_accent ?? '#F4B942'),
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
          <div className="absolute top-12 left-4">
            <Link href="/dashboard/ngos" className="inline-flex items-center gap-1.5 text-white/90 text-sm">
              <ArrowLeft size={16} />
              Kuruluşlar
            </Link>
          </div>
        </div>

        {/* Logo + Name Card */}
        <div className="bg-white px-4 pt-4 pb-5 border-b border-stone-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-stone-100 flex items-center justify-center overflow-hidden p-2 flex-shrink-0 -mt-10 shadow-lg">
              {ngo.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ngo.logo_url} alt={ngo.name} className="w-full h-full object-contain" />
              ) : (
                <span className="font-black text-stone-700 text-lg">
                  {(ngo.short_name ?? ngo.name).slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="font-display font-extrabold text-xl text-stone-900 leading-tight">{ngo.name}</h1>
              <p className="text-sm text-stone-500 mt-0.5">{ngo.tagline}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { Icon: Users, value: (ngo.member_count ?? 0).toLocaleString('tr-TR'), label: 'Üye' },
              { Icon: Heart, value: (ngo.volunteer_count ?? 0).toLocaleString('tr-TR'), label: 'Gönüllü' },
              { Icon: Calendar, value: String(ngo.founded ?? '—'), label: 'Kuruluş' },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="bg-stone-50 rounded-2xl p-3 text-center">
                <Icon size={14} className="text-stone-400 mx-auto mb-1" />
                <p className="font-bold text-sm text-stone-900">{value}</p>
                <p className="text-[11px] text-stone-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* About */}
        {ngo.description && (
          <section className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
            <h2 className="font-display font-bold text-base text-stone-900 mb-2">Hakkında</h2>
            <p className="text-sm text-stone-500 leading-relaxed">{ngo.description}</p>
            {ngo.website && (
              <a
                href={ngo.website.startsWith('http') ? ngo.website : `https://${ngo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mt-3"
              >
                <Globe size={14} />
                {ngo.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </section>
        )}

        {/* Missions */}
        {missions.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-base text-stone-900 mb-3">
              Görevler
              <span className="ml-2 text-sm font-normal text-stone-400">({missions.length})</span>
            </h2>
            <div className="space-y-2">
              {missions.map((mission, index) => {
                const diff = difficultyConfig[mission.difficulty ?? 'easy']
                const domain = mission.domain ?? 'default'
                const gradient = domainGradient[domain] ?? domainGradient.default
                return (
                  <Link
                    key={mission.id}
                    href={`/dashboard/missions/${mission.id}`}
                    className="flex items-center gap-3 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-4 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-sm text-stone-900 truncate">{mission.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${diff.color}`}>
                          {diff.label}
                        </span>
                        <span className="text-[11px] text-primary font-bold">+{mission.karma} karma</span>
                        {mission.duration && (
                          <span className="text-[11px] text-stone-400">{mission.duration}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-stone-300 flex-shrink-0" />
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/ngos/[id]/page.tsx
git commit -m "feat: migrate NGO detail page from mock data to Supabase"
```
