'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/theme'

export function ThemeToggle({ size = 36 }: { size?: number }) {
  const { mode, toggleMode, colors: c } = useTheme()
  return (
    <button
      onClick={toggleMode}
      aria-label={mode === 'dark' ? 'Light mode' : 'Dark mode'}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        border: `1px solid ${c.ink600}`,
        color: c.gold,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
      }}
    >
      {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
