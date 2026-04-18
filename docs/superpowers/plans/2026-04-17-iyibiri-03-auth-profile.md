# İyiBiri — Plan 3: Auth & Profil

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kayıt/giriş sayfalarını design system ile yeniden yaz, profil sayfasını gerçek Supabase datası ile çalıştır.

**Architecture:** Supabase Auth (cookie-based session). Kayıt → profil trigger (Plan 1'deki SQL trigger) → onboarding. Profil sayfası server component, gerçek `profiles` tablosundan okur.

**Tech Stack:** Supabase Auth, Next.js Server Components, Framer Motion

**Bağımlılıklar:** Plan 1 (DB şeması), Plan 2 (design system bileşenleri)

---

### Task 1: Login Sayfası

**Files:**
- Modify: `app/auth/login/page.tsx`

- [ ] **Step 1: Login sayfasını yeniden yaz**

`app/auth/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-posta veya şifre hatalı')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">İyiBiri'ne Hoşgeldin</h1>
          <p className="text-text-muted text-sm mt-1">İyilik yapmaya devam et</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.p
              className="text-sm text-danger text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-white font-display font-bold text-base rounded-xl shadow-md disabled:opacity-60"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Hesabın yok mu?{' '}
          <Link href="/auth/signup" className="text-primary font-semibold">
            Kayıt ol
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Dev server'da test et**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm run dev
```

`localhost:3000/auth/login` → form görünüyor mu, giriş çalışıyor mu?

- [ ] **Step 3: Commit**

```bash
git add app/auth/login/page.tsx
git commit -m "feat: redesign login page with new design system"
```

---

### Task 2: Signup Sayfası

**Files:**
- Modify: `app/auth/signup/page.tsx`

- [ ] **Step 1: Signup sayfasını yeniden yaz**

`app/auth/signup/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">İyilik Yolculuğuna Başla</h1>
          <p className="text-text-muted text-sm mt-1">Hesap oluştur, ilk görevini al</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Adın</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="Adın Soyadın"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="En az 6 karakter"
            />
          </div>

          {error && (
            <motion.p
              className="text-sm text-danger text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-white font-display font-bold text-base rounded-xl shadow-md disabled:opacity-60"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Hesap oluşturuluyor...' : 'Başla'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Zaten hesabın var mı?{' '}
          <Link href="/auth/login" className="text-primary font-semibold">
            Giriş yap
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Test et**

`localhost:3000/auth/signup` → yeni kullanıcı kaydı çalışıyor mu?
Supabase dashboard → Authentication → Users → yeni kullanıcı göründü mü?
Supabase dashboard → Table Editor → profiles → trigger ile profil oluştu mu?

- [ ] **Step 3: Commit**

```bash
git add app/auth/signup/page.tsx
git commit -m "feat: redesign signup page, wire to supabase auth"
```

---

### Task 3: Profil Sayfası

**Files:**
- Modify: `app/dashboard/profile/page.tsx`

- [ ] **Step 1: profile/page.tsx'i server component olarak yeniden yaz**

`app/dashboard/profile/page.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getUserMissions } from '@/lib/supabase/queries/missions'
import { TierBadge, getTierFromKarma } from '@/components/ui/tier-badge'
import { XPBar } from '@/components/ui/xp-bar'
import { StreakFlame } from '@/components/ui/streak-flame'
import { KarmaCounter } from '@/components/ui/karma-counter'
import Link from 'next/link'

const tierThresholds: Record<number, number> = { 1: 500, 2: 1500, 3: 3000, 4: Infinity }

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, userMissions] = await Promise.all([
    getProfile(user.id),
    getUserMissions(user.id),
  ])

  if (!profile) redirect('/auth/login')

  const completedCount = userMissions.filter(m => m.status === 'completed').length
  const tier = getTierFromKarma(profile.karma_total)
  const nextThreshold = tierThresholds[tier]
  const prevThreshold = tier === 1 ? 0 : tierThresholds[tier - 1]

  async function handleLogout() {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 pt-12 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-3xl">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name ?? ''} className="w-full h-full object-cover rounded-2xl" />
            ) : '👤'}
          </div>
          <div className="flex-1">
            <h1 className="font-display font-extrabold text-xl text-text-primary">
              {profile.name ?? 'İsimsiz Kullanıcı'}
            </h1>
            <TierBadge tier={tier} size="sm" className="mt-1" />
          </div>
          <Link href="/dashboard/profile/edit" className="text-sm text-primary font-semibold">
            Düzenle
          </Link>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Karma & Streak */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-border p-4 text-center">
            <KarmaCounter value={profile.karma_total} size="lg" className="text-primary block" />
            <span className="text-xs text-text-muted mt-1 block">toplam karma</span>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4 flex items-center justify-center">
            <StreakFlame streak={profile.streak} />
          </div>
        </div>

        {/* XP Bar */}
        {nextThreshold !== Infinity && (
          <div className="bg-white rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-text-primary mb-3">Sonraki seviye</p>
            <XPBar
              current={profile.karma_total - prevThreshold}
              max={nextThreshold - prevThreshold}
              label={`Tier ${tier + 1}'e`}
            />
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-display font-bold text-base text-text-primary mb-3">İstatistikler</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-extrabold text-2xl font-display text-text-primary">{completedCount}</p>
              <p className="text-xs text-text-muted">tamamlanan görev</p>
            </div>
            <div>
              <p className="font-extrabold text-2xl font-display text-text-primary">{profile.level}</p>
              <p className="text-xs text-text-muted">seviye</p>
            </div>
            <div>
              <p className="font-extrabold text-2xl font-display text-primary">{profile.karma_total}</p>
              <p className="text-xs text-text-muted">karma</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full py-3 text-danger border border-danger/30 rounded-xl font-semibold text-sm"
          >
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Test et**

Giriş yapıp `localhost:3000/dashboard/profile` aç.
- Profil adı görünüyor mu?
- Karma 0 başlıyor mu?
- TierBadge "İyi Biri" gösteriyor mu?

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/profile/page.tsx
git commit -m "feat: wire profile page to supabase, add tier/karma/streak display"
```

---

### Task 4: Middleware Güncelle

**Files:**
- Modify: `middleware.ts`

- [ ] **Step 1: middleware.ts'i lib/supabase/server import'una göre güncelle**

`middleware.ts` içindeki Supabase import'ları zaten inline — değişiklik gerekmez. Ancak preview cookie kontrolünü kaldır (demo için herkese açık olacak):

`middleware.ts` içinde şu bloğu bul ve kaldır:
```typescript
// Preview access control bloğunu bul (iyibiri_preview cookie kontrolü)
// ve sil — artık preview değil, demo modunda
```

Sonraki hali (sadece auth kontrolü):

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Dashboard'a giriş yapmadan erişim → login'e yönlendir
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Giriş yapmış kullanıcı auth sayfasına gelirse → dashboard'a yönlendir
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

- [ ] **Step 2: Test et**

1. Giriş yapmadan `localhost:3000/dashboard` → `/auth/login`'e yönleniyor mu?
2. Giriş yaptıktan sonra `localhost:3000/auth/login` → `/dashboard`'a yönleniyor mu?

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: simplify middleware, remove preview gate for demo mode"
```
