'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { BrandLogo } from '@/components/ui/brand-logo'

export default function OnboardingWelcome() {
  const { colors: c } = useTheme()
  const uiFont = 'var(--font-sans), system-ui, sans-serif'
  const displayFont = 'var(--font-display), Fraunces, serif'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden',
      height: '100%',
    }}>
      {/* Hero */}
      <div style={{
        flex: '1 1 auto',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'calc(env(safe-area-inset-top, 20px) + 40px) 24px 20px',
      }}>
        <BrandLogo size={130} animate idle showWordmark />
      </div>

      {/* Bottom */}
      <div style={{ padding: '0 28px calc(env(safe-area-inset-bottom, 16px) + 24px)' }}>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontFamily: displayFont, fontSize: 30, fontWeight: 400,
            letterSpacing: '-0.03em', lineHeight: 1.1,
            color: c.cream, margin: '0 0 8px',
          }}
        >
          <em style={{ fontStyle: 'italic', color: c.gold }}>İyilik</em> biriktirilir.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            fontFamily: uiFont, fontSize: 15, color: c.ink300,
            lineHeight: 1.6, margin: '0 0 28px', maxWidth: 300,
          }}
        >
          Gönüllü ol, görevler tamamla, Karma biriktir.
          Her iyilik seni de çevreni de büyütür.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <Link href="/onboarding/causes" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', height: 52, borderRadius: 14,
              background: c.gold, border: 'none', color: c.ink,
              fontFamily: uiFont, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,.08)',
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

        {/* Progress — 3 adım */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              style={{
                width: i === 0 ? 24 : 8, height: 8, borderRadius: 999,
                background: i === 0 ? c.gold : c.ink600,
                transition: 'width 300ms ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
