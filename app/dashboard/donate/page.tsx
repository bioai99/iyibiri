// Vol-31.1 placeholder — gerçek Hub Vol-31.2'de yapılacak.
// Bu dosya bottom nav'ın "Bağış" item'ı 404 döndürmesin diye var.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DonatePagePlaceholder() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <main
      style={{
        minHeight: '100dvh',
        padding: '120px 24px',
        textAlign: 'center',
        color: '#F4EEDF',
        background: '#15110D',
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#E8C268',
          marginBottom: 12,
        }}
      >
        BAĞIŞ
      </p>
      <h1
        style={{
          fontFamily: "'Fraunces', ui-serif, serif",
          fontSize: 28,
          fontWeight: 500,
          margin: 0,
          color: '#F4EEDF',
        }}
      >
        Bağış sekmesi yakında
      </h1>
      <p
        style={{
          marginTop: 12,
          fontSize: 14,
          color: '#A89E8A',
          maxWidth: 320,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        Bu sayfa Vol-31.2&apos;de hayata geçecek — STK keşfi, kampanyalar ve
        bağış akışı.
      </p>
    </main>
  )
}
