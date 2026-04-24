'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { KarmaDotToken } from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'
import type { SemanticColors } from '@/lib/theme'

// #3E2F14 is used as dark text on gold podium bar — exception per spec
const PODIUM_TEXT_DARK = '#3E2F14'
// #241E18 is used as dark text on gold backgrounds
const AVATAR_TEXT_DARK = '#241E18'

const AVATAR_COLORS = ['#C4CBAC', '#E9CFC2', '#EADDB8', '#B58F3D', '#574E42', '#E8C268']

interface LeaderboardUser {
  id: string
  name: string | null
  karma_total: number
  avatar_type: string | null
}

interface LeaderboardClientProps {
  topUsers: LeaderboardUser[]
  currentUserId: string
  currentUserRank: number
  currentUserProfile: LeaderboardUser | null
}

function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

// ── PodiumPlace sub-component ─────────────────────────────────────────────────
function PodiumPlace({
  user,
  rank,
  height,
  colors: c,
  avatarColor,
}: {
  user: LeaderboardUser
  rank: number
  height: number
  colors: SemanticColors
  avatarColor: string
}) {
  const isFirst = rank === 1
  const avatarSz = isFirst ? 64 : 52
  const displayName = user.name || 'Anonim'
  const initial = displayName.charAt(0)

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
            background: avatarColor,
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
        {displayName}
      </p>

      {/* Karma */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
        <KarmaDotToken size={9} />
        <span style={{ fontSize: 11, fontWeight: 700, color: c.gold }}>
          {user.karma_total.toLocaleString('tr-TR')}
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
          {rank}
        </span>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function LeaderboardClient({
  topUsers,
  currentUserId,
  currentUserRank,
  currentUserProfile,
}: LeaderboardClientProps) {
  const { colors: c } = useTheme()

  // Build podium (top 3)
  const podiumUsers = topUsers.slice(0, 3)
  // Podium order: left=2nd, center=1st, right=3rd
  const podiumOrder = podiumUsers.length >= 3
    ? [
        { user: podiumUsers[1], rank: 2, height: 130 },
        { user: podiumUsers[0], rank: 1, height: 170 },
        { user: podiumUsers[2], rank: 3, height: 110 },
      ]
    : podiumUsers.map((u, i) => ({ user: u, rank: i + 1, height: i === 0 ? 170 : 130 }))

  // Rest of the list (4th and below)
  const rankedList = topUsers.slice(3)

  // Check if current user is already in the top 20
  const currentUserInList = topUsers.some((u) => u.id === currentUserId)

  const prefersReducedMotion = useReducedMotion()

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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0 }}
        style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0' }}>
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
          Topluluğun en{' '}
          <em style={{ fontStyle: 'italic', color: c.gold }}>iyileri</em>
        </h1>
      </motion.div>

      {/* Podium */}
      {podiumOrder.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.1 }}
          style={{
            padding: '40px 20px 0',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 14,
            height: 320,
          }}
        >
          {podiumOrder.map(({ user, rank, height }) => (
            <PodiumPlace
              key={user.id}
              user={user}
              rank={rank}
              height={height}
              colors={c}
              avatarColor={getAvatarColor(rank - 1)}
            />
          ))}
        </motion.div>
      )}

      {/* Ranked list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.2 }}
        style={{
          padding: '28px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {rankedList.map((u, idx) => {
          const rank = idx + 4
          const isMe = u.id === currentUserId
          const displayName = u.name || 'Anonim'
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.2 + (idx * 0.05) }}
              whileTap={{ scale: 0.98 }}
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
                {rank}
              </span>

              {/* Avatar */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: getAvatarColor(rank - 1),
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
                {displayName.charAt(0)}
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
                {isMe ? `${displayName} (sen)` : displayName}
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
                  {u.karma_total.toLocaleString('tr-TR')}
                </span>
              </div>
            </motion.div>
          )
        })}

        {/* Show current user at the bottom if not in top 20 */}
        {!currentUserInList && currentUserProfile && (
          <>
            {/* Separator dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : 0.25 }}
              style={{ textAlign: 'center', padding: '8px 0', color: c.ink400 }}
            >
              ...
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.3 }}
              style={{
                background: 'rgba(232,194,104,.08)',
                border: `1px solid ${c.gold}`,
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 32,
                  fontSize: 13,
                  fontWeight: 700,
                  color: c.gold,
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                #{currentUserRank}
              </span>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#E8C268',
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
                {(currentUserProfile.name || 'A').charAt(0)}
              </div>
              <span
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 700,
                  color: c.cream,
                }}
              >
                {currentUserProfile.name || 'Anonim'} (sen)
              </span>
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
                  {currentUserProfile.karma_total.toLocaleString('tr-TR')}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}
