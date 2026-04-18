import { createClient as createBrowserClient } from '@/lib/supabase/client'

// ─── Platform Detection ────────────────────────────────────────
export function isNativePlatform(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window as any).Capacitor?.isNativePlatform?.() || !!(window as any).Capacitor
}

// ─── Crypto Helpers ────────────────────────────────────────────
function generateNonce(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(values, v => chars[v % chars.length]).join('')
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  return Array.from(new Uint8Array(hashBuffer), b => b.toString(16).padStart(2, '0')).join('')
}

// ─── Session Sync ──────────────────────────────────────────────
// Native login session'ını server-side cookie'lere yazar.
// Bu sayede middleware ve server component'lar user'ı görebilir.
async function syncSessionToCookies(accessToken: string, refreshToken: string): Promise<void> {
  await fetch('/api/auth/set-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
  })
}

// ─── Google Native Sign-In ─────────────────────────────────────
export async function handleNativeGoogleLogin(): Promise<void> {
  const { SocialLogin } = await import('@capgo/capacitor-social-login')

  await SocialLogin.initialize({
    google: {
      iOSClientId: '67588080719-at90h2m2dai4uccdqchibp9bs4d0eg1m.apps.googleusercontent.com',
      iOSServerClientId: '67588080719-6fv1g9kq19kf55cvbko3miqjiejrakme.apps.googleusercontent.com',
    },
  })

  const rawNonce = generateNonce()
  const hashedNonce = await sha256(rawNonce)

  const result = await SocialLogin.login({
    provider: 'google',
    options: {
      scopes: ['email', 'profile'],
      nonce: hashedNonce,
    },
  })

  const idToken = (result as any).result?.idToken
  if (!idToken) throw new Error('Google ID token alınamadı')

  // Supabase'e ID token ile giriş yap
  const supabase = createBrowserClient()
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
    nonce: rawNonce,
  })

  if (error) throw error
  if (!data.session) throw new Error('Session oluşturulamadı')

  // Session'ı cookie'lere sync et (middleware için)
  await syncSessionToCookies(data.session.access_token, data.session.refresh_token)
}

// ─── Apple Native Sign-In ──────────────────────────────────────
export async function handleNativeAppleLogin(): Promise<void> {
  const { SocialLogin } = await import('@capgo/capacitor-social-login')

  await SocialLogin.initialize({
    apple: {},
  })

  const rawNonce = generateNonce()
  const hashedNonce = await sha256(rawNonce)

  const result = await SocialLogin.login({
    provider: 'apple',
    options: {
      scopes: ['email', 'name'],
      nonce: hashedNonce,
    },
  })

  const idToken = (result as any).result?.identityToken
  if (!idToken) throw new Error('Apple identity token alınamadı')

  const supabase = createBrowserClient()
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: idToken,
    nonce: rawNonce,
  })

  if (error) throw error
  if (!data.session) throw new Error('Session oluşturulamadı')

  await syncSessionToCookies(data.session.access_token, data.session.refresh_token)
}
