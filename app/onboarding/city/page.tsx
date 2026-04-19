'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'

const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Eskişehir', 'Konya', 'Adana', 'Gaziantep', 'Trabzon', 'Samsun', 'Diyarbakır']
const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+']

export default function OnboardingCity() {
  const { colors: c } = useTheme()
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedAge, setSelectedAge] = useState<string | null>(null)
  const uiFont = 'var(--font-sans), system-ui, sans-serif'
  const displayFont = 'var(--font-display), Fraunces, serif'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: c.ink900, height: '100%' }}>
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/onboarding/causes" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>
        {/* Progress bar — 2 segments, adım 2 */}
        <div style={{ display: 'flex', flex: 1, gap: 4 }}>
          {[0, 1].map(i => {
            const isFilled = i < 1
            const isCurrentStep = i === 1
            return (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: c.ink600, overflow: 'hidden' }}>
                {(isFilled || isCurrentStep) && (
                  <motion.div
                    initial={{ width: isFilled ? '100%' : '0%' }}
                    animate={{ width: '100%' }}
                    transition={isCurrentStep ? { duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] } : { duration: 0 }}
                    style={{ height: '100%', background: c.gold, borderRadius: 999 }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 24px 0' }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.gold, margin: '0 0 8px' }}>
          ADIM 2 / 2
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 500, letterSpacing: '-0.025em', color: c.cream, margin: '0 0 6px', lineHeight: 1.15 }}>
          Hangi <em style={{ fontStyle: 'italic', color: c.gold }}>şehirdesin?</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ fontSize: 14, color: c.ink300, margin: 0, lineHeight: 1.5 }}>
          Yakınındaki görevleri öncelikli gösterelim.
        </motion.p>
      </div>

      {/* City chips + Age range */}
      <div style={{ padding: '20px 16px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {cities.map((city, idx) => (
            <motion.button
              key={city}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(selected === city ? null : city)}
              style={{
                padding: '10px 18px', borderRadius: 999,
                background: selected === city ? c.gold : c.ink800,
                border: `1.5px solid ${selected === city ? c.gold : c.ink600}`,
                color: selected === city ? c.ink : c.cream,
                fontSize: 14, fontWeight: selected === city ? 700 : 500,
                fontFamily: uiFont, cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              {city}
            </motion.button>
          ))}
        </div>

        {/* Age range section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          style={{ marginTop: 28 }}
        >
          <p style={{
            fontSize: 13, fontWeight: 600, color: c.ink300,
            margin: '0 0 10px', paddingLeft: 4,
            fontFamily: uiFont,
          }}>
            Yaş aralığın (isteğe bağlı)
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ageRanges.map((age, idx) => (
              <motion.button
                key={age}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + idx * 0.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAge(selectedAge === age ? null : age)}
                style={{
                  padding: '10px 18px', borderRadius: 999,
                  background: selectedAge === age ? c.gold : c.ink800,
                  border: `1.5px solid ${selectedAge === age ? c.gold : c.ink600}`,
                  color: selectedAge === age ? c.ink : c.cream,
                  fontSize: 14, fontWeight: selectedAge === age ? 700 : 500,
                  fontFamily: uiFont, cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                {age}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '0 16px calc(env(safe-area-inset-bottom, 16px) + 16px)' }}>
        <Link
          href="/auth/login"
          onClick={() => {
            if (selected) localStorage.setItem('iyibiri_onboarding_city', selected)
            if (selectedAge) localStorage.setItem('iyibiri_onboarding_age', selectedAge)
          }}
          style={{ textDecoration: 'none' }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%', height: 52, background: c.gold, color: c.ink,
              border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
              fontFamily: uiFont, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,.08)',
            }}
          >
            Hesabımı oluştur <ArrowRight size={16} strokeWidth={2.5} />
          </motion.button>
        </Link>
      </div>
    </div>
  )
}
