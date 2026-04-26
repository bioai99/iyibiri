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

  // Karma transactions — son 100
  const { data: txs, error } = await supabase
    .from('karma_transactions')
    .select('id, amount, type, reference_id, description, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Karma transactions fetch error:', error)
  }

  // Profile karma_total
  const { data: profile } = await supabase
    .from('profiles')
    .select('karma_total')
    .eq('id', user.id)
    .single()

  return (
    <KarmaHistoryClient
      transactions={txs ?? []}
      karmaTotal={profile?.karma_total ?? 0}
    />
  )
}
