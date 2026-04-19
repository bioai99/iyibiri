import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getUserMissions } from '@/lib/supabase/queries/missions'
import { BadgesClient } from './badges-client'

export default async function BadgesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, userMissions, membershipsResult] = await Promise.all([
    getProfile(user.id),
    getUserMissions(user.id),
    supabase
      .from('ngo_memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active'),
  ])

  if (!profile) redirect('/onboarding')

  const completedCount = userMissions.filter(m => m.status === 'completed').length
  const memberNgoCount = membershipsResult.data?.length ?? 0

  return (
    <BadgesClient
      karma={profile.karma_total}
      streak={profile.streak ?? profile.current_streak ?? 0}
      completedCount={completedCount}
      memberNgoCount={memberNgoCount}
    />
  )
}
