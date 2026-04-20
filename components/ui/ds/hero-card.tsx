'use client'

import React from 'react'
import { Flame } from 'lucide-react'
import { KarmaDotToken } from './karma-dot-token'
import { BrandLogo } from '@/components/ui/brand-logo'
import { useTheme } from '@/lib/theme'

const TIER_THRESHOLDS = [0, 500, 2000, 5000, 10000]
const TIER_NAMES = ['İyi Biri', 'İyi Yürekli', 'İyilik Elçisi', 'İyilik Savaşçısı', 'İyiliğin Işığı']

function computeTier(karma: number) {
  let tierLevel = 1
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (karma >= TIER_THRESHOLDS[i]) { tierLevel = i + 1; break }
  }
  const tierName = TIER_NAMES[tierLevel - 1]
  const isMax = tierLevel >= TIER_THRESHOLDS.length
  if (isMax) return { tierLevel, tierName, nextTierName: null, karmaToNext: null, pct: 100 }
  const currentThreshold = TIER_THRESHOLDS[tierLevel - 1]
  const nextThreshold = TIER_THRESHOLDS[tierLevel]
  return {
    tierLevel,
    tierName,
    nextTierName: TIER_NAMES[tierLevel],
    karmaToNext: nextThreshold - karma,
    pct: Math.round(((karma - currentThreshold) / (nextThreshold - currentThreshold)) * 100),
  }
}

interface HeroCardProps {
  profile: {
    karma: number
    completed: number
    streak: number
  }
}

export function HeroCard({ profile }: HeroCardProps) {
  const { colors: c } = useTheme()
  const { tierLevel, tierName, nextTierName, karmaToNext, pct } = computeTier(profile.karma)
  const isMax = nextTierName === null

  return (
    <div
      style={{
        background: `linear-gradient(165deg, ${c.ink800} 0%, ${c.ink900} 100%)`,
        borderRadius: 24,
        border: `1px solid ${c.ink600}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative concentric arcs — subtle, top-right */}
      <svg
        width="280" height="280" viewBox="0 0 280 280"
        style={{ position: 'absolute', right: -100, top: -100, opacity: 0.08, pointerEvents: 'none' }}
      >
        {[130, 100, 70, 40].map(r => (
          <circle key={r} cx="140" cy="140" r={r} stroke={c.gold} strokeWidth="0.6" fill="none" />
        ))}
      </svg>

      {/* ── Butterfly hero zone ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 22px 0',
      }}>
        {/* Butterfly — large, centered, the star of the card */}
        <div style={{ position: 'relative', marginBottom: -8 }}>
          <BrandLogo tierLevel={tierLevel} />
        </div>

        {/* Tier name — directly below butterfly */}
        <div style={{
          fontFamily: "'Fraunces', var(--font-display), ui-serif, Georgia, serif",
          fontStyle: 'italic',
          fontSize: 16,
          fontWeight: 500,
          color: c.gold,
          letterSpacing: '-0.01em',
          marginBottom: 16,
        }}>
          {tierName}
        </div>

        {/* Karma number — large, prominent */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 4,
        }}>
          <KarmaDotToken size={16} />
          <span style={{
            fontSize: 44,
            fontWeight: 700,
            color: c.gold,
            letterSpacing: '-0.035em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}>
            {profile.karma.toLocaleString('tr-TR')}
          </span>
        </div>
        <div style={{ fontSize: 12, color: c.ink300, marginBottom: 20 }}>
          Karma
        </div>
      </div>

      {/* ── Progress section ── */}
      {!isMax && (
        <div style={{ padding: '0 22px 20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontSize: 11,
            marginBottom: 8,
          }}>
            <span style={{ color: c.ink300 }}>
              <span style={{
                fontFamily: "'Fraunces', var(--font-display), ui-serif, Georgia, serif",
                fontStyle: 'italic',
                color: c.cream,
              }}>
                {nextTierName}
              </span>
              &apos;ye
            </span>
            <span style={{
              color: c.gold,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {karmaToNext!.toLocaleString('tr-TR')} kaldı
            </span>
          </div>
          <div style={{
            height: 5,
            background: 'rgba(255,255,255,.1)',
            borderRadius: 999,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.max(pct, 2)}%`,
              background: `linear-gradient(90deg, ${c.goldDim}, ${c.gold})`,
              borderRadius: 999,
              transition: 'width 400ms cubic-bezier(.2,.8,.2,1)',
            }} />
          </div>
        </div>
      )}

      {/* ── Stats strip ── */}
      <div style={{
        display: 'flex',
        margin: '0 22px',
        padding: '14px 0',
        borderTop: `1px solid ${c.ink600}`,
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: c.ink300 }}>
            GÖREV
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: c.gold, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
            {profile.completed}
          </div>
          <div style={{ fontSize: 10, color: c.ink300, marginTop: 2 }}>tamamlandı</div>
        </div>
        <div style={{ width: 1, background: c.ink600 }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: c.ink300 }}>
            SERİ
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
            <Flame size={13} color={c.gold} />
            <span style={{ fontSize: 18, fontWeight: 700, color: c.gold, fontVariantNumeric: 'tabular-nums' }}>
              {profile.streak} gün
            </span>
          </div>
          <div style={{ fontSize: 10, color: c.ink300, marginTop: 2 }}>kesintisiz</div>
        </div>
      </div>
    </div>
  )
}
