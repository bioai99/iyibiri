'use server'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CampaignForm } from '../../campaign-form'

interface PageProps {
  params: Promise<{ ngoId: string; id: string }>
}

export default async function EditCampaignPage({ params }: PageProps) {
  const { ngoId, id } = await params
  const supabase = await createClient()
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .eq('ngo_id', ngoId)
    .maybeSingle()
  if (!campaign) notFound()

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/${ngoId}/campaigns`}
        className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-cream"
      >
        <ArrowLeft size={16} /> Kampanyalara dön
      </Link>
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Kampanyayı düzenle
        </h1>
        <p className="text-ink-300 mt-1">{campaign.title}</p>
      </div>
      <CampaignForm ngoId={ngoId} initial={campaign} />
    </div>
  )
}
