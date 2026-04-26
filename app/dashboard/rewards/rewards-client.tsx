'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { Lock } from 'lucide-react'
import type { Reward, RewardRedemption } from '@/lib/supabase/types'
import { KarmaDotToken, BadgeDS, ChipDS } from '@/components/ui/ds'
import { EmptyStateV2, emptyPresets } from '@/components/ui/state'
import { useTheme } from '@/lib/theme'
import { MOTION_PRESETS } from '@/lib/motion.config'

interface Props {
  rewards: Reward[]
  redemptions: RewardRedemption[]
  currentKarma: number
  userId: string
}

const FILTER_TABS = ['Hepsi', 'Kupon', 'Deneyim', 'Bağış', 'Kilitli'] as const
type FilterTab = (typeof FILTER_TABS)[number]

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80'

export function RewardsClient({ rewards, redemptions, currentKarma }: Props) {
  const { colors: c } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState<FilterTab>('Hepsi')

  const redeemedIds = useMemo(
    () => new Set<string>(redemptions.map(r => r.reward_id)),
    [redemptions]
  )

  const filteredRewards = useMemo(() => {
    if (activeTab === 'Hepsi') return rewards
    if (activeTab === 'Kilitli') return rewards.filter(r => currentKarma < r.karma_required)
    const catMap: Record<string, string> = {
      Kupon: 'kupon',
      Deneyim: 'deneyim',
      Bağış: 'bagis',
    }
    const cat = catMap[activeTab]
    return rewards.filter(r => r.category?.toLowerCase() === cat)
  }, [rewards, activeTab, currentKarma])

  // Featured tile: first reward with image_url
  const featuredReward = useMemo(
    () => rewards.find(r => r.image_url) ?? rewards[0] ?? null,
    [rewards]
  )

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        paddingBottom: 140,
      }}
    >
      {/* ── 1. Header ── */}
      <motion.div
        initial={{ opacity: 1, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0 }}
        style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0' }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: c.ink300,
            margin: 0,
            marginBottom: 8,
          }}
        >
          KARMA MARKETİ
        </p>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            margin: 0,
            color: c.cream,
          }}
        >
          İyilik{' '}
          <em
            style={{
              fontStyle: 'italic',
              color: c.gold,
            }}
          >
            ödüllerle
          </em>{' '}
          döner
        </h1>
      </motion.div>

      {/* ── 2. Balance card ── */}
      <motion.div
        initial={{ opacity: 1, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.1 }}
        style={{ padding: '22px 16px 0' }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${c.ink800}, ${c.ink700})`,
            border: `1px solid ${c.goldLine}`,
            borderRadius: 18,
            padding: '18px 22px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Concentric rings decoration */}
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            style={{
              position: 'absolute',
              right: -30,
              top: -30,
              opacity: 0.12,
              pointerEvents: 'none',
            }}
          >
            {[60, 45, 30, 15].map(r => (
              <circle
                key={r}
                cx="70"
                cy="70"
                r={r}
                stroke={c.gold}
                strokeWidth=".8"
                fill="none"
              />
            ))}
          </svg>

          {/* Left: balance info */}
          <div style={{ position: 'relative' }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '.06em',
                color: c.ink300,
                margin: 0,
                marginBottom: 6,
                textTransform: 'uppercase',
              }}
            >
              Bakiyen
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <KarmaDotToken size={14} />
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: c.gold,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                }}
              >
                {currentKarma.toLocaleString('tr-TR')}
              </span>
            </div>
          </div>

          {/* Right: history button */}
          <button
            style={{
              position: 'relative',
              background: 'transparent',
              border: `1px solid ${c.ink600}`,
              color: c.cream,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.06em',
              borderRadius: 999,
              padding: '7px 14px',
              cursor: 'default',
            }}
          >
            GEÇMİŞ
          </button>
        </div>
      </motion.div>

      {/* ── 3. Filter tabs ── */}
      <motion.div
        initial={{ opacity: 1, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.15 }}
        style={{
          padding: '22px 0 4px',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingLeft: 20,
          paddingRight: 20,
          scrollbarWidth: 'none',
        }}
      >
        {FILTER_TABS.map(tab => (
          <ChipDS
            key={tab}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </ChipDS>
        ))}
      </motion.div>

      {/* ── 4. Featured editorial tile ── */}
      {featuredReward && (
        <motion.div
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.2 }}
          style={{ padding: '20px 16px 0' }}
        >
          <Link href={`/dashboard/rewards/${featuredReward.id}`}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              style={{
                position: 'relative',
                aspectRatio: '16/9',
                borderRadius: 16,
                overflow: 'hidden',
                border: `1px solid ${c.ink600}`,
              }}
            >
              {/* Background photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredReward.image_url ?? FALLBACK_IMAGE}
                alt={featuredReward.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Left gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(26,22,18,.85) 20%, rgba(26,22,18,.15))',
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Top */}
                <div>
                  <BadgeDS variant="gold">ÖZEL İŞBİRLİĞİ</BadgeDS>
                </div>

                {/* Bottom */}
                <div>
                  <p
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontStyle: 'italic',
                      fontSize: 22,
                      fontWeight: 500,
                      color: '#F4EEDF',
                      lineHeight: 1.15,
                      margin: 0,
                      marginBottom: 10,
                    }}
                  >
                    {featuredReward.title}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <KarmaDotToken size={14} />
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: c.gold,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {featuredReward.karma_required.toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      )}

      {/* ── 5. Reward grid ── */}
      {/* Section header */}
      <motion.div
        initial={{ opacity: 1, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.25 }}
        style={{ padding: '24px 20px 8px', display: 'flex', alignItems: 'baseline', gap: 10 }}
      >
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 20,
            fontWeight: 500,
            color: c.cream,
            margin: 0,
          }}
        >
          {activeTab}
        </h2>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '.14em',
            color: c.ink300,
            textTransform: 'uppercase',
          }}
        >
          {filteredRewards.length} ÖDÜL
        </span>
      </motion.div>

      {filteredRewards.length === 0 && (
        <EmptyStateV2 {...emptyPresets.noRewards} />
      )}

      {/* Grid */}
      <motion.div
        initial={{ opacity: 1, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.3 }}
        style={{
          padding: '8px 16px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {filteredRewards.map((reward, idx) => {
          const canAfford = currentKarma >= reward.karma_required
          const locked = !canAfford

          return (
            <Link key={reward.id} href={`/dashboard/rewards/${reward.id}`}>
              <motion.div
                initial={{ opacity: 1, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  ...MOTION_PRESETS.spring.snappy,
                  delay: idx * MOTION_PRESETS.stagger.default,
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: c.ink800,
                  border: `1px solid ${c.ink600}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  opacity: locked ? 0.65 : 1,
                  cursor: 'pointer',
                }}
              >
                {/* Photo area — 4:3 */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '4/3',
                    background: c.ink,
                  }}
                >
                  {reward.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={reward.image_url}
                      alt={reward.title}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : null}

                  {/* Gradient scrim */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(26,22,18,.75) 0%, rgba(26,22,18,0) 50%)',
                    }}
                  />

                  {/* Lock icon (top-right) */}
                  {locked && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 26,
                        height: 26,
                        borderRadius: 999,
                        background: c.ink800,
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Lock size={12} color={c.ink300} />
                    </div>
                  )}

                  {/* Partner info (bottom-left on photo) */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {reward.brand_logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={reward.brand_logo}
                          alt={reward.brand}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: 8,
                            fontWeight: 700,
                            color: '#24201B',
                          }}
                        >
                          {reward.brand[0]}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: '#F4EEDF',
                        lineHeight: 1,
                      }}
                    >
                      {reward.brand}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '11px 12px 12px' }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: c.cream,
                      margin: 0,
                      minHeight: 30,
                      lineHeight: 1.3,
                    }}
                  >
                    {reward.title}
                  </p>

                  {/* Bottom bar */}
                  <div
                    style={{
                      borderTop: `1px solid ${c.ink600}`,
                      marginTop: 8,
                      paddingTop: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {/* Left: cost */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <KarmaDotToken size={10} />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: c.gold,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {reward.karma_required.toLocaleString('tr-TR')}
                      </span>
                    </div>

                    {/* Right: action label */}
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: '.08em',
                        color: locked ? c.ink300 : c.gold,
                      }}
                    >
                      {locked ? 'KİLİTLİ' : 'TAKAS →'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          )
        })}
      </motion.div>
    </div>
  )
}
