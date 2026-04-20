'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { BrandLogo } from '@/components/ui/brand-logo'
import { KarmaDotToken } from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'

const TIERS = [
  { level: 1, name: 'İyi Biri',            karma: 0,     desc: 'İyilik yolculuğun başlıyor.' },
  { level: 2, name: 'İyi Yürekli',         karma: 500,   desc: 'İyilik sende bir alışkanlık olmaya başladı.' },
  { level: 3, name: 'İyilik Elçisi',       karma: 2000,  desc: 'Çevrende değişim yaratıyorsun.' },
  { level: 4, name: 'İyilik Savaşçısı',    karma: 5000,  desc: 'Topluluk seni tanıyor, etkini hissediyor.' },
  { level: 5, name: 'İyiliğin Işığı',      karma: 10000, desc: 'İyiliğin en üst seviyesine ulaştın.' },
]

interface TiersClientProps {
  karma: number
}

function getCurrentTierLevel(karma: number): number {
  let level = 1
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (karma >= TIERS[i].karma) { level = TIERS[i].level; break }
  }
  return level
}

export function TiersClient({ karma }: TiersClientProps) {
  const { colors: c } = useTheme()
  const router = useRouter()
  const currentLevel = getCurrentTierLevel(karma)

  return (
    <div style={{
      minHeight: '100vh',
      background: c.ink900,
      color: c.cream,
      paddingBottom: 120,
    }}>
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
        <button
          onClick={() => router.back()}
          style={{
            width: 36, height: 36, borderRadius: 12,
            background: c.ink800, border: `1px solid ${c.ink600}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} color={c.cream} />
        </button>
        <div>
          <h1 style={{
            margin: 0,
            fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
            fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', color: c.cream,
          }}>
            Seviye Yolculuğun
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: c.ink300 }}>
            Karma biriktir, kelebeğin gelişsin
          </p>
        </div>
      </div>

      {/* Current karma display */}
      <div style={{
        padding: '24px 20px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <KarmaDotToken size={12} />
        <span style={{
          fontSize: 15, fontWeight: 700, color: c.gold,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {karma.toLocaleString('tr-TR')} Karma
        </span>
      </div>

      {/* Tier cards */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TIERS.map(tier => {
          const isCurrent = tier.level === currentLevel
          const isLocked = tier.level > currentLevel
          const karmaNeeded = isLocked ? tier.karma - karma : 0

          return (
            <div
              key={tier.level}
              style={{
                background: isCurrent
                  ? `linear-gradient(135deg, rgba(232,194,104,0.08) 0%, ${c.ink800} 100%)`
                  : c.ink800,
                border: `1px solid ${isCurrent ? c.gold : c.ink600}`,
                borderRadius: 16,
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                opacity: isLocked ? 0.5 : 1,
                transition: 'opacity 200ms',
              }}
            >
              {/* Butterfly preview */}
              <div style={{ flexShrink: 0, opacity: isLocked ? 0.4 : 1 }}>
                <BrandLogo tierLevel={tier.level} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 3,
                }}>
                  <span style={{
                    fontFamily: "'Fraunces', var(--font-display), ui-serif, Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: 16,
                    fontWeight: 500,
                    color: isCurrent ? c.gold : c.cream,
                  }}>
                    {tier.name}
                  </span>
                  {isCurrent && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: c.gold,
                      background: c.goldSoft,
                      border: `1px solid ${c.goldLine}`,
                      borderRadius: 999,
                      padding: '2px 8px',
                    }}>
                      Buradasın
                    </span>
                  )}
                </div>
                <p style={{
                  margin: 0, fontSize: 12, color: c.ink300, lineHeight: 1.4,
                }}>
                  {tier.desc}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 6,
                }}>
                  <KarmaDotToken size={8} />
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isLocked ? c.ink400 : c.gold,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {isLocked
                      ? `${karmaNeeded.toLocaleString('tr-TR')} karma kaldı`
                      : `${tier.karma.toLocaleString('tr-TR')}+ karma`
                    }
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
