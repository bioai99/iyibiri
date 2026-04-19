import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostDetailClient } from './post-detail-client'

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: post } = await supabase
    .from('posts')
    .select('*, ngos:ngo_id(id, name, short_name, logo_url, color_accent)')
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  const { data: like } = await supabase
    .from('post_likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', params.id)
    .maybeSingle()

  const { count: likeCount } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', params.id)

  return <PostDetailClient post={post as any} userId={user.id} initialLiked={!!like} initialLikeCount={likeCount ?? 0} />
}
