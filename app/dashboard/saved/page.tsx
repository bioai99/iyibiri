import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SavedMissionsClient } from './saved-client'

export default async function SavedMissionsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: savedMissions } = await supabase
    .from('user_saved_missions')
    .select('mission_id, saved_at, missions:mission_id(*, ngos:ngo_id(id, name, short_name, logo_url, color_accent, cover_image_url))')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  const missions = (savedMissions || [])
    .map((s: any) => s.missions)
    .filter(Boolean)

  return <SavedMissionsClient missions={missions} userId={user.id} />
}
