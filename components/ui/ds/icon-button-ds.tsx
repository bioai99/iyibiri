'use client'

import React from 'react'
import { useTheme } from '@/lib/theme'

interface IconButtonDSProps {
  icon: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  size?: number
  theme?: 'dark' | 'light'
  style?: React.CSSProperties
  /** Vol-37 P6: a11y — ekran okuyucu için icon-only button etiketi (TR) */
  ariaLabel?: string
  /** Form submission davranışı — default 'button' (icon-only nav typically not submit) */
  type?: 'button' | 'submit' | 'reset'
}

export function IconButtonDS({
  icon,
  onClick,
  size = 36,
  theme = 'dark',
  style = {},
  ariaLabel,
  type = 'button',
}: IconButtonDSProps) {
  const { colors: c } = useTheme()
  const tokens =
    theme === 'dark'
      ? { bg: 'rgba(26,22,18,.55)', border: 'rgba(244,238,223,.14)', color: c.cream }
      : { bg: 'rgba(250,245,233,.95)', border: 'rgba(26,22,18,.08)', color: '#241E18' }

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
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
