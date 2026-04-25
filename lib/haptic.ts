'use client'

/**
 * iOS Capacitor Haptic bridge.
 * Web'de: no-op + optional console.debug.
 * iOS: UIImpactFeedbackGenerator / UINotificationFeedbackGenerator
 *
 * Pattern katalogu (mobile-app-polish-standards Bölüm 10):
 */

import { Capacitor } from '@capacitor/core'

type ImpactStyle = 'light' | 'medium' | 'heavy'
type NotificationType = 'success' | 'warning' | 'error'

let HapticPlugin: any = null
if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
  import('@capacitor/haptics')
    .then((m) => {
      HapticPlugin = m.Haptics
    })
    .catch(() => {})
}

function isEnabled(): boolean {
  if (typeof window === 'undefined') return false
  // User opt-out via localStorage
  return localStorage.getItem('iyibiri_haptic_enabled') !== 'false'
}

export const haptic = {
  /** Buton tap (standart) */
  tap: () => {
    if (!isEnabled() || !HapticPlugin) return
    HapticPlugin.impact({ style: 'light' })
  },
  /** Önemli action (karma award, görev alındı) */
  medium: () => {
    if (!isEnabled() || !HapticPlugin) return
    HapticPlugin.impact({ style: 'medium' })
  },
  /** Celebration peak (streak milestone, tier up) */
  heavy: () => {
    if (!isEnabled() || !HapticPlugin) return
    HapticPlugin.impact({ style: 'heavy' })
  },
  /** Success (kayıt, onay) */
  success: () => {
    if (!isEnabled() || !HapticPlugin) return
    HapticPlugin.notification({ type: 'SUCCESS' })
  },
  /** Warning (KVKK uyarı, validation) */
  warning: () => {
    if (!isEnabled() || !HapticPlugin) return
    HapticPlugin.notification({ type: 'WARNING' })
  },
  /** Error */
  error: () => {
    if (!isEnabled() || !HapticPlugin) return
    HapticPlugin.notification({ type: 'ERROR' })
  },
  /** Selection change (picker, slider) */
  selection: () => {
    if (!isEnabled() || !HapticPlugin) return
    HapticPlugin.selectionChanged()
  },
}

export function setHapticEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return
  localStorage.setItem('iyibiri_haptic_enabled', String(enabled))
}
