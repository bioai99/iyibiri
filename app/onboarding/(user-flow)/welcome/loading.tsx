'use client'

// Vol-62-A: Welcome loading skeleton
// Theme-aware minimal skeleton with shimmer animation (cream bg for onboarding)

import { useTheme } from '@/lib/theme'

export default function WelcomeLoading() {
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
          height: 60,
          background: c.ink100,
          borderRadius: 14,
          animation: 'shimmer 2s ease-in-out infinite',
          backgroundImage: `linear-gradient(90deg, ${c.ink100} 0%, ${c.ink200} 50%, ${c.ink100} 100%)`,
          backgroundSize: '200% 100%',
        }}
      />

      {/* Content skeleton */}
      <div
        style={{
          height: 200,
          background: c.ink100,
          borderRadius: 14,
          animation: 'shimmer 2s ease-in-out infinite',
          backgroundImage: `linear-gradient(90deg, ${c.ink100} 0%, ${c.ink200} 50%, ${c.ink100} 100%)`,
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  )
}
