'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Trees, BookOpen, PawPrint, HeartPulse, Flame, Users, Loader2 } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'
import { createClient } from '@/lib/supabase/client'
import type { LucideIcon } from 'lucide-react'

interface Cause {
  name: string
  sub: string
  icon: LucideIcon
  gradient: string
}

const causes: Cause[] = [
  { name: 'Çevre', sub: 'Ağaç dikimi, temizlik, geri dönüşüm', icon: Trees, gradient: 'linear-gradient(135deg, #6B8E4E, #4a6237)' },
  { name: 'Eğitim', sub: 'Mentörlük, okuma, kitap bağışı', icon: BookOpen, gradient: 'linear-gradient(135deg, #4A6FA5, #2d4a7a)' },
  { name: 'Hayvanlar', sub: 'Barınak, mama, sahiplendirme', icon: PawPrint, gradient: 'linear-gradient(135deg, #C8553D, #8a3a27)' },
  { name: 'Sağlık', sub: 'Kan bağışı, yaşlı bakımı', icon: HeartPulse, gradient: 'linear-gradient(135deg, #D4627A, #a04358)' },
  { name: 'Afet', sub: 'Deprem, yangın, yardım', icon: Flame, gradient: 'linear-gradient(135deg, #E8A838, #b8842a)' },
  { name: 'Topluluk', sub: 'Mahalle, kültür, sanat', icon: Users, gradient: 'linear-gradient(135deg, #7B68A8, #5a4d7d)' },
]

interface InterestsClientProps {
  userId: string
  initialInterests: string[]
}

export default function InterestsClient({ userId, initialInterests }: InterestsClientProps) {
  const { colors: c } = useTheme()
  const [selected, setSelected] = useState<string[]>(initialInterests)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggle = useCallback((name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
    setSaved(false)
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ interests: selected })
        .eq('id', userId)
      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save interests:', err)
    } finally {
      setSaving(false)
    }
  }, [selected, userId])

  const displayFont = 'var(--font-display), Fraunces, serif'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh',
      background: c.ink900,
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: c.ink900,
        borderBottom: `1px solid ${c.ink600}`,
        padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Link href="/dashboard/profile" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>
        <h1 style={{
          fontFamily: displayFont, fontSize: 18, fontWeight: 600,
          color: c.cream, margin: 0, flex: 1,
          letterSpacing: '-0.01em',
        }}>
          İlgi Alanlarım
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saved ? c.success : c.gold,
            color: saved ? '#fff' : c.ink,
            border: 'none',
            borderRadius: 10,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            opacity: saving ? 0.7 : 1,
            transition: 'all 200ms ease',
            minWidth: 80,
            justifyContent: 'center',
          }}
        >
          {saving ? (
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : saved ? (
            'Kaydedildi!'
          ) : (
            'Kaydet'
          )}
        </button>
      </header>

      {/* Description */}
      <div style={{ padding: '16px 20px 8px' }}>
        <p style={{
          fontSize: 14, color: c.ink300, margin: 0, lineHeight: 1.5,
        }}>
          Seçtiğin alanlara göre görevler önerilir. Dilediğin kadar seç.
        </p>
      </div>

      {/* Causes grid */}
      <div style={{
        padding: '8px 16px 24px', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 10,
        flex: 1,
      }}>
        {causes.map((cause) => {
          const isSelected = selected.includes(cause.name)
          const Icon = cause.icon
          return (
            <button
              key={cause.name}
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
                height: 48, minHeight: 48, maxHeight: 48,
                background: isSelected ? cause.gradient : c.ink700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 200ms ease',
                borderRadius: '14px 14px 0 0',
              }}>
                <Icon size={22} color={isSelected ? '#F4EEDF' : c.ink300} strokeWidth={1.8} style={{ display: 'block' }} />
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

              {/* Checkmark */}
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 24, height: 24, borderRadius: '50%', background: c.gold,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,.12)',
                }}>
                  <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom info */}
      <div style={{
        padding: '0 16px calc(env(safe-area-inset-bottom, 16px) + 16px)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 13, color: c.ink400, margin: 0 }}>
          {selected.length} alan seçildi
        </p>
      </div>

      {/* Keyframe for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
