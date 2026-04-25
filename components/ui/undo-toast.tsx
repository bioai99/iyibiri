// components/ui/undo-toast.tsx
//
// Pattern 11: Undo toast with countdown ring
// Based on Sonner (Pattern 1 already implemented)
// 5-second countdown, undo button, auto-dismiss after countdown

'use client'

import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { toast } from 'sonner'
import { useTheme } from '@/lib/theme'

export interface UndoToastProps {
  message: string
  onUndo: () => Promise<void> | void
  onFinalize: () => Promise<void> | void
  duration?: number
}

export function UndoToastWithCountdown({
  message,
  onUndo,
  onFinalize,
  duration = 5000,
}: UndoToastProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isUndoing, setIsUndoing] = useState(false)

  // Countdown timer
  useEffect(() => {
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, duration - elapsed)
      setTimeLeft(remaining)

      if (remaining === 0) {
        clearInterval(timer)
        // Auto-finalize after countdown
        onFinalize()
      }
    }, 100)

    return () => clearInterval(timer)
  }, [duration, onFinalize])

  const handleUndo = async () => {
    setIsUndoing(true)
    try {
      await onUndo()
    } catch (e) {
      console.error('Undo failed:', e)
    }
  }

  // SVG circle circumference for strokeDashoffset animation
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - timeLeft / duration)

  // Display countdown seconds
  const secondsLeft = Math.ceil(timeLeft / 1000)

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex items-center gap-3 px-4 py-3 rounded-lg border"
      style={{
        background: c.ink800,
        borderColor: c.ink700,
      }}
    >
      {/* Message */}
      <span
        className="flex-1 text-sm"
        style={{ color: c.cream }}
      >
        {message}
      </span>

      {/* Undo button */}
      <motion.button
        onClick={handleUndo}
        disabled={isUndoing}
        whileTap={{ scale: 0.97 }}
        className="font-semibold text-sm hover:opacity-80 disabled:opacity-50"
        style={{ color: c.gold }}
      >
        Geri al
      </motion.button>

      {/* Countdown ring */}
      {!shouldReduceMotion && (
        <svg
          width="44"
          height="44"
          className="flex-shrink-0"
          style={{ transformOrigin: 'center' }}
        >
          {/* Background circle */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke={c.ink600}
            strokeWidth="2"
          />
          {/* Animated countdown circle */}
          <motion.circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke={c.gold}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={shouldReduceMotion ? 0 : strokeDashoffset}
            strokeLinecap="round"
            style={{
              transformOrigin: '22px 22px',
              rotate: -90,
            }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </svg>
      )}

      {/* Countdown text (reduced motion fallback) */}
      {shouldReduceMotion && (
        <span
          className="flex-shrink-0 text-xs font-semibold"
          style={{ color: c.ink400 }}
        >
          {secondsLeft}s
        </span>
      )}
    </motion.div>
  )
}

/**
 * Show undo toast with countdown
 * Usage:
 *   showUndoToast({
 *     message: 'Görev silindi',
 *     onUndo: () => restoreMission(id),
 *     onFinalize: () => hardDeleteMission(id),
 *   })
 */
export function showUndoToast({
  message,
  onUndo,
  onFinalize,
  duration = 5000,
}: UndoToastProps) {
  toast.custom(
    (t) => (
      <UndoToastWithCountdown
        message={message}
        onUndo={() => {
          onUndo()
          toast.dismiss(t)
        }}
        onFinalize={() => {
          onFinalize()
          toast.dismiss(t)
        }}
        duration={duration}
      />
    ),
    {
      duration,
      position: 'bottom-center',
    }
  )
}
