'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Search, ListChecks, Gift, User } from 'lucide-react'
import { useTheme } from '@/lib/theme'

const navItems = [
  { href: '/dashboard',          label: 'Ana Sayfa', icon: Home },
  { href: '/dashboard/discover', label: 'Keşfet',    icon: Search },
  { href: '/dashboard/missions', label: 'Görevler',  icon: ListChecks },
  { href: '/dashboard/rewards',  label: 'Ödüller',   icon: Gift },
  { href: '/dashboard/profile',  label: 'Profil',    icon: User },
]

export function BottomNav() {
  const { colors: c } = useTheme()
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0"
      style={{
        zIndex: 100,
        background: 'rgba(26,22,18,.85)',
        backdropFilter: 'blur(18px) saturate(140%)',
        borderTop: `1px solid ${c.ink600}`,
        padding: '10px 8px 28px',
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === '/dashboard'
            ? pathname === href
            : pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0' }}
          >
            <motion.div
              style={{ display: 'contents' }}
              whileTap={{ scale: 0.85 }}
              transition={{ duration: 0.1 }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    style={{
                      position: 'absolute',
                      inset: -8,
                      borderRadius: '50%',
                      background: c.goldSoft,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={22}
                  style={{ position: 'relative', color: isActive ? c.gold : c.ink300 }}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '.02em',
                  color: isActive ? c.gold : c.ink300,
                }}
              >
                {label}
              </span>
            </motion.div>
          </Link>
        )
      })}
    </nav>
  )
}
