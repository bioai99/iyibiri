'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Heart, ChevronRight, Leaf } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'
import { KarmaDotToken } from '@/components/ui/ds'
import type { NGO, MissionWithNGO, NgoMembership } from '@/lib/supabase/types'

interface NGOProfileClientProps {
  ngo: NGO
  missions: MissionWithNGO[]
  userId?: string
  membership?: NgoMembership | null
}

const EYEBROW: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
}

const difficultyLabel: Record<string, string> = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
}

const difficultyColor: Record<string, string> = {
  easy: '#6B8E4E',
  medium: '#D19B3C',
  hard: '#B84E3B',
}

export function NGOProfileClient({ ngo, missions, userId, membership }: NGOProfileClientProps) {
  const { colors: c } = useTheme()
  const router = useRouter()

  const coverImageUrl = ngo.cover_image_url
  const founded = ngo.founded
  const memberCount = ngo.member_count?.toLocaleString('tr-TR') ?? '—'
  const trees = '485M' // demo value for tree-planting NGOs

  return (
    <div style={{ background: c.ink900, color: c.cream, minHeight: '100%', paddingBottom: 140 }}>
      {/* Cover */}
      <div style={{ position: 'relative', height: 280 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImageUrl ?? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80'}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg,rgba(26,22,18,.45) 0%,rgba(26,22,18,0) 30%,rgba(26,22,18,0) 60%,${c.ink900} 100%)`,
          }}
        />
        {/* Top buttons */}
        <div
          style={{
            position: 'absolute',
            top: 58,
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <IconButtonDS
            icon={<ArrowLeft size={16} />}
            onClick={() => router.back()}
            theme="dark"
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <IconButtonDS icon={<Share2 size={16} />} theme="dark" />
            <IconButtonDS icon={<Heart size={16} />} theme="dark" />
            {membership?.status === 'active' ? (
              <div style={{
                height: 40, padding: '0 16px', borderRadius: 12,
                background: c.goldSoft, border: `1px solid ${c.goldLine}`,
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600, color: c.gold,
              }}>
                &#10003; Üyesin
              </div>
            ) : (
              <Link href={`/dashboard/ngos/${ngo.id}/membership`}>
                <button style={{
                  height: 40, padding: '0 20px', borderRadius: 12,
                  background: c.gold, color: '#241E18', border: 'none',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}>
                  Üye Ol
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Logo lockup */}
      <div
        style={{
          padding: '0 20px',
          marginTop: -44,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 20,
            background: '#fff',
            border: `3px solid ${c.ink900}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            flexShrink: 0,
            boxShadow: '0 8px 24px rgba(0,0,0,.3)',
          }}
        >
          {ngo.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ngo.logo_url}
              alt={ngo.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <span style={{ fontWeight: 900, color: '#57524A', fontSize: 18 }}>
              {(ngo.short_name ?? ngo.name).slice(0, 3).toUpperCase()}
            </span>
          )}
        </div>
        <div style={{ flex: 1, paddingBottom: 6, minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-fraunces, Georgia, serif)',
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: '-0.022em',
              lineHeight: 1.1,
              color: c.cream,
            }}
          >
            {ngo.name}
          </h1>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 12,
              color: c.ink300,
              lineHeight: 1.4,
            }}
          >
            {ngo.tagline}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '20px 20px 0', display: 'flex', gap: 8 }}>
        {[
          ['YIL', founded ?? '—'],
          ['ÜYE', memberCount],
          ['FİDAN', trees],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              flex: 1,
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 12,
              padding: '12px 10px',
              textAlign: 'center',
            }}
          >
            <div style={{ ...EYEBROW, color: c.ink300 }}>{k}</div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: c.cream,
                letterSpacing: '-0.02em',
                marginTop: 4,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>

      {/* About section */}
      {ngo.description && (
        <div style={{ padding: '24px 20px 0' }}>
          <h3
            style={{
              margin: 0,
              fontFamily: 'var(--font-fraunces, Georgia, serif)',
              fontSize: 16,
              fontWeight: 500,
              color: c.cream,
              fontStyle: 'italic',
            }}
          >
            Biz kimiz?
          </h3>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: c.ink200, lineHeight: 1.6 }}>
            {ngo.description}
          </p>
        </div>
      )}

      {/* Membership teaser card */}
      <div style={{ padding: '24px 20px 0' }}>
        <div
          style={{
            background: c.ink800,
            border: `1px solid ${c.goldLine}`,
            borderRadius: 16,
            padding: 18,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Concentric rings SVG */}
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            style={{ position: 'absolute', right: -60, top: -60, opacity: 0.1, pointerEvents: 'none' }}
          >
            {[80, 60, 40, 20].map((r) => (
              <circle key={r} cx="90" cy="90" r={r} stroke={c.gold} strokeWidth=".7" fill="none" />
            ))}
          </svg>

          <div style={{ ...EYEBROW, color: c.gold, marginBottom: 6 }}>
            {ngo.short_name ?? ngo.name} ÜYESİ OL
          </div>
          <h3
            style={{
              margin: 0,
              fontFamily: 'var(--font-fraunces, Georgia, serif)',
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: '-0.025em',
              color: c.cream,
              lineHeight: 1.15,
            }}
          >
            Aylık destek,{' '}
            <span style={{ fontStyle: 'italic', color: c.gold }}>her ay Karma</span>.
          </h3>
          <p style={{ margin: '8px 0 14px', fontSize: 13, color: c.ink300, lineHeight: 1.55 }}>
            {ngo.membership_description ?? `${ngo.short_name ?? ngo.name} üyeliğinle her ay otomatik katkı yap. Her ay için ekstra Karma kazan.`}
          </p>
          <Link
            href={`/dashboard/ngos/${ngo.id}/membership`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: c.gold,
              border: 'none',
              color: '#241E18',
              padding: '12px 18px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            Planları gör <ChevronRight size={14} color="#241E18" />
          </Link>
        </div>
      </div>

      {/* Donation campaign card */}
      <div style={{ padding: '20px 20px 0' }}>
        <Link href="/dashboard/donations/demo-campaign" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 16,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ ...EYEBROW, color: c.gold, marginBottom: 4 }}>BAĞIŞ</div>
              <span style={{ fontSize: 15, fontWeight: 600, color: c.cream }}>
                Bağış kampanyası
              </span>
            </div>
            <ChevronRight size={16} color={c.ink300} />
          </div>
        </Link>
      </div>

      {/* Active missions */}
      {missions.length > 0 && (
        <div style={{ padding: '28px 16px 0' }}>
          <div
            style={{
              padding: '0 4px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily: 'var(--font-fraunces, Georgia, serif)',
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: c.cream,
              }}
            >
              Açık <span style={{ fontStyle: 'italic', color: c.gold }}>görevler</span>
            </h3>
            <span style={{ ...EYEBROW, color: c.gold, fontSize: 10 }}>
              {missions.length} GÖREV
            </span>
          </div>

          {missions.map((mission) => {
            const diff = mission.difficulty ?? 'easy'
            const diffColor = difficultyColor[diff] ?? difficultyColor.easy
            const diffLabel = difficultyLabel[diff] ?? 'Kolay'

            return (
              <Link
                key={mission.id}
                href={`/dashboard/missions/${mission.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    background: c.ink800,
                    border: `1px solid ${c.ink700}`,
                    borderRadius: 16,
                    padding: '14px 16px',
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: `${c.gold}22`,
                      border: `1px solid ${c.gold}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Leaf size={18} color={c.gold} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-fraunces, Georgia, serif)',
                        fontSize: 15,
                        fontWeight: 500,
                        color: c.cream,
                        letterSpacing: '-0.015em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {mission.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: diffColor,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {diffLabel}
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          color: c.gold,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        <KarmaDotToken size={10} />
                        +{mission.karma} Karma
                      </span>
                      {mission.duration && (
                        <span style={{ fontSize: 11, color: c.ink400 }}>{mission.duration}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={15} color={c.ink600} style={{ flexShrink: 0 }} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
