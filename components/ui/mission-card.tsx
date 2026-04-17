'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Mission } from '@/lib/supabase/types'

interface MissionCardProps {
  mission: Mission
  isCompleted?: boolean
  isTaken?: boolean
}

const difficultyConfig = {
  easy: { label: 'Kolay', color: 'text-emerald-600 bg-emerald-50' },
  medium: { label: 'Orta', color: 'text-amber-600 bg-amber-50' },
  hard: { label: 'Zor', color: 'text-red-600 bg-red-50' },
}

const domainColors: Record<string, string> = {
  nature: 'border-l-emerald-400',
  education: 'border-l-blue-400',
  social: 'border-l-rose-400',
  financial: 'border-l-amber-400',
}

export function MissionCard({ mission, isCompleted, isTaken }: MissionCardProps) {
  const difficulty = difficultyConfig[mission.difficulty ?? 'easy']
  const domainColor = domainColors[mission.domain ?? 'social']

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <Link href={`/dashboard/missions/${mission.id}`}>
        <div className={`bg-white rounded-2xl border border-border shadow-sm border-l-4 ${domainColor} overflow-hidden relative`}>
          {isCompleted && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-text-primary text-base leading-snug truncate">
                  {mission.title}
                </h3>
                <p className="text-sm text-text-muted mt-0.5 line-clamp-2">
                  {mission.description}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-lg">✨</span>
                  <span className="font-extrabold text-primary font-display text-lg leading-none">
                    {mission.karma}
                  </span>
                </div>
                <span className="text-xs text-text-muted">karma</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              {mission.difficulty && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficulty.color}`}>
                  {difficulty.label}
                </span>
              )}
              {mission.duration && (
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <span>⏱</span> {mission.duration}
                </span>
              )}
              {isTaken && !isCompleted && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-blue-600 bg-blue-50 ml-auto">
                  Devam ediyor
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
