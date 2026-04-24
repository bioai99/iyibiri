import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { NGO } from '@/lib/supabase/types'
import { MembershipFlowClient } from './membership-flow-client'

export default async function MembershipPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Paralel fetch — NGO + profile + existing membership
  const [ngoRes, profileRes, existingRes] = await Promise.all([
    supabase.from('ngos').select('*').eq('id', params.id).single(),
    supabase
      .from('profiles')
      .select('age_range')
      .eq('id', user.id)
      .single(),
    supabase
      .from('ngo_memberships')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('ngo_id', params.id)
      .maybeSingle(),
  ])

  const ngo = ngoRes.data as NGO | null
  if (!ngo) redirect('/dashboard/ngos')

  // Zaten aktif üye → success'e gönder
  if (existingRes.data && existingRes.data.status === 'active') {
    redirect(`/dashboard/ngos/${params.id}/membership/success`)
  }

  return (
    <MembershipFlowClient
      ngo={ngo}
      userAgeRange={profileRes.data?.age_range ?? null}
    />
  )
}
