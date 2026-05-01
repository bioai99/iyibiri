import { describe, it, expect } from 'vitest'
import { AuthError, authErrorToResult } from './guards'

// Not: requireUser/requireNgoAdmin/requireSuperAdmin entegrasyon testi gerektirir
// (Supabase mock client). Bu dosya AuthError + authErrorToResult unit testleri.
// Integration testleri için ayrı `lib/auth/guards.integration.test.ts` (Faz 4).

describe('lib/auth/guards — AuthError', () => {
  it('AuthError code + message', () => {
    const err = new AuthError('AUTH_REQUIRED', 'Önce giriş yap.')
    expect(err.code).toBe('AUTH_REQUIRED')
    expect(err.message).toBe('Önce giriş yap.')
    expect(err.name).toBe('AuthError')
  })

  it('AuthError default message = code', () => {
    const err = new AuthError('NGO_ADMIN_REQUIRED')
    expect(err.message).toBe('NGO_ADMIN_REQUIRED')
  })

  it('AuthError instanceof Error', () => {
    const err = new AuthError('SUPER_ADMIN_REQUIRED')
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(AuthError)
  })

  it('authErrorToResult format', () => {
    const err = new AuthError('NGO_ADMIN_REQUIRED', 'Bu STK için yetkin yok.')
    const result = authErrorToResult(err)
    expect(result).toEqual({
      ok: false,
      error: 'Bu STK için yetkin yok.',
      code: 'NGO_ADMIN_REQUIRED',
    })
  })

  it('4 farklı AuthErrorCode kabul edilir', () => {
    const codes: Array<'AUTH_REQUIRED' | 'NGO_ADMIN_REQUIRED' | 'SUPER_ADMIN_REQUIRED' | 'SPONSOR_ADMIN_REQUIRED'> = [
      'AUTH_REQUIRED',
      'NGO_ADMIN_REQUIRED',
      'SUPER_ADMIN_REQUIRED',
      'SPONSOR_ADMIN_REQUIRED',
    ]
    codes.forEach(code => {
      const err = new AuthError(code)
      expect(err.code).toBe(code)
    })
  })
})
