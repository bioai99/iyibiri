// components/mission/verification-panel.tsx
//
// Mission verification container — 4 variant (auto / code / photo / qr) tek component.
// UX audit K2 + N4 + İ4 + İ6 — verification-client.tsx light tema tier-1 killer bug FIX.
// UI Spec 2026-04-24 Bölüm 3.6 — verifying state visual contract + motion.
//
// Variants:
// - auto   → Tek "Tamamladım" butonu + confirm dialog (dürüst beyan uyarısı)
// - code   → VerificationCodeInput (ayrı component)
// - photo  → File picker + preview + upload progress + size/type validation
// - qr     → QRScanner + fallback "Manuel kod gir" collapse
//
// Dark tema Premium × Warm, sadece `useTheme()` renk kaynağı.
// Confetti + Karma count-up + haptic parent (page client) mount eder — burada sadece verify yapar.

'use client'

import { useState, type ChangeEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Check,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  QrCode,
  Keyboard,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { QRScanner } from '@/components/ui/qr-scanner'
import { VerificationCodeInput } from './verification-code-input'
import type { VerificationData } from '@/lib/missions/actions'
import { codesMatch } from '@/lib/missions/state'
import { missionErrorMessage, type MissionErrorCode } from '@/lib/missions/error-codes'

/* ─────────────────────────────────────────────────────────────
 *  Types
 * ───────────────────────────────────────────────────────────── */

interface VerificationPanelProps {
  method: 'auto' | 'code' | 'photo' | 'qr'
  missionTitle: string
  missionKarma: number
  expectedCode?: string | null
  hint?: string | null
  helpContactUrl?: string | null
  ngoShortName?: string
  /** Photo upload için — storage path builder (userId/missionId injected by parent) */
  onPhotoUpload?: (file: File) => Promise<{ path: string } | { error: string }>
  /** Verify tetiklenince — doğrulama datası ile */
  onVerify: (data: VerificationData) => Promise<void>
  isSubmitting?: boolean
  /** Parent server error (network vs) */
  serverError?: string | null
}

/* ─────────────────────────────────────────────────────────────
 *  Constants
 * ───────────────────────────────────────────────────────────── */

const PHOTO_MAX_BYTES = 5 * 1024 * 1024 // 5MB
const PHOTO_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/* ─────────────────────────────────────────────────────────────
 *  Ana panel
 * ───────────────────────────────────────────────────────────── */

export function VerificationPanel(props: VerificationPanelProps) {
  const { colors: c } = useTheme()

  return (
    <div className="space-y-4">
      {/* Karma reward preview */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: c.ink800,
          border: `1px solid ${c.goldLine}`,
        }}
      >
        <div
          className="text-[11px] font-bold uppercase"
          style={{ color: c.ink300, letterSpacing: '0.14em' }}
        >
          Kazanacağın
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span
            className="font-display tabular-nums"
            style={{
              color: c.gold,
              fontSize: 32,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            +{props.missionKarma}
          </span>
          <span
            className="text-[13px] font-semibold uppercase"
            style={{ color: c.gold, letterSpacing: '0.06em' }}
          >
            Karma
          </span>
        </div>
      </div>

      {/* Method-spesifik panel */}
      {props.method === 'auto' && <AutoPanel {...props} />}
      {props.method === 'code' && <CodePanel {...props} />}
      {props.method === 'photo' && <PhotoPanel {...props} />}
      {props.method === 'qr' && <QrPanel {...props} />}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  Variant 1: auto — tek tık tamamlama + dürüst beyan confirm
 * ───────────────────────────────────────────────────────────── */

function AutoPanel({
  missionTitle,
  hint,
  onVerify,
  isSubmitting,
  serverError,
}: VerificationPanelProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirm = async () => {
    setShowConfirm(false)
    await onVerify({ method: 'auto' })
  }

  if (showConfirm) {
    return (
      <div
        className="rounded-2xl p-5"
        style={{
          background: c.ink800,
          border: `1.5px solid ${c.goldLine}`,
        }}
      >
        <h3
          className="font-display text-[18px] font-semibold"
          style={{ color: c.cream, letterSpacing: '-0.01em' }}
        >
          Görevi gerçekten tamamladın mı?
        </h3>
        <p className="mt-2 text-[13px] leading-[1.5]" style={{ color: c.ink200 }}>
          <span style={{ color: c.cream }}>{missionTitle}</span> — dürüst beyan
          Karma ekosisteminin temeli. Yanlış beyan Karma geri alınmasına yol açar.
        </p>
        <div className="mt-5 flex gap-2">
          <motion.button
            type="button"
            onClick={handleConfirm}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            className="h-11 flex-1 rounded-xl font-bold"
            style={{ background: c.gold, color: c.ink, fontSize: 14 }}
          >
            Evet, tamamladım
          </motion.button>
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="h-11 flex-1 rounded-xl font-semibold"
            style={{
              background: 'transparent',
              color: c.cream,
              border: `1.5px solid ${c.ink600}`,
              fontSize: 14,
            }}
          >
            Geri
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {hint && <HintCard text={hint} />}
      <motion.button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={isSubmitting}
        whileTap={
          !isSubmitting && !shouldReduceMotion ? { scale: 0.97 } : undefined
        }
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl font-bold disabled:opacity-50"
        style={{
          background: c.gold,
          color: c.ink,
          fontSize: 15,
          boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        <CheckCircle2 size={18} />
        {isSubmitting ? 'Tamamlanıyor…' : 'Görevi Tamamladım'}
      </motion.button>
      {serverError && <ErrorBanner text={serverError} />}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  Variant 2: code — TR-safe text input
 * ───────────────────────────────────────────────────────────── */

function CodePanel({
  expectedCode,
  hint,
  helpContactUrl,
  ngoShortName,
  onVerify,
  isSubmitting,
  serverError,
}: VerificationPanelProps) {
  if (!expectedCode) {
    return <ErrorBanner text="Bu görev için kod yapılandırılmamış." />
  }

  return (
    <VerificationCodeInput
      expectedCode={expectedCode}
      hint={hint}
      helpContactUrl={helpContactUrl}
      ngoShortName={ngoShortName}
      isSubmitting={isSubmitting}
      serverError={serverError}
      onSubmit={(code) => onVerify({ method: 'code', code_entered: code })}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
 *  Variant 3: photo — file picker + preview + upload
 * ───────────────────────────────────────────────────────────── */

function PhotoPanel({
  hint,
  onPhotoUpload,
  onVerify,
  isSubmitting,
  serverError,
}: VerificationPanelProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [localError, setLocalError] = useState<MissionErrorCode | null>(null)
  const [uploading, setUploading] = useState(false)

  const handlePick = (ev: ChangeEvent<HTMLInputElement>) => {
    const picked = ev.target.files?.[0] ?? null
    setLocalError(null)
    if (!picked) {
      setFile(null)
      setPreviewUrl(null)
      return
    }
    if (!PHOTO_ACCEPTED_TYPES.includes(picked.type)) {
      setLocalError('PHOTO_INVALID_TYPE')
      setFile(null)
      setPreviewUrl(null)
      return
    }
    if (picked.size > PHOTO_MAX_BYTES) {
      setLocalError('PHOTO_TOO_LARGE')
      setFile(null)
      setPreviewUrl(null)
      return
    }
    setFile(picked)
    setPreviewUrl(URL.createObjectURL(picked))
  }

  const handleSubmit = async () => {
    if (!file) return
    if (!onPhotoUpload) {
      setLocalError('PHOTO_UPLOAD_FAILED')
      return
    }
    setUploading(true)
    const res = await onPhotoUpload(file)
    setUploading(false)
    if ('error' in res) {
      setLocalError('PHOTO_UPLOAD_FAILED')
      return
    }
    await onVerify({ method: 'photo', photo_path: res.path })
  }

  const errorText = localError
    ? missionErrorMessage(localError)
    : serverError ?? null

  const busy = uploading || isSubmitting

  return (
    <div className="space-y-3">
      {hint && <HintCard text={hint} />}

      {/* File picker / preview */}
      <label className="block">
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-2xl p-6 text-center transition-colors"
          style={{
            background: c.ink800,
            border: `1.5px dashed ${file ? c.success : c.ink500}`,
            aspectRatio: previewUrl ? 'auto' : '16/10',
            cursor: 'pointer',
          }}
        >
          {previewUrl ? (
            <div className="w-full space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Yüklenecek fotoğraf"
                className="mx-auto max-h-[240px] rounded-xl object-cover"
              />
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{
                  background: `${c.success}1A`,
                  color: c.success,
                }}
              >
                <Check size={12} />
                <span className="text-[12px] font-semibold">
                  Fotoğraf seçildi · değiştir
                </span>
              </div>
            </div>
          ) : (
            <>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: c.goldSoft }}
              >
                <Camera size={22} color={c.gold} />
              </div>
              <div
                className="text-[15px] font-semibold"
                style={{ color: c.cream }}
              >
                Fotoğraf seç veya çek
              </div>
              <div className="text-[11px]" style={{ color: c.ink400 }}>
                JPG / PNG / WEBP · maks 5 MB
              </div>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="hidden"
          onChange={handlePick}
          disabled={busy}
        />
      </label>

      {errorText && <ErrorBanner text={errorText} />}

      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={!file || busy}
        whileTap={
          file && !busy && !shouldReduceMotion ? { scale: 0.97 } : undefined
        }
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl font-bold disabled:opacity-50"
        style={{
          background: c.gold,
          color: c.ink,
          fontSize: 15,
          boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          cursor: !file || busy ? 'not-allowed' : 'pointer',
        }}
      >
        {uploading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            >
              <Loader2 size={16} />
            </motion.span>
            Yükleniyor…
          </>
        ) : isSubmitting ? (
          'Doğrulanıyor…'
        ) : (
          'Fotoğrafı Gönder'
        )}
      </motion.button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  Variant 4: qr — scanner + manual fallback
 * ───────────────────────────────────────────────────────────── */

function QrPanel({
  expectedCode,
  hint,
  helpContactUrl,
  ngoShortName,
  onVerify,
  isSubmitting,
  serverError,
}: VerificationPanelProps) {
  const { colors: c } = useTheme()
  const [fallback, setFallback] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)

  const handleScan = async (result: string) => {
    if (!expectedCode || !codesMatch(result, expectedCode)) {
      setScanError('Bu QR başka bir göreve ait görünüyor.')
      return
    }
    setScanError(null)
    await onVerify({ method: 'qr', qr_scanned: result })
  }

  if (fallback) {
    return (
      <div className="space-y-3">
        {hint && <HintCard text={hint} />}
        <VerificationCodeInput
          expectedCode={expectedCode ?? ''}
          hint="QR taranamıyor — yetkili senin için kodu söyleyebilir."
          helpContactUrl={helpContactUrl}
          ngoShortName={ngoShortName}
          isSubmitting={isSubmitting}
          serverError={serverError}
          onSubmit={(code) => onVerify({ method: 'qr', qr_scanned: code })}
        />
        <button
          type="button"
          onClick={() => setFallback(false)}
          className="mx-auto flex items-center gap-1 text-[13px] font-semibold"
          style={{ color: c.gold }}
        >
          <QrCode size={14} /> QR tarayıcıya dön
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {hint && <HintCard text={hint} />}

      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: c.ink900,
          border: `1.5px solid ${c.ink600}`,
        }}
      >
        <QRScanner onScan={handleScan} onError={(e) => setScanError(e)} />
      </div>

      {(scanError || serverError) && (
        <ErrorBanner text={scanError ?? serverError ?? ''} />
      )}

      <button
        type="button"
        onClick={() => setFallback(true)}
        className="mx-auto flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold"
        style={{
          background: c.ink800,
          color: c.cream,
          border: `1px solid ${c.ink600}`,
        }}
      >
        <Keyboard size={14} />
        Manuel kod gir
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  Shared subcomponents
 * ───────────────────────────────────────────────────────────── */

function HintCard({ text }: { text: string }) {
  const { colors: c } = useTheme()
  return (
    <div
      className="flex items-start gap-2 rounded-xl px-3 py-2.5"
      style={{
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
      }}
    >
      <span
        className="mt-0.5 inline-block flex-shrink-0 rounded-full"
        style={{ width: 6, height: 6, background: c.gold }}
        aria-hidden="true"
      />
      <p className="text-[13px] leading-[1.5]" style={{ color: c.ink200 }}>
        {text}
      </p>
    </div>
  )
}

function ErrorBanner({ text }: { text: string }) {
  const { colors: c } = useTheme()
  return (
    <div
      className="flex items-start gap-2 rounded-xl px-3 py-2"
      style={{
        background: `${c.danger}1A`,
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
        {text}
      </p>
    </div>
  )
}
