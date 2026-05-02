'use client'

// app/dashboard/ngos/[id]/membership/membership-flow-client.tsx
//
// NGO üyelik 5-adımlı parametric flow — UI Spec 2026-04-24 NGO membership parametric.
// ADR-007 parametric fee + ADR-008 3-modlu payment routing.
//
// Adımlar (step 1-5):
// 1. Tier seç  — age_tiered / annual / monthly / one_time / donation_based
// 2. Form      — NGO'nun membership_form_fields jsonb'si (ör. T.C. kimlik, telefon)
// 3. KVKK      — aydınlatma + sözleşme çift onay, data share listesi, cayma banner
// 4. Payment   — 3 mode embed (marketplace iframe / embedded iframe / passthrough redirect)
// 5. Success   — kart artık /success route'una redirect olur (ayrı sayfa)
//
// State machine — local React state. Her adım data toplar, son adım server action çağırır.

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { useTheme } from '@/lib/theme'
import type { NGO, MembershipFeeConfig } from '@/lib/supabase/types'
import {
  deriveTierOptions,
  formatPriceDisplay,
  validateCustomAmount,
  ageRangeToAge,
} from '@/lib/membership/fee-config'
import { initiateMembership } from '@/lib/membership/actions'

import {
  StepProgressBar,
  TierCard,
  CustomAmountField,
  KvkkCheckbox,
  DataShareList,
  CaymaBanner,
  PaymentEmbed,
  translatePaymentError,
  type PaymentMode,
  type PaymentProcessor,
  type TierOption,
} from '@/components/membership'

/* ─────────────────────────────────────────────────────────────
 *  Types
 * ───────────────────────────────────────────────────────────── */

interface FormField {
  key: string
  label: string
  type: 'text' | 'tel' | 'textarea' | 'select'
  required?: boolean
  options?: string[]
}

interface MembershipFlowClientProps {
  ngo: NGO
  /** profiles.age_range → tier age filter için */
  userAgeRange?: string | null
}

type Step = 1 | 2 | 3 | 4

/* ─────────────────────────────────────────────────────────────
 *  Ana component
 * ───────────────────────────────────────────────────────────── */

