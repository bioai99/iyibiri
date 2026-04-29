'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createSponsorPost,
  updateSponsorPost,
  type SponsorPostData,
} from '@/lib/admin/sponsor-actions'
import type { Post } from '@/lib/supabase/types'

const CATEGORIES = [
  { id: 'article', label: 'Makale' },
  { id: 'update', label: 'Güncelleme' },
  { id: 'story', label: 'Hikaye' },
  { id: 'tip', label: 'İpucu' },
] as const

export function SponsorPostForm({
  sponsorId,
  initial,
}: {
  sponsorId: string
  initial?: Post
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(initial?.title ?? '')
  const [summary, setSummary] = useState(initial?.summary ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image_url ?? '')
  const [category, setCategory] = useState<'article' | 'update' | 'story' | 'tip'>(
    (initial?.category as any) ?? 'article',
  )
  const [published, setPublished] = useState(initial?.published ?? false)

  const wordCount = (content ?? '').split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  const handleSubmit = () => {
    setError(null)
    if (!title.trim()) {
      setError('Başlık gerekli.')
      return
    }
    startTransition(async () => {
      const data: SponsorPostData = {
        title: title.trim(),
        summary: summary.trim() || null,
        content: content || null,
        cover_image_url: coverUrl.trim() || null,
        category,
        read_time: readTime,
        published,
      }
      const res = initial
        ? await updateSponsorPost(sponsorId, initial.id, data)
        : await createSponsorPost(sponsorId, data)
      if (res.success) {
        router.push(`/admin/sponsor/${sponsorId}/posts`)
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </Field>

      <Field label="Özet (kart üzerinde görünür)">
        <input
          value={summary ?? ''}
          onChange={(e) => setSummary(e.target.value)}
          maxLength={300}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </Field>

      <Field label={`İçerik (~${readTime} dk okuma)`}>
        <textarea
          value={content ?? ''}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold leading-relaxed"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Kapak görseli URL">
          <input
            value={coverUrl ?? ''}
            onChange={(e) => setCoverUrl(e.target.value)}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
        <Field label="Kategori">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ink-800 border border-ink-600 cursor-pointer">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <span className="text-sm text-cream">Yayında (kullanıcılar görsün)</span>
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending}
          className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 disabled:opacity-50"
        >
          {pending ? 'Kaydediliyor…' : initial ? 'Güncelle' : 'Yazıyı oluştur'}
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
