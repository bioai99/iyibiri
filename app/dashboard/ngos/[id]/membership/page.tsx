'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Info, Leaf } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'
import { KarmaDotToken } from '@/components/ui/ds'

const EYEBROW: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
}

const plans = [
  {
    k: 'temel',
    name: 'Fidan',
    tl: 30,
    karmaPm: 50,
    desc: 'Her ay 1 fidan dikilir',
    colorKey: 'wheat' as const,
    hot: false,
  },
  {
    k: 'orta',
    name: 'Koruyucu',
    tl: 75,
    karmaPm: 120,
    desc: 'Aylık gönüllü ağı erişimi + 3 fidan',
    colorKey: 'gold' as const,
    hot: true,
  },
  {
    k: 'ust',
    name: 'Elçi',
    tl: 150,
    karmaPm: 250,
    desc: 'Özel etkinlik daveti + 6 fidan',
    colorKey: 'blush' as const,
    hot: false,
  },
]

export default function MembershipPlansPage() {
  const { colors: c } = useTheme()
  const router = useRouter()
  const [selected, setSelected] = useState('orta')

  const sel = plans.find((p) => p.k === selected) ?? plans[1]

  const planColor = (colorKey: 'wheat' | 'gold' | 'blush') => {
    if (colorKey === 'wheat') return c.wheat
    if (colorKey === 'gold') return c.gold
    return c.blush
  }

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        height: '844px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <IconButtonDS
          icon={<ArrowLeft size={16} />}
          onClick={() => router.back()}
        />
        <div style={{ flex: 1 }}>
          <div style={{ ...EYEBROW, color: c.gold }}>TEMA VAKFI · ÜYELİK</div>
        </div>
        <IconButtonDS icon={<Info size={16} />} />
      </div>

      {/* Hero */}
      <div style={{ padding: '24px 20px 0' }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-fraunces, Georgia, serif)',
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: c.cream,
            lineHeight: 1.1,
          }}
        >
          <span style={{ fontStyle: 'italic' }}>Aylık</span> destek planı seç
        </h1>
        <p style={{ margin: '10px 0 0', fontSize: 14, color: c.ink300, lineHeight: 1.55 }}>
          Her planın her ay otomatik Karma ödülü var. İstediğin zaman iptal edebilirsin.
        </p>
      </div>

      {/* Plans */}
      <div
        style={{
          padding: '20px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: '1 1 auto',
          minHeight: 0,
          overflowY: 'auto',
        }}
      >
        {plans.map((p) => {
          const active = p.k === selected
          const color = planColor(p.colorKey)
          return (
            <button
              key={p.k}
              onClick={() => setSelected(p.k)}
              style={{
                background: active ? c.goldSoft : c.ink800,
                border: `1.5px solid ${active ? c.gold : c.ink600}`,
                borderRadius: 16,
                padding: '16px 18px',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all .2s',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              {p.hot && (
                <span
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: 14,
                    background: c.gold,
                    color: '#241E18',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '.14em',
                    padding: '3px 8px',
                    borderRadius: 999,
                    textTransform: 'uppercase',
                  }}
                >
                  Popüler
                </span>
              )}
              {/* Icon square */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `${color}22`,
                  border: `1px solid ${color}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Leaf size={20} color={color} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-fraunces, Georgia, serif)',
                    fontSize: 17,
                    fontWeight: 500,
                    color: c.cream,
                    letterSpacing: '-0.015em',
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: c.ink300,
                    marginTop: 2,
                    lineHeight: 1.4,
                  }}
                >
                  {p.desc}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  <KarmaDotToken size={10} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: c.gold,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    +{p.karmaPm} Karma / ay
                  </span>
                </div>
              </div>

              {/* Price */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: c.cream,
                    letterSpacing: '-0.02em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  ₺{p.tl}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: c.ink300,
                    marginTop: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '.1em',
                  }}
                >
                  / AY
                </div>
              </div>
            </button>
          )
        })}

        <p
          style={{
            margin: '6px 4px 0',
            fontSize: 11,
            color: c.ink400,
            lineHeight: 1.5,
          }}
        >
          Üyelik bedelinin %100&apos;ü TEMA Vakfı&apos;na aktarılır. İyiBiri komisyon almaz.
        </p>
      </div>

      {/* Sticky CTA */}
      <div
        style={{
          padding: '14px 16px 24px',
          borderTop: `1px solid ${c.ink700}`,
          background: c.ink900,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 12, color: c.ink300 }}>{sel.name} planı seçildi</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: c.cream, fontVariantNumeric: 'tabular-nums' }}>
            ₺{sel.tl}{' '}
            <span style={{ color: c.ink300, fontWeight: 400 }}>/ay</span>
          </span>
        </div>
        <Link
          href="membership/success"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            width: '100%',
            background: c.gold,
            border: 'none',
            color: '#241E18',
            padding: '14px 20px',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'none',
            boxSizing: 'border-box',
          }}
        >
          Üye ol · ₺{sel.tl}/ay →
        </Link>
      </div>
    </div>
  )
}
