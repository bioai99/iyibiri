'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Mission, UserMission } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { CelebrationOverlay } from '@/components/ui/celebration-overlay'
import { QRScanner } from '@/components/ui/qr-scanner'

interface Props {
  mission: Mission
  userMission: UserMission
  userId: string
  currentKarma: number
}

export function VerificationClient({ mission, userMission, userId, currentKarma }: Props) {
  const [code, setCode] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [celebration, setCelebration] = useState(false)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  async function markComplete(verificationData: Record<string, unknown>) {
    setLoading(true)
    setError(null)

    const { error: missionError } = await supabase
      .from('user_missions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        verification_data: verificationData,
        karma_awarded: mission.karma,
      })
      .eq('id', userMission.id)

    if (missionError) {
      setError('Bir hata oluştu, tekrar dene')
      setLoading(false)
      return
    }

    const { error: karmaError } = await supabase
      .from('karma_transactions')
      .insert({
        user_id: userId,
        amount: mission.karma,
        type: 'mission_complete',
        reference_id: mission.id,
        description: `${mission.title} görevi tamamlandı`,
      })

    if (karmaError) {
      setError('Karma eklenirken hata oluştu')
      setLoading(false)
      return
    }

    setLoading(false)
    setCelebration(true)
  }

  async function handleAuto() {
    await markComplete({ method: 'auto' })
  }

  async function handleCode() {
    if (code.trim().toUpperCase() !== (mission.verify_code ?? '').toUpperCase()) {
      setError('Kod hatalı, tekrar dene')
      return
    }
    await markComplete({ method: 'code', code_entered: code })
  }

  async function handlePhoto() {
    if (!photoFile) { setError('Fotoğraf seçilmedi'); return }
    setLoading(true)
    setError(null)

    const path = `${userId}/${mission.id}/${Date.now()}.jpg`
    const { error: uploadError } = await supabase.storage
      .from('verification-photos')
      .upload(path, photoFile)

    if (uploadError) {
      setError('Fotoğraf yüklenemedi')
      setLoading(false)
      return
    }

    await markComplete({ method: 'photo', photo_path: path })
  }

  async function handleQRScan(result: string) {
    const scanned = result.trim().toUpperCase()
    const expected = (mission.verify_code ?? '').toUpperCase()
    if (scanned !== expected) {
      setError('Geçersiz QR kod')
      return
    }
    await markComplete({ method: 'qr', qr_scanned: result })
  }

  function handleCelebrationClose() {
    setCelebration(false)
    router.push('/dashboard')
    router.refresh()
  }

  // Suppress unused variable warning — currentKarma is passed for potential future use
  void currentKarma

  return (
    <>
      <CelebrationOverlay
        show={celebration}
        karmaEarned={mission.karma}
        missionTitle={mission.title}
        onClose={handleCelebrationClose}
      />

      <div className="min-h-screen bg-background pb-24">
        <div className="bg-white border-b border-border px-4 pt-12 pb-4">
          <Link href={`/dashboard/missions/${mission.id}`} className="flex items-center gap-2 text-text-muted text-sm mb-3">
            <ArrowLeft className="w-4 h-4" /> Geri
          </Link>
          <h1 className="font-display font-extrabold text-xl text-text-primary">Görevi Tamamla</h1>
          <p className="text-text-muted text-sm mt-0.5">{mission.title}</p>
        </div>

        <div className="px-4 py-6 space-y-4">
          <div className="bg-primary/10 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-primary/80">Kazanacağın karma</span>
            <div className="flex items-center gap-1">
              <span className="text-xl">✨</span>
              <span className="font-extrabold text-2xl text-primary font-display">+{mission.karma}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-4 space-y-4">
            <h2 className="font-display font-bold text-base">Doğrulama</h2>
            <p className="text-sm text-text-muted">{mission.verify_hint}</p>

            {mission.verify_method === 'auto' && (
              <motion.button
                onClick={handleAuto}
                disabled={loading}
                className="w-full py-3.5 bg-primary text-white rounded-xl font-display font-bold disabled:opacity-60"
                whileTap={{ scale: 0.97 }}
              >
                {loading ? 'Tamamlanıyor...' : 'Görevi Tamamladım ✓'}
              </motion.button>
            )}

            {mission.verify_method === 'code' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Doğrulama kodunu gir"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-stone-50 text-text-primary font-mono text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <motion.button
                  onClick={handleCode}
                  disabled={loading || !code.trim()}
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-display font-bold disabled:opacity-60"
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? 'Kontrol ediliyor...' : 'Kodu Doğrula'}
                </motion.button>
              </div>
            )}

            {mission.verify_method === 'photo' && (
              <div className="space-y-3">
                <label className="block">
                  <div className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                    photoFile ? 'border-success bg-emerald-50' : 'border-border bg-stone-50'
                  }`}>
                    {photoFile ? (
                      <>
                        <span className="text-3xl">✅</span>
                        <span className="text-sm font-semibold text-success">{photoFile.name}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl">📷</span>
                        <span className="text-sm text-text-muted">Fotoğraf seç veya çek</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <motion.button
                  onClick={handlePhoto}
                  disabled={loading || !photoFile}
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-display font-bold disabled:opacity-60"
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? 'Yükleniyor...' : 'Fotoğrafı Gönder'}
                </motion.button>
              </div>
            )}

            {mission.verify_method === 'qr' && (
              <QRScanner onScan={handleQRScan} onError={setError} />
            )}
          </div>

          {error && (
            <motion.div
              className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-danger text-center"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
