'use client'

// app/dashboard/missions/[id]/complete/complete-client.tsx
//
// Mission verification container page — dark tema.
// UX audit K2 çözümü: light tema verification-client.tsx REPLACE edildi.
// UI Spec 2026-04-24 Bölüm 3.6 — verifying state.
//
// Akış:
// 1. Header (Back + "GÖREV DOĞRULAMA · Adım 1/2")
// 2. Mission title — Fraunces italic
// 3. VerificationPanel (4 variant switch)
// 4. Success → completeMission server action → confetti + Karma count-up → /missions/[id]

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { useTheme } from '@/lib/theme'
import { createClient } from '@/lib/supabase/client'
import type { Mission } from '@/lib/supabase/types'
import { VerificationPanel } from '@/components/mission'
import { CelebrationOverlay } from '@/components/ui/celebration-overlay'
import { TierUpOverlay } from '@/components/tier/tier-up-overlay'
import { completeMission } from '@/lib/missions/actions'
import type { VerificationData } from '@/lib/missions/actions'

interface Props {
  mission: Mission
  userMissionId: string
  userId: string
  ngoShortName?: string
  helpContactUrl?: string | null
}

export function CompleteMissionClient({
  mission,
  userMissionId,
  userId,
  ngoShortName,
  helpContactUrl,
}: Props) {
  const router = useRouter()
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [celebrate, setCelebrate] = useState(false)

  // Vol-29: tier-up overlay state
  const [tierUp, setTierUp] = useState<{ from: number; to: number } | null>(null)

  /* Photo upload — client-side Supabase storage */
  const handlePhotoUpload = async (file: File) => {
    const supabase = createClient()
    const path = `${userId}/${mission.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
    const { error } = await supabase.storage
      .from('verification-photos')
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      })
    if (error) return { error: error.message }
    return { path }
  }

  /* Server-side verification submit */
  const handleVerify = async (data: VerificationData) => {
    setServerError(null)
    startTransition(async () => {
      const res = await completeMission(userMissionId, data)
      if (res.ok) {
        // Vol-29: Tier-up varsa metamorphosis + tier-up overlay göster.
        // Yoksa standart konfeti + redirect.
        if (res.didTierUp) {
          setTierUp({ from: res.tierBefore, to: res.tierAfter })
        } else {
          setCelebrate(true)
        }
      } else {
        setServerError(res.error)
      }
    })
  }

  const handleCelebrationClose = () => {
    setCelebrate(false)
    router.push('/dashboard')
    router.refresh()
  }

  // Vol-29: Tier-up overlay kapanırsa konfeti + redirect zincirini de tetikle
  const handleTierUpClose = () => {
    setTierUp(null)
    setCelebrate(true) // Tier-up sonrası standart kutlama da göster
  }

  return (
    <>
      {/* Vol-29: Tier-up overlay (öncelikli) */}
      {tierUp && (
        <TierUpOverlay
          show
          fromTier={tierUp.from}
          toTier={tierUp.to}
          onClose={handleTierUpClose}
        />
      )}

      <CelebrationOverlay
        show={celebrate}
        karmaEarned={mission.karma}
        missionTitle={mission.title}
        ngoShortName={ngoShortName}
        onClose={handleCelebrationClose}
      />

      <div
        className="flex min-h-[100dvh] flex-col"
        style={{ background: c.ink900, color: c.cream }}
      >
        {/* Header */}
        <header
          className="flex items-center gap-3 px-5 pb-3 pt-[calc(env(safe-area-inset-top,20px)+16px)]"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
            }}
            aria-label="Geri"
          >
            <ArrowLeft size={16} color={c.cream} />
          </button>
          <div
            className="text-[11px] font-bold uppercase"
            style={{ color: c.gold, letterSpacing: '0.14em' }}
          >
            GÖREV DOĞRULAMA
          </div>
        </header>

        {/* Title */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="px-5 pt-4"
        >
          <p
            className="mb-2 text-[11px] font-bold uppercase"
            style={{ color: c.ink300, letterSpacing: '0.14em' }}
          >
            {mission.category ?? 'GÖREV'}
          </p>
          <h1
            className="font-display leading-tight"
            style={{
              color: c.cream,
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: '-0.025em',
            }}
          >
            {mission.title} —{' '}
            <em style={{ fontStyle: 'italic', color: c.gold }}>Tamamla</em>
          </h1>
        </motion.div>

        {/* Verification panel */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex-1 overflow-y-auto px-5 pb-24 pt-6"
        >
          <VerificationPanel
            method={mission.verify_method}
            missionTitle={mission.title}
            missionKarma={mission.karma}
            expectedCode={mission.verify_code}
            hint={mission.verify_hint}
            helpContactUrl={helpContactUrl}
            ngoShortName={ngoShortName}
            onPhotoUpload={handlePhotoUpload}
            onVerify={handleVerify}
            isSubmitting={pending}
            serverError={serverError}
          />
        </motion.div>
      </div>
    </>
  )
}
