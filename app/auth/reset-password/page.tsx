'use client'

// app/auth/reset-password/page.tsx
// Email'deki reset linkinden gelen kullanıcı için yeni şifre belirleme.
// Supabase auth.updateUser({ password }) — token URL hash'inden parse edilir.
// 2026-04-24 auth-capacitor

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme'
import { createClient } from '@/lib/supabase/client'
import { BrandLogo } from '@/components/ui/brand-logo'

function getPasswordStrength(password: string): number {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  return score
}

export default function ResetPasswordPage() {
  const { colors: c } = useTheme()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const strength = getPasswordStrength(password)
  const strengthLabels = ['Zayıf', 'Orta', 'İyi', 'Güçlü']

  const displayFont = 'var(--font-display), ui-serif, Georgia, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password) return

    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalı.')
      return
    }

    if (password !== confirm) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    // Supabase session token'ı URL hash'inden otomatik parse eder (resetPasswordForEmail akışı).
    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      console.error('Password update error:', error)
      const msg = error.message.toLowerCase()
      if (msg.includes('session') || msg.includes('token') || msg.includes('expired')) {
        setError('Sıfırlama linki süresi dolmuş veya geçersiz. Yeniden link iste.')
      } else {
        setError('Şifre güncellenemedi. Tekrar dener misin?')
      }
      return
    }

    setSuccess(true)
    // 2 saniye sonra signin'e yönlendir
    setTimeout(() => {
      router.push('/auth/signin?reset=success')
    }, 2000)
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

      {success ? (
        /* Başarı — şifre güncellendi */
        <div style={{ padding: '32px 24px 0', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 72, height: 72, borderRadius: '50%',
            background: c.gold, marginTop: 24, marginBottom: 24
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={c.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 style={{ margin: 0, fontFamily: displayFont, fontSize: 28, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.15, color: c.cream, textAlign: 'center' }}>
            <span style={{ fontStyle: 'italic', color: c.gold }}>Şifren</span><br />güncellendi.
          </h1>
          <p style={{ margin: '14px 0 0', fontFamily: uiFont, fontSize: 14, color: c.ink200, textAlign: 'center' }}>
            Giriş ekranına yönlendiriliyorsun...
          </p>
        </div>
      ) : (
        /* Form — yeni şifre */
        <>
          <div style={{ padding: '32px 24px 0' }}>
            <h1 style={{ margin: 0, fontFamily: displayFont, fontSize: 30, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: c.cream }}>
              <span style={{ fontStyle: 'italic', color: c.gold }}>Yeni</span><br />şifre belirle.
            </h1>
            <p style={{ margin: '10px 0 0', fontFamily: uiFont, fontSize: 14, color: c.ink300, lineHeight: 1.55 }}>
              En az 8 karakter. Rakam ve özel karakter önerilir.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '28px 24px 0', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
            {/* Yeni şifre */}
            <div>
              <div style={labelStyle}>YENİ ŞİFRE</div>
              <div style={inputContainerStyle}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoFocus
                  minLength={8}
                  style={inputStyle}
                  placeholder="Yeni şifren"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  style={{ background: 'transparent', border: 'none', color: c.ink300, cursor: 'pointer', padding: '0 12px', fontFamily: uiFont, fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}
                >
                  {showPw ? 'Gizle' : 'Göster'}
                </button>
              </div>
              {password.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 3, flex: 1 }}>
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: i < strength ? c.gold : c.ink600,
                      }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: uiFont, fontSize: 11, color: c.ink300, minWidth: 42 }}>
                    {strength > 0 ? strengthLabels[strength - 1] : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Şifre tekrar */}
            <div>
              <div style={labelStyle}>ŞİFRE TEKRAR</div>
              <div style={inputContainerStyle}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                  placeholder="Yeni şifren (tekrar)"
                />
              </div>
              {confirm.length > 0 && password !== confirm && (
                <p style={{ margin: '6px 0 0', fontFamily: uiFont, fontSize: 12, color: c.danger }}>
                  Şifreler eşleşmiyor
                </p>
              )}
            </div>

            {error && (
              <p style={{ margin: 0, fontFamily: uiFont, fontSize: 13, color: c.danger, textAlign: 'center' }}>
                {error}
              </p>
            )}
          </form>

          <div style={{ padding: '18px 24px 28px' }}>
            <button
              onClick={handleSubmit as any}
              disabled={loading || !password || !confirm || password !== confirm}
              style={{ width: '100%', height: 52, borderRadius: 14, background: c.gold, border: 'none', color: c.ink, fontFamily: uiFont, fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', opacity: loading || !password || !confirm || password !== confirm ? 0.6 : 1 }}
            >
              {loading ? 'Güncelleniyor...' : 'Şifreyi güncelle'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
