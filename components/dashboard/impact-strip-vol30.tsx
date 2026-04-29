'use client'

// Vol-30.5 ImpactStrip — "2026 İZİN · X görevde, Y kişiye dokundun".
// Sayfa altında topluluk + sen impact özeti. Sağ alt köşede tier 3 kelebek
// (paused, opacity 0.15, -8deg rotate) ambient dekoratif element.

import { useTheme } from '@/lib/theme'
import { TierButterfly } from '@/components/tier/tier-butterfly'

interface Props {
  completed: number
  karma: number
  /** Sıralama yüzdesi (top X%), opsiyonel */
  rankPercent?: number | null
}

export function ImpactStripVol30({ completed, karma, rankPercent }: Props) {
  const { colors: c, mode } = useTheme()
  const isDark = mode === 'dark'
  const year = new Date().getFullYear()

  return (
    <section style={{ padding: '24px 16px 32px' }}>
      <div
        style={{
          borderRadius: 22,
          padding: '24px 22px',
          background: isDark
            ? `linear-gradient(135deg, ${c.ink800} 0%, ${c.ink700} 100%)`
            : `linear-gradient(135deg, ${c.ink700} 0%, ${c.ink800} 100%)`,
          border: `1px solid ${c.ink600}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -20,
            bottom: -30,
            opacity: 0.15,
            pointerEvents: 'none',
            transform: 'rotate(-8deg)',
          }}
          aria-hidden
        >
          <TierButterfly tier={3} size={140} paused />
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: c.sage,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {year} İZİN
        </div>

        <h3
          style={{
            margin: 0,
            fontFamily: "'Fraunces', ui-serif, Georgia, serif",
            fontSize: 22,
            fontWeight: 500,
            color: c.cream,
            letterSpacing: '-0.02em',
            maxWidth: 240,
            lineHeight: 1.3,
          }}
        >
          <em style={{ fontStyle: 'italic' }}>{completed.toLocaleString('tr-TR')}</em> görevde,
          <br />
          <em style={{ fontStyle: 'italic' }}>{karma.toLocaleString('tr-TR')}</em> kişiye dokundun.
        </h3>

        <div
          style={{
            marginTop: 14,
            display: 'flex',
            gap: 16,
            fontSize: 11,
            color: c.ink300,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span aria-hidden>📈</span> Yıllık trend ↗
          </span>
          {typeof rankPercent === 'number' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span aria-hidden>🏆</span> Sıralamada %{rankPercent}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
