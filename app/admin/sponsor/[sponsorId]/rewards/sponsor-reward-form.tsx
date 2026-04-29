'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createSponsorReward,
  updateSponsorReward,
  type SponsorRewardData,
} from '@/lib/admin/sponsor-actions'
import type { Reward } from '@/lib/supabase/types'

const CATEGORIES = ['food', 'shopping', 'culture', 'financial', 'travel', 'other']

export function SponsorRewardForm({
  sponsorId,
  sponsorName,
  initial,
}: {
  sponsorId: string
  sponsorName: string
  initial?: Reward
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [karma, setKarma] = useState<number>(initial?.karma_required ?? 500)
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '')
  const [brandLogo, setBrandLogo] = useState(initial?.brand_logo ?? '')
  const [category, setCategory] = useState<string>(initial?.category ?? 'shopping')
  const [active, setActive] = useState(initial?.active ?? true)

  const handleSubmit = () => {
    setError(null)
    if (!title.trim()) {
      setError('Başlık gerekli.')
      return
    }
    startTransition(async () => {
      const data: SponsorRewardData = {
        title: title.trim(),
        brand: sponsorName,
        brand_logo: brandLogo.trim() || null,
        description: description.trim() || null,
        karma_required: Math.max(1, Math.floor(karma)),
        category,
        active,
        image_url: imageUrl.trim() || null,
      }
      const res = initial
        ? await updateSponsorReward(sponsorId, initial.id, data)
        : await createSponsorReward(sponsorId, data)
      if (res.success) {
        router.push(`/admin/sponsor/${sponsorId}/rewards`)
        router.refresh()
      } else {
        setError(res.error ?? 'Bir şeyler ters gitti.')
      }
    })
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <Field label="Ödül başlığı *">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="50 TL Alışveriş Kuponu"
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </Field>

      <Field label="Açıklama">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={300}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Karma maliyeti *">
          <input
            type="number"
            value={karma}
            min={1}
            step={50}
            onChange={(e) => setKarma(Number(e.target.value) || 0)}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold tabular-nums"
          />
        </Field>
        <Field label="Kategori">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Görsel URL">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
        <Field label="Marka logosu URL">
          <input
            value={brandLogo}
            onChange={(e) => setBrandLogo(e.target.value)}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
      </div>

      <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ink-800 border border-ink-600 cursor-pointer">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        <span className="text-sm text-cream">Aktif (ödül listesinde görünsün)</span>
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending}
          className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 disabled:opacity-50"
        >
          {pending ? 'Kaydediliyor…' : initial ? 'Güncelle' : 'Ödülü oluştur'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-transparent text-ink-300 rounded-xl border border-ink-600 hover:bg-ink-800"
        >
          İptal
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-2">
        {label}
      </span>
      {children}
    </label>
  )
}
