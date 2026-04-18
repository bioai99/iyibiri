'use client'

interface KarmaTokenProps {
  size?: number
  style?: React.CSSProperties
}

export function KarmaToken({ size = 64, style = {} }: KarmaTokenProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" style={{ display: 'block', ...style }}>
      <defs>
        <radialGradient id="kt-face" cx="40%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#F4D98A" />
          <stop offset="55%" stopColor="#E8C268" />
          <stop offset="100%" stopColor="#B58F3D" />
        </radialGradient>
        <linearGradient id="kt-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4D98A" />
          <stop offset="100%" stopColor="#8A6A2C" />
        </linearGradient>
      </defs>
      {/* drop shadow */}
      <ellipse cx="32" cy="58" rx="22" ry="2" fill="rgba(26,22,18,.2)" />
      {/* outer ring (edge) */}
      <circle cx="32" cy="32" r="30" fill="url(#kt-edge)" />
      {/* face */}
      <circle cx="32" cy="32" r="27" fill="url(#kt-face)" />
      {/* inner groove */}
      <circle cx="32" cy="32" r="22" fill="none" stroke="#8A6A2C" strokeOpacity=".4" strokeWidth="0.6" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="0.6" />
      {/* monogram "i" */}
      <g transform="translate(32,32)">
        <circle cx="0" cy="-9" r="2.4" fill="#3E2F14" />
        <path d="M-3 -3 L-3 12 L3 12 L3 -3 Z" fill="#3E2F14" />
        {/* serif feet */}
        <path d="M-6 12 L6 12 L6 10 L-6 10 Z" fill="#3E2F14" />
      </g>
      {/* highlight */}
      <path d="M 12 20 Q 20 12 32 12" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
