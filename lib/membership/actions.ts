// lib/membership/actions.ts
//
// NGO üyelik server actions — mode-aware payment initiation + finalization.
// ADR-008 v2 3-modlu payment routing (marketplace / embedded / passthrough).
// Migration 010 → payment_mode + payment_processor + referrals attribution.
//
// Akış:
// 1. `initiateMembership(input)` — Tier/amount validate → referrals insert (pending) →
//    mode-aware payment session bilgisi dön:
//      - marketplace → iyzico Checkout Form iframe URL (server → iyzico API çağrısı)
//      - embedded    → PayTR / fonzip iframe URL
//      - passthrough → External URL + dönüş callback tagi
// 2. `confirmMembership(referralId, externalTxId?)` — Webhook veya redirect sonrası:
//    referrals.status = 'confirmed', ngo_memberships row'u oluştur, Karma ver.
// 3. `cancelMembership(referralId)` — Cayma hakkı (14 gün) veya ödeme başarısız.
//
// Not: Gerçek payment provider API çağrıları (iyzico REST, PayTR token flow,
// fonzip embed URL) ortam değişkenleri + Supabase Vault merchant key gerektirir.
// Bu modül STUB ENTEGRASYON noktalarını işaretler (`TODO: provider SDK`) ve
// development için "sandbox URL" döner. Production'da her işlev tamamlanacak.

'use server'

import { createClient } from '@/lib/supabase/server'
import type { Json, MembershipFeeConfig } from '@/lib/supabase/types'
import {
  resolveSelectedAmount,
  validateCustomAmount,
  validateTierSelection,
  ageRangeToAge,
} from './fee-config'

/* ─────────────────────────────────────────────────────────────
 *  Types
 * ───────────────────────────────────────────────────────────── */

export interface InitiateMembershipInput {
  ngoId: string
  /** age_tiered / annual / monthly / one_time mode için */
  tierId?: string
  /** donation_based mode için */
  customAmount?: number
  /** KVKK + sözleşme onayı — ikisi de true olmazsa reddet */
  kvkkConsent: boolean
  termsConsent: boolean
  /** Form alanları (varsa) */
  formData?: Record<string, string>
}

export type InitiateMembershipResult =
  | {
      ok: true
      referralId: string
      paymentMode: 'marketplace' | 'embedded' | 'passthrough'
      /** marketplace/embedded → iframe src URL; passthrough → redirect hedefi */
      paymentUrl: string
      processor: 'iyzico' | 'paytr' | 'fonzip' | 'custom' | 'none'
      amount: number
      periodLabel: string
      /** passthrough mode'da kullanıcı geri dönünce referralId ile confirm çağır */
      returnUrl: string
    }
  | {
      ok: false
      error: string
      code?:
        | 'AUTH_REQUIRED'
        | 'NGO_NOT_FOUND'
        | 'FEE_CONFIG_MISSING'
        | 'CONSENT_REQUIRED'
        | 'VALIDATION'
        | 'ALREADY_MEMBER'
        | 'INTERNAL'
    }

/* ─────────────────────────────────────────────────────────────
 *  Public: initiateMembership
 * ───────────────────────────────────────────────────────────── */

