// lib/missions/__test__.ts
//
// Mission state machine unit tests.
// Çalıştırma: `npx tsx lib/missions/__test__.ts`
//
// Coverage:
// - deriveMissionState — 9 state × edge case matrix
// - codesMatch — TR locale i/İ bug koruması
// - relativeTime — "3 gün sonra" / "2 saat önce" formatı
// - getStateMetadata — her state için isActionable/isTerminal doğru
// - missionErrorMessage — her kod TR empathic mesaja map ediliyor

import {
  deriveMissionState,
  codesMatch,
  relativeTime,
  getStateMetadata,
  trSafeUpper,
  type MissionState,
} from './state'
import { missionErrorMessage, translatePostgresError } from './error-codes'
import { computeKarma, domainLabel } from './karma-formula'
import type { Mission, UserMission } from '@/lib/supabase/types'

let passed = 0
let failed = 0
const fail = (msg: string) => {
  failed++
  console.error('  ✗ ' + msg)
}
const ok = (msg: string) => {
  passed++
  console.log('  ✓ ' + msg)
}
const assert = (cond: unknown, msg: string) => (cond ? ok(msg) : fail(msg))
const eq = <T>(a: T, b: T, msg: string) =>
  assert(a === b, `${msg} — got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`)

/* ─────────────────────────────────────────────────────────────
 *  Helpers — mock builder
 * ───────────────────────────────────────────────────────────── */

function mockMission(overrides: Partial<Mission> = {}): Mission {
  return {
    id: 'm1',
    title: 'Test mission',
    description: null,
    long_description: null,
    ngo_id: 'tema',
    category: 'nature',
    difficulty: 'easy',
    karma: 50,
    duration: '2 saat',
    domain: 'nature',
    style: 'outside',
    verify_method: 'code',
    verify_code: 'FIDAN2026',
    verify_hint: null,
    featured: false,
    active: true,
    steps: [],
    impact_statement: null,
    qr_code_data: null,
    image_url: null,
    participants: 0,
    photo_url: null,
    location: null,
    date_label: null,
    spots_left: 10,
    status: 'active',
    event_date: null,
    prep_checklist: null,
    access_level: 'public',  // migration 015 default
    ...overrides,
  }
}

function mockUserMission(
  overrides: Partial<UserMission> = {},
): UserMission {
  return {
    id: 'um1',
    user_id: 'u1',
    mission_id: 'm1',
    status: 'taken',
    taken_at: new Date().toISOString(),
    completed_at: null,
    verification_data: null,
    karma_awarded: null,
    admin_review_status: 'auto_approved',
    admin_feedback: null,
    proof_type: null,
    proof_url: null,
    submitted_at: null,
    ...overrides,
  }
}

const FIXED_NOW = new Date('2026-04-24T10:00:00Z')

/* ─────────────────────────────────────────────────────────────
 *  1. deriveMissionState — 9 state coverage
 * ───────────────────────────────────────────────────────────── */

console.log('\n— deriveMissionState —')

// idle — üye + kontenjan var + tarih gelecek
eq(
  deriveMissionState({
    mission: mockMission(),
    userMission: null,
    isMember: true,
    now: FIXED_NOW,
  }),
  'idle',
  'idle — üye + kontenjan var + alınmamış',
)

// Yol D — access_level='members_only' + üye değil → requires_membership
eq(
  deriveMissionState({
    mission: mockMission({ access_level: 'members_only' }),
    userMission: null,
    isMember: false,
    now: FIXED_NOW,
  }),
  'requires_membership',
  'requires_membership — members_only görev + üye değil',
)

// Yol D — access_level='public' + üye değil → idle (yeni davranış)
eq(
  deriveMissionState({
    mission: mockMission({ access_level: 'public' }),
    userMission: null,
    isMember: false,
    now: FIXED_NOW,
  }),
  'idle',
  'idle — public görev üye olmasa da alınabilir (Yol D)',
)

