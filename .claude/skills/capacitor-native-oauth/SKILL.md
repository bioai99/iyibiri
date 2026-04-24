---
name: capacitor-native-oauth
description: Capacitor iOS/Android native OAuth 2.0 akışı için operasyonel kılavuz. RFC 8252 (OAuth 2.0 for Native Apps) uyumlu PKCE flow, Universal Links / App Links / custom scheme deep linking, @capgo/capacitor-social-login kullanımı, Google + Apple provider kurulumu, Supabase session bridge, token güvenlik, CSRF protection, deep link handler, emulator/simulator test. Web login fallback pattern. Ortak hatalar (redirect URI mismatch, embedded browser, token leak).
---

# Capacitor Native OAuth — iOS/Android Flow

> **Kritik güvenlik:** Native OAuth hatası = **account takeover**. Bu skill RFC 8252 (OAuth 2.0 for Native Apps — 2017 BCP) kurallarını İyiBiri'ye yapıştırır. Her maddeye bakmadan implementasyon **yasak**.

Kaynaklar: [RFC 8252 — OAuth 2.0 for Native Apps](https://tools.ietf.org/html/rfc8252) · [Capacitor Deep Links](https://capacitorjs.com/docs/guides/deep-links) · [@capgo/capacitor-social-login](https://github.com/Cap-go/capacitor-social-login) · [Supabase Mobile Auth](https://supabase.com/docs/guides/auth/native-mobile-deep-linking) · [OAuth 2.0 for Mobile Apps — Privy](https://docs.privy.io/recipes/capacitor-oauth)

## 1. Flow diagramı

```
User tap "Google ile Giriş"
    │
    ▼
@capgo/capacitor-social-login → Google Sign-In SDK
    │ (native UI, system browser — embedded YASAK)
    │
    ▼
Google authorization server
    │ PKCE: code_challenge in request
    │
    ▼
Authorization code + state döner
    │ deep link: iyibiri://auth/callback?code=...&state=...
    │
    ▼
App.addListener('appUrlOpen', handleDeepLink)
    │ state validate (CSRF)
    │ code_verifier → /auth/token endpoint
    │
    ▼
Supabase auth.setSession(access_token, refresh_token)
    │
    ▼
Router → /dashboard
```

**Not:** Apple Sign-In için `capacitor-plugin-apple-signin` alt flow'u benzer, native id_token direk Supabase'e geçer (PKCE opsiyonel).

## 2. RFC 8252 checklist (7 madde, agent her implementasyonda doğrular)

1. ✅ **PKCE zorunlu** — `code_challenge` + `code_verifier` (SHA-256). Public client (native app) için client_secret yok, PKCE yerine geçer.
2. ✅ **System browser (in-app browser)** — **Embedded WebView yasak** (RFC 8252 §8.12). Android: Chrome Custom Tabs. iOS: SFAuthenticationSession / ASWebAuthenticationSession.
3. ✅ **Custom URL scheme veya Universal/App Links** — redirect URI. `iyibiri://auth/callback` (scheme) veya `https://iyibiri.app/auth/callback` (universal).
4. ✅ **State parameter (CSRF)** — random opaque string, response'ta aynısı döner.
5. ✅ **Exact redirect URI match** — wildcard yasak. Provider console'da kayıtlı tam URI.
6. ✅ **HTTPS transport** — token'lar asla HTTP'de.
7. ✅ **Token storage — secure** — iOS Keychain, Android Encrypted SharedPreferences. `localStorage` / plain disk **yasak**.

## 3. Capacitor config

`capacitor.config.ts`:

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iyibiri.app',
  appName: 'İyiBiri',
  webDir: 'out',
  
  server: {
    // Dev: local Next.js
    // Prod: iyibiri.app (Universal/App Links)
    url: process.env.CAPACITOR_SERVER_URL || 'https://iyibiri.app',
    cleartext: false,  // HTTP yasak prod'da
  },
  
  plugins: {
    SocialLogin: {
      providers: {
        google: {
          webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
          iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
          // Android uses reversed iOS client ID
        },
        apple: {
          clientId: 'com.iyibiri.app.signin',
          redirectUrl: 'https://iyibiri.app/auth/callback/apple',
        },
      },
    },
  },
};
```

## 4. iOS setup — Universal Links + URL scheme

### 4.1. URL scheme (Info.plist)
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.iyibiri.app</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>iyibiri</string>
    </array>
  </dict>
</array>
```

### 4.2. Universal Links (Associated Domains)
iOS tercih — HTTPS üzerinden, phishing'e dayanıklı.

**Xcode:** Target → Signing & Capabilities → Associated Domains → `applinks:iyibiri.app`

