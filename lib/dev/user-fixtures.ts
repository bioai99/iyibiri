// lib/dev/user-fixtures.ts
//
// Dev-only user fixture seeder — current auth user için her state'in örnek datasını
// yaratır ki mission detail FSM + membership akışı canlı test edilebilsin.
//
// Gerçek user ID gerekli (profiles.id = auth.users.id) → migration'la yapılamaz,
// runtime server action.
//
// Guard:
// - NODE_ENV !== 'production' VEYA
// - user.email `DEV_FIXTURE_ALLOWLIST` env'inde (virgülle ayrılı)
// - DEV_FIXTURES_ENABLED=1 env var'ı (ek ağ)
//
// Idempotent: tekrar çağrılabilir, upsert pattern.

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/supabase/types'

/* ─────────────────────────────────────────────────────────────
 *  Types
 * ───────────────────────────────────────────────────────────── */

export interface SeedReport {
  userId: string
  userEmail: string
  ngoMembershipsCreated: number
  userMissionsCreated: number
  karmaTransactionsCreated: number
  referralsCreated: number
  errors: string[]
  stateSummary: string[]
}

export type FixtureResult =
  | { ok: true; report: SeedReport }
  | { ok: false; error: string }

/* ─────────────────────────────────────────────────────────────
 *  Guard
 * ───────────────────────────────────────────────────────────── */

function isDevOrAllowlisted(userEmail: string | undefined): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  if (process.env.DEV_FIXTURES_ENABLED !== '1') return false
  const allow = (process.env.DEV_FIXTURE_ALLOWLIST ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  if (!userEmail) return false
  return allow.includes(userEmail.toLowerCase())
}

/* ─────────────────────────────────────────────────────────────
 *  Public: seedUserFixtures
 *
 *  Oluşturur:
 *   - 3 ngo_membership aktif (TEMA + HAYTAP + TEGV)
 *   - 4 user_missions: taken + completed (karma alınmış) + failed_verification + cancelled
 *   - completed mission için karma_transactions +80
 *   - 1 referral row (TEMA üyelik geçmişi)
 * ───────────────────────────────────────────────────────────── */

