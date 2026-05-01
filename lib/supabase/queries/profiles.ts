import { createClient } from '../server'
import type { Profile } from '../types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function updateProfile(
  userId: string,
  updates: { name?: string; avatar_url?: string }
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  if (error) throw error
}

// ADR-014 Accepted (2026-04-26): tier sistemi `lib/tiers.ts` canonical.
// Eski 4-tier farklı eşik (500/1500/3000) drift'ti — şimdi 5-tier (500/2000/5000/10000).
import { getTierByKarma, type Tier } from '@/lib/tiers'

export function getKarmaLevel(karma: number): { level: Tier['id']; title: string; nextThreshold: number } {
  const tier = getTierByKarma(karma)
  return {
    level: tier.id,
    title: tier.name,
    nextThreshold: tier.maxKarma ?? Infinity,
  }
}
