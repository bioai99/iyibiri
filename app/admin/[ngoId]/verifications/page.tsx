'use server'

import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import { VerificationsClient } from './verifications-client'

interface VerificationsPageProps {
  params: Promise<{ ngoId: string }>
}

async function getVerificationsData(ngoId: string) {
  const supabase = await createClient()

  // Real query — migration 022 proof columns + missions/profiles joins
  const { data, error } = await supabase
    .from('user_missions')
    .select(
      `
      id,
      user_id,
      mission_id,
      admin_review_status,
      admin_feedback,
      proof_type,
      proof_url,
      submitted_at,
      completed_at,
      verification_data,
      missions!inner(id, ngo_id, title, karma),
      profiles(id, name, avatar_url)
    `
    )
    .eq('missions.ngo_id', ngoId)
    .eq('admin_review_status', 'pending_review')
    .order('submitted_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Verifications query error:', error)
    return { verifications: [], error: error.message }
  }

  // Map to client interface (backward compat: fallback to verification_data if needed)
  const verifications = (data ?? []).map((v: any) => ({
    id: v.id,
    user_id: v.user_id,
    mission_id: v.mission_id,
    admin_review_status: v.admin_review_status,
    admin_feedback: v.admin_feedback,
    proof_type: v.proof_type ?? v.verification_data?.proof_type ?? 'auto',
    proof_url: v.proof_url ?? v.verification_data?.proof_url,
    created_at: v.submitted_at ?? v.completed_at ?? new Date().toISOString(),
    missions: v.missions ? { id: v.missions.id, title: v.missions.title, karma: v.missions.karma } : undefined,
    profiles: v.profiles ? { id: v.profiles.id, name: v.profiles.name, avatar_url: v.profiles.avatar_url } : undefined,
  }))

  return {
    verifications,
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
