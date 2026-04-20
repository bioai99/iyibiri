'use client'

import { motion, type Transition } from 'framer-motion'
import { useTheme } from '@/lib/theme'

interface BrandLogoProps {
  size?: number
  animate?: boolean
  idle?: boolean
  showWordmark?: boolean
  style?: React.CSSProperties
  tierLevel?: number
}

const TIER_CONFIG = [
  { size: 48,  wingRotation: 3,  cycleDuration: 3.0, glowOpacity: 0,   particles: 0, flutterPattern: null,                       flutterCycle: 0 },   // Tier 1
  { size: 54,  wingRotation: 5,  cycleDuration: 2.6, glowOpacity: 0,   particles: 0, flutterPattern: [0, 0, 0, 0, 15, -8, 5, 0],                 flutterCycle: 4 },   // Tier 2
  { size: 60,  wingRotation: 6,  cycleDuration: 2.4, glowOpacity: 0.3, particles: 0, flutterPattern: [0, 0, 0, 18, -10, 6, 0],                  flutterCycle: 3.5 }, // Tier 3
  { size: 66,  wingRotation: 8,  cycleDuration: 2.2, glowOpacity: 0.4, particles: 4, flutterPattern: [0, 0, 0, 25, -15, 10, -5, 0],             flutterCycle: 3 },   // Tier 4
  { size: 72,  wingRotation: 10, cycleDuration: 2.0, glowOpacity: 0.6, particles: 8, flutterPattern: [0, 0, 0, 0, 30, -20, 15, -8, 3, 0],      flutterCycle: 2.5 }, // Tier 5
]

