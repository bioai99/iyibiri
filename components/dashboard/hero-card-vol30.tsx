'use client'

// Vol-30.2 Hero Card — IA değişikliği (Bahadır kararı, 2026-04-26):
//   - Daily goal ring KALKTI
//   - TierButterfly kart sağ üstte ambient (260px, opacity 0.85)
//   - Karma 64px Fraunces serif, count-up animasyonu (1.2s easeOutCubic)
//   - Streak >= 1 ise sağ üstte glassmorphism rozet (🔥 X gün)
//   - Tier progress bar + "next tier'a X kaldı" yazısı
//   - Footer: 3 StatPill (Aktif / Tamamlanan / Tüm seviyeler X/5)
//
// Vol-39 (2026-05-02): StatPill artık Link + lucide icon + ChevronRight
//   Aktif → /dashboard/my-missions (devam edenler)
//   Tamamlanan → /dashboard/profile/karma (karma history)
//   Tüm Seviyeler → /dashboard/tiers (tier journey)

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { TIER_DATA, getTierByKarma, getNextTier } from '@/components/tier/tier-data'
import { TierButterfly } from '@/components/tier/tier-butterfly'

// Vol-39.2: Custom SVG icon set — İyiBiri marka dili (Fraunces + butterfly +
// gold accent). Lucide stock yerine app-specific motifler. currentColor ile
// theme uyumlu, 18×18 native, stroke 1.6 — Fraunces serif weight'i ile uyumlu.

type IconComponent = (props: { size?: number }) => JSX.Element

