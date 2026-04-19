import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllMissions } from '@/lib/supabase/queries/missions'
import { DiscoverClient } from './discover-client'
import type { NGO, MissionWithNGO, PostWithNGO } from '@/lib/supabase/types'

export default async function DiscoverPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [missions, ngosResult, postsResult, subscriptionsResult, membershipsResult] = await Promise.all([
    getAllMissions(),
    supabase.from('ngos').select('*'),
    supabase
      .from('posts')
      .select('*, ngos:ngo_id(id, name, short_name, logo_url, color_accent)')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('user_ngo_subscriptions')
      .select('ngo_id')
      .eq('user_id', user.id),
    supabase
      .from('ngo_memberships')
      .select('ngo_id')
      .eq('user_id', user.id)
      .eq('status', 'active'),
  ])

  const ngos: NGO[] = ngosResult.data ?? []
  const posts: PostWithNGO[] = (postsResult.data as unknown as PostWithNGO[]) ?? []
  const subscribedNgoIds: string[] = (subscriptionsResult.data ?? []).map((s: { ngo_id: string }) => s.ngo_id)
  const memberNgoIds: string[] = (membershipsResult.data ?? []).map((m: any) => m.ngo_id)

  return <DiscoverClient missions={missions} ngos={ngos} posts={posts} subscribedNgoIds={subscribedNgoIds} memberNgoIds={memberNgoIds} userId={user.id} />
}
