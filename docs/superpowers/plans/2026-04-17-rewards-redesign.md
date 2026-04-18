# Rewards Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix broken brand logo images, add a brand carousel at the top of the rewards page, create individual reward detail pages, and update reward cards to navigate to the detail page instead of opening a bottom sheet.

**Architecture:** Brand logos are fixed using Clearbit's logo API (`https://logo.clearbit.com/{domain}`). A new horizontal-scroll brand carousel is added at the top. A new `/dashboard/rewards/[id]/page.tsx` route handles reward detail. The existing bottom sheet is replaced with navigation to the detail page.

**Tech Stack:** Next.js 14, Supabase, TypeScript, Tailwind CSS, Framer Motion, lucide-react

**Environment:**
- Project ref: `oskenoydnhscegrnrqca`
- SUPABASE_URL: `https://oskenoydnhscegrnrqca.supabase.co`
- SERVICE_ROLE_KEY and ACCESS_TOKEN in `/Users/bahadiroylumlu/Desktop/iyibiri/.env.local`

---

## File Map

| File | Change |
|---|---|
| DB `rewards` table | Update `brand_logo` URLs to Clearbit CDN values |
| `lib/supabase/types.ts` | No changes needed |
| `app/dashboard/rewards/rewards-client.tsx` | Replace bottom sheet with navigation, add brand carousel |
| `app/dashboard/rewards/[id]/page.tsx` | New file — reward detail page |

---

## Task 1: Fix brand logo URLs + seed brand data

- [ ] **Step 1: Check current rewards data**

```bash
ACCESS_TOKEN=$(grep SUPABASE_ACCESS_TOKEN /Users/bahadiroylumlu/Desktop/iyibiri/.env.local | cut -d= -f2)
curl -s -X POST "https://api.supabase.com/v1/projects/oskenoydnhscegrnrqca/database/query" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT id, title, brand, brand_logo, karma_required FROM rewards ORDER BY karma_required;"}'
```

Note the brands returned.

- [ ] **Step 2: Update brand_logo URLs using Clearbit**

Run the following SQL to set brand logos using Clearbit's free logo API. Adjust brand domain mappings based on what brands exist in the DB.

```bash
ACCESS_TOKEN=$(grep SUPABASE_ACCESS_TOKEN /Users/bahadiroylumlu/Desktop/iyibiri/.env.local | cut -d= -f2)
curl -s -X POST "https://api.supabase.com/v1/projects/oskenoydnhscegrnrqca/database/query" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "UPDATE rewards SET brand_logo = CASE WHEN LOWER(brand) LIKE '\''%starbucks%'\'' THEN '\''https://logo.clearbit.com/starbucks.com'\'' WHEN LOWER(brand) LIKE '\''%migros%'\'' THEN '\''https://logo.clearbit.com/migros.com.tr'\'' WHEN LOWER(brand) LIKE '\''%trendyol%'\'' THEN '\''https://logo.clearbit.com/trendyol.com'\'' WHEN LOWER(brand) LIKE '\''%nike%'\'' THEN '\''https://logo.clearbit.com/nike.com'\'' WHEN LOWER(brand) LIKE '\''%cinema%'\'' OR LOWER(brand) LIKE '\''%sinema%'\'' THEN '\''https://logo.clearbit.com/cinemaximum.com'\'' WHEN LOWER(brand) LIKE '\''%getir%'\'' THEN '\''https://logo.clearbit.com/getir.com'\'' WHEN LOWER(brand) LIKE '\''%spotify%'\'' THEN '\''https://logo.clearbit.com/spotify.com'\'' WHEN LOWER(brand) LIKE '\''%amazon%'\'' THEN '\''https://logo.clearbit.com/amazon.com'\'' ELSE brand_logo END;"}'
```

Expected: success response.

- [ ] **Step 3: Verify data looks correct (no errors needed, just check)**

```bash
ACCESS_TOKEN=$(grep SUPABASE_ACCESS_TOKEN /Users/bahadiroylumlu/Desktop/iyibiri/.env.local | cut -d= -f2)
curl -s -X POST "https://api.supabase.com/v1/projects/oskenoydnhscegrnrqca/database/query" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT brand, brand_logo FROM rewards;"}'
```

No commit needed — DB changes only.

---

