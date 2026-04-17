import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Users, Globe, Calendar, Heart, ChevronRight } from 'lucide-react'
import type { NGO, MissionWithNGO } from '@/lib/supabase/types'

async function getNGOWithMissions(id: string): Promise<{ ngo: NGO; missions: MissionWithNGO[] } | null> {
  const supabase = createClient()
  const [{ data: ngo }, { data: missions }] = await Promise.all([
    supabase.from('ngos').select('*').eq('id', id).single(),
    supabase
      .from('missions')
      .select('*, ngos(id, name, short_name, logo_url, color_accent, cover_image_url)')
      .eq('ngo_id', id)
      .eq('active', true)
      .order('created_at', { ascending: true }),
  ])
  if (!ngo) return null
  return { ngo, missions: (missions ?? []) as unknown as MissionWithNGO[] }
}

const domainGradient: Record<string, string> = {
  nature: 'from-emerald-500 to-teal-400',
  education: 'from-blue-500 to-indigo-400',
  social: 'from-rose-500 to-pink-400',
  financial: 'from-amber-500 to-orange-400',
  default: 'from-stone-400 to-stone-500',
}

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: 'Kolay', color: 'bg-emerald-100 text-emerald-700' },
  medium: { label: 'Orta', color: 'bg-amber-100 text-amber-700' },
  hard: { label: 'Zor', color: 'bg-red-100 text-red-700' },
}

export default async function NGODetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const result = await getNGOWithMissions(params.id)
  if (!result) notFound()

  const { ngo, missions } = result
  const coverImageUrl = (ngo as NGO & { cover_image_url?: string | null }).cover_image_url

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Cover + Logo */}
      <div className="relative">
        <div
          className="h-48 bg-cover bg-center"
          style={{
            backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : undefined,
            backgroundColor: coverImageUrl ? undefined : (ngo.color_accent ?? '#F4B942'),
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
          <div className="absolute top-12 left-4">
            <Link href="/dashboard/ngos" className="inline-flex items-center gap-1.5 text-white/90 text-sm">
              <ArrowLeft size={16} />
              Kuruluşlar
            </Link>
          </div>
        </div>

        <div className="bg-white px-4 pt-4 pb-5 border-b border-stone-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-stone-100 flex items-center justify-center overflow-hidden p-2 flex-shrink-0 -mt-10 shadow-lg">
              {ngo.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ngo.logo_url} alt={ngo.name} className="w-full h-full object-contain" />
              ) : (
                <span className="font-black text-stone-700 text-lg">
                  {(ngo.short_name ?? ngo.name).slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="font-display font-extrabold text-xl text-stone-900 leading-tight">{ngo.name}</h1>
              <p className="text-sm text-stone-500 mt-0.5">{ngo.tagline}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { Icon: Users, value: (ngo.member_count ?? 0).toLocaleString('tr-TR'), label: 'Üye' },
              { Icon: Heart, value: (ngo.volunteer_count ?? 0).toLocaleString('tr-TR'), label: 'Gönüllü' },
              { Icon: Calendar, value: String(ngo.founded ?? '—'), label: 'Kuruluş' },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="bg-stone-50 rounded-2xl p-3 text-center">
                <Icon size={14} className="text-stone-400 mx-auto mb-1" />
                <p className="font-bold text-sm text-stone-900">{value}</p>
                <p className="text-[11px] text-stone-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">
        {ngo.description && (
          <section className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
            <h2 className="font-display font-bold text-base text-stone-900 mb-2">Hakkında</h2>
            <p className="text-sm text-stone-500 leading-relaxed">{ngo.description}</p>
            {ngo.website && (
              <a
                href={ngo.website.startsWith('http') ? ngo.website : `https://${ngo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mt-3"
              >
                <Globe size={14} />
                {ngo.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </section>
        )}

        {missions.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-base text-stone-900 mb-3">
              Görevler
              <span className="ml-2 text-sm font-normal text-stone-400">({missions.length})</span>
            </h2>
            <div className="space-y-2">
              {missions.map((mission, index) => {
                const diff = difficultyConfig[mission.difficulty ?? 'easy']
                const domain = mission.domain ?? 'default'
                const gradient = domainGradient[domain] ?? domainGradient.default
                return (
                  <Link
                    key={mission.id}
                    href={`/dashboard/missions/${mission.id}`}
                    className="flex items-center gap-3 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-4 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-sm text-stone-900 truncate">{mission.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${diff.color}`}>
                          {diff.label}
                        </span>
                        <span className="text-[11px] text-primary font-bold">+{mission.karma} karma</span>
                        {mission.duration && (
                          <span className="text-[11px] text-stone-400">{mission.duration}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-stone-300 flex-shrink-0" />
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
