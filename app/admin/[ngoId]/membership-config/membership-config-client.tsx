'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateMembershipConfig } from '@/lib/admin/membership-config-actions'
import { FeeConfigEditor } from './fee-config-editor'
import type { NGO } from '@/lib/supabase/types'
import type { MembershipFeeConfig } from '@/lib/supabase/types'

interface MembershipConfigClientProps {
  ngo: NGO
  ngoId: string
}

// Vol-24 BUG-055 fix (proactive): useTransition + alert() pattern'i kaldırıldı.
// Inline status banner + manuel isLoading state.
export function MembershipConfigClient({
  ngo,
  ngoId,
}: MembershipConfigClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [feeConfig, setFeeConfig] = useState<MembershipFeeConfig | null>(
    ngo.membership_fee_config,
  )
  const [kvkkUrl, setKvkkUrl] = useState(ngo.kvkk_document_url || '')
  const [contractUrl, setContractUrl] = useState(
    ngo.membership_contract_url || '',
  )
  const [volunteerUrl, setVolunteerUrl] = useState(
    ngo.volunteer_consent_url || '',
  )

  const handleSave = async () => {
    setIsLoading(true)
    setStatus(null)

    try {
      const result = await updateMembershipConfig(ngoId, {
        membership_fee_config: feeConfig,
        kvkk_document_url: kvkkUrl || null,
        membership_contract_url: contractUrl || null,
        volunteer_consent_url: volunteerUrl || null,
      })

      if (result.success) {
        setStatus({ type: 'success', message: 'Üyelik ayarları başarıyla kaydedildi.' })
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

  return (
    <div className="space-y-8">
      {/* Section A: Fee Config */}
      <div className="bg-ink-800 rounded-2xl p-6 border border-ink-700">
        <h2 className="text-xl font-bold text-cream mb-6">
          A. Ücretlendirme Modeli
        </h2>
        <FeeConfigEditor config={feeConfig} onChange={setFeeConfig} />
      </div>

      {/* Section B: Legal Documents */}
      <div className="bg-ink-800 rounded-2xl p-6 border border-ink-700">
        <h2 className="text-xl font-bold text-cream mb-6">
          B. Yasal Dokümanlar
        </h2>
        <div className="space-y-4">
          <div className="bg-clay/10 rounded-lg p-4 border border-clay/30 mb-4">
            <p className="text-sm text-clay">
              ⚠️ KVKK ve üyelik sözleşmeleri üyelik formundan önce
              gönüllülere gösterilir. Doküman URL'leri HTTPS olmalı.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-cream mb-2">
              KVKK Aydınlatma Metni URL *
            </label>
            <input
              type="url"
              value={kvkkUrl}
              onChange={(e) => setKvkkUrl(e.target.value)}
              placeholder="https://example.com/kvkk-aydinlatma.pdf"
              className="w-full px-4 py-2 rounded-xl bg-ink-700 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <p className="text-xs text-ink-300 mt-2">
              Referans: `public/legal/kvkk-aydinlatma-uyelik.md` (template)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-cream mb-2">
              Üyelik Sözleşmesi URL *
            </label>
            <input
              type="url"
              value={contractUrl}
              onChange={(e) => setContractUrl(e.target.value)}
              placeholder="https://example.com/uyelik-sozlesmesi.pdf"
              className="w-full px-4 py-2 rounded-xl bg-ink-700 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-cream mb-2">
              Gönüllülük Sözleşmesi URL (opsiyonel)
            </label>
            <input
              type="url"
              value={volunteerUrl}
              onChange={(e) => setVolunteerUrl(e.target.value)}
              placeholder="https://example.com/gonullu-sozlesmesi.pdf"
              className="w-full px-4 py-2 rounded-xl bg-ink-700 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
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

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={pending}
          className="px-6 py-3 rounded-xl bg-gold text-ink-900 font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          {pending ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
        </button>
      </div>
    </div>
  )
}
