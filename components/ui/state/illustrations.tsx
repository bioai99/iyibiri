// components/ui/state/illustrations.tsx
//
// Empty state için özgün SVG illüstrasyon kütüphanesi.
// Tier-1 benchmark (Duolingo, Things 3) — "boş değil, davet" hissi.
//
// Tasarım ilkeleri:
// - Gold foil × dark parchment palet (useTheme'dan gelir)
// - 88×88 stage, subtle motion (breath), useReducedMotion respect
// - Her illüstrasyon kendi mikro-anlatısını taşır: bookmark = "hazırla", compass = "yol", etc.
// - A11y: aria-hidden (dekoratif), description prop'u duygusal label taşır

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '@/lib/theme'

export type EmptyIllustrationName =
  | 'bookmark' // saved empty — "hazırla"
  | 'compass' // no missions / no recommended — "yol aç"
  | 'bell' // no notifications — "sessiz"
  | 'medal' // no rewards — "kazan"
  | 'podium' // empty leaderboard — "sıralama"
  | 'checklist' // no completed — "tamamla"
  | 'search' // no search results — "ara"
  | 'heart' // generic positive / no ngos followed — "takip et"

interface EmptyIllustrationProps {
  name: EmptyIllustrationName
  /** Boyut (px). Default 88 page, 64 card, 48 inline. */
  size?: number
}

/* ═════════════════════════════════════════════════════════════
 *  Ana render — named SVG illustration'ları motion wrapper ile basar.
 * ═════════════════════════════════════════════════════════════ */

