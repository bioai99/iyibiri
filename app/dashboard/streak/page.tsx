import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/queries/profiles'
import StreakClient from './streak-client'

export default async function StreakPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const profile = await getProfile(user.id)
  if (!profile) redirect('/onboarding')

  // Fetch completed missions in the last 7 days to compute day dots
  const now = new Date()
  // Get start of the current week (Monday)
  const dayOfWeek = now.getDay() // 0=Sun, 1=Mon, ...
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - mondayOffset)
  monday.setHours(0, 0, 0, 0)

  const { data: completedThisWeek } = await supabase
    .from('user_missions')
    .select('completed_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .gte('completed_at', monday.toISOString())
    .order('completed_at', { ascending: true })

  // Compute which days of the week (Mon=0 ... Sun=6) had completions
  const activeDays: number[] = []
  if (completedThisWeek) {
    for (const um of completedThisWeek) {
      if (um.completed_at) {
        const d = new Date(um.completed_at)
        const jsDay = d.getDay() // 0=Sun, 1=Mon, ...
        const idx = jsDay === 0 ? 6 : jsDay - 1 // Mon=0, Tue=1, ..., Sun=6
        if (!activeDays.includes(idx)) {
          activeDays.push(idx)
        }
      }
    }
  }

  return (
    <StreakClient
      currentStreak={profile.current_streak}
      longestStreak={profile.longest_streak}
      activeDays={activeDays}
    />
  )
}
