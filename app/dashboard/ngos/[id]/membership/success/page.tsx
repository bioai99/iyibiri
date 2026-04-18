'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { useTheme } from '@/lib/theme'

const EYEBROW: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
}

// Hardcoded TEMA data for this demo screen
const TEMA = {
  name: 'TEMA Vakfı',
  logoUrl: '/tema-logo.png',
  profilePath: '/dashboard/ngos/tema',
}

export default function MembershipSuccessPage() {
  const { colors: c } = useTheme()
  const router = useRouter()

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
      {/* Hero */}
      <div
        style={{
          flex: '1 1 auto',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 28px 0',
        }}
      >
        {/* Concentric rings */}
        <svg
          width="440"
          height="440"
          viewBox="0 0 440 440"
          style={{
            position: 'absolute',
            top: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.12,
            pointerEvents: 'none',
          }}
        >
          {[200, 160, 120, 80, 40].map((r) => (
            <circle
              key={r}
              cx="220"
              cy="220"
              r={r}
              stroke={c.gold}
              strokeWidth=".8"
              fill="none"
            />
          ))}
        </svg>

        {/* NGO logo medallion */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          {/* Glow */}
          <div
            style={{
              position: 'absolute',
              inset: -20,
              background: 'radial-gradient(circle, rgba(232,194,104,.4),transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
          {/* Gold ring */}
          <div
            style={{
              position: 'relative',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#F4D98A,#B58F3D)',
              padding: 8,
              boxShadow: '0 16px 40px rgba(0,0,0,.4), inset 0 2px 0 rgba(255,255,255,.3)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 14,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={TEMA.logoUrl}
                alt={TEMA.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
          {/* Sage checkmark badge */}
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: c.sage,
              border: `3px solid ${c.ink900}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={20} color="#241E18" />
          </div>
        </div>

        {/* Text */}
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ ...EYEBROW, color: c.gold, marginBottom: 10 }}>ÜYELİĞİN BAŞLADI</div>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-fraunces, Georgia, serif)',
              fontSize: 34,
              fontWeight: 500,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              color: c.cream,
            }}
          >
            TEMA ailesine{' '}
            <span style={{ fontStyle: 'italic' }}>hoş geldin,</span>
            <br />
            <span style={{ color: c.gold, fontStyle: 'italic' }}>Ayşe</span>.
          </h1>
          <p
            style={{
              margin: '16px auto 0',
              fontSize: 14,
              color: c.ink200,
              lineHeight: 1.55,
              maxWidth: 300,
            }}
          >
            Koruyucu planına katıldın. Her ay ₺75 otomatik, her ay +120 Karma.
          </p>
        </div>
      </div>

      {/* Karma bonus card */}
      <div style={{ padding: '0 20px 20px' }}>
        <div
          style={{
            background: c.ink800,
            border: `1px solid ${c.goldLine}`,
            borderRadius: 16,
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          {/* Gold "i" circle */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#F4D98A,#B58F3D)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.3)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-fraunces, Georgia, serif)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 22,
                color: '#3E2F14',
              }}
            >
              i
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ ...EYEBROW, color: c.ink300 }}>HOŞ GELDİN BONUSU</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: c.gold,
                  letterSpacing: '-0.025em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                +300
              </span>
              <span style={{ fontSize: 13, color: c.cream }}>Karma</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: c.ink300 }}>Yeni bakiye</div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: c.cream,
                marginTop: 2,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              2.640
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link
          href={TEMA.profilePath}
          style={{
            display: 'block',
            background: c.gold,
            border: 'none',
            color: '#241E18',
            padding: '14px 20px',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            textAlign: 'center',
            textDecoration: 'none',
          }}
        >
          TEMA profilime git →
        </Link>
        <Link
          href="/dashboard"
          style={{
            display: 'block',
            background: 'transparent',
            border: `1px solid ${c.ink600}`,
            color: c.cream,
            padding: '12px 20px',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'center',
            textDecoration: 'none',
          }}
        >
          Ana sayfa
        </Link>
      </div>
    </div>
  )
}