export function EmptyIllustration({
  name,
  size = 88,
}: EmptyIllustrationProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  // Gold foil palette — illustrations share this
  const palette = {
    stroke: c.gold,
    strokeDim: c.goldDim,
    fill: c.goldSoft,
    fillLine: c.goldLine,
    accent: c.cream,
    ink: c.ink800,
  }

  const breath = shouldReduceMotion
    ? {}
    : {
        animate: { y: [0, -3, 0] },
        transition: {
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      }

  return (
    <motion.div
      aria-hidden="true"
      initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div {...breath} style={{ width: size, height: size }}>
        {name === 'bookmark' && <BookmarkSVG p={palette} size={size} />}
        {name === 'compass' && <CompassSVG p={palette} size={size} />}
        {name === 'bell' && <BellSVG p={palette} size={size} />}
        {name === 'medal' && <MedalSVG p={palette} size={size} />}
        {name === 'podium' && <PodiumSVG p={palette} size={size} />}
        {name === 'checklist' && <ChecklistSVG p={palette} size={size} />}
        {name === 'search' && <SearchSVG p={palette} size={size} />}
        {name === 'heart' && <HeartSVG p={palette} size={size} />}
      </motion.div>
    </motion.div>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  Ortak palet tipi + helper
 * ═════════════════════════════════════════════════════════════ */

interface Palette {
  stroke: string
  strokeDim: string
  fill: string
  fillLine: string
  accent: string
  ink: string
}

interface SVGProps {
  p: Palette
  size: number
}

/* ═════════════════════════════════════════════════════════════
 *  BookmarkSVG — "hazırla"
 *  Yarım açılmış bookmark + iki küçük yıldız
 * ═════════════════════════════════════════════════════════════ */
function BookmarkSVG({ p, size }: SVGProps) {
  return (
    <svg viewBox="0 0 88 88" width={size} height={size} fill="none">
      {/* Arka plan disc */}
      <circle cx="44" cy="44" r="40" fill={p.fill} stroke={p.fillLine} strokeWidth="1" />

      {/* Bookmark gövdesi — yarım açılmış */}
      <path
        d="M28 22 L28 66 L44 56 L60 66 L60 22 Z"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Bookmark iç çizgileri */}
      <line x1="34" y1="34" x2="54" y2="34" stroke={p.strokeDim} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="34" y1="42" x2="48" y2="42" stroke={p.strokeDim} strokeWidth="1.6" strokeLinecap="round" />

      {/* Sparkle üstte */}
      <path
        d="M68 24 L68 18 M65 21 L71 21 M70 12 L70 10 M69 11 L71 11"
        stroke={p.accent}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Küçük sparkle altta sol */}
      <path
        d="M18 62 L18 58 M16 60 L20 60"
        stroke={p.accent}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  CompassSVG — "yol aç"
 *  Pusula + kesikli rota
 * ═════════════════════════════════════════════════════════════ */
function CompassSVG({ p, size }: SVGProps) {
  return (
    <svg viewBox="0 0 88 88" width={size} height={size} fill="none">
      {/* Arka plan disc */}
      <circle cx="44" cy="44" r="40" fill={p.fill} stroke={p.fillLine} strokeWidth="1" />

      {/* Kesikli rota — alt kısım */}
      <path
        d="M14 70 Q28 60 44 66 T74 58"
        stroke={p.strokeDim}
        strokeWidth="1.8"
        strokeDasharray="3 4"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* Pusula dış halka */}
      <circle cx="44" cy="40" r="20" fill={p.ink} stroke={p.stroke} strokeWidth="2.2" />

      {/* Pusula iğnesi — kuzey gold */}
      <path
        d="M44 26 L50 40 L44 54 L38 40 Z"
        fill={p.stroke}
        stroke={p.stroke}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* Güney cream */}
      <path
        d="M44 54 L50 40 L44 40 Z"
        fill={p.accent}
        opacity="0.6"
      />

      {/* Merkez nokta */}
      <circle cx="44" cy="40" r="2.2" fill={p.ink} stroke={p.accent} strokeWidth="1" />

      {/* N harfi */}
      <text
        x="44"
        y="22"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill={p.accent}
        fontFamily="var(--font-body), sans-serif"
      >
        K
      </text>
    </svg>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  BellSVG — "sessiz"
 *  Zil + hafif ses dalgaları (opaklık ile "sessizlik" hissi)
 * ═════════════════════════════════════════════════════════════ */
function BellSVG({ p, size }: SVGProps) {
  return (
    <svg viewBox="0 0 88 88" width={size} height={size} fill="none">
      {/* Arka plan disc */}
      <circle cx="44" cy="44" r="40" fill={p.fill} stroke={p.fillLine} strokeWidth="1" />

      {/* Zil gövdesi */}
      <path
        d="M44 22 C32 22 28 32 28 42 L28 52 L24 58 L64 58 L60 52 L60 42 C60 32 56 22 44 22 Z"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Zil tutacağı */}
      <circle cx="44" cy="20" r="2.5" fill={p.stroke} />
      {/* Zil dil — küçük çan */}
      <path
        d="M40 58 Q44 66 48 58"
        fill="none"
        stroke={p.stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Ses dalgaları — soldaki düşük opaklık (sessizlik) */}
      <path d="M18 38 Q14 42 18 46" stroke={p.strokeDim} strokeWidth="1.6" fill="none" opacity="0.35" strokeLinecap="round" />
      <path d="M70 38 Q74 42 70 46" stroke={p.strokeDim} strokeWidth="1.6" fill="none" opacity="0.35" strokeLinecap="round" />

      {/* Zz — hafifçe ipucu */}
      <path
        d="M67 22 L72 22 L67 28 L72 28"
        stroke={p.strokeDim}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  MedalSVG — "kazan"
 *  Madalya + ipek kurdele + ışıltı
 * ═════════════════════════════════════════════════════════════ */
function MedalSVG({ p, size }: SVGProps) {
  return (
    <svg viewBox="0 0 88 88" width={size} height={size} fill="none">
      {/* Arka plan disc */}
      <circle cx="44" cy="44" r="40" fill={p.fill} stroke={p.fillLine} strokeWidth="1" />

      {/* Kurdele sol */}
      <path
        d="M30 14 L30 38 L40 32 L44 42 L36 20 Z"
        fill={p.stroke}
        stroke={p.stroke}
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.88"
      />
      {/* Kurdele sağ */}
      <path
        d="M58 14 L58 38 L48 32 L44 42 L52 20 Z"
        fill={p.strokeDim}
        stroke={p.strokeDim}
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.88"
      />

      {/* Madalya gövdesi */}
      <circle cx="44" cy="54" r="16" fill={p.ink} stroke={p.stroke} strokeWidth="2.4" />
      {/* Madalya iç halka */}
      <circle cx="44" cy="54" r="11" fill="none" stroke={p.strokeDim} strokeWidth="1.4" opacity="0.7" />

      {/* Yıldız içerik */}
      <path
        d="M44 47 L46 52 L51 52 L47 55 L49 60 L44 57 L39 60 L41 55 L37 52 L42 52 Z"
        fill={p.stroke}
        stroke={p.stroke}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* Işıltı — sağ üst */}
      <path
        d="M66 26 L66 20 M63 23 L69 23"
        stroke={p.accent}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  PodiumSVG — "sıralama"
 *  3 basamak podium, ortada gold cup
 * ═════════════════════════════════════════════════════════════ */
function PodiumSVG({ p, size }: SVGProps) {
  return (
    <svg viewBox="0 0 88 88" width={size} height={size} fill="none">
      {/* Arka plan disc */}
      <circle cx="44" cy="44" r="40" fill={p.fill} stroke={p.fillLine} strokeWidth="1" />

      {/* Kupa — merkez üst */}
      <path
        d="M36 22 L52 22 L52 32 C52 38 48 42 44 42 C40 42 36 38 36 32 Z"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Kupa kulpları */}
      <path
        d="M36 26 Q30 26 30 32 Q30 36 36 36"
        fill="none"
        stroke={p.stroke}
        strokeWidth="1.6"
      />
      <path
        d="M52 26 Q58 26 58 32 Q58 36 52 36"
        fill="none"
        stroke={p.stroke}
        strokeWidth="1.6"
      />
      {/* Kupa ayak */}
      <line x1="44" y1="42" x2="44" y2="48" stroke={p.stroke} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="38" y1="48" x2="50" y2="48" stroke={p.stroke} strokeWidth="2.4" strokeLinecap="round" />

      {/* Podium — 1. (orta, en yüksek) */}
      <rect x="36" y="54" width="16" height="16" fill={p.stroke} stroke={p.stroke} strokeWidth="1" />
      {/* Podium — 2. (sol) */}
      <rect x="20" y="60" width="16" height="10" fill={p.strokeDim} stroke={p.strokeDim} strokeWidth="1" opacity="0.85" />
      {/* Podium — 3. (sağ) */}
      <rect x="52" y="64" width="16" height="6" fill={p.strokeDim} stroke={p.strokeDim} strokeWidth="1" opacity="0.65" />

      {/* 1 numarası */}
      <text
        x="44"
        y="65"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill={p.ink}
        fontFamily="var(--font-body), sans-serif"
      >
        1
      </text>
    </svg>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  ChecklistSVG — "tamamla"
 *  Kağıt + 3 satır, 1'i tikli
 * ═════════════════════════════════════════════════════════════ */
function ChecklistSVG({ p, size }: SVGProps) {
  return (
    <svg viewBox="0 0 88 88" width={size} height={size} fill="none">
      {/* Arka plan disc */}
      <circle cx="44" cy="44" r="40" fill={p.fill} stroke={p.fillLine} strokeWidth="1" />

      {/* Kağıt */}
      <rect
        x="26"
        y="20"
        width="36"
        height="48"
        rx="4"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth="2.2"
      />

      {/* Başlık satırı */}
      <line x1="32" y1="28" x2="48" y2="28" stroke={p.stroke} strokeWidth="2" strokeLinecap="round" />

      {/* Satır 1 — tikli */}
      <rect x="32" y="36" width="6" height="6" rx="1.5" fill={p.stroke} stroke={p.stroke} strokeWidth="1" />
      <path
        d="M33.5 39 L35 40.5 L37 37.5"
        stroke={p.ink}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="42" y1="39" x2="54" y2="39" stroke={p.strokeDim} strokeWidth="1.6" strokeLinecap="round" />

      {/* Satır 2 — boş */}
      <rect x="32" y="46" width="6" height="6" rx="1.5" fill="none" stroke={p.strokeDim} strokeWidth="1.6" />
      <line x1="42" y1="49" x2="56" y2="49" stroke={p.strokeDim} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />

      {/* Satır 3 — boş */}
      <rect x="32" y="56" width="6" height="6" rx="1.5" fill="none" stroke={p.strokeDim} strokeWidth="1.6" />
      <line x1="42" y1="59" x2="52" y2="59" stroke={p.strokeDim} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  SearchSVG — "ara"
 *  Büyüteç + soru işareti içinde
 * ═════════════════════════════════════════════════════════════ */
function SearchSVG({ p, size }: SVGProps) {
  return (
    <svg viewBox="0 0 88 88" width={size} height={size} fill="none">
      {/* Arka plan disc */}
      <circle cx="44" cy="44" r="40" fill={p.fill} stroke={p.fillLine} strokeWidth="1" />

      {/* Büyüteç halka */}
      <circle cx="40" cy="40" r="16" fill={p.ink} stroke={p.stroke} strokeWidth="2.6" />

      {/* Soru işareti büyüteç içinde */}
      <path
        d="M36 36 Q40 32 44 36 Q44 38 42 40 Q40 41 40 44"
        fill="none"
        stroke={p.stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="40" cy="47" r="1.5" fill={p.stroke} />

      {/* Sap */}
      <line
        x1="52"
        y1="52"
        x2="66"
        y2="66"
        stroke={p.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  HeartSVG — "takip et"
 *  Kalp dolu + artı işareti
 * ═════════════════════════════════════════════════════════════ */
function HeartSVG({ p, size }: SVGProps) {
  return (
    <svg viewBox="0 0 88 88" width={size} height={size} fill="none">
      {/* Arka plan disc */}
      <circle cx="44" cy="44" r="40" fill={p.fill} stroke={p.fillLine} strokeWidth="1" />

      {/* Kalp */}
      <path
        d="M44 62 C44 62 24 50 24 36 C24 28 30 22 36 22 C40 22 43 24 44 28 C45 24 48 22 52 22 C58 22 64 28 64 36 C64 50 44 62 44 62 Z"
        fill={p.stroke}
        stroke={p.stroke}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Artı işareti — takip et ipucu */}
      <circle cx="68" cy="24" r="8" fill={p.accent} stroke={p.stroke} strokeWidth="1.5" />
      <line x1="68" y1="20" x2="68" y2="28" stroke={p.stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="64" y1="24" x2="72" y2="24" stroke={p.stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
