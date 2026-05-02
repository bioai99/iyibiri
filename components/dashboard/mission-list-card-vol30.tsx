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

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import type { MissionWithNGO } from '@/lib/supabase/types'

interface Props {
  mission: MissionWithNGO
  href?: string
  /** NGO profile sayfasında etiketi gizlemek için (zaten o NGO'dayız, redundant). */
  hideAuthor?: boolean
  /** Vol-56-H: kullanıcı bu göreve katıldı mı — sağ üstte "✓ Katıldım" rozeti */
  isTaken?: boolean
  /** Vol-56-H: tamamlanmış katılım — rozet "✓ Tamamlandı" olur */
  isCompleted?: boolean
}

export function MissionListCardVol30({ mission, href, hideAuthor = false, isTaken = false, isCompleted = false }: Props) {
  const { colors: c } = useTheme()
  const ngoColor = mission.ngos?.color_accent || c.gold
  const ngoLabel = mission.ngos?.short_name || mission.ngos?.name || ''
  // Vol-36 BUG-058 reopen: 4-aşamalı thumbnail fallback.
  // image_url → photo_url → NGO cover → NGO logo. Mission'ın hiç kendi görseli
  // olmadığında bile NGO kimliği thumb'da görünür, "boş daire" değil.
  // Vol-37 (live verify): backgroundImage onError tetiklemiyor — broken URL'de
  // boş kalıyordu (örn. IBB Komşuma Yardım). Image + onError state ile inisyal
  // fallback'e düşür.
  const initialThumb =
    mission.image_url ||
    mission.photo_url ||
    mission.ngos?.cover_image_url ||
    mission.ngos?.logo_url ||
    null
  const [thumbBroken, setThumbBroken] = useState(false)
  const thumb = thumbBroken ? null : initialThumb

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
        // Vol-56-H: katıldıysa gold border ile görsel olarak öne çıkar
        border: isTaken ? `1.5px solid ${c.gold}` : `1px solid ${c.ink600}`,
        boxShadow: isTaken ? `0 0 0 1px ${c.goldSoft}` : 'none',
        cursor: 'pointer',
        alignItems: 'stretch',
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
      }}
    >
      {/* Vol-56-H: "Katıldım" rozeti — kart sağ üst köşesi */}
      {isTaken && (
        <div
          style={{
            position: 'absolute',
            top: -6,
            right: 10,
            background: isCompleted ? c.sage : c.gold,
            color: isCompleted ? '#fff' : c.ink900,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 8px',
            borderRadius: 999,
            textTransform: 'uppercase',
            zIndex: 2,
            boxShadow: '0 2px 6px rgba(0,0,0,.15)',
          }}
        >
          ✓ {isCompleted ? 'Tamamlandı' : 'Katıldın'}
        </div>
      )}
      {/* Thumbnail */}
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 12,
          flexShrink: 0,
          position: 'relative',
          backgroundColor: c.ink700,
          overflow: 'hidden',
        }}
      >
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            sizes="84px"
            style={{ objectFit: 'cover' }}
            onError={() => setThumbBroken(true)}
            quality={70}
            aria-hidden
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${ngoColor}33, ${ngoColor}11)`,
              fontSize: 32,
              fontWeight: 700,
              fontFamily: "'Fraunces', ui-serif, Georgia, serif",
              color: ngoColor,
              letterSpacing: '-0.02em',
            }}
            aria-hidden
          >
            {(ngoLabel || '✦')[0]}
          </div>
        )}
        {/* NGO color top stripe (3px) — thumbnail üstünde, image katmanının üzerinde */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: ngoColor,
            zIndex: 1,
          }}
        />
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
          {ngoLabel && !hideAuthor && (
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
