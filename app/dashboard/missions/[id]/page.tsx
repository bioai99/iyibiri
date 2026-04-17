import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMissionById, getUserMissions } from '@/lib/supabase/queries/missions'
import { MissionDetailClient } from './mission-detail-client'

export default async function MissionDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [mission, userMissions] = await Promise.all([
    getMissionById(params.id),
    getUserMissions(user.id),
  ])

  if (!mission) notFound()

  const userMission = userMissions.find(m => m.mission_id === params.id)

  return (
    <MissionDetailClient
      mission={mission}
      userMission={userMission ?? null}
      userId={user.id}
    />
  )
}
