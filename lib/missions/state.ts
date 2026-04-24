// lib/missions/state.ts
//
// Mission detail state machine — P0 #3.
// UI Spec 2026-04-24 Bölüm 2 — 9 state FSM.
// UX audit K1 — "state-makinesiz 3 client" sorununu çözen tek source of truth.
//
// Client-safe: no Supabase import. page.tsx ve client component'ler deriveState çağırır.

import type { Mission, UserMission } from '@/lib/supabase/types'

/* ─────────────────────────────────────────────────────────────
 *  State enum + input shape
 * ───────────────────────────────────────────────────────────── */

export type MissionState =
  | 'idle'
  | 'full'
  | 'expired'
  | 'requires_membership'
  | 'taken'
  | 'verifying'
  | 'completed'
  | 'failed_verification'
  | 'cancelled'

export interface DeriveStateInput {
  mission: Mission
  userMission: UserMission | null
  isMember: boolean
  /** UI "şu an verify sayfasındayız" bilgisi — page.tsx `/complete` route'unda true */
  isOnCompleteRoute?: boolean
  now?: Date
}

/* ─────────────────────────────────────────────────────────────
 *  Ana derive fonksiyonu
 *  Öncelik sırası KRİTİK — audit K1 + UI spec Bölüm 2.2.
 * ───────────────────────────────────────────────────────────── */

export function deriveMissionState(input: DeriveStateInput): MissionState {
  const { mission, userMission, isMember, isOnCompleteRoute = false } = input
  const now = input.now ?? new Date()

  // 1. Admin iptal etti — her şeyin üstünde (ngo_memberships hariç)
  if (mission.status === 'cancelled') return 'cancelled'

  // 2. User mission'ın terminal state'leri
  if (userMission?.status === 'cancelled') return 'cancelled'
  if (userMission?.status === 'completed') return 'completed'

  // 3. Admin reddetti — failed_verification (status hâlâ 'taken' olur)
  if (
    userMission?.status === 'taken' &&
    userMission.admin_review_status === 'rejected'
  ) {
    return 'failed_verification'
  }

  // 4. Aktif alım — taken veya verifying
  if (userMission?.status === 'taken') {
    return isOnCompleteRoute ? 'verifying' : 'taken'
  }

  // 5. Henüz alınmamış — ama alınabilir mi?

  // 5a. Full kontenjan
  if (typeof mission.spots_left === 'number' && mission.spots_left <= 0) {
    return 'full'
  }

  // 5b. Tarih geçti (event_date varsa structured kontrol)
  if (mission.event_date) {
    const eventTime = new Date(mission.event_date).getTime()
    if (!Number.isNaN(eventTime) && eventTime < now.getTime()) {
      return 'expired'
    }
  }

  // 5c. STK üyeliği yoksa — requires_membership
  // Migration 015 Yol D: sadece access_level='members_only' görevlerde üyelik zorunlu.
  // access_level='public' görevleri üye olmayanlar da alabilir (hafif KVKK ile).
  // (mission.ngo_id null ise — platform-level görev — üyelik hiç aranmaz)
  if (
    mission.ngo_id &&
    mission.access_level === 'members_only' &&
    !isMember
  ) {
    return 'requires_membership'
  }

  // 6. Default — keşif
  return 'idle'
}

/* ─────────────────────────────────────────────────────────────
 *  State metadata — UI için grouping + copy helpers
 * ───────────────────────────────────────────────────────────── */

export interface StateMetadata {
  /** Kullanıcı bir şey yapabilir mi (primary CTA active) */
  isActionable: boolean
  /** Terminal state — değişmez (completed, cancelled) */
  isTerminal: boolean
  /** Kullanıcının görev üzerinde hak sahibi olduğu */
  isOwned: boolean
  /** CTA label — default TR string */
  primaryCtaLabel: string
}

