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
        background: `linear-gradient(155deg, ${c.ink800} 0%, ${c.ink900} 100%)`,
        borderRadius: 24,
        border: `1px solid ${c.ink600}`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        minHeight: 200,
      }}
    >
      {/* Decorative arcs — very subtle background texture */}
      <svg
        width="300" height="300" viewBox="0 0 300 300"
        style={{ position: 'absolute', right: -60, top: -60, opacity: 0.06, pointerEvents: 'none' }}
      >
        {[140, 110, 80, 50].map(r => (
          <circle key={r} cx="150" cy="150" r={r} stroke={c.gold} strokeWidth="0.5" fill="none" />
        ))}
      </svg>

      {/* ── Left: Information hierarchy ── */}
      <div style={{
        flex: 1,
        padding: '24px 0 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        minWidth: 0,
      }}>
        {/* Tier name — gold eyebrow */}
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: c.gold,
          marginBottom: 8,
        }}>
          {tierName}
        </div>

        {/* Karma number — THE primary metric, large and prominent */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 2,
        }}>
          <KarmaDotToken size={14} />
          <span style={{
            fontSize: 38,
            fontWeight: 700,
            color: c.cream,
            letterSpacing: '-0.03em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}>
            {profile.karma.toLocaleString('tr-TR')}
          </span>
        </div>
        <div style={{
          fontSize: 13,
          color: c.ink300,
          marginBottom: 16,
        }}>
          karma
        </div>

        {/* Progress bar — compact, under the number */}
        {!isMax && (
          <div style={{ maxWidth: '85%' }}>
            <div style={{
              height: 4,
              background: 'rgba(255,255,255,.1)',
              borderRadius: 999,
              overflow: 'hidden',
              marginBottom: 6,
            }}>
              <div style={{
                height: '100%',
                width: `${Math.max(pct, 3)}%`,
                background: `linear-gradient(90deg, ${c.goldDim}, ${c.gold})`,
                borderRadius: 999,
                transition: 'width 400ms cubic-bezier(.2,.8,.2,1)',
              }} />
            </div>
            <div style={{ fontSize: 11, color: c.ink300 }}>
              <span style={{
                fontFamily: "'Fraunces', var(--font-display), ui-serif, Georgia, serif",
                fontStyle: 'italic',
                color: c.cream,
              }}>
                {nextTierName}
              </span>
              &apos;ye{' '}
              <span style={{ color: c.gold, fontWeight: 600 }}>
                {karmaToNext!.toLocaleString('tr-TR')}
              </span>
              {' '}kaldı
            </div>
          </div>
        )}

        {/* Stats row — compact, at the bottom */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginTop: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Flame size={13} color={c.gold} />
            <span style={{ fontSize: 13, fontWeight: 700, color: c.cream, fontVariantNumeric: 'tabular-nums' }}>
              {profile.streak}
            </span>
            <span style={{ fontSize: 11, color: c.ink300 }}>gün seri</span>
          </div>
          <div style={{ width: 1, height: 14, background: c.ink600 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={13} color={c.gold} />
            <span style={{ fontSize: 13, fontWeight: 700, color: c.cream, fontVariantNumeric: 'tabular-nums' }}>
              {profile.completed}
            </span>
            <span style={{ fontSize: 11, color: c.ink300 }}>görev</span>
          </div>
        </div>
      </div>

      {/* ── Right: Butterfly hero — the STAR of the card ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: -16,
        marginTop: -12,
        marginBottom: -12,
        flexShrink: 0,
        position: 'relative',
      }}>
        <BrandLogo tierLevel={tierLevel} />
      </div>
    </div>
  )
}
