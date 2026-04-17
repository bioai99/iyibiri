// components/ui/domain-icon.tsx
import { Leaf, BookOpen, Heart, Coins, Sparkles, type LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  nature: Leaf,
  education: BookOpen,
  social: Heart,
  financial: Coins,
}

const onWhiteColor: Record<string, string> = {
  nature: 'bg-emerald-100 text-emerald-600',
  education: 'bg-blue-100 text-blue-600',
  social: 'bg-rose-100 text-rose-600',
  financial: 'bg-amber-100 text-amber-600',
  default: 'bg-stone-100 text-stone-500',
}

const sizeConfig = {
  sm: { wrapper: 'p-2 rounded-xl', px: 16 },
  md: { wrapper: 'p-2.5 rounded-xl', px: 20 },
  lg: { wrapper: 'p-3 rounded-2xl', px: 24 },
}

interface DomainIconProps {
  domain: string
  size?: 'sm' | 'md' | 'lg'
  /** 'onGradient' = white icon on gradient bg. 'onWhite' = colored icon on white bg */
  variant?: 'onGradient' | 'onWhite'
  className?: string
}

export function DomainIcon({ domain, size = 'md', variant = 'onWhite', className = '' }: DomainIconProps) {
  const Icon = iconMap[domain] ?? Sparkles
  const { wrapper, px } = sizeConfig[size]
  const colorClass = variant === 'onGradient'
    ? 'bg-white/20 text-white'
    : (onWhiteColor[domain] ?? onWhiteColor.default)

  return (
    <div className={`flex items-center justify-center flex-shrink-0 ${wrapper} ${colorClass} ${className}`}>
      <Icon size={px} strokeWidth={2} />
    </div>
  )
}