export async function seedUserFixtures(): Promise<FixtureResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'Önce giriş yap.' }
  if (!isDevOrAllowlisted(user.email)) {
    return {
      ok: false,
      error: 'Bu özellik sadece dev ortamda veya yetkili hesaplarda aktif.',
    }
  }

  const report: SeedReport = {
    userId: user.id,
    userEmail: user.email ?? '',
    ngoMembershipsCreated: 0,
    userMissionsCreated: 0,
    karmaTransactionsCreated: 0,
    referralsCreated: 0,
    errors: [],
    stateSummary: [],
  }

  // 0. Profile'ın var olduğundan emin ol (trigger zaten yapmış olmalı)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile) {
    return {
      ok: false,
      error: 'Profil bulunamadı — lütfen signup akışını tamamla.',
    }
  }

  // 1. Missions + NGOs lookup — migration 014 apply edilmiş olmalı
  const requiredMissionIds = [
    'm-tema-fidan',
    'm-tegv-okuma',
    'm-haytap-mama',
    'm-online-digital-literacy',
    'm-losev-kan',
  ]
  const { data: missions } = await supabase
    .from('missions')
    .select('id, ngo_id, karma, title')
    .in('id', requiredMissionIds)

  const missionMap = new Map(
    (missions ?? []).map((m) => [m.id, m] as const),
  )

  if (missionMap.size < 4) {
    report.errors.push(
      `Migration 014 seed eksik görünüyor (${missionMap.size}/5 görev bulundu). Önce migration 014 apply et.`,
    )
  }

  // 2. ngo_memberships — 3 aktif üyelik
  for (const ngoId of ['tema', 'haytap', 'tegv']) {
    const { error } = await supabase
      .from('ngo_memberships')
      .upsert(
        {
          user_id: user.id,
          ngo_id: ngoId,
          status: 'active',
          tier: 'basic',
        },
        { onConflict: 'user_id,ngo_id' },
      )
    if (error) {
      report.errors.push(`ngo_memberships ${ngoId}: ${error.message}`)
    } else {
      report.ngoMembershipsCreated++
      report.stateSummary.push(`🟢 ${ngoId} üye (active)`)
    }
  }

  // 3. user_missions — 4 farklı state

  // 3a. TAKEN state — TEMA fidan, henüz tamamlanmamış
  const takenMission = missionMap.get('m-tema-fidan')
  if (takenMission) {
    const { error } = await supabase
      .from('user_missions')
      .upsert(
        {
          user_id: user.id,
          mission_id: takenMission.id,
          status: 'taken',
          admin_review_status: 'auto_approved',
        },
        { onConflict: 'user_id,mission_id' },
      )
    if (error) {
      report.errors.push(`taken ${takenMission.id}: ${error.message}`)
    } else {
      report.userMissionsCreated++
      report.stateSummary.push(
        `🟡 ${takenMission.title} (TAKEN — /missions/${takenMission.id})`,
      )
    }
  }

  // 3b. COMPLETED state — TEGV okuma, karma +100 verilmiş
  const completedMission = missionMap.get('m-tegv-okuma')
  if (completedMission) {
    // Önce karma transaction (idempotent unique constraint koruması var)
    const { error: karmaErr } = await supabase
      .from('karma_transactions')
      .insert({
        user_id: user.id,
        amount: completedMission.karma,
        type: 'mission_complete',
        reference_id: completedMission.id,
        description: `${completedMission.title} görevi tamamlandı`,
      })
    if (karmaErr && karmaErr.code !== '23505') {
      report.errors.push(`karma ${completedMission.id}: ${karmaErr.message}`)
    } else if (!karmaErr) {
      report.karmaTransactionsCreated++
    }

    const { error: umErr } = await supabase
      .from('user_missions')
      .upsert(
        {
          user_id: user.id,
          mission_id: completedMission.id,
          status: 'completed',
          completed_at: new Date().toISOString(),
          verification_data: {
            method: 'code',
            code_entered: 'OKUMA2026',
          } as unknown as Json,
          karma_awarded: completedMission.karma,
          admin_review_status: 'auto_approved',
        },
        { onConflict: 'user_id,mission_id' },
      )
    if (umErr) {
      report.errors.push(`completed ${completedMission.id}: ${umErr.message}`)
    } else {
      report.userMissionsCreated++
      report.stateSummary.push(
        `🟢 ${completedMission.title} (COMPLETED +${completedMission.karma} Karma)`,
      )
    }
  }

  // 3c. FAILED_VERIFICATION — HAYTAP mama, admin reddetti
  const failedMission = missionMap.get('m-haytap-mama')
  if (failedMission) {
    const { error } = await supabase
      .from('user_missions')
      .upsert(
        {
          user_id: user.id,
          mission_id: failedMission.id,
          status: 'taken',
          admin_review_status: 'rejected',
          admin_feedback:
            'Fotoğraf çok karanlık — sokak hayvanlarının yüzleri görünmüyor, ışık iyi olan bir fotoğraf gönderebilir misin?',
          verification_data: {
            method: 'photo',
            photo_path: 'dev/failed-sample.jpg',
          } as unknown as Json,
        },
        { onConflict: 'user_id,mission_id' },
      )
    if (error) {
      report.errors.push(`failed ${failedMission.id}: ${error.message}`)
    } else {
      report.userMissionsCreated++
      report.stateSummary.push(
        `🔴 ${failedMission.title} (FAILED_VERIFICATION)`,
      )
    }
  }

  // 3d. CANCELLED — platform görevi, kullanıcı vazgeçmiş
  const cancelledMission = missionMap.get('m-online-digital-literacy')
  if (cancelledMission) {
    const { error } = await supabase
      .from('user_missions')
      .upsert(
        {
          user_id: user.id,
          mission_id: cancelledMission.id,
          status: 'cancelled',
          admin_review_status: 'auto_approved',
        },
        { onConflict: 'user_id,mission_id' },
      )
    if (error) {
      report.errors.push(`cancelled ${cancelledMission.id}: ${error.message}`)
    } else {
      report.userMissionsCreated++
      report.stateSummary.push(
        `⚫ ${cancelledMission.title} (CANCELLED — kullanıcı vazgeçti)`,
      )
    }
  }

  // 4. Referral örneği — TEMA üyelik geçmişi
  const { error: refErr } = await supabase
    .from('referrals')
    .insert({
      user_id: user.id,
      ngo_id: 'tema',
      referral_type: 'membership',
      amount_try: 256,
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      metadata: {
        tier_id: 'yetiskin',
        dev_fixture: true,
      } as unknown as Json,
    })

  if (refErr && refErr.code !== '23505') {
    report.errors.push(`referral tema: ${refErr.message}`)
  } else if (!refErr) {
    report.referralsCreated++
  }

  // 5. Revalidate ilgili path'ler
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/missions')
  revalidatePath('/dashboard/my-missions')
  revalidatePath('/dashboard/profile')

  return { ok: true, report }
}

/* ─────────────────────────────────────────────────────────────
 *  Public: clearUserFixtures — temizleme (sadece current user için)
 * ───────────────────────────────────────────────────────────── */

export async function clearUserFixtures(): Promise<FixtureResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Önce giriş yap.' }
  if (!isDevOrAllowlisted(user.email)) {
    return { ok: false, error: 'Bu özellik yetkili değil.' }
  }

  const fixtureMissionIds = [
    'm-tema-fidan',
    'm-tegv-okuma',
    'm-haytap-mama',
    'm-online-digital-literacy',
  ]

  // Karma transactions → mission_complete type, fixture mission'lara ait
  await supabase
    .from('karma_transactions')
    .delete()
    .eq('user_id', user.id)
    .in('reference_id', fixtureMissionIds)

  // Karma_total trigger'la otomatik düşmez (trigger sadece insert'te artırıyor)
  // Manuel düşürme: toplamı yeniden hesapla
  const { data: remaining } = await supabase
    .from('karma_transactions')
    .select('amount')
    .eq('user_id', user.id)
  const recalc = (remaining ?? []).reduce((s, r) => s + (r.amount ?? 0), 0)
  await supabase
    .from('profiles')
    .update({ karma_total: recalc })
    .eq('id', user.id)

  await supabase
    .from('user_missions')
    .delete()
    .eq('user_id', user.id)
    .in('mission_id', fixtureMissionIds)

  await supabase
    .from('ngo_memberships')
    .delete()
    .eq('user_id', user.id)
    .in('ngo_id', ['tema', 'haytap', 'tegv'])

  await supabase
    .from('referrals')
    .delete()
    .eq('user_id', user.id)
    .contains('metadata', { dev_fixture: true })

  revalidatePath('/dashboard')

  return {
    ok: true,
    report: {
      userId: user.id,
      userEmail: user.email ?? '',
      ngoMembershipsCreated: 0,
      userMissionsCreated: 0,
      karmaTransactionsCreated: 0,
      referralsCreated: 0,
      errors: [],
      stateSummary: ['🧹 Fixture verileri temizlendi'],
    },
  }
}
