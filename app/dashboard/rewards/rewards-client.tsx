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
