import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getUserMissions } from '@/lib/supabase/queries/missions'
import { TierBadge, getTierFromKarma } from '@/components/ui/tier-badge'
import { XPBar } from '@/components/ui/xp-bar'
import { StreakFlame } from '@/components/ui/streak-flame'
import { KarmaCounter } from '@/components/ui/karma-counter'
import Link from 'next/link'

const tierThresholds: Record<number, number> = { 1: 500, 2: 1500, 3: 3000, 4: Infinity }

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, userMissions] = await Promise.all([
    getProfile(user.id),
    getUserMissions(user.id),
  ])

  if (!profile) redirect('/auth/login')

  const completedCount = userMissions.filter(m => m.status === 'completed').length
  const tier = getTierFromKarma(profile.karma_total)
  const nextThreshold = tierThresholds[tier]
  const prevThreshold = tier === 1 ? 0 : tierThresholds[tier - 1]

  async function handleLogout() {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-white border-b border-border px-4 pt-12 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-3xl">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name ?? ''} className="w-full h-full object-cover rounded-2xl" />
            ) : '👤'}
          </div>
          <div className="flex-1">
            <h1 className="font-display font-extrabold text-xl text-text-primary">
              {profile.name ?? 'İsimsiz Kullanıcı'}
            </h1>
            <TierBadge tier={tier} size="sm" className="mt-1" />
          </div>
          <Link href="/dashboard/profile/edit" className="text-sm text-primary font-semibold">
            Düzenle
          </Link>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-border p-4 text-center">
            <KarmaCounter value={profile.karma_total} size="lg" className="text-primary block" />
            <span className="text-xs text-text-muted mt-1 block">toplam karma</span>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4 flex items-center justify-center">
            <StreakFlame streak={profile.streak} />
          </div>
        </div>

        {nextThreshold !== Infinity && (
          <div className="bg-white rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-text-primary mb-3">Sonraki seviye</p>
            <XPBar
              current={profile.karma_total - prevThreshold}
              max={nextThreshold - prevThreshold}
              label={`Tier ${tier + 1}'e`}
            />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-display font-bold text-base text-text-primary mb-3">İstatistikler</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-extrabold text-2xl font-display text-text-primary">{completedCount}</p>
              <p className="text-xs text-text-muted">tamamlanan görev</p>
            </div>
            <div>
              <p className="font-extrabold text-2xl font-display text-text-primary">{profile.level}</p>
              <p className="text-xs text-text-muted">seviye</p>
            </div>
            <div>
              <p className="font-extrabold text-2xl font-display text-primary">{profile.karma_total}</p>
              <p className="text-xs text-text-muted">karma</p>
            </div>
          </div>
        </div>

        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full py-3 text-danger border border-danger/30 rounded-xl font-semibold text-sm"
          >
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  )
}
