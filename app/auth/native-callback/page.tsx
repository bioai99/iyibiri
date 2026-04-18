'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function NativeCallbackContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // Build the deep link URL with the code
  const deepLink = code
    ? `com.iyibiri.app://auth/callback?code=${encodeURIComponent(code)}`
    : 'com.iyibiri.app://auth/callback'

  return (
    <div style={{
      background: '#24201B',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      padding: '0 32px',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {error ? (
        <>
          <p style={{ fontSize: 16, color: '#C8553D', textAlign: 'center' }}>
            Giriş başarısız oldu. Lütfen tekrar deneyin.
          </p>
          <a
            href="https://www.iyibiri.app/auth/login"
            style={{
              background: '#E8C268', color: '#1A1612',
              padding: '14px 28px', borderRadius: 14,
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
            }}
          >
            Tekrar dene
          </a>
        </>
      ) : (
        <>
          <div style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 28, fontWeight: 500,
            color: '#F4EEDF', textAlign: 'center',
          }}>
            Giriş <em style={{ fontStyle: 'italic', color: '#E8C268' }}>başarılı!</em>
          </div>
          <p style={{ fontSize: 14, color: '#A89E8A', textAlign: 'center', lineHeight: 1.5, maxWidth: 300 }}>
            Uygulamaya dönmek için aşağıdaki butona dokunun.
          </p>
          <a
            href={deepLink}
            style={{
              background: '#E8C268', color: '#1A1612',
              padding: '16px 32px', borderRadius: 14,
              fontWeight: 700, fontSize: 16, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(232,194,104,.3)',
            }}
          >
            Uygulamaya dön
          </a>
          <p style={{ fontSize: 11, color: '#7A6F5E', marginTop: 8, textAlign: 'center' }}>
            Buton çalışmazsa uygulamayı manuel olarak açın.
          </p>
        </>
      )}
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
