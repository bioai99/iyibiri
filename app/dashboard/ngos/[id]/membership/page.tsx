import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { NGO } from '@/lib/supabase/types'
import { MembershipFormClient } from './membership-form-client'

export default async function MembershipPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: ngo } = await supabase
    .from('ngos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!ngo) redirect('/dashboard/ngos')

  // Check existing membership
  const { data: existing } = await supabase
    .from('ngo_memberships')
    .select('id')
    .eq('user_id', user.id)
    .eq('ngo_id', params.id)
    .maybeSingle()

  // Already member -> redirect to success
  if (existing) redirect(`/dashboard/ngos/${params.id}/membership/success`)

  return <MembershipFormClient ngo={ngo as NGO} userId={user.id} />
}
