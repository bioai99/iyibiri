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

export function getKarmaLevel(karma: number): { level: number; title: string; nextThreshold: number } {
  if (karma < 500) return { level: 1, title: 'İyi Biri', nextThreshold: 500 }
  if (karma < 1500) return { level: 2, title: 'Çok İyi Biri', nextThreshold: 1500 }
  if (karma < 3000) return { level: 3, title: 'Gerçekten İyi Biri', nextThreshold: 3000 }
  return { level: 4, title: 'İyiliğin Öncüsü', nextThreshold: Infinity }
}
