import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllMissions } from '@/lib/supabase/queries/missions'
import { DiscoverClient } from './discover-client'
import type { NGO, MissionWithNGO } from '@/lib/supabase/types'

export default async function DiscoverPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [missions, ngosResult] = await Promise.all([
    getAllMissions(),
    supabase.from('ngos').select('*'),
  ])

  const ngos: NGO[] = ngosResult.data ?? []

  return <DiscoverClient missions={missions} ngos={ngos} />
}
