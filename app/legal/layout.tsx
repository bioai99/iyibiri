'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'

/**
 * Legal pages shared layout — BUG-035 fix (Vol-15)
 *
 * MVP placeholder: structured page chrome + back nav.
 * Content per-page in respective page.tsx (KVKK, gizlilik, kullanım).
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const { colors: c } = useTheme()
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  return (
    <div style={{ minHeight: '100vh', background: c.ink900, color: c.cream, fontFamily: uiFont }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 24px 80px' }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
            <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
