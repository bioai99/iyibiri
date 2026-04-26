'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { Settings, Share2, MapPin, LogOut, ChevronRight, Footprints, Flower2, Heart, Zap, Diamond, Crown } from 'lucide-react'
import { IconButtonDS, TierBadgeDS, KarmaDotToken } from '@/components/ui/ds'
import { getTierFromKarma } from '@/components/ui/tier-badge'
import { logoutAction } from './actions'
import type { Profile } from '@/lib/supabase/types'
import { useTheme } from '@/lib/theme'

interface MembershipWithNGO {
  id: string
  ngo_id: string
  ngos: {
    id: string
    name: string
    short_name: string | null
    logo_url: string | null
    color_accent: string | null
  } | null
}

interface ProfileClientProps {
  profile: Profile
  completedCount: number
  karma: number
  memberships?: MembershipWithNGO[]
}

const tierNames: Record<number, string> = {
  1: 'İyi Biri',
  2: 'Çok İyi Biri',
  3: 'Çoook İyi Biri',
  4: 'Gerçekten İyi Biri',
  5: 'İyiliğin Öncüsü',
}

const tierThresholds: Record<number, number> = {
  1: 500,
  2: 2000,
  3: 5000,
  4: 10000,
  5: Infinity,
}

const achievements = [
  { icon: <Footprints size={20} />, name: 'İlk Adım', locked: false, sub: 'İlk görevin' },
  { icon: <Flower2 size={20} />, name: 'Çevre Dostu', locked: false, sub: '3 çevre görevi' },
  { icon: <Heart size={20} />, name: 'Kalp Kalbe', locked: false, sub: '5 farklı öncü' },
  { icon: <Zap size={20} />, name: 'Yıldırım', locked: true, sub: '30 gün seri' },
  { icon: <Diamond size={20} />, name: 'Elmas', locked: true, sub: '10.000 Karma' },
  { icon: <Crown size={20} />, name: 'Liderlik', locked: true, sub: 'Top 10' },
]


