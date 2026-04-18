'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Search, ListChecks, Gift, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard',          label: 'Ana Sayfa', icon: Home },
  { href: '/dashboard/discover', label: 'Keşfet',    icon: Search },
  { href: '/dashboard/missions', label: 'Görevler',  icon: ListChecks },
  { href: '/dashboard/rewards',  label: 'Ödüller',   icon: Gift },
  { href: '/dashboard/profile',  label: 'Profil',    icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe"
      style={{
        background: 'rgba(26,22,18,0.88)',
        backdropFilter: 'blur(18px) saturate(140%)',
        borderTop: '1px solid #3F3830',
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === href
              : pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} className="flex-1 block">
              <motion.div
                className="flex flex-col items-center gap-1 py-1"
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.1 }}
              >
                <div className="relative flex items-center justify-center w-9 h-9">
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'rgba(232,194,104,0.14)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={20}
                    className="relative transition-colors"
                    style={{ color: isActive ? '#E8C268' : '#A89E8A' }}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold tracking-wide transition-colors"
                  style={{ color: isActive ? '#E8C268' : '#A89E8A' }}
                >
                  {label}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
