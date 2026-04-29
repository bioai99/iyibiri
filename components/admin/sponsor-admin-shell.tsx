'use client'

// Vol-32-B sponsor admin shell — sidebar + content wrapper.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  LayoutDashboard,
  User,
  FileText,
  Gift,
  ChevronLeft,
} from 'lucide-react'

interface Props {
  sponsorId: string
  sponsorName: string
  isSuperAdmin: boolean
  children: ReactNode
}

const NAV = [
  { label: 'Panel', icon: LayoutDashboard, href: '' },
  { label: 'Marka Profili', icon: User, href: '/profile' },
  { label: 'Yazılar', icon: FileText, href: '/posts' },
  { label: 'Ödüller', icon: Gift, href: '/rewards' },
]

export function SponsorAdminShell({
  sponsorId,
  sponsorName,
  isSuperAdmin,
  children,
}: Props) {
  const pathname = usePathname()
  const base = `/admin/sponsor/${sponsorId}`
  return (
    <div className="min-h-screen bg-ink-900 text-cream flex">
      <aside className="w-64 bg-ink-800 border-r border-ink-600 px-4 py-6 flex flex-col gap-1">
        <div className="px-3 py-4 mb-2">
          <p className="text-xs uppercase tracking-widest text-gold font-bold">
            SPONSOR PANELİ
          </p>
          <h2 className="text-lg font-display text-cream mt-1 truncate">
            {sponsorName}
          </h2>
          {isSuperAdmin && (
            <span className="inline-block mt-2 text-[10px] uppercase tracking-widest text-gold border border-gold/40 rounded px-2 py-0.5">
              super-admin
            </span>
          )}
        </div>
        {NAV.map((item) => {
          const href = base + item.href
          const active = pathname === href || (item.href && pathname.startsWith(href))
          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-gold/15 text-gold' : 'text-ink-300 hover:bg-ink-700'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          )
        })}
        <div className="mt-auto pt-4 border-t border-ink-600">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-ink-400 hover:text-cream"
          >
            <ChevronLeft size={14} /> Diğer panellere
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
