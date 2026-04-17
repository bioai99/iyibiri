import { cn } from '@/lib/utils'

type Tier = 1 | 2 | 3 | 4

interface TierBadgeProps {
  tier: Tier
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const tierConfig: Record<Tier, { label: string; emoji: string; color: string; bg: string }> = {
  1: { label: 'İyi Biri', emoji: '🌱', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  2: { label: 'Çok İyi Biri', emoji: '⭐', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  3: { label: 'Gerçekten İyi Biri', emoji: '🌟', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  4: { label: 'İyiliğin Öncüsü', emoji: '🏆', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

export function TierBadge({ tier, showLabel = true, size = 'md', className }: TierBadgeProps) {
  const config = tierConfig[tier]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        config.color,
        config.bg,
        sizeClasses[size],
        className
      )}
    >
      <span>{config.emoji}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}

export function getTierFromKarma(karma: number): Tier {
  if (karma < 500) return 1
  if (karma < 1500) return 2
  if (karma < 3000) return 3
  return 4
}
