'use server'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CampaignForm } from '../campaign-form'

interface PageProps {
  params: Promise<{ ngoId: string }>
}

export default async function NewCampaignPage({ params }: PageProps) {
  const { ngoId } = await params

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
          Yeni Kampanya
        </h1>
        <p className="text-ink-300 mt-1">
          Bağış sekmesinde aktif olarak listelenecek kampanyayı tanımla.
        </p>
      </div>
      <CampaignForm ngoId={ngoId} />
    </div>
  )
}
