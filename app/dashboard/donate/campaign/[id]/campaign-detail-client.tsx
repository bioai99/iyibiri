'use client'

// Vol-59 Campaign Detail Client — kampanyaya özel hikaye + ilerleme + tek-seferlik CTA.
//
// Sayfa akışı:
//   1. Hero (cover image + days_left badge + cause chip + title + summary)
//   2. NGO lockup (logo + name + tagline)
//   3. Progress card (raised / goal + supporter count + güncel oran)
//   4. Hikaye (description) + impact bullets (auto-derived)
//   5. Sticky bottom CTA — "Bu kampanyaya bağışla" → tek seferlik flow
//
// Premium UX:
// - Animate-on-scroll (framer-motion)
// - Parallax cover (yumuşak)
// - Progress bar fill animasyonu
// - NGO genel sayfasından farklı görsel kimlik (gold accent + cause color)

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calendar, Users, Target, Share2 } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { getCauseLabel } from '@/lib/labels'
import type { CampaignWithNGO } from '@/lib/supabase/types'

interface Props {
  campaign: CampaignWithNGO
}

const TR_LIRA = (n: number) =>
  n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })

export function CampaignDetailClient({ campaign }: Props) {
  const { colors: c } = useTheme()
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
  const coverY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const coverScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  // Bağış flow path (?lock=once → toggle gizli)
  const giveHref = ngo?.id
    ? `/dashboard/donate/${ngo.id}/give?campaign=${campaign.id}&lock=once`
    : '#'

  // Heuristic impact bullets (kampanya başlığından + tutar/destekçi sayısından)
  const impactItems = deriveImpactBullets(campaign.title, raised, campaign.supporter_count)

  return (
    <div style={{ minHeight: '100dvh', background: c.ink900, color: c.cream, paddingBottom: 140 }}>
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
          {/* Bottom scrim */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(15,11,8,0.10) 0%, rgba(15,11,8,0.50) 50%, rgba(15,11,8,0.95) 100%)',
            }}
          />
        </motion.div>

        {/* Top bar — back + share */}
        <div
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 20px) + 12px)',
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          <Link
            href="/dashboard/donate"
            aria-label="Bağışa dön"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(15,11,8,0.55)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: c.cream,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <button
            type="button"
            aria-label="Kampanyayı paylaş"
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({ title: campaign.title, url: window.location.href }).catch(() => {})
              }
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(15,11,8,0.55)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              color: c.cream,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Share2 size={16} />
          </button>
        </div>

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
                color: c.ink900,
                textTransform: 'uppercase',
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
                  background: `${ngoColor}33`,
                  border: `1px solid ${ngoColor}66`,
                  color: ngoColor,
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
                  background: 'rgba(15,11,8,0.65)',
                  backdropFilter: 'blur(6px)',
                  color: c.gold,
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
              fontWeight: 500,
              letterSpacing: '-0.025em',
              lineHeight: 1.12,
              color: c.cream,
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

      {/* ─────────────── PROGRESS CARD ─────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        style={{
          margin: '14px 16px 0',
          padding: '20px 18px',
          background: `linear-gradient(135deg, ${c.goldSoft} 0%, ${c.ink800} 100%)`,
          border: `1px solid ${c.goldLine}`,
          borderRadius: 18,
        }}
      >
        {goal > 0 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontSize: 11, color: c.ink400, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Toplanan
              </div>
              <div style={{ fontSize: 11, color: c.ink400 }}>%{pct}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "'Fraunces', ui-serif, serif",
                  fontSize: 30,
                  fontWeight: 500,
                  color: c.cream,
                  letterSpacing: '-0.02em',
                }}
              >
                {TR_LIRA(raised)}
              </span>
              <span style={{ fontSize: 13, color: c.ink400 }}>
                / {TR_LIRA(goal)} hedef
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: c.ink700,
                overflow: 'hidden',
                marginBottom: 14,
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${c.gold}, #F4D98A)`,
                  borderRadius: 999,
                  boxShadow: `0 0 12px ${c.gold}55`,
                }}
              />
            </div>
          </>
        ) : (
          <div style={{ marginBottom: 12, fontSize: 14, color: c.cream }}>
            Bu kampanya destek topluyor.
          </div>
        )}

        {/* 3 mini-stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <MiniStat
            icon={<Users size={14} />}
            label="Destekçi"
            value={campaign.supporter_count.toLocaleString('tr-TR')}
            color={c.cream}
          />
          {goal > 0 && (
            <MiniStat
              icon={<Target size={14} />}
              label="Hedef"
              value={TR_LIRA(goal)}
              color={c.cream}
            />
          )}
          {daysLeft !== null && (
            <MiniStat
              icon={<Calendar size={14} />}
              label="Süre"
              value={daysLeft === 0 ? 'Son gün' : `${daysLeft} gün`}
              color={daysLeft <= 7 ? c.gold : c.cream}
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

      {/* ─────────────── ETKİ ─────────────── */}
      {impactItems.length > 0 && (
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
              marginBottom: 12,
            }}
          >
            Senin desteğinle
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {impactItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
                style={{
                  padding: '13px 16px',
                  background: c.ink800,
                  border: `1px solid ${c.ink600}`,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: `${c.gold}1F`,
                    color: c.gold,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: "'Fraunces', ui-serif, serif",
                    flexShrink: 0,
                  }}
                  aria-hidden
                >
                  {item.amount}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.cream, lineHeight: 1.25 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: c.ink400, marginTop: 2 }}>{item.subtitle}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ─────────────── ŞEFFAFLIK NOTU ─────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        style={{ padding: '32px 20px 0' }}
      >
        <div
          style={{
            padding: '14px 16px',
            background: c.ink800,
            border: `1px dashed ${c.ink600}`,
            borderRadius: 12,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: c.gold,
              padding: '3px 7px',
              borderRadius: 5,
              background: `${c.gold}1F`,
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            ŞEFFAF
          </span>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: c.ink300 }}>
            Bağışın <b style={{ color: c.cream }}>%100&apos;ü</b> doğrudan{' '}
            <b style={{ color: c.cream }}>{ngoShort}</b>&apos;nın hesabına aktarılır.
            iyibiri komisyon almaz.
          </p>
        </div>
      </motion.section>

      {/* ─────────────── STICKY BOTTOM CTA ─────────────── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 16px))',
          background: `${c.ink900}F0`,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderTop: `1px solid ${c.ink700}`,
          zIndex: 50,
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
            padding: '15px 20px',
            background: c.gold,
            color: c.ink900,
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: `0 8px 24px ${c.gold}55`,
            transition: 'transform 200ms',
          }}
        >
          Bu kampanyaya bağışla
          <ArrowRight size={16} />
        </Link>
        <div
          style={{
            textAlign: 'center',
            fontSize: 10,
            color: c.ink400,
            marginTop: 8,
            letterSpacing: '0.06em',
          }}
        >
          Tek seferlik bağış &middot; Vergi indirimli (uygunluğa göre)
        </div>
      </div>
    </div>
  )
}

/* ─────────────── helpers ─────────────── */

function MiniStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div
      style={{
        padding: '10px 12px',
        borderRadius: 12,
        background: 'rgba(15,11,8,0.30)',
        border: '1px solid rgba(232,194,104,0.18)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#E8C268', marginBottom: 4 }}>
        {icon}
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: "'Fraunces', ui-serif, serif", fontSize: 16, fontWeight: 500, color, letterSpacing: '-0.01em' }}>
        {value}
      </div>
    </div>
  )
}

