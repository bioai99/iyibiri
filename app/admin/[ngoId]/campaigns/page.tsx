'use server'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CampaignsListClient } from './campaigns-client'

interface PageProps {
  params: Promise<{ ngoId: string }>
}

async function getCampaigns(ngoId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('ngo_id', ngoId)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export default async function AdminCampaignsPage({ params }: PageProps) {
  const { ngoId } = await params
  const campaigns = await getCampaigns(ngoId)
  const activeCount = campaigns.filter((c) => c.status === 'active').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-cream">
            Kampanyalar
          </h1>
          <p className="text-ink-300 mt-1">
            {campaigns.length} kampanya · {activeCount} aktif
          </p>
        </div>

        <Link
          href={`/admin/${ngoId}/campaigns/new`}
          className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 transition-colors"
        >
          + Yeni Kampanya
        </Link>
      </div>

      <CampaignsListClient ngoId={ngoId} campaigns={campaigns} />
    </div>
  )
}
