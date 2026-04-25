'use client'

import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('command-palette-recent')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored).slice(0, 5))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Keyboard listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
      // Escape to close
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const handleSelect = (route: string, label: string) => {
    // Add to recent searches
    const updated = [
      label,
      ...recentSearches.filter((s) => s !== label),
    ].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('command-palette-recent', JSON.stringify(updated))

    // Navigate
    router.push(route)
    onOpenChange(false)
    setValue('')
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-ink-800 rounded-2xl shadow-2xl overflow-hidden border border-ink-700">
          {/* Header with search */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-700">
            <Search className="w-5 h-5 text-ink-400 flex-shrink-0" />
            <input
              autoFocus
              placeholder="Görev ara, sayfaya git, aksiyon yap..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 bg-transparent text-cream placeholder:text-ink-300 outline-none text-sm"
            />
            {value && (
              <button
                onClick={() => setValue('')}
                className="text-ink-400 hover:text-cream"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="max-h-[400px] overflow-y-auto">
            <Command>
              <Command.List>
                {!value && recentSearches.length > 0 && (
                  <Command.Group heading="Son Aramalar" className="overflow-hidden">
                    {recentSearches.map((search) => (
                      <Command.Item
                        key={search}
                        value={search}
                        onSelect={() => handleSelect(`/search?q=${search}`, search)}
                        className="px-4 py-2 cursor-pointer text-cream text-sm hover:bg-ink-700 aria-selected:bg-ink-700 aria-selected:text-cream"
                      >
                        <Search className="w-4 h-4 mr-2 inline text-ink-400" />
                        {search}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* Navigation */}
                <Command.Group heading="Sayfalar" className="overflow-hidden">
                  <Command.Item
                    value="dashboard"
                    onSelect={() => handleSelect('/dashboard', 'Dashboard')}
                    className="px-4 py-2 cursor-pointer text-cream text-sm hover:bg-ink-700 aria-selected:bg-ink-700 aria-selected:text-cream"
                  >
                    Dashboard
                  </Command.Item>
                  <Command.Item
                    value="missions"
                    onSelect={() => handleSelect('/dashboard/missions', 'Görevler')}
                    className="px-4 py-2 cursor-pointer text-cream text-sm hover:bg-ink-700 aria-selected:bg-ink-700 aria-selected:text-cream"
                  >
                    Görevler
                  </Command.Item>
                  <Command.Item
                    value="ngos"
                    onSelect={() => handleSelect('/dashboard/ngos', 'STK\'lar')}
                    className="px-4 py-2 cursor-pointer text-cream text-sm hover:bg-ink-700 aria-selected:bg-ink-700 aria-selected:text-cream"
                  >
                    STK&apos;lar
                  </Command.Item>
                  <Command.Item
                    value="profile"
                    onSelect={() => handleSelect('/dashboard/profile', 'Profil')}
                    className="px-4 py-2 cursor-pointer text-cream text-sm hover:bg-ink-700 aria-selected:bg-ink-700 aria-selected:text-cream"
                  >
                    Profil
                  </Command.Item>
                  <Command.Item
                    value="leaderboard"
                    onSelect={() => handleSelect('/dashboard/leaderboard', 'Lider Tahtası')}
                    className="px-4 py-2 cursor-pointer text-cream text-sm hover:bg-ink-700 aria-selected:bg-ink-700 aria-selected:text-cream"
                  >
                    Lider Tahtası
                  </Command.Item>
                  <Command.Item
                    value="rewards"
                    onSelect={() => handleSelect('/dashboard/rewards', 'Ödüller')}
                    className="px-4 py-2 cursor-pointer text-cream text-sm hover:bg-ink-700 aria-selected:bg-ink-700 aria-selected:text-cream"
                  >
                    Ödüller
                  </Command.Item>
                  <Command.Item
                    value="discover"
                    onSelect={() => handleSelect('/dashboard/discover', 'Keşfet')}
                    className="px-4 py-2 cursor-pointer text-cream text-sm hover:bg-ink-700 aria-selected:bg-ink-700 aria-selected:text-cream"
                  >
                    Keşfet
                  </Command.Item>
                  <Command.Item
                    value="notifications"
                    onSelect={() => handleSelect('/dashboard/notifications', 'Bildirimler')}
                    className="px-4 py-2 cursor-pointer text-cream text-sm hover:bg-ink-700 aria-selected:bg-ink-700 aria-selected:text-cream"
                  >
                    Bildirimler
                  </Command.Item>
                </Command.Group>

                {/* Actions */}
                <Command.Group heading="Aksiyon" className="overflow-hidden">
                  <Command.Item
                    value="new-mission"
                    onSelect={() => handleSelect('/dashboard/missions/create', 'Yeni Görev Paylaş')}
                    className="px-4 py-2 cursor-pointer text-cream text-sm hover:bg-ink-700 aria-selected:bg-ink-700 aria-selected:text-cream"
                  >
                    Yeni Görev Paylaş
                  </Command.Item>
                </Command.Group>

                {/* Help */}
                <Command.Group heading="Yardım" className="overflow-hidden">
                  <Command.Item
                    value="shortcuts"
                    onSelect={() => onOpenChange(false)}
                    className="px-4 py-2 cursor-pointer text-cream text-sm hover:bg-ink-700 aria-selected:bg-ink-700 aria-selected:text-cream"
                  >
                    <span className="text-ink-400 text-xs float-right">⌘K</span>
                    Klavye Kısayolları
                  </Command.Item>
                </Command.Group>

                {/* Empty state */}
                {value && (
                  <div className="px-4 py-8 text-center text-ink-400 text-sm">
                    Sonuç bulunamadı.
                  </div>
                )}
              </Command.List>
            </Command>
          </div>

          {/* Footer */}
          <div className="border-t border-ink-700 px-4 py-2 text-xs text-ink-400 flex justify-between">
            <span>↑↓ Seç</span>
            <span>⏎ Aç</span>
            <span>ESC Kapat</span>
          </div>
        </div>
      </div>
    </div>
  )
}
