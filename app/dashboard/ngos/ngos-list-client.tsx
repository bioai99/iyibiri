'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Search, Users, Target } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { EmptyStateV2, emptyPresets } from '@/components/ui/state'
import type { NGO } from '@/lib/supabase/types'

// Faz 5 (2026-04-26 perf-eng): NGO list logo next/image.

interface NGOsListClientProps {
  ngos: NGO[]
}

export function NGOsListClient({ ngos }: NGOsListClientProps) {
  const { colors: c } = useTheme()
  const [query, setQuery] = useState('')

  const nonSponsors = ngos.filter(n => n.category !== 'sponsor')
  const filtered = query.trim()
    ? nonSponsors.filter(n =>
        n.name.toLowerCase().includes(query.toLowerCase()) ||
        (n.tagline ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : nonSponsors

  return (
    <div style={{ minHeight: '100vh', background: c.ink900, color: c.cream, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top, 20px) + 16px) 20px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: `1px solid ${c.ink600}`,
        background: c.ink900,
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <ArrowLeft size={18} color={c.cream} />
          </div>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{
            margin: 0,
            fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: c.cream,
          }}>
            İyilik Öncüleri
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: c.ink300 }}>
            STK, vakıf, dernek ve belediyeler
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '16px 20px 8px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: c.ink800,
          border: `1px solid ${c.ink600}`,
          borderRadius: 14,
          padding: '0 14px',
          height: 44,
        }}>
          <Search size={16} color={c.ink300} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Kuruluş ara..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: c.cream,
              fontSize: 14,
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* NGO List */}
      <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && (
          query.trim() ? (
            <EmptyStateV2
              {...emptyPresets.noSearchResults}
              primaryAction={{ label: 'Aramayı temizle', onClick: () => setQuery('') }}
            />
          ) : (
            <EmptyStateV2
              illustration="heart"
              title="Kuruluşlar yakında burada"
              description="Yeni STK'lar onaylandıkça burada listelenir. Görevler de onlarla birlikte gelir."
            />
          )
        )}

        {filtered.map(ngo => (
          <Link
            key={ngo.id}
            href={`/dashboard/ngos/${ngo.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 16,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              transition: 'border-color 200ms',
            }}>
              {/* Logo */}
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: ngo.logo_url ? c.cream : (ngo.color_accent ?? c.gold),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
                border: `2px solid ${c.ink600}`,
              }}>
                {ngo.logo_url ? (
                  <Image
                    src={ngo.logo_url}
                    alt={ngo.name}
                    width={42}
                    height={42}
                   
                    style={{ objectFit: 'contain' }}
                    quality={80}
                  />
                ) : (
                  <span style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: c.cream,
                    fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
                  }}>
                    {(ngo.short_name ?? ngo.name)[0]}
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 600,
                  color: c.cream,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {ngo.name}
                </p>
                {ngo.tagline && (
                  <p style={{
                    margin: '3px 0 0',
                    fontSize: 12,
                    color: c.ink300,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {ngo.tagline}
                  </p>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={12} color={c.ink400} />
                    <span style={{ fontSize: 11, color: c.ink400, fontWeight: 600 }}>
                      {/* BUG-030 fix (Vol-14): TR locale thousand separator */}
                      {(ngo.member_count ?? 0).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Target size={12} color={c.ink400} />
                    <span style={{ fontSize: 11, color: c.ink400, fontWeight: 600 }}>
                      {(ngo.volunteer_count ?? 0).toLocaleString('tr-TR')} gönüllü
                    </span>
                  </div>
                </div>
              </div>

              {/* Chevron */}
              <span style={{ color: c.ink400, fontSize: 18, flexShrink: 0, fontWeight: 300 }}>
                ›
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
