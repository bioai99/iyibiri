import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMissionById, getUserMissions } from '@/lib/supabase/queries/missions'
import { MissionDetailClient } from './mission-detail-client'
import { MissionStatesClient } from './states-client'

export default async function MissionDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [mission, userMissions] = await Promise.all([
    getMissionById(params.id),
    getUserMissions(user.id),
  ])

  if (!mission) notFound()

  const [membershipResult, savedResult] = await Promise.all([
    supabase
      .from('ngo_memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('ngo_id', mission.ngo_id ?? '')
      .eq('status', 'active')
      .maybeSingle(),
    supabase
      .from('user_saved_missions')
      .select('id')
      .eq('user_id', user.id)
      .eq('mission_id', params.id)
      .maybeSingle(),
  ])

  const membership = membershipResult.data
  const isSaved = !!savedResult.data
  const userMission = userMissions.find(m => m.mission_id === params.id)

  if (userMission?.status === 'taken') {
    return <MissionStatesClient mission={mission as any} state="applied" />
  }

  if (userMission?.status === 'completed') {
    return <MissionStatesClient mission={mission as any} state="completed" />
  }

  return (
    <MissionDetailClient
      mission={mission}
      userMission={userMission ?? null}
      userId={user.id}
      isMember={!!membership}
      isSaved={isSaved}
    />
  )
}
