// lib/auth/guards.ts
//
// Server action defense-in-depth — auth + tenant authorization helper'ları.
// ADR-015 Accepted (2026-04-26).
//
// Her server action'ın başında çağrılır. Middleware'in koruduğu route'larda
// gereksiz görünebilir, ama defense-in-depth: middleware bypass durumunda
// (internal call, test fixture, edge runtime) son güvenlik katmanı.
//
// Kullanım:
//   export async function createMission(ngoId: string, data: MissionData) {
//     await requireNgoAdmin(ngoId)
//     // ... business logic
//   }
//
// Hata durumu — `AuthError` throw eder; `createServerAction` wrapper veya
// outer try/catch'te yakalanır + UI'ya friendly TR mesaj döner.

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

// Perf (2026-04-26 audit TD-034): React `cache()` ile request-scoped memoize.
// Aynı request içinde 2. çağrı DB'ye gitmez — middleware ile çift roundtrip kalkar.
// `cache()` her request için ayrı instance üretir (server component scope).

export type AuthErrorCode =
  | 'AUTH_REQUIRED'
  | 'NGO_ADMIN_REQUIRED'
  | 'SUPER_ADMIN_REQUIRED'
  | 'SPONSOR_ADMIN_REQUIRED'

export class AuthError extends Error {
  code: AuthErrorCode
  constructor(code: AuthErrorCode, message?: string) {
    super(message ?? code)
    this.code = code
    this.name = 'AuthError'
  }
}

/** Tüm protected server action'ların başında çağrılır. Login değilse throw. Request-scoped cache. */
export const requireUser = cache(async (): Promise<User> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new AuthError('AUTH_REQUIRED', 'Önce giriş yap.')
  }
  return user
})

/** NGO admin işlemleri için. RLS'e ek olarak server-side double-check. Request-scoped cache. */
export const requireNgoAdmin = cache(async (ngoId: string): Promise<User> => {
  const user = await requireUser()
  const supabase = await createClient()
  // RPC tanımları lib/supabase/types.ts'te eksik (TD-005); cast ile geçici çözüm.
  // Supabase types regen sonrası `as any` kaldırılır.
  const { data: isAdmin, error } = await (supabase.rpc as any)('is_ngo_admin', {
    u: user.id,
    n: ngoId,
  })
  if (error || !isAdmin) {
    throw new AuthError('NGO_ADMIN_REQUIRED', 'Bu STK için yetkin yok.')
  }
  return user
})

/** Super admin yetkisi gerek. Request-scoped cache. */
export const requireSuperAdmin = cache(async (): Promise<User> => {
  const user = await requireUser()
  const supabase = await createClient()
  const { data: isSuper, error } = await (supabase.rpc as any)('is_super_admin', {
    u: user.id,
  })
  if (error || !isSuper) {
    throw new AuthError('SUPER_ADMIN_REQUIRED', 'Bu işlem süper-admin yetkisi gerektirir.')
  }
  return user
})

/** Sponsor admin işlemleri için. Request-scoped cache. */
export const requireSponsorAdmin = cache(async (sponsorId: string): Promise<User> => {
  const user = await requireUser()
  const supabase = await createClient()
  // is_sponsor_admin RPC'si varsa kullan; yoksa sponsor_admin_users tablosundan kontrol.
  // RPC tanımları types.ts'te eksik (TD-005); cast ile geçici.
  const { data: isAdmin, error } = await (supabase.rpc as any)('is_sponsor_admin', {
    u: user.id,
    s: sponsorId,
  })
  if (error || !isAdmin) {
    throw new AuthError('SPONSOR_ADMIN_REQUIRED', 'Bu sponsor için yetkin yok.')
  }
  return user
})

/**
 * AuthError'ı server action result'a çevirme helper'ı.
 *
 * Kullanım (try/catch ile):
 *   try {
 *     await requireNgoAdmin(ngoId)
 *     // ... business logic
 *     return { ok: true, ... }
 *   } catch (err) {
 *     if (err instanceof AuthError) return authErrorToResult(err)
 *     throw err
 *   }
 */
export function authErrorToResult(err: AuthError): { ok: false; error: string; code: AuthErrorCode } {
  return { ok: false, error: err.message, code: err.code }
}
