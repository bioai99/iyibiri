'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Share2, MapPin, ArrowRight } from 'lucide-react'
import type { Mission } from '@/lib/supabase/types'
import { BadgeDS, IconButtonDS, KarmaDotToken } from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'

// Faz 5 (2026-04-26 perf-eng): mission states hero + thumbnail next/image.

// ─── Types ────────────────────────────────────────────────────────────────────

interface MissionStatesProps {
  mission: Mission & { ngos?: { name: string; color_accent: string | null; logo_url: string | null } | null }
  state: 'applied' | 'checkin' | 'completed'
}

// ─── Eyebrow label ─────────────────────────────────────────────────────────────

function Eyebrow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '.22em',
        textTransform: 'uppercase' as const,
        color: c.gold,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── Status icons ───────────────────────────────────────────────────────────

function HourglassIcon() {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: 'rgba(196,203,172,.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
      </svg>
    </div>
  )
}

function QRIcon() {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: 'rgba(232,194,104,.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="5" height="5" x="3" y="3" rx="1" />
        <rect width="5" height="5" x="16" y="3" rx="1" />
        <rect width="5" height="5" x="3" y="16" rx="1" />
        <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
        <path d="M21 21v.01" />
        <path d="M12 7v3a2 2 0 0 1-2 2H7" />
        <path d="M3 12h.01" />
        <path d="M12 3h.01" />
        <path d="M12 16v.01" />
        <path d="M16 12h1" />
        <path d="M21 12v.01" />
        <path d="M12 21v-1" />
      </svg>
    </div>
  )
}

function CheckIcon() {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: 'rgba(232,194,104,.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c.gold} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  )
}

// ─── Status strip ───────────────────────────────────────────────────────────

function StatusStrip({ state, karma }: { state: 'applied' | 'checkin' | 'completed'; karma: number }) {
  const { colors: c } = useTheme()
  const configs = {
    applied: {
      icon: <HourglassIcon />,
      title: 'Başvurun alındı',
      sub: 'NGO 24 saat içinde yanıtlayacak.',
      containerStyle: {
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
      },
    },
    checkin: {
      icon: <QRIcon />,
      title: 'Görev günü — Check-in',
      sub: 'Konuma vardığında kod ile katıl.',
      containerStyle: {
        background: c.ink800,
        border: `1px solid ${c.goldLine}`,
      },
    },
    completed: {
      icon: <CheckIcon />,
      title: 'Tamamlandı',
      sub: `Bu görevden +${karma} Karma kazandın.`,
      containerStyle: {
        background: `linear-gradient(135deg, ${c.ink800} 0%, ${c.ink700} 100%)`,
        border: `1px solid ${c.goldLine}`,
      },
    },
  }

  const cfg = configs[state]

  return (
    <div style={{ padding: '18px 16px 0', position: 'relative', zIndex: 1 }}>
      <div
        style={{
          ...cfg.containerStyle,
          borderRadius: 16,
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          overflow: 'hidden',
        }}
      >
        {cfg.icon}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: c.cream, lineHeight: 1.3 }}>
            {cfg.title}
          </div>
          <div style={{ fontSize: 13, color: c.ink300, marginTop: 3, lineHeight: 1.4 }}>
            {cfg.sub}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Applied state body ─────────────────────────────────────────────────────

