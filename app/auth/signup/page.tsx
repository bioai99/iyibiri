'use client'

// Vol-53: Signup redesign — büyük logo + 3 auth method eşit priority.
// Sosyal login üstte (Apple/Google) modern best practice; "altta secondary"
// kalmasın diye form'un öncesinde 3 method full-width.

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme'
import { createClient } from '@/lib/supabase/client'
import { BrandLogo } from '@/components/ui/brand-logo'

const AppleIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.86-3.08.4-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" />
  </svg>
)

const GoogleIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

function getPasswordStrength(password: string): number {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  return score
}

export default function SignupPage() {
  const { colors: c } = useTheme()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [kvkk, setKvkk] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [oauthError, setOauthError] = useState<string | null>(null)

  const strength = getPasswordStrength(password)
  const strengthColors = [c.gold, c.gold, c.goldDim, c.ink600]

  const displayFont = 'var(--font-display), ui-serif, Georgia, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  async function handleOAuthLogin(provider: 'google' | 'apple') {
    setOauthLoading(provider)
    setOauthError(null)
    try {
      const { isNativePlatform, handleNativeGoogleLogin, handleNativeAppleLogin } = await import('@/lib/auth/oauth-native')
      if (isNativePlatform()) {
        if (provider === 'google') await handleNativeGoogleLogin()
        else await handleNativeAppleLogin()
        window.location.href = '/app-start'
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
      console.error('OAuth error:', err)
      setOauthError(err?.message || 'Bir şeyler ters gitti.')
      setOauthLoading(null)
    }
  }

  async function handleSignup(e?: React.FormEvent | React.MouseEvent) {
    e?.preventDefault()
    if (!kvkk) return
    setLoading(true)
    setError(null)
    const supabase = createClient()
    // Vol-62 Pkg-4: KVKK onayını signup metadata'ya yazıyoruz; handle_new_user trigger
    // (Migration 059) bu alanı profiles.kvkk_accepted_at + kvkk_version'a persist eder.
    const KVKK_VERSION = '2026-05-03'
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          kvkk_accepted_at: new Date().toISOString(),
          kvkk_version: KVKK_VERSION,
        },
      },
    })
    if (error) {
      console.error('Signup error:', { message: error.message, status: error.status, name: error.name })
      const msg = error.message.toLowerCase()
      if (error.status === 429 || msg.includes('rate limit') || msg.includes('too many') || msg.includes('exceeded')) {
        setError('Çok fazla deneme yaptın. ~1 saat sonra tekrar dene.')
      } else if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already')) {
        setError('Bu e-posta zaten kayıtlı. Giriş yap veya doğrulama sayfasına git.')
      } else if (msg.includes('password')) {
        setError('Şifre en az 8 karakter ve 1 rakam içermeli.')
      } else if (msg.includes('email') && (msg.includes('invalid') || msg.includes('format'))) {
        setError('E-posta adresi geçersiz görünüyor.')
      } else if (msg.includes('signup') && msg.includes('disabled')) {
        setError('Yeni hesap kayıtları geçici olarak kapalı.')
      } else if (msg.includes('database') || msg.includes('500')) {
        setError('Sunucu tarafında bir sorun oldu. Birkaç dakika sonra tekrar dene.')
      } else {
        setError(`Hesap oluşturulamadı: ${error.message}`)
      }
      setLoading(false)
      return
    }
    setLoading(false)
    router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: c.ink800, border: `1px solid ${c.ink600}`, borderRadius: 12,
    outline: 'none', padding: '14px 16px', fontFamily: uiFont,
    fontSize: 15, color: c.cream, fontWeight: 500,
  }

  return (
    <div style={{ background: c.ink900, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 16px) 20px 0' }}>
        <Link href="/auth/login" style={{ textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.ink800, border: `1px solid ${c.ink600}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.cream, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Brand + Title */}
      <div style={{ padding: '32px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <BrandLogo size={64} animate />
          <div style={{ fontFamily: displayFont, fontSize: 32, fontWeight: 500, letterSpacing: '-0.025em', color: c.cream }}>
            İyi<span style={{ fontStyle: 'italic', color: c.gold }}>Biri</span>
          </div>
        </div>
        <h1 style={{ margin: 0, fontFamily: displayFont, fontSize: 26, fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.2, color: c.cream }}>
          <span style={{ fontStyle: 'italic', color: c.gold }}>Tanışalım</span> — birkaç bilgi yeter.
        </h1>
        <p style={{ margin: '8px 0 0', fontFamily: uiFont, fontSize: 14, color: c.ink300, lineHeight: 1.55, maxWidth: 320 }}>
          Karma bakiyen ve rozetlerin hep seninle.
        </p>
      </div>

      {/* 3 method eşit priority — sosyal üstte */}
      <div style={{ padding: '32px 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={() => handleOAuthLogin('apple')}
          disabled={!!oauthLoading}
          style={{
            width: '100%', height: 52, borderRadius: 14,
            background: '#000', border: '1px solid #000', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: uiFont, fontSize: 15, fontWeight: 600,
            cursor: oauthLoading ? 'wait' : 'pointer',
            opacity: oauthLoading && oauthLoading !== 'apple' ? 0.5 : 1,
          }}
        >
          <AppleIcon size={18} />
          {oauthLoading === 'apple' ? 'Bağlanıyor…' : 'Apple ile devam et'}
        </button>
        <button
          onClick={() => handleOAuthLogin('google')}
          disabled={!!oauthLoading}
          style={{
            width: '100%', height: 52, borderRadius: 14,
            background: '#fff', border: '1px solid #DADCE0', color: '#1F1F1F',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: uiFont, fontSize: 15, fontWeight: 600,
            cursor: oauthLoading ? 'wait' : 'pointer',
            opacity: oauthLoading && oauthLoading !== 'google' ? 0.5 : 1,
          }}
        >
          <GoogleIcon size={18} />
          {oauthLoading === 'google' ? 'Bağlanıyor…' : 'Google ile devam et'}
        </button>
      </div>

      {oauthError && (
        <p style={{ margin: '12px 24px 0', fontFamily: uiFont, fontSize: 13, color: c.danger, textAlign: 'center' }}>
          {oauthError}
        </p>
      )}

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '24px 24px 0' }}>
        <div style={{ flex: 1, height: 1, background: c.ink600 }} />
        <span style={{ fontFamily: uiFont, fontSize: 11, color: c.ink400, letterSpacing: '.08em', textTransform: 'uppercase' }}>veya e-posta ile</span>
        <div style={{ flex: 1, height: 1, background: c.ink600 }} />
      </div>

      {/* Vol-62-A BUG-066 fix: form id + button form="signup-form" type="submit"
          ile HTML5 form association — hydration-safe. Önceden button "type=button"
          + onClick={handleSignup} dual-binding kullanıyordu, hidrasyon delay'inde
          listener mount olmadan kullanıcı bastığında hiçbir şey olmuyordu (Vol-56-I
          Chrome MCP'de tespit edilmişti, network'e hiç istek gitmiyordu). */}
      <form id="signup-form" onSubmit={handleSignup} style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          aria-label="Ad Soyad"
          style={inputStyle}
          placeholder="Ad Soyad"
          onFocus={(e) => e.target.style.boxShadow = `inset 0 0 0 2px ${c.gold}`}
          onBlur={(e) => e.target.style.boxShadow = 'none'}
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-label="E-posta"
          style={inputStyle}
          placeholder="E-posta adresin"
          onFocus={(e) => e.target.style.boxShadow = `inset 0 0 0 2px ${c.gold}`}
          onBlur={(e) => e.target.style.boxShadow = 'none'}
        />
        <div style={{ position: 'relative' }}>
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            aria-label="Şifre"
            style={{ ...inputStyle, paddingRight: 64 }}
            placeholder="Güçlü bir şifre seç"
            onFocus={(e) => e.target.style.boxShadow = `inset 0 0 0 2px ${c.gold}`}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
          />
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: c.ink300, cursor: 'pointer', padding: '6px 10px', fontFamily: uiFont, fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}
          >
            {showPw ? 'Gizle' : 'Göster'}
          </button>
        </div>
        {/* Strength bars */}
        <div style={{ display: 'flex', gap: 4 }}>
          {strengthColors.map((color, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i < strength ? color : c.ink600 }} />
          ))}
        </div>
        <div style={{ fontFamily: uiFont, fontSize: 11, color: c.ink400, marginTop: -4 }}>
          En az 8 karakter ve 1 rakam olsun.
        </div>

        <label htmlFor="kvkk-consent" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4, cursor: 'pointer' }}>
          <input
            id="kvkk-consent"
            type="checkbox"
            checked={kvkk}
            onChange={(e) => setKvkk(e.target.checked)}
            style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0, cursor: 'pointer', accentColor: c.gold }}
          />
          <span style={{ fontFamily: uiFont, fontSize: 12, color: c.ink200, lineHeight: 1.5 }}>
            <span style={{ color: c.cream, fontWeight: 600 }}>KVKK Aydınlatma Metni</span>&apos;ni okudum, kabul ediyorum. Ara sıra görev önerileri almak da bana uyar.
          </span>
        </label>

        {error && (
          <p style={{ margin: '4px 0 0', fontFamily: uiFont, fontSize: 13, color: c.danger, textAlign: 'center' }}>
            {error}
          </p>
        )}
      </form>

      {/* Footer */}
      <div style={{ padding: '16px 24px calc(env(safe-area-inset-bottom, 20px) + 16px)' }}>
        <button
          type="submit"
          form="signup-form"
          disabled={!kvkk || loading}
          style={{ width: '100%', height: 52, borderRadius: 14, background: kvkk ? c.gold : c.ink700, border: 'none', color: kvkk ? c.ink : c.ink400, fontFamily: uiFont, fontSize: 15, fontWeight: 700, cursor: kvkk ? 'pointer' : 'not-allowed' }}
        >
          {loading ? 'Hesap oluşturuluyor…' : 'Hesabımı oluştur'}
        </button>
        <p style={{ margin: '14px 0 0', fontFamily: uiFont, fontSize: 13, color: c.ink300, textAlign: 'center' }}>
          Hesabın var mı?{' '}
          <Link href="/auth/signin" style={{ color: c.gold, fontWeight: 600, textDecoration: 'none' }}>Giriş yap</Link>
        </p>
      </div>
    </div>
  )
}
