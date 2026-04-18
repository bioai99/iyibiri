'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Share2,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Check,
} from 'lucide-react'
import type { Mission, UserMission } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { BadgeDS, IconButtonDS, FactCard, KarmaDotToken, KarmaToken } from '@/components/ui/ds'

interface Props {
  mission: Mission & { ngos?: { name: string; color_accent: string | null; logo_url: string | null } | null }
  userMission: UserMission | null
  userId: string
}

export function MissionDetailClient({ mission, userMission, userId }: Props) {
  const [loading, setLoading] = useState(false)
  const [takeError, setTakeError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [following, setFollowing] = useState(false)
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  const isTaken = !!userMission
  const isCompleted = userMission?.status === 'completed'

  async function handleTakeMission() {
    setLoading(true)
    setTakeError(null)
    const { error } = await supabase
      .from('user_missions')
      .insert({ user_id: userId, mission_id: mission.id, status: 'taken' })
    setLoading(false)
    if (error) {
      setTakeError('Görev alınamadı, tekrar dene')
      return
    }
    router.push(`/dashboard/missions/${mission.id}/complete`)
  }

  return (
    <div
      style={{
        background: '#24201B',
        color: '#F4EEDF',
        minHeight: '100%',
        paddingBottom: 120,
        position: 'relative',
      }}
    >
      {/* ── 1. Full-bleed hero photo ── */}
      <div style={{ position: 'relative', aspectRatio: '4/3', width: '100%', overflow: 'hidden' }}>
        {/* Photo */}
        {mission.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mission.photo_url}
            alt={mission.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#3F3830' }} />
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

        {/* Top row: back + share/heart */}
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
          <div style={{ display: 'flex', gap: 8 }}>
            <IconButtonDS
              icon={<Share2 size={18} />}
              onClick={() => {
                try {
                  if (navigator.share) {
                    navigator.share({ title: mission.title, url: window.location.href })
                  }
                } catch { /* silent */ }
              }}
            />
            <IconButtonDS
              icon={<Heart size={18} fill={saved ? '#F4EEDF' : 'none'} />}
              onClick={() => setSaved(s => !s)}
            />
          </div>
        </div>

        {/* Bottom: badge + title */}
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
            }}
          >
            {mission.title}
          </h1>
        </div>
      </div>

      {/* ── 2. NGO lockup row ── */}
      {mission.ngos && (
        <div
          style={{
            padding: '18px 20px 18px',
            borderBottom: '1px solid #3F3830',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* NGO logo circle */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#fff',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mission.ngos.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mission.ngos.logo_url}
                alt={mission.ngos.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: mission.ngos.color_accent ?? '#24201B',
                }}
              >
                {mission.ngos.name[0]}
              </span>
            )}
          </div>

          {/* Name + subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#F4EEDF', lineHeight: 1.3 }}>
              {mission.ngos.name}
            </div>
            <div style={{ fontSize: 11, color: '#A89E8A', marginTop: 2 }}>
              27 yıldır · 12.4K gönüllü
            </div>
          </div>

          {/* Follow button */}
          <button
            onClick={() => setFollowing(f => !f)}
            style={{
              background: 'transparent',
              border: '1px solid #5C5346',
              color: '#F4EEDF',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              padding: '7px 16px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {following ? 'Takip ediliyor ✓' : 'Takip et'}
          </button>
        </div>
      )}

      {/* ── 3. Facts grid ── */}
      <div
        style={{
          padding: '20px 16px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        <FactCard
          label="TARİH"
          value={mission.date_label ?? 'Esnek'}
          icon={<Calendar size={16} color="#E8C268" />}
        />
        <FactCard
          label="SÜRE"
          value={mission.duration ?? '-'}
          icon={<Clock size={16} color="#E8C268" />}
        />
        <FactCard
          label="KONUM"
          value={mission.location ?? 'Belirtilmemiş'}
          icon={<MapPin size={16} color="#E8C268" />}
        />
        <FactCard
          label="KONTENJAN"
          value={`${mission.spots_left ?? 0} yer`}
          icon={<Users size={16} color="#E8C268" />}
          urgent={(mission.spots_left ?? 0) <= 5}
        />
      </div>

      {/* ── 4. Impact section ── */}
      {(mission.impact_statement || mission.long_description || mission.description) && (
        <div style={{ padding: '24px 20px 0' }}>
          {/* Gold eyebrow */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: '#E8C268',
              marginBottom: 10,
            }}
          >
            Bu Görevin Etkisi
          </div>

          {/* Impact quote */}
          {mission.impact_statement && (
            <p
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 22,
                fontWeight: 400,
                lineHeight: 1.3,
                letterSpacing: '-0.015em',
                fontStyle: 'italic',
                color: '#F4EEDF',
                margin: '0 0 0 0',
              }}
            >
              &ldquo;{mission.impact_statement}&rdquo;
            </p>
          )}

          {/* Description */}
          {(mission.long_description || mission.description) && (
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: '#CEC5B2',
                marginTop: 16,
                margin: mission.impact_statement ? '16px 0 0' : '0',
              }}
            >
              {mission.long_description ?? mission.description}
            </p>
          )}
        </div>
      )}

      {/* ── 5. Karma reward card ── */}
      <div style={{ padding: '24px 16px 0' }}>
        <div
          style={{
            background: '#1E1B16',
            border: '1px solid rgba(232,194,104,.32)',
            borderRadius: 16,
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left side */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: '#A89E8A',
                marginBottom: 8,
              }}
            >
              Kazanacağın
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <KarmaDotToken size={14} />
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#E8C268',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                +{mission.karma}
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#A89E8A', marginTop: 2 }}>Karma</div>
          </div>

          {/* Right side */}
          <KarmaToken size={56} />
        </div>
      </div>

      {/* ── 6. Participants section ── */}
      <div style={{ padding: '24px 20px 24px' }}>
        {/* Eyebrow */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: '#A89E8A',
            marginBottom: 12,
          }}
        >
          Katılanlar
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Avatar stack */}
          <div style={{ display: 'flex' }}>
            {[
              { initial: 'E', bg: '#B58F3D' },
              { initial: 'M', bg: '#C4CBAC' },
              { initial: 'D', bg: '#E9CFC2' },
              { initial: 'B', bg: '#574E42' },
            ].map((avatar, i) => (
              <div
                key={i}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: avatar.bg,
                  border: '2px solid #1A1612',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#F4EEDF',
                  marginLeft: i === 0 ? 0 : -10,
                  position: 'relative',
                  zIndex: 4 - i,
                }}
              >
                {avatar.initial}
              </div>
            ))}
          </div>

          {/* Text */}
          <div style={{ fontSize: 13, color: '#A89E8A', lineHeight: 1.4 }}>
            {mission.participants ?? 17} kişi katıldı · senin ağından 3&apos;ü
          </div>
        </div>
      </div>

      {/* ── Error message ── */}
      {takeError && (
        <div
          style={{
            margin: '0 16px 16px',
            background: 'rgba(220,38,38,.12)',
            border: '1px solid rgba(220,38,38,.3)',
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 13,
            color: '#F87171',
            textAlign: 'center',
          }}
        >
          {takeError}
        </div>
      )}

      {/* ── 7. Sticky CTA ── */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(180deg,rgba(36,32,27,0),rgba(36,32,27,.95) 30%)',
          backdropFilter: 'blur(12px)',
          padding: '16px 16px 28px',
        }}
      >
        {isCompleted ? (
          /* Completed state */
          <button
            disabled
            style={{
              width: '100%',
              background: '#22543D',
              color: '#86EFAC',
              border: 'none',
              borderRadius: 16,
              padding: '16px 20px',
              fontSize: 16,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'default',
              opacity: 0.8,
            }}
          >
            <Check size={20} />
            Tamamlandı · +{mission.karma} Karma
          </button>
        ) : isTaken ? (
          /* Taken state */
          <button
            onClick={() => router.push(`/dashboard/missions/${mission.id}/complete`)}
            style={{
              width: '100%',
              background: '#16A34A',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              padding: '16px 20px',
              fontSize: 16,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            Tamamladım
            <ArrowRight size={20} />
          </button>
        ) : (
          /* Default state */
          <button
            onClick={handleTakeMission}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#8A6A2C' : '#E8C268',
              color: '#24201B',
              border: 'none',
              borderRadius: 16,
              padding: '16px 20px',
              fontSize: 16,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
            }}
          >
            {loading ? 'Göreve Alınıyor...' : 'Bu göreve katıl'}
            {!loading && <ArrowRight size={20} />}
          </button>
        )}
      </div>
    </div>
  )
}
