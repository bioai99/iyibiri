'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface KarmaCounterProps {
  value: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

const sizeClasses = {
  sm: 'text-lg font-bold',
  md: 'text-2xl font-extrabold',
  lg: 'text-4xl font-extrabold',
}

export function KarmaCounter({ value, className = '', size = 'md', animate: shouldAnimate = true }: KarmaCounterProps) {
  const count = useMotionValue(shouldAnimate ? 0 : value)
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString('tr-TR'))
  const prevValue = useRef(value)

  useEffect(() => {
    if (!shouldAnimate) {
      count.set(value)
      return
    }
    const from = prevValue.current
    prevValue.current = value
    const controls = animate(count, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    })
    return controls.stop
  }, [value, count, shouldAnimate])

  return (
    <motion.span
      className={`font-display tabular-nums ${sizeClasses[size]} ${className}`}
      initial={shouldAnimate ? { scale: 1 } : false}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      key={value}
    >
      {rounded}
    </motion.span>
  )
}
