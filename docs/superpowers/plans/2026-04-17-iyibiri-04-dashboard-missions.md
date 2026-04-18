# İyiBiri — Plan 4: Dashboard & Misyonlar

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dashboard ve misyon sayfalarını mock data'dan kurtarıp Supabase'e bağlamak; tüm sayfaları design system ile sıfırdan yazmak.

**Architecture:** Server components Supabase'den okur, client components animasyonları yönetir. `lib/supabase/queries/` katmanı kullanılır.

**Tech Stack:** Next.js 14 Server Components, Framer Motion, Supabase

**Bağımlılıklar:** Plan 1 (DB + query katmanı), Plan 2 (design system)

---

### Task 1: Dashboard Ana Sayfa

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `app/dashboard/dashboard-client.tsx`

- [ ] **Step 1: dashboard/page.tsx'i server component olarak yaz**

`app/dashboard/page.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getAllMissions, getUserMissions } from '@/lib/supabase/queries/missions'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, missions, userMissions] = await Promise.all([
    getProfile(user.id),
    getAllMissions(),
    getUserMissions(user.id),
  ])

  if (!profile) redirect('/auth/login')

  return (
    <DashboardClient
      profile={profile}
      missions={missions}
      userMissions={userMissions}
    />
  )
}
```

- [ ] **Step 2: dashboard-client.tsx'i sıfırdan yaz**

