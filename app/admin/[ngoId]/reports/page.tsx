'use server'

import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import { ReportsClient } from './reports-client'

interface ReportsPageProps {
  params: Promise<{ ngoId: string }>
}

async function getReportsData(ngoId: string) {
  const supabase = await createClient()

  // Calculate monthly data from raw missions + members
  const [
    { data: missions },
    { data: members },
  ] = await Promise.all([
    supabase
      .from('missions')
      .select('id, created_at, karma, status')
      .eq('ngo_id', ngoId),
    supabase
      .from('ngo_memberships')
      .select('id, started_at')
      .eq('ngo_id', ngoId),
  ])

  // Group by month
  const monthlyMap = new Map<string, any>()
  const now = new Date()

  // Initialize 12 months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = d.toISOString().split('T')[0].substring(0, 7)
    monthlyMap.set(month, {
      month,
      missions_count: 0,
      completed_count: 0,
      karma_distributed: 0,
      new_members: 0,
    })
  }

  // Aggregate missions
  missions?.forEach((m: any) => {
    const mDate = new Date(m.created_at)
    const month = mDate.toISOString().split('T')[0].substring(0, 7)
    if (monthlyMap.has(month)) {
      const stats = monthlyMap.get(month)
      stats.missions_count++
      if (m.status === 'completed') {
        stats.completed_count++
        stats.karma_distributed += m.karma || 0
      }
    }
  })

  // Aggregate members
  members?.forEach((m: any) => {
    const mDate = new Date(m.started_at)
    const month = mDate.toISOString().split('T')[0].substring(0, 7)
    if (monthlyMap.has(month)) {
      const stats = monthlyMap.get(month)
      stats.new_members++
    }
  })

  return {
    monthlyData: Array.from(monthlyMap.values()),
    error: null,
  }
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { ngoId } = await params
  const { monthlyData } = await getReportsData(ngoId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Aylık Rapor
        </h1>
        <p className="text-ink-300 mt-1">
          Son 12 ayın istatistikleri ve trendler
        </p>
      </div>

      {/* Suspense wrapper for client component */}
      <Suspense fallback={<ReportsLoadingSkeleton />}>
        <ReportsClient monthlyData={monthlyData} ngoId={ngoId} />
      </Suspense>
    </div>
  )
}

function ReportsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-ink-800 rounded-xl border border-ink-700 animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-ink-800 rounded-xl border border-ink-700 animate-pulse" />
    </div>
  )
}
