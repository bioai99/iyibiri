'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TIER_DATA } from './tier-data'
import { TierButterfly } from './tier-butterfly'

// Vol-28: Tier yükseltme metamorfoz animasyonu (cocoon → kelebek transition).
// Stage akışı: old → cocoon (0.6s) → cracks (1.7s) → burst (2.7s) → emerge (3.05s) → done (4.6s)

type Stage = 'old' | 'cocoon' | 'cracks' | 'burst' | 'emerge' | 'done'

interface MetamorphosisProps {
  fromTier: number
  toTier: number
  size?: number
  onDone?: () => void
}

export function Metamorphosis({ fromTier, toTier, size = 240, onDone }: MetamorphosisProps) {
  const [stage, setStage] = useState<Stage>('old')

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage('cocoon'), 600),
      setTimeout(() => setStage('cracks'), 1700),
      setTimeout(() => setStage('burst'), 2700),
      setTimeout(() => setStage('emerge'), 3050),
      setTimeout(() => {
        setStage('done')
        onDone?.()
      }, 4600),
    ]
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const newPalette = TIER_DATA[toTier - 1]?.palette

  return (
    <div
      style={{
        position: 'relative',
        width: size * 1.6,
        height: size * 1.4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Stage 1: old butterfly */}
      <AnimatePresence>
        {stage === 'old' && (
          <motion.div
            key="old"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4, filter: 'blur(8px)' }}
            transition={{ duration: 0.9, ease: 'easeIn' }}
            style={{ position: 'absolute' }}
          >
            <TierButterfly tier={fromTier} size={size} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 2-3: glowing cocoon */}
      <AnimatePresence>
        {(stage === 'cocoon' || stage === 'cracks') && (
          <motion.div
            key="cocoon"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4, filter: 'blur(12px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ position: 'absolute' }}
          >
            <GlowingCocoon size={size} cracks={stage === 'cracks'} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 4: burst flash */}
      <AnimatePresence>
        {stage === 'burst' && (
          <motion.div
            key="burst"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0.6], scale: [0.4, 2.4, 3] }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: size * 1.2,
              height: size * 1.2,
              borderRadius: '50%',
              background: `radial-gradient(circle, #FFFCE8 0%, ${newPalette?.glow || 'rgba(232,194,104,0.6)'} 30%, transparent 70%)`,
              filter: 'blur(2px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Burst rays */}
      {stage === 'burst' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2
            const dist = size * 0.7
            return (
              <motion.div
                key={`ray-${i}`}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0.4],
                }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.012 }}
                style={{
                  position: 'absolute',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#FFFCE8' : newPalette?.wL[1] || '#E8C268',
                  boxShadow: `0 0 14px ${newPalette?.glow || 'rgba(232,194,104,0.9)'}`,
                }}
              />
            )
          })}
        </div>
      )}

      {/* Stage 5: new butterfly emerges */}
      <AnimatePresence>
        {stage === 'emerge' && (
          <motion.div
            key="emerge"
            initial={{ opacity: 0, scale: 0.3, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute' }}
          >
            <TierButterfly tier={toTier} size={size} />
          </motion.div>
        )}
      </AnimatePresence>

      {stage === 'done' && (
        <div style={{ position: 'absolute' }}>
          <TierButterfly tier={toTier} size={size} />
        </div>
      )}
    </div>
  )
}

// ─── Glowing Cocoon ───

interface GlowingCocoonProps {
  size: number
  cracks: boolean
}

function GlowingCocoon({ size, cracks }: GlowingCocoonProps) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          width: size * 0.9,
          height: size * 1.1,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,194,104,0.4) 0%, transparent 65%)',
          filter: 'blur(16px)',
        }}
        animate={{
          opacity: cracks ? [0.6, 1, 0.6] : [0.3, 0.6, 0.3],
          scale: cracks ? [1, 1.15, 1] : [0.95, 1.05, 0.95],
        }}
        transition={{ duration: cracks ? 0.6 : 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        width={size * 0.6}
        height={size * 0.95}
        viewBox="0 0 100 160"
        animate={{ rotate: cracks ? [-3, 3, -3] : [-1, 1, -1] }}
        transition={{ duration: cracks ? 0.3 : 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="meta-coc" x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="#7A6F5E" />
            <stop offset="50%" stopColor="#3F3830" />
            <stop offset="100%" stopColor="#24201B" />
          </linearGradient>
          <radialGradient id="meta-inner" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,252,232,0.9)" />
            <stop offset="50%" stopColor="rgba(232,194,104,0.5)" />
            <stop offset="100%" stopColor="rgba(232,194,104,0)" />
          </radialGradient>
        </defs>
        <path
          d="M50 20 C26 20 20 50 20 80 C20 124 34 154 50 154 C66 154 80 124 80 80 C80 50 74 20 50 20 Z"
          fill="url(#meta-coc)"
        />
        <ellipse cx="50" cy="85" rx="22" ry="50" fill="url(#meta-inner)" />
        {cracks && (
          <g>
            <motion.path
              d="M48 30 L52 60 L46 90 L54 120 L48 145"
              stroke="#FFFCE8"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0.7] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,252,232,0.9))' }}
            />
            <motion.path
              d="M30 60 L50 70 L70 65"
              stroke="#FFFCE8"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0.6] }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,252,232,0.9))' }}
            />
            <motion.path
              d="M28 110 L50 100 L72 110"
              stroke="#FFFCE8"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0.6] }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,252,232,0.9))' }}
            />
          </g>
        )}
        <line x1="50" y1="0" x2="50" y2="20" stroke="#7A6F5E" strokeWidth="1" opacity="0.5" />
      </motion.svg>

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
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
              background: '#F4D98A',
              boxShadow: '0 0 8px rgba(244,217,138,0.9)',
            }}
            animate={{
              x: [
                Math.cos(angle) * size * 0.3,
                Math.cos(angle + 1) * size * 0.5,
                Math.cos(angle + 2) * size * 0.3,
              ],
              y: [
                Math.sin(angle) * size * 0.4,
                Math.sin(angle + 1) * size * 0.5,
                Math.sin(angle + 2) * size * 0.4,
              ],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          />
        )
      })}
    </div>
  )
}
