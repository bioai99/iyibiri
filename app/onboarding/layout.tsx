'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider } from '@/lib/theme'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <ThemeProvider initial="light">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pathname}
          initial={{ x: '40%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-20%', opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  )
}
