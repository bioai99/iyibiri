'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BrandLogo } from '@/components/ui/brand-logo'

export default function AppStartPage() {
  const router = useRouter()

  useEffect(() => {
    async function boot() {
      // Native platform ise SocialLogin'i erken başlat
      const { isNativePlatform, initSocialLogin } = await import('@/lib/auth/oauth-native')
      if (isNativePlatform()) {
        await initSocialLogin()
      }

      // Auth kontrolü
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.replace('/dashboard')
      } else {
        router.replace('/onboarding/welcome')
      }
    }
    boot()
  }, [router])

  return (
    <div style={{
      background: '#24201B', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <BrandLogo size={140} animate idle showWordmark />
    </div>
  )
}
