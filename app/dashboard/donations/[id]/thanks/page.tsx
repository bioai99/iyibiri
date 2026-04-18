'use client'

import Link from 'next/link'
import { Share2 } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { KarmaDotToken } from '@/components/ui/ds/karma-dot-token'

function BigCoin({ size = 130 }: { size?: number }) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 130 130" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="big-coin-face" cx="40%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#F4D98A" />
          <stop offset="55%" stopColor="#E8C268" />
          <stop offset="100%" stopColor="#B58F3D" />
        </radialGradient>
        <linearGradient id="big-coin-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4D98A" />
          <stop offset="100%" stopColor="#8A6A2C" />
        </linearGradient>
      </defs>
      {/* drop shadow */}
      <ellipse cx="65" cy="120" rx="44" ry="4" fill="rgba(26,22,18,.25)" />
      {/* outer ring */}
      <circle cx="65" cy="65" r="62" fill="url(#big-coin-edge)" />
      {/* face */}
      <circle cx="65" cy="65" r="56" fill="url(#big-coin-face)" />
      {/* inner grooves */}
      <circle cx="65" cy="65" r="46" fill="none" stroke="#8A6A2C" strokeOpacity=".4" strokeWidth="1" />
      <circle cx="65" cy="65" r="42" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="0.8" />
      {/* monogram "i" */}
      <g transform="translate(65,65)">
        <circle cx="0" cy="-19" r="5" fill="#3E2F14" />
        <path d="M-6 -6 L-6 24 L6 24 L6 -6 Z" fill="#3E2F14" />
        <path d="M-12 24 L12 24 L12 20 L-12 20 Z" fill="#3E2F14" />
      </g>
      {/* highlight */}
      <path
        d="M 24 40 Q 40 24 65 24"
        stroke="rgba(255,255,255,.55)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MiniCoin({ x, y, size = 34 }: { x: number; y: number; size?: number }) {
  const s = size
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 34 34"
      style={{ position: 'absolute', left: x, top: y, display: 'block' }}
    >
      <defs>
        <radialGradient id="mini-coin-face" cx="40%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#F4D98A" />
          <stop offset="100%" stopColor="#B58F3D" />
        </radialGradient>
      </defs>
      <circle cx="17" cy="17" r="16" fill="url(#mini-coin-face)" />
      <circle cx="17" cy="17" r="12" fill="none" stroke="#8A6A2C" strokeOpacity=".4" strokeWidth="0.7" />
      <g transform="translate(17,17)">
        <circle cx="0" cy="-5" r="2.2" fill="#3E2F14" />
        <path d="M-2.5 -2 L-2.5 7 L2.5 7 L2.5 -2 Z" fill="#3E2F14" />
        <path d="M-5 7 L5 7 L5 5.5 L-5 5.5 Z" fill="#3E2F14" />
      </g>
    </svg>
  )
}

export default function DonationThanksPage({ params: _ }: { params: { id: string } }) {
  const { colors: c } = useTheme()

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        height: '844px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. Hero ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Concentric rings */}
        <div
          style={{
            position: 'absolute',
            width: 340,
            height: 340,
            borderRadius: '50%',
            border: `1px solid ${c.goldLine}`,
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 260,
            height: 260,
            borderRadius: '50%',
            border: `1px solid ${c.goldLine}`,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 190,
            height: 190,
            borderRadius: '50%',
            border: `1px solid ${c.goldLine}`,
            opacity: 0.7,
          }}
        />

        {/* Floating mini coins */}
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          {/* Big coin centered */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <BigCoin size={130} />
          </div>

          {/* Mini coins around */}
          <MiniCoin x={-10} y={30} size={34} />
          <MiniCoin x={196} y={50} size={28} />
          <MiniCoin x={90} y={-8} size={24} />
        </div>
      </div>

      {/* ── 2. Text block ── */}
      <div style={{ padding: '0 24px', marginBottom: 24, textAlign: 'center' }}>
        {/* Eyebrow */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: c.gold,
            marginBottom: 12,
          }}
        >
          BAĞIŞIN ULAŞTI
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 38,
            fontWeight: 500,
            fontStyle: 'italic',
            letterSpacing: '-0.028em',
            lineHeight: 1.1,
            color: c.cream,
            margin: '0 0 12px',
          }}
        >
          Teşekkürler, Ayşe.
        </h1>

        {/* Impact message */}
        <p
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 18,
            fontStyle: 'italic',
            fontWeight: 400,
            color: c.ink300,
            margin: 0,
            lineHeight: 1.45,
            letterSpacing: '-0.01em',
          }}
        >
          ₺250 bağışın bir aileye kışlık kıyafet seti oldu.
        </p>
      </div>

      {/* ── 3. Karma card ── */}
      <div style={{ padding: '0 20px 20px' }}>
        <div
          style={{
            background: c.ink800,
            border: `1px solid ${c.goldLine}`,
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <KarmaDotToken size={34} />
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                  color: c.ink400,
                  marginBottom: 3,
                }}
              >
                KARMA KAZANDIN
              </div>
              <div style={{ fontSize: 12, color: c.ink300 }}>Toplam: 2.125 Karma</div>
            </div>
          </div>

          {/* Right */}
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: c.gold,
              letterSpacing: '-0.03em',
            }}
          >
            +125
          </span>
        </div>
      </div>

      {/* ── 4. CTAs ── */}
      <div
        style={{
          padding: '0 20px 40px',
          display: 'flex',
          gap: 8,
        }}
      >
        {/* Share ghost button */}
        <button
          style={{
            flex: 1,
            background: 'transparent',
            border: `1px solid ${c.ink600}`,
            borderRadius: 16,
            padding: '14px 16px',
            fontSize: 15,
            fontWeight: 700,
            color: c.ink200,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            letterSpacing: '.01em',
            transition: 'all 180ms cubic-bezier(.2,.8,.2,1)',
          }}
          onClick={() => {
            try {
              if (navigator.share) navigator.share({ title: 'Bağış yaptım!', url: window.location.href })
            } catch { /* silent */ }
          }}
        >
          <Share2 size={16} />
          Paylaş
        </button>

        {/* Home gold button */}
        <Link href="/dashboard" style={{ textDecoration: 'none', flex: 1 }}>
          <button
            style={{
              width: '100%',
              background: c.gold,
              border: 'none',
              borderRadius: 16,
              padding: '14px 16px',
              fontSize: 15,
              fontWeight: 700,
              color: '#24201B',
              cursor: 'pointer',
              letterSpacing: '.01em',
            }}
          >
            Ana sayfa
          </button>
        </Link>
      </div>
    </div>
  )
}
