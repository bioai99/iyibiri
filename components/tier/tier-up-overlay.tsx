'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { TIER_DATA } from './tier-data'
import { Metamorphosis } from './metamorphosis'

// Vol-29: Tier-up celebration overlay.
// Mission complete sonrası kullanıcı tier-up ediyorsa bu overlay tetiklenir:
//   1. Metamorphosis animasyonu (~5s)
//   2. "Yeni seviye!" badge + tier name + "Devam Et" CTA (auto-show emerge sonrası)

interface TierUpOverlayProps {
  show: boolean
  fromTier: number
  toTier: number
  onClose: () => void
}

export function TierUpOverlay({ show, fromTier, toTier, onClose }: TierUpOverlayProps) {
  const { colors: c } = useTheme()
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    if (!show) {
      setShowCta(false)
      return
    }
    // Metamorphosis 4.6s sonra done, biz 4.0'da CTA göster (overlap)
    const t = setTimeout(() => setShowCta(true), 3800)
    return () => clearTimeout(t)
  }, [show])

  const newTier = TIER_DATA[toTier - 1]
  if (!newTier) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: `linear-gradient(180deg, ${c.ink900}F2 0%, ${c.ink900}FA 100%)`,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tier-up-title"
        >
          {/* Glow background — tier color */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '60%',
              background: `radial-gradient(ellipse at center, ${newTier.palette.glow} 0%, transparent 60%)`,
              filter: 'blur(60px)',
              pointerEvents: 'none',
              opacity: 0.8,
            }}
          />

          {/* Headline (small, top) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 999,
              background: c.goldSoft,
              border: `1px solid ${c.gold}40`,
              fontSize: 11,
              fontWeight: 700,
              color: c.gold,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            <Sparkles size={14} /> Yeni Seviye
          </motion.div>

          {/* Metamorphosis — center stage */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 480,
              height: 360,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Metamorphosis fromTier={fromTier} toTier={toTier} size={240} />
          </div>

          {/* CTA appears after metamorphosis emerge */}
          <AnimatePresence>
            {showCta && (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'relative',
                  textAlign: 'center',
                  marginTop: -20,
                }}
              >
                <h2
                  id="tier-up-title"
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-display), Fraunces, ui-serif, Georgia, serif',
                    fontSize: 36,
                    fontWeight: 400,
                    fontStyle: 'italic',
                    letterSpacing: '-0.02em',
                    color: c.cream,
                    lineHeight: 1.1,
                  }}
                >
                  {newTier.name}
                </h2>
                <p
                  style={{
                    margin: '12px 0 24px',
                    fontSize: 15,
                    color: c.ink300,
                    maxWidth: 320,
                    lineHeight: 1.5,
                  }}
                >
                  {newTier.desc}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '14px 32px',
                    borderRadius: 14,
                    background: c.gold,
                    color: '#241E18',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    boxShadow: `0 8px 24px ${newTier.palette.glow}`,
                  }}
                >
                  Devam Et
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
