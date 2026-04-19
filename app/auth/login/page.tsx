'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { BrandLogo } from '@/components/ui/brand-logo'
import { createClient } from '@/lib/supabase/client'

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

const MailIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export default function AuthLandingPage() {
  const { colors: c } = useTheme()
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
      setOauthError(err?.message || 'Bir şeyler ters gitti. Tekrar dener misin?')
      setOauthLoading(null)
    }
  }

  const displayFont = 'var(--font-display), ui-serif, Georgia, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  return (
    <div style={{ background: c.ink900, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Compact hero */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', flex: '0 0 auto',
        padding: 'calc(env(safe-area-inset-top, 20px) + 48px) 28px 24px',
      }}>
        <BrandLogo size={80} animate showWordmark />

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            margin: '24px 0 0', fontFamily: displayFont, fontSize: 28, fontWeight: 400,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: c.cream, textAlign: 'center',
          }}
        >
          Her iyilik <em style={{ fontStyle: 'italic', color: c.gold }}>fark</em> yaratır.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            margin: '8px 0 0', fontFamily: uiFont, fontSize: 14,
            lineHeight: 1.55, color: c.ink300, textAlign: 'center',
          }}
        >
          Gönüllülerin buluşma noktasına hoş geldin.
        </motion.p>
      </div>

      {/* Action section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 28px calc(env(safe-area-inset-bottom, 16px) + 16px)' }}>
        {/* Social buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <button
            onClick={() => handleOAuthLogin('apple')}
            disabled={!!oauthLoading}
            style={{ width: '100%', height: 52, borderRadius: 14, background: c.ink800, border: `1px solid ${c.ink600}`, color: c.cream, fontFamily: uiFont, fontSize: 15, fontWeight: 600, cursor: oauthLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: oauthLoading && oauthLoading !== 'apple' ? 0.5 : 1 }}
          >
            <AppleIcon size={18} /> {oauthLoading === 'apple' ? 'Bağlanıyor...' : 'Apple ile devam et'}
          </button>
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={!!oauthLoading}
            style={{ width: '100%', height: 52, borderRadius: 14, background: c.ink800, border: `1px solid ${c.ink600}`, color: c.cream, fontFamily: uiFont, fontSize: 15, fontWeight: 600, cursor: oauthLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: oauthLoading && oauthLoading !== 'google' ? 0.5 : 1 }}
          >
            <GoogleIcon size={18} /> {oauthLoading === 'google' ? 'Bağlanıyor...' : 'Google ile devam et'}
          </button>
        </motion.div>

        {oauthError && (
          <p style={{ margin: '12px 0 0', fontFamily: uiFont, fontSize: 13, color: c.danger, textAlign: 'center', lineHeight: 1.4 }}>
            {oauthError}
          </p>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 14px' }}>
          <div style={{ flex: 1, height: 1, background: c.ink600 }} />
          <span style={{ fontFamily: uiFont, fontSize: 11, color: c.ink400, letterSpacing: '.08em', textTransform: 'uppercase' }}>veya</span>
          <div style={{ flex: 1, height: 1, background: c.ink600 }} />
        </div>

        {/* Email CTA */}
        <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
          <button style={{ width: '100%', height: 52, borderRadius: 14, background: c.gold, border: 'none', color: c.ink, fontFamily: uiFont, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
            <MailIcon size={16} /> E-posta ile kayıt ol
          </button>
        </Link>

        {/* Sign-in link */}
        <p style={{ margin: '18px 0 0', fontFamily: uiFont, fontSize: 13, color: c.ink300, textAlign: 'center' }}>
          Zaten üye misin?{' '}
          <Link href="/auth/signin" style={{ color: c.gold, fontWeight: 600, textDecoration: 'none' }}>Giriş yap</Link>
        </p>

        {/* Legal micro-copy */}
        <p style={{ margin: '14px 0 0', fontFamily: uiFont, fontSize: 10.5, color: c.ink400, textAlign: 'center', lineHeight: 1.5 }}>
          Devam ederek{' '}
          <span style={{ textDecoration: 'underline' }}>Kullanım Koşulları</span>'nı ve{' '}
          <span style={{ textDecoration: 'underline' }}>Gizlilik Politikası</span>'nı kabul etmiş olursun.
        </p>
      </div>
    </div>
  )
}
