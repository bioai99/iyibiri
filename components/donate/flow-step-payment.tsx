'use client'

// Vol-31.4 Step 2 — Mock ödeme + KVKK + makbuz toggle.
//
// V1 mock: gerçek kart bilgisi alınmaz, sadece "İYZICO ile korumalı" ve
// "iyibiri kart bilgini görmez" mesajları gösterilir. Submit → server action.

import { useState, useTransition } from 'react'
import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { useTheme } from '@/lib/theme'

interface SummaryProps {
  amountTry: number
  isMonthly: boolean
  intentLabelText: string
}

interface Props extends SummaryProps {
  ngoShortName: string
  taxExempt: boolean
  onSubmit: (input: {
    wantTaxReceipt: boolean
    receiptEmail: string | null
  }) => Promise<{ ok: boolean; error?: string }>
}

export function FlowStepPayment({
  ngoShortName,
  taxExempt,
  amountTry,
  isMonthly,
  intentLabelText,
  onSubmit,
}: Props) {
  const { colors: c } = useTheme()
  const [pending, startTransition] = useTransition()
  const [wantReceipt, setWantReceipt] = useState(taxExempt)
  const [tcInput, setTcInput] = useState('')
  const [kvkk1, setKvkk1] = useState(true)
  const [kvkk2, setKvkk2] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitDisabled = !kvkk1 || pending

  const handleSubmit = () => {
    setError(null)
    startTransition(async () => {
      const res = await onSubmit({
        wantTaxReceipt: wantReceipt && taxExempt,
        receiptEmail: null,
      })
      if (!res.ok) setError(res.error ?? 'Bir şeyler ters gitti.')
    })
  }

  return (
    <div style={{ paddingBottom: 220 }}>
      {/* Summary */}
      <div style={{ padding: '24px 16px 0' }}>
        <div
          style={{
            padding: 16,
            borderRadius: 16,
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
          }}
        >
          <SummaryRow label="Bağış" value={`${amountTry} ₺ · ${isMonthly ? 'aylık' : 'tek seferlik'}`} c={c} />
          {intentLabelText && (
            <SummaryRow label="Niyet" value={intentLabelText} c={c} />
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 10,
              borderTop: `1px solid ${c.ink600}`,
            }}
          >
            <span style={{ fontSize: 12, color: c.ink400 }}>STK alacak</span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: c.gold,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {amountTry} ₺
            </span>
          </div>
        </div>
      </div>

      {/* Tax receipt toggle */}
      {taxExempt && (
        <div style={{ padding: '20px 16px 0' }}>
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.cream }}>
                  Vergi makbuzu istiyorum
                </div>
                <div style={{ fontSize: 11, color: c.ink400, marginTop: 3 }}>
                  Yıl sonu vergi indirimi için kullanılabilir
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWantReceipt(!wantReceipt)}
                aria-label={wantReceipt ? 'Makbuz kapat' : 'Makbuz aç'}
                style={{
                  flexShrink: 0,
                  width: 38,
                  height: 22,
                  borderRadius: 999,
                  background: wantReceipt ? c.gold : c.ink600,
                  position: 'relative',
                  cursor: 'pointer',
                  border: 'none',
                  padding: 0,
                  transition: 'background 200ms',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: wantReceipt ? 18 : 2,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: wantReceipt ? c.ink900 : c.cream,
                    transition: 'left 200ms',
                  }}
                />
              </button>
            </div>
            {wantReceipt && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: `1px solid ${c.ink600}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <input
                  placeholder="TC Kimlik No"
                  value={tcInput}
                  onChange={(e) =>
                    setTcInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))
                  }
                  inputMode="numeric"
                  style={{
                    padding: '11px 12px',
                    borderRadius: 10,
                    background: c.ink900,
                    border: `1px solid ${c.ink600}`,
                    color: c.cream,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <div
                  style={{
                    fontSize: 10,
                    color: c.ink400,
                    fontStyle: 'italic',
                    fontFamily: "'Fraunces', serif",
                    lineHeight: 1.4,
                  }}
                >
                  Makbuz e-posta ile {ngoShortName}&apos;dan gönderilecek. iyibiri sadece STK&apos;ya iletir.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment surface (mock) */}
      <div style={{ padding: '24px 16px 0' }}>
        <p
          style={{
            margin: '0 4px 10px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: c.gold,
            textTransform: 'uppercase',
          }}
        >
          ÖDEME
        </p>
        <div
          style={{
            padding: 16,
            borderRadius: 16,
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            position: 'relative',
          }}
        >
          {/* Secure label */}
          <div
            style={{
              position: 'absolute',
              top: -10,
              right: 14,
              padding: '3px 9px',
              borderRadius: 6,
              background: c.ink900,
              border: `1px solid ${(c.success ?? '#5DC395') + '55'}`,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: c.success ?? '#5DC395',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Lock size={9} /> İYZİCO ile korumalı
          </div>

          {/* Mock card chrome */}
          <div
            style={{
              padding: '14px 14px 12px',
              borderRadius: 12,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
              border: `1px dashed ${c.ink600}`,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: c.ink400,
                marginBottom: 8,
              }}
            >
              KART NUMARASI (V1 MOCK)
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 16,
                fontWeight: 500,
                color: c.cream,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.06em',
              }}
            >
              <span>5168</span>
              <span>••••</span>
              <span>••••</span>
              <span>4287</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: c.gold }}>
                VISA
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: c.ink900,
                border: `1px solid ${c.ink600}`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: c.ink400,
                }}
              >
                SKT
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: c.cream,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                09/28
              </div>
            </div>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: c.ink900,
                border: `1px solid ${c.ink600}`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: c.ink400,
                }}
              >
                CVV
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: c.cream,
                  letterSpacing: '0.4em',
                }}
              >
                •••
              </div>
            </div>
          </div>
        </div>
        <p
          style={{
            margin: '8px 4px 0',
            fontSize: 10,
            color: c.ink400,
            textAlign: 'center',
            fontStyle: 'italic',
            fontFamily: "'Fraunces', serif",
          }}
        >
          iyibiri kart bilgini görmez. Ödeme {ngoShortName}&apos;in hesabına direkt aktarılır.
        </p>
      </div>

      {/* KVKK */}
      <div
        style={{
          padding: '20px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <KvkkRow
          checked={kvkk1}
          onToggle={() => setKvkk1(!kvkk1)}
          c={c}
          text={
            <>
              iyibiri{' '}
              <span style={{ color: c.gold, textDecoration: 'underline' }}>
                aydınlatma metnini
              </span>{' '}
              okudum, kabul ediyorum.
            </>
          }
        />
        <KvkkRow
          checked={kvkk2}
          onToggle={() => setKvkk2(!kvkk2)}
          c={c}
          text={
            <>
              {ngoShortName} bilgilerimi makbuz/iletişim için kullanabilir.
            </>
          }
        />
      </div>

      {error && (
        <div
          style={{
            margin: '12px 16px 0',
            padding: '10px 12px',
            borderRadius: 10,
            background: `${c.danger}1A`,
            border: `1px solid ${c.danger}55`,
            color: c.danger,
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}

      {/* Sticky footer — bottom nav'ın üstüne (z-index 110, bottom 88px) */}
      <div
        style={{
          position: 'fixed',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)',
          left: 0,
          right: 0,
          padding: '16px',
          background: `linear-gradient(180deg, transparent, ${c.ink900} 25%)`,
          zIndex: 110,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: c.ink400,
            marginBottom: 10,
          }}
        >
          🔒 SSL şifreli
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitDisabled}
          style={{
            width: '100%',
            padding: '16px',
            background: c.gold,
            color: c.ink900,
            border: 'none',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            cursor: submitDisabled ? 'not-allowed' : 'pointer',
            opacity: submitDisabled ? 0.5 : 1,
            boxShadow: `0 8px 24px ${c.gold}55`,
            fontFamily: 'inherit',
          }}
        >
          {pending
            ? 'Bağış kaydediliyor…'
            : `${amountTry} ₺ ödeyerek bağışla`}
        </button>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, c }: { label: string; value: string; c: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 10,
        gap: 12,
      }}
    >
      <span style={{ fontSize: 12, color: c.ink400 }}>{label}</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: c.cream,
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function KvkkRow({
  checked,
  onToggle,
  text,
  c,
}: {
  checked: boolean
  onToggle: () => void
  text: ReactNode
  c: ReturnType<typeof useTheme>['colors']
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 12,
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          marginTop: 1,
          width: 18,
          height: 18,
          borderRadius: 5,
          border: `1.5px solid ${checked ? c.gold : c.ink600}`,
          background: checked ? c.gold : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: c.ink900,
          fontSize: 11,
          fontWeight: 800,
        }}
        aria-hidden
      >
        {checked ? '✓' : ''}
      </div>
      <div style={{ fontSize: 11, color: c.ink300, lineHeight: 1.45 }}>
        {text}
      </div>
    </button>
  )
}
