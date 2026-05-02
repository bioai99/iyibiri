'use client'

// components/ui/state/page-loading.tsx
//
// Page-level loading skeleton templates.
// Next.js 14 loading.tsx için shared building block'lar.
// **Tema-aware**: dark'ta dark skeleton, light'ta light skeleton.
// useTheme() hook ile dinamik renk — INK900/800/700 dark tonları veya LIGHT paleti.

import { useTheme } from '@/lib/theme'

/** Shimmer style helper — useTheme colors'ı alıp gradient üretir. */
function useShimmerStyle(): React.CSSProperties {
  const { colors: c } = useTheme()
  return {
    background: c.ink800,
    animation: 'shimmer 2s ease-in-out infinite',
    backgroundImage: `linear-gradient(90deg, ${c.ink800} 0%, ${c.ink700} 50%, ${c.ink800} 100%)`,
    backgroundSize: '200% 100%',
  }
}

/** Tek blok shimmer — kart, kutu, bar için. */
export function SkeletonBlock({
  width = '100%',
  height = 20,
  radius = 12,
  style = {},
}: {
  width?: number | string
  height?: number | string
  radius?: number
  style?: React.CSSProperties
}) {
  const shimmer = useShimmerStyle()
  return (
    <div
      style={{
        ...shimmer,
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  )
}

/** Liste sayfaları için template (missions list, rewards list, ngos list vs.). */
export function ListPageLoading({
  title = 'Yükleniyor…',
  itemCount = 5,
  itemHeight = 120,
}: {
  title?: string
  itemCount?: number
  itemHeight?: number
}) {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        minHeight: '100vh',
        background: c.ink900,
        paddingBottom: 100,
      }}
      aria-busy="true"
      aria-label={title}
    >
      {/* Header */}
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top, 20px) + 20px) 20px 16px',
        }}
      >
        <SkeletonBlock height={28} width="50%" />
        <div style={{ height: 12 }} />
        <SkeletonBlock height={14} width="75%" radius={8} />
      </div>

      {/* Filter chips (optional) */}
      <div style={{ padding: '16px 20px', display: 'flex', gap: 8 }}>
        {[1, 2, 3].map((i) => (
          <SkeletonBlock key={i} height={32} width={80} radius={999} />
        ))}
      </div>

      {/* List items */}
      <div
        style={{
          padding: '8px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {Array.from({ length: itemCount }).map((_, i) => (
          <SkeletonBlock key={i} height={itemHeight} radius={16} />
        ))}
      </div>
    </div>
  )
}

/** Detail sayfası için template (NGO profil, mission detay, reward detay). */
export function DetailPageLoading({
  title = 'Yükleniyor…',
}: {
  title?: string
}) {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        minHeight: '100vh',
        background: c.ink900,
        paddingBottom: 100,
      }}
      aria-busy="true"
      aria-label={title}
    >
      {/* Hero photo */}
      <div style={{ aspectRatio: '4/3', width: '100%' }}>
        <SkeletonBlock height="100%" radius={0} />
      </div>

      {/* Content blocks */}
      <div
        style={{
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <SkeletonBlock height={28} width="80%" />
        <SkeletonBlock height={14} width="60%" radius={8} />

        {/* 2x2 facts */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginTop: 8,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} height={80} radius={14} />
          ))}
        </div>

        {/* Body */}
        <SkeletonBlock height={100} radius={16} />
        <SkeletonBlock height={60} radius={16} />
      </div>
    </div>
  )
}

/** Profil sayfası için template. */
export function ProfilePageLoading() {
  const { colors: c } = useTheme()
  return (
    <div
      style={{ minHeight: '100vh', background: c.ink900, paddingBottom: 100 }}
      aria-busy="true"
      aria-label="Profil yükleniyor"
    >
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 20px) 20px' }}>
        {/* Avatar + isim */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <SkeletonBlock width={88} height={88} radius={999} />
          <SkeletonBlock width="50%" height={22} />
          <SkeletonBlock width="35%" height={14} radius={8} />
        </div>

        {/* Karma + rozet satırı */}
        <div
          style={{
            marginTop: 24,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
          }}
        >
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} height={80} radius={14} />
          ))}
        </div>

        {/* Section'lar */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} height={90} radius={16} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Grid/gallery sayfası için (rewards, saved). */
export function GridPageLoading({
  itemCount = 6,
}: { itemCount?: number }) {
  const { colors: c } = useTheme()
  return (
    <div
      style={{ minHeight: '100vh', background: c.ink900, paddingBottom: 100 }}
      aria-busy="true"
    >
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 20px) 20px 0' }}>
        <SkeletonBlock height={28} width="50%" />
        <div style={{ height: 8 }} />
        <SkeletonBlock height={14} width="70%" radius={8} />
      </div>

      {/* 2-column grid */}
      <div
        style={{
          padding: '20px 16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {Array.from({ length: itemCount }).map((_, i) => (
          <SkeletonBlock key={i} height={180} radius={16} />
        ))}
      </div>
    </div>
  )
}
