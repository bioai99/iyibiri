// components/ui/state/index.tsx
//
// Sistemik Loading / Empty / Error / Inline / Offline state library.
// P0 #4 — "Her sayfa kendi kırık halini tasarlıyor" sorunu çözümü.
//
// Tasarım ilkeleri (mobile-app-polish-standards Bölüm 8):
// - Dark tema default, useTheme() tek renk kaynağı
// - TR empathic copy — "yükleniyor" değil "biraz beklemeni istiyoruz"
// - Motion: prefers-reduced-motion respect
// - A11y: role="status" loading, role="alert" error, aria-live polite
// - Variant sistemi: variant="page" (full-height), "inline" (küçük), "card" (card içi)

'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Loader2,
  AlertCircle,
  WifiOff,
  Inbox,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'

/* ═════════════════════════════════════════════════════════════
 *  LoadingState
 * ═════════════════════════════════════════════════════════════ */

export type StateVariant = 'page' | 'inline' | 'card'

interface LoadingStateProps {
  /** TR empathic label — default "Yükleniyor…" */
  label?: string
  /** Layout context */
  variant?: StateVariant
  /** Minimum görünme süresi (ms) — flash önleme. Default 200ms. */
  minDuration?: number
}

export function LoadingState({
  label = 'Yükleniyor…',
  variant = 'page',
}: LoadingStateProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const sizeConfig = {
    page: { icon: 24, padding: '80px 24px', fontSize: 14 },
    inline: { icon: 16, padding: '12px', fontSize: 13 },
    card: { icon: 20, padding: '40px 24px', fontSize: 13 },
  }[variant]

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3"
      style={{
        padding: sizeConfig.padding,
        color: c.ink300,
      }}
    >
      <motion.span
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        aria-hidden="true"
      >
        <Loader2 size={sizeConfig.icon} color={c.gold} />
      </motion.span>
      <span
        style={{
          fontSize: sizeConfig.fontSize,
          color: c.ink300,
        }}
      >
        {label}
      </span>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  EmptyState (existing EmptyState pattern'i genişletilmiş)
 *  Not: components/ui/empty-state.tsx korunur (backward compat).
 *  Yeni pattern: `EmptyStateV2` — icon custom + secondary action destekli.
 * ═════════════════════════════════════════════════════════════ */

interface EmptyStateV2Props {
  title: string
  description?: string
  icon?: LucideIcon
  variant?: StateVariant
  primaryAction?: { label: string; href?: string; onClick?: () => void }
  secondaryAction?: { label: string; href?: string; onClick?: () => void }
}

export function EmptyStateV2({
  title,
  description,
  icon: Icon = Inbox,
  variant = 'page',
  primaryAction,
  secondaryAction,
}: EmptyStateV2Props) {
  const { colors: c } = useTheme()

  const sizeConfig = {
    page: { iconSize: 28, circle: 72, padding: '64px 24px', titleSize: 20 },
    inline: { iconSize: 18, circle: 44, padding: '24px 16px', titleSize: 15 },
    card: { iconSize: 22, circle: 56, padding: '40px 20px', titleSize: 16 },
  }[variant]

  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ padding: sizeConfig.padding }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: sizeConfig.circle,
          height: sizeConfig.circle,
          background: c.goldSoft,
          border: `1px solid ${c.goldLine}`,
          marginBottom: variant === 'inline' ? 10 : 18,
        }}
        aria-hidden="true"
      >
        <Icon size={sizeConfig.iconSize} color={c.gold} />
      </div>

      <h3
        className="font-display"
        style={{
          fontSize: sizeConfig.titleSize,
          fontWeight: 500,
          color: c.cream,
          margin: 0,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          className="mt-1.5 text-[14px] leading-[1.5]"
          style={{
            color: c.ink300,
            maxWidth: 280,
          }}
        >
          {description}
        </p>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {primaryAction && (
            <ActionButton
              {...primaryAction}
              variant="primary"
              c={c}
            />
          )}
          {secondaryAction && (
            <ActionButton
              {...secondaryAction}
              variant="secondary"
              c={c}
            />
          )}
        </div>
      )}
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  ErrorState
 *  TR empathic copy — "bir şeyler ters gitti" değil sebep + aksiyon.
 * ═════════════════════════════════════════════════════════════ */

interface ErrorStateProps {
  title?: string
  description?: string
  /** Specific TR error message — server'dan gelen ve kullanıcıya gösterilecek */
  error?: string
  /** Retry tetikleyici */
  onRetry?: () => void
  retryLabel?: string
  variant?: StateVariant
  /** Offline/network özel variant */
  isOffline?: boolean
}

