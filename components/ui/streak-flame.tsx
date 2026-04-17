'use client'

import { motion } from 'framer-motion'

interface StreakFlameProps {
  streak: number
  className?: string
}

export function StreakFlame({ streak, className = '' }: StreakFlameProps) {
  const isActive = streak > 0

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <motion.span
        className="text-2xl select-none"
        animate={isActive ? {
          scale: [1, 1.2, 1],
          rotate: [-3, 3, -3],
        } : { scale: 1, rotate: 0 }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: 'easeInOut',
        }}
        style={{ filter: isActive ? undefined : 'grayscale(1)' }}
      >
        🔥
      </motion.span>
      <div className="flex flex-col">
        <span className={`text-lg font-extrabold font-display leading-none ${isActive ? 'text-orange-500' : 'text-stone-400'}`}>
          {streak}
        </span>
        <span className="text-xs text-text-muted leading-none">aylık seri</span>
      </div>
    </div>
  )
}
