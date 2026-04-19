import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LeaderboardClient from './leaderboard-client'

export default async function LeaderboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch top 20 profiles ordered by karma_total DESC
  const { data: topUsers } = await supabase
    .from('profiles')
    .select('id, name, karma_total, avatar_type')
    .order('karma_total', { ascending: false })
    .limit(20)

  // Fetch current user's profile for display
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('id, name, karma_total, avatar_type')
    .eq('id', user.id)
    .single()

  // Count how many profiles have higher karma than current user (to compute rank)
  const userKarma = currentUserProfile?.karma_total ?? 0
  const { count: higherCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gt('karma_total', userKarma)

  const currentUserRank = (higherCount ?? 0) + 1

  return (
    <LeaderboardClient
      topUsers={topUsers ?? []}
      currentUserId={user.id}
      currentUserRank={currentUserRank}
      currentUserProfile={currentUserProfile}
    />
  )
}
