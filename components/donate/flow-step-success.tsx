'use client'

// Vol-31.4 Step 3 — Success ekranı.
// TierButterfly + "X ₺ Y'a aktı" + "+N karma kazandın" + tier-up mesajı (varsa).
// Aksiyonlar: Ana sayfaya dön, paylaş (mock), tekrar.

import Link from 'next/link'
import { useTheme } from '@/lib/theme'
import { TierButterfly } from '@/components/tier/tier-butterfly'
import { TIER_DATA } from '@/components/tier/tier-data'

interface Props {
  ngoShortName: string
  amountTry: number
  karmaAwarded: number
  tierAfter: number
  didTierUp: boolean
}

export function FlowStepSuccess({
  ngoShortName,
  amountTry,
  karmaAwarded,
  tierAfter,
  didTierUp,
}: Props) {
  const { colors: c } = useTheme()
  const tier = TIER_DATA[tierAfter - 1] ?? TIER_DATA[0]

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: c.ink900,
        color: c.cream,
        paddingBottom: 120,
      }}
    >
      {/* Top: status badge */}
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: c.success ?? '#5DC395',
            marginBottom: 6,
          }}
        >
          ✓ TAMAMLANDI
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          padding: '12px 24px 0',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'relative',
            height: 160,
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden
        >
          <TierButterfly tier={tier.id} size={160} />
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: c.gold,
          }}
        >
          +{karmaAwarded} KARMA KAZANDIN
        </p>

        <h1
          style={{
            margin: '14px 0 8px',
            fontFamily: "'Fraunces', ui-serif, serif",
            fontSize: 28,
            fontWeight: 500,
            color: c.cream,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {amountTry.toLocaleString('tr-TR')} ₺{' '}
          <em style={{ fontStyle: 'italic', color: c.gold }}>
            {ngoShortName}
          </em>
          &apos;a aktı
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: c.ink300,
            lineHeight: 1.5,
            fontStyle: 'italic',
            fontFamily: "'Fraunces', serif",
          }}
        >
          Makbuzun e-posta ile gelecek. Kuruşu kesmedik.
        </p>
      </div>

      {/* Tier-up mesajı */}
      {didTierUp && (
        <div style={{ padding: '24px 16px 0' }}>
          <div
            style={{
              padding: '16px 18px',
              borderRadius: 18,
              background: `linear-gradient(135deg, ${tier.palette.glow}, ${c.ink800})`,
              border: `1px solid ${c.gold}55`,
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
              YENİ SEVİYE
            </p>
            <h3
              style={{
                margin: '6px 0 4px',
                fontFamily: "'Fraunces', ui-serif, serif",
                fontSize: 22,
                fontWeight: 500,
                fontStyle: 'italic',
                color: c.cream,
                letterSpacing: '-0.02em',
              }}
            >
              {tier.name}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: c.ink300,
                lineHeight: 1.5,
              }}
            >
              {tier.desc}
            </p>
          </div>
        </div>
      )}

      {/* Aksiyonlar */}
      <div style={{ padding: '32px 16px 0' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            disabled
            title="Yakında"
            style={{
              flex: 1,
              padding: '13px',
              background: c.ink800,
              color: c.ink400,
              border: `1px solid ${c.ink600}`,
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'not-allowed',
              fontFamily: 'inherit',
              opacity: 0.7,
            }}
          >
            ↗ Paylaş
          </button>
          <button
            type="button"
            disabled
            title="Yakında"
            style={{
              flex: 1,
              padding: '13px',
              background: c.ink800,
              color: c.ink400,
              border: `1px solid ${c.ink600}`,
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'not-allowed',
              fontFamily: 'inherit',
              opacity: 0.7,
            }}
          >
            📄 Makbuz
          </button>
        </div>
        <Link
          href="/dashboard"
          style={{
            display: 'block',
            marginTop: 12,
            width: '100%',
            padding: '14px',
            background: c.gold,
            color: c.ink900,
            border: 'none',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: `0 8px 24px ${c.gold}40`,
          }}
        >
          Ana sayfaya dön →
        </Link>
        <Link
          href="/dashboard/donate"
          style={{
            display: 'block',
            marginTop: 8,
            width: '100%',
            padding: '14px',
            background: 'transparent',
            color: c.gold,
            border: 'none',
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            textAlign: 'center',
            textDecoration: 'none',
          }}
        >
          Başka bir kuruma da bağışla
        </Link>
      </div>
    </div>
  )
}
