'use client'

// Vol-30.3 MissionListCard — 84×84 thumbnail + NGO color top-stripe.
// Liste tipi: hero kart altında dashboard'da ve görevler listesinde gösterilir.
//
// Layout:
//   ┌────┬────────────────────────────────────────┐
//   │ 84 │  NGO ETIKETI (color)                    │
//   │ x  │  Görev başlığı (2 satır)                │
//   │ 84 │  Why / impact (1 satır italic Fraunces) │
//   │    │  📍 lokasyon · ⏱ süre        [+karma]  │
//   └────┴────────────────────────────────────────┘
//
// Üstte 3px NGO color şerit, thumbnail içinde.

import Link from 'next/link'
import { MapPin, Clock } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import type { MissionWithNGO } from '@/lib/supabase/types'

interface Props {
  mission: MissionWithNGO
  href?: string
}

export function MissionListCardVol30({ mission, href }: Props) {
  const { colors: c } = useTheme()
  const ngoColor = mission.ngos?.color_accent || c.gold
  const ngoLabel = mission.ngos?.short_name || mission.ngos?.name || ''
  const thumb =
    mission.image_url ||
    mission.photo_url ||
    mission.ngos?.cover_image_url ||
    null

  // Why / impact statement — sırasıyla impact_statement → description fallback
  const why = mission.impact_statement || mission.description || ''

  const target = href ?? `/dashboard/missions/${mission.id}`

  return (
    <Link
      href={target}
      style={{
        display: 'flex',
        gap: 12,
        padding: 12,
        borderRadius: 18,
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
        cursor: 'pointer',
        alignItems: 'stretch',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 12,
          flexShrink: 0,
          position: 'relative',
          backgroundImage: thumb ? `url(${thumb})` : undefined,
          backgroundColor: thumb ? undefined : c.ink700,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        {/* NGO color top stripe (3px) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: ngoColor,
          }}
        />
        {!thumb && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              opacity: 0.5,
            }}
            aria-hidden
          >
            ✦
          </div>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {ngoLabel && (
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: ngoColor,
                textTransform: 'uppercase',
                marginBottom: 3,
              }}
            >
              {ngoLabel}
            </div>
          )}
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: c.cream,
              lineHeight: 1.25,
              marginBottom: 4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {mission.title}
          </div>
          {why && (
            <div
              style={{
                fontSize: 11,
                color: c.ink300,
                fontStyle: 'italic',
                fontFamily: "'Fraunces', serif",
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {why}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 6,
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 10,
              fontSize: 11,
              color: c.ink400,
              minWidth: 0,
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {mission.location && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                <MapPin size={11} />
                {mission.location}
              </span>
            )}
            {mission.duration && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                <Clock size={11} />
                {mission.duration}
              </span>
            )}
          </div>
          <div
            style={{
              padding: '3px 8px',
              borderRadius: 999,
              background: c.goldSoft,
              border: `1px solid ${c.goldLine}`,
              fontSize: 11,
              fontWeight: 700,
              color: c.gold,
              flexShrink: 0,
            }}
          >
            +{mission.karma}
          </div>
        </div>
      </div>
    </Link>
  )
}
