'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminSignOut } from '@/app/admin/actions'
import {
  LayoutDashboard,
  ListTodo,
  Plus,
  CheckSquare,
  Users,
  BarChart3,
  BookOpen,
  User,
  Settings,
  CreditCard,
  LogOut,
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
}

interface NGO {
  id: string
  name: string
}

interface AdminSidebarProps {
  user: User
  isSuper: boolean
  ngoList: NGO[]
  currentNgoId: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '' },
  { label: 'Görevler', icon: ListTodo, href: '/missions' },
  { label: 'Yeni Görev', icon: Plus, href: '/missions/new' },
  { label: 'Doğrulama', icon: CheckSquare, href: '/verifications' },
  { label: 'Üyeler', icon: Users, href: '/members' },
  { label: 'Rapor', icon: BarChart3, href: '/reports' },
  { label: 'Blog', icon: BookOpen, href: '/blog' },
  { label: 'Profil', icon: User, href: '/profile' },
  { label: 'Üyelik', icon: Settings, href: '/membership-config' },
  { label: 'Ödeme', icon: CreditCard, href: '/payments' },
]

export function AdminSidebar({
  user,
  isSuper,
  ngoList,
  currentNgoId,
  isOpen,
  onOpenChange,
}: AdminSidebarProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <>
      {/* Logo / Header */}
      <div className="h-14 border-b border-ink-700 flex items-center px-4">
        <div className="font-display font-bold text-lg text-cream">İyiBiri</div>
      </div>

      {/* NGO Selector */}
      {ngoList.length > 1 && (
        <div className="px-3 py-4 border-b border-ink-700">
          <p className="text-xs font-medium text-ink-300 uppercase mb-2">STK Seç</p>
          <select
            value={currentNgoId || ''}
            onChange={(e) => {
              if (e.target.value) {
                window.location.href = `/admin/${e.target.value}/`
              }
            }}
            className="w-full px-3 py-2 rounded-lg bg-ink-800 border border-ink-600 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {ngoList.map((ngo) => (
              <option key={ngo.id} value={ngo.id}>
                {ngo.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const href = currentNgoId ? `/admin/${currentNgoId}${item.href}` : '#'
          const isActive =
            pathname === href ||
            (item.href === '' && pathname === `/admin/${currentNgoId}`)

          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-ink-900/50 border-l-2 border-l-gold text-gold'
                  : 'text-ink-300 hover:bg-ink-800 hover:text-cream'
              }`}
              onClick={() => onOpenChange(false)}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile / Logout */}
      <div className="border-t border-ink-700 px-3 py-3">
        <div className="bg-ink-800 rounded-lg p-3 mb-3">
          <p className="text-sm font-medium text-cream">{user.name}</p>
          <p className="text-xs text-ink-300 truncate">{user.email}</p>
        </div>

        {isSuper && (
          <Link
            href="/admin/devtools"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gold hover:bg-ink-800 transition-colors mb-2"
          >
            ⚙️ Devtools
          </Link>
        )}

        <form action={adminSignOut} className="w-full">
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-ink-300 hover:bg-ink-800 hover:text-cream transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Çıkış
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar (fixed, hidden on mobile) */}
      <aside className="hidden lg:flex flex-col w-60 bg-ink-900 border-r border-ink-700">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar (drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col w-60 bg-ink-900 border-r border-ink-700 transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