// Yol D — access_level='members_only' + üye → idle (üyelikle unlock)
eq(
  deriveMissionState({
    mission: mockMission({ access_level: 'members_only' }),
    userMission: null,
    isMember: true,
    now: FIXED_NOW,
  }),
  'idle',
  'idle — members_only görev + üye',
)

// Platform görevi (ngo_id null) — üye olmak gerekmez (access_level önemsiz)
eq(
  deriveMissionState({
    mission: mockMission({ ngo_id: null, access_level: 'members_only' }),
    userMission: null,
    isMember: false,
    now: FIXED_NOW,
  }),
  'idle',
  'idle — platform görevi (ngo_id null) access_level değerine bakılmaz',
)

// full — spots_left 0
eq(
  deriveMissionState({
    mission: mockMission({ spots_left: 0 }),
    userMission: null,
    isMember: true,
    now: FIXED_NOW,
  }),
  'full',
  'full — spots_left 0',
)

// full — spots_left negatif (edge case)
eq(
  deriveMissionState({
    mission: mockMission({ spots_left: -1 }),
    userMission: null,
    isMember: true,
    now: FIXED_NOW,
  }),
  'full',
  'full — spots_left negatif defensive',
)

// expired — event_date geçmiş
eq(
  deriveMissionState({
    mission: mockMission({ event_date: '2026-04-20T10:00:00Z' }),
    userMission: null,
    isMember: true,
    now: FIXED_NOW,
  }),
  'expired',
  'expired — event_date 4 gün önce',
)

// idle — event_date gelecek
eq(
  deriveMissionState({
    mission: mockMission({ event_date: '2026-04-30T10:00:00Z' }),
    userMission: null,
    isMember: true,
    now: FIXED_NOW,
  }),
  'idle',
  'idle — event_date 6 gün sonra',
)

// taken
eq(
  deriveMissionState({
    mission: mockMission(),
    userMission: mockUserMission({ status: 'taken' }),
    isMember: true,
    now: FIXED_NOW,
  }),
  'taken',
  'taken — user_mission.status = taken',
)

// verifying — /complete route
eq(
  deriveMissionState({
    mission: mockMission(),
    userMission: mockUserMission({ status: 'taken' }),
    isMember: true,
    isOnCompleteRoute: true,
    now: FIXED_NOW,
  }),
  'verifying',
  'verifying — /complete route + taken',
)

// completed
eq(
  deriveMissionState({
    mission: mockMission(),
    userMission: mockUserMission({
      status: 'completed',
      completed_at: new Date().toISOString(),
    }),
    isMember: true,
    now: FIXED_NOW,
  }),
  'completed',
  'completed — user_mission.status = completed',
)

// failed_verification — admin rejected + hâlâ taken
eq(
  deriveMissionState({
    mission: mockMission(),
    userMission: mockUserMission({
      status: 'taken',
      admin_review_status: 'rejected',
      admin_feedback: 'Fotoğraf yetersiz',
    }),
    isMember: true,
    now: FIXED_NOW,
  }),
  'failed_verification',
  'failed_verification — admin rejected',
)

// cancelled — mission.status
eq(
  deriveMissionState({
    mission: mockMission({ status: 'cancelled' }),
    userMission: null,
    isMember: true,
    now: FIXED_NOW,
  }),
  'cancelled',
  'cancelled — mission.status = cancelled',
)

// cancelled — user_mission.status = cancelled
eq(
  deriveMissionState({
    mission: mockMission(),
    userMission: mockUserMission({ status: 'cancelled' }),
    isMember: true,
    now: FIXED_NOW,
  }),
  'cancelled',
  'cancelled — user_mission.status = cancelled (abandoned)',
)

// Priority order — completed + mission.cancelled → cancelled wins
eq(
  deriveMissionState({
    mission: mockMission({ status: 'cancelled' }),
    userMission: mockUserMission({ status: 'completed' }),
    isMember: true,
    now: FIXED_NOW,
  }),
  'cancelled',
  'priority — cancelled mission completed userMission uzerinde once geliyor',
)

