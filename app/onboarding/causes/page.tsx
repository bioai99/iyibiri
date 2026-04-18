'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'

const causes = [
  { name: 'Çevre', sub: 'Ağaç, deniz, iklim' },
  { name: 'Eğitim', sub: 'Çocuk, kitap, mentör' },
  { name: 'Hayvanlar', sub: 'Barınak, sokak, yaban' },
  { name: 'Sağlık', sub: 'Kan bağışı, yaşlı, bakım' },
  { name: 'Afet', sub: 'Deprem, yangın, yardım' },
  { name: 'Topluluk', sub: 'Yerel, kültür, sanat' },
]

export default function OnboardingCauses() {
  const { colors: c } = useTheme()
  const [selected, setSelected] = useState<string[]>(['Çevre', 'Hayvanlar'])

  function toggle(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  const ctaLabel =
    selected.length > 0 ? `${selected.length} alan seçildi — Devam` : 'Devam'

  return (
    <div
      style={{
        height: '844px',
        display: 'flex',
        flexDirection: 'column',
        background: c.ink900,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '58px 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Link href="/onboarding/welcome" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>

        {/* Progress bar: 4 segments, 2 filled */}
        <div style={{ display: 'flex', flex: 1, gap: 4 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 999,
                background: i < 2 ? c.gold : c.ink600,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 24px 0' }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: c.gold,
            margin: '0 0 10px',
          }}
        >
          ADIM 2 / 4
        </p>

        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: c.cream,
            margin: '0 0 10px',
            lineHeight: 1.15,
          }}
        >
          {'Hangi konular '}
          <em style={{ fontStyle: 'italic' }}>seni çekiyor?</em>
        </h1>

        <p
          style={{
            fontSize: 14,
            color: c.ink300,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Senin için görev önerelim. İstediğin kadar seç.
        </p>
      </div>

      {/* Causes grid */}
      <div
        style={{
          padding: '24px 16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          flex: 1,
          overflowY: 'auto',
          alignContent: 'start',
        }}
      >
        {causes.map((cause) => {
          const isSelected = selected.includes(cause.name)
          return (
            <button
              key={cause.name}
              onClick={() => toggle(cause.name)}
              style={{
                position: 'relative',
                textAlign: 'left',
                cursor: 'pointer',
                background: isSelected ? c.goldSoft : c.ink800,
                border: `1.5px solid ${isSelected ? c.gold : c.ink600}`,
                borderRadius: 14,
                padding: '14px 12px',
                transition: 'all 180ms ease',
              }}
            >
              {/* Checkmark circle */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: c.gold,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={13} color="#241E18" strokeWidth={2.5} />
                </div>
              )}

              <p
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontStyle: 'italic',
                  fontSize: 17,
                  fontWeight: 500,
                  color: isSelected ? c.gold : c.cream,
                  margin: '0 0 4px',
                  paddingRight: isSelected ? 28 : 0,
                  lineHeight: 1.2,
                }}
              >
                {cause.name}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: c.ink300,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {cause.sub}
              </p>
            </button>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '0 16px 40px' }}>
        <Link href="/onboarding/location" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              background: c.gold,
              color: '#241E18',
              border: 'none',
              borderRadius: 999,
              padding: '14px 20px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {ctaLabel}
          </button>
        </Link>
      </div>
    </div>
  )
}
