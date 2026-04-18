import { createClient } from '@/lib/supabase/client'

// ─── Platform Detection ────────────────────────────────────────
export function isNativePlatform(): boolean {
  if (typeof window === 'undefined') return false
  const cap = (window as any).Capacitor
  if (cap?.isNativePlatform?.()) return true
  if (cap) return true
  return false
}

// ─── State ─────────────────────────────────────────────────────
let initialized = false

// ─── Initialize (call ONCE at app start) ───────────────────────
export async function initSocialLogin(): Promise<void> {
  if (initialized) return
  if (!isNativePlatform()) return

  try {
    const { SocialLogin } = await import('@capgo/capacitor-social-login')
    const { Capacitor } = await import('@capacitor/core')
    const platform = Capacitor.getPlatform()

    if (platform === 'ios') {
      await SocialLogin.initialize({
        google: {
          iOSClientId: '67588080719-at90h2m2dai4uccdqchibp9bs4d0eg1m.apps.googleusercontent.com',
          iOSServerClientId: '67588080719-6fv1g9kq19kf55cvbko3miqjiejrakme.apps.googleusercontent.com',
        },
        apple: {},
      })
    } else if (platform === 'android') {
      await SocialLogin.initialize({
        google: {
          webClientId: '67588080719-6fv1g9kq19kf55cvbko3miqjiejrakme.apps.googleusercontent.com',
        },
        // Apple iOS-only, Android'de ekleme
      })
    }

    initialized = true
  } catch (err) {
    console.error('SocialLogin init failed:', err)
  }
}

// ─── Crypto ────────────────────────────────────────────────────
function generateNonce(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(values, v => chars[v % chars.length]).join('')
}

async function sha256(message: string): Promise<string> {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message))
  return Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('')
}

// ─── Session Sync ──────────────────────────────────────────────
async function syncSessionToCookies(accessToken: string, refreshToken: string): Promise<void> {
  try {
    const res = await fetch('/api/auth/set-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
    })
    if (!res.ok) {
      console.error('Session sync failed:', res.status, await res.text())
    }
  } catch (e) {
    console.error('Session sync error:', e)
  }
}

// ─── Google ────────────────────────────────────────────────────
export async function handleNativeGoogleLogin(): Promise<void> {
  await initSocialLogin()
  if (!initialized) throw new Error('Social login başlatılamadı')

  const { SocialLogin } = await import('@capgo/capacitor-social-login')

  // Önce cache temizle (nonce mismatch önlemi)
  await SocialLogin.logout({ provider: 'google' }).catch(() => {})

  const result = await SocialLogin.login({
    provider: 'google',
    options: { scopes: ['email', 'profile'] },
  })

  const idToken = (result as any).result?.idToken
  if (!idToken) throw new Error('Google ID token alınamadı')

  // Supabase'e token ver (nonce olmadan — daha güvenilir)
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  })

  if (error) throw new Error(`Google giriş hatası: ${error.message}`)
  if (!data.session) throw new Error('Session oluşturulamadı')

  await syncSessionToCookies(data.session.access_token, data.session.refresh_token)
}

// ─── Apple ─────────────────────────────────────────────────────
export async function handleNativeAppleLogin(): Promise<void> {
  await initSocialLogin()
  if (!initialized) throw new Error('Social login başlatılamadı')

  const { SocialLogin } = await import('@capgo/capacitor-social-login')

  const rawNonce = generateNonce()
  const hashedNonce = await sha256(rawNonce)

  let result
  try {
    result = await SocialLogin.login({
      provider: 'apple',
      options: { scopes: ['email', 'name'], nonce: hashedNonce },
    })
  } catch (e: any) {
    // Kullanıcı iptal etti
    if (e?.message?.includes('cancel') || e?.message?.includes('1001')) {
      throw new Error('Giriş iptal edildi')
    }
    throw new Error(`Apple giriş hatası: ${e?.message || 'Bilinmeyen hata'}`)
  }

  const idToken = (result as any).result?.identityToken
  if (!idToken) throw new Error('Apple identity token alınamadı')

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: idToken,
    nonce: rawNonce,
  })

  if (error) throw new Error(`Apple giriş hatası: ${error.message}`)
  if (!data.session) throw new Error('Session oluşturulamadı')

  await syncSessionToCookies(data.session.access_token, data.session.refresh_token)
}
