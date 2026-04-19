'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme'
import { createClient } from '@/lib/supabase/client'

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

  const strength = getPasswordStrength(password)
  const strengthColors = [c.gold, c.gold, c.goldDim, c.ink600]

  const displayFont = 'var(--font-display), ui-serif, Georgia, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!kvkk) return
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('already registered') || msg.includes('already exists')) {
        setError('Bu e-posta adresi zaten kayıtlı')
      } else if (msg.includes('password')) {
        setError('Şifre en az 6 karakter olmalı')
      } else {
        setError('Kayıt olunamadı, tekrar dene')
      }
      setLoading(false)
      return
    }
    setLoading(false)
    router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
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
    <div style={{ background: c.ink900, minHeight: '100vh', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/auth/login" style={{ textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.ink800, border: `1px solid ${c.ink600}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.cream, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
        </Link>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: uiFont, fontSize: 13, fontWeight: 600, color: c.ink200 }}>1 / 5 · Hesap</div>
        <div style={{ width: 36 }} />
      </div>

      {/* Title */}
      <div style={{ padding: '28px 24px 0' }}>
        <h1 style={{ margin: 0, fontFamily: displayFont, fontSize: 28, fontWeight: 400, letterSpacing: '-0.028em', lineHeight: 1.1, color: c.cream }}>
          <span style={{ fontStyle: 'italic', color: c.gold }}>Tanışalım</span> —<br />birkaç bilgi yeter.
        </h1>
        <p style={{ margin: '8px 0 0', fontFamily: uiFont, fontSize: 13, color: c.ink300, lineHeight: 1.55 }}>
          Hesabını oluşturduğunda, Karma bakiyen ve aldığın rozetler seninle kalır.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignup} style={{ padding: '24px 24px 0', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {/* Name */}
        <div>
          <div style={labelStyle}>AD SOYAD</div>
          <div style={inputContainerStyle}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={inputStyle}
              placeholder="Adın Soyadın"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <div style={labelStyle}>E-POSTA</div>
          <div style={inputContainerStyle}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="ornek@mail.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div style={labelStyle}>ŞİFRE</div>
          <div style={inputContainerStyle}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="En az 8 karakter"
            />
            <button
              type="button"
              onClick={() => setShowPw(s => !s)}
              style={{ background: 'transparent', border: 'none', color: c.ink300, cursor: 'pointer', paddingRight: 12, fontFamily: uiFont, fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}
            >
              {showPw ? 'Gizle' : 'Göster'}
            </button>
          </div>
        </div>

        {/* Password strength bars */}
        <div style={{ display: 'flex', gap: 4, marginTop: -6 }}>
          {strengthColors.map((color, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i < strength ? color : c.ink600, opacity: i === 2 && strength < 3 ? 1 : 1 }} />
          ))}
        </div>
        <div style={{ fontFamily: uiFont, fontSize: 11, color: c.ink400, marginTop: -8 }}>
          En az 8 karakter, 1 rakam. Güçlü şifre.
        </div>

        {/* KVKK checkbox */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4, cursor: 'pointer' }}>
          <div
            onClick={() => setKvkk(k => !k)}
            style={{ width: 22, height: 22, borderRadius: 7, marginTop: 1, background: kvkk ? c.gold : 'transparent', border: `1.5px solid ${kvkk ? c.gold : c.ink500}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
          >
            {kvkk && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#241E18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </div>
          <span style={{ fontFamily: uiFont, fontSize: 12, color: c.ink200, lineHeight: 1.5 }}>
            <span style={{ color: c.cream, fontWeight: 600 }}>KVKK Aydınlatma Metni</span>'ni okudum, kabul ediyorum. E-posta ile ara sıra ilham verici görevler almayı kabul ediyorum.
          </span>
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
          type="button"
          onClick={handleSignup}
          disabled={!kvkk || loading}
          style={{ width: '100%', height: 52, borderRadius: 14, background: kvkk ? c.gold : c.ink700, border: 'none', color: kvkk ? '#241E18' : c.ink400, fontFamily: uiFont, fontSize: 15, fontWeight: 700, cursor: kvkk ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: kvkk ? '0 1px 2px rgba(26,22,18,.3), inset 0 1px 0 rgba(255,255,255,.3)' : 'none' }}
        >
          {loading ? 'Hesap oluşturuluyor...' : 'Hesabımı oluştur →'}
        </button>
        <div style={{ marginTop: 16 }}>
          {/* Progress dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ width: i === 0 ? 18 : 6, height: 3, borderRadius: 999, background: i === 0 ? c.gold : c.ink600, transition: 'width .2s ease' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
