// Vol-59 Campaign Detail Page — premium kampanya hikayesi + tek-seferlik bağış CTA.
//
// /dashboard/donate/campaign/[id]
//
// Featured carousel'den (Bu Ayın Kampanyaları) tıklandığında bu sayfa açılır.
// NGO genel bağış sayfasından bağımsız — kampanyaya özgü amaç/etki/ilerleme
// burada anlatılır, "Bağışla" CTA'sı kullanıcıyı tek-seferlik flow'a götürür
// (?lock=once → frequency toggle gizli).

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCampaignById } from '@/lib/supabase/queries/donations'
import { CampaignDetailClient } from './campaign-detail-client'

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const campaign = await getCampaignById(params.id)
  if (!campaign || campaign.status !== 'active') notFound()

  return <CampaignDetailClient campaign={campaign} />
}
