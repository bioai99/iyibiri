'use client'

// Vol-62-A: Forgot-password loading skeleton
// Theme-aware minimal skeleton with shimmer animation

import { useTheme } from '@/lib/theme'

export default function ForgotPasswordLoading() {
  const { colors: c } = useTheme()

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: c.cream,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header skeleton */}
      <div
        style={{
          height: 48,
          background: c.ink100,
          borderRadius: 12,
          animation: 'shimmer 2s ease-in-out infinite',
          backgroundImage: `linear-gradient(90deg, ${c.ink100} 0%, ${c.ink200} 50%, ${c.ink100} 100%)`,
          backgroundSize: '200% 100%',
        }}
      />

      {/* Content skeleton */}
      <div
        style={{
          height: 250,
          background: c.ink100,
          borderRadius: 12,
          animation: 'shimmer 2s ease-in-out infinite',
          backgroundImage: `linear-gradient(90deg, ${c.ink100} 0%, ${c.ink200} 50%, ${c.ink100} 100%)`,
          backgroundSize: '200% 100%',
          marginTop: 24,
        }}
      />
    </div>
  )
}
