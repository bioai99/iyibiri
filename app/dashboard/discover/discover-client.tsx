'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Maximize2, Leaf, BookOpen, Heart } from 'lucide-react'
import { PawPrint } from 'lucide-react'
import { MissionCard } from '@/components/ui/mission-card'
import type { MissionWithNGO, NGO } from '@/lib/supabase/types'
import { useTheme } from '@/lib/theme'

interface DiscoverClientProps {
  missions: MissionWithNGO[]
  ngos: NGO[]
}

const pins = [
  { x: 28, y: 45, count: 8, active: true },
  { x: 56, y: 62, count: 3, active: false },
  { x: 72, y: 38, count: 12, active: false },
  { x: 42, y: 78, count: 5, active: false },
]

const categories = [
  { name: 'Çevre', count: 18, color: '#C4CBAC', bg: 'rgba(196,203,172,0.12)', icon: Leaf },
  { name: 'Eğitim', count: 32, color: '#EADDB8', bg: 'rgba(234,221,184,0.12)', icon: BookOpen },
  { name: 'Hayvanlar', count: 14, color: '#E9CFC2', bg: 'rgba(233,207,194,0.12)', icon: PawPrint },
  { name: 'Sağlık', count: 9, color: '#E8B4A8', bg: 'rgba(232,180,168,0.12)', icon: Heart },
]

export function DiscoverClient({ missions }: DiscoverClientProps) {
  const { colors: c } = useTheme()
  const [query, setQuery] = useState('')

  const trendingMission = missions[missions.length - 1] ?? null

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        paddingBottom: 140,
      }}
    >
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0' }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-fraunces), Fraunces, serif',
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: c.cream,
            lineHeight: 1.25,
          }}
        >
          Bugün{' '}
          <em
            style={{
              fontStyle: 'italic',
              color: c.gold,
            }}
          >
            iyi
          </em>{' '}
          yapacağın şey?
        </h1>
      </div>

      {/* Search input */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6B6154',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="NGO, kategori veya şehir"
            style={{
              width: '100%',
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 14,
              padding: '14px 16px 14px 44px',
              fontSize: 15,
              color: c.cream,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 180ms ease',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = c.gold }}
            onBlur={(e) => { e.currentTarget.style.borderColor = c.ink600 }}
          />
        </div>
      </div>

      {/* Map preview */}
      <div style={{ padding: '16px 16px 0' }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            background: c.ink800,
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${c.ink600}`,
          }}
        >
          {/* Grid SVG pattern — v2.1: semantic tokens for strokes */}
          <svg
            viewBox="0 0 400 225"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}
          >
            <defs>
              <pattern id="gMap" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={c.ink600} strokeWidth=".5" />
              </pattern>
            </defs>
            <rect width="400" height="225" fill="url(#gMap)" />
            <path d="M20 80 Q80 60 140 80 T260 90 T380 70" stroke={c.gold} strokeWidth="1.2" fill="none" opacity=".3" />
            <path d="M30 140 Q100 120 180 150 T320 145" stroke={c.sage} strokeWidth="1" fill="none" opacity=".3" />
          </svg>

          {/* Pin markers */}
          {pins.map((pin, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                transform: 'translate(-50%, -100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  background: pin.active ? c.gold : c.ink800,
                  color: pin.active ? '#241E18' : c.cream,
                  border: pin.active ? 'none' : '1px solid #4A4237',
                  borderRadius: 20,
                  padding: '3px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                {pin.count}
              </div>
              <div
                style={{
                  width: 1.5,
                  height: 8,
                  background: pin.active ? c.gold : '#4A4237',
                  marginTop: 1,
                }}
              />
            </div>
          ))}

          {/* Bottom-left: location pill */}
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'rgba(26,22,18,0.75)',
              backdropFilter: 'blur(8px)',
              borderRadius: 20,
              padding: '5px 10px 5px 8px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <MapPin size={12} style={{ color: c.gold }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: c.cream }}>
              İstanbul · 47 görev
            </span>
          </div>

          {/* Top-right: expand button */}
          <button
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 36,
              height: 36,
              background: 'rgba(46,41,35,0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Maximize2 size={14} style={{ color: c.cream }} />
          </button>
        </div>
      </div>

      {/* Categories heading */}
      <div style={{ padding: '24px 20px 0' }}>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-fraunces), Fraunces, serif',
            fontSize: 20,
            fontWeight: 500,
            color: c.cream,
            letterSpacing: '-0.02em',
          }}
        >
          Kategoriler
        </h2>
      </div>

      {/* Categories grid */}
      <div
        style={{
          padding: '14px 16px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.name}
              href="/dashboard/missions"
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: c.ink800,
                  border: `1px solid ${c.ink600}`,
                  borderRadius: 14,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                }}
              >
                {/* Icon square */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: cat.bg,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} style={{ color: cat.color }} />
                </div>
                {/* Text */}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.cream }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B6154', marginTop: 2 }}>
                    {cat.count} görev
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Trending section */}
      <div style={{ padding: '32px 20px 14px' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: c.gold,
            marginBottom: 6,
          }}
        >
          Bu hafta
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-fraunces), Fraunces, serif',
            fontSize: 20,
            fontWeight: 500,
            color: c.cream,
            letterSpacing: '-0.02em',
          }}
        >
          Trend olanlar
        </h2>
      </div>

      {trendingMission && (
        <div style={{ padding: '0 16px' }}>
          <MissionCard mission={trendingMission} />
        </div>
      )}
    </div>
  )
}
