import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMissionById, getUserMissions } from '@/lib/supabase/queries/missions'
import { CompleteMissionClient } from './complete-client'

export default async function CompletePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [mission, userMissions] = await Promise.all([
    getMissionById(params.id),
    getUserMissions(user.id),
  ])

  if (!mission) notFound()

  const userMission = userMissions.find((m) => m.mission_id === params.id)
  // Görev alınmamışsa detay sayfasına — oradaki state "idle/requires_membership" render olur
  if (!userMission) redirect(`/dashboard/missions/${params.id}`)
  // Zaten tamamlanmışsa detay sayfasında "completed" state'i gör
  if (userMission.status === 'completed') {
    redirect(`/dashboard/missions/${params.id}`)
  }
  // İptal edilmişse detay sayfası
  if (userMission.status === 'cancelled') {
    redirect(`/dashboard/missions/${params.id}`)
  }

  // NGO contact URL (opsiyonel — 3x fail help için)
  const { data: ngoInfo } = mission.ngo_id
    ? await supabase
        .from('ngos')
        .select('short_name, website')
        .eq('id', mission.ngo_id)
        .single()
    : { data: null }

  const helpContactUrl = ngoInfo?.website
    ? `https://${ngoInfo.website}`
    : null

  return (
    <CompleteMissionClient
      mission={mission}
      userMissionId={userMission.id}
      userId={user.id}
      ngoShortName={ngoInfo?.short_name ?? undefined}
      helpContactUrl={helpContactUrl}
    />
  )
}
