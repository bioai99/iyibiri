'use client'

import { useEffect, useId, useMemo, useRef } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { TIER_DATA, type WingComplexity, type AmbientEffectKind, type TierPalette } from './tier-data'

// Vol-28: 5 tier kelebek + ambient effects + cocoon (locked) variant.
// Port from tier-design/tier-butterflies.jsx, TS conversion.

// ─── Wing path generators by complexity ───

interface WingPathProps {
  side: 'L' | 'R'
  complexity: WingComplexity
  fill: string
  opacity?: number
}

function WingPath({ side, complexity, fill, opacity = 1 }: WingPathProps) {
  const flip = side === 'R' ? -1 : 1
  const cx = 256

  if (complexity === 'simple') {
    const upper = side === 'L'
      ? "M248 240 C210 185 130 155 125 215 C120 270 195 285 248 258Z"
      : "M264 240 C302 185 382 155 387 215 C392 270 317 285 264 258Z"
    const lower = side === 'L'
      ? "M248 268 C215 300 155 330 165 290 C170 265 215 258 248 268Z"
      : "M264 268 C297 300 357 330 347 290 C342 265 297 258 264 268Z"
    return (
      <>
        <path d={upper} fill={fill} opacity={opacity} />
        <path d={lower} fill={fill} opacity={opacity * 0.6} />
      </>
    )
  }

  if (complexity === 'scallop') {
    const upper = side === 'L'
      ? "M248 238 C228 200 200 175 160 165 C115 158 108 215 130 245 C155 275 210 280 248 260Z"
      : "M264 238 C284 200 312 175 352 165 C397 158 404 215 382 245 C357 275 302 280 264 260Z"
    const lower = side === 'L'
      ? "M248 270 C220 295 175 320 155 305 C140 290 165 270 200 265 C225 263 240 268 248 270Z"
      : "M264 270 C292 295 337 320 357 305 C372 290 347 270 312 265 C287 263 272 268 264 270Z"
    return (
      <>
        <path d={upper} fill={fill} opacity={opacity} />
        <path d={lower} fill={fill} opacity={opacity * 0.7} />
      </>
    )
  }

  if (complexity === 'detailed') {
    const upper = side === 'L'
      ? "M248 236 C220 195 185 170 140 162 C100 158 95 210 118 245 C148 280 215 282 248 258Z"
      : "M264 236 C292 195 327 170 372 162 C412 158 417 210 394 245 C364 280 297 282 264 258Z"
    const lower = side === 'L'
      ? "M248 270 C218 298 168 322 152 300 C140 280 175 264 215 264 C232 264 245 268 248 270Z"
      : "M264 270 C294 298 344 322 360 300 C372 280 337 264 297 264 C280 264 267 268 264 270Z"
    return (
      <>
        <path d={upper} fill={fill} opacity={opacity} />
        <path d={lower} fill={fill} opacity={opacity * 0.75} />
        <circle cx={cx + flip * 60} cy="200" r="6" fill={fill} opacity={opacity * 0.4} />
        <circle cx={cx + flip * 90} cy="225" r="4" fill={fill} opacity={opacity * 0.3} />
        <circle cx={cx + flip * 50} cy="290" r="5" fill={fill} opacity={opacity * 0.35} />
      </>
    )
  }

  if (complexity === 'ornate') {
    const upper = side === 'L'
      ? "M248 234 C215 185 170 160 120 152 C75 150 70 198 95 240 C128 282 200 282 248 258Z"
      : "M264 234 C297 185 342 160 392 152 C437 150 442 198 417 240 C384 282 312 282 264 258Z"
    const lower = side === 'L'
      ? "M248 272 C215 305 160 335 138 308 C122 285 158 262 205 262 C228 262 242 268 248 272Z"
      : "M264 272 C297 305 352 335 374 308 C390 285 354 262 307 262 C284 262 270 268 264 272Z"
    return (
      <>
        <path d={upper} fill={fill} opacity={opacity} />
        <path d={lower} fill={fill} opacity={opacity * 0.8} />
        <circle cx={cx + flip * 70} cy="195" r="9" fill="#1A1612" opacity={opacity * 0.55} />
        <circle cx={cx + flip * 70} cy="195" r="4" fill="#FFF8E0" opacity={opacity * 0.7} />
        <circle cx={cx + flip * 55} cy="295" r="6" fill="#1A1612" opacity={opacity * 0.45} />
      </>
    )
  }

  if (complexity === 'fractal') {
    const upper = side === 'L'
      ? "M248 230 C212 175 155 145 100 142 C55 142 50 192 75 240 C115 290 200 285 248 256Z"
      : "M264 230 C300 175 357 145 412 142 C457 142 462 192 437 240 C397 290 312 285 264 256Z"
    const middle = side === 'L'
      ? "M248 254 C220 232 175 218 135 220 C100 224 105 252 138 268 C175 282 220 278 248 268Z"
      : "M264 254 C292 232 337 218 377 220 C412 224 407 252 374 268 C337 282 292 278 264 268Z"
    const lower = side === 'L'
      ? "M248 272 C212 308 148 342 122 312 C108 290 145 260 198 260 C225 260 242 266 248 272Z"
      : "M264 272 C300 308 364 342 390 312 C404 290 367 260 314 260 C287 260 270 266 264 272Z"
    return (
      <>
        <path d={upper} fill={fill} opacity={opacity} />
        <path d={middle} fill={fill} opacity={opacity * 0.6} />
        <path d={lower} fill={fill} opacity={opacity * 0.7} />
        <circle cx={cx + flip * 85} cy="190" r="11" fill="#FFF8E0" opacity={opacity * 0.45} />
        <circle cx={cx + flip * 85} cy="190" r="5" fill={fill} opacity={opacity * 0.8} />
        <circle cx={cx + flip * 110} cy="220" r="6" fill="#FFF8E0" opacity={opacity * 0.4} />
        <circle cx={cx + flip * 60} cy="255" r="7" fill="#FFF8E0" opacity={opacity * 0.35} />
        <circle cx={cx + flip * 75} cy="295" r="8" fill="#FFF8E0" opacity={opacity * 0.4} />
      </>
    )
  }

  return null
}

