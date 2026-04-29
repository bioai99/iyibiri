'use client'

// Vol-31.5 Bağış geçmişi client — yıllık özet kartı + aktif düzenli destekçilik + tüm bağışlar listesi.

import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { TierButterfly } from '@/components/tier/tier-butterfly'
import type {
  DonationSubscription,
  DonationWithNGO,
  NGOBrief,
} from '@/lib/supabase/types'

interface Summary {
  totalAmount: number
  eligibleAmount: number
  donationCount: number
  thisYearAmount: number
}

interface Props {
  donations: DonationWithNGO[]
  subscriptions: DonationSubscription[]
  summary: Summary
  ngosMap: Record<string, NGOBrief>
}

const SCENARIO_LABEL: Record<string, string> = {
  general: 'Genel bağış',
  specific_campaign: 'Kampanya',
  in_memory: 'Hatıra',
  gift: 'Hediye',
  regular_supporter: 'Düzenli destekçi',
}

const TR_MONTHS_SHORT = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
  'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
]

function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate().toString().padStart(2, '0')} ${TR_MONTHS_SHORT[d.getMonth()]}`
}

export function DonationsHistoryClient({
  donations,
  subscriptions,
  summary,
  ngosMap,
}: Props) {
  const { colors: c } = useTheme()
  const router = useRouter()
  const currentYear = new Date().getFullYear()

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: c.ink900,
        color: c.cream,
        paddingBottom: 120,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Geri"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: c.cream,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: c.ink400,
              textTransform: 'uppercase',
            }}
          >
            PROFİL
          </p>
          <h1
            style={{
              margin: '2px 0 0',
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 22,
              fontWeight: 500,
              color: c.cream,
              letterSpacing: '-0.02em',
            }}
          >
            Bağış geçmişin
          </h1>
        </div>
      </header>

      {/* Vergi karnesi card */}
      <section style={{ padding: '20px 16px 0' }}>
        <div
          style={{
            padding: '20px',
            borderRadius: 22,
            background: `linear-gradient(135deg, ${c.gold}22, ${c.ink800})`,
            border: `1px solid ${c.gold}55`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -10,
              opacity: 0.15,
              transform: 'rotate(-12deg)',
              pointerEvents: 'none',
            }}
            aria-hidden
          >
            <TierButterfly tier={3} size={120} paused />
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: c.gold,
              textTransform: 'uppercase',
            }}
          >
            {currentYear} VERGİ KARNESİ
          </p>
          <h2
            style={{
              margin: '8px 0 4px',
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 30,
              fontWeight: 500,
              color: c.cream,
              letterSpacing: '-0.025em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {summary.thisYearAmount.toLocaleString('tr-TR')} ₺
          </h2>
          <p style={{ margin: '0 0 14px', fontSize: 12, color: c.ink300 }}>
            {summary.donationCount} bağış · {summary.eligibleAmount.toLocaleString('tr-TR')} ₺ vergi indirimine tabi
          </p>
          <button
            type="button"
            disabled
            title="PDF üretimi Vol-33+ ile gelecek"
            style={{
              padding: '11px 14px',
              background: c.ink800,
              color: c.ink400,
              border: `1px solid ${c.ink600}`,
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'not-allowed',
              opacity: 0.7,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'inherit',
            }}
          >
            <FileText size={13} /> PDF makbuz · yakında
          </button>
        </div>
      </section>

      {/* Aktif düzenli destekçilik */}
      {subscriptions.length > 0 && (
        <section style={{ padding: '32px 16px 0' }}>
          <p
            style={{
              margin: '0 4px 12px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: c.gold,
              textTransform: 'uppercase',
            }}
          >
            DÜZENLİ DESTEKÇİLİĞİN
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {subscriptions.map((sub) => {
              const ngo = ngosMap[sub.ngo_id]
              const accent = ngo?.color_accent ?? c.gold
              const label = ngo?.short_name ?? ngo?.name ?? sub.ngo_id
              return (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    borderRadius: 14,
                    background: c.ink800,
                    border: `1px solid ${c.ink600}`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Fraunces', ui-serif, serif",
                      fontSize: 16,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {label[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.cream }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 11, color: c.ink400 }}>
                      {Number(sub.amount_try).toLocaleString('tr-TR')} ₺ / ay ·{' '}
                      {sub.status === 'intent'
                        ? 'Niyet · Vol-33+ aktive'
                        : sub.status}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Tüm bağışlar */}
      <section style={{ padding: '32px 16px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            margin: '0 4px 12px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: c.gold,
              textTransform: 'uppercase',
            }}
          >
            TÜM BAĞIŞLARIN
          </p>
          <span
            style={{
              fontSize: 11,
              color: c.ink400,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {donations.length}
          </span>
        </div>

        {donations.length === 0 ? (
          <div
            style={{
              padding: '32px 20px',
              borderRadius: 16,
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              textAlign: 'center',
              color: c.ink400,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Henüz bir bağış yapmadın. Bağış sekmesinden bir kuruma ilk
            adımı at — küçük tutar bile fark yaratır.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {donations.map((d) => {
              const ngo = d.ngos
              const accent = ngo?.color_accent ?? c.gold
              const label = ngo?.short_name ?? ngo?.name ?? d.ngo_id
              const scenarioLabel =
                SCENARIO_LABEL[d.scenario_type] ?? d.scenario_type
              const intentText = d.intent_label
                ? d.intent_label
                : d.is_recurring
                ? 'Düzenli destekçilik'
                : null
              return (
                <div
                  key={d.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    borderRadius: 14,
                    background: c.ink800,
                    border: `1px solid ${c.ink600}`,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Fraunces', ui-serif, serif",
                      fontSize: 14,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {label[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        color: c.cream,
                      }}
                    >
                      {label}
                      {d.tax_eligible && (
                        <span
                          aria-label="Vergi indirimli"
                          style={{
                            color: c.success ?? '#5DC395',
                            fontSize: 10,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: c.ink400 }}>
                      {formatShortDate(d.created_at)} · {scenarioLabel}
                      {intentText ? ` · ${intentText}` : ''}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: c.gold,
                      fontVariantNumeric: 'tabular-nums',
                      flexShrink: 0,
                    }}
                  >
                    {Number(d.amount_try).toLocaleString('tr-TR')} ₺
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
