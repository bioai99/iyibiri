'use client'

// Vol-32 STK kampanya listesi — backoffice tarafında.

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { archiveCampaign } from '@/lib/admin/campaign-actions'
import type { Campaign } from '@/lib/supabase/types'

interface Props {
  ngoId: string
  campaigns: Campaign[]
}

const STATUS_LABEL: Record<string, { label: string; tone: string }> = {
  draft: { label: 'Taslak', tone: 'bg-ink-700 text-ink-300' },
  active: { label: 'Yayında', tone: 'bg-green-500/20 text-green-300' },
  closed: { label: 'Sonlandı', tone: 'bg-blue-500/20 text-blue-300' },
  archived: { label: 'Arşiv', tone: 'bg-ink-700 text-ink-400 line-through' },
}

const SCENARIO_LABEL: Record<string, string> = {
  general: 'Genel',
  specific_campaign: 'Kampanya',
  in_memory: 'Hatıra',
  gift: 'Hediye',
  regular_supporter: 'Düzenli',
}

export function CampaignsListClient({ ngoId, campaigns }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  if (campaigns.length === 0) {
    return (
      <div className="rounded-2xl bg-ink-800 border border-ink-600 p-12 text-center">
        <p className="text-cream font-display text-xl mb-2">Henüz kampanya yok</p>
        <p className="text-ink-300 mb-6">
          İlk kampanyanı oluştur — kullanıcılar bağış akışında bunu görecek.
        </p>
        <Link
          href={`/admin/${ngoId}/campaigns/new`}
          className="inline-block px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold"
        >
          + Kampanya oluştur
        </Link>
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
      {campaigns.map((c) => {
        const status = STATUS_LABEL[c.status] ?? STATUS_LABEL.draft
        return (
          <div
            key={c.id}
            className="rounded-2xl bg-ink-800 border border-ink-600 p-4 flex gap-4"
          >
            <div
              className="w-20 h-20 rounded-xl bg-ink-700 flex-shrink-0 bg-cover bg-center"
              style={{
                backgroundImage: c.image_url ? `url(${c.image_url})` : undefined,
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${status.tone}`}
                >
                  {status.label}
                </span>
                {c.is_featured && (
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gold/20 text-gold">
                    ✦ Öne çıkan
                  </span>
                )}
                <span className="text-xs text-ink-400">
                  {SCENARIO_LABEL[c.scenario_type] ?? c.scenario_type}
                </span>
              </div>
              <div className="text-cream font-semibold truncate">{c.title}</div>
              {c.summary && (
                <p className="text-sm text-ink-300 line-clamp-1">{c.summary}</p>
              )}
              <div className="text-xs text-ink-400 mt-1">
                {c.supporter_count.toLocaleString('tr-TR')} destekçi
                {c.end_date &&
                  ` · ${new Date(c.end_date).toLocaleDateString('tr-TR')}'da bitiyor`}
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Link
                href={`/admin/${ngoId}/campaigns/${c.id}/edit`}
                className="px-4 py-2 bg-gold/10 text-gold border border-gold/30 rounded-lg text-sm font-semibold hover:bg-gold/20"
              >
                Düzenle
              </Link>
              {c.status !== 'archived' && (
                <button
                  type="button"
                  onClick={() => setConfirmId(c.id)}
                  disabled={pending}
                  className="px-4 py-2 bg-transparent text-ink-300 border border-ink-600 rounded-lg text-sm font-semibold hover:bg-ink-700"
                >
                  Arşivle
                </button>
              )}
            </div>
          </div>
        )
      })}

      {confirmId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setConfirmId(null)}
        >
          <div
            className="bg-ink-800 border border-ink-600 rounded-2xl p-6 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-cream font-display text-xl mb-3">
              Kampanyayı arşivle?
            </h3>
            <p className="text-ink-300 text-sm mb-6">
              Arşivlenen kampanya kullanıcı tarafında görünmez. Mevcut bağışlar
              etkilenmez. İstediğinde geri açabilirsin.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="px-5 py-2.5 bg-transparent text-ink-300 border border-ink-600 rounded-lg font-semibold"
              >
                İptal
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setError(null)
                  startTransition(async () => {
                    const id = confirmId
                    setConfirmId(null)
                    if (!id) return
                    const res = await archiveCampaign(ngoId, id)
                    if (!res.success) setError(res.error ?? 'Arşivleme başarısız.')
                    else router.refresh()
                  })
                }}
                className="px-5 py-2.5 bg-red-500/20 text-red-300 border border-red-500/40 rounded-lg font-semibold disabled:opacity-50"
              >
                {pending ? 'Arşivleniyor…' : 'Arşivle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
