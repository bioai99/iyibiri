// lib/membership/__test__.ts
//
// Self-check: migration 009'daki 3 seed config + synthetic monthly/annual üzerinde
// deriveTierOptions + resolveSelectedAmount + validateCustomAmount doğru mu davranıyor.
//
// Çalıştırma: `npx tsx lib/membership/__test__.ts`
// Veya Node strip-types ile: `node --experimental-strip-types lib/membership/__test__.ts`

import {
  deriveTierOptions,
  resolveSelectedAmount,
  validateCustomAmount,
  validateTierSelection,
  ageRangeToAge,
  formatPriceDisplay,
} from './fee-config'
import type { MembershipFeeConfig } from '@/lib/supabase/types'

let passed = 0
let failed = 0
const fail = (msg: string) => {
  failed++
  console.error('  ✗ ' + msg)
}
const ok = (msg: string) => {
  passed++
  console.log('  ✓ ' + msg)
}
const assert = (cond: unknown, msg: string) => (cond ? ok(msg) : fail(msg))

/* ─────────────────────────────────────────────────────────────
 *  1. TEMA — age_tiered
 * ───────────────────────────────────────────────────────────── */

console.log('\n— TEMA age_tiered —')
const temaConfig: MembershipFeeConfig = {
  mode: 'age_tiered',
  currency: 'TRY',
  tiers: [
    {
      id: 'yas_0_13',
      name: '0-13 yaş',
      amount: 15,
      period: 'annual',
      age_min: 0,
      age_max: 13,
      display_order: 1,
    },
    {
      id: 'yas_14_24',
      name: '14-24 yaş',
      amount: 15,
      period: 'annual',
      age_min: 14,
      age_max: 24,
      display_order: 2,
    },
    {
      id: 'yetiskin_buyuksehir',
      name: 'Yetişkin (büyükşehir)',
      amount: 256,
      period: 'annual',
      age_min: 25,
      region: 'metropolitan',
      display_order: 3,
    },
  ],
  cooling_off_days: 14,
}

const temaDerived18 = deriveTierOptions(temaConfig, 18)
assert(!!temaDerived18, 'TEMA — derive non-null')
assert(temaDerived18?.tiers.length === 3, 'TEMA — 3 tier')
assert(
  temaDerived18?.tiers[0].id === 'yas_0_13',
  'TEMA — display_order sort çalışıyor',
)
assert(
  temaDerived18?.tiers[1].isRecommended === true,
  'TEMA — 18 yaşındaki kullanıcıya 14-24 tier önerili',
)
assert(
  temaDerived18?.tiers[0].disabled === true,
  'TEMA — 18 yaşındaki kullanıcıya 0-13 tier disabled',
)
assert(
  temaDerived18?.tiers[2].disabled === true,
  'TEMA — 18 yaşındaki kullanıcıya yetişkin disabled',
)

// Yetişkin seçerse resolve ediyor mu
const temaAdult = resolveSelectedAmount(temaConfig, {
  tierId: 'yetiskin_buyuksehir',
})
assert(temaAdult?.amount === 256, 'TEMA — yetişkin 256 TL')

// Genç tier validate et — 18 yaş için
const v18_0_13 = validateTierSelection(temaConfig, 'yas_0_13', 18)
assert(v18_0_13.ok === false, 'TEMA — 18 yaşa 0-13 tier validate red')
const v18_14_24 = validateTierSelection(temaConfig, 'yas_14_24', 18)
assert(v18_14_24.ok === true, 'TEMA — 18 yaşa 14-24 tier validate pass')

/* ─────────────────────────────────────────────────────────────
 *  2. LÖSEV — donation_based
 * ───────────────────────────────────────────────────────────── */

console.log('\n— LÖSEV donation_based —')
const losevConfig: MembershipFeeConfig = {
  mode: 'donation_based',
  currency: 'TRY',
  tiers: [],
  donation_based: {
    min_amount: null,
    suggested_amounts: [50, 100, 250, 500],
    note: 'Her bağış üyelik kaydı doğurur.',
  },
  cooling_off_days: 14,
}

