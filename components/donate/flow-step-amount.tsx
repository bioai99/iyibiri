'use client'

// Vol-31.4 Step 1 — Tutar / sıklık / niyet seçimi.
//
// State: amount, frequency (once|monthly), intent (self|gift|memorial), anonymous.
// Output: { amount, scenarioType, intentLabel, isAnonymous }
//
// Karma preview footer: floor(amount/10), regular_supporter +20% bonus.

import { useState } from 'react'
import { useTheme } from '@/lib/theme'
import type { DonationScenarioType } from '@/lib/supabase/types'

const PRESETS = [50, 100, 250, 500] as const

interface IntentOption {
  key: 'self' | 'gift' | 'memorial'
  icon: string
  label: string
  desc: string
}

const INTENT_OPTIONS: IntentOption[] = [
  { key: 'self', icon: '◐', label: 'Kendim adıma', desc: 'Senin adına bağışlanır' },
  { key: 'gift', icon: '✉', label: 'Hediye bağış', desc: 'Birinin adına, kart ile' },
  { key: 'memorial', icon: '✿', label: 'Hatıra bağışı', desc: 'Vefat eden biri adına' },
]

export interface FlowStep1Output {
  amount: number
  scenarioType: DonationScenarioType
  intentLabel: string | null
  isAnonymous: boolean
  isMonthly: boolean
}

interface Props {
  ngoShortName: string
  initialAmount?: number
  initialFrequency?: 'once' | 'monthly'
  campaignId?: string | null
  onContinue: (out: FlowStep1Output) => void
}

