'use client'

import { Sparkles, Users } from 'lucide-react'
import { KarmaDotToken } from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'

type ActivityKind = 'karma' | 'membership' | 'new_mission'

interface ActivityItem {
  kind: ActivityKind
  title: string
  sub: string
  time: string
}

interface NotificationsClientProps {
  activities: ActivityItem[]
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Az önce'
  if (diffMin < 60) return `${diffMin} dk`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours} saat`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Dün'
  if (diffDays < 7) return `${diffDays} gün`
  const diffWeeks = Math.floor(diffDays / 7)
  return `${diffWeeks} hafta`
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const { colors: c } = useTheme()

  const iconConfig: Record<ActivityKind, { bg: string; content: React.ReactNode }> = {
    karma: {
      bg: c.goldSoft,
      content: <KarmaDotToken size={18} />,
    },
    membership: {
      bg: 'rgba(244,238,223,.06)',
      content: <Users size={18} color={c.cream} />,
    },
    new_mission: {
      bg: 'rgba(196,203,172,.15)',
      content: <Sparkles size={18} color={c.sage} />,
    },
  }

  const { bg, content } = iconConfig[item.kind]

  return (
    <div
      style={{
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        position: 'relative',
      }}
    >
      {/* Icon square */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {content}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: c.cream,
            paddingTop: 2,
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: c.ink300,
            marginTop: 3,
          }}
        >
          {item.sub}
        </div>
      </div>

      {/* Time */}
      <div
        style={{
          fontSize: 11,
          color: c.ink400,
          whiteSpace: 'nowrap',
          paddingTop: 3,
        }}
      >
        {item.time}
      </div>
    </div>
  )
}

export default function NotificationsClient({ activities }: NotificationsClientProps) {
  const { colors: c } = useTheme()

  // Split into today vs earlier
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // We receive pre-formatted activities; no need to split by date here
  // Just show them all in a single feed

  const isEmpty = activities.length === 0

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        paddingBottom: 40,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: c.ink300,
            }}
          >
            BİLDİRİMLER
          </div>
          <h1
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Son{' '}
            <em
              style={{
                fontStyle: 'italic',
                color: c.gold,
              }}
            >
              gelişmeler
            </em>
          </h1>
        </div>
      </div>

      {isEmpty ? (
        /* Empty state */
        <div
          style={{
            padding: '80px 40px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(244,238,223,.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Sparkles size={28} color={c.ink400} />
          </div>
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: c.cream,
              margin: '0 0 8px',
            }}
          >
            Henüz bir aktivite yok
          </p>
          <p
            style={{
              fontSize: 13,
              color: c.ink300,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Görev tamamladığında, STK&apos;lara katıldığında veya yeni görevler
            paylaşıldığında burada göreceksin.
          </p>
        </div>
      ) : (
        /* Activity feed */
        <div>
          <div
            style={{
              padding: '24px 20px 8px',
              marginBottom: 10,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: c.ink300,
            }}
          >
            SON AKTİVİTE
          </div>
          <div
            style={{
              padding: '0 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {activities.map((item, i) => (
              <ActivityRow key={i} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { timeAgo }
export type { ActivityItem }