## Task 2: Reward detail page

Create a new server component at `app/dashboard/rewards/[id]/page.tsx` that shows full reward details and handles redemption.

**Files:**
- Create: `app/dashboard/rewards/[id]/page.tsx`
- Create: `app/dashboard/rewards/[id]/reward-detail-client.tsx`

- [ ] **Step 1: Create reward detail page server component**

Create `app/dashboard/rewards/[id]/page.tsx`:

```typescript
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getUserRedemptions } from '@/lib/supabase/queries/rewards'
import { RewardDetailClient } from './reward-detail-client'

async function getReward(id: string) {
  const supabase = createClient()
  const { data } = await supabase.from('rewards').select('*').eq('id', id).single()
  return data
}

export default async function RewardDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [reward, profile, redemptions] = await Promise.all([
    getReward(params.id),
    getProfile(user.id),
    getUserRedemptions(user.id),
  ])

  if (!reward || !profile) notFound()

  const isRedeemed = redemptions.some(r => r.reward_id === params.id)

  return (
    <RewardDetailClient
      reward={reward}
      currentKarma={profile.karma_total}
      isRedeemed={isRedeemed}
      userId={user.id}
    />
  )
}
```

- [ ] **Step 2: Create reward detail client component**

Create `app/dashboard/rewards/[id]/reward-detail-client.tsx`:

```typescript
'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, CheckCircle2, Lock } from 'lucide-react'
import type { Reward } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

interface Props {
  reward: Reward
  currentKarma: number
  isRedeemed: boolean
  userId: string
}

export function RewardDetailClient({ reward, currentKarma, isRedeemed: initialRedeemed, userId }: Props) {
  const [karma, setKarma] = useState(currentKarma)
  const [redeemed, setRedeemed] = useState(initialRedeemed)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  const unlocked = karma >= reward.karma_required

  async function handleRedeem() {
    if (!unlocked || redeemed) return
    setLoading(true)
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
      setLoading(false)
      return
    }

    const { error: redemptionError } = await supabase
      .from('reward_redemptions')
      .insert({ user_id: userId, reward_id: reward.id, karma_spent: reward.karma_required })

    if (redemptionError) {
      setError('Ödül kaydedilemedi')
      setLoading(false)
      return
    }

    setKarma(prev => prev - reward.karma_required)
    setRedeemed(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 pt-12 pb-4">
        <Link href="/dashboard/rewards" className="inline-flex items-center gap-1.5 text-stone-400 text-sm mb-4">
          <ArrowLeft size={16} />
          Ödüller
        </Link>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Brand card */}
        <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 text-center">
          <div className="flex justify-center mb-4">
            {reward.brand_logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={reward.brand_logo}
                alt={reward.brand}
                className="w-20 h-20 rounded-2xl object-contain border border-stone-100 p-2"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center font-black text-3xl text-stone-400">
                {reward.brand[0]}
              </div>
            )}
          </div>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{reward.brand}</p>
          <h1 className="font-display font-extrabold text-2xl text-stone-900 mb-3">{reward.title}</h1>
          <p className="text-sm text-stone-500 leading-relaxed">{reward.description}</p>
        </div>

        {/* Karma cost card */}
        <div className={`rounded-3xl p-5 flex items-center justify-between ${
          redeemed ? 'bg-emerald-50' : unlocked ? 'bg-primary/10' : 'bg-stone-50'
        }`}>
          <div>
            <p className="text-sm font-semibold text-stone-600">Gereken karma</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Sparkles size={16} className={redeemed ? 'text-emerald-500' : unlocked ? 'text-primary' : 'text-stone-400'} />
              <span className={`font-extrabold text-2xl font-display ${
                redeemed ? 'text-emerald-600' : unlocked ? 'text-primary' : 'text-stone-400'
              }`}>
                {reward.karma_required.toLocaleString('tr-TR')}
              </span>
            </div>
          </div>
          {redeemed ? (
            <CheckCircle2 size={28} className="text-emerald-500" />
          ) : unlocked ? (
            <div className="bg-primary/20 rounded-full px-3 py-1">
              <span className="text-primary font-bold text-sm">Yeterli karma</span>
            </div>
          ) : (
            <div className="text-right">
              <Lock size={20} className="text-stone-300 mx-auto mb-1" />
              <p className="text-xs text-stone-400">
                {(reward.karma_required - karma).toLocaleString('tr-TR')} daha
              </p>
            </div>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        {redeemed ? (
          <div className="bg-emerald-500 text-white text-center py-4 rounded-2xl font-display font-bold flex items-center justify-center gap-2">
            <CheckCircle2 size={20} />
            Kullanıldı
          </div>
        ) : unlocked ? (
          <motion.button
            onClick={handleRedeem}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-2xl font-display font-bold text-base shadow-[0_4px_20px_rgba(244,185,66,0.4)] disabled:opacity-60"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'İşleniyor...' : 'Ödülü Kullan'}
          </motion.button>
        ) : (
          <div className="w-full bg-stone-100 text-stone-400 py-4 rounded-2xl font-display font-bold text-base text-center">
            <Lock size={18} className="inline mr-2" />
            Karma Yetersiz
          </div>
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
git add app/dashboard/rewards/[id]/page.tsx app/dashboard/rewards/[id]/reward-detail-client.tsx
git commit -m "feat: add reward detail page"
```

