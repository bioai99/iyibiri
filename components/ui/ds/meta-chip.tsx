'use client'

import React from 'react'
import { useTheme } from '@/lib/theme'

interface MetaChipProps {
  icon?: React.ReactNode
  children: React.ReactNode
}

export function MetaChip({ icon, children }: MetaChipProps) {
  const { colors: c } = useTheme()
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 500,
        color: c.ink200,
        background: 'rgba(255,255,255,.03)',
        // Vol-62-C: Atlas grid padding snap (5→4, 9→8)
        padding: '4px 8px',
        borderRadius: 999,
        border: `1px solid ${c.ink600}`,
        letterSpacing: '0',
      }}
    >
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      {children}
    </span>
  )
}
