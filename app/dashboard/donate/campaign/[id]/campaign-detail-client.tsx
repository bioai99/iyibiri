'use client'

// Vol-59 Campaign Detail Client (v2 — Vol-59.1 UI critique iterasyonu).
//
// Vol-59.1 değişiklikler:
//   - Reusable PageHeroBar (geri + paylaş) — IconButtonDS theme="dark", her
//     mode'da cream glass button. Her sayfa için yeniden yazılmıyor artık.
//   - Hero scrim güçlendirildi (0.55 → ortada hala okunur kalıyor) + title
//     text-shadow ile contrast garantili.
//   - Progress card light-mode tema-aware refactor: gold→ink8 gradient yerine
//     temiz tek katman (goldSoft border + cream bg), tipografi sade.
//   - Mini-stat'lar tema-aware token kullanıyor (rgba hardcoded yerine).
//   - "Senin desteğinle" bölümü kaldırıldı — kullanıcı geri bildirimi: copy
//     ve görsel hazır değildi, ileride doğru içerikle yeniden tasarlanır.
//   - Sticky CTA z-index 200 + bottom 90px (BottomNav üstünde, görünür).
//   - Şeffaflık notu: "şimdilik kullanmayalım" (Vol-59.1) — kaldırıldı.

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Calendar, Users, Target } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { getCauseLabel } from '@/lib/labels'
import { PageHeroBar } from '@/components/ui/page-hero-bar'
import type { CampaignWithNGO } from '@/lib/supabase/types'

interface Props {
  campaign: CampaignWithNGO
}

const TR_LIRA = (n: number) =>
  n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })

