'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
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
      <div className="bg-white border-b border-stone-100 px-4 pt-12 pb-4">
        <Link href="/dashboard/rewards" className="inline-flex items-center gap-1.5 text-stone-400 text-sm mb-4">
          <ArrowLeft size={16} />
          Ödüller
        </Link>
      </div>

      <div className="px-4 py-5 space-y-4">
        <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 text-center">
          <div className="flex justify-center mb-4">
            {reward.brand_logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={reward.brand_logo}
                alt={reward.brand}
                className="w-20 h-20 rounded-2xl object-contain border border-stone-100 p-2"
                onError={e => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex') }}
              />
            ) : null}
            <div className="w-20 h-20 rounded-2xl bg-stone-100 items-center justify-center font-black text-3xl text-stone-400" style={{ display: reward.brand_logo ? 'none' : 'flex' }}>
              {reward.brand[0]}
            </div>
          </div>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{reward.brand}</p>
          <h1 className="font-display font-extrabold text-2xl text-stone-900 mb-3">{reward.title}</h1>
          <p className="text-sm text-stone-500 leading-relaxed">{reward.description}</p>
        </div>

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
          <div className="w-full bg-stone-100 text-stone-400 py-4 rounded-2xl font-display font-bold text-base text-center flex items-center justify-center gap-2">
            <Lock size={18} />
            Karma Yetersiz
          </div>
        )}
      </div>
    </div>
  )
}
