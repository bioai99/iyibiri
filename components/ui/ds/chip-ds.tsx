'use client'

import React from 'react'
import { useTheme } from '@/lib/theme'

interface ChipDSProps {
  active?: boolean
  children: React.ReactNode
  icon?: React.ReactNode
  onClick?: () => void
  theme?: 'dark' | 'light'
}

export function ChipDS({ active, children, icon, onClick, theme = 'dark' }: ChipDSProps) {
  const { colors: c } = useTheme()
  const tokens =
    theme === 'dark'
      ? {
          bg:     active ? c.goldSoft : 'transparent',
          border: active ? c.gold : c.ink600,
          color:  active ? c.gold : c.ink500,  // K7 fix: ink-600 → ink-500 (4.5:1 AA kontrast)
        }
      : {
          bg:     active ? c.ink900 : 'transparent',
          border: active ? c.ink900 : c.ink200,
          color:  active ? c.cream : c.ink500,
        }

  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        // Vol-62-C: Atlas grid padding snap (9→8, 14→16)
        padding: '8px 16px',
        borderRadius: 999,
        border: `1px solid ${tokens.border}`,
        background: tokens.bg,
        color: tokens.color,
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        cursor: 'pointer',
        // K5: Smooth transition for active/inactive state (200ms cubic-bezier)
        transition: 'all 200ms cubic-bezier(0.22, 1, 0.36, 1)',
        whiteSpace: 'nowrap',
      }}
    >
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      {children}
    </button>
  )
}
