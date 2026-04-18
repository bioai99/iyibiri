'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, Heart, Flame } from 'lucide-react'
import type { MissionWithNGO } from '@/lib/supabase/types'

interface MissionCardProps {
  mission: MissionWithNGO
  isCompleted?: boolean
  isTaken?: boolean
  compact?: boolean
}

const domainGradient: Record<string, string> = {
  nature:    'linear-gradient(135deg, #10B981, #14B8A6)',
  education: 'linear-gradient(135deg, #3B82F6, #6366F1)',
  social:    'linear-gradient(135deg, #F43F5E, #EC4899)',
  financial: 'linear-gradient(135deg, #F59E0B, #F97316)',
  animals:   'linear-gradient(135deg, #F97316, #F59E0B)',
  culture:   'linear-gradient(135deg, #A855F7, #D946EF)',
  default:   'linear-gradient(135deg, #574E42, #3F3830)',
}

const domainEmoji: Record<string, string> = {
  nature: '🌿', education: '📖', social: '❤️',
  financial: '🪙', animals: '🐾', culture: '🎭', default: '✦',
}

const domainLabel: Record<string, string> = {
  nature: 'DOĞA', education: 'EĞİTİM', social: 'SOSYAL',
  financial: 'FİNANSAL', animals: 'HAYVANLAR', culture: 'KÜLTÜR',
  default: 'GÖNÜLLÜLÜK',
}

const difficultyConfig: Record<string, { label: string; bg: string; fg: string }> = {
  easy:   { label: 'Kolay', bg: 'rgba(107,142,78,0.18)',  fg: '#6B8E4E' },
  medium: { label: 'Orta',  bg: 'rgba(209,155,60,0.18)',  fg: '#D19B3C' },
  hard:   { label: 'Zor',   bg: 'rgba(184,78,59,0.18)',   fg: '#B84E3B' },
}

export function MissionCard({ mission, isCompleted, isTaken, compact = false }: MissionCardProps) {
  const [saved, setSaved] = useState(false)
  const domain = mission.domain ?? 'default'
  const gradient = domainGradient[domain] ?? domainGradient.default
  const emoji = domainEmoji[domain] ?? domainEmoji.default
  const label = domainLabel[domain] ?? domainLabel.default
  const difficulty = difficultyConfig[mission.difficulty ?? 'easy']
  const ngo = mission.ngos
  const photoUrl = (mission as MissionWithNGO & { photo_url?: string | null }).photo_url

  return (
    <motion.div
      whileTap={{ scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={compact ? 'w-[230px] flex-shrink-0' : 'w-full'}
      style={{ opacity: isCompleted ? 0.65 : 1 }}
    >
      <Link href={`/dashboard/missions/${mission.id}`}>
        <article
          style={{
            background: '#2E2923',
            borderRadius: 16,
            overflow: 'hidden',
            border: isTaken && !isCompleted
              ? '1.5px solid #E8C268'
              : '1px solid #3F3830',
          }}
        >
          {/* ── Photo / Domain gradient header ── */}
          <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={mission.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div
                style={{
                  width: '100%', height: '100%',
                  background: gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: compact ? 36 : 48,
                }}
              >
                {emoji}
              </div>
            )}

            {/* Gradient scrim */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(26,22,18,0) 45%, rgba(26,22,18,0.72) 100%)',
              pointerEvents: 'none',
            }} />

            {/* Top-left: category badge */}
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: 'rgba(26,22,18,0.65)',
              backdropFilter: 'blur(6px)',
              borderRadius: 999,
              padding: '3px 8px',
              fontSize: 10, fontWeight: 700,
              color: '#F4EEDF',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {emoji} {label}
            </div>

            {/* Top-right: heart save */}
            <button
              onClick={(e) => { e.preventDefault(); setSaved(s => !s) }}
              style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(26,22,18,0.55)',
                backdropFilter: 'blur(6px)',
                border: 'none', cursor: 'pointer',
                borderRadius: 999, width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Heart
                size={14}
                style={{
                  fill: saved ? '#E8C268' : 'none',
                  color: saved ? '#E8C268' : '#F4EEDF',
                  transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
                }}
              />
            </button>

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
                    <span style={{ fontSize: 11, fontWeight: 700, color: ngo.color_accent ?? '#E8C268' }}>
                      {(ngo.short_name ?? ngo.name)[0]}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: '#F4EEDF',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  letterSpacing: '-0.01em',
                }}>
                  {ngo.short_name ?? ngo.name}
                </span>
              </div>
            )}

            {/* Taken indicator badge */}
            {isTaken && !isCompleted && (
              <div style={{
                position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(232,194,104,0.15)',
                border: '1px solid rgba(232,194,104,0.4)',
                borderRadius: 999,
                padding: '2px 10px',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Flame size={10} style={{ color: '#E8C268' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#E8C268', letterSpacing: '0.04em' }}>
                  DEVAM EDİYOR
                </span>
              </div>
            )}
          </div>

          {/* ── Body ── */}
          <div style={{ padding: '14px 16px 14px' }}>
            <h3 style={{
              margin: 0,
              fontSize: 15, fontWeight: 700, lineHeight: 1.3,
              color: '#F4EEDF',
              letterSpacing: '-0.015em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {mission.title}
            </h3>

            {!compact && mission.description && (
              <p style={{
                margin: '5px 0 0',
                fontSize: 13, lineHeight: 1.5,
                color: '#A89E8A',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {mission.description}
              </p>
            )}

            {/* Meta row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, marginTop: 12,
              flexWrap: 'wrap',
            }}>
              {mission.duration && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 500, color: '#A89E8A',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '4px 8px', borderRadius: 999,
                  border: '1px solid #3F3830',
                }}>
                  <Clock size={10} style={{ color: '#A89E8A' }} />
                  {mission.duration}
                </span>
              )}
              {mission.difficulty && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  fontSize: 11, fontWeight: 700,
                  background: difficulty.bg, color: difficulty.fg,
                  padding: '4px 8px', borderRadius: 999,
                }}>
                  {difficulty.label}
                </span>
              )}
              <span style={{
                marginLeft: 'auto',
                fontSize: 12, fontWeight: 800,
                color: '#E8C268',
                letterSpacing: '-0.01em',
                fontVariantNumeric: 'tabular-nums',
              }}>
                +{mission.karma} Karma
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
