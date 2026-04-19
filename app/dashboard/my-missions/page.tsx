import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import type { MissionWithNGO } from '@/lib/supabase/types'
import MyMissionsClient from './my-missions-client'

export default async function MyMissionsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const profile = await getProfile(user.id)
  if (!profile) redirect('/onboarding')

  // Fetch user_missions with joined mission + ngo data
  const [
    takenResult,
    completedResult,
    savedMissionsResult,
    membershipsResult,
  ] = await Promise.all([
    supabase
      .from('user_missions')
      .select('*, missions(*, ngos(id, name, short_name, logo_url, color_accent, cover_image_url))')
      .eq('user_id', user.id)
      .eq('status', 'taken')
      .order('taken_at', { ascending: false }),
    supabase
      .from('user_missions')
      .select('*, missions(*, ngos(id, name, short_name, logo_url, color_accent, cover_image_url))')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false }),
    supabase
      .from('user_saved_missions')
      .select('mission_id')
      .eq('user_id', user.id),
    supabase
      .from('ngo_memberships')
      .select('ngo_id')
      .eq('user_id', user.id)
      .eq('status', 'active'),
  ])

  type UserMissionRow = {
    id: string
    user_id: string
    mission_id: string
    status: 'taken' | 'completed'
    taken_at: string
    completed_at: string | null
    karma_awarded: number | null
    missions: MissionWithNGO
  }

  const activeMissions: MissionWithNGO[] = ((takenResult.data ?? []) as unknown as UserMissionRow[])
    .map(um => um.missions)
    .filter(Boolean)

  const completedMissions: MissionWithNGO[] = ((completedResult.data ?? []) as unknown as UserMissionRow[])
    .map(um => um.missions)
    .filter(Boolean)

  const savedMissionIds = (savedMissionsResult.data ?? []).map(s => s.mission_id)
  const memberNgoIds = (membershipsResult.data ?? []).map(m => m.ngo_id)

  return (
    <MyMissionsClient
      activeMissions={activeMissions}
      completedMissions={completedMissions}
      savedMissionIds={savedMissionIds}
      memberNgoIds={memberNgoIds}
      userId={user.id}
    />
  )
}
