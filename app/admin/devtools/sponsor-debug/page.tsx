// Vol-33 BUG-064 debug — server-rendered DB dump + test approve action.
// Hidrasyon + client state'inden bağımsız: gerçek DB durumunu + action dönüş
// değerini görmek için.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { approveSponsorRequest } from '@/lib/admin/sponsor-request-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function testApprove(formData: FormData) {
  'use server'
  const requestId = String(formData.get('requestId') ?? '')
  if (!requestId) redirect('/admin/devtools/sponsor-debug?err=no-request-id')
  const res = await approveSponsorRequest(requestId, { adminUserId: null })
  const params = new URLSearchParams()
  params.set('success', String(res.success))
  if (res.sponsorId) params.set('sponsorId', res.sponsorId)
  if (res.error) params.set('error', res.error)
  redirect(`/admin/devtools/sponsor-debug?${params.toString()}`)
}

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function SponsorDebugPage({ searchParams }: PageProps) {
  const params = await searchParams
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

  const pending = (requestsRes.data ?? []).filter(
    (r: any) => r.status === 'pending',
  )

  return (
    <div className="min-h-screen bg-ink-900 text-cream p-8 font-mono text-xs">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-display font-bold">
          Sponsor Debug — server-side dump
        </h1>

        {/* Vol-33 BUG-064 — server-side test approve */}
        <section className="rounded-xl border border-gold/40 bg-gold/5 p-4">
          <h2 className="text-gold font-bold mb-3">Test approve (server-side)</h2>
          {('success' in params) && (
            <pre
              className={`p-3 rounded mb-3 ${
                params.success === 'true'
                  ? 'bg-green-500/10 text-green-300'
                  : 'bg-red-500/10 text-red-300'
              }`}
            >
              {JSON.stringify(
                {
                  success: params.success,
                  sponsorId: params.sponsorId ?? null,
                  error: params.error ?? null,
                },
                null,
                2,
              )}
            </pre>
          )}
          {pending.length === 0 ? (
            <p className="text-ink-300">Pending başvuru yok — debug için /onboarding/sponsor üzerinden bir tane oluştur.</p>
          ) : (
            <div className="space-y-2">
              {pending.map((r: any) => (
                <form key={r.id} action={testApprove}>
                  <input type="hidden" name="requestId" value={r.id} />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-green-500/20 text-green-300 border border-green-500/40 rounded text-xs"
                  >
                    Test approve → {r.brand_name} ({r.id.slice(0, 8)})
                  </button>
                </form>
              ))}
            </div>
          )}
        </section>

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
