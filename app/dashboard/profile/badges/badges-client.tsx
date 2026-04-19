'use client'

import Link from 'next/link'
import { ArrowLeft, Lock, Check, Footprints, Flower2, Heart, Zap, Diamond, Crown } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import type { LucideIcon } from 'lucide-react'

interface BadgeDef {
  id: string
  name: string
  icon: LucideIcon
  desc: string
  earned: boolean
}

interface BadgesClientProps {
  karma: number
  streak: number
  completedCount: number
  memberNgoCount: number
}

function computeBadges(props: BadgesClientProps): BadgeDef[] {
  const { karma, streak, completedCount, memberNgoCount } = props
  return [
    {
      id: '1',
      name: 'İlk Adım',
      icon: Footprints,
      desc: 'İlk görevini tamamla',
      earned: completedCount >= 1,
    },
    {
      id: '2',
      name: 'Çevre Dostu',
      icon: Flower2,
      desc: '3 görev tamamla',
      earned: completedCount >= 3,
    },
    {
      id: '3',
      name: 'Kalp Kalbe',
      icon: Heart,
      desc: '3 kuruluşa üye ol',
      earned: memberNgoCount >= 3,
    },
    {
      id: '4',
      name: 'Yıldırım',
      icon: Zap,
      desc: '7 günlük seri yap',
      earned: streak >= 7,
    },
    {
      id: '5',
      name: 'Elmas',
      icon: Diamond,
      desc: '5.000 Karma kazan',
      earned: karma >= 5000,
    },
    {
      id: '6',
      name: 'Liderlik',
      icon: Crown,
      desc: '10.000 Karma kazan',
      earned: karma >= 10000,
    },
  ]
}

export function BadgesClient({ karma, streak, completedCount, memberNgoCount }: BadgesClientProps) {
  const { colors: c } = useTheme()

  const badges = computeBadges({ karma, streak, completedCount, memberNgoCount })
  const earnedBadges = badges.filter(b => b.earned)
  const lockedBadges = badges.filter(b => !b.earned)

  return (
    <div style={{ minHeight: '100vh', background: c.ink900, color: c.cream, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top, 20px) + 16px) 20px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: `1px solid ${c.ink600}`,
        background: c.ink900,
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <Link href="/dashboard/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <ArrowLeft size={18} color={c.cream} />
          </div>
        </Link>
        <h1 style={{
          margin: 0,
          fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: c.cream,
          flex: 1,
        }}>
          Rozetlerim
        </h1>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { value: earnedBadges.length, label: 'Kazanılan', color: c.gold },
            { value: completedCount, label: 'Görev', color: c.sage },
            { value: streak, label: 'Seri', color: c.clay },
          ].map(({ value, label, color }) => (
            <div key={label} style={{
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 14,
              padding: '14px 12px',
              textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color }}>
                {value}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 10, color: c.ink300, fontWeight: 600, letterSpacing: '0.04em' }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <section style={{ marginTop: 28 }}>
            <p style={{
              margin: '0 0 14px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: c.gold,
            }}>
              Kazanılan Rozetler
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {earnedBadges.map(b => {
                const Icon = b.icon
                return (
                  <div key={b.id} style={{
                    background: c.ink800,
                    border: `2px solid ${c.goldLine}`,
                    borderRadius: 16,
                    padding: '16px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    position: 'relative',
                  }}>
                    {/* Check badge */}
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: c.success,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Check size={10} color="#FFFFFF" strokeWidth={3} />
                    </div>

                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: c.goldSoft,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={22} color={c.gold} strokeWidth={1.5} />
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: c.cream,
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}>
                      {b.name}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: 10,
                      color: c.ink300,
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}>
                      {b.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <section style={{ marginTop: 28 }}>
            <p style={{
              margin: '0 0 14px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: c.ink300,
            }}>
              Kilitli Rozetler
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {lockedBadges.map(b => {
                const Icon = b.icon
                return (
                  <div key={b.id} style={{
                    background: c.ink800,
                    border: `1px solid ${c.ink600}`,
                    borderRadius: 16,
                    padding: '16px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    opacity: 0.55,
                    position: 'relative',
                  }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: c.ink700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon size={22} color={c.ink400} strokeWidth={1.5} />
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: c.ink500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Lock size={9} color={c.ink900} />
                      </div>
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: c.cream,
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}>
                      {b.name}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: 10,
                      color: c.ink300,
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}>
                      {b.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Next badge progress teaser */}
        {lockedBadges.length > 0 && (() => {
          const next = lockedBadges[0]
          const Icon = next.icon
          return (
            <div style={{
              marginTop: 28,
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 16,
              padding: 18,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Icon size={16} color={c.gold} strokeWidth={1.5} />
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: c.cream }}>
                  {next.name} rozetine yaklaşıyorsun
                </p>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: c.ink300 }}>
                {next.desc}
              </p>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
