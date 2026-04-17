'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Profile, Mission, UserMission } from '@/lib/supabase/types'
import { KarmaCounter } from '@/components/ui/karma-counter'
import { XPBar } from '@/components/ui/xp-bar'
import { StreakFlame } from '@/components/ui/streak-flame'
import { TierBadge, getTierFromKarma } from '@/components/ui/tier-badge'
import { MissionCard } from '@/components/ui/mission-card'

interface Props {
  profile: Profile
  missions: Mission[]
  userMissions: UserMission[]
}

const tierThresholds: Record<number, number> = { 1: 500, 2: 1500, 3: 3000, 4: Infinity }

export function DashboardClient({ profile, missions, userMissions }: Props) {
  const tier = getTierFromKarma(profile.karma_total)
  const nextThreshold = tierThresholds[tier]
  const prevThreshold = tier === 1 ? 0 : tierThresholds[tier - 1]

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
      <div className="bg-white px-4 pt-12 pb-6 border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-text-muted text-sm">Merhaba,</p>
              <h1 className="font-display font-extrabold text-2xl text-text-primary">
                {firstName} 👋
              </h1>
            </div>
            <StreakFlame streak={profile.streak} />
          </div>

          <div className="bg-primary/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-primary/70 uppercase tracking-wide">Toplam Karma</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl">✨</span>
                  <KarmaCounter value={profile.karma_total} size="lg" className="text-primary" />
                </div>
              </div>
              <TierBadge tier={tier} />
            </div>
            {nextThreshold !== Infinity && (
              <XPBar
                current={profile.karma_total - prevThreshold}
                max={nextThreshold - prevThreshold}
                label={`Tier ${tier + 1}'e`}
                color="#F4B942"
              />
            )}
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {inProgressMissions.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-lg text-text-primary mb-3">
              Devam Eden Görevler
            </h2>
            <div className="space-y-3">
              {inProgressMissions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <MissionCard mission={mission} isTaken />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg text-text-primary">Öne Çıkan Görevler</h2>
            <Link href="/dashboard/missions" className="text-sm text-primary font-semibold">
              Tümü →
            </Link>
          </div>
          <div className="space-y-3">
            {featuredMissions.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm">
                Tüm öne çıkan görevleri tamamladın! 🎉
              </div>
            ) : (
              featuredMissions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
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

        <section>
          <h2 className="font-display font-bold text-lg text-text-primary mb-3">Keşfet</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/dashboard/ngos', emoji: '🤝', label: "STK'lar", color: 'bg-blue-50 border-blue-100' },
              { href: '/dashboard/rewards', emoji: '🎁', label: 'Ödüller', color: 'bg-amber-50 border-amber-100' },
              { href: '/dashboard/missions', emoji: '📋', label: 'Tüm Görevler', color: 'bg-emerald-50 border-emerald-100' },
              { href: '/dashboard/profile', emoji: '👤', label: 'Profil', color: 'bg-purple-50 border-purple-100' },
            ].map(({ href, emoji, label, color }) => (
              <motion.div key={href} whileTap={{ scale: 0.95 }}>
                <Link href={href}>
                  <div className={`rounded-2xl border p-4 flex items-center gap-3 ${color}`}>
                    <span className="text-2xl">{emoji}</span>
                    <span className="font-semibold text-text-primary text-sm">{label}</span>
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
