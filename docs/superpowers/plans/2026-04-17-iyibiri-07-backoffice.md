# İyiBiri — Plan 7: Backoffice (Minimal)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Misyon listesi görüntüleme ve her misyon için QR kod üretip indirme imkanı sunan minimal bir admin paneli.

**Architecture:** `/admin` prefix'i, middleware'de ayrı `ADMIN_SECRET` cookie ile korunur. Misyonlar Supabase'den okunur. QR kod `qrcode` npm paketi ile client-side üretilir.

**Bağımlılıklar:** Plan 1 (DB), Plan 3 (middleware)

---

### Task 1: qrcode Paketi

**Files:**
- Modify: `package.json`

- [ ] **Step 1: qrcode kur**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm install qrcode
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm install --save-dev @types/qrcode
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install qrcode for admin QR generation"
```

---

### Task 2: Admin Middleware Koruması

**Files:**
- Modify: `middleware.ts`

- [ ] **Step 1: Admin route korumasını middleware'e ekle**

`middleware.ts` içine, mevcut redirect mantığının üstüne ekle:

```typescript
// Admin koruma
if (request.nextUrl.pathname.startsWith('/admin')) {
  const adminCookie = request.cookies.get('iyibiri_admin')
  if (adminCookie?.value !== process.env.ADMIN_SECRET) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}
```

- [ ] **Step 2: .env.local'a ADMIN_SECRET ekle**

`.env.local`'a ekle:
```
ADMIN_SECRET=iyibiri-admin-2026
```

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add admin route protection to middleware"
```

---

### Task 3: Admin Login Sayfası

**Files:**
- Create: `app/admin/login/page.tsx`

- [ ] **Step 1: admin/login/page.tsx yaz**

`app/admin/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    // Cookie'yi set et
    document.cookie = `iyibiri_admin=${secret}; path=/; max-age=86400`
    router.push('/admin/missions')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8">
        <h1 className="font-display font-extrabold text-xl text-text-primary mb-6 text-center">
          Admin Girişi
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="Admin şifresi"
            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {error && <p className="text-danger text-sm text-center">Hatalı şifre</p>}
          <button
            type="submit"
            className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold"
          >
            Giriş
          </button>
        </form>
      </div>
    </div>
  )
}
```

---

### Task 4: Admin Layout & Missions Listesi

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/missions/page.tsx`

- [ ] **Step 1: app/admin/layout.tsx yaz**

`app/admin/layout.tsx`:

```typescript
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
        <span className="font-display font-bold">İyiBiri Admin</span>
        <a href="/admin/missions" className="text-sm text-stone-300 hover:text-white">
          Misyonlar
        </a>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: app/admin/missions/page.tsx yaz**

`app/admin/missions/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Mission } from '@/lib/supabase/types'

async function getMissions(): Promise<Mission[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .order('title')
  if (error) throw error
  return data
}

export default async function AdminMissionsPage() {
  const missions = await getMissions()

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-text-primary mb-6">
        Misyonlar ({missions.length})
      </h1>
      <div className="space-y-3">
        {missions.map(mission => (
          <div key={mission.id} className="bg-white rounded-xl border border-border p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-text-primary">{mission.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-text-muted capitalize">{mission.verify_method}</span>
                <span className="text-xs text-text-muted">✨ {mission.karma} karma</span>
                {mission.verify_code && (
                  <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    {mission.verify_code}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(mission.verify_method === 'qr' || mission.verify_method === 'code') && (
                <Link
                  href={`/admin/missions/${mission.id}/qr`}
                  className="text-sm font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5"
                >
                  QR Üret
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test et**

1. `localhost:3000/admin/login` → admin şifresini gir (`iyibiri-admin-2026`)
2. `localhost:3000/admin/missions` → misyon listesi görünüyor mu?
3. QR doğrulamalı misyonlarda "QR Üret" butonu var mı?

- [ ] **Step 4: Commit**

```bash
git add app/admin/
git commit -m "feat: add minimal admin panel with mission list"
```

---

### Task 5: QR Kod Üretme Sayfası

**Files:**
- Create: `app/admin/missions/[id]/qr/page.tsx`

- [ ] **Step 1: QR sayfasını yaz**

`app/admin/missions/[id]/qr/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { QRGenerator } from './qr-generator'
import type { Mission } from '@/lib/supabase/types'

