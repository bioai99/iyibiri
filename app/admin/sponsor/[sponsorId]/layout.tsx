// Vol-32-B sponsor admin layout — auth gate + shell.

import { redirect, notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { checkSponsorAdmin } from '@/lib/admin/sponsor-auth'
import { SponsorAdminShell } from '@/components/admin/sponsor-admin-shell'

interface Props {
  children: ReactNode
  params: Promise<{ sponsorId: string }>
}

export default async function SponsorAdminLayout({ children, params }: Props) {
  const { sponsorId } = await params
  const auth = await checkSponsorAdmin(sponsorId)
  if (!auth.user) redirect('/admin/login')
  if (!auth.ok) {
    redirect('/admin')
  }

  const supabase = await createClient()
  const { data: sponsor } = await supabase
    .from('sponsors')
    .select('id, name, short_name')
    .eq('id', sponsorId)
    .maybeSingle()
  if (!sponsor) notFound()

  return (
    <SponsorAdminShell
      sponsorId={sponsorId}
      sponsorName={sponsor.short_name ?? sponsor.name}
      isSuperAdmin={auth.isSuperAdmin}
    >
      {children}
    </SponsorAdminShell>
  )
}
