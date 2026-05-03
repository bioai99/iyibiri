'use client'

// Vol-31.4 Bağış flow client — Step 1 → Step 2 → Step 3 state machine.

import { useState } from 'react'
import { useTheme } from '@/lib/theme'
import { FlowHeader } from '@/components/donate/flow-header'
import {
  FlowStepAmount,
  type FlowStep1Output,
} from '@/components/donate/flow-step-amount'
import { FlowStepPayment } from '@/components/donate/flow-step-payment'
import { FlowStepSuccess } from '@/components/donate/flow-step-success'
import { createDonation } from '@/lib/donations/actions'

interface NgoSummary {
  id: string
  name: string
  short_name: string | null
  color_accent: string | null
  tax_exempt: boolean | null
  category: string | null
}

interface Props {
  ngo: NgoSummary
  campaignId: string | null
  campaignTitle: string | null
  initialFrequency: 'once' | 'monthly'
  /**
   * Vol-59: Kampanya bağışı akışında frekans toggle'ı kilitlenir.
   * Kampanyalar geçici/spesifik olduğu için "Aylık abonelik" mantığı
   * yoktur; tek seferlik desteklenir.
   */
  frequencyLocked?: 'once' | 'monthly' | null
}

interface SuccessState {
  amountTry: number
  karmaAwarded: number
  tierAfter: number
  didTierUp: boolean
}

export function GiveFlowClient({
  ngo,
  campaignId,
  campaignTitle,
  initialFrequency,
  frequencyLocked = null,
}: Props) {
  const { colors: c } = useTheme()
  const ngoShort = ngo.short_name ?? ngo.name
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [step1, setStep1] = useState<FlowStep1Output | null>(null)
  const [success, setSuccess] = useState<SuccessState | null>(null)

  // Step 3 — success ekranında header gizli
  if (step === 3 && success) {
    return (
      <FlowStepSuccess
        ngoShortName={ngoShort}
        amountTry={success.amountTry}
        karmaAwarded={success.karmaAwarded}
        tierAfter={success.tierAfter}
        didTierUp={success.didTierUp}
      />
    )
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: c.ink900,
        color: c.cream,
      }}
    >
      <FlowHeader
        step={step}
        totalSteps={3}
        ngoShortName={ngoShort}
        title={step === 1 ? 'Tutar' : 'Ödeme'}
      />

      {step === 1 && (
        <FlowStepAmount
          ngoShortName={ngoShort}
          initialAmount={250}
          initialFrequency={initialFrequency}
          campaignId={campaignId}
          frequencyLocked={frequencyLocked}
          campaignTitle={campaignTitle}
          onContinue={(out) => {
            setStep1(out)
            setStep(2)
          }}
        />
      )}

      {step === 2 && step1 && (
        <FlowStepPayment
          ngoShortName={ngoShort}
          taxExempt={Boolean(ngo.tax_exempt)}
          amountTry={step1.amount}
          isMonthly={step1.isMonthly}
          intentLabelText={
            step1.intentLabel
              ? step1.intentLabel
              : step1.scenarioType === 'gift'
              ? 'Hediye bağış'
              : step1.scenarioType === 'in_memory'
              ? 'Hatıra bağışı'
              : step1.scenarioType === 'regular_supporter'
              ? 'Düzenli destekçi'
              : campaignTitle
              ? `Kampanya: ${campaignTitle}`
              : 'Kendim adıma'
          }
          onSubmit={async ({ wantTaxReceipt }) => {
            const res = await createDonation({
              ngoId: ngo.id,
              amountTry: step1.amount,
              scenarioType: step1.scenarioType,
              campaignId,
              intentLabel: step1.intentLabel,
              isAnonymous: step1.isAnonymous,
              wantTaxReceipt,
            })
            if (res.ok) {
              setSuccess({
                amountTry: step1.amount,
                karmaAwarded: res.karmaAwarded,
                tierAfter: res.tierAfter,
                didTierUp: res.didTierUp,
              })
              setStep(3)
              return { ok: true }
            }
            return { ok: false, error: res.error }
          }}
        />
      )}
    </div>
  )
}
