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

  // Önce cache temizle
  await SocialLogin.logout({ provider: 'google' }).catch(() => {})

  const rawNonce = generateNonce()
  const hashedNonce = await sha256(rawNonce)

  const result = await SocialLogin.login({
    provider: 'google',
    options: { scopes: ['email', 'profile'], nonce: hashedNonce },
  })

  const idToken = (result as any).result?.idToken
  if (!idToken) throw new Error('Google ID token alınamadı')

  // Google'dan isim bilgisini al
  const googleProfile = (result as any).result?.profile || (result as any).result || {}
  const googleName = googleProfile?.name || googleProfile?.displayName || googleProfile?.givenName || ''

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
    nonce: rawNonce,
  })

  if (error) throw new Error(`Google giriş hatası: ${error.message}`)
  if (!data.session) throw new Error('Session oluşturulamadı')

  // İsmi birden fazla kaynaktan dene
  const finalGoogleName = googleName
    || data.session.user?.user_metadata?.full_name
    || data.session.user?.user_metadata?.name
    || ''
  const finalGoogleEmail = data.session.user.email || ''

  if (data.session.user?.id && (finalGoogleName || finalGoogleEmail)) {
    await supabase.from('profiles').update({
      ...(finalGoogleName ? { name: finalGoogleName } : {}),
      ...(finalGoogleEmail ? { email: finalGoogleEmail } : {}),
    }).eq('id', data.session.user.id)
  }

  await syncSessionToCookies(data.session.access_token, data.session.refresh_token)
}

// ─── Apple ─────────────────────────────────────────────────────
export async function handleNativeAppleLogin(): Promise<void> {
  await initSocialLogin()
  if (!initialized) throw new Error('Social login başlatılamadı')

  const { SocialLogin } = await import('@capgo/capacitor-social-login')

  const rawNonce = generateNonce()
  const hashedNonce = await sha256(rawNonce)

  let result: any
  try {
    result = await SocialLogin.login({
      provider: 'apple',
      options: { scopes: ['email', 'name'], nonce: hashedNonce },
    })
  } catch (e: any) {
    if (e?.message?.includes('cancel') || e?.message?.includes('1001')) {
      throw new Error('Giriş iptal edildi')
    }
    throw new Error(`Apple giriş hatası: ${e?.message || 'Bilinmeyen hata'}`)
  }

  // Token'ı farklı olası field'lardan al
  const idToken = result?.result?.identityToken
    || result?.result?.idToken
    || result?.identityToken
    || result?.idToken
    || result?.result?.credential?.identityToken
    || result?.result?.response?.identityToken
  if (!idToken) {
    throw new Error(`Apple token bulunamadı. Response: ${JSON.stringify(result).slice(0, 200)}`)
  }

  // Apple result'ın tüm yapısını logla (debug)
  console.log('Apple login result:', JSON.stringify(result, null, 2))

  // İsim ve email'i Apple result'tan çıkar
  // Capgo plugin farklı yerlerde tutabilir, hepsini dene
  const r = result?.result || result || {}
  const profile = r?.profile || r?.user || r || {}
  const givenName = r?.givenName || profile?.givenName || r?.name?.givenName || profile?.name?.givenName || ''
  const familyName = r?.familyName || profile?.familyName || r?.name?.familyName || profile?.name?.familyName || ''
  const fullName = [givenName, familyName].filter(Boolean).join(' ')
  const appleEmail = r?.email || profile?.email || ''

  // İsim bulunamazsa user_metadata'dan dene (Supabase bazen kaydeder)
  // Bu bilgiyi hata mesajında göster ki debug edebilelim
  if (!fullName) {
    console.warn('Apple isim bulunamadı. Result keys:', Object.keys(r), 'Profile keys:', Object.keys(profile))
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: idToken,
    nonce: rawNonce,
  })

  if (error) throw new Error(`Apple giriş hatası: ${error.message}`)
  if (!data.session) throw new Error('Session oluşturulamadı')

  // İsmi birden fazla kaynaktan dene
  const finalName = fullName
    || data.session.user?.user_metadata?.full_name
    || data.session.user?.user_metadata?.name
    || [data.session.user?.user_metadata?.given_name, data.session.user?.user_metadata?.family_name].filter(Boolean).join(' ')
    || ''
  const finalEmail = appleEmail || data.session.user.email || ''

  // Profile'a kaydet
  if (data.session.user?.id && (finalName || finalEmail)) {
    await supabase.from('profiles').update({
      ...(finalName ? { name: finalName } : {}),
      ...(finalEmail ? { email: finalEmail } : {}),
    }).eq('id', data.session.user.id)
  }

  await syncSessionToCookies(data.session.access_token, data.session.refresh_token)
}
