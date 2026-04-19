'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { KarmaDotToken } from '@/components/ui/ds/karma-dot-token'
import { IconButtonDS } from '@/components/ui/ds/icon-button-ds'

const QUICK_AMOUNTS = [100, 250, 500, 1000]

export default function DonationAmountPage({ params }: { params: { id: string } }) {
  const { colors: c } = useTheme()
  const router = useRouter()
  const [amount, setAmount] = useState(250)
  const [custom, setCustom] = useState('')

  const karmaReward = Math.floor(amount / 10) * 5

  function handleQuick(val: number) {
    setAmount(val)
    setCustom('')
  }

  function handleCustomChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setCustom(raw)
    if (raw) setAmount(Number(raw))
  }

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
          KIZILAY · KIŞ YARDIMI
        </span>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 120 }}>
        {/* ── 2. Heading ── */}
        <div style={{ padding: '0 20px 28px' }}>
          <h1
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: '-0.024em',
              lineHeight: 1.15,
              color: c.cream,
              margin: 0,
            }}
          >
            Ne kadar bağışlamak istersin?
          </h1>
        </div>

        {/* ── 3. Big amount display ── */}
        <div
          style={{
            padding: '0 20px 24px',
            display: 'flex',
            alignItems: 'baseline',
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 28,
              fontWeight: 500,
              color: c.ink300,
              lineHeight: 1,
            }}
          >
            ₺
          </span>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: c.gold,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {amount.toLocaleString('tr-TR')}
          </span>
        </div>

        {/* ── 4. Karma preview pill ── */}
        <div style={{ padding: '0 20px 24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: c.goldSoft,
              border: `1px solid ${c.goldLine}`,
              borderRadius: 999,
              padding: '8px 14px',
            }}
          >
            <KarmaDotToken size={14} />
            <span style={{ fontSize: 13, fontWeight: 600, color: c.gold }}>
              +{karmaReward} Karma kazanacaksın
            </span>
          </div>
        </div>

        {/* ── 5. Quick amounts 2-column grid ── */}
        <div
          style={{
            padding: '0 20px 20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          {QUICK_AMOUNTS.map(val => {
            const isActive = !custom && amount === val
            return (
              <button
                key={val}
                onClick={() => handleQuick(val)}
                style={{
                  background: isActive ? c.goldSoft : c.ink800,
                  border: `1px solid ${isActive ? c.gold : c.ink600}`,
                  borderRadius: 14,
                  padding: '16px 12px',
                  fontSize: 18,
                  fontWeight: 700,
                  color: isActive ? c.gold : c.ink200,
                  cursor: 'pointer',
                  transition: 'all 180ms cubic-bezier(.2,.8,.2,1)',
                  letterSpacing: '-0.01em',
                }}
              >
                ₺{val.toLocaleString('tr-TR')}
              </button>
            )
          })}
        </div>

        {/* ── 6. Custom input ── */}
        <div style={{ padding: '0 20px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: c.ink800,
              border: `1px solid ${custom ? c.gold : c.ink600}`,
              borderRadius: 14,
              overflow: 'hidden',
              transition: 'border-color 180ms',
            }}
          >
            <span
              style={{
                padding: '0 0 0 18px',
                fontSize: 18,
                fontWeight: 700,
                color: custom ? c.gold : c.ink400,
                flexShrink: 0,
              }}
            >
              ₺
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Diğer tutar"
              value={custom}
              onChange={handleCustomChange}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '16px 18px',
                fontSize: 18,
                fontWeight: 700,
                color: c.gold,
                letterSpacing: '-0.01em',
                fontVariantNumeric: 'tabular-nums',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── 7. Sticky CTA ── */}
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
          href={`/dashboard/donations/${params.id}/review`}
          style={{ textDecoration: 'none' }}
        >
          <button
            style={{
              width: '100%',
              background: c.gold,
              color: '#24201B',
              border: 'none',
              borderRadius: 16,
              padding: '16px 20px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '.01em',
              marginBottom: 8,
            }}
          >
            Devam et · ₺{amount.toLocaleString('tr-TR')}
          </button>
        </Link>
        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontSize: 12,
            color: c.ink400,
            letterSpacing: '.02em',
          }}
        >
          Tutarın %100&apos;ü Kızılay&apos;a aktarılır · Komisyon yok
        </p>
      </div>
    </div>
  )
}
