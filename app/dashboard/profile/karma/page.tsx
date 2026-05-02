'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Gift } from 'lucide-react'
import { KarmaHistoryClient } from './karma-history-client'

export default async function KarmaHistoryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Faz 7 (2026-05-02 perf-eng): karma_transactions ve profiles fetch'leri
  // birbirinden bağımsız — Promise.all ile paralel çalıştır. Sequential
  // await'te toplam ~300ms; paralel ~150ms. Variance'ın bir kısmı buradan.
  const [txsResult, profileResult] = await Promise.all([
    supabase
      .from('karma_transactions')
      .select('id, amount, type, reference_id, description, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('profiles')
      .select('karma_total')
      .eq('id', user.id)
      .single(),
  ])

  if (txsResult.error) {
    console.error('Karma transactions fetch error:', txsResult.error)
  }

  return (
    <KarmaHistoryClient
      transactions={txsResult.data ?? []}
      karmaTotal={profileResult.data?.karma_total ?? 0}
    />
  )
}
