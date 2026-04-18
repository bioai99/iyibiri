'use client'

import React from 'react'

interface IconButtonDSProps {
  icon: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  size?: number
  theme?: 'dark' | 'light'
  style?: React.CSSProperties
}

export function IconButtonDS({ icon, onClick, size = 36, theme = 'dark', style = {} }: IconButtonDSProps) {
  const tokens =
    theme === 'dark'
      ? { bg: 'rgba(26,22,18,.55)', border: 'rgba(244,238,223,.14)', color: '#F4EEDF' }
      : { bg: 'rgba(250,245,233,.95)', border: 'rgba(26,22,18,.08)', color: '#241E18' }

  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: tokens.bg,
        border: `1px solid ${tokens.border}`,
        color: tokens.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
        ...style,
      }}
    >
      {icon}
    </button>
  )
}
