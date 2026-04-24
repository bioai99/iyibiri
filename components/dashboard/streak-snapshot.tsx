'use client'

/**
 * StreakSnapshot — molecule component
 *
 * 7-gün dot ring + flame icon + "N gün seri" label.
 * 3 variant: default (1-6 gün), active (7+ gün, gold ring), broken (son gün kaçırmış, clay accent)
 *
 * Motion:
 *   - Entry: 7-dot stagger (40ms each) + scale 0→1 (spring 400/30, total 280ms)
 *   - Flame: pulse 2s cycle (opacity 0.8→1→0.8), useReducedMotion respect
 *
 * A11y:
 *   - role="img"
 *   - aria-label: "N gün üst üste karma kazandın"
 *   - Reduced motion: instant, opacity only
 */

import { motion, useReducedMotion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useTheme } from '@/lib/theme'

interface StreakSnapshotProps {
  recentDays: boolean[]   // son 7 gün, index 0 = bugün
  currentStreak: number
  lastActiveAt?: Date | null
}

export function StreakSnapshot({
  recentDays,
  currentStreak,
  lastActiveAt,
}: StreakSnapshotProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  // Variant karar
  const today = recentDays[0] ?? false
  const yesterday = recentDays[1] ?? false
  const isBroken = !today && !yesterday && currentStreak === 0
  const isActive = currentStreak >= 7

  const ringColor = isActive ? c.gold : isBroken ? c.clay : c.ink500
  const flameColor = isActive ? c.gold : isBroken ? c.ink400 : c.gold
  const dotBgColor = isActive ? c.gold : isBroken ? c.clay : c.ink700

  return (
    <div
      role="img"
      aria-label={
        currentStreak === 0
          ? 'Seri kaybedildi, bugün yeni seri başlat'
          : `${currentStreak} gün üst üste karma kazandın`
      }
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: c.ink700,
        borderRadius: 12,
        margin: '12px 0 0',
      }}
    >
      {/* 7-dot ring */}
      <div style={{ display: 'flex', gap: 4 }}>
        {recentDays.map((active, i) => (
          <motion.div
            key={i}
            initial={
              shouldReduceMotion
                ? { scale: 1, opacity: 1 }
                : { scale: 0, opacity: 0 }
            }
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: shouldReduceMotion ? 0 : i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: active ? ringColor : 'transparent',
              border: `1.5px solid ${active ? ringColor : c.ink600}`,
            }}
          />
        ))}
      </div>

      {/* Flame + streak label */}
      <motion.div
        animate={
          shouldReduceMotion || !isActive
            ? {}
            : {
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <Flame
          size={14}
          color={flameColor}
          fill={isActive ? flameColor : 'none'}
          strokeWidth={2}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: isActive ? c.cream : c.ink300,
          }}
        >
          {currentStreak === 0
            ? 'Yeni seri başlat'
            : `${currentStreak} gün`}
        </span>
      </motion.div>
    </div>
  )
}
