'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, ListChecks, Heart, Gift, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Ana Sayfa', icon: Home },
  { href: '/dashboard/missions', label: 'Görevler', icon: ListChecks },
  { href: '/dashboard/ngos', label: "STK'lar", icon: Heart },
  { href: '/dashboard/rewards', label: 'Ödüller', icon: Gift },
  { href: '/dashboard/profile', label: 'Profil', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className="flex-1">
              <motion.div
                className="flex flex-col items-center gap-0.5 py-1"
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.1 }}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute -inset-1.5 bg-primary/10 rounded-full -z-10"
                      layoutId="nav-active"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}>
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
