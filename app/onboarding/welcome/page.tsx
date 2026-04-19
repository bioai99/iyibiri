'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { KarmaToken } from '@/components/ui/ds'

// İnsanları ve iyiliği temsil eden SVG hero animasyonu
function GoodnesssHero() {
  return (
    <div style={{ position: 'relative', width: 260, height: 260 }}>
      {/* Radial glow */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          position: 'absolute', inset: -40,
          background: 'radial-gradient(circle, rgba(232,194,104,.2), transparent 60%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Orbiting particles */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.div
            animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            style={{
              position: 'absolute',
              top: i % 2 === 0 ? `${10 + i * 8}%` : undefined,
              bottom: i % 2 !== 0 ? `${10 + i * 6}%` : undefined,
              left: i < 3 ? `${5 + i * 12}%` : undefined,
              right: i >= 3 ? `${5 + (i - 3) * 12}%` : undefined,
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              borderRadius: '50%',
              background: '#E8C268',
              boxShadow: '0 0 8px rgba(232,194,104,.4)',
            }}
          />
        </motion.div>
      ))}

      {/* Inner ring */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          position: 'absolute', inset: 20,
          border: '1px solid #E8C268', borderRadius: '50%',
        }}
      />

      {/* Outer ring */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.08 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        style={{
          position: 'absolute', inset: -10,
          border: '1px solid #E8C268', borderRadius: '50%',
        }}
      />

      {/* Hands + Heart SVG */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
          {/* Left hand cupping */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: 'easeInOut' }}
            d="M 30 105 Q 25 85 35 70 Q 45 55 55 60 Q 60 62 62 68"
            stroke="#A89E8A" strokeWidth="2" strokeLinecap="round" fill="none"
          />
          {/* Right hand cupping */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: 'easeInOut' }}
            d="M 130 105 Q 135 85 125 70 Q 115 55 105 60 Q 100 62 98 68"
            stroke="#A89E8A" strokeWidth="2" strokeLinecap="round" fill="none"
          />
          {/* Bottom curve connecting hands */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
            d="M 30 105 Q 50 130 80 135 Q 110 130 130 105"
            stroke="#A89E8A" strokeWidth="2" strokeLinecap="round" fill="none"
          />
        </svg>
      </motion.div>

      {/* KarmaToken center */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: -10,
        }}
      >
        <KarmaToken size={90} />
      </motion.div>

      {/* Rising sparkles */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={`spark-${i}`}
          animate={{
            y: [-10, -50],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            bottom: '35%',
            left: `${35 + i * 15}%`,
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: '#E8C268',
          }}
        />
      ))}
    </div>
  )
}

export default function OnboardingWelcome() {
  const { colors: c } = useTheme()
  const displayFont = 'Fraunces, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden', position: 'relative',
    }}>
      {/* Hero area */}
      <div style={{
        flex: '1 1 auto', position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'calc(env(safe-area-inset-top, 20px) + 60px) 24px 20px', minHeight: 360,
      }}>
        <GoodnesssHero />

        {/* Wordmark under hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{
            fontFamily: displayFont, fontSize: 28, fontWeight: 500,
            letterSpacing: '-0.025em', color: c.cream, marginTop: 16,
          }}
        >
          İyi<span style={{ fontStyle: 'italic', color: c.gold }}>Biri</span>
        </motion.div>
      </div>

      {/* Bottom content */}
      <div style={{ padding: '0 28px calc(env(safe-area-inset-bottom, 16px) + 28px)' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          style={{
            fontFamily: displayFont, fontSize: 32, fontWeight: 400,
            letterSpacing: '-0.03em', lineHeight: 1.1,
            color: c.cream, margin: '0 0 10px',
          }}
        >
          <em style={{ fontStyle: 'italic', color: c.gold }}>İyilik</em> biriktirilir.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            fontFamily: uiFont, fontSize: 15, color: c.ink300,
            lineHeight: 1.6, margin: '0 0 28px', maxWidth: 320,
          }}
        >
          Gönüllü ol, gerçek görevler tamamla, Karma biriktir.
          Her iyilik seni ve çevrendeki insanları büyütür.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: i === 0 ? 20 : 6, height: 6, borderRadius: 999,
              background: i === 0 ? c.gold : c.ink600,
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
