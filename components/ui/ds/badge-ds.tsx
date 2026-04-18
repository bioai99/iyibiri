'use client'

import React from 'react'
import { useTheme } from '@/lib/theme'

interface BadgeDSProps {
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: 'neutral' | 'gold' | 'dark' | 'onImage' | 'onImageLight'
  style?: React.CSSProperties
}

export function BadgeDS({ children, icon, variant = 'neutral', style = {} }: BadgeDSProps) {
  const { colors: c } = useTheme()

  const variantStyles: Record<string, { bg: string; border: string; color: string }> = {
    neutral:      { bg: 'rgba(255,255,255,.04)',   border: c.ink600,                    color: c.ink300 },
    gold:         { bg: c.goldSoft,                border: c.goldLine,                  color: c.gold },
    dark:         { bg: c.ink,                     border: 'transparent',               color: c.cream },
    onImage:      { bg: 'rgba(26,22,18,.55)',       border: 'rgba(244,238,223,.16)',      color: c.cream },
    onImageLight: { bg: 'rgba(250,245,233,.92)',    border: 'rgba(26,22,18,.06)',         color: c.ink900 },
  }

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
