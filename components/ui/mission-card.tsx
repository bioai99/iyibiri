'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Clock, MapPin, Bookmark, Flame } from 'lucide-react'
import type { MissionWithNGO } from '@/lib/supabase/types'
import { BadgeDS, IconButtonDS, MetaChip, KarmaPill } from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'
import { createClient } from '@/lib/supabase/client'

interface MissionCardProps {
  mission: MissionWithNGO
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

export function MissionCard({ mission, onClick, isSaved = false, userId, isMember = false }: MissionCardProps) {
  const { colors: c } = useTheme()
  const [saved, setSaved] = useState(isSaved)
  const [pressed, setPressed] = useState(false)

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
  const impactText = mission.impact_statement ?? mission.description
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
        style={{
          background: c.ink800,
          borderRadius: 16,
          border: `1px solid ${c.ink600}`,
          overflow: 'hidden',
          cursor: 'pointer',
          transform: pressed ? 'scale(0.985)' : 'scale(1)',
          transition: 'transform 220ms cubic-bezier(.2,.8,.2,1)',
          boxShadow: '0 1px 4px rgba(0,0,0,.06)',
        }}
      >
        {/* ── Photo / Domain gradient header ── */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
          {mission.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mission.photo_url}
              alt={mission.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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

          {/* Top gradient scrim for badge/bookmark readability (token: scrim-top) */}
          <div className="bg-scrim-top absolute top-0 left-0 right-0 h-1/2 pointer-events-none" />

          {/* Top-left: category badge */}
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <div style={{
              background: 'rgba(0,0,0,.55)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: 999,
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              color: c.cream,
              letterSpacing: '0.02em',
            }}>
              {mission.category ?? domain}
            </div>
          </div>

          {/* Top-right: bookmark save button */}
          <div
            style={{ position: 'absolute', top: 8, right: 8 }}
            onClick={toggleSave}
          >
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(0,0,0,.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Bookmark
                size={15}
                style={{
                  fill: saved ? c.gold : 'none',
                  color: saved ? c.gold : c.cream,
                  transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
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
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ngo.logo_url}
                    alt={ngo.name}
                    style={{ width: '72%', height: '72%', objectFit: 'contain' }}
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 700, color: ngo.color_accent ?? c.gold }}>
                    {(ngo.short_name ?? ngo.name)[0]}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: c.cream,
                textShadow: '0 1px 3px rgba(0,0,0,0.6)',
              }}>
                {ngo.short_name ?? ngo.name}
              </span>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '16px 18px 16px' }}>
          {/* Member badge */}
          {isMember && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: c.goldSoft, border: `1px solid ${c.goldLine}`,
              borderRadius: 999, padding: '3px 8px', marginBottom: 8,
              fontSize: 10, fontWeight: 600, color: c.gold,
            }}>
              &#10003; {mission.ngos?.short_name ?? ''} üyesi
            </div>
          )}
          {/* Title */}
          <h2 style={{
            margin: 0,
            fontSize: 20, fontWeight: 700, lineHeight: 1.25,
            color: c.cream,
            letterSpacing: '-0.02em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {mission.title}
          </h2>

          {/* Impact text */}
          {impactText && (
            <p style={{
              margin: '6px 0 14px',
              fontSize: 13, lineHeight: 1.5,
              color: c.ink300,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {impactText}
            </p>
          )}

          {/* Meta row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}>
            {/* Left: duration + location chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {mission.duration && (
                <MetaChip icon={<Clock size={10} />}>
                  {mission.duration}
                </MetaChip>
              )}
              {mission.location && (
                <MetaChip icon={<MapPin size={10} />}>
                  {mission.location}
                </MetaChip>
              )}
            </div>

            {/* Right: karma pill */}
            <KarmaPill amount={mission.karma} />
          </div>

          {/* Urgency row — only when spotsLeft <= 5 */}
          {spotsLeft <= 5 && (
            <div style={{
              borderTop: `1px solid ${c.ink600}`,
              marginTop: 12,
              paddingTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}>
              <Flame size={12} style={{ color: c.gold, flexShrink: 0 }} />
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: c.gold,
                letterSpacing: '0.01em',
              }}>
                Son {spotsLeft} kişi{mission.date_label ? ` · ${mission.date_label}` : ''}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
