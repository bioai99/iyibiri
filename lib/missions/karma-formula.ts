// lib/missions/karma-formula.ts
//
// Platform-controlled Karma hesaplama (ADR-011, Q7 kararı).
// STK admin görev oluştururken domain + difficulty + duration seçer,
// platform Karma önerir. STK **override edebilir V1'de** (grandfather),
// V1.1'de formül zorunlu olacak.
//
// Formula:
//   base_karma      = {easy: 30, medium: 60, hard: 100}[difficulty]
//   domain_mult     = domain bazlı çarpan (emergency 1.5, health 1.3, ...)
//   duration_factor = süre bazlı çarpan (mikro 0.3×, kısa 0.7×, standart 1×, uzun 1.4×, tam gün 1.8×)
//   karma           = round(base_karma × domain_mult × duration_factor)
//
// Kalibrasyon: pilot 6 ayında veri toplanıp multipliers tune edilir. V1.1 tuned.

import type { Mission } from '@/lib/supabase/types'

export type MissionDomain = NonNullable<Mission['domain']>
export type MissionDifficulty = NonNullable<Mission['difficulty']>

/* ─────────────────────────────────────────────────────────────
 *  Multipliers (V1 baseline — Mayıs 2026)
 * ───────────────────────────────────────────────────────────── */

const BASE_KARMA: Record<MissionDifficulty, number> = {
  easy: 30,
  medium: 60,
  hard: 100,
}

const DOMAIN_MULTIPLIER: Record<MissionDomain, number> = {
  nature: 1.0,
  education: 1.0,
  social: 1.0,
  health: 1.3, // kan bağışı, sağlık taraması — yüksek etki
  animals: 1.1, // sokak hayvanı / barınak
  arts: 0.9, // kültür, müze — düşük etki ama tecrübeli gönüllü
  sports: 0.9, // sportif bağış (maratonla bağış vb.)
  advocacy: 1.0, // savunuculuk, imza kampanyası
  economic: 1.0, // istihdam / mentor
  emergency: 1.5, // afet müdahalesi — en yüksek multiplier
}

/**
 * Duration string → factor. Basit keyword tabanlı parser — V1 için yeterli.
 * "15 dakika" → 0.3, "2 saat" → 1.0, "5 saat" → 1.4, "tam gün" → 1.8
 */
function parseDurationFactor(duration: string | null | undefined): number {
  if (!duration) return 1.0
  const d = duration.toLowerCase().trim()

  // Mikro (< 30 dk)
  if (/\b(mikro|dakika|dk)\b/.test(d)) {
    const minMatch = d.match(/(\d+)\s*(dk|dakika)/)
    if (minMatch) {
      const mins = Number(minMatch[1])
      if (mins < 30) return 0.3
      if (mins < 60) return 0.5
    }
    return 0.3
  }

  // Saat bazlı
  const hourMatch = d.match(/(\d+)\s*saat/)
  if (hourMatch) {
    const hours = Number(hourMatch[1])
    if (hours <= 1) return 0.7
    if (hours <= 3) return 1.0
    if (hours <= 5) return 1.4
    return 1.8 // 6+ saat
  }

  // Kelimeler
  if (/tam\s*gün|full\s*day/.test(d)) return 1.8
  if (/yarım\s*gün|half\s*day/.test(d)) return 1.4
  if (/kısa|short/.test(d)) return 0.5
  if (/uzun|long/.test(d)) return 1.4

  // Esnek / belirsiz
  return 1.0
}

/* ─────────────────────────────────────────────────────────────
 *  Public: computeKarma
 * ───────────────────────────────────────────────────────────── */

export interface KarmaInput {
  domain: MissionDomain | null | undefined
  difficulty: MissionDifficulty | null | undefined
  duration: string | null | undefined
}

export interface KarmaBreakdown {
  karma: number
  baseKarma: number
  domainMultiplier: number
  durationFactor: number
  formula: string
  warnings: string[]
}

/**
 * Önerilen Karma'yı hesapla + breakdown (UI'da STK admin'e göstermek için).
 * Grandfather durumlarda (domain null vs.) makul default'lar döner.
 */
export function computeKarma(input: KarmaInput): KarmaBreakdown {
  const warnings: string[] = []

  const difficulty: MissionDifficulty = input.difficulty ?? 'medium'
  if (!input.difficulty) warnings.push('Difficulty belirtilmemiş, "medium" varsayıldı')

  const domain: MissionDomain = input.domain ?? 'social'
  if (!input.domain) warnings.push('Domain belirtilmemiş, "social" varsayıldı')

  const baseKarma = BASE_KARMA[difficulty]
  const domainMultiplier = DOMAIN_MULTIPLIER[domain]
  const durationFactor = parseDurationFactor(input.duration)

  if (!input.duration) warnings.push('Süre belirtilmemiş, standart faktör 1.0 kullanıldı')

  const karma = Math.round(baseKarma * domainMultiplier * durationFactor)

  const formula = `${baseKarma} × ${domainMultiplier} (${domain}) × ${durationFactor.toFixed(1)} (süre) = ${karma}`

  return { karma, baseKarma, domainMultiplier, durationFactor, formula, warnings }
}

/* ─────────────────────────────────────────────────────────────
 *  Helper: domain Turkish labels
 * ───────────────────────────────────────────────────────────── */

export const DOMAIN_TR_LABELS: Record<MissionDomain, string> = {
  nature: 'Doğa / Çevre',
  education: 'Eğitim',
  social: 'Sosyal / Topluluk',
  health: 'Sağlık',
  animals: 'Hayvanlar',
  arts: 'Sanat / Kültür',
  sports: 'Spor / Aktif',
  advocacy: 'Savunuculuk',
  economic: 'Ekonomik / Geçim',
  emergency: 'Acil Durum / Afet',
}

export function domainLabel(domain: MissionDomain | null | undefined): string {
  if (!domain) return 'Genel'
  return DOMAIN_TR_LABELS[domain]
}