export function MembershipFlowClient({
  ngo,
  userAgeRange,
}: MembershipFlowClientProps) {
  const { colors: c } = useTheme()
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  const feeConfig = ngo.membership_fee_config as MembershipFeeConfig | null
  const derived = useMemo(
    () => deriveTierOptions(feeConfig, ageRangeToAge(userAgeRange)),
    [feeConfig, userAgeRange],
  )

  const formFields: FormField[] = Array.isArray(ngo.membership_form_fields)
    ? ngo.membership_form_fields
    : []

  // Flow state
  const [step, setStep] = useState<Step>(1)
  const [selectedTierId, setSelectedTierId] = useState<string | null>(
    // Tek tier varsa otomatik seç (monthly / annual / one_time mode)
    derived && derived.tiers.length === 1 && !derived.isDonationBased
      ? derived.tiers[0].id
      : null,
  )
  const [customAmount, setCustomAmount] = useState<number | ''>('')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [kvkkConsent, setKvkkConsent] = useState(false)
  const [termsConsent, setTermsConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Payment session (server action'dan gelir, adım 4'te render edilir)
  const [paymentSession, setPaymentSession] = useState<{
    referralId: string
    mode: PaymentMode
    processor: PaymentProcessor
    paymentUrl: string
    amount: number
    periodLabel: string
  } | null>(null)

  // Fee config olmayan STK — eski tek-form akışa fallback
  if (!feeConfig || !derived) {
    return (
      <LegacyFallback ngo={ngo} />
    )
  }

  const selectedTier: TierOption | undefined = selectedTierId
    ? derived.tiers.find((t) => t.id === selectedTierId)
    : undefined

  /* ───── Step 1 → 2 geçiş eligibility ───── */
  const canProceedFromStep1 = (() => {
    if (derived.isDonationBased) {
      if (customAmount === '' || typeof customAmount !== 'number') return false
      return validateCustomAmount(feeConfig, customAmount).ok === true
    }
    if (!selectedTier || selectedTier.disabled) return false
    return true
  })()

  /* ───── Step 2 → 3 geçiş (form doluluk) ───── */
  const requiredFieldsFilled = formFields
    .filter((f) => f.required)
    .every((f) => (formData[f.key] ?? '').trim() !== '')

  /* ───── Step 3 → 4 geçiş (konsentler) ───── */
  const termsRequired = !!ngo.membership_terms_url
  const canProceedFromStep3 =
    kvkkConsent && (termsRequired ? termsConsent : true)

  /* ───── Adım 1 → 2 → 3 → 4 akış kontrolü ───── */
  const goToStep = (target: Step) => {
    setServerError(null)
    setStep(target)
  }

  const handleNext = async () => {
    setServerError(null)
    if (step === 1 && canProceedFromStep1) {
      // Form alanı yoksa adım 2'yi atla
      goToStep(formFields.length > 0 ? 2 : 3)
      return
    }
    if (step === 2 && requiredFieldsFilled) {
      goToStep(3)
      return
    }
    if (step === 3 && canProceedFromStep3) {
      // Adım 4'e geçmeden önce server action → payment session
      setSubmitting(true)
      const res = await initiateMembership({
        ngoId: ngo.id,
        tierId: selectedTierId ?? undefined,
        customAmount:
          derived.isDonationBased && typeof customAmount === 'number'
            ? customAmount
            : undefined,
        kvkkConsent,
        termsConsent: termsRequired ? termsConsent : true,
        formData,
      })
      setSubmitting(false)
      if (!res.ok) {
        setServerError(res.error)
        return
      }
      setPaymentSession({
        referralId: res.referralId,
        mode: res.paymentMode,
        processor: res.processor,
        paymentUrl: res.paymentUrl,
        amount: res.amount,
        periodLabel: res.periodLabel,
      })
      goToStep(4)
    }
  }

  const handleBack = () => {
    if (step === 1) {
      router.back()
      return
    }
    if (step === 3 && formFields.length === 0) {
      goToStep(1)
      return
    }
    goToStep((step - 1) as Step)
  }

  /* ───── Payment success/error callbacks (adım 4) ───── */
  const handlePaymentSuccess = () => {
    if (paymentSession) {
      router.push(
        `/dashboard/ngos/${ngo.id}/membership/success?ref=${paymentSession.referralId}`,
      )
    }
  }
  const handlePaymentError = (msg: string) => {
    setServerError(msg)
    // Kullanıcı adım 3'e dönsün — konsentleri koruyoruz
    goToStep(3)
    setPaymentSession(null)
  }

  /* ───── Labels ───── */
  const stepLabels = formFields.length > 0
    ? ['Seviye seç', 'Bilgiler', 'Onay', 'Ödeme', 'Tamamlandı']
    : ['Seviye seç', '—', 'Onay', 'Ödeme', 'Tamamlandı']

  const displayFont = 'var(--font-display), Fraunces, serif'

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100dvh',
      }}
      className="flex flex-col"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 pt-[calc(env(safe-area-inset-top,20px)+16px)] pb-3"
      >
        <button
          type="button"
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
          }}
          aria-label="Geri"
        >
          <ArrowLeft size={16} color={c.cream} />
        </button>
        <div
          className="text-[11px] font-bold uppercase"
          style={{ color: c.gold, letterSpacing: '0.14em' }}
        >
          {(ngo.short_name ?? ngo.name).toUpperCase()} · ÜYELİK
        </div>
      </div>

      {/* Step progress */}
      <StepProgressBar current={step} total={5} labels={stepLabels} />

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-5 pb-[120px] pt-5">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <StepHeader
                eyebrow="Adım 1 / 5"
                title={
                  derived.isDonationBased
                    ? 'Bağış üyelik tutarını belirle'
                    : 'Üyelik seviyeni seç'
                }
                subtitle={
                  derived.donationNote ??
                  ngo.membership_description ??
                  'Sana en uygun seçeneği seç.'
                }
                displayFont={displayFont}
              />

              {/* Tier grid */}
              {!derived.isDonationBased && (
                <div className="mt-5 flex flex-col gap-3" role="radiogroup">
                  {derived.tiers.map((tier) => (
                    <TierCard
                      key={tier.id}
                      tier={tier}
                      selected={tier.id === selectedTierId}
                      onSelect={setSelectedTierId}
                    />
                  ))}
                </div>
              )}

              {/* Donation-based custom amount */}
              {derived.isDonationBased && (
                <div className="mt-5">
                  <CustomAmountField
                    value={customAmount}
                    onChange={setCustomAmount}
                    minAmount={derived.donationMinAmount}
                    suggestedAmounts={derived.donationSuggestedAmounts}
                  />
                </div>
              )}

              {/* Registration fee notice */}
              {derived.registrationFee && (
                <p
                  className="mt-4 text-[12px]"
                  style={{ color: c.ink300 }}
                >
                  +{' '}
                  {formatPriceDisplay(
                    derived.registrationFee.amount,
                    derived.currency,
                  )}{' '}
                  {derived.registrationFee.description ?? 'kayıt ücreti'}
                </p>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <StepHeader
                eyebrow="Adım 2 / 5"
                title="Bilgilerini doldur"
                subtitle="STK üyelik kaydı için aşağıdaki alanlar gerekli."
                displayFont={displayFont}
              />
              <div className="mt-5 flex flex-col gap-3.5">
                {formFields.map((field) => (
                  <FieldInput
                    key={field.key}
                    field={field}
                    value={formData[field.key] ?? ''}
                    onChange={(v) =>
                      setFormData((prev) => ({ ...prev, [field.key]: v }))
                    }
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <StepHeader
                eyebrow="Adım 3 / 5"
                title="Paylaşımı onayla"
                subtitle="Yasal gereklilik: KVKK aydınlatma + üyelik sözleşmesi onayı."
                displayFont={displayFont}
              />

              <div className="mt-5 flex flex-col gap-4">
                <DataShareList
                  fields={[
                    'Ad soyad',
                    'E-posta adresi',
                    'Şehir',
                    ...formFields.map((f) => f.label),
                  ]}
                />

                <KvkkCheckbox
                  id="kvkk-consent"
                  checked={kvkkConsent}
                  onChange={setKvkkConsent}
                  detailsUrl="/legal/kvkk"
                  detailsLabel="KVKK aydınlatma metnini oku"
                >
                  Kişisel verilerimin{' '}
                  <strong style={{ color: c.cream }}>{ngo.name}</strong> ile
                  paylaşılmasını kabul ediyorum.
                </KvkkCheckbox>

                {termsRequired && (
                  <KvkkCheckbox
                    id="terms-consent"
                    checked={termsConsent}
                    onChange={setTermsConsent}
                    detailsUrl={ngo.membership_terms_url ?? undefined}
                    detailsLabel="Üyelik sözleşmesini oku"
                  >
                    Üyelik sözleşmesini okudum ve kabul ediyorum.
                  </KvkkCheckbox>
                )}

                <CaymaBanner />
              </div>
            </motion.div>
          )}

          {step === 4 && paymentSession && (
            <motion.div
              key="step-4"
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <StepHeader
                eyebrow="Adım 4 / 5"
                title="Ödemeni tamamla"
                subtitle="Güvenli ödeme sayfasında kartınla ödemeni yap."
                displayFont={displayFont}
              />
              <div className="mt-5">
                <PaymentEmbed
                  mode={paymentSession.mode}
                  processor={paymentSession.processor}
                  amount={paymentSession.amount}
                  periodLabel={paymentSession.periodLabel}
                  paymentUrl={paymentSession.paymentUrl}
                  externalTitle={`${ngo.short_name ?? ngo.name} ödeme sayfasına git`}
                  onSuccess={handlePaymentSuccess}
                  onError={(msg) =>
                    handlePaymentError(msg || translatePaymentError())
                  }
                  onBack={() => goToStep(3)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Server error display */}
        {serverError && (
          <div
            className="mt-4 rounded-xl px-3 py-2 text-[13px]"
            style={{
              background: 'rgba(184,78,59,0.12)',
              border: '1px solid rgba(184,78,59,0.35)',
              color: c.danger,
            }}
            role="alert"
          >
            {serverError}
          </div>
        )}
      </div>

      {/* Sticky primary CTA — step 4 dışında */}
      {step !== 4 && (
        <StickyCta
          step={step}
          derived={derived}
          selectedTier={selectedTier}
          customAmount={customAmount}
          canProceedFromStep1={canProceedFromStep1}
          requiredFieldsFilled={requiredFieldsFilled}
          canProceedFromStep3={canProceedFromStep3}
          submitting={submitting}
          onNext={handleNext}
        />
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  Sub-components
 * ───────────────────────────────────────────────────────────── */

function StepHeader({
  eyebrow,
  title,
  subtitle,
  displayFont,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  displayFont: string
}) {
  const { colors: c } = useTheme()
  return (
    <div>
      <p
        className="mb-2 text-[11px] font-bold uppercase"
        style={{ color: c.gold, letterSpacing: '0.14em' }}
      >
        {eyebrow}
      </p>
      <h1
        style={{
          fontFamily: displayFont,
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: '-0.025em',
          color: c.cream,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-[13px] leading-[1.5]" style={{ color: c.ink300 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FormField
  value: string
  onChange: (v: string) => void
}) {
  const { colors: c } = useTheme()
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    background: c.ink800,
    border: `1.5px solid ${c.ink600}`,
    borderRadius: 14,
    color: c.cream,
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div>
      <label
        className="mb-1.5 block text-[11px] font-semibold uppercase"
        style={{ color: c.ink300, letterSpacing: '0.06em' }}
      >
        {field.label}
        {field.required ? ' *' : ''}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder={field.label}
        />
      ) : field.type === 'select' && field.options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, appearance: 'none' }}
        >
          <option value="">Seçiniz</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type === 'tel' ? 'tel' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder={field.label}
        />
      )}
    </div>
  )
}

function StickyCta({
  step,
  derived,
  selectedTier,
  customAmount,
  canProceedFromStep1,
  requiredFieldsFilled,
  canProceedFromStep3,
  submitting,
  onNext,
}: {
  step: Step
  derived: NonNullable<ReturnType<typeof deriveTierOptions>>
  selectedTier: TierOption | undefined
  customAmount: number | ''
  canProceedFromStep1: boolean
  requiredFieldsFilled: boolean
  canProceedFromStep3: boolean
  submitting: boolean
  onNext: () => void
}) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const enabled =
    (step === 1 && canProceedFromStep1) ||
    (step === 2 && requiredFieldsFilled) ||
    (step === 3 && canProceedFromStep3)

  const label = (() => {
    if (submitting) return 'Hazırlanıyor…'
    if (step === 1) {
      // Vol-37 P5: context-specific CTA — "Devam et" yerine kullanıcının
      // ne yaptığını gösteren etiket. Step 1'de tier/tutar seçilir.
      const amount = derived.isDonationBased
        ? typeof customAmount === 'number'
          ? formatPriceDisplay(customAmount, derived.currency)
          : ''
        : selectedTier?.priceDisplay ?? ''
      return `Bilgilerime geç · ${amount}`.trim()
    }
    if (step === 2) return 'Onaya geç'
    if (step === 3) return 'Ödemeye geç'
    return 'Devam et'
  })()

  return (
    <div
      className="fixed inset-x-0 bottom-0 px-5 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-3"
      style={{
        background: `linear-gradient(180deg, transparent 0%, ${c.ink900} 32%)`,
      }}
    >
      <motion.button
        type="button"
        whileTap={enabled && !shouldReduceMotion ? { scale: 0.97 } : undefined}
        onClick={onNext}
        disabled={!enabled || submitting}
        className="flex h-[52px] w-full items-center justify-center rounded-xl font-bold"
        style={{
          background: enabled && !submitting ? c.gold : c.ink600,
          color: enabled && !submitting ? c.ink : c.ink300,
          fontSize: 15,
          cursor: enabled && !submitting ? 'pointer' : 'not-allowed',
          boxShadow:
            enabled && !submitting ? '0 8px 20px rgba(232,194,104,0.22)' : 'none',
        }}
      >
        {label}
      </motion.button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  Legacy fallback — fee_config null ise eski tek-sayfalık akış
 * ───────────────────────────────────────────────────────────── */

function LegacyFallback({ ngo }: { ngo: NGO }) {
  const { colors: c } = useTheme()
  // Vol-51: "Henüz hazır değil" dead-end yerine actionable fallback.
  // Membership URL varsa STK'nın resmi sitesine yönlendir; yoksa
  // takip edilebileceğini söyle + STK sayfasına geri dön.
  const externalUrl = ngo.membership_url || null
  const label = ngo.short_name ?? ngo.name

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
      style={{ background: c.ink900, color: c.cream }}
    >
      <h1
        className="font-display text-[22px] font-medium"
        style={{ color: c.cream, letterSpacing: '-0.025em', maxWidth: 320 }}
      >
        {label} üyeliği iyiBiri üzerinden henüz açık değil
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed" style={{ color: c.ink300, maxWidth: 320 }}>
        {externalUrl
          ? `Üyelik için ${label} resmi sitesini ziyaret edebilirsin. Bu arada STK'yı takip et — yeni görevlerden ilk sen haberdar ol.`
          : `${label} henüz iyiBiri üzerinden üyelik planı tanımlamadı. Şimdilik STK'yı takip edip yeni görevlerden haberdar olabilirsin.`}
      </p>
      <div className="mt-6 flex flex-col gap-3 w-full max-w-[260px]">
        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full px-5 py-3 text-[14px] font-bold"
            style={{ background: c.gold, color: c.ink }}
          >
            Resmi siteye git ↗
          </a>
        )}
        <Link
          href={`/dashboard/ngos/${ngo.id}`}
          className="inline-block rounded-full px-5 py-3 text-[14px] font-bold"
          style={{
            background: externalUrl ? 'transparent' : c.gold,
            color: externalUrl ? c.cream : c.ink,
            border: externalUrl ? `1px solid ${c.ink600}` : 'none',
          }}
        >
          Kuruluş sayfasına dön
        </Link>
      </div>
    </div>
  )
}