**Server-side:** `/.well-known/apple-app-site-association` serve edilmeli:
```json
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAMID.com.iyibiri.app",
      "paths": ["/auth/callback/*"]
    }]
  }
}
```

## 5. Android setup — App Links + intent filter

### 5.1. AndroidManifest.xml
```xml
<activity android:name=".MainActivity">
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <!-- App Link (HTTPS) -->
    <data android:scheme="https"
          android:host="iyibiri.app"
          android:pathPrefix="/auth/callback" />
  </intent-filter>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <!-- Custom scheme fallback -->
    <data android:scheme="iyibiri" android:host="auth" />
  </intent-filter>
</activity>
```

### 5.2. Asset verification
`/.well-known/assetlinks.json`:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.iyibiri.app",
    "sha256_cert_fingerprints": ["AB:CD:EF:..."]
  }
}]
```

SHA256 fingerprint: `keytool -list -v -keystore release.keystore | grep SHA256`.

## 6. Deep link handler (TypeScript)

`lib/auth/oauth-native.ts`:

```ts
import { App } from '@capacitor/app';
import { supabase } from '@/lib/supabase/client';

export function setupOAuthDeepLinkHandler() {
  App.addListener('appUrlOpen', async (event) => {
    const url = new URL(event.url);
    
    // iyibiri://auth/callback veya https://iyibiri.app/auth/callback
    if (!url.pathname.startsWith('/auth/callback')) return;
    
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    
    // 1. Error handling
    if (error) {
      console.error('OAuth error:', error);
      router.push('/auth/signin?error=' + encodeURIComponent(error));
      return;
    }
    
    // 2. State (CSRF) validation
    const expectedState = sessionStorage.getItem('oauth_state');
    if (!state || state !== expectedState) {
      console.error('State mismatch — possible CSRF');
      router.push('/auth/signin?error=invalid_state');
      return;
    }
    sessionStorage.removeItem('oauth_state');
    
    // 3. Exchange code for session (Supabase)
    if (code) {
      const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      if (sessionError) {
        console.error('Session exchange failed:', sessionError);
        router.push('/auth/signin?error=session_failed');
        return;
      }
      
      // 4. Success → navigate
      router.push('/dashboard');
    }
  });
}
```

**Setup:** `_app.tsx` veya root layout'ta bir kez çağrılır (Capacitor.isNativePlatform() içinde).

## 7. Google Sign-In (native)

```ts
import { SocialLogin } from '@capgo/capacitor-social-login';

async function signInWithGoogle() {
  // 1. PKCE + state
  const state = crypto.randomUUID();
  sessionStorage.setItem('oauth_state', state);
  
  try {
    // 2. Native sign-in UI
    const result = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
        forceCodeForRefreshToken: true,
      },
    });
    
    // 3. Result.result.idToken → Supabase
    if (result.provider === 'google') {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: result.result.idToken,
      });
      
      if (error) throw error;
      router.push('/dashboard');
    }
  } catch (err) {
    // User cancel, network error, etc
    if (err.message !== 'User cancelled') {
      console.error('Google sign-in failed:', err);
      router.push('/auth/signin?error=google_failed');
    }
  }
}
```

## 8. Apple Sign-In (iOS-first)

iOS Apple Sign-In gereklidir (App Store Review Guideline 4.8 — Sign in with Apple alternatifi olmalı Google varsa).

```ts
const result = await SocialLogin.login({
  provider: 'apple',
  options: {
    scopes: ['email', 'name'],
    nonce: crypto.randomUUID(),
  },
});

if (result.provider === 'apple') {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: result.result.idToken,
    nonce: result.result.nonce,
  });
}
```

## 9. Token storage — güvenlik

| Storage | Güvenli? | Kullanım |
|---|---|---|
| `localStorage` / `sessionStorage` | ❌ XSS'e açık, disk'te plain | **YASAK** — token için |
| `@capacitor/preferences` | ⚠️ Android: plain, iOS: Keychain | Non-sensitive config için ok |
| `@capacitor-community/secure-storage` | ✅ iOS Keychain + Android Encrypted SharedPreferences | **Token, refresh token için ZORUNLU** |
| Memory (React state) | ✅ App lifecycle içi | Short-lived (page session) |

**Supabase SSR pattern:** Cookie-based, middleware handle. Capacitor native'de cookie yerine secure storage + manuel bridge.

## 10. Web fallback pattern

Eğer Capacitor.isNativePlatform() false (web), normal Supabase OAuth redirect flow kullanılır:

```ts
if (Capacitor.isNativePlatform()) {
  // Native flow (SocialLogin + signInWithIdToken)
  await signInWithGoogle();
} else {
  // Web flow (browser redirect)
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
}
```

## 11. Test — simulator/emulator

### iOS simulator
```bash
# Run app
npx cap run ios

