// lib/karma-level.ts
//
// Karma → level → tier helper.
// Basit, deterministic kural: 500 Karma = 1 level.
// TIERS canonical → `lib/tiers.ts` (ADR-014 Accepted 2026-04-26).
//
// Bu dosya level kavramını tier kavramından ayrı tutar — level her 500 karma
// (orta tutarda artış), tier ise 5 grup (geniş tutarda kategori).

import { TIERS, getTierByKarma, nextTier as nextTierByKarma } from './tiers'

export const KARMA_PER_LEVEL = 500

/** Karma → level number (1-indexed). Minimum level 1. */
export function levelFromKarma(karma: number): number {
  return Math.max(1, Math.floor(karma / KARMA_PER_LEVEL) + 1)
}

/** Level → minimum Karma gereken. */
export function karmaForLevel(level: number): number {
  return (level - 1) * KARMA_PER_LEVEL
}

/**
 * Bir sonraki tier'ın başlangıç karması ve ismi.
 * Max tier'daysa null.
 *
 * @param currentLevel - Kullanıcının mevcut level'ı (legacy parametre).
 *
 * @deprecated Karma-tabanlı API tercih edilir; bu fonksiyon
 * `lib/tiers.ts` `nextTier(tierId)` ile uyum için tutuluyor.
 */
export function nextTier(currentLevel: number): { name: string; minLevel: number } | null {
  const karma = karmaForLevel(currentLevel)
  const currentTier = getTierByKarma(karma)
  const next = nextTierByKarma(currentTier.id)
  if (!next) return null
  return {
    name: next.name,
    minLevel: levelFromKarma(next.minKarma) + 1, // legacy: tier'ın başlangıç level'ı
  }
}

/** HeroCardV2 için hazır snapshot. */
export function karmaProgress(karma: number) {
  const level = levelFromKarma(karma)
  const tier = getTierByKarma(karma)
  const next = nextTierByKarma(tier.id)

  return {
    level,
    tierName: tier.name,
    nextTierName: next?.name ?? null,
    nextTierAt: next?.minKarma ?? null,
  }
}

// TIERS re-export — geriye dönük uyum (lib/mock-data.ts eskiden TIERS export ediyordu).
// Yeni callsite'lar `lib/tiers.ts`'ten import etmeli.
export { TIERS }
