'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useTheme } from '@/lib/theme'
import { KarmaToken } from '@/components/ui/ds'
import { createClient } from '@/lib/supabase/client'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export default function OnboardingReady() {
  const { colors: c } = useTheme()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [lottieData, setLottieData] = useState<any>(null)

  useEffect(() => {
    // Konfeti
    import('canvas-confetti').then(mod => {
      const confetti = mod.default
      setTimeout(() => {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#E8C268', '#F4EEDF', '#C8553D'] })
      }, 600)
    }).catch(() => {})

    // Lottie
    fetch('/animations/party.json')
      .then(r => r.json())
      .then(setLottieData)
      .catch(() => {})

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
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden', position: 'relative',
    }}>
      {/* Progress bar */}
      <div style={{ padding: '58px 20px 0' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: c.gold }} />
          ))}
        </div>
      </div>

      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 400, height: 400,
        background: `radial-gradient(circle, rgba(232,194,104,.2), transparent 60%)`,
        filter: 'blur(30px)', pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        flex: 1, padding: '40px 28px 0',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        {/* Lottie or KarmaToken */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ marginBottom: 24, position: 'relative' }}
        >
          {lottieData ? (
            <Lottie animationData={lottieData} loop style={{ width: 160, height: 160 }} />
          ) : (
            <KarmaToken size={100} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
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
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            fontFamily: displayFont, fontSize: 42, fontWeight: 400,
            letterSpacing: '-0.032em', lineHeight: 1, color: c.cream, margin: 0,
          }}
        >
          İlk <em style={{ fontStyle: 'italic', color: c.gold }}>100 Karma</em>
          {'\n'}senden.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{
            fontFamily: uiFont, fontSize: 15, color: c.ink200,
            maxWidth: 300, marginTop: 18, lineHeight: 1.6,
          }}
        >
          {isLoggedIn
            ? 'İlk görevini tamamladığında 250 daha gelecek — "İyi Biri" seviyesine iki adım kaldı.'
            : 'Hesabını aç, ilk 100 Karma\'nı hemen kazan. İlk görevinde 250 daha gelecek.'}
        </motion.p>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ padding: '0 16px 36px' }}
      >
        <Link href={nextHref} style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', background: c.gold, color: '#241E18',
            border: 'none', borderRadius: 14, padding: '14px 20px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(232,194,104,.3)',
          }}>
            {isLoggedIn ? 'İlk görevimi bul' : 'Hesabımı oluştur'}
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </Link>
      </motion.div>
    </div>
  )
}
