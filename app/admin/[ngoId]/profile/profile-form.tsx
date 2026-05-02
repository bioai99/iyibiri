'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateNgoProfile } from '@/lib/admin/ngo-profile-actions'
import { AdminImageUpload } from '@/components/admin/admin-image-upload'
import type { NGO } from '@/lib/supabase/types'

interface ProfileFormProps {
  ngo: NGO
  ngoId: string
}

// Vol-24 BUG-055 fix:
// Önceki versiyonda useTransition + alert() + setHasUnsaved kombinasyonu submit'i
// hidration sırasında bozuyordu (Suspense boundary fail + alert() React render
// fiber bloğu). Yeni pattern:
//   - useTransition kaldırıldı, isLoading manuel state
//   - alert() kaldırıldı, inline status banner
//   - setHasUnsaved kaldırıldı (button her zaman aktif)
//   - try/catch tamamen senkron submit handler
export function ProfileForm({ ngo, ngoId }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

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
    if (status) setStatus(null) // Yeni edit → eski status'u temizle
  }

  // Vol-24.6 BUG-055 root-cause fix:
  // Next 14 compiler form'un onSubmit async handler'ını server action olarak
  // OTOMATIK compile ediyor ve form'un native `action` prop'una bağlıyor. Ama
  // bu function gerçek server action değil → form submit hiçbir handler'a
  // ulaşmıyordu. (DOM inspection: reactProps_keys: ['action', 'className', 'children'],
  // onSubmit yok!)
  //
  // Çözüm: form onSubmit kaldırıldı, button type="button" + onClick kullan.
  // Compiler heuristiği bypass edilir, form submit event'ı hiç tetiklenmez.
  const doSubmit = async () => {
    if (isLoading) return
    setIsLoading(true)
    setStatus(null)

    try {
      const result = await updateNgoProfile(ngoId, formData)
      if (result.success) {
        setStatus({ type: 'success', message: 'Profil başarıyla güncellendi.' })
        router.refresh()
      } else {
        setStatus({ type: 'error', message: result.error ?? 'Beklenmeyen hata.' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: (err as Error).message })
    } finally {
      setIsLoading(false)
    }
  }

  const pending = isLoading

  // Vol-36.2: Profil tamlık hesabı — IIFE yerine top-level computed values.
  // 11 alanın doluluk oranı + eksik liste. Public profile'a yansıyan alanlar.
  const completenessFields: Array<[string, string]> = [
    ['Logo', formData.logo_url],
    ['Kapak görseli', formData.cover_image_url],
    ['Kısa ad', formData.short_name],
    ['Tagline', formData.tagline],
    ['Açıklama', formData.description],
    ['Web sitesi', formData.website],
    ['E-posta', formData.email],
    ['Telefon', formData.phone],
    ['Instagram', formData.social_instagram],
    ['Twitter', formData.social_twitter],
    ['LinkedIn', formData.social_linkedin],
  ]
  const filledCount = completenessFields.filter(([, v]) => v && v.trim().length > 0).length
  const totalCount = completenessFields.length
  const completenessPct = Math.round((filledCount / totalCount) * 100)
  const missingFields = completenessFields
    .filter(([, v]) => !v || v.trim().length === 0)
    .map(([k]) => k)
  const completenessColor =
    completenessPct === 100 ? 'text-green-400' : completenessPct >= 60 ? 'text-gold' : 'text-orange-300'
  const completenessBarColor =
    completenessPct === 100 ? 'bg-green-400' : completenessPct >= 60 ? 'bg-gold' : 'bg-orange-400'

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Form — Left */}
      <div className="col-span-2">
        <div className="space-y-6">
          {/* Logo */}
          <AdminImageUpload
            folder={ngoId}
            fileName="logo"
            currentUrl={formData.logo_url}
            onUploaded={(url) => handleChange('logo_url', url)}
            label="STK Logo"
            aspectRatio="1:1"
          />
          <details style={{ marginTop: 8 }}>
            <summary style={{ fontSize: 12, color: 'var(--ink-400)', cursor: 'pointer' }}>
              Alternatif: URL yapıştır
            </summary>
            <input
              type="url"
              value={formData.logo_url}
              onChange={(e) => handleChange('logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
              style={{ width: '100%', marginTop: 8, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--ink-600)', backgroundColor: 'var(--ink-800)', color: 'var(--cream)', fontSize: '14px' }}
            />
          </details>

          {/* Cover Image */}
          <AdminImageUpload
            folder={ngoId}
            fileName="cover"
            currentUrl={formData.cover_image_url}
            onUploaded={(url) => handleChange('cover_image_url', url)}
            label="Kapak Resmi"
            aspectRatio="16:9"
          />
          <details style={{ marginTop: 8 }}>
            <summary style={{ fontSize: 12, color: 'var(--ink-400)', cursor: 'pointer' }}>
              Alternatif: URL yapıştır
            </summary>
            <input
              type="url"
              value={formData.cover_image_url}
              onChange={(e) => handleChange('cover_image_url', e.target.value)}
              placeholder="https://example.com/cover.jpg"
              style={{ width: '100%', marginTop: 8, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--ink-600)', backgroundColor: 'var(--ink-800)', color: 'var(--cream)', fontSize: '14px' }}
            />
          </details>

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

          {/* Status banner (Vol-24 BUG-055 fix: alert() yerine inline) */}
          {status && (
            <div
              role="status"
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                status.type === 'success'
                  ? 'bg-success/15 border border-success/40 text-success'
                  : 'bg-clay/15 border border-clay/40 text-clay'
              }`}
            >
              {status.type === 'success' ? '✓ ' : '⚠ '}{status.message}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 justify-end pt-6 border-t border-ink-700">
            <button
              type="button"
              onClick={doSubmit}
              disabled={pending}
              className="px-6 py-3 rounded-xl bg-gold text-ink-900 font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
            >
              {pending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
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

          {/* Vol-36.2: Profil tamlık göstergesi (inline JSX, IIFE yok). */}
          <div className="mt-6 bg-ink-800 rounded-2xl border border-ink-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-cream">Profil tamlığı</h4>
              <span className={`text-sm font-bold ${completenessColor}`}>
                %{completenessPct}
              </span>
            </div>
            <div className="w-full h-1.5 bg-ink-900 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all ${completenessBarColor}`}
                style={{ width: `${completenessPct}%` }}
              />
            </div>
            {missingFields.length > 0 ? (
              <div>
                <p className="text-xs text-ink-300 mb-2">
                  Eksik alanlar ({missingFields.length}):
                </p>
                <ul className="space-y-1">
                  {missingFields.map((m) => (
                    <li key={m} className="text-xs text-ink-400 flex items-center gap-2">
                      <span className="text-orange-300">○</span> {m}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-ink-400 mt-3 italic">
                  Bu alanlar public profilinde görünür (sosyal medya
                  butonları, iletişim bağlantıları). Boş alanlar
                  kullanıcıya gösterilmez.
                </p>
              </div>
            ) : (
              <p className="text-xs text-green-300">
                ✓ Tüm alanlar dolu — public profilin maksimum bilgi gösteriyor.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
