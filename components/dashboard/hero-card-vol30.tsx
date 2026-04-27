'use client'

// Vol-30.2 Hero Card — IA değişikliği (Bahadır kararı, 2026-04-26):
//   - Daily goal ring KALKTI
//   - TierButterfly kart sağ üstte ambient (260px, opacity 0.85)
//   - Karma 64px Fraunces serif, count-up animasyonu (1.2s easeOutCubic)
//   - Streak >= 1 ise sağ üstte glassmorphism rozet (🔥 X gün)
//   - Tier progress bar + "next tier'a X kaldı" yazısı
//   - Footer: 3 StatPill (Aktif / Tamamlanan / Tüm seviyeler X/5)

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { TIER_DATA, getTierByKarma, getNextTier } from '@/components/tier/tier-data'
import { TierButterfly } from '@/components/tier/tier-butterfly'

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
          <StatPill label="Aktif" value={taken} icon="●" />
          <StatPill label="Tamamlanan" value={completed} icon="✓" />
          <StatPill
            label="Tüm seviyeler"
            value={`${tier.id}/${TIER_DATA.length}`}
            icon="✦"
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
  icon: string
  tinted?: string
}

function StatPill({ label, value, icon, tinted }: StatPillProps) {
  const { colors: c, mode } = useTheme()
  const isDark = mode === 'dark'
  return (
    <div
      style={{
        flex: 1,
        padding: '10px 12px',
        borderRadius: 14,
        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: tinted ?? c.ink300,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: c.cream,
          fontVariantNumeric: 'tabular-nums',
          display: 'flex',
          alignItems: 'baseline',
          gap: 4,
        }}
      >
        <span style={{ fontSize: 11, color: tinted ?? c.gold }} aria-hidden>
          {icon}
        </span>
        {value}
      </div>
    </div>
  )
}
