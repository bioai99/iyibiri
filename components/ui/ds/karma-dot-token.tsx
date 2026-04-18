'use client'

export function KarmaDotToken({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="kdt-face" cx="40%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#F4D98A" />
          <stop offset="100%" stopColor="#B58F3D" />
        </radialGradient>
      </defs>
      <circle cx="6" cy="6" r="5.5" fill="url(#kdt-face)" />
      <circle cx="6" cy="6" r="2.6" fill="none" stroke="#3E2F14" strokeOpacity=".35" strokeWidth="0.6" />
    </svg>
  )
}
