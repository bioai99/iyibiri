'use client'

import React from 'react'

interface AdminMetricCardProps {
  label: string
  value: number
  icon: React.ReactNode
  trend?: number | null
}

/**
 * Admin metric card — 4 kart dashboard'da
 * Spec: bg-ink-800 rounded-2xl, number text-5xl font-black text-gold tabular-nums
 */
export function AdminMetricCard({
  label,
  value,
  icon,
  trend,
}: AdminMetricCardProps) {
  const trendColor = trend ? (trend > 0 ? 'text-success' : 'text-clay') : ''
  const trendIcon = trend ? (trend > 0 ? '↑' : '↓') : ''

  return (
    <div className="bg-ink-800 rounded-2xl shadow-md p-6 hover:shadow-lg hover:bg-ink-700 transition-all duration-200">
      {/* Icon + Label */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-ink-300 uppercase tracking-wide">
          {label}
        </p>
        <div className="text-2xl">
          {typeof icon === 'string' ? icon : icon}
        </div>
      </div>

      {/* Big Number */}
      <p className="text-5xl font-black text-gold tabular-nums font-display mb-2">
        {value}
      </p>

      {/* Trend Badge */}
      {trend !== null && trend !== undefined && (
        <p className={`text-xs font-medium ${trendColor}`}>
          {trendIcon} {Math.abs(trend)}%
        </p>
      )}
    </div>
  )
}
