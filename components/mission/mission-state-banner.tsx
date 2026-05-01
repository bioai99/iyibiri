// components/mission/mission-state-banner.tsx
//
// Full / Expired / Cancelled / FailedVerification state'leri için banner component.
// UI Spec 2026-04-24 Bölüm 3.2 / 3.3 / 3.8 / 3.9.
// UX audit K5 — 5 eksik state'in 4'ünü kapsar (5. olan re-access completed içinde).
//
// Variants:
// - full                 → Lock + clay accent, "Kontenjan doldu"
// - expired              → Calendar + ink500, "Tarih geçti"
// - cancelled            → Ban + ink400, admin sebep opsiyonel
// - failed_verification  → AlertTriangle + clay, admin_feedback gösterilir
//
// Ortak anatomi: icon + başlık + açıklama + opsiyonel CTA + alt link
//
// Faz 1 (2026-04-26 perf-eng): hero photo next/image, lazy load + WebP/AVIF.

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Lock,
  CalendarOff,
  Ban,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'

/* ─────────────────────────────────────────────────────────────
 *  Types
 * ───────────────────────────────────────────────────────────── */

type BannerVariant = 'full' | 'expired' | 'cancelled' | 'failed_verification'

interface MissionStateBannerProps {
  variant: BannerVariant
  /** Photo URL — arka planda muted görünür (hero context) */
  photoUrl?: string | null
  /** Ana başlık — her variant default TR copy var, override edilebilir */
  title?: string
  /** Body metin — mission-specific */
  description?: string
  /** Admin feedback (cancelled / failed_verification için) */
  adminFeedback?: string | null
  /** Benzer görevler için kategori — link target */
  similarMissionsCategory?: string | null
  /** STK iletişim URL (failed_verification için) */
  helpContactUrl?: string | null
  /** NGO short name — CTA etiketi */
  ngoShortName?: string
  /** Retry CTA tetikleyici — failed_verification için */
  onRetry?: () => void
}

/* ─────────────────────────────────────────────────────────────
 *  Ana component
 * ───────────────────────────────────────────────────────────── */

