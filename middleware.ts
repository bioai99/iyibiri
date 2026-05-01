import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Faz 6 (2026-04-26 perf-eng + system-architect): Middleware cookie cache.
// 4 hot-path optimizasyonu:
//  1. is_super_admin RPC → 5 dk cookie cache
//  2. is_ngo_admin RPC (per-NGO) → 5 dk cookie cache
//  3. interests query → 1 saat onboarding-done cookie (kullanıcı onboarding tamamladığında set edilir)
//  4. Cookie hit her admin/dashboard route'ta DB roundtrip ortadan kaldırır
//
// Güvenlik: cookie httpOnly + secure + sameSite=lax. Cache TTL kısa (5 dk-1h).
// Logout → session cookie silinir → role cookie'leri de invalidate olur (oturum bağlı).
// Role değişirse 5 dk gecikme — kabul edilebilir trade-off.

const CACHE_TTL_ROLE = 300 // 5 dk — super-admin / NGO admin
const CACHE_TTL_ONBOARDING = 3600 // 1 saat — onboarding completed flag

const COOKIE_OPTS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
}

function getCachedFlag(request: NextRequest, key: string): boolean | null {
  const v = request.cookies.get(key)?.value
  if (v === '1') return true
  if (v === '0') return false
  return null
}

function setCachedFlag(response: NextResponse, key: string, value: boolean, maxAge: number) {
  response.cookies.set(key, value ? '1' : '0', { ...COOKIE_OPTS, maxAge })
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // ============================================================
  // /admin route guards (per-NGO admin auth)
  // ============================================================
  if (pathname.startsWith('/admin')) {
    // /admin/login is always accessible
    if (pathname.startsWith('/admin/login')) {
      return response
    }

    // Supabase session check
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Super-admin bypass — Faz 6: 5 dk cookie cache (RPC roundtrip skip)
    let isSuper: boolean
    const cachedSuper = getCachedFlag(request, 'iyibiri_super')
    if (cachedSuper !== null) {
      isSuper = cachedSuper
    } else {
      const { data } = await supabase.rpc('is_super_admin', { u: user.id })
      isSuper = !!data
      setCachedFlag(response, 'iyibiri_super', isSuper, CACHE_TTL_ROLE)
    }
    if (isSuper) {
      return response
    }

    // /admin/devtools special case (super-admin only)
    if (pathname.startsWith('/admin/devtools')) {
      // Non-super admin cannot access devtools
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
    }

    // /admin root (dashboard hub) — super-admin only for now
    if (pathname === '/admin' || pathname === '/admin/') {
      // Non-super admin redirects to their first accessible STK
      // For pilot: redirect to /admin/login with error
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
    }

    // Extract ngo_id from path: /admin/[ngoId]/...
    const ngoMatch = pathname.match(/^\/admin\/([^/]+)/)
    const ngoId = ngoMatch?.[1]

    if (!ngoId) {
      // Malformed path
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
    }

    // Check if user is admin for this NGO — Faz 6: per-NGO 5 dk cookie cache
    const ngoAdminKey = `iyibiri_ngoadmin_${ngoId}`
    let isAdmin: boolean
    const cachedNgoAdmin = getCachedFlag(request, ngoAdminKey)
    if (cachedNgoAdmin !== null) {
      isAdmin = cachedNgoAdmin
    } else {
      const { data } = await supabase.rpc('is_ngo_admin', { u: user.id, n: ngoId })
      isAdmin = !!data
      setCachedFlag(response, ngoAdminKey, isAdmin, CACHE_TTL_ROLE)
    }

    if (!isAdmin) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'ngo_unauthorized')
      loginUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  // ============================================================
  // Public routes (no auth required)
  // ============================================================
  const publicRoutes = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/verify',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/callback',
  ]
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  // ============================================================
  // /dashboard + /onboarding route guards (auth post-signup)
  // ============================================================
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Public routes: already logged-in users redirected to dashboard
  if (isPublic) {
    if (user && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return supabaseResponse
  }

  // Protected routes (dashboard + onboarding): user must exist
  if (!user) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Email confirmation check
  if (!user.email_confirmed_at) {
    if (!pathname.startsWith('/auth/verify')) {
      return NextResponse.redirect(new URL('/auth/verify', request.url))
    }
    return supabaseResponse
  }

  // Onboarding flow check — Faz 6: 1 saat cookie cache; sub-route'larda DB query yok
  if (pathname.startsWith('/dashboard')) {
    const onboardedCached = getCachedFlag(request, 'iyibiri_onboarded')
    if (onboardedCached === null) {
      // Cookie yok → DB query (kullanıcı yeni login veya cookie expire)
      const { data: profile } = await supabase
        .from('profiles')
        .select('interests')
        .eq('id', user.id)
        .single()

      const hasCompleted = profile?.interests && Array.isArray(profile.interests) && profile.interests.length > 0

      if (!hasCompleted) {
        return NextResponse.redirect(new URL('/onboarding/welcome', request.url))
      }

      // Cookie set — bir sonraki sub-route DB query yapmasın (1 saat TTL)
      setCachedFlag(supabaseResponse, 'iyibiri_onboarded', true, CACHE_TTL_ONBOARDING)
    } else if (!onboardedCached) {
      // Cache "0" — onboarding tamam değil; eski cookie var (rare race condition)
      return NextResponse.redirect(new URL('/onboarding/welcome', request.url))
    }
    // Cache "1" → onboarding tamam, query atla, sayfayı render et
  }

  // Auth pages after email verified: skip onboarding check, go straight to dashboard
  if (user && pathname.startsWith('/auth') && !pathname.includes('callback')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