# Simulate deep link
xcrun simctl openurl booted "iyibiri://auth/callback?code=test&state=test"

# Universal Link (for actually signed build)
xcrun simctl openurl booted "https://iyibiri.app/auth/callback?code=test"
```

### Android emulator
```bash
npx cap run android

# Simulate deep link
adb shell am start -W -a android.intent.action.VIEW -d "iyibiri://auth/callback?code=test&state=test" com.iyibiri.app
```

### Test senaryoları
- [ ] Google OAuth tamamla → session oluştu mu?
- [ ] User cancel → error message var mı, crash yok mu?
- [ ] Network kesildi → timeout + retry + error handling?
- [ ] State mismatch (manuel manipüle) → reject + redirect signin?
- [ ] App background → foreground sonrası session hala geçerli mi?
- [ ] Universal Link (prod build) → external app'ten gelme OK mu?

## 12. Password reset flow (native)

```ts
async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: Capacitor.isNativePlatform()
      ? 'iyibiri://auth/reset-password'
      : `${window.location.origin}/auth/reset-password`,
  });
  
  if (error) throw error;
}

// Deep link handler (oauth-native.ts aynı pattern)
// /auth/reset-password?token=... + yeni şifre formu
```

Supabase e-posta template'inde redirect URL mobile'e özel olmalı.

## 13. Common pitfalls + fix

| Hata | Sebep | Fix |
|---|---|---|
| `redirect_uri_mismatch` | Provider console ≠ code | Her iki ortamı eşle: `iyibiri://auth/callback` (native) ve `https://iyibiri.app/auth/callback` (web) |
| Deep link açılmıyor | App Links verify fail | `assetlinks.json` serve ediliyor mu, SHA256 doğru mu? |
| Token refresh patlaması | Native storage yok | `@capacitor-community/secure-storage` + Supabase custom storage adapter |
| State CSRF fail | sessionStorage temizlenmedi | Her login başında yeni state, sonunda temizle |
| Embedded WebView | Eski SDK | Chrome Custom Tabs / ASWebAuthenticationSession zorunlu |
| iOS: Apple Sign-In eksik | Guideline 4.8 | Google varsa Apple Sign-In **zorunlu** |
| localhost deep link | Dev'de URL karışır | `server.url` env-based, `CAPACITOR_SERVER_URL=http://192.168.1.X:3000` |

## 14. Agent için karar ağacı

```
Native OAuth işi geliyor
    │
    ▼
RFC 8252 7-madde doğrulandı mı?
    │
    ├─ HAYIR → DUR. Her maddeyi kontrol et.
    │
    └─ EVET
        │
        ▼
    iOS + Android setup dokümante mi?
    (URL scheme + Universal/App Links + assetlinks)
        │
        ├─ HAYIR → Önce platform config.
        │
        └─ EVET
            │
            ▼
        Deep link handler test edildi mi (simulator)?
            │
            ├─ HAYIR → Test et.
            │
            └─ EVET → Prod'a gidebilir (code review sonrası).
```

## 15. Anti-pattern

- **Embedded WebView ile OAuth** — RFC 8252 §8.12 yasak. Phishing + password leak risk.
- **client_secret native app'e gömme** — Reverse engineer kolay, PKCE yerine geçirilmez sanılır. Public client, PKCE kullanılmalı.
- **Hardcoded redirect URI** — env-based olmalı (dev/prod ayrımı için).
- **State parametre atlamak** — CSRF açık, attacker session forge edebilir.
- **Token localStorage** — XSS'e açık, iOS/Android'de disk plaintext.
- **Universal Link yerine sadece scheme** — scheme hijacking (başka app aynı scheme'i register edebilir) — iOS/Android official link zorunlu prod'da.

## 16. Kontrol listesi — pre-production

- [ ] RFC 8252 7 madde tam uygulandı
- [ ] Google + Apple provider setup (prod + staging client IDs ayrı)
- [ ] iOS: Associated Domains + Info.plist URL scheme
- [ ] Android: AndroidManifest intent filter + assetlinks.json SHA256
- [ ] Server-side `/.well-known/apple-app-site-association` + `/.well-known/assetlinks.json` serve ediliyor
- [ ] Deep link handler state + code + error handling tam
- [ ] Token storage `@capacitor-community/secure-storage` ile encrypted
- [ ] Simulator + emulator test senaryoları geçti
- [ ] Web fallback (`Capacitor.isNativePlatform()` false) çalışıyor
- [ ] Password reset deep link iki ortamda çalışıyor
- [ ] Legal: Aydınlatma metni (KVKK) — OAuth provider'dan gelen veri listesi
