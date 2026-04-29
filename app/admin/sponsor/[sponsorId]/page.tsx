// Vol-32-B sponsor admin overview — basit dashboard.

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ sponsorId: string }>
}

async function getCounts(sponsorId: string) {
  const supabase = await createClient()
  const [posts, rewards] = await Promise.all([
    (supabase as any)
      .from('posts')
      .select('id, published')
      .eq('sponsor_id', sponsorId)
      .eq('author_type', 'sponsor'),
    (supabase as any)
      .from('rewards')
      .select('id, active')
      .eq('sponsor_id', sponsorId),
  ])
  return {
    posts: (posts.data ?? []).length,
    publishedPosts: (posts.data ?? []).filter((p: any) => p.published).length,
    rewards: (rewards.data ?? []).length,
    activeRewards: (rewards.data ?? []).filter((r: any) => r.active).length,
  }
}

export default async function SponsorAdminDashboard({ params }: PageProps) {
  const { sponsorId } = await params
  const counts = await getCounts(sponsorId)

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">Panel</h1>
        <p className="text-ink-300 mt-1">
          Marka içeriklerin, yazıların ve ödüllerin tek yerden.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Yayınlanmış yazı"
          value={counts.publishedPosts}
          total={counts.posts}
          href={`/admin/sponsor/${sponsorId}/posts`}
        />
        <StatCard
          label="Aktif ödül"
          value={counts.activeRewards}
          total={counts.rewards}
          href={`/admin/sponsor/${sponsorId}/rewards`}
        />
        <StatCard
          label="Marka profili"
          value="—"
          total={null}
          href={`/admin/sponsor/${sponsorId}/profile`}
        />
      </div>

      <div className="rounded-2xl bg-ink-800 border border-ink-600 p-6">
        <h2 className="text-xl font-display text-cream mb-3">Hızlı işlemler</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/sponsor/${sponsorId}/posts/new`}
            className="px-5 py-2.5 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90"
          >
            + Yeni yazı
          </Link>
          <Link
            href={`/admin/sponsor/${sponsorId}/rewards/new`}
            className="px-5 py-2.5 bg-gold/15 text-gold border border-gold/40 rounded-xl font-semibold hover:bg-gold/25"
          >
            + Yeni ödül
          </Link>
          <Link
            href={`/admin/sponsor/${sponsorId}/profile`}
            className="px-5 py-2.5 bg-transparent text-ink-300 border border-ink-600 rounded-xl font-semibold hover:bg-ink-700"
          >
            Marka profilini düzenle
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  total,
  href,
}: {
  label: string
  value: string | number
  total: number | null
  href: string
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-ink-800 border border-ink-600 p-5 hover:border-gold/40 transition-colors"
    >
      <p className="text-xs uppercase tracking-widest text-ink-400 font-bold">
        {label}
      </p>
      <p className="text-3xl font-display text-cream mt-2 tabular-nums">
        {value}
        {total !== null && (
          <span className="text-base text-ink-400"> / {total}</span>
        )}
      </p>
    </Link>
  )
}
