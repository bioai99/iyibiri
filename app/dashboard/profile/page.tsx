import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import { getUserMissions } from '@/lib/supabase/queries/missions'
import { getTierFromKarma } from '@/components/ui/tier-badge'
import { XPBar } from '@/components/ui/xp-bar'
import { CheckCircle2, Sparkles, Flame, Trophy, LogOut, User } from 'lucide-react'
import Link from 'next/link'

const tierName: Record<number, string> = {
  1: 'İyi Biri',
  2: 'Çok İyi Biri',
  3: 'Gerçekten İyi Biri',
  4: 'İyiliğin Öncüsü',
}

const tierThresholds: Record<number, number> = { 1: 500, 2: 1500, 3: 3000, 4: Infinity }

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, userMissions] = await Promise.all([
    getProfile(user.id),
    getUserMissions(user.id),
  ])

  if (!profile) redirect('/onboarding')

  const completedCount = userMissions.filter(m => m.status === 'completed').length
  const tier = getTierFromKarma(profile.karma_total)
  const nextThreshold = tierThresholds[tier]
  const prevThreshold = tier === 1 ? 0 : tierThresholds[tier - 1]
  const xpCurrent = profile.karma_total - prevThreshold
  const xpMax = nextThreshold === Infinity ? prevThreshold : nextThreshold - prevThreshold

  async function handleLogout() {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  const stats = [
    { Icon: CheckCircle2, iconStyle: { background: 'rgba(52,211,153,0.15)', color: '#34d399' }, value: completedCount, label: 'Görev' },
    { Icon: Sparkles, iconStyle: { background: 'rgba(232,194,104,0.15)', color: '#E8C268' }, value: profile.karma_total, label: 'Karma' },
    { Icon: Flame, iconStyle: { background: 'rgba(251,146,60,0.15)', color: '#fb923c' }, value: profile.streak, label: 'Streak' },
    { Icon: Trophy, iconStyle: { background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }, value: tier, label: 'Seviye' },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Dark Hero */}
      <div className="bg-stone-900 rounded-b-3xl px-4 pt-12 pb-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full ring-4 ring-primary bg-stone-700 flex items-center justify-center mb-3 overflow-hidden">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.name ?? ''} className="w-full h-full object-cover" />
          ) : (
            <User size={32} style={{ color: '#A89E8A' }} />
          )}
        </div>
        <h1 className="font-display font-extrabold text-white text-2xl">
          {profile.name ?? 'İsimsiz Kullanıcı'}
        </h1>
        <div className="inline-flex items-center bg-primary/20 rounded-full px-3 py-1 mt-1 mb-4">
          <span className="text-primary text-xs font-bold">{tierName[tier]} · Seviye {tier}</span>
        </div>
        <div className="flex items-end gap-2">
          <Sparkles size={18} className="text-white/50 mb-0.5" />
          <span className="font-display font-black text-white text-5xl leading-none">
            {profile.karma_total.toLocaleString('tr-TR')}
          </span>
        </div>
        <p className="text-xs font-medium mt-1" style={{ color: '#A89E8A' }}>toplam karma</p>
        <Link href="/dashboard/profile/edit" className="text-primary text-sm font-semibold mt-3">
          Profili Düzenle
        </Link>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ Icon, iconStyle, value, label }) => (
            <div key={label} className="rounded-3xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.18)]" style={{ background: '#2E2923' }}>
              <div className="w-fit rounded-xl p-2 mb-3" style={iconStyle}>
                <Icon size={18} />
              </div>
              <p className="font-display font-black text-3xl leading-none" style={{ color: '#F4EEDF' }}>
                {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
              </p>
              <p className="text-xs mt-1" style={{ color: '#A89E8A' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tier Progress */}
        {nextThreshold !== Infinity && (
          <div className="rounded-3xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.18)]" style={{ background: '#2E2923' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-bold text-sm" style={{ color: '#F4EEDF' }}>Sonraki Seviye</p>
              <span className="text-xs font-medium" style={{ color: '#A89E8A' }}>{tierName[(tier + 1) as keyof typeof tierName]}</span>
            </div>
            <XPBar current={xpCurrent} max={xpMax} label={`${xpMax - xpCurrent} karma kaldı`} />
          </div>
        )}

        {/* Logout */}
        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full py-3 flex items-center justify-center gap-2 font-semibold text-sm" style={{ color: '#A89E8A' }}
          >
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  )
}
