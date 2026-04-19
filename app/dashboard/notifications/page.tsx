import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NotificationsClient, { timeAgo } from './notifications-client'
import type { ActivityItem } from './notifications-client'

export default async function NotificationsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoISO = sevenDaysAgo.toISOString()

  // Fetch data in parallel
  const [karmaResult, membershipsResult, memberNgoIdsResult] = await Promise.all([
    // Recent karma transactions (last 10)
    supabase
      .from('karma_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),

    // Recent NGO memberships (joined in last 7 days)
    supabase
      .from('ngo_memberships')
      .select('id, ngo_id, joined_at, ngos(id, name)')
      .eq('user_id', user.id)
      .gte('joined_at', sevenDaysAgoISO)
      .order('joined_at', { ascending: false }),

    // Get all NGO IDs the user is a member of (for new missions)
    supabase
      .from('ngo_memberships')
      .select('ngo_id')
      .eq('user_id', user.id)
      .eq('status', 'active'),
  ])

  // Fetch new missions from member NGOs (last 7 days)
  const memberNgoIds = (memberNgoIdsResult.data ?? []).map((m) => m.ngo_id)
  let newMissions: { id: string; title: string; ngo_id: string | null; created_at?: string; ngos: { name: string } | null }[] = []

  if (memberNgoIds.length > 0) {
    const { data } = await supabase
      .from('missions')
      .select('id, title, ngo_id, ngos(name)')
      .in('ngo_id', memberNgoIds)
      .eq('active', true)
      .order('id', { ascending: false })
      .limit(5)

    newMissions = (data ?? []) as unknown as typeof newMissions
  }

  // Build activity feed
  const activities: ActivityItem[] = []

  // Karma transactions
  const karmaTransactions = karmaResult.data ?? []
  for (const tx of karmaTransactions) {
    if (tx.type === 'mission_complete') {
      activities.push({
        kind: 'karma',
        title: `+${tx.amount} Karma kazandın`,
        sub: tx.description || 'Görev tamamlandı',
        time: timeAgo(tx.created_at),
      })
    } else if (tx.type === 'reward_redemption') {
      activities.push({
        kind: 'karma',
        title: `${tx.amount} Karma harcandı`,
        sub: tx.description || 'Ödül kullanımı',
        time: timeAgo(tx.created_at),
      })
    }
  }

  // Memberships
  const memberships = membershipsResult.data ?? []
  for (const m of memberships) {
    const ngoName = (m as unknown as { ngos: { name: string } | null }).ngos?.name ?? 'STK'
    activities.push({
      kind: 'membership',
      title: `${ngoName}'e üye oldun`,
      sub: 'Yeni üyelik',
      time: timeAgo(m.joined_at),
    })
  }

  // New missions from member NGOs
  for (const mission of newMissions) {
    const ngoName = mission.ngos?.name ?? 'STK'
    activities.push({
      kind: 'new_mission',
      title: `${ngoName} yeni görev paylaştı`,
      sub: mission.title,
      time: '',
    })
  }

  // Sort by time (most recent first) — karma transactions already have created_at order
  // We'll keep the order as-is since karma transactions come first and are already sorted

  return <NotificationsClient activities={activities} />
}
