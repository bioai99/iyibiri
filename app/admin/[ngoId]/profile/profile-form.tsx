'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateNgoProfile } from '@/lib/admin/ngo-profile-actions'
import type { NGO } from '@/lib/supabase/types'

interface ProfileFormProps {
  ngo: NGO
  ngoId: string
}

export function ProfileForm({ ngo, ngoId }: ProfileFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [hasUnsaved, setHasUnsaved] = useState(false)

  const [formData, setFormData] = useState({
    logo_url: ngo.logo_url || '',
    cover_image_url: ngo.cover_image_url || '',
    short_name: ngo.short_name || '',
    tagline: ngo.tagline || '',
    description: ngo.description || '',
    email: ngo.email || '',
    phone: ngo.phone || '',
    website: ngo.website || '',
    social_instagram: ngo.social_instagram || '',
    social_twitter: ngo.social_twitter || '',
    social_linkedin: ngo.social_linkedin || '',
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasUnsaved(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const result = await updateNgoProfile(ngoId, formData)
        if (result.success) {
          setHasUnsaved(false)
          router.refresh()
          // Success toast
          alert('Profil başarıyla güncellendi!')
        } else {
          alert(`Hata: ${result.error}`)
        }
      } catch (err) {
        alert(`Hata: ${(err as Error).message}`)
      }
    })
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Form — Left */}
      <div className="col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo */}
          <div>
            <label className="block text-sm font-semibold text-cream mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={formData.logo_url}
              onChange={(e) => handleChange('logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {formData.logo_url && (
              <div className="mt-3 w-20 h-20 rounded-lg overflow-hidden bg-ink-700">
                <img
                  src={formData.logo_url}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold text-cream mb-2">
              Kapak Resmi URL
            </label>
            <input
              type="url"
              value={formData.cover_image_url}
              onChange={(e) =>
                handleChange('cover_image_url', e.target.value)
              }
              placeholder="https://example.com/cover.jpg"
              className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {formData.cover_image_url && (
              <div className="mt-3 rounded-lg overflow-hidden max-w-sm">
                <img
                  src={formData.cover_image_url}
                  alt="Kapak"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>

          {/* Name (readonly) */}
          <div>
            <label className="block text-sm font-semibold text-cream mb-2">
              STK Adı (sabit)
            </label>
            <input
              type="text"
              value={ngo.name}
              disabled
              className="w-full px-4 py-2 rounded-xl bg-ink-700 border border-ink-600 text-ink-300 opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-ink-400 mt-1">
              Adı değiştirmek için destek ile iletişime geçin
            </p>
          </div>

          {/* Short Name */}
          <div>
            <label className="block text-sm font-semibold text-cream mb-2">
              Kısa Ad
            </label>
            <input
              type="text"
              value={formData.short_name}
              onChange={(e) => handleChange('short_name', e.target.value)}
              placeholder="ör. TEMA"
              maxLength={20}
              className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-semibold text-cream mb-2">
              Slogan (max 80 karakter)
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="ör. Doğayı koruyarak geleceği inşa ediyoruz"
              maxLength={80}
              className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <p className="text-xs text-ink-300 mt-1">
              {formData.tagline.length} / 80
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-cream mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="STK hakkında detaylı açıklama..."
              rows={4}
              className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Contact Info */}
          <div className="space-y-4 border-t border-ink-700 pt-6">
            <h3 className="text-sm font-semibold text-cream">İletişim</h3>

            <div>
              <label className="block text-sm font-medium text-cream mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="info@stk.org.tr"
                className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+90 212 123 4567"
                className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream mb-2">
                Web Sitesi
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://www.stk.org.tr"
                className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 border-t border-ink-700 pt-6">
            <h3 className="text-sm font-semibold text-cream">Sosyal Ağlar</h3>

            <div>
              <label className="block text-sm font-medium text-cream mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={formData.social_instagram}
                onChange={(e) => handleChange('social_instagram', e.target.value)}
                placeholder="https://instagram.com/stk"
                className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream mb-2">
                Twitter / X
              </label>
              <input
                type="url"
                value={formData.social_twitter}
                onChange={(e) => handleChange('social_twitter', e.target.value)}
                placeholder="https://x.com/stk"
                className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.social_linkedin}
                onChange={(e) => handleChange('social_linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/stk"
                className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end pt-6 border-t border-ink-700">
            <button
              type="submit"
              disabled={pending || !hasUnsaved}
              className="px-6 py-3 rounded-xl bg-gold text-ink-900 font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
            >
              {pending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview — Right */}
      <div className="col-span-1 hidden lg:block">
        <div className="sticky top-24">
          <h3 className="text-sm font-semibold text-cream mb-4">Önizleme</h3>
          <div className="bg-ink-800 rounded-2xl overflow-hidden border border-ink-700">
            {/* Cover */}
            {formData.cover_image_url && (
              <div className="h-32 bg-ink-700 overflow-hidden">
                <img
                  src={formData.cover_image_url}
                  alt="Kapak"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Logo + Name */}
            <div className="p-4 text-center">
              {formData.logo_url && (
                <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden bg-ink-700">
                  <img
                    src={formData.logo_url}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-lg font-bold text-cream">
                {formData.short_name || ngo.name}
              </h2>
              {formData.tagline && (
                <p className="text-xs text-ink-300 mt-2">
                  {formData.tagline}
                </p>
              )}
            </div>

            {/* Description */}
            {formData.description && (
              <div className="px-4 pb-4 border-t border-ink-700 pt-4">
                <p className="text-xs text-ink-300 line-clamp-3">
                  {formData.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
