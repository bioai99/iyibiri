'use server'

import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import { VerificationsClient } from './verifications-client'

interface VerificationsPageProps {
  params: Promise<{ ngoId: string }>
}

async function getVerificationsData(ngoId: string) {
  const supabase = await createClient()

  // Placeholder — Doğrulama bekleyen user_missions
  // DB migration 022: user_missions.proof_url, proof_type, admin_feedback columns eklenecek
  const { data: verifications, error } = await supabase
    .from('user_missions')
    .select(
      `
      id,
      user_id,
      mission_id,
      admin_review_status,
      created_at,
      missions:mission_id(id, title, karma),
      profiles:user_id(id, name, avatar_url)
    `
    )
    .eq('admin_review_status', 'pending_review')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Verifications fetch error:', error)
    return { verifications: [], error: error.message }
  }

  // Mock data for Batch B completion
  const mockVerifications = (verifications || []).map((v: any) => ({
    ...v,
    proof_type: 'photo',
    proof_url: null,
    admin_feedback: null,
  }))

  return {
    verifications: mockVerifications,
    error: null,
  }
}

export default async function VerificationsPage({
  params,
}: VerificationsPageProps) {
  const { ngoId } = await params
  const { verifications } = await getVerificationsData(ngoId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Doğrulama Kuyruğu
        </h1>
        <p className="text-ink-300 mt-1">
          Gönüllülerin gönderdiği kanıtları incele ve onayla veya reddet
        </p>
      </div>

      {/* Suspense wrapper for client component */}
      <Suspense fallback={<VerificationLoadingSkeleton />}>
        <VerificationsClient verifications={verifications} ngoId={ngoId} />
      </Suspense>
    </div>
  )
}

function VerificationLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-32 bg-ink-800 rounded-xl border border-ink-700 animate-pulse"
        />
      ))}
    </div>
  )
}
