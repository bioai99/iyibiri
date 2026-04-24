'use server'

import { createClient } from '@/lib/supabase/server'
import { PaymentsForm } from './payments-form'

interface PaymentsPageProps {
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

export default async function PaymentsPage({
  params,
}: PaymentsPageProps) {
  const { ngoId } = await params
  const ngo = await getNgo(ngoId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Ödeme Ayarları
        </h1>
        <p className="text-ink-300 mt-1">
          Bağış ve üyelik ödemeleri için kanallarınızı yapılandırın.
        </p>
      </div>

      <PaymentsForm ngo={ngo} ngoId={ngoId} />
    </div>
  )
}
