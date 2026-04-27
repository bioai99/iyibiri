'use client'

// Vol-30.3 MissionTabs — pill toggle + count badge.
// Senin için (recommended) / Katıldıkların (active) iki sekme.
// Sticky top: scroll edince listenin üstünde kalır.

import Link from 'next/link'
import { useTheme } from '@/lib/theme'

export type MissionTabKey = 'recommended' | 'active'

interface Props {
  active: MissionTabKey
  onChange: (k: MissionTabKey) => void
  counts: { recommended: number; active: number }
  /** Opsiyonel "TÜMÜ →" linki sağda */
  allHref?: string
}

const TABS: Array<{ key: MissionTabKey; label: string }> = [
  { key: 'recommended', label: 'Senin için' },
  { key: 'active', label: 'Katıldıkların' },
]

export function MissionTabsVol30({
  active,
  onChange,
  counts,
  allHref = '/dashboard/missions',
}: Props) {
  const { colors: c, mode } = useTheme()
  const isDark = mode === 'dark'

  return (
    <div
      style={{
        padding: '32px 20px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: isDark
          ? `linear-gradient(180deg, ${c.ink900} 80%, transparent)`
          : `linear-gradient(180deg, ${c.ink900} 80%, transparent)`,
      }}
    >
      {TABS.map((t) => {
        const isActive = active === t.key
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            aria-pressed={isActive}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: isActive ? c.cream : 'transparent',
              color: isActive ? c.ink900 : c.ink300,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 200ms ease, color 200ms ease',
            }}
          >
            {t.label}
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 999,
                background: isActive ? c.ink900 : c.ink800,
                color: isActive ? c.cream : c.ink300,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {counts[t.key]}
            </span>
          </button>
        )
      })}
      <Link
        href={allHref}
        style={{
          marginLeft: 'auto',
          fontSize: 11,
          fontWeight: 700,
          color: c.gold,
          letterSpacing: '0.06em',
          textDecoration: 'none',
        }}
      >
        TÜMÜ →
      </Link>
    </div>
  )
}
