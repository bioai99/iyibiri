import { createClient } from '../server'

/**
 * StreakSnapshot component için son N gün aktivite durumu.
 * Her gün için: kullanıcının o gün karma kazanıp kazanmadığı (karma_transactions var mı).
 *
 * Dönüş:
 *   - recentDays: son N gün için boolean[] (bugün [0], dün [1], ...)
 *   - currentStreak: profiles.current_streak (hızlı lookup)
 *   - longestStreak: profiles.longest_streak
 *   - lastActiveAt: son karma_transactions.created_at
 */

export interface StreakActivity {
  recentDays: boolean[] // index 0 = bugün, index N-1 = N-1 gün önce
  currentStreak: number
  longestStreak: number
  lastActiveAt: Date | null
}

export async function getRecentStreakActivity(
  userId: string,
  days: number = 7
): Promise<StreakActivity> {
  const supabase = await createClient()

  // Paralel fetch: profil bilgileri + son N günün karma transactions
  const [profileResult, karmaResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('current_streak, longest_streak')
      .eq('id', userId)
      .single(),
    supabase
      .from('karma_transactions')
      .select('created_at')
      .eq('user_id', userId)
      .gte(
        'created_at',
        new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      )
      .order('created_at', { ascending: false }),
  ])

  if (profileResult.error) {
    throw new Error(
      `Failed to fetch profile: ${profileResult.error.message}`
    )
  }

  // Her güne map et (timezone basit: UTC timestamp'dan gün diff al)
  const recentDays: boolean[] = Array(days).fill(false)
  const now = new Date()

  if (karmaResult.data && karmaResult.data.length > 0) {
    karmaResult.data.forEach((tx) => {
      const txDate = new Date(tx.created_at)
      // Gün farkını hesapla: 0 = bugün, 1 = dün, vb.
      const dayDiff = Math.floor(
        (now.getTime() - txDate.getTime()) / (24 * 60 * 60 * 1000)
      )
      if (dayDiff >= 0 && dayDiff < days) {
        recentDays[dayDiff] = true
      }
    })
  }

  return {
    recentDays,
    currentStreak: profileResult.data?.current_streak ?? 0,
    longestStreak: profileResult.data?.longest_streak ?? 0,
    lastActiveAt:
      karmaResult.data && karmaResult.data.length > 0
        ? new Date(karmaResult.data[0].created_at)
        : null,
  }
}
