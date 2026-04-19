'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Trees, BookOpen, PawPrint, HeartPulse, Flame, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'

const causes = [
  { name: 'Çevre', sub: 'Ağaç dikimi, temizlik, geri dönüşüm', icon: Trees, gradient: 'linear-gradient(135deg, #6B8E4E, #4a6237)' },
  { name: 'Eğitim', sub: 'Mentörlük, okuma, kitap bağışı', icon: BookOpen, gradient: 'linear-gradient(135deg, #4A6FA5, #2d4a7a)' },
  { name: 'Hayvanlar', sub: 'Barınak, mama, sahiplendirme', icon: PawPrint, gradient: 'linear-gradient(135deg, #C8553D, #8a3a27)' },
  { name: 'Sağlık', sub: 'Kan bağışı, yaşlı bakımı', icon: HeartPulse, gradient: 'linear-gradient(135deg, #D4627A, #a04358)' },
  { name: 'Afet', sub: 'Deprem, yangın, yardım', icon: Flame, gradient: 'linear-gradient(135deg, #E8A838, #b8842a)' },
  { name: 'Topluluk', sub: 'Mahalle, kültür, sanat', icon: Users, gradient: 'linear-gradient(135deg, #7B68A8, #5a4d7d)' },
]

export default function OnboardingCauses() {
  const { colors: c } = useTheme()
  const [selected, setSelected] = useState<string[]>([])
  const uiFont = 'var(--font-sans), system-ui, sans-serif'
  const displayFont = 'var(--font-display), Fraunces, serif'

  function toggle(name: string) {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden',
      height: '100%',
    }}>
      {/* Header */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Link href="/onboarding/welcome" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>
        {/* Progress bar — 2 segments, adım 1 */}
        <div style={{ display: 'flex', flex: 1, gap: 4 }}>
          {[0, 1].map(i => {
            const isCurrentStep = i === 0
            return (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: c.ink600, overflow: 'hidden' }}>
                {isCurrentStep && (
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
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
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.gold, margin: '0 0 8px' }}
        >
          ADIM 1 / 2
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            fontFamily: displayFont, fontSize: 28, fontWeight: 500,
            letterSpacing: '-0.025em', color: c.cream, margin: '0 0 6px', lineHeight: 1.15,
          }}
        >
          Neye <em style={{ fontStyle: 'italic', color: c.gold }}>gönlün</em> yatıyor?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: 14, color: c.ink300, margin: 0, lineHeight: 1.5 }}
        >
          Sana uygun görevler bulalım. Dilediğin kadar seç.
        </motion.p>
      </div>

      {/* Causes grid */}
      <div style={{
        padding: '16px 16px', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 10,
        flex: 1, overflowY: 'auto', alignContent: 'start',
      }}>
        {causes.map((cause, idx) => {
          const isSelected = selected.includes(cause.name)
          const Icon = cause.icon
          return (
            <motion.button
              key={cause.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.08, duration: 0.4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(cause.name)}
              style={{
                position: 'relative', textAlign: 'left', cursor: 'pointer',
                background: isSelected ? c.goldSoft : c.ink800,
                border: `1.5px solid ${isSelected ? c.gold : c.ink600}`,
                borderRadius: 16, padding: 0, overflow: 'hidden',
                transition: 'border-color 200ms ease, background 200ms ease',
              }}
            >
              {/* Icon strip */}
              <div style={{
                height: 52, background: isSelected ? cause.gradient : c.ink700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 200ms ease',
              }}>
                <Icon size={22} color={isSelected ? '#F4EEDF' : c.ink300} strokeWidth={1.8} />
              </div>

              {/* Text */}
              <div style={{ padding: '10px 12px 12px' }}>
                <p style={{
                  fontFamily: displayFont, fontStyle: 'italic',
                  fontSize: 16, fontWeight: 500,
                  color: isSelected ? c.gold : c.cream,
                  margin: '0 0 2px', lineHeight: 1.2,
                }}>
                  {cause.name}
                </p>
                <p style={{ fontSize: 11, color: c.ink300, margin: 0, lineHeight: 1.4 }}>
                  {cause.sub}
                </p>
              </div>

              {/* Animated checkmark */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 24, height: 24, borderRadius: '50%', background: c.gold,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,.12)',
                    }}
                  >
                    <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '0 16px calc(env(safe-area-inset-bottom, 16px) + 16px)' }}>
        <Link
          href="/onboarding/city"
          onClick={() => localStorage.setItem('iyibiri_onboarding_interests', JSON.stringify(selected))}
          style={{ textDecoration: 'none' }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%', height: 52, background: c.gold, color: c.ink,
              border: 'none', borderRadius: 14, padding: '0 20px',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              fontFamily: uiFont,
              boxShadow: '0 2px 8px rgba(0,0,0,.08)',
            }}
          >
            {selected.length > 0 ? `${selected.length} alan seçtin — Devam` : 'Atla'}
          </motion.button>
        </Link>
      </div>
    </div>
  )
}
