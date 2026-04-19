'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Trees, BookOpen, PawPrint, HeartPulse, Flame, Users } from 'lucide-react'
import { motion } from 'framer-motion'
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
  const [selected, setSelected] = useState<string[]>(['Çevre', 'Hayvanlar'])

  function toggle(name: string) {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden', position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
    }}>
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/onboarding/welcome" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>
        <div style={{ display: 'flex', flex: 1, gap: 4 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 999,
              background: i < 2 ? c.gold : c.ink600,
            }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 24px 0' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.gold, margin: '0 0 10px' }}>
          ADIM 2 / 4
        </p>
        <h1 style={{
          fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 500,
          letterSpacing: '-0.025em', color: c.cream, margin: '0 0 8px', lineHeight: 1.15,
        }}>
          Neye <em style={{ fontStyle: 'italic', color: c.gold }}>gönlün</em> yatıyor?
        </h1>
        <p style={{ fontSize: 14, color: c.ink300, margin: 0, lineHeight: 1.5 }}>
          Sana uygun görevler bulalım. Dilediğin kadar seç.
        </p>
      </div>

      {/* Causes grid */}
      <div style={{
        padding: '20px 16px', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 10,
        flex: 1, overflowY: 'auto', alignContent: 'start',
      }}>
        {causes.map((cause, idx) => {
          const isSelected = selected.includes(cause.name)
          const Icon = cause.icon
          return (
            <motion.button
              key={cause.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              onClick={() => toggle(cause.name)}
              style={{
                position: 'relative', textAlign: 'left', cursor: 'pointer',
                background: isSelected ? c.goldSoft : c.ink800,
                border: `1.5px solid ${isSelected ? c.gold : c.ink600}`,
                borderRadius: 16, padding: 0, overflow: 'hidden',
                transition: 'all 180ms ease',
              }}
            >
              {/* Icon strip */}
              <div style={{
                height: 48, background: isSelected ? cause.gradient : c.ink700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 200ms ease',
              }}>
                <Icon size={22} color={isSelected ? '#F4EEDF' : c.ink300} strokeWidth={1.8} />
              </div>

              {/* Text */}
              <div style={{ padding: '10px 12px 12px' }}>
                <p style={{
                  fontFamily: 'Fraunces, serif', fontStyle: 'italic',
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

              {/* Checkmark */}
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 22, height: 22, borderRadius: '50%', background: c.gold,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={13} color="#241E18" strokeWidth={2.5} />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '0 16px calc(env(safe-area-inset-bottom, 16px) + 20px)' }}>
        <Link
          href="/onboarding/location"
          onClick={() => localStorage.setItem('iyibiri_onboarding_interests', JSON.stringify(selected))}
          style={{ textDecoration: 'none' }}
        >
          <button style={{
            width: '100%', background: c.gold, color: '#241E18',
            border: 'none', borderRadius: 999, padding: '14px 20px',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}>
            {selected.length > 0 ? `${selected.length} alan seçtin — Devam` : 'Devam'}
          </button>
        </Link>
      </div>
    </div>
  )
}
