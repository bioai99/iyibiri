'use client'

// app/auth/forgot-password/page.tsx
// Şifremi unuttum akışı — ADR-006 + P0 audit fix (2026-04-24 auth-capacitor)
// Akış: email gir → Supabase resetPasswordForEmail → kullanıcıya onay mesajı

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme'
import { createClient } from '@/lib/supabase/client'
import { BrandLogo } from '@/components/ui/brand-logo'

export default function ForgotPasswordPage() {
  const { colors: c } = useTheme()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayFont = 'var(--font-display), ui-serif, Georgia, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setLoading(false)

    if (error) {
      // Not: güvenlik gereği kullanıcı bilinsin-bilinmesin aynı mesajı göster
      // ama burada network/rate limit hataları için açık geri bildirim
      console.error('Password reset error:', error)
      setError('Bir aksaklık oldu. Bir süre sonra tekrar dene veya destek yaz.')
      return
    }

    setSent(true)
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
      {/* Header — geri butonu */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/auth/signin" style={{ textDecoration: 'none' }}>
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
        <BrandLogo size={36} />
        <div style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 500, letterSpacing: '-0.025em', color: c.cream }}>
          İyi<span style={{ fontStyle: 'italic', color: c.gold }}>Biri</span>
        </div>
      </div>

      {sent ? (
        /* Başarı — email gönderildi */
        <div style={{ padding: '32px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 72, height: 72, borderRadius: '50%',
            background: c.ink800, marginBottom: 24
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={c.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1 style={{ margin: 0, fontFamily: displayFont, fontSize: 28, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.15, color: c.cream }}>
            <span style={{ fontStyle: 'italic', color: c.gold }}>E-postanı</span><br />kontrol et.
          </h1>
          <p style={{ margin: '14px 0 0', fontFamily: uiFont, fontSize: 14, color: c.ink200, lineHeight: 1.6 }}>
            <strong style={{ color: c.cream }}>{email}</strong> adresine şifre sıfırlama linki gönderdik.
            Link <strong style={{ color: c.gold }}>1 saat</strong> geçerli. Gelen kutunu ve spam klasörünü kontrol et.
          </p>

          <div style={{ marginTop: 'auto', padding: '28px 0' }}>
            <Link href="/auth/signin" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', height: 52, borderRadius: 14, background: c.gold, border: 'none', color: c.ink, fontFamily: uiFont, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Giriş ekranına dön
              </button>
            </Link>
            <p style={{ margin: '16px 0 0', fontFamily: uiFont, fontSize: 13, color: c.ink300, textAlign: 'center' }}>
              E-posta gelmedi mi?{' '}
              <button onClick={() => setSent(false)} style={{ background: 'transparent', border: 'none', color: c.gold, fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: uiFont, fontSize: 13 }}>
                Yeniden gönder
              </button>
            </p>
          </div>
        </div>
      ) : (
        /* Form — email input */
        <>
          <div style={{ padding: '32px 24px 0' }}>
            <h1 style={{ margin: 0, fontFamily: displayFont, fontSize: 30, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: c.cream }}>
              <span style={{ fontStyle: 'italic', color: c.gold }}>Şifreni</span><br />unuttun mu?
            </h1>
            <p style={{ margin: '10px 0 0', fontFamily: uiFont, fontSize: 14, color: c.ink300, lineHeight: 1.55 }}>
              E-posta adresini gir, sana bir sıfırlama linki gönderelim.
            </p>
          </div>

          {/* Vol-62-A BUG-066 fix: form id + button form="forgot-form" type="submit" */}
          <form id="forgot-form" onSubmit={handleSubmit} style={{ padding: '28px 24px 0', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
            <div>
              <div style={labelStyle}>E-POSTA</div>
              <div style={inputContainerStyle}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                  placeholder="sen@ornek.com"
                />
              </div>
            </div>

            {error && (
              <p style={{ margin: 0, fontFamily: uiFont, fontSize: 13, color: c.danger, textAlign: 'center' }}>
                {error}
              </p>
            )}
          </form>

          <div style={{ padding: '18px 24px 28px' }}>
            <button
              type="submit"
              form="forgot-form"
              disabled={loading || !email}
              style={{ width: '100%', height: 52, borderRadius: 14, background: c.gold, border: 'none', color: c.ink, fontFamily: uiFont, fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', opacity: loading || !email ? 0.7 : 1 }}
            >
              {loading ? 'Gönderiliyor…' : 'Sıfırlama linki gönder'}
            </button>

            <p style={{ margin: '16px 0 0', fontFamily: uiFont, fontSize: 13, color: c.ink300, textAlign: 'center' }}>
              Hatırladın mı?{' '}
              <Link href="/auth/signin" style={{ color: c.gold, fontWeight: 600, textDecoration: 'none' }}>Giriş yap</Link>
            </p>
          </div>
        </>
      )}
    </div>
  )
}
