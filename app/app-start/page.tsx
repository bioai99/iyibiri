'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AppStartPage() {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.replace('/dashboard')
      } else {
        router.replace('/onboarding/welcome')
      }
    }
    checkAuth()
  }, [router])

  // Splash screen while checking auth
  return (
    <div style={{
      background: '#24201B',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: "'Fraunces', serif",
        fontSize: 34,
        fontWeight: 500,
        letterSpacing: '-0.028em',
        color: '#F4EEDF',
      }}>
        İyi<span style={{ fontStyle: 'italic', color: '#E8C268' }}>Biri</span>
      </div>
    </div>
  )
}
