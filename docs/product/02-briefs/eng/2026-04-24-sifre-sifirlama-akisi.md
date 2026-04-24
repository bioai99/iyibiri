# Eng Brief — Şifremi Unuttum Akışı

**Tarih:** 2026-04-24
**Sahip (brief):** product-analyst
**Sonraki sahip:** auth-capacitor
**Master plan:** `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md` #P0.7 + #4.F
**Priority:** P0 · **Effort:** M (3-4 gün)
**Bağlı ADR:** ADR-004 (dark-only — auth pages light kalır)

## 1. Problem

`/auth/signin` sayfasında "Şifremi unuttum" linki **ölü** (audit 2026-04-19). Kullanıcı şifresini unutursa platform dışı kalır — hesap kurtarma akışı yok. Standart product hygiene gereği kritik eksik.

## 2. Çözüm

Supabase `auth.resetPasswordForEmail` API kullanarak 3 adımlı akış:
1. `/auth/forgot-password` — email input, reset link gönder.
2. Kullanıcı email'den link alır → `/auth/reset-password?token=...` — yeni şifre input.
3. Başarı → `/auth/signin` redirect + "şifre güncellendi" mesajı.

## 3. Scope

### Must
- `/auth/forgot-password/page.tsx` — email form + submit.
- `/auth/reset-password/page.tsx` — token parse + yeni şifre form + password strength.
- `/auth/signin/page.tsx` — "Şifremi unuttum" link → `/auth/forgot-password`.
- Email template (Supabase Auth built-in).
- Rate limiting (Supabase default yeterli).

### Should
- Success toast sonrası login redirect (otomatik değil — kullanıcı seçer).
- KVKK + rate limit mesajları ("Email'inde reset linkini kontrol et, spam klasörü dahil").

### Won't
- Custom email template (Supabase default yeterli V1).
- 2FA ekle (V2).
- SMS reset (V2+).

## 4. Başarı metriği

- Şifre reset akışı production'da çalışır ✓.
- Ölü link biter.
- Email 30 saniye içinde ulaşır (Supabase SLA).
- Yeni şifre geçerli — login denemesi başarılı.

## 5. Teknik detay

### 5.1 `app/auth/forgot-password/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setLoading(false)

    if (error) {
      setError('Bir sorun oluştu. Yeniden dene veya destek yaz.')
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div>
        <h1>E-postanı kontrol et</h1>
        <p>
          {email} adresine reset linki gönderdik. Link 1 saat geçerli.
          Spam klasörünü de kontrol et.
        </p>
        <Button onClick={() => router.push('/auth/signin')}>
          Giriş ekranına dön
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Şifremi unuttum</h1>
      <Label>E-posta</Label>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <p className="text-destructive">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Gönderiliyor...' : 'Reset linki gönder'}
      </Button>
    </form>
  )
}
```

### 5.2 `app/auth/reset-password/page.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
// ... UI imports

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirm) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    // Password strength check (existing signup pattern)
    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalı.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setError('Token geçersiz veya süresi dolmuş. Yeniden reset iste.')
      return
    }

    router.push('/auth/signin?reset=success')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Yeni şifre belirle</h1>
      <Label>Yeni şifre</Label>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />
      <Label>Yeni şifre (tekrar)</Label>
      <Input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      {error && <p className="text-destructive">{error}</p>}
      <Button type="submit" disabled={loading}>
        Şifreyi güncelle
      </Button>
    </form>
  )
}
```

### 5.3 `app/auth/signin/page.tsx` (Edit, mevcut)

Ölü linki gerçek link olarak güncelle:

```tsx
// mevcut signin dosyasında "Şifremi unuttum" linki:
<Link href="/auth/forgot-password" className="text-sm text-muted-foreground">
  Şifremi unuttum
</Link>
```

### 5.4 Middleware güncelleme

`middleware.ts` — `/auth/forgot-password` ve `/auth/reset-password` public route (kullanıcı login olmadan erişir).

```tsx
// Mevcut logic zaten /auth/*'i public bırakıyor — değişiklik gerekmeyebilir.
// Ama callback exception listesi güncellenmeli:
if (user && request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.includes('callback') &&
    !request.nextUrl.pathname.includes('forgot-password') &&
    !request.nextUrl.pathname.includes('reset-password')) {
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

## 6. Test

- **Happy path:** email gir → link al → yeni şifre → login başarılı.
- **Edge case:**
  - Mevcut olmayan email → Supabase hata vermez (güvenlik), banner "kontrol et" gösterir.
  - Süresi dolmuş token → "Token geçersiz" mesajı + yeniden reset.
  - Şifre kısa (<8 karakter) → validation.
  - Şifre eşleşmiyor → validation.
- **Email test:** Supabase default template mobilde görünüyor mu?

## 7. Dependencies

- Supabase Auth `resetPasswordForEmail` API (built-in).
- `components/ui/{button,input,label}.tsx` (mevcut).
- Email servis (Supabase Auth default).

## 8. Risk

- Supabase email servis rate limit (free tier 30/hour). Test ortamında dikkat.
- Token expire süresi Supabase default 1 saat — kullanıcı hızlı olmalı.

## 9. Handoff

**auth-capacitor:**
1. 2 yeni sayfa yaz.
2. Signin linkini güncelle.
3. Middleware güncellemesi (gerekiyorsa).
4. Manuel test (happy path + edge).
5. Journal + dashboard güncelle.

**Toplam:** 3-4 gün paralel iş.
