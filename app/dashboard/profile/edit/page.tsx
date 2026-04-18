import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditProfileClient } from './edit-client'

export default async function ProfileEditPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, city, interests, search_radius')
    .eq('id', user.id)
    .single()

  return (
    <EditProfileClient
      userId={user.id}
      email={user.email ?? ''}
      initialName={profile?.name ?? ''}
      initialCity={profile?.city ?? ''}
      initialInterests={profile?.interests ?? []}
      initialRadius={profile?.search_radius ?? 10}
    />
  )
}
