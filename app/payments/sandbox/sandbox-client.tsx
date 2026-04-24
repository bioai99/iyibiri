'use client'

// app/payments/sandbox/sandbox-client.tsx
//
// Dev payment simulator UI. Kullanıcı 3 seçenek görür:
// - "Başarılı ödeme" → postMessage + redirect to callback?status=success
// - "Başarısız ödeme" → postMessage + redirect to callback?status=failed
// - "İptal" → callback?status=cancelled
//
// Mode davranışı:
// - embedded/marketplace → window.parent.postMessage (iframe parent dinler)
// - passthrough          → window.location to callback

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ShieldCheck,
  CreditCard,
  XCircle,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'

interface SandboxClientProps {
  ref_: string
  amount: number
  processor: 'iyzico' | 'paytr' | 'fonzip' | 'external' | 'custom' | 'none'
  mode: 'embedded' | 'marketplace' | 'passthrough'
  ngo: string
  callback: string
}

export function SandboxClient({
  ref_,
  amount,
  processor,
  mode,
  ngo,
  callback,
}: SandboxClientProps) {
  const shouldReduceMotion = useReducedMotion()
  const [status, setStatus] = useState<
    'idle' | 'success' | 'failed' | 'cancelled'
  >('idle')

  const emit = (result: 'success' | 'failed' | 'cancelled', code?: string) => {
    setStatus(result)
    const payload = {
      type:
        result === 'success' ? 'payment_success' : 'payment_error',
      ref: ref_,
      code: code ?? null,
    }

    // Embedded/marketplace → iframe parent'a postMessage
    if (mode !== 'passthrough' && window.parent !== window) {
      window.parent.postMessage(payload, '*')
    }

    // Passthrough → redirect (+status query)
    if (mode === 'passthrough') {
      const url = new URL(callback)
      url.searchParams.set('status', result)
      url.searchParams.set('ref', ref_)
      if (code) url.searchParams.set('code', code)
      setTimeout(() => {
        window.location.href = url.toString()
      }, 700)
    }
  }

  const processorLabel: Record<SandboxClientProps['processor'], string> = {
    iyzico: 'iyzico',
    paytr: 'PayTR',
    fonzip: 'fonzip',
    external: 'Harici',
    custom: 'Özel',
    none: '—',
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-neutral-50 p-4">
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        {/* Dev badge */}
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
          <AlertTriangle size={14} />
          <span>
            <strong>DEV SANDBOX</strong> — Üretimde burası gerçek{' '}
            {processorLabel[processor]} formudur.
          </span>
        </div>

        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900">
            <CreditCard size={20} color="#fff" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              {processorLabel[processor]} · {mode}
            </div>
            <div className="text-[15px] font-semibold text-neutral-900">
              {ngo} ödemesi
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
            Tutar
          </div>
          <div className="mt-1 font-serif text-3xl font-semibold text-neutral-900">
            ₺{amount.toLocaleString('tr-TR')}
          </div>
        </div>

        {/* SSL notice */}
        <div className="mb-4 flex items-center gap-2 text-[12px] text-neutral-600">
          <ShieldCheck size={14} />
          <span>3D Secure simüle ediliyor…</span>
        </div>

        {/* Status feedback */}
        {status !== 'idle' && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] ${
              status === 'success'
                ? 'bg-emerald-50 text-emerald-800'
                : status === 'cancelled'
                  ? 'bg-neutral-100 text-neutral-700'
                  : 'bg-rose-50 text-rose-800'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {status === 'success'
              ? 'Ödeme başarılı — callback tetiklendi'
              : status === 'cancelled'
                ? 'İptal edildi'
                : 'Ödeme başarısız'}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => emit('success')}
            disabled={status !== 'idle'}
            className="h-11 rounded-xl bg-emerald-600 font-semibold text-white transition-opacity disabled:opacity-50"
          >
            Başarılı ödemeyi simüle et
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => emit('failed', 'CARD_DECLINED')}
              disabled={status !== 'idle'}
              className="h-10 rounded-xl bg-rose-100 text-[13px] font-semibold text-rose-700 transition-opacity disabled:opacity-50"
            >
              Red (CARD_DECLINED)
            </button>
            <button
              type="button"
              onClick={() => emit('failed', 'INSUFFICIENT_FUNDS')}
              disabled={status !== 'idle'}
              className="h-10 rounded-xl bg-rose-100 text-[13px] font-semibold text-rose-700 transition-opacity disabled:opacity-50"
            >
              Bakiye yetersiz
            </button>
          </div>
          <button
            type="button"
            onClick={() => emit('cancelled')}
            disabled={status !== 'idle'}
            className="h-10 rounded-xl border border-neutral-300 text-[13px] font-medium text-neutral-600 transition-opacity disabled:opacity-50"
          >
            İptal et
          </button>
        </div>

        {/* Debug info */}
        <details className="mt-4 text-[11px] text-neutral-400">
          <summary className="cursor-pointer">Debug</summary>
          <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-neutral-100 p-2">
            {JSON.stringify(
              { ref: ref_, mode, processor, amount, callback },
              null,
              2,
            )}
          </pre>
        </details>
      </motion.div>
    </div>
  )
}
