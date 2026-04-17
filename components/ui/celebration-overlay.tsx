'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface CelebrationOverlayProps {
  show: boolean
  karmaEarned: number
  missionTitle: string
  onClose: () => void
}

export function CelebrationOverlay({ show, karmaEarned, missionTitle, onClose }: CelebrationOverlayProps) {
  useEffect(() => {
    if (!show) return
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...opts,
        origin: { y: 0.6 },
        particleCount: Math.floor(200 * particleRatio),
      })
    }
    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#F4B942', '#22C55E', '#3B82F6'] })
    fire(0.2, { spread: 60, colors: ['#F4B942', '#E09B20'] })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#F4B942', '#22C55E'] })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })

    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl"
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              🎉
            </motion.div>
            <h2 className="font-display font-extrabold text-2xl text-text-primary mb-1">
              Tebrikler!
            </h2>
            <p className="text-text-muted text-sm mb-4">
              <span className="font-semibold text-text-primary">{missionTitle}</span> görevini tamamladın
            </p>
            <motion.div
              className="flex items-center justify-center gap-2 bg-primary/10 rounded-2xl py-3 px-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              <span className="text-3xl">✨</span>
              <span className="font-display font-extrabold text-3xl text-primary">+{karmaEarned}</span>
              <span className="font-semibold text-primary/80">karma</span>
            </motion.div>
            <p className="text-xs text-text-muted mt-4">Devam etmek için dokun</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
