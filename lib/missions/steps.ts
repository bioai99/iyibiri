import type { Json } from '@/lib/supabase/types'

/**
 * Vol-63: missions.steps JSONB şeması.
 *
 * DB'de `steps` kolonu bugüne kadar boş `[]` tutuldu (014 seed'leri).
 * Bu modül alanı ilk kez canlıya alır: görev detayında "yolculuk"
 * timeline'ı olarak render edilir (bkz. components/mission/mission-journey.tsx).
 *
 * Desteklenen iki biçim:
 *  1) Düz dizi (legacy):        `[{ icon, title, description }, ...]`
 *  2) Başlıklı obje (tercih):   `{ title: 'Dilek Yolculuğu', steps: [...] }`
 *
 * Bilinmeyen/bozuk veri sessizce boş listeye düşer — detay sayfası
 * journey bölümünü hiç göstermez (fail-safe, ADR-015 zod'suz hafif parse).
 */

export interface MissionStep {
  /** İkon anahtarı — components/mission/mission-journey.tsx STEP_ICONS map'i. Bilinmeyen anahtar → 'star'. */
  icon: string
  title: string
  description: string
}

export interface MissionJourneyData {
  /** Bölüm başlığı (eyebrow). Verilmezse component default'u kullanılır. */
  title: string | null
  steps: MissionStep[]
}

function parseStep(raw: unknown): MissionStep | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null
  const o = raw as Record<string, unknown>
  const title = typeof o.title === 'string' ? o.title.trim() : ''
  if (!title) return null
  return {
    title,
    description: typeof o.description === 'string' ? o.description : '',
    icon: typeof o.icon === 'string' && o.icon ? o.icon : 'star',
  }
}

export function parseMissionJourney(json: Json | null | undefined): MissionJourneyData {
  const empty: MissionJourneyData = { title: null, steps: [] }
  if (json == null) return empty

  // Biçim 2: { title?, steps: [...] }
  if (typeof json === 'object' && !Array.isArray(json)) {
    const o = json as Record<string, unknown>
    if (!Array.isArray(o.steps)) return empty
    return {
      title: typeof o.title === 'string' && o.title.trim() ? o.title.trim() : null,
      steps: o.steps.map(parseStep).filter((s): s is MissionStep => s !== null),
    }
  }

  // Biçim 1: düz dizi
  if (Array.isArray(json)) {
    return {
      title: null,
      steps: json.map(parseStep).filter((s): s is MissionStep => s !== null),
    }
  }

  return empty
}
