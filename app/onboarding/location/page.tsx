'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Info } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'

export default function OnboardingLocation() {
  const { colors: c } = useTheme()
  const [city, setCity] = useState('İstanbul')
  const [radius, setRadius] = useState(10)
  const [cityFocused, setCityFocused] = useState(false)
  const fillPct = ((radius - 1) / (50 - 1)) * 100

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: c.ink900,
        overflowY: 'auto',
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        paddingBottom: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Link href="/onboarding/causes" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>

        {/* Progress bar: 4 segments, 3 filled gold */}
        <div style={{ display: 'flex', flex: 1, gap: 4 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 999,
                background: i < 3 ? c.gold : c.ink600,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 24px 0' }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: c.gold,
            margin: '0 0 10px',
          }}
        >
          ADIM 3 / 4
        </p>

        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: c.cream,
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          {'Nerede '}
          <em style={{ fontStyle: 'italic' }}>iyi olmak</em>
          {' istersin?'}
        </h1>
      </div>

      {/* Form */}
      <div
        style={{
          padding: '28px 20px 0',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* City input */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: c.ink300,
              marginBottom: 8,
            }}
          >
            Şehir
          </label>
          <div
            style={{
              position: 'relative',
              background: c.ink800,
              border: `1.5px solid ${cityFocused ? c.gold : c.ink600}`,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              transition: 'border-color 180ms ease',
            }}
          >
            <MapPin
              size={16}
              color={cityFocused ? c.gold : c.ink400}
              style={{ position: 'absolute', left: 14, pointerEvents: 'none', transition: 'color 180ms ease' }}
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setCityFocused(true)}
              onBlur={() => setCityFocused(false)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                paddingLeft: 40,
                paddingRight: 14,
                paddingTop: 14,
                paddingBottom: 14,
                fontSize: 15,
                color: c.cream,
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Radius card */}
        <div
          style={{
            background: c.ink800,
            border: `1.5px solid ${c.ink600}`,
            borderRadius: 16,
            padding: 22,
          }}
        >
          {/* Label row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: c.ink300,
              }}
            >
              Yarıçap
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: c.gold,
                fontVariantNumeric: 'tabular-nums',
                fontFeatureSettings: '"tnum"',
              }}
            >
              {radius} km
            </span>
          </div>

          {/* Slider track */}
          <div style={{ position: 'relative', marginBottom: 8 }}>
            {/* Track bg */}
            <div
              style={{
                height: 6,
                borderRadius: 999,
                background: 'rgba(255,255,255,.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Fill */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${fillPct}%`,
                  background: `linear-gradient(90deg, ${c.goldDim}, ${c.gold})`,
                  borderRadius: 999,
                  transition: 'width 60ms linear',
                }}
              />
            </div>

            {/* Thumb */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${fillPct}%`,
                transform: 'translate(-50%, -50%)',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: c.gold,
                border: '3px solid #241E18',
                boxShadow: '0 2px 8px rgba(0,0,0,.45)',
                pointerEvents: 'none',
                transition: 'left 60ms linear',
              }}
            />

            {/* Hidden range input on top for interaction */}
            <input
              type="range"
              min={1}
              max={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                margin: 0,
              }}
            />
          </div>

          {/* Min/max labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: c.ink400 }}>1 km</span>
            <span style={{ fontSize: 11, color: c.ink400 }}>50 km</span>
          </div>
        </div>

        {/* Info note */}
        <div
          style={{
            marginTop: 14,
            border: `1px solid ${c.ink600}`,
            background: `rgba(196,203,172,0.06)`,
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <Info size={14} color={c.ink300} style={{ flexShrink: 0, marginTop: 1 }} />
          <p
            style={{
              fontSize: 13,
              color: c.ink300,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Online görevler konum fark etmeksizin sana önerilir.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '0 16px calc(env(safe-area-inset-bottom, 16px) + 8px)' }}>
        <Link
          href="/onboarding/ready"
          onClick={() => {
            localStorage.setItem('iyibiri_onboarding_city', city)
            localStorage.setItem('iyibiri_onboarding_radius', String(radius))
          }}
          style={{ textDecoration: 'none' }}
        >
          <button
            style={{
              width: '100%',
              background: c.gold,
              color: '#241E18',
              border: 'none',
              borderRadius: 999,
              padding: '14px 20px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {radius} km içinde ara
          </button>
        </Link>
      </div>
    </div>
  )
}