/**
 * Kampanya başlığı + tutar + destekçi sayısından heuristik impact bullets üret.
 * "100.000 fidan" başlığı varsa: "X fidan toplandı" gibi.
 * Generic fallback: "X destekçi", "X aile/ev", "Y çocuk" gibi.
 */
function deriveImpactBullets(
  title: string,
  raised: number,
  supporterCount: number,
): { amount: string; label: string; subtitle: string }[] {
  const t = title.toLowerCase()
  const items: { amount: string; label: string; subtitle: string }[] = []

  // Fidan/ağaç senaryosu
  if (t.includes('fidan') || t.includes('ağaç')) {
    const fidanPerTl = 0.4 // 1 fidan ≈ 2.5 TL
    const fidan = Math.floor(raised * fidanPerTl)
    if (fidan > 0) {
      items.push({
        amount: fidan.toLocaleString('tr-TR'),
        label: 'fidan toprakla buluştu',
        subtitle: 'Karbon tutucu, hayata umut katan ağaç',
      })
    }
  }

  // Mama/hayvan senaryosu
  if (t.includes('mama') || t.includes('hayvan') || t.includes('barınak')) {
    const ogun = Math.floor(raised / 8) // 8 TL ≈ 1 öğün
    if (ogun > 0) {
      items.push({
        amount: ogun.toLocaleString('tr-TR'),
        label: 'sokak hayvanı öğünü',
        subtitle: 'Düzenli mama dağıtımı ile',
      })
    }
  }

  // Eğitim/burs senaryosu
  if (t.includes('burs') || t.includes('eğitim') || t.includes('öğrenci') || t.includes('çocuk')) {
    const ay = Math.floor(raised / 750) // 750 TL ≈ 1 öğrenci 1 ay
    if (ay > 0) {
      items.push({
        amount: ay.toLocaleString('tr-TR'),
        label: 'öğrenci-ay desteklendi',
        subtitle: 'Mentörlük, kitap ve barınma masrafı',
      })
    }
  }

  // Kan/sağlık senaryosu
  if (t.includes('kan') || t.includes('sağlık') || t.includes('hasta') || t.includes('lösev') || t.includes('lösemi')) {
    const aile = Math.floor(raised / 1200) // 1200 TL ≈ 1 aile 1 ay
    if (aile > 0) {
      items.push({
        amount: aile.toLocaleString('tr-TR'),
        label: 'aileye tedavi desteği',
        subtitle: 'İlaç, ulaşım ve barınma giderleri',
      })
    }
  }

  // Afet/deprem senaryosu
  if (t.includes('afet') || t.includes('deprem') || t.includes('riskli')) {
    const kisi = Math.floor(raised / 250) // 250 TL ≈ 1 kişi acil destek paketi
    if (kisi > 0) {
      items.push({
        amount: kisi.toLocaleString('tr-TR'),
        label: 'kişiye acil destek paketi',
        subtitle: 'Yiyecek, su, hijyen, battaniye',
      })
    }
  }

  // Generic destekçi sayısı
  if (supporterCount > 0) {
    items.push({
      amount: supporterCount.toLocaleString('tr-TR'),
      label: 'destekçi yanında',
      subtitle: 'Sen de aralarına katıl',
    })
  }

  return items.slice(0, 4)
}
