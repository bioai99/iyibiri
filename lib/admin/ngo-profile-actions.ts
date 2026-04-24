'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface NGOProfileData {
  logo_url?: string | null
  cover_image_url?: string | null
  short_name?: string
  tagline?: string
  description?: string
  email?: string | null
  phone?: string | null
  website?: string | null
  social_instagram?: string | null
  social_twitter?: string | null
  social_linkedin?: string | null
}

/**
 * STK profilini güncelle
 */
export async function updateNgoProfile(
  ngoId: string,
  data: NGOProfileData,
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

    revalidatePath(`/admin/${ngoId}/profile`)
    revalidatePath(`/admin/${ngoId}`)

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
