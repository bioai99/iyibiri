# İyiBiri — Plan 6: Ödüller

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ödüller sayfasını Supabase'e bağlamak, kilitli/açık animasyonlu kartlar ve redemption akışını çalıştırmak.

**Architecture:** Server component ödülleri ve kullanıcı karma bakiyesini çeker. Client component kilitli/açık durumunu gösterir, redemption'ı Supabase'e yazar.

**Bağımlılıklar:** Plan 1 (queries/karma.ts), Plan 2 (design system), Plan 5 (karma yazımı çalışıyor)

---

### Task 1: Rewards Sayfası

**Files:**
- Modify: `app/dashboard/rewards/page.tsx`
- Modify: `app/dashboard/rewards/rewards-client.tsx`

- [ ] **Step 1: rewards/page.tsx yaz**

`app/dashboard/rewards/page.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllRewards, getUserRedemptions } from '@/lib/supabase/queries/rewards'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { RewardsClient } from './rewards-client'

export default async function RewardsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [rewards, redemptions, profile] = await Promise.all([
    getAllRewards(),
    getUserRedemptions(user.id),
    getProfile(user.id),
  ])

  return (
    <RewardsClient
      rewards={rewards}
      redemptions={redemptions}
      currentKarma={profile?.karma_total ?? 0}
      userId={user.id}
    />
  )
}
```

- [ ] **Step 2: rewards-client.tsx yaz**

`app/dashboard/rewards/rewards-client.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Reward, RewardRedemption } from '@/lib/supabase/types'
import { KarmaCounter } from '@/components/ui/karma-counter'
import { createClient } from '@/lib/supabase/client'

interface Props {
  rewards: Reward[]
  redemptions: RewardRedemption[]
  currentKarma: number
  userId: string
}

export function RewardsClient({ rewards, redemptions, currentKarma, userId }: Props) {
  const [karma, setKarma] = useState(currentKarma)
  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(
    new Set(redemptions.map(r => r.reward_id))
  )
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleRedeem(reward: Reward) {
    if (karma < reward.karma_required) return
    setLoading(reward.id)
    setError(null)

    // Redemption kaydı
    const { error: redemptionError } = await supabase
      .from('reward_redemptions')
      .insert({ user_id: userId, reward_id: reward.id, karma_spent: reward.karma_required })

    if (redemptionError) {
      setError('Ödül kullanılamadı')
      setLoading(null)
      return
    }

    // Negatif karma transaction
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

    setKarma(prev => prev - reward.karma_required)
    setRedeemedIds(prev => new Set([...prev, reward.id]))
    setSelectedReward(null)
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 pt-12 pb-4">
        <h1 className="font-display font-extrabold text-2xl text-text-primary">Ödüller</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg">✨</span>
          <KarmaCounter value={karma} size="md" className="text-primary" />
          <span className="text-sm text-text-muted">karma bakiyen</span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {rewards.map((reward, i) => {
          const unlocked = karma >= reward.karma_required
          const redeemed = redeemedIds.has(reward.id)
          const progress = Math.min((karma / reward.karma_required) * 100, 100)

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileTap={unlocked && !redeemed ? { scale: 0.98 } : undefined}
              onClick={() => unlocked && !redeemed && setSelectedReward(reward)}
              className={`bg-white rounded-2xl border border-border overflow-hidden cursor-pointer ${
                !unlocked ? 'opacity-70' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {reward.brand_logo ? (
                    <img
                      src={reward.brand_logo}
                      alt={reward.brand}
                      className="w-12 h-12 rounded-xl object-contain border border-border p-1"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-sm text-text-muted">
                      {reward.brand[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-text-primary truncate">{reward.title}</h3>
                    <p className="text-sm text-text-muted">{reward.brand}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {redeemed ? (
                      <span className="text-success font-bold text-sm">✓ Kullanıldı</span>
                    ) : (
                      <>
                        <div className="flex items-center gap-1 justify-end">
                          <span>✨</span>
                          <span className={`font-extrabold font-display ${unlocked ? 'text-primary' : 'text-text-muted'}`}>
                            {reward.karma_required.toLocaleString('tr-TR')}
                          </span>
                        </div>
                        {!unlocked && (
                          <span className="text-xs text-text-muted">
                            {(reward.karma_required - karma).toLocaleString('tr-TR')} daha
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                {!redeemed && (
                  <div className="mt-3 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${unlocked ? 'bg-primary' : 'bg-stone-300'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, delay: i * 0.07 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Redemption Confirmation Sheet */}
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
              <h2 className="font-display font-extrabold text-xl text-text-primary text-center mb-1">
                {selectedReward.title}
              </h2>
              <p className="text-text-muted text-sm text-center mb-6">{selectedReward.description}</p>

              <div className="bg-primary/10 rounded-2xl p-4 flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-primary/80">Harcanacak karma</span>
                <div className="flex items-center gap-1">
                  <span>✨</span>
                  <span className="font-extrabold text-xl text-primary font-display">
                    -{selectedReward.karma_required.toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-danger text-sm text-center mb-4">{error}</p>
              )}

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
                className="w-full py-3 mt-2 text-text-muted font-semibold text-sm"
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

- [ ] **Step 3: Test et**

1. `localhost:3000/dashboard/rewards` → ödüller listeleniyor mu?
2. Karma 0 iken tüm ödüller kilitli görünüyor mu?
3. Bir misyon tamamla (Plan 5) → karma bakiyesi güncellendi mi, ödül açıldı mı?
4. Açık ödüle tıkla → bottom sheet çıkıyor mu?
5. "Ödülü Kullan" → karma düştü mü, "Kullanıldı" görünüyor mu?
6. Supabase → reward_redemptions → satır eklendi mi?
7. Supabase → karma_transactions → negatif satır var mı?

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/rewards/
git commit -m "feat: rebuild rewards page with supabase, locked/unlocked states, redemption flow"
```
