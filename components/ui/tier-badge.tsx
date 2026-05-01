import { cn } from '@/lib/utils'
import { TIERS, getTierByKarma } from '@/lib/tiers'

// ADR-014 Accepted (2026-04-26): tier label/emoji canonical `lib/tiers.ts`'ten okunur.
// Hardcoded array yasak — `no-magic-tier-name` lint rule (TD-009).

type Tier = 1 | 2 | 3 | 4 | 5

interface TierBadgeProps {
  tier: Tier
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'px-2 py-0.5 gap-1 text-[10px]',
  md: 'px-2.5 py-1 gap-1.5 text-[11px]',
  lg: 'px-3 py-1.5 gap-2 text-xs',
}

function StarIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M6 1l1.5 3L11 4.5l-2.5 2L9 10 6 8.3 3 10l.5-3.5L1 4.5 4.5 4z"
        fill="#E8C268"
      />
    </svg>
  )
}

export function TierBadge({ tier, showLabel = true, size = 'md', className }: TierBadgeProps) {
  const t = TIERS.find(x => x.id === tier) ?? TIERS[0]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-bold tracking-wide flex-shrink-0 whitespace-nowrap',
        'bg-[rgba(232,194,104,0.12)] border border-[rgba(232,194,104,0.32)]',
        'text-gold',
        sizeClasses[size],
        className
      )}
    >
      <StarIcon size={size === 'lg' ? 11 : 9} />
      {showLabel && <span>{t.name}</span>}
    </span>
  )
}

export function getTierFromKarma(karma: number): Tier {
  return getTierByKarma(karma).id
}