---

## Task 3: Rewards list — brand carousel + navigate to detail page

Update the rewards list page: add a brand logo carousel at the top, and change reward card taps to navigate to `/dashboard/rewards/[id]` instead of opening a bottom sheet.

**Files:**
- Modify: `app/dashboard/rewards/rewards-client.tsx`

- [ ] **Step 1: Read the current file**

Read `/Users/bahadiroylumlu/Desktop/iyibiri/app/dashboard/rewards/rewards-client.tsx`.

- [ ] **Step 2: Replace the file with the new version**

Write the new `app/dashboard/rewards/rewards-client.tsx`:

```typescript
'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react'
import type { Reward, RewardRedemption } from '@/lib/supabase/types'
import { KarmaCounter } from '@/components/ui/karma-counter'

interface Props {
  rewards: Reward[]
  redemptions: RewardRedemption[]
  currentKarma: number
  userId: string
}

const rewardGradient = 'from-amber-500 to-orange-400'

export function RewardsClient({ rewards, redemptions, currentKarma }: Props) {
  const redeemedIds = useMemo(
    () => new Set<string>(redemptions.map(r => r.reward_id)),
    [redemptions]
  )

  // Deduplicated brands for carousel
  const brands = useMemo(() => {
    const seen = new Set<string>()
    return rewards.filter(r => {
      if (seen.has(r.brand)) return false
      seen.add(r.brand)
      return true
    })
  }, [rewards])

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <h1 className="font-display font-extrabold text-3xl text-stone-900 mb-2">Ödüller</h1>
        <div className="flex items-center gap-1.5">
          <Sparkles size={16} className="text-primary" />
          <KarmaCounter value={currentKarma} size="sm" className="text-primary font-bold" />
          <span className="text-sm text-stone-400">karma bakiyen</span>
        </div>
      </div>

      {/* Brand carousel */}
      {brands.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {brands.map((reward, i) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <Link href={`/dashboard/rewards/${reward.id}`}>
                  <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] p-3 flex flex-col items-center gap-1.5 w-20">
                    {reward.brand_logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={reward.brand_logo}
                        alt={reward.brand}
                        className="w-10 h-10 object-contain rounded-xl"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-stone-500">
                        {reward.brand[0]}
                      </div>
                    )}
                    <span className="text-[10px] text-stone-500 font-medium text-center truncate w-full">
                      {reward.brand}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Reward list */}
      <div className="px-4 space-y-3">
        {rewards.map((reward, i) => {
          const unlocked = currentKarma >= reward.karma_required
          const redeemed = redeemedIds.has(reward.id)

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.06 }}
              className={!unlocked && !redeemed ? 'opacity-60' : ''}
            >
              <Link href={`/dashboard/rewards/${reward.id}`}>
                <motion.div
                  whileTap={unlocked && !redeemed ? { scale: 0.98 } : undefined}
                  className="flex bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] cursor-pointer"
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
                          · {(reward.karma_required - currentKarma).toLocaleString('tr-TR')} daha
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
              </Link>
            </motion.div>
          )
        })}
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
git add app/dashboard/rewards/rewards-client.tsx
git commit -m "feat: add brand carousel to rewards page, navigate to detail page on tap"
```
