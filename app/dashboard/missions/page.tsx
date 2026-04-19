import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllMissions, getUserMissions } from '@/lib/supabase/queries/missions'
import { MissionsClient } from './missions-client'

export default async function MissionsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [missions, userMissions, savedMissionsResult, membershipsResult] = await Promise.all([
    getAllMissions(),
    getUserMissions(user.id),
    supabase.from('user_saved_missions').select('mission_id').eq('user_id', user.id),
    supabase.from('ngo_memberships').select('ngo_id').eq('user_id', user.id).eq('status', 'active'),
  ])

  const savedMissionIds = (savedMissionsResult.data ?? []).map((s: any) => s.mission_id)
  const memberNgoIds = (membershipsResult.data ?? []).map((m: any) => m.ngo_id)

  return <MissionsClient missions={missions} userMissions={userMissions} savedMissionIds={savedMissionIds} memberNgoIds={memberNgoIds} userId={user.id} />
}
