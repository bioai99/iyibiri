'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Edit, QrCode } from 'lucide-react'
import { deleteMission } from '@/lib/admin/missions-actions'

interface Mission {
  id: string
  title: string
  // BUG-048 fix (Vol-21): missions tablosunda `domain` yok, `category` var; `created_at` yok, `event_date` var.
  category: string | null
  karma: number
  status: 'draft' | 'active' | 'cancelled' | 'completed'
  event_date: string | null
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
  animals: 'Hayvanlar',
  disaster: 'Afet',
  community: 'Topluluk',
}

export function AdminMissionsClient({
  missions,
  ngoId,
}: AdminMissionsClientProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [filter, setFilter] = useState<'all' | 'draft' | 'active' | 'cancelled' | 'completed'>('all')
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return missions.filter((m) => {
      const matchesStatus = filter === 'all' || m.status === filter
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [missions, filter, search])

  // Vol-23 BUG real delete (alert kaldırıldı)
  const handleDelete = (missionId: string) => {
    startTransition(async () => {
      const result = await deleteMission(ngoId, missionId)
      if (result.success) {
        setDeleteConfirm(null)
        setFeedback(
          result.softDeleted
            ? 'Görev iptal edildi (katılımcı olduğu için kayıt korundu)'
            : 'Görev silindi'
        )
        router.refresh()
        setTimeout(() => setFeedback(null), 4000)
      } else {
        alert(`Hata: ${result.error}`)
      }
    })
  }

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

      {/* Feedback toast */}
      {feedback && (
        <div
          role="status"
          className="bg-success/15 border border-success/40 text-success rounded-xl px-4 py-3 text-sm font-medium"
        >
          {feedback}
        </div>
      )}

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
                    {mission.category ? DOMAIN_LABELS[mission.category] ?? mission.category : '—'}
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
                        href={`/admin/${ngoId}/missions/${mission.id}/qr`}
                        className="p-2 rounded-lg bg-ink-700 hover:bg-gold/20 transition-colors text-cream hover:text-gold"
                        title="QR kod oluştur"
                      >
                        <QrCode className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/${ngoId}/missions/${mission.id}/edit`}
                        className="p-2 rounded-lg bg-ink-700 hover:bg-ink-600 transition-colors text-cream"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 rounded-lg bg-clay/20 hover:bg-clay/30 transition-colors text-clay disabled:opacity-50"
                        title="Sil"
                        disabled={pending}
                        onClick={() =>
                          setDeleteConfirm({ id: mission.id, title: mission.title })
                        }
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

      {/* Vol-23: Delete confirm modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div className="bg-ink-800 rounded-2xl p-6 max-w-sm w-full border border-ink-700 shadow-2xl">
            <h3 id="delete-title" className="text-lg font-semibold text-cream mb-2">
              Görevi sil?
            </h3>
            <p className="text-ink-300 text-sm mb-2">
              <span className="text-cream font-medium">{deleteConfirm.title}</span>
            </p>
            <p className="text-ink-300 text-xs mb-6 leading-relaxed">
              Bu görevin katılımcısı varsa kayıt korunur ve "İptal" durumuna
              alınır. Katılımcı yoksa kalıcı olarak silinir.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={pending}
                className="px-4 py-2 rounded-lg bg-ink-700 text-cream font-medium hover:bg-ink-600 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={pending}
                className="px-4 py-2 rounded-lg bg-clay text-ink-900 font-medium hover:bg-clay/90 transition-colors disabled:opacity-50"
              >
                {pending ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
