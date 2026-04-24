'use client'

import { useState, useMemo } from 'react'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

interface Member {
  id: string
  user_id: string
  status: string
  tier: string
  joined_at: string
  expires_at: string | null
  profiles?: { id: string; name: string | null; email: string | null; avatar_url: string | null }
}

interface MembersClientProps {
  members: Member[]
  ngoId: string
}

const TIER_LABELS: Record<string, { label: string; color: string }> = {
  basic: { label: 'Temel', color: 'bg-ink-700 text-ink-300' },
  standard: { label: 'Standart', color: 'bg-gold/20 text-gold' },
  premium: { label: 'Destek', color: 'bg-gold/30 text-gold' },
  donation_based: { label: 'Bağış Bazlı', color: 'bg-domain-nature/20 text-domain-nature' },
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: '✅ Aktif', color: 'bg-success/20 text-success' },
  inactive: { label: '⏸️ Pasif', color: 'bg-ink-700 text-ink-300' },
  cooling_off: { label: '⏳ Cayma Aşamasında', color: 'bg-clay/20 text-clay' },
}

/**
 * Email masking (KVKK K7) — john.doe@example.com → joh***@example.com
 */
function maskEmail(email: string | null | undefined): string {
  if (!email) return '—'
  const [local, domain] = email.split('@')
  if (!local || !domain) return '—'
  if (local.length <= 3) return local + '***@' + domain
  return local.substring(0, 3) + '***@' + domain
}

export function MembersClient({ members, ngoId }: MembersClientProps) {
  const [filterTier, setFilterTier] = useState<'all' | 'basic' | 'standard' | 'premium' | 'donation_based'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'cooling_off'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return members.filter((m: any) => {
      const matchesTier = filterTier === 'all' || m.tier === filterTier
      const matchesStatus = filterStatus === 'all' || m.status === filterStatus
      const matchesSearch = (m.profiles?.name ?? '').toLowerCase().includes(search.toLowerCase())
      return matchesTier && matchesStatus && matchesSearch
    })
  }, [members, filterTier, filterStatus, search])

  // Empty state
  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 bg-ink-800 rounded-2xl border border-ink-700">
        <p className="text-lg font-semibold text-cream mb-1">
          Üye bulunamadı
        </p>
        <p className="text-ink-300">Filtreleri değiştirmeyi deneyin.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="space-y-3">
        {/* Tier filter */}
        <div>
          <p className="text-xs font-semibold text-ink-300 uppercase mb-2">
            Üyelik Seviyesi
          </p>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'basic', 'standard', 'premium', 'donation_based'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterTier === tier
                    ? 'bg-gold text-ink-900'
                    : 'bg-ink-800 text-cream hover:bg-ink-700 border border-ink-700'
                }`}
              >
                {tier === 'all' ? 'Tümü' : TIER_LABELS[tier]?.label ?? tier}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div>
          <p className="text-xs font-semibold text-ink-300 uppercase mb-2">
            Durum
          </p>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'inactive', 'cooling_off'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-gold text-ink-900'
                    : 'bg-ink-800 text-cream hover:bg-ink-700 border border-ink-700'
                }`}
              >
                {status === 'all' ? 'Tümü' : STATUS_LABELS[status]?.label ?? status}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Üye adı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-ink-800 rounded-2xl shadow-md border border-ink-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-700">
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase tracking-wide">
                İsim
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase tracking-wide">
                E-posta
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase tracking-wide">
                Seviye
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase tracking-wide">
                Başlama
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase tracking-wide">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase tracking-wide">
                Cayma Deadline
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700">
            {filtered.map((member) => (
              <tr key={member.id} className="hover:bg-ink-700 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-cream">
                  {member.profiles?.name || 'Anonim'}
                </td>
                <td className="px-6 py-4 text-sm text-ink-300">
                  {maskEmail(member.profiles?.email)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      TIER_LABELS[member.tier]?.color ?? 'bg-ink-700 text-ink-300'
                    }`}
                  >
                    {TIER_LABELS[member.tier]?.label ?? member.tier}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-ink-300">
                  {member.joined_at ? formatDate(member.joined_at) : '—'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      STATUS_LABELS[member.status]?.color ?? 'bg-ink-700 text-ink-300'
                    }`}
                  >
                    {STATUS_LABELS[member.status]?.label ?? member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-ink-300">
                  {member.expires_at ? formatDate(member.expires_at) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
