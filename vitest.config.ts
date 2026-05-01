import { defineConfig } from 'vitest/config'
import path from 'path'

// ADR-015 + TD-006 Accepted (2026-04-26): Vitest framework baseline.
// Critical logic test'leri (lib/tiers, lib/auth/guards, lib/karma-level, lib/missions)
// CI'da koşturulur; PR'larda regression yakalanır.

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['lib/**/*.test.ts', 'lib/**/*.test.tsx'],
    exclude: ['node_modules', '.next', 'out', 'android', 'ios', 'lib/missions/__test__.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
