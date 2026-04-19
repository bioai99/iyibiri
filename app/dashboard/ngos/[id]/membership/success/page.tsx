import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { NGO } from '@/lib/supabase/types'
import { MembershipSuccessClient } from './success-client'

export default async function MembershipSuccessPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: ngo } = await supabase
    .from('ngos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!ngo) redirect('/dashboard/ngos')

  return <MembershipSuccessClient ngo={ngo as NGO} />
}
