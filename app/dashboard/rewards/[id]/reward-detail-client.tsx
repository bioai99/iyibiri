'use client'

// app/dashboard/rewards/[id]/reward-detail-client.tsx
//
// Ödül detay sayfası — dark tema Premium × Warm rewrite (2026-04-24 gece).
// Önceki implementation light tema (bg-white, stone, primary/10) kullanıyordu —
// dashboard dark tema flow'unu kırıyordu.

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Sparkles, CheckCircle2, Lock } from 'lucide-react'
import type { Reward } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/lib/theme'

// Faz 5 (2026-04-26 perf-eng): reward detail brand logo next/image.

interface Props {
  reward: Reward
  currentKarma: number
  isRedeemed: boolean
  userId: string
}

export function RewardDetailClient({
  reward,
  currentKarma,
  isRedeemed: initialRedeemed,
  userId,
}: Props) {
  const { colors: c } = useTheme()
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
      .insert({
        user_id: userId,
        reward_id: reward.id,
        karma_spent: reward.karma_required,
      })

    if (redemptionError) {
      setError('Ödül kaydedilemedi')
      setLoading(false)
      return
    }

    setKarma((prev) => prev - reward.karma_required)
    setRedeemed(true)
    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: c.ink900,
        color: c.cream,
        paddingBottom: 140,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: c.ink900,
          borderBottom: `1px solid ${c.ink600}`,
          padding: 'calc(env(safe-area-inset-top, 20px) + 16px) 20px 16px',
        }}
      >
        <Link
          href="/dashboard/rewards"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: c.ink300,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          Ödüller
        </Link>
      </div>

      {/* Main card */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            borderRadius: 24,
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            padding: 24,
            textAlign: 'center',
          }}
        >
          {/* Brand logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            {reward.brand_logo ? (
              <Image
                src={reward.brand_logo}
                alt={reward.brand}
                width={80}
                height={80}
                sizes="80px"
                priority
                quality={85}
                style={{
                  borderRadius: 16,
                  objectFit: 'contain',
                  background: '#fff',
                  padding: 8,
                  border: `1px solid ${c.ink600}`,
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  ;(e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex')
                }}
              />
            ) : null}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                background: c.ink700,
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 32,
                color: c.ink300,
                display: reward.brand_logo ? 'none' : 'flex',
              }}
            >
              {reward.brand[0]}
            </div>
          </div>

          {/* Brand name */}
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: c.gold,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              margin: '0 0 6px',
            }}
          >
            {reward.brand}
          </p>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-display), Fraunces, serif',
              fontSize: 24,
              fontWeight: 600,
              color: c.cream,
              margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}
          >
            {reward.title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 14,
              color: c.ink200,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {reward.description}
          </p>
        </div>

        {/* Karma requirement card */}
        <div
          style={{
            background: redeemed
              ? `${c.success}18`
              : unlocked
                ? c.goldSoft
                : c.ink800,
            border: `1px solid ${redeemed ? c.success + '40' : unlocked ? c.goldLine : c.ink600}`,
            borderRadius: 24,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: c.ink300,
                margin: '0 0 4px',
              }}
            >
              Gereken karma
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles
                size={18}
                color={
                  redeemed ? c.success : unlocked ? c.gold : c.ink400
                }
              />
              <span
                style={{
                  fontFamily: 'var(--font-display), Fraunces, serif',
                  fontSize: 24,
                  fontWeight: 700,
                  color: redeemed ? c.success : unlocked ? c.gold : c.ink400,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {reward.karma_required.toLocaleString('tr-TR')}
              </span>
            </div>
          </div>

          {redeemed ? (
            <CheckCircle2 size={28} color={c.success} />
          ) : unlocked ? (
            <div
              style={{
                background: `${c.gold}30`,
                borderRadius: 999,
                padding: '6px 12px',
              }}
            >
              <span
                style={{ color: c.gold, fontSize: 13, fontWeight: 700 }}
              >
                Yeterli karma
              </span>
            </div>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <Lock
                size={20}
                color={c.ink400}
                style={{ marginBottom: 4 }}
              />
              <p style={{ fontSize: 11, color: c.ink300, margin: 0 }}>
                {(reward.karma_required - karma).toLocaleString('tr-TR')} daha
              </p>
            </div>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            style={{
              color: c.danger,
              fontSize: 13,
              textAlign: 'center',
              margin: 0,
            }}
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Sticky CTA */}
      <div
        style={{
          position: 'fixed',
          bottom: 'calc(80px + env(safe-area-inset-bottom, 20px))',
          left: 0,
          right: 0,
          padding: '0 16px',
        }}
      >
        {redeemed ? (
          <div
            style={{
              background: c.success,
              color: '#fff',
              textAlign: 'center',
              padding: 16,
              borderRadius: 16,
              fontFamily: 'var(--font-display), Fraunces, serif',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <CheckCircle2 size={20} />
            Kullanıldı
          </div>
        ) : unlocked ? (
          <motion.button
            onClick={handleRedeem}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              background: `linear-gradient(90deg, ${c.goldDim}, ${c.gold})`,
              color: c.ink,
              padding: 16,
              borderRadius: 16,
              fontFamily: 'var(--font-display), Fraunces, serif',
              fontWeight: 700,
              fontSize: 16,
              boxShadow: '0 4px 20px rgba(232,194,104,0.4)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'İşleniyor...' : 'Ödülü Kullan'}
          </motion.button>
        ) : (
          <div
            style={{
              width: '100%',
              background: c.ink700,
              color: c.ink400,
              padding: 16,
              borderRadius: 16,
              fontFamily: 'var(--font-display), Fraunces, serif',
              fontWeight: 700,
              fontSize: 16,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Lock size={18} />
            Karma Yetersiz
          </div>
        )}
      </div>
    </div>
  )
}
