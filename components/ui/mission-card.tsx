'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, MapPin, Bookmark, Flame } from 'lucide-react'
import type { MissionWithNGO } from '@/lib/supabase/types'
import { BadgeDS, IconButtonDS, MetaChip, KarmaPill } from '@/components/ui/ds'
import { useTheme, getCardShadow } from '@/lib/theme'
import { createClient } from '@/lib/supabase/client'

// Faz 1 (2026-04-26 perf-eng): <img> → next/image. Sized variants + WebP/AVIF + lazy load.
// Mission photo (Unsplash 850ms each) → 16:9 aspect, 400x250 hedef (mobile) - 768x432 (desktop).

interface MissionCardProps {
  mission: MissionWithNGO
  variant?: 'compact' | 'default' | 'hero'
  onClick?: () => void
  isSaved?: boolean
  userId?: string
  isMember?: boolean
}

// Domain gradient tokens moved to tailwind.config.ts → backgroundImage layer
// Pattern: bg-domain-{domain} utility class (e.g. bg-domain-nature, bg-domain-default fallback)

const domainEmoji: Record<string, string> = {
  nature: '🌿', education: '📖', social: '❤️',
  financial: '🪙', animals: '🐾', culture: '🎭', default: '✦',
}

export function MissionCard({ mission, variant = 'default', onClick, isSaved = false, userId, isMember = false }: MissionCardProps) {
  const { mode, colors: c } = useTheme()
  const [saved, setSaved] = useState(isSaved)
  const [pressed, setPressed] = useState(false)

  // Variant-based styling (UX Audit 2026-04-25)
  // C: Image aspect ratio updated to 16/9 for all variants (visual-content balance)
  // D: Title clamp: default=1, compact=2, hero=1 (kart kısalt)
  const variantStyles = {
    compact: {
      imageAspectRatio: '16/9' as const,
      titleFontSize: 16,
      titleFontWeight: 500,
      bodyPadding: '12px 16px 12px',
      borderWidth: '1px',
      borderColor: c.ink600,
      borderRadius: 14,
      titleClamp: 2,
    },
    default: {
      imageAspectRatio: '16/9' as const,
      titleFontSize: 18,
      titleFontWeight: 500,
      bodyPadding: '16px 18px 16px',
      borderWidth: '1px',
      borderColor: c.ink600,
      borderRadius: 16,
      titleClamp: 1,
    },
    hero: {
      imageAspectRatio: '16/9' as const,
      titleFontSize: 22,
      titleFontWeight: 600,
      bodyPadding: '18px 20px 18px',
      borderWidth: '1.5px',
      borderColor: c.gold,
      borderRadius: 18,
      titleClamp: 1,
    },
  }

  const style = variantStyles[variant]

  const toggleSave = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userId) return

    const prev = saved
    setSaved(!prev)

    try {
      const supabase = createClient()
      if (prev) {
        await supabase
          .from('user_saved_missions')
          .delete()
          .eq('user_id', userId)
          .eq('mission_id', mission.id)
      } else {
        await supabase
          .from('user_saved_missions')
          .insert({ user_id: userId, mission_id: mission.id })
      }
    } catch {
      setSaved(prev)
    }
  }, [saved, userId, mission.id])

  const domain = mission.domain ?? 'default'
  const emoji = domainEmoji[domain] ?? domainEmoji.default
  const ngo = mission.ngos
  const spotsLeft = mission.spots_left
  const gradientClass = `bg-domain-${domain}` // Tailwind class (e.g. bg-domain-nature, bg-domain-default)

  return (
    <Link
      href={`/dashboard/missions/${mission.id}`}
      onClick={onClick}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <article
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        className={variant !== 'hero' ? 'card-ambient-breath' : ''}
        style={{
          background: c.ink800,
          borderRadius: style.borderRadius,
          border: `${style.borderWidth} solid ${style.borderColor}`,
          overflow: 'hidden',
          cursor: 'pointer',
          transform: pressed ? 'scale(0.985)' : 'scale(1)',
          transition: 'transform 220ms cubic-bezier(.2,.8,.2,1)',
          boxShadow: getCardShadow(mode, 'sm'),
        }}
      >
        {/* ── Photo / Domain gradient header ── */}
        <motion.div layoutId={`mission-photo-${mission.id}`} style={{ position: 'relative', aspectRatio: style.imageAspectRatio, overflow: 'hidden' }}>
          {mission.photo_url ? (
            <Image
              src={mission.photo_url}
              alt={mission.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              loading={variant === 'hero' ? 'eager' : 'lazy'}
              quality={75}
            />
          ) : (
            <div
              className={`${gradientClass} flex items-center justify-center`}
              style={{
                width: '100%', height: '100%',
                fontSize: 48,
              }}
            >
              {emoji}
            </div>
          )}

          {/* Soft bottom gradient scrim (token: scrim-bottom) */}
          <div className="bg-scrim-bottom absolute inset-0 pointer-events-none" />

          {/* Top gradient scrim — strengthened for badge/bookmark readability (B: top scrim gradient) */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '40%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Top-left: category badge — frosted glass with border (B: readable category chip, defensive fallback) */}
          {(() => {
            const cat = mission.category?.trim() || domain?.trim() || null
            if (!cat) return null
            return (
              <div style={{ position: 'absolute', top: 10, left: 10 }}>
                <div style={{
                  background: 'rgba(0,0,0,0.55)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 999,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#FFFFFF',
                  letterSpacing: '0.02em',
                }}>
                  {cat}
                </div>
              </div>
            )
          })()}

          {/* Top-right: bookmark save button — frosted glass (B: frosted glass bookmark) */}
          <div
            style={{ position: 'absolute', top: 8, right: 8 }}
            onClick={toggleSave}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Bookmark
                size={16}
                style={{
                  fill: saved ? c.gold : 'none',
                  color: saved ? c.gold : '#FFFFFF',
                  transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
                  strokeWidth: 2.2,
                }}
              />
            </div>
          </div>

          {/* Bottom-left: NGO logo disk + name */}
          {ngo && (
            <div style={{
              position: 'absolute', left: 10, bottom: 10,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}>
                {ngo.logo_url ? (
                  <Image
                    src={ngo.logo_url}
                    alt={ngo.name ?? ''}
                    width={19}
                    height={19}
                    style={{ objectFit: 'contain', width: '72%', height: '72%' }}

                    quality={80}
                  />
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 700, color: ngo.color_accent ?? c.gold }}>
                    {/* Vol-37 P7: defensive — short_name/name ikisi de null ise '?' */}
                    {(ngo.short_name ?? ngo.name ?? '?')[0]}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: c.cream,
                textShadow: '0 1px 3px rgba(0,0,0,0.6)',
              }}>
                {ngo.short_name ?? ngo.name ?? ''}
              </span>
            </div>
          )}
        </motion.div>

        {/* ── Body ── */}
        <div style={{ padding: style.bodyPadding }}>
          {/* Title — variant-aware sizing (C: title clamp update) */}
          <h2 style={{
            margin: 0,
            fontSize: style.titleFontSize, fontWeight: style.titleFontWeight, lineHeight: 1.25,
            color: c.cream,
            letterSpacing: '-0.02em',
            display: '-webkit-box',
            WebkitLineClamp: style.titleClamp,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {mission.title}
          </h2>

          {/* Meta row — reordered (D: location → karma → duration) */}
          {variant === 'hero' ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: '8px 0 0',
              flexWrap: 'wrap',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                background: c.goldSoft,
                border: `1px solid ${c.goldLine}`,
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                color: c.gold,
              }}>
                +{mission.karma.toLocaleString('tr-TR')} Karma
              </div>
              {mission.duration && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 10px',
                  background: `rgba(232, 194, 104, 0.1)`,
                  border: `1px solid ${c.goldLine}`,
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  color: c.gold,
                }}>
                  <Clock size={10} />
                  {mission.duration}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
            }}>
              {/* Location → Karma → Duration reordering (D) */}
              {mission.location && (
                <MetaChip icon={<MapPin size={10} />}>
                  {mission.location}
                </MetaChip>
              )}
              <KarmaPill amount={mission.karma} />
              {mission.duration && (
                <MetaChip icon={<Clock size={10} />}>
                  {mission.duration}
                </MetaChip>
              )}
            </div>
          )}

          {/* Capacity label — conditional flame + date (D: "Y yer kaldı" logic) */}
          {variant !== 'hero' && spotsLeft > 0 && (
            <p style={{ marginTop: 8, fontSize: 11, color: c.ink400, fontWeight: 500 }}>
              {spotsLeft <= 5 && <Flame size={10} style={{ display: 'inline', marginRight: 4, color: c.gold }} />}
              {spotsLeft <= 5 ? `Son ${spotsLeft} yer` : `${spotsLeft} yer kaldı`}{mission.date_label ? ` · ${mission.date_label}` : ''}
            </p>
          )}
          {variant !== 'hero' && spotsLeft === 0 && (
            <p style={{ marginTop: 8, fontSize: 11, color: c.ink400, fontWeight: 500 }}>
              Kontenjan doldu
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}
