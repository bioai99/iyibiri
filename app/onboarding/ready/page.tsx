'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { KarmaToken } from '@/components/ui/ds'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingReady() {
  const { colors: c } = useTheme()

  useEffect(() => {
    async function saveOnboardingData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const interests = JSON.parse(localStorage.getItem('iyibiri_onboarding_interests') || '[]')
      const city = localStorage.getItem('iyibiri_onboarding_city')
      const radius = localStorage.getItem('iyibiri_onboarding_radius')

      if (!interests.length && !city) return

      await supabase.from('profiles').update({
        interests,
        city: city || null,
        search_radius: radius ? Number(radius) : 10,
      }).eq('id', user.id)

      localStorage.removeItem('iyibiri_onboarding_interests')
      localStorage.removeItem('iyibiri_onboarding_city')
      localStorage.removeItem('iyibiri_onboarding_radius')
    }
    saveOnboardingData()
  }, [])

  return (
    <div
      style={{
        height: '844px',
        display: 'flex',
        flexDirection: 'column',
        background: c.ink900,
        overflow: 'hidden',
      }}
    >
      {/* Progress bar — all 4 segments gold, no back button */}
      <div
        style={{
          padding: '58px 20px 0',
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 999,
                background: c.gold,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '48px 28px 0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {/* KarmaToken with radial gold glow */}
        <div
          style={{
            position: 'relative',
            marginBottom: 28,
          }}
        >
          {/* Radial glow behind */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${c.gold} 0%, transparent 70%)`,
              filter: 'blur(20px)',
              opacity: 0.4,
              pointerEvents: 'none',
            }}
          />
          <KarmaToken size={80} style={{ position: 'relative', zIndex: 1 }} />
        </div>

        {/* Eyebrow */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: c.gold,
            margin: '0 0 12px',
          }}
        >
          HOŞ GELDİN HEDİYESİ
        </p>

        {/* Heading */}
        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 44,
            fontWeight: 400,
            letterSpacing: '-0.032em',
            lineHeight: 1,
            color: c.cream,
            margin: 0,
          }}
        >
          {'İlk '}
          <em style={{ fontStyle: 'italic', color: c.gold }}>100 Karma</em>
          {' senden.'}
        </h1>

        {/* Body */}
        <p
          style={{
            fontSize: 15,
            color: c.ink200,
            maxWidth: 320,
            marginTop: 22,
            lineHeight: 1.6,
          }}
        >
          Hesabını açtığın için teşekkürler. İlk görevini tamamladığında 250 daha gelecek — ve &ldquo;İyi Biri&rdquo; seviyesine iki adım kaldı.
        </p>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '0 16px 32px' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              background: c.gold,
              color: '#241E18',
              border: 'none',
              borderRadius: 999,
              padding: '14px 20px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            İlk görevimi bul
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </Link>
      </div>
    </div>
  )
}
