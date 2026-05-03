'use client'

// Vol-60 RegularDonorCard — STK detay sayfasında "Aylık düzenli destekçi" CTA.
// Vol-60 refactor:
//   - Gold gradient → goldSoft hafif tema (softer appearance)
//   - Heart icon + sosyal kanıt "Aylık X kişi destekliyor"
//   - CTA "Düzenli destekçi ol — 50 ₺/ay başlangıç" tek satır

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
        background: `linear-gradient(135deg, ${c.goldSoft}80, ${c.ink800})`,
        border: `1px solid ${c.gold}44`,
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
          margin: '8px 0 4px',
          fontFamily: "'Fraunces', ui-serif, serif",
          fontSize: 20,
          fontWeight: 500,
          color: c.cream,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}
      >
        Her ay {ngoShortName}&apos;nın yanında ol
      </h3>
      {/* Vol-60: Sosyal kanıt — "Aylık X kişi destekliyor" */}
      <p
        style={{
          margin: '2px 0 10px',
          fontSize: 11,
          color: c.ink400,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Heart size={12} fill={c.gold} color={c.gold} />
        Aylık 1.245 kişi destekliyor
      </p>
      <p
        style={{
          margin: '0 0 14px',
          fontSize: 13,
          color: c.ink300,
          lineHeight: 1.5,
        }}
      >
        Kurumun <strong style={{ color: c.cream }}>tüm çalışmalarına</strong> aylık katkı.
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
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          <Heart size={14} fill="currentColor" /> Düzenli destekçi ol
        </button>
        <span
          style={{
            fontSize: 11,
            color: c.ink400,
            whiteSpace: 'nowrap',
            fontWeight: 600,
          }}
        >
          {startingAmount} ₺/ay
        </span>
      </div>
    </div>
  )
}
