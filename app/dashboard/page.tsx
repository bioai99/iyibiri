import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getAllMissions, getUserMissions } from '@/lib/supabase/queries/missions'
import { getRecentStreakActivity } from '@/lib/supabase/queries/streak'
import { getRecentNgoPosts, getRecentSponsorPosts } from '@/lib/supabase/queries/posts'
import { diversifyByDomain } from '@/lib/recommendations'
import { DashboardClient } from './dashboard-client'
import type {
  NGO,
  MissionWithNGO,
  UserMission,
  PostWithAuthor,
} from '@/lib/supabase/types'

async function getAllActiveNGOs(): Promise<NGO[]> {
  // Vol-30.5: NGORail için NGO'lar (mission count client'ta hesaplanır).
  // BUG-057 fix: Eski "sponsor-category NGO" hack'i kaldırıldı — sponsor markalar
  // ayrı public.sponsors entity'sinde. NGORail'de sadece gerçek STK'lar gösterilsin.
  // Vol-36 fix: PostgreSQL'de `.neq('category', 'sponsor')` NULL category'li
  // NGO'ları (TEMA, Kızılay, Haytap, Kodluyoruz vs. seed'de category null) da
  // dışarda atıyordu — NULL ≠ 'sponsor' SQL'de NULL/falsy döner, satır eklenmez.
  // Bu yüzden dashboard'da NGORail boş geliyor, render edilmiyordu.
  // Çözüm: filter'ı client'a taşı — null category'liler dahil olur.
  // Perf: 2026-04-26 audit (TD-035) — limit + minimal columns korunur.
  const supabase = createClient()
  const { data } = await supabase
    .from('ngos')
    .select('id, name, short_name, logo_url, color_accent, cover_image_url, category, tax_exempt, donation_url, membership_url, payment_mode')
    .order('featured', { ascending: false })
    .limit(50)
  return ((data ?? []) as NGO[]).filter((n) => n.category !== 'sponsor')
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
    subscriptionsResult,
    weeklyKarmaGain,
    streakActivity,
    ngoPosts,
    sponsorPosts,
  ] = await Promise.all([
    getProfile(user.id),
    getAllMissions(),
    getUserMissions(user.id),
    getAllActiveNGOs(),
    supabase
      .from('user_saved_missions')
      .select('mission_id')
      .eq('user_id', user.id),
    supabase
      .from('ngo_memberships')
      .select('ngo_id')
      .eq('user_id', user.id)
      .eq('status', 'active'),
    supabase
      .from('user_ngo_subscriptions')
      .select('ngo_id')
      .eq('user_id', user.id),
    getWeeklyKarmaGain(user.id),
    getRecentStreakActivity(user.id, 7),
    getRecentNgoPosts(8),
    getRecentSponsorPosts(4),
  ])

  if (!profile) redirect('/onboarding')

  const savedMissionIds = (savedMissionsResult.data ?? []).map(
    (s) => s.mission_id,
  )
  const memberNgoIds = (membershipsResult.data ?? []).map((m) => m.ngo_id)
  const subscribedNgoIds = (subscriptionsResult.data ?? []).map(
    (s) => s.ngo_id,
  )

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

  // Score + sort + take top-N candidates
  const scoredMissions = missions
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
    .slice(0, 12)
    .map(({ mission }) => mission)

  const recommendedMissions: MissionWithNGO[] = diversifyByDomain(scoredMissions)

  return (
    <DashboardClient
      profile={profile}
      missions={missions}
      userMissions={userMissions}
      ngos={ngos}
      savedMissionIds={savedMissionIds}
      memberNgoIds={memberNgoIds}
      subscribedNgoIds={subscribedNgoIds}
      recommendedMissions={recommendedMissions}
      userActiveMissions={userActiveMissions}
      activeMissionsWithNGO={activeMissionsWithNGO}
      weeklyKarmaGain={weeklyKarmaGain}
      streakActivity={streakActivity}
      ngoPosts={ngoPosts as PostWithAuthor[]}
      sponsorPosts={sponsorPosts as PostWithAuthor[]}
    />
  )
}
