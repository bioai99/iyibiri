// lib/missions/error-codes.ts
//
// Mission flow TR empathic error messages.
// UI Spec 2026-04-24 Bölüm 9 — 14 error code.
// UX audit K4 + N9 — "generic hata mesajlarını" somut & şefkatli TR'ye çevir.

export type MissionErrorCode =
  | 'CAPACITY_FULL'
  | 'MISSION_EXPIRED'
  | 'REQUIRES_MEMBERSHIP'
  | 'ALREADY_TAKEN'
  | 'NETWORK'
  | 'CODE_INVALID'
  | 'CODE_INVALID_3X'
  | 'PHOTO_TOO_LARGE'
  | 'PHOTO_INVALID_TYPE'
  | 'PHOTO_UPLOAD_FAILED'
  | 'QR_INVALID'
  | 'QR_NO_CAMERA'
  | 'MISSION_CANCELLED'
  | 'AUTH_REQUIRED'
  | 'GENERIC'

const MESSAGES: Record<MissionErrorCode, string> = {
  CAPACITY_FULL:
    'Maalesef kontenjan doldu. Benzer görevlere göz atar mısın?',
  MISSION_EXPIRED:
    'Bu görevin tarihi geçmiş. Önümüzdeki görevleri önerelim mi?',
  REQUIRES_MEMBERSHIP:
    'Bu göreve katılmak için önce STK gönüllüsü olman gerek.',
  ALREADY_TAKEN:
    'Zaten bu görevi aldın — "Görevlerim" sekmesinde bekliyor.',
  NETWORK:
    'İnternet bağlantın kesilmiş olabilir. Bir saniye sonra tekrar dener misin?',
  CODE_INVALID: 'Kod eşleşmedi. Büyük-küçük harfe dikkat.',
  CODE_INVALID_3X:
    '3 kez yanlış — yardıma ihtiyacın olursa STK ile iletişime geçebilirsin.',
  PHOTO_TOO_LARGE:
    'Fotoğrafın biraz büyük (5MB sınırı). Tekrar çekmek ister misin?',
  PHOTO_INVALID_TYPE:
    'Sadece JPG, PNG veya WEBP kabul ediyoruz.',
  PHOTO_UPLOAD_FAILED:
    'Fotoğraf gönderilemedi. İnternet bağlantını kontrol edip tekrar dene.',
  QR_INVALID: 'Bu QR başka bir göreve ait görünüyor.',
  QR_NO_CAMERA:
    'Kamera erişimi yok. Ayarlardan izin vermen gerek.',
  MISSION_CANCELLED:
    'Bu görev iptal edildi.',
  AUTH_REQUIRED: 'Önce giriş yapman gerek.',
  GENERIC: 'Bir şeyler ters gitti. Biraz sonra tekrar dener misin?',
}

export function missionErrorMessage(code?: MissionErrorCode | null): string {
  if (!code) return MESSAGES.GENERIC
  return MESSAGES[code] ?? MESSAGES.GENERIC
}

export function translatePostgresError(
  err: { code?: string; message?: string } | null | undefined,
): MissionErrorCode {
  if (!err) return 'GENERIC'
  // 23505 — unique violation (race → already taken / already karma'd)
  if (err.code === '23505') return 'ALREADY_TAKEN'
  // PGRST116 — RLS denial
  if (err.code === 'PGRST116') return 'REQUIRES_MEMBERSHIP'
  // Network hataları
  if (err.message?.toLowerCase().includes('network')) return 'NETWORK'
  if (err.message?.toLowerCase().includes('fetch')) return 'NETWORK'
  return 'GENERIC'
}
