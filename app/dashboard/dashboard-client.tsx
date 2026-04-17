'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flame, Sparkles, Handshake, Gift, ClipboardList, User, CheckCircle2 } from 'lucide-react'
import type { Profile, MissionWithNGO, UserMission } from '@/lib/supabase/types'
import { KarmaCounter } from '@/components/ui/karma-counter'
import { MissionCard } from '@/components/ui/mission-card'

interface Props {
  profile: Profile
  missions: MissionWithNGO[]
  userMissions: UserMission[]
}


const discoverItems = [
  { href: '/dashboard/ngos', Icon: Handshake, label: 'Kuruluşlar', gradient: 'from-blue-500 to-indigo-400' },
  { href: '/dashboard/rewards', Icon: Gift, label: 'Ödüller', gradient: 'from-amber-500 to-orange-400' },
  { href: '/dashboard/missions', Icon: ClipboardList, label: 'Görevler', gradient: 'from-emerald-500 to-teal-400' },
  { href: '/dashboard/profile', Icon: User, label: 'Profil', gradient: 'from-rose-500 to-pink-400' },
]

export function DashboardClient({ profile, missions, userMissions }: Props) {
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
