// Vol-42 (2026-05-02): Ortak TR etiket helper'ı.
//
// Önceden 6+ farklı dosyada local DOMAIN/CATEGORY/CAUSE label map'leri vardı —
// admin/missions, mission-detail, posts-rail, ngo-list-card, featured-card,
// devtools/requests, vs. Birinde "nature" → "Doğa" varken başkasında
// "environment" → "Çevre" gibi tutarsızlıklar oluşuyordu, ya da etiket
// tamamen unutulup "nature" English string user'a sızıyordu.
//
// Bu dosya tek doğruluk kaynağı — yeni alan eklendiğinde sadece burası
// güncellenir. `getCauseLabel(key)` map + capitalize fallback ile
// güvenli render sağlar.

/**
 * Mission/NGO/Campaign için cause/domain/category birleşik etiket sözlüğü.
 *
 * Zaman içinde 3 farklı alan adı kullanıldı:
 *  - mission.category (admin/missions: nature, education, ...)
 *  - mission.domain (mission-card: nature, education, ...)
 *  - ngo.category / campaign.cause (donate: env, edu, animal, health, ...)
 *  - posts.category (article, update, story, tip — bu farklı semantik)
 *
 * Her iki kısa form (env/edu/animal) ve tam form (environment/education/animals)
 * burada listelenir; lookup case-insensitive trim'lenir.
 */
export const CAUSE_LABELS_TR: Record<string, string> = {
  // Doğa & Çevre
  nature: 'Doğa',
  environment: 'Çevre',
  env: 'Çevre',

  // Eğitim
  education: 'Eğitim',
  edu: 'Eğitim',

  // Sağlık
  health: 'Sağlık',

  // Hayvanlar
  animals: 'Hayvanlar',
  animal: 'Hayvanlar',

  // Çocuklar
  child: 'Çocuk',
  children: 'Çocuk',

  // Sosyal & Topluluk
  social: 'Sosyal',
  community: 'Topluluk',

  // Kriz & Afet
  crisis: 'Afet',
  disaster: 'Afet',

  // Kültür
  culture: 'Kültür',

  // Finans
  financial: 'Finans',
  finance: 'Finans',
}

/**
 * `key` için TR etiket — map'te yoksa orijinal değeri capitalize ederek döner.
 * `null` / `undefined` / boş string için boş döner.
 */
export function getCauseLabel(
  key: string | null | undefined,
  fallbackToOriginal = true,
): string {
  if (!key) return ''
  const k = key.trim().toLowerCase()
  if (!k) return ''
  const mapped = CAUSE_LABELS_TR[k]
  if (mapped) return mapped
  if (!fallbackToOriginal) return ''
  // Capitalize fallback: "foo" → "Foo"
  return k.charAt(0).toUpperCase() + k.slice(1)
}

/**
 * Posts için kategori etiketi — article/update/story/tip semantik'i ayrı.
 */
export const POST_CATEGORY_LABELS_TR: Record<string, string> = {
  article: 'Makale',
  update: 'Güncelleme',
  story: 'Hikaye',
  tip: 'İpucu',
}

export function getPostCategoryLabel(
  key: string | null | undefined,
): string {
  if (!key) return ''
  const k = key.trim().toLowerCase()
  return POST_CATEGORY_LABELS_TR[k] ?? ''
}

/**
 * Mission status (P0 öncelik için).
 */
export const MISSION_STATUS_LABELS_TR: Record<string, string> = {
  draft: 'Taslak',
  published: 'Yayında',
  archived: 'Arşivde',
  active: 'Aktif',
  completed: 'Tamamlandı',
  taken: 'Alındı',
}

export function getMissionStatusLabel(
  key: string | null | undefined,
): string {
  if (!key) return ''
  return MISSION_STATUS_LABELS_TR[key.trim().toLowerCase()] ?? key
}

/**
 * Difficulty etiketleri (mission detail'de kullanılır).
 */
export const DIFFICULTY_LABELS_TR: Record<string, string> = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
}

export function getDifficultyLabel(
  key: string | null | undefined,
): string {
  if (!key) return ''
  return DIFFICULTY_LABELS_TR[key.trim().toLowerCase()] ?? key
}
