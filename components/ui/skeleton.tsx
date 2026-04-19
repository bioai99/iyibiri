'use client'
import { useTheme } from '@/lib/theme'

export function Skeleton({ width, height, radius = 12, style = {} }: {
  width?: number | string, height?: number | string, radius?: number, style?: React.CSSProperties
}) {
  const { colors: c } = useTheme()
  return (
    <div style={{
      width: width ?? '100%', height: height ?? 20, borderRadius: radius,
      background: `linear-gradient(90deg, ${c.ink700} 25%, ${c.ink600} 50%, ${c.ink700} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s ease-in-out infinite',
      ...style,
    }} />
  )
}

export function SkeletonCard() {
  const { colors: c } = useTheme()
  return (
    <div style={{
      background: c.ink800, border: `1px solid ${c.ink600}`,
      borderRadius: 16, overflow: 'hidden',
    }}>
      <Skeleton height={140} radius={0} />
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton height={16} width="70%" />
        <Skeleton height={12} width="40%" />
      </div>
    </div>
  )
}
