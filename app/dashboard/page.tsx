import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getAllMissions, getUserMissions } from '@/lib/supabase/queries/missions'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, missions, userMissions] = await Promise.all([
    getProfile(user.id),
    getAllMissions(),
    getUserMissions(user.id),
  ])

  if (!profile) redirect('/auth/login')

  return (
    <DashboardClient
      profile={profile}
      missions={missions}
      userMissions={userMissions}
    />
  )
}
