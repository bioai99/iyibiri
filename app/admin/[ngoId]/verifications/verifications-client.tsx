'use client'

import { useState, useMemo } from 'react'
import { CheckCircle2, XCircle, MessageSquare } from 'lucide-react'
import { approveVerification, rejectVerification, bulkApproveVerifications } from '@/lib/admin/verifications-actions'

interface Verification {
  id: string
  user_id: string
  mission_id: string
  admin_review_status: string
  admin_feedback: string | null
  proof_type: string
  proof_url: string | null
  created_at: string
  missions?: { id: string; title: string; karma: number }
  profiles?: { id: string; name: string | null; avatar_url: string | null }
}

interface VerificationsClientProps {
  verifications: Verification[]
  ngoId: string
}

const PROOF_LABELS: Record<string, string> = {
  photo: '📷 Fotoğraf',
  code: '💻 Kod',
  qr: '📱 QR Scan',
}

export function VerificationsClient({
  verifications,
  ngoId,
}: VerificationsClientProps) {
  const [filter, setFilter] = useState<'all' | 'photo' | 'code' | 'qr'>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectFeedback, setRejectFeedback] = useState('')
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    return verifications.filter((v) => {
      if (filter === 'all') return true
      return v.proof_type === filter
    })
  }, [verifications, filter])

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
  }

  const handleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((v) => v.id)))
    }
  }

  const handleApprove = async (id: string) => {
    setLoading(true)
    try {
      const result = await approveVerification(id)
      if (result.success) {
        // Remove from list (optimistic)
        setSelected((s) => {
          const newS = new Set(s)
          newS.delete(id)
          return newS
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectFeedback.trim()) {
      alert('Lütfen reddetme nedenini yazın')
      return
    }

    setLoading(true)
    try {
      const result = await rejectVerification(id, rejectFeedback)
      if (result.success) {
        setRejectingId(null)
        setRejectFeedback('')
        setSelected((s) => {
          const newS = new Set(s)
          newS.delete(id)
          return newS
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBulkApprove = async () => {
    setLoading(true)
    try {
      const result = await bulkApproveVerifications(Array.from(selected))
      if (result.success) {
        setSelected(new Set())
        setShowBulkConfirm(false)
      }
    } finally {
      setLoading(false)
    }
  }

  // Empty state
  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 bg-ink-800 rounded-2xl border border-ink-700">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-cream mb-1">
          Bekleyen doğrulama yok
        </h3>
        <p className="text-ink-300">Harika iş! Tüm başvurular incelendi.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'photo', 'code', 'qr'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filter === type
                ? 'bg-gold text-ink-900'
                : 'bg-ink-800 text-cream hover:bg-ink-700'
            }`}
          >
            {type === 'all' ? 'Tümü' : PROOF_LABELS[type] ?? type}
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="sticky bottom-0 left-0 right-0 bg-ink-800 border-t border-ink-700 p-4 flex items-center justify-between rounded-t-xl">
          <span className="text-sm text-ink-300">
            {selected.size} seçili
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(new Set())}
              className="px-4 py-2 text-sm rounded-lg bg-ink-700 text-cream hover:bg-ink-600"
            >
              Seçimi Temizle
            </button>
            <button
              onClick={() => setShowBulkConfirm(true)}
              className="px-4 py-2 text-sm rounded-lg bg-success text-ink-900 font-semibold hover:bg-success/90"
              disabled={loading}
            >
              {selected.size} Doğrulamayı Onayla
            </button>
          </div>
        </div>
      )}

      {/* Bulk confirm modal */}
      {showBulkConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="bg-ink-800 rounded-t-3xl w-full max-w-lg p-6 border border-ink-700">
            <h2 className="text-xl font-semibold text-cream mb-2">
              {selected.size} doğrulama onaylanacak mı?
            </h2>
            <p className="text-ink-300 mb-6">
              Bu işlem geri alınamaz. Gönüllüler anında karma kazanacaklar.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkConfirm(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-ink-700 text-cream hover:bg-ink-600"
                disabled={loading}
              >
                İptal
              </button>
              <button
                onClick={handleBulkApprove}
                className="flex-1 px-4 py-3 rounded-lg bg-success text-ink-900 font-semibold hover:bg-success/90"
                disabled={loading}
              >
                {loading ? 'Onaylanıyor...' : 'Onaylıyorum'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification cards */}
      <div className="grid gap-4">
        {/* Select all header */}
        <div className="flex items-center gap-3 px-4 py-2 bg-ink-800 rounded-lg">
          <input
            type="checkbox"
            checked={selected.size === filtered.length && filtered.length > 0}
            onChange={handleSelectAll}
            className="w-5 h-5 rounded cursor-pointer"
          />
          <span className="text-sm text-ink-300">
            {selected.size === filtered.length && filtered.length > 0
              ? 'Tümü seçili'
              : 'Tüm sayfayı seç'}
          </span>
        </div>

        {filtered.map((v) => (
          <div
            key={v.id}
            className={`bg-ink-800 rounded-xl border-2 p-4 transition-colors ${
              rejectingId === v.id
                ? 'border-clay'
                : 'border-ink-700 hover:border-ink-600'
            }`}
          >
            {/* Reject modal for this card */}
            {rejectingId === v.id && (
              <div className="mb-4 p-4 bg-ink-900 rounded-lg border border-clay/30">
                <label className="block text-sm font-semibold text-cream mb-2">
                  Reddetme Nedeni
                </label>
                <textarea
                  value={rejectFeedback}
                  onChange={(e) => setRejectFeedback(e.target.value)}
                  placeholder="Gönüllüye neden uygun olmadığını açıklayın..."
                  className="w-full px-3 py-2 bg-ink-800 border border-ink-600 text-cream rounded-lg placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-clay text-sm"
                  rows={3}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setRejectingId(null)
                      setRejectFeedback('')
                    }}
                    className="flex-1 px-3 py-2 bg-ink-700 text-cream rounded-lg text-sm hover:bg-ink-600"
                    disabled={loading}
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => handleReject(v.id)}
                    className="flex-1 px-3 py-2 bg-clay text-ink-900 rounded-lg text-sm font-semibold hover:bg-clay/90"
                    disabled={loading}
                  >
                    {loading ? 'Gönderiliyor...' : 'Reddet'}
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {/* Checkbox */}
              <div className="flex items-start pt-1">
                <input
                  type="checkbox"
                  checked={selected.has(v.id)}
                  onChange={() => handleToggleSelect(v.id)}
                  className="w-5 h-5 rounded cursor-pointer mt-1"
                />
              </div>

              {/* User avatar + info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold/50 flex items-center justify-center text-ink-900 font-semibold text-sm"
                    title={v.profiles?.avatar_url || ''}
                  >
                    {v.profiles?.name?.[0] ?? '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-cream">
                      {v.profiles?.name || 'Anonim'}
                    </h3>
                    <p className="text-sm text-ink-300">
                      {v.missions?.title || 'Bilinmeyen görev'}
                    </p>
                  </div>
                </div>

                {/* Proof type */}
                <div className="flex items-center gap-2 text-sm text-ink-300 mb-3">
                  <span className="px-2 py-1 bg-ink-900 rounded text-xs font-medium">
                    {PROOF_LABELS[v.proof_type] ?? v.proof_type}
                  </span>
                  <span>
                    {new Date(v.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                {/* Proof preview (link) */}
                {v.proof_url && (
                  <a
                    href={v.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-gold hover:underline mb-3"
                  >
                    Kanıtı göster →
                  </a>
                )}

                {/* Karma badge */}
                <div className="text-xs text-gold font-semibold">
                  +{v.missions?.karma || 0} karma kazanacak
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-col">
                <button
                  onClick={() => handleApprove(v.id)}
                  className="px-4 py-2 bg-success text-ink-900 rounded-lg font-semibold hover:bg-success/90 transition-colors flex items-center gap-2 text-sm"
                  disabled={loading || rejectingId !== null}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Onayla
                </button>
                <button
                  onClick={() => setRejectingId(v.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm ${
                    rejectingId === v.id
                      ? 'bg-clay text-ink-900'
                      : 'bg-clay/20 text-clay hover:bg-clay/30'
                  }`}
                  disabled={loading && rejectingId !== v.id}
                >
                  <XCircle className="w-4 h-4" />
                  Reddet
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
