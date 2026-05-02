'use client'

// Vol-30.5 Dashboard client — IA değişikliği tam rewrite.
//
// Akış (sırasıyla):
//   1. Header (date + greeting + theme toggle + avatar) — daily goal kalktı
//   2. HeroCard (TierButterfly + karma count-up + 3 StatPill)
//   3. MissionTabs (Senin için / Katıldıkların) + MissionListCard listesi
//   4. PostsRail (NGO Haberler) — subscribed NGO ÜYE rozet
//   5. SponsorPostsRail (Sosyal Sorumluluk) — Patagonia, Eczacıbaşı vs.
//   6. NGORail (Üye olduğun + İyiliğin öncüleri)
//   7. ImpactStrip (X görevde, Y kişiye dokundun)
//
// BottomNav layout'tan global olarak gelir.

import { useEffect, useState, useMemo } from 'react'
import type {
  Profile,
  MissionWithNGO,
  UserMission,
  NGO,
  PostWithAuthor,
} from '@/lib/supabase/types'
import { useTheme } from '@/lib/theme'
import { getDisplayName } from '@/lib/utils'
import type { StreakActivity } from '@/lib/supabase/queries/streak'

import { DashboardHeaderVol30 } from '@/components/dashboard/dashboard-header-vol30'
import { HeroCardVol30 } from '@/components/dashboard/hero-card-vol30'
import { MissionTabsVol30, type MissionTabKey } from '@/components/dashboard/mission-tabs-vol30'
import { MissionListCardVol30 } from '@/components/dashboard/mission-list-card-vol30'
import { PostsRailVol30 } from '@/components/dashboard/posts-rail-vol30'
import { NGORailVol30 } from '@/components/dashboard/ngo-rail-vol30'
import { ImpactStripVol30 } from '@/components/dashboard/impact-strip-vol30'
import { EmptyStateV2, emptyPresets } from '@/components/ui/state'

interface Props {
  profile: Profile
  missions: MissionWithNGO[]
  userMissions: UserMission[]
  ngos: NGO[]
  savedMissionIds?: string[]
  memberNgoIds?: string[]
  subscribedNgoIds?: string[]
  recommendedMissions: MissionWithNGO[]
  userActiveMissions: UserMission[]
  activeMissionsWithNGO: MissionWithNGO[]
  weeklyKarmaGain?: number
  streakActivity?: StreakActivity
  ngoPosts: PostWithAuthor[]
  sponsorPosts: PostWithAuthor[]
}

