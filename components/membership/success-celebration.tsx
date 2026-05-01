// components/membership/success-celebration.tsx
//
// NGO üyelik Adım 5: başarı celebration.
// UI Spec 2026-04-24 Bölüm 10 — Celebration state + Karma reward.
// UX Audit Peak moment: "Üyelik tamamlandı + +100 Karma".
//
// Özellikler:
// - Confetti (canvas-confetti) — gold + cream + STK accent renk
// - Karma count-up animate (0 → 100) — Duolingo pattern
// - İkonlu "Üye oldun" başlık — Fraunces italic
// - STK logo + plaket rozeti
// - Impact statement — "7 fidan dikildi" / "Gönüllülerin arasındasın"
// - 2 CTA: "Dashboard'a dön" primary, "Sertifikayı indir" ghost
// - Haptic success
// - prefers-reduced-motion respect
// - Skill: mobile-app-polish-standards Bölüm 11 "Peak moment celebration" pattern (Duolingo xp +20).

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, animate } from 'framer-motion'
import { Download, Heart, Sparkles } from 'lucide-react'
import type { Options as ConfettiOptions } from 'canvas-confetti'
import { useTheme } from '@/lib/theme'

// Faz 4 (2026-04-26 perf-eng): canvas-confetti dynamic import. Initial bundle -30KB.

interface SuccessCelebrationProps {
  ngoName: string
  ngoShortName?: string
  ngoAccentColor?: string
  /** Plaket rozetinde göreceği STK logo */
  ngoLogoUrl?: string
  /** Kazanılan Karma — default 100 */
  karmaEarned?: number
  /** Impact cümlesi — "7 fidan dikildi" / "Gönüllülerin arasındasın" */
  impactStatement?: string
  /** Tier adı — "Yetişkin" / "Aylık" / "₺150 bağış" */
  tierLabel: string
  /** Periyot — "yıllık" / "aylık" / "tek seferlik" */
  periodLabel?: string
  onDashboard: () => void
  onDownloadCert?: () => void
  /** Sertifika gerçekten hazır mı — değilse ghost button disabled */
  certReady?: boolean
}

