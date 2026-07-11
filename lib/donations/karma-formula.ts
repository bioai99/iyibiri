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

// ── Vol-64: Karma → Bağış (ters yön) ────────────────────────────────
//
// Kullanıcı biriktirdiği Karma'yı bir STK'ya bağışa çevirir; gerçek TL
// katkısını sponsor fonu karşılar (kullanıcı para ödemez — araştırma
// raporundaki "Karma→bağış crowding-out'u sıfırlıyor" tezi).
//
// ÜRÜN KARARI — dönüşüm oranı: 10 Karma = ₺1 (0.10 ₺/Karma).
// Bu sabit ekonomik bir kaldıraçtır; sponsor bütçesine göre ayarlanabilir.
// CRITICAL: Değişirse Migration 061 redeem_karma_as_donation() içindeki
// v_rate ile birebir eşleşmeli (yoksa önizleme ↔ DB tutarsız olur).
export const KARMA_TO_TRY_RATE = 0.1

/** Karma'ya karşılık bağışlanacak TL tutarını hesaplar (2 ondalık). */
export function computeTryFromKarma(karma: number): number {
  if (!isFinite(karma) || karma <= 0) return 0
  return Math.round(karma * KARMA_TO_TRY_RATE * 100) / 100
}

/** Karma→bağış için minimum Karma eşiği (₺1 alt sınırı ile uyumlu). */
export const MIN_KARMA_FOR_DONATION = 100