export function BrandLogo({ size = 120, animate = false, idle = false, showWordmark = false, style, tierLevel }: BrandLogoProps) {
  const { mode } = useTheme()

  const bodyFill = mode === 'dark' ? '#F4EEDF' : '#3E2F14'
  const bodyFillEnd = mode === 'dark' ? '#D9CFB4' : '#24201B'
  const veinColor = mode === 'dark' ? '#F4EEDF' : '#24201B'
  const wingLeftGrad = ['#F4D98A', '#E8C268', '#C89E3D']
  const wingRightGrad = ['#E07A6A', '#C8553D', '#A84030']
  const wordIyi = mode === 'dark' ? '#F4EEDF' : '#24201B'
  const wordBiri = mode === 'dark' ? '#E8C268' : '#B58F3D'

  // Resolve tier config when tierLevel is set
  const tier = (tierLevel != null && tierLevel >= 1 && tierLevel <= 5)
    ? TIER_CONFIG[tierLevel - 1]
    : null

  // Effective size: tier overrides prop
  const effectiveSize = tier ? tier.size : size

  const d = animate ? 0.12 : 0
  const uid = `bl-${Math.random().toString(36).slice(2, 8)}`

  // --- Wing animation props ---
  // Tier mode: use tier wingRotation + cycleDuration; also apply flutter pattern if defined
  // Non-tier mode: existing idle behavior (±8°, 2.4s)
  const wingRotation = tier ? tier.wingRotation : 8
  const wingCycleDuration = tier ? tier.cycleDuration : 2.4

  const leftWingAnimProps = (tier ? true : idle) ? {
    animate: tier?.flutterPattern
      ? { rotate: tier.flutterPattern }
      : { rotate: [0, wingRotation, 0] },
    transition: {
      duration: tier?.flutterPattern ? tier.flutterCycle : wingCycleDuration,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    } as Transition,
  } : {}

  const rightWingAnimProps = (tier ? true : idle) ? {
    animate: tier?.flutterPattern
      ? { rotate: tier.flutterPattern.map((v: number) => -v) }
      : { rotate: [0, -wingRotation, 0] },
    transition: {
      duration: tier?.flutterPattern ? tier.flutterCycle : wingCycleDuration,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: 0.1,
    } as Transition,
  } : {}

  // --- Float animation props (wrapper div) ---
  // Tier mode: always float (y: [0, -5, 0], 3.2s)
  // Non-tier mode: existing idle behavior
  const floatAnimProps = tier
    ? {
        animate: { y: [0, -5, 0] },
        transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const } as Transition,
      }
    : idle
    ? {
        animate: { y: [0, -5, 0] },
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.2 } as Transition,
      }
    : {}

  // --- Glow ---
  // Tier mode: pulsing between 70%-100% of tier.glowOpacity if > 0, else hidden
  // Non-tier mode: existing animate/idle behavior
  const glowInitial = tier
    ? { opacity: tier.glowOpacity > 0 ? tier.glowOpacity * 0.7 : 0 }
    : animate
    ? { opacity: 0, scale: 0.2 }
    : { opacity: idle ? 0.6 : 0 }

  const glowAnimate = tier
    ? tier.glowOpacity > 0
      ? { opacity: [tier.glowOpacity * 0.7, tier.glowOpacity, tier.glowOpacity * 0.7], scale: [0.95, 1.05, 0.95] }
      : { opacity: 0 }
    : idle
    ? { opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.05, 0.95] }
    : animate
    ? { opacity: 0.6, scale: 1 }
    : { opacity: 0 }

  const glowTransition: Transition | undefined = tier
    ? tier.glowOpacity > 0
      ? { duration: wingCycleDuration, repeat: Infinity, ease: 'easeInOut' as const }
      : undefined
    : idle
    ? { duration: 3, repeat: Infinity, ease: 'easeInOut' as const, delay: animate ? 1 : 0 }
    : animate
    ? { duration: 1.5, ease: 'easeOut' as const, delay: d + 0.2 }
    : undefined

  // --- Orbiting tier particles ---
  const tierParticles = (tier && tier.particles > 0)
    ? Array.from({ length: tier.particles }).map((_, i) => {
        const startAngle = (i / tier.particles) * Math.PI * 2
        const orbitRadius = effectiveSize * 0.5
        // Each particle orbits; stagger phase by index
        return (
          <motion.div
            key={`tp-${i}`}
            style={{
              position: 'absolute',
              width: effectiveSize * 0.04,
              height: effectiveSize * 0.04,
              borderRadius: '50%',
              background: i % 2 === 0 ? '#F4D98A' : '#E8C268',
              boxShadow: '0 0 6px rgba(232,194,104,0.5)',
              pointerEvents: 'none',
            }}
            animate={{
              x: [
                Math.cos(startAngle) * orbitRadius,
                Math.cos(startAngle + Math.PI) * orbitRadius,
                Math.cos(startAngle + Math.PI * 2) * orbitRadius,
              ],
              y: [
                Math.sin(startAngle) * orbitRadius,
                Math.sin(startAngle + Math.PI) * orbitRadius,
                Math.sin(startAngle + Math.PI * 2) * orbitRadius,
              ],
              opacity: [0.6, 1, 0.6],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: wingCycleDuration * 2.5,
              repeat: Infinity,
              ease: 'linear' as const,
              delay: (i / tier.particles) * wingCycleDuration,
            }}
          />
        )
      })
    : null

  // --- Burst particles (existing, only when animate=true and no tier) ---
  const burstParticles = (!tier && animate) ? Array.from({ length: 10 }).map((_, i) => {
    const angle = (i / 10) * Math.PI * 2 + Math.PI / 10
    const dist = effectiveSize * 0.5
    return (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: effectiveSize * 0.022,
          height: effectiveSize * 0.022,
          borderRadius: '50%',
          background: i % 3 === 0 ? '#F4D98A' : i % 3 === 1 ? '#E8C268' : '#C8553D',
        }}
        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          scale: [0, 1.5, 0],
        }}
        transition={{
          duration: 1,
          delay: d + 0.32 + i * 0.025,
          ease: 'easeOut',
        }}
      />
    )
  }) : null

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 0, ...style }}>
      {/* SVG wrapper — idle float + glow + particles */}
      <motion.div
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        {...floatAnimProps}
      >
        {/* Gold glow — bigger, more visible */}
        <motion.div
          style={{
            position: 'absolute',
            width: effectiveSize * 1,
            height: effectiveSize * 0.8,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,194,104,0.25) 0%, rgba(232,194,104,0.08) 45%, transparent 70%)',
            filter: `blur(${effectiveSize * 0.12}px)`,
            pointerEvents: 'none',
          }}
          initial={glowInitial}
          animate={glowAnimate}
          transition={glowTransition}
        />

        {/* Orbiting tier particles */}
        {tierParticles}

        {/* Burst particles (non-tier animate mode) */}
        {burstParticles}

        <motion.svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 512 512"
          style={{ display: 'block', position: 'relative', zIndex: 1 }}
          initial={animate ? { scale: 0, opacity: 0 } : undefined}
          animate={animate ? { scale: 1, opacity: 1 } : undefined}
          transition={animate ? { type: 'spring', stiffness: 80, damping: 12, delay: d } : undefined}
        >
          <defs>
            <linearGradient id={`${uid}-wL`} x1="0" y1="0" x2=".7" y2="1">
              <stop offset="0%" stopColor={wingLeftGrad[0]}/>
              <stop offset="40%" stopColor={wingLeftGrad[1]}/>
              <stop offset="100%" stopColor={wingLeftGrad[2]}/>
            </linearGradient>
            <linearGradient id={`${uid}-wR`} x1="1" y1="0" x2=".3" y2="1">
              <stop offset="0%" stopColor={wingRightGrad[0]}/>
              <stop offset="40%" stopColor={wingRightGrad[1]}/>
              <stop offset="100%" stopColor={wingRightGrad[2]}/>
            </linearGradient>
            <linearGradient id={`${uid}-bod`} x1=".5" y1="0" x2=".5" y2="1">
              <stop offset="0%" stopColor={bodyFill}/>
              <stop offset="80%" stopColor={bodyFillEnd}/>
            </linearGradient>
          </defs>

          {/* Left wings */}
          <motion.g
            {...leftWingAnimProps}
            style={{ transformOrigin: '248px 250px' }}
          >
            <motion.path
              d="M248 240 C210 185 130 155 125 215 C120 270 195 285 248 258Z"
              fill={`url(#${uid}-wL)`}
              initial={animate ? { opacity: 0, scale: 0.1 } : undefined}
              animate={animate ? { opacity: 1, scale: 1 } : undefined}
              transition={animate ? { type: 'spring', stiffness: 120, damping: 8, delay: d + 0.28 } : undefined}
              style={{ transformOrigin: '248px 250px' }}
            />
            <motion.path
              d="M248 268 C215 300 155 330 165 290 C170 265 215 258 248 268Z"
              fill={`url(#${uid}-wL)`}
              initial={animate ? { opacity: 0, scale: 0.1 } : undefined}
              animate={animate ? { opacity: 0.6, scale: 1 } : undefined}
              transition={animate ? { type: 'spring', stiffness: 120, damping: 8, delay: d + 0.38 } : undefined}
              style={{ transformOrigin: '248px 268px' }}
            />
          </motion.g>

          {/* Right wings */}
          <motion.g
            {...rightWingAnimProps}
            style={{ transformOrigin: '264px 250px' }}
          >
            <motion.path
              d="M264 240 C302 185 382 155 387 215 C392 270 317 285 264 258Z"
              fill={`url(#${uid}-wR)`}
              initial={animate ? { opacity: 0, scale: 0.1 } : undefined}
              animate={animate ? { opacity: 1, scale: 1 } : undefined}
              transition={animate ? { type: 'spring', stiffness: 120, damping: 8, delay: d + 0.36 } : undefined}
              style={{ transformOrigin: '264px 250px' }}
            />
            <motion.path
              d="M264 268 C297 300 357 330 347 290 C342 265 297 258 264 268Z"
              fill={`url(#${uid}-wR)`}
              initial={animate ? { opacity: 0, scale: 0.1 } : undefined}
              animate={animate ? { opacity: 0.6, scale: 1 } : undefined}
              transition={animate ? { type: 'spring', stiffness: 120, damping: 8, delay: d + 0.46 } : undefined}
              style={{ transformOrigin: '264px 268px' }}
            />
          </motion.g>

          {/* Body */}
          <motion.g
            initial={animate ? { opacity: 0, y: 20 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={animate ? { type: 'spring', stiffness: 140, damping: 12, delay: d + 0.05 } : undefined}
          >
            <ellipse cx="256" cy="208" rx="22" ry="24" fill={`url(#${uid}-bod)`}/>
            <path d="M256 232 C264 235 268 245 268 258 C268 280 265 310 262 325 C260 332 252 332 250 325 C247 310 244 280 244 258 C244 245 248 235 256 232Z" fill={`url(#${uid}-bod)`}/>
          </motion.g>

          {/* Wing veins — fade in last */}
          <motion.g
            initial={animate ? { opacity: 0 } : undefined}
            animate={animate ? { opacity: 1 } : undefined}
            transition={animate ? { duration: 0.8, delay: d + 0.7 } : undefined}
          >
            <path d="M195 220 C210 238 232 250 246 254" stroke={veinColor} strokeWidth=".7" fill="none" opacity=".12"/>
            <path d="M317 220 C302 238 280 250 266 254" stroke={veinColor} strokeWidth=".7" fill="none" opacity=".12"/>
            <circle cx="185" cy="225" r="14" fill="none" stroke={veinColor} strokeWidth=".8" opacity=".12"/>
            <circle cx="327" cy="225" r="14" fill="none" stroke={veinColor} strokeWidth=".8" opacity=".12"/>
          </motion.g>
        </motion.svg>
      </motion.div>

      {/* Wordmark — pulled up into SVG empty space */}
      {showWordmark && (
        <motion.div
          initial={animate ? { opacity: 0, y: 14 } : undefined}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={animate ? { duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: d + 0.65 } : undefined}
          style={{
            fontFamily: "'Fraunces', var(--font-display), Georgia, serif",
            fontSize: effectiveSize * 0.28,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: wordIyi,
            lineHeight: 1,
            marginTop: -(effectiveSize * 0.26),
          }}
        >
          İyi<span style={{ fontStyle: 'italic', color: wordBiri }}>Biri</span>
        </motion.div>
      )}
    </div>
  )
}
