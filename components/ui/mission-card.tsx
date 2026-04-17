'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react'
import { DomainIcon } from './domain-icon'
import type { MissionWithNGO } from '@/lib/supabase/types'

interface MissionCardProps {
  mission: MissionWithNGO
  isCompleted?: boolean
  isTaken?: boolean
  compact?: boolean
}

const domainGradient: Record<string, string> = {
  nature: 'from-emerald-500 to-teal-400',
  education: 'from-blue-500 to-indigo-400',
  social: 'from-rose-500 to-pink-400',
  financial: 'from-amber-500 to-orange-400',
  default: 'from-stone-400 to-stone-500',
}

const domainLabel: Record<string, string> = {
  nature: 'DOĞA',
  education: 'EĞİTİM',
  social: 'SOSYAL',
  financial: 'FİNANSAL',
  default: 'GÖNÜLLÜLÜK',
}

const difficultyConfig = {
  easy: { label: 'Kolay', color: 'bg-emerald-100 text-emerald-700' },
  medium: { label: 'Orta', color: 'bg-amber-100 text-amber-700' },
  hard: { label: 'Zor', color: 'bg-red-100 text-red-700' },
}

export function MissionCard({ mission, isCompleted, isTaken, compact = false }: MissionCardProps) {
  const domain = mission.domain ?? 'default'
  const gradient = domainGradient[domain] ?? domainGradient.default
  const label = domainLabel[domain] ?? domainLabel.default
  const difficulty = difficultyConfig[mission.difficulty ?? 'easy']
  const ngo = mission.ngos

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={compact ? 'w-[260px] flex-shrink-0' : 'w-full'}
    >
      <Link href={`/dashboard/missions/${mission.id}`}>
        <div
          className={`rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)] transition-shadow ${
            isCompleted ? 'opacity-75' : ''
          } ${isTaken && !isCompleted ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
        >
          {/* Gradient Band */}
          <div className={`bg-gradient-to-br ${gradient} px-4 pt-4 pb-3 relative`}>
            <div className="flex items-start justify-between">
              <DomainIcon domain={domain} size="md" variant="onGradient" />
              <div className="bg-white/20 rounded-full px-3 py-1 flex items-center gap-1">
                <Sparkles size={11} className="text-white/90" />
                <span className="text-white font-bold text-sm">{mission.karma}</span>
              </div>
            </div>
            {/* Domain label + NGO identity */}
            <div className="flex items-end justify-between mt-3">
              <p className="text-white/70 text-xs font-semibold tracking-widest">{label}</p>
              {ngo && (
                <div className="flex items-center gap-1.5">
                  {ngo.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ngo.logo_url}
                      alt={ngo.name}
                      className="w-5 h-5 rounded object-contain bg-white/90 p-[2px] flex-shrink-0"
                      onError={e => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex') }}
                    />
                  ) : null}
                  <div
                    className="w-5 h-5 rounded items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: ngo.color_accent ?? '#F4B942', display: ngo.logo_url ? 'none' : 'flex' }}
                  >
                    {(ngo.short_name ?? ngo.name)[0]}
                  </div>
                  <span className="text-white/80 text-xs font-medium max-w-[90px] truncate">
                    {ngo.short_name ?? ngo.name}
                  </span>
                </div>
              )}
            </div>
            {isCompleted && (
              <div className="absolute top-3 right-14">
                <CheckCircle2 size={20} className="text-white drop-shadow" />
              </div>
            )}
          </div>

          {/* White Body */}
          <div className="bg-white px-4 py-3">
            <h3 className="font-display font-bold text-stone-900 text-base leading-snug line-clamp-1">
              {mission.title}
            </h3>

            {/* Devam ediyor progress bar */}
            {isTaken && !isCompleted && (
              <div className="mt-2 mb-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-blue-500">Devam ediyor</span>
                </div>
                <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '55%' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {!compact && (
              <p className="text-sm text-stone-500 mt-1 line-clamp-1">
                {mission.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2.5">
              {mission.duration && (
                <span className="flex items-center gap-1 text-xs text-stone-400">
                  <Clock size={12} />
                  {mission.duration}
                </span>
              )}
              {mission.difficulty && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficulty.color}`}>
                  {difficulty.label}
                </span>
              )}
              <ChevronRight size={16} className="text-stone-300 ml-auto" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
