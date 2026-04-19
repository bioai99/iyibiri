'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Bell, Calendar, Sparkles } from 'lucide-react'
import type { Profile, MissionWithNGO, UserMission, NGO } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'
import {
  HeroCard,
  QuickAction,
  ImpactSummary,
  ChipDS,
  IconButtonDS,
  ThemeToggle,
} from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'

// ── Tier helpers ───────────────────────────────────────────────

const TIER_THRESHOLDS = [0, 500, 2000, 5000, 10000]
const TIER_NAMES = [
  'İyi Biri',
  'Çok İyi Biri',
  'Çoook İyi Biri',
  'Gerçekten İyi Biri',
  'İyiliğin Öncüsü',
]
const TIER_NEXT = [
  'Çok İyi Biri',
  'Çoook İyi Biri',
  'Gerçekten İyi Biri',
  'İyiliğin Öncüsü',
  '',
]

function getTierIndex(karma: number): number {
  let idx = 0
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (karma >= TIER_THRESHOLDS[i]) { idx = i; break }
  }
  return idx
}

function getTierName(karma: number): string {
  return TIER_NAMES[getTierIndex(karma)]
}

function getNextTierName(karma: number): string {
  return TIER_NEXT[getTierIndex(karma)]
}

function getKarmaToNext(karma: number): number {
  const idx = getTierIndex(karma)
  if (idx >= TIER_THRESHOLDS.length - 1) return 0
  return TIER_THRESHOLDS[idx + 1] - karma
}

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
}

// ── Filter chips ───────────────────────────────────────────────

const FILTERS = ['Tümü', 'Yakınımda', 'Bu hafta sonu', 'Online', 'Kısa', 'Uzun']

// ── Component ─────────────────────────────────────────────────

export function DashboardClient({ profile, missions, userMissions, ngos }: Props) {
  const { colors: c } = useTheme()

  // Save pending onboarding data from localStorage (app flow: onboarding → auth → dashboard)
  useEffect(() => {
    const interests = localStorage.getItem('iyibiri_onboarding_interests')
    if (!interests) return
    const { createClient } = require('@/lib/supabase/client')
    const supabase = createClient()
    const city = localStorage.getItem('iyibiri_onboarding_city')
    const radius = localStorage.getItem('iyibiri_onboarding_radius')
    supabase.from('profiles').update({
      interests: JSON.parse(interests),
      city: city || null,
      search_radius: radius ? Number(radius) : 10,
    }).eq('id', profile.id).then(() => {
      localStorage.removeItem('iyibiri_onboarding_interests')
      localStorage.removeItem('iyibiri_onboarding_city')
      localStorage.removeItem('iyibiri_onboarding_radius')
    })
  }, [profile.id])

  const completedIds = new Set(userMissions.filter(m => m.status === 'completed').map(m => m.mission_id))
  const takenIds     = new Set(userMissions.filter(m => m.status === 'taken').map(m => m.mission_id))

  const featuredMissions = missions.filter(m => m.featured && !completedIds.has(m.id)).slice(0, 3)

  const karma = profile.karma_total ?? 0
  const firstName = (profile.name ?? 'Biri').split(' ')[0]

  const [activeFilter, setActiveFilter] = useState('Tümü')

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
            <em style={{ fontStyle: 'italic' }}>{firstName}</em>
          </p>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/dashboard/notifications" style={{ textDecoration: 'none' }}>
            <IconButtonDS
              size={38}
              theme="dark"
              icon={<Bell size={18} color={c.cream} />}
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
                color: '#241E18',
              }}>
                {firstName[0].toUpperCase()}
              </span>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* ── 2. HeroCard ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
        style={{ padding: '20px 16px 0' }}>
        <HeroCard profile={{
          karma,
          completed: completedIds.size,
          streak: profile.streak ?? 0,
          tierName: getTierName(karma),
          nextTier: getNextTierName(karma),
          karmaToNext: getKarmaToNext(karma),
        }} />
      </motion.div>

      {/* ── 3. Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        style={{
          padding: '16px 16px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
        }}>
        <Link href="/dashboard/missions" style={{ textDecoration: 'none' }}>
          <QuickAction
            icon={<Calendar size={18} color={c.gold} />}
            title="Bu hafta sonu"
            sub="12 görev yakında"
          />
        </Link>
        <Link href="/dashboard/missions" style={{ textDecoration: 'none' }}>
          <QuickAction
            icon={<Sparkles size={18} color={c.gold} />}
            title="Önerilenler"
            sub="Senin için 6 yeni"
          />
        </Link>
      </motion.div>

      {/* ── 4. Filter chips ── */}
      <div style={{ padding: '24px 0 4px' }}>
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingLeft: 20,
          paddingRight: 20,
          scrollbarWidth: 'none',
        }}>
          {FILTERS.map(filter => (
            <ChipDS
              key={filter}
              active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </ChipDS>
          ))}
        </div>
      </div>

      {/* ── 5. Mission section header ── */}
      <div style={{
        padding: '24px 20px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}>
        <h2 style={{
          margin: 0,
          fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: c.cream,
        }}>
          Senin için seçtik
        </h2>
        <Link
          href="/dashboard/missions"
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

      {/* ── 6. Mission cards (vertical) ── */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {featuredMissions.length === 0 ? (
          <p style={{ color: c.ink500, fontSize: 13, textAlign: 'center', padding: '32px 0' }}>
            Tüm öne çıkan görevleri tamamladın!
          </p>
        ) : (
          featuredMissions.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
            />
          ))
        )}
      </div>

      {/* ── 7. NGO rail ── */}
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
                Ortaklar
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
            {ngos.map(ngo => {
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

      {/* ── 8. Impact summary ── */}
      <div style={{ padding: '8px 16px 20px' }}>
        <ImpactSummary completed={completedIds.size} karma={karma} />
      </div>
    </div>
  )
}
