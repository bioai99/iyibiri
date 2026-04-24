// components/ui/coming-soon-banner.tsx
// ADR-006 — V1'de bağış akışı yok; bu banner mock sayfalarda "V2'de aktif" uyarısı.
// 2026-04-24 product-analyst / frontend-engineer el birliği.

'use client'

import { Sparkles } from 'lucide-react'

type Props = {
  /** Hangi özelliğin V2'de açılacağı, tek cümlelik açıklama */
  feature?: string
  /** Küçük varyant — inline, sayfa üstünde */
  size?: 'inline' | 'hero'
}

export function ComingSoonBanner({
  feature = 'Bağış akışı',
  size = 'inline',
}: Props) {
  if (size === 'hero') {
    return (
      <div className="relative rounded-3xl border border-gold-dim/30 bg-gradient-to-br from-gold/10 to-cream/5 p-6 text-center">
        <Sparkles className="mx-auto mb-3 h-8 w-8 text-gold" strokeWidth={1.8} />
        <h3 className="font-display text-2xl font-bold text-foreground">
          {feature} yakında
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          V1'de şu an aktif değil; yakın dönemde açılıyor. Şimdilik görev
          tamamlamaya ve Karma biriktirmeye devam edebilirsin.
        </p>
      </div>
    )
  }

  return (
    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-gold-dim/30 bg-gold/5 px-4 py-3 text-sm">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2} />
      <div>
        <span className="font-semibold text-foreground">{feature} yakında.</span>{' '}
        <span className="text-muted-foreground">
          V1'de şu an aktif değil — bu sayfa önizleme amaçlıdır.
        </span>
      </div>
    </div>
  )
}
