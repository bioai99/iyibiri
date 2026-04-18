'use client'

import React from 'react'
import { useTheme } from '@/lib/theme'

interface FactCardProps {
  label: string
  value: string
  icon: React.ReactNode
  urgent?: boolean
}

export function FactCard({ label, value, icon, urgent }: FactCardProps) {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        background: c.ink800,
        border: `1px solid ${urgent ? c.goldLine : c.ink600}`,
        borderRadius: 14,
        padding: '14px 14px 12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {icon}
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: c.ink300,
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: urgent ? c.gold : c.cream,
          letterSpacing: '-0.015em',
        }}
      >
        {value}
      </div>
    </div>
  )
}
