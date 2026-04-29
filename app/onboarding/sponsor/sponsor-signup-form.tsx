'use client'

import { useState, useTransition } from 'react'
import { submitSponsorSignup } from '@/lib/sponsors/signup-actions'

export function SponsorSignupForm() {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const [brandName, setBrandName] = useState('')
  const [brandShort, setBrandShort] = useState('')
  const [brandColor, setBrandColor] = useState('')
  const [website, setWebsite] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [description, setDescription] = useState('')

  if (done) {
    return (
      <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-green-300 mb-2">
          ✓ BAŞVURUNUZ ALINDI
        </p>
        <h2 className="text-2xl font-display text-cream mb-3">Teşekkürler {contactName}!</h2>
        <p className="text-ink-300 leading-relaxed">
          Başvurunuz iyibiri ekibimize iletildi. 3 iş günü içinde{' '}
          <strong className="text-cream">{contactEmail}</strong> adresine dönüş
          yapacağız. Başvurunuz onaylanınca panel erişiminizi e-posta ile
          paylaşırız.
        </p>
      </div>
    )
  }

  const handleSubmit = () => {
    setError(null)
    startTransition(async () => {
      const res = await submitSponsorSignup({
        brand_name: brandName,
        brand_short: brandShort || null,
        brand_color: brandColor || null,
        website: website || null,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        tax_number: taxNumber || null,
        description: description || null,
      })
      if (res.success) setDone(true)
      else setError(res.error ?? 'Başvuru gönderilemedi.')
    })
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Marka adı *">
          <input
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            maxLength={120}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
        <Field label="Kısa ad (3 harf)">
          <input
            value={brandShort}
            onChange={(e) => setBrandShort(e.target.value)}
            maxLength={30}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Web sitesi">
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://www.brand.com"
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
        <Field label="Marka rengi (hex)">
          <input
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
            placeholder="#3D6A4E"
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold font-mono"
          />
        </Field>
      </div>

      <Field label="Marka açıklaması">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </Field>

      <div className="rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-ink-300">
        <strong className="text-gold">Yetkili kişi bilgileri</strong> — başvurunuzu
        inceleyip dönüş yapabilmemiz için.
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ad-soyad *">
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            maxLength={120}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
        <Field label="E-posta *">
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            maxLength={200}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Telefon">
          <input
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
        <Field label="Vergi no">
          <input
            value={taxNumber}
            onChange={(e) => setTaxNumber(e.target.value)}
            className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </Field>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={pending || !brandName || !contactName || !contactEmail}
        className="w-full px-6 py-4 bg-gold text-ink-900 rounded-xl font-bold text-lg hover:bg-gold/90 disabled:opacity-50"
      >
        {pending ? 'Gönderiliyor…' : 'Başvuruyu gönder'}
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
