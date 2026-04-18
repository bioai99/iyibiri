# Native OAuth (Google + Apple) Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Google ve Apple ile giriş/kayıt — iOS Capacitor app'te native dialog'larla, web'de browser redirect ile çalışan kalıcı çözüm.

**Architecture:** `@capgo/capacitor-social-login` plugin'i iOS native Google/Apple Sign-In SDK'larını kullanıyor. ID token alınıp Supabase `signInWithIdToken()` ile session oluşturuluyor. Browser redirect yok, SFSafariViewController yok. Session cookie'lere `/api/auth/set-session` endpoint'i ile sync ediliyor.

**Tech Stack:** Next.js 14, Supabase Auth, Capacitor 8, @capgo/capacitor-social-login 8.3.14, TypeScript

---

## Kök Neden Analizi

| Hata | Neden | Çözüm |
|------|-------|-------|
| "No provider was initialized" | `SocialLogin.initialize()` her login'de tekrar çağrılıyor, config eksik/yanlış olabilir | App başlangıcında TEK SEFER initialize, platform-aware config |
| Apple "operation couldn't be completed" | Xcode'da "Sign in with Apple" capability eksik | App.entitlements'a eklenmeli |
| Google buton tepki vermiyor | AppDelegate.swift'te GoogleSignIn URL handler eksik | `GIDSignIn.sharedInstance.handle(url)` eklenmeli |
| Nonce mismatch (olası) | iOS Google token cache'liyor | Logout + retry logic |

## Dosya Haritası

| Dosya | Aksiyon | Sorumluluk |
|-------|---------|------------|
| `lib/auth/oauth-native.ts` | REWRITE | Tek initialize, login fonksiyonları, retry logic |
| `app/auth/login/page.tsx` | MODIFY | handleOAuthLogin güncelle |
| `app/auth/signin/page.tsx` | MODIFY | handleOAuthLogin güncelle |
| `app/app-start/page.tsx` | MODIFY | Initialize çağır |
| `ios/App/App/AppDelegate.swift` | MODIFY | GoogleSignIn URL handler ekle |
| `ios/App/App/App.entitlements` | MODIFY | Sign in with Apple capability |
| `capacitor.config.ts` | MODIFY | SocialLogin plugin config |

---

### Task 1: Xcode — Sign in with Apple Capability Ekle

**Files:**
- Modify: `ios/App/App/App.entitlements`

Bu adım Xcode'da manuel yapılmalı. Kod değişikliği yetersiz — Xcode project file'ın da güncellenmesi gerekiyor.

- [ ] **Step 1: Xcode'da capability ekle**

Xcode'da:
1. `ios/App/App.xcodeproj` aç
2. Sol panelde **App** target seç
3. **Signing & Capabilities** sekmesi
4. **+ Capability** butonuna tıkla
5. **"Sign in with Apple"** ara ve ekle

Bu otomatik olarak `App.entitlements`'a şunu ekler:
```xml
<key>com.apple.developer.applesignin</key>
<array>
    <string>Default</string>
</array>
```

- [ ] **Step 2: Doğrula**

`App.entitlements` dosyasında hem `associated-domains` hem `applesignin` key'leri olmalı:
```xml
<dict>
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:www.iyibiri.app</string>
        <string>applinks:iyibiri.app</string>
    </array>
    <key>com.apple.developer.applesignin</key>
    <array>
        <string>Default</string>
    </array>
</dict>
```

---

### Task 2: AppDelegate.swift — Google URL Handler

**Files:**
- Modify: `ios/App/App/AppDelegate.swift`

- [ ] **Step 1: AppDelegate'i güncelle**

`ios/App/App/AppDelegate.swift` dosyasının tamamını şununla değiştir:

```swift
import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillEnterForeground(_ application: UIApplication) {}
    func applicationDidBecomeActive(_ application: UIApplication) {}
    func applicationWillTerminate(_ application: UIApplication) {}

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
```

Not: `import GoogleSignIn` ve `GIDSignIn.sharedInstance.handle(url)` GEREKMEZ — `@capgo/capacitor-social-login` kendi URL handling'ini `ApplicationDelegateProxy` üzerinden yapıyor. Capgo plugin'i Google Sign-In'i Credential Manager API ile handle ediyor, ayrı import gerektirmiyor.

---

### Task 3: capacitor.config.ts — Plugin Config

**Files:**
- Modify: `capacitor.config.ts`

- [ ] **Step 1: SocialLogin plugin ayarlarını ekle**

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iyibiri.app',
  appName: 'İyiBiri',
  webDir: 'out',
  server: {
    url: 'https://www.iyibiri.app/app-start',
    cleartext: false,
  },
  ios: {
    scheme: 'iyibiri',
    contentInset: 'automatic',
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#24201B',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#24201B',
    },
  },
};

