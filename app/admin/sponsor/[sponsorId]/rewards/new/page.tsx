import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SponsorRewardForm } from '../sponsor-reward-form'

interface PageProps {
  params: Promise<{ sponsorId: string }>
}

export default async function NewSponsorRewardPage({ params }: PageProps) {
  const { sponsorId } = await params
  const supabase = await createClient()
  const { data: sponsor } = await supabase
    .from('sponsors')
    .select('name, short_name')
    .eq('id', sponsorId)
    .maybeSingle()
  if (!sponsor) notFound()

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/sponsor/${sponsorId}/rewards`}
        className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-cream"
      >
        <ArrowLeft size={16} /> Ödüllere dön
      </Link>
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">Yeni ödül</h1>
        <p className="text-ink-300 mt-1">
          Karma ile alınabilecek bir ödül tanımla.
        </p>
      </div>
      <SponsorRewardForm
        sponsorId={sponsorId}
        sponsorName={sponsor.short_name ?? sponsor.name}
      />
    </div>
  )
}
