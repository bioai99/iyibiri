import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getAllMissions, getUserMissions } from '@/lib/supabase/queries/missions'
import { getRecentStreakActivity } from '@/lib/supabase/queries/streak'
import { DashboardClient } from './dashboard-client'
import type { NGO, MissionWithNGO, UserMission } from '@/lib/supabase/types'

async function getNGOs(): Promise<NGO[]> {
  const supabase = createClient()
  const { data } = await supabase.from('ngos').select('*').limit(10)
  return data ?? []
}

async function getWeeklyKarmaGain(userId: string): Promise<number> {
  const supabase = createClient()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const { data } = await supabase
    .from('karma_transactions')
    .select('amount')
    .eq('user_id', userId)
    .gte('created_at', sevenDaysAgo.toISOString())
  if (!data) return 0
  return data.reduce((sum, row) => sum + (row.amount ?? 0), 0)
}

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [
    profile,
    missions,
    userMissions,
    ngos,
    savedMissionsResult,
    membershipsResult,
    weeklyKarmaGain,
    streakActivity,
  ] = await Promise.all([
    getProfile(user.id),
    getAllMissions(),
    getUserMissions(user.id),
    getNGOs(),
    supabase
      .from('user_saved_missions')
      .select('mission_id')
      .eq('user_id', user.id),
    supabase
      .from('ngo_memberships')
      .select('ngo_id')
      .eq('user_id', user.id)
      .eq('status', 'active'),
    getWeeklyKarmaGain(user.id),
    getRecentStreakActivity(user.id, 7),
  ])

  if (!profile) redirect('/onboarding')

  const savedMissionIds = (savedMissionsResult.data ?? []).map(
    (s) => s.mission_id,
  )
  const memberNgoIds = (membershipsResult.data ?? []).map((m) => m.ngo_id)

  const userActiveMissions: UserMission[] = userMissions
    .filter((um) => um.status === 'taken' || um.status === 'completed')
    .slice(0, 10)

  const activeMissionIds = new Set(
    userActiveMissions.map((um) => um.mission_id),
  )
  const activeMissionsWithNGO: MissionWithNGO[] = missions.filter((m) =>
    activeMissionIds.has(m.id),
  )

  const takenOrCompletedIds = new Set(
    userMissions
      .filter((um) => um.status === 'taken' || um.status === 'completed')
      .map((um) => um.mission_id),
  )

  const interests: string[] = Array.isArray(profile.interests)
    ? (profile.interests as string[])
    : []
  const profileCity: string = (profile.city ?? '').toLowerCase()

  // K4: Calculate selection reason for daily mission featured card
  function getSelectionReason(mission: MissionWithNGO): string {
    const reasons: string[] = []

    // Check if mission is near user's city
    if (
      profileCity &&
      mission.location &&
      mission.location.toLowerCase().includes(profileCity)
    ) {
      reasons.push('yakın')
    }

    // Check if mission is short-term (≤120 min = 2 hours)
    // duration is string like "60", "120", etc.
    if (mission.duration) {
      const durationMin = parseInt(mission.duration, 10)
      if (!isNaN(durationMin) && durationMin <= 120) {
        reasons.push('kısa-süreli')
      }
    }

    // Priority: yakın > kısa-süreli > default
    if (reasons.includes('yakın')) return 'yakın'
    if (reasons.includes('kısa-süreli')) return 'kısa-süreli'
    return 'sana öneriyoruz'
  }

  const recommendedMissions: MissionWithNGO[] = missions
    .filter((m) => !takenOrCompletedIds.has(m.id))
    .filter((m) => m.status !== 'cancelled' && m.status !== 'draft')
    .map((m) => {
      let score = 0
      if (m.ngo_id && memberNgoIds.includes(m.ngo_id)) score += 100
      if (m.domain && interests.includes(m.domain)) score += 50
      if (
        profileCity &&
        m.location &&
        m.location.toLowerCase().includes(profileCity)
      )
        score += 25
      if (m.featured) score += 10
      return { mission: m, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ mission }) => mission)

  // K4: Determine featured mission selection reason
  const featuredMissionSelectionReason = recommendedMissions.length > 0
    ? getSelectionReason(recommendedMissions[0])
    : 'sana öneriyoruz'

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
      weeklyKarmaGain={weeklyKarmaGain}
      streakActivity={streakActivity}
      featuredMissionSelectionReason={featuredMissionSelectionReason}
    />
  )
}