// Priority order — failed_verification < cancelled
eq(
  deriveMissionState({
    mission: mockMission({ status: 'cancelled' }),
    userMission: mockUserMission({
      status: 'taken',
      admin_review_status: 'rejected',
    }),
    isMember: true,
    now: FIXED_NOW,
  }),
  'cancelled',
  'priority — cancelled failed_verification uzerinde once geliyor',
)

/* ─────────────────────────────────────────────────────────────
 *  2. codesMatch / trSafeUpper — TR locale bug
 * ───────────────────────────────────────────────────────────── */

console.log('\n— codesMatch TR locale —')

eq(codesMatch('FIDAN2026', 'fidan2026'), true, 'case-insensitive match')
eq(codesMatch('  FIDAN2026  ', 'fidan2026'), true, 'trim çalışıyor')
eq(codesMatch('FIDAN', 'FIDAN2026'), false, 'farklı uzunluk fail')

// TR locale 'i' → 'İ' (not 'I')
eq(trSafeUpper('iyibiri'), 'İYİBİRİ', 'trSafeUpper i→İ (TR)')
eq(trSafeUpper('IYIBIRI'), 'IYIBIRI', 'trSafeUpper I sabit')
eq(trSafeUpper('bahçe'), 'BAHÇE', 'trSafeUpper ç→Ç')
eq(trSafeUpper('İstanbul'), 'İSTANBUL', 'trSafeUpper İ→İ (sabit)')

eq(
  codesMatch('İstanbul', 'istanbul'),
  true,
  'TR-safe İ/i eşleşme — İstanbul vs istanbul',
)

/* ─────────────────────────────────────────────────────────────
 *  3. relativeTime
 * ───────────────────────────────────────────────────────────── */

console.log('\n— relativeTime —')

eq(relativeTime(null), null, 'null input → null')
eq(relativeTime(undefined), null, 'undefined input → null')
eq(relativeTime('invalid-date'), null, 'invalid date → null')

eq(
  relativeTime('2026-04-27T10:00:00Z', FIXED_NOW),
  '3 gün sonra',
  '3 gün sonra',
)
eq(
  relativeTime('2026-04-21T10:00:00Z', FIXED_NOW),
  '3 gün önce',
  '3 gün önce',
)
eq(
  relativeTime('2026-04-24T15:00:00Z', FIXED_NOW),
  '5 saat sonra',
  '5 saat sonra',
)
eq(
  relativeTime('2026-04-24T09:30:00Z', FIXED_NOW),
  '30 dakika önce',
  '30 dakika önce',
)

/* ─────────────────────────────────────────────────────────────
 *  4. getStateMetadata
 * ───────────────────────────────────────────────────────────── */

console.log('\n— getStateMetadata —')

const states: MissionState[] = [
  'idle',
  'full',
  'expired',
  'requires_membership',
  'taken',
  'verifying',
  'completed',
  'failed_verification',
  'cancelled',
]

for (const s of states) {
  const meta = getStateMetadata(s)
  assert(
    typeof meta.primaryCtaLabel === 'string' && meta.primaryCtaLabel.length > 0,
    `${s} — CTA label non-empty`,
  )
}

eq(getStateMetadata('completed').isTerminal, true, 'completed terminal')
eq(getStateMetadata('cancelled').isTerminal, true, 'cancelled terminal')
eq(getStateMetadata('expired').isTerminal, true, 'expired terminal')
eq(
  getStateMetadata('failed_verification').isActionable,
  true,
  'failed_verification actionable (yeniden gönder)',
)
eq(
  getStateMetadata('idle').isOwned,
  false,
  'idle isOwned false (henüz almadı)',
)
eq(
  getStateMetadata('taken').isOwned,
  true,
  'taken isOwned true',
)
eq(
  getStateMetadata('full').isActionable,
  false,
  'full isActionable false',
)

/* ─────────────────────────────────────────────────────────────
 *  5. Error code mapping
 * ───────────────────────────────────────────────────────────── */

console.log('\n— error codes —')

