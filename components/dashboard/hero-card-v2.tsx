// components/dashboard/hero-card-v2.tsx
//
// Dashboard hero card — V2 minimal refactor (Alternative A, 2026-04-26).
// Simplified hero layout with preserved butterfly:
//  - Top row: Karma + BrandLogo (butterfly) + tier name italic + 5 tier dots (→ /dashboard/tiers)
//  - Progress bar: current tier → next tier
//  - Streak chip: conditional (only when streak >= 1), minimal badge with flame icon
//  - Empty CTA: simplified link (only when karma === 0)
//  - Gold glow breathing (3s, I6 imza pattern)
//  - Karma count-up 0 → karma (0.8s ease-out, Duolingo pattern)
//  - Weekly gain micro-indicator
//  - aria-live="polite" Karma için
//  - prefers-reduced-motion respect
//
// REMOVED: StreakSnapshot strip, 3-stat grid (taken/completed/streak),
// border dividers, large CTA styling

'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, animate } from 'framer-motion'
import { Flame } from 'lucide-react'

import { useTheme, getCardShadow } from '@/lib/theme'
import { KarmaDotToken } from '@/components/ui/ds'
import { BrandLogo } from '@/components/ui/brand-logo'

/* ─────────────────────────────────────────────────────────────
 *  Tier sistem (eski HeroCard'tan aynen korundu — 5 tier)
 * ───────────────────────────────────────────────────────────── */

const TIER_THRESHOLDS = [0, 500, 2000, 5000, 10000]
const TIER_NAMES = [
  'İyi Biri',
  'İyi Yürekli',
  'İyilik Elçisi',
  'İyilik Savaşçısı',
  'İyiliğin Işığı',
]

function computeTier(karma: number) {
  let tierLevel = 1
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (karma >= TIER_THRESHOLDS[i]) {
      tierLevel = i + 1
      break
    }
  }
  return {
    tierLevel,
    tierName: TIER_NAMES[tierLevel - 1],
    nextTierAt:
      tierLevel < TIER_THRESHOLDS.length ? TIER_THRESHOLDS[tierLevel] : null,
    nextTierName:
      tierLevel < TIER_NAMES.length ? TIER_NAMES[tierLevel] : null,
  }
}

/* ─────────────────────────────────────────────────────────────
 *  Props + Component
 * ───────────────────────────────────────────────────────────── */

export interface HeroCardV2Props {
  karma: number
  /** Aktif görev sayısı (status='taken') */
  taken: number
  /** Tamamlanmış görev sayısı */
  completed: number
  /** Streak gün sayısı */
  streak: number
  /** Bu hafta kazanılan Karma — varsa micro-indicator */
  weeklyKarmaGain?: number
  /** İlk kullanıcı (karma=0) variant */
  isEmpty?: boolean
  /** Loading skeleton */
  isLoading?: boolean
  userName?: string
  /** Streak snapshot verileri (A1 tur 2 yeni) */
  streakDays?: boolean[]
  lastActiveAt?: Date | null
}

