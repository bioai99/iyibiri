'use client'

// Vol-30.3 SectionHeader — dashboard rail başlıkları için ortak primitive.
//   - Eyebrow (kaps lock + gold + tracking 0.22em)
//   - Title (Fraunces 22, weight 500)
//   - Sağda opsiyonel "right" slot (TÜMÜ → linki vs.)

import type { ReactNode } from 'react'
import { useTheme } from '@/lib/theme'

interface Props {
  eyebrow?: string
  title: string
  right?: ReactNode
}

export function SectionHeaderVol30({ eyebrow, title, right }: Props) {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        padding: '0 20px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 12,
      }}
    >
      <div style={{ minWidth: 0 }}>
        {eyebrow && (
          <p
            style={{
              margin: '0 0 3px',
              fontSize: 10,
              fontWeight: 700,
              color: c.gold,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </p>
        )}
        <h2
          style={{
            margin: 0,
            fontFamily: "'Fraunces', ui-serif, Georgia, serif",
            fontSize: 22,
            fontWeight: 500,
            color: c.cream,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h2>
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  )
}
