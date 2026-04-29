import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SponsorRequestsClient } from './sponsor-requests-client'

export default async function SponsorRequestsReviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: isSuper } = await (supabase as any).rpc('is_super_admin', { u: user.id })
  if (!isSuper) redirect('/admin')

  const { data: requests } = await (supabase as any)
    .from('sponsor_signup_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-ink-900 text-cream p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">
            DEVTOOLS · SUPER ADMIN
          </p>
          <h1 className="text-4xl font-display font-bold mt-2">
            Sponsor başvuruları
          </h1>
          <p className="text-ink-300 mt-1">
            Onayladığında sponsors entity yaratılır ve dashboard'da görünür.
          </p>
        </div>
        <SponsorRequestsClient requests={requests ?? []} />
      </div>
    </div>
  )
}