export default config;
```

Not: `SocialLogin` plugin config'i `capacitor.config.ts`'ye EKLENMİYOR — Capgo docs'a göre provider config `SocialLogin.initialize()` JavaScript çağrısında verilir. capacitor.config.ts'deki `plugins.SocialLogin` sadece Android için gerekli ve şu an sadece iOS yapıyoruz.

---

### Task 4: oauth-native.ts — Tamamen Yeniden Yaz

**Files:**
- Rewrite: `lib/auth/oauth-native.ts`

- [ ] **Step 1: Yeni oauth-native.ts yaz**

```typescript
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
  await fetch('/api/auth/set-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
  })
}

// ─── Google ────────────────────────────────────────────────────
export async function handleNativeGoogleLogin(): Promise<void> {
  await initSocialLogin()
  if (!initialized) throw new Error('Social login başlatılamadı')

  const { SocialLogin } = await import('@capgo/capacitor-social-login')
  const supabase = createClient()
  const rawNonce = generateNonce()
  const hashedNonce = await sha256(rawNonce)

  let idToken: string | undefined

  // İlk deneme
  try {
    const result = await SocialLogin.login({
      provider: 'google',
      options: { scopes: ['email', 'profile'], nonce: hashedNonce },
    })
    idToken = (result as any).result?.idToken
  } catch {
    // iOS token cache sorunu — logout ve tekrar dene
    await SocialLogin.logout({ provider: 'google' }).catch(() => {})
    const result = await SocialLogin.login({
      provider: 'google',
      options: { scopes: ['email', 'profile'], nonce: hashedNonce },
    })
    idToken = (result as any).result?.idToken
  }

  if (!idToken) throw new Error('Google ID token alınamadı')

  // Supabase'e token ver
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
    nonce: rawNonce,
  })

  // Nonce mismatch retry
  if (error?.message?.includes('nonce')) {
    await SocialLogin.logout({ provider: 'google' }).catch(() => {})
    const retryResult = await SocialLogin.login({
      provider: 'google',
      options: { scopes: ['email', 'profile'], nonce: hashedNonce },
    })
    const retryToken = (retryResult as any).result?.idToken
    if (!retryToken) throw new Error('Retry: token alınamadı')

    const { data: retryData, error: retryError } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: retryToken,
      nonce: rawNonce,
    })
    if (retryError) throw retryError
    if (!retryData.session) throw new Error('Session oluşturulamadı')
    await syncSessionToCookies(retryData.session.access_token, retryData.session.refresh_token)
    return
  }

  if (error) throw error
  if (!data.session) throw new Error('Session oluşturulamadı')
  await syncSessionToCookies(data.session.access_token, data.session.refresh_token)
}

// ─── Apple ─────────────────────────────────────────────────────
export async function handleNativeAppleLogin(): Promise<void> {
  await initSocialLogin()
  if (!initialized) throw new Error('Social login başlatılamadı')

  const { SocialLogin } = await import('@capgo/capacitor-social-login')
  const supabase = createClient()
  const rawNonce = generateNonce()
  const hashedNonce = await sha256(rawNonce)

  const result = await SocialLogin.login({
    provider: 'apple',
    options: { scopes: ['email', 'name'], nonce: hashedNonce },
  })

  const idToken = (result as any).result?.identityToken
  if (!idToken) throw new Error('Apple identity token alınamadı')

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: idToken,
    nonce: rawNonce,
  })

  if (error) throw error
  if (!data.session) throw new Error('Session oluşturulamadı')
  await syncSessionToCookies(data.session.access_token, data.session.refresh_token)
}
```

Kritik farklar:
1. `initSocialLogin()` TEK SEFER çağrılır, `initialized` flag'i ile korunur
2. Platform-aware config: iOS'ta `iOSClientId` + `apple`, Android'de sadece `webClientId`
3. Google retry logic: token cache + nonce mismatch
4. Her fonksiyon önce `initSocialLogin()` çağırır (idempotent)

---

### Task 5: app-start — Sayfa Yüklenirken Initialize

**Files:**
- Modify: `app/app-start/page.tsx`

- [ ] **Step 1: app-start'ta SocialLogin initialize et**

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AppStartPage() {
  const router = useRouter()

  useEffect(() => {
    async function boot() {
      // Native platform ise SocialLogin'i erken başlat
      const { isNativePlatform, initSocialLogin } = await import('@/lib/auth/oauth-native')
      if (isNativePlatform()) {
        await initSocialLogin()
      }

      // Auth kontrolü
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.replace('/dashboard')
      } else {
        router.replace('/onboarding/welcome')
      }
    }
    boot()
  }, [router])

  return (
    <div style={{
      background: '#24201B', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 500,
        letterSpacing: '-0.028em', color: '#F4EEDF',
      }}>
        İyi<span style={{ fontStyle: 'italic', color: '#E8C268' }}>Biri</span>
      </div>
    </div>
  )
}
```