export function DashboardClient({
  profile,
  missions,
  userMissions,
  ngos,
  memberNgoIds = [],
  subscribedNgoIds = [],
  recommendedMissions,
  activeMissionsWithNGO,
  weeklyKarmaGain = 0,
  streakActivity,
  ngoPosts,
  sponsorPosts,
}: Props) {
  const { colors: c } = useTheme()

  // Save pending onboarding data from localStorage (auth → dashboard akışı)
  useEffect(() => {
    const interests = localStorage.getItem('iyibiri_onboarding_interests')
    if (!interests) return
    const { createClient } = require('@/lib/supabase/client')
    const supabase = createClient()
    const city = localStorage.getItem('iyibiri_onboarding_city')
    const radius = localStorage.getItem('iyibiri_onboarding_radius')
    const age = localStorage.getItem('iyibiri_onboarding_age')
    supabase
      .from('profiles')
      .update({
        interests: JSON.parse(interests),
        city: city || null,
        search_radius: radius ? Number(radius) : 10,
        age_range: age || null,
      })
      .eq('id', profile.id)
      .then(() => {
        localStorage.removeItem('iyibiri_onboarding_interests')
        localStorage.removeItem('iyibiri_onboarding_city')
        localStorage.removeItem('iyibiri_onboarding_radius')
        localStorage.removeItem('iyibiri_onboarding_age')
      })
  }, [profile.id])

  // ── Türetilmiş veri ───────────────────────────────────────────
  const karma = profile.karma_total ?? 0
  const displayName = getDisplayName({
    first_name: profile.first_name,
    full_name: profile.full_name ?? profile.name ?? null,
  })

  const completedCount = useMemo(
    () => userMissions.filter((m) => m.status === 'completed').length,
    [userMissions],
  )
  const takenCount = useMemo(
    () => userMissions.filter((m) => m.status === 'taken').length,
    [userMissions],
  )
  const currentStreak = streakActivity?.currentStreak ?? 0

  // NGO rail için aktif görev sayısı
  const activeCountByNgo = useMemo(() => {
    const map = new Map<string, number>()
    for (const m of missions) {
      if (m.status !== 'active' || !m.ngo_id) continue
      map.set(m.ngo_id, (map.get(m.ngo_id) ?? 0) + 1)
    }
    return map
  }, [missions])

  const memberSet = useMemo(() => new Set(memberNgoIds), [memberNgoIds])

  const memberNgosForRail = useMemo(
    () =>
      ngos
        .filter((n) => memberSet.has(n.id))
        .map((n) => ({ ngo: n, activeMissionCount: activeCountByNgo.get(n.id) ?? 0 })),
    [ngos, memberSet, activeCountByNgo],
  )

  const discoverNgosForRail = useMemo(
    () =>
      ngos
        .filter((n) => !memberSet.has(n.id))
        .map((n) => ({ ngo: n, activeMissionCount: activeCountByNgo.get(n.id) ?? 0 }))
        .sort((a, b) => b.activeMissionCount - a.activeMissionCount)
        .slice(0, 8),
    [ngos, memberSet, activeCountByNgo],
  )

  // ── Mission tabs ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<MissionTabKey>('recommended')

  // Vol-56-H: katıldıklarım Set + completed Set — kartlarda rozet ve sıralama için.
  const takenMissionIds = useMemo(
    () => new Set(userMissions.filter((m) => m.status === 'taken').map((m) => m.mission_id)),
    [userMissions],
  )
  const completedMissionIds = useMemo(
    () => new Set(userMissions.filter((m) => m.status === 'completed').map((m) => m.mission_id)),
    [userMissions],
  )

  // Vol-38: Dashboard mission listesi 4 ile sınırlı — özet rolü.
  // Tam liste /dashboard/missions'ta. TabCounts orijinal sayıyı korur (chip
  // 12 gösterir, "TÜMÜ →" CTA daha güçlü hissettirir, scroll fatigue azalır).
  const DASHBOARD_MISSION_LIMIT = 4
  const baseListMissions =
    activeTab === 'recommended' ? recommendedMissions : activeMissionsWithNGO
  // Vol-56-H: önerilen listede katıldıklarım her zaman önce gelir (kullanıcı
  // hatırlasın). "Katıldıklarım" tab'ında zaten hepsi taken, sıralama anlamsız.
  const sortedListMissions = useMemo(() => {
    if (activeTab !== 'recommended') return baseListMissions
    const taken: typeof baseListMissions = []
    const others: typeof baseListMissions = []
    for (const m of baseListMissions) {
      if (takenMissionIds.has(m.id) || completedMissionIds.has(m.id)) {
        taken.push(m)
      } else {
        others.push(m)
      }
    }
    return [...taken, ...others]
  }, [baseListMissions, activeTab, takenMissionIds, completedMissionIds])
  const listMissions = sortedListMissions.slice(0, DASHBOARD_MISSION_LIMIT)

  const tabCounts = {
    recommended: recommendedMissions.length,
    active: activeMissionsWithNGO.length,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: c.ink900,
        color: c.cream,
        paddingBottom: 120, // bottom nav offset
        overflowX: 'hidden',
      }}
    >
      {/* 1. Header */}
      <DashboardHeaderVol30 displayName={displayName} />

      {/* 2. Hero card */}
      <HeroCardVol30
        karma={karma}
        weeklyGain={weeklyKarmaGain}
        streak={currentStreak}
        taken={takenCount}
        completed={completedCount}
      />

      {/* 3. Mission tabs + list */}
      <MissionTabsVol30
        active={activeTab}
        onChange={setActiveTab}
        counts={tabCounts}
      />
      <div
        style={{
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {listMissions.length > 0 ? (
          listMissions.map((m) => (
            <MissionListCardVol30
              key={m.id}
              mission={m}
              isTaken={takenMissionIds.has(m.id) || completedMissionIds.has(m.id)}
              isCompleted={completedMissionIds.has(m.id)}
            />
          ))
        ) : (
          <div style={{ padding: '24px 0' }}>
            <EmptyStateV2
              {...(activeTab === 'recommended'
                ? emptyPresets.noRecommendations
                : emptyPresets.noActiveMissions)}
            />
          </div>
        )}
      </div>

      {/* 4. NGO posts rail (ÖNCÜLERDEN · Haberler) */}
      <PostsRailVol30
        posts={ngoPosts}
        subscribedNgoIds={subscribedNgoIds}
        eyebrow="ÖNCÜLERDEN"
        title="Haberler"
      />

      {/* 5. Sponsor posts rail (SPONSORLARDAN · Sosyal sorumluluk) — Vol-40
          unified: aynı PostsRailVol30 component'i, farklı eyebrow/title.
          Author tipi (sponsor vs NGO) post.sponsors/post.ngos'tan auto-tespit. */}
      <PostsRailVol30
        posts={sponsorPosts}
        eyebrow="SPONSORLARDAN"
        title="Sosyal sorumluluk"
      />

      {/* 6. NGO rail (Üye + Keşfet) */}
      <NGORailVol30
        memberNgos={memberNgosForRail}
        discoverNgos={discoverNgosForRail}
      />

      {/* 7. Impact strip */}
      <ImpactStripVol30 completed={completedCount} karma={karma} />
    </div>
  )
}
