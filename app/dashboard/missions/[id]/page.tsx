import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMissionById, getUserMissions } from '@/lib/supabase/queries/missions'
import type { Mission } from '@/lib/supabase/types'
import {
  deriveMissionState,
  type MissionState,
} from '@/lib/missions/state'
import { MissionStateBanner } from '@/components/mission'
import { MissionDetailClient } from './mission-detail-client'
import { MissionStatesClient } from './states-client'

export default async function MissionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [mission, userMissions] = await Promise.all([
    getMissionById(params.id),
    getUserMissions(user.id),
  ])
  if (!mission) notFound()

  const userMission = userMissions.find((m) => m.mission_id === params.id) ?? null

  /* ──────────────────────────────────────────────────────────
   *  Parallel fetch — membership + saved + NGO info + follow
   * ────────────────────────────────────────────────────────── */
  const [membershipResult, savedResult, ngoInfoResult, subscriptionResult] = await Promise.all([
    mission.ngo_id
      ? supabase
          .from('ngo_memberships')
          .select('id')
          .eq('user_id', user.id)
          .eq('ngo_id', mission.ngo_id)
          .eq('status', 'active')
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from('user_saved_missions')
      .select('id')
      .eq('user_id', user.id)
      .eq('mission_id', params.id)
      .maybeSingle(),
    mission.ngo_id
      ? supabase
          .from('ngos')
          .select('short_name, website')
          .eq('id', mission.ngo_id)
          .single()
      : Promise.resolve({ data: null }),
    mission.ngo_id
      ? supabase
          .from('user_ngo_subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('ngo_id', mission.ngo_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const isMember = !!membershipResult.data
  const isSaved = !!savedResult.data
  const ngoInfo = ngoInfoResult.data
  const isFollowing = !!subscriptionResult.data

  /* ──────────────────────────────────────────────────────────
   *  Derive state — lib/missions/state.ts FSM tek source of truth
   * ────────────────────────────────────────────────────────── */
  const state: MissionState = deriveMissionState({
    mission: mission as Mission,
    userMission,
    isMember,
    isOnCompleteRoute: false,
  })

  /* ──────────────────────────────────────────────────────────
   *  State-spesifik render
   * ────────────────────────────────────────────────────────── */

  // Banner state'leri — tek component, farklı variant
  if (
    state === 'full' ||
    state === 'expired' ||
    state === 'cancelled' ||
    state === 'failed_verification'
  ) {
    const helpUrl = ngoInfo?.website ? `https://${ngoInfo.website}` : null
    return (
      <MissionStateBanner
        variant={state}
        photoUrl={mission.photo_url}
        similarMissionsCategory={mission.category}
        adminFeedback={userMission?.admin_feedback ?? null}
        helpContactUrl={helpUrl}
        ngoShortName={ngoInfo?.short_name ?? undefined}
      />
    )
  }

  // requires_membership — detay içinde CTA "önce üye ol" rendering
  // Şimdilik mevcut MissionDetailClient bu mantığı KVKK shortcut ile yapıyor;
  // UX audit K3 yolda — ayrı iş olarak shortcut kaldırılıp `/membership`
  // redirect akışına yönlendirme yapılacak. Şimdilik member = isMember.
  if (state === 'requires_membership' || state === 'idle') {
    return (
      <MissionDetailClient
        mission={mission}
        userMission={userMission}
        userId={user.id}
        isMember={isMember}
        isSaved={isSaved}
        isFollowing={isFollowing}
      />
    )
  }

  // taken + completed → existing states-client (zaten dark tema)
  if (state === 'taken') {
    return (
      <MissionStatesClient mission={mission as Mission} state="applied" />
    )
  }

  if (state === 'completed') {
    return (
      <MissionStatesClient mission={mission as Mission} state="completed" />
    )
  }

  // verifying → /complete'e redirect (bu state derive edilince kullanıcı zaten orada olmalı)
  if (state === 'verifying') {
    redirect(`/dashboard/missions/${params.id}/complete`)
  }

  // Fallback — unreachable (TypeScript exhaustiveness)
  return (
    <MissionDetailClient
      mission={mission}
      userMission={userMission}
      userId={user.id}
      isMember={isMember}
      isSaved={isSaved}
      isFollowing={isFollowing}
    />
  )
}
