import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { NGO } from '@/lib/supabase/types'

async function getNGOs(): Promise<NGO[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('ngos').select('*')
  if (error) throw error
  return data
}

export default async function NGOsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const ngos = await getNGOs()

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-white border-b border-border px-4 pt-12 pb-4">
        <h1 className="font-display font-extrabold text-2xl text-text-primary">İyilik Öncüleri</h1>
        <p className="text-text-muted text-sm mt-1">Misyon ortağı STK&apos;larımız</p>
      </div>
      <div className="px-4 py-4 space-y-3">
        {ngos.map(ngo => (
          <Link key={ngo.id} href={`/dashboard/ngos/${ngo.id}`}>
            <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: ngo.color_accent ?? '#F4B942' }}
              >
                {ngo.short_name?.[0] ?? ngo.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-text-primary truncate">{ngo.name}</h2>
                <p className="text-sm text-text-muted truncate">{ngo.tagline}</p>
              </div>
              <span className="text-text-muted">›</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
