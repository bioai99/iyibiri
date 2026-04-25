'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  onClick?: () => void
  strength?: number
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
  'aria-label'?: string
}

export function MagneticButton({
  children,
  onClick,
  strength = 0.25,
  style,
  className,
  disabled,
  type = 'button',
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { stiffness: 300, damping: 20 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ x: springX, y: springY, ...style }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
