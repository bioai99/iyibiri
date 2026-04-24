// lib/karma-level.ts
//
// Karma → level → tier name helper.
// Basit, deterministic kural: 500 Karma = 1 level (daha sonra dynamic XP curve'ü ile değiştirilebilir).
// TIERS tanımı `lib/mock-data.ts`'ten referans alınır — tek source of truth.

import { TIERS, getTierName } from './mock-data'

export const KARMA_PER_LEVEL = 500

/** Karma → level number (1-indexed). Minimum level 1. */
export function levelFromKarma(karma: number): number {
  return Math.max(1, Math.floor(karma / KARMA_PER_LEVEL) + 1)
}

/** Level → minimum Karma gereken. */
export function karmaForLevel(level: number): number {
  return (level - 1) * KARMA_PER_LEVEL
}

/** Bir sonraki tier'ın başlangıç level'ı. Son tier'daysa null. */
export function nextTier(currentLevel: number): { name: string; minLevel: number } | null {
  const currentTierIdx = TIERS.findIndex(
    (t) => currentLevel >= t.minLevel && currentLevel <= t.maxLevel,
  )
  if (currentTierIdx === -1 || currentTierIdx === TIERS.length - 1) return null
  const next = TIERS[currentTierIdx + 1]
  return { name: next.name, minLevel: next.minLevel }
}

/** HeroCardV2 için hazır snapshot. */
export function karmaProgress(karma: number) {
  const level = levelFromKarma(karma)
  const tierName = getTierName(level)
  const nt = nextTier(level)

  return {
    level,
    tierName,
    nextTierName: nt?.name ?? null,
    nextTierAt: nt ? karmaForLevel(nt.minLevel) : null,
  }
}
