import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AppStartPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/onboarding/welcome')
  }
}
