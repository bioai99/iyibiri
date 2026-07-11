'use client'

// Vol-64: Karma → Bağış dönüşüm journey'si (client).
// Akış: STK seç → Karma miktarı seç (canlı ₺ önizleme) → onayla → kutlama.
// Kullanıcı para ödemez; TL karşılığını sponsor fonu karşılar.

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Check, Heart, Sparkles } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { KarmaDotToken, KarmaToken } from '@/components/ui/ds'
import { computeTryFromKarma, MIN_KARMA_FOR_DONATION } from '@/lib/donations/karma-formula'
import { redeemKarmaAsDonation } from '@/lib/donations/karma-to-donation'

export interface DonateTarget {
  ngoId: string
  name: string
  fullName: string
  logoUrl: string | null
  colorAccent: string | null
  campaignId: string | null
  campaignTitle: string | null
}

interface Props {
  currentKarma: number
  targets: DonateTarget[]
}

const PRESETS = [100, 250, 500] as const

function formatTry(n: number): string {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function KarmaDonateClient({ currentKarma, targets }: Props) {
  const { colors: c } = useTheme()
  const router = useRouter()
  const prefersReduced = useReducedMotion()
  const [pending, startTransition] = useTransition()

  const [targetIdx, setTargetIdx] = useState(0)
  const [karma, setKarma] = useState<number>(
    Math.min(PRESETS[0], Math.max(MIN_KARMA_FOR_DONATION, 0)),
  )
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<null | { karmaSpent: number; amountTry: number; targetName: string }>(null)

  const target = targets[targetIdx] ?? null
  const tryAmount = useMemo(() => computeTryFromKarma(karma), [karma])
  const canAfford = karma <= currentKarma
  const meetsMin = karma >= MIN_KARMA_FOR_DONATION
  const canSubmit = !!target && canAfford && meetsMin && !pending

  // Presetlerden bakiyeyi aşmayanlar + "Tümü"
  const availablePresets = PRESETS.filter(p => p <= currentKarma)
  const hasAll = currentKarma >= MIN_KARMA_FOR_DONATION

  function submit() {
    if (!target || !canSubmit) return
    setError(null)
    startTransition(async () => {
      const res = await redeemKarmaAsDonation({
        ngoId: target.ngoId,
        campaignId: target.campaignId,
        karma,
      })
      if (res.ok) {
        setDone({ karmaSpent: res.karmaSpent, amountTry: res.amountTry, targetName: target.name })
      } else {
        setError(res.error)
      }
    })
  }

  // ── Kutlama ekranı ──
  if (done) {
    return (
      <div style={{ background: c.ink900, color: c.cream, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center' }}>
          <motion.div
            initial={prefersReduced ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            style={{ marginBottom: 26 }}
          >
            <KarmaToken size={84} />
          </motion.div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: c.gold, marginBottom: 12 }}>
            Bağışın gerçekleşti
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 14px', color: c.cream }}>
            <span style={{ color: c.gold }}>₺{formatTry(done.amountTry)}</span> katkı,<br />{done.targetName}&apos;e ulaştı
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: c.ink300, margin: '0 0 4px', maxWidth: 320 }}>
            {done.karmaSpent.toLocaleString('tr-TR')} Karma&apos;nı iyiliğe çevirdin. TL karşılığını sponsor fonu karşıladı — cebinden bir kuruş çıkmadı, ama bir fark yarattın.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 18, padding: '8px 14px', borderRadius: 999, background: c.goldSoft, border: `1px solid ${c.goldLine}` }}>
            <KarmaDotToken size={13} />
            <span style={{ fontSize: 13, fontWeight: 600, color: c.gold }}>−{done.karmaSpent.toLocaleString('tr-TR')} Karma</span>
          </div>
        </div>
        <div style={{ padding: '0 20px calc(env(safe-area-inset-bottom, 20px) + 24px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => router.push('/dashboard/donate')}
            style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: c.gold, color: c.ink900, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
          >
            Bağışlarımı gör
          </button>
          <button
            onClick={() => router.push('/dashboard/rewards')}
            style={{ width: '100%', padding: '14px', borderRadius: 14, border: `1px solid ${c.ink600}`, background: 'transparent', color: c.cream, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Ödüllere dön
          </button>
        </div>
      </div>
    )
  }

  // ── Ana akış ──
  return (
    <div style={{ background: c.ink900, color: c.cream, minHeight: '100%', paddingBottom: 150 }}>
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 20px) 20px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={() => router.push('/dashboard/rewards')}
          aria-label="Geri"
          style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${c.ink600}`, background: 'transparent', color: c.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: c.gold }}>
            Karma&apos;nı bağışa çevir
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <KarmaDotToken size={13} />
            <span style={{ fontSize: 15, fontWeight: 700, color: c.cream }}>{currentKarma.toLocaleString('tr-TR')}</span>
            <span style={{ fontSize: 12, color: c.ink300 }}>bakiyen</span>
          </div>
        </div>
      </div>

      {/* Boş bakiye durumu */}
      {!hasAll && (
        <div style={{ margin: '24px 20px 0', padding: '20px', borderRadius: 16, background: c.ink800, border: `1px solid ${c.ink600}`, textAlign: 'center' }}>
          <Sparkles size={22} color={c.gold} style={{ marginBottom: 10 }} />
          <p style={{ fontSize: 14, lineHeight: 1.5, color: c.ink200, margin: 0 }}>
            Bağışa çevirmek için en az {MIN_KARMA_FOR_DONATION} Karma gerekiyor. Görev tamamlayarak Karma biriktir, sonra buraya dön.
          </p>
          <button
            onClick={() => router.push('/dashboard/missions')}
            style={{ marginTop: 16, padding: '12px 20px', borderRadius: 12, border: 'none', background: c.gold, color: c.ink900, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            Görevlere git
          </button>
        </div>
      )}

      {hasAll && (
        <>
          {/* Adım 1 — STK seç */}
          <div style={{ padding: '26px 20px 0' }}>
            <SectionLabel c={c}>1 · Kime bağışlansın?</SectionLabel>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4, marginTop: 14, scrollbarWidth: 'none' }}>
              {targets.map((t, i) => (
                <TargetChip
                  key={t.ngoId}
                  target={t}
                  active={i === targetIdx}
                  onClick={() => setTargetIdx(i)}
                  c={c}
                />
              ))}
            </div>
          </div>

          {/* Adım 2 — Karma miktarı */}
          <div style={{ padding: '28px 20px 0' }}>
            <SectionLabel c={c}>2 · Ne kadar Karma?</SectionLabel>
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              {availablePresets.map(p => (
                <AmountChip key={p} label={p.toLocaleString('tr-TR')} active={karma === p} onClick={() => setKarma(p)} c={c} />
              ))}
              <AmountChip
                label="Tümü"
                active={karma === currentKarma}
                onClick={() => setKarma(currentKarma)}
                c={c}
              />
            </div>

            {/* Canlı ₺ önizleme */}
            <div style={{ marginTop: 20, padding: '20px 22px', borderRadius: 18, background: `linear-gradient(135deg, ${c.ink800}, ${c.ink700})`, border: `1px solid ${c.goldLine}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <KarmaDotToken size={13} />
                  <span style={{ fontSize: 20, fontWeight: 700, color: c.cream, fontVariantNumeric: 'tabular-nums' }}>{karma.toLocaleString('tr-TR')}</span>
                  <span style={{ fontSize: 12, color: c.ink300 }}>Karma</span>
                </div>
                <div style={{ fontSize: 11, color: c.ink300, marginTop: 6 }}>10 Karma = ₺1 · sponsor karşılar</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', color: c.ink300, textTransform: 'uppercase' }}>Bağış</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: c.gold, lineHeight: 1, letterSpacing: '-0.02em' }}>₺{formatTry(tryAmount)}</div>
              </div>
            </div>
          </div>

          {/* Özet + hata */}
          {target && (
            <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: c.ink200 }}>
              <Heart size={15} color={c.gold} />
              <span>
                <strong style={{ color: c.cream }}>₺{formatTry(tryAmount)}</strong> · {target.campaignTitle ?? target.fullName}
              </span>
            </div>
          )}
          {error && (
            <div style={{ padding: '14px 20px 0', color: c.danger, fontSize: 13 }}>{error}</div>
          )}
        </>
      )}

      {/* Sticky CTA */}
      {hasAll && (
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, padding: '16px 20px calc(env(safe-area-inset-bottom, 16px) + 84px)', background: `linear-gradient(to top, ${c.ink900} 60%, transparent)`, pointerEvents: 'none' }}>
          <button
            onClick={submit}
            disabled={!canSubmit}
            style={{
              pointerEvents: 'auto',
              width: '100%',
              padding: '16px',
              borderRadius: 14,
              border: 'none',
              background: canSubmit ? c.gold : c.ink700,
              color: canSubmit ? c.ink900 : c.ink300,
              fontSize: 15,
              fontWeight: 700,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background .2s',
            }}
          >
            {pending ? 'Bağışlanıyor…' : <>
              <Check size={18} /> ₺{formatTry(tryAmount)} bağışla
            </>}
          </button>
          {!canAfford && (
            <div style={{ textAlign: 'center', fontSize: 12, color: c.danger, marginTop: 8, pointerEvents: 'auto' }}>Bakiyeni aşıyor</div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Alt bileşenler ──

function SectionLabel({ children, c }: { children: React.ReactNode; c: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: c.ink300 }}>
      {children}
    </div>
  )
}

function AmountChip({ label, active, onClick, c }: { label: string; active: boolean; onClick: () => void; c: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 18px',
        borderRadius: 999,
        border: `1px solid ${active ? c.gold : c.ink600}`,
        background: active ? c.goldSoft : 'transparent',
        color: active ? c.gold : c.cream,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all .15s',
      }}
    >
      {label}
    </button>
  )
}

function TargetChip({ target, active, onClick, c }: { target: DonateTarget; active: boolean; onClick: () => void; c: ReturnType<typeof useTheme>['colors'] }) {
  const initial = target.name[0] ?? '?'
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        width: 128,
        padding: '16px 12px',
        borderRadius: 16,
        border: `1.5px solid ${active ? c.gold : c.ink600}`,
        background: active ? c.goldSoft : c.ink800,
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all .15s',
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        {target.logoUrl ? (
          <Image src={target.logoUrl} alt={target.name} fill sizes="48px" style={{ objectFit: 'contain', padding: 5 }} />
        ) : (
          <span style={{ fontSize: 20, fontWeight: 700, color: c.ink900 }}>{initial}</span>
        )}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: active ? c.gold : c.cream, lineHeight: 1.25, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {target.name}
      </div>
    </button>
  )
}
