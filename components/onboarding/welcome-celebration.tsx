'use client'

/**
 * WelcomeCelebration — organism
 *
 * Onboarding sonunda "Hoş geldin + 100 karma hediyesi + ilk görev önerisi" modal.
 *
 * Layout:
 * ┌──────────────────────────────┐
 * │      ✨ (orbital atom)        │
 * │                              │
 * │   Hoş geldin, {name}!         │
 * │   +100 karma 🎉               │
 * │   (KarmaCounterPro 0→100)    │
 * │                              │
 * │   İlk görevin hazır:          │
 * │   [mini mission card]        │
 * │                              │
 * │   [Hadi başlayalım →]        │
 * └──────────────────────────────┘
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { KarmaCounterPro } from '@/components/ui/karma-counter-pro'
import type { MissionWithNGO } from '@/lib/supabase/types'

interface WelcomeCelebrationProps {
  open: boolean
  userName: string
  firstMission?: MissionWithNGO | null
  onDismiss?: () => void
}

export function WelcomeCelebration({
  open,
  userName,
  firstMission,
  onDismiss,
}: WelcomeCelebrationProps) {
  const { colors: c } = useTheme()
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  const handleStart = () => {
    router.push('/dashboard')
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26,22,18,0.72)',
          backdropFilter: 'blur(12px)',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
        onClick={onDismiss}
      >
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.92, y: 20 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: 440,
            width: '100%',
            background: c.ink900,
            border: `1px solid ${c.goldLine}`,
            borderRadius: 24,
            padding: '48px 32px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Orbital atom icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.22, 1.2, 0.36, 1],
            }}
            style={{
              width: 88,
              height: 88,
              margin: '0 auto 24px',
              background: `radial-gradient(circle, ${c.goldSoft} 0%, transparent 70%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              position: 'relative',
            }}
          >
            {/* Ambient rotating ring */}
            {!shouldReduceMotion && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: -2,
                  border: `1px dashed ${c.goldLine}`,
                  borderRadius: '50%',
                }}
              />
            )}
            <Sparkles size={40} color={c.gold} />
          </motion.div>

          {/* Welcome heading */}
          <motion.h2
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              fontFamily: "var(--font-display), 'Fraunces', serif",
              fontSize: 28,
              fontWeight: 500,
              color: c.cream,
              margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}
          >
            Hoş geldin,{' '}
            <em
              style={{
                fontStyle: 'italic',
                color: c.gold,
              }}
            >
              {userName}
            </em>
            !
          </motion.h2>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            style={{
              fontSize: 15,
              color: c.ink300,
              margin: '0 0 24px',
              lineHeight: 1.5,
            }}
          >
            Başlangıç hediyen karmana ekleniyor 🌱
          </motion.p>

          {/* Karma count-up */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              margin: '16px 0 32px',
              padding: 24,
              background: c.ink800,
              borderRadius: 16,
              border: `1px solid ${c.ink700}`,
            }}
          >
            <KarmaCounterPro
              from={0}
              to={100}
              duration={1200}
              showDelta={false}
              size="hero"
            />
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: c.ink300,
                marginTop: 8,
              }}
            >
              KARMA
            </div>
          </motion.div>

          {/* First mission suggestion (optional) */}
          {firstMission && (
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              style={{
                margin: '0 0 24px',
                padding: 16,
                background: c.goldSoft,
                border: `1px solid ${c.goldLine}`,
                borderRadius: 12,
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: c.gold,
                  marginBottom: 6,
                }}
              >
                ✨ İlk görevin
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: c.cream,
                  marginBottom: 4,
                }}
              >
                {firstMission.title}
              </div>
              {firstMission.ngos?.name && (
                <div style={{ fontSize: 12, color: c.ink300 }}>
                  {firstMission.ngos.name}
                </div>
              )}
            </motion.div>
          )}

          {/* CTA */}
          <motion.button
            type="button"
            onClick={handleStart}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.4 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: c.gold,
              color: c.ink,
              border: 'none',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(232,194,104,0.3)',
            }}
          >
            Hadi başlayalım →
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
