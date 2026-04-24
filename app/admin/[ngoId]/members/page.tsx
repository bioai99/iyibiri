'use server'

import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import { MembersClient } from './members-client'

interface MembersPageProps {
  params: Promise<{ ngoId: string }>
}

async function getMembersData(ngoId: string) {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from('ngo_memberships')
    .select(`
      id,
      user_id,
      status,
      tier,
      joined_at,
      expires_at,
      profiles:user_id(id, name, email, avatar_url)
    `)
    .eq('ngo_id', ngoId)
    .order('joined_at', { ascending: false })

  if (error) {
    console.error('Members fetch error:', error)
    return { members: [], error: error.message }
  }

  return {
    members: (members || []) as any[],
    error: null,
  }
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { ngoId } = await params
  const { members } = await getMembersData(ngoId)

  return (
    <div className="space-y-6">
      {/* KVKK Compliance Banner */}
      <div className="bg-ink-800 border-l-4 border-l-gold p-4 rounded-lg">
        <div className="flex gap-3">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm text-cream font-semibold mb-1">
              KVKK Uyumu
            </p>
            <p className="text-xs text-ink-300 leading-relaxed">
              Bu sayfadaki veriler KVKK Madde 10 uyumludur. CSV dışa aktarımı
              yalnızca yasal yükümlülükler (muhasebe, vergi) için kullanılır.
              Kullanıcı silme hakkı talebi için:{' '}
              <a href="mailto:kvkk@iyibiri.app" className="text-gold hover:underline">
                kvkk@iyibiri.app
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Header with export button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-cream">
            Üyeler
          </h1>
          <p className="text-ink-300 mt-1">
            {members.length} üye | Aktif üyelik yönetimi
          </p>
        </div>
        <Suspense fallback={null}>
          <MembersExportButton ngoId={ngoId} memberCount={members.length} />
        </Suspense>
      </div>

      {/* Suspense wrapper for client component */}
      <Suspense fallback={<MembersLoadingSkeleton />}>
        <MembersClient members={members} ngoId={ngoId} />
      </Suspense>
    </div>
  )
}

async function MembersExportButton({
  ngoId,
  memberCount,
}: {
  ngoId: string
  memberCount: number
}) {
  return (
    <button
      onClick={async () => {
        // Server action call
        const { exportMembersCSV } = await import('@/lib/admin/members-actions')
        await exportMembersCSV(ngoId)
      }}
      className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 transition-colors"
    >
      📥 CSV Dışa Aktar ({memberCount})
    </button>
  )
}

function MembersLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-16 bg-ink-800 rounded-lg border border-ink-700 animate-pulse"
        />
      ))}
    </div>
  )
}
