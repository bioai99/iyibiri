// Vol-33 BUG-064 debug — server-rendered sponsors + sponsor_signup_requests dump.
// Hidrasyon + client state'inden bağımsız: gerçek DB durumunu görmek için.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SponsorDebugPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: isSuper } = await (supabase as any).rpc('is_super_admin', { u: user.id })
  if (!isSuper) redirect('/admin')

  const [sponsorsRes, requestsRes, adminUsersRes] = await Promise.all([
    (supabase as any)
      .from('sponsors')
      .select('id, name, is_active, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
    (supabase as any)
      .from('sponsor_signup_requests')
      .select('id, brand_name, status, approved_sponsor_id, created_at, reviewed_at, rejection_reason')
      .order('created_at', { ascending: false })
      .limit(10),
    (supabase as any)
      .from('sponsor_admin_users')
      .select('id, sponsor_id, user_id, role, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  return (
    <div className="min-h-screen bg-ink-900 text-cream p-8 font-mono text-xs">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-display font-bold">
          Sponsor Debug — server-side dump
        </h1>

        <section>
          <h2 className="text-gold font-bold mb-2">sponsors (last 20)</h2>
          {sponsorsRes.error && (
            <pre className="text-red-300">err: {sponsorsRes.error.message}</pre>
          )}
          <pre className="bg-ink-800 p-3 rounded">
            {JSON.stringify(sponsorsRes.data, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-gold font-bold mb-2">sponsor_signup_requests (last 10)</h2>
          {requestsRes.error && (
            <pre className="text-red-300">err: {requestsRes.error.message}</pre>
          )}
          <pre className="bg-ink-800 p-3 rounded">
            {JSON.stringify(requestsRes.data, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-gold font-bold mb-2">sponsor_admin_users (last 20)</h2>
          {adminUsersRes.error && (
            <pre className="text-red-300">err: {adminUsersRes.error.message}</pre>
          )}
          <pre className="bg-ink-800 p-3 rounded">
            {JSON.stringify(adminUsersRes.data, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  )
}
