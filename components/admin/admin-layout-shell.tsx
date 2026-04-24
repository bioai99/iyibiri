'use client'

import { useState } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { AdminTopbar } from './admin-topbar'

interface User {
  id: string
  name: string
  email: string
}

interface NGO {
  id: string
  name: string
}

interface AdminLayoutShellProps {
  user: User
  isSuper: boolean
  ngoList: NGO[]
  currentNgoId: string | null
  children: React.ReactNode
}

export function AdminLayoutShell({
  user,
  isSuper,
  ngoList,
  currentNgoId,
  children,
}: AdminLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-ink-900 text-cream">
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        isSuper={isSuper}
        ngoList={ngoList}
        currentNgoId={currentNgoId}
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <AdminTopbar
          user={user}
          currentNgoId={currentNgoId}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-ink-900 pb-safe">
          <div className="max-w-7xl mx-auto px-6 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
