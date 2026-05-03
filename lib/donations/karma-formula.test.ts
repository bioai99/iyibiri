// Vol-62 BUG-067 regression: karma formula DB trigger ile uyumlu kalmalı.
// Migration 056 handle_donation_karma_trigger değişirse buradaki test çakışır
// → bilinçli güncelleme zorla.

import { describe, it, expect } from 'vitest'
import { computeKarmaFromDonation } from './karma-formula'

describe('lib/donations/karma-formula', () => {
  describe('one_time scenario', () => {
    it('5 TL → 0 karma (floor)', () => {
      expect(computeKarmaFromDonation(5, 'one_time')).toBe(0)
    })

    it('10 TL → 1 karma', () => {
      expect(computeKarmaFromDonation(10, 'one_time')).toBe(1)
    })

    it('99 TL → 9 karma (floor)', () => {
      expect(computeKarmaFromDonation(99, 'one_time')).toBe(9)
    })

    it('100 TL → 10 karma', () => {
      expect(computeKarmaFromDonation(100, 'one_time')).toBe(10)
    })

    it('1.000 TL → 100 karma', () => {
      expect(computeKarmaFromDonation(1000, 'one_time')).toBe(100)
    })
  })

  describe('regular_supporter scenario (+20% bonus)', () => {
    it('100 TL → 12 karma (10 base + 2 bonus floor)', () => {
      // base = floor(100/10) = 10, bonus = floor(10 * 0.2) = 2 → 12
      expect(computeKarmaFromDonation(100, 'regular_supporter')).toBe(12)
    })

    it('50 TL → 6 karma (5 base + 1 bonus floor)', () => {
      // base = 5, bonus = floor(5 * 0.2) = 1 → 6
      expect(computeKarmaFromDonation(50, 'regular_supporter')).toBe(6)
    })

    it('10 TL → 1 karma (1 base + floor(0.2) = 0 bonus)', () => {
      // base = 1, bonus = floor(0.2) = 0 → 1
      expect(computeKarmaFromDonation(10, 'regular_supporter')).toBe(1)
    })

    it('1.000 TL → 120 karma (100 + 20)', () => {
      expect(computeKarmaFromDonation(1000, 'regular_supporter')).toBe(120)
    })
  })

  describe('gift / memorial scenarios (one_time gibi)', () => {
    it('gift 100 TL → 10 karma (no bonus)', () => {
      expect(computeKarmaFromDonation(100, 'gift')).toBe(10)
    })

    it('memorial 250 TL → 25 karma (no bonus)', () => {
      expect(computeKarmaFromDonation(250, 'memorial')).toBe(25)
    })
  })

  describe('edge cases', () => {
    it('0 TL → 0 karma', () => {
      expect(computeKarmaFromDonation(0, 'one_time')).toBe(0)
    })

    it('negatif → 0 karma', () => {
      expect(computeKarmaFromDonation(-50, 'one_time')).toBe(0)
    })

    it('NaN → 0 karma', () => {
      expect(computeKarmaFromDonation(NaN, 'one_time')).toBe(0)
    })

    it('Infinity → 0 karma', () => {
      expect(computeKarmaFromDonation(Infinity, 'one_time')).toBe(0)
    })

    it('decimal 99.9 TL → 9 karma (floor)', () => {
      expect(computeKarmaFromDonation(99.9, 'one_time')).toBe(9)
    })
  })

  describe('Vol-62 BUG-067 lock: trigger formula parity', () => {
    // Migration 056 trigger ile birebir uyumlu olduğunu lock'la.
    // Trigger: karma = floor(amount/10); if is_recurring → floor(karma * 1.2)
    const cases: Array<[number, DonationScenarioType, number]> = [
      [10, 'one_time', 1],
      [10, 'regular_supporter', 1], // base=1, bonus=floor(0.2)=0
      [50, 'one_time', 5],
      [50, 'regular_supporter', 6],
      [75, 'one_time', 7],          // Pkg-2 live verify Karma:+7 doğrulaması
      [100, 'one_time', 10],
      [100, 'regular_supporter', 12],
      [250, 'one_time', 25],
      [500, 'one_time', 50],
      [500, 'regular_supporter', 60],
    ]

    for (const [amount, scenario, expected] of cases) {
      it(`${amount} TL × ${scenario} → ${expected} karma`, () => {
        expect(computeKarmaFromDonation(amount, scenario)).toBe(expected)
      })
    }
  })
})

// Test imports için type lint'i sustur
type DonationScenarioType = 'one_time' | 'regular_supporter' | 'gift' | 'memorial'
