// components/membership/kvkk-checkbox.tsx
//
// KVKK çift onay + üyelik sözleşmesi checkbox kümesi.
// UI Spec 2026-04-24 Bölüm 7 — KVKK çifte onay enforcement.
// UX Audit Kritik 4 (H7): "Yasal metin büyük ve gizli, kullanıcı ne onayladığını bilmiyor".
//
// Yasal gereksinimler:
// - Veri paylaşımı onayı ayrı (KVKK m.5-6)
// - Üyelik sözleşmesi onayı ayrı
// - "Paylaşılacak bilgiler" açık listesi (transparency)
// - 14 gün cayma hakkı bildirimi (Tüketici Kanunu m.48)
//
// Skill: mobile-app-polish-standards Bölüm 6 "Haptic feedback" — check haptic notification.
// Skill: ux-heuristics İyiBiri H7 "Yasal metin şeffaflığı".

'use client'

import { useTheme } from '@/lib/theme'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, ExternalLink, Info } from 'lucide-react'
import type { ReactNode } from 'react'

/* ─────────────────────────────────────────────────────────────
 *  KvkkCheckbox — tek satır checkbox + inline label
 * ───────────────────────────────────────────────────────────── */

interface KvkkCheckboxProps {
  checked: boolean
  onChange: (next: boolean) => void
  /** Kısa label — bold inline rendering destekler (ör. "<strong>TEMA</strong> ile paylaşımı kabul ediyorum") */
  children: ReactNode
  /** Opsiyonel: "Detaylar için…" linki */
  detailsUrl?: string
  detailsLabel?: string
  /** Form validation — kırmızı outline */
  error?: boolean
  id?: string
}

export function KvkkCheckbox({
  checked,
  onChange,
  children,
  detailsUrl,
  detailsLabel = 'Aydınlatma metnini oku',
  error = false,
  id,
}: KvkkCheckboxProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const handleToggle = () => {
    onChange(!checked)
    // Haptic feedback — Capacitor varsa
    if (typeof window !== 'undefined' && 'navigator' in window) {
      try {
        // @ts-expect-error — Capacitor dynamic import hazır değilse sessizce geç
        window.Capacitor?.Plugins?.Haptics?.notification({ type: 'SUCCESS' })
      } catch {
        /* no-op */
      }
    }
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-2.5"
      >
        <motion.div
          whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
          onClick={handleToggle}
          role="checkbox"
          aria-checked={checked}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              handleToggle()
            }
          }}
          className="mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[7px]"
          style={{
            background: checked ? c.gold : 'transparent',
            border: `1.5px solid ${
              error ? c.danger : checked ? c.gold : c.ink500
            }`,
            transition: 'all 180ms ease-out',
          }}
        >
          {checked && <Check size={13} color={c.ink} strokeWidth={3} />}
        </motion.div>
        <span
          className="flex-1 text-[13px] leading-[1.5]"
          style={{ color: c.ink200 }}
        >
          {children}
        </span>
      </label>

      {detailsUrl && (
        <a
          href={detailsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-[34px] mt-1 inline-flex items-center gap-1 text-[11px] font-medium underline-offset-2 hover:underline"
          style={{ color: c.gold }}
        >
          {detailsLabel}
          <ExternalLink size={10} />
        </a>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  DataShareList — "Paylaşılacak bilgiler" panel
 * ───────────────────────────────────────────────────────────── */

interface DataShareListProps {
  /** Zorunlu paylaşım alanları — ad soyad, e-posta, şehir vs. */
  fields: string[]
  /** İsteğe bağlı başlık override */
  title?: string
}

export function DataShareList({
  fields,
  title = 'Paylaşılacak bilgilerin',
}: DataShareListProps) {
  const { colors: c } = useTheme()

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
      }}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <Info size={12} color={c.gold} />
        <p
          className="text-[11px] font-semibold uppercase"
          style={{ color: c.ink300, letterSpacing: '0.06em' }}
        >
          {title}
        </p>
      </div>
      <ul className="flex flex-col gap-1">
        {fields.map((field, idx) => (
          <li
            key={`${field}-${idx}`}
            className="flex items-center gap-2 text-[13px]"
            style={{ color: c.ink200 }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: 4, height: 4, background: c.gold }}
              aria-hidden="true"
            />
            {field}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  CaymaBanner — 14 gün cayma hakkı bildirimi
 * ───────────────────────────────────────────────────────────── */

export function CaymaBanner() {
  const { colors: c } = useTheme()
  return (
    <div
      className="flex items-start gap-2 rounded-xl px-3 py-2"
      style={{
        background: c.goldSoft,
        border: `1px solid ${c.goldLine}`,
      }}
      role="note"
    >
      <Info size={14} color={c.gold} style={{ marginTop: 2, flexShrink: 0 }} />
      <p className="text-[12px] leading-[1.5]" style={{ color: c.ink200 }}>
        <span className="font-semibold" style={{ color: c.cream }}>
          14 gün cayma hakkı
        </span>
        {' — '}
        İstediğin zaman üyelikten çıkabilir, cayma süresinde ödemeni geri
        alabilirsin.
      </p>
    </div>
  )
}
