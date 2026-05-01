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

// Wing fold angles (rotateY degrees): 0°=open, 65°=nearly closed
// Left wing uses positive rotateY, right wing uses negated values.
//
// ADR-014 Accepted (2026-04-26): tier name'leri canonical `lib/tiers.ts`'ten gelir.
// Aşağıdaki yorumlar metamorfoz aşamalarını anlatır; isim referansları Set A.
const TIER_CONFIG = [
  // Tier 1 — İyi Biri: gentle sway
  { size: 120, glowOpacity: 0,    particles: 0,
    foldPattern: [0, 15, 0],                                        foldDuration: 3.0,
    wL: ['#E8D9A8', '#D4C488', '#B8A56A'], wR: ['#D4A090', '#BC7A6A', '#9E6050'] },
  // Tier 2 — Çok İyi Biri: breathe + one fold
  { size: 128, glowOpacity: 0.15, particles: 0,
    foldPattern: [0, 10, 0, 0, 55, 10, 0, 10, 0],                  foldDuration: 5.0,
    wL: ['#F4D98A', '#E8C268', '#C89E3D'], wR: ['#E07A6A', '#C8553D', '#A84030'] },
  // Tier 3 — Çoook İyi Biri: confident fold
  { size: 136, glowOpacity: 0.3,  particles: 0,
    foldPattern: [0, 10, 0, 55, 10, 50, 0, 10, 0],                 foldDuration: 4.0,
    wL: ['#F0D070', '#D4A838', '#B08820'], wR: ['#D45A4A', '#B83828', '#982818'] },
  // Tier 4 — Gerçekten İyi Biri: active folding
  { size: 144, glowOpacity: 0.4,  particles: 4,
    foldPattern: [0, 60, 10, 55, 10, 0, 10, 0],                    foldDuration: 3.2,
    wL: ['#7ECFB8', '#4DB896', '#2E9E7A'], wR: ['#E8965A', '#D07038', '#B05020'] },
  // Tier 5 — İyiliğin Öncüsü: dramatic multi-fold
  { size: 152, glowOpacity: 0.6,  particles: 8,
    foldPattern: [0, 65, 10, 60, 8, 55, 0, 10, 0],                 foldDuration: 2.8,
    wL: ['#C4A0E8', '#9B6ED0', '#7A4CB8'], wR: ['#F4D98A', '#E8C268', '#C89E3D'] },
]

export function BrandLogo({ size = 120, animate = false, idle = false, showWordmark = false, style, tierLevel }: BrandLogoProps) {
  const { mode } = useTheme()

  // Resolve tier config when tierLevel is set
  const tier = (tierLevel != null && tierLevel >= 1 && tierLevel <= 5)
    ? TIER_CONFIG[tierLevel - 1]
    : null

  const bodyFill = mode === 'dark' ? '#F4EEDF' : '#8B7A60'
  const bodyFillEnd = mode === 'dark' ? '#D9CFB4' : '#6B5B45'
  const veinColor = mode === 'dark' ? '#F4EEDF' : '#6B5B45'
  const wingLeftGrad = tier?.wL ?? ['#F4D98A', '#E8C268', '#C89E3D']
  const wingRightGrad = tier?.wR ?? ['#E07A6A', '#C8553D', '#A84030']
  const wordIyi = mode === 'dark' ? '#F4EEDF' : '#24201B'
  const wordBiri = mode === 'dark' ? '#E8C268' : '#B58F3D'

  // Effective size: tier overrides prop
  const effectiveSize = tier ? tier.size : size

  const d = animate ? 0.12 : 0
  const uid = `bl-${Math.random().toString(36).slice(2, 8)}`

  // --- Wing animation: rotateY for 3D fold ---
  // 0° = wings flat/open, 55-65° = wings nearly closed (edge-on)
  // Transform-origin at body edge: thin part stays fixed, wide part folds back
  // Left wing uses positive rotateY, right wing uses negative (mirror)
  const foldValues = tier?.foldPattern ?? [0, 12, 0]
  const foldDuration = tier?.foldDuration ?? 2.6

  const leftWingAnimProps = (tier ? true : idle) ? {
    animate: { rotateY: foldValues },
    transition: {
      duration: foldDuration,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    } as Transition,
  } : {}

  const rightWingAnimProps = (tier ? true : idle) ? {
    animate: { rotateY: foldValues.map((v: number) => -v) },
    transition: {
      duration: foldDuration,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: 0.05,
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
      ? { duration: (tier?.foldDuration ?? 2.6), repeat: Infinity, ease: 'easeInOut' as const }
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
              duration: (tier?.foldDuration ?? 2.6) * 2.5,
              repeat: Infinity,
              ease: 'linear' as const,
              delay: (i / tier.particles) * (tier?.foldDuration ?? 2.6),
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
        initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
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
          background: mode === 'light'
            ? 'radial-gradient(circle at center, rgba(232,194,104,0.15) 0%, transparent 65%)'
            : 'radial-gradient(circle at center, rgba(232,194,104,0.18) 0%, transparent 70%)',
          borderRadius: '50%',
          width: effectiveSize * 1.2,
          height: effectiveSize * 0.95,
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
          height={tier ? effectiveSize * 0.68 : effectiveSize}
          viewBox={tier ? '90 130 332 225' : '0 0 512 512'}
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