export function MissionStateBanner({
  variant,
  photoUrl,
  title,
  description,
  adminFeedback,
  similarMissionsCategory,
  helpContactUrl,
  ngoShortName,
  onRetry,
}: MissionStateBannerProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const config = getVariantConfig(variant, c)

  return (
    <div
      className="flex min-h-[100dvh] flex-col"
      style={{ background: c.ink900, color: c.cream }}
    >
      {/* Hero photo (muted) */}
      {photoUrl && (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={photoUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
            priority
            quality={70}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${c.ink900}B3 0%, ${c.ink900}F2 70%, ${c.ink900} 100%)`,
            }}
          />
        </div>
      )}

      {/* Content */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
        style={{
          marginTop: photoUrl ? -80 : 0,
          position: photoUrl ? 'relative' : undefined,
          zIndex: 1,
        }}
      >
        {/* Icon + accent circle */}
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: config.iconBg,
            border: `1.5px solid ${config.accent}`,
          }}
        >
          <config.Icon size={24} color={config.accent} />
        </div>

        {/* Eyebrow */}
        <p
          className="text-[11px] font-bold uppercase"
          style={{ color: config.accent, letterSpacing: '0.16em' }}
        >
          {config.eyebrow}
        </p>

        {/* Title */}
        <h1
          className="font-display text-[24px] font-medium leading-tight"
          style={{
            color: c.cream,
            letterSpacing: '-0.025em',
            maxWidth: 320,
          }}
        >
          {title ?? config.defaultTitle}
        </h1>

        {/* Description */}
        {(description || config.defaultDescription) && (
          <p
            className="max-w-[320px] text-[14px] leading-[1.55]"
            style={{ color: c.ink200 }}
          >
            {description ?? config.defaultDescription}
          </p>
        )}

        {/* Admin feedback card (cancelled + failed_verification) */}
        {adminFeedback && (
          <div
            className="w-full max-w-[340px] rounded-xl px-4 py-3 text-left"
            style={{
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
            }}
          >
            <p
              className="mb-1 text-[11px] font-semibold uppercase"
              style={{ color: c.ink300, letterSpacing: '0.08em' }}
            >
              {variant === 'failed_verification' ? 'Değerlendirme notu' : 'Sebep'}
            </p>
            <p
              className="text-[13px] leading-[1.5] italic"
              style={{ color: c.cream }}
            >
              &ldquo;{adminFeedback}&rdquo;
            </p>
          </div>
        )}

        {/* Primary CTA'lar */}
        <div className="mt-4 flex w-full max-w-[340px] flex-col gap-2">
          {/* Retry — failed_verification için */}
          {variant === 'failed_verification' && onRetry && (
            <motion.button
              type="button"
              onClick={onRetry}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl font-bold"
              style={{
                background: c.gold,
                color: c.ink,
                fontSize: 14,
                boxShadow: '0 2px 8px rgba(0,0,0,.08)',
              }}
            >
              Yeniden gönder
              <ArrowRight size={16} />
            </motion.button>
          )}

          {/* Benzer görevler — full, expired, cancelled için */}
          {variant !== 'failed_verification' && (
            <Link
              href={
                similarMissionsCategory
                  ? `/dashboard/missions?category=${encodeURIComponent(similarMissionsCategory)}`
                  : '/dashboard/missions'
              }
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl font-bold"
              style={{
                background: c.gold,
                color: c.ink,
                fontSize: 14,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,.08)',
              }}
            >
              Benzer görevler
              <ArrowRight size={16} />
            </Link>
          )}

          {/* Secondary: STK iletişim */}
          {helpContactUrl && (
            <a
              href={helpContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[44px] items-center justify-center gap-2 rounded-xl font-semibold"
              style={{
                background: 'transparent',
                color: c.cream,
                border: `1.5px solid ${c.ink600}`,
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={14} />
              {ngoShortName ? `${ngoShortName} ile iletişim` : 'STK ile iletişim'}
            </a>
          )}

          {/* Dashboard fallback */}
          <Link
            href="/dashboard"
            className="flex h-[40px] items-center justify-center font-medium"
            style={{
              background: 'transparent',
              color: c.ink300,
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            Dashboard&apos;a dön
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  Variant config
 * ───────────────────────────────────────────────────────────── */

interface VariantConfig {
  Icon: typeof Lock
  iconBg: string
  accent: string
  eyebrow: string
  defaultTitle: string
  defaultDescription: string
}

// Returned typed partial — colors object shape:
interface ThemeColors {
  clay: string
  claySoft: string
  ink400: string
  ink500: string
  ink600: string
  ink700: string
  danger: string
}

function getVariantConfig(
  variant: BannerVariant,
  c: ThemeColors,
): VariantConfig {
  switch (variant) {
    case 'full':
      return {
        Icon: Lock,
        iconBg: c.claySoft,
        accent: c.clay,
        eyebrow: 'KONTENJAN DOLDU',
        defaultTitle: 'Maalesef kontenjan dolu',
        defaultDescription:
          'Bu görev için başvurular kapandı — aynı kategoride benzer görevlere bakabilirsin.',
      }
    case 'expired':
      return {
        Icon: CalendarOff,
        iconBg: c.ink700,
        accent: c.ink400,
        eyebrow: 'TARİH GEÇTİ',
        defaultTitle: 'Bu görev tamamlandı',
        defaultDescription:
          'Görev tarihi geçmiş. Önümüzdeki haftalarda benzer etkinlikler olacak.',
      }
    case 'cancelled':
      return {
        Icon: Ban,
        iconBg: c.ink700,
        accent: c.ink400,
        eyebrow: 'İPTAL EDİLDİ',
        defaultTitle: 'Bu görev iptal edildi',
        defaultDescription:
          'STK görev planından vazgeçti. Benzer görevlere bakmak ister misin?',
      }
    case 'failed_verification':
      return {
        Icon: AlertTriangle,
        iconBg: c.claySoft,
        accent: c.clay,
        eyebrow: 'DOĞRULAMA TEKRAR',
        defaultTitle: 'Kanıtın tekrar gözden geçirildi',
        defaultDescription:
          'STK yetkilisi gönderdiğin kanıtı yeterli bulmadı. Yeniden göndererek Karma kazanabilirsin.',
      }
  }
}
