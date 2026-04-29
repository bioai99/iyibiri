'use client'

// Vol-31.3 RegularDonorCard — STK detay sayfasında "Aylık düzenli destekçi" CTA.
// Gold linear-gradient kart + Heart ikon + "X ₺'den başlar" satırı.

import { Heart } from 'lucide-react'
import { useTheme } from '@/lib/theme'

interface Props {
  ngoShortName: string
  startingAmount?: number
  onClick?: () => void
}

export function RegularDonorCard({
  ngoShortName,
  startingAmount = 50,
  onClick,
}: Props) {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 18,
        background: `linear-gradient(135deg, ${c.gold}28, ${c.ink800})`,
        border: `1px solid ${c.gold}55`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.22em',
          color: c.gold,
          textTransform: 'uppercase',
        }}
      >
        DÜZENLİ DESTEKÇİ
      </p>
      <h3
        style={{
          margin: '8px 0 6px',
          fontFamily: "'Fraunces', ui-serif, serif",
          fontSize: 22,
          fontWeight: 500,
          color: c.cream,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}
      >
        Her ay {ngoShortName}&apos;nın yanında ol
      </h3>
      <p
        style={{
          margin: '0 0 14px',
          fontSize: 13,
          color: c.ink300,
          lineHeight: 1.5,
        }}
      >
        Tek bir kampanya değil, kurumun{' '}
        <strong style={{ color: c.cream }}>tüm çalışmalarına</strong> aylık katkı.
        İstediğin an iptal — taahhüt yok.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          type="button"
          onClick={onClick}
          style={{
            flex: 1,
            padding: '13px',
            background: c.gold,
            color: c.ink900,
            border: 'none',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Heart size={14} fill="currentColor" /> Düzenli destekçi ol
        </button>
        <span
          style={{
            fontSize: 11,
            color: c.ink400,
            whiteSpace: 'nowrap',
          }}
        >
          {startingAmount} ₺&apos;den başlar
        </span>
      </div>
    </div>
  )
}
