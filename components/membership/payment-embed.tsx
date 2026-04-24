// components/membership/payment-embed.tsx
//
// NGO üyelik Adım 4: ödeme — 3 mode'lu payment embed container.
// UI Spec 2026-04-24 Bölüm 8 Payment routing variants.
// ADR-008 3-modlu payment routing: marketplace | embedded | passthrough.
// Migration 010 payment_mode enum + payment_processor enum.
//
// Mode davranışı:
// - 'marketplace'  → iyzico Marketplace iframe inline (subMerchant split)
// - 'embedded'     → PayTR iframe inline (platform = merchant; STK'ya sonra transfer)
// - 'passthrough'  → External redirect (fonzip embed veya STK'nın kendi linki) + "Geri dön" dialog
//
// Özellikler:
// - Amount display (big, tabular-nums)
// - Security row (SSL + iyzico/PayTR logo + "SSL güvenli ödeme")
// - Payment processor iframe container (min-height 420)
// - Passthrough mode için redirect guard + return callback handler
// - Loading skeleton + error state
// - TR payment error messages
// - Skill: mobile-app-polish-standards Bölüm 7 "Error ton" — empathic Turkish.

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { ArrowUpRight, CreditCard, ShieldCheck, Loader2 } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
 *  Ortak types
 * ───────────────────────────────────────────────────────────── */

export type PaymentMode = 'marketplace' | 'embedded' | 'passthrough'
export type PaymentProcessor =
  | 'iyzico'
  | 'paytr'
  | 'fonzip'
  | 'external'
  | 'custom'
  | 'none'

interface PaymentEmbedProps {
  mode: PaymentMode
  processor: PaymentProcessor
  /** Tutar TL — "256" / "50" */
  amount: number
  /** Periyot — "yıllık" / "aylık" / "tek seferlik" */
  periodLabel: string
  /** iframe/redirect URL — server action'dan geliyor (session-bound) */
  paymentUrl?: string
  /** Passthrough: external redirect title */
  externalTitle?: string
  /** Success callback — postMessage / webhook sonrası */
  onSuccess: () => void
  /** Failure callback */
  onError: (message: string) => void
  /** Back button */
  onBack?: () => void
}

/* ─────────────────────────────────────────────────────────────
 *  Ana component
 * ───────────────────────────────────────────────────────────── */

