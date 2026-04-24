'use client'

import { useState } from 'react'
import type { MembershipFeeConfig, FeeTier } from '@/lib/supabase/types'

interface FeeConfigEditorProps {
  config: MembershipFeeConfig | null
  onChange: (config: MembershipFeeConfig) => void
}

type FeeMode = 'age_tiered' | 'monthly' | 'donation_based'

export function FeeConfigEditor({ config, onChange }: FeeConfigEditorProps) {
  const [mode, setMode] = useState<FeeMode>(
    (config?.mode as FeeMode) || 'monthly',
  )

  const handleModeChange = (newMode: FeeMode) => {
    setMode(newMode)
    // Reset tiers
    const newConfig: MembershipFeeConfig = {
      mode: newMode,
      currency: 'TRY',
      tiers:
        newMode === 'monthly' || newMode === 'age_tiered'
          ? [
              {
                id: 'default',
                name: 'Standart',
                amount: 100,
                period: 'monthly',
              },
            ]
          : [],
      ...(newMode === 'donation_based' && {
        donation_based: {
          min_amount: 50,
          suggested_amounts: [100, 250, 500],
        },
      }),
    }
    onChange(newConfig)
  }

  const addTier = () => {
    const currentConfig = config || {
      mode,
      currency: 'TRY',
      tiers: [],
    }
    const newTier: FeeTier = {
      id: `tier-${Date.now()}`,
      name: `Tier ${(currentConfig.tiers?.length || 0) + 1}`,
      amount: 100,
      period: 'annual',
      display_order: (currentConfig.tiers?.length || 0) + 1,
    }
    onChange({
      ...currentConfig,
      tiers: [...(currentConfig.tiers || []), newTier],
    })
  }

  const removeTier = (tierId: string) => {
    const currentConfig = config || { mode, currency: 'TRY', tiers: [] }
    onChange({
      ...currentConfig,
      tiers: (currentConfig.tiers || []).filter((t) => t.id !== tierId),
    })
  }

  const updateTier = (tierId: string, updates: Partial<FeeTier>) => {
    const currentConfig = config || { mode, currency: 'TRY', tiers: [] }
    onChange({
      ...currentConfig,
      tiers: (currentConfig.tiers || []).map((t) =>
        t.id === tierId ? { ...t, ...updates } : t,
      ),
    })
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div>
        <h3 className="text-sm font-semibold text-cream mb-4">
          Ücretlendirme Modunu Seç
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              {
                value: 'age_tiered' as FeeMode,
                label: 'Yaş Tabanlı',
                desc: 'Yaş aralıklarına göre farklı tier',
              },
              {
                value: 'monthly' as FeeMode,
                label: 'Aylık',
                desc: 'Sabit aylık ücret',
              },
              {
                value: 'donation_based' as FeeMode,
                label: 'Bağış Tabanlı',
                desc: 'Müşteri belirler tutarı',
              },
            ] as const
          ).map((m) => (
            <button
              key={m.value}
              onClick={() => handleModeChange(m.value)}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                mode === m.value
                  ? 'bg-gold/20 border-gold text-cream'
                  : 'bg-ink-800 border-ink-600 text-ink-300 hover:border-ink-500'
              }`}
            >
              <div className="font-medium text-sm">{m.label}</div>
              <div className="text-xs text-ink-400 mt-1">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mode-specific content */}
      {mode === 'age_tiered' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-cream">
              Yaş Aralıkları & Tier'lar
            </h3>
            <button
              onClick={addTier}
              className="text-xs bg-gold text-ink-900 px-3 py-1 rounded-lg font-medium hover:bg-gold/90"
            >
              + Tier Ekle
            </button>
          </div>
          <div className="space-y-3">
            {(config?.tiers || []).map((tier) => (
              <div
                key={tier.id}
                className="bg-ink-800 p-4 rounded-lg border border-ink-600 space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => updateTier(tier.id, { name: e.target.value })}
                    placeholder="Tier adı (ör. Genç Üye)"
                    className="px-3 py-2 rounded-lg bg-ink-700 border border-ink-600 text-cream text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={tier.amount}
                      onChange={(e) =>
                        updateTier(tier.id, { amount: Number(e.target.value) })
                      }
                      placeholder="Tutar (₺)"
                      className="flex-1 px-3 py-2 rounded-lg bg-ink-700 border border-ink-600 text-cream text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <button
                      onClick={() => removeTier(tier.id)}
                      className="px-3 py-2 bg-clay/20 text-clay rounded-lg text-sm hover:bg-clay/30"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={tier.age_min || ''}
                    onChange={(e) =>
                      updateTier(tier.id, {
                        age_min: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Min yaş"
                    className="px-3 py-2 rounded-lg bg-ink-700 border border-ink-600 text-cream text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="number"
                    value={tier.age_max || ''}
                    onChange={(e) =>
                      updateTier(tier.id, {
                        age_max: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Max yaş"
                    className="px-3 py-2 rounded-lg bg-ink-700 border border-ink-600 text-cream text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'monthly' && (
        <div>
          <h3 className="text-sm font-semibold text-cream mb-3">
            Aylık Ücret
          </h3>
          <div className="bg-ink-800 p-4 rounded-lg border border-ink-600">
            <input
              type="number"
              value={config?.tiers?.[0]?.amount || 100}
              onChange={(e) =>
                onChange({
                  ...(config || { mode: 'monthly', currency: 'TRY', tiers: [] }),
                  tiers: [
                    {
                      id: 'monthly',
                      name: 'Aylık',
                      amount: Number(e.target.value),
                      period: 'monthly',
                    },
                  ],
                })
              }
              placeholder="Aylık tutar (₺)"
              className="w-full px-3 py-2 rounded-lg bg-ink-700 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      )}

      {mode === 'donation_based' && (
        <div>
          <h3 className="text-sm font-semibold text-cream mb-3">
            Bağış Ayarları
          </h3>
          <div className="space-y-3 bg-ink-800 p-4 rounded-lg border border-ink-600">
            <div>
              <label className="text-xs font-medium text-cream block mb-2">
                Minimum Tutar (₺)
              </label>
              <input
                type="number"
                value={config?.donation_based?.min_amount || 50}
                onChange={(e) =>
                  onChange({
                    ...(config || {
                      mode: 'donation_based',
                      currency: 'TRY',
                      tiers: [],
                    }),
                    donation_based: {
                      ...config?.donation_based,
                      min_amount: Number(e.target.value),
                    },
                  })
                }
                placeholder="Minimum tutar"
                className="w-full px-3 py-2 rounded-lg bg-ink-700 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-cream block mb-2">
                Önerilen Tutarlar (virgülle ayırılmış)
              </label>
              <input
                type="text"
                value={
                  (config?.donation_based?.suggested_amounts || []).join(',') ||
                  '100,250,500'
                }
                onChange={(e) =>
                  onChange({
                    ...(config || {
                      mode: 'donation_based',
                      currency: 'TRY',
                      tiers: [],
                    }),
                    donation_based: {
                      ...(config?.donation_based || { min_amount: 50 }),
                      suggested_amounts: e.target.value
                        .split(',')
                        .map((n) => Number(n.trim())),
                    },
                  })
                }
                placeholder="100,250,500"
                className="w-full px-3 py-2 rounded-lg bg-ink-700 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
        </div>
      )}


      {/* Cooling-off days */}
      <div className="border-t border-ink-700 pt-6">
        <label className="block text-sm font-semibold text-cream mb-2">
          Cayma Hakkı Günleri (Ticari Sözleşme)
        </label>
        <input
          type="number"
          value={config?.cooling_off_days || 14}
          onChange={(e) =>
            onChange({
              ...(config || { mode, currency: 'TRY', tiers: [] }),
              cooling_off_days: Number(e.target.value),
            })
          }
          min="0"
          max="30"
          className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <p className="text-xs text-ink-300 mt-2">
          TR 6502 Tüketici Korunması Kanunu uyarınca ücretli üyeliğe 14 gün cayma
          hakkı tanıtılır.
        </p>
      </div>
    </div>
  )
}
