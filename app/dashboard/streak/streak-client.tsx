'use client'

import { ChevronLeft, Share2, Flame } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IconButtonDS } from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

const MILESTONES = [
  { at: 14, name: 'İki hafta', bonus: '+100 Karma' },
  { at: 30, name: 'Bir ay', bonus: 'Yıldırım rozeti' },
  { at: 100, name: 'Yüz gün', bonus: '+1.000 Karma' },
]

// #3E2F14 is used as dark text on gold coin — exception per spec
const COIN_DARK = '#3E2F14'

interface StreakClientProps {
  currentStreak: number
  longestStreak: number
  /** Array of 0-6 (Mon=0 ... Sun=6) indicating which days this week had completions */
  activeDays: number[]
}

export default function StreakClient({ currentStreak, longestStreak, activeDays }: StreakClientProps) {
  const { colors: c } = useTheme()
  const router = useRouter()

  // Filter milestones: show only those not yet reached
  const upcomingMilestones = MILESTONES.filter((m) => m.at > currentStreak)

  // Determine headline text based on streak
  function getHeadlineText(streak: number): string {
    if (streak === 0) return 'Bugün ilk gününü başlat.'
    if (streak === 1) return 'Bir günlük başlangıç.'
    if (streak < 7) return `${streak} günlük iyi hal.`
    if (streak === 7) return 'Yedi günlük iyi hal.'
    if (streak < 14) return `${streak} günlük iyi hal.`
    if (streak < 30) return `${streak} günlük seri!`
    if (streak < 100) return `${streak} günlük muhteşem seri!`
    return `${streak} günlük efsane seri!`
  }

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        paddingBottom: 40,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButtonDS
          icon={<ChevronLeft size={18} />}
          onClick={() => router.back()}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: c.ink300,
          }}
        >
          SERİ
        </span>
        <IconButtonDS
          icon={<Share2 size={18} />}
          onClick={() => {
            try {
              if (navigator.share) {
                navigator.share({ title: `${currentStreak} günlük iyilik serisi! — İyiBiri`, url: window.location.href })
              }
            } catch { /* silent */ }
          }}
        />
      </div>

      {/* Big coin section */}
      <div style={{ padding: '28px 28px 0', textAlign: 'center' }}>
        <div
          style={{
            width: 200,
            height: 200,
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Radial glow */}
          <div
            style={{
              position: 'absolute',
              inset: -10,
              background:
                'radial-gradient(circle, rgba(232,194,104,.2), transparent 60%)',
              filter: 'blur(16px)',
            }}
          />
          {/* Main circle */}
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `linear-gradient(145deg, ${c.gold}, ${c.goldDim})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 10px 30px rgba(26,22,18,.4), inset 0 2px 0 rgba(255,255,255,.3), inset 0 -2px 0 rgba(62,47,20,.3)',
              position: 'relative',
            }}
          >
            <Flame size={28} color={COIN_DARK} />
            <span
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: COIN_DARK,
                letterSpacing: '-0.05em',
                fontVariantNumeric: 'tabular-nums',
                marginTop: 4,
                lineHeight: 1,
              }}
            >
              {currentStreak}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: COIN_DARK,
                letterSpacing: '0.14em',
                marginTop: 2,
              }}
            >
              GÜN
            </span>
          </div>
        </div>
      </div>

      {/* Headline */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: c.cream,
            margin: 0,
          }}
        >
          <em>{getHeadlineText(currentStreak)}</em>
        </h1>
        <p
          style={{
            fontSize: 14,
            color: c.ink200,
            lineHeight: 1.55,
            maxWidth: 300,
            margin: '12px auto 0',
          }}
        >
          {currentStreak > 0
            ? 'Her gün iyi bir şey yapmak, zamanla büyük değişimler yaratır. Seriyi sürdür!'
            : 'Bir görev tamamlayarak iyilik serine başla!'}
        </p>
        {longestStreak > 0 && longestStreak > currentStreak && (
          <p
            style={{
              fontSize: 12,
              color: c.ink300,
              margin: '8px auto 0',
            }}
          >
            En uzun serin: {longestStreak} gün
          </p>
        )}
      </div>

      {/* Days row */}
      <div style={{ padding: '36px 16px 0' }}>
        <div
          style={{
            background: 'rgba(26,22,18,.45)',
            border: `1px solid rgba(244,238,223,.12)`,
            borderRadius: 16,
            padding: '18px 14px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {DAYS.map((day, i) => {
            const filled = activeDays.includes(i)
            const isToday = new Date().getDay() === (i === 6 ? 0 : i + 1) // Mon=0 in our array, but JS Sun=0
            return (
              <div
                key={day}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {/* Circle */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: filled ? c.gold : 'rgba(244,238,223,.07)',
                    border: `1px solid ${filled ? c.goldDim : 'rgba(244,238,223,.12)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: filled
                      ? 'inset 0 1px 0 rgba(255,255,255,.25), inset 0 -1px 0 rgba(62,47,20,.2)'
                      : 'none',
                  }}
                >
                  {filled && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={COIN_DARK}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                {/* Label */}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: isToday ? c.gold : c.ink300,
                  }}
                >
                  {day}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Milestones */}
      {upcomingMilestones.length > 0 && (
        <div style={{ padding: '28px 20px 0' }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: c.ink300,
              marginBottom: 14,
              margin: '0 0 14px 0',
            }}
          >
            SIRADAKİ KİLOMETRE TAŞLARI
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcomingMilestones.map((m, idx) => {
              const isNear = idx === 0 // nearest upcoming milestone
              return (
                <div
                  key={m.at}
                  style={{
                    background: 'rgba(26,22,18,.45)',
                    border: `1px solid ${isNear ? c.goldLine : 'rgba(244,238,223,.12)'}`,
                    borderRadius: 14,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  {/* Number square */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: isNear ? c.goldSoft : 'rgba(244,238,223,.07)',
                      border: `1px solid ${isNear ? c.goldLine : 'rgba(244,238,223,.12)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      color: isNear ? c.gold : c.ink300,
                    }}
                  >
                    {m.at}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 14, fontWeight: 600, color: c.cream }}
                    >
                      {m.name}
                    </div>
                    <div
                      style={{ fontSize: 11, color: c.ink300, marginTop: 2 }}
                    >
                      {m.bonus}
                    </div>
                  </div>
                  {/* Days remaining */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: isNear ? c.gold : c.ink300,
                      flexShrink: 0,
                    }}
                  >
                    {m.at - currentStreak} GÜN
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Reached milestones */}
      {MILESTONES.filter((m) => m.at <= currentStreak).length > 0 && (
        <div style={{ padding: '28px 20px 0' }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: c.gold,
              margin: '0 0 14px 0',
            }}
          >
            KAZANILAN KİLOMETRE TAŞLARI
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MILESTONES.filter((m) => m.at <= currentStreak).map((m) => (
              <div
                key={m.at}
                style={{
                  background: 'rgba(232,194,104,.06)',
                  border: `1px solid ${c.goldLine}`,
                  borderRadius: 14,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: c.goldSoft,
                    border: `1px solid ${c.goldLine}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: c.gold,
                  }}
                >
                  {m.at}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.cream }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: 11, color: c.ink300, marginTop: 2 }}>
                    {m.bonus}
                  </div>
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={c.gold}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