function AppliedBody({ onCancel, ngoName }: { onCancel: () => void; ngoName: string }) {
  const { colors: c } = useTheme()
  const steps = [
    {
      num: 1,
      active: true,
      title: 'NGO onayı',
      sub: `${ngoName} 24 saat içinde katılımını onaylar`,
    },
    {
      num: 2,
      active: false,
      title: 'Hazırlık SMS\'i',
      sub: 'Görev öncesi buluşma detayı SMS ile gelir',
    },
    {
      num: 3,
      active: false,
      title: 'Görev günü check-in',
      sub: 'Konuma vardığında QR ile giriş yap',
    },
  ]

  return (
    <>
      {/* Eyebrow */}
      <div style={{ padding: '24px 20px 0' }}>
        <Eyebrow>Sırada ne var</Eyebrow>
      </div>

      {/* Steps */}
      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {steps.map((step) => (
          <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            {/* Number circle */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: step.active ? c.gold : 'transparent',
                border: step.active ? 'none' : `1.5px solid ${c.ink600}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: step.active ? c.ink900 : c.ink300,
                flexShrink: 0,
              }}
            >
              {step.num}
            </div>

            {/* Text */}
            <div style={{ paddingTop: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: c.cream, lineHeight: 1.3 }}>
                {step.title}
              </div>
              <div style={{ fontSize: 12, color: c.ink300, marginTop: 2, lineHeight: 1.4 }}>
                {step.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel button */}
      <div style={{ padding: '28px 16px 0' }}>
        <button
          onClick={onCancel}
          style={{
            width: '100%',
            background: 'transparent',
            border: `1.5px solid ${c.ink600}`,
            color: c.ink300,
            borderRadius: 999,
            padding: '12px 24px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 220ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = c.danger
            e.currentTarget.style.color = c.danger
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = c.ink600
            e.currentTarget.style.color = c.ink300
          }}
        >
          Katılımı iptal et
        </button>
      </div>
    </>
  )
}

// ─── CheckIn state body ─────────────────────────────────────────────────────

function CheckInBody({ onMap, onQR }: { onMap: () => void; onQR: () => void }) {
  const { colors: c } = useTheme()
  return (
    <>
      {/* Participation code card */}
      <div style={{ padding: '24px 16px 0' }}>
        <div
          style={{
            background: c.ink800,
            border: '1.5px dashed rgba(232,194,104,.45)',
            borderRadius: 16,
            padding: '28px 20px',
            textAlign: 'center',
          }}
        >
          <Eyebrow style={{ marginBottom: 14 }}>Katılım Kodu</Eyebrow>
          <div
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 44,
              fontWeight: 700,
              color: c.gold,
              letterSpacing: '.08em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1.1,
            }}
          >
            K7-3921
          </div>
          <div style={{ fontSize: 12, color: '#7A7060', marginTop: 12, lineHeight: 1.4 }}>
            NGO sorumlusu bu kodu kontrol edecek.
          </div>
        </div>
      </div>

      {/* Meeting info card */}
      <div style={{ padding: '16px 16px 0' }}>
        <div
          style={{
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            borderRadius: 14,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 4 }}>Buluşma</Eyebrow>
            <div style={{ fontSize: 14, fontWeight: 600, color: c.cream, lineHeight: 1.3 }}>
              Kilyos Sahili · 09:30
            </div>
          </div>

          <button
            onClick={onMap}
            style={{
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              color: c.cream,
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              padding: '8px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
            }}
          >
            <MapPin size={14} color={c.gold} />
            Harita
          </button>
        </div>
      </div>

      {/* QR check-in primary button */}
      <div style={{ padding: '24px 16px 0' }}>
        <button
          onClick={onQR}
          style={{
            width: '100%',
            background: c.gold,
            color: c.ink900,
            border: 'none',
            borderRadius: 16,
            padding: '16px 20px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          QR ile check-in yap
        </button>
      </div>
    </>
  )
}

// ─── Completed state body ───────────────────────────────────────────────────

function CompletedBody({ karma, photoUrl, impactStatement, ngoName, onShare, onNewMission }: {
  karma: number
  photoUrl: string | null
  impactStatement: string | null
  ngoName: string
  onShare: () => void
  onNewMission: () => void
}) {
  const { colors: c } = useTheme()
  const [rating, setRating] = useState(4)
  const extraPhotos = [
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
  ]

  const gridPhotos = [
    photoUrl ?? 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80',
    ...extraPhotos,
  ]

  return (
    <>
      {/* Karma earned banner */}
      <div style={{ padding: '20px 16px 0' }}>
        <div
          style={{
            background: c.ink800,
            border: `1px solid rgba(232,194,104,.35)`,
            borderRadius: 18,
            padding: 22,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Concentric rings decorative SVG */}
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            style={{
              position: 'absolute',
              right: -40,
              top: -40,
              opacity: 0.12,
              pointerEvents: 'none',
            }}
          >
            <circle cx="80" cy="80" r="80" fill="none" stroke={c.gold} strokeWidth="1" />
            <circle cx="80" cy="80" r="60" fill="none" stroke={c.gold} strokeWidth="1" />
            <circle cx="80" cy="80" r="40" fill="none" stroke={c.gold} strokeWidth="1" />
            <circle cx="80" cy="80" r="20" fill="none" stroke={c.gold} strokeWidth="1" />
          </svg>

          <Eyebrow style={{ marginBottom: 12 }}>Kazandın</Eyebrow>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <KarmaDotToken size={18} />
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: c.gold,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              +{karma}
            </span>
          </div>

          <div style={{ fontSize: 13, color: c.ink300 }}>
            Bakiye: 2.490 Karma
          </div>
        </div>
      </div>

      {/* Impact quote */}
      <div style={{ padding: '22px 20px 0' }}>
        <Eyebrow style={{ marginBottom: 12 }}>Beraber ne yaptık</Eyebrow>
        <p
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.35,
            letterSpacing: '-0.015em',
            fontStyle: 'italic',
            color: c.cream,
            margin: 0,
          }}
        >
          &ldquo;{impactStatement ?? 'Bu görevde birlikte gerçek bir fark yarattık.'}&rdquo;
        </p>
      </div>

      {/* Photo grid */}
      <div style={{ padding: '26px 16px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 6,
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {gridPhotos.map((url, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '1/1',
                overflow: 'hidden',
                borderRadius: i === 0 ? '14px 0 0 14px' : i === 2 ? '0 14px 14px 0' : 0,
              }}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="(max-width: 640px) 33vw, 200px"
                style={{ objectFit: 'cover' }}
                loading="lazy"
                quality={70}
              />
            </div>
          ))}
        </div>
      </div>

      {/* NGO rating */}
      <div style={{ padding: '24px 16px 0' }}>
        <div
          style={{
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            borderRadius: 14,
            padding: '16px 18px',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: c.cream, marginBottom: 12 }}>
            {ngoName}&apos;nı nasıl buldun?
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} width="28" height="28" viewBox="0 0 24 24" fill={star <= rating ? c.gold : 'none'} stroke={c.gold} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setRating(star)}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{ padding: '24px 16px 0', display: 'flex', gap: 10 }}>
        <button
          onClick={onShare}
          style={{
            flex: 1,
            background: 'transparent',
            border: `1px solid ${c.ink600}`,
            color: c.cream,
            borderRadius: 16,
            padding: '14px 16px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Share2 size={16} />
          Paylaş
        </button>
        <button
          onClick={onNewMission}
          style={{
            flex: 1,
            background: c.gold,
            border: 'none',
            color: c.ink900,
            borderRadius: 16,
            padding: '14px 16px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          Yeni görev
          <ArrowRight size={16} />
        </button>
      </div>
    </>
  )
}

// ─── Main export ────────────────────────────────────────────────────────────

export function MissionStatesClient({ mission, state }: MissionStatesProps) {
  const { colors: c } = useTheme()
  const router = useRouter()

  function handleShare() {
    try {
      if (navigator.share) {
        navigator.share({ title: mission.title, url: window.location.href })
      }
    } catch { /* silent */ }
  }

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        paddingBottom: 160,
      }}
    >
      {/* ── Hero photo ── */}
      <div style={{ position: 'relative', aspectRatio: '4/3', width: '100%', overflow: 'hidden' }}>
        {/* Photo */}
        {mission.photo_url ? (
          <Image
            src={mission.photo_url}
            alt={mission.title}
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
              ...(state === 'completed' ? { filter: 'saturate(.7) brightness(.7)' } : {}),
            }}
            priority
            quality={75}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: c.ink600 }} />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg,rgba(26,22,18,.3) 0%,rgba(26,22,18,0) 30%,rgba(26,22,18,0) 70%,rgba(36,32,27,1) 100%)',
          }}
        />

        {/* Top row: back + share (completed only) */}
        <div
          style={{
            position: 'absolute',
            top: 58,
            left: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <IconButtonDS
            icon={<ArrowLeft size={18} />}
            onClick={() => router.back()}
          />
          {state === 'completed' && (
            <IconButtonDS icon={<Share2 size={18} />} onClick={handleShare} />
          )}
        </div>

        {/* Bottom: badge + title — raw #F4EEDF on photo overlay per v2.1 spec */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 20,
            right: 20,
          }}
        >
          {mission.category && (
            <div style={{ marginBottom: 10 }}>
              <BadgeDS variant="onImage">{mission.category}</BadgeDS>
            </div>
          )}
          <h1
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 34,
              fontWeight: 500,
              letterSpacing: '-0.028em',
              lineHeight: 1.05,
              color: '#F4EEDF',
              margin: 0,
              textShadow: '0 2px 16px rgba(0,0,0,.5)',
            }}
          >
            {mission.title}
          </h1>
        </div>
      </div>

      {/* ── Status strip ── */}
      <StatusStrip state={state} karma={mission.karma} />

      {/* ── State-specific body ── */}
      {state === 'applied' && (
        <AppliedBody
          onCancel={() => router.push('/dashboard/missions')}
          ngoName={mission.ngos?.name ?? 'STK'}
        />
      )}
      {state === 'checkin' && (
        <CheckInBody
          onMap={() => window.open('https://maps.google.com/maps?q=Kilyos+Sahili', '_blank')}
          onQR={() => router.push('/dashboard/missions/' + mission.id + '/complete')}
        />
      )}
      {state === 'completed' && (
        <CompletedBody
          karma={mission.karma}
          photoUrl={mission.photo_url}
          impactStatement={mission.impact_statement}
          ngoName={mission.ngos?.name ?? 'STK'}
          onShare={handleShare}
          onNewMission={() => router.push('/dashboard/missions')}
        />
      )}
    </div>
  )
}
