// lib/motion.config.ts
//
// Central motion presets — standardized timing + spring constants
// Aligns with Linear/Arc benchmark + tier-1+ craft polish
//
// Usage:
//   import { MOTION_PRESETS } from '@/lib/motion.config'
//   <motion.div transition={{ delay: i * MOTION_PRESETS.stagger.default }}>
//   <motion.div transition={{ type: 'spring', ...MOTION_PRESETS.spring.snappy }}>

export const MOTION_PRESETS = {
  /** Stagger delays for list animations (in seconds) */
  stagger: {
    default: 0.04, // 40ms — standard list entry (Leaderboard pattern)
    fast: 0.025,   // 25ms — micro-interactions, rapid feedback
    slow: 0.06,    // 60ms — rare, emphasis scenarios
  },

  /** Spring presets for Framer Motion (type: 'spring') */
  spring: {
    snappy: { stiffness: 400, damping: 30 },    // Default: crisp, no bounce
    smooth: { stiffness: 300, damping: 25 },    // Gentle, slightly slower
    bouncy: { stiffness: 200, damping: 12 },    // Celebration: playful bounce
  },

  /** Easing curves — cubic-bezier presets */
  ease: {
    out: [0.22, 1, 0.36, 1] as const,           // easeOutExpo (snappy exit)
    inOut: [0.65, 0, 0.35, 1] as const,         // easeInOutExpo (smooth, symmetric)
  },

  /** Duration presets for animations (in seconds) */
  duration: {
    micro: 0.08,    // tap, hover, micro-interactions (60–80ms)
    short: 0.2,     // small UI changes (200ms)
    page: 0.3,      // list card entry, standard (300ms)
    celebrate: 0.6, // count-up, modal, celebration (500–600ms)
  },
} as const

/** Type exports for TypeScript strict mode */
export type SpringPreset = keyof typeof MOTION_PRESETS.spring
export type StaggerPreset = keyof typeof MOTION_PRESETS.stagger
export type EasePreset = keyof typeof MOTION_PRESETS.ease
export type DurationPreset = keyof typeof MOTION_PRESETS.duration
