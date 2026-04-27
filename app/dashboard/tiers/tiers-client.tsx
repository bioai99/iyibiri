'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { TierButterfly, CocoonButterfly } from '@/components/tier/tier-butterfly'
import { Metamorphosis } from '@/components/tier/metamorphosis'
import { TIER_DATA, getTierByKarma, getNextTier, type TierData } from '@/components/tier/tier-data'

interface TiersClientProps {
  karma: number
}

// Vol-28: Tier Journey premium tasarım — yıldız alanı + 5 kelebek + journey path.
// Mevcut useTheme entegre, light/dark uyumlu.
export function TiersClient({ karma }: TiersClientProps) {
  const { colors: c, mode } = useTheme()
  const router = useRouter()

  const isDark = mode === 'dark'
  const currentTier = getTierByKarma(karma)
  const [activeTier, setActiveTier] = useState<TierData>(currentTier)
  const [unlocking, setUnlocking] = useState<{ from: number; to: number } | null>(null)
  const nextTier = getNextTier(activeTier.id)

  // Hero progress (active tier'dan sonraki tier'a kadar)
  const progress = nextTier
    ? Math.min(100, ((karma - activeTier.karma) / (nextTier.karma - activeTier.karma)) * 100)
    : 100
  const karmaToNext = nextTier ? Math.max(0, nextTier.karma - karma) : 0

  const triggerUnlock = (toTier: number) => {
    if (unlocking) return
    const from = Math.max(1, toTier - 1)
    setUnlocking({ from, to: toTier })
  }

  const onUnlockDone = () => {
    if (unlocking) {
      const target = TIER_DATA[unlocking.to - 1]
      if (target) setActiveTier(target)
    }
    setTimeout(() => setUnlocking(null), 800)
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: c.ink900,
        color: c.cream,
        paddingBottom: 140,
        overflow: 'hidden',
      }}
    >
      {/* Cinematic background */}
      <CinematicBackground tier={activeTier} isDark={isDark} c={c} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            padding: 'calc(env(safe-area-inset-top, 20px) + 18px) 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Geri"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: c.ink800,
              backdropFilter: 'blur(12px)',
              border: `1px solid ${c.ink600}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: c.cream,
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--font-display), Fraunces, ui-serif, Georgia, serif',
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: '-0.02em',
              }}
            >
              Seviye Yolculuğun
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: c.ink300 }}>
              Karma biriktir, kelebeğin gelişsin
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 999,
              background: c.goldSoft,
              border: `1px solid ${c.gold}40`,
            }}
          >
            <KarmaDot />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: c.gold,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {karma.toLocaleString('tr-TR')}
            </span>
          </div>
        </div>

        {/* Hero */}
        <HeroTier
          tier={activeTier}
          karmaToNext={karmaToNext}
          nextTier={nextTier}
          progress={progress}
          unlocking={unlocking}
          onUnlockDone={onUnlockDone}
          c={c}
        />

        {/* Journey */}
        <JourneyPath
          activeTier={activeTier}
          karma={karma}
          onSelectTier={(t) => setActiveTier(t)}
          onUnlock={triggerUnlock}
          c={c}
          isDark={isDark}
        />
      </div>
    </div>
  )
}

// ─── Sub-components ───

interface ColorBag {
  ink900: string
  ink800: string
  ink700: string
  ink600: string
  ink400: string
  ink300: string
  ink200?: string
  cream: string
  gold: string
  goldDim: string
  goldSoft: string
}

function KarmaDot() {
  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #F4D98A 0%, #C89E3D 100%)',
        boxShadow: '0 0 6px rgba(232,194,104,0.6)',
      }}
    />
  )
}

interface CinematicBackgroundProps {
  tier: TierData
  isDark: boolean
  c: ColorBag
}

function CinematicBackground({ tier, isDark, c }: CinematicBackgroundProps) {
  const tint = tier.palette.glow
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 1.8,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 4,
        hue: Math.random() > 0.7 ? 'gold' : 'white',
      })),
    []
  )

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${c.ink900} 0%, ${c.ink800} 60%, ${c.ink900} 100%)`,
        }}
      />
      <div
        key={`tint-${tier.id}`}
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120%',
          height: '70%',
          background: `radial-gradient(ellipse at center, ${tint} 0%, transparent 60%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
          opacity: isDark ? 1 : 0.5,
          animation: 'fadeIn 1.4s ease-out both',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: `linear-gradient(180deg, transparent 0%, ${c.ink900} 100%)`,
          pointerEvents: 'none',
        }}
      />
      {/* Starfield */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {stars.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: isDark ? s.size : s.size + 0.5,
              height: isDark ? s.size : s.size + 0.5,
              borderRadius: '50%',
              background: isDark
                ? s.hue === 'gold'
                  ? '#E8C268'
                  : '#F4EEDF'
                : c.gold,
              boxShadow: isDark
                ? s.hue === 'gold'
                  ? '0 0 4px rgba(232,194,104,0.6)'
                  : '0 0 4px rgba(244,238,223,0.6)'
                : 'none',
              opacity: isDark ? 1 : 0.18,
              animation: `tier-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes tier-twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.9;
          }
        }
        @keyframes tier-fadeUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes tier-heroIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.85);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes tier-barFill {
          from {
            width: 0;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

interface HeroTierProps {
  tier: TierData
  karmaToNext: number
  nextTier: TierData | null
  progress: number
  unlocking: { from: number; to: number } | null
  onUnlockDone: () => void
  c: ColorBag
}

function HeroTier({ tier, karmaToNext, nextTier, progress, unlocking, onUnlockDone, c }: HeroTierProps) {
  return (
    <div
      style={{
        padding: '32px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: 240,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        {unlocking ? (
          <Metamorphosis fromTier={unlocking.from} toTier={unlocking.to} size={200} onDone={onUnlockDone} />
        ) : (
          <div
            key={`hero-${tier.id}`}
            style={{ animation: 'tier-heroIn 0.9s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            <TierButterfly tier={tier.id} size={200} />
          </div>
        )}
      </div>

      {!unlocking && (
        <>
          <div
            key={`badge-${tier.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 999,
              background: c.goldSoft,
              border: `1px solid ${c.gold}40`,
              fontSize: 11,
              fontWeight: 700,
              color: c.gold,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 12,
              animation: 'tier-fadeUp 0.6s ease-out 0.2s both',
            }}
          >
            Seviye {tier.id}
          </div>

          <h2
            key={`name-${tier.id}`}
            style={{
              margin: 0,
              fontFamily: 'var(--font-display), Fraunces, ui-serif, Georgia, serif',
              fontSize: 34,
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              color: c.cream,
              lineHeight: 1.1,
              animation: 'tier-fadeUp 0.6s ease-out 0.3s both',
            }}
          >
            {tier.name}
          </h2>

          <p
            key={`desc-${tier.id}`}
            style={{
              margin: '10px 0 24px',
              fontSize: 14,
              color: c.ink300,
              maxWidth: 280,
              lineHeight: 1.5,
              animation: 'tier-fadeUp 0.6s ease-out 0.4s both',
            }}
          >
            {tier.desc}
          </p>

          {nextTier && (
            <div
              style={{
                width: '100%',
                maxWidth: 320,
                padding: '14px 16px',
                borderRadius: 16,
                background: c.ink800,
                border: `1px solid ${c.ink600}`,
                animation: 'tier-fadeUp 0.6s ease-out 0.5s both',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                  fontSize: 11,
                }}
              >
                <span style={{ color: c.ink300 }}>
                  Sıradaki:{' '}
                  <span
                    style={{
                      color: c.cream,
                      fontStyle: 'italic',
                      fontFamily: 'var(--font-display), Fraunces, ui-serif, Georgia, serif',
                      fontSize: 13,
                    }}
                  >
                    {nextTier.name}
                  </span>
                </span>
                <span
                  style={{
                    color: c.gold,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {karmaToNext.toLocaleString('tr-TR')} karma
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 999,
                  background: c.ink700,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  key={`bar-${tier.id}`}
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #B58F3D 0%, #E8C268 50%, #F4D98A 100%)',
                    borderRadius: 999,
                    boxShadow: '0 0 12px rgba(232,194,104,0.5)',
                    animation: 'tier-barFill 1.2s ease-out 0.6s both',
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface JourneyPathProps {
  activeTier: TierData
  karma: number
  onSelectTier: (tier: TierData) => void
  onUnlock: (tierId: number) => void
  c: ColorBag
  isDark: boolean
}

function JourneyPath({ activeTier, karma, onSelectTier, onUnlock, c, isDark }: JourneyPathProps) {
  return (
    <div style={{ padding: '32px 20px 0', position: 'relative' }}>
      <div
        style={{
          textAlign: 'center',
          marginBottom: 20,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: c.ink300,
        }}
      >
        ◆ Yolculuk ◆
      </div>

      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 80,
          bottom: 20,
          width: 2,
          background: `linear-gradient(180deg, ${c.gold}50 0%, ${c.ink600} 100%)`,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TIER_DATA.map((tier) => {
          const isActive = tier.id === activeTier.id
          const isLocked = karma < tier.karma
          return (
            <TierPathCard
              key={tier.id}
              tier={tier}
              isActive={isActive}
              isLocked={isLocked}
              karma={karma}
              onSelect={() => onSelectTier(tier)}
              onUnlock={() => onUnlock(tier.id)}
              c={c}
              isDark={isDark}
            />
          )
        })}
      </div>
    </div>
  )
}

interface TierPathCardProps {
  tier: TierData
  isActive: boolean
  isLocked: boolean
  karma: number
  onSelect: () => void
  onUnlock: () => void
  c: ColorBag
  isDark: boolean
}

function TierPathCard({ tier, isActive, isLocked, karma, onSelect, onUnlock, c, isDark }: TierPathCardProps) {
  const karmaNeeded = isLocked ? Math.max(0, tier.karma - karma) : 0
  const [hover, setHover] = useState(false)

  return (
    <button
      type="button"
      onClick={isLocked ? onUnlock : onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: isActive ? '13px 15px' : '14px 16px',
        borderRadius: 18,
        background: isActive
          ? isDark
            ? `linear-gradient(135deg, ${tier.palette.glow} 0%, ${c.ink800}D9 50%, ${c.ink900}F2 100%)`
            : `linear-gradient(135deg, ${tier.palette.glow} 0%, ${c.ink800}F2 50%, ${c.ink900}FA 100%)`
          : c.ink800,
        backdropFilter: 'blur(14px)',
        border: isActive
          ? `2px solid ${c.gold}`
          : isLocked
            ? `1px dashed ${c.ink600}`
            : `1px solid ${c.ink600}`,
        cursor: 'pointer',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isActive ? `0 12px 32px ${tier.palette.glow}` : '0 2px 8px rgba(0,0,0,0.2)',
        color: 'inherit',
        fontFamily: 'inherit',
        width: '100%',
        transform: hover ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'transform 0.18s ease-out, box-shadow 0.18s ease-out',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -36,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: isLocked ? c.ink600 : c.gold,
          boxShadow: !isLocked ? `0 0 12px ${c.gold}` : 'none',
        }}
      />

      <div
        style={{
          flexShrink: 0,
          width: 84,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {isLocked ? (
          <CocoonButterfly tier={tier.id} size={70} />
        ) : (
          <TierButterfly tier={tier.id} size={70} paused={!isActive} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: c.ink300 }}>
            S{tier.id}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display), Fraunces, ui-serif, Georgia, serif',
              fontStyle: 'italic',
              fontSize: 17,
              fontWeight: 500,
              color: isActive ? c.gold : isLocked ? c.ink400 : c.cream,
              letterSpacing: '-0.01em',
            }}
          >
            {tier.name}
          </span>
          {isActive && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: c.gold,
                background: c.goldSoft,
                border: `1px solid ${c.gold}40`,
                borderRadius: 999,
                padding: '2px 7px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Buradasın
            </span>
          )}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: isLocked ? c.ink400 : c.ink300,
            lineHeight: 1.4,
          }}
        >
          {tier.desc}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
          <KarmaDot />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: isLocked ? c.ink400 : c.gold,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {isLocked
              ? `${karmaNeeded.toLocaleString('tr-TR')} karma kaldı`
              : `${tier.karma.toLocaleString('tr-TR')}+ karma`}
          </span>
          {isLocked && (
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: c.gold, opacity: 0.7 }}>
              ⚡ Önizleme
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
