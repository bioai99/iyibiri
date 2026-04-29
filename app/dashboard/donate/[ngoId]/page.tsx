// Vol-31.3 NGO Detail — bağış sekmesinin STK detay sayfası.
// Hero (240px) + identity + 3-stat şerit + RegularDonorCard + CampaignCard listesi + şeffaflık.

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCampaignsForNgo } from '@/lib/supabase/queries/donations'
import { NgoDetailDonateClient } from './ngo-detail-donate-client'

export default async function NgoDonateDetailPage({
  params,
}: {
  params: { ngoId: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: ngo }, campaigns] = await Promise.all([
    supabase.from('ngos').select('*').eq('id', params.ngoId).maybeSingle(),
    getCampaignsForNgo(params.ngoId),
  ])

  if (!ngo) notFound()
  if (ngo.category === 'sponsor') notFound() // Sponsor markalar bağış sekmesinde değil

  return <NgoDetailDonateClient ngo={ngo} campaigns={campaigns} />
}
