'use client'

import React from 'react'
import { Flame } from 'lucide-react'
import { KarmaDotToken } from './karma-dot-token'
import { BrandLogo } from '@/components/ui/brand-logo'
import { useTheme } from '@/lib/theme'

const TIER_THRESHOLDS = [0, 500, 2000, 5000, 10000]
const TIER_NAMES = ['İyi Biri', 'İyi Yürekli', 'İyilik Elçisi', 'İyilik Savaşçısı', 'İyiliğin Işığı']

function computeTier(karma: number): {
  tierLevel: number
  tierName: string
  nextTierName: string | null
  karmaToNext: number | null
  pct: number
} {
  let tierLevel = 1
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (karma >= TIER_THRESHOLDS[i]) {
      tierLevel = i + 1
      break
    }
  }

  const tierName = TIER_NAMES[tierLevel - 1]
  const isMax = tierLevel >= TIER_THRESHOLDS.length

  if (isMax) {
    return { tierLevel, tierName, nextTierName: null, karmaToNext: null, pct: 100 }
  }

  const currentThreshold = TIER_THRESHOLDS[tierLevel - 1]
  const nextThreshold = TIER_THRESHOLDS[tierLevel]
  const nextTierName = TIER_NAMES[tierLevel]
  const karmaToNext = nextThreshold - karma
  const pct = Math.round(((karma - currentThreshold) / (nextThreshold - currentThreshold)) * 100)

  return { tierLevel, tierName, nextTierName, karmaToNext, pct }
}

interface HeroCardProps {
  profile: {
    karma: number
    completed: number
    streak: number
  }
}

function HeroStat({
  label,
  value,
  sub,
  icon,
}: {
  label: string
  value: string | number
  sub: string
  icon?: React.ReactNode
}) {
  const { colors: c } = useTheme()
  return (
    <div style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: c.ink300,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          marginTop: 5,
        }}
      >
        {icon}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: c.cream,
            letterSpacing: '-0.015em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </div>
      </div>
      <div style={{ fontSize: 10, color: c.ink300, marginTop: 3 }}>{sub}</div>
    </div>
  )
}

export function HeroCard({ profile }: HeroCardProps) {
  const { colors: c } = useTheme()
  const { tierLevel, tierName, nextTierName, karmaToNext, pct } = computeTier(profile.karma)
  const isMax = nextTierName === null

  return (
    <div
      style={{
        background: c.ink800,
        borderRadius: 20,
        padding: '24px 22px 18px',
        border: `1px solid ${c.ink600}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Concentric gold arcs decoration */}
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 240"
        style={{
          position: 'absolute',
          right: -80,
          top: -80,
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      >
        {[110, 80, 50, 20].map((r) => (
          <circle key={r} cx="120" cy="120" r={r} stroke={c.gold} strokeWidth="0.8" fill="none" />
        ))}
      </svg>

      {/* Butterfly — centered */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <BrandLogo tierLevel={tierLevel} />
      </div>

      {/* Tier name */}
      <div
        style={{
          textAlign: 'center',
          fontFamily: "'Fraunces', var(--font-display), ui-serif, Georgia, serif",
          fontStyle: 'italic',
          fontSize: 14,
          color: c.gold,
          marginBottom: 12,
        }}
      >
        {tierName}
      </div>

      {/* Karma value */}
      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <KarmaDotToken size={18} />
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: c.gold,
              letterSpacing: '-0.035em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {profile.karma.toLocaleString('tr-TR')}
          </span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: c.ink300,
            marginTop: 4,
          }}
        >
          Karma
        </div>
      </div>

      {/* Progress section — hidden at max tier */}
      {!isMax && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              height: 6,
              background: 'rgba(255,255,255,.08)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${c.goldDim}, ${c.gold})`,
                borderRadius: 999,
                transition: 'width 220ms cubic-bezier(.2,.8,.2,1)',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontSize: 11,
              marginTop: 8,
              gap: 12,
            }}
          >
            <span
              style={{
                color: c.ink300,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
                flex: '1 1 auto',
              }}
            >
              <span
                style={{
                  fontFamily: "'Fraunces', var(--font-display), ui-serif, Georgia, serif",
                  fontStyle: 'italic',
                  color: c.cream,
                }}
              >
                {nextTierName}
              </span>
              &apos;ye
            </span>
            <span
              style={{
                color: c.gold,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {karmaToNext!.toLocaleString('tr-TR')} kaldı
            </span>
          </div>
        </div>
      )}

      {/* Stat strip — GÖREV + SERİ (2-column, no SIRA) */}
      <div
        style={{
          display: 'flex',
          marginTop: 18,
          paddingTop: 16,
          borderTop: `1px solid ${c.ink600}`,
        }}
      >
        <HeroStat label="GÖREV" value={profile.completed} sub="tamamlandı" />
        <div style={{ width: 1, background: c.ink600 }} />
        <HeroStat
          label="SERİ"
          value={`${profile.streak} gün`}
          sub="kesintisiz"
          icon={<Flame size={11} color={c.gold} />}
        />
      </div>
    </div>
  )
}
