import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DiscoverClient } from './discover-client'

export default async function DiscoverPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: missions } = await supabase
    .from('missions')
    .select('*, ngos:ngo_id(id, name, short_name, logo_url, color_accent, cover_image_url)')
    .eq('active', true)

  const { data: ngos } = await supabase.from('ngos').select('*')

  return <DiscoverClient missions={missions ?? []} ngos={ngos ?? []} />
}
