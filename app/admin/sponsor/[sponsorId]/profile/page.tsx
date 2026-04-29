// Vol-32-B sponsor admin marka profili düzenleme.

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SponsorProfileForm } from './sponsor-profile-form'

interface PageProps {
  params: Promise<{ sponsorId: string }>
}

export default async function SponsorProfilePage({ params }: PageProps) {
  const { sponsorId } = await params
  const supabase = await createClient()
  const { data: sponsor } = await supabase
    .from('sponsors')
    .select('*')
    .eq('id', sponsorId)
    .maybeSingle()
  if (!sponsor) notFound()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Marka profili
        </h1>
        <p className="text-ink-300 mt-1">
          Public sayfanda ve sponsor postları/ödülleri gösteriminde bu bilgiler
          kullanılır.
        </p>
      </div>
      <SponsorProfileForm sponsorId={sponsorId} initial={sponsor} />
    </div>
  )
}
