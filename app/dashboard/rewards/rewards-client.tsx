'use client'

import { useState, useMemo } from 'react'
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
    () => new Set<string>(redemptions.map(r => r.reward_id))
  )
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])

  async function handleRedeem(reward: Reward) {
    if (karma < reward.karma_required) return
    setLoading(reward.id)
    setError(null)

    const { error: redemptionError } = await supabase
      .from('reward_redemptions')
      .insert({ user_id: userId, reward_id: reward.id, karma_spent: reward.karma_required })

    if (redemptionError) {
      setError('Ödül kullanılamadı')
      setLoading(null)
      return
    }

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
    setRedeemedIds(prev => new Set(Array.from(prev).concat(reward.id)))
    setSelectedReward(null)
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
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
                    // eslint-disable-next-line @next/next/no-img-element
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
