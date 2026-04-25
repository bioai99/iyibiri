import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

    // Super-admin bypass
    const { data: isSuper } = await supabase.rpc('is_super_admin', { u: user.id })
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

    // Check if user is admin for this NGO
    const { data: isAdmin } = await supabase.rpc('is_ngo_admin', {
      u: user.id,
      n: ngoId,
    })

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

  // Onboarding flow check (only for /dashboard requests)
  if (pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('interests')
      .eq('id', user.id)
      .single()

    // No onboarding flag in DB; check if interests array is empty or null
    const hasCompleted = profile?.interests && Array.isArray(profile.interests) && profile.interests.length > 0

    if (!hasCompleted) {
      return NextResponse.redirect(new URL('/onboarding/welcome', request.url))
    }
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
