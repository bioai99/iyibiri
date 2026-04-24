'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { MembershipFeeConfig } from '@/lib/supabase/types'

interface MembershipConfigData {
  membership_fee_config?: MembershipFeeConfig | null
  kvkk_document_url?: string | null
  membership_contract_url?: string | null
  volunteer_consent_url?: string | null
}

/**
 * Üyelik konfigürasyonunu güncelle
 */
export async function updateMembershipConfig(
  ngoId: string,
  data: MembershipConfigData,
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

    revalidatePath(`/admin/${ngoId}/membership-config`)
    revalidatePath(`/admin/${ngoId}`)

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
