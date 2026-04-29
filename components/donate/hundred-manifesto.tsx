'use client'

// Vol-31 %100 aktarım manifesto — bağış sekmesinin temel iş kuralı.
// Compact variant: hub'da alt bölümde, header'da kullanılır.
// Default: NGO detay sayfasında geniş varyant.

import { useTheme } from '@/lib/theme'

export function HundredManifesto({ compact = false }: { compact?: boolean }) {
  const { colors: c } = useTheme()
  return (
    <div
      style={{
        margin: '0 16px',
        padding: compact ? '12px 14px' : '18px 18px',
        borderRadius: 18,
        background: `linear-gradient(135deg, ${c.gold}18, ${c.goldSoft})`,
        border: `1px solid ${c.gold}44`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: compact ? 36 : 44,
          height: compact ? 36 : 44,
          borderRadius: '50%',
          background: c.ink900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Fraunces', ui-serif, serif",
          fontSize: compact ? 16 : 20,
          fontWeight: 600,
          color: c.gold,
          border: `1px solid ${c.gold}`,
        }}
      >
        100
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: compact ? 12 : 14,
            fontWeight: 600,
            color: c.cream,
            fontFamily: "'Fraunces', ui-serif, serif",
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
            marginBottom: 2,
          }}
        >
          Bağışın %100&apos;ü STK&apos;ya gider
        </div>
        <div style={{ fontSize: compact ? 10 : 11, color: c.ink300 }}>
          iyibiri kuruş kesmez. Para doğrudan kurumun hesabına aktarılır.
        </div>
      </div>
    </div>
  )
}
