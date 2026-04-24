'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Trash2, Edit } from 'lucide-react'

interface Mission {
  id: string
  title: string
  domain: string | null
  karma: number
  status: 'draft' | 'active' | 'cancelled' | 'completed'
  created_at: string
}

interface AdminMissionsClientProps {
  missions: Mission[]
  ngoId: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: '📝 Taslak', color: 'bg-ink-700 text-ink-300' },
  active: { label: '✅ Yayında', color: 'bg-success/20 text-success' },
  cancelled: { label: '✖️ İptal', color: 'bg-clay/20 text-clay' },
  completed: { label: '✓ Tamamlandı', color: 'bg-success/20 text-success' },
}

const DOMAIN_LABELS: Record<string, string> = {
  nature: 'Doğa',
  education: 'Eğitim',
  health: 'Sağlık',
  social: 'Sosyal',
  environment: 'Çevre',
  culture: 'Kültür',
}

export function AdminMissionsClient({
  missions,
  ngoId,
}: AdminMissionsClientProps) {
  const [filter, setFilter] = useState<'all' | 'draft' | 'active' | 'cancelled' | 'completed'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return missions.filter((m) => {
      const matchesStatus = filter === 'all' || m.status === filter
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [missions, filter, search])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {['all', 'draft', 'active', 'cancelled', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-gold text-ink-900'
                : 'bg-ink-800 text-cream hover:bg-ink-700'
            }`}
          >
            {status === 'all' ? 'Tümü' : STATUS_LABELS[status]?.label ?? status}
          </button>
        ))}
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Görev adı ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-ink-800 rounded-2xl shadow-md border border-ink-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-700">
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase tracking-wide">
                Başlık
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase tracking-wide">
                Domain
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase tracking-wide">
                Karma
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-cream uppercase tracking-wide">
                Aksiyonlar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-ink-300">
                  Görev bulunamadı
                </td>
              </tr>
            ) : (
              filtered.map((mission) => (
                <tr
                  key={mission.id}
                  className="hover:bg-ink-700 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-cream">
                    {mission.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-300">
                    {mission.domain ? DOMAIN_LABELS[mission.domain] ?? mission.domain : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gold">
                    {mission.karma} puan
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_LABELS[mission.status]?.color
                      }`}
                    >
                      {STATUS_LABELS[mission.status]?.label ?? mission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/${ngoId}/missions/${mission.id}/edit`}
                        className="p-2 rounded-lg bg-ink-700 hover:bg-ink-600 transition-colors text-cream"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 rounded-lg bg-clay/20 hover:bg-clay/30 transition-colors text-clay"
                        title="Sil"
                        onClick={() => alert('Delete functionality — V1.1')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-ink-300">
        {filtered.length} görev gösteriliyor {filtered.length !== missions.length ? ` (toplam ${missions.length})` : ''}
      </p>
    </div>
  )
}
