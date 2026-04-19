import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { NGO, MissionWithNGO, NgoMembership } from '@/lib/supabase/types'
import { NGOProfileClient } from './ngo-profile-client'

async function getNGOWithMissions(id: string): Promise<{ ngo: NGO; missions: MissionWithNGO[] } | null> {
  const supabase = createClient()
  const [{ data: ngo }, { data: missions }] = await Promise.all([
    supabase.from('ngos').select('*').eq('id', id).single(),
    supabase
      .from('missions')
      .select('*, ngos(id, name, short_name, logo_url, color_accent, cover_image_url)')
      .eq('ngo_id', id)
      .eq('active', true)
      .order('created_at', { ascending: true }),
  ])
  if (!ngo) return null
  return { ngo, missions: (missions ?? []) as unknown as MissionWithNGO[] }
}

export default async function NGODetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const result = await getNGOWithMissions(params.id)
  if (!result) notFound()

  const { ngo, missions } = result

  const { data: membership } = await supabase
    .from('ngo_memberships')
    .select('*')
    .eq('user_id', user.id)
    .eq('ngo_id', params.id)
    .maybeSingle()

  return <NGOProfileClient ngo={ngo} missions={missions} userId={user.id} membership={membership as NgoMembership | null} />
}