assert(
  missionErrorMessage('CAPACITY_FULL').includes('kontenjan'),
  'CAPACITY_FULL TR message',
)
assert(
  missionErrorMessage('CODE_INVALID_3X').includes('3 kez'),
  'CODE_INVALID_3X sayı içeriyor',
)
assert(
  missionErrorMessage(null).includes('ters'),
  'null → GENERIC fallback',
)
assert(
  missionErrorMessage(undefined).includes('ters'),
  'undefined → GENERIC fallback',
)

eq(
  translatePostgresError({ code: '23505' }),
  'ALREADY_TAKEN',
  '23505 → ALREADY_TAKEN',
)
eq(
  translatePostgresError({ code: 'PGRST116' }),
  'REQUIRES_MEMBERSHIP',
  'PGRST116 → REQUIRES_MEMBERSHIP',
)
eq(
  translatePostgresError({ message: 'Network request failed' }),
  'NETWORK',
  'Network message → NETWORK',
)
eq(
  translatePostgresError({ code: 'random' }),
  'GENERIC',
  'unknown → GENERIC',
)
eq(translatePostgresError(null), 'GENERIC', 'null → GENERIC')

/* ─────────────────────────────────────────────────────────────
 *  6. Karma Formula (ADR-011) — Q6/Q7/Q9 paketi
 * ───────────────────────────────────────────────────────────── */

console.log('\n— karma formula —')

// Base karma × domain multiplier × duration factor = rounded
// easy (30) × nature (1.0) × 2-3 saat (1.0) = 30
eq(
  computeKarma({ domain: 'nature', difficulty: 'easy', duration: '2 saat' }).karma,
  30,
  'nature easy 2 saat → 30',
)

// medium (60) × emergency (1.5) × 2-3 saat (1.0) = 90
eq(
  computeKarma({ domain: 'emergency', difficulty: 'medium', duration: '3 saat' }).karma,
  90,
  'emergency medium 3 saat → 90',
)

// hard (100) × health (1.3) × tam gün (1.8) = 234
eq(
  computeKarma({ domain: 'health', difficulty: 'hard', duration: 'tam gün' }).karma,
  234,
  'health hard tam gün → 234',
)

// easy (30) × arts (0.9) × 1 saat (0.7) = round(18.9) = 19
eq(
  computeKarma({ domain: 'arts', difficulty: 'easy', duration: '1 saat' }).karma,
  19,
  'arts easy 1 saat → 19',
)

// Duration factor parser
eq(
  computeKarma({ domain: 'social', difficulty: 'easy', duration: '15 dakika' }).karma,
  9,
  '15 dakika factor 0.3',
)
eq(
  computeKarma({ domain: 'social', difficulty: 'easy', duration: '5 saat' }).karma,
  42,
  '5 saat factor 1.4',
)

// Null/undefined handling
assert(
  computeKarma({ domain: null, difficulty: null, duration: null }).warnings.length >= 2,
  'null inputs generate warnings',
)

// Breakdown fields
const breakdown = computeKarma({
  domain: 'animals',
  difficulty: 'medium',
  duration: '3 saat',
})
assert(breakdown.baseKarma === 60, 'breakdown.baseKarma = 60 (medium)')
assert(breakdown.domainMultiplier === 1.1, 'breakdown.domainMultiplier = 1.1 (animals)')
assert(
  breakdown.formula.includes('animals'),
  'breakdown.formula contains domain name',
)

// Domain Turkish labels
assert(domainLabel('nature') === 'Doğa / Çevre', 'domainLabel nature TR')
assert(domainLabel('emergency') === 'Acil Durum / Afet', 'domainLabel emergency TR')
assert(domainLabel(null) === 'Genel', 'domainLabel null → Genel fallback')

/* ─────────────────────────────────────────────────────────────
 *  Sonuç
 * ───────────────────────────────────────────────────────────── */

console.log(`\n${'='.repeat(50)}`)
console.log(`PASSED: ${passed}  FAILED: ${failed}`)
if (failed > 0) {
  process.exit(1)
}
