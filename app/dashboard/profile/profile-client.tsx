'use client'

import { Settings, Share2, MapPin, LogOut } from 'lucide-react'
import { IconButtonDS, TierBadgeDS, KarmaDotToken } from '@/components/ui/ds'
import { getTierFromKarma } from '@/components/ui/tier-badge'
import { logoutAction } from './actions'
import type { Profile } from '@/lib/supabase/types'

interface ProfileClientProps {
  profile: Profile
  completedCount: number
  karma: number
}

const tierNames: Record<number, string> = {
  1: 'İyi Biri',
  2: 'Çok İyi Biri',
  3: 'Çoook İyi Biri',
  4: 'Gerçekten İyi Biri',
  5: 'İyiliğin Öncüsü',
}

const tierThresholds: Record<number, number> = {
  1: 500,
  2: 2000,
  3: 5000,
  4: 10000,
  5: Infinity,
}

const achievements = [
  { icon: 'i', name: 'İlk Adım', locked: false, sub: 'İlk görevin' },
  { icon: '✿', name: 'Çevre Dostu', locked: false, sub: '3 çevre görevi' },
  { icon: '♥', name: 'Kalp Kalbe', locked: false, sub: '5 farklı NGO' },
  { icon: '⚡', name: 'Yıldırım', locked: true, sub: '30 gün seri' },
  { icon: '◈', name: 'Elmas', locked: true, sub: '10.000 Karma' },
  { icon: '♛', name: 'Liderlik', locked: true, sub: 'Top 10' },
]

const timeline = [
  { title: 'Sahil Temizliği', ngo: 'TEMA Vakfı', karma: 150, date: '3 gün önce' },
  { title: 'Kan Bağışı Kampanyası', ngo: 'Kızılay', karma: 300, date: '1 hafta önce' },
  { title: 'Okuma Desteği', ngo: 'ÇYDD', karma: 250, date: '2 hafta önce' },
]

