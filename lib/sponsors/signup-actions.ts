'use server'

// Vol-32-B sponsor self-signup — anon insert via SECURITY DEFINER RPC.

import { createClient } from '@/lib/supabase/server'

export interface SponsorSignupData {
  brand_name: string
  brand_short: string | null
  brand_color: string | null
  website: string | null
  contact_name: string
  contact_email: string
  contact_phone: string | null
  tax_number: string | null
  description: string | null
}

export async function submitSponsorSignup(
  data: SponsorSignupData,
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  const supabase = await createClient()
  try {
    if (!data.brand_name.trim() || !data.contact_name.trim() || !data.contact_email.trim()) {
      return { success: false, error: 'Marka adı, ad-soyad ve e-posta zorunludur.' }
    }
    const { data: requestId, error } = await (supabase as any).rpc(
      'submit_sponsor_signup_request',
      {
        p_brand_name: data.brand_name.trim(),
        p_brand_short: data.brand_short?.trim() || null,
        p_brand_color: data.brand_color?.trim() || null,
        p_website: data.website?.trim() || null,
        p_contact_name: data.contact_name.trim(),
        p_contact_email: data.contact_email.trim().toLowerCase(),
        p_contact_phone: data.contact_phone?.trim() || null,
        p_tax_number: data.tax_number?.trim() || null,
        p_description: data.description?.trim() || null,
      },
    )
    if (error) return { success: false, error: error.message }
    return { success: true, requestId }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
