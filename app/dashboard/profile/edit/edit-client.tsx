'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, MapPin } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'
import { createClient } from '@/lib/supabase/client'

const causes = [
  { name: 'Çevre', sub: 'Ağaç, deniz, iklim' },
  { name: 'Eğitim', sub: 'Çocuk, kitap, mentör' },
  { name: 'Hayvanlar', sub: 'Barınak, sokak, yaban' },
  { name: 'Sağlık', sub: 'Kan bağışı, yaşlı, bakım' },
  { name: 'Afet', sub: 'Deprem, yangın, yardım' },
  { name: 'Topluluk', sub: 'Yerel, kültür, sanat' },
]

interface EditProfileClientProps {
  userId: string
  email: string
  initialName: string
  initialCity: string
  initialInterests: string[]
  initialRadius: number
}

export function EditProfileClient({
  userId,
  email,
  initialName,
  initialCity,
  initialInterests,
  initialRadius,
}: EditProfileClientProps) {
  const { colors: c } = useTheme()
  const router = useRouter()

  const [name, setName] = useState(initialName)
  const [city, setCity] = useState(initialCity)
  const [interests, setInterests] = useState<string[]>(initialInterests)
  const [radius, setRadius] = useState(initialRadius)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const displayFont = 'var(--font-display), ui-serif, Georgia, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'
  const fillPct = ((radius - 1) / (50 - 1)) * 100

  function toggleInterest(n: string) {
    setInterests(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n])
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({
      name: name.trim() || null,
      city: city.trim() || null,
      interests,
      search_radius: radius,
    }).eq('id', userId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      router.push('/dashboard/profile')
      router.refresh()
    }, 600)
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: uiFont, fontSize: 11, fontWeight: 600, color: c.ink300,
    letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8,
    display: 'block',
  }
  const inputContainerStyle: React.CSSProperties = {
    background: c.ink800, border: `1px solid ${c.ink600}`, borderRadius: 12,
    display: 'flex', alignItems: 'center',
  }
  const inputStyle: React.CSSProperties = {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    padding: '14px', fontFamily: uiFont, fontSize: 15, color: c.cream, fontWeight: 500,
    width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ background: c.ink900, minHeight: '100vh', color: c.cream }}>
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/dashboard/profile" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>
        <h1 style={{ fontFamily: displayFont, fontSize: 20, fontWeight: 500, margin: 0, color: c.cream }}>
          Profilini düzenle
        </h1>
      </div>

      <div style={{ padding: '28px 20px 120px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>AD SOYAD</label>
          <div style={inputContainerStyle}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Adın Soyadın"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label style={labelStyle}>E-POSTA</label>
          <div style={{ ...inputContainerStyle, opacity: 0.5 }}>
            <input
              type="email"
              value={email}
              disabled
              style={{ ...inputStyle, cursor: 'not-allowed' }}
            />
          </div>
          <p style={{ fontFamily: uiFont, fontSize: 11, color: c.ink400, marginTop: 6 }}>
            E-posta adresi değiştirilemez.
          </p>
        </div>

        {/* City */}
        <div>
          <label style={labelStyle}>ŞEHİR</label>
          <div style={inputContainerStyle}>
            <MapPin size={16} color={c.ink400} style={{ marginLeft: 14, flexShrink: 0 }} />
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Şehrini yaz"
              style={{ ...inputStyle, paddingLeft: 10 }}
            />
          </div>
        </div>

        {/* Search radius */}
        <div>
          <label style={labelStyle}>ARAMA MESAFESİ</label>
          <div style={{
            background: c.ink800, border: `1px solid ${c.ink600}`, borderRadius: 14,
            padding: '16px 18px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontFamily: uiFont, fontSize: 13, color: c.ink300 }}>Mesafe</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: c.gold, fontVariantNumeric: 'tabular-nums' }}>
                {radius} km
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,.05)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${fillPct}%`,
                  background: `linear-gradient(90deg, ${c.goldDim}, ${c.gold})`,
                  borderRadius: 999,
                }} />
              </div>
              <div style={{
                position: 'absolute', top: '50%', left: `${fillPct}%`,
                transform: 'translate(-50%, -50%)',
                width: 18, height: 18, borderRadius: '50%',
                background: c.gold, border: '3px solid #241E18',
                boxShadow: '0 2px 8px rgba(0,0,0,.45)', pointerEvents: 'none',
              }} />
              <input
                type="range" min={1} max={50} value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  opacity: 0, cursor: 'pointer', margin: 0,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: c.ink400 }}>1 km</span>
              <span style={{ fontSize: 11, color: c.ink400 }}>50 km</span>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label style={labelStyle}>İLGİ ALANLARI</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {causes.map(cause => {
              const isSelected = interests.includes(cause.name)
              return (
                <button
                  key={cause.name}
                  onClick={() => toggleInterest(cause.name)}
                  style={{
                    position: 'relative', textAlign: 'left', cursor: 'pointer',
                    background: isSelected ? c.goldSoft : c.ink800,
                    border: `1.5px solid ${isSelected ? c.gold : c.ink600}`,
                    borderRadius: 14, padding: '14px 12px',
                    transition: 'all 180ms ease',
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 22, height: 22, borderRadius: '50%', background: c.gold,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={13} color="#241E18" strokeWidth={2.5} />
                    </div>
                  )}
                  <p style={{
                    fontFamily: 'Fraunces, serif', fontStyle: 'italic',
                    fontSize: 17, fontWeight: 500,
                    color: isSelected ? c.gold : c.cream,
                    margin: '0 0 4px', paddingRight: isSelected ? 28 : 0, lineHeight: 1.2,
                  }}>
                    {cause.name}
                  </p>
                  <p style={{ fontSize: 11, color: c.ink300, margin: 0, lineHeight: 1.4 }}>
                    {cause.sub}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Save button — fixed bottom */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '16px 20px 32px',
        background: `linear-gradient(transparent, ${c.ink900} 20%)`,
      }}>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          style={{
            width: '100%', height: 52, borderRadius: 14,
            background: saved ? '#34D399' : c.gold,
            border: 'none', color: '#241E18',
            fontFamily: uiFont, fontSize: 15, fontWeight: 700,
            cursor: saving ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 1px 2px rgba(26,22,18,.3), inset 0 1px 0 rgba(255,255,255,.3)',
            transition: 'background 300ms ease',
          }}
        >
          {saved ? (
            <><Check size={18} strokeWidth={2.5} /> Kaydedildi</>
          ) : saving ? (
            'Kaydediliyor...'
          ) : (
            'Kaydet'
          )}
        </button>
      </div>
    </div>
  )
}
