'use server'

import { createClient } from '@/lib/supabase/server'

export interface NgoSignupRequestData {
  ngo_name: string
  short_name?: string
  category?: string
  city?: string
  website?: string
  description?: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  reason: string
}

/**
 * Vol-26 BUG-044 fix: Yeni STK başvuru kaydı (anonim insert).
 * RLS: anyone can insert (Migration 033).
 * Super-admin elle review eder + onaylarsa ngos table'a manuel insert + admin grant.
 */
export async function createNgoSignupRequest(
  data: NgoSignupRequestData
): Promise<{ success: boolean; error?: string; requestId?: string }> {
  const supabase = await createClient()

  // Basit validasyon
  if (!data.ngo_name?.trim()) {
    return { success: false, error: 'STK adı zorunlu' }
  }
  if (!data.contact_name?.trim()) {
    return { success: false, error: 'İletişim kişisi zorunlu' }
  }
  if (!data.contact_email?.trim() || !data.contact_email.includes('@')) {
    return { success: false, error: 'Geçerli e-posta adresi zorunlu' }
  }
  if (!data.reason?.trim() || data.reason.trim().length < 30) {
    return { success: false, error: 'Lütfen en az 30 karakter detay paylaş (neden katılmak istiyorsun)' }
  }

  try {
    const { data: row, error } = await (supabase as any)
      .from('ngo_signup_requests')
      .insert({
        ngo_name: data.ngo_name.trim(),
        short_name: data.short_name?.trim() || null,
        category: data.category?.trim() || null,
        city: data.city?.trim() || null,
        website: data.website?.trim() || null,
        description: data.description?.trim() || null,
        contact_name: data.contact_name.trim(),
        contact_email: data.contact_email.trim().toLowerCase(),
        contact_phone: data.contact_phone?.trim() || null,
        reason: data.reason.trim(),
      })
      .select('id')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, requestId: row?.id }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
