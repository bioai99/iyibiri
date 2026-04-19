import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { NGO } from '@/lib/supabase/types'
import { NGOsListClient } from './ngos-list-client'

async function getNGOs(): Promise<NGO[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('ngos').select('*')
  if (error) throw error
  return data
}

export default async function NGOsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const ngos = await getNGOs()

  return <NGOsListClient ngos={ngos} />
}
