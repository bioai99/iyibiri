'use server'

import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import Link from 'next/link'
import { AdminMetricCard } from '@/components/admin/admin-metric-card'
import { AdminActivityList } from '@/components/admin/admin-activity-list'
import { TrendingUp } from 'lucide-react'

interface AdminDashboardPageProps {
  params: Promise<{ ngoId: string }>
}

async function getDashboardData(ngoId: string) {
  const supabase = await createClient()

  // 4 metrics: bu ayın karma, yeni üye, doğrulama bekleyen, trend (%)
  const [
    { count: memberCount },
    { count: verificationCount },
    { data: activityData },
  ] = await Promise.all([
    // Yeni üyeler sayısı
    supabase
      .from('ngo_memberships')
      .select('*', { count: 'exact', head: true })
      .eq('ngo_id', ngoId),

    // Doğrulama bekleyen sayısı
    supabase
      .from('user_missions')
      .select('*', { count: 'exact', head: true })
      .eq('admin_review_status', 'pending_review'),

    // Son 5 aktivite (missions)
    (supabase as any)
      .from('missions')
      .select('id, title, created_at, status')
      .eq('ngo_id', ngoId)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const newMembers = memberCount ?? 0
  const pendingVerifications = verificationCount ?? 0

  return {
    totalKarma: 250, // V1 placeholder
    newMembers,
    pendingVerifications,
    trendPercent: 5,
    recentActivities: activityData ?? [],
  }
}

export default async function AdminDashboardPage({
  params,
}: AdminDashboardPageProps) {
  const { ngoId } = await params
  const data = await getDashboardData(ngoId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Panelime Hoş Geldiniz
        </h1>
        <p className="text-ink-300 mt-1">Bu ayın özeti ve son aktiviteler</p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          label="Karma"
          value={Math.floor(data.totalKarma)}
          icon="✨"
          trend={data.trendPercent}
        />
        <AdminMetricCard
          label="Yeni Üye"
          value={data.newMembers}
          icon="👥"
          trend={2}
        />
        <AdminMetricCard
          label="Doğrulama"
          value={data.pendingVerifications}
          icon="📋"
          trend={-1}
        />
        <AdminMetricCard
          label="Trend"
          value={data.trendPercent}
          icon="📈"
          trend={null}
        />
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-xl font-semibold text-cream mb-4">
          Son Aktiviteler
        </h2>
        <AdminActivityList activities={data.recentActivities} />
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-3">
        <Link
          href={`/admin/${ngoId}/missions/new`}
          className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 transition-colors"
        >
          + Yeni Görev
        </Link>
        <Link
          href={`/admin/${ngoId}/verifications`}
          className="px-6 py-3 border border-ink-700 text-cream rounded-xl font-semibold hover:bg-ink-800 transition-colors"
        >
          Doğrulama Kuyruğu ({data.pendingVerifications})
        </Link>
      </div>
    </div>
  )
}
