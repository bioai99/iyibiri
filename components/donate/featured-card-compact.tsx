'use client'

// Vol-31 Featured Campaign Card — "Bu ayın kampanyaları" carousel kartı.
// 320px wide, 130px image + brand color overlay + cause + days_left + CTA.

import Link from 'next/link'
import { useTheme } from '@/lib/theme'
import type { CampaignWithNGO } from '@/lib/supabase/types'

interface Props {
  campaign: CampaignWithNGO
}

const CAUSE_LABELS: Record<string, string> = {
  env: 'Çevre',
  edu: 'Eğitim',
  animal: 'Hayvan',
  health: 'Sağlık',
  child: 'Çocuk',
  crisis: 'Afet',
}

export function FeaturedCardCompact({ campaign }: Props) {
  const { colors: c } = useTheme()
  const ngo = campaign.ngos
  const ngoColor = ngo?.color_accent || c.gold
  const ngoShort = ngo?.short_name || ngo?.name || ''
  const ngoInitial = (ngoShort || '?')[0]
  const cover = campaign.image_url || ngo?.cover_image_url || null
  const causeLabel = campaign.cause ? CAUSE_LABELS[campaign.cause] ?? campaign.cause : null

  // Kalan gün hesabı
  let daysLeft: number | null = null
  if (campaign.end_date) {
    const diff =
      new Date(campaign.end_date).getTime() - new Date().getTime()
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <Link
      href={`/dashboard/donate/${ngo?.id ?? '#'}`}
      style={{
        width: 320,
        flexShrink: 0,
        borderRadius: 18,
        overflow: 'hidden',
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
        position: 'relative',
        scrollSnapAlign: 'center',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
    >
      <div
        style={{
          height: 130,
          backgroundImage: cover ? `url(${cover})` : undefined,
          backgroundColor: cover ? undefined : c.ink700,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, transparent 20%, rgba(15,11,8,0.95) 100%)',
          }}
        />
        {/* NGO kimlik (sol üst) */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${ngoColor}, ${ngoColor}88)`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 13,
              fontWeight: 600,
            }}
            aria-hidden
          >
            {ngoInitial}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#F4EEDF',
              padding: '3px 7px',
              borderRadius: 5,
              background: 'rgba(15,11,8,0.7)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {ngoShort}
          </span>
        </div>

        {/* Kalan gün (sağ üst) */}
        {daysLeft !== null && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '4px 8px',
              borderRadius: 5,
              background: 'rgba(15,11,8,0.7)',
              backdropFilter: 'blur(6px)',
              color: c.gold,
              textTransform: 'uppercase',
            }}
          >
            {daysLeft} gün
          </div>
        )}

        {/* Cause badge + title (alt) */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 12,
            right: 12,
          }}
        >
          {causeLabel && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                padding: '3px 7px',
                borderRadius: 5,
                background: `${ngoColor}33`,
                color: ngoColor,
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: 6,
              }}
            >
              {causeLabel}
            </span>
          )}
          <h3
            style={{
              margin: 0,
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 15,
              fontWeight: 500,
              color: '#F4EEDF',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {campaign.summary || campaign.title}
          </h3>
        </div>
      </div>

      <div
        style={{
          padding: '12px 14px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 11, color: c.ink300 }}>
          {campaign.supporter_count.toLocaleString('tr-TR')} destekçi
        </span>
        <span
          style={{
            padding: '6px 11px',
            borderRadius: 8,
            background: c.goldSoft,
            color: c.gold,
            fontSize: 11,
            fontWeight: 700,
            border: `1px solid ${c.gold}33`,
          }}
        >
          Bağışla →
        </span>
      </div>
    </Link>
  )
}
