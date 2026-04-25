'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { haptic } from '@/lib/haptic'

interface AnimatedHeartProps {
  filled: boolean
  onToggle: () => void
  size?: number
  ariaLabel?: string
}

export function AnimatedHeart({
  filled,
  onToggle,
  size = 20,
  ariaLabel = 'Beğen',
}: AnimatedHeartProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const handleClick = () => {
    haptic.tap()
    onToggle()
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={shouldReduceMotion ? {} : { scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      aria-label={ariaLabel}
      aria-pressed={filled}
      style={{
        padding: 8,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={filled ? 'filled' : 'outline'}
          initial={shouldReduceMotion ? {} : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={shouldReduceMotion ? {} : { scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          style={{ display: 'flex' }}
        >
          <Heart
            size={size}
            fill={filled ? c.gold : 'transparent'}
            color={filled ? c.gold : c.ink300}
            strokeWidth={2}
          />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
