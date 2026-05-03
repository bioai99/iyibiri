import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsClient } from './settings-client'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Vol-62 Pkg-4: KVKK consent timestamp settings'te göster (yasal trace)
  const { data: profile } = await supabase
    .from('profiles')
    .select('kvkk_accepted_at, kvkk_version')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <SettingsClient
      userEmail={user.email ?? ''}
      kvkkAcceptedAt={profile?.kvkk_accepted_at ?? null}
      kvkkVersion={profile?.kvkk_version ?? null}
    />
  )
}
