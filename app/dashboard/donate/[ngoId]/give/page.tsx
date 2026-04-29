// Vol-31.4 Donation Flow — Step 1-2-3 orchestration page.

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCampaignById } from '@/lib/supabase/queries/donations'
import { GiveFlowClient } from './give-flow-client'

export default async function DonateGivePage({
  params,
  searchParams,
}: {
  params: { ngoId: string }
  searchParams: { campaign?: string; intent?: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: ngo } = await supabase
    .from('ngos')
    .select('id, name, short_name, color_accent, tax_exempt, category')
    .eq('id', params.ngoId)
    .maybeSingle()

  if (!ngo) notFound()
  if (ngo.category === 'sponsor') notFound()

  const campaign = searchParams.campaign
    ? await getCampaignById(searchParams.campaign)
    : null

  // searchParams.intent === 'regular' → Step 1'i monthly başlat
  const initialFrequency: 'once' | 'monthly' =
    searchParams.intent === 'regular' ? 'monthly' : 'once'

  return (
    <GiveFlowClient
      ngo={ngo}
      campaignId={campaign?.id ?? null}
      campaignTitle={campaign?.title ?? null}
      initialFrequency={initialFrequency}
    />
  )
}
