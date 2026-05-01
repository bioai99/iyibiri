'use client'

// components/ui/celebration-overlay.tsx
//
// Mission completion celebration — peak moment.
// UX audit 2026-04-24 (mission lifecycle journey) Adım 8 spec:
// - Confetti 3-wave (gold + cream + success)
// - Karma count-up 0 → karmaEarned (1.2s ease-out)
// - Haptic SUCCESS notification (Capacitor)
// - Native share CTA ("Arkadaşım görsün") + Dashboard CTA
// - Dark tema Premium × Warm
// - prefers-reduced-motion respect

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion, animate } from 'framer-motion'
import type { Options as ConfettiOptions } from 'canvas-confetti'
import { Sparkles, Share2, ArrowRight } from 'lucide-react'
import { useTheme } from '@/lib/theme'

// Faz 4 (2026-04-26 perf-eng): canvas-confetti dynamic import. Initial bundle -30KB.
// Confetti sadece tetiklendiğinde lazy yüklenir.

interface CelebrationOverlayProps {
  show: boolean
  karmaEarned: number
  missionTitle: string
  /** STK adı — share metninde kullanılır */
  ngoShortName?: string
  /** Share URL'i — yoksa window.location kullanılır */
  shareUrl?: string
  onClose: () => void
  /** Custom dashboard click (default: onClose) */
  onDashboard?: () => void
  /** "Paylaş" CTA tıklandığında override — default navigator.share */
  onShare?: () => void
}

export function CelebrationOverlay({
  show,
  karmaEarned,
  missionTitle,
  ngoShortName,
  shareUrl,
  onClose,
  onDashboard,
  onShare,
}: CelebrationOverlayProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const onCloseRef = useRef(onClose)
  const [displayKarma, setDisplayKarma] = useState(0)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  /* Confetti + haptic + count-up — show=true olduğunda */
  useEffect(() => {
    if (!show) {
      setDisplayKarma(0)
      return
    }

    // Haptic success (Capacitor native)
    if (typeof window !== 'undefined') {
      try {
        // @ts-expect-error Capacitor optional
        window.Capacitor?.Plugins?.Haptics?.notification({ type: 'SUCCESS' })
      } catch {
        /* no-op */
      }
    }

    // Confetti — 3-wave, TR palette (lazy load: paket sadece show=true olduğunda yüklenir)
    if (!shouldReduceMotion) {
      const GOLD = '#E8C268'
      const CREAM = '#F4EEDF'
      const SUCCESS = '#6B8E4E'

      ;(async () => {
        const { default: confetti } = await import('canvas-confetti')
        const fire = (particleRatio: number, opts: ConfettiOptions) => {
          confetti({
            ...opts,
            origin: { y: 0.55 },
            particleCount: Math.floor(220 * particleRatio),
          })
        }
        // Wave 1 — fast gold burst
        fire(0.3, { spread: 26, startVelocity: 55, colors: [GOLD, CREAM] })
        // Wave 2 — medium spread
        fire(0.25, { spread: 60, colors: [GOLD, CREAM, SUCCESS] })
        // Wave 3 — slow trailing
        fire(0.3, {
          spread: 100,
          decay: 0.91,
          scalar: 0.85,
          colors: [GOLD, CREAM, SUCCESS],
        })
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
      })()
    }

    // Karma count-up
    if (shouldReduceMotion) {
      setDisplayKarma(karmaEarned)
    } else {
      const controls = animate(0, karmaEarned, {
        duration: 1.2,
        delay: 0.4,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setDisplayKarma(Math.round(v)),
      })
      return () => controls.stop()
    }
  }, [show, karmaEarned, shouldReduceMotion])

  const handleShare = async () => {
    if (onShare) {
      onShare()
      return
    }
    const url =
      shareUrl ??
      (typeof window !== 'undefined' ? window.location.href : 'https://iyibiri.app')
    const text = ngoShortName
      ? `${ngoShortName} ile "${missionTitle}" görevini tamamladım, +${karmaEarned} Karma kazandım 🌱 İyiBiri'de sen de katıl:`
      : `"${missionTitle}" görevini tamamladım, +${karmaEarned} Karma kazandım 🌱`

    try {
      if (navigator.share) {
        await navigator.share({ title: 'İyiBiri', text, url })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} ${url}`)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      }
    } catch {
      /* user cancelled */
    }
  }

  const handleDashboard = () => {
    if (onDashboard) onDashboard()
    else onCloseRef.current()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(6px)',
          }}
          onClick={handleDashboard}
        >
          <motion.div
            className="relative w-full max-w-sm text-center"
            initial={shouldReduceMotion ? {} : { scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: `linear-gradient(135deg, ${c.ink800} 0%, ${c.ink900} 100%)`,
              border: `1px solid ${c.goldLine}`,
              borderRadius: 28,
              padding: '36px 28px 28px',
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${c.gold}40`,
            }}
          >
            {/* Sparkles icon halo */}
            <motion.div
              initial={
                shouldReduceMotion ? {} : { scale: 0, rotate: -45, opacity: 0 }
              }
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 260,
                damping: 14,
              }}
              className="mx-auto mb-5 flex items-center justify-center rounded-full"
              style={{
                width: 72,
                height: 72,
                background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`,
                boxShadow: `0 8px 24px ${c.gold}60`,
              }}
              aria-hidden="true"
            >
              <Sparkles size={28} color={c.ink} strokeWidth={2.2} />
            </motion.div>

            {/* Eyebrow */}
            <p
              className="mb-2 text-[11px] font-bold uppercase"
              style={{ color: c.gold, letterSpacing: '0.16em' }}
            >
              Tebrikler!
            </p>

            {/* Title */}
            <h2
              className="font-display"
              style={{
                color: c.cream,
                fontSize: 24,
                fontWeight: 500,
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
              }}
            >
              <em style={{ fontStyle: 'italic', color: c.gold }}>
                {missionTitle}
              </em>
              <br />
              görevini tamamladın
            </h2>

            {/* Karma count-up reward chip */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full"
              style={{
                background: c.goldSoft,
                border: `1.5px solid ${c.goldLine}`,
                padding: '10px 18px',
              }}
              aria-live="polite"
              aria-atomic="true"
            >
              <Sparkles size={16} color={c.gold} />
              <span
                className="font-display tabular-nums"
                style={{
                  color: c.gold,
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}
              >
                +{displayKarma.toLocaleString('tr-TR')}
              </span>
              <span
                className="text-[13px] font-semibold uppercase"
                style={{ color: c.gold, letterSpacing: '0.08em' }}
              >
                Karma
              </span>
            </motion.div>

            {/* CTA'lar */}
            <div className="mt-7 flex flex-col gap-2">
              <motion.button
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                onClick={handleShare}
                className="flex h-12 items-center justify-center gap-2 rounded-xl font-bold"
                style={{
                  background: c.gold,
                  color: c.ink,
                  fontSize: 15,
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,.08)',
                }}
              >
                <Share2 size={16} />
                {shareCopied ? 'Link kopyalandı ✓' : 'Arkadaşım görsün'}
              </motion.button>
              <button
                onClick={handleDashboard}
                className="flex h-11 items-center justify-center gap-1.5 rounded-xl font-semibold"
                style={{
                  background: 'transparent',
                  color: c.cream,
                  border: `1.5px solid ${c.ink600}`,
                  fontSize: 14,
                }}
              >
                Dashboard&apos;a dön
                <ArrowRight size={14} />
              </button>
            </div>

            <p className="mt-4 text-[11px]" style={{ color: c.ink400 }}>
              Arkaplan dokunmak da kapatır
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
