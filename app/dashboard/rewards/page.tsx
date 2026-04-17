import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllRewards, getUserRedemptions } from '@/lib/supabase/queries/rewards'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { RewardsClient } from './rewards-client'

export default async function RewardsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [rewards, redemptions, profile] = await Promise.all([
    getAllRewards(),
    getUserRedemptions(user.id),
    getProfile(user.id),
  ])

  return (
    <RewardsClient
      rewards={rewards}
      redemptions={redemptions}
      currentKarma={profile?.karma_total ?? 0}
      userId={user.id}
    />
  )
}
