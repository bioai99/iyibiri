'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { reviewSignupRequest } from '@/lib/admin/ngo-signup-review-actions'

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

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: '⏳ Beklemede', color: 'bg-ink-700 text-ink-300' },
  reviewing: { label: '👀 İnceleniyor', color: 'bg-gold/20 text-gold' },
  approved: { label: '✅ Onaylandı', color: 'bg-success/20 text-success' },
  rejected: { label: '✖️ Reddedildi', color: 'bg-clay/20 text-clay' },
}

const CATEGORY_LABELS: Record<string, string> = {
  environment: '🌱 Çevre',
  education: '📚 Eğitim',
  animals: '🐾 Hayvanlar',
  health: '🏥 Sağlık',
  disaster: '🚨 Afet',
  community: '🤝 Topluluk',
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

// Vol-27.1: STK signup queue client UI
export function NgoRequestsClient({
  initialRequests,
}: {
  initialRequests: SignupRequest[]
}) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing' | 'approved' | 'rejected'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (filter === 'all') return initialRequests
    return initialRequests.filter((r) => r.status === filter)
  }, [filter, initialRequests])

  const handleReview = async (
    id: string,
    newStatus: 'reviewing' | 'approved' | 'rejected',
    notes?: string
  ) => {
    setPendingId(id)
    setFeedback(null)
    try {
      const result = await reviewSignupRequest(id, newStatus, notes)
      if (result.success) {
        const labels = { reviewing: 'İnceleniyor', approved: 'Onaylandı', rejected: 'Reddedildi' }
        setFeedback(`✓ Başvuru "${labels[newStatus]}" durumuna alındı`)
        router.refresh()
        setTimeout(() => setFeedback(null), 4000)
      } else {
        setFeedback(`⚠ Hata: ${result.error}`)
      }
    } catch (err) {
      setFeedback(`⚠ Hata: ${(err as Error).message}`)
    } finally {
      setPendingId(null)
    }
  }

  // Stat counts
  const counts = useMemo(() => {
    const c = { pending: 0, reviewing: 0, approved: 0, rejected: 0 }
    initialRequests.forEach((r) => {
      c[r.status] = (c[r.status] || 0) + 1
    })
    return c
  }, [initialRequests])

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-ink-800 border border-ink-700 rounded-xl p-4">
          <div className="text-xs text-ink-300 font-semibold uppercase">Beklemede</div>
          <div className="text-2xl font-bold text-cream mt-1">{counts.pending}</div>
        </div>
        <div className="bg-ink-800 border border-ink-700 rounded-xl p-4">
          <div className="text-xs text-gold font-semibold uppercase">İnceleniyor</div>
          <div className="text-2xl font-bold text-gold mt-1">{counts.reviewing}</div>
        </div>
        <div className="bg-ink-800 border border-ink-700 rounded-xl p-4">
          <div className="text-xs text-success font-semibold uppercase">Onaylanan</div>
          <div className="text-2xl font-bold text-success mt-1">{counts.approved}</div>
        </div>
        <div className="bg-ink-800 border border-ink-700 rounded-xl p-4">
          <div className="text-xs text-clay font-semibold uppercase">Reddedilen</div>
          <div className="text-2xl font-bold text-clay mt-1">{counts.rejected}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'reviewing', 'approved', 'rejected'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === s
                ? 'bg-gold text-ink-900'
                : 'bg-ink-800 text-cream hover:bg-ink-700'
            }`}
          >
            {s === 'all' ? `Tümü (${initialRequests.length})` : STATUS_LABELS[s]?.label}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          role="status"
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            feedback.startsWith('✓')
              ? 'bg-success/15 border border-success/40 text-success'
              : 'bg-clay/15 border border-clay/40 text-clay'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-ink-800 border border-ink-700 rounded-xl p-8 text-center text-ink-300">
          {filter === 'all' ? 'Henüz başvuru yok.' : 'Bu durumda başvuru yok.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const isExpanded = expanded === req.id
            const isPending = pendingId === req.id
            return (
              <div
                key={req.id}
                className="bg-ink-800 border border-ink-700 rounded-xl overflow-hidden"
              >
                {/* Header (collapsed) */}
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : req.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 hover:bg-ink-700/40 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-cream truncate">
                        {req.ngo_name}
                      </span>
                      {req.short_name && (
                        <span className="text-xs text-ink-300">
                          ({req.short_name})
                        </span>
                      )}
                      {req.category && (
                        <span className="text-xs text-ink-300">
                          · {CATEGORY_LABELS[req.category] ?? req.category}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-ink-400 mt-1 truncate">
                      {req.contact_name} · {req.contact_email}
                      {req.city && ` · ${req.city}`}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      STATUS_LABELS[req.status]?.color ?? ''
                    }`}
                  >
                    {STATUS_LABELS[req.status]?.label ?? req.status}
                  </span>
                  <span className="shrink-0 text-xs text-ink-400 hidden md:inline">
                    {formatDate(req.created_at)}
                  </span>
                </button>

                {/* Detail (expanded) */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-ink-700 space-y-4">
                    {/* Detay grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      {req.website && (
                        <div>
                          <div className="text-xs text-ink-300 font-semibold uppercase">Web</div>
                          <a
                            href={req.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:underline break-all"
                          >
                            {req.website}
                          </a>
                        </div>
                      )}
                      {req.contact_phone && (
                        <div>
                          <div className="text-xs text-ink-300 font-semibold uppercase">Telefon</div>
                          <div className="text-cream">{req.contact_phone}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-ink-300 font-semibold uppercase">Başvuru Tarihi</div>
                        <div className="text-cream">{formatDate(req.created_at)}</div>
                      </div>
                      {req.reviewed_at && (
                        <div>
                          <div className="text-xs text-ink-300 font-semibold uppercase">Review Tarihi</div>
                          <div className="text-cream">{formatDate(req.reviewed_at)}</div>
                        </div>
                      )}
                    </div>

                    {req.description && (
                      <div>
                        <div className="text-xs text-ink-300 font-semibold uppercase mb-1">Açıklama</div>
                        <p className="text-sm text-cream leading-relaxed">{req.description}</p>
                      </div>
                    )}

                    <div>
                      <div className="text-xs text-ink-300 font-semibold uppercase mb-1">
                        Başvuru Nedeni
                      </div>
                      <p className="text-sm text-cream leading-relaxed whitespace-pre-wrap">
                        {req.reason}
                      </p>
                    </div>

                    {req.reviewer_notes && (
                      <div className="bg-ink-900 rounded-lg p-3 border border-ink-700">
                        <div className="text-xs text-gold font-semibold uppercase mb-1">
                          Reviewer Notu
                        </div>
                        <p className="text-sm text-cream leading-relaxed whitespace-pre-wrap">
                          {req.reviewer_notes}
                        </p>
                      </div>
                    )}

                    {/* Manual SQL hint */}
                    {req.status === 'approved' && (
                      <div className="bg-success/10 border border-success/30 rounded-lg p-3 text-xs text-success leading-relaxed">
                        Manuel adım (Vol-28+ otomatikleşecek):
                        <pre className="mt-2 bg-ink-900 p-2 rounded overflow-x-auto text-cream">
{`-- 1. NGO row insert
insert into public.ngos (id, name, short_name, ...) values (
  '${(req.short_name || req.ngo_name).toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}',
  '${req.ngo_name.replace(/'/g, "''")}',
  '${(req.short_name || '').replace(/'/g, "''")}',
  ...
);

-- 2. Admin grant (kullanıcı login olduktan sonra)
insert into public.ngo_admin_users (user_id, ngo_id, role)
select u.id, '<ngo_id>', 'admin' from auth.users u
where u.email = '${req.contact_email}';`}
                        </pre>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-ink-700">
                      {req.status !== 'reviewing' && req.status !== 'approved' && req.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleReview(req.id, 'reviewing')}
                          disabled={isPending}
                          className="px-4 py-2 rounded-lg bg-gold/20 text-gold font-semibold text-sm hover:bg-gold/30 transition-colors disabled:opacity-50"
                        >
                          👀 İncelemeye Al
                        </button>
                      )}
                      {req.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => {
                            const note = prompt('Onay notu (opsiyonel):') ?? undefined
                            handleReview(req.id, 'approved', note)
                          }}
                          disabled={isPending}
                          className="px-4 py-2 rounded-lg bg-success/20 text-success font-semibold text-sm hover:bg-success/30 transition-colors disabled:opacity-50"
                        >
                          ✅ Onayla
                        </button>
                      )}
                      {req.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => {
                            const note = prompt('Red sebebi:') ?? ''
                            if (note.trim().length === 0) {
                              alert('Red sebebi zorunlu')
                              return
                            }
                            handleReview(req.id, 'rejected', note)
                          }}
                          disabled={isPending}
                          className="px-4 py-2 rounded-lg bg-clay/20 text-clay font-semibold text-sm hover:bg-clay/30 transition-colors disabled:opacity-50"
                        >
                          ✖️ Reddet
                        </button>
                      )}
                      <a
                        href={`mailto:${req.contact_email}?subject=İyiBiri%20-%20${encodeURIComponent(req.ngo_name)}%20Başvurunuz`}
                        className="px-4 py-2 rounded-lg bg-ink-700 text-cream font-semibold text-sm hover:bg-ink-600 transition-colors ml-auto"
                      >
                        📧 E-posta
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
