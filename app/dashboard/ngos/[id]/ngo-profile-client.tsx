'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Heart, ChevronRight, Leaf, Globe, Mail, Phone, ExternalLink, Camera, AtSign, Link2 } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'
import { KarmaDotToken } from '@/components/ui/ds'
import { createClient } from '@/lib/supabase/client'
import type { NGO, MissionWithNGO, NgoMembership } from '@/lib/supabase/types'

// Faz 5 (2026-04-26 perf-eng): NGO profile cover (priority) + logo next/image.

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
  const { colors: c, mode } = useTheme()
  const router = useRouter()
  const [cancelling, setCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const handleCancelMembership = async () => {
    if (!membership?.id || !userId) return
    setCancelling(true)
    try {
      const supabase = createClient()
      await supabase
        .from('ngo_memberships')
        .update({ status: 'cancelled' })
        .eq('id', membership.id)
      router.refresh()
    } catch {
      setCancelling(false)
    }
  }

  const coverImageUrl = ngo.cover_image_url
  const founded = ngo.founded
  const memberCount = ngo.member_count?.toLocaleString('tr-TR') ?? '—'
  const [descExpanded, setDescExpanded] = useState(false)

  return (
    <div style={{ background: c.ink900, color: c.cream, minHeight: '100%', paddingBottom: 140 }}>
      {/* Cover — Faz 5 next/image (priority for LCP) */}
      <div style={{ position: 'relative', height: 280 }}>
        <Image
          src={coverImageUrl ?? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80'}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          priority
          quality={75}
          aria-hidden="true"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, ${c.ink900}73 0%, transparent 30%, transparent 60%, ${c.ink900} 100%)`,
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
            theme={mode === 'light' ? 'light' : 'dark'}
            ariaLabel="Geri"
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <IconButtonDS icon={<Share2 size={16} />} theme={mode === 'light' ? 'light' : 'dark'} ariaLabel="Paylaş" />
            <IconButtonDS icon={<Heart size={16} />} theme={mode === 'light' ? 'light' : 'dark'} ariaLabel="Beğen" />
            {membership?.status === 'active' ? (
              showCancelConfirm ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button
                    onClick={handleCancelMembership}
                    disabled={cancelling}
                    style={{
                      height: 36, padding: '0 14px', borderRadius: 10,
                      background: 'rgba(220,38,38,.15)', border: '1px solid rgba(220,38,38,.3)',
                      fontSize: 12, fontWeight: 600, color: '#F87171',
                      cursor: cancelling ? 'not-allowed' : 'pointer',
                      opacity: cancelling ? 0.6 : 1,
                    }}
                  >
                    {cancelling ? '...' : 'İptal et'}
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    style={{
                      height: 36, padding: '0 14px', borderRadius: 10,
                      background: c.ink800, border: `1px solid ${c.ink600}`,
                      fontSize: 12, fontWeight: 600, color: c.ink300,
                      cursor: 'pointer',
                    }}
                  >
                    Vazgeç
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={cancelling}
                  style={{
                    height: 40, padding: '0 16px', borderRadius: 12,
                    background: c.goldSoft, border: `1px solid ${c.goldLine}`,
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 13, fontWeight: 600, color: c.gold,
                    cursor: 'pointer',
                    opacity: cancelling ? 0.6 : 1,
                  }}
                >
                  {cancelling ? '...' : '✓ Üyesin'}
                </button>
              )
            ) : (
              <Link href={`/dashboard/ngos/${ngo.id}/membership`}>
                <button style={{
                  height: 42, padding: '0 20px', borderRadius: 12,
                  background: c.gold, color: c.ink900, border: 'none',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,.1)',
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
            // Vol-48.1: Light mode'da c.cream = #241E18 (koyu metin) — siyah
            // arka plana neden oluyordu. Logo container'ı her iki mode'da
            // sabit beyaz: brand logoları beyaz arka plana göre tasarlanır.
            background: '#fff',
            border: `3px solid ${c.ink900}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            flexShrink: 0,
            boxShadow: '0 8px 24px rgba(0,0,0,.3), 0 2px 12px rgba(0,0,0,.1)',
            // Vol-48: Image fill için ZORUNLU. Yokken logo absolute olarak en
            // yakın positioned ancestor'a (sayfa kendisi) genişledi → büyük
            // TEMA logosu sayfayı kapladı (mission-detail Vol-41'in aynısı).
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {ngo.logo_url ? (
            <Image
              src={ngo.logo_url}
              alt={ngo.name}
              fill
              sizes="88px"
              style={{ objectFit: 'contain' }}
              quality={80}
            />
          ) : (
            <span style={{ fontWeight: 900, color: c.ink600, fontSize: 18 }}>
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
          ['YIL', founded ? new Date().getFullYear() - founded : '—'],
          ['ÜYE', memberCount],
          ['GÖREV', missions.length],
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
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 13,
              color: c.ink200,
              lineHeight: 1.6,
              ...(!descExpanded
                ? {
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                  }
                : {}),
            }}
          >
            {ngo.description}
          </p>
          {!descExpanded && (
            <button
              onClick={() => setDescExpanded(true)}
              style={{
                background: 'none',
                border: 'none',
                color: c.gold,
                fontSize: 13,
                fontWeight: 600,
                padding: '6px 0 0',
                cursor: 'pointer',
              }}
            >
              Devamını oku
            </button>
          )}
        </div>
      )}

      {/* İletişim & sosyal medya — backoffice'ten doldurulan field'lar */}
      {(ngo.website ||
        ngo.email ||
        ngo.phone ||
        ngo.social_instagram ||
        ngo.social_twitter ||
        ngo.social_linkedin) && (
        <div style={{ padding: '24px 20px 0' }}>
          <h3
            style={{
              margin: 0,
              fontFamily: 'var(--font-fraunces, Georgia, serif)',
              fontSize: 16,
              fontWeight: 500,
              color: c.cream,
              fontStyle: 'italic',
              marginBottom: 12,
            }}
          >
            Bağlantılar
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ngo.website && (
              <a
                href={ngo.website.startsWith('http') ? ngo.website : `https://${ngo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  color: c.gold,
                  textDecoration: 'none',
                }}
              >
                <Globe size={14} />
                <span>{ngo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                <ExternalLink size={11} />
              </a>
            )}
            {ngo.email && (
              <a
                href={`mailto:${ngo.email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  color: c.ink200,
                  textDecoration: 'none',
                }}
              >
                <Mail size={14} />
                <span>{ngo.email}</span>
              </a>
            )}
            {ngo.phone && (
              <a
                href={`tel:${ngo.phone.replace(/\s/g, '')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  color: c.ink200,
                  textDecoration: 'none',
                }}
              >
                <Phone size={14} />
                <span>{ngo.phone}</span>
              </a>
            )}
            {(ngo.social_instagram || ngo.social_twitter || ngo.social_linkedin) && (
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 4,
                  flexWrap: 'wrap',
                }}
              >
                {ngo.social_instagram && (
                  <a
                    href={
                      ngo.social_instagram.startsWith('http')
                        ? ngo.social_instagram
                        : `https://instagram.com/${ngo.social_instagram.replace(/^@/, '')}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: c.ink800,
                      border: `1px solid ${c.ink600}`,
                      color: c.ink200,
                      textDecoration: 'none',
                    }}
                  >
                    <Camera size={16} />
                  </a>
                )}
                {ngo.social_twitter && (
                  <a
                    href={
                      ngo.social_twitter.startsWith('http')
                        ? ngo.social_twitter
                        : `https://twitter.com/${ngo.social_twitter.replace(/^@/, '')}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: c.ink800,
                      border: `1px solid ${c.ink600}`,
                      color: c.ink200,
                      textDecoration: 'none',
                    }}
                  >
                    <AtSign size={16} />
                  </a>
                )}
                {ngo.social_linkedin && (
                  <a
                    href={
                      ngo.social_linkedin.startsWith('http')
                        ? ngo.social_linkedin
                        : `https://linkedin.com/company/${ngo.social_linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: c.ink800,
                      border: `1px solid ${c.ink600}`,
                      color: c.ink200,
                      textDecoration: 'none',
                    }}
                  >
                    <Link2 size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Membership teaser card */}
      <div style={{ padding: '24px 20px 0' }}>
        {membership?.status === 'active' ? (
          <div style={{ background: c.ink800, border: `1px solid ${c.goldLine}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: '#6B8E4E' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6B8E4E' }}>Aktif üye</span>
            </div>
            <p style={{ fontSize: 14, color: c.cream, margin: '0 0 4px', fontWeight: 600 }}>
              {ngo.short_name ?? ngo.name} gönüllüsüsün
            </p>
            <p style={{ fontSize: 12, color: c.ink300, margin: '0 0 14px' }}>
              {membership.joined_at ? new Date(membership.joined_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' }) : ''} tarihinden beri
            </p>
            <Link
              href="/dashboard/missions"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: c.gold,
                border: 'none',
                color: c.ink900,
                padding: '12px 18px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              Görevleri gör <ChevronRight size={14} color={c.ink900} />
            </Link>
          </div>
        ) : (
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
                color: c.ink900,
                padding: '12px 18px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              Planları gör <ChevronRight size={14} color={c.ink900} />
            </Link>
          </div>
        )}
      </div>

      {/* Donation campaign card — hidden until real campaign data is available */}
      {false && (
        <div style={{ padding: '20px 20px 0' }}>
          <Link href={`/dashboard/donate/${ngo.id}`} style={{ textDecoration: 'none' }}>
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
      )}

      {/* Active missions — Vol-37 P4: empty state explanatory copy */}
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
          {missions.length > 0 && (
            <span style={{ ...EYEBROW, color: c.gold, fontSize: 10 }}>
              {missions.length} GÖREV
            </span>
          )}
        </div>

        {missions.length === 0 ? (
          <div
            style={{
              padding: '24px 18px',
              borderRadius: 16,
              background: c.ink800,
              border: `1px dashed ${c.ink600}`,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: c.ink300,
                lineHeight: 1.5,
                fontFamily: 'var(--font-fraunces, Georgia, serif)',
                fontStyle: 'italic',
              }}
            >
              Şu an açık bir görev yok.<br />
              {ngo.short_name ?? ngo.name} yeni görev hazırladığında burada listelenecek — STK&apos;yı takip ederek haberdar ol.
            </p>
          </div>
        ) : null}
      </div>

      {missions.length > 0 && (
        <div style={{ padding: '0 16px 0' }}>

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
