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
        <h1 className="font-display font-extrabold text-2xl text-stone-900">İyilik Öncüleri</h1>
        <p className="text-stone-500 text-sm mt-1">STK, vakıf, dernek ve belediyeler</p>
      </div>
      <div className="px-4 py-4 space-y-3">
        {ngos.length === 0 && (
          <div className="text-center py-16 text-stone-400 text-sm">
            Henüz kayıtlı kuruluş bulunmuyor.
          </div>
        )}
        {ngos.map(ngo => (
          <Link key={ngo.id} href={`/dashboard/ngos/${ngo.id}`}>
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)] transition-shadow p-4 flex items-center gap-4">
              {/* Logo */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-stone-100"
                style={{ backgroundColor: ngo.logo_url ? '#FFFFFF' : (ngo.color_accent ?? '#F4B942') }}
              >
                {ngo.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ngo.logo_url}
                    alt={ngo.name}
                    className="w-full h-full object-contain p-1.5"
                  />
                ) : (
                  <span className="text-white font-black text-xl">
                    {(ngo.short_name ?? ngo.name)[0]}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-stone-900 truncate">{ngo.name}</h2>
                <p className="text-sm text-stone-500 truncate mt-0.5">{ngo.tagline}</p>
              </div>

              <span className="text-stone-300 text-lg flex-shrink-0">›</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
