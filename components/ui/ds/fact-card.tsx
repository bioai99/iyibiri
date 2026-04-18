'use client'

import React from 'react'

interface FactCardProps {
  label: string
  value: string
  icon: React.ReactNode
  urgent?: boolean
}

export function FactCard({ label, value, icon, urgent }: FactCardProps) {
  return (
    <div
      style={{
        background: '#2E2923',
        border: `1px solid ${urgent ? 'rgba(232,194,104,.32)' : '#3F3830'}`,
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
            color: '#A89E8A',
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: urgent ? '#E8C268' : '#F4EEDF',
          letterSpacing: '-0.015em',
        }}
      >
        {value}
      </div>
    </div>
  )
}
