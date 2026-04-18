'use client'

interface TierBadgeDSProps {
  tier: string
}

export function TierBadgeDS({ tier }: TierBadgeDSProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        padding: '5px 10px 5px 8px',
        borderRadius: 999,
        background: 'rgba(232,194,104,.12)',
        border: '1px solid rgba(232,194,104,.32)',
      }}
    >
      <svg width="10" height="10" viewBox="0 0 12 12">
        <path d="M6 1l1.5 3L11 4.5l-2.5 2L9 10 6 8.3 3 10l.5-3.5L1 4.5 4.5 4z" fill="#E8C268" />
      </svg>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#E8C268',
          letterSpacing: '.02em',
        }}
      >
        {tier}
      </span>
    </span>
  )
}
