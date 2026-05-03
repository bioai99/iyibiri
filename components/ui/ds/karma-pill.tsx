'use client'

import { KarmaDotToken } from './karma-dot-token'
import { useTheme } from '@/lib/theme'

interface KarmaPillProps {
  amount: number
  variant?: 'dark' | 'light'
}

export function KarmaPill({ amount, variant = 'dark' }: KarmaPillProps) {
  const { colors: c } = useTheme()
  const dark = variant === 'dark'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        // Vol-62-C: Atlas grid padding snap (6→8, 10→12, keep 8)
        padding: '8px 12px 8px 8px',
        borderRadius: 999,
        background: dark ? c.goldSoft : 'rgba(232,194,104,.18)',
        border: `1px solid ${dark ? 'rgba(232,194,104,.35)' : 'rgba(181,143,61,.45)'}`,
      }}
    >
      <KarmaDotToken size={12} />
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: dark ? c.gold : '#8A6A2C',
          letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        +{amount}
      </span>
    </span>
  )
}