// ─── Single Butterfly Component ───

interface TierButterflyProps {
  tier: number
  size?: number
  paused?: boolean
}

export function TierButterfly({ tier, size = 200, paused = false }: TierButterflyProps) {
  const data = TIER_DATA[tier - 1]
  const reactId = useId()
  const uid = useMemo(() => `tb-${tier}-${reactId.replace(/:/g, '')}`, [tier, reactId])

  const flapPattern = useMemo(() => {
    if (!data) return [1]
    return data.foldPattern.map((deg) => Math.cos((deg * Math.PI) / 180))
  }, [data])

  const leftTransform = useMotionValue('matrix(1,0,0,1,0,0)')
  const rightTransform = useMotionValue('matrix(1,0,0,1,0,0)')
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!data || paused) return
    const start = performance.now()
    const duration = data.foldDuration

    const tick = () => {
      const t = ((performance.now() - start) / 1000) % duration
      const phase = t / duration
      const segs = flapPattern.length - 1
      const segPos = phase * segs
      const i = Math.floor(segPos)
      const f = segPos - i
      const a = flapPattern[i] ?? 1
      const b = flapPattern[Math.min(i + 1, segs)] ?? 1
      const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2
      const s = a + (b - a) * e
      const tx = 256 * (1 - s)
      leftTransform.set(`matrix(${s},0,0,1,${tx},0)`)
      rightTransform.set(`matrix(${s},0,0,1,${tx},0)`)
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [paused, data, flapPattern, leftTransform, rightTransform])

  if (!data) return null

  const { palette, glowOpacity, ambientEffect, auraIntensity, wingComplexity } = data

  const floatAnim = paused
    ? {}
    : {
        animate: { y: [0, -6, 0] },
        transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' as const },
      }

  return (
    <div
      style={{
        position: 'relative',
        width: size * 1.4,
        height: size * 1.1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* Aura */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, ${palette.glow} 0%, transparent 60%)`,
          opacity: auraIntensity * 0.6,
          filter: `blur(${size * 0.04}px)`,
        }}
      />

      {/* Glow pulse */}
      {!paused && glowOpacity > 0 && (
        <motion.div
          style={{
            position: 'absolute',
            width: size,
            height: size * 0.85,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${palette.glow} 0%, transparent 65%)`,
            filter: `blur(${size * 0.08}px)`,
          }}
          animate={{
            opacity: [glowOpacity * 0.6, glowOpacity, glowOpacity * 0.6],
            scale: [0.9, 1.05, 0.9],
          }}
          transition={{ duration: data.foldDuration * 1.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Ambient effect particles */}
      <AmbientEffect kind={ambientEffect} size={size} paused={paused} palette={palette} />

      {/* Float wrapper */}
      <motion.div
        {...floatAnim}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width={size}
          height={size * 0.85}
          viewBox="100 150 312 200"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={`${uid}-wL`} x1="0" y1="0" x2=".7" y2="1">
              <stop offset="0%" stopColor={palette.wL[0]} />
              <stop offset="50%" stopColor={palette.wL[1]} />
              <stop offset="100%" stopColor={palette.wL[2]} />
            </linearGradient>
            <linearGradient id={`${uid}-wR`} x1="1" y1="0" x2=".3" y2="1">
              <stop offset="0%" stopColor={palette.wR[0]} />
              <stop offset="50%" stopColor={palette.wR[1]} />
              <stop offset="100%" stopColor={palette.wR[2]} />
            </linearGradient>
            <linearGradient id={`${uid}-bod`} x1=".5" y1="0" x2=".5" y2="1">
              <stop offset="0%" stopColor={palette.body[0]} />
              <stop offset="100%" stopColor={palette.body[1]} />
            </linearGradient>
          </defs>

          <motion.g style={{ transform: leftTransform }}>
            <WingPath side="L" complexity={wingComplexity} fill={`url(#${uid}-wL)`} />
          </motion.g>

          <motion.g style={{ transform: rightTransform }}>
            <WingPath side="R" complexity={wingComplexity} fill={`url(#${uid}-wR)`} />
          </motion.g>

          {/* Body */}
          <ellipse cx="256" cy="208" rx="22" ry="24" fill={`url(#${uid}-bod)`} />
          <path
            d="M256 232 C264 235 268 245 268 258 C268 280 265 310 262 325 C260 332 252 332 250 325 C247 310 244 280 244 258 C244 245 248 235 256 232Z"
            fill={`url(#${uid}-bod)`}
          />

          {/* Antennae for ornate+ */}
          {(wingComplexity === 'ornate' || wingComplexity === 'fractal') && (
            <g opacity="0.7">
              <path
                d="M250 192 C246 178 240 170 234 165"
                stroke={palette.body[1]}
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M262 192 C266 178 272 170 278 165"
                stroke={palette.body[1]}
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="234" cy="165" r="1.8" fill={palette.body[0]} />
              <circle cx="278" cy="165" r="1.8" fill={palette.body[0]} />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  )
}

// ─── Ambient Effects ───

interface AmbientEffectProps {
  kind: AmbientEffectKind
  size: number
  paused: boolean
  palette: TierPalette
}

function AmbientEffect({ kind, size, paused, palette }: AmbientEffectProps) {
  if (paused || kind === 'none') return null

  if (kind === 'pollen') {
    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const r = size * 0.45
          return (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#F0B85C',
                boxShadow: '0 0 8px rgba(240,184,92,0.7)',
              }}
              animate={{
                x: [Math.cos(angle) * r * 0.5, Math.cos(angle + 0.5) * r, Math.cos(angle) * r * 0.5],
                y: [
                  Math.sin(angle) * r * 0.5,
                  Math.sin(angle + 0.5) * r - 10,
                  Math.sin(angle) * r * 0.5,
                ],
                opacity: [0.3, 0.9, 0.3],
                scale: [0.7, 1.1, 0.7],
              }}
              transition={{
                duration: 4 + i * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          )
        })}
      </div>
    )
  }

  if (kind === 'rings') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: '50%',
              border: `1.5px solid ${palette.glow}`,
            }}
            animate={{ scale: [0.5, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: i * 1 }}
          />
        ))}
      </div>
    )
  }

  if (kind === 'sparks') {
    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const r = size * 0.55
          return (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: i % 2 ? '#F4D98A' : '#E89060',
                boxShadow: `0 0 10px ${i % 2 ? 'rgba(244,217,138,0.9)' : 'rgba(232,144,96,0.9)'}`,
              }}
              animate={{
                x: [0, Math.cos(angle) * r],
                y: [0, Math.sin(angle) * r],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.18,
                repeatDelay: 0.6,
              }}
            />
          )
        })}
      </div>
    )
  }

  if (kind === 'aurora') {
    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[0, 60, 120].map((rot, i) => (
          <motion.div
            key={`beam-${i}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: size * 1.4,
              height: 2,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(232,194,104,0.5) 50%, transparent 100%)',
              transformOrigin: 'center',
              transform: `translate(-50%, -50%) rotate(${rot}deg)`,
              filter: 'blur(2px)',
            }}
            animate={{ opacity: [0.2, 0.7, 0.2], scaleX: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * Math.PI * 2
          const r = size * (0.45 + (i % 3) * 0.08)
          return (
            <motion.div
              key={`star-${i}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background:
                  i % 3 === 0 ? '#FFFCE8' : i % 3 === 1 ? '#E8C268' : '#A878E0',
                boxShadow: `0 0 12px ${
                  i % 3 === 0
                    ? 'rgba(255,252,232,1)'
                    : i % 3 === 1
                      ? 'rgba(232,194,104,1)'
                      : 'rgba(168,120,224,1)'
                }`,
              }}
              animate={{
                x: [
                  Math.cos(angle) * r,
                  Math.cos(angle + Math.PI) * r,
                  Math.cos(angle + Math.PI * 2) * r,
                ],
                y: [
                  Math.sin(angle) * r,
                  Math.sin(angle + Math.PI) * r,
                  Math.sin(angle + Math.PI * 2) * r,
                ],
                opacity: [0.4, 1, 0.4],
                scale: [0.6, 1.3, 0.6],
              }}
              transition={{
                duration: 6 + (i % 3),
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.2,
              }}
            />
          )
        })}
      </div>
    )
  }

  return null
}

