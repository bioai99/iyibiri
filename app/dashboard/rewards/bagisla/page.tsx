// Vol-64: Karma → Bağış dönüşüm journey'si (server component).
// Kullanıcının Karma bakiyesi + bağış yapılabilecek STK'lar (aktif kampanyalarıyla)
// çekilir; KarmaDonateClient akışı yönetir.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import type { NGO } from '@/lib/supabase/types'
import { KarmaDonateClient, type DonateTarget } from './karma-donate-client'

export default async function KarmaDonatePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, ngosResult, campaignsResult] = await Promise.all([
    getProfile(user.id),
    supabase
      .from('ngos')
      .select('id, name, short_name, logo_url, color_accent, category')
      .neq('category', 'sponsor')
      .order('name', { ascending: true }),
    supabase
      .from('campaigns')
      .select('id, ngo_id, title, cause')
      .eq('status', 'active'),
  ])

  const ngos = (ngosResult.data ?? []) as Pick<
    NGO,
    'id' | 'name' | 'short_name' | 'logo_url' | 'color_accent' | 'category'
  >[]

  // Her STK için (varsa) bir öne çıkan kampanyayı eşle
  const campaignByNgo = new Map<string, { id: string; title: string }>()
  for (const cmp of campaignsResult.data ?? []) {
    if (!campaignByNgo.has(cmp.ngo_id)) {
      campaignByNgo.set(cmp.ngo_id, { id: cmp.id, title: cmp.title })
    }
  }

  const targets: DonateTarget[] = ngos.map(n => ({
    ngoId: n.id,
    name: n.short_name || n.name,
    fullName: n.name,
    logoUrl: n.logo_url,
    colorAccent: n.color_accent,
    campaignId: campaignByNgo.get(n.id)?.id ?? null,
    campaignTitle: campaignByNgo.get(n.id)?.title ?? null,
  }))

  return (
    <KarmaDonateClient
      currentKarma={profile?.karma_total ?? 0}
      targets={targets}
    />
  )
}
