'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { createNgoSignupRequest } from '@/lib/onboarding/ngo-signup-actions'

const CATEGORIES = [
  { value: 'environment', label: '🌱 Çevre' },
  { value: 'education', label: '📚 Eğitim' },
  { value: 'animals', label: '🐾 Hayvanlar' },
  { value: 'health', label: '🏥 Sağlık' },
  { value: 'disaster', label: '🚨 Afet' },
  { value: 'community', label: '🤝 Topluluk' },
]

// Vol-26 BUG-044 fix: STK self-signup form (Vol-25 button onClick pattern)
export function NgoSignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    ngo_name: '',
    short_name: '',
    category: '',
    city: '',
    website: '',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    reason: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errorMsg) setErrorMsg(null)
  }

  const doSubmit = async () => {
    if (isLoading) return
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const result = await createNgoSignupRequest(formData)
      if (result.success) {
        setSuccess(true)
      } else {
        setErrorMsg(result.error ?? 'Beklenmeyen hata')
      }
    } catch (err) {
      setErrorMsg((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  // Success state — formu gizle, teşekkür mesajı göster
  if (success) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-2xl font-display font-bold text-cream mb-2">
          Başvurunuz alındı!
        </h3>
        <p className="text-ink-300 max-w-md mx-auto leading-relaxed mb-6">
          Ekibimiz başvurunuzu en geç 5 iş günü içinde inceleyip{' '}
          <span className="text-cream font-medium">{formData.contact_email}</span>{' '}
          adresine dönüş yapacak. Sorularınız için{' '}
          <a href="mailto:onboarding@iyibiri.app" className="text-gold hover:underline">
            onboarding@iyibiri.app
          </a>
          .
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 transition-colors"
        >
          Ana Sayfaya Dön
        </a>
      </div>
    )
  }

  const labelCls = 'block text-sm font-semibold text-cream mb-2'
  const inputCls = 'w-full px-4 py-2 rounded-xl bg-ink-700 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold'

  return (
    <div className="space-y-6">
      {/* Section A: STK */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gold uppercase tracking-wider">A. STK Bilgileri</h3>

        <div>
          <label className={labelCls}>STK Adı *</label>
          <input
            type="text"
            value={formData.ngo_name}
            onChange={(e) => handleChange('ngo_name', e.target.value)}
            placeholder="Ör. Türkiye Erozyonla Mücadele Vakfı"
            maxLength={120}
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Kısa Ad</label>
            <input
              type="text"
              value={formData.short_name}
              onChange={(e) => handleChange('short_name', e.target.value)}
              placeholder="Ör. TEMA"
              maxLength={20}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Şehir</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="İstanbul, Ankara, ..."
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Faaliyet Alanı</label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={inputCls}
          >
            <option value="">Seçiniz...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Web Sitesi</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://www.stk.org.tr"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>STK Açıklaması (kısa)</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Misyonunuzu 1-2 cümleyle anlatın..."
            rows={3}
            maxLength={400}
            className={inputCls}
          />
        </div>
      </div>

      {/* Section B: İletişim */}
      <div className="space-y-4 border-t border-ink-700 pt-6">
        <h3 className="text-sm font-semibold text-gold uppercase tracking-wider">B. İletişim Kişisi</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Ad Soyad *</label>
            <input
              type="text"
              value={formData.contact_name}
              onChange={(e) => handleChange('contact_name', e.target.value)}
              placeholder="Ör. Ayşe Yılmaz"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>E-posta *</label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              placeholder="ayse@stk.org.tr"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Telefon</label>
          <input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) => handleChange('contact_phone', e.target.value)}
            placeholder="+90 532 123 45 67"
            className={inputCls}
          />
        </div>
      </div>

      {/* Section C: Reason */}
      <div className="space-y-4 border-t border-ink-700 pt-6">
        <h3 className="text-sm font-semibold text-gold uppercase tracking-wider">C. Başvuru Nedeniniz</h3>

        <div>
          <label className={labelCls}>
            Neden iyiBiri&apos;ye katılmak istiyorsunuz? *
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            placeholder="Mevcut gönüllü/üye toplama ihtiyaçlarınız, hedefleriniz, beklediğiniz katma değer..."
            rows={5}
            maxLength={1000}
            className={inputCls}
          />
          <p className="text-xs text-ink-400 mt-1">
            {formData.reason.length} / 1000 karakter — en az 30 karakter
          </p>
        </div>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div
          role="alert"
          className="rounded-xl px-4 py-3 text-sm font-medium bg-clay/15 border border-clay/40 text-clay"
        >
          ⚠ {errorMsg}
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3 pt-4 border-t border-ink-700">
        <button
          type="button"
          onClick={doSubmit}
          disabled={isLoading}
          className="px-6 py-3 rounded-xl bg-gold text-ink-900 font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Gönderiliyor…' : 'Başvuruyu Gönder'}
        </button>
        <p className="text-xs text-ink-300 self-center leading-relaxed">
          Gönder düğmesine basarak{' '}
          <a href="/legal/kvkk" className="text-gold hover:underline">
            KVKK Aydınlatma Metni
          </a>
          &apos;ni kabul etmiş sayılırsınız.
        </p>
      </div>
    </div>
  )
}
