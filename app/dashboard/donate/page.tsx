// Vol-31.2 Donate Hub — STK keşfi, "Bu ayın kampanyaları" carousel, NGO listesi.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getFeaturedCampaigns } from '@/lib/supabase/queries/donations'
import type { NGO } from '@/lib/supabase/types'
import { DonateHubClient } from './donate-hub-client'

export default async function DonatePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [ngosResult, featuredResult, supporterCountsResult] = await Promise.all([
    supabase
      .from('ngos')
      .select('*')
      .neq('category', 'sponsor')
      .order('name', { ascending: true }),
    getFeaturedCampaigns(6),
    // Per-NGO destekçi sayısı (campaigns.supporter_count toplamı)
    supabase
      .from('campaigns')
      .select('ngo_id, supporter_count')
      .eq('status', 'active'),
  ])

  const ngos: NGO[] = ngosResult.data ?? []
  const featured = featuredResult

  // ngo_id → toplam destekçi sayısı
  const supportersByNgo = new Map<string, number>()
  for (const row of supporterCountsResult.data ?? []) {
    const prev = supportersByNgo.get(row.ngo_id) ?? 0
    supportersByNgo.set(row.ngo_id, prev + (row.supporter_count ?? 0))
  }

  return (
    <DonateHubClient
      ngos={ngos}
      featured={featured}
      supportersByNgo={Object.fromEntries(supportersByNgo)}
    />
  )
}
