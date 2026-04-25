# Pattern A — Auth Post-Signup Flow Eksik

**Tespit eden:** test-engineer
**Tarih:** 2026-04-26 12:30
**Etkilenen bug'lar:** BUG-001 (onboarding skip), BUG-002 (OTP skip), BUG-008 (tema reset)
**Severity:** P0 (en yüksek bug'a göre)
**Etkilenen kullanıcı segmenti:** Tüm yeni kullanıcılar (her signup)

## Kök neden

Signup → dashboard arasındaki **post-signup gate zinciri** yok veya eksik. Kullanıcı email verify edilmemiş + onboarding tamamlanmamış halde dashboard'a düşüyor; bu durum profile.interests boş, profile.city boş, recommendation engine bozuk, KVKK ispat eksik gibi cascading sorunlara yol açıyor.

## Kanıt

### BUG-001 — Onboarding skip
- Signup sonrası direkt `/dashboard` redirect.
- `/onboarding/welcome`, `/onboarding/causes`, `/onboarding/city`, `/onboarding/age` uğranmadı.
- `profile.onboarding_completed` muhtemelen `true` default veya guard yok.

### BUG-002 — Email OTP skip
- `/auth/verify` sayfası açılmadı.
- `auth.users.email_confirmed_at` null ihtimali yüksek (doğrulanamadı, prod read-only).
- Supabase auth ayarlarında "Confirm email" disabled veya frontend handler bypass.

### BUG-008 — Tema reset
- /auth/* light mode, /dashboard dark default.
- Yeni user'da `localStorage.iyibiri-theme: null`.
- ThemeProvider scope farklı, initial value farklı.

**Ortak özellik:** Üçü de "signup → dashboard arası state korunmadı/aktarılmadı" pattern'i.

## Önerilen sistemik fix

Tek bir **auth gate middleware** zinciri:

```typescript
// middleware.ts (Next.js)
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(req: NextRequest) {
  const supabase = createClient(req)
  const { data: { user } } = await supabase.auth.getUser()

  // Public routes
  if (req.nextUrl.pathname.startsWith('/auth') || req.nextUrl.pathname === '/') {
    return NextResponse.next()
  }

  // 1. Email confirmed check
  if (!user || !user.email_confirmed_at) {
    return NextResponse.redirect(new URL('/auth/verify', req.url))
  }

  // 2. Onboarding completed check
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    return NextResponse.redirect(new URL('/onboarding/welcome', req.url))
  }

  return NextResponse.next()
}
```

Plus:

1. **Supabase Dashboard:** Auth → Settings → "Enable email confirmations" açık.
2. **Signup endpoint:** `signUp({...})` çağrısı sonrası session === null olmalı (email confirm bekleniyor); `session !== null` ise auto-confirm var → kapat.
3. **ThemeProvider:** Tek root provider, layout.tsx'te. Auth/dashboard ayrı initial yok.

## Dosyalar etkilenen

- `middleware.ts` (yeni veya mevcut güncellenmeli)
- `app/auth/signup/page.tsx` (handler + redirect)
- `app/auth/verify/page.tsx` (var, gate olarak kullanılmalı)
- `app/onboarding/*` (gate olarak kullanılmalı)
- `app/layout.tsx` (ThemeProvider scope)
- Supabase Dashboard config

## Estimated effort

- Middleware: 2 saat
- Supabase config: 15 dk
- ThemeProvider unify: 1 saat
- Test: 1 saat
**Toplam:** ~4-5 saat

## Handoff

- **Lead:** auth-capacitor (post-signup flow + Supabase auth config)
- **Support:** supabase-backend (Supabase Dashboard ayar) + frontend-engineer (middleware + ThemeProvider)
- **Acil mi:** P0 — KVKK + güvenlik blocker. Sıradaki sprint'in başına.

## User Manual Steps (Bahadır)

1. Supabase Dashboard → Auth → URL Configuration → "Site URL" production domain'in olduğundan emin ol.
2. Supabase Dashboard → Auth → Settings → "Confirm email" toggle'ı **enable** et (eğer disabled ise).
3. Supabase Dashboard → Auth → Email Templates → "Confirm signup" template TR copy ile (subject: "İyiBiri'ye hoş geldin — emaili doğrula", body Türkçe). 
4. Test: yeni signup yap → email gelmeli → linke tıkla → /auth/verify confirm → /onboarding/welcome'e düşmeli → causes/city/age adımlarından geç → /dashboard'a erişebilmeli.

## Handoff Log

- 2026-04-26 12:30 — test-engineer ✅ — Pattern memo açıldı.
- 2026-04-26 14:45 — auth-capacitor ✅ — middleware.ts + ThemeProvider unify done. Files: middleware.ts (UPDATE), app/layout.tsx (UPDATE), app/auth/layout.tsx (UPDATE), app/dashboard/layout.tsx (UPDATE), app/onboarding/layout.tsx (UPDATE). User Supabase Dashboard adımı `_patterns` "User Manual Steps" sonunda eklendi.
