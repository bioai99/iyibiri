import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { NGO, Referral } from '@/lib/supabase/types'
import { MembershipSuccessClient } from './success-client'
import { MembershipCelebrationClient } from './celebration-client'

interface PageProps {
  params: { id: string }
  searchParams: {
    ref?: string
    status?: string
    code?: string
  }
}

export default async function MembershipSuccessPage({
  params,
  searchParams,
}: PageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // NGO lookup (her iki varyantta da gerekli)
  const { data: ngoData } = await supabase
    .from('ngos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!ngoData) redirect('/dashboard/ngos')
  const ngo = ngoData as NGO

  // Varyant A — yeni flow: `?ref=` varsa referral üzerinden confirmMembership çağrılacak.
  //   - status=success veya yok → client confirm + celebration
  //   - status=failed            → geri dön + error göster
  //   - status=cancelled         → membership'e geri yönlendir
  if (searchParams.ref) {
    if (searchParams.status === 'cancelled') {
      redirect(`/dashboard/ngos/${ngo.id}/membership`)
    }
    if (searchParams.status === 'failed') {
      const url = `/dashboard/ngos/${ngo.id}/membership?error=${encodeURIComponent(
        searchParams.code ?? 'GENERIC',
      )}`
      redirect(url)
    }

    // Referral'ı oku — başarılı ödemeyi confirm et (idempotent)
    const { data: referralData } = await supabase
      .from('referrals')
      .select('id, user_id, ngo_id, status, amount_try, metadata')
      .eq('id', searchParams.ref)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!referralData) {
      // Ref geçersiz → legacy flow'a düş
      return <MembershipSuccessClient ngo={ngo} isPending={false} />
    }

    const referral = referralData as Referral
    const metadata = (referral.metadata as Record<string, unknown> | null) ?? {}
    const tierId = (metadata.tier_id as string | undefined) ?? undefined
    const customAmount = (metadata.custom_amount as number | undefined) ?? undefined

    return (
      <MembershipCelebrationClient
        ngo={ngo}
        referralId={referral.id}
        amount={referral.amount_try ?? 0}
        tierId={tierId}
        customAmount={customAmount}
        alreadyConfirmed={referral.status === 'confirmed'}
      />
    )
  }

  // Varyant B — legacy: membership direkt insert edilmiş (eski tek-sayfa form)
  const { data: membershipData } = await supabase
    .from('ngo_memberships')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('ngo_id', params.id)
    .order('joined_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <MembershipSuccessClient
      ngo={ngo}
      isPending={membershipData?.status === 'pending'}
    />
  )
}
