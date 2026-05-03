'use client'

// Vol-59.1 PageHeroBar — reusable hero detay sayfası top bar (geri + paylaş).
//
// Hero photo + dark scrim üzerinde her zaman LIGHT (cream) glass button
// gösterir — app mode'una bağımsız (mission/campaign/post detail için ortak).
// Daha önce her sayfa kendi inline IconButton'unu yazıyordu (3+ yerde
// tekrarlama, light mode'da invisible bug'ı). Artık tek import.
//
// Kullanım:
//   <PageHeroBar
//     backHref="/dashboard/donate"
//     onShare={() => navigator.share({...})}
//     theme="dark"  // hero scrim üstü → cream button (default)
//     // veya
//     theme="auto"  // app mode'a göre — plain background için
//   />

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Share2 } from 'lucide-react'
import { IconButtonDS } from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'

interface Props {
  /** Geri butonu hedefi. Verilmezse router.back() kullanılır. */
  backHref?: string
  /** Geri butonu aria-label (default "Geri") */
  backAriaLabel?: string
  /** Paylaş butonu handler — verilmezse paylaş butonu render edilmez */
  onShare?: () => void
  /** Paylaş butonu aria-label (default "Paylaş") */
  shareAriaLabel?: string
  /**
   * 'dark' = scrim üstü için cream glass button (her zaman, app mode bağımsız).
   * 'light' = light background üstü için ink glass button.
   * 'auto' = app mode'a göre (plain page için).
   */
  theme?: 'dark' | 'light' | 'auto'
  /** Top offset — default safe-area + 12px */
  topOffset?: string
}

export function PageHeroBar({
  backHref,
  backAriaLabel = 'Geri',
  onShare,
  shareAriaLabel = 'Paylaş',
  theme = 'dark',
  topOffset = 'calc(env(safe-area-inset-top, 20px) + 12px)',
}: Props) {
  const router = useRouter()
  const { mode } = useTheme()
  const resolved: 'dark' | 'light' = theme === 'auto' ? (mode === 'light' ? 'light' : 'dark') : theme

  const backButton = (
    <IconButtonDS
      icon={<ArrowLeft size={18} />}
      ariaLabel={backAriaLabel}
      theme={resolved}
    />
  )

  return (
    <div
      style={{
        position: 'absolute',
        top: topOffset,
        left: 16,
        right: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        pointerEvents: 'none', // butonlar pointer-events: auto'ya çevirir
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        {backHref ? (
          <Link href={backHref} aria-label={backAriaLabel} style={{ textDecoration: 'none' }}>
            {backButton}
          </Link>
        ) : (
          <span onClick={() => router.back()} role="button" tabIndex={0} aria-label={backAriaLabel}>
            {backButton}
          </span>
        )}
      </div>
      {onShare && (
        <div style={{ pointerEvents: 'auto' }}>
          <IconButtonDS
            icon={<Share2 size={16} />}
            ariaLabel={shareAriaLabel}
            theme={resolved}
            onClick={onShare}
          />
        </div>
      )}
    </div>
  )
}
