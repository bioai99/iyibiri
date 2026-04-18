import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getUserMissions } from '@/lib/supabase/queries/missions'
import { ProfileClient } from './profile-client'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, userMissions] = await Promise.all([
    getProfile(user.id),
    getUserMissions(user.id),
  ])

  if (!profile) redirect('/onboarding')

  const completedCount = userMissions.filter(m => m.status === 'completed').length

  return (
    <ProfileClient
      profile={profile}
      completedCount={completedCount}
      karma={profile.karma_total}
    />
  )
}
