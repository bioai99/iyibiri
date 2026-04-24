'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Doğrulama onaylama — status güncelleme
 * Note: Karma distribution via RLS trigger on user_missions.approved (DB Migration 022)
 */
export async function approveVerification(
  verificationId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const { error: updateError } = await supabase
      .from('user_missions')
      .update({ admin_review_status: 'approved' })
      .eq('id', verificationId)

    if (updateError) {
      return { success: false, error: updateError.message }
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
 * Toplu doğrulama onaylama (K6 pattern)
 */
export async function bulkApproveVerifications(
  verificationIds: string[]
): Promise<{ success: boolean; error?: string; approved?: number }> {
  const supabase = await createClient()

  if (verificationIds.length === 0) {
    return { success: false, error: 'Hiçbir doğrulama seçilmedi' }
  }

  try {
    const { error } = await supabase
      .from('user_missions')
      .update({ admin_review_status: 'approved' })
      .in('id', verificationIds)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true, approved: verificationIds.length }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
