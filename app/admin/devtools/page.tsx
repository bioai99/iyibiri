import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DevtoolsClient } from './devtools-client'

export const metadata = {
  title: 'Devtools — İyiBiri Admin',
  robots: 'noindex,nofollow',
}

export default async function DevtoolsPage() {
  // Production'da sadece `DEV_FIXTURES_ENABLED=1` + allowlist ile erişilebilir;
  // aksi halde 404.
  const devOK = process.env.NODE_ENV !== 'production'
  const prodDevAccess = process.env.DEV_FIXTURES_ENABLED === '1'
  if (!devOK && !prodDevAccess) {
    notFound()
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Production allowlist check
  if (!devOK && prodDevAccess) {
    const allow = (process.env.DEV_FIXTURE_ALLOWLIST ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    if (!user.email || !allow.includes(user.email.toLowerCase())) {
      notFound()
    }
  }

  // Current fixture state snapshot
  const [
    { data: profile },
    { count: membershipCount },
    { count: userMissionCount },
    { count: karmaCount },
    { count: referralCount },
    { count: ngoSeedCount },
    { count: missionSeedCount },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, name, email, karma_total')
      .eq('id', user.id)
      .single(),
    supabase
      .from('ngo_memberships')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('user_missions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('karma_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase.from('ngos').select('*', { count: 'exact', head: true }),
    supabase.from('missions').select('*', { count: 'exact', head: true }),
  ])

  return (
    <DevtoolsClient
      profile={profile}
      currentState={{
        memberships: membershipCount ?? 0,
        userMissions: userMissionCount ?? 0,
        karmaTransactions: karmaCount ?? 0,
        referrals: referralCount ?? 0,
      }}
      seedHealth={{
        ngoCount: ngoSeedCount ?? 0,
        missionCount: missionSeedCount ?? 0,
      }}
      nodeEnv={process.env.NODE_ENV ?? 'unknown'}
    />
  )
}