// ─── Locked state: butterfly inside cocoon ───

interface CocoonButterflyProps {
  tier: number
  size?: number
}

export function CocoonButterfly({ tier, size = 200 }: CocoonButterflyProps) {
  const data = TIER_DATA[tier - 1]
  if (!data) return null

  return (
    <div
      style={{
        position: 'relative',
        width: size * 1.4,
        height: size * 1.1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(232,194,104,0.08) 0%, transparent 60%)',
        }}
      />

      <motion.div
        animate={{ rotate: [-2, 2, -2], y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative' }}
      >
        <svg width={size * 0.55} height={size * 0.85} viewBox="0 0 100 160">
          <defs>
            <linearGradient id={`coc-${tier}`} x1="0.3" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#574E42" />
              <stop offset="50%" stopColor="#36302A" />
              <stop offset="100%" stopColor="#24201B" />
            </linearGradient>
            <linearGradient id={`coc-shine-${tier}`} x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(232,194,104,0.25)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <line x1="50" y1="0" x2="50" y2="22" stroke="#7A6F5E" strokeWidth="1" opacity="0.5" />
          <path
            d="M50 22 C28 22 22 50 22 80 C22 120 35 152 50 152 C65 152 78 120 78 80 C78 50 72 22 50 22 Z"
            fill={`url(#coc-${tier})`}
          />
          <path
            d="M50 22 C28 22 22 50 22 80 C22 120 35 152 50 152 C65 152 78 120 78 80 C78 50 72 22 50 22 Z"
            fill={`url(#coc-shine-${tier})`}
            opacity="0.6"
          />
          <path
            d="M50 30 C48 60 48 100 50 145"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="0.6"
            fill="none"
          />
          <path
            d="M38 40 C36 70 36 110 40 140"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M62 40 C64 70 64 110 60 140"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="0.5"
            fill="none"
          />
          <ellipse cx="50" cy="80" rx="18" ry="40" fill="rgba(232,194,104,0.08)" />
        </svg>
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: size * 0.25,
          height: size * 0.25,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,194,104,0.3), transparent 70%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
