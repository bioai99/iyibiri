'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/lib/theme'
import { createClient } from '@/lib/supabase/client'

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyPageFallback />}>
      <VerifyContent />
    </Suspense>
  )
}

function VerifyPageFallback() {
  const { colors: c } = useTheme()
  return <div style={{ background: c.ink900, minHeight: '100vh' }} />
}

function VerifyContent() {
  const { colors: c } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  // Dynamic OTP length: default 6, but allow 6-10 (defensive for backend config changes)
  const OTP_LENGTH = Number(process.env.NEXT_PUBLIC_OTP_LENGTH ?? 6)
  const [otpLength, setOtpLength] = useState(OTP_LENGTH)
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [countdown, setCountdown] = useState(60)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resent, setResent] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const filled = digits.filter(Boolean).length
  const code = digits.join('')

  const displayFont = 'var(--font-display), ui-serif, Georgia, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'
  const monoFont = 'ui-monospace, SFMono-Regular, Menlo, monospace'

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // Auto-submit when all digits are filled (dynamic length)
  useEffect(() => {
    if (filled === otpLength && otpLength > 0) handleVerify()
  }, [filled, otpLength])

  function handleDigitChange(index: number, value: string) {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)
    setError(null)
    if (char && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) return

    // Auto-detect length if pasted code is 6-10 digits (defensive for backend config)
    const detectedLength = Math.max(Math.min(pasted.length, 10), 6)
    if (detectedLength !== otpLength) {
      setOtpLength(detectedLength)
    }

    const sliced = pasted.slice(0, detectedLength)
    const next = Array(detectedLength).fill('')
    for (let i = 0; i < detectedLength; i++) {
      next[i] = sliced[i] || ''
    }
    setDigits(next)
    setError(null)
    const lastFilled = Math.min(sliced.length, detectedLength - 1)
    inputRefs.current[lastFilled]?.focus()
  }

  async function handleVerify() {
    if (code.length < otpLength || loading) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    })

    if (error) {
      setError('Bu kod çalışmadı. Yeni bir kod almayı dene.')
      setDigits(Array(otpLength).fill(''))
      inputRefs.current[0]?.focus()
      setLoading(false)
      return
    }

    setLoading(false)
    // Onboarding zaten yapıldıysa (localStorage'da veri varsa) dashboard'a git
    // Yapılmadıysa onboarding'e yönlendir
    const hasOnboarding = localStorage.getItem('iyibiri_onboarding_interests')
    router.push(hasOnboarding ? '/dashboard' : '/onboarding/welcome')
  }

  async function handleResend() {
    if (countdown > 0) return
    const supabase = createClient()
    await supabase.auth.resend({ type: 'signup', email })
    setCountdown(60)
    setResent(true)
    setTimeout(() => setResent(false), 3000)
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // Redirect if no email provided
  if (!email) {
    return (
      <div style={{ background: c.ink900, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: c.ink300, fontFamily: uiFont }}>
          E-posta adresi bulunamadı.{' '}
          <Link href="/auth/signup" style={{ color: c.gold }}>Kayıt ol</Link>
        </p>
      </div>
    )
  }

  return (
    <div style={{ background: c.ink900, minHeight: '100vh', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>

      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.ink800, border: `1px solid ${c.ink600}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.cream, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
        </Link>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: uiFont, fontSize: 13, fontWeight: 600, color: c.ink200 }}>E-posta doğrulama</div>
        <div style={{ width: 36 }} />
      </div>

      {/* Icon */}
      <div style={{ padding: '40px 24px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${c.gold}, ${c.goldDim})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(232,194,104,.25), inset 0 1px 0 rgba(255,255,255,.3)',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3E2F14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: '22px 28px 0', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontFamily: displayFont, fontSize: 26, fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.15, color: c.cream }}>
          E-postana <span style={{ fontStyle: 'italic', color: c.gold }}>kod gönderdik</span>
        </h1>
        <p style={{ margin: '10px 0 0', fontFamily: uiFont, fontSize: 13, color: c.ink300, lineHeight: 1.55 }}>
          <span style={{ color: c.cream, fontWeight: 600 }}>{email}</span> adresine gelen 6 haneli kodu gir.
        </p>
      </div>

      {/* OTP inputs (dynamic length 6-10, default from env) */}
      <div style={{ padding: '36px 20px 0', display: 'flex', justifyContent: 'center', gap: 8 }}>
        {digits.map((d, i) => {
          const isActive = i === filled && !d
          const isFilled = Boolean(d)
          return (
            <div
              key={i}
              style={{
                width: 46, height: 58, borderRadius: 12, position: 'relative',
                background: isFilled ? c.ink800 : c.ink900,
                border: `1.5px solid ${isFilled ? c.gold : isActive ? c.goldLine : c.ink600}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isActive ? `0 0 0 4px ${c.goldSoft}` : 'none',
                transition: 'all .15s ease',
              }}
            >
              <input
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigitChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: monoFont, fontSize: 24, fontWeight: 700, color: c.cream,
                  letterSpacing: '-0.02em', textAlign: 'center', caretColor: 'transparent',
                }}
              />
              {!d && isActive && (
                <div style={{ width: 2, height: 22, background: c.gold, animation: 'blink 1s step-start infinite', pointerEvents: 'none' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Error */}
      {error && (
        <p style={{ margin: '16px 24px 0', fontFamily: uiFont, fontSize: 13, color: c.danger, textAlign: 'center' }}>
          {error}
        </p>
      )}

      {/* Resend */}
      <div style={{ padding: '28px 24px 0', textAlign: 'center' }}>
        {resent ? (
          <div style={{ fontFamily: uiFont, fontSize: 13, color: c.gold, fontWeight: 600 }}>
            Kod tekrar gönderildi
          </div>
        ) : (
          <>
            <div style={{ fontFamily: uiFont, fontSize: 13, color: c.ink300 }}>
              Kod gelmedi mi?{' '}
              {countdown > 0 && <span style={{ color: c.ink400 }}>{formatTime(countdown)}</span>}
            </div>
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              style={{ marginTop: 10, background: 'transparent', border: 'none', color: countdown > 0 ? c.ink500 : c.gold, fontFamily: uiFont, fontSize: 13, fontWeight: 600, cursor: countdown > 0 ? 'not-allowed' : 'pointer' }}
            >
              Tekrar gönder
            </button>
          </>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{ padding: '18px 24px 28px' }}>
        <button
          onClick={handleVerify}
          disabled={filled < otpLength || loading}
          style={{ width: '100%', height: 52, borderRadius: 14, background: filled === otpLength ? c.gold : c.ink700, border: 'none', color: filled === otpLength ? c.ink100 : c.ink400, fontFamily: uiFont, fontSize: 15, fontWeight: 700, cursor: filled === otpLength ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: filled === otpLength ? '0 1px 2px rgba(26,22,18,.3), inset 0 1px 0 rgba(255,255,255,.3)' : 'none' }}
        >
          {loading ? 'Doğrulanıyor...' : 'Doğrula'}
        </button>
        <p style={{ margin: '14px 0 0', fontFamily: uiFont, fontSize: 11, color: c.ink400, textAlign: 'center', lineHeight: 1.5 }}>
          Farklı bir{' '}
          <Link href="/auth/signup" style={{ color: c.gold, fontWeight: 600, textDecoration: 'none' }}>e-posta</Link>
          {' '}kullanmak ister misin?
        </p>
      </div>
    </div>
  )
}
