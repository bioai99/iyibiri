import { describe, it, expect } from 'vitest'
import { KARMA_PER_LEVEL, levelFromKarma, karmaForLevel, karmaProgress } from './karma-level'

describe('lib/karma-level', () => {
  it('KARMA_PER_LEVEL = 500', () => {
    expect(KARMA_PER_LEVEL).toBe(500)
  })

  describe('levelFromKarma', () => {
    it('0 karma → level 1', () => {
      expect(levelFromKarma(0)).toBe(1)
    })

    it('499 karma → level 1', () => {
      expect(levelFromKarma(499)).toBe(1)
    })

    it('500 karma → level 2', () => {
      expect(levelFromKarma(500)).toBe(2)
    })

    it('2500 karma → level 6', () => {
      expect(levelFromKarma(2500)).toBe(6)
    })

    it('negative karma → level 1 (defensive)', () => {
      expect(levelFromKarma(-100)).toBe(1)
    })
  })

  describe('karmaForLevel', () => {
    it('level 1 → 0 karma', () => {
      expect(karmaForLevel(1)).toBe(0)
    })

    it('level 5 → 2000 karma', () => {
      expect(karmaForLevel(5)).toBe(2000)
    })
  })

  describe('karmaProgress (legacy snapshot)', () => {
    it('1500 karma → level 4, tier 2 (Çok İyi Biri)', () => {
      const p = karmaProgress(1500)
      expect(p.level).toBe(4)
      expect(p.tierName).toBe('Çok İyi Biri') // ADR-014: tier 2 (500-2000 karma)
      expect(p.nextTierName).toBe('Çoook İyi Biri') // tier 3
      expect(p.nextTierAt).toBe(2000)
    })

    it('15000 karma → tier 5, no next', () => {
      const p = karmaProgress(15000)
      expect(p.tierName).toBe('İyiliğin Öncüsü')
      expect(p.nextTierName).toBeNull()
      expect(p.nextTierAt).toBeNull()
    })
  })
})
