'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Sponsor } from '@/lib/supabase/types'
import { updateSponsorProfile } from '@/lib/admin/sponsor-actions'

export function SponsorProfileForm({
  sponsorId,
  initial,
}: {
  sponsorId: string
  initial: Sponsor
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [okMsg, setOkMsg] = useState<string | null>(null)

  const [name, setName] = useState(initial.name)
  const [shortName, setShortName] = useState(initial.short_name ?? '')
  const [brandColor, setBrandColor] = useState(initial.brand_color ?? '')
  const [logoUrl, setLogoUrl] = useState(initial.logo_url ?? '')
  const [coverUrl, setCoverUrl] = useState(initial.cover_url ?? '')
  const [description, setDescription] = useState(initial.description ?? '')
  const [website, setWebsite] = useState(initial.website ?? '')

  const handleSubmit = () => {
    setError(null)
    setOkMsg(null)
    startTransition(async () => {
      const res = await updateSponsorProfile(sponsorId, {
        name: name.trim(),
        short_name: shortName.trim() || null,
        brand_color: brandColor.trim() || null,
        logo_url: logoUrl.trim() || null,
        cover_url: coverUrl.trim() || null,
        description: description.trim() || null,
        website: website.trim() || null,
      })
      if (!res.success) setError(res.error ?? 'Bir şeyler ters gitti.')
      else {
        setOkMsg('Kaydedildi.')
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {okMsg && (
        <div className="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {okMsg}
        </div>
      )}

      <Field label="Marka adı *">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </Field>

      <Field label="Kısa ad (rail kart, 3 harf önerilir)">
        <input
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
          maxLength={30}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Marka rengi (hex)">
          <input
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
            placeholder="#3D6A4E"
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold font-mono"
          />
        </Field>
        <Field label="Web sitesi">
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://www.brand.com"
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
      </div>

      <Field label="Logo URL">
        <input
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </Field>
      <Field label="Kapak görseli URL (public profile hero)">
        <input
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </Field>

      <Field label="Açıklama">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </Field>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={pending || !name.trim()}
        className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 disabled:opacity-50"
      >
        {pending ? 'Kaydediliyor…' : 'Kaydet'}
      </button>
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
