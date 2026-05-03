'use client'

// Vol-59 Campaign detail loading skeleton — minimal hero + progress placeholder.

import { useTheme } from '@/lib/theme'

export default function CampaignDetailLoading() {
  const { colors: c } = useTheme()
  return (
    <div style={{ minHeight: '100dvh', background: c.ink900 }}>
      <div
        style={{
          height: 360,
          background: `linear-gradient(135deg, ${c.ink800}, ${c.ink700})`,
          animation: 'shimmer 2s ease-in-out infinite',
        }}
      />
      <div style={{ padding: '20px 16px 0' }}>
        <div
          style={{
            height: 70,
            background: c.ink800,
            borderRadius: 14,
            animation: 'shimmer 2s ease-in-out infinite',
            marginBottom: 14,
          }}
        />
        <div
          style={{
            height: 180,
            background: c.ink800,
            borderRadius: 18,
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  )
}
