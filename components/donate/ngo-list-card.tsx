'use client'

// Vol-31 NGO list card — bağış sekmesindeki dikey STK listesi.
// 52x52 logo (gradient bg) + name (verified ✓) + tagline + cat badge + supporters + Bağış CTA.
//
// Vol-58 (2026-05-03): logo_url varsa gerçek logo render (beyaz arkaplan + padding).
// Yoksa initial gradient fallback. Logo loaded state ile beyaz flicker önlenir.

import Link from 'next/link'
import Image from 'next/image'
import { useState, type ReactNode } from 'react'
import { useTheme } from '@/lib/theme'
import { getCauseLabel } from '@/lib/labels'
import type { NGO } from '@/lib/supabase/types'

interface Props {
  ngo: NGO
  highlightTerm?: string
  /** Destekçi sayısı opsiyonel — campaigns.supporter_count toplamı veya member_count */
  supporterCount?: number
}

function highlightMatch(text: string, term: string | undefined, color: string): ReactNode {
  if (!term) return text
  const lower = text.toLowerCase()
  const i = lower.indexOf(term.toLowerCase())
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark
        style={{
          background: `${color}33`,
          color,
          padding: '0 2px',
          borderRadius: 3,
        }}
      >
        {text.slice(i, i + term.length)}
      </mark>
      {text.slice(i + term.length)}
    </>
  )
}

export function NgoListCard({ ngo, highlightTerm, supporterCount }: Props) {
  const { colors: c } = useTheme()
  const accent = ngo.color_accent || c.gold
  const label = ngo.short_name || ngo.name
  const initial = label[0] ?? '?'
  const taglineRaw = ngo.tagline || ngo.description || ''
  const catKey = (ngo.category ?? '').toLowerCase()
  const catLabel = catKey ? getCauseLabel(catKey) : null
  const verified = ngo.tax_exempt === true
  const logoUrl = ngo.logo_url || null
  // Vol-58: logo_url broken olursa initial fallback'e düş.
  const [logoBroken, setLogoBroken] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const showLogo = !!logoUrl && !logoBroken

  return (
    <Link
      href={`/dashboard/donate/${ngo.id}`}
      style={{
        display: 'flex',
        gap: 12,
        padding: 12,
        borderRadius: 16,
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
        textDecoration: 'none',
        color: 'inherit',
        alignItems: 'stretch',
      }}
    >
      {/* Vol-58: logo_url varsa Image (beyaz arkaplan + padding), yoksa initial gradient */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: showLogo && logoLoaded
            ? '#fff'
            : `linear-gradient(135deg, ${accent}, ${accent}88)`,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Fraunces', ui-serif, serif",
          fontSize: 20,
          fontWeight: 600,
          flexShrink: 0,
          boxShadow: `0 4px 12px ${accent}33`,
          overflow: 'hidden',
          position: 'relative',
          border: showLogo && logoLoaded ? `1px solid ${accent}33` : 'none',
          transition: 'background 220ms ease, border-color 220ms ease',
        }}
        aria-hidden
      >
        {showLogo ? (
          <Image
            src={logoUrl!}
            alt=""
            fill
            sizes="52px"
            style={{
              objectFit: 'contain',
              padding: 6,
              opacity: logoLoaded ? 1 : 0,
              transition: 'opacity 200ms ease',
            }}
            quality={85}
            onLoad={() => setLogoLoaded(true)}
            onError={() => setLogoBroken(true)}
          />
        ) : (
          initial
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: c.cream,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {highlightMatch(ngo.name, highlightTerm, c.gold)}
          </span>
          {verified && (
            <span
              title="Vergi indirimli"
              aria-label="Vergi indirimli"
              style={{ color: c.success ?? '#5DC395', fontSize: 11, flexShrink: 0 }}
            >
              ✓
            </span>
          )}
        </div>
        {taglineRaw && (
          <div
            style={{
              fontSize: 11,
              color: c.ink300,
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: 6,
            }}
          >
            {taglineRaw}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            fontSize: 10,
            color: c.ink400,
          }}
        >
          {catLabel && (
            <span
              style={{
                padding: '2px 6px',
                borderRadius: 5,
                background: `${accent}1F`,
                color: accent,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {catLabel}
            </span>
          )}
          {typeof supporterCount === 'number' && supporterCount > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>{supporterCount.toLocaleString('tr-TR')} destekçi</span>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          alignSelf: 'center',
          padding: '7px 12px',
          borderRadius: 10,
          background: c.goldSoft,
          color: c.gold,
          fontSize: 12,
          fontWeight: 700,
          border: `1px solid ${c.gold}33`,
          flexShrink: 0,
        }}
      >
        Bağış
      </div>
    </Link>
  )
}
