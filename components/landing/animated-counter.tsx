'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * AnimatedCounter — Sayı 0'dan target'a count-up. Yalnızca viewport'a girince başlar.
 *
 * `format`: TR locale (1.380, 18.247) — period-thousand-separator.
 * `duration`: ms cinsinden; default 1800ms (premium "tick" hissi için).
 * `decimals`: ondalık basamak (default 0).
 */
export function AnimatedCounter({
  to,
  duration = 1800,
  format = 'tr',
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  to: number
  duration?: number
  format?: 'tr' | 'plain'
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      // easeOutExpo for premium settle
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setVal(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  const display = format === 'tr'
    ? val.toLocaleString('tr-TR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : val.toFixed(decimals)

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {prefix}{display}{suffix}
    </motion.span>
  )
}
