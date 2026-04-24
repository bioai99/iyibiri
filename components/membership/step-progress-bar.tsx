// components/membership/step-progress-bar.tsx
//
// NGO üyelik akışı için 5 adımlı progress indicator.
// UI Spec 2026-04-24 Bölüm 3 Adım indicator + Bölüm 13 component list.
// UX Audit Kritik 1: "Kullanıcı nerede, ne kadar kaldı" sinyali.
//
// - 5 nokta + ince çizgi ile sıralı progress
// - Current step gold dolu + pulse ring; tamamlanan adımlar gold; gelecek adımlar ink500
// - aria-current="step" + aria-label Turkish
// - prefers-reduced-motion → pulse disabled
// - Skill: mobile-app-polish-standards Bölüm 11 "fine line / precise dot" pattern (Things 3 tier-1).

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '@/lib/theme'

interface StepProgressBarProps {
  /** 1-indexed current step */
  current: number
  /** Toplam adım sayısı — default 5 (tier → form → KVKK → ödeme → başarı) */
  total?: number
  /** Opsiyonel adım etiketleri — erişilebilirlik için */
  labels?: string[]
}

const DEFAULT_LABELS = ['Seviye seç', 'Bilgiler', 'Onay', 'Ödeme', 'Tamamlandı']

export function StepProgressBar({
  current,
  total = 5,
  labels = DEFAULT_LABELS,
}: StepProgressBarProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const clampedCurrent = Math.max(1, Math.min(current, total))
  const progressPct = ((clampedCurrent - 1) / (total - 1)) * 100

  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={clampedCurrent}
      aria-label={`Adım ${clampedCurrent} / ${total}: ${labels[clampedCurrent - 1] ?? ''}`}
      className="px-5 pt-4"
    >
      <div className="relative flex items-center justify-between">
        {/* Background line */}
        <div
          className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2"
          style={{ background: c.ink700 }}
          aria-hidden="true"
        />
        {/* Filled line */}
        <motion.div
          className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2"
          initial={shouldReduceMotion ? { width: `${progressPct}%` } : { width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: `linear-gradient(90deg, ${c.goldDim} 0%, ${c.gold} 100%)`,
          }}
          aria-hidden="true"
        />

        {/* Dots */}
        {Array.from({ length: total }).map((_, idx) => {
          const stepNum = idx + 1
          const isCurrent = stepNum === clampedCurrent
          const isDone = stepNum < clampedCurrent
          const label = labels[idx] ?? `Adım ${stepNum}`

          return (
            <div
              key={stepNum}
              className="relative flex flex-col items-center"
              aria-current={isCurrent ? 'step' : undefined}
            >
              {/* Pulse ring — current step only */}
              {isCurrent && !shouldReduceMotion && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: `${c.gold}40`,
                    width: 22,
                    height: 22,
                  }}
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  aria-hidden="true"
                />
              )}
              {/* Dot */}
              <div
                className="relative z-10 rounded-full transition-colors"
                style={{
                  width: isCurrent ? 14 : 10,
                  height: isCurrent ? 14 : 10,
                  background: isDone || isCurrent ? c.gold : c.ink600,
                  border: isDone || isCurrent ? 'none' : `1.5px solid ${c.ink500}`,
                }}
              />
              {/* Label (mobile-friendly, absolute below) */}
              <span
                className="absolute top-[calc(100%+6px)] whitespace-nowrap text-[10px] font-medium"
                style={{
                  color: isCurrent ? c.gold : isDone ? c.ink300 : c.ink400,
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
      {/* Spacer for absolute labels */}
      <div style={{ height: 18 }} aria-hidden="true" />
    </div>
  )
}