`app/dashboard/dashboard-client.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Profile, Mission, UserMission } from '@/lib/supabase/types'
import { KarmaCounter } from '@/components/ui/karma-counter'
import { XPBar } from '@/components/ui/xp-bar'
import { StreakFlame } from '@/components/ui/streak-flame'
import { TierBadge, getTierFromKarma } from '@/components/ui/tier-badge'
import { MissionCard } from '@/components/ui/mission-card'

interface Props {
  profile: Profile
  missions: Mission[]
  userMissions: UserMission[]
}

const tierThresholds: Record<number, number> = { 1: 500, 2: 1500, 3: 3000, 4: Infinity }

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
      {/* Hero Header */}
      <div className="bg-white px-4 pt-12 pb-6 border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-text-muted text-sm">Merhaba,</p>
              <h1 className="font-display font-extrabold text-2xl text-text-primary">
                {firstName} 👋
              </h1>
            </div>
            <StreakFlame streak={profile.streak} />
          </div>

          {/* Karma Card */}
          <div className="bg-primary/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-primary/70 uppercase tracking-wide">Toplam Karma</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl">✨</span>
                  <KarmaCounter value={profile.karma_total} size="lg" className="text-primary" />
                </div>
              </div>
              <TierBadge tier={tier} />
            </div>
            {nextThreshold !== Infinity && (
              <XPBar
                current={profile.karma_total - prevThreshold}
                max={nextThreshold - prevThreshold}
                label={`Tier ${tier + 1}'e`}
                color="#F4B942"
              />
            )}
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Devam Eden Görevler */}
        {inProgressMissions.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-lg text-text-primary mb-3">
              Devam Eden Görevler
            </h2>
            <div className="space-y-3">
              {inProgressMissions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <MissionCard mission={mission} isTaken />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Öne Çıkan Görevler */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg text-text-primary">Öne Çıkan Görevler</h2>
            <Link href="/dashboard/missions" className="text-sm text-primary font-semibold">
              Tümü →
            </Link>
          </div>
          <div className="space-y-3">
            {featuredMissions.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm">
                Tüm öne çıkan görevleri tamamladın! 🎉
              </div>
            ) : (
              featuredMissions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
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

        {/* Hızlı Erişim */}
        <section>
          <h2 className="font-display font-bold text-lg text-text-primary mb-3">Keşfet</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/dashboard/ngos', emoji: '🤝', label: "STK'lar", color: 'bg-blue-50 border-blue-100' },
              { href: '/dashboard/rewards', emoji: '🎁', label: 'Ödüller', color: 'bg-amber-50 border-amber-100' },
              { href: '/dashboard/my-missions', emoji: '📋', label: 'Görevlerim', color: 'bg-emerald-50 border-emerald-100' },
              { href: '/dashboard/profile/badges', emoji: '🏅', label: 'Rozetler', color: 'bg-purple-50 border-purple-100' },
            ].map(({ href, emoji, label, color }) => (
              <motion.div key={href} whileTap={{ scale: 0.95 }}>
                <Link href={href}>
                  <div className={`rounded-2xl border p-4 flex items-center gap-3 ${color}`}>
                    <span className="text-2xl">{emoji}</span>
                    <span className="font-semibold text-text-primary text-sm">{label}</span>
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

- [ ] **Step 3: Test et**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm run dev
```

Giriş yapıp `localhost:3000/dashboard` → karma hero görünüyor mu, görevler listeleniyor mu?

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/page.tsx app/dashboard/dashboard-client.tsx
git commit -m "feat: rebuild dashboard with supabase data and new design system"
```

---

### Task 2: Misyon Listesi Sayfası

**Files:**
- Modify: `app/dashboard/missions/page.tsx`
- Modify: `app/dashboard/missions/missions-client.tsx`

- [ ] **Step 1: missions/page.tsx yaz**

`app/dashboard/missions/page.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllMissions, getUserMissions } from '@/lib/supabase/queries/missions'
import { MissionsClient } from './missions-client'

export default async function MissionsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [missions, userMissions] = await Promise.all([
    getAllMissions(),
    getUserMissions(user.id),
  ])

  return <MissionsClient missions={missions} userMissions={userMissions} />
}
```

- [ ] **Step 2: missions-client.tsx yaz**

`app/dashboard/missions/missions-client.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Mission, UserMission } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'

interface Props {
  missions: Mission[]
  userMissions: UserMission[]
}

const domains = [
  { value: 'all', label: 'Tümü' },
  { value: 'nature', label: '🌿 Doğa' },
  { value: 'education', label: '📚 Eğitim' },
  { value: 'social', label: '❤️ Sosyal' },
  { value: 'financial', label: '💛 Finansal' },
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
      {/* Header */}
      <div className="bg-white border-b border-border px-4 pt-12 pb-4 sticky top-0 z-10">
        <h1 className="font-display font-extrabold text-2xl text-text-primary mb-4">Görevler</h1>
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {domains.map(({ value, label }) => (
            <motion.button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === value
                  ? 'bg-primary text-white'
                  : 'bg-stone-100 text-text-muted'
              }`}
              whileTap={{ scale: 0.93 }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mission List */}
      <div className="px-4 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((mission, i) => (
            <motion.div
              key={mission.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
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
          <div className="text-center py-12 text-text-muted">
            Bu kategoride görev bulunamadı
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test et**

`localhost:3000/dashboard/missions` → görevler listeleniyor mu, filtreler çalışıyor mu?

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/missions/
git commit -m "feat: rebuild missions list with supabase data and domain filters"
```

---

### Task 3: Misyon Detay Sayfası

**Files:**
- Modify: `app/dashboard/missions/[id]/page.tsx`

- [ ] **Step 1: [id]/page.tsx yaz**

`app/dashboard/missions/[id]/page.tsx`:

```typescript
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMissionById, getUserMissions, takeMission } from '@/lib/supabase/queries/missions'
import { MissionDetailClient } from './mission-detail-client'

export default async function MissionDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [mission, userMissions] = await Promise.all([
    getMissionById(params.id),
    getUserMissions(user.id),
  ])

  if (!mission) notFound()

  const userMission = userMissions.find(m => m.mission_id === params.id)

  return (
    <MissionDetailClient
      mission={mission}
      userMission={userMission ?? null}
      userId={user.id}
    />
  )
}
```

- [ ] **Step 2: mission-detail-client.tsx yaz**

`app/dashboard/missions/[id]/mission-detail-client.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Mission, UserMission } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

interface Props {
  mission: Mission & { ngos?: { name: string; color_accent: string } | null }
  userMission: UserMission | null
  userId: string
}

const difficultyLabel = { easy: 'Kolay', medium: 'Orta', hard: 'Zor' }
const verifyMethodLabel = { auto: 'Otomatik', code: 'Kod girişi', photo: 'Fotoğraf', qr: 'QR kod' }

export function MissionDetailClient({ mission, userMission, userId }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const isTaken = !!userMission
  const isCompleted = userMission?.status === 'completed'

  const steps: string[] = Array.isArray(mission.steps)
    ? mission.steps as string[]
    : JSON.parse((mission.steps as string) ?? '[]')

  async function handleTakeMission() {
    setLoading(true)
    const { error } = await supabase
      .from('user_missions')
      .insert({ user_id: userId, mission_id: mission.id, status: 'taken' })
    if (error) {
      setLoading(false)
      return
    }
    router.refresh()
    router.push(`/dashboard/missions/${mission.id}/complete`)
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Back button */}
      <div className="bg-white border-b border-border px-4 pt-12 pb-4">
        <Link href="/dashboard/missions" className="flex items-center gap-2 text-text-muted text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Görevler
        </Link>
        <h1 className="font-display font-extrabold text-2xl text-text-primary">{mission.title}</h1>
        {mission.ngos && (
          <p className="text-sm text-text-muted mt-1">{mission.ngos.name}</p>
        )}
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Karma & Meta */}
        <div className="flex gap-3">
          <div className="flex-1 bg-primary/10 rounded-2xl p-4 text-center">
            <span className="text-2xl">✨</span>
            <p className="font-extrabold text-2xl text-primary font-display">{mission.karma}</p>
            <p className="text-xs text-text-muted">karma</p>
          </div>
          <div className="flex-1 bg-stone-50 rounded-2xl p-4 text-center">
            <span className="text-2xl">⏱</span>
            <p className="font-bold text-base text-text-primary font-display">{mission.duration ?? '—'}</p>
            <p className="text-xs text-text-muted">süre</p>
          </div>
          <div className="flex-1 bg-stone-50 rounded-2xl p-4 text-center">
            <span className="text-2xl">📊</span>
            <p className="font-bold text-base text-text-primary font-display">
              {mission.difficulty ? difficultyLabel[mission.difficulty] : '—'}
            </p>
            <p className="text-xs text-text-muted">zorluk</p>
          </div>
        </div>

        {/* Açıklama */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-display font-bold text-base mb-2">Görev Detayı</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {mission.long_description ?? mission.description}
          </p>
        </div>

        {/* Adımlar */}
        {steps.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-4">
            <h2 className="font-display font-bold text-base mb-3">Adımlar</h2>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                  <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Doğrulama yöntemi */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-display font-bold text-base mb-1">Doğrulama</h2>
          <p className="text-sm text-text-muted">
            {verifyMethodLabel[mission.verify_method]} — {mission.verify_hint}
          </p>
        </div>

        {/* Etki */}
        {mission.impact_statement && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <p className="text-sm font-semibold text-emerald-700">🌍 {mission.impact_statement}</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        {isCompleted ? (
          <div className="bg-success text-white text-center py-4 rounded-2xl font-bold">
            ✓ Tamamlandı
          </div>
        ) : isTaken ? (
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href={`/dashboard/missions/${mission.id}/complete`}
              className="block w-full bg-primary text-white text-center py-4 rounded-2xl font-display font-bold text-base shadow-lg"
            >
              Tamamlamaya Devam Et →
            </Link>
          </motion.div>
        ) : (
          <motion.button
            onClick={handleTakeMission}
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-display font-bold text-base shadow-lg disabled:opacity-60"
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

- [ ] **Step 3: Test et**

`localhost:3000/dashboard/missions/beach-cleanup` → misyon detayı görünüyor mu?
"Görevi Al" butonuna tıkla → user_missions tablosuna satır eklendi mi?

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/missions/[id]/
git commit -m "feat: rebuild mission detail page with take mission flow"
```

---

### Task 4: NGO Listesi & Detay

**Files:**
- Modify: `app/dashboard/ngos/page.tsx`
- Modify: `app/dashboard/ngos/[id]/page.tsx`

- [ ] **Step 1: ngos/page.tsx yaz**

`app/dashboard/ngos/page.tsx`:

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
        <h1 className="font-display font-extrabold text-2xl text-text-primary">İyilik Öncüleri</h1>
        <p className="text-text-muted text-sm mt-1">Misyon ortağı STK'larımız</p>
      </div>
      <div className="px-4 py-4 space-y-3">
        {ngos.map(ngo => (
          <Link key={ngo.id} href={`/dashboard/ngos/${ngo.id}`}>
            <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: ngo.color_accent ?? '#F4B942' }}
              >
                {ngo.short_name?.[0] ?? ngo.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-text-primary truncate">{ngo.name}</h2>
                <p className="text-sm text-text-muted truncate">{ngo.tagline}</p>
              </div>
              <span className="text-text-muted">›</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Test et**

`localhost:3000/dashboard/ngos` → 5 STK görünüyor mu?

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/ngos/
git commit -m "feat: wire NGOs page to supabase"
```
