'use server'

import { createClient } from '@/lib/supabase/server'
import { MembershipConfigClient } from './membership-config-client'

interface MembershipConfigPageProps {
  params: Promise<{ ngoId: string }>
}

async function getNgo(ngoId: string) {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('ngos')
    .select('*')
    .eq('id', ngoId)
    .single()

  if (error) throw error
  return data
}

export default async function MembershipConfigPage({
  params,
}: MembershipConfigPageProps) {
  const { ngoId } = await params
  const ngo = await getNgo(ngoId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Üyelik Ayarları
        </h1>
        <p className="text-ink-300 mt-1">
          Üyelik ücretlendirmesi, form alanları ve yasal dokümanları yapılandırın.
        </p>
      </div>

      <MembershipConfigClient ngo={ngo} ngoId={ngoId} />
    </div>
  )
}
