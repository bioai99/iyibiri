// app/dashboard/donations/layout.tsx
// ADR-006: V1'de bağış akışı kapalı; tüm /dashboard/donations/* route'larına ComingSoonBanner wrapper.
// 2026-04-24 frontend-engineer

import { ComingSoonBanner } from '@/components/ui/coming-soon-banner'

export default function DonationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Coming soon banner — her sayfa üstünde */}
      <div className="sticky top-0 z-40 mx-4 mt-4">
        <ComingSoonBanner size="hero" feature="Bağış akışı" />
      </div>

      {/* Alt içerik — mock ama preview olarak görünür, etkileşim kapalı */}
      <div className="pointer-events-none opacity-50" aria-hidden="true">
        {children}
      </div>
    </div>
  )
}
