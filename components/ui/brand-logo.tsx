'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'

interface BrandLogoProps {
  size?: number
  animate?: boolean  // true = entrance animation
  idle?: boolean     // true = subtle wing breathing
  showWordmark?: boolean
  style?: React.CSSProperties
}

export function BrandLogo({ size = 120, animate = false, idle = false, showWordmark = false, style }: BrandLogoProps) {
  const { colors: c, mode } = useTheme()

  // Body color adapts to theme
  const bodyFill = mode === 'dark' ? '#F4EEDF' : '#3E2F14'
  const bodyFillEnd = mode === 'dark' ? '#D9CFB4' : '#24201B'
  const veinColor = mode === 'dark' ? '#F4EEDF' : '#24201B'

  // Wing colors stay the same in both modes
  const wingLeftGrad = ['#F4D98A', '#E8C268', '#C89E3D']
  const wingRightGrad = ['#E07A6A', '#C8553D', '#A84030']

  // Wordmark colors
  const wordIyi = mode === 'dark' ? '#F4EEDF' : '#24201B'
  const wordBiri = mode === 'dark' ? '#E8C268' : '#B58F3D'

  const entranceDelay = animate ? 0.2 : 0

  // Use unique gradient IDs to avoid conflicts
  const uid = `bl-${Math.random().toString(36).slice(2, 8)}`

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: showWordmark ? size * 0.12 : 0, ...style }}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        style={{ display: 'block' }}
        initial={animate ? { scale: 0.6, opacity: 0 } : undefined}
        animate={animate ? { scale: 1, opacity: 1 } : undefined}
        transition={animate ? { duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: entranceDelay } : undefined}
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
        <motion.g {...(idle ? { animate: { rotate: [0, 3, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } } : {})} style={{ transformOrigin: '248px 250px' }}>
          <motion.path
            d="M248 240 C210 185 130 155 125 215 C120 270 195 285 248 258Z"
            fill={`url(#${uid}-wL)`}
            initial={animate ? { opacity: 0, scale: 0.5 } : undefined}
            animate={animate ? { opacity: 1, scale: 1 } : undefined}
            transition={animate ? { duration: 0.6, delay: entranceDelay + 0.3 } : undefined}
            style={{ transformOrigin: '248px 250px' }}
          />
          <path d="M248 268 C215 300 155 330 165 290 C170 265 215 258 248 268Z" fill={`url(#${uid}-wL)`} opacity=".6"/>
        </motion.g>

        {/* Right wings */}
        <motion.g {...(idle ? { animate: { rotate: [0, -3, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.1 } } : {})} style={{ transformOrigin: '264px 250px' }}>
          <motion.path
            d="M264 240 C302 185 382 155 387 215 C392 270 317 285 264 258Z"
            fill={`url(#${uid}-wR)`}
            initial={animate ? { opacity: 0, scale: 0.5 } : undefined}
            animate={animate ? { opacity: 1, scale: 1 } : undefined}
            transition={animate ? { duration: 0.6, delay: entranceDelay + 0.4 } : undefined}
            style={{ transformOrigin: '264px 250px' }}
          />
          <path d="M264 268 C297 300 357 330 347 290 C342 265 297 258 264 268Z" fill={`url(#${uid}-wR)`} opacity=".6"/>
        </motion.g>

        {/* Body */}
        <motion.g
          initial={animate ? { opacity: 0, y: 20 } : undefined}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={animate ? { duration: 0.5, delay: entranceDelay + 0.1 } : undefined}
        >
          <ellipse cx="256" cy="208" rx="22" ry="24" fill={`url(#${uid}-bod)`}/>
          <path d="M256 232 C264 235 268 245 268 258 C268 280 265 310 262 325 C260 332 252 332 250 325 C247 310 244 280 244 258 C244 245 248 235 256 232Z" fill={`url(#${uid}-bod)`}/>
        </motion.g>

        {/* Wing veins */}
        <path d="M195 220 C210 238 232 250 246 254" stroke={veinColor} strokeWidth=".7" fill="none" opacity=".12"/>
        <path d="M317 220 C302 238 280 250 266 254" stroke={veinColor} strokeWidth=".7" fill="none" opacity=".12"/>
        <circle cx="185" cy="225" r="14" fill="none" stroke={veinColor} strokeWidth=".8" opacity=".12"/>
        <circle cx="327" cy="225" r="14" fill="none" stroke={veinColor} strokeWidth=".8" opacity=".12"/>
      </motion.svg>

      {showWordmark && (
        <motion.div
          initial={animate ? { opacity: 0, y: 8 } : undefined}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={animate ? { duration: 0.5, delay: entranceDelay + 0.6 } : undefined}
          style={{
            fontFamily: "'Fraunces', var(--font-display), Georgia, serif",
            fontSize: size * 0.28,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: wordIyi,
            lineHeight: 1,
          }}
        >
          İyi<span style={{ fontStyle: 'italic', color: wordBiri }}>Biri</span>
        </motion.div>
      )}
    </div>
  )
}