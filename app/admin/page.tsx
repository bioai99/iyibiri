'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminHubPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Check if super-admin
  const { data: isSuper } = await (supabase as any).rpc('is_super_admin', { u: user.id })

  if (!isSuper) {
    // Non-super admin: redirect to their first NGO or show error
    const { data: adminUsers } = await supabase
      .from('ngo_admin_users')
      .select('ngo_id')
      .eq('user_id', user.id)
      .limit(1)

    if (adminUsers && adminUsers.length > 0) {
      redirect(`/admin/${adminUsers[0].ngo_id}/`)
    }

    // No NGO access
    redirect('/admin/login?error=unauthorized')
  }

  // Super-admin: show all NGOs
  const { data: ngos } = await supabase
    .from('ngos')
    .select('id, name, short_name, description')
    .order('name')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Admin Paneli
        </h1>
        <p className="text-ink-300 mt-2">
          Tüm STK'ları yönetin veya spesifik bir STK seçin.
        </p>
      </div>

      {/* All NGOs Grid */}
      {ngos && ngos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-cream mb-4">STK Listesi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ngos.map((ngo) => (
              <Link
                key={ngo.id}
                href={`/admin/${ngo.id}/`}
                className="block p-6 bg-ink-800 border border-ink-700 rounded-2xl hover:border-gold hover:shadow-lg transition-all duration-200 group"
              >
                <h3 className="text-lg font-semibold text-cream group-hover:text-gold transition-colors">
                  {ngo.name}
                </h3>
                {ngo.short_name && (
                  <p className="text-sm text-ink-300 mt-1">{ngo.short_name}</p>
                )}
                {ngo.description && (
                  <p className="text-sm text-ink-400 mt-2 line-clamp-2">
                    {ngo.description}
                  </p>
                )}
                <div className="mt-4 text-gold text-sm font-medium">
                  Panele Git →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Devtools Link (super-admin only) */}
      <div className="border-t border-ink-700 pt-8">
        <Link
          href="/admin/devtools"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 transition-colors"
        >
          ⚙️ Devtools
        </Link>
      </div>
    </div>
  )
}
