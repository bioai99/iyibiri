// lib/missions/actions.ts
//
// Mission lifecycle server actions — takeMission + completeMission + abandonMission.
// P0 #3 state machine implementation.
// UI Spec 2026-04-24 Bölüm 8 — completeMission idempotent karma.
// UX audit K4 — race condition çözümü (karma INSERT önce, status update sonra).
//
// Migration 013 unique index `karma_transactions_mission_unique` idempotent koruma sağlar.

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Json, Mission, UserMission } from '@/lib/supabase/types'
import { codesMatch } from './state'
import {
  type MissionErrorCode,
  translatePostgresError,
} from './error-codes'

/* ─────────────────────────────────────────────────────────────
 *  Shared types
 * ───────────────────────────────────────────────────────────── */

export type ActionResult<T = void> =
  | ({ ok: true } & (T extends void ? object : T))
  | { ok: false; error: string; code: MissionErrorCode }

/* ─────────────────────────────────────────────────────────────
 *  takeMission — idle → taken
 * ───────────────────────────────────────────────────────────── */

export async function takeMission(
  missionId: string,
): Promise<ActionResult<{ userMissionId: string }>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Önce giriş yap.', code: 'AUTH_REQUIRED' }
  }

  // 1. Mission fetch + guard check
  const { data: missionData, error: missionErr } = await supabase
    .from('missions')
    .select('id, ngo_id, status, spots_left, event_date, access_level')
    .eq('id', missionId)
    .single()

  if (missionErr || !missionData) {
    return {
      ok: false,
      error: 'Görev bulunamadı.',
      code: 'GENERIC',
    }
  }

  const mission = missionData as Pick<
    Mission,
    'id' | 'ngo_id' | 'status' | 'spots_left' | 'event_date' | 'access_level'
  >

  if (mission.status === 'cancelled') {
    return {
      ok: false,
      error: 'Bu görev iptal edildi.',
      code: 'MISSION_CANCELLED',
    }
  }

  if (typeof mission.spots_left === 'number' && mission.spots_left <= 0) {
    return {
      ok: false,
      error: 'Maalesef kontenjan doldu.',
      code: 'CAPACITY_FULL',
    }
  }

  if (mission.event_date) {
    const eventTime = new Date(mission.event_date).getTime()
    if (!Number.isNaN(eventTime) && eventTime < Date.now()) {
      return {
        ok: false,
        error: 'Bu görevin tarihi geçmiş.',
        code: 'MISSION_EXPIRED',
      }
    }
  }

  // 2. Üyelik kontrolü — sadece access_level='members_only' missions için
  // BUG-021 fix: ADR-008 passthrough mode (public missions) üyelik gerektirmez.
  // Mission detail UI "Tek seferlik — üye olmana gerek yok" copy ile align.
  if (mission.ngo_id && mission.access_level === 'members_only') {
    const { data: membership } = await supabase
      .from('ngo_memberships')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('ngo_id', mission.ngo_id)
      .eq('status', 'active')
      .maybeSingle()

    if (!membership) {
      return {
        ok: false,
        error: 'Bu göreve katılmak için önce gönüllü olman gerek.',
        code: 'REQUIRES_MEMBERSHIP',
      }
    }
  }

  // 3. user_missions.insert — unique constraint protects against double-take
  const { data: userMissionData, error: insertErr } = await supabase
    .from('user_missions')
    .insert({
      user_id: user.id,
      mission_id: missionId,
      status: 'taken',
    })
    .select('id')
    .single()

  if (insertErr) {
    const code = translatePostgresError(insertErr)
    return {
      ok: false,
      error:
        code === 'ALREADY_TAKEN'
          ? 'Zaten bu görevi aldın.'
          : 'Görev alınamadı, tekrar dener misin?',
      code,
    }
  }

  revalidatePath(`/dashboard/missions/${missionId}`)
  revalidatePath('/dashboard/my-missions')
  return {
    ok: true,
    userMissionId: userMissionData.id,
  }
}

/* ─────────────────────────────────────────────────────────────
 *  completeMission — verifying → completed
 *  RACE CONDITION CHÖZÜMÜ: karma_transactions insert ÖNCE,
 *  sonra user_missions.status = 'completed'. Unique constraint
 *  `karma_transactions_mission_unique` idempotent'lik sağlar.
 * ───────────────────────────────────────────────────────────── */

export interface VerificationData {
  method: 'auto' | 'code' | 'photo' | 'qr'
  code_entered?: string
  photo_path?: string
  qr_scanned?: string
}

