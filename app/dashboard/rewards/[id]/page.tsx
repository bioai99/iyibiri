import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getUserRedemptions } from '@/lib/supabase/queries/rewards'
import { RewardDetailClient } from './reward-detail-client'

async function getReward(id: string) {
  const supabase = createClient()
  const { data } = await supabase.from('rewards').select('*').eq('id', id).single()
  return data
}

export default async function RewardDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [reward, profile, redemptions] = await Promise.all([
    getReward(params.id),
    getProfile(user.id),
    getUserRedemptions(user.id),
  ])

  if (!reward || !profile) notFound()

  const isRedeemed = redemptions.some(r => r.reward_id === params.id)

  return (
    <RewardDetailClient
      reward={reward}
      currentKarma={profile.karma_total}
      isRedeemed={isRedeemed}
      userId={user.id}
    />
  )
}
