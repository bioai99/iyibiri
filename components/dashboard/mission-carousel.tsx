'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/lib/theme'
import { MissionCard } from '@/components/ui/mission-card'
import type { MissionWithNGO } from '@/lib/supabase/types'

interface MissionCarouselProps {
  missions: MissionWithNGO[]
  userId?: string
  isMember?: (ngoId: string) => boolean
  savedIds?: Set<string>
}

export function MissionCarousel({
  missions,
  userId,
  isMember,
  savedIds,
}: MissionCarouselProps) {
  const { colors: c } = useTheme()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Handle scroll-based active index detection
  useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const handleScroll = () => {
      const cardWidth = scrollEl.clientWidth * 0.88
      if (cardWidth > 0) {
        const idx = Math.round(scrollEl.scrollLeft / cardWidth)
        setActiveIndex(Math.min(idx, missions.length - 1))
      }
    }

    scrollEl.addEventListener('scroll', handleScroll)
    return () => scrollEl.removeEventListener('scroll', handleScroll)
  }, [missions.length])

  if (missions.length === 0) return null

  return (
    <section aria-label="Günün önerileri" style={{ padding: '16px 0 0' }}>
      {/* Section head */}
      <header style={{ marginBottom: 12, paddingLeft: 20, paddingRight: 20 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left: label + accent bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-block',
                width: 4,
                height: 12,
                borderRadius: 999,
                background: c.gold,
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                color: c.gold,
                letterSpacing: '0.12em',
              }}
            >
              Bugün senin için
            </span>
          </div>

          {/* Right: dot indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            role="tablist"
          >
            {missions.map((_, i) => (
              <span
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Görev ${i + 1}`}
                style={{
                  width: i === activeIndex ? 16 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: i === activeIndex ? c.gold : c.ink600,
                  transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Carousel viewport — native CSS scroll-snap */}
      <div
        ref={scrollRef}
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Hide WebKit scrollbar */}
        <style jsx>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Carousel track */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 4,
          }}
        >
          {missions.map((mission) => (
            <div
              key={mission.id}
              style={{
                scrollSnapAlign: 'start',
                flex: '0 0 88%',
              }}
            >
              <MissionCard
                mission={mission}
                variant="hero"
                userId={userId}
                isSaved={savedIds?.has(mission.id) ?? false}
                isMember={isMember?.(mission.ngo_id ?? '') ?? false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