async function getMission(id: string): Promise<Mission | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export default async function QRPage({ params }: { params: { id: string } }) {
  const mission = await getMission(params.id)
  if (!mission || !mission.verify_code) notFound()

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-display font-extrabold text-xl text-text-primary mb-2">
        {mission.title}
      </h1>
      <p className="text-text-muted text-sm mb-6">
        QR kod içeriği: <code className="font-mono bg-stone-100 px-2 py-0.5 rounded">{mission.verify_code}</code>
      </p>
      <QRGenerator missionId={mission.id} verifyCode={mission.verify_code} missionTitle={mission.title} />
    </div>
  )
}
```

- [ ] **Step 2: qr-generator.tsx yaz**

`app/admin/missions/[id]/qr/qr-generator.tsx`:

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { createClient } from '@/lib/supabase/client'

interface Props {
  missionId: string
  verifyCode: string
  missionTitle: string
}

export function QRGenerator({ missionId, verifyCode, missionTitle }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, verifyCode, {
      width: 300,
      margin: 2,
      color: { dark: '#1C1917', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    })
  }, [verifyCode])

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qr-${missionId}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  async function handleSaveToDb() {
    const canvas = canvasRef.current
    if (!canvas) return
    setSaving(true)
    const dataUrl = canvas.toDataURL('image/png')
    const supabase = createClient()
    await supabase
      .from('missions')
      .update({ qr_code_data: dataUrl })
      .eq('id', missionId)
    setSaving(false)
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border p-6 flex flex-col items-center gap-4">
        <canvas ref={canvasRef} className="rounded-xl" />
        <p className="text-sm text-text-muted text-center">
          Bu QR kodu etkinlik alanına asın.<br />
          Kullanıcılar tarayarak görevi tamamlar.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 py-3 bg-stone-900 text-white rounded-xl font-bold text-sm"
        >
          PNG İndir
        </button>
        <button
          onClick={handleSaveToDb}
          disabled={saving || saved}
          className="flex-1 py-3 border border-primary text-primary rounded-xl font-bold text-sm disabled:opacity-60"
        >
          {saved ? '✓ Kaydedildi' : saving ? 'Kaydediliyor...' : 'DB\'ye Kaydet'}
        </button>
      </div>

      <a href="/admin/missions" className="block text-center text-sm text-text-muted">
        ← Misyon listesine dön
      </a>
    </div>
  )
}
```

- [ ] **Step 3: Test et**

1. `localhost:3000/admin/missions/beach-cleanup/qr`
2. QR kod canvas'ta görünüyor mu?
3. "PNG İndir" → dosya indi mi?
4. "DB'ye Kaydet" → Supabase missions tablosunda `qr_code_data` dolduruldu mu?
5. Telefona `localhost:3000/dashboard/missions/beach-cleanup/complete` aç → QR'ı tara → misyon tamamlanıyor mu?

- [ ] **Step 4: Commit**

```bash
git add app/admin/missions/[id]/
git commit -m "feat: add QR code generator for missions with download and db save"
```

---

### Task 6: Son Kontrol — Tam Demo Akışı

- [ ] **Step 1: End-to-end demo senaryosunu çalıştır**

1. **Kayıt:** `localhost:3000/auth/signup` → yeni hesap aç
2. **Dashboard:** Karma 0, streak 0, tier "İyi Biri" görünüyor
3. **Görev listesi:** 6 görev listeleniyor, filtreler çalışıyor
4. **Auto görev:** Fidan Dikimi → al → tamamla → +150 karma, konfeti
5. **Kod görevi:** Okuma Desteği → al → `CYDD-READ-2026` gir → +250 karma
6. **Fotoğraf görevi:** Barınak Bağışı → al → fotoğraf yükle → +100 karma
7. **QR görevi:** Admin'den QR üret → telefonda tara → +200 karma
8. **Karma bakiyesi:** 700 karma → Cinemaximum ödülü açıldı mı?
9. **Ödül kullan:** Sinema biletini kullan → karma 300'e düştü mü?
10. **Profil:** XPBar doldu mu, istatistikler doğru mu?

- [ ] **Step 2: Build al**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm run build 2>&1 | tail -20
```

Expected: Başarılı build, TypeScript hatası yok.

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete iyibiri demo - full supabase integration, all verification methods, new UI"
```
