'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MissionWithNGO, UserMission } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'
import { ChipDS } from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'

interface Props {
  missions: MissionWithNGO[]
  userMissions: UserMission[]
  savedMissionIds?: string[]
  memberNgoIds?: string[]
  userId?: string
}

const filters = [
  { value: 'all',       label: '✦ Tümü' },
  { value: 'nature',    label: '🌿 Çevre' },
  { value: 'education', label: '📖 Eğitim' },
  { value: 'social',    label: '❤️ Sosyal' },
  { value: 'financial', label: '🪙 Finansal' },
  { value: 'animals',   label: '🐾 Hayvanlar' },
  { value: 'culture',   label: '🎭 Kültür' },
]

export function MissionsClient({ missions, userMissions, savedMissionIds = [], memberNgoIds = [], userId }: Props) {
  const { colors: c } = useTheme()
  const [activeFilter, setActiveFilter] = useState('all')

  const completedIds = new Set(userMissions.filter(m => m.status === 'completed').map(m => m.mission_id))
  const takenIds     = new Set(userMissions.filter(m => m.status === 'taken').map(m => m.mission_id))

  const filtered = activeFilter === 'all'
    ? missions
    : missions.filter(m => m.domain === activeFilter)

  return (
    <div style={{ minHeight: '100vh', background: c.ink900, paddingBottom: 96 }}>
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 px-4 pt-12 pb-4"
        style={{ background: c.ink900, borderBottom: `1px solid ${c.ink600}` }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <h1 style={{
            margin: 0,
            fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
            fontSize: 28,
            fontWeight: 500,
            color: c.cream,
            letterSpacing: '-0.025em',
          }}>
            Görevler
          </h1>
          <span style={{
            background: c.goldSoft,
            border: `1px solid ${c.goldLine}`,
            color: c.gold,
            fontSize: 12, fontWeight: 700,
            padding: '2px 10px', borderRadius: 999,
          }}>
            {missions.length}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {filters.map(({ value, label }) => (
            <ChipDS
              key={value}
              active={activeFilter === value}
              onClick={() => setActiveFilter(value)}
            >
              {label}
            </ChipDS>
          ))}
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
                isSaved={savedMissionIds.includes(mission.id)}
                isMember={memberNgoIds.includes(mission.ngo_id ?? '')}
                userId={userId}
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
              background: c.ink800, borderRadius: 20, width: 72, height: 72,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${c.ink600}`, fontSize: 28,
            }}>
              🔍
            </div>
            <p style={{ color: c.ink500, fontSize: 13, fontWeight: 500, margin: 0 }}>
              Bu kategoride görev bulunamadı
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
