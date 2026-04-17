'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flame, Sparkles, Handshake, Gift, ClipboardList, User, CheckCircle2 } from 'lucide-react'
import type { Profile, MissionWithNGO, UserMission, NGO } from '@/lib/supabase/types'
import { KarmaCounter } from '@/components/ui/karma-counter'
import { MissionCard } from '@/components/ui/mission-card'

interface Props {
  profile: Profile
  missions: MissionWithNGO[]
  userMissions: UserMission[]
  ngos: NGO[]
}


const discoverItems = [
  { href: '/dashboard/ngos', Icon: Handshake, label: 'Kuruluşlar', gradient: 'from-blue-500 to-indigo-400' },
  { href: '/dashboard/rewards', Icon: Gift, label: 'Ödüller', gradient: 'from-amber-500 to-orange-400' },
  { href: '/dashboard/missions', Icon: ClipboardList, label: 'Görevler', gradient: 'from-emerald-500 to-teal-400' },
  { href: '/dashboard/profile', Icon: User, label: 'Profil', gradient: 'from-rose-500 to-pink-400' },
]

export function DashboardClient({ profile, missions, userMissions, ngos }: Props) {
  const completedIds = new Set(
    userMissions.filter(m => m.status === 'completed').map(m => m.mission_id)
  )
  const takenIds = new Set(
    userMissions.filter(m => m.status === 'taken').map(m => m.mission_id)
  )

  const featuredMissions = missions.filter(m => m.featured && !completedIds.has(m.id)).slice(0, 3)
  const inProgressMissions = missions.filter(m => takenIds.has(m.id) && !completedIds.has(m.id))
  const firstName = profile.name?.split(' ')[0] ?? 'Kullanıcı'

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-12 pb-6">
        {/* Hero Card */}
        <motion.div
          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-5 shadow-[0_8px_32px_rgba(251,146,60,0.35)]"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm font-medium">Merhaba,</p>
              <h1 className="font-display font-extrabold text-white text-2xl leading-tight">
                {firstName}
              </h1>
            </div>
            {/* Streak pill */}
            <div className="bg-white/20 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Flame size={16} className="text-white" />
              <span className="text-white font-bold text-sm">{profile.streak}</span>
              <span className="text-white/70 text-xs">gün</span>
            </div>
          </div>

          <div className="flex items-end gap-2 mb-1">
            <Sparkles size={20} className="text-white/70 mb-1" />
            <KarmaCounter
              value={profile.karma_total}
              size="lg"
              className="text-white font-black !text-5xl"
            />
          </div>
          <p className="text-white/70 text-xs font-medium mb-4">toplam karma</p>

          {/* Completed missions pill */}
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 w-fit">
            <CheckCircle2 size={14} className="text-white" />
            <span className="text-white font-bold text-sm">{completedIds.size}</span>
            <span className="text-white/70 text-xs">görev tamamlandı</span>
          </div>
        </motion.div>
      </div>

      <div className="px-4 space-y-7">
        {/* In-Progress */}
        {inProgressMissions.length > 0 && (
          <section>
            <h2 className="font-display font-extrabold text-xl text-stone-900 mb-3">
              Devam Eden
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {inProgressMissions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
                >
                  <MissionCard mission={mission} isTaken compact />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Featured */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-extrabold text-xl text-stone-900">Öne Çıkanlar</h2>
            <Link href="/dashboard/missions" className="text-sm text-primary font-bold">
              Tümü →
            </Link>
          </div>
          <div className="space-y-3">
            {featuredMissions.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-sm">
                Tüm öne çıkan görevleri tamamladın!
              </div>
            ) : (
              featuredMissions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.07 }}
                >
                  <MissionCard
                    mission={mission}
                    isCompleted={completedIds.has(mission.id)}
                    isTaken={takenIds.has(mission.id)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* NGO Feed */}
        {ngos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-extrabold text-xl text-stone-900">Kuruluşlardan</h2>
              <Link href="/dashboard/ngos" className="text-sm text-primary font-bold">
                Tümü →
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {ngos.map((ngo, i) => {
                const coverUrl = (ngo as NGO & { cover_image_url?: string | null }).cover_image_url
                return (
                  <motion.div
                    key={ngo.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 w-[200px]"
                  >
                    <Link href={`/dashboard/ngos/${ngo.id}`}>
                      <div className="rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                        <div
                          className="h-28 bg-cover bg-center"
                          style={{
                            backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                            backgroundColor: coverUrl ? undefined : (ngo.color_accent ?? '#F4B942'),
                          }}
                        />
                        <div className="bg-white px-3 py-3">
                          <div className="flex items-center gap-2">
                            {ngo.logo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={ngo.logo_url}
                                alt={ngo.name}
                                className="w-7 h-7 rounded-lg object-contain border border-stone-100 p-0.5 flex-shrink-0"
                                onError={e => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex') }}
                              />
                            ) : null}
                            <div
                              className="w-7 h-7 rounded-lg items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: ngo.color_accent ?? '#F4B942', display: ngo.logo_url ? 'none' : 'flex' }}
                            >
                              {(ngo.short_name ?? ngo.name)[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="font-display font-bold text-stone-900 text-xs truncate">{ngo.short_name ?? ngo.name}</p>
                              <p className="text-[10px] text-stone-400 truncate">{ngo.tagline}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {/* Discover Grid */}
        <section>
          <h2 className="font-display font-extrabold text-xl text-stone-900 mb-3">Keşfet</h2>
          <div className="grid grid-cols-2 gap-3">
            {discoverItems.map(({ href, Icon, label, gradient }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.1 + i * 0.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link href={href}>
                  <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-5 flex flex-col gap-3`}>
                    <div className="bg-white/20 rounded-xl p-2.5 w-fit">
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="font-display font-bold text-white text-sm">{label}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
