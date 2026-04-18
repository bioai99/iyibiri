'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { KarmaToken } from '@/components/ui/ds'

export default function OnboardingWelcome() {
  const { colors: c } = useTheme()

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
      {/* Top section */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 380,
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(232,194,104,.25), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(196,203,172,.15), transparent 60%)',
        }}
      >
        {/* Main KarmaToken */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'drop-shadow(0 12px 32px rgba(232,194,104,.35)) drop-shadow(0 4px 12px rgba(0,0,0,.4))',
          }}
        >
          <KarmaToken size={140} />
        </div>

        {/* Decorative small tokens */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '14%',
            opacity: 0.22,
          }}
        >
          <KarmaToken size={34} />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '55%',
            right: '10%',
            opacity: 0.14,
          }}
        >
          <KarmaToken size={26} />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '22%',
            opacity: 0.18,
          }}
        >
          <KarmaToken size={30} />
        </div>
      </div>

      {/* Bottom section */}
      <div style={{ padding: '40px 28px 48px' }}>
        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 38,
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: c.cream,
            margin: 0,
            whiteSpace: 'pre-line',
          }}
        >
          <em style={{ color: c.gold, fontStyle: 'italic' }}>İyi biri</em>
          {' olmak\nhesap ister.'}
        </h1>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.55,
            color: c.ink200,
            maxWidth: 320,
            marginTop: 16,
            marginBottom: 0,
          }}
        >
          Gönüllü ol, kazandığın Karma&apos;yı anlamlı ödüllere dönüştür. Başlamak 30 saniye.
        </p>

        {/* Buttons */}
        <div
          style={{
            marginTop: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <Link href="/onboarding/causes" style={{ textDecoration: 'none' }}>
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              Başlayalım
              <ArrowRight size={18} />
            </button>
          </Link>

          <Link href="/auth/login" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                background: 'transparent',
                color: c.cream,
                border: `1px solid ${c.ink600}`,
                borderRadius: 999,
                padding: '14px 20px',
                fontSize: 15,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Zaten üyeyim
            </button>
          </Link>
        </div>

        {/* Progress dots */}
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {/* Active dot */}
          <div
            style={{
              width: 18,
              height: 6,
              borderRadius: 999,
              background: c.gold,
            }}
          />
          {/* Inactive dots */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: c.ink600,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
