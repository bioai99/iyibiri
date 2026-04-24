// components/dashboard/hero-card-v2.tsx
//
// Dashboard ana ekran hero card — V2 tasarım.
// UX Audit 2026-04-24: Kritik 2 (I6) — gold glow imza + breathing animation.
// UI Spec 2026-04-24: Bölüm 2 Layout + Bölüm 4 Token + Bölüm 6 Motion.
// Skill: mobile-app-polish-standards Bölüm 11 İmza patterns.
//
// Özellikler:
// - KarmaCounter count-up animate (Duolingo pattern)
// - Gold glow shadow + 3s breathing loop
// - prefers-reduced-motion respect
// - Seviye + Fraunces italic aksan + progress bar
// - Hafta sinyali (micro-indicator)
// - İlk kullanıcı empty state variant (Karma=0)
// - aria-live="polite" Karma için

'use client'

import { motion, useReducedMotion, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/lib/theme'

interface HeroCardV2Props {
  karma: number
  level: string // "İyi Biri", "Çok İyi Biri", etc.
  nextLevel?: string
  nextLevelAt?: number
  weeklyKarmaGain?: number
  streakDays?: number
  /** Tamamen sıfır — yeni kullanıcı variant */
  isEmpty?: boolean
  /** Loading skeleton */
  isLoading?: boolean
  userName?: string
}

export function HeroCardV2({
  karma,
  level,
  nextLevel,
  nextLevelAt,
  weeklyKarmaGain,
  streakDays,
  isEmpty = false,
  isLoading = false,
  userName,
}: HeroCardV2Props) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const [displayKarma, setDisplayKarma] = useState(shouldReduceMotion ? karma : 0)
  const counterRef = useRef<HTMLSpanElement>(null)

  // Count-up animate — UI spec Motion Bölüm 6 Adım 2
  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayKarma(karma)
      return
    }
    const controls = animate(0, karma, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.2,
      onUpdate: (v) => setDisplayKarma(Math.round(v)),
    })
    return () => controls.stop()
  }, [karma, shouldReduceMotion])

  // Progress yüzdesi
  const progressPct = nextLevelAt
    ? Math.min(Math.round((karma / nextLevelAt) * 100), 100)
    : 0

  if (isLoading) {
    return (
      <div
        className="mx-4 h-[200px] rounded-3xl"
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

  // Empty state — Karma=0 ilk kullanıcı
  if (isEmpty) {
    return (
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
        className="hero-glow-breathing mx-4 overflow-hidden rounded-3xl p-8"
        style={{
          background: `linear-gradient(135deg, ${c.ink800} 0%, ${c.ink800} 50%, ${c.ink900} 100%)`,
          boxShadow: '0 8px 32px rgba(232,194,104,0.35)',
          border: `1px solid ${c.gold}20`,
        }}
      >
        <p
          className="mb-2 text-sm font-medium"
          style={{
            color: c.ink300,
            letterSpacing: '0.04em',
          }}
        >
          Hoş geldin{userName ? `, ${userName}` : ''}
        </p>
        <h1
          className="font-display text-3xl font-medium leading-tight"
          style={{ color: c.cream, letterSpacing: '-0.02em' }}
        >
          İlk adımını at —{' '}
          <em style={{ fontStyle: 'italic', color: c.gold }}>+100 Karma</em>{' '}
          hediye
        </h1>
        <p className="mt-3 text-sm" style={{ color: c.ink300, lineHeight: 1.55 }}>
          Görev keşfet, seç, tamamla. İyilik biriktirmeye başla.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.05,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className="hero-glow-breathing mx-4 overflow-hidden rounded-3xl p-8"
      style={{
        background: `linear-gradient(135deg, ${c.ink800} 0%, ${c.ink800} 50%, ${c.ink900} 100%)`,
        boxShadow: '0 8px 32px rgba(232,194,104,0.35)',
        border: `1px solid ${c.gold}20`,
      }}
    >
      {/* Karma + label */}
      <div className="flex items-baseline gap-3">
        <span
          ref={counterRef}
          className="font-display font-black tabular-nums"
          style={{
            color: c.cream,
            fontSize: 'clamp(3rem, 12vw, 4rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {displayKarma.toLocaleString('tr-TR')}
        </span>
        <span
          className="font-sans text-sm font-medium uppercase"
          style={{
            color: c.ink300,
            letterSpacing: '0.08em',
          }}
        >
          Karma
        </span>
      </div>

      {/* Weekly gain micro-indicator */}
      {weeklyKarmaGain !== undefined && weeklyKarmaGain > 0 && (
        <p className="mt-1 text-xs font-medium" style={{ color: c.gold }}>
          +{weeklyKarmaGain.toLocaleString('tr-TR')} bu hafta
        </p>
      )}

      {/* Seviye */}
      <div className="mt-5">
        <p
          className="font-display text-xl font-medium"
          style={{
            color: c.gold,
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
          }}
        >
          {level} ★
        </p>

        {/* Progress bar — UI spec Bölüm 4 */}
        {nextLevel && nextLevelAt && (
          <div className="mt-3">
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{ background: c.ink700 }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${c.goldDim} 0%, ${c.gold} 100%)`,
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs" style={{ color: c.ink400 }}>
                %{progressPct} · {(nextLevelAt - karma).toLocaleString('tr-TR')}{' '}
                Karma
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: c.ink300 }}
              >
                → {nextLevel}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Streak inline (hero içi, H6 çözümü) */}
      {streakDays !== undefined && streakDays > 0 && (
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{
            background: streakDays >= 7 ? `${c.gold}20` : c.ink700,
            color: streakDays >= 7 ? c.gold : c.cream,
          }}
        >
          <span style={{ fontSize: 14 }}>🔥</span>
          <span
            className="font-sans text-xs font-semibold"
            style={{ letterSpacing: '0.02em' }}
          >
            {streakDays} gün seri
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}
