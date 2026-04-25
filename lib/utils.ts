import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mission tarihini TR empatik biçimde formatlar.
 *  - "Bugün, 25 Nisan"
 *  - "Yarın, 26 Nisan"
 *  - "Bu Pazar, 27 Nisan"            (2-7 gün)
 *  - "Önümüzdeki Perşembe, 4 Mayıs"  (8-14 gün)
 *  - "24 Mayıs"                      (15+ gün veya geçmiş)
 *
 * Backend'den gerçek `event_date` (Date | ISO string) geldiğinde
 * mission card'da `mission.date_label` yerine bu kullanılır.
 */
export function formatMissionDate(
  date: Date | string | number | null | undefined,
): string {
  if (date === null || date === undefined || date === '') return ''
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return ''

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / 86_400_000,
  )

  const dayName = d.toLocaleDateString('tr-TR', { weekday: 'long' })
  const dayMonth = d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
  })

  if (diffDays === 0) return `Bugün, ${dayMonth}`
  if (diffDays === 1) return `Yarın, ${dayMonth}`
  if (diffDays >= 2 && diffDays <= 7) return `Bu ${dayName}, ${dayMonth}`
  if (diffDays >= 8 && diffDays <= 14) return `Önümüzdeki ${dayName}, ${dayMonth}`
  return dayMonth
}
