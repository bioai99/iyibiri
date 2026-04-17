import { createClient } from '../server'
import type { Mission, UserMission } from '../types'

export async function getAllMissions(): Promise<Mission[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('active', true)
    .order('featured', { ascending: false })
  if (error) throw error
  return data
}

export async function getMissionById(id: string): Promise<Mission | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*, ngos(*)')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getUserMissions(userId: string): Promise<UserMission[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_missions')
    .select('*, missions(*)')
    .eq('user_id', userId)
    .order('taken_at', { ascending: false })
  if (error) throw error
  return data
}

export async function takeMission(userId: string, missionId: string): Promise<UserMission> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_missions')
    .insert({ user_id: userId, mission_id: missionId, status: 'taken' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function completeMission(
  userMissionId: string,
  verificationData: Record<string, unknown>
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('user_missions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      verification_data: verificationData,
    })
    .eq('id', userMissionId)
  if (error) throw error
}
