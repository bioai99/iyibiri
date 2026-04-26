'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCw, Home } from 'lucide-react'

// Vol-27.3 XC5: Dashboard per-route error boundary.
// Runtime crash'ler kullanıcı app'inde generic 500 yerine kullanıcı-dostu UI gösterir.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Production'da Sentry/log servisine gönderilebilir
    // eslint-disable-next-line no-console
    console.error('Dashboard error boundary:', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--ink-900, #1A1612)',
        color: 'var(--cream, #F5EFE6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          textAlign: 'center',
          background: 'var(--ink-800, #241E18)',
          border: '1px solid var(--ink-700, #2D2620)',
          borderRadius: 20,
          padding: 32,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(217, 121, 92, 0.15)',
            marginBottom: 16,
          }}
        >
          <AlertTriangle size={28} color="var(--clay, #D9795C)" />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
            fontSize: 24,
            fontWeight: 600,
            margin: '0 0 8px',
          }}
        >
          Bir şeyler ters gitti
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'var(--ink-300, #998A7A)',
            margin: '0 0 24px',
            lineHeight: 1.5,
          }}
        >
          Sayfa yüklenirken bir hata oluştu. Tekrar denemeyi veya ana sayfaya
          dönmeyi deneyebilirsin.
        </p>

        {error.digest && (
          <p
            style={{
              fontSize: 11,
              fontFamily: 'monospace',
              color: 'var(--ink-400, #6B5E50)',
              background: 'var(--ink-900, #1A1612)',
              padding: '6px 10px',
              borderRadius: 6,
              marginBottom: 20,
              wordBreak: 'break-all',
            }}
          >
            Hata kimliği: {error.digest}
          </p>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={reset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '12px 20px',
              borderRadius: 12,
              background: 'var(--gold, #D4A35C)',
              color: '#241E18',
              border: 'none',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <RotateCw size={16} /> Tekrar Dene
          </button>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '12px 20px',
              borderRadius: 12,
              background: 'var(--ink-700, #2D2620)',
              color: 'var(--cream, #F5EFE6)',
              border: 'none',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            <Home size={16} /> Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  )
}
