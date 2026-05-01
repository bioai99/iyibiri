import { describe, it, expect } from 'vitest'
import { TIERS, getTierByKarma, getTierName, nextTier, karmaProgress } from './tiers'

describe('lib/tiers', () => {
  describe('TIERS canonical list', () => {
    it('5 tier tanımlı', () => {
      expect(TIERS).toHaveLength(5)
    })

    it('tier id sırası 1-5', () => {
      expect(TIERS.map(t => t.id)).toEqual([1, 2, 3, 4, 5])
    })

    it('Set A naming (ADR-014)', () => {
      expect(TIERS.map(t => t.name)).toEqual([
        'İyi Biri',
        'Çok İyi Biri',
        'Çoook İyi Biri',
        'Gerçekten İyi Biri',
        'İyiliğin Öncüsü',
      ])
    })

    it('threshold 500/2000/5000/10000', () => {
      expect(TIERS.map(t => t.minKarma)).toEqual([0, 500, 2000, 5000, 10000])
      expect(TIERS[4].maxKarma).toBeNull() // tier 5 open-ended
    })
  })

  describe('getTierByKarma', () => {
    it('0 karma → tier 1', () => {
      expect(getTierByKarma(0).id).toBe(1)
      expect(getTierByKarma(0).name).toBe('İyi Biri')
    })

    it('499 karma → tier 1', () => {
      expect(getTierByKarma(499).id).toBe(1)
    })

    it('500 karma → tier 2', () => {
      expect(getTierByKarma(500).id).toBe(2)
      expect(getTierByKarma(500).name).toBe('Çok İyi Biri')
    })

    it('2000 karma → tier 3', () => {
      expect(getTierByKarma(2000).id).toBe(3)
      expect(getTierByKarma(2000).name).toBe('Çoook İyi Biri')
    })

    it('5000 karma → tier 4', () => {
      expect(getTierByKarma(5000).id).toBe(4)
      expect(getTierByKarma(5000).name).toBe('Gerçekten İyi Biri')
    })

    it('10000 karma → tier 5', () => {
      expect(getTierByKarma(10000).id).toBe(5)
      expect(getTierByKarma(10000).name).toBe('İyiliğin Öncüsü')
    })

    it('99999 karma → tier 5 (open-ended)', () => {
      expect(getTierByKarma(99999).id).toBe(5)
    })

    it('negative karma → tier 1 (defensive)', () => {
      expect(getTierByKarma(-100).id).toBe(1)
    })
  })

  describe('getTierName', () => {
    it('tier id → name', () => {
      expect(getTierName(1)).toBe('İyi Biri')
      expect(getTierName(5)).toBe('İyiliğin Öncüsü')
    })

    it('invalid id → fallback tier 1', () => {
      expect(getTierName(99)).toBe('İyi Biri')
    })
  })

  describe('nextTier', () => {
    it('tier 1 → tier 2', () => {
      expect(nextTier(1)?.id).toBe(2)
    })

    it('tier 4 → tier 5', () => {
      expect(nextTier(4)?.id).toBe(5)
    })

    it('tier 5 → null (max)', () => {
      expect(nextTier(5)).toBeNull()
    })
  })

  describe('karmaProgress', () => {
    it('250 karma → tier 1, ~%50 progress', () => {
      const p = karmaProgress(250)
      expect(p.currentTier.id).toBe(1)
      expect(p.nextTier?.id).toBe(2)
      expect(p.karmaToNext).toBe(250)
      expect(p.progressRatio).toBeCloseTo(0.5, 2)
    })

    it('6500 karma → tier 4, %30 progress', () => {
      const p = karmaProgress(6500)
      expect(p.currentTier.id).toBe(4)
      expect(p.currentTier.name).toBe('Gerçekten İyi Biri')
      expect(p.nextTier?.id).toBe(5)
      expect(p.karmaToNext).toBe(3500)
      expect(p.progressRatio).toBeCloseTo(0.3, 2)
    })

    it('15000 karma → tier 5, %100 (max tier)', () => {
      const p = karmaProgress(15000)
      expect(p.currentTier.id).toBe(5)
      expect(p.nextTier).toBeNull()
      expect(p.karmaToNext).toBe(0)
      expect(p.progressRatio).toBe(1)
    })
  })
})
