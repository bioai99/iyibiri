'use client'

// Vol-60 CampaignCard — STK detayında aktif kampanya listesi kartı.
// Vol-60 refactor:
//   - Route → /dashboard/donate/campaign/${campaignId} (campaign detail)
//   - Görsel sol 80x80 square, overflow:hidden + objectFit:cover — tam render
//   - Layout: image (left) | content (right: cause badge + days_left + title + summary)
//   - Supporter count + progress bar bottom

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

  // Progress bar
  const goal = campaign.goal_amount ?? 0
  const raised = campaign.raised_amount ?? 0
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0

  return (
    <Link
      href={`/dashboard/donate/campaign/${campaign.id}`}
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
        {/* Vol-60: Görsel 80x80 square, tam render — overflow:hidden + objectFit:cover */}
        <div
          style={{
            width: 80,
            height: 80,
            flexShrink: 0,
            backgroundImage: campaign.image_url
              ? `url(${campaign.image_url})`
              : undefined,
            backgroundColor: campaign.image_url ? undefined : c.ink700,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
          }}
        />
        <div style={{ flex: 1, padding: '10px 12px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Cause badge + days left */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 4,
              flexWrap: 'wrap',
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
              <span style={{ fontSize: 9, color: c.ink400, fontWeight: 500 }}>
                {daysLeft === 0 ? 'Son gün' : `${daysLeft}g`}
              </span>
            )}
          </div>
          {/* Title */}
          <h4
            style={{
              margin: '0 0 4px',
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 13,
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
                fontSize: 10,
                color: c.ink300,
                lineHeight: 1.3,
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
      {/* Bottom: supporter count + progress bar */}
      <div style={{ padding: '8px 12px 10px' }}>
        <div
          style={{
            fontSize: 9,
            color: c.ink400,
            marginBottom: 6,
            fontWeight: 500,
          }}
        >
          {campaign.supporter_count.toLocaleString('tr-TR')} kişi destekliyor
        </div>
        {goal > 0 && (
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: 'rgba(244,238,223,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${c.gold}, #F4D98A)`,
                borderRadius: 999,
              }}
            />
          </div>
        )}
      </div>
    </Link>
  )
}
