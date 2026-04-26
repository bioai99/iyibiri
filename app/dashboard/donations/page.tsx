'use client'

/**
 * Donations placeholder — BUG-033 fix (Vol-15)
 *
 * Bağış akışı henüz aktif değil (ADR-008 payment routing implementasyonu beklenir).
 * Placeholder: "Yakında" + STK list link.
 */

import Link from 'next/link'
import { ArrowLeft, Heart, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'

export default function DonationsPage() {
  const { colors: c } = useTheme()
  const displayFont = 'var(--font-display), Fraunces, serif'

  return (
    <div style={{ background: c.ink900, color: c.cream, minHeight: '100%', paddingBottom: 140 }}>
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>
        <h1 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 500, margin: 0, color: c.cream, letterSpacing: '-0.025em' }}>
          Bağışlar
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '80px 32px 40px',
          gap: 18,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: c.goldSoft,
            border: `1px dashed ${c.goldLine}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Heart size={36} color={c.gold} />
        </div>
        <h2 style={{ fontFamily: displayFont, fontSize: 26, fontWeight: 500, color: c.cream, margin: 0, letterSpacing: '-0.02em' }}>
          Bağışlar <em style={{ color: c.gold, fontStyle: 'italic' }}>yakında</em>
        </h2>
        <p style={{ fontSize: 15, color: c.ink300, margin: 0, maxWidth: 360, lineHeight: 1.55 }}>
          Doğrudan STK bağışları için ödeme altyapısı hazırlanıyor. Şimdilik gönüllülük yaparak destek olabilirsin.
        </p>
        <Link
          href="/dashboard/ngos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 8,
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
      </motion.div>
    </div>
  )
}
