// lib/membership/fee-config.ts
//
// NGO `membership_fee_config` jsonb → UI-ready `TierOption[]` helper.
// Parametric fee schema (ADR-007, migration 009) single source of truth.
//
// Purpose:
// - `deriveTierOptions(config, userAge?)` — Row from DB → render edilebilir TierCard props
// - `resolveSelectedAmount(config, tierId?, customAmount?)` — Ödeme için final tutarı
// - `formatPriceDisplay(amount, currency)` — "₺256" TR format
// - `periodLabel(period)` — TR period label ("yıllık" / "aylık" / "tek seferlik")
//
// Client-safe: no Supabase import, no server-only code. Page + client components import ediyor.

import type {
  MembershipFeeConfig,
  FeeTier,
  FeePeriod,
} from '@/lib/supabase/types'
import type { TierOption } from '@/components/membership/tier-card'

/* ─────────────────────────────────────────────────────────────
 *  Public helpers
 * ───────────────────────────────────────────────────────────── */

/** TR Lira veya başka currency için ₺/symbol göster. */
export function formatPriceDisplay(amount: number, currency = 'TRY'): string {
  const symbol = currency === 'TRY' ? '₺' : currency + ' '
  return `${symbol}${amount.toLocaleString('tr-TR')}`
}

/** Period → TR label. */
export function periodLabel(period?: FeePeriod | null): string {
  switch (period) {
    case 'annual':
      return 'yıllık'
    case 'monthly':
      return 'aylık'
    case 'one_time':
      return 'tek seferlik'
    default:
      return ''
  }
}

/**
 * FeeTier → TierOption (UI props).
 *
 * `userAge` verildiyse ve tier age_min/age_max varsa:
 * - uygun olan tier → `recommended = true`
 * - uygun olmayan → `disabled = true` + meta_label override "Yaşın uygun değil"
 */
export function tierToOption(tier: FeeTier, userAge?: number): TierOption {
  const price = formatPriceDisplay(tier.amount)
  const period = periodLabel(tier.period)

  // Meta label — öncelik: tier.meta_label > age range > region
  let metaLabel: string | undefined = tier.meta_label
  if (!metaLabel) {
    if (tier.age_min !== undefined || tier.age_max !== undefined) {
      const parts: string[] = []
      if (tier.age_min !== undefined) parts.push(String(tier.age_min))
      parts.push('-')
      if (tier.age_max !== undefined) parts.push(String(tier.age_max))
      metaLabel = `${parts.join('')} yaş`
    } else if (tier.region === 'metropolitan') {
      metaLabel = 'Büyükşehir'
    }
  }

  // Disabled + recommended — user age eşlemesi
  let disabled = false
  let recommended = !!tier.recommended
  if (userAge !== undefined) {
    const minOk = tier.age_min === undefined || userAge >= tier.age_min
    const maxOk = tier.age_max === undefined || userAge <= tier.age_max
    const fits = minOk && maxOk
    if (!fits) {
      disabled = true
      metaLabel = 'Yaşın bu seviyeye uygun değil'
    } else if (
      tier.age_min !== undefined ||
      tier.age_max !== undefined
    ) {
      // Tam yaş aralığına denk düşüyorsa "Sana uygun" rozet
      recommended = true
    }
  }

  return {
    id: tier.id,
    label: tier.name,
    priceDisplay: price,
    periodLabel: period,
    metaLabel,
    impactStatement: tier.impact_statement,
    isRecommended: recommended,
    disabled,
  }
}

/**
 * Config → render edilebilir TierOption[] listesi + mode metadata.
 *
 * Mode-spesifik davranış:
 * - `age_tiered`       → tüm tier'ları sırala (display_order)
 * - `annual/monthly/one_time` → tek tier (mevcutsa) + synthetic tek option
 * - `donation_based`   → TierOption boş → UI custom amount field gösterir
 */
export interface DeriveResult {
  mode: MembershipFeeConfig['mode']
  tiers: TierOption[]
  isDonationBased: boolean
  donationMinAmount: number
  donationSuggestedAmounts: number[]
  donationNote: string | null
  coolingOffDays: number
  registrationFee: { amount: number; description: string | null } | null
  currency: string
}

export function deriveTierOptions(
  config: MembershipFeeConfig | null | undefined,
  userAge?: number,
): DeriveResult | null {
  if (!config) return null

  const sortedTiers = [...(config.tiers ?? [])].sort(
    (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999),
  )

  const options = sortedTiers.map((t) => tierToOption(t, userAge))

  const reg = config.registration_fee
  const registrationFee =
    reg && reg.amount > 0
      ? { amount: reg.amount, description: reg.description ?? null }
      : null

  return {
    mode: config.mode,
    tiers: options,
    isDonationBased: config.mode === 'donation_based',
    donationMinAmount: config.donation_based?.min_amount ?? 0,
    donationSuggestedAmounts: config.donation_based?.suggested_amounts ?? [],
    donationNote: config.donation_based?.note ?? null,
    coolingOffDays: config.cooling_off_days ?? 14,
    registrationFee,
    currency: config.currency ?? 'TRY',
  }
}

