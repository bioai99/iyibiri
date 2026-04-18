'use client'

import React from 'react'
import { useTheme } from '@/lib/theme'

interface QuickActionProps {
  icon: React.ReactNode
  title: string
  sub: string
}

export function QuickAction({ icon, title, sub }: QuickActionProps) {
  const { colors: c } = useTheme()
  return (
    <button
      style={{
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
        borderRadius: 14,
        padding: '14px 14px 12px',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
        width: '100%',
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          flexShrink: 0,
          background: c.goldSoft,
          border: `1px solid ${c.goldLine}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: c.cream,
            letterSpacing: '-0.015em',
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 11, color: c.ink300, marginTop: 3, lineHeight: 1.35 }}>
          {sub}
        </div>
      </div>
    </button>
  )
}
