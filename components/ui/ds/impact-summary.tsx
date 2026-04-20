'use client'

import { useTheme } from '@/lib/theme'

interface ImpactSummaryProps {
  completed: number
  karma: number
}

export function ImpactSummary({ completed, karma }: ImpactSummaryProps) {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(233,207,194,.12), rgba(196,203,172,.08))',
        border: `1px solid ${c.ink600}`,
        borderRadius: 18,
        padding: '22px 22px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Concentric gold arcs decoration */}
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        style={{
          position: 'absolute',
          right: -60,
          top: -60,
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        {[80, 58, 36, 14].map((r) => (
          <circle key={r} cx="90" cy="90" r={r} stroke={c.gold} strokeWidth="0.8" fill="none" />
        ))}
      </svg>

      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '.22em',
        textTransform: 'uppercase', color: c.gold, marginBottom: 8,
      }}>
        Senin etkin
      </div>
      <div style={{
        fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
        fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em',
        color: c.cream, marginTop: 8, lineHeight: 1.2,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <span style={{ color: c.gold }}>{completed}</span> görev ·
        <span style={{ color: c.gold }}> {karma.toLocaleString('tr-TR')}</span> Karma
      </div>
      <div style={{
        fontSize: 13, color: c.ink300, marginTop: 6, maxWidth: 280, lineHeight: 1.5,
      }}>
        Her görev bir fark yaratıyor.
      </div>
    </div>
  )
}
