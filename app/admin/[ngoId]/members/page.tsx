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

// BUG-050 fix (Vol-21): Server component içinde onClick yasak — link olarak çevirdik.
// CSV export server action /api route veya client wrapper gerek; şimdilik link disabled label.
function MembersExportButton({
  ngoId: _ngoId,
  memberCount,
}: {
  ngoId: string
  memberCount: number
}) {
  return (
    <span
      className="px-6 py-3 bg-ink-700 text-ink-300 rounded-xl font-semibold cursor-not-allowed inline-flex items-center gap-2"
      title="CSV dışa aktarma yakında"
    >
      📥 CSV Dışa Aktar ({memberCount}) · yakında
    </span>
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
