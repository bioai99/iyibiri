'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  approveSponsorRequest,
  rejectSponsorRequest,
} from '@/lib/admin/sponsor-request-actions'

interface SignupRequest {
  id: string
  brand_name: string
  brand_short: string | null
  brand_color: string | null
  website: string | null
  contact_name: string
  contact_email: string
  contact_phone: string | null
  tax_number: string | null
  description: string | null
  status: string
  rejection_reason: string | null
  approved_sponsor_id: string | null
  created_at: string
}

const STATUS_LABEL: Record<string, { label: string; tone: string }> = {
  pending: { label: 'Bekliyor', tone: 'bg-gold/20 text-gold' },
  approved: { label: 'Onaylandı', tone: 'bg-green-500/20 text-green-300' },
  rejected: { label: 'Reddedildi', tone: 'bg-red-500/20 text-red-300' },
  cancelled: { label: 'İptal', tone: 'bg-ink-700 text-ink-300' },
}

export function SponsorRequestsClient({ requests }: { requests: SignupRequest[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [adminUserIdMap, setAdminUserIdMap] = useState<Record<string, string>>({})

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl bg-ink-800 border border-ink-600 p-8 text-center">
        <p className="text-cream">Henüz başvuru yok.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {requests.map((r) => {
        const status = STATUS_LABEL[r.status] ?? STATUS_LABEL.pending
        return (
          <div
            key={r.id}
            className="rounded-2xl bg-ink-800 border border-ink-600 p-5"
          >
            <div className="flex items-start justify-between mb-3 gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${status.tone}`}
                  >
                    {status.label}
                  </span>
                  <span className="text-xs text-ink-400">
                    {new Date(r.created_at).toLocaleString('tr-TR')}
                  </span>
                </div>
                <h3 className="text-xl font-display text-cream">
                  {r.brand_name}
                  {r.brand_short && (
                    <span className="text-ink-400 ml-2 text-sm">({r.brand_short})</span>
                  )}
                </h3>
                <p className="text-sm text-ink-300 mt-1">
                  {r.contact_name} · {r.contact_email}
                  {r.contact_phone && ` · ${r.contact_phone}`}
                </p>
              </div>
              {r.brand_color && (
                <div
                  className="w-10 h-10 rounded-lg border border-ink-600 flex-shrink-0"
                  style={{ background: r.brand_color }}
                  title={r.brand_color}
                />
              )}
            </div>
            {r.description && (
              <p className="text-sm text-ink-300 mb-3 leading-relaxed">{r.description}</p>
            )}
            <div className="text-xs text-ink-400 grid grid-cols-2 gap-2 mb-4">
              {r.website && (
                <div>Web: <a href={r.website} target="_blank" rel="noopener noreferrer" className="text-gold underline">{r.website}</a></div>
              )}
              {r.tax_number && <div>Vergi no: {r.tax_number}</div>}
            </div>

            {r.status === 'pending' && (
              <div className="space-y-3 pt-3 border-t border-ink-600">
                <Field label="Sponsor admin user_id (opsiyonel)">
                  <input
                    placeholder="uuid-of-existing-profile"
                    value={adminUserIdMap[r.id] ?? ''}
                    onChange={(e) =>
                      setAdminUserIdMap({
                        ...adminUserIdMap,
                        [r.id]: e.target.value,
                      })
                    }
                    className="w-full rounded-lg bg-ink-900 border border-ink-600 px-3 py-2 text-cream font-mono text-xs outline-none focus:border-gold"
                  />
                  <p className="text-xs text-ink-400 mt-1">
                    Onayda sponsor_admin_users insert için. Boş bırakılırsa sadece sponsor entity yaratılır, admin sonra atanır.
                  </p>
                </Field>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      setError(null)
                      startTransition(async () => {
                        const res = await approveSponsorRequest(r.id, {
                          adminUserId: adminUserIdMap[r.id]?.trim() || null,
                        })
                        if (!res.success) setError(res.error ?? 'Onay başarısız.')
                        else router.refresh()
                      })
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/40 rounded-lg text-sm font-semibold disabled:opacity-50"
                  >
                    Onayla → Sponsor yarat
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectId(r.id)}
                    className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/40 rounded-lg text-sm font-semibold"
                  >
                    Reddet
                  </button>
                </div>
              </div>
            )}

            {r.status === 'approved' && r.approved_sponsor_id && (
              <div className="text-sm text-green-300 pt-3 border-t border-ink-600">
                ✓ Sponsor yaratıldı: <code>{r.approved_sponsor_id}</code>
              </div>
            )}
            {r.status === 'rejected' && r.rejection_reason && (
              <div className="text-sm text-red-300 pt-3 border-t border-ink-600">
                Red sebebi: {r.rejection_reason}
              </div>
            )}
          </div>
        )
      })}

      {rejectId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setRejectId(null)}
        >
          <div
            className="bg-ink-800 border border-ink-600 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-cream font-display text-xl mb-3">
              Başvuruyu reddet
            </h3>
            <textarea
              placeholder="Reddetme sebebi (başvurana e-posta ile iletilebilir)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-ink-900 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setRejectId(null)}
                className="px-5 py-2.5 bg-transparent text-ink-300 border border-ink-600 rounded-lg font-semibold"
              >
                İptal
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setError(null)
                  const id = rejectId
                  const reason = rejectReason
                  startTransition(async () => {
                    setRejectId(null)
                    setRejectReason('')
                    if (!id) return
                    const res = await rejectSponsorRequest(id, reason)
                    if (!res.success) setError(res.error ?? 'Red başarısız.')
                    else router.refresh()
                  })
                }}
                className="px-5 py-2.5 bg-red-500/20 text-red-300 border border-red-500/40 rounded-lg font-semibold disabled:opacity-50"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
        {label}
      </span>
      {children}
    </label>
  )
}
