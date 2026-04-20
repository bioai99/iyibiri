import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getAllMissions, getUserMissions } from '@/lib/supabase/queries/missions'
import { DashboardClient } from './dashboard-client'
import type { NGO, MissionWithNGO, UserMission } from '@/lib/supabase/types'

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

  // User active missions (taken or completed), capped at 10
  const userActiveMissions: UserMission[] = userMissions
    .filter(um => um.status === 'taken' || um.status === 'completed')
    .slice(0, 10)

  const activeMissionIds = new Set(userActiveMissions.map(um => um.mission_id))
  const activeMissionsWithNGO: MissionWithNGO[] = missions.filter(m => activeMissionIds.has(m.id))

  // Recommendation scoring — exclude missions already taken/completed
  const takenOrCompletedIds = new Set(
    userMissions
      .filter(um => um.status === 'taken' || um.status === 'completed')
      .map(um => um.mission_id)
  )

  const interests: string[] = Array.isArray(profile.interests) ? (profile.interests as string[]) : []
  const profileCity: string = (profile.city ?? '').toLowerCase()

  const recommendedMissions: MissionWithNGO[] = missions
    .filter(m => !takenOrCompletedIds.has(m.id))
    .map(m => {
      let score = 0
      if (memberNgoIds.includes(m.ngo_id)) score += 100
      if (m.domain && interests.includes(m.domain)) score += 50
      if (profileCity && m.location && m.location.toLowerCase().includes(profileCity)) score += 25
      if (m.is_featured) score += 10
      return { mission: m, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ mission }) => mission)

  return (
    <DashboardClient
      profile={profile}
      missions={missions}
      userMissions={userMissions}
      ngos={ngos}
      savedMissionIds={savedMissionIds}
      memberNgoIds={memberNgoIds}
      recommendedMissions={recommendedMissions}
      userActiveMissions={userActiveMissions}
      activeMissionsWithNGO={activeMissionsWithNGO}
    />
  )
}
