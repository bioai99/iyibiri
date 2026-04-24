'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'
import { MissionCard } from '@/components/ui/mission-card'
import { EmptyStateV2, emptyPresets } from '@/components/ui/state'
import type { MissionWithNGO } from '@/lib/supabase/types'

interface Props {
  activeMissions: MissionWithNGO[]
  completedMissions: MissionWithNGO[]
  savedMissionIds: string[]
  memberNgoIds: string[]
  userId: string
}

export default function MyMissionsClient({
  activeMissions,
  completedMissions,
  savedMissionIds,
  memberNgoIds,
  userId,
}: Props) {
  const { colors: c } = useTheme()
  const [tab, setTab] = useState<'active' | 'completed'>('active')

  const displayFont = 'var(--font-display), Fraunces, serif'

  const tabs: { key: 'active' | 'completed'; label: string; count?: number }[] = [
    { key: 'active', label: 'Aktif', count: activeMissions.length || undefined },
    { key: 'completed', label: 'Tamamlanan', count: completedMissions.length || undefined },
  ]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh',
      background: c.ink900, paddingBottom: 96,
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: c.ink900,
        borderBottom: `1px solid ${c.ink600}`,
        padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 16px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
          </Link>
          <h1 style={{
            fontFamily: displayFont, fontSize: 20, fontWeight: 600,
            color: c.cream, margin: 0, flex: 1,
            letterSpacing: '-0.01em',
          }}>
            Görevlerim
          </h1>
        </div>

        {/* Tab toggle */}
        <div style={{ display: 'flex' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '0 0 10px', cursor: 'pointer',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${tab === t.key ? c.gold : 'transparent'}`,
                fontSize: 14, fontWeight: 600,
                color: tab === t.key ? c.cream : c.ink400,
                transition: 'all 200ms ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {t.label}
              {t.count != null && t.count > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: tab === t.key ? c.gold : c.ink600,
                  color: tab === t.key ? c.ink : c.ink300,
                  borderRadius: 999,
                  padding: '2px 7px',
                  lineHeight: '14px',
                }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: '16px 16px 0' }}>
        {tab === 'active' ? (
          activeMissions.length === 0 ? (
            <EmptyStateV2 {...emptyPresets.noActiveMissions} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {activeMissions.map(mission => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  isSaved={savedMissionIds.includes(mission.id)}
                  isMember={memberNgoIds.includes(mission.ngo_id ?? '')}
                  userId={userId}
                />
              ))}
            </div>
          )
        ) : (
          completedMissions.length === 0 ? (
            <EmptyStateV2 {...emptyPresets.noCompletedMissions} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {completedMissions.map(mission => (
                <div key={mission.id} style={{ position: 'relative' }}>
                  <MissionCard
                    mission={mission}
                    isSaved={savedMissionIds.includes(mission.id)}
                    isMember={memberNgoIds.includes(mission.ngo_id ?? '')}
                    userId={userId}
                  />
                  {/* Completed badge overlay */}
                  <div style={{
                    position: 'absolute', top: 10, right: 52,
                    background: c.success,
                    borderRadius: 999,
                    padding: '4px 10px',
                    display: 'flex', alignItems: 'center', gap: 4,
                    boxShadow: '0 2px 6px rgba(0,0,0,.3)',
                    zIndex: 2,
                  }}>
                    <CheckCircle2 size={12} color="#fff" strokeWidth={2.5} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                      Tamamlandı
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
