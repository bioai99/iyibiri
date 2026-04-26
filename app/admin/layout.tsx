'use server'

import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLayoutShell } from '@/components/admin/admin-layout-shell'

interface AdminLayoutProps {
  children: ReactNode
  params: Promise<{ ngoId?: string }>
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Get user profile (name, email)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, name, email')
    .eq('id', user.id)
    .single()

  // Get super-admin status
  const { data: isSuper } = await (supabase as any).rpc('is_super_admin', { u: user.id })

  // Get list of NGO IDs user is admin for
  const { data: adminUsers } = await supabase
    .from('ngo_admin_users')
    .select('ngo_id')
    .eq('user_id', user.id)

  const ngoIds = adminUsers?.map((au) => au.ngo_id) ?? []

  // Get NGO names for sidebar
  const ngoList = ngoIds.length > 0 ? await supabase
    .from('ngos')
    .select('id, name')
    .in('id', ngoIds)
    .then((res) => res.data ?? []) : []

  // BUG-039 fix (Vol-17): yetkisiz kullanıcı admin sidebar görmemeli.
  // ROLLBACK Vol-16 — layout-level redirect /admin/login'i de yakalayıp infinite loop yaptı.
  // Yeni yaklaşım: render time'da sidebar şell'ini koşullu render et.
  // Sidebar sadece super-admin veya en az 1 NGO admin'i için görünür.
  // /admin/login zaten kendi auth bypass'ı yapıyor (server action signin).
  const isAuthorized = isSuper || ngoList.length > 0

  const awaitedParams = await params
  const currentNgoId = awaitedParams.ngoId || (ngoList[0]?.id ?? null)

  // Yetkisiz user (NGO admin değil + super-admin değil) için bare wrapper —
  // login sayfası, "yetkin yok" hata page'i, vs. sidebar leak yapmadan render olur.
  if (!isAuthorized) {
    return <>{children}</>
  }

  return (
    <AdminLayoutShell
      user={{
        id: user.id,
        name: profile?.name ?? 'Admin',
        email: profile?.email ?? '',
      }}
      isSuper={isSuper ?? false}
      ngoList={ngoList}
      currentNgoId={currentNgoId}
    >
      {children}
    </AdminLayoutShell>
  )
}
