'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useTheme } from '@/lib/theme'
import { KarmaToken } from '@/components/ui/ds'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export default function OnboardingWelcome() {
  const { colors: c } = useTheme()
  const [lottieData, setLottieData] = useState<any>(null)

  // Lottie'yi client-side yükle
  if (!lottieData && typeof window !== 'undefined') {
    fetch('/animations/party.json')
      .then(r => r.json())
      .then(setLottieData)
      .catch(() => {})
  }

  const displayFont = 'Fraunces, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden', position: 'relative',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500,
        background: `radial-gradient(circle, rgba(232,194,104,.18), transparent 65%)`,
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Hero area with Lottie */}
      <div style={{
        flex: '1 1 auto', position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 20px', minHeight: 360,
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ position: 'relative', width: 200, height: 200 }}
        >
          {lottieData ? (
            <Lottie animationData={lottieData} loop style={{ width: 200, height: 200 }} />
          ) : (
            <KarmaToken size={140} />
          )}
        </motion.div>

        {/* Floating hearts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.3, y: -5 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          style={{ position: 'absolute', top: '20%', left: '18%' }}
        >
          <Heart size={18} color={c.gold} fill={c.gold} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.25, y: -8 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
          style={{ position: 'absolute', top: '30%', right: '15%' }}
        >
          <Heart size={14} color={c.gold} fill={c.gold} />
        </motion.div>
      </div>

      {/* Bottom content */}
      <div style={{ padding: '0 28px 44px' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontFamily: displayFont, fontSize: 34, fontWeight: 400,
            letterSpacing: '-0.03em', lineHeight: 1.1,
            color: c.cream, margin: '0 0 12px',
          }}
        >
          <em style={{ fontStyle: 'italic', color: c.gold }}>İyi biri</em> olmak{'\n'}
          dünyayı değiştirir.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: uiFont, fontSize: 15, color: c.ink300,
            lineHeight: 1.6, margin: '0 0 32px', maxWidth: 320,
          }}
        >
          Gönüllü ol, gerçek görevler tamamla, Karma biriktir.
          Her iyilik seni ve çevrendeki insanları büyütür.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <Link href="/onboarding/causes" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', height: 52, borderRadius: 14,
              background: c.gold, border: 'none', color: '#241E18',
              fontFamily: uiFont, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(232,194,104,.3)',
            }}>
              Başlayalım <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </Link>
          <Link href="/auth/signin" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', height: 48, borderRadius: 14,
              background: 'transparent', border: `1px solid ${c.ink600}`,
              color: c.ink300, fontFamily: uiFont, fontSize: 14,
              fontWeight: 600, cursor: 'pointer',
            }}>
              Zaten üyeyim
            </button>
          </Link>
        </motion.div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: i === 0 ? 20 : 6, height: 6, borderRadius: 999,
              background: i === 0 ? c.gold : c.ink600,
              transition: 'width .2s ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
