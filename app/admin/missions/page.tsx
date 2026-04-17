import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Mission } from '@/lib/supabase/types'

async function getMissions(): Promise<Mission[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .order('title')
  if (error) throw error
  return data
}

export default async function AdminMissionsPage() {
  const missions = await getMissions()

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-text-primary mb-6">
        Misyonlar ({missions.length})
      </h1>
      <div className="space-y-3">
        {missions.map(mission => (
          <div key={mission.id} className="bg-white rounded-xl border border-border p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-text-primary">{mission.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-text-muted capitalize">{mission.verify_method}</span>
                <span className="text-xs text-text-muted">✨ {mission.karma} karma</span>
                {mission.verify_code && (
                  <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    {mission.verify_code}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(mission.verify_method === 'qr' || mission.verify_method === 'code') && (
                <Link
                  href={`/admin/missions/${mission.id}/qr`}
                  className="text-sm font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5"
                >
                  QR Üret
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