---

### Task 6: Login + Signin Sayfaları — Error Handling

**Files:**
- Modify: `app/auth/login/page.tsx` (handleOAuthLogin fonksiyonu)
- Modify: `app/auth/signin/page.tsx` (handleOAuthLogin fonksiyonu)

- [ ] **Step 1: Her iki sayfadaki handleOAuthLogin fonksiyonu**

Her iki dosyada da aynı fonksiyon:

```typescript
const [oauthLoading, setOauthLoading] = useState<string | null>(null)
const [oauthError, setOauthError] = useState<string | null>(null)

async function handleOAuthLogin(provider: 'google' | 'apple') {
  setOauthLoading(provider)
  setOauthError(null)

  try {
    const { isNativePlatform, handleNativeGoogleLogin, handleNativeAppleLogin } =
      await import('@/lib/auth/oauth-native')

    if (isNativePlatform()) {
      if (provider === 'google') await handleNativeGoogleLogin()
      else await handleNativeAppleLogin()
      window.location.href = '/dashboard'
    } else {
      const supabase = createClient()
      const { data } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          ...(provider === 'google' && { queryParams: { prompt: 'select_account' } }),
        },
      })
      if (data.url) window.location.href = data.url
    }
  } catch (err: any) {
    const msg = err?.message || 'Giriş başarısız oldu.'
    setOauthError(msg)
    setOauthLoading(null)
  }
}
```

Butonlar:
```tsx
<button
  onClick={() => handleOAuthLogin('google')}
  disabled={!!oauthLoading}
  style={{ /* mevcut stil */ opacity: oauthLoading && oauthLoading !== 'google' ? 0.5 : 1 }}
>
  <GoogleIcon size={18} />
  {oauthLoading === 'google' ? 'Bağlanıyor...' : 'Google ile devam et'}
</button>
```

Error mesajı (butonlardan sonra):
```tsx
{oauthError && (
  <p style={{ margin: '12px 0 0', fontSize: 13, color: '#C8553D', textAlign: 'center' }}>
    {oauthError}
  </p>
)}
```

---

### Task 7: Build, Sync, Test

- [ ] **Step 1: Next.js build**
```bash
npx next build
```
Expected: Build success, no errors

- [ ] **Step 2: Capacitor sync**
```bash
npx cap sync ios
```
Expected: 3 plugins synced (app, browser, social-login)

- [ ] **Step 3: Commit**
```bash
git add -A
git commit -m "fix: native OAuth - single init, Apple entitlement, retry logic"
git push origin main
```

- [ ] **Step 4: Xcode'da Sign in with Apple capability ekle (Task 1)**

Bu adım Xcode'da manuel yapılmalı.

- [ ] **Step 5: Archive + TestFlight**
```bash
xcodebuild -project ios/App/App.xcodeproj -scheme App -destination 'generic/platform=iOS' -archivePath /tmp/iyibiri.xcarchive archive
xcodebuild -exportArchive -archivePath /tmp/iyibiri.xcarchive -exportPath /tmp/iyibiri-export -exportOptionsPlist /tmp/export-options.plist
```

- [ ] **Step 6: Test on device**

Test senaryoları:
1. App aç → onboarding göster (ilk açılış)
2. Google butona bas → Native Google dialog açılsın → giriş → dashboard
3. Apple butona bas → Native Apple dialog açılsın → giriş → dashboard
4. Hata durumunda ekranda Türkçe hata mesajı görsün
5. Web'de (browser) Google/Apple → Supabase redirect flow çalışsın

---

## Edge Cases

| Senaryo | Beklenen |
|---------|----------|
| İlk açılış, session yok | → Onboarding → Auth → Dashboard |
| Tekrar açılış, session var | → Dashboard direkt |
| Google login iptal | → Hata mesajı, buton tekrar aktif |
| Apple login iptal | → Hata mesajı, buton tekrar aktif |
| Google nonce mismatch | → Otomatik retry (logout + tekrar) |
| Web browser'da Google | → Supabase OAuth redirect (değişmedi) |
| Supabase session expire | → Middleware → /auth/login redirect |
