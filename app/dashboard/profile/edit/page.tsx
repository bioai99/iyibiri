import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditProfileClient } from './edit-client'

export default async function ProfileEditPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, full_name, first_name, city, interests, search_radius')
    .eq('id', user.id)
    .single()

  // BUG-025 fix (Vol-13): legacy `name` null. Read full_name (Pattern D backfill) first.
  const initialName =
    profile?.full_name?.trim() ||
    profile?.first_name?.trim() ||
    profile?.name?.trim() ||
    ''

  return (
    <EditProfileClient
      userId={user.id}
      email={user.email ?? ''}
      initialName={initialName}
      initialCity={profile?.city ?? ''}
      initialInterests={profile?.interests ?? []}
      initialRadius={profile?.search_radius ?? 10}
    />
  )
}
