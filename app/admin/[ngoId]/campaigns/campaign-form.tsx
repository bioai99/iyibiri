'use client'

// Vol-32 STK kampanya form — yeni / düzenleme.

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Campaign, DonationScenarioType } from '@/lib/supabase/types'
import {
  createCampaign,
  updateCampaign,
  type CampaignFormData,
} from '@/lib/admin/campaign-actions'

interface Props {
  ngoId: string
  initial?: Campaign
}

const SCENARIOS: Array<{ id: DonationScenarioType; label: string; hint: string }> = [
  { id: 'specific_campaign', label: 'Belirli kampanya', hint: 'Süreli, hedefli (ör: fidan)' },
  { id: 'general', label: 'Genel bağış', hint: 'Süresiz, kuruma genel destek' },
  { id: 'in_memory', label: 'Hatıra', hint: 'Anısına bağış senaryosu' },
  { id: 'gift', label: 'Hediye', hint: 'Birinin adına bağış' },
]

const CAUSES = [
  { id: 'env', label: 'Çevre' },
  { id: 'edu', label: 'Eğitim' },
  { id: 'animal', label: 'Hayvan' },
  { id: 'health', label: 'Sağlık' },
  { id: 'child', label: 'Çocuk' },
  { id: 'crisis', label: 'Afet' },
]

export function CampaignForm({ ngoId, initial }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(initial?.title ?? '')
  const [summary, setSummary] = useState(initial?.summary ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [cause, setCause] = useState<string>(initial?.cause ?? '')
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '')
  const [endDate, setEndDate] = useState<string>(
    initial?.end_date ? initial.end_date.slice(0, 10) : '',
  )
  const [scenario, setScenario] = useState<DonationScenarioType>(
    initial?.scenario_type ?? 'specific_campaign',
  )
  const [status, setStatus] = useState<'draft' | 'active' | 'closed' | 'archived'>(
    (initial?.status as 'draft' | 'active' | 'closed' | 'archived') ?? 'draft',
  )
  const [featured, setFeatured] = useState(Boolean(initial?.is_featured))

  const handleSubmit = () => {
    setError(null)
    if (!title.trim()) {
      setError('Başlık gerekli.')
      return
    }
    startTransition(async () => {
      const data: CampaignFormData = {
        title: title.trim(),
        summary: summary.trim() || null,
        description: description.trim() || null,
        cause: cause || null,
        image_url: imageUrl.trim() || null,
        end_date: endDate ? new Date(endDate).toISOString() : null,
        scenario_type: scenario,
        status,
        is_featured: featured && status === 'active',
      }
      const res = initial
        ? await updateCampaign(ngoId, initial.id, data)
        : await createCampaign(ngoId, data)
      if (res.success) {
        router.push(`/admin/${ngoId}/campaigns`)
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

      <Field label="Başlık *">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={140}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          placeholder="100.000 fidan, daha yeşil bir Anadolu"
        />
      </Field>

      <Field label="Özet (kart üzerinde görünür)">
        <input
          type="text"
          value={summary ?? ''}
          onChange={(e) => setSummary(e.target.value)}
          maxLength={200}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          placeholder="TEMA gönüllüleri ile 100.000 fidanı toprakla buluşturuyoruz."
        />
      </Field>

      <Field label="Açıklama (detay sayfasında)">
        <textarea
          value={description ?? ''}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={4}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Senaryo türü">
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as DonationScenarioType)}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} — {s.hint}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Konu (cause)">
          <select
            value={cause}
            onChange={(e) => setCause(e.target.value)}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          >
            <option value="">— Seçiniz —</option>
            {CAUSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Görsel URL">
          <input
            type="url"
            value={imageUrl ?? ''}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/…"
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
        <Field label="Bitiş tarihi (opsiyonel)">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Durum">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as 'draft' | 'active' | 'closed' | 'archived')
            }
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          >
            <option value="draft">Taslak</option>
            <option value="active">Yayında</option>
            <option value="closed">Sonlandı</option>
            <option value="archived">Arşiv</option>
          </select>
        </Field>
        <Field label="Bu ayın kampanyaları (carousel)">
          <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-ink-800 border border-ink-600 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              disabled={status !== 'active'}
            />
            <span className="text-sm text-cream">
              Öne çıkar {status !== 'active' && '(sadece aktif kampanyalarda)'}
            </span>
          </label>
        </Field>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending}
          className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 disabled:opacity-50"
        >
          {pending ? 'Kaydediliyor…' : initial ? 'Güncelle' : 'Kampanyayı oluştur'}
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

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-2">
        {label}
      </span>
      {children}
    </label>
  )
}
