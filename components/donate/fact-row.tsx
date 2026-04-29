'use client'

// Vol-31.3 FactRow — STK şeffaflık satırı (label : value, opsiyonel external link).

import { useTheme } from '@/lib/theme'

interface Props {
  label: string
  value: string
  href?: string
  last?: boolean
}

export function FactRow({ label, value, href, last }: Props) {
  const { colors: c } = useTheme()
  const isLink = Boolean(href)

  const valueNode = (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: isLink ? c.gold : c.cream,
        textDecoration: isLink ? 'underline' : 'none',
        textUnderlineOffset: 3,
      }}
    >
      {value}
      {isLink && ' ↗'}
    </span>
  )

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        paddingBottom: last ? 0 : 12,
        borderBottom: last ? 'none' : `1px solid ${c.ink600}`,
      }}
    >
      <span style={{ fontSize: 11, color: c.ink400 }}>{label}</span>
      {isLink ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          {valueNode}
        </a>
      ) : (
        valueNode
      )}
    </div>
  )
}
