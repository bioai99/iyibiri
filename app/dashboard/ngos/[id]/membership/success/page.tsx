import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { NGO } from '@/lib/supabase/types'
import { MembershipSuccessClient } from './success-client'

export default async function MembershipSuccessPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [ngoResult, membershipResult] = await Promise.all([
    supabase
      .from('ngos')
      .select('*')
      .eq('id', params.id)
      .single(),
    supabase
      .from('ngo_memberships')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('ngo_id', params.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  const ngo = ngoResult.data
  const membership = membershipResult.data

  if (!ngo) redirect('/dashboard/ngos')

  return <MembershipSuccessClient ngo={ngo as NGO} isPending={membership?.status === 'pending'} />
}
