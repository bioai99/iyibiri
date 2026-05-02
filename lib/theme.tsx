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
  // 3-katman semantic surface ladder (light mode) — delta artırıldı (~%5 lightness)
  ink900: '#EFE6D2',        // page background — daha sıcak/koyu (warm), 3-katman delta başlangıcı
  ink800: '#F8F2E2',        // surface (kart, sheet) — orta katman, daha gözle ayırt edilebilir
  ink700: '#FFFCF4',        // surface elevated (featured kart, modal) — neredeyse beyaz, "yükselmiş" hissi
  ink600: '#D9C9A4',        // hairline border — daha belirgin warm tan, sınır gözle görünür
  ink500: '#C9A24A',        // saturated accent (progress fill, active states)
  // Vol-37 P7: WCAG AA contrast bump (light mode)
  // Önceki: #9E9580 (~2.8:1 on ink900) / #7A6F5E (~3.7:1 on ink900) — small text AA fail
  // Şimdi:  #6B6253 (~4.5:1) / #524A3F (~5.5:1) — small text AA passing
  ink400: '#6B6253',        // muted text alt — kontrast bump (önce #9E9580)
  ink300: '#524A3F',        // muted text — kontrast bump (önce #7A6F5E)
  ink200: '#3E3830',        // body text alt
  ink100: '#241E18',        // body text
  cream: '#241E18',         // primary text (light mode'da koyu metin)
  gold: '#B58F3D',          // brand gold — light mode için doygun bronz
  goldDim: '#9A7A33',
  goldSoft: 'rgba(181,143,61,0.10)',
  goldLine: 'rgba(181,143,61,0.42)',
  clay: '#C8553D',
  claySoft: 'rgba(200,85,61,0.10)',
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

/**
 * BUG-022/024 fix (Vol-12): SSR + client hydration mode mismatch.
 *
 * Problem: useState lazy init runs ONLY during SSR (server has typeof window === undefined,
 * returns `initial`). On client hydration, useState reuses the SSR-baked state
 * — `getInitialMode` is NEVER called client-side. So inner pages (profile, mission detail)
 * render with dark colors baked into inline styles even when localStorage says 'light'.
 *
 * Fix: Always start with `initial` on both server + first client render (hydration-safe),
 * then in useEffect read localStorage and force update if stored value differs.
 * Causes a single re-render after hydration with the correct theme.
 */
export function ThemeProvider({ children, initial = 'dark' }: { children: React.ReactNode; initial?: Mode }) {
  const [mode, setModeState] = useState<Mode>(initial)

  // Hydrate from localStorage after mount (one-time, post-hydration)
  useEffect(() => {
    const stored = localStorage.getItem('iyibiri-theme') as Mode | null
    if ((stored === 'light' || stored === 'dark') && stored !== mode) {
      setModeState(stored)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Persist on every change
    localStorage.setItem('iyibiri-theme', mode)
  }, [mode])

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

/**
 * Mode-aware shadow preset — light: warm + deep, dark: standard
 * Used for card surfaces to enhance visual hierarchy and depth
 */
export function getCardShadow(mode: Mode, depth: 'sm' | 'md' | 'lg' = 'md'): string {
  if (mode === 'light') {
    const presets = {
      sm: '0 1px 4px rgba(80,60,20,0.10), 0 1px 2px rgba(80,60,20,0.06)',
      md: '0 4px 14px rgba(80,60,20,0.12), 0 2px 4px rgba(80,60,20,0.08)',
      lg: '0 12px 30px rgba(80,60,20,0.16), 0 4px 8px rgba(80,60,20,0.10)',
    }
    return presets[depth]
  }
  // dark mode (unchanged)
  const presets = {
    sm: '0 1px 4px rgba(0,0,0,0.10)',
    md: '0 2px 8px rgba(0,0,0,0.18)',
    lg: '0 8px 24px rgba(0,0,0,0.30)',
  }
  return presets[depth]
}