export function SuccessCelebration({
  ngoName,
  ngoShortName,
  ngoAccentColor,
  ngoLogoUrl,
  karmaEarned = 100,
  impactStatement,
  tierLabel,
  periodLabel,
  onDashboard,
  onDownloadCert,
  certReady = false,
}: SuccessCelebrationProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const accentColor = ngoAccentColor ?? c.gold
  const [displayKarma, setDisplayKarma] = useState(
    shouldReduceMotion ? karmaEarned : 0,
  )
  const confettiFired = useRef(false)

  /* Confetti + haptic + count-up — mount */
  useEffect(() => {
    if (confettiFired.current) return
    confettiFired.current = true

    if (!shouldReduceMotion) {
      // 3-wave confetti — Duolingo/Things 3 peak moment (lazy load)
      ;(async () => {
        const { default: confetti } = await import('canvas-confetti')
        const fire = (ratio: number, opts: ConfettiOptions) => {
          confetti({
            ...opts,
            origin: { y: 0.5 },
            particleCount: Math.floor(180 * ratio),
          })
        }
        fire(0.3, {
          spread: 26,
          startVelocity: 55,
          colors: [c.gold, c.cream, accentColor],
        })
        fire(0.25, { spread: 60, colors: [c.gold, c.goldDim] })
        fire(0.3, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
          colors: [c.gold, c.cream, accentColor],
        })
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
      })()
    }

    // Haptic success (Capacitor)
    if (typeof window !== 'undefined') {
      try {
        // @ts-expect-error Capacitor optional
        window.Capacitor?.Plugins?.Haptics?.notification({ type: 'SUCCESS' })
      } catch {
        /* no-op */
      }
    }

    // Karma count-up
    if (shouldReduceMotion) return
    const controls = animate(0, karmaEarned, {
      duration: 1.2,
      delay: 0.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayKarma(Math.round(v)),
    })
    return () => controls.stop()
  }, [karmaEarned, shouldReduceMotion, c.gold, c.cream, c.goldDim, accentColor])

  const initials = (ngoShortName ?? ngoName).slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center px-5 pt-10 text-center"
    >
      {/* Plaket / rozet */}
      <motion.div
        initial={shouldReduceMotion ? {} : { rotate: -8, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{
          delay: 0.1,
          type: 'spring',
          stiffness: 260,
          damping: 14,
        }}
        className="relative mb-6"
      >
        <div
          className="flex h-[112px] w-[112px] items-center justify-center rounded-full"
          style={{
            background: `linear-gradient(135deg, ${c.gold} 0%, ${c.goldDim} 100%)`,
            boxShadow: `0 10px 40px ${c.gold}60`,
          }}
        >
          <div
            className="flex h-[96px] w-[96px] items-center justify-center rounded-full"
            style={{ background: '#fff' }}
          >
            {ngoLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ngoLogoUrl}
                alt={ngoName}
                className="h-[72px] w-[72px] object-contain"
              />
            ) : (
              <span
                className="font-display text-[28px] font-bold"
                style={{ color: accentColor }}
              >
                {initials}
              </span>
            )}
          </div>
        </div>
        {/* Sparkle aksan */}
        <motion.div
          initial={shouldReduceMotion ? {} : { scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
          className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: c.ink900, border: `2px solid ${c.gold}` }}
        >
          <Sparkles size={16} color={c.gold} />
        </motion.div>
      </motion.div>

      {/* Eyebrow */}
      <p
        className="mb-1 text-[11px] font-bold uppercase"
        style={{ color: c.gold, letterSpacing: '0.14em' }}
      >
        Üyelik Tamamlandı
      </p>

      {/* Başlık */}
      <h1
        className="font-display leading-tight"
        style={{
          color: c.cream,
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: '-0.025em',
        }}
      >
        <em style={{ fontStyle: 'italic', color: c.gold }}>Hoş geldin</em>,{' '}
        {ngoShortName ?? ngoName}
        <br />
        gönüllüsü
      </h1>

      {/* Tier + period meta */}
      <p
        className="mt-2 text-[13px] font-medium"
        style={{ color: c.ink300 }}
      >
        {tierLabel}
        {periodLabel ? ` · ${periodLabel}` : ''}
      </p>

      {/* Karma reward chip */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2.5"
        style={{
          background: c.goldSoft,
          border: `1.5px solid ${c.goldLine}`,
        }}
        aria-live="polite"
      >
        <Sparkles size={16} color={c.gold} />
        <span
          className="font-display tabular-nums"
          style={{
            color: c.gold,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          +{displayKarma.toLocaleString('tr-TR')}
        </span>
        <span
          className="text-[13px] font-semibold uppercase"
          style={{ color: c.gold, letterSpacing: '0.06em' }}
        >
          Karma
        </span>
      </motion.div>

      {/* Impact statement */}
      {impactStatement && (
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-5 flex items-center gap-2 rounded-2xl px-4 py-3"
          style={{
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
          }}
        >
          <Heart size={14} color={accentColor} fill={accentColor} />
          <span className="text-[13px] leading-[1.4]" style={{ color: c.ink200 }}>
            {impactStatement}
          </span>
        </motion.div>
      )}

      {/* CTA'lar */}
      <div className="mt-8 flex w-full flex-col gap-2">
        <motion.button
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          onClick={onDashboard}
          className="h-[52px] rounded-xl font-bold"
          style={{
            background: c.gold,
            color: c.ink,
            fontSize: 15,
            boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          }}
        >
          Dashboard&apos;a dön
        </motion.button>
        {onDownloadCert && (
          <motion.button
            whileTap={
              certReady && !shouldReduceMotion ? { scale: 0.97 } : undefined
            }
            onClick={onDownloadCert}
            disabled={!certReady}
            className="inline-flex h-[48px] items-center justify-center gap-2 rounded-xl font-semibold"
            style={{
              background: 'transparent',
              color: certReady ? c.cream : c.ink400,
              border: `1.5px solid ${certReady ? c.ink500 : c.ink600}`,
              fontSize: 14,
              cursor: certReady ? 'pointer' : 'not-allowed',
            }}
          >
            <Download size={14} />
            {certReady ? 'Gönüllü sertifikanı indir' : 'Sertifika hazırlanıyor…'}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
