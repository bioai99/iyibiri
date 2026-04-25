/**
 * Recommendation engine helpers — diversity guard + scoring
 * ADR: Prevent monotonous mission streams by diversifying domains
 *
 * Usage:
 * - Score missions by relevance (interests, member, location, featured)
 * - Take top-N candidates
 * - Interleave by domain to break same-category streaks
 * - Final slice returns final count (e.g., 5 for dashboard)
 */

/**
 * diversifyByDomain — Greedy interleave to avoid domain repetition
 *
 * Algorithm:
 * 1. Greedy pick: at each step, prefer item with different domain than previous
 * 2. Fallback: if all remaining have same domain, take first remaining (domain variety exhausted)
 * 3. Result: each position tries to differ from position-1, but respects scoring order
 *
 * Edge cases:
 * - Single item or empty: return as-is
 * - All same domain (e.g., TEMA only): fallback ensures stable output (no reordering)
 * - Mixed domains: spreads them naturally
 *
 * @param items — sorted array of items with optional domain field
 * @param maxPerStreak — max consecutive items allowed with same domain (default 1 = no duplicates)
 * @returns new array with domain diversity applied
 *
 * @example
 * const top10 = missions.slice(0, 10)
 * const diversified = diversifyByDomain(top10)
 * const final5 = diversified.slice(0, 5)
 */
export function diversifyByDomain<T extends { domain?: string | null }>(
  items: T[],
  maxPerStreak = 1, // 1 = no consecutive same domain
): T[] {
  if (items.length <= 1) return items

  const result: T[] = []
  const used = new Set<number>()

  // Greedy interleave
  while (used.size < items.length) {
    const lastDomain = result.length > 0 ? result[result.length - 1]?.domain : null

    // Try to find item with different domain
    let pickIndex = -1
    for (let i = 0; i < items.length; i++) {
      if (used.has(i)) continue
      const item = items[i]
      // Skip if same domain as previous (and we want no repeats)
      if (lastDomain && item.domain === lastDomain && maxPerStreak === 1) {
        continue
      }
      pickIndex = i
      break
    }

    // Fallback: if no different-domain item found, take any remaining
    if (pickIndex === -1) {
      for (let i = 0; i < items.length; i++) {
        if (!used.has(i)) {
          pickIndex = i
          break
        }
      }
    }

    if (pickIndex === -1) break // all items exhausted
    result.push(items[pickIndex])
    used.add(pickIndex)
  }

  return result
}
