'use client'

/**
 * Donations page — BUG-033 fix (Vol-15) + BUG-037 dedupe (Vol-16)
 *
 * Layout (app/dashboard/donations/layout.tsx) zaten ComingSoonBanner hero gösteriyor.
 * Bu page sadece secondary CTA: "Şimdilik gönüllülük yap" → /dashboard/ngos.
 */

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useTheme } from '@/lib/theme'

export default function DonationsPage() {
  const { colors: c } = useTheme()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 32px 40px', gap: 14 }}>
      <p style={{ fontSize: 14, color: c.ink300, margin: 0, maxWidth: 360, lineHeight: 1.55 }}>
        Bu arada STK&apos;ları keşfedip gönüllü olabilir, karma biriktirebilirsin.
      </p>
      <Link
        href="/dashboard/ngos"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 24px',
          background: c.gold,
          color: c.ink,
          borderRadius: 14,
          fontWeight: 700,
          fontSize: 15,
          textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(232,194,104,0.3)',
        }}
      >
        STK&apos;ları keşfet <ChevronRight size={16} strokeWidth={2.5} />
      </Link>
    </div>
  )
}
