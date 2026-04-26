'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createMission, updateMission } from '@/lib/admin/missions-actions'
import { AdminImageUpload } from '@/components/admin/admin-image-upload'
import Link from 'next/link'

interface MissionRecord {
  id: string
  title: string | null
  description: string | null
  domain: string | null
  category: string | null
  karma: number | null
  event_date: string | null
  location: string | null
  image_url: string | null
  status: string | null
}

interface AdminMissionFormProps {
  ngoId: string
  /** Edit mode: mevcut görev kaydı (yoksa create mode) */
  mission?: MissionRecord
}

// BUG-049 fix (Vol-21): user-facing kategoriler (Çevre/Eğitim/Hayvanlar/Sağlık/Afet/Topluluk + emoji)
// ile admin formunu align et. Admin/dashboard arasında kategori uyumsuzluğu kaldırıldı.
const DOMAINS = [
  { value: 'environment', label: 'Çevre' },
  { value: 'education', label: 'Eğitim' },
  { value: 'animals', label: 'Hayvanlar' },
  { value: 'health', label: 'Sağlık' },
  { value: 'disaster', label: 'Afet' },
  { value: 'community', label: 'Topluluk' },
]

function isoDateOrToday(value: string | null | undefined): string {
  if (!value) return new Date().toISOString().split('T')[0]
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return new Date().toISOString().split('T')[0]
    return d.toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

// Vol-25 BUG-055 sistemik fix: form onSubmit yerine button onClick.
// Next 14 compiler async onSubmit handler'ı server action olarak compile
// edebilir + form action prop'una bağlayabilir → silent fail riski.
// Vol-23'te bu form çalışıyordu ama defense in depth için pattern align edildi.
export function AdminMissionForm({ ngoId, mission }: AdminMissionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const isEdit = Boolean(mission)

  const [formData, setFormData] = useState({
    title: mission?.title ?? '',
    description: mission?.description ?? '',
    // domain (legacy) ve category (Vol-21) iki taraftan da gelebilir
    domain: mission?.domain ?? mission?.category ?? 'environment',
    karma_points: mission?.karma ?? 20,
    event_date: isoDateOrToday(mission?.event_date),
    location: mission?.location ?? '',
    image_url: mission?.image_url ?? '',
    status: ((mission?.status === 'draft' ? 'draft' : 'active') as 'draft' | 'active'),
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const doSubmit = async () => {
    if (isLoading) return

    if (!formData.title.trim()) {
      setErrorMsg('Başlık gerekli')
      return
    }

    if (!formData.description.trim()) {
      setErrorMsg('Açıklama gerekli')
      return
    }

    setIsLoading(true)
    setErrorMsg(null)

    try {
      const result = isEdit && mission
        ? await updateMission(ngoId, mission.id, formData)
        : await createMission(ngoId, formData)

      if (result.success) {
        router.push(`/admin/${ngoId}/missions`)
        router.refresh()
      } else {
        setErrorMsg(result.error ?? 'Beklenmeyen hata')
      }
    } catch (err) {
      setErrorMsg((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const pending = isLoading

  // Edit modunda image upload için stable fileName (mission.id) kullan
  const imageFileName = isEdit && mission ? mission.id : Math.random().toString(36).substr(2, 9)

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-2">
          Başlık *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Görev başlığı (ör. Fidan dikim etkinliği)"
          maxLength={100}
          className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <p className="text-xs text-ink-300 mt-1">
          {formData.title.length} / 100 karakter
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-2">
          Açıklama *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Görev hakkında detaylı açıklama yazın..."
          rows={6}
          className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold font-mono text-sm"
        />
      </div>

      {/* Domain */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-2">
          Kategori *
        </label>
        <select
          value={formData.domain}
          onChange={(e) => handleChange('domain', e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream focus:outline-none focus:ring-2 focus:ring-gold"
        >
          {DOMAINS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Karma Points */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-2">
          Karma Puanı *
        </label>
        <input
          type="number"
          value={formData.karma_points}
          onChange={(e) => handleChange('karma_points', parseInt(e.target.value))}
          min={5}
          max={500}
          className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      {/* Event Date */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-2">
          Tarih
        </label>
        <input
          type="date"
          value={formData.event_date}
          onChange={(e) => handleChange('event_date', e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-2">
          Yer
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Ör. Belgrad Ormanı, İstanbul"
          className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      {/* Image URL */}
      <AdminImageUpload
        folder={`${ngoId}/missions`}
        fileName={imageFileName}
        currentUrl={formData.image_url}
        onUploaded={(url) => handleChange('image_url', url)}
        label="Görev Görseli"
        aspectRatio="16:9"
      />
      <details style={{ marginTop: 8 }}>
        <summary style={{ fontSize: 12, color: 'var(--ink-400)', cursor: 'pointer' }}>
          Alternatif: URL yapıştır
        </summary>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => handleChange('image_url', e.target.value)}
          placeholder="https://unsplash.com/... veya görsel URL"
          style={{ width: '100%', marginTop: 8, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--ink-600)', backgroundColor: 'var(--ink-800)', color: 'var(--cream)', fontSize: '14px' }}
        />
      </details>

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-3">
          Status
        </label>
        <div className="flex gap-4">
          {['draft', 'active'].map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm text-cream">
                {status === 'draft' ? '📝 Taslak' : '✅ Yayında'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Error banner (Vol-25: alert() yerine inline) */}
      {errorMsg && (
        <div
          role="alert"
          className="rounded-xl px-4 py-3 text-sm font-medium bg-clay/15 border border-clay/40 text-clay"
        >
          ⚠ {errorMsg}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t border-ink-700">
        <button
          type="button"
          onClick={doSubmit}
          disabled={pending}
          className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 disabled:opacity-50 transition-colors"
        >
          {pending
            ? 'Kaydediliyor...'
            : isEdit
              ? 'Güncelle'
              : formData.status === 'draft'
                ? 'Taslak Kaydet'
                : '✅ Yayınla'}
        </button>

        <Link
          href={`/admin/${ngoId}/missions`}
          className="px-6 py-3 border border-ink-700 text-cream rounded-xl font-semibold hover:bg-ink-800 transition-colors"
        >
          İptal
        </Link>
      </div>
    </div>
  )
}
