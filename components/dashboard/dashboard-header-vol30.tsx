'use client'

// Vol-30.2 Dashboard header — IA değişikliği (Bahadır kararı, 2026-04-26):
//   - Daily goal ring KALKTI (iyibiri context'inde anlamlı değil)
//   - 3 element: greeting + theme toggle + avatar
//   - Date eyebrow ('27 NİSAN · PAZARTESİ') + Fraunces italic "Günaydın, Ad"
//   - Avatar üzerinde opsiyonel notification dot (clay)

import Link from 'next/link'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/theme'

const TR_MONTHS = [
  'OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN',
  'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK',
]
const TR_DAYS = [
  'PAZAR', 'PAZARTESİ', 'SALI', 'ÇARŞAMBA',
  'PERŞEMBE', 'CUMA', 'CUMARTESİ',
]

function formatDateEyebrow(): string {
  const d = new Date()
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} · ${TR_DAYS[d.getDay()]}`
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 6)  return 'İyi geceler'
  if (h < 12) return 'Günaydın'
  if (h < 18) return 'İyi günler'
  if (h < 22) return 'İyi akşamlar'
  return 'İyi geceler'
}

interface Props {
  displayName: string
  hasUnread?: boolean
  avatarInitial?: string
}

export function DashboardHeaderVol30({
  displayName,
  hasUnread = false,
  avatarInitial,
}: Props) {
  const { colors: c, mode, toggleMode } = useTheme()
  const isDark = mode === 'dark'
  const initial = (avatarInitial ?? displayName ?? '?')[0]?.toLocaleUpperCase('tr-TR') ?? '?'

  return (
    <div
      style={{
        padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: c.ink300,
          }}
        >
          {formatDateEyebrow()}
        </p>
        <p
          style={{
            margin: '4px 0 0',
            fontFamily: "'Fraunces', ui-serif, Georgia, serif",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: c.cream,
          }}
        >
          {getGreeting()},{' '}
          <em style={{ fontStyle: 'italic' }}>{displayName}</em>
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleMode}
          aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: c.cream,
            padding: 0,
          }}
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Avatar (notification dot) */}
        <Link
          href="/dashboard/profile"
          aria-label="Profil"
          style={{ position: 'relative', display: 'inline-block' }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${c.gold}, ${c.goldDim})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 2px 8px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.25)',
            }}
          >
            <span
              style={{
                fontFamily: "'Fraunces', ui-serif, serif",
                fontSize: 16,
                fontWeight: 600,
                color: '#fff',
              }}
            >
              {initial}
            </span>
          </div>
          {hasUnread && (
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: c.clay,
                border: `2px solid ${c.ink900}`,
              }}
            />
          )}
        </Link>
      </div>
    </div>
  )
}