export async function completeMission(
  userMissionId: string,
  verification: VerificationData,
): Promise<ActionResult<{ karmaAwarded: number; missionId: string }>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Önce giriş yap.', code: 'AUTH_REQUIRED' }
  }

  // 1. user_mission + mission birlikte al
  const { data: userMissionData, error: umErr } = await supabase
    .from('user_missions')
    .select('id, user_id, mission_id, status, admin_review_status')
    .eq('id', userMissionId)
    .eq('user_id', user.id)
    .single()

  if (umErr || !userMissionData) {
    return {
      ok: false,
      error: 'Görev kaydı bulunamadı.',
      code: 'GENERIC',
    }
  }

  const userMission = userMissionData as Pick<
    UserMission,
    'id' | 'user_id' | 'mission_id' | 'status' | 'admin_review_status'
  >

  // Idempotent — zaten tamamlandıysa direkt success (Karma zaten verilmiştir)
  if (userMission.status === 'completed') {
    const { data: karmaRow } = await supabase
      .from('karma_transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('reference_id', userMission.mission_id)
      .eq('type', 'mission_complete')
      .maybeSingle()
    return {
      ok: true,
      karmaAwarded: karmaRow?.amount ?? 0,
      missionId: userMission.mission_id,
    }
  }

  if (userMission.status === 'cancelled') {
    return {
      ok: false,
      error: 'Bu görev iptal edilmiş.',
      code: 'MISSION_CANCELLED',
    }
  }

  // 2. Mission fetch — Karma miktarı + verify yöntemi doğrulama
  const { data: missionData, error: mErr } = await supabase
    .from('missions')
    .select('id, karma, verify_method, verify_code, title, status')
    .eq('id', userMission.mission_id)
    .single()

  if (mErr || !missionData) {
    return {
      ok: false,
      error: 'Görev bulunamadı.',
      code: 'GENERIC',
    }
  }

  const mission = missionData as Pick<
    Mission,
    'id' | 'karma' | 'verify_method' | 'verify_code' | 'title' | 'status'
  >

  if (mission.status === 'cancelled') {
    return {
      ok: false,
      error: 'Bu görev iptal edildi.',
      code: 'MISSION_CANCELLED',
    }
  }

  // 3. Verify data server-side validation (client'a güvenme)
  if (verification.method !== mission.verify_method) {
    return {
      ok: false,
      error: 'Doğrulama yöntemi uyumsuz.',
      code: 'GENERIC',
    }
  }

  if (mission.verify_method === 'code' || mission.verify_method === 'qr') {
    const submitted =
      verification.code_entered ?? verification.qr_scanned ?? ''
    const expected = mission.verify_code ?? ''
    if (!submitted || !codesMatch(submitted, expected)) {
      return {
        ok: false,
        error:
          mission.verify_method === 'qr'
            ? 'Geçersiz QR kod.'
            : 'Kod eşleşmedi.',
        code: mission.verify_method === 'qr' ? 'QR_INVALID' : 'CODE_INVALID',
      }
    }
  }

  if (mission.verify_method === 'photo' && !verification.photo_path) {
    return {
      ok: false,
      error: 'Fotoğraf eksik.',
      code: 'GENERIC',
    }
  }

  // 4. KARMA INSERT ÖNCE (idempotent koruma)
  const { error: karmaErr } = await supabase
    .from('karma_transactions')
    .insert({
      user_id: user.id,
      amount: mission.karma,
      type: 'mission_complete',
      reference_id: mission.id,
      description: `${mission.title} görevi tamamlandı`,
    })

  // 23505 — unique violation = zaten Karma verilmiş, idempotent
  if (karmaErr && karmaErr.code !== '23505') {
    return {
      ok: false,
      error: 'Karma kaydedilemedi. Destek ekibine ulaşabilirsin.',
      code: translatePostgresError(karmaErr),
    }
  }

  // 5. user_missions.status = 'completed'
  const { error: updateErr } = await supabase
    .from('user_missions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      verification_data: verification as unknown as Json,
      karma_awarded: mission.karma,
    })
    .eq('id', userMissionId)

  if (updateErr) {
    // Karma zaten insert edildi → kullanıcı Karma sahibi ama status update fail
    // Bu pek nadir bir durum — UI "retry" göster
    return {
      ok: false,
      error:
        'Görev tamamlandı fakat kayıt güncellenemedi. Bir dakika sonra tekrar dene.',
      code: 'GENERIC',
    }
  }

  revalidatePath(`/dashboard/missions/${mission.id}`)
  revalidatePath('/dashboard/my-missions')
  revalidatePath('/dashboard')

  return {
    ok: true,
    karmaAwarded: mission.karma,
    missionId: mission.id,
  }
}

/* ─────────────────────────────────────────────────────────────
 *  abandonMission — taken → cancelled (P1)
 * ───────────────────────────────────────────────────────────── */

export async function abandonMission(
  userMissionId: string,
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Önce giriş yap.', code: 'AUTH_REQUIRED' }
  }

  const { data: userMissionData } = await supabase
    .from('user_missions')
    .select('id, user_id, status, mission_id')
    .eq('id', userMissionId)
    .eq('user_id', user.id)
    .single()

  if (!userMissionData) {
    return { ok: false, error: 'Görev kaydı bulunamadı.', code: 'GENERIC' }
  }

  if (userMissionData.status !== 'taken') {
    return {
      ok: false,
      error: 'Bu görev alınmamış veya zaten tamamlanmış.',
      code: 'GENERIC',
    }
  }

  const { error } = await supabase
    .from('user_missions')
    .update({ status: 'cancelled' })
    .eq('id', userMissionId)

  if (error) {
    return {
      ok: false,
      error: 'Vazgeçme işlemi başarısız.',
      code: translatePostgresError(error),
    }
  }

  revalidatePath(`/dashboard/missions/${userMissionData.mission_id}`)
  revalidatePath('/dashboard/my-missions')
  return { ok: true }
}
