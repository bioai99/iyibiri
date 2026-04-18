'use client'

import React from 'react'

interface BadgeDSProps {
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: 'neutral' | 'gold' | 'dark' | 'onImage' | 'onImageLight'
  style?: React.CSSProperties
}

const variantStyles: Record<string, { bg: string; border: string; color: string }> = {
  neutral:      { bg: 'rgba(255,255,255,.04)',   border: '#3F3830',                    color: '#A89E8A' },
  gold:         { bg: 'rgba(232,194,104,.12)',   border: 'rgba(232,194,104,.32)',       color: '#E8C268' },
  dark:         { bg: '#1A1612',                 border: 'transparent',                color: '#F4EEDF' },
  onImage:      { bg: 'rgba(26,22,18,.55)',       border: 'rgba(244,238,223,.16)',       color: '#F4EEDF' },
  onImageLight: { bg: 'rgba(250,245,233,.92)',   border: 'rgba(26,22,18,.06)',          color: '#24201B' },
}

export function BadgeDS({ children, icon, variant = 'neutral', style = {} }: BadgeDSProps) {
  const v = variantStyles[variant]
  const isOnImage = variant === 'onImage' || variant === 'onImageLight'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '5px 10px',
        borderRadius: 999,
        background: v.bg,
        border: `1px solid ${v.border}`,
        color: v.color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '.04em',
        backdropFilter: isOnImage ? 'blur(10px)' : undefined,
        ...style,
      }}
    >
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      {children}
    </span>
  )
}
