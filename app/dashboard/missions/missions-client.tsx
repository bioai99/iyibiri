'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, BookOpen, Heart, Coins, LayoutGrid, ClipboardX } from 'lucide-react'
import type { Mission, UserMission } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'

interface Props {
  missions: Mission[]
  userMissions: UserMission[]
}

const filters = [
  { value: 'all', label: 'Tümü', Icon: LayoutGrid, activeGradient: 'from-stone-700 to-stone-600' },
  { value: 'nature', label: 'Doğa', Icon: Leaf, activeGradient: 'from-emerald-500 to-teal-400' },
  { value: 'education', label: 'Eğitim', Icon: BookOpen, activeGradient: 'from-blue-500 to-indigo-400' },
  { value: 'social', label: 'Sosyal', Icon: Heart, activeGradient: 'from-rose-500 to-pink-400' },
  { value: 'financial', label: 'Finansal', Icon: Coins, activeGradient: 'from-amber-500 to-orange-400' },
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
      {/* Sticky Header */}
      <div className="bg-background px-4 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="font-display font-extrabold text-3xl text-stone-900">Görevler</h1>
          <span className="bg-primary/15 text-primary font-bold text-sm px-2.5 py-0.5 rounded-full">
            {missions.length}
          </span>
        </div>
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {filters.map(({ value, label, Icon, activeGradient }) => {
            const isActive = activeFilter === value
            return (
              <motion.button
                key={value}
                onClick={() => setActiveFilter(value)}
                whileTap={{ scale: 0.93 }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${activeGradient} text-white shadow-md`
                    : 'bg-white border border-stone-200 text-stone-500'
                }`}
              >
                <Icon size={14} />
                {label}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((mission, i) => (
            <motion.div
              key={mission.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.04 }}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-16 gap-4"
          >
            <div className="bg-stone-100 rounded-3xl p-6">
              <ClipboardX size={32} className="text-stone-400" />
            </div>
            <p className="text-stone-400 text-sm font-medium">Bu kategoride görev bulunamadı</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