const losevDerived = deriveTierOptions(losevConfig)
assert(losevDerived?.isDonationBased === true, 'LÖSEV — donation mode')
assert(losevDerived?.tiers.length === 0, 'LÖSEV — tier boş')
assert(
  losevDerived?.donationSuggestedAmounts.length === 4,
  'LÖSEV — 4 quick pick',
)

const losev100 = resolveSelectedAmount(losevConfig, { customAmount: 100 })
assert(losev100?.amount === 100, 'LÖSEV — custom 100 resolve')

const losevValid100 = validateCustomAmount(losevConfig, 100)
assert(losevValid100.ok === true, 'LÖSEV — 100 valid (min null)')

const losevNeg = validateCustomAmount(losevConfig, -10)
assert(losevNeg.ok === false, 'LÖSEV — negatif invalid')

/* ─────────────────────────────────────────────────────────────
 *  3. TEGV — donation_based with min
 * ───────────────────────────────────────────────────────────── */

console.log('\n— TEGV donation_based min=100 —')
const tegvConfig: MembershipFeeConfig = {
  mode: 'donation_based',
  currency: 'TRY',
  tiers: [],
  donation_based: {
    min_amount: 100,
    suggested_amounts: [100, 250, 500, 1000],
    note: 'Her bağış çocuk eğitimine katkıdır.',
  },
  cooling_off_days: 14,
}

const tegv50 = validateCustomAmount(tegvConfig, 50)
assert(tegv50.ok === false, 'TEGV — 50 < 100 invalid')
const tegv150 = validateCustomAmount(tegvConfig, 150)
assert(tegv150.ok === true, 'TEGV — 150 ≥ 100 valid')

/* ─────────────────────────────────────────────────────────────
 *  4. Synthetic — monthly HAYTAP örneği
 * ───────────────────────────────────────────────────────────── */

console.log('\n— Synthetic monthly HAYTAP —')
const haytapConfig: MembershipFeeConfig = {
  mode: 'monthly',
  currency: 'TRY',
  tiers: [
    {
      id: 'monthly_basic',
      name: 'Aylık destekçi',
      amount: 50,
      period: 'monthly',
      impact_statement: '2 sokak hayvanı bir ay beslenir',
      display_order: 1,
    },
  ],
  cooling_off_days: 14,
}

const haytapDerived = deriveTierOptions(haytapConfig)
assert(haytapDerived?.tiers.length === 1, 'HAYTAP — tek tier')
assert(
  haytapDerived?.tiers[0].impactStatement?.includes('hayvan'),
  'HAYTAP — impact statement var',
)
assert(
  haytapDerived?.tiers[0].periodLabel === 'aylık',
  'HAYTAP — period "aylık"',
)

/* ─────────────────────────────────────────────────────────────
 *  5. ageRangeToAge + formatPriceDisplay
 * ───────────────────────────────────────────────────────────── */

console.log('\n— ageRangeToAge + format —')
assert(ageRangeToAge('18-24') === 21, '18-24 → 21 (ortalama)')
assert(ageRangeToAge('55+') === 55, '55+ → 55')
assert(ageRangeToAge(null) === undefined, 'null → undefined')
assert(ageRangeToAge(undefined) === undefined, 'undefined → undefined')
assert(ageRangeToAge('') === undefined, 'empty → undefined')

assert(formatPriceDisplay(256) === '₺256', '256 → ₺256')
assert(formatPriceDisplay(1500) === '₺1.500', '1500 → ₺1.500 (TR locale)')
assert(formatPriceDisplay(100, 'USD') === 'USD 100', '100 USD → USD 100')

/* ─────────────────────────────────────────────────────────────
 *  Sonuç
 * ───────────────────────────────────────────────────────────── */

console.log(`\n${'='.repeat(50)}`)
console.log(`PASSED: ${passed}  FAILED: ${failed}`)
if (failed > 0) {
  process.exit(1)
}