export async function initiateMembership(
  input: InitiateMembershipInput,
): Promise<InitiateMembershipResult> {
  // 1. Kimlik doğrulama
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Önce giriş yap.', code: 'AUTH_REQUIRED' }
  }

  // 2. KVKK + sözleşme onayı — hard gate
  if (!input.kvkkConsent || !input.termsConsent) {
    return {
      ok: false,
      error:
        'Devam etmek için KVKK aydınlatma metni ve üyelik sözleşmesi onayı zorunlu.',
      code: 'CONSENT_REQUIRED',
    }
  }

  // 3. NGO + fee config
  const { data: ngo, error: ngoErr } = await supabase
    .from('ngos')
    .select(
      'id, name, short_name, membership_fee_config, payment_mode, payment_processor, donation_url, membership_url, embed_config',
    )
    .eq('id', input.ngoId)
    .single()

  if (ngoErr || !ngo) {
    return { ok: false, error: 'Kuruluş bulunamadı.', code: 'NGO_NOT_FOUND' }
  }

  const config = ngo.membership_fee_config as MembershipFeeConfig | null
  if (!config) {
    return {
      ok: false,
      error: 'Bu kuruluşun üyelik yapısı henüz hazır değil.',
      code: 'FEE_CONFIG_MISSING',
    }
  }

  // 4. Zaten üye mi?
  const { data: existing } = await supabase
    .from('ngo_memberships')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('ngo_id', input.ngoId)
    .maybeSingle()

  if (existing && existing.status === 'active') {
    return {
      ok: false,
      error: 'Zaten bu kuruluşa üyesin.',
      code: 'ALREADY_MEMBER',
    }
  }

  // 5. Yaş + tier eşleşme (age_tiered için)
  const { data: profile } = await supabase
    .from('profiles')
    .select('age_range')
    .eq('id', user.id)
    .single()
  const userAge = ageRangeToAge(profile?.age_range ?? null)

  // 6. Mode-spesifik validation
  if (config.mode === 'donation_based') {
    if (input.customAmount === undefined) {
      return {
        ok: false,
        error: 'Bağış tutarı belirtilmedi.',
        code: 'VALIDATION',
      }
    }
    const v = validateCustomAmount(config, input.customAmount)
    if (!v.ok) return { ok: false, error: v.error, code: 'VALIDATION' }
  } else {
    if (!input.tierId) {
      return {
        ok: false,
        error: 'Üyelik seviyesi seçilmedi.',
        code: 'VALIDATION',
      }
    }
    const v = validateTierSelection(config, input.tierId, userAge)
    if (!v.ok) return { ok: false, error: v.error, code: 'VALIDATION' }
  }

  // 7. Final amount
  const resolved = resolveSelectedAmount(config, {
    tierId: input.tierId,
    customAmount: input.customAmount,
  })
  if (!resolved) {
    return { ok: false, error: 'Tutar hesaplanamadı.', code: 'VALIDATION' }
  }

  // 8. Referral row insert — pending
  const { data: referral, error: refErr } = await supabase
    .from('referrals')
    .insert({
      user_id: user.id,
      ngo_id: ngo.id,
      referral_type: 'membership',
      amount_try: resolved.amount,
      status: 'pending',
      metadata: {
        tier_id: input.tierId ?? null,
        custom_amount: input.customAmount ?? null,
        form_data: (input.formData ?? {}) as Json,
        consents: {
          kvkk: true,
          terms: true,
          consented_at: new Date().toISOString(),
        },
        mode: config.mode,
      } as Json,
    })
    .select('id')
    .single()

  if (refErr || !referral) {
    return {
      ok: false,
      error: 'Kayıt oluşturulamadı. Tekrar dener misin?',
      code: 'INTERNAL',
    }
  }

  // 9. Mode-aware payment session URL
  const periodLabelValue = derivePeriodLabelForMode(config, input.tierId)
  const returnUrl = `/dashboard/ngos/${ngo.id}/membership/success?ref=${referral.id}`

  const paymentUrl = await buildPaymentUrl({
    mode: ngo.payment_mode,
    processor: ngo.payment_processor,
    ngoId: ngo.id,
    ngoName: ngo.name,
    referralId: referral.id,
    amount: resolved.amount,
    donationUrl: ngo.donation_url ?? null,
    membershipUrl: ngo.membership_url ?? null,
    embedConfig: (ngo.embed_config as Record<string, unknown>) ?? {},
    returnUrl,
  })

  return {
    ok: true,
    referralId: referral.id,
    paymentMode: ngo.payment_mode,
    paymentUrl,
    processor: ngo.payment_processor,
    amount: resolved.amount,
    periodLabel: periodLabelValue,
    returnUrl,
  }
}

/* ─────────────────────────────────────────────────────────────
 *  Public: confirmMembership (webhook veya redirect callback)
 * ───────────────────────────────────────────────────────────── */

