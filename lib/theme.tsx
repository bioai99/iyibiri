'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

export type Mode = 'dark' | 'light'

export interface SemanticColors {
  ink: string
  ink900: string
  ink800: string
  ink700: string
  ink600: string
  ink500: string
  ink400: string
  ink300: string
  ink200: string
  ink100: string
  cream: string
  gold: string
  goldDim: string
  goldSoft: string
  goldLine: string
  clay: string
  claySoft: string
  blush: string
  sage: string
  wheat: string
  success: string
  warning: string
  danger: string
}

const DARK: SemanticColors = {
  ink: '#1A1612',
  ink900: '#24201B',
  ink800: '#2E2923',
  ink700: '#36302A',
  ink600: '#3F3830',
  ink500: '#574E42',
  ink400: '#7A6F5E',
  ink300: '#A89E8A',
  ink200: '#CEC5B2',
  ink100: '#E6DEC9',
  cream: '#F4EEDF',
  gold: '#E8C268',
  goldDim: '#B58F3D',
  goldSoft: 'rgba(232,194,104,0.12)',
  goldLine: 'rgba(232,194,104,0.32)',
  clay: '#C8553D',
  claySoft: 'rgba(200,85,61,0.12)',
  blush: '#E9CFC2',
  sage: '#C4CBAC',
  wheat: '#EADDB8',
  success: '#6B8E4E',
  warning: '#D19B3C',
  danger: '#B84E3B',
}

const LIGHT: SemanticColors = {
  ink: '#241E18',
  ink900: '#FAF5E9',
  ink800: '#F5EEDD',
  ink700: '#EBE3CE',
  ink600: '#D9CFB4',
  ink500: '#B8AD92',
  ink400: '#9E9580',
  ink300: '#7A6F5E',
  ink200: '#3E3830',
  ink100: '#241E18',
  cream: '#241E18',
  gold: '#B58F3D',
  goldDim: '#B58F3D',
  goldSoft: 'rgba(181,143,61,0.14)',
  goldLine: 'rgba(181,143,61,0.42)',
  clay: '#C8553D',
  claySoft: 'rgba(200,85,61,0.12)',
  blush: '#E9CFC2',
  sage: '#C4CBAC',
  wheat: '#EADDB8',
  success: '#6B8E4E',
  warning: '#D19B3C',
  danger: '#B84E3B',
}

interface ThemeContextType {
  mode: Mode
  colors: SemanticColors
  setMode: (m: Mode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children, initial = 'dark' }: { children: React.ReactNode; initial?: Mode }) {
  const [mode, setModeState] = useState<Mode>(initial)

  useEffect(() => {
    const saved = localStorage.getItem('iyibiri-theme') as Mode | null
    if (saved === 'light' || saved === 'dark') setModeState(saved)
  }, [])

  const setMode = useCallback((m: Mode) => {
    setModeState(m)
    localStorage.setItem('iyibiri-theme', m)
  }, [])

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }, [mode, setMode])

  const value = useMemo(() => ({
    mode,
    colors: mode === 'dark' ? DARK : LIGHT,
    setMode,
    toggleMode,
  }), [mode, setMode, toggleMode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    // Fallback for components outside ThemeProvider (e.g., landing pages)
    return { mode: 'dark' as Mode, colors: DARK, setMode: () => {}, toggleMode: () => {} }
  }
  return ctx
}

// Export palettes for direct use where needed
export { DARK, LIGHT }