export function FlowStepAmount({
  initialAmount = 250,
  initialFrequency = 'once',
  campaignId,
  onContinue,
}: Props) {
  const { colors: c } = useTheme()
  const [amount, setAmount] = useState<number>(initialAmount)
  const [frequency, setFrequency] = useState<'once' | 'monthly'>(initialFrequency)
  const [intent, setIntent] = useState<'self' | 'gift' | 'memorial'>('self')
  const [intentLabel, setIntentLabel] = useState<string>('')
  const [anonymous, setAnonymous] = useState(false)

  // Karma preview
  const baseKarma = Math.floor(amount / 10)
  const bonus = frequency === 'monthly' ? Math.floor(baseKarma * 0.2) : 0
  const totalKarma = baseKarma + bonus

  const handleContinue = () => {
    let scenarioType: DonationScenarioType
    if (frequency === 'monthly') scenarioType = 'regular_supporter'
    else if (intent === 'gift') scenarioType = 'gift'
    else if (intent === 'memorial') scenarioType = 'in_memory'
    else scenarioType = campaignId ? 'specific_campaign' : 'general'

    onContinue({
      amount,
      scenarioType,
      intentLabel: intent !== 'self' && intentLabel.trim() ? intentLabel.trim() : null,
      isAnonymous: anonymous,
      isMonthly: frequency === 'monthly',
    })
  }

  return (
    <div style={{ paddingBottom: 220 }}>
      <div style={{ padding: '24px 20px 0' }}>
        {/* Once / monthly toggle */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 0,
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            borderRadius: 14,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {(
            [
              { k: 'once', label: 'Tek seferlik' },
              { k: 'monthly', label: 'Aylık · iptal serbest' },
            ] as const
          ).map((t) => {
            const active = frequency === t.k
            return (
              <button
                type="button"
                key={t.k}
                onClick={() => setFrequency(t.k)}
                style={{
                  padding: '11px',
                  borderRadius: 11,
                  textAlign: 'center',
                  background: active ? c.gold : 'transparent',
                  color: active ? c.ink900 : c.ink400,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  fontFamily: 'inherit',
                  transition: 'all 200ms',
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Big amount display */}
        <div style={{ textAlign: 'center', padding: '12px 0 24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'Fraunces', ui-serif, serif",
                fontSize: 64,
                fontWeight: 500,
                color: c.cream,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {amount.toLocaleString('tr-TR')}
            </span>
            <span
              style={{
                fontSize: 22,
                color: c.gold,
                fontFamily: "'Fraunces', serif",
                fontStyle: 'italic',
              }}
            >
              ₺
            </span>
          </div>
          {frequency === 'monthly' && (
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 12,
                color: c.ink400,
                fontStyle: 'italic',
                fontFamily: "'Fraunces', serif",
              }}
            >
              her ay 15&apos;inde otomatik
            </p>
          )}
        </div>

        {/* Preset chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
            marginBottom: 14,
          }}
        >
          {PRESETS.map((v) => {
            const active = amount === v
            return (
              <button
                type="button"
                key={v}
                onClick={() => setAmount(v)}
                style={{
                  padding: '12px 8px',
                  borderRadius: 12,
                  textAlign: 'center',
                  background: active ? c.gold : c.ink800,
                  color: active ? c.ink900 : c.cream,
                  border: `1px solid ${active ? c.gold : c.ink600}`,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontVariantNumeric: 'tabular-nums',
                  fontFamily: 'inherit',
                }}
              >
                {v} ₺
              </button>
            )
          })}
        </div>

        {/* Custom amount input */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 12,
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 12, color: c.ink400 }}>Özel tutar</span>
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => {
              const v = Math.max(1, Math.floor(Number(e.target.value) || 0))
              setAmount(v)
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: c.cream,
              fontSize: 15,
              fontWeight: 600,
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
              fontFamily: 'inherit',
              minWidth: 0,
            }}
          />
          <span style={{ fontSize: 13, color: c.gold }}>₺</span>
        </div>
      </div>

      {/* Niyet — kim için? */}
      <div style={{ padding: '32px 16px 0' }}>
        <p
          style={{
            margin: '0 4px 12px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: c.gold,
            textTransform: 'uppercase',
          }}
        >
          KİM ADINA?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {INTENT_OPTIONS.map((opt) => {
            const active = intent === opt.key
            return (
              <button
                type="button"
                key={opt.key}
                onClick={() => setIntent(opt.key)}
                style={{
                  padding: '14px',
                  borderRadius: 14,
                  background: c.ink800,
                  border: `1px solid ${active ? c.gold : c.ink600}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  boxShadow: active ? `0 0 0 1px ${c.gold} inset` : 'none',
                  width: '100%',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: active ? c.goldSoft : c.ink700,
                    color: active ? c.gold : c.ink400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                  aria-hidden
                >
                  {opt.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.cream }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 11, color: c.ink400, marginTop: 2 }}>
                    {opt.desc}
                  </div>
                </div>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: `1.5px solid ${active ? c.gold : c.ink600}`,
                    background: active ? c.gold : 'transparent',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                  aria-hidden
                >
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: c.ink900,
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Intent label input (gift / memorial) */}
        {(intent === 'gift' || intent === 'memorial') && (
          <div
            style={{
              marginTop: 10,
              padding: '12px 14px',
              borderRadius: 12,
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
            }}
          >
            <input
              type="text"
              placeholder={
                intent === 'gift' ? 'Kim için? (örn: Anneme · Ayşe)' : 'Kimin anısına?'
              }
              value={intentLabel}
              onChange={(e) => setIntentLabel(e.target.value)}
              maxLength={120}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: c.cream,
                fontSize: 14,
                fontFamily: 'inherit',
              }}
            />
          </div>
        )}

        {/* Anonim toggle */}
        <button
          type="button"
          onClick={() => setAnonymous(!anonymous)}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '12px 14px',
            borderRadius: 12,
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <span style={{ fontSize: 13, color: c.cream, flex: 1, textAlign: 'left' }}>
            Anonim bağışla
          </span>
          <div
            style={{
              width: 36,
              height: 22,
              borderRadius: 999,
              background: anonymous ? c.gold : c.ink600,
              position: 'relative',
              transition: 'background 200ms',
            }}
            aria-hidden
          >
            <div
              style={{
                position: 'absolute',
                top: 2,
                left: anonymous ? 16 : 2,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: anonymous ? c.ink900 : c.cream,
                transition: 'left 200ms',
              }}
            />
          </div>
        </button>
      </div>

      {/* Sticky footer (CTA) — bottom nav'ın üstüne taşı (z-index 100, bottom 88px) */}
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
            color: c.gold,
            marginBottom: 10,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          Karma: +{totalKarma} ✦{bonus > 0 && ` · +%20 düzenli destekçi bonusu`}
        </div>
        <button
          type="button"
          onClick={handleContinue}
          disabled={amount <= 0}
          style={{
            width: '100%',
            padding: '16px',
            background: c.gold,
            color: c.ink900,
            border: 'none',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            cursor: amount > 0 ? 'pointer' : 'not-allowed',
            opacity: amount > 0 ? 1 : 0.5,
            boxShadow: `0 8px 24px ${c.gold}55`,
            fontFamily: 'inherit',
          }}
        >
          Bilgilerime geç
        </button>
      </div>
    </div>
  )
}
