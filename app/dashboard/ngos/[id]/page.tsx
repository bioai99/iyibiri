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
      // Vol-36 fix: `active=true` filter, NULL active'li (eski seed'den) mission'ları
      // dışarda atıyordu. Status-based filter daha güvenli — published/active iki
      // alan arasında biri yeterli, archived ve draft hariç tüm görünür mission'lar
      // hesaplanır.
      .neq('status', 'archived' as any)
      .order('created_at', { ascending: true }),
  ])
  if (!ngo) return null
  // Client'ta ek filter: draft hariç, ya active=true ya status='published' olanlar.
  const visibleMissions = ((missions ?? []) as unknown as MissionWithNGO[]).filter(
    (m: any) => m.active !== false && m.status !== 'draft',
  )
  return { ngo, missions: visibleMissions }
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
