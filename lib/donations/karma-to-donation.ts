// lib/donations/karma-to-donation.ts
//
// Vol-64: Karma → Bağış dönüşümü server action.
// Migration 061 redeem_karma_as_donation() RPC'sini çağırır (atomik: bakiye
// kontrol + donations insert + karma_transactions -karma). Anti-pattern olan
// iki-ayrı-client-insert (reward-detail-client) YERİNE tek RPC kullanılır.

'use server'

import { createClient } from '@/lib/supabase/server'
import { computeTryFromKarma, MIN_KARMA_FOR_DONATION } from './karma-formula'

export interface RedeemKarmaInput {
  ngoId: string
  campaignId?: string | null
  karma: number
}

export type RedeemKarmaResult =
  | {
      ok: true
      donationId: string
      karmaSpent: number
      amountTry: number
      karmaTotalBefore: number
      karmaTotalAfter: number
    }
  | { ok: false; error: string; code: 'AUTH' | 'MIN' | 'BALANCE' | 'NGO' | 'GENERIC' }

export async function redeemKarmaAsDonation(
  input: RedeemKarmaInput,
): Promise<RedeemKarmaResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Oturumun sona erdi.', code: 'AUTH' }

  const karma = Math.floor(Number(input.karma))
  if (!Number.isFinite(karma) || karma < MIN_KARMA_FOR_DONATION) {
    return { ok: false, error: `En az ${MIN_KARMA_FOR_DONATION} Karma gerekir.`, code: 'MIN' }
  }

  // Bakiye (before) — UI özeti + sağlamlık için
  const { data: before } = await supabase
    .from('profiles')
    .select('karma_total')
    .eq('id', user.id)
    .maybeSingle()
  const karmaTotalBefore = (before as { karma_total?: number } | null)?.karma_total ?? 0
  if (karmaTotalBefore < karma) {
    return { ok: false, error: 'Yeterli Karma yok.', code: 'BALANCE' }
  }

  // redeem_karma_as_donation Migration 061'de tanımlı; generated type'larda henüz
  // yok (TD-005 supabase types regen sonrası temizlenir) — codebase'in `as any` deseni.
  const { data: donationId, error } = await (supabase.rpc as unknown as (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: string | null; error: { message: string } | null }>)(
    'redeem_karma_as_donation',
    {
      p_ngo_id: input.ngoId,
      p_campaign_id: input.campaignId ?? null,
      p_karma: karma,
    },
  )

  if (error || !donationId) {
    const raw = error?.message ?? ''
    const c: 'BALANCE' | 'NGO' | 'MIN' | 'GENERIC' = raw.includes('BALANCE')
      ? 'BALANCE'
      : raw.includes('NGO') || raw.includes('CAMPAIGN')
        ? 'NGO'
        : raw.includes('MIN')
          ? 'MIN'
          : 'GENERIC'
    return {
      ok: false,
      error:
        c === 'BALANCE'
          ? 'Yeterli Karma yok.'
          : c === 'NGO'
            ? 'Kurum bulunamadı.'
            : c === 'MIN'
              ? `En az ${MIN_KARMA_FOR_DONATION} Karma gerekir.`
              : 'Bağış oluşturulamadı, tekrar dene.',
      code: c,
    }
  }

  return {
    ok: true,
    donationId,
    karmaSpent: karma,
    amountTry: computeTryFromKarma(karma),
    karmaTotalBefore,
    karmaTotalAfter: karmaTotalBefore - karma,
  }
}
