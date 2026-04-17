'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Clock, Zap, CheckCircle2, Camera, QrCode, Hash } from 'lucide-react'
import type { Mission, UserMission } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

interface Props {
  mission: Mission & { ngos?: { name: string; color_accent: string | null; logo_url: string | null } | null }
  userMission: UserMission | null
  userId: string
}

const domainGradient: Record<string, string> = {
  nature: 'from-emerald-500 to-teal-400',
  education: 'from-blue-500 to-indigo-400',
  social: 'from-rose-500 to-pink-400',
  financial: 'from-amber-500 to-orange-400',
  default: 'from-stone-500 to-stone-600',
}

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: 'Kolay', color: 'bg-emerald-100 text-emerald-700' },
  medium: { label: 'Orta', color: 'bg-amber-100 text-amber-700' },
  hard: { label: 'Zor', color: 'bg-red-100 text-red-700' },
}

const verifyIcon: Record<string, React.ElementType> = {
  auto: Zap,
  code: Hash,
  photo: Camera,
  qr: QrCode,
}

const verifyLabel: Record<string, string> = {
  auto: 'Otomatik',
  code: 'Kod girişi',
  photo: 'Fotoğraf',
  qr: 'QR kod',
}

export function MissionDetailClient({ mission, userMission, userId }: Props) {
  const [loading, setLoading] = useState(false)
  const [takeError, setTakeError] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  const isTaken = !!userMission
  const isCompleted = userMission?.status === 'completed'

  const domain = mission.domain ?? 'default'
  const gradient = domainGradient[domain] ?? domainGradient.default
  const difficulty = difficultyConfig[mission.difficulty ?? 'easy']
  const VerifyIcon = verifyIcon[mission.verify_method ?? 'auto']

  let steps: string[] = []
  try {
    steps = Array.isArray(mission.steps)
      ? mission.steps as string[]
      : JSON.parse((mission.steps as string) ?? '[]')
  } catch {
    steps = []
  }

  async function handleTakeMission() {
    setLoading(true)
    setTakeError(null)
    const { error } = await supabase
      .from('user_missions')
      .insert({ user_id: userId, mission_id: mission.id, status: 'taken' })
    setLoading(false)
    if (error) {
      setTakeError('Görev alınamadı, tekrar dene')
      return
    }
    router.push(`/dashboard/missions/${mission.id}/complete`)
  }

  const imageUrl = (mission as Mission & { image_url?: string | null }).image_url

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Band */}
      <div className={`relative bg-gradient-to-br ${gradient} pt-12 pb-8 px-4`}>
        {imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
        <div className="relative">
          <Link
            href="/dashboard/missions"
            className="inline-flex items-center gap-1.5 text-white/80 text-sm mb-6"
          >
            <ArrowLeft size={16} />
            Görevler
          </Link>
          {mission.ngos && (
            <div className="flex items-center gap-2 mb-2">
              {mission.ngos.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mission.ngos.logo_url}
                  alt={mission.ngos.name}
                  className="w-5 h-5 rounded object-contain bg-white/90 p-0.5"
                />
              ) : (
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold"
                  style={{ backgroundColor: mission.ngos.color_accent ?? '#00000040' }}
                >
                  {mission.ngos.name[0]}
                </div>
              )}
              <span className="text-white/80 text-sm font-medium">{mission.ngos.name}</span>
            </div>
          )}
          <h1 className="font-display font-extrabold text-white text-2xl leading-tight">
            {mission.title}
          </h1>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <div className="bg-white/20 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-white" />
              <span className="text-white font-bold text-sm">{mission.karma} karma</span>
            </div>
            {mission.duration && (
              <div className="bg-white/20 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <Clock size={14} className="text-white" />
                <span className="text-white text-sm">{mission.duration}</span>
              </div>
            )}
            {mission.difficulty && (
              <div className={`rounded-full px-3 py-1.5 text-sm font-semibold ${difficulty.color}`}>
                {difficulty.label}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-4">
        <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
          <h2 className="font-display font-bold text-base text-stone-900 mb-2">Görev Detayı</h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            {mission.long_description ?? mission.description}
          </p>
        </div>

        {steps.length > 0 && (
          <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
            <h2 className="font-display font-bold text-base text-stone-900 mb-3">Adımlar</h2>
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-stone-500">
                  <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
          <h2 className="font-display font-bold text-base text-stone-900 mb-2">Doğrulama</h2>
          <div className="flex items-center gap-2 mb-1">
            <VerifyIcon size={16} className="text-stone-400" />
            <span className="text-sm font-semibold text-stone-700">{verifyLabel[mission.verify_method ?? 'auto']}</span>
          </div>
          <p className="text-sm text-stone-500">{mission.verify_hint}</p>
        </div>

        {mission.impact_statement && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5">
            <div className="flex items-start gap-2">
              <Zap size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-semibold text-emerald-700">{mission.impact_statement}</p>
            </div>
          </div>
        )}
      </div>

      {takeError && (
        <motion.div
          className="mx-4 bg-red-50 border border-red-100 rounded-2xl p-3 text-sm text-red-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {takeError}
        </motion.div>
      )}

      <div className="fixed bottom-20 left-0 right-0 px-4">
        {isCompleted ? (
          <div className="bg-emerald-500 text-white text-center py-4 rounded-2xl font-display font-bold flex items-center justify-center gap-2">
            <CheckCircle2 size={20} />
            Tamamlandı
          </div>
        ) : isTaken ? (
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href={`/dashboard/missions/${mission.id}/complete`}
              className="block w-full bg-primary text-white text-center py-4 rounded-2xl font-display font-bold text-base shadow-[0_4px_20px_rgba(244,185,66,0.4)]"
            >
              Tamamlamaya Devam Et →
            </Link>
          </motion.div>
        ) : (
          <motion.button
            onClick={handleTakeMission}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-2xl font-display font-bold text-base shadow-[0_4px_20px_rgba(244,185,66,0.4)] disabled:opacity-60"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Göreve Alınıyor...' : 'Görevi Al →'}
          </motion.button>
        )}
      </div>
    </div>
  )
}
