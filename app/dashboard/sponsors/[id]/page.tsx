import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SponsorPublicClient } from './sponsor-public-client'
import type { PostWithAuthor, Reward, Sponsor } from '@/lib/supabase/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SponsorPublicPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [sponsorRes, postsRes, rewardsRes] = await Promise.all([
    supabase.from('sponsors').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('posts')
      .select(
        '*, ngos:ngo_id(id, name, short_name, logo_url, color_accent, cover_image_url), sponsors:sponsor_id(id, name, short_name, brand_color, logo_url)',
      )
      .eq('author_type', 'sponsor')
      .eq('sponsor_id', id)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('rewards')
      .select('*')
      .eq('sponsor_id', id)
      .eq('active', true)
      .order('karma_required', { ascending: true }),
  ])

  if (!sponsorRes.data || !sponsorRes.data.is_active) notFound()

  const sponsor = sponsorRes.data as Sponsor
  const posts = (postsRes.data as unknown as PostWithAuthor[]) ?? []
  const rewards = (rewardsRes.data as Reward[]) ?? []

  return <SponsorPublicClient sponsor={sponsor} posts={posts} rewards={rewards} />
}
