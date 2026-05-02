'use client'

// Vol-31.3 CampaignCard — STK detayında aktif kampanya listesi kartı.
// 100px sol image + sağ body (cause badge + days_left + title 2-line + summary 1-line) + alt CTA bar.

import Link from 'next/link'
import { useTheme } from '@/lib/theme'
import { getCauseLabel } from '@/lib/labels'
import type { Campaign } from '@/lib/supabase/types'

const CAUSE_COLORS: Record<string, string> = {
  env: '#5DC395',
  edu: '#E8C268',
  animal: '#A878E0',
  health: '#E84545',
  child: '#F0B85C',
  crisis: '#C8553D',
}

interface Props {
  campaign: Campaign
  ngoId: string
}

export function CampaignCard({ campaign, ngoId }: Props) {
  const { colors: c } = useTheme()
  const causeKey = campaign.cause ?? ''
  const causeLabel = getCauseLabel(causeKey)
  const causeColor = CAUSE_COLORS[causeKey] ?? c.gold

  let daysLeft: number | null = null
  if (campaign.end_date) {
    const diff =
      new Date(campaign.end_date).getTime() - new Date().getTime()
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <Link
      href={`/dashboard/donate/${ngoId}/give?campaign=${campaign.id}`}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{ display: 'flex', gap: 0 }}>
        <div
          style={{
            width: 100,
            flexShrink: 0,
            backgroundImage: campaign.image_url
              ? `url(${campaign.image_url})`
              : undefined,
            backgroundColor: campaign.image_url ? undefined : c.ink700,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 4,
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
                  background: `${causeColor}22`,
                  color: causeColor,
                  textTransform: 'uppercase',
                }}
              >
                {causeLabel}
              </span>
            )}
            {daysLeft !== null && (
              <span style={{ fontSize: 10, color: c.ink400 }}>
                · {daysLeft} gün
              </span>
            )}
          </div>
          <h4
            style={{
              margin: '0 0 4px',
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 14,
              fontWeight: 500,
              color: c.cream,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {campaign.title}
          </h4>
          {campaign.summary && (
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: c.ink300,
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {campaign.summary}
            </p>
          )}
        </div>
      </div>
      <div
        style={{
          padding: '0 14px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 10, color: c.ink400 }}>
          {campaign.supporter_count.toLocaleString('tr-TR')} kişi destekledi
        </span>
        <span
          style={{
            padding: '6px 12px',
            borderRadius: 9,
            background: c.goldSoft,
            color: c.gold,
            fontSize: 11,
            fontWeight: 700,
            border: `1px solid ${c.gold}33`,
          }}
        >
          Bu kampanyaya bağışla →
        </span>
      </div>
    </Link>
  )
}
