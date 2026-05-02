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

  // Faz 7 (2026-05-02 perf-eng): NGO map'i tüm NGO'ları çekiyordu (~50 satır
  // her sayfa yüklemesinde) — ama client sadece subscriptions için kullanıyor
  // (donations'ın embedded ngos field'ı var). Subscription ngo_ids'leri ile
  // sınırla → 50 satır yerine 1-3 satır. Decoded -%80 (NGO map portion).
  const [donations, subscriptions, summary] = await Promise.all([
    getUserDonations(user.id, 100),
    getUserActiveSubscriptions(user.id),
    summarizeUserDonations(user.id),
  ])

  const subscriptionNgoIds = Array.from(
    new Set(subscriptions.map((s) => s.ngo_id)),
  ).filter((id): id is string => Boolean(id))

  const ngosMap: Record<string, NGOBrief> = {}
  if (subscriptionNgoIds.length > 0) {
    const { data: ngosData } = await supabase
      .from('ngos')
      .select('id, name, short_name, logo_url, color_accent, cover_image_url')
      .in('id', subscriptionNgoIds)
    for (const ngo of (ngosData ?? []) as NGOBrief[]) {
      ngosMap[ngo.id] = ngo
    }
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
