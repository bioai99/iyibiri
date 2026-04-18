'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MissionWithNGO, UserMission } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'

interface Props {
  missions: MissionWithNGO[]
  userMissions: UserMission[]
}

const filters = [
  { value: 'all',       label: '✦ Tümü',      gradient: 'linear-gradient(90deg,#574E42,#3F3830)' },
  { value: 'nature',    label: '🌿 Doğa',      gradient: 'linear-gradient(90deg,#10B981,#14B8A6)' },
  { value: 'education', label: '📖 Eğitim',    gradient: 'linear-gradient(90deg,#3B82F6,#6366F1)' },
  { value: 'social',    label: '❤️ Sosyal',    gradient: 'linear-gradient(90deg,#F43F5E,#EC4899)' },
  { value: 'financial', label: '🪙 Finansal',  gradient: 'linear-gradient(90deg,#F59E0B,#F97316)' },
  { value: 'animals',   label: '🐾 Hayvanlar', gradient: 'linear-gradient(90deg,#F97316,#F59E0B)' },
  { value: 'culture',   label: '🎭 Kültür',    gradient: 'linear-gradient(90deg,#A855F7,#D946EF)' },
]

export function MissionsClient({ missions, userMissions }: Props) {
  const [activeFilter, setActiveFilter] = useState('all')

  const completedIds = new Set(userMissions.filter(m => m.status === 'completed').map(m => m.mission_id))
  const takenIds     = new Set(userMissions.filter(m => m.status === 'taken').map(m => m.mission_id))

  const filtered = activeFilter === 'all'
    ? missions
    : missions.filter(m => m.domain === activeFilter)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky header */}
      <div
        className="bg-background sticky top-0 z-10 px-4 pt-12 pb-4"
        style={{ borderBottom: '1px solid #3F3830' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.025em' }}>
            Görevler
          </h1>
          <span style={{
            background: 'rgba(232,194,104,0.14)',
            border: '1px solid rgba(232,194,104,0.3)',
            color: '#E8C268',
            fontSize: 12, fontWeight: 700,
            padding: '2px 10px', borderRadius: 999,
          }}>
            {missions.length}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {filters.map(({ value, label, gradient }) => {
            const isActive = activeFilter === value
            return (
              <motion.button
                key={value}
                onClick={() => setActiveFilter(value)}
                whileTap={{ scale: 0.93 }}
                style={{
                  flexShrink: 0,
                  padding: '7px 14px',
                  borderRadius: 999,
                  fontSize: 12, fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  background: isActive ? gradient : '#36302A',
                  color: isActive ? 'white' : '#7A6F5E',
                  outline: isActive ? 'none' : '1px solid #3F3830',
                  transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
                }}
              >
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
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 0', gap: 12 }}
          >
            <div style={{
              background: '#2E2923', borderRadius: 20, width: 72, height: 72,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #3F3830', fontSize: 28,
            }}>
              🔍
            </div>
            <p style={{ color: '#574E42', fontSize: 13, fontWeight: 500, margin: 0 }}>
              Bu kategoride görev bulunamadı
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
