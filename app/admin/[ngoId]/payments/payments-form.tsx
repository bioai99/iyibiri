'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updatePaymentConfig } from '@/lib/admin/payment-config-actions'
import type { NGO } from '@/lib/supabase/types'

interface PaymentsFormProps {
  ngo: NGO
  ngoId: string
}

export function PaymentsForm({ ngo, ngoId }: PaymentsFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [formData, setFormData] = useState({
    donation_url: ngo.donation_url || '',
    membership_url: ngo.membership_url || '',
    payment_mode: ngo.payment_mode || 'embedded',
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const result = await updatePaymentConfig(ngoId, formData)
        if (result.success) {
          router.refresh()
          alert('Ödeme ayarları başarıyla güncellendi!')
        } else {
          alert(`Hata: ${result.error}`)
        }
      } catch (err) {
        alert(`Hata: ${(err as Error).message}`)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info Banner */}
      <div className="bg-ink-700/50 border border-ink-600 rounded-2xl p-4">
        <p className="text-sm text-ink-300">
          <strong className="text-cream">ADR-008:</strong> Üç ödeme modu
          destekliyoruz: Embedded (İyiBiri içinde), Passthrough (kendi sisteminize yönlendir), Marketplace
          (iyzico sub-merchant). Sizin tercih ettiğiniz modu seçin veya destek
          ile iletişime geçin.
        </p>
      </div>

      {/* Payment Mode */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-4">
          Ödeme Modu
        </label>
        <div className="space-y-3">
          {(
            [
              {
                value: 'embedded',
                label: 'Embedded',
                desc: 'İyiBiri uygulaması içinde ödeme formu (önerilen)',
              },
              {
                value: 'passthrough',
                label: 'Passthrough',
                desc: 'Kendi ödeme sisteminize yönlendir (In-App Browser)',
              },
              {
                value: 'marketplace',
                label: 'Marketplace',
                desc: 'İyiBiri iyzico Marketplace (yeni STK\'lar)',
              },
            ] as const
          ).map((m) => (
            <label
              key={m.value}
              className="flex items-start gap-3 p-4 rounded-lg border border-ink-600 hover:border-ink-500 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="payment_mode"
                value={m.value}
                checked={formData.payment_mode === m.value}
                onChange={(e) => handleChange('payment_mode', e.target.value)}
                className="mt-1 w-4 h-4 accent-gold"
              />
              <div>
                <div className="font-medium text-cream">{m.label}</div>
                <div className="text-xs text-ink-300">{m.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Donation URL */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-2">
          Bağış URL'si (Opsiyonel)
        </label>
        <input
          type="url"
          value={formData.donation_url}
          onChange={(e) => handleChange('donation_url', e.target.value)}
          placeholder="https://bagis.example.com veya fonzip URL'i"
          className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <p className="text-xs text-ink-300 mt-2">
          Passthrough modunda, kullanıcılar bu URL'ye yönlendirilecektir.
        </p>
      </div>

      {/* Membership URL */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-2">
          Üyelik URL'si (Opsiyonel)
        </label>
        <input
          type="url"
          value={formData.membership_url}
          onChange={(e) => handleChange('membership_url', e.target.value)}
          placeholder="https://uyelik.example.com veya fonzip URL'i"
          className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <p className="text-xs text-ink-300 mt-2">
          Passthrough modunda üyelik tekliflerinde kullanılacaktır.
        </p>
      </div>

      {/* Platform Info */}
      <div className="bg-ink-800 rounded-2xl p-6 border border-ink-700 space-y-4">
        <h3 className="font-semibold text-cream">Platform Tarafı Ayarları</h3>

        <div className="space-y-2 text-sm">
          <div>
            <label className="text-xs font-medium text-ink-300 block">
              İyiBiri Marketplace Alt-Merchant ID
            </label>
            <p className="text-cream">
              Platform tarafından ayarlanır (Marketplace modu seçildiyse)
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-300 block">
              iyzico / PayTR / fonzip Merchant Key
            </label>
            <p className="text-cream">
              Supabase Vault'ta güvenli saklanır (IP whitelist + audit)
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-300 block">
              PCI DSS Compliance
            </label>
            <p className="text-cream">
              Embedded modda SAQ A scope (kart bilgisi iframe içinde)
            </p>
          </div>
        </div>

        <p className="text-xs text-ink-300 border-t border-ink-600 pt-4">
          Platform tarafı setup için destek@iyibiri.app ile iletişime geçin.
        </p>
      </div>

      {/* Submit */}
      <div className="flex gap-3 justify-end pt-6 border-t border-ink-700">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 rounded-xl bg-gold text-ink-900 font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          {pending ? 'Kaydediliyor...' : 'Ödeme Ayarlarını Kaydet'}
        </button>
      </div>
    </form>
  )
}
