'use client'

import { Toaster as SonnerToaster } from 'sonner'
import { useTheme } from '@/lib/theme'

export function Toaster() {
  const { mode, colors: c } = useTheme()

  return (
    <SonnerToaster
      theme={mode === 'dark' ? 'dark' : 'light'}
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: c.ink800,
          border: `1px solid ${c.ink700}`,
          color: c.cream,
          borderRadius: 12,
        },
      }}
    />
  )
}
