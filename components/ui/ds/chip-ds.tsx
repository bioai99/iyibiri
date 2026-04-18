'use client'

import React from 'react'

interface ChipDSProps {
  active?: boolean
  children: React.ReactNode
  icon?: React.ReactNode
  onClick?: () => void
  theme?: 'dark' | 'light'
}

export function ChipDS({ active, children, icon, onClick, theme = 'dark' }: ChipDSProps) {
  const tokens =
    theme === 'dark'
      ? {
          bg:     active ? 'rgba(232,194,104,.12)' : 'transparent',
          border: active ? '#E8C268' : '#3F3830',
          color:  active ? '#E8C268' : '#A89E8A',
        }
      : {
          bg:     active ? '#24201B' : 'transparent',
          border: active ? '#24201B' : '#CEC5B2',
          color:  active ? '#F4EEDF' : '#574E42',
        }

  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '9px 14px',
        borderRadius: 999,
        border: `1px solid ${tokens.border}`,
        background: tokens.bg,
        color: tokens.color,
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        cursor: 'pointer',
        transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
        whiteSpace: 'nowrap',
      }}
    >
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      {children}
    </button>
  )
}
