import { createClient } from '../server'
import type { KarmaTransaction } from '../types'

export async function addKarmaTransaction(
  userId: string,
  amount: number,
  type: 'mission_complete' | 'reward_redemption',
  referenceId: string,
  description: string
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('karma_transactions')
    .insert({ user_id: userId, amount, type, reference_id: referenceId, description })
  if (error) throw error
}

export async function getKarmaHistory(userId: string): Promise<KarmaTransaction[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('karma_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data
}

export async function redeemReward(
  userId: string,
  rewardId: string,
  karmaRequired: number,
  currentKarma: number
): Promise<{ success: boolean; error?: string }> {
  if (currentKarma < karmaRequired) {
    return { success: false, error: 'Yeterli karma yok' }
  }
  const supabase = createClient()

  const { error: redemptionError } = await supabase
    .from('reward_redemptions')
    .insert({ user_id: userId, reward_id: rewardId, karma_spent: karmaRequired })
  if (redemptionError) return { success: false, error: redemptionError.message }

  const { error: karmaError } = await supabase
    .from('karma_transactions')
    .insert({
      user_id: userId,
      amount: -karmaRequired,
      type: 'reward_redemption',
      reference_id: rewardId,
      description: 'Ödül kullanımı',
    })
  if (karmaError) return { success: false, error: karmaError.message }

  return { success: true }
}