export function CampaignDetailClient({ campaign }: Props) {
  const { colors: c, mode } = useTheme()
  const isLight = mode === 'light'
  const ngo = campaign.ngos
  const ngoColor = ngo?.color_accent || c.gold
  const ngoShort = ngo?.short_name || ngo?.name || 'STK'
  const cover = campaign.image_url || ngo?.cover_image_url || null
  const causeLabel = campaign.cause ? getCauseLabel(campaign.cause) : null

  // Days left
  let daysLeft: number | null = null
  if (campaign.end_date) {
    const diff = new Date(campaign.end_date).getTime() - Date.now()
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  // Progress
  const goal = campaign.goal_amount ?? 0
  const raised = campaign.raised_amount ?? 0
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0

  // Hero parallax
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const coverY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const coverScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  // Bağış flow path (?lock=once → toggle gizli)
  const giveHref = ngo?.id
    ? `/dashboard/donate/${ngo.id}/give?campaign=${campaign.id}&lock=once`
    : '#'

  // Share handler
  function handleShare() {
    if (typeof navigator === 'undefined' || !navigator.share) return
    navigator.share({ title: campaign.title, url: window.location.href }).catch(() => {})
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: c.ink900,
        color: c.cream,
        // BottomNav (≈90px) + sticky CTA (≈70px) için yeterli alt boşluk
        paddingBottom: 200,
      }}
    >
      {/* ─────────────── HERO ─────────────── */}
      <section ref={heroRef} style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Parallax cover */}
        <motion.div
          style={{ y: coverY, scale: coverScale, position: 'relative', height: 360, width: '100%' }}
        >
          {cover ? (
            <Image
              src={cover}
              alt={campaign.title}
              fill
              sizes="100vw"
              priority
              quality={80}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${ngoColor}, ${ngoColor}66)` }} />
          )}
          {/* Vol-59.1: Daha agresif scrim — title okunabilir olmalı.
              0.10 → 0.55 (orta) → 0.92 (alt) gradient + ekstra alt bölüm
              koyu blok ile contrast garantili. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(15,11,8,0.25) 0%, rgba(15,11,8,0.55) 50%, rgba(15,11,8,0.95) 100%)',
            }}
          />
          {/* Vol-59.1: Title bölgesinde ekstra koyu band (60% alt) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '45%',
              background:
                'linear-gradient(180deg, transparent 0%, rgba(15,11,8,0.85) 100%)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        {/* Vol-59.1: Reusable PageHeroBar — IconButtonDS theme="dark" her zaman cream glass */}
        <PageHeroBar
          backHref="/dashboard/donate"
          backAriaLabel="Bağışa dön"
          onShare={handleShare}
          shareAriaLabel="Kampanyayı paylaş"
          theme="dark"
        />

        {/* Title overlay */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 24,
            zIndex: 5,
          }}
        >
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.2em',
                padding: '4px 9px',
                borderRadius: 5,
                background: c.gold,
                color: '#1A1612',
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
              }}
            >
              KAMPANYA
            </span>
            {causeLabel && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  padding: '4px 9px',
                  borderRadius: 5,
                  background: 'rgba(15,11,8,0.65)',
                  border: `1px solid ${ngoColor}88`,
                  color: '#F4EEDF',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {causeLabel}
              </span>
            )}
            {daysLeft !== null && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  padding: '4px 9px',
                  borderRadius: 5,
                  background: 'rgba(15,11,8,0.75)',
                  backdropFilter: 'blur(6px)',
                  color: '#E8C268',
                  textTransform: 'uppercase',
                }}
              >
                {daysLeft === 0 ? 'Son gün' : `${daysLeft} gün kaldı`}
              </span>
            )}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              margin: 0,
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.025em',
              lineHeight: 1.12,
              // Vol-59.1: hardcoded cream — scrim üstü, app mode bağımsız
              color: '#F4EEDF',
              // Vol-59.1: title text-shadow contrast garantisi
              textShadow:
                '0 2px 12px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            {campaign.title}
          </motion.h1>
        </div>
      </section>

      {/* ─────────────── NGO LOCKUP ─────────────── */}
      {ngo && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            margin: '20px 16px 0',
            padding: '14px 16px',
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: ngo.logo_url ? '#fff' : `linear-gradient(135deg, ${ngoColor}, ${ngoColor}88)`,
              border: ngo.logo_url ? `1px solid ${ngoColor}33` : 'none',
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {ngo.logo_url ? (
              <Image
                src={ngo.logo_url}
                alt={ngo.name ?? ''}
                fill
                sizes="44px"
                style={{ objectFit: 'contain', padding: 5 }}
                quality={85}
              />
            ) : (
              ngoShort[0]
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 10, color: c.ink400, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 2 }}>
              Yürüten kurum
            </div>
            <Link
              href={`/dashboard/donate/${ngo.id}`}
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: c.cream,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {ngo.name}
              <ArrowRight size={13} color={c.gold} />
            </Link>
          </div>
        </motion.section>
      )}

      {/* ─────────────── PROGRESS CARD (Vol-59.1 sıfırdan refactor) ───────────────
          Önceden: linear-gradient(c.goldSoft → c.ink800) light mode'da cream→cream
          karışık görünüyordu. Şimdi tek katman ink800 + gold accent border, sade
          tipografi ve hierarchy: BIG raised + small goal subtitle + progress bar
          + 3 mini-stat. Light mode'da ink800 cream warmth'e bağlı, contrast OK. */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        style={{
          margin: '14px 16px 0',
          padding: '20px 18px',
          background: c.ink800,
          border: `1px solid ${c.goldLine}`,
          borderRadius: 18,
          // Light mode'da kart gold halo — soft glow
          boxShadow: isLight
            ? `0 4px 20px -8px ${c.gold}33, 0 1px 3px rgba(26,22,18,0.06)`
            : `0 4px 24px -10px rgba(0,0,0,0.45)`,
        }}
      >
        {goal > 0 ? (
          <>
            {/* Eyebrow + percent badge */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: c.gold,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                Toplanan
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.gold,
                  padding: '3px 9px',
                  borderRadius: 999,
                  background: c.goldSoft,
                  border: `1px solid ${c.goldLine}`,
                }}
              >
                %{pct}
              </span>
            </div>
            {/* BIG raised amount */}
            <div
              style={{
                fontFamily: "'Fraunces', ui-serif, serif",
                fontSize: 32,
                fontWeight: 600,
                color: c.cream,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              {TR_LIRA(raised)}
            </div>
            {/* Goal subtitle */}
            <div style={{ fontSize: 12, color: c.ink400, marginBottom: 14 }}>
              {TR_LIRA(goal)} hedefin{' '}
              <span style={{ color: c.cream, fontWeight: 600 }}>%{pct}</span>&apos;ine ulaşıldı
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: isLight
                  ? 'rgba(26,22,18,0.08)'
                  : 'rgba(244,238,223,0.10)',
                overflow: 'hidden',
                marginBottom: 18,
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${c.gold}, #F4D98A)`,
                  borderRadius: 999,
                  boxShadow: `0 0 10px ${c.gold}55`,
                }}
              />
            </div>
          </>
        ) : (
          <div style={{ marginBottom: 14, fontSize: 14, color: c.cream }}>
            Bu kampanya destek topluyor.
          </div>
        )}

        {/* 3 mini-stat — uniform tipografi, theme-aware bg */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <MiniStat
            icon={<Users size={13} />}
            label="Destekçi"
            value={campaign.supporter_count.toLocaleString('tr-TR')}
            c={c}
            isLight={isLight}
          />
          {goal > 0 && (
            <MiniStat
              icon={<Target size={13} />}
              label="Hedef"
              value={TR_LIRA(goal)}
              c={c}
              isLight={isLight}
            />
          )}
          {daysLeft !== null && (
            <MiniStat
              icon={<Calendar size={13} />}
              label="Süre"
              value={daysLeft === 0 ? 'Son gün' : `${daysLeft} gün`}
              c={c}
              isLight={isLight}
              accent={daysLeft <= 7}
            />
          )}
        </div>
      </motion.section>

      {/* ─────────────── HİKAYE ─────────────── */}
      {(campaign.summary || campaign.description) && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{ padding: '32px 20px 0' }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: c.gold,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Amacımız
          </div>
          {campaign.summary && (
            <p
              style={{
                fontFamily: "'Fraunces', ui-serif, serif",
                fontSize: 19,
                fontStyle: 'italic',
                lineHeight: 1.45,
                color: c.cream,
                margin: '0 0 16px',
                letterSpacing: '-0.01em',
              }}
            >
              {campaign.summary}
            </p>
          )}
          {campaign.description && (
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.65,
                color: c.ink300,
                whiteSpace: 'pre-line',
              }}
            >
              {campaign.description}
            </div>
          )}
        </motion.section>
      )}

      {/* Vol-59.1: "Senin desteğinle" + "Şeffaflık notu" — KALDIRILDI.
          Kullanıcı geri bildirimi: copy ve görsel hazır değildi, sıfırdan
          tasarlanması gerek. Doğru content + UI critique sonrası eklenecek. */}

      {/* ─────────────── STICKY BOTTOM CTA (Vol-59.1: BottomNav üstüne offset) ─────────────── */}
      <div
        style={{
          position: 'fixed',
          // Vol-59.1: BottomNav (~78-90px + safe-area) üstüne otur, görünür kal.
          bottom: 'calc(78px + env(safe-area-inset-bottom, 18px))',
          left: 0,
          right: 0,
          padding: '12px 16px',
          background: `${c.ink900}EE`,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderTop: `1px solid ${c.ink700}`,
          // Vol-59.1: BottomNav z-index 100 — CTA üstte (101) ki kart bordürü
          // navbar bordüründen önce hissedilsin.
          zIndex: 101,
        }}
      >
        <Link
          href={giveHref}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '14px 20px',
            background: c.gold,
            color: '#1A1612',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: `0 8px 22px ${c.gold}55`,
            transition: 'transform 200ms',
          }}
        >
          Bu kampanyaya bağışla
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

/* ─────────────── helpers ─────────────── */

function MiniStat({
  icon,
  label,
  value,
  c,
  isLight,
  accent = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  c: ReturnType<typeof useTheme>['colors']
  isLight: boolean
  accent?: boolean
}) {
  return (
    <div
      style={{
        padding: '10px 11px',
        borderRadius: 12,
        // Vol-59.1: theme-aware bg — light mode'da subtle cream tint, dark mode'da koyu cream tint
        background: isLight
          ? 'rgba(255,255,255,0.55)'
          : 'rgba(244,238,223,0.04)',
        border: `1px solid ${isLight ? 'rgba(26,22,18,0.06)' : 'rgba(244,238,223,0.10)'}`,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: c.gold,
          marginBottom: 5,
        }}
      >
        {icon}
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Fraunces', ui-serif, serif",
          fontSize: 16,
          fontWeight: 600,
          color: accent ? c.gold : c.cream,
          letterSpacing: '-0.015em',
          lineHeight: 1.15,
          // tabular-nums numbers için TL formatı tutarlı genişlik
          fontVariantNumeric: 'tabular-nums',
          // overflow için
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </div>
    </div>
  )
}
