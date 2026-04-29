// Vol-31.5 Bağış geçmişi — yıllık özet + subscription list + tüm bağışlar.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getUserDonations,
  getUserActiveSubscriptions,
  summarizeUserDonations,
} from '@/lib/supabase/queries/donations'
import type { NGOBrief } from '@/lib/supabase/types'
import { DonationsHistoryClient } from './donations-history-client'

export default async function DonationsHistoryPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [donations, subscriptions, summary, ngoMapResult] = await Promise.all([
    getUserDonations(user.id, 100),
    getUserActiveSubscriptions(user.id),
    summarizeUserDonations(user.id),
    // Subscription'ların ngo_id → NGOBrief lookup
    supabase
      .from('ngos')
      .select('id, name, short_name, logo_url, color_accent, cover_image_url'),
  ])

  const ngosMap: Record<string, NGOBrief> = {}
  for (const ngo of (ngoMapResult.data ?? []) as NGOBrief[]) {
    ngosMap[ngo.id] = ngo
  }

  return (
    <DonationsHistoryClient
      donations={donations}
      subscriptions={subscriptions}
      summary={summary}
      ngosMap={ngosMap}
    />
  )
}
