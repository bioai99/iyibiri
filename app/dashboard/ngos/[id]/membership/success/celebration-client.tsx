'use client'

// app/dashboard/ngos/[id]/membership/success/celebration-client.tsx
//
// Yeni flow success state:
// 1. Mount'ta confirmMembership(referralId) çağrılır (idempotent)
// 2. Loading → SuccessCelebration render (confetti + Karma count-up)
// 3. Hata durumunda fallback text + retry CTA
//
// Membership ekleme + Karma bonus server-side'da (actions.ts).
// Client sadece UI + tetikleyici.

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

import { SuccessCelebration } from '@/components/membership'
import { confirmMembership } from '@/lib/membership/actions'
import {
  deriveTierOptions,
  formatPriceDisplay,
  periodLabel as periodLabelFn,
} from '@/lib/membership/fee-config'
import type { NGO, MembershipFeeConfig } from '@/lib/supabase/types'

interface MembershipCelebrationClientProps {
  ngo: NGO
  referralId: string
  amount: number
  tierId?: string
  customAmount?: number
  /** Zaten confirmed — idempotent guard. Server rekonfirm etmez, direkt celebrate. */
  alreadyConfirmed?: boolean
}

type Phase = 'confirming' | 'celebrating' | 'error'

export function MembershipCelebrationClient({
  ngo,
  referralId,
  amount,
  tierId,
  customAmount,
  alreadyConfirmed = false,
}: MembershipCelebrationClientProps) {
  const router = useRouter()
  const { colors: c } = useTheme()

  const [phase, setPhase] = useState<Phase>(
    alreadyConfirmed ? 'celebrating' : 'confirming',
  )
  const [karmaAwarded, setKarmaAwarded] = useState<number>(
    alreadyConfirmed ? 0 : 100,
  )
  const [errorMsg, setErrorMsg] = useState<string>('')

  /* confirmMembership server action — mount once */
  useEffect(() => {
    if (alreadyConfirmed) return
    let cancelled = false
    ;(async () => {
      const res = await confirmMembership(referralId)
      if (cancelled) return
      if (res.ok) {
        setKarmaAwarded(res.karmaAwarded || 100)
        setPhase('celebrating')
      } else {
        setErrorMsg(res.error)
        setPhase('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [referralId, alreadyConfirmed])

  const feeConfig = ngo.membership_fee_config as MembershipFeeConfig | null
  const derived = feeConfig ? deriveTierOptions(feeConfig) : null

  // Tier label + period — migrasyon/fee config yoksa amount-only fallback
  const { tierLabel, periodLabel } = (() => {
    if (!derived)
      return {
        tierLabel: amount > 0 ? formatPriceDisplay(amount) : 'Gönüllü üyelik',
        periodLabel: '',
      }
    if (derived.isDonationBased) {
      return {
        tierLabel:
          customAmount !== undefined
            ? `${formatPriceDisplay(customAmount)} bağış`
            : formatPriceDisplay(amount) + ' bağış',
        periodLabel: 'tek seferlik',
      }
    }
    const tier = derived.tiers.find((t) => t.id === tierId)
    if (tier) {
      return {
        tierLabel: tier.label,
        periodLabel: tier.periodLabel ?? '',
      }
    }
    // Tier id bulunamadı — fee config'teki ilk tier'ın period'una fallback
    const fallback = feeConfig?.tiers[0]
    return {
      tierLabel: formatPriceDisplay(amount),
      periodLabel: fallback ? periodLabelFn(fallback.period) : '',
    }
  })()

  // Impact statement — tier'dan veya NGO kategorisinden türet
  const impactStatement = (() => {
    const tier = feeConfig?.tiers.find((t) => t.id === tierId)
    if (tier?.impact_statement) return tier.impact_statement
    if (feeConfig?.mode === 'donation_based' && feeConfig.donation_based?.note) {
      return feeConfig.donation_based.note
    }
    return `${ngo.short_name ?? ngo.name} topluluğuna katıldın.`
  })()

  /* ────────── Render ────────── */

  if (phase === 'confirming') {
    return (
      <div
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6"
        style={{ background: c.ink900, color: c.cream }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={24} color={c.gold} />
        </motion.div>
        {/* K7: Empathic pending message */}
        <div className="text-center max-w-[320px]">
          <p className="text-[15px] font-medium mb-2" style={{ color: c.cream }}>
            Ödemeniz işleniyor…
          </p>
          <p className="text-[13px]" style={{ color: c.ink300, lineHeight: 1.5 }}>
            Birkaç saniye içinde onaylanacak. STK'nın size göndereceği aydınlatma metni ve üyelik sertifikası için e-posta kutunuza bakın.
          </p>
        </div>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 px-6 text-center"
        style={{ background: c.ink900, color: c.cream }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: c.claySoft, border: `1px solid ${c.clay}` }}
        >
          <AlertTriangle size={22} color={c.clay} />
        </div>
        <h1
          className="font-display text-[22px] font-medium"
          style={{ color: c.cream, letterSpacing: '-0.025em' }}
        >
          Üyelik onaylanamadı
        </h1>
        <p className="max-w-[320px] text-[13px]" style={{ color: c.ink300 }}>
          {errorMsg || 'Beklenmedik bir sorun oluştu. Lütfen tekrar dene.'}
        </p>
        <div className="mt-4 flex flex-col gap-2 self-stretch max-w-[320px] mx-auto">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/ngos/${ngo.id}/membership`)}
            className="h-11 rounded-xl font-bold"
            style={{ background: c.gold, color: c.ink, fontSize: 14 }}
          >
            Üyelik akışına dön
          </button>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/ngos/${ngo.id}`)}
            className="h-10 rounded-xl font-semibold"
            style={{
              background: 'transparent',
              color: c.cream,
              border: `1.5px solid ${c.ink600}`,
              fontSize: 13,
            }}
          >
            STK profiline dön
          </button>
        </div>
      </div>
    )
  }

  // phase === 'celebrating'
  return (
    <div
      className="min-h-[100dvh]"
      style={{ background: c.ink900, color: c.cream }}
    >
      <SuccessCelebration
        ngoName={ngo.name}
        ngoShortName={ngo.short_name ?? undefined}
        ngoAccentColor={ngo.color_accent ?? undefined}
        ngoLogoUrl={ngo.logo_url ?? undefined}
        karmaEarned={karmaAwarded}
        impactStatement={impactStatement}
        tierLabel={tierLabel}
        periodLabel={periodLabel || undefined}
        onDashboard={() => router.push('/dashboard')}
        onDownloadCert={() => {
          // TODO: sertifika PDF üretim route'u (app/api/members/[id]/certificate/route.ts)
          alert(
            'Sertifika hazırlanıyor — yakın zamanda e-posta ile iletilecek.',
          )
        }}
        certReady={false}
      />
    </div>
  )
}
