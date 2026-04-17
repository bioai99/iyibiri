'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface XPBarProps {
  current: number
  max: number
  label?: string
  color?: string
  className?: string
}

export function XPBar({ current, max, label, color = '#F4B942', className = '' }: XPBarProps) {
  const [mounted, setMounted] = useState(false)
  const percentage = Math.min((current / max) * 100, 100)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-text-muted">{label}</span>
          <span className="text-xs font-bold text-text-primary">
            {current.toLocaleString('tr-TR')} / {max.toLocaleString('tr-TR')}
          </span>
        </div>
      )}
      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: mounted ? `${percentage}%` : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </div>
    </div>
  )
}
