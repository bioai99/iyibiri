import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NgoRequestsClient } from './requests-client'

export const metadata = {
  title: 'STK Başvuruları — İyiBiri Admin',
  robots: 'noindex,nofollow',
}

interface SignupRequest {
  id: string
  ngo_name: string
  short_name: string | null
  category: string | null
  city: string | null
  website: string | null
  description: string | null
  contact_name: string
  contact_email: string
  contact_phone: string | null
  reason: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  reviewer_notes: string | null
  reviewed_at: string | null
  created_at: string
}

// Vol-27.1: Super-admin için STK signup queue UI.
// /admin/devtools/ngo-requests — listele + status değiştir.
// Onay sonrası NGO row insert + admin grant manuel SQL ile yapılır (Vol-28+'da otomatik).
export default async function NgoRequestsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Super-admin check (devtools page'in pattern'i)
  const devOK = process.env.NODE_ENV !== 'production'
  const prodDevAccess = process.env.DEV_FIXTURES_ENABLED === '1'
  if (!devOK && !prodDevAccess) {
    notFound()
  }

  if (!devOK && prodDevAccess) {
    const allow = (process.env.DEV_FIXTURE_ALLOWLIST ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    if (!user.email || !allow.includes(user.email.toLowerCase())) {
      notFound()
    }
  }

  // Tüm başvuruları listele (RLS super-admin SELECT policy ile)
  const { data: requests, error } = await (supabase as any)
    .from('ngo_signup_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('Signup requests fetch error:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          STK Başvuruları
        </h1>
        <p className="text-ink-300 mt-1">
          Public form ({' '}
          <code className="bg-ink-800 px-2 py-0.5 rounded text-xs">/onboarding/stk</code>
          ) üzerinden gelen başvuru kuyruğu. Onay sonrası{' '}
          <code className="bg-ink-800 px-2 py-0.5 rounded text-xs">ngos</code> tablosuna manuel
          insert + ngo_admin_users grant gerekli (Vol-28+ otomatik).
        </p>
      </div>

      <NgoRequestsClient
        initialRequests={(requests ?? []) as SignupRequest[]}
      />
    </div>
  )
}
