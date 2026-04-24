// components/mission/verification-code-input.tsx
//
// Mission verification code field — TR-safe compare.
// UI Spec 2026-04-24 Bölüm 3.6 (verify_method === 'code' variant).
// UX audit K5 + N9 — i/İ keyboard bug + 3x fail help.
//
// Özellikler:
// - Büyük monospace font + letter-spacing
// - Autofocus mount'ta
// - `inputMode="text"`, spellcheck disabled
// - Enter = submit
// - Border animate: idle → focused → success → error
// - 3x yanlış → STK iletişim CTA görünür
// - normalizeVerificationCode ile compare (default locale + İ/ı → I)
// - aria-label + aria-invalid + aria-describedby

'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, AlertCircle, MessageCircle } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { codesMatch } from '@/lib/missions/state'

interface VerificationCodeInputProps {
  /** Beklenen doğru kod — mission.verify_code */
  expectedCode: string
  /** Submit tetiklenince — mevcut kod parametre */
  onSubmit: (code: string) => Promise<void> | void
  /** Server tarafından gelen hata (post-submit, network / 3x mesaj) */
  serverError?: string | null
  /** Görev ipucu — "STK volunteer'ından kodu al" */
  hint?: string | null
  /** STK iletişim — 3x fail sonrası CTA */
  helpContactUrl?: string | null
  /** STK short name — CTA etiketi için */
  ngoShortName?: string
  /** Submitting state dışarıdan kontrol */
  isSubmitting?: boolean
}

type FieldStatus = 'idle' | 'focused' | 'valid' | 'invalid'

export function VerificationCodeInput({
  expectedCode,
  onSubmit,
  serverError = null,
  hint,
  helpContactUrl,
  ngoShortName,
  isSubmitting = false,
}: VerificationCodeInputProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const inputRef = useRef<HTMLInputElement>(null)

  const [code, setCode] = useState('')
  const [failCount, setFailCount] = useState(0)
  const [status, setStatus] = useState<FieldStatus>('idle')
  const [localError, setLocalError] = useState<string | null>(null)

  // Autofocus mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Server error geldiğinde status = invalid
  useEffect(() => {
    if (serverError) {
      setStatus('invalid')
      setLocalError(serverError)
      // Fail counter artırma — server error local kontrol etti anlamına gelir
    }
  }, [serverError])

  const handleSubmit = async () => {
    const trimmed = code.trim()
    if (!trimmed) return

    // 1. Client-side precheck
    if (!codesMatch(trimmed, expectedCode)) {
      const nextFail = failCount + 1
      setFailCount(nextFail)
      setStatus('invalid')
      setLocalError(
        nextFail >= 3
          ? '3 kez yanlış — yardıma ihtiyacın olursa STK ile iletişime geçebilirsin.'
          : 'Kod eşleşmedi. Büyük-küçük harfe dikkat.',
      )
      return
    }

    // 2. Success UX — micro feedback
    setStatus('valid')
    setLocalError(null)

    // 3. Server submit (SuccessCelebration mount parent'ta)
    await onSubmit(trimmed)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const borderColor = (() => {
    switch (status) {
      case 'valid':
        return c.success
      case 'invalid':
        return c.danger
      case 'focused':
        return c.gold
      default:
        return c.ink600
    }
  })()

  const showHelp = failCount >= 3 && helpContactUrl
  const displayError = localError ?? serverError ?? null

  return (
    <div className="space-y-3">
      {/* Hint */}
      {hint && (
        <div
          className="flex items-start gap-2 rounded-xl px-3 py-2.5"
          style={{
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
          }}
        >
          <span
            className="mt-0.5 inline-block flex-shrink-0 rounded-full"
            style={{
              width: 6,
              height: 6,
              background: c.gold,
            }}
            aria-hidden="true"
          />
          <p className="text-[13px] leading-[1.5]" style={{ color: c.ink200 }}>
            {hint}
          </p>
        </div>
      )}

      {/* Input field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          spellCheck={false}
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setStatus('focused')
            setLocalError(null)
          }}
          onFocus={() => setStatus('focused')}
          onBlur={() => {
            if (status === 'focused') setStatus('idle')
          }}
          onKeyDown={handleKey}
          placeholder="DOĞRULAMA KODU"
          aria-label="Doğrulama kodu"
          aria-invalid={status === 'invalid'}
          aria-describedby={displayError ? 'code-error' : undefined}
          disabled={isSubmitting}
          className="w-full rounded-2xl px-4 py-4 text-center font-mono tracking-[0.25em] outline-none transition-colors disabled:opacity-60"
          style={{
            background: c.ink800,
            color: c.cream,
            border: `1.5px solid ${borderColor}`,
            fontSize: 20,
            fontWeight: 600,
          }}
        />

        {/* Success check icon — animate */}
        {status === 'valid' && (
          <motion.div
            initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: c.success }}
            >
              <Check size={16} color="#fff" strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Error message */}
      {displayError && (
        <motion.div
          id="code-error"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 rounded-xl px-3 py-2"
          style={{
            background: `${c.danger}1A`, // 10% alpha
            border: `1px solid ${c.danger}40`,
          }}
          role="alert"
        >
          <AlertCircle
            size={14}
            color={c.danger}
            style={{ marginTop: 2, flexShrink: 0 }}
          />
          <p className="text-[13px] leading-[1.4]" style={{ color: c.danger }}>
            {displayError}
          </p>
        </motion.div>
      )}

      {/* 3x fail help CTA */}
      {showHelp && (
        <motion.a
          href={helpContactUrl!}
          target="_blank"
          rel="noopener noreferrer"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-semibold"
          style={{
            background: c.goldSoft,
            border: `1px solid ${c.goldLine}`,
            color: c.gold,
          }}
        >
          <MessageCircle size={14} />
          {ngoShortName ? `${ngoShortName} ile iletişime geç` : 'STK ile iletişime geç'}
        </motion.a>
      )}

      {/* Submit button */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || !code.trim()}
        whileTap={
          !isSubmitting && code.trim() && !shouldReduceMotion
            ? { scale: 0.97 }
            : undefined
        }
        className="h-[52px] w-full rounded-xl font-bold transition-colors disabled:opacity-50"
        style={{
          background: c.gold,
          color: c.ink,
          fontSize: 15,
          boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          cursor: isSubmitting || !code.trim() ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? 'Doğrulanıyor…' : 'Kodu Doğrula'}
      </motion.button>
    </div>
  )
}
