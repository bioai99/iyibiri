'use client'

// Vol-31.4 FlowHeader — bağış akışında step indicator + back + ngo isim.

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme'

interface Props {
  step: number
  totalSteps: number
  ngoShortName: string
  title: string
}

export function FlowHeader({ step, totalSteps, ngoShortName, title }: Props) {
  const { colors: c } = useTheme()
  const router = useRouter()

  return (
    <>
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Geri"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: c.cream,
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: c.ink400,
              textTransform: 'uppercase',
            }}
          >
            {ngoShortName} · ADIM {step}/{totalSteps}
          </div>
          <h2
            style={{
              margin: '2px 0 0',
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 18,
              fontWeight: 500,
              color: c.cream,
            }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* Progress segments */}
      <div style={{ padding: '14px 20px 0', display: 'flex', gap: 6 }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: i < step ? 1.2 : 1,
              height: 4,
              borderRadius: 999,
              background: i < step ? c.gold : c.ink600,
              transition: 'all 280ms cubic-bezier(.2,.8,.2,1)',
            }}
            aria-hidden
          />
        ))}
      </div>
    </>
  )
}
