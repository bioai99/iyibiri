'use server'

import type { ReactNode } from 'react'

interface AdminNgoLayoutProps {
  children: ReactNode
  params: Promise<{ ngoId: string }>
}

export default async function AdminNgoLayout({
  children,
  params,
}: AdminNgoLayoutProps) {
  // Per-ngo layout — child pages render inside parent layout
  return children
}
