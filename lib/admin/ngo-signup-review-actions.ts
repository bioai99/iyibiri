'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Vol-27.1: Super-admin için STK signup başvurularını review etme actions.
// RLS: super-admin SELECT + UPDATE policy var (Migration 033).

export async function reviewSignupRequest(
  requestId: string,
  newStatus: 'reviewing' | 'approved' | 'rejected',
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const { error } = await (supabase as any)
      .from('ngo_signup_requests')
      .update({
        status: newStatus,
        reviewer_notes: notes?.trim() || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/devtools/ngo-requests')

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
