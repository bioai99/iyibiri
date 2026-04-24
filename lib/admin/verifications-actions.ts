'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Doğrulama onaylama — status güncelleme + karma award (idempotent)
 * Flow:
 *   1. user_missions'tan mission.karma_points çek
 *   2. admin_review_status='approved' yap + karma_awarded set et
 *   3. karma_transactions insert (idempotent via migration 013 unique index)
 */
export async function approveVerification(
  verificationId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    // 1. Get user_mission + mission karma points
    const { data: umData, error: fetchError } = await supabase
      .from('user_missions')
      .select(`
        id,
        user_id,
        mission_id,
        admin_review_status,
        missions!inner(id, karma_points, ngo_id)
      `)
      .eq('id', verificationId)
      .single()

    if (fetchError || !umData) {
      return { success: false, error: 'Verification not found' }
    }

    const karmaPoints = (umData.missions as any)?.karma_points ?? 0
    const userId = umData.user_id

    // 2. Update user_mission: approve + award karma (race guard: only if pending_review)
    const { error: updateError } = await supabase
      .from('user_missions')
      .update({
        admin_review_status: 'approved',
        karma_awarded: karmaPoints,
        status: 'completed',
      })
      .eq('id', verificationId)
      .eq('admin_review_status', 'pending_review')

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // 3. Insert karma_transactions (idempotent via unique index on (user_id, type, reference_id))
    if (karmaPoints > 0) {
      await supabase.from('karma_transactions').insert({
        user_id: userId,
        amount: karmaPoints,
        type: 'mission_complete',
        reference_id: verificationId,
      })
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

/**
 * Doğrulama reddetme — geri bildirim zorunlu
 */
export async function rejectVerification(
  verificationId: string,
  feedback: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  if (!feedback.trim()) {
    return { success: false, error: 'Geri bildirim zorunlu' }
  }

  try {
    const { error } = await supabase
      .from('user_missions')
      .update({
        admin_review_status: 'rejected',
        admin_feedback: feedback,
      })
      .eq('id', verificationId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

/**
 * Toplu doğrulama onaylama (K6 pattern) + karma distribution
 * Note: Performans için batch update kullanırız, karma transaction'lar individual
 */
export async function bulkApproveVerifications(
  verificationIds: string[]
): Promise<{ success: boolean; error?: string; approved?: number }> {
  const supabase = await createClient()

  if (verificationIds.length === 0) {
    return { success: false, error: 'Hiçbir doğrulama seçilmedi' }
  }

  try {
    // 1. Fetch all user_missions for karma calculation
    const { data: umData, error: fetchError } = await supabase
      .from('user_missions')
      .select(`
        id,
        user_id,
        admin_review_status,
        missions!inner(karma_points)
      `)
      .in('id', verificationIds)

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    // 2. Bulk update: mark as approved + set karma_awarded
    const { error: updateError } = await supabase
      .from('user_missions')
      .update({
        admin_review_status: 'approved',
        status: 'completed',
      })
      .in('id', verificationIds)
      .eq('admin_review_status', 'pending_review')

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // 3. Insert karma transactions (idempotent)
    const karmaTransactions = (umData ?? [])
      .map((um: any) => {
        const amount = (um.missions as any)?.karma_points ?? 0
        return amount > 0
          ? {
              user_id: um.user_id,
              amount,
              type: 'mission_complete' as const,
              reference_id: um.id,
            }
          : null
      })
      .filter((t): t is NonNullable<typeof t> => t !== null)

    if (karmaTransactions.length > 0) {
      await supabase.from('karma_transactions').insert(karmaTransactions)
    }

    revalidatePath('/admin')
    return { success: true, approved: verificationIds.length }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
