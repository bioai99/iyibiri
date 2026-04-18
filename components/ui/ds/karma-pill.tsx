'use client'

import { KarmaDotToken } from './karma-dot-token'

interface KarmaPillProps {
  amount: number
  variant?: 'dark' | 'light'
}

export function KarmaPill({ amount, variant = 'dark' }: KarmaPillProps) {
  const dark = variant === 'dark'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 10px 6px 8px',
        borderRadius: 999,
        background: dark ? 'rgba(232,194,104,.12)' : 'rgba(232,194,104,.18)',
        border: `1px solid ${dark ? 'rgba(232,194,104,.35)' : 'rgba(181,143,61,.45)'}`,
      }}
    >
      <KarmaDotToken size={12} />
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: dark ? '#E8C268' : '#8A6A2C',
          letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        +{amount}
      </span>
    </span>
  )
}
