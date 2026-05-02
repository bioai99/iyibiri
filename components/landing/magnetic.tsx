'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Magnetic — Cursor follows ile elementi yumuşak çeker.
 *
 * Hover'da mouse pozisyonuna doğru subtle (max 12px) translate + spring.
 * Premium hissiyat — Linear/Apple CTA butonlarında.
 * Mobile'da disable (no hover capability detect).
 */
export function Magnetic({
  children,
  strength = 0.35,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * MagneticInner — child içeride biraz daha hareket etsin (rim güçlü hissetsin).
 * Magnetic ile kullan: outer wrapper + inner counter-pull.
 */
export function MagneticInner({
  children,
  strength = 0.55,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  return (
    <Magnetic strength={strength} className={className}>
      {children}
    </Magnetic>
  )
}

/**
 * useMagnetic3DTilt — Magnetic + 3D perspective rotate (hover'da kart hafif tilt).
 * Bento grid kartlarında kullan.
 */
export function MagneticTilt({
  children,
  strength = 8,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useTransform(my, [0, 1], [strength, -strength])
  const ry = useTransform(mx, [0, 1], [-strength, strength])
  const srx = useSpring(rx, { stiffness: 150, damping: 18 })
  const sry = useSpring(ry, { stiffness: 150, damping: 18 })

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }
  function reset() {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
