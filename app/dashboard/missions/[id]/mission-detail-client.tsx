'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Mission, UserMission } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

interface Props {
  mission: Mission & { ngos?: { name: string; color_accent: string } | null }
  userMission: UserMission | null
  userId: string
}

const difficultyLabel: Record<string, string> = { easy: 'Kolay', medium: 'Orta', hard: 'Zor' }
const verifyMethodLabel: Record<string, string> = { auto: 'Otomatik', code: 'Kod girişi', photo: 'Fotoğraf', qr: 'QR kod' }

export function MissionDetailClient({ mission, userMission, userId }: Props) {
  const [loading, setLoading] = useState(false)
  const [takeError, setTakeError] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  const isTaken = !!userMission
  const isCompleted = userMission?.status === 'completed'

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

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-white border-b border-border px-4 pt-12 pb-4">
        <Link href="/dashboard/missions" className="flex items-center gap-2 text-text-muted text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Görevler
        </Link>
        <h1 className="font-display font-extrabold text-2xl text-text-primary">{mission.title}</h1>
        {mission.ngos && (
          <p className="text-sm text-text-muted mt-1">{mission.ngos.name}</p>
        )}
      </div>

      <div className="px-4 py-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 bg-primary/10 rounded-2xl p-4 text-center">
            <span className="text-2xl">✨</span>
            <p className="font-extrabold text-2xl text-primary font-display">{mission.karma}</p>
            <p className="text-xs text-text-muted">karma</p>
          </div>
          <div className="flex-1 bg-stone-50 rounded-2xl p-4 text-center">
            <span className="text-2xl">⏱</span>
            <p className="font-bold text-base text-text-primary font-display">{mission.duration ?? '—'}</p>
            <p className="text-xs text-text-muted">süre</p>
          </div>
          <div className="flex-1 bg-stone-50 rounded-2xl p-4 text-center">
            <span className="text-2xl">📊</span>
            <p className="font-bold text-base text-text-primary font-display">
              {mission.difficulty ? difficultyLabel[mission.difficulty] : '—'}
            </p>
            <p className="text-xs text-text-muted">zorluk</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-display font-bold text-base mb-2">Görev Detayı</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {mission.long_description ?? mission.description}
          </p>
        </div>

        {steps.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-4">
            <h2 className="font-display font-bold text-base mb-3">Adımlar</h2>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                  <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-display font-bold text-base mb-1">Doğrulama</h2>
          <p className="text-sm text-text-muted">
            {verifyMethodLabel[mission.verify_method]} — {mission.verify_hint}
          </p>
        </div>

        {mission.impact_statement && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <p className="text-sm font-semibold text-emerald-700">🌍 {mission.impact_statement}</p>
          </div>
        )}
      </div>

      {takeError && (
          <motion.div
            className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-danger text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {takeError}
          </motion.div>
        )}

      <div className="fixed bottom-20 left-0 right-0 px-4">
        {isCompleted ? (
          <div className="bg-success text-white text-center py-4 rounded-2xl font-bold">
            ✓ Tamamlandı
          </div>
        ) : isTaken ? (
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href={`/dashboard/missions/${mission.id}/complete`}
              className="block w-full bg-primary text-white text-center py-4 rounded-2xl font-display font-bold text-base shadow-lg"
            >
              Tamamlamaya Devam Et →
            </Link>
          </motion.div>
        ) : (
          <motion.button
            onClick={handleTakeMission}
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-display font-bold text-base shadow-lg disabled:opacity-60"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Göreve Alınıyor...' : 'Görevi Al →'}
          </motion.button>
        )}
      </div>
    </div>
  )
}
