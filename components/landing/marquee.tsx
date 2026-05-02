'use client'

import type { ReactNode } from 'react'

/**
 * Marquee — Infinite horizontal scroll. Pure CSS keyframes (GPU smooth).
 *
 * Children duplicate edilir → seamless döngü.
 * `speed` saniye cinsinden bir tam tur (default 28s).
 * `direction`: left (default) | right.
 * `pauseOnHover`: hover'da yavaşlatır (premium hissi).
 */
export function Marquee({
  children,
  speed = 28,
  direction = 'left',
  pauseOnHover = true,
  className = '',
  fadeEdges = true,
}: {
  children: ReactNode
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
  fadeEdges?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={
        fadeEdges
          ? {
              maskImage:
                'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
            }
          : undefined
      }
    >
      <div
        className="flex gap-12 whitespace-nowrap will-change-transform"
        style={{
          animation: `lp-marquee-${direction} ${speed}s linear infinite`,
          animationPlayState: 'running',
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = 'paused'
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = 'running'
        }}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