/**
 * Ödeme için final tutarı hesapla.
 *
 * - age_tiered / annual / monthly / one_time → seçili tier.amount + registration_fee (varsa)
 * - donation_based → customAmount kullanılır (min kontrolü mutlaka client'ta da)
 *
 * Dönüş: toplam tutar (Number) veya validation hatası varsa `null`.
 */
export function resolveSelectedAmount(
  config: MembershipFeeConfig,
  opts: { tierId?: string; customAmount?: number },
): { amount: number; breakdown: { label: string; amount: number }[] } | null {
  if (config.mode === 'donation_based') {
    const a = opts.customAmount
    const min = config.donation_based?.min_amount ?? 0
    if (a === undefined || a === null || isNaN(a)) return null
    if (a < min) return null
    return {
      amount: a,
      breakdown: [{ label: 'Bağış üyelik', amount: a }],
    }
  }

  const tier = config.tiers.find((t) => t.id === opts.tierId)
  if (!tier) return null

  const breakdown: { label: string; amount: number }[] = [
    { label: tier.name, amount: tier.amount },
  ]
  let total = tier.amount

  const reg = config.registration_fee
  if (reg && reg.amount > 0) {
    breakdown.push({
      label: reg.description ?? 'Kayıt ücreti',
      amount: reg.amount,
    })
    total += reg.amount
  }

  return { amount: total, breakdown }
}

/**
 * Tier + period → UI display helper.
 * Örn: deriveDefaultPeriodLabel(config) → "yıllık" (çoğu tier annual ise)
 */
export function deriveDefaultPeriodLabel(
  config: MembershipFeeConfig,
  tierId?: string,
): string {
  if (config.mode === 'donation_based') return 'tek seferlik'
  const tier = config.tiers.find((t) => t.id === tierId) ?? config.tiers[0]
  return periodLabel(tier?.period)
}

/* ─────────────────────────────────────────────────────────────
 *  Validation helpers (client-side guards)
 * ───────────────────────────────────────────────────────────── */

/** Custom amount min kontrolü. UI feedback + server action guard ikisinde kullanılır. */
export function validateCustomAmount(
  config: MembershipFeeConfig,
  amount: number,
): { ok: true } | { ok: false; error: string } {
  if (config.mode !== 'donation_based')
    return { ok: false, error: 'Bu STK için özel tutar geçerli değil.' }
  if (!Number.isFinite(amount))
    return { ok: false, error: 'Geçerli bir tutar gir.' }
  if (amount <= 0) return { ok: false, error: 'Tutar 0 TL üzerinde olmalı.' }
  const min = config.donation_based?.min_amount ?? 0
  if (amount < min)
    return {
      ok: false,
      error: `Minimum tutar ${formatPriceDisplay(min, config.currency)}.`,
    }
  return { ok: true }
}

/** Tier seçimi + yaş eşleşme kontrolü. Server action fraud guard. */
export function validateTierSelection(
  config: MembershipFeeConfig,
  tierId: string,
  userAge?: number,
): { ok: true } | { ok: false; error: string } {
  const tier = config.tiers.find((t) => t.id === tierId)
  if (!tier) return { ok: false, error: 'Seçilen üyelik seviyesi bulunamadı.' }
  if (userAge === undefined) return { ok: true }
  const minOk = tier.age_min === undefined || userAge >= tier.age_min
  const maxOk = tier.age_max === undefined || userAge <= tier.age_max
  if (!minOk || !maxOk)
    return { ok: false, error: 'Yaş aralığı bu seviyeye uygun değil.' }
  return { ok: true }
}

/* ─────────────────────────────────────────────────────────────
 *  User age_range → numeric helper
 *  profiles.age_range onboarding'den gelir ("18-24" format).
 * ───────────────────────────────────────────────────────────── */

/**
 * "18-24" → 21 (ortalama).  "55+" → 55.  Bilinmezse undefined.
 * Tier age_min/max eşlemesi için yeterli hassasiyet.
 */
export function ageRangeToAge(ageRange: string | null | undefined): number | undefined {
  if (!ageRange) return undefined
  const plusMatch = ageRange.match(/^(\d+)\+$/)
  if (plusMatch) return Number(plusMatch[1])
  const rangeMatch = ageRange.match(/^(\d+)-(\d+)$/)
  if (rangeMatch) {
    return Math.floor(
      (Number(rangeMatch[1]) + Number(rangeMatch[2])) / 2,
    )
  }
  const single = Number(ageRange)
  return Number.isFinite(single) ? single : undefined
}
