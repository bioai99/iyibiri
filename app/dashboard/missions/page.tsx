import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllMissions, getUserMissions } from '@/lib/supabase/queries/missions'
import { MissionsClient } from './missions-client'

export default async function MissionsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [missions, userMissions] = await Promise.all([
    getAllMissions(),
    getUserMissions(user.id),
  ])

  return <MissionsClient missions={missions} userMissions={userMissions} />
}
