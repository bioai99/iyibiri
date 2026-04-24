// components/dashboard/daily-mission-card.tsx
//
// "Günün Görevi" featured card — UX Audit 2026-04-24 Kritik 1 (H6) çözümü.
// UI Spec 2026-04-24: Bölüm 2 (layout) + Bölüm 5 Variant × State.
// Things 3 "tek amaç" disiplin + Duolingo "günlük hedef" pattern.
//
// Özellikler:
// - Sol dikey gold accent bar (4px)
// - Full-bleed photo + black gradient overlay
// - Karma + süre + STK micro-badges
// - Impact statement vurgu
// - "Başvur" primary CTA (haptic medium tap)
// - Loading skeleton

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'
import { useTheme } from '@/lib/theme'

interface DailyMissionCardProps {
  mission: {
    id: string
    title: string
    ngo: string
    ngoLogo?: string
    photoUrl?: string
    karma: number
    duration?: string
    impactStatement?: string
  } | null
  isLoading?: boolean
}

export function DailyMissionCard({ mission, isLoading = false }: DailyMissionCardProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  if (isLoading) {
    return (
      <div
        className="mx-4 h-[140px] rounded-2xl"
        style={{
          background: c.ink800,
          animation: 'shimmer 2s ease-in-out infinite',
          backgroundImage: `linear-gradient(90deg, ${c.ink800} 0%, ${c.ink700} 50%, ${c.ink800} 100%)`,
          backgroundSize: '200% 100%',
        }}
        aria-busy="true"
      />
    )
  }

  if (!mission) return null

  const fallbackPhoto =
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80'
  const photo = mission.photoUrl || fallbackPhoto

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5, type: 'spring', stiffness: 400, damping: 30 }}
      className="mx-4"
    >
      {/* Section head — "GÜNÜN GÖREVİ" */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className="inline-block h-3 w-1 rounded-full"
          style={{ background: c.gold }}
          aria-hidden="true"
        />
        <span
          className="font-sans text-[10px] font-semibold uppercase"
          style={{
            color: c.gold,
            letterSpacing: '0.12em',
          }}
        >
          Günün görevi
        </span>
      </div>

      <Link
        href={`/dashboard/missions/${mission.id}`}
        style={{ textDecoration: 'none' }}
      >
        <motion.div
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            borderLeft: `4px solid ${c.gold}`,
          }}
        >
          {/* Photo hero strip */}
          <div className="relative h-[120px] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%)',
              }}
            />

            {/* Bottom overlay content */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
              <div>
                {/* Karma + süre chips */}
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-1 font-sans text-[11px] font-bold tabular-nums"
                    style={{
                      background: c.gold,
                      color: c.ink,
                    }}
                  >
                    +{mission.karma.toLocaleString('tr-TR')} Karma
                  </span>
                  {mission.duration && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-sans text-[11px] font-medium backdrop-blur"
                      style={{
                        background: 'rgba(255,255,255,0.18)',
                        color: '#fff',
                      }}
                    >
                      <Clock size={10} strokeWidth={2.2} />
                      {mission.duration}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  className="font-sans font-semibold"
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    lineHeight: 1.25,
                    textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  {mission.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Body — NGO + impact + CTA */}
          <div className="px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p
                  className="font-sans text-xs font-medium"
                  style={{ color: c.ink300 }}
                >
                  {mission.ngo}
                </p>
                {mission.impactStatement && (
                  <p
                    className="mt-1 font-sans text-xs italic"
                    style={{
                      color: c.ink200 || c.cream,
                      lineHeight: 1.45,
                    }}
                  >
                    {mission.impactStatement}
                  </p>
                )}
              </div>

              {/* Başvur CTA */}
              <div
                className="flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 font-sans text-xs font-bold"
                style={{
                  background: c.gold,
                  color: c.ink,
                }}
              >
                Başvur
                <ArrowRight size={12} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
