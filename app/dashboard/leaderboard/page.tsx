import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LeaderboardClient from './leaderboard-client'

export default async function LeaderboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // BUG-028 fix (Vol-14): leaderboard_top SECURITY DEFINER view bypasses RLS,
  // returns top 100 users. Without this view, RLS "Users can view own profile"
  // limits select to only the current user → leaderboard appeared empty.
  const { data: topUsersRaw } = await supabase
    .from('leaderboard_top')
    .select('id, display_name, karma_total, avatar_type')
    .limit(20)

  // Map view's display_name → name for backwards compatibility with client component
  const topUsers = (topUsersRaw ?? []).map((u) => ({
    id: u.id as string,
    name: u.display_name as string | null,
    karma_total: u.karma_total as number,
    avatar_type: u.avatar_type as 'cat' | 'dog' | 'fox' | 'robot' | 'party' | null,
  }))

  // Fetch current user's profile (RLS-friendly — own row)
  const { data: currentUserRaw } = await supabase
    .from('profiles')
    .select('id, name, full_name, first_name, karma_total, avatar_type')
    .eq('id', user.id)
    .single()

  const currentUserProfile = currentUserRaw
    ? {
        id: currentUserRaw.id,
        name:
          (currentUserRaw.full_name as string | null)?.trim() ||
          (currentUserRaw.first_name as string | null)?.trim() ||
          currentUserRaw.name,
        karma_total: currentUserRaw.karma_total,
        avatar_type: currentUserRaw.avatar_type,
      }
    : null

  // Use SECURITY DEFINER RPC to compute rank across ALL profiles (RLS-bypass)
  const { data: rankData } = await supabase.rpc('get_user_rank', {
    target_user_id: user.id,
  })
  const currentUserRank = (rankData as number | null) ?? 1

  return (
    <LeaderboardClient
      topUsers={topUsers}
      currentUserId={user.id}
      currentUserRank={currentUserRank}
      currentUserProfile={currentUserProfile}
    />
  )
}
