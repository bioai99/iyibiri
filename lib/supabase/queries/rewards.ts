import { createClient } from '../server'
import type { Reward, RewardRedemption } from '../types'

export async function getAllRewards(): Promise<Reward[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('active', true)
    .order('karma_required', { ascending: true })
  if (error) throw error
  return data
}

export async function getUserRedemptions(userId: string): Promise<RewardRedemption[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reward_redemptions')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data
}
