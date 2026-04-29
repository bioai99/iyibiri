'use server'

// Vol-32-B sponsor signup review — super admin onaylar, sponsors entity yaratır.

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function slugify(input: string): string {
  return input
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}

export async function approveSponsorRequest(
  requestId: string,
  options: { adminUserId?: string | null } = {},
): Promise<{ success: boolean; sponsorId?: string; error?: string }> {
  const supabase = await createClient()
  try {
    const { data: req, error: reqErr } = await (supabase as any)
      .from('sponsor_signup_requests')
      .select('*')
      .eq('id', requestId)
      .maybeSingle()
    if (reqErr || !req) return { success: false, error: 'Başvuru bulunamadı.' }
    if (req.status !== 'pending') {
      return { success: false, error: 'Başvuru zaten işlendi.' }
    }

    // Sponsor id slug
    let sponsorId = slugify(req.brand_name)
    const { data: existing } = await supabase
      .from('sponsors')
      .select('id')
      .eq('id', sponsorId)
      .maybeSingle()
    if (existing) sponsorId = `${sponsorId}-${Date.now().toString(36)}`

    // Sponsors insert
    const { error: spErr } = await (supabase as any).from('sponsors').insert({
      id: sponsorId,
      name: req.brand_name,
      short_name: req.brand_short ?? req.brand_name.slice(0, 12),
      brand_color: req.brand_color ?? '#C8553D',
      website: req.website,
      description: req.description,
      is_active: true,
    })
    if (spErr) return { success: false, error: spErr.message }

    // Eğer admin user belirtilmişse sponsor_admin_users insert
    if (options.adminUserId) {
      await (supabase as any).from('sponsor_admin_users').insert({
        sponsor_id: sponsorId,
        user_id: options.adminUserId,
        role: 'admin',
      })
    }

    // Request'i approved işaretle
    const { data: { user } } = await supabase.auth.getUser()
    await (supabase as any)
      .from('sponsor_signup_requests')
      .update({
        status: 'approved',
        reviewed_by: user?.id ?? null,
        reviewed_at: new Date().toISOString(),
        approved_sponsor_id: sponsorId,
      })
      .eq('id', requestId)

    revalidatePath('/admin/devtools/sponsor-requests')
    revalidatePath('/dashboard/donate')
    return { success: true, sponsorId }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function rejectSponsorRequest(
  requestId: string,
  reason: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await (supabase as any)
      .from('sponsor_signup_requests')
      .update({
        status: 'rejected',
        reviewed_by: user?.id ?? null,
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason,
      })
      .eq('id', requestId)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/devtools/sponsor-requests')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
