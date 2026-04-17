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
          <span className="text-sm text-stone-400">Karma Bakiyeniz</span>
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
                        onError={e => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex') }}
                      />
                    ) : null}
                    <div className="w-10 h-10 rounded-xl bg-stone-100 items-center justify-center font-bold text-stone-500" style={{ display: reward.brand_logo ? 'none' : 'flex' }}>
                      {reward.brand[0]}
                    </div>
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
        {rewards.length === 0 && (
          <div className="text-center py-16 text-stone-400 text-sm">
            Henüz ödül bulunmuyor.
          </div>
        )}
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
                    className={`w-3 flex-shrink-0 bg-gradient-to-b ${redeemed ? 'from-emerald-400 to-emerald-500' : rewardGradient}`}
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
                          onError={e => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex') }}
                        />
                      ) : null}
                      <div className="w-10 h-10 rounded-xl bg-stone-100 items-center justify-center font-bold text-sm text-stone-500 flex-shrink-0" style={{ display: reward.brand_logo ? 'none' : 'flex' }}>
                        {reward.brand[0]}
                      </div>
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
