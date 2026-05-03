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
  // Vol-59.1: theme prop "glass tone"u temsil eder, app mode'una bağımlı
  // değildir. Önceden theme="dark" iken color: c.cream kullanılıyordu — bu
  // light mode'da (c.cream = koyu metin tokenı) butonun içeriğini invisible
  // hale getiriyordu (örn. campaign detail hero scrim üstündeki geri/paylaş).
  // Şimdi color hardcoded — semantic doğru: dark glass = light icon.
  useTheme() // hook usage placeholder for future-mode-aware extensions
  const tokens =
    theme === 'dark'
      ? { bg: 'rgba(26,22,18,.55)', border: 'rgba(244,238,223,.14)', color: '#F4EEDF' }
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