export async function confirmMembership(
  referralId: string,
  externalTransactionId?: string,
): Promise<
  | { ok: true; membershipId: string; karmaAwarded: number }
  | { ok: false; error: string }
> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Oturum gerekli.' }

  // 1. Referral bul
  const { data: referral, error: refErr } = await supabase
    .from('referrals')
    .select('id, ngo_id, user_id, status, metadata, amount_try')
    .eq('id', referralId)
    .eq('user_id', user.id)
    .single()

  if (refErr || !referral) return { ok: false, error: 'İşlem bulunamadı.' }
  if (referral.status === 'confirmed') {
    // Idempotent — zaten onaylanmış
    const { data: m } = await supabase
      .from('ngo_memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('ngo_id', referral.ngo_id)
      .single()
    return {
      ok: true,
      membershipId: m?.id ?? '',
      karmaAwarded: 0,
    }
  }

  // 2. Referral'ı confirmed'e çevir
  await supabase
    .from('referrals')
    .update({
      status: 'confirmed',
      external_transaction_id: externalTransactionId ?? null,
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', referralId)

  // 3. ngo_memberships kaydı oluştur
  const meta =
    (referral.metadata as Record<string, unknown> | null) ?? {}
  const formData =
    (meta.form_data as Record<string, string> | undefined) ?? {}

  const { data: membership, error: mErr } = await supabase
    .from('ngo_memberships')
    .insert({
      user_id: user.id,
      ngo_id: referral.ngo_id,
      status: 'active',
      tier: 'basic',
      form_data: formData,
      joined_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (mErr || !membership) {
    // Rollback olmaz — referral confirmed kaldı, kullanıcı tekrar deneyebilir
    return {
      ok: false,
      error: 'Üyelik kaydı oluşturulamadı. Destek ekibine ilet.',
    }
  }

  // 4. Karma bonus (+100)
  // Migration 012 karma_transactions.type enum 'ngo_membership' ekler.
  // Trigger `update_karma_total` (migration 001) profiles.karma_total'i otomatik artırır.
  const KARMA_MEMBERSHIP_BONUS = 100
  await supabase.from('karma_transactions').insert({
    user_id: user.id,
    amount: KARMA_MEMBERSHIP_BONUS,
    type: 'ngo_membership',
    reference_id: membership.id,
    description: `Üyelik: ${referral.ngo_id}`,
  })

  return {
    ok: true,
    membershipId: membership.id,
    karmaAwarded: KARMA_MEMBERSHIP_BONUS,
  }
}

/* ─────────────────────────────────────────────────────────────
 *  Public: cancelMembership (14 gün cayma hakkı)
 * ───────────────────────────────────────────────────────────── */

export async function cancelMembership(
  referralId: string,
  reason?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Oturum gerekli.' }

  const { data: referral } = await supabase
    .from('referrals')
    .select('id, status, created_at, user_id')
    .eq('id', referralId)
    .eq('user_id', user.id)
    .single()

  if (!referral) return { ok: false, error: 'İşlem bulunamadı.' }
  if (referral.status === 'cancelled')
    return { ok: false, error: 'Zaten iptal edilmiş.' }

  // 14 gün cayma penceresi
  const createdAt = new Date(referral.created_at)
  const now = new Date()
  const daysPassed =
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  if (daysPassed > 14) {
    return {
      ok: false,
      error:
        'Cayma süresi geçmiş (14 gün). STK ile iletişime geçerek iptal iste.',
    }
  }

  await supabase
    .from('referrals')
    .update({
      status: 'cancelled',
      metadata: { cancellation_reason: reason ?? null },
    })
    .eq('id', referralId)

  // TODO: processor refund API (iyzico/PayTR cancel endpoint)

  return { ok: true }
}

/* ─────────────────────────────────────────────────────────────
 *  Internal helpers
 * ───────────────────────────────────────────────────────────── */

function derivePeriodLabelForMode(
  config: MembershipFeeConfig,
  tierId?: string,
): string {
  if (config.mode === 'donation_based') return 'tek seferlik'
  const tier = config.tiers.find((t) => t.id === tierId) ?? config.tiers[0]
  switch (tier?.period) {
    case 'annual':
      return 'yıllık'
    case 'monthly':
      return 'aylık'
    case 'one_time':
      return 'tek seferlik'
    default:
      return 'yıllık'
  }
}

/**
 * Mode-aware payment URL.
 *
 * STUB: Sandbox URL'leri döner. Production'da:
 * - iyzico Marketplace: `POST /payment/iyzipos/checkoutform/initialize/sub-merchant/v2`
 * - PayTR: iframe token flow
 * - fonzip: `donation_url` + tracking param
 */
interface BuildPaymentUrlInput {
  mode: 'marketplace' | 'embedded' | 'passthrough'
  processor: 'iyzico' | 'paytr' | 'fonzip' | 'custom' | 'none'
  ngoId: string
  ngoName: string
  referralId: string
  amount: number
  donationUrl: string | null
  membershipUrl: string | null
  embedConfig: Record<string, unknown>
  returnUrl: string
}

async function buildPaymentUrl(input: BuildPaymentUrlInput): Promise<string> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const callbackUrl = `${base}${input.returnUrl}`
  const useSandbox =
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PUBLIC_PAYMENTS_SANDBOX === '1'

  // Mode 3: passthrough — STK'nın kendi URL'ine yönlendir
  if (input.mode === 'passthrough') {
    if (useSandbox) {
      // Dev: sandbox page passthrough variant
      return buildSandboxUrl(base, {
        ref: input.referralId,
        amount: input.amount,
        processor: input.processor,
        mode: 'passthrough',
        ngo: input.ngoName,
        callback: callbackUrl,
      })
    }
    const target =
      input.membershipUrl ?? input.donationUrl ?? input.returnUrl
    const url = new URL(target)
    url.searchParams.set('iyibiri_ref', input.referralId)
    url.searchParams.set('iyibiri_callback', callbackUrl)
    return url.toString()
  }

  // Mode 1: marketplace — iyzico Checkout Form
  if (input.mode === 'marketplace' && input.processor === 'iyzico') {
    if (useSandbox) {
      return buildSandboxUrl(base, {
        ref: input.referralId,
        amount: input.amount,
        processor: 'iyzico',
        mode: 'marketplace',
        ngo: input.ngoName,
        callback: callbackUrl,
      })
    }
    // TODO(prod): iyzico Checkout Form initialize — server-side SDK call
    throw new Error('iyzico marketplace production entegrasyonu eksik')
  }

  // Mode 2: embedded — PayTR iframe veya fonzip embed
  if (input.mode === 'embedded') {
    if (useSandbox) {
      return buildSandboxUrl(base, {
        ref: input.referralId,
        amount: input.amount,
        processor: input.processor,
        mode: 'embedded',
        ngo: input.ngoName,
        callback: callbackUrl,
      })
    }
    if (input.processor === 'paytr') {
      // TODO(prod): PayTR token + iframe URL
      throw new Error('PayTR production entegrasyonu eksik')
    }
    if (input.processor === 'fonzip' && input.donationUrl) {
      const url = new URL(input.donationUrl)
      url.searchParams.set('ref', input.referralId)
      url.searchParams.set('embed', '1')
      return url.toString()
    }
  }

  // Fallback — sandbox preview
  return buildSandboxUrl(base, {
    ref: input.referralId,
    amount: input.amount,
    processor: input.processor,
    mode: input.mode,
    ngo: input.ngoName,
    callback: callbackUrl,
  })
}

function buildSandboxUrl(
  base: string,
  params: {
    ref: string
    amount: number
    processor: string
    mode: string
    ngo: string
    callback: string
  },
): string {
  const url = new URL(`${base}/payments/sandbox`)
  url.searchParams.set('ref', params.ref)
  url.searchParams.set('amount', String(params.amount))
  url.searchParams.set('processor', params.processor)
  url.searchParams.set('mode', params.mode)
  url.searchParams.set('ngo', params.ngo)
  url.searchParams.set('callback', params.callback)
  return url.toString()
}
