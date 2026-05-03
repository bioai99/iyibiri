'use client'

import { useTheme } from '@/lib/theme'

interface TierBadgeDSProps {
  tier: string
}

export function TierBadgeDS({ tier }: TierBadgeDSProps) {
  const { colors: c } = useTheme()
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        // Vol-62-C: Atlas grid padding snap (5→4, 10→12)
        padding: '4px 12px 4px 8px',
        borderRadius: 999,
        background: c.goldSoft,
        border: `1px solid ${c.goldLine}`,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 12 12">
        <path d="M6 1l1.5 3L11 4.5l-2.5 2L9 10 6 8.3 3 10l.5-3.5L1 4.5 4.5 4z" fill={c.gold} />
      </svg>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: c.gold,
          letterSpacing: '.02em',
        }}
      >
        {tier}
      </span>
    </span>
  )
}