export function ProfileClient({ profile, completedCount, karma }: ProfileClientProps) {
  const tier = getTierFromKarma(karma)
  const tierName = tierNames[tier] ?? tierNames[1]
  const nextTier = tier < 5 ? tierNames[tier + 1] : null
  const prevThreshold = tier === 1 ? 0 : tierThresholds[tier - 1]
  const nextThreshold = tierThresholds[tier]
  const karmaInTier = karma - prevThreshold
  const karmaNeeded = nextThreshold === Infinity ? 0 : nextThreshold - prevThreshold
  const karmaToNext = nextThreshold === Infinity ? 0 : nextThreshold - karma
  const pct = nextThreshold === Infinity ? 100 : Math.min(100, Math.round((karmaInTier / karmaNeeded) * 100))

  const initial = (profile.name ?? 'U').charAt(0).toUpperCase()

  return (
    <div
      style={{
        background: '#24201B',
        color: '#F4EEDF',
        minHeight: '100%',
        paddingBottom: 140,
      }}
    >
      {/* Cover + avatar section */}
      <div style={{ position: 'relative', height: 180, flexShrink: 0 }}>
        {/* Cover image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900&q=70"
          alt="cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(26,22,18,.3), rgba(26,22,18,.85))',
          }}
        />
        {/* Top row: Settings + Share */}
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
          <IconButtonDS icon={<Settings size={16} />} />
          <IconButtonDS icon={<Share2 size={16} />} />
        </div>
      </div>

      {/* Avatar row */}
      <div style={{ marginTop: -42, position: 'relative', padding: '0 20px' }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8C268, #B58F3D)',
            border: '3px solid #24201B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.3)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
              fontSize: 36,
              fontWeight: 500,
              color: '#241E18',
              lineHeight: 1,
            }}
          >
            {initial}
          </span>
        </div>
      </div>

      {/* Name + tier row */}
      <div style={{ marginTop: 12, padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                color: '#F4EEDF',
                margin: 0,
              }}
            >
              {profile.name ?? 'İsimsiz Kullanıcı'}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 6,
              }}
            >
              <MapPin size={11} color="#A89E8A" />
              <span style={{ fontSize: 12, color: '#A89E8A' }}>İstanbul · 2024&apos;ten beri</span>
            </div>
          </div>
          <TierBadgeDS tier={tierName} />
        </div>
      </div>

      {/* Karma card */}
      <div style={{ padding: '20px 16px 0' }}>
        <div
          style={{
            background: '#2E2923',
            border: '1px solid #3F3830',
            borderRadius: 16,
            padding: '18px 20px',
          }}
        >
          {/* Karma amount */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <KarmaDotToken size={14} />
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#E8C268',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {karma.toLocaleString('tr-TR')}
            </span>
            <span style={{ fontSize: 12, color: '#A89E8A', marginLeft: 2 }}>Karma</span>
          </div>

          {/* Progress bar */}
          {nextTier && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  fontSize: 11,
                  marginBottom: 8,
                  gap: 12,
                }}
              >
                <span
                  style={{
                    color: '#A89E8A',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                    flex: '1 1 auto',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
                      fontStyle: 'italic',
                      color: '#F4EEDF',
                    }}
                  >
                    {nextTier}
                  </span>
                  &apos;ye
                </span>
                <span
                  style={{
                    color: '#E8C268',
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {karmaToNext.toLocaleString('tr-TR')} kaldı
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  background: 'rgba(255,255,255,.05)',
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, #B58F3D, #E8C268)',
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          padding: '14px 16px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8,
        }}
      >
        {[
          { label: 'GÖREV', value: completedCount, sub: 'tamamlandı' },
          { label: 'SAAT', value: 38, sub: 'gönüllü' },
          { label: 'NGO', value: 4, sub: 'destek' },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            style={{
              background: '#2E2923',
              border: '1px solid #3F3830',
              borderRadius: 12,
              padding: '14px 12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: '#A89E8A',
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#F4EEDF',
                fontVariantNumeric: 'tabular-nums',
                marginTop: 4,
              }}
            >
              {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
            </div>
            <div style={{ fontSize: 10, color: '#A89E8A', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div>
        <div style={{ padding: '30px 20px 12px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
              fontSize: 20,
              fontWeight: 500,
              color: '#F4EEDF',
              margin: 0,
            }}
          >
            Rozetler
          </h2>
        </div>
        <div
          style={{
            padding: '0 16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
          }}
        >
          {achievements.map(({ icon, name, locked, sub }) => (
            <div
              key={name}
              style={{
                background: '#2E2923',
                border: '1px solid #3F3830',
                borderRadius: 14,
                padding: '16px 10px',
                textAlign: 'center',
                opacity: locked ? 0.5 : 1,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: locked
                    ? '#3F3830'
                    : 'linear-gradient(135deg, #E8C268, #B58F3D)',
                  boxShadow: locked
                    ? undefined
                    : 'inset 0 1px 0 rgba(255,255,255,.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontSize: 20,
                  color: locked ? '#A89E8A' : '#241E18',
                }}
              >
                {icon}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#F4EEDF',
                  lineHeight: 1.2,
                }}
              >
                {name}
              </div>
              <div style={{ fontSize: 10, color: '#A89E8A', marginTop: 3 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity timeline */}
      <div>
        <div style={{ padding: '30px 20px 12px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
              fontSize: 20,
              fontWeight: 500,
              color: '#F4EEDF',
              margin: 0,
            }}
          >
            Son görevlerin
          </h2>
        </div>
        <div style={{ padding: '0 20px' }}>
          {timeline.map(({ title, ngo, karma: k, date }, idx) => (
            <div
              key={title}
              style={{
                display: 'flex',
                gap: 14,
                paddingBottom: idx < timeline.length - 1 ? 20 : 0,
              }}
            >
              {/* Left column: dot + line */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  paddingTop: 3,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#E8C268',
                    boxShadow: '0 0 0 3px rgba(232,194,104,.2)',
                    flexShrink: 0,
                  }}
                />
                {idx < timeline.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      background: '#3F3830',
                      marginTop: 6,
                    }}
                  />
                )}
              </div>
              {/* Right: content */}
              <div style={{ paddingBottom: idx < timeline.length - 1 ? 0 : 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#F4EEDF',
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 4,
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#A89E8A' }}>{ngo}</span>
                  <span style={{ fontSize: 12, color: '#3F3830' }}>·</span>
                  <span style={{ fontSize: 12, color: '#A89E8A' }}>{date}</span>
                  <span style={{ fontSize: 12, color: '#3F3830' }}>·</span>
                  <KarmaDotToken size={12} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#E8C268',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    +{k}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: '32px 20px 0' }}>
        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#A89E8A',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  )
}
