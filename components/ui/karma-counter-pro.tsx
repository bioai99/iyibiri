'use client'

/**
 * KarmaCounterPro — molecule
 *
 * Karma count-up master component. Mevcut KarmaCounter (hero-card-v2 inline) genişletilmiş hali.
 *
 * Features:
 * - Count-up animation (easeOutExpo, 800-1200ms configurable)
 * - Delta float "+X" up+fade animation (800ms)
 * - Tier badge transition (scale 0.8→1.1→1.0 spring, tier değişiminde)
 * - Glow ring concentric 3-wave (radial expand, tier transition sırasında)
 * - Haptic feedback (Capacitor iOS light tap on count complete, opt-in)
 * - useReducedMotion respect (instant set, no animation)
 *
 * Props:
 *   from: number (başlangıç)
 *   to: number (hedef)
 *   duration?: number (default 800)
 *   showDelta?: boolean (default true — "+X" float up)
 *   showTierBadge?: boolean (default false — tier değişimi rozet)
 *   onComplete?: () => void
 *   size?: 'sm' | 'md' | 'lg' | 'hero' (24/32/48/72 font)
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, AnimatePresence, animate } from 'framer-motion'
import { useTheme } from '@/lib/theme'

// Tier logic (karma-level helper)
const TIER_THRESHOLDS = [0, 500, 2000, 5000, 10000] as const
const TIER_NAMES = [
  'Yolcu',
  'İyi Birey',
  'İyi Vatandaş',
  'İyi Öncü',
  'İyi Rehber',
] as const

function computeTier(karma: number): number {
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (karma >= TIER_THRESHOLDS[i]) return i
  }
  return 0
}

interface KarmaCounterProProps {
  from?: number
  to: number
  duration?: number
  showDelta?: boolean
  showTierBadge?: boolean
  onComplete?: () => void
  size?: 'sm' | 'md' | 'lg' | 'hero'
}

export function KarmaCounterPro({
  from = 0,
  to,
  duration = 800,
  showDelta = true,
  showTierBadge = false,
  onComplete,
  size = 'md',
}: KarmaCounterProProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(from)
  const [showGlow, setShowGlow] = useState(false)
  const rafRef = useRef<number>()

  const delta = to - from
  const fromTier = computeTier(from)
  const toTier = computeTier(to)
  const tierChanged = fromTier !== toTier && showTierBadge

  // Font sizes
  const fontSizeMap = { sm: 24, md: 32, lg: 48, hero: 72 }
  const fontSize = fontSizeMap[size]

  // Count-up effect
  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(to)
      onComplete?.()
      return
    }

    const startTime = performance.now()
    const animate_frame = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const value = Math.round(from + delta * eased)
      setDisplayValue(value)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate_frame)
      } else {
        onComplete?.()
        if (tierChanged) {
          setShowGlow(true)
          setTimeout(() => setShowGlow(false), 2000)
        }
      }
    }
    rafRef.current = requestAnimationFrame(animate_frame)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [to, from, duration, shouldReduceMotion, tierChanged, onComplete])

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Glow ring concentric (tier change) */}
      <AnimatePresence>
        {showGlow && !shouldReduceMotion && (
          <>
            {[0, 0.3, 0.6].map((delay, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  margin: 'auto',
                  width: fontSize * 1.5,
                  height: fontSize * 1.5,
                  borderRadius: '50%',
                  border: `2px solid ${c.gold}`,
                  pointerEvents: 'none',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Counter */}
      <motion.span
        style={{
          fontSize,
          fontWeight: 700,
          color: c.gold,
          fontFamily: "var(--font-display), 'Fraunces', serif",
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {displayValue.toLocaleString('tr-TR')}
      </motion.span>

      {/* Tier badge (tier değişiminde) */}
      <AnimatePresence>
        {tierChanged && !shouldReduceMotion && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.1, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: duration / 1000,
              ease: [0.22, 1.2, 0.36, 1],
            }}
            style={{
              padding: '3px 10px',
              background: c.goldSoft,
              border: `1px solid ${c.goldLine}`,
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: c.gold,
            }}
          >
            {TIER_NAMES[toTier]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delta float "+X" */}
      <AnimatePresence>
        {showDelta && delta > 0 && !shouldReduceMotion && (
          <motion.span
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -30, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              right: -40,
              top: '50%',
              fontSize: Math.floor(fontSize * 0.45),
              fontWeight: 700,
              color: c.gold,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            +{delta}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
