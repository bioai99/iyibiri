'use client'

import React from 'react'
import { Flame, CheckCircle2 } from 'lucide-react'
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
  const cur = TIER_THRESHOLDS[tierLevel - 1]
  const next = TIER_THRESHOLDS[tierLevel]
  return {
    tierLevel, tierName,
    nextTierName: TIER_NAMES[tierLevel],
    karmaToNext: next - karma,
    pct: Math.round(((karma - cur) / (next - cur)) * 100),
  }
}

interface HeroCardProps {
  profile: { karma: number; completed: number; streak: number }
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
        border: `1px solid ${c.ink600}`,
        position: 'relative',
        overflow: 'hidden',
        padding: '20px 20px 16px',
      }}
    >
      {/* ── Top row: Tier name left, Butterfly right ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        {/* Left column: all info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tier badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: c.goldSoft,
            border: `1px solid ${c.goldLine}`,
            borderRadius: 999,
            padding: '4px 10px 4px 8px',
            marginBottom: 14,
          }}>
            <svg width="10" height="10" viewBox="0 0 12 12">
              <path d="M6 1l1.5 3L11 4.5l-2.5 2L9 10 6 8.3 3 10l.5-3.5L1 4.5 4.5 4z" fill={c.gold} />
            </svg>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: c.gold,
              letterSpacing: '0.02em',
            }}>
              {tierName}
            </span>
          </div>

          {/* Karma number */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
            <KarmaDotToken size={14} />
            <span style={{
              fontSize: 44,
              fontWeight: 700,
              color: c.cream,
              letterSpacing: '-0.035em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 0.95,
            }}>
              {profile.karma.toLocaleString('tr-TR')}
            </span>
          </div>
          <div style={{ fontSize: 13, color: c.ink300, marginBottom: 16 }}>
            Karma
          </div>

          {/* Progress */}
          {!isMax && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: 11,
                marginBottom: 6,
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
                <span style={{ color: c.gold, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
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
                  width: `${Math.max(pct, 3)}%`,
                  background: `linear-gradient(90deg, ${c.goldDim}, ${c.gold})`,
                  borderRadius: 999,
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Right: Butterfly — the star */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          marginTop: -8,
          marginRight: -8,
          marginBottom: -8,
        }}>
          <BrandLogo tierLevel={tierLevel} />
        </div>
      </div>

      {/* ── Bottom stats row ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginTop: 14,
        paddingTop: 14,
        borderTop: `1px solid ${c.ink600}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <CheckCircle2 size={13} color={c.gold} />
          <span style={{ fontSize: 13, fontWeight: 700, color: c.cream, fontVariantNumeric: 'tabular-nums' }}>
            {profile.completed}
          </span>
          <span style={{ fontSize: 11, color: c.ink300 }}>görev</span>
        </div>
        <div style={{ width: 1, height: 14, background: c.ink600 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Flame size={13} color={c.gold} />
          <span style={{ fontSize: 13, fontWeight: 700, color: c.cream, fontVariantNumeric: 'tabular-nums' }}>
            {profile.streak} gün
          </span>
          <span style={{ fontSize: 11, color: c.ink300 }}>seri</span>
        </div>
      </div>
    </div>
  )
}