export function ProfileClient({ profile, completedCount, karma, memberships = [] }: ProfileClientProps) {
  const { colors: c } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const tier = getTierFromKarma(karma)
  const tierName = tierNames[tier] ?? tierNames[1]
  const nextTier = tier < 5 ? tierNames[tier + 1] : null
  const prevThreshold = tier === 1 ? 0 : tierThresholds[tier - 1]
  const nextThreshold = tierThresholds[tier]
  const karmaInTier = karma - prevThreshold
  const karmaNeeded = nextThreshold === Infinity ? 0 : nextThreshold - prevThreshold
  const karmaToNext = nextThreshold === Infinity ? 0 : nextThreshold - karma
  const pct = nextThreshold === Infinity ? 100 : Math.min(100, Math.round((karmaInTier / karmaNeeded) * 100))

  // BUG-023 (Vol-11): legacy `name` null. Read full_name/first_name from Pattern D backfill.
  const displayName =
    profile.first_name?.trim() ||
    profile.full_name?.trim()?.split(/\s+/)[0] ||
    profile.name ||
    null
  const initial = (displayName ?? 'U').charAt(0).toUpperCase()

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        paddingBottom: 140,
      }}
    >
      {/* Cover + avatar section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0 }}
        style={{ position: 'relative', height: 180, flexShrink: 0 }}>
        {/* Cover gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${c.ink700}, ${c.ink800})`,
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, ${c.ink900}4D, ${c.ink900}D9)`,
          }}
        />
        {/* Top row: Settings + Share */}
        <div
          style={{
            position: 'absolute',
            top: 58,
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
            <IconButtonDS icon={<Settings size={16} />} />
          </Link>
          <IconButtonDS
            icon={<Share2 size={16} />}
            onClick={() => {
              try {
                if (navigator.share) {
                  navigator.share({ title: profile.full_name ?? displayName ?? profile.name ?? 'İyiBiri Profili', url: window.location.href })
                }
              } catch { /* silent */ }
            }}
          />
        </div>
      </motion.div>

      {/* Avatar row */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.1 }}
        style={{ marginTop: -42, position: 'relative', padding: '0 20px' }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`,
            border: `3px solid ${c.ink900}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.3)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
              fontSize: 36,
              fontWeight: 500,
              color: '#241E18',
              lineHeight: 1,
            }}
          >
            {initial}
          </span>
        </div>
      </motion.div>

      {/* Name + tier row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.15 }}
        style={{ marginTop: 12, padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                color: c.cream,
                margin: 0,
              }}
            >
              {profile.full_name?.trim() || displayName || (
                <Link href="/dashboard/profile/edit" style={{ color: c.gold, textDecoration: 'none' }}>
                  Adını henüz eklemedin
                </Link>
              )}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 6,
              }}
            >
              <MapPin size={11} color={c.ink300} />
              <span style={{ fontSize: 12, color: c.ink300 }}>
                {profile.city ?? 'Konum eklenmedi'} · {new Date(profile.created_at).getFullYear()}&apos;den beri üye
              </span>
            </div>
          </div>
          <TierBadgeDS tier={tierName} />
        </div>
      </motion.div>

      {/* Karma card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.2 }}
        style={{ padding: '20px 16px 0' }}>
        <div
          style={{
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            borderRadius: 16,
            padding: '18px 20px',
          }}
        >
          {/* Karma amount */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <KarmaDotToken size={14} />
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: c.gold,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {karma.toLocaleString('tr-TR')}
            </span>
            <span style={{ fontSize: 12, color: c.ink300, marginLeft: 2 }}>Karma</span>
          </div>

          {/* Progress bar */}
          {nextTier && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  fontSize: 11,
                  marginBottom: 8,
                  gap: 12,
                }}
              >
                <span
                  style={{
                    color: c.ink300,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                    flex: '1 1 auto',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
                      fontStyle: 'italic',
                      color: c.cream,
                    }}
                  >
                    {nextTier}
                  </span>
                  &apos;ye
                </span>
                <span
                  style={{
                    color: c.gold,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {karmaToNext.toLocaleString('tr-TR')} kaldı
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: c.ink600,
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${c.goldDim}, ${c.gold})`,
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.25 }}
        style={{
          padding: '14px 16px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8,
        }}
      >
        {[
          { label: 'GÖREV', value: completedCount, sub: 'tamamlandı', href: undefined },
          { label: 'SERİ', value: profile.streak ?? 0, sub: 'gün', href: '/dashboard/streak' },
          { label: 'ÖNCÜ', value: memberships.length, sub: 'destek', href: undefined },
        ].map(({ label, value, sub, href }) => {
          const card = (
            <div
              style={{
                background: c.ink800,
                border: `1px solid ${href ? c.goldLine ?? c.ink600 : c.ink600}`,
                borderRadius: 12,
                padding: '14px 12px',
                textAlign: 'center',
                cursor: href ? 'pointer' : undefined,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '.22em',
                  textTransform: 'uppercase',
                  color: c.ink300,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: c.cream,
                  fontVariantNumeric: 'tabular-nums',
                  marginTop: 4,
                }}
              >
                {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
              </div>
              <div style={{ fontSize: 10, color: c.ink300, marginTop: 2 }}>{sub}</div>
            </div>
          )
          return href ? (
            <Link key={label} href={href} style={{ textDecoration: 'none' }}>
              {card}
            </Link>
          ) : (
            <div key={label}>{card}</div>
          )
        })}
      </motion.div>

      {/* Saved missions link */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.3 }}
        style={{ padding: '8px 16px 0' }}
      >
        <Link href="/dashboard/saved" style={{ textDecoration: 'none' }}>
          <motion.div
            whileTap={{ scale: 0.97 }}
            style={{
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 14,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: c.cream }}>
              Kaydedilenler
            </span>
            <ChevronRight size={16} color={c.ink300} />
          </motion.div>
        </Link>
      </motion.div>

      {/* Üyeliklerim */}
      {memberships.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.35 }}
          style={{ padding: '24px 20px 0' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
              fontSize: 20,
              fontWeight: 500,
              color: c.cream,
              margin: '0 0 12px',
            }}
          >
            Üyeliklerim
          </h2>
          <Link href="/dashboard/ngos" style={{ textDecoration: 'none' }}>
            <div style={{
              background: c.goldSoft, border: `1px solid ${c.goldLine}`,
              borderRadius: 14, padding: '14px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 14, color: c.gold }}>İyilik Öncülerini keşfet</span>
              <ChevronRight size={16} color={c.gold} />
            </div>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.35 }}
          style={{ padding: '24px 20px 0' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
              fontSize: 20,
              fontWeight: 500,
              color: c.cream,
              margin: '0 0 12px',
            }}
          >
            Üyeliklerim
          </h2>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {memberships.map(m => (
              <Link key={m.id} href={`/dashboard/ngos/${m.ngo_id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <div style={{
                  width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'white', border: `2px solid ${c.goldLine}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    {m.ngos?.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.ngos.logo_url} alt={m.ngos.name} style={{ width: '65%', height: '65%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: 18, fontWeight: 700, color: m.ngos?.color_accent ?? c.gold }}>
                        {(m.ngos?.short_name ?? '?')[0]}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: c.ink300, textAlign: 'center', lineHeight: 1.2 }}>
                    {m.ngos?.short_name ?? m.ngos?.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Leaderboard link */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.4 }}
        style={{ padding: '8px 16px 0' }}
      >
        <Link href="/dashboard/leaderboard" style={{ textDecoration: 'none' }}>
          <motion.div
            whileTap={{ scale: 0.97 }}
            style={{
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 14,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: c.cream }}>
              Skor tablosu
            </span>
            <ChevronRight size={16} color={c.ink300} />
          </motion.div>
        </Link>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.45 }}
      >
        <div style={{ padding: '30px 20px 12px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
              fontSize: 20,
              fontWeight: 500,
              color: c.cream,
              margin: 0,
            }}
          >
            Rozetler
          </h2>
        </div>
        <div
          style={{
            padding: '0 16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
          }}
        >
          {achievements.map(({ icon, name, locked, sub }, idx) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.45 + (idx * 0.05) }}
              style={{
                background: c.ink800,
                border: `1px solid ${c.ink600}`,
                borderRadius: 14,
                padding: '16px 10px',
                textAlign: 'center',
                opacity: locked ? 0.5 : 1,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: locked
                    ? c.ink600
                    : `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`,
                  boxShadow: locked
                    ? undefined
                    : 'inset 0 1px 0 rgba(255,255,255,.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontSize: 20,
                  color: locked ? c.ink300 : '#241E18',
                }}
              >
                {icon}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: c.cream,
                  lineHeight: 1.2,
                }}
              >
                {name}
              </div>
              <div style={{ fontSize: 10, color: c.ink300, marginTop: 3 }}>{sub}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Rozetlerim link */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.65 }}
        style={{ padding: '16px 16px 0' }}
      >
        <Link href="/dashboard/profile/badges" style={{ textDecoration: 'none' }}>
          <motion.div
            whileTap={{ scale: 0.97 }}
            style={{
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 14,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: c.cream }}>
              Tüm Rozetlerim
            </span>
            <ChevronRight size={16} color={c.ink300} />
          </motion.div>
        </Link>
      </motion.div>

      {/* Activity timeline — empty state (no real data passed yet) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: prefersReducedMotion ? 0 : 0.7 }}
      >
        <div style={{ padding: '30px 20px 12px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
              fontSize: 20,
              fontWeight: 500,
              color: c.cream,
              margin: 0,
            }}
          >
            Son görevlerin
          </h2>
        </div>
        <div style={{ padding: '0 20px' }}>
          <div
            style={{
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 14,
              padding: '20px 18px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 14, color: c.ink300, margin: 0, lineHeight: 1.5 }}>
              Henüz tamamlanmış görev yok.{' '}
              <Link href="/dashboard/missions" style={{ color: c.gold, fontWeight: 600, textDecoration: 'none' }}>
                İlk görevini bul!
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Logout */}
      <div style={{ padding: '32px 20px 0' }}>
        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: c.ink300,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            Çıkış yap
          </button>
        </form>
      </div>
    </div>
  )
}