export function getStateMetadata(state: MissionState): StateMetadata {
  switch (state) {
    case 'idle':
      return {
        isActionable: true,
        isTerminal: false,
        isOwned: false,
        primaryCtaLabel: 'Bu göreve katıl',
      }
    case 'full':
      return {
        isActionable: false,
        isTerminal: false,
        isOwned: false,
        primaryCtaLabel: 'Kontenjan doldu',
      }
    case 'expired':
      return {
        isActionable: false,
        isTerminal: true,
        isOwned: false,
        primaryCtaLabel: 'Tarih geçti',
      }
    case 'requires_membership':
      return {
        isActionable: true,
        isTerminal: false,
        isOwned: false,
        primaryCtaLabel: 'Önce gönüllü ol',
      }
    case 'taken':
      return {
        isActionable: true,
        isTerminal: false,
        isOwned: true,
        primaryCtaLabel: 'Tamamladım',
      }
    case 'verifying':
      return {
        isActionable: true,
        isTerminal: false,
        isOwned: true,
        primaryCtaLabel: 'Doğrula',
      }
    case 'completed':
      return {
        isActionable: false,
        isTerminal: true,
        isOwned: true,
        primaryCtaLabel: 'Tamamlandı',
      }
    case 'failed_verification':
      return {
        isActionable: true,
        isTerminal: false,
        isOwned: true,
        primaryCtaLabel: 'Yeniden gönder',
      }
    case 'cancelled':
      return {
        isActionable: false,
        isTerminal: true,
        isOwned: false,
        primaryCtaLabel: 'İptal edildi',
      }
  }
}

/* ─────────────────────────────────────────────────────────────
 *  Turkish string helpers — two flavors
 *  UX audit K5 — `i/İ` keyboard × print bug koruması.
 *
 *  1) trSafeUpper — TR metinler için (ör. "İstanbul" vs "istanbul")
 *     `.toLocaleUpperCase('tr-TR')` — dotted i koruması.
 *  2) normalizeVerificationCode — Kodlar için (ASCII alphanumeric)
 *     Default locale + Turkish İ/ı → I (print vs keyboard bug).
 * ───────────────────────────────────────────────────────────── */

/** TR text semantics — "İstanbul" ≡ "istanbul". */
export function trSafeUpper(s: string): string {
  return s.trim().toLocaleUpperCase('tr-TR')
}

/**
 * Verification kodları için loose normalize. Kodlar ASCII (ör. "FIDAN2026")
 * ama kullanıcı Turkish keyboard'dan 'i' yazarsa TR locale uppercase 'İ'
 * üretir — baskıdaki 'I' ile eşleşmez. Bu fonksiyon İ/ı → I çevirir.
 */
export function normalizeVerificationCode(s: string): string {
  return s
    .trim()
    .toUpperCase() // default locale — 'i' → 'I', 'I' → 'I'
    .replace(/İ/g, 'I')
    .replace(/ı/g, 'I')
}

export function codesMatch(a: string, b: string): boolean {
  return normalizeVerificationCode(a) === normalizeVerificationCode(b)
}

/* ─────────────────────────────────────────────────────────────
 *  Relative time helper — "3 gün sonra" / "2 saat önce"
 *  UX audit İ1 + journey adım 2.
 * ───────────────────────────────────────────────────────────── */

export function relativeTime(
  eventDate: string | null | undefined,
  now: Date = new Date(),
): string | null {
  if (!eventDate) return null
  const t = new Date(eventDate).getTime()
  if (Number.isNaN(t)) return null

  const diffMs = t - now.getTime()
  const absSec = Math.abs(diffMs) / 1000
  const absMin = absSec / 60
  const absHour = absMin / 60
  const absDay = absHour / 24

  const isPast = diffMs < 0
  const suffix = isPast ? 'önce' : 'sonra'

  if (absDay >= 1) {
    const d = Math.round(absDay)
    return `${d} gün ${suffix}`
  }
  if (absHour >= 1) {
    const h = Math.round(absHour)
    return `${h} saat ${suffix}`
  }
  if (absMin >= 1) {
    const m = Math.round(absMin)
    return `${m} dakika ${suffix}`
  }
  return isPast ? 'Az önce' : 'Birazdan'
}
