'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Mission, UserMission } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'

interface Props {
  missions: Mission[]
  userMissions: UserMission[]
}

const domains = [
  { value: 'all', label: 'Tümü' },
  { value: 'nature', label: '🌿 Doğa' },
  { value: 'education', label: '📚 Eğitim' },
  { value: 'social', label: '❤️ Sosyal' },
  { value: 'financial', label: '💛 Finansal' },
]

export function MissionsClient({ missions, userMissions }: Props) {
  const [activeFilter, setActiveFilter] = useState('all')

  const completedIds = new Set(
    userMissions.filter(m => m.status === 'completed').map(m => m.mission_id)
  )
  const takenIds = new Set(
    userMissions.filter(m => m.status === 'taken').map(m => m.mission_id)
  )

  const filtered = activeFilter === 'all'
    ? missions
    : missions.filter(m => m.domain === activeFilter)

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-white border-b border-border px-4 pt-12 pb-4 sticky top-0 z-10">
        <h1 className="font-display font-extrabold text-2xl text-text-primary mb-4">Görevler</h1>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {domains.map(({ value, label }) => (
            <motion.button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === value
                  ? 'bg-primary text-white'
                  : 'bg-stone-100 text-text-muted'
              }`}
              whileTap={{ scale: 0.93 }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((mission, i) => (
            <motion.div
              key={mission.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
            >
              <MissionCard
                mission={mission}
                isCompleted={completedIds.has(mission.id)}
                isTaken={takenIds.has(mission.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            Bu kategoride görev bulunamadı
          </div>
        )}
      </div>
    </div>
  )
}
