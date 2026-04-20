'use client'

import React from 'react'
import Link from 'next/link'
import { Flame, CheckCircle2, ChevronRight } from 'lucide-react'
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
  return { tierLevel, tierName: TIER_NAMES[tierLevel - 1] }
}

interface HeroCardProps {
  profile: { karma: number; completed: number; streak: number }
}

export function HeroCard({ profile }: HeroCardProps) {
  const { colors: c } = useTheme()
  const { tierLevel, tierName } = computeTier(profile.karma)

  return (
    <div
      style={{
        background: c.ink800,
        borderRadius: 20,
        border: `1px solid ${c.ink600}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Main content: karma left, butterfly right ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px 12px 20px 22px',
        gap: 8,
      }}>
        {/* Left: Karma */}
        <div style={{ flex: 1, minWidth: 0 }}>
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
          <div style={{ fontSize: 13, color: c.ink300 }}>
            Karma
          </div>
        </div>

        {/* Right: Butterfly + tier name + dots — tappable */}
        <Link href="/dashboard/tiers" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}>
            <BrandLogo tierLevel={tierLevel} />

            {/* Tier name */}
            <div style={{
              fontFamily: "'Fraunces', var(--font-display), ui-serif, Georgia, serif",
              fontStyle: 'italic',
              fontSize: 13,
              fontWeight: 500,
              color: c.gold,
              marginTop: -6,
              letterSpacing: '-0.01em',
            }}>
              {tierName}
            </div>

            {/* 5 tier dots */}
            <div style={{
              display: 'flex',
              gap: 5,
              marginTop: 6,
            }}>
              {[1, 2, 3, 4, 5].map(t => (
                <div
                  key={t}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: t <= tierLevel ? c.gold : c.ink600,
                    transition: 'background 300ms',
                  }}
                />
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* ── Bottom stats — tappable ── */}
      <div style={{
        display: 'flex',
        borderTop: `1px solid ${c.ink600}`,
      }}>
        {/* Completed missions → /dashboard/my-missions */}
        <Link href="/dashboard/my-missions" style={{
          flex: 1,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          padding: '13px 12px',
          transition: 'opacity 150ms',
        }}>
          <CheckCircle2 size={14} color={c.gold} />
          <span style={{ fontSize: 14, fontWeight: 700, color: c.cream, fontVariantNumeric: 'tabular-nums' }}>
            {profile.completed}
          </span>
          <span style={{ fontSize: 12, color: c.ink300 }}>görev</span>
          <ChevronRight size={12} color={c.ink400} style={{ marginLeft: 2 }} />
        </Link>

        <div style={{ width: 1, background: c.ink600 }} />

        {/* Streak → /dashboard/streak */}
        <Link href="/dashboard/streak" style={{
          flex: 1,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          padding: '13px 12px',
          transition: 'opacity 150ms',
        }}>
          <Flame size={14} color={c.gold} />
          <span style={{ fontSize: 14, fontWeight: 700, color: c.cream, fontVariantNumeric: 'tabular-nums' }}>
            {profile.streak} gün
          </span>
          <span style={{ fontSize: 12, color: c.ink300 }}>seri</span>
          <ChevronRight size={12} color={c.ink400} style={{ marginLeft: 2 }} />
        </Link>
      </div>
    </div>
  )
}
