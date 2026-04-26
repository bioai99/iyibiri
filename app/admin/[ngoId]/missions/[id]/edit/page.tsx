'use server'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { AdminMissionForm } from '../../mission-form'

interface AdminMissionEditPageProps {
  params: Promise<{ ngoId: string; id: string }>
}

async function getMission(missionId: string, ngoId: string) {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('missions')
    .select('id, title, description, domain, category, karma, event_date, location, image_url, status, ngo_id')
    .eq('id', missionId)
    .eq('ngo_id', ngoId)
    .maybeSingle()

  if (error) {
    console.error('Mission fetch error (edit):', error)
    return null
  }
  return data
}

export default async function AdminMissionEditPage({
  params,
}: AdminMissionEditPageProps) {
  const { ngoId, id } = await params
  const mission = await getMission(id, ngoId)

  // BUG-051 paralel fix: cross-NGO erişim → custom unauthorized UX
  if (!mission) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="bg-ink-800 border border-clay/40 rounded-2xl p-6">
          <h1 className="text-2xl font-display font-bold text-clay mb-2">
            Görev bulunamadı
          </h1>
          <p className="text-cream mb-4">
            Bu görev bu STK'ya ait değil veya silinmiş. Yetkin olmayan bir
            kayda erişmeye çalışmış olabilirsin.
          </p>
          <Link
            href={`/admin/${ngoId}/missions`}
            className="inline-block px-4 py-2 bg-gold text-ink-900 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
          >
            ← Görev listesine dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Görevi Düzenle
        </h1>
        <p className="text-ink-300 mt-1">
          {mission.title}
        </p>
      </div>

      <AdminMissionForm ngoId={ngoId} mission={mission} />
    </div>
  )
}
