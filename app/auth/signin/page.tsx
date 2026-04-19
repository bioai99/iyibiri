'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme'
import { createClient } from '@/lib/supabase/client'
import { KarmaToken } from '@/components/ui/ds'

const AppleIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.86-3.08.4-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" />
  </svg>
)

const GoogleIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

export default function SigninPage() {
  const { colors: c } = useTheme()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [oauthError, setOauthError] = useState<string | null>(null)

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
      setOauthError(err?.message || 'Giriş başarısız oldu. Tekrar deneyin.')
      setOauthLoading(null)
    }
  }

  const displayFont = 'var(--font-display), ui-serif, Georgia, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  async function handleLogin(e?: React.FormEvent | React.MouseEvent) {
    e?.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error, data } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    console.log('Login result:', { error, session: data?.session ? 'exists' : 'null', user: data?.user?.email })
    if (error) {
      console.error('Login error details:', error.message, error.status, error.name)
      const msg = error.message.toLowerCase()
      if (msg.includes('email not confirmed')) {
        setError('E-postanı onaylaman gerekiyor. Gelen kutunu kontrol et.')
      } else {
        setError(`E-posta veya şifre hatalı (${error.message})`)
      }
      setLoading(false)
      return
    }
    setLoading(false)
    router.push('/dashboard')
    router.refresh()
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: uiFont, fontSize: 11, fontWeight: 600, color: c.ink300,
    letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6,
  }
  const inputContainerStyle: React.CSSProperties = {
    background: c.ink800, border: `1px solid ${c.ink600}`, borderRadius: 12,
    display: 'flex', alignItems: 'center',
  }
  const inputStyle: React.CSSProperties = {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    padding: '14px', fontFamily: uiFont, fontSize: 15, color: c.cream, fontWeight: 500,
  }

  return (
    <div style={{ background: c.ink900, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/auth/login" style={{ textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.ink800, border: `1px solid ${c.ink600}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.cream, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
        </Link>
        <div style={{ flex: 1 }} />
      </div>

      {/* Brand mark */}
      <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <KarmaToken size={44} />
        <div style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 500, letterSpacing: '-0.025em', color: c.cream }}>
          İyi<span style={{ fontStyle: 'italic', color: c.gold }}>Biri</span>
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: '32px 24px 0' }}>
        <h1 style={{ margin: 0, fontFamily: displayFont, fontSize: 30, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: c.cream }}>
          <span style={{ fontStyle: 'italic', color: c.gold }}>Tekrar</span><br />hoş geldin.
        </h1>
        <p style={{ margin: '10px 0 0', fontFamily: uiFont, fontSize: 14, color: c.ink300, lineHeight: 1.55 }}>
          Devam eden görevlerin seni bekliyor.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} style={{ padding: '28px 24px 0', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {/* Email */}
        <div>
          <div style={labelStyle}>E-POSTA</div>
          <div style={inputContainerStyle}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
              placeholder="ornek@mail.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: uiFont, fontSize: 11, fontWeight: 600, color: c.ink300, letterSpacing: '.06em', textTransform: 'uppercase' }}>ŞİFRE</span>
            <span style={{ fontFamily: uiFont, fontSize: 11, fontWeight: 600, color: c.gold, cursor: 'pointer' }}>Şifremi unuttum</span>
          </div>
          <div style={inputContainerStyle}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="Şifreniz"
            />
            <button
              type="button"
              onClick={() => setShowPw(s => !s)}
              style={{ background: 'transparent', border: 'none', color: c.ink300, cursor: 'pointer', padding: '0 12px', fontFamily: uiFont, fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}
            >
              {showPw ? 'Gizle' : 'Göster'}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div
            onClick={() => setRemember(r => !r)}
            style={{ width: 20, height: 20, borderRadius: 6, background: remember ? c.gold : 'transparent', border: `1.5px solid ${remember ? c.gold : c.ink500}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
          >
            {remember && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#241E18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </div>
          <span style={{ fontFamily: uiFont, fontSize: 13, color: c.ink200 }}>Beni hatırla</span>
        </label>

        {error && (
          <p style={{ margin: 0, fontFamily: uiFont, fontSize: 13, color: c.danger, textAlign: 'center' }}>
            {error}
          </p>
        )}
      </form>

      {/* Footer */}
      <div style={{ padding: '18px 24px 28px' }}>
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', height: 52, borderRadius: 14, background: c.gold, border: 'none', color: '#241E18', fontFamily: uiFont, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 1px 2px rgba(26,22,18,.3), inset 0 1px 0 rgba(255,255,255,.3)' }}
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş yap →'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 12px' }}>
          <div style={{ flex: 1, height: 1, background: c.ink600 }} />
          <span style={{ fontFamily: uiFont, fontSize: 11, color: c.ink400, letterSpacing: '.08em', textTransform: 'uppercase' }}>veya</span>
          <div style={{ flex: 1, height: 1, background: c.ink600 }} />
        </div>

        {/* Social compact row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => handleOAuthLogin('apple')}
            disabled={!!oauthLoading}
            style={{ flex: 1, height: 48, borderRadius: 12, background: c.ink800, border: `1px solid ${c.ink600}`, color: c.cream, cursor: oauthLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: uiFont, fontSize: 13, fontWeight: 600, opacity: oauthLoading && oauthLoading !== 'apple' ? 0.5 : 1 }}
          >
            <AppleIcon size={16} /> {oauthLoading === 'apple' ? 'Bağlanıyor...' : 'Apple'}
          </button>
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={!!oauthLoading}
            style={{ flex: 1, height: 48, borderRadius: 12, background: c.ink800, border: `1px solid ${c.ink600}`, color: c.cream, cursor: oauthLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: uiFont, fontSize: 13, fontWeight: 600, opacity: oauthLoading && oauthLoading !== 'google' ? 0.5 : 1 }}
          >
            <GoogleIcon size={16} /> {oauthLoading === 'google' ? 'Bağlanıyor...' : 'Google'}
          </button>
        </div>

        {oauthError && (
          <p style={{ margin: '12px 0 0', fontFamily: uiFont, fontSize: 13, color: '#C8553D', textAlign: 'center' }}>
            {oauthError}
          </p>
        )}

        <p style={{ margin: '16px 0 0', fontFamily: uiFont, fontSize: 13, color: c.ink300, textAlign: 'center' }}>
          Hesabın yok mu?{' '}
          <Link href="/auth/signup" style={{ color: c.gold, fontWeight: 600, textDecoration: 'none' }}>Kayıt ol</Link>
        </p>
      </div>
    </div>
  )
}
