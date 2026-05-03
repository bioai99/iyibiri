// lib/donations/actions.ts
//
// Vol-31.4 createDonation server action — V1 mock payment.
// Akış:
//   1. Validate (amount > 0, ngo exists, scenario_type)
//   2. Eğer regular_supporter → donation_subscriptions insert (status='intent')
//   3. donations insert (status='completed', tax_eligible = ngo.tax_exempt)
//   4. karma_transactions insert (formula: floor(amount/10), +20% regular_supporter bonus)
//   5. referrals insert (type='donation', status='confirmed')
//   6. Tier-up tespit (Vol-29 pattern: karma_total before/after diff)
//
// Real payment integration Vol-32+ (ADR-008 v2 hibrit).

'use server'

import { createClient } from '@/lib/supabase/server'
import type { DonationScenarioType } from '@/lib/supabase/types'
// Vol-62 BUG-067: karma formula tek source-of-truth (test edilebilir helper)
import { computeKarmaFromDonation } from './karma-formula'

// Vol-29 pattern — TIER_DATA ile aynı threshold
const TIER_THRESHOLDS = [0, 500, 2000, 5000, 10000] as const

function tierIdForKarma(karma: number): number {
  let id = 1
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (karma >= TIER_THRESHOLDS[i]) {
      id = i + 1
      break
    }
  }
  return id
}

export interface CreateDonationInput {
  ngoId: string
  amountTry: number
  scenarioType: DonationScenarioType
  campaignId?: string | null
  intentLabel?: string | null
  isAnonymous?: boolean
  receiptEmail?: string | null
  wantTaxReceipt?: boolean
}

export type CreateDonationResult =
  | {
      ok: true
      donationId: string
      subscriptionId: string | null
      karmaAwarded: number
      karmaTotalBefore: number
      karmaTotalAfter: number
      tierBefore: number
      tierAfter: number
      didTierUp: boolean
    }
  | { ok: false; error: string; code: 'AUTH' | 'NGO_NOT_FOUND' | 'INVALID_AMOUNT' | 'GENERIC' }

export async function createDonation(
  input: CreateDonationInput,
): Promise<CreateDonationResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Oturumun sona erdi.', code: 'AUTH' }
  }

  const amount = Number(input.amountTry)
  if (!isFinite(amount) || amount <= 0) {
    return { ok: false, error: 'Geçersiz tutar.', code: 'INVALID_AMOUNT' }
  }

  // NGO + tax_exempt kontrol
  const { data: ngo } = await supabase
    .from('ngos')
    .select('id, name, short_name, tax_exempt')
    .eq('id', input.ngoId)
    .maybeSingle()
  if (!ngo) {
    return { ok: false, error: 'Kurum bulunamadı.', code: 'NGO_NOT_FOUND' }
  }

  // Karma_total before
  const { data: profileBefore } = await supabase
    .from('profiles')
    .select('karma_total')
    .eq('id', user.id)
    .maybeSingle()
  const karmaTotalBefore =
    (profileBefore as { karma_total?: number } | null)?.karma_total ?? 0

  // 1. Regular supporter → donation_subscriptions insert
  let subscriptionId: string | null = null
  if (input.scenarioType === 'regular_supporter') {
    const { data: sub, error: subErr } = await supabase
      .from('donation_subscriptions')
      .insert({
        user_id: user.id,
        ngo_id: ngo.id,
        amount_try: amount,
        scenario_type: 'regular_supporter',
        status: 'intent', // V1 mock — backend cron yok
        metadata: { mock: true, source: 'donate_flow_v1' },
      })
      .select('id')
      .single()
    if (!subErr && sub) {
      subscriptionId = sub.id
    }
  }

  // 2. donations insert (status='completed' — V1 mock)
  const taxEligible = Boolean(ngo.tax_exempt) && Boolean(input.wantTaxReceipt ?? true)
  const { data: donation, error: donationErr } = await supabase
    .from('donations')
    .insert({
      user_id: user.id,
      ngo_id: ngo.id,
      campaign_id: input.campaignId ?? null,
      amount_try: amount,
      scenario_type: input.scenarioType,
      intent_label: input.intentLabel ?? null,
      is_recurring: input.scenarioType === 'regular_supporter',
      subscription_id: subscriptionId,
      status: 'completed',
      tax_eligible: taxEligible,
      receipt_email: input.receiptEmail ?? user.email ?? null,
      payment_method: 'mock_card',
      external_transaction_id: null,
      metadata: {
        mock: true,
        anonymous: Boolean(input.isAnonymous),
        source: 'donate_flow_v1',
      },
    })
    .select('id')
    .single()

  if (donationErr || !donation) {
    return {
      ok: false,
      error: donationErr?.message ?? 'Bağış kaydedilemedi.',
      code: 'GENERIC',
    }
  }

  // 3. Karma — Vol-62 BUG-067 fix: DB trigger devraldı (Migration 056 on_donation_completed).
  // Önceden burada manuel insert vardı ama donation_id set etmiyordu → her bağışta 2 satır:
  // 1 trigger'dan (donation_id dolu, doğru), 1 burada (donation_id NULL, duplicate).
  // Trigger artık tek source-of-truth. karmaAwarded UI return için hesaplanıyor;
  // formula app+trigger aynı: floor(amount/10) + 20% bonus regular_supporter.
  const karmaAwarded = computeKarmaFromDonation(amount, input.scenarioType)

  // 4. Referral attribution (ADR-008)
  await supabase.from('referrals').insert({
    user_id: user.id,
    ngo_id: ngo.id,
    referral_type: 'donation',
    amount_try: amount,
    status: 'confirmed',
    external_transaction_id: `mock-${donation.id}`,
    metadata: {
      mock: true,
      donation_id: donation.id,
      scenario: input.scenarioType,
    },
  })

  // 5. Karma_total after fetch + tier-up tespit (Vol-29 pattern)
  const { data: profileAfter } = await supabase
    .from('profiles')
    .select('karma_total')
    .eq('id', user.id)
    .maybeSingle()
  const karmaTotalAfter =
    (profileAfter as { karma_total?: number } | null)?.karma_total ??
    karmaTotalBefore + karmaAwarded
  const tierBefore = tierIdForKarma(karmaTotalBefore)
  const tierAfter = tierIdForKarma(karmaTotalAfter)

  return {
    ok: true,
    donationId: donation.id,
    subscriptionId,
    karmaAwarded,
    karmaTotalBefore,
    karmaTotalAfter,
    tierBefore,
    tierAfter,
    didTierUp: tierAfter > tierBefore,
  }
}
