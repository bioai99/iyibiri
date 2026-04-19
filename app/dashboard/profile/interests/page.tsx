import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import InterestsClient from './interests-client'

export default async function InterestsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const profile = await getProfile(user.id)
  if (!profile) redirect('/onboarding')

  return (
    <InterestsClient
      userId={user.id}
      initialInterests={profile.interests ?? []}
    />
  )
}
