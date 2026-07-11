'use client'

// Vol-63: Mission Journey — missions.steps JSONB'sinin ilk canlı tüketicisi.
//
// Görev detayında, görevin arkasındaki süreci sıcak bir dikey timeline olarak
// anlatır. İlk kullanım: Bir Dilek Tut (Make-A-Wish Türkiye) "Dilek Yolculuğu"
// (Başvuru → Dilek Keşfi → Dilek Yolculuğu → Dilek Günü). Yapı STK'dan
// bağımsızdır — steps dolu olan her görevde render olur, boşsa hiç görünmez.
//
// Motion: adımlar stagger'lı fade+rise ile gelir (CSS, globals.css
// `journeyStepIn`); prefers-reduced-motion'da animasyon kapalıdır.
// Son adım "kutlama" vurgusu alır (gold dolgu + yumuşak glow).

import type { CSSProperties } from 'react'
import {
  Star,
  Sparkles,
  BookOpen,
  Gift,
  PartyPopper,
  Heart,
  Sun,
  Calendar,
  CheckCircle2,
  MapPin,
  Users,
  Camera,
  type LucideIcon,
} from 'lucide-react'
import type { Json } from '@/lib/supabase/types'
import { parseMissionJourney } from '@/lib/missions/steps'
import { useTheme } from '@/lib/theme'

/** steps JSONB `icon` anahtarı → lucide ikon. Bilinmeyen anahtar Star'a düşer. */
const STEP_ICONS: Record<string, LucideIcon> = {
  star: Star,
  sparkles: Sparkles,
  book: BookOpen,
  gift: Gift,
  party: PartyPopper,
  heart: Heart,
  sun: Sun,
  calendar: Calendar,
  check: CheckCircle2,
  location: MapPin,
  users: Users,
  camera: Camera,
}

interface Props {
  steps: Json | null | undefined
  /** Bölüm eyebrow'u — steps objesindeki `title` bunu ezer. */
  fallbackTitle?: string
}

export function MissionJourney({ steps, fallbackTitle = 'Görevin Yolculuğu' }: Props) {
  const { colors: c } = useTheme()
  const journey = parseMissionJourney(steps)

  if (journey.steps.length === 0) return null

  const eyebrow = journey.title ?? fallbackTitle
  const last = journey.steps.length - 1

  return (
    <div style={{ padding: '24px 20px 0' }}>
      {/* Gold eyebrow — Impact bölümüyle aynı desen */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: c.gold,
          marginBottom: 14,
        }}
      >
        {eyebrow}
      </div>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {journey.steps.map((step, i) => {
          const Icon = STEP_ICONS[step.icon] ?? Star
          const isLast = i === last
          const rowStyle: CSSProperties = {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            position: 'relative',
            paddingBottom: isLast ? 0 : 22,
            animation: `journeyStepIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${0.08 * i}s both`,
          }
          return (
            <li key={`${i}-${step.title}`} style={rowStyle} className="journey-step">
              {/* Connector — ikon dairesinin altından bir sonraki adıma */}
              {!isLast && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: 17,
                    top: 40,
                    bottom: 4,
                    width: 1.5,
                    background: `linear-gradient(${c.goldLine}, ${c.ink600})`,
                  }}
                />
              )}

              {/* İkon dairesi — son adım kutlama vurgusu */}
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isLast ? c.gold : c.goldSoft,
                  border: isLast ? 'none' : `1px solid ${c.goldLine}`,
                  boxShadow: isLast ? `0 0 18px ${c.goldSoft}` : 'none',
                }}
              >
                <Icon size={17} color={isLast ? c.ink900 : c.gold} strokeWidth={2.2} />
              </span>

              {/* Metin */}
              <span style={{ paddingTop: 2, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 600,
                    color: c.cream,
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span
                    style={{
                      display: 'block',
                      fontSize: 12,
                      color: c.ink300,
                      marginTop: 3,
                      lineHeight: 1.45,
                    }}
                  >
                    {step.description}
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
