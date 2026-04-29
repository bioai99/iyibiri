// Vol-32-B sponsor admin auth helper — server-side check.
// is_sponsor_admin RPC + super-admin override.

import { createClient } from '@/lib/supabase/server'

export async function checkSponsorAdmin(sponsorId: string): Promise<{
  ok: boolean
  user: { id: string; email: string | null } | null
  isSuperAdmin: boolean
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, user: null, isSuperAdmin: false }

  // Super-admin'ler tüm sponsor admin sayfalarına erişebilir
  const { data: superData } = await (supabase as any).rpc('is_super_admin', {
    u: user.id,
  })
  const isSuper = Boolean(superData)
  if (isSuper) {
    return {
      ok: true,
      user: { id: user.id, email: user.email ?? null },
      isSuperAdmin: true,
    }
  }

  // Normal sponsor admin check
  const { data: sponsorAdminData } = await (supabase as any).rpc(
    'is_sponsor_admin',
    {
      target_sponsor_id: sponsorId,
      target_user_id: user.id,
    },
  )
  return {
    ok: Boolean(sponsorAdminData),
    user: { id: user.id, email: user.email ?? null },
    isSuperAdmin: false,
  }
}
