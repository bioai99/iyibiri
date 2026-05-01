'use client'

import React from 'react'
import Link from 'next/link'
import { Flame, Zap, Trophy } from 'lucide-react'
import { KarmaDotToken } from './karma-dot-token'
import { BrandLogo } from '@/components/ui/brand-logo'
import { useTheme } from '@/lib/theme'
import { getTierByKarma } from '@/lib/tiers'

// ADR-014 Accepted (2026-04-26): TIER_NAMES + TIER_THRESHOLDS hardcoded array kaldırıldı.
// Eski drift: "İyi Yürekli/İyilik Elçisi/İyilik Savaşçısı/İyiliğin Işığı" Set C — atlas Bölüm 6 ile uyumsuzdu.
// Şimdi canonical Set A `lib/tiers.ts` kullanılıyor.

function computeTier(karma: number) {
  const tier = getTierByKarma(karma)
  return { tierLevel: tier.id, tierName: tier.name }
}

interface HeroCardProps {
  profile: { karma: number; completed: number; taken: number; streak: number }
}

function StatCell({ icon, iconBg, value, label, href }: {
  icon: React.ReactNode
  iconBg: string
  value: string | number
  label: string
  href: string
}) {
  const { colors: c } = useTheme()
  return (
    <Link href={href} style={{
      flex: 1,
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '14px 4px 12px',
      gap: 0,
    }}>
      <div style={{
        width: 30,
        height: 30,
        borderRadius: 10,
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: 17,
        fontWeight: 700,
        color: c.cream,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: c.ink300, marginTop: 3 }}>
        {label}
      </div>
    </Link>
  )
}

export function HeroCard({ profile }: HeroCardProps) {
  const { colors: c } = useTheme()
  const { tierLevel, tierName } = computeTier(profile.karma)

  return (
    <div
      style={{
        background: c.ink800,
        borderRadius: 20,
        border: `1px solid ${c.ink600}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Main: karma left, butterfly right ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px 12px 16px 22px',
        gap: 8,
      }}>
        {/* Left: Karma */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
            <KarmaDotToken size={14} />
            <span style={{
              fontSize: 44,
              fontWeight: 700,
              color: c.cream,
              letterSpacing: '-0.035em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 0.95,
            }}>
              {profile.karma.toLocaleString('tr-TR')}
            </span>
          </div>
          <div style={{ fontSize: 13, color: c.ink300 }}>
            Karma
          </div>
        </div>

        {/* Right: Butterfly + tier name + dots → tappable */}
        <Link href="/dashboard/tiers" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <BrandLogo tierLevel={tierLevel} />
            <div style={{
              fontFamily: "'Fraunces', var(--font-display), ui-serif, Georgia, serif",
              fontStyle: 'italic',
              fontSize: 13,
              fontWeight: 500,
              color: c.gold,
              marginTop: -6,
            }}>
              {tierName}
            </div>
            <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
              {[1, 2, 3, 4, 5].map(t => (
                <div key={t} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: t <= tierLevel ? c.gold : c.ink600,
                }} />
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* ── Stats row — 3 tappable cells with icon badges ── */}
      <div style={{
        display: 'flex',
        borderTop: `1px solid ${c.ink600}`,
      }}>
        <StatCell
          icon={<Zap size={14} color={c.gold} strokeWidth={2.5} />}
          iconBg={c.goldSoft}
          value={profile.taken}
          label="aktif görev"
          href="/dashboard/my-missions"
        />
        <div style={{ width: 1, background: c.ink600 }} />
        <StatCell
          icon={<Trophy size={14} color={c.sage} strokeWidth={2.5} />}
          iconBg="rgba(196,203,172,0.12)"
          value={profile.completed}
          label="tamamlandı"
          href="/dashboard/my-missions"
        />
        <div style={{ width: 1, background: c.ink600 }} />
        <StatCell
          icon={<Flame size={14} color="#D19B3C" strokeWidth={2.5} />}
          iconBg="rgba(209,155,60,0.12)"
          value={`${profile.streak}`}
          label="gün seri"
          href="/dashboard/streak"
        />
      </div>
    </div>
  )
}
