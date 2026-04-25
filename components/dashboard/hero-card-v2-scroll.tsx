// components/dashboard/hero-card-v2-scroll.tsx
//
// Scroll-linked variant of HeroCardV2
// Pattern 8: Hero shrinks on scroll
//  - useScroll hook dari Framer Motion
//  - Scroll 0-120px arası scale 1 → 0.92
//  - Opacity 1 → 0.95
//  - Padding 24 → 16
//  - Sticky header, zIndex: 5
//  - useReducedMotion: static, no scroll effect

'use client'

import React from 'react'
import { useRef } from 'react'
import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion'
import { HeroCardV2 } from './hero-card-v2'
import type { HeroCardV2Props } from './hero-card-v2'

export function HeroCardV2Scroll(props: HeroCardV2Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // useScroll hook: track scroll position in container
  // When container is sticky at top and we scroll 0-120px
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Transform: map scroll progress to scale
  // 0 scroll → scale 1
  // 120px scroll → scale 0.92
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.92])
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])

  // Static (no scroll) if motion is reduced
  const finalScale = shouldReduceMotion ? 1 : scale
  const finalOpacity = shouldReduceMotion ? 1 : opacity

  return (
    <div ref={containerRef}>
      <motion.div
        style={{
          scale: finalScale,
          opacity: finalOpacity,
        }}
        className="sticky top-0 z-10 origin-top"
      >
        <HeroCardV2 {...props} />
      </motion.div>
    </div>
  )
}
