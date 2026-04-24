// components/membership/tier-card.tsx
//
// NGO üyelik Adım 1: tier/seviye seçim kartı — parametric.
// UI Spec 2026-04-24 Bölüm 5 Tier variants (3 mode: age_tiered / monthly / donation_based).
// ADR-007 parametric fee schema → membership_fee_config jsonb.
//
// Variants:
// - age_tiered   → Öğrenci / Yetişkin / Kıdemli tiers (örn. TEMA)
// - monthly      → Tek tier, aylık recurring (örn. HAYTAP ₺50/ay)
// - donation_based → Min + önerilen tutar, custom amount (örn. LÖSEV)
//
// Özellikler:
// - Select state: gold fill + ink800 bg + checkmark + bounce spring
// - Idle state: ink800 bg + goldLine border
// - Fiyat büyük Fraunces + periyot küçük Jakarta Sans
// - Impact statement "Bu üyelik ne sağlar" (UX audit H6 çözüm)
// - aria-pressed + role="radio"

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { Check } from 'lucide-react'

export interface TierOption {
  id: string
  /** Üst etiket — "Öğrenci" / "Yetişkin" / "Aylık" */
  label: string
  /** Ana fiyat — "₺256" / "₺50" / "₺150" */
  priceDisplay: string
  /** Periyot — "yıllık" / "aylık" / "tek seferlik" */
  periodLabel?: string
  /** Impact — "7 fidan dikilir" / "2 sokak hayvanı bir ay beslenir" */
  impactStatement?: string
  /** Küçük açıklama notu — "18-24 yaş" / "İndirimli üyelik" */
  metaLabel?: string
  /** En popüler / önerilen — gold rozet */
  isRecommended?: boolean
  /** Disabled (ör. max capacity) */
  disabled?: boolean
}

interface TierCardProps {
  tier: TierOption
  selected: boolean
  onSelect: (id: string) => void
}

export function TierCard({ tier, selected, onSelect }: TierCardProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const bg = selected ? c.ink700 : c.ink800
  const border = selected ? c.gold : c.goldLine

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${tier.label} — ${tier.priceDisplay} ${tier.periodLabel ?? ''}`}
      disabled={tier.disabled}
      onClick={() => !tier.disabled && onSelect(tier.id)}
      whileTap={
        tier.disabled || shouldReduceMotion ? undefined : { scale: 0.98 }
      }
      animate={
        selected && !shouldReduceMotion
          ? { scale: [1, 1.02, 1] }
          : { scale: 1 }
      }
      transition={{
        scale: { type: 'spring', stiffness: 400, damping: 22, duration: 0.2 },
      }}
      className="relative w-full overflow-hidden rounded-2xl p-4 text-left transition-colors"
      style={{
        background: bg,
        border: `1.5px solid ${border}`,
        opacity: tier.disabled ? 0.45 : 1,
        cursor: tier.disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {/* Recommended ribbon */}
      {tier.isRecommended && (
        <div
          className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
          style={{
            background: c.gold,
            color: c.ink,
            letterSpacing: '0.06em',
          }}
        >
          Önerilen
        </div>
      )}

      {/* Top row — label + meta */}
      <div className="flex items-start gap-2">
        {/* Radio indicator */}
        <div
          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-colors"
          style={{
            background: selected ? c.gold : 'transparent',
            border: `1.5px solid ${selected ? c.gold : c.ink500}`,
          }}
          aria-hidden="true"
        >
          {selected && <Check size={12} color={c.ink} strokeWidth={3} />}
        </div>
        <div className="flex-1">
          <div
            className="text-[15px] font-semibold"
            style={{ color: c.cream, letterSpacing: '-0.01em' }}
          >
            {tier.label}
          </div>
          {tier.metaLabel && (
            <div
              className="mt-0.5 text-[11px] font-medium"
              style={{
                color: c.ink300,
                letterSpacing: '0.02em',
              }}
            >
              {tier.metaLabel}
            </div>
          )}
        </div>
      </div>

      {/* Price block */}
      <div className="mt-3 flex items-baseline gap-1.5">
        <span
          className="font-display font-semibold tabular-nums"
          style={{
            color: selected ? c.gold : c.cream,
            fontSize: 28,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          {tier.priceDisplay}
        </span>
        {tier.periodLabel && (
          <span
            className="text-[12px] font-medium"
            style={{ color: c.ink300, letterSpacing: '0.02em' }}
          >
            / {tier.periodLabel}
          </span>
        )}
      </div>

      {/* Impact statement */}
      {tier.impactStatement && (
        <div
          className="mt-2 text-[12px] leading-snug"
          style={{ color: c.ink200 }}
        >
          <span style={{ color: c.gold }}>→</span> {tier.impactStatement}
        </div>
      )}
    </motion.button>
  )
}

/* ─────────────────────────────────────────────────────────────
 *  Custom amount input variant — donation_based mode için
 * ───────────────────────────────────────────────────────────── */

interface CustomAmountFieldProps {
  value: number | ''
  onChange: (v: number | '') => void
  minAmount: number
  suggestedAmounts?: number[]
}

export function CustomAmountField({
  value,
  onChange,
  minAmount,
  suggestedAmounts = [],
}: CustomAmountFieldProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const isBelow = typeof value === 'number' && value < minAmount

  return (
    <div className="space-y-3">
      {/* Quick pick chips */}
      {suggestedAmounts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestedAmounts.map((amt) => {
            const isActive = value === amt
            return (
              <motion.button
                key={amt}
                type="button"
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                onClick={() => onChange(amt)}
                className="rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors"
                style={{
                  background: isActive ? c.gold : c.ink800,
                  color: isActive ? c.ink : c.cream,
                  border: `1.5px solid ${isActive ? c.gold : c.ink600}`,
                }}
                aria-pressed={isActive}
              >
                ₺{amt.toLocaleString('tr-TR')}
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Custom amount input */}
      <div>
        <label
          htmlFor="custom-amount"
          className="mb-1.5 block text-[11px] font-semibold uppercase"
          style={{ color: c.ink300, letterSpacing: '0.06em' }}
        >
          Özel tutar
        </label>
        <div
          className="flex items-center rounded-xl px-3"
          style={{
            background: c.ink800,
            border: `1.5px solid ${isBelow ? c.danger : c.ink600}`,
          }}
        >
          <span
            className="font-display text-[18px] font-semibold"
            style={{ color: c.ink300 }}
          >
            ₺
          </span>
          <input
            id="custom-amount"
            type="number"
            inputMode="numeric"
            min={minAmount}
            value={value === '' ? '' : value}
            onChange={(e) => {
              const raw = e.target.value
              onChange(raw === '' ? '' : Number(raw))
            }}
            placeholder={`${minAmount}`}
            className="flex-1 bg-transparent px-2 py-3 font-display text-[18px] font-semibold tabular-nums outline-none"
            style={{ color: c.cream }}
            aria-describedby="custom-amount-help"
          />
        </div>
        <p
          id="custom-amount-help"
          className="mt-1.5 text-[11px]"
          style={{
            color: isBelow ? c.danger : c.ink400,
          }}
        >
          {isBelow
            ? `Minimum tutar ₺${minAmount.toLocaleString('tr-TR')}.`
            : `Minimum ₺${minAmount.toLocaleString('tr-TR')} — tercih ettiğin tutarı yaz.`}
        </p>
      </div>
    </div>
  )
}
