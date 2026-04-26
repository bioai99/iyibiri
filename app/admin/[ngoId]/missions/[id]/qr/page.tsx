'use server'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { QRGenerator } from '@/app/admin/missions/[id]/qr/qr-generator'

interface AdminMissionQRPageProps {
  params: Promise<{ ngoId: string; id: string }>
}

async function getMission(missionId: string, ngoId: string) {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('missions')
    .select('id, title, verify_code, verify_method, ngo_id')
    .eq('id', missionId)
    .eq('ngo_id', ngoId)
    .maybeSingle()

  if (error) {
    console.error('Mission QR fetch error:', error)
    return null
  }
  return data
}

// BUG-052 fix (Vol-23): NGO admin QR generate path /admin/[ngoId]/missions/[id]/qr
// Daha önce sadece super-admin path /admin/missions/[id]/qr vardı; NGO admin
// scope'lu sürüm eksik kalmıştı. Aynı QRGenerator component reuse edilir.
export default async function AdminMissionQRPage({
  params,
}: AdminMissionQRPageProps) {
  const { ngoId, id } = await params
  const mission = await getMission(id, ngoId)

  if (!mission) {
    return (
      <div className="space-y-4 max-w-md mx-auto">
        <div className="bg-ink-800 border border-clay/40 rounded-2xl p-6">
          <h1 className="text-xl font-display font-bold text-clay mb-2">
            Görev bulunamadı
          </h1>
          <p className="text-cream mb-4 text-sm">
            Bu görev bu STK'ya ait değil veya silinmiş.
          </p>
          <Link
            href={`/admin/${ngoId}/missions`}
            className="inline-block px-4 py-2 bg-gold text-ink-900 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
          >
            ← Görev listesi
          </Link>
        </div>
      </div>
    )
  }

  if (!mission.verify_code) {
    return (
      <div className="space-y-4 max-w-md mx-auto">
        <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
          <h1 className="text-xl font-display font-bold text-cream mb-2">
            QR kod yok
          </h1>
          <p className="text-ink-300 mb-4 text-sm">
            Bu görev için doğrulama kodu (verify_code) tanımlı değil. QR
            doğrulama kullanmıyor olabilir (foto / GPS verify_method).
          </p>
          <p className="text-xs text-ink-400 mb-4">
            verify_method: <code className="font-mono bg-ink-900 px-2 py-0.5 rounded">{mission.verify_method ?? '—'}</code>
          </p>
          <Link
            href={`/admin/${ngoId}/missions/${mission.id}/edit`}
            className="inline-block px-4 py-2 bg-gold text-ink-900 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
          >
            Görev ayarlarını düzenle
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-2">
      <Link
        href={`/admin/${ngoId}/missions`}
        className="inline-block text-sm text-ink-300 hover:text-cream"
      >
        ← Görev listesi
      </Link>
      <h1 className="font-display font-bold text-2xl text-cream">
        {mission.title}
      </h1>
      <p className="text-ink-300 text-sm">
        QR kod içeriği:{' '}
        <code className="font-mono bg-ink-800 text-gold px-2 py-0.5 rounded">
          {mission.verify_code}
        </code>
      </p>
      <div className="pt-4">
        <QRGenerator
          missionId={mission.id}
          verifyCode={mission.verify_code}
          missionTitle={mission.title}
        />
      </div>
    </div>
  )
}
