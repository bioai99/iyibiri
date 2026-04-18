'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react'
import type { Reward, RewardRedemption } from '@/lib/supabase/types'

interface Props {
  rewards: Reward[]
  redemptions: RewardRedemption[]
  currentKarma: number
  userId: string
}

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
    <div style={{ minHeight: '100vh', background: '#1C1812', paddingBottom: 96 }}>
      {/* Page header */}
      <div style={{ padding: '48px 16px 16px' }}>
        <h1 style={{ color: '#F4EEDF', fontSize: 28, fontWeight: 700, marginBottom: 8, fontFamily: 'inherit' }}>
          Ödüller
        </h1>

        {/* Karma balance card */}
        <div
          style={{
            background: '#2E2923',
            border: '1px solid rgba(232,194,104,0.25)',
            borderRadius: 16,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 12,
          }}
        >
          <span style={{ fontSize: 24 }}>🎁</span>
          <div>
            <p style={{ color: '#A89E8A', fontSize: 11, marginBottom: 2 }}>Kullanabileceğin</p>
            <p style={{ color: '#E8C268', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
              {currentKarma.toLocaleString('tr-TR')} Karma
            </p>
          </div>
          <Sparkles size={16} style={{ color: '#E8C268', marginLeft: 'auto' }} />
        </div>
      </div>

      {/* Brand carousel */}
      {brands.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              paddingBottom: 8,
              paddingLeft: 16,
              paddingRight: 16,
              scrollbarWidth: 'none',
            }}
          >
            {brands.map((reward, i) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ flexShrink: 0 }}
              >
                <Link href={`/dashboard/rewards/${reward.id}`}>
                  <div
                    style={{
                      background: '#2E2923',
                      border: '1px solid #3F3830',
                      borderRadius: 16,
                      padding: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      width: 80,
                    }}
                  >
                    {reward.brand_logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={reward.brand_logo}
                        alt={reward.brand}
                        style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 10 }}
                        onError={e => {
                          e.currentTarget.style.display = 'none'
                          ;(e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex')
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: '#3F3830',
                        display: reward.brand_logo ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: '#A89E8A',
                        fontSize: 14,
                      }}
                    >
                      {reward.brand[0]}
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: '#A89E8A',
                        fontWeight: 500,
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}
                    >
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
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rewards.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#A89E8A', fontSize: 14 }}>
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
              style={{ opacity: !unlocked && !redeemed ? 0.6 : 1 }}
            >
              <Link href={`/dashboard/rewards/${reward.id}`}>
                <motion.div
                  whileTap={unlocked && !redeemed ? { scale: 0.98 } : undefined}
                  style={{
                    display: 'flex',
                    background: '#2E2923',
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: '1px solid #3F3830',
                    cursor: 'pointer',
                  }}
                >
                  {/* Left gradient strip */}
                  <div
                    style={{
                      width: 6,
                      flexShrink: 0,
                      background: redeemed
                        ? 'linear-gradient(to bottom, #34d399, #10b981)'
                        : 'linear-gradient(to bottom, #E8C268, #d97706)',
                    }}
                  />

                  {/* Body */}
                  <div style={{ flex: 1, padding: '14px 16px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                      {reward.brand_logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={reward.brand_logo}
                          alt={reward.brand}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            objectFit: 'contain',
                            border: '1px solid #3F3830',
                            padding: 4,
                            flexShrink: 0,
                            background: '#3F3830',
                          }}
                          onError={e => {
                            e.currentTarget.style.display = 'none'
                            ;(e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex')
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: '#3F3830',
                          display: reward.brand_logo ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 14,
                          color: '#A89E8A',
                          flexShrink: 0,
                        }}
                      >
                        {reward.brand[0]}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h3
                          style={{
                            fontWeight: 700,
                            color: '#F4EEDF',
                            fontSize: 14,
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            margin: 0,
                          }}
                        >
                          {reward.title}
                        </h3>
                        <p style={{ fontSize: 12, color: '#A89E8A', margin: 0 }}>{reward.brand}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Sparkles
                        size={12}
                        style={{ color: redeemed ? '#3F3830' : '#E8C268', flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: redeemed ? '#A89E8A' : '#E8C268',
                        }}
                      >
                        {reward.karma_required.toLocaleString('tr-TR')} karma
                      </span>
                      {!unlocked && !redeemed && (
                        <span style={{ fontSize: 11, color: '#A89E8A', marginLeft: 4 }}>
                          · {(reward.karma_required - currentKarma).toLocaleString('tr-TR')} daha
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dashed divider */}
                  <div
                    style={{
                      width: 1,
                      borderRight: '1px dashed #3F3830',
                      margin: '12px 0',
                    }}
                  />

                  {/* Right action */}
                  <div
                    style={{
                      width: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {redeemed ? (
                      <CheckCircle2 size={22} style={{ color: '#34d399' }} />
                    ) : unlocked ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2,
                          background: 'linear-gradient(135deg, #E8C268, #d97706)',
                          borderRadius: 10,
                          padding: '6px 10px',
                        }}
                      >
                        <span style={{ color: '#1C1812', fontWeight: 700, fontSize: 11 }}>Kullan</span>
                        <Sparkles size={12} style={{ color: '#1C1812' }} />
                      </div>
                    ) : (
                      <Lock size={18} style={{ color: '#3F3830' }} />
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
