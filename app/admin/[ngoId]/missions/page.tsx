'use server'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { AdminMissionsClient } from './missions-client'

interface AdminMissionsPageProps {
  params: Promise<{ ngoId: string }>
}

async function getMissions(ngoId: string) {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('missions')
    .select('id, title, domain, karma, status, created_at')
    .eq('ngo_id', ngoId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export default async function AdminMissionsPage({
  params,
}: AdminMissionsPageProps) {
  const { ngoId } = await params
  const missions = await getMissions(ngoId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-cream">
            Görevler
          </h1>
          <p className="text-ink-300 mt-1">
            {missions.length} görev {missions.filter((m: any) => m.status === 'active').length} yayında
          </p>
        </div>

        <Link
          href={`/admin/${ngoId}/missions/new`}
          className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 transition-colors"
        >
          + Yeni Görev
        </Link>
      </div>

      {/* Missions Table (Client) */}
      <AdminMissionsClient missions={missions} ngoId={ngoId} />
    </div>
  )
}
