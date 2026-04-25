'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import type { Profile, MissionWithNGO, UserMission, NGO } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'
import { EmptyStateV2, emptyPresets } from '@/components/ui/state'
import {
  ImpactSummary,
  ChipDS,
  IconButtonDS,
  ThemeToggle,
} from '@/components/ui/ds'
import { HeroCardV2Scroll } from '@/components/dashboard/hero-card-v2-scroll'
import { MissionCarousel } from '@/components/dashboard/mission-carousel'
import { useTheme } from '@/lib/theme'
import { MOTION_PRESETS } from '@/lib/motion.config'
import { getDisplayName } from '@/lib/utils'
import type { StreakActivity } from '@/lib/supabase/queries/streak'

// ── Date helpers ───────────────────────────────────────────────

const TR_MONTHS = [
  'OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN',
  'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK',
]
const TR_DAYS = [
  'PAZAR', 'PAZARTESİ', 'SALI', 'ÇARŞAMBA',
  'PERŞEMBE', 'CUMA', 'CUMARTESİ',
]

function formatDateEyebrow(): string {
  const d = new Date()
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} · ${TR_DAYS[d.getDay()]}`
}

// ── Props ──────────────────────────────────────────────────────

interface Props {
  profile: Profile
  missions: MissionWithNGO[]
  userMissions: UserMission[]
  ngos: NGO[]
  savedMissionIds?: string[]
  memberNgoIds?: string[]
  recommendedMissions: MissionWithNGO[]
  userActiveMissions: UserMission[]
  activeMissionsWithNGO: MissionWithNGO[]
  weeklyKarmaGain?: number
  streakActivity?: StreakActivity
}

// ── Tab key ────────────────────────────────────────────────────

type TabKey = 'recommended' | 'active'

// ── Component ─────────────────────────────────────────────────

export function DashboardClient({
  profile,
  missions,
  userMissions,
  ngos,
  savedMissionIds = [],
  memberNgoIds = [],
  recommendedMissions,
  activeMissionsWithNGO,
  weeklyKarmaGain = 0,
  streakActivity,
}: Props) {
  const { colors: c } = useTheme()

  // Save pending onboarding data from localStorage (app flow: onboarding → auth → dashboard)
  useEffect(() => {
    const interests = localStorage.getItem('iyibiri_onboarding_interests')
    if (!interests) return
    const { createClient } = require('@/lib/supabase/client')
    const supabase = createClient()
    const city = localStorage.getItem('iyibiri_onboarding_city')
    const radius = localStorage.getItem('iyibiri_onboarding_radius')
    const age = localStorage.getItem('iyibiri_onboarding_age')
    supabase.from('profiles').update({
      interests: JSON.parse(interests),
      city: city || null,
      search_radius: radius ? Number(radius) : 10,
      age_range: age || null,
    }).eq('id', profile.id).then(() => {
      localStorage.removeItem('iyibiri_onboarding_interests')
      localStorage.removeItem('iyibiri_onboarding_city')
      localStorage.removeItem('iyibiri_onboarding_radius')
      localStorage.removeItem('iyibiri_onboarding_age')
    })
  }, [profile.id])

  const completedIds = new Set(userMissions.filter(m => m.status === 'completed').map(m => m.mission_id))

  const karma = profile.karma_total ?? 0
  const displayName = getDisplayName({
    full_name: profile.name ?? null,
  })

  const [activeTab, setActiveTab] = useState<TabKey>('recommended')

  // Recommended: exclude carousel items (0-3) from list to avoid duplication
  const listMissions = activeTab === 'recommended'
    ? recommendedMissions.slice(3)
    : activeMissionsWithNGO

  const displayMissions = listMissions

  const sectionTitle = activeTab === 'recommended' ? 'Senin için seçtik' : 'Görevlerin'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: c.ink900,
        color: c.cream,
        paddingBottom: 100,
      }}
    >
      {/* ── 1. Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left */}
        <div>
          <p style={{
            margin: 0,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: c.ink300,
          }}>
            {formatDateEyebrow()}
          </p>
          <p style={{
            margin: '4px 0 0',
            fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: c.cream,
          }}>
            Günaydın,{' '}
            <em style={{ fontStyle: 'italic' }}>{displayName}</em>
          </p>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/dashboard/notifications" style={{ textDecoration: 'none' }}>
            <IconButtonDS
              size={38}
              theme="dark"
              icon={<Bell size={18} color={c.gold} />}
            />
          </Link>
          <ThemeToggle size={38} />
          {/* Gold avatar circle */}
          <Link href="/dashboard/profile" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.25)',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
                fontSize: 16,
                fontWeight: 600,
                color: '#FFFFFF',
              }}>
                {displayName[0].toUpperCase()}
              </span>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* ── 2. HeroCardV2Scroll (revize 2026-04-24 gece, Pattern 8 2026-04-25)
          Eski HeroCard tüm fonksiyonelliği korundu: 5 tier dots + BrandLogo +
          3 tıklanabilir stat cell (/my-missions, /my-missions, /streak).
          Yeni eklenenler: gold glow breathing + Karma count-up + weekly gain +
          seviye progress bar + Pattern 8: scroll-linked shrink animation
          A1 (tur 2): StreakSnapshot alt-section (streakActivity.recentDays) */}
      <div style={{ padding: '20px 0 0' }}>
        <HeroCardV2Scroll
          karma={karma}
          taken={userMissions.filter((m) => m.status === 'taken').length}
          completed={completedIds.size}
          streak={profile.current_streak ?? profile.streak ?? 0}
          weeklyKarmaGain={weeklyKarmaGain}
          isEmpty={karma === 0}
          userName={displayName}
          streakDays={streakActivity?.recentDays}
          lastActiveAt={streakActivity?.lastActiveAt}
        />
      </div>

      {/* ── 2.5 MissionCarousel ── 3-kart carousel + hero variant */}
      {/* UX audit çözüm: featured single card → 3-mission carousel */}
      {recommendedMissions.length > 0 && (
        <MissionCarousel
          missions={recommendedMissions.slice(0, 3)}
          userId={profile.id}
          isMember={(ngoId) => memberNgoIds.includes(ngoId)}
          savedIds={new Set(savedMissionIds)}
        />
      )}

      {/* ── 3. Mission section header + tab chips (scope clarified — 2026-04-25) ── */}
      <div style={{
        padding: '24px 20px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{
            margin: 0,
            fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: c.cream,
          }}>
            {sectionTitle}
          </h2>
        </div>
        <Link
          href="/dashboard/missions"
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: c.gold,
            letterSpacing: '0.06em',
            textDecoration: 'none',
            marginLeft: 8,
          }}
        >
          TÜMÜ →
        </Link>
      </div>

      {/* ── 3.5 Tab chips — positioned below h2 for scope clarity ── */}
      <div style={{ padding: '8px 20px 12px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <ChipDS active={activeTab === 'recommended'} onClick={() => setActiveTab('recommended')}>
            Senin için
          </ChipDS>
          <ChipDS active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
            Katıldıkların
          </ChipDS>
        </div>
      </div>

      {/* ── 4. Mission cards (vertical) ── */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {displayMissions.length === 0 ? (
          activeTab === 'recommended' ? (
            <EmptyStateV2 {...emptyPresets.noRecommendations} />
          ) : (
            <EmptyStateV2 {...emptyPresets.noActiveMissions} />
          )
        ) : (
          displayMissions.map((mission, idx) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                ...MOTION_PRESETS.spring.snappy,
                delay: idx * MOTION_PRESETS.stagger.default,
              }}
            >
              <MissionCard
                mission={mission}
                isSaved={savedMissionIds.includes(mission.id)}
                isMember={memberNgoIds.includes(mission.ngo_id ?? '')}
                userId={profile.id}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* ── 6. NGO rail ── */}
      {ngos.length > 0 && (
        <div style={{ padding: '32px 0 0' }}>
          {/* Section header */}
          <div style={{
            padding: '0 20px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
            <div>
              <p style={{
                margin: '0 0 3px',
                fontSize: 10,
                fontWeight: 700,
                color: c.gold,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}>
                İyilik Öncüleri
              </p>
              <h2 style={{
                margin: 0,
                fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
                fontSize: 22,
                fontWeight: 500,
                color: c.cream,
              }}>
                İyiliğin öncüleri
              </h2>
            </div>
            <Link
              href="/dashboard/ngos"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: c.gold,
                letterSpacing: '0.06em',
                textDecoration: 'none',
              }}
            >
              TÜMÜ →
            </Link>
          </div>

          {/* Horizontal rail */}
          <div style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            padding: '0 20px 20px',
            scrollbarWidth: 'none',
          }}>
            {ngos.filter(ngo => ngo.category !== 'sponsor').map(ngo => {
              const coverUrl = ngo.cover_image_url
              const activeMissionCount = missions.filter(m => m.ngos?.id === ngo.id).length

              return (
                <Link
                  key={ngo.id}
                  href={`/dashboard/ngos/${ngo.id}`}
                  style={{ flexShrink: 0, width: 158, textDecoration: 'none' }}
                >
                  <div style={{
                    background: c.ink800,
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: `1px solid ${c.ink600}`,
                  }}>
                    {/* 1:1 cover image */}
                    <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                      <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                        backgroundColor: coverUrl ? undefined : (ngo.color_accent ?? c.ink600),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }} />
                      {/* Gradient overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(26,22,18,0) 45%, rgba(26,22,18,.85) 100%)',
                      }} />
                      {/* 36px logo disk */}
                      <div style={{
                        position: 'absolute',
                        left: 10,
                        bottom: 10,
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        border: memberNgoIds.includes(ngo.id) ? `2px solid ${c.gold}` : undefined,
                      }}>
                        {ngo.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={ngo.logo_url}
                            alt={ngo.name}
                            style={{ width: '72%', height: '72%', objectFit: 'contain' }}
                            onError={e => { e.currentTarget.style.display = 'none' }}
                          />
                        ) : (
                          <span style={{ fontSize: 13, fontWeight: 700, color: ngo.color_accent ?? c.gold }}>
                            {(ngo.short_name ?? ngo.name)[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name + subtitle */}
                    <div style={{ padding: '11px 12px 13px' }}>
                      <p style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 600,
                        color: c.cream,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {ngo.short_name ?? ngo.name}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: c.ink300 }}>
                        {activeMissionCount} aktif görev
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── 7. Impact summary ── */}
      <div style={{ padding: '8px 16px 20px' }}>
        <ImpactSummary completed={completedIds.size} karma={karma} />
      </div>
    </div>
  )
}
