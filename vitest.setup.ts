// vitest.setup.ts
// Test global setup — react-testing-library matchers + Next.js shim.
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Vol-62 Pkg-7 fix: React `cache` export Vitest jsdom ortamında stable değil.
// lib/auth/guards.ts request-scoped memoize için cache() kullanıyor; testte
// identity wrapper'a düşürüyoruz (memoize zaten production server context'inde
// çalışıyor — burada sadece type signature korunur).
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cache: <T extends (...args: any[]) => any>(fn: T): T => fn,
  }
})
