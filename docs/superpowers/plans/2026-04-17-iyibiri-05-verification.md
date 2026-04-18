# İyiBiri — Plan 5: Doğrulama Akışı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dört doğrulama yöntemini (auto, code, photo, qr) çalışır hale getirmek, karma kazanımını Supabase'e yazmak ve kutlama animasyonunu tetiklemek.

**Architecture:** `complete/page.tsx` server component → `VerificationClient` client component. Doğrulama başarılıysa: user_missions güncellenir, karma_transactions eklenir (trigger profiles.karma_total'i günceller), CelebrationOverlay tetiklenir.

**Tech Stack:** Supabase, html5-qrcode, Framer Motion, Next.js Server Actions

**Bağımlılıklar:** Plan 1, Plan 2 (CelebrationOverlay), Plan 4 (mission detail)

---

### Task 1: html5-qrcode Kur

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Paketi kur**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm install html5-qrcode
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install html5-qrcode for QR scanning"
```

---

### Task 2: QR Scanner Bileşeni

**Files:**
- Create: `components/ui/qr-scanner.tsx`

- [ ] **Step 1: qr-scanner.tsx yaz**

`components/ui/qr-scanner.tsx`:

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QRScannerProps {
  onScan: (result: string) => void
  onError?: (error: string) => void
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [started, setStarted] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerId = 'qr-scanner-container'

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  async function startScanner() {
    if (started) return
    try {
      const scanner = new Html5Qrcode(containerId)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (text) => {
          scanner.stop().catch(() => {})
          onScan(text)
        },
        () => {}
      )
      setStarted(true)
    } catch (err) {
      onError?.('Kamera erişimi reddedildi')
    }
  }

  return (
    <div className="space-y-4">
      <div
        id={containerId}
        className="w-full aspect-square bg-stone-900 rounded-2xl overflow-hidden"
      />
      {!started && (
        <button
          onClick={startScanner}
          className="w-full py-3 bg-primary text-white rounded-xl font-bold"
        >
          Kamerayı Aç
        </button>
      )}
    </div>
  )
}
```

---

### Task 3: Doğrulama Sayfası

**Files:**
- Modify: `app/dashboard/missions/[id]/complete/page.tsx`
- Create: `app/dashboard/missions/[id]/complete/verification-client.tsx`

- [ ] **Step 1: complete/page.tsx yaz**

`app/dashboard/missions/[id]/complete/page.tsx`:

```typescript
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMissionById, getUserMissions } from '@/lib/supabase/queries/missions'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { VerificationClient } from './verification-client'

export default async function CompletePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [mission, userMissions, profile] = await Promise.all([
    getMissionById(params.id),
    getUserMissions(user.id),
    getProfile(user.id),
  ])

  if (!mission) notFound()

  const userMission = userMissions.find(m => m.mission_id === params.id)
  if (!userMission) redirect(`/dashboard/missions/${params.id}`)
  if (userMission.status === 'completed') redirect('/dashboard')

  return (
    <VerificationClient
      mission={mission}
      userMission={userMission}
      userId={user.id}
      currentKarma={profile?.karma_total ?? 0}
    />
  )
}
```

- [ ] **Step 2: verification-client.tsx yaz**

`app/dashboard/missions/[id]/complete/verification-client.tsx`:

```typescript
'use client'

import { useState, useRef } from 'react'
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
  const supabase = createClient()

  async function markComplete(verificationData: Record<string, unknown>) {
    setLoading(true)
    setError(null)

    // 1. user_missions güncelle
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

    // 2. karma_transactions ekle (trigger profiles.karma_total günceller)
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

    setCelebration(true)
  }

  // AUTO
  async function handleAuto() {
    await markComplete({ method: 'auto' })
  }

  // CODE
  async function handleCode() {
    if (code.trim().toUpperCase() !== (mission.verify_code ?? '').toUpperCase()) {
      setError('Kod hatalı, tekrar dene')
      return
    }
    await markComplete({ method: 'code', code_entered: code })
  }

  // PHOTO
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

  // QR
  async function handleQRScan(result: string) {
    // QR içeriği verify_code ile eşleşmeli
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
          {/* Karma preview */}
          <div className="bg-primary/10 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-primary/80">Kazanacağın karma</span>
            <div className="flex items-center gap-1">
              <span className="text-xl">✨</span>
              <span className="font-extrabold text-2xl text-primary font-display">+{mission.karma}</span>
            </div>
          </div>

          {/* Verification method */}
          <div className="bg-white rounded-2xl border border-border p-4 space-y-4">
            <h2 className="font-display font-bold text-base">Doğrulama</h2>
            <p className="text-sm text-text-muted">{mission.verify_hint}</p>

            {/* AUTO */}
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

            {/* CODE */}
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

            {/* PHOTO */}
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

            {/* QR */}
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
```

- [ ] **Step 3: Test: Auto doğrulama**

1. `localhost:3000/dashboard/missions/tree-planting` → Görevi Al
2. "Görevi Tamamladım" → konfeti patlaması çıkıyor mu?
3. Supabase → user_missions → status: 'completed' oldu mu?
4. Supabase → karma_transactions → +150 satır var mı?
5. Supabase → profiles → karma_total arttı mı?

- [ ] **Step 4: Test: Kod doğrulama**

1. `localhost:3000/dashboard/missions/reading-support` → Görevi Al
2. Yanlış kod gir → "Kod hatalı" hatası çıkıyor mu?
3. Doğru kod gir: `CYDD-READ-2026` → tamamlanıyor mu?

- [ ] **Step 5: Test: Fotoğraf doğrulama**

1. `localhost:3000/dashboard/missions/shelter-donation` → Görevi Al
2. Fotoğraf seç → yükle
3. Supabase Storage → verification-photos bucket → fotoğraf var mı?

- [ ] **Step 6: Test: QR doğrulama**

1. Backoffice'ten (Plan 7) QR üretilmiş olmalı — veya test için doğrudan `beach-cleanup` misyonunu al
2. `localhost:3000/dashboard/missions/beach-cleanup/complete` → Kamerayı Aç
3. QR kodu tara → tamamlanıyor mu?

- [ ] **Step 7: Commit**

```bash
git add app/dashboard/missions/[id]/complete/ components/ui/qr-scanner.tsx
git commit -m "feat: implement all verification methods (auto/code/photo/qr) with karma rewards"
```
