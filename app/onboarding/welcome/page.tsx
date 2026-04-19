'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, Star, Gift } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { BrandLogo } from '@/components/ui/brand-logo'

export default function OnboardingWelcome() {
  const { colors: c } = useTheme()
  const [slide, setSlide] = useState(0)
  const uiFont = 'var(--font-sans), system-ui, sans-serif'
  const displayFont = 'var(--font-display), Fraunces, serif'

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % 3), 3500)
    return () => clearInterval(timer)
  }, [])

  const slides = [
    {
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <BrandLogo size={110} animate idle showWordmark />
        </div>
      ),
      title: 'İyilik biriktirilir.',
      subtitle: 'Gönüllü ol, görevler tamamla, dünyayı güzelleştir.',
    },
    {
      content: (
        <div style={{
          width: '80%', maxWidth: 280, background: c.ink800,
          border: `1px solid ${c.ink600}`, borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{ height: 80, background: 'linear-gradient(135deg, #6B8E4E, #4a6237)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={28} color="#F4EEDF" />
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ fontFamily: displayFont, fontSize: 15, color: c.cream, lineHeight: 1.3 }}>
              Sahil Temizliği — Kilyos
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 11, color: c.ink300 }}>Bu Cumartesi · 2 saat</span>
              <span style={{ background: c.goldSoft, color: c.gold, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>+200</span>
            </div>
          </div>
        </div>
      ),
      title: 'Yakınındaki görevleri bul.',
      subtitle: 'Çevre, eğitim, hayvanlar — sana uygun görevler bir dokunuş uzağında.',
    },
    {
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: c.ink800, border: `1px solid ${c.ink600}`,
            borderRadius: 16, padding: '16px 24px',
          }}>
            <Star size={24} color={c.gold} fill={c.gold} />
            <div>
              <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 500, color: c.gold, letterSpacing: '-0.02em' }}>1.284</div>
              <div style={{ fontSize: 11, color: c.ink300 }}>Karma biriktirdin</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Starbucks', 'Nike', 'Migros'].map(brand => (
              <div key={brand} style={{
                background: c.ink800, border: `1px solid ${c.ink600}`,
                borderRadius: 10, padding: '8px 14px', fontSize: 12, color: c.ink300, fontWeight: 600,
              }}>
                {brand}
              </div>
            ))}
          </div>
        </div>
      ),
      title: 'Karma biriktir, ödüller kazan.',
      subtitle: 'Starbucks, Nike, Migros — iyiliğin karşılığı gerçek.',
    },
  ]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: c.ink900, height: '100%',
    }}>
      {/* Slide area */}
      <div style={{
        flex: '1 1 auto', position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'calc(env(safe-area-inset-top, 20px) + 30px) 24px 0',
        overflow: 'hidden',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              width: '100%', minHeight: 200,
            }}
          >
            {slides[slide].content}
          </motion.div>
        </AnimatePresence>

        {/* Slide dots */}
        <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
          {[0, 1, 2].map(i => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: slide === i ? 20 : 8, height: 8, borderRadius: 999,
                background: slide === i ? c.gold : c.ink600,
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 300ms ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom content */}
      <div style={{ padding: '20px 28px calc(env(safe-area-inset-bottom, 16px) + 24px)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 style={{
              fontFamily: displayFont, fontSize: 28, fontWeight: 400,
              letterSpacing: '-0.03em', lineHeight: 1.1,
              color: c.cream, margin: '0 0 6px',
            }}>
              {slides[slide].title.includes('İyilik') ? (
                <><em style={{ fontStyle: 'italic', color: c.gold }}>İyilik</em> biriktirilir.</>
              ) : slides[slide].title.includes('görev') ? (
                <>Yakınındaki <em style={{ fontStyle: 'italic', color: c.gold }}>görevleri</em> bul.</>
              ) : (
                <>Karma biriktir, <em style={{ fontStyle: 'italic', color: c.gold }}>ödüller</em> kazan.</>
              )}
            </h1>
            <p style={{
              fontFamily: uiFont, fontSize: 14, color: c.ink300,
              lineHeight: 1.5, margin: 0, maxWidth: 300,
            }}>
              {slides[slide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
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
        </div>
      </div>
    </div>
  )
}
