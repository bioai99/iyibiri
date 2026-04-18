'use client'

import React from 'react'
import { Flame } from 'lucide-react'
import { KarmaDotToken } from './karma-dot-token'
import { TierBadgeDS } from './tier-badge-ds'

interface HeroCardProfile {
  karma: number
  completed: number
  streak: number
  tierName: string
  nextTier: string
  karmaToNext: number
}

interface HeroCardProps {
  profile: HeroCardProfile
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
  return (
    <div style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: '#A89E8A',
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
            color: '#F4EEDF',
            letterSpacing: '-0.015em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </div>
      </div>
      <div style={{ fontSize: 10, color: '#A89E8A', marginTop: 3 }}>{sub}</div>
    </div>
  )
}

export function HeroCard({ profile }: HeroCardProps) {
  const p = profile
  const pct = Math.round((p.karma / (p.karma + p.karmaToNext)) * 100)

  return (
    <div
      style={{
        background: '#2E2923',
        borderRadius: 20,
        padding: '22px 22px 18px',
        border: '1px solid #3F3830',
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
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      >
        {[110, 80, 50, 20].map((r) => (
          <circle key={r} cx="120" cy="120" r={r} stroke="#E8C268" strokeWidth="0.8" fill="none" />
        ))}
      </svg>

      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: '#A89E8A',
            }}
          >
            Karma Hesabın
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 6,
              marginTop: 8,
            }}
          >
            <KarmaDotToken size={18} />
            <div
              style={{
                fontWeight: 700,
                fontSize: 56,
                lineHeight: 0.95,
                letterSpacing: '-0.035em',
                color: '#E8C268',
                fontVariantNumeric: 'tabular-nums',
                marginLeft: 4,
              }}
            >
              {p.karma.toLocaleString('tr-TR')}
            </div>
          </div>
        </div>
        <TierBadgeDS tier={p.tierName} />
      </div>

      {/* Progress */}
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontSize: 11,
            marginBottom: 8,
            gap: 12,
          }}
        >
          <span
            style={{
              color: '#A89E8A',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
              flex: '1 1 auto',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
                fontStyle: 'italic',
                color: '#F4EEDF',
              }}
            >
              {p.nextTier}
            </span>
            &apos;ye
          </span>
          <span
            style={{
              color: '#E8C268',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {p.karmaToNext.toLocaleString('tr-TR')} kaldı
          </span>
        </div>
        <div
          style={{
            height: 6,
            background: 'rgba(255,255,255,.05)',
            borderRadius: 999,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #B58F3D, #E8C268)',
              borderRadius: 999,
              transition: 'width 220ms cubic-bezier(.2,.8,.2,1)',
            }}
          />
        </div>
      </div>

      {/* Stat strip */}
      <div
        style={{
          display: 'flex',
          marginTop: 18,
          paddingTop: 16,
          borderTop: '1px solid #3F3830',
        }}
      >
        <HeroStat label="GÖREV" value={p.completed} sub="tamamlandı" />
        <div style={{ width: 1, background: '#3F3830' }} />
        <HeroStat
          label="SERİ"
          value={`${p.streak} gün`}
          sub="kesintisiz"
          icon={<Flame size={11} color="#E8C268" />}
        />
        <div style={{ width: 1, background: '#3F3830' }} />
        <HeroStat label="SIRA" value="#142" sub="bu ay" />
      </div>
    </div>
  )
}
