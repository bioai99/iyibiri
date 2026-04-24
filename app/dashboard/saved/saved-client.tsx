'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'
import { MissionCard } from '@/components/ui/mission-card'
import { EmptyStateV2, emptyPresets } from '@/components/ui/state'
import type { MissionWithNGO } from '@/lib/supabase/types'

interface Props {
  missions: MissionWithNGO[]
  userId: string
}

export function SavedMissionsClient({ missions, userId }: Props) {
  const { colors: c } = useTheme()

  return (
    <div style={{ minHeight: '100vh', background: c.ink900, color: c.cream, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>
        <h1 style={{
          fontFamily: 'var(--font-display), serif', fontSize: 22, fontWeight: 500,
          margin: 0, letterSpacing: '-0.02em',
        }}>
          Kaydedilenler
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {missions.length === 0 ? (
          <EmptyStateV2 {...emptyPresets.saved} />
        ) : (
          missions.map(mission => (
            <MissionCard key={mission.id} mission={mission} isSaved userId={userId} />
          ))
        )}
      </div>
    </div>
  )
}
