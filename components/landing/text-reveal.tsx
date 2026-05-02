'use client'

import { motion } from 'framer-motion'

/**
 * WordReveal — Headline'ı kelime kelime stagger ile fade+slide-up reveal eder.
 *
 * Kullanım:
 *   <WordReveal text="İyilik biriktirilir." emphasis={[1]} />
 *
 * `emphasis` index'leri italic+gold ile vurgulanır (Fraunces serif italic).
 * Animation: framer-motion stagger children, premium "settle" easing.
 */
export function WordReveal({
  text,
  emphasis = [],
  className = '',
  delay = 0.1,
  per = 'word',
}: {
  text: string
  emphasis?: number[]
  className?: string
  delay?: number
  per?: 'word' | 'char'
}) {
  const tokens = per === 'word' ? text.split(' ') : Array.from(text)
  const emSet = new Set(emphasis)

  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {tokens.map((token, i) => (
        <motion.span
          key={`${token}-${i}`}
          initial={{ opacity: 0, y: '0.4em', filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
          transition={{
            duration: 0.85,
            delay: delay + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`inline-block ${
            emSet.has(i) ? 'italic text-[var(--lp-gold,#B58F3D)]' : ''
          }`}
          style={{ marginRight: per === 'word' ? '0.28em' : undefined }}
        >
          {token}
        </motion.span>
      ))}
    </span>
  )
}