export function PaymentEmbed({
  mode,
  processor,
  amount,
  periodLabel,
  paymentUrl,
  externalTitle,
  onSuccess,
  onError,
  onBack,
}: PaymentEmbedProps) {
  const { colors: c } = useTheme()
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [isLoading] = useState(!paymentUrl)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // postMessage listener — iyzico/PayTR iframe'den success/error
  useEffect(() => {
    if (mode === 'passthrough') return
    const handler = (ev: MessageEvent) => {
      // Güvenlik: sadece beklenen processor origin'lerini kabul et
      const allowedOrigins: Record<PaymentProcessor, string[]> = {
        iyzico: ['https://sandbox-api.iyzipay.com', 'https://api.iyzipay.com'],
        paytr: ['https://www.paytr.com'],
        fonzip: ['https://app.fonzip.com'],
        external: [],
        custom: [],
        none: [],
      }
      const allowed = allowedOrigins[processor] ?? []
      if (!allowed.includes(ev.origin)) return

      if (ev.data?.type === 'payment_success') {
        onSuccess()
      } else if (ev.data?.type === 'payment_error') {
        onError(ev.data?.message ?? translatePaymentError(ev.data?.code))
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [mode, processor, onSuccess, onError])

  return (
    <div className="flex flex-col gap-4">
      {/* Amount summary */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: c.ink800,
          border: `1px solid ${c.goldLine}`,
        }}
      >
        <p
          className="mb-1 text-[11px] font-semibold uppercase"
          style={{ color: c.ink300, letterSpacing: '0.06em' }}
        >
          Ödenecek tutar
        </p>
        <div className="flex items-baseline gap-2">
          <span
            className="font-display font-semibold tabular-nums"
            style={{
              color: c.cream,
              fontSize: 32,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            ₺{amount.toLocaleString('tr-TR')}
          </span>
          <span
            className="text-[13px] font-medium"
            style={{ color: c.ink300 }}
          >
            / {periodLabel}
          </span>
        </div>
      </div>

      {/* Security row */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2"
        style={{
          background: c.ink800,
          border: `1px solid ${c.ink600}`,
        }}
      >
        <ShieldCheck size={14} color={c.success} />
        <span className="text-[12px]" style={{ color: c.ink200 }}>
          <span className="font-semibold" style={{ color: c.cream }}>
            SSL güvenli ödeme
          </span>
          {' — '}
          {processorLabel(processor)} altyapısı
        </span>
      </div>

      {/* Mode-spesifik içerik */}
      {mode === 'passthrough' ? (
        <PassthroughRedirect
          url={paymentUrl}
          title={externalTitle ?? 'Ödeme sayfasına yönlendiriliyorsun'}
          processor={processor}
        />
      ) : (
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: c.ink900,
            border: `1px solid ${c.ink600}`,
            minHeight: 420,
          }}
        >
          {(isLoading || !iframeLoaded) && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{ background: c.ink900 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Loader2 size={20} color={c.gold} />
              </motion.div>
              <p className="text-[12px]" style={{ color: c.ink300 }}>
                Ödeme formu yükleniyor…
              </p>
            </div>
          )}
          {paymentUrl && (
            <iframe
              ref={iframeRef}
              src={paymentUrl}
              onLoad={() => setIframeLoaded(true)}
              title="Güvenli ödeme formu"
              className="h-[420px] w-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation-by-user-activation"
              allow="payment"
            />
          )}
        </div>
      )}

      {/* Back button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mx-auto text-[13px] font-medium underline-offset-2 hover:underline"
          style={{ color: c.ink300 }}
        >
          ← Geri dön
        </button>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  Passthrough redirect card (fonzip/external)
 * ───────────────────────────────────────────────────────────── */

interface PassthroughRedirectProps {
  url?: string
  title: string
  processor: PaymentProcessor
}

function PassthroughRedirect({ url, title, processor }: PassthroughRedirectProps) {
  const { colors: c } = useTheme()

  const handleRedirect = () => {
    if (!url) return
    // Yeni tab'da aç — kullanıcı geri dönünce session korunur
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-5 text-center"
      style={{
        background: c.ink800,
        border: `1.5px dashed ${c.goldLine}`,
      }}
    >
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
        style={{ background: c.goldSoft }}
      >
        <CreditCard size={22} color={c.gold} />
      </div>
      <h3
        className="font-display text-[18px] font-semibold"
        style={{ color: c.cream, letterSpacing: '-0.01em' }}
      >
        {title}
      </h3>
      <p className="text-[13px] leading-[1.5]" style={{ color: c.ink200 }}>
        Bu STK ödemeyi <strong>{processorLabel(processor)}</strong> üzerinden
        tahsil ediyor. Güvenli sayfada ödemeni tamamla ve buraya geri dön —
        üyeliğin otomatik tamamlanacak.
      </p>
      <button
        type="button"
        onClick={handleRedirect}
        disabled={!url}
        className="mx-auto mt-2 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-bold"
        style={{
          background: c.gold,
          color: c.ink,
          border: 'none',
          cursor: url ? 'pointer' : 'not-allowed',
          opacity: url ? 1 : 0.5,
        }}
      >
        Güvenli ödemeye git
        <ArrowUpRight size={16} />
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  Helpers
 * ───────────────────────────────────────────────────────────── */

function processorLabel(p: PaymentProcessor): string {
  switch (p) {
    case 'iyzico':
      return 'iyzico'
    case 'paytr':
      return 'PayTR'
    case 'fonzip':
      return 'fonzip'
    case 'external':
    case 'custom':
      return 'Güvenli harici'
    case 'none':
      return 'Ödeme sağlayıcı'
  }
}

/**
 * TR payment error translation — TR kullanıcıya empatik mesaj.
 * UX Audit Kritik 6 (İ1): "Yabancı error code gösterme".
 */
export function translatePaymentError(code?: string): string {
  const map: Record<string, string> = {
    INSUFFICIENT_FUNDS: 'Kartında yeterli bakiye yok görünüyor. Farklı bir kart dener misin?',
    CARD_DECLINED: 'Bankan ödemeyi onaylamadı. Bankanı arayıp deneyebilirsin.',
    INVALID_CARD: 'Kart bilgilerinde bir sorun var gibi. Tekrar kontrol eder misin?',
    EXPIRED_CARD: 'Kartının süresi dolmuş görünüyor.',
    CVC_INVALID: 'CVC kodu hatalı. Kartın arkasındaki 3 haneli sayıyı kullan.',
    THREED_FAILED: '3D Secure doğrulaması başarısız oldu. Tekrar dener misin?',
    NETWORK: 'İnternet bağlantın kesilmiş olabilir. Tekrar dene.',
    GENERIC: 'Ödeme tamamlanamadı. Biraz sonra tekrar dener misin?',
  }
  if (!code) return map.GENERIC
  return map[code] ?? map.GENERIC
}
