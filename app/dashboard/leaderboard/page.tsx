'use client'

import { useState } from 'react'
import { KarmaDotToken, ChipDS } from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'
import type { SemanticColors } from '@/lib/theme'

// ── Mock data ─────────────────────────────────────────────────────────────────
const podiumUsers = [
  { r: 1, name: 'Mert Aktaş', k: 12420, c: '#C4CBAC' },
  { r: 2, name: 'Ece Demir',  k: 11100, c: '#E9CFC2' },
  { r: 3, name: 'Can Özkan',  k: 9850,  c: '#EADDB8' },
]

const rankedUsers = [
  { r: 4,   name: 'Dilara Ş.',    k: 8200, c: '#B58F3D' },
  { r: 5,   name: 'Berk Kaya',    k: 7630, c: '#574E42' },
  { r: 6,   name: 'Selin Ç.',     k: 6910, c: '#C4CBAC' },
  { r: 7,   name: 'Ömer Yıldız',  k: 6480, c: '#E9CFC2' },
  { r: 142, name: 'Ayşe Y. (sen)', k: 2340, me: true, c: '#E8C268' },
]

// #3E2F14 is used as dark text on gold podium bar — exception per spec
const PODIUM_TEXT_DARK = '#3E2F14'
// #241E18 is used as dark text on gold backgrounds
const AVATAR_TEXT_DARK = '#241E18'

// ── PodiumPlace sub-component ─────────────────────────────────────────────────
function PodiumPlace({ user, height, colors: c }: { user: typeof podiumUsers[0]; height: number; colors: SemanticColors }) {
  const isFirst  = user.r === 1
  const avatarSz = isFirst ? 64 : 52
  const initial  = user.name.charAt(0)

  return (
    <div
      style={{
        flex: '0 0 92px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}
    >
      {/* Avatar + glow + rank badge */}
      <div style={{ position: 'relative', marginBottom: 8 }}>
        {/* Gold glow for #1 */}
        {isFirst && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(232,194,104,.45) 0%, transparent 70%)`,
              filter: 'blur(12px)',
              zIndex: 0,
            }}
          />
        )}
        {/* Avatar circle */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: avatarSz,
            height: avatarSz,
            borderRadius: '50%',
            background: user.c,
            border: `3px solid ${isFirst ? c.gold : c.ink600}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Fraunces, serif',
            fontSize: isFirst ? 26 : 20,
            fontWeight: 500,
            color: AVATAR_TEXT_DARK,
          }}
        >
          {initial}
        </div>
        {/* Rank badge below avatar for #1 */}
        {isFirst && (
          <div
            style={{
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: c.gold,
              border: `2px solid ${c.ink}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Fraunces, serif',
              fontSize: 13,
              fontWeight: 700,
              color: AVATAR_TEXT_DARK,
            }}
          >
            1
          </div>
        )}
      </div>

      {/* Name */}
      <p
        style={{
          margin: isFirst ? '10px 0 4px' : '2px 0 4px',
          fontSize: 12,
          fontWeight: 600,
          color: c.cream,
          textAlign: 'center',
          maxWidth: 90,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {user.name}
      </p>

      {/* Karma */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
        <KarmaDotToken size={9} />
        <span style={{ fontSize: 11, fontWeight: 700, color: c.gold }}>
          {user.k.toLocaleString('tr-TR')}
        </span>
      </div>

      {/* Podium bar */}
      <div
        style={{
          width: '100%',
          height,
          borderRadius: '10px 10px 0 0',
          background: isFirst
            ? `linear-gradient(180deg, ${c.gold}, ${c.goldDim})`
            : c.ink800,
          border: `1px solid ${isFirst ? c.goldDim : c.ink600}`,
          boxShadow: isFirst ? `inset 0 2px 8px rgba(255,255,255,.12)` : undefined,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 14,
        }}
      >
        <span
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: isFirst ? 28 : 22,
            fontWeight: 500,
            color: isFirst ? PODIUM_TEXT_DARK : c.ink300,
          }}
        >
          {user.r}
        </span>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const { colors: c } = useTheme()
  const [scope, setScope]   = useState<string>('İstanbul')
  const [period, setPeriod] = useState<string>('Bu ay')

  const scopes  = ['Arkadaşlar', 'İstanbul', 'Türkiye']
  const periods = ['Bu hafta', 'Bu ay', 'Tüm zamanlar']

  // Podium order: left=2nd, center=1st, right=3rd
  const podiumOrder = [
    { user: podiumUsers[1], height: 130 }, // #2 left
    { user: podiumUsers[0], height: 170 }, // #1 center
    { user: podiumUsers[2], height: 110 }, // #3 right
  ]

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        paddingBottom: 140,
      }}
    >
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0' }}>
        <p
          style={{
            margin: '0 0 4px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: c.gold,
          }}
        >
          SIRALAMA
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: 'Fraunces, serif',
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: c.cream,
          }}
        >
          Şehrin en{' '}
          <em style={{ fontStyle: 'italic', color: c.gold }}>iyileri</em>
        </h1>
      </div>

      {/* Scope chips */}
      <div
        style={{
          padding: '18px 20px 0',
          display: 'flex',
          gap: 8,
        }}
      >
        {scopes.map((s) => (
          <ChipDS key={s} active={scope === s} onClick={() => setScope(s)}>
            {s}
          </ChipDS>
        ))}
      </div>

      {/* Period segmented control */}
      <div style={{ padding: '12px 20px 0' }}>
        <div
          style={{
            display: 'inline-flex',
            background: c.ink,
            border: `1px solid ${c.ink600}`,
            borderRadius: 10,
            padding: 3,
          }}
        >
          {periods.map((p) => {
            const active = period === p
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '7px 12px',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  color: active ? AVATAR_TEXT_DARK : c.ink300,
                  background: active ? c.gold : 'transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all .15s',
                }}
              >
                {p}
              </button>
            )
          })}
        </div>
      </div>

      {/* Podium */}
      <div
        style={{
          padding: '40px 20px 0',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 14,
          height: 320,
        }}
      >
        {podiumOrder.map(({ user, height }) => (
          <PodiumPlace key={user.r} user={user} height={height} colors={c} />
        ))}
      </div>

      {/* Ranked list */}
      <div
        style={{
          padding: '28px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {rankedUsers.map((u) => {
          const isMe = !!u.me
          return (
            <div
              key={u.r}
              style={{
                background: isMe ? 'rgba(232,194,104,.08)' : c.ink800,
                border: `1px solid ${isMe ? c.gold : c.ink600}`,
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {/* Rank */}
              <span
                style={{
                  width: 32,
                  fontSize: 13,
                  fontWeight: 700,
                  color: isMe ? c.gold : c.ink300,
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {u.r > 100 ? `#${u.r}` : u.r}
              </span>

              {/* Avatar */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: u.c,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Fraunces, serif',
                  fontSize: 14,
                  fontWeight: 500,
                  color: AVATAR_TEXT_DARK,
                  flexShrink: 0,
                }}
              >
                {u.name.charAt(0)}
              </div>

              {/* Name */}
              <span
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: isMe ? 700 : 600,
                  color: c.cream,
                }}
              >
                {u.name}
              </span>

              {/* Karma */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <KarmaDotToken size={11} />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: c.gold,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {u.k.toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
