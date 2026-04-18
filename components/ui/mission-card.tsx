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
      className={compact ? 'w-[230px] flex-shrink-0' : 'w-full'}
    >
      <Link href={`/dashboard/missions/${mission.id}`}>
        <div
          className={`rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)] transition-shadow ${
            isCompleted ? 'opacity-75' : ''
          } ${isTaken && !isCompleted ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
        >
          {/* Gradient Band */}
          <div className={`bg-gradient-to-br ${gradient} px-3 pt-3 pb-2 relative`}>
            {/* Top row: NGO identity (primary) + karma pill */}
            <div className="flex items-center justify-between">
              {ngo ? (
                <div className="flex items-center gap-1.5">
                  {ngo.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ngo.logo_url}
                      alt={ngo.name}
                      className="w-8 h-8 rounded-lg object-contain bg-white/90 p-[2px] flex-shrink-0"
                      onError={e => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex') }}
                    />
                  ) : null}
                  <div
                    className="w-8 h-8 rounded-lg items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: ngo.color_accent ?? '#F4B942', display: ngo.logo_url ? 'none' : 'flex' }}
                  >
                    {(ngo.short_name ?? ngo.name)[0]}
                  </div>
                  <span className="text-white font-semibold text-xs max-w-[100px] truncate">
                    {ngo.short_name ?? ngo.name}
                  </span>
                </div>
              ) : (
                <DomainIcon domain={domain} size="sm" variant="onGradient" />
              )}
              <div className="bg-white/20 rounded-full px-2.5 py-0.5 flex items-center gap-1 flex-shrink-0">
                <Sparkles size={10} className="text-white/90" />
                <span className="text-white font-bold text-xs">{mission.karma}</span>
              </div>
            </div>
            {/* Bottom row: domain (secondary) */}
            <div className="flex items-center justify-end mt-2">
              <div className="flex items-center gap-1">
                <DomainIcon domain={domain} size="sm" variant="onGradient" />
                <p className="text-white/60 text-[10px] font-semibold tracking-widest">{label}</p>
              </div>
            </div>
            {isCompleted && (
              <div className="absolute top-2 right-12">
                <CheckCircle2 size={16} className="text-white drop-shadow" />
              </div>
            )}
          </div>

          {/* White Body */}
          <div className="bg-white px-3 py-2.5">
            <h3 className="font-display font-bold text-stone-900 text-sm leading-snug line-clamp-1">
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
            <div className="flex items-center gap-1.5 mt-2">
              {mission.duration && (
                <span className="flex items-center gap-1 text-[11px] text-stone-400">
                  <Clock size={11} />
                  {mission.duration}
                </span>
              )}
              {mission.difficulty && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${difficulty.color}`}>
                  {difficulty.label}
                </span>
              )}
              <ChevronRight size={14} className="text-stone-300 ml-auto" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
