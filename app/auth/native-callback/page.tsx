'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function NativeCallbackContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      // Redirect to custom URL scheme to bounce back to the Capacitor app
      window.location.href = `com.iyibiri.app://auth/callback?code=${code}`
    }
  }, [searchParams])

  return (
    <div style={{
      background: '#24201B',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      color: '#F4EEDF',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <p style={{ fontSize: 15, color: '#A89E8A' }}>Uygulamaya dönülüyor...</p>
      <a
        href="com.iyibiri.app://auth/callback"
        style={{
          background: '#E8C268',
          color: '#1A1612',
          padding: '12px 24px',
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: 'none',
        }}
      >
        Uygulamayı aç
      </a>
    </div>
  )
}

export default function NativeCallbackPage() {
  return (
    <Suspense fallback={<div style={{ background: '#24201B', minHeight: '100vh' }} />}>
      <NativeCallbackContent />
    </Suspense>
  )
}
