import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMissionById, getUserMissions } from '@/lib/supabase/queries/missions'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { VerificationClient } from './verification-client'

export default async function CompletePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [mission, userMissions, profile] = await Promise.all([
    getMissionById(params.id),
    getUserMissions(user.id),
    getProfile(user.id),
  ])

  if (!mission) notFound()

  const userMission = userMissions.find(m => m.mission_id === params.id)
  if (!userMission) redirect(`/dashboard/missions/${params.id}`)
  if (userMission.status === 'completed') redirect('/dashboard')

  return (
    <VerificationClient
      mission={mission}
      userMission={userMission}
      userId={user.id}
      currentKarma={profile?.karma_total ?? 0}
    />
  )
}
