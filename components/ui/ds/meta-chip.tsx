'use client'

import React from 'react'

interface MetaChipProps {
  icon?: React.ReactNode
  children: React.ReactNode
}

export function MetaChip({ icon, children }: MetaChipProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 500,
        color: '#CEC5B2',
        background: 'rgba(255,255,255,.03)',
        padding: '5px 9px',
        borderRadius: 999,
        border: '1px solid #3F3830',
        letterSpacing: '0',
      }}
    >
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      {children}
    </span>
  )
}
