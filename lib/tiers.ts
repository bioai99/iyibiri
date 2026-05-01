// lib/tiers.ts
//
// İyiBiri tier sistemi — TEK SOURCE OF TRUTH (canonical).
// ADR-014 Accepted (2026-04-26).
//
// Bu dosya dışında tier ismi/threshold hardcoded olamaz; ESLint custom rule
// (`no-magic-tier-name`) ile gelecekte enforce edilir.
//
// Set A naming + karma-tabanlı threshold. tier-badge.tsx ile uyumlu.

export interface Tier {
  id: 1 | 2 | 3 | 4 | 5
  name: string
  emoji: string
  /** Bu tier'a giriş için minimum karma. */
  minKarma: number
  /** Bir sonraki tier'a kadar ulaşılabilir karma. null = open-ended (üst tier). */
  maxKarma: number | null
  /** Atlas Bölüm 6 design system token referansı. */
  colorToken: string
}

export const TIERS: Tier[] = [
  { id: 1, name: 'İyi Biri',           emoji: '🌱', minKarma: 0,     maxKarma: 500,    colorToken: 'tierBronze'   },
  { id: 2, name: 'Çok İyi Biri',       emoji: '⭐', minKarma: 500,   maxKarma: 2000,   colorToken: 'tierSilver'   },
  { id: 3, name: 'Çoook İyi Biri',     emoji: '🌟', minKarma: 2000,  maxKarma: 5000,   colorToken: 'tierGold'     },
  { id: 4, name: 'Gerçekten İyi Biri', emoji: '🏆', minKarma: 5000,  maxKarma: 10000,  colorToken: 'tierPlatinum' },
  { id: 5, name: 'İyiliğin Öncüsü',    emoji: '👑', minKarma: 10000, maxKarma: null,   colorToken: 'tierDiamond'  },
]

/** Karma → tier (en doğal API). */
export function getTierByKarma(karma: number): Tier {
  for (const tier of TIERS) {
    if (karma >= tier.minKarma && (tier.maxKarma === null || karma < tier.maxKarma)) {
      return tier
    }
  }
  return TIERS[0]
}

/** Tier id → tier name (legacy `getTierName(level)` ile uyumluluk için). */
export function getTierName(tierId: number): string {
  return TIERS.find(t => t.id === tierId)?.name ?? TIERS[0].name
}

/** Bir sonraki tier (5 ise null). */
export function nextTier(currentTierId: 1 | 2 | 3 | 4 | 5): Tier | null {
  if (currentTierId === 5) return null
  return TIERS[currentTierId] ?? null
}

/** HeroCard / progress UI için snapshot. */
export interface KarmaProgress {
  currentTier: Tier
  nextTier: Tier | null
  /** Bir sonraki tier'a ne kadar karma kaldı (max tier'daysa 0). */
  karmaToNext: number
  /** 0..1 arası bir sonraki tier'a olan ilerleme. */
  progressRatio: number
}

export function karmaProgress(karma: number): KarmaProgress {
  const current = getTierByKarma(karma)
  const next = nextTier(current.id)
  const karmaToNext = next ? Math.max(0, next.minKarma - karma) : 0
  const tierRange = next ? next.minKarma - current.minKarma : 1
  const progressInTier = karma - current.minKarma
  const progressRatio = next ? Math.min(1, Math.max(0, progressInTier / tierRange)) : 1
  return { currentTier: current, nextTier: next, karmaToNext, progressRatio }
}
