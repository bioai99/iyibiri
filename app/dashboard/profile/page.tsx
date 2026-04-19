import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getUserMissions } from '@/lib/supabase/queries/missions'
import { ProfileClient } from './profile-client'

interface MembershipWithNGO {
  id: string
  ngo_id: string
  ngos: {
    id: string
    name: string
    short_name: string | null
    logo_url: string | null
    color_accent: string | null
  } | null
}

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, userMissions, membershipsResult] = await Promise.all([
    getProfile(user.id),
    getUserMissions(user.id),
    supabase
      .from('ngo_memberships')
      .select('id, ngo_id, ngos(id, name, short_name, logo_url, color_accent)')
      .eq('user_id', user.id)
      .eq('status', 'active'),
  ])

  if (!profile) redirect('/onboarding')

  const completedCount = userMissions.filter(m => m.status === 'completed').length
  const memberships = (membershipsResult.data ?? []) as unknown as MembershipWithNGO[]

  return (
    <ProfileClient
      profile={profile}
      completedCount={completedCount}
      karma={profile.karma_total}
      memberships={memberships}
    />
  )
}
