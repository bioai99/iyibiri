'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCw, ArrowLeft } from 'lucide-react'

// Vol-27.3 XC5: Admin per-route error boundary.
// Backoffice crash'leri için kullanıcı-dostu fallback UI.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Admin error boundary:', error)
  }, [error])

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--ink-900, #1A1612)', color: 'var(--cream, #F5EFE6)' }}
    >
      <div
        className="max-w-lg w-full text-center"
        style={{
          background: 'var(--ink-800, #241E18)',
          border: '1px solid var(--ink-700, #2D2620)',
          borderRadius: 20,
          padding: 32,
        }}
      >
        <div
          className="inline-flex items-center justify-center mb-4"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(217, 121, 92, 0.15)',
          }}
        >
          <AlertTriangle size={28} color="var(--clay, #D9795C)" />
        </div>

        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display), ui-serif, Georgia, serif' }}
        >
          Backoffice hatası
        </h1>
        <p
          className="text-sm mb-6 leading-relaxed"
          style={{ color: 'var(--ink-300, #998A7A)' }}
        >
          Admin panelinde bir hata oluştu. Tekrar denemeyi veya panele dönmeyi
          deneyebilirsin. Sorun devam ediyorsa{' '}
          <a
            href="mailto:destek@iyibiri.app"
            className="hover:underline"
            style={{ color: 'var(--gold, #D4A35C)' }}
          >
            destek@iyibiri.app
          </a>{' '}
          ile iletişime geç.
        </p>

        {error.digest && (
          <p
            className="text-xs font-mono px-3 py-1.5 rounded mb-5 break-all"
            style={{
              color: 'var(--ink-400, #6B5E50)',
              background: 'var(--ink-900, #1A1612)',
            }}
          >
            Hata kimliği: {error.digest}
          </p>
        )}

        <div className="flex gap-2 justify-center flex-wrap">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer"
            style={{ background: 'var(--gold, #D4A35C)', color: '#241E18', border: 'none' }}
          >
            <RotateCw size={16} /> Tekrar Dene
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm no-underline"
            style={{
              background: 'var(--ink-700, #2D2620)',
              color: 'var(--cream, #F5EFE6)',
              border: 'none',
            }}
          >
            <ArrowLeft size={16} /> Admin Paneli
          </Link>
        </div>
      </div>
    </div>
  )
}
