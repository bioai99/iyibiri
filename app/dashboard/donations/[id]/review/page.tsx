'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { KarmaDotToken } from '@/components/ui/ds/karma-dot-token'
import { IconButtonDS } from '@/components/ui/ds/icon-button-ds'

export default function DonationReviewPage({ params }: { params: { id: string } }) {
  const { colors: c } = useTheme()
  const router = useRouter()
  const [kvkkChecked, setKvkkChecked] = useState(false)

  const summaryRows = [
    { label: 'Kampanya', value: 'Deprem bölgesine kış yardımı' },
    { label: 'Tutar', value: '₺250' },
    { label: 'Ödeme', value: 'Kredi Kartı •••• 4242' },
  ]

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        height: '844px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 16px 20px',
          flexShrink: 0,
        }}
      >
        <IconButtonDS icon={<ArrowLeft size={18} />} onClick={() => router.back()} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: c.gold,
          }}
        >
          BAĞIŞ ÖZETİ
        </span>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 140 }}>
        {/* ── 2. Heading ── */}
        <div style={{ padding: '0 20px 28px' }}>
          <h1
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: '-0.024em',
              lineHeight: 1.15,
              color: c.cream,
              margin: 0,
            }}
          >
            Son bir{' '}
            <em style={{ fontStyle: 'italic', color: c.gold }}>onay</em>
          </h1>
        </div>

        {/* ── 3. Summary card ── */}
        <div style={{ padding: '0 20px 20px' }}>
          <div
            style={{
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {summaryRows.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '16px 18px',
                  borderBottom:
                    i < summaryRows.length - 1 ? `1px solid ${c.ink700}` : 'none',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: c.ink400,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                    paddingTop: 1,
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: c.cream,
                    textAlign: 'right',
                    lineHeight: 1.4,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Karma line ── */}
        <div style={{ padding: '0 20px 24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: c.goldSoft,
              border: `1px solid ${c.goldLine}`,
              borderRadius: 14,
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <KarmaDotToken size={16} />
              <span style={{ fontSize: 14, fontWeight: 600, color: c.ink200 }}>
                Karma ödülün
              </span>
            </div>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: c.gold,
                letterSpacing: '-0.02em',
              }}
            >
              +125
            </span>
          </div>
        </div>

        {/* ── 5. KVKK checkbox ── */}
        <div style={{ padding: '0 20px 24px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            {/* Custom checkbox */}
            <div
              onClick={() => setKvkkChecked(v => !v)}
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: `1.5px solid ${kvkkChecked ? c.gold : c.ink600}`,
                background: kvkkChecked ? c.goldSoft : 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 1,
                transition: 'all 180ms cubic-bezier(.2,.8,.2,1)',
                cursor: 'pointer',
              }}
            >
              {kvkkChecked && (
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                  <path
                    d="M1.5 5L5 8.5L11.5 1.5"
                    stroke={c.gold}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.6,
                color: c.ink400,
              }}
            >
              Kişisel verilerimin işlenmesine ilişkin{' '}
              <span style={{ color: c.gold, textDecoration: 'underline', cursor: 'pointer' }}>
                KVKK Aydınlatma Metni
              </span>
              &apos;ni okudum, bağış işleminin gerçekleştirilmesini onaylıyorum.
            </p>
          </label>
        </div>
      </div>

      {/* ── 6. Sticky CTA ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, rgba(36,32,27,0), rgba(36,32,27,.97) 28%)`,
          backdropFilter: 'blur(12px)',
          padding: '16px 16px 36px',
          flexShrink: 0,
        }}
      >
        <Link
          href={kvkkChecked ? `/dashboard/donations/${params.id}/thanks` : '#'}
          style={{ textDecoration: 'none' }}
        >
          <button
            disabled={!kvkkChecked}
            style={{
              width: '100%',
              background: kvkkChecked ? c.gold : c.ink700,
              color: kvkkChecked ? '#24201B' : c.ink500,
              border: 'none',
              borderRadius: 16,
              padding: '16px 20px',
              fontSize: 16,
              fontWeight: 700,
              cursor: kvkkChecked ? 'pointer' : 'not-allowed',
              letterSpacing: '.01em',
              transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
            }}
          >
            Bağışı onayla · ₺250
          </button>
        </Link>
      </div>
    </div>
  )
}
