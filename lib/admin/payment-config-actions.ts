'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface PaymentConfigData {
  donation_url?: string | null
  membership_url?: string | null
  payment_mode?: 'embedded' | 'passthrough' | 'marketplace'
}

/**
 * Ödeme konfigürasyonunu güncelle (self-serve URL'ler)
 */
export async function updatePaymentConfig(
  ngoId: string,
  data: PaymentConfigData,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const updateData = Object.keys(data).reduce((acc: any, key: string) => {
      const value = (data as any)[key]
      if (value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {})

    const { error } = await supabase
      .from('ngos')
      .update(updateData)
      .eq('id', ngoId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/admin/${ngoId}/payments`)
    revalidatePath(`/admin/${ngoId}`)

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
