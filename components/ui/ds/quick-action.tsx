'use client'

import React from 'react'

interface QuickActionProps {
  icon: React.ReactNode
  title: string
  sub: string
}

export function QuickAction({ icon, title, sub }: QuickActionProps) {
  return (
    <button
      style={{
        background: '#2E2923',
        border: '1px solid #3F3830',
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
          background: 'rgba(232,194,104,.12)',
          border: '1px solid rgba(232,194,104,.32)',
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
            color: '#F4EEDF',
            letterSpacing: '-0.015em',
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 11, color: '#A89E8A', marginTop: 3, lineHeight: 1.35 }}>
          {sub}
        </div>
      </div>
    </button>
  )
}