export function ErrorState({
  title,
  description,
  error,
  onRetry,
  retryLabel = 'Tekrar dene',
  variant = 'page',
  isOffline = false,
}: ErrorStateProps) {
  const { colors: c } = useTheme()

  const Icon = isOffline ? WifiOff : AlertCircle

  const defaultTitle = isOffline
    ? 'İnternet bağlantın yok'
    : 'Bir şeyler ters gitti'

  const defaultDesc = isOffline
    ? 'Bağlantı geldiğinde otomatik yenilenecek.'
    : 'Sebep belirsiz — birazdan tekrar denersek muhtemelen çalışır.'

  const sizeConfig = {
    page: { iconSize: 28, circle: 72, padding: '64px 24px', titleSize: 20 },
    inline: { iconSize: 16, circle: 0, padding: '12px', titleSize: 14 },
    card: { iconSize: 22, circle: 56, padding: '40px 20px', titleSize: 16 },
  }[variant]

  // Inline variant — compact, circle yok
  if (variant === 'inline') {
    return (
      <div
        role="alert"
        className="flex items-start gap-2 rounded-xl px-3 py-2"
        style={{
          background: `${c.danger}1A`,
          border: `1px solid ${c.danger}40`,
        }}
      >
        <Icon size={14} color={c.danger} style={{ marginTop: 2, flexShrink: 0 }} />
        <div className="flex-1">
          <p className="text-[13px] leading-[1.4]" style={{ color: c.danger }}>
            {error ?? defaultTitle}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold underline-offset-2 hover:underline"
              style={{ color: c.danger }}
            >
              <RefreshCw size={10} />
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center text-center"
      style={{ padding: sizeConfig.padding }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: sizeConfig.circle,
          height: sizeConfig.circle,
          background: `${c.clay}1A`,
          border: `1px solid ${c.clay}40`,
          marginBottom: 18,
        }}
        aria-hidden="true"
      >
        <Icon size={sizeConfig.iconSize} color={c.clay} />
      </div>

      <h3
        className="font-display"
        style={{
          fontSize: sizeConfig.titleSize,
          fontWeight: 500,
          color: c.cream,
          margin: 0,
          letterSpacing: '-0.02em',
        }}
      >
        {title ?? defaultTitle}
      </h3>

      <p
        className="mt-2 text-[14px] leading-[1.5]"
        style={{
          color: c.ink300,
          maxWidth: 300,
        }}
      >
        {error ?? description ?? defaultDesc}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 font-semibold"
          style={{
            background: c.gold,
            color: c.ink,
            fontSize: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          }}
        >
          <RefreshCw size={14} />
          {retryLabel}
        </button>
      )}
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  OfflineState (convenience wrapper)
 * ═════════════════════════════════════════════════════════════ */

export function OfflineState({
  onRetry,
  variant = 'page',
}: {
  onRetry?: () => void
  variant?: StateVariant
}) {
  return <ErrorState isOffline onRetry={onRetry} variant={variant} />
}

/* ═════════════════════════════════════════════════════════════
 *  Internal — ActionButton
 * ═════════════════════════════════════════════════════════════ */

interface ActionButtonProps {
  label: string
  href?: string
  onClick?: () => void
  variant: 'primary' | 'secondary'
  c: { gold: string; ink: string; cream: string; ink600: string }
}

function ActionButton({
  label,
  href,
  onClick,
  variant,
  c,
}: ActionButtonProps) {
  const stylePrimary: React.CSSProperties = {
    background: c.gold,
    color: c.ink,
    fontSize: 14,
    fontWeight: 700,
    padding: '10px 18px',
    borderRadius: 12,
    border: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,.08)',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
  }
  const styleSecondary: React.CSSProperties = {
    background: 'transparent',
    color: c.cream,
    fontSize: 13,
    fontWeight: 600,
    padding: '9px 16px',
    borderRadius: 12,
    border: `1.5px solid ${c.ink600}`,
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
  }
  const style = variant === 'primary' ? stylePrimary : styleSecondary

  if (href) {
    return (
      <Link href={href} style={style}>
        {label}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} style={style}>
      {label}
    </button>
  )
}

/* ═════════════════════════════════════════════════════════════
 *  Layout helpers — AsyncBoundary
 *
 *  Async data + 3 state (loading / error / empty) tek wrapper'da.
 *  Server Component'ler direkt server error handling yapar — bu daha çok
 *  client fetch senaryolar için.
 * ═════════════════════════════════════════════════════════════ */

interface AsyncBoundaryProps<T> {
  /** Async data — null = loading, T[] veya T = data, 'error' = error */
  data: T | null | 'error'
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  empty?: {
    when: (d: T) => boolean
    title: string
    description?: string
    action?: { label: string; href: string }
  }
  children: (data: T) => ReactNode
}

export function AsyncBoundary<T>({
  data,
  isLoading,
  error,
  onRetry,
  empty,
  children,
}: AsyncBoundaryProps<T>) {
  if (isLoading || data === null) {
    return <LoadingState />
  }
  if (data === 'error' || error) {
    return <ErrorState error={error ?? undefined} onRetry={onRetry} />
  }
  if (empty && empty.when(data)) {
    return (
      <EmptyStateV2
        title={empty.title}
        description={empty.description}
        primaryAction={empty.action}
      />
    )
  }
  return <>{children(data)}</>
}
