'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { BrandLogo } from '@/components/ui/brand-logo'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingReady() {
  const { colors: c } = useTheme()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Konfeti
    import('canvas-confetti').then(mod => {
      const confetti = mod.default
      setTimeout(() => {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 }, colors: ['#E8C268', '#A89E8A', '#C8553D', '#6B8E4E'] })
      }, 800)
      setTimeout(() => {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.55, x: 0.3 }, colors: ['#E8C268', '#A89E8A'] })
      }, 1200)
      setTimeout(() => {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.55, x: 0.7 }, colors: ['#E8C268', '#A89E8A'] })
      }, 1400)
    }).catch(() => {})

    // Auth check + save onboarding data
    async function checkAndSave() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
        const interests = JSON.parse(localStorage.getItem('iyibiri_onboarding_interests') || '[]')
        const city = localStorage.getItem('iyibiri_onboarding_city')
        const radius = localStorage.getItem('iyibiri_onboarding_radius')
        if (interests.length || city) {
          await supabase.from('profiles').update({
            interests, city: city || null,
            search_radius: radius ? Number(radius) : 10,
          }).eq('id', user.id)
          localStorage.removeItem('iyibiri_onboarding_interests')
          localStorage.removeItem('iyibiri_onboarding_city')
          localStorage.removeItem('iyibiri_onboarding_radius')
        }
      }
    }
    checkAndSave()
  }, [])

  const nextHref = isLoggedIn ? '/app-start' : '/auth/login'
  const displayFont = 'Fraunces, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden', position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
    }}>
      {/* Progress bar */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: c.ink600, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                style={{ height: '100%', background: c.gold, borderRadius: 999 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 500, height: 500,
        background: `radial-gradient(circle, rgba(232,194,104,.22), transparent 55%)`,
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        flex: 1, padding: '40px 28px 0',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        {/* Brand logo with +100 badge */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <BrandLogo size={100} animate />

          {/* +100 badge */}
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'absolute', bottom: 0, right: -10,
              background: c.gold, color: c.ink,
              fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 16,
              padding: '6px 12px', borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,.08)',
            }}
          >
            +100
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', background: c.goldSoft,
            border: `1px solid ${c.goldLine}`, borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: c.gold, marginBottom: 20,
          }}
        >
          <Sparkles size={14} /> Hoş geldin hediyesi
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{
            fontFamily: displayFont, fontSize: 40, fontWeight: 400,
            letterSpacing: '-0.032em', lineHeight: 1.05, color: c.cream, margin: 0,
          }}
        >
          İlk <em style={{ fontStyle: 'italic', color: c.gold }}>100 Karma</em>
          {'\n'}senin.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            fontFamily: uiFont, fontSize: 15, color: c.ink200,
            maxWidth: 300, marginTop: 16, lineHeight: 1.6,
          }}
        >
          {isLoggedIn
            ? 'İlk görevini tamamla, 250 Karma daha kazanacaksın.'
            : 'Hemen kayıt ol, 100 Karma\'nı kap. İlk görevinde 250 daha!'}
        </motion.p>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{ padding: '0 16px calc(env(safe-area-inset-bottom, 16px) + 20px)' }}
      >
        <Link href={nextHref} style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', background: c.gold, color: c.ink,
            border: 'none', borderRadius: 14, padding: '14px 20px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          }}>
            {isLoggedIn ? 'İlk görevimi bul' : 'Hesabımı oluştur'}
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </Link>
      </motion.div>
    </div>
  )
}
