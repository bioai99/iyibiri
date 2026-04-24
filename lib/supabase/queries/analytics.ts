// lib/supabase/queries/analytics.ts
// WS-01: MAKE + secondary analytics queries
// Kullanım: admin dashboard + weekly report
// 2026-04-24 — supabase-backend

import { createClient as createServerClient } from '@/lib/supabase/server'

export type MakeMonthlyRow = {
  month: string
  make_count: number
  total_mission_completions: number
  total_karma_awarded: number
}

export type MakeRolling30dRow = {
  make_count: number
  total_mission_completions: number
  window_start: string
  window_end: string
}

export type KarmaPerMakeRow = {
  month: string
  make_count: number
  total_karma: number
  avg_karma_per_make: number
}

export type W4RetentionRow = {
  cohort_month: string
  cohort_size: number
  retained_w4: number
  w4_retention_pct: number
}

/**
 * Son 12 ayın Aylık Karma Kazanan Kullanıcı (MAKE) serisi
 * View: public.make_monthly
 */
export async function getMakeMonthly(): Promise<MakeMonthlyRow[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('make_monthly')
    .select('*')
    .limit(12)
  if (error) {
    console.error('getMakeMonthly error:', error)
    throw error
  }
  return data ?? []
}

/**
 * Son 30 günün kayan MAKE sayısı (güncel snapshot)
 * View: public.make_rolling_30d
 */
export async function getMakeRolling30d(): Promise<MakeRolling30dRow | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('make_rolling_30d')
    .select('*')
    .maybeSingle()
  if (error) {
    console.error('getMakeRolling30d error:', error)
    throw error
  }
  return data
}

/**
 * Aylık MAKE başına ortalama Karma — engagement derinliği
 * View: public.karma_per_make
 */
export async function getKarmaPerMake(): Promise<KarmaPerMakeRow[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('karma_per_make')
    .select('*')
    .limit(6)
  if (error) {
    console.error('getKarmaPerMake error:', error)
    throw error
  }
  return data ?? []
}

/**
 * Cohort bazlı W4 retention — kayıt ayına göre 4. hafta retention yüzdesi
 * View: public.w4_retention_cohort
 */
export async function getW4Retention(): Promise<W4RetentionRow[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('w4_retention_cohort')
    .select('*')
    .limit(6)
  if (error) {
    console.error('getW4Retention error:', error)
    throw error
  }
  return data ?? []
}

/**
 * Onboarding activation — kayıt → ilk görev süresi (dakika/saat bazlı)
 * View: public.first_mission_time
 */
export async function getFirstMissionTimeStats() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('first_mission_time')
    .select('hours_to_first_mission')
    .not('hours_to_first_mission', 'is', null)
  if (error) {
    console.error('getFirstMissionTimeStats error:', error)
    throw error
  }

  const rows = data ?? []
  if (rows.length === 0) {
    return { medianHours: null, p25Hours: null, p75Hours: null, sampleSize: 0 }
  }

  const sorted = rows.map(r => Number(r.hours_to_first_mission)).sort((a, b) => a - b)
  const q = (p: number) => sorted[Math.floor(sorted.length * p)]

  return {
    medianHours: Math.round(q(0.5) * 10) / 10,
    p25Hours: Math.round(q(0.25) * 10) / 10,
    p75Hours: Math.round(q(0.75) * 10) / 10,
    sampleSize: sorted.length,
  }
}