const ActiveOrbit: IconComponent = ({ size = 16 }) => (
  // "Devam eden" — yarım yay + dolu çekirdek. Hareketli, in-motion.
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
    <circle cx="9" cy="9" r="2.4" fill="currentColor" />
    <path d="M3.5 9a5.5 5.5 0 0 1 5.5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M14.5 9a5.5 5.5 0 0 1-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const CompletedSeal: IconComponent = ({ size = 16 }) => (
  // "Tamamlanan" — başarı rozeti minimal hali. Soft tinted daire + iri check.
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
    <circle cx="9" cy="9" r="7" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.6 9.3l2.2 2.2L12.6 6.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TierButterflyMark: IconComponent = ({ size = 16 }) => (
  // "Tüm Seviyeler" — mini butterfly silueti, TierButterfly motifinin
  // ikonografik küçüğü. Tier journey ile semantik uyum + marka kimliği.
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
    {/* Body — dikey orta çizgi */}
    <path d="M9 4.2v9.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    {/* Üst antenler */}
    <path d="M8 4.5c-.4-.7-1-1.2-1.6-1.4M10 4.5c.4-.7 1-1.2 1.6-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Sol kanat */}
    <path d="M9 6.5c-1.6-2.4-5-1.6-5 1.5 0 2.4 3 3.4 5 3z" fill="currentColor" fillOpacity="0.28" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    {/* Sağ kanat */}
    <path d="M9 6.5c1.6-2.4 5-1.6 5 1.5 0 2.4-3 3.4-5 3z" fill="currentColor" fillOpacity="0.28" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
)

interface HeroCardVol30Props {
  karma: number
  weeklyGain?: number
  streak?: number
  taken: number       // aktif görev sayısı
  completed: number   // tamamlanmış görev sayısı
}

export function HeroCardVol30({
  karma,
  weeklyGain = 0,
  streak = 0,
  taken,
  completed,
}: HeroCardVol30Props) {
  const { colors: c, mode } = useTheme()
  const isDark = mode === 'dark'
  const shouldReduceMotion = useReducedMotion()

  const tier = getTierByKarma(karma)
  const next = getNextTier(tier.id)
  const remaining = next ? Math.max(0, next.karma - karma) : 0
  const progressPct = next
    ? Math.min(100, Math.round(((karma - tier.karma) / (next.karma - tier.karma)) * 100))
    : 100

  const tint = tier.palette.glow
  const tintSolid = tier.palette.wL[1]

  // Karma count-up
  const [displayKarma, setDisplayKarma] = useState(shouldReduceMotion ? karma : 0)

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayKarma(karma)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1200)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayKarma(Math.round(karma * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [karma, shouldReduceMotion])

  return (
    <div
      style={{
        margin: '20px 16px 0',
        borderRadius: 28,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 280,
        background: isDark
          ? `radial-gradient(120% 80% at 70% 10%, ${tint} 0%, transparent 55%), linear-gradient(180deg, ${c.ink800} 0%, ${c.ink900} 100%)`
          : `radial-gradient(120% 80% at 70% 10%, ${tint} 0%, transparent 55%), linear-gradient(180deg, ${c.ink700} 0%, ${c.ink800} 100%)`,
        border: `1px solid ${c.ink600}`,
        boxShadow: isDark
          ? `0 12px 40px rgba(0,0,0,.4), 0 0 60px ${tint}`
          : `0 12px 40px rgba(168,123,38,.14), 0 0 40px ${tint}`,
      }}
    >
      {/* Butterfly background */}
      <div
        style={{
          position: 'absolute',
          right: -30,
          top: -10,
          width: 260,
          height: 260,
          opacity: 0.85,
          pointerEvents: 'none',
        }}
        aria-hidden
      >
        <TierButterfly tier={tier.id} size={260} />
      </div>

      {/* Streak badge */}
      {streak >= 1 && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 11px',
            borderRadius: 999,
            background: isDark ? 'rgba(0,0,0,0.30)' : 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1px solid ${tintSolid}55`,
            fontSize: 12,
            fontWeight: 600,
            color: c.gold,
          }}
          aria-label={`${streak} günlük streak`}
        >
          <span style={{ fontSize: 12 }} aria-hidden>🔥</span>
          {streak} gün
        </div>
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '28px 24px 22px',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: tintSolid,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Seviye {tier.id} · {tier.name}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            style={{
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 64,
              fontWeight: 500,
              letterSpacing: '-0.04em',
              color: c.cream,
              lineHeight: 0.95,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {displayKarma.toLocaleString('tr-TR')}
          </span>
          <span
            style={{
              fontSize: 14,
              color: c.ink300,
              fontStyle: 'italic',
              fontFamily: "'Fraunces', serif",
            }}
          >
            karma
          </span>
        </div>

        {weeklyGain > 0 && (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              fontWeight: 600,
              color: c.gold,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span aria-hidden>↗</span> +{weeklyGain.toLocaleString('tr-TR')} bu hafta
          </div>
        )}

        {next && (
          <div style={{ marginTop: 22, maxWidth: 260 }}>
            <div
              style={{
                height: 6,
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                borderRadius: 999,
                overflow: 'hidden',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: `${progressPct}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${tintSolid}, ${c.gold})`,
                  borderRadius: 999,
                  boxShadow: `0 0 12px ${tint}`,
                  transition: 'width 1.2s cubic-bezier(.4,0,.2,1)',
                }}
              />
            </div>
            <div
              style={{
                fontSize: 11,
                color: c.ink300,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <span>%{progressPct} ilerledin</span>
              <span
                style={{
                  fontStyle: 'italic',
                  fontFamily: "'Fraunces', serif",
                }}
              >
                {remaining.toLocaleString('tr-TR')} → {next.name}
              </span>
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            gap: 8,
            paddingTop: 16,
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <StatPill
            label="Aktif"
            value={taken}
            Icon={ActiveOrbit}
            href="/dashboard/my-missions"
          />
          <StatPill
            label="Tamamlanan"
            value={completed}
            Icon={CompletedSeal}
            href="/dashboard/profile/karma"
          />
          <StatPill
            label="Tüm seviyeler"
            value={`${tier.id}/${TIER_DATA.length}`}
            Icon={TierButterflyMark}
            href="/dashboard/tiers"
            tinted={tintSolid}
          />
        </div>
      </div>
    </div>
  )
}

interface StatPillProps {
  label: string
  value: string | number
  Icon: IconComponent
  href: string
  tinted?: string
}

function StatPill({ label, value, Icon, href, tinted }: StatPillProps) {
  const { colors: c, mode } = useTheme()
  const isDark = mode === 'dark'
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const accent = tinted ?? c.gold
  const baseBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const hoverBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
  const baseBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const hoverBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'

  return (
    <Link
      href={href}
      aria-label={`${label}: ${value} — detayları gör`}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setPressed(false); setHovered(false) }}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        flex: 1,
        padding: '12px 12px 12px 14px',
        borderRadius: 14,
        background: hovered ? hoverBg : baseBg,
        border: `1px solid ${hovered ? hoverBorder : baseBorder}`,
        textDecoration: 'none',
        cursor: 'pointer',
        position: 'relative',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 180ms cubic-bezier(.2,.8,.2,1), background 180ms, border-color 180ms',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minHeight: 64,
      }}
    >
      {/* Top row: icon + chevron */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: `${accent}1F`, // ~12% alpha tint
            border: `1px solid ${accent}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
          }}
          aria-hidden
        >
          <Icon size={16} />
        </span>
        <ChevronRight
          size={14}
          color={c.ink400}
          aria-hidden
          style={{
            opacity: hovered ? 1 : 0.55,
            transform: hovered ? 'translateX(2px)' : 'translateX(0)',
            transition: 'transform 180ms cubic-bezier(.2,.8,.2,1), opacity 180ms',
          }}
        />
      </div>

      {/* Bottom row: label + value */}
      <div style={{ marginTop: 'auto' }}>
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: tinted ?? c.ink300,
            textTransform: 'uppercase',
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: c.cream,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </div>
      </div>
    </Link>
  )
}
