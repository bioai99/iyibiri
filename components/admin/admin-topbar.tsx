'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AdminTopbarProps {
  user: User
  currentNgoId: string | null
  onMenuToggle: () => void
}

export function AdminTopbar({ user, currentNgoId, onMenuToggle }: AdminTopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="h-14 border-b border-ink-700 bg-ink-900 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left: Mobile menu toggle + breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg hover:bg-ink-800 transition-colors text-cream"
          aria-label="Menüyü aç / kapat"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb (optional, placeholder) */}
        <div className="hidden sm:flex text-sm text-ink-300">
          <span>Panelime Hoş Geldiniz</span>
        </div>
      </div>

      {/* Right: User menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-ink-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-gold">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <span className="hidden sm:inline text-sm font-medium text-cream">{user.name}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-1 bg-ink-800 border border-ink-700 rounded-lg shadow-lg min-w-48 z-20">
            <div className="p-3 border-b border-ink-700">
              <p className="text-sm font-semibold text-cream">{user.name}</p>
              <p className="text-xs text-ink-300">{user.email}</p>
            </div>
            {/* Password change link — V1.1'de implement */}
            <button
              className="w-full px-4 py-2 text-left text-sm text-ink-300 hover:bg-ink-700 hover:text-cream transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              Şifre Değiştir (V1.1)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
