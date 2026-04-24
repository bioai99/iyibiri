'use client'

import { useState, useMemo, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  Info,
  ShieldCheck,
} from 'lucide-react'
import type { Mission, UserMission } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { BadgeDS, IconButtonDS, FactCard, KarmaDotToken, KarmaToken } from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'
import { takeMission } from '@/lib/missions/actions'

interface Props {
  mission: Mission & { ngos?: { name: string; short_name?: string | null; color_accent: string | null; logo_url: string | null } | null }
  userMission: UserMission | null
  userId: string
  isMember?: boolean
  isSaved?: boolean
}

export function MissionDetailClient({ mission, userMission, userId, isMember = false, isSaved: initialSaved = false }: Props) {
  const { colors: c } = useTheme()
  // ADR-012 Yol D: Public mission için kullanıcı üye olmadan da alabilir,
  // hafif KVKK onayı yeterli. Members_only görev için state zaten
  // `requires_membership`'a düşer (page.tsx tarafından) — bu client hiç render olmaz.
  const [publicKvkkChecked, setPublicKvkkChecked] = useState(false)
  const [takeError, setTakeError] = useState<string | null>(null)
  const [saved, setSaved] = useState(initialSaved)
  const [following, setFollowing] = useState(false)
  const [pending, startTransition] = useTransition()
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  const isTaken = !!userMission
  const isCompleted = userMission?.status === 'completed'

  // Public mission için hafif KVKK gerekir (üye olmayan kullanıcı)
  const isPublicMission = mission.access_level === 'public'
  const needsPublicKvkk =
    isPublicMission && !!mission.ngo_id && !isMember && !isTaken && !isCompleted

  const toggleSave = useCallback(async () => {
    const prev = saved
    setSaved(!prev)
    try {
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
  }, [saved, userId, mission.id, supabase])

  function handleTakeMission() {
    setTakeError(null)
    startTransition(async () => {
      const result = await takeMission(mission.id)
      if (!result.ok) {
        setTakeError(result.error)
        return
      }
      router.refresh()
    })
  }

  const loading = pending

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        paddingBottom: 180,
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
          <div style={{ position: 'absolute', inset: 0, background: c.ink600 }} />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              `linear-gradient(180deg, ${c.ink900}4D 0%, transparent 30%, transparent 70%, ${c.ink900} 100%)`,
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
              icon={<Heart size={18} fill={saved ? c.cream : 'none'} />}
              onClick={toggleSave}
            />
          </div>
        </div>

        {/* Bottom: badge + title — v2.1: raw #F4EEDF + textShadow on photo overlay */}
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

      {/* ── 2. NGO lockup row ── */}
      {mission.ngos && (
        <div
          style={{
            padding: '18px 20px 18px',
            borderBottom: `1px solid ${c.ink600}`,
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
                  color: mission.ngos.color_accent ?? c.ink900,
                }}
              >
                {mission.ngos.name[0]}
              </span>
            )}
          </div>

          {/* Name + subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: c.cream, lineHeight: 1.3 }}>
              {mission.ngos.name}
            </div>
          </div>

          {/* Follow button */}
          <button
            onClick={() => setFollowing(f => !f)}
            style={{
              background: 'transparent',
              border: `1px solid ${c.ink500}`,
              color: c.cream,
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

      {/* Membership badge */}
      {isMember && (
        <div style={{
          margin: '0 20px', marginTop: 8,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: c.goldSoft, borderRadius: 999, padding: '4px 10px',
            fontSize: 11, fontWeight: 600, color: c.gold,
          }}>
            ✓ {mission.ngos?.short_name ?? mission.ngos?.name ?? ''} üyesi
          </div>
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
          icon={<Calendar size={16} color={c.gold} />}
        />
        <FactCard
          label="SÜRE"
          value={mission.duration ?? '-'}
          icon={<Clock size={16} color={c.gold} />}
        />
        <FactCard
          label="KONUM"
          value={mission.location ?? 'Belirtilmemiş'}
          icon={<MapPin size={16} color={c.gold} />}
        />
        <FactCard
          label="KONTENJAN"
          value={`${mission.spots_left ?? 0} yer`}
          icon={<Users size={16} color={c.gold} />}
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
              color: c.gold,
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
                color: c.cream,
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
                color: c.ink200,
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
            background: c.ink800,
            border: `1px solid ${c.goldLine}`,
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
                color: c.ink300,
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
                  color: c.gold,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                +{mission.karma}
              </span>
            </div>
            <div style={{ fontSize: 13, color: c.ink300, marginTop: 2 }}>Karma</div>
          </div>

          {/* Right side */}
          <KarmaToken size={56} />
        </div>
      </div>

      {/* ── 6. Participants section ── */}
      <div style={{ padding: '24px 20px 24px' }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: c.ink300,
            marginBottom: 12,
          }}
        >
          Katılanlar
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={16} color={c.ink300} />
          <div style={{ fontSize: 13, color: c.ink300, lineHeight: 1.4 }}>
            {mission.participants ?? 0} kişi katıldı
          </div>
        </div>
      </div>

      {/* ── 6.5. Public Mission hafif KVKK onayı ── */}
      {/* ADR-012 Yol D + ADR-009 hafif onay:
          Public görevler için kullanıcı üye olmadan katılabilir; sadece ad+e-posta+şehir
          STK ile paylaşıldığına dair hafif KVKK onayı yeterli. Members_only görevlerde
          bu client hiç render olmaz (page.tsx requires_membership state'e yönlendirir). */}
      {needsPublicKvkk && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            borderRadius: 16,
            padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: c.goldSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <ShieldCheck size={16} color={c.gold} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.gold, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Veri paylaşımı
                </div>
                <div style={{ fontSize: 12, color: c.ink300, marginTop: 2 }}>
                  Tek seferlik — üye olmana gerek yok
                </div>
              </div>
            </div>
            <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', cursor: 'pointer' }}>
              <div
                onClick={() => setPublicKvkkChecked(!publicKvkkChecked)}
                style={{
                  width: 20, height: 20, borderRadius: 6, marginTop: 1,
                  background: publicKvkkChecked ? c.gold : 'transparent',
                  border: `1.5px solid ${publicKvkkChecked ? c.gold : c.ink500}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {publicKvkkChecked && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: 12, color: c.ink300, lineHeight: 1.5 }}>
                Bu göreve katıldığımda <span style={{ color: c.cream, fontWeight: 600 }}>ad, e-posta, şehir</span> bilgilerimin{' '}
                <span style={{ color: c.cream, fontWeight: 600 }}>{mission.ngos?.short_name ?? mission.ngos?.name ?? 'STK'}</span>{' '}
                ile paylaşılmasını kabul ediyorum.
              </span>
            </label>
            <Link
              href="/legal/kvkk"
              style={{
                marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, color: c.gold, fontWeight: 600,
                textDecoration: 'none', paddingLeft: 28,
              }}
            >
              <Info size={11} />
              Aydınlatma metnini oku
            </Link>
          </div>
        </div>
      )}

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

      {/* ── 7. Sticky CTA — always a single button ── */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: `calc(64px + env(safe-area-inset-bottom, 20px))`,
          zIndex: 90,
          background:
            `linear-gradient(180deg, ${c.ink900}00 0%, ${c.ink900}F2 30%)`,
          backdropFilter: 'blur(12px)',
          padding: '16px 16px 12px',
        }}
      >
        {isCompleted ? (
          <button
            disabled
            style={{
              width: '100%', background: '#22543D', color: '#86EFAC',
              border: 'none', borderRadius: 16, padding: '16px 20px',
              fontSize: 16, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'default', opacity: 0.8,
            }}
          >
            <Check size={20} />
            Tamamlandı · +{mission.karma} Karma
          </button>
        ) : isTaken ? (
          <button
            onClick={() => router.push(`/dashboard/missions/${mission.id}/complete`)}
            style={{
              width: '100%', background: '#16A34A', color: '#fff',
              border: 'none', borderRadius: 16, padding: '16px 20px',
              fontSize: 16, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer',
            }}
          >
            Tamamladım
            <ArrowRight size={20} />
          </button>
        ) : (() => {
          // ADR-012 Yol D: Public için hafif KVKK gerekir, members_only için page.tsx
          // zaten requires_membership state'e yönlendiriyor — bu client render olmuyor.
          // Yani burada takılan tek senaryo public mission + üye olmayan.
          const needsKvkk = needsPublicKvkk && !publicKvkkChecked
          const enabled = !loading && !needsKvkk
          return (
            <button
              onClick={handleTakeMission}
              disabled={!enabled}
              style={{
                width: '100%',
                background: enabled ? c.gold : c.ink600,
                color: enabled ? '#24201B' : c.ink300,
                border: 'none', borderRadius: 16,
                padding: '16px 20px', fontSize: 16, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: enabled ? 'pointer' : 'not-allowed',
                opacity: loading ? 0.7 : 1,
                transition: 'all 220ms cubic-bezier(.2,.8,.2,1)',
                boxShadow: enabled ? '0 4px 16px rgba(0,0,0,.12)' : 'none',
              }}
            >
              {loading
                ? 'Göreve Alınıyor...'
                : needsKvkk
                  ? 'Önce onayı ver'
                  : 'Bu göreve katıl'}
              {!loading && !needsKvkk && <ArrowRight size={20} />}
            </button>
          )
        })()}
      </div>
    </div>
  )
}
