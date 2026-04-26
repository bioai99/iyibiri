'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles, Gift, Award } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'

interface Transaction {
  id: string
  amount: number
  type: 'mission_complete' | 'reward_redemption' | string
  reference_id: string | null
  description: string | null
  created_at: string
}

interface KarmaHistoryClientProps {
  transactions: Transaction[]
  karmaTotal: number
}

const TYPE_LABEL: Record<string, { icon: typeof Sparkles; label: string; color: 'gold' | 'clay' | 'success' }> = {
  mission_complete: { icon: Sparkles, label: 'Görev tamamlandı', color: 'gold' },
  reward_redemption: { icon: Gift, label: 'Ödül kullanıldı', color: 'clay' },
  welcome: { icon: Award, label: 'Hoş geldin bonusu', color: 'success' },
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return iso
  }
}

// Vol-24 BUG-054 fix: Karma history sayfası MVP.
// Eskiden /dashboard/karma 404 dönüyordu; profile sadece toplam karma gösteriyordu.
// Bu sayfa son 100 karma transaction'ı liste halinde gösterir.
export function KarmaHistoryClient({
  transactions,
  karmaTotal,
}: KarmaHistoryClientProps) {
  const { colors: c } = useTheme()
  const displayFont = 'var(--font-display), ui-serif, Georgia, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  return (
    <div style={{ background: c.ink900, minHeight: '100vh', color: c.cream, paddingBottom: 120 }}>
      {/* Header */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Link href="/dashboard/profile" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>
        <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 500, margin: 0, color: c.cream }}>
          Karma Geçmişi
        </h1>
      </div>

      {/* Total card */}
      <div style={{ padding: '24px 20px 16px' }}>
        <div style={{
          background: c.ink800,
          border: `1px solid ${c.ink600}`,
          borderRadius: 16,
          padding: 20,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: c.goldSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={22} color={c.gold} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: c.ink300, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Toplam Karma
            </div>
            <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: c.gold, lineHeight: 1.1 }}>
              {karmaTotal.toLocaleString('tr-TR')}
            </div>
          </div>
        </div>
      </div>

      {/* Section title */}
      <div style={{ padding: '8px 20px 12px' }}>
        <h2 style={{ fontFamily: uiFont, fontSize: 11, fontWeight: 600, color: c.ink300, letterSpacing: '.06em', textTransform: 'uppercase', margin: 0 }}>
          Son İşlemler ({transactions.length})
        </h2>
      </div>

      {/* List */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {transactions.length === 0 ? (
          <div style={{
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            borderRadius: 14,
            padding: '32px 20px',
            textAlign: 'center',
          }}>
            <Sparkles size={28} color={c.ink400} style={{ marginBottom: 8 }} />
            <p style={{ fontSize: 14, color: c.ink300, margin: 0 }}>
              Henüz karma işlemi yok
            </p>
            <p style={{ fontSize: 12, color: c.ink400, marginTop: 6 }}>
              İlk görevi tamamlayarak karma kazanmaya başla
            </p>
            <Link
              href="/dashboard/missions"
              style={{
                display: 'inline-block',
                marginTop: 14,
                padding: '10px 18px',
                background: c.gold,
                color: '#241E18',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Görevleri Keşfet
            </Link>
          </div>
        ) : (
          transactions.map((tx) => {
            const meta = TYPE_LABEL[tx.type] ?? { icon: Sparkles, label: tx.type, color: 'gold' as const }
            const Icon = meta.icon
            const colorVal = meta.color === 'clay' ? c.clay : meta.color === 'success' ? c.success : c.gold
            const positive = tx.amount > 0
            return (
              <div
                key={tx.id}
                style={{
                  background: c.ink800,
                  border: `1px solid ${c.ink600}`,
                  borderRadius: 12,
                  padding: 14,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${colorVal}1A`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={colorVal} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: c.cream, fontWeight: 500 }}>
                    {tx.description ?? meta.label}
                  </div>
                  <div style={{ fontSize: 11, color: c.ink400, marginTop: 2 }}>
                    {formatDate(tx.created_at)}
                  </div>
                </div>
                <div style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: positive ? c.gold : c.clay,
                  fontVariantNumeric: 'tabular-nums',
                  flexShrink: 0,
                }}>
                  {positive ? '+' : ''}{tx.amount}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