export function HeroCardV2({
  karma,
  taken,
  completed,
  streak,
  weeklyKarmaGain,
  isEmpty = false,
  isLoading = false,
  userName,
  streakDays,
  lastActiveAt,
}: HeroCardV2Props) {
  const { mode, colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const [displayKarma, setDisplayKarma] = useState(
    shouldReduceMotion ? karma : 0,
  )
  const counterRef = useRef<HTMLSpanElement>(null)

  // Karma count-up — Duolingo pattern, UI spec Bölüm 6 Adım 2
  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayKarma(karma)
      return
    }
    const controls = animate(0, karma, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.2,
      onUpdate: (v) => setDisplayKarma(Math.round(v)),
    })
    return () => controls.stop()
  }, [karma, shouldReduceMotion])

  const { tierLevel, tierName, nextTierAt, nextTierName } = computeTier(karma)
  const progressPct = nextTierAt
    ? Math.min(
        Math.round(
          ((karma - TIER_THRESHOLDS[tierLevel - 1]) /
            (nextTierAt - TIER_THRESHOLDS[tierLevel - 1])) *
            100,
        ),
        100,
      )
    : 100

  /* Loading skeleton */
  if (isLoading) {
    return (
      <div
        className="mx-4 h-[220px] rounded-3xl"
        style={{
          background: c.ink800,
          animation: 'shimmer 2s ease-in-out infinite',
          backgroundImage: `linear-gradient(90deg, ${c.ink800} 0%, ${c.ink700} 50%, ${c.ink800} 100%)`,
          backgroundSize: '200% 100%',
        }}
        aria-busy="true"
      />
    )
  }

  /* Normal: Karma + BrandLogo/tier + progress + 3 stat cell */
  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.05,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className="hero-glow-breathing mx-4 overflow-hidden rounded-3xl"
      style={{
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
        boxShadow: getCardShadow(mode, 'md'),
      }}
    >
      {/* ── Üst: Karma solda, BrandLogo+tier sağda (tıklanabilir) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '20px 12px 16px 22px',
          gap: 8,
        }}
      >
        {/* Sol: Karma sayı + label + weekly gain */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 6,
              marginBottom: 2,
            }}
          >
            <KarmaDotToken size={14} />
            <span
              ref={counterRef}
              aria-live="polite"
              aria-atomic="true"
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: isEmpty ? c.goldDim : c.gold,
                letterSpacing: '-0.035em',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 0.95,
              }}
            >
              {displayKarma.toLocaleString('tr-TR')}
            </span>
          </div>
          <div style={{ fontSize: 13, color: c.ink300 }}>Karma</div>
          {weeklyKarmaGain !== undefined && weeklyKarmaGain > 0 && (
            <p className="mt-1 text-xs font-medium" style={{ color: c.gold }}>
              +{weeklyKarmaGain.toLocaleString('tr-TR')} bu hafta
            </p>
          )}
        </div>

        {/* Sağ: BrandLogo + tier name italic + 5 dots (tıklanabilir → /dashboard/tiers) */}
        <Link
          href="/dashboard/tiers"
          style={{ textDecoration: 'none', flexShrink: 0 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <BrandLogo tierLevel={tierLevel} />
            <div
              style={{
                fontFamily:
                  "'Fraunces', var(--font-display), ui-serif, Georgia, serif",
                fontStyle: 'italic',
                fontSize: 13,
                fontWeight: 500,
                color: c.gold,
                marginTop: -6,
              }}
            >
              {tierName}
            </div>
            <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
              {[1, 2, 3, 4, 5].map((t) => (
                <div
                  key={t}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: t <= tierLevel ? c.gold : c.ink600,
                  }}
                />
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* ── Progress bar: bir sonraki tier'a ilerleme ── */}
      {nextTierAt && (
        <div style={{ padding: '0 22px 14px' }}>
          <div
            className="h-[6px] w-full overflow-hidden rounded-full"
            style={{ background: c.ink600 }}
          >
            <motion.div
              initial={shouldReduceMotion ? { width: `${progressPct}%` } : { width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${c.goldDim} 0%, ${c.gold} 100%)`,
                boxShadow: 'inset 0 0 4px rgba(181,143,61,0.3)',
              }}
            />
          </div>
          {nextTierName && (
            <div
              className="mt-1.5 flex items-center justify-between"
              style={{ fontSize: 11 }}
            >
              <span style={{ color: c.ink400 }}>
                %{progressPct} ·{' '}
                {(nextTierAt - karma).toLocaleString('tr-TR')} Karma
              </span>
              <span style={{ color: c.ink300, fontWeight: 500 }}>
                → {nextTierName}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Streak chip (minimal, only if streak >= 1) ── */}
      {streak >= 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 999,
            background: 'rgba(209,155,60,0.12)',
            border: `1px solid rgba(209,155,60,0.2)`,
            fontSize: 12,
            fontWeight: 600,
            color: '#D19B3C',
            marginTop: 12,
            marginLeft: 22,
            marginBottom: 18,
            width: 'fit-content',
          }}
        >
          <Flame size={12} />
          {streak} gün seri
        </div>
      )}

      {/* ── Empty CTA (minimal link, only when isEmpty) ── */}
      {isEmpty && (
        <div style={{ padding: '0 22px 18px' }}>
          <Link
            href="/dashboard/missions"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              fontWeight: 500,
              color: c.gold,
              textDecoration: 'none',
            }}
          >
            İlk görevini tamamla
            <span style={{ fontSize: 10, opacity: 0.7 }}>→</span>
          </Link>
        </div>
      )}
    </motion.div>
  )
}
