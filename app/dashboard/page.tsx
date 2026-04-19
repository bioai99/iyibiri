import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getAllMissions, getUserMissions } from '@/lib/supabase/queries/missions'
import { DashboardClient } from './dashboard-client'
import type { NGO } from '@/lib/supabase/types'

async function getNGOs(): Promise<NGO[]> {
  const supabase = createClient()
  const { data } = await supabase.from('ngos').select('*').limit(10)
  return data ?? []
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, missions, userMissions, ngos, savedMissionsResult, membershipsResult] = await Promise.all([
    getProfile(user.id),
    getAllMissions(),
    getUserMissions(user.id),
    getNGOs(),
    supabase.from('user_saved_missions').select('mission_id').eq('user_id', user.id),
    supabase.from('ngo_memberships').select('ngo_id').eq('user_id', user.id).eq('status', 'active'),
  ])

  if (!profile) redirect('/onboarding')

  const savedMissionIds = (savedMissionsResult.data ?? []).map(s => s.mission_id)
  const memberNgoIds = (membershipsResult.data ?? []).map(m => m.ngo_id)

  return (
    <DashboardClient
      profile={profile}
      missions={missions}
      userMissions={userMissions}
      ngos={ngos}
      savedMissionIds={savedMissionIds}
      memberNgoIds={memberNgoIds}
    />
  )
}
