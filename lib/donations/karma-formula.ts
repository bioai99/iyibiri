// lib/donations/karma-formula.ts
//
// Vol-62 BUG-067 follow-up: Donation karma formula tek source-of-truth helper'ı.
// Daha önce actions.ts içinde local function'dı; test edilebilir + import edilebilir
// olsun diye buraya taşındı. DB trigger (Migration 056) ile birebir aynı formül:
//   karma = floor(amount_try / 10)
//   if is_recurring (regular_supporter): karma = floor(karma * 1.2)
//   if karma < 0: karma = 0
//
// CRITICAL: Bu dosya değişirse Migration 056 trigger handle_donation_karma_trigger()
// güncellenmeli (yoksa frontend preview ↔ DB karma uyumsuz olur — kullanıcı şikayeti).

import type { DonationScenarioType } from '@/lib/supabase/types'

/**
 * Bir bağış tutarına karşılık verilecek karma miktarını hesaplar.
 *
 * @param amountTry  TL cinsinden bağış tutarı (≥ 0)
 * @param scenario   'one_time' | 'regular_supporter' | 'gift' | 'memorial' …
 * @returns          Pozitif tam sayı karma (5 TL → 0 karma, 10 TL → 1 karma)
 */
export function computeKarmaFromDonation(
  amountTry: number,
  scenario: DonationScenarioType,
): number {
  if (!isFinite(amountTry) || amountTry <= 0) return 0
  const base = Math.floor(amountTry / 10)
  const bonus = scenario === 'regular_supporter' ? Math.floor(base * 0.2) : 0
  return Math.max(0, base + bonus)
}
