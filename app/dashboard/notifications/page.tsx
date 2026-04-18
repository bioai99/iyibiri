'use client'

import { useState } from 'react'
import { Sparkles, Star, Flame, Clock, Users } from 'lucide-react'
import { KarmaDotToken } from '@/components/ui/ds'
import { useTheme } from '@/lib/theme'

type NotifKind = 'karma' | 'match' | 'tier' | 'streak' | 'reminder' | 'social'

interface Notif {
  kind: NotifKind
  title: string
  sub: string
  time: string
  fresh?: boolean
}

const todayNotifs: Notif[] = [
  { kind: 'karma', title: '+300 Karma kazandın', sub: 'Kan Bağışı Kampanyası · Kızılay', time: '2 dk', fresh: true },
  { kind: 'match', title: 'Sana uygun yeni görev', sub: 'Kodluyoruz · Kodlama Mentorluğu', time: '3 saat', fresh: true },
]

const earlierNotifs: Notif[] = [
  { kind: 'tier', title: 'Çok İyi Biri oldun', sub: 'Yeni tier açıldı — ödüller güncellendi', time: 'Dün' },
  { kind: 'streak', title: '7 günlük serin sürüyor', sub: 'Yarın da bir görev tamamla, kaybetme', time: 'Dün' },
  { kind: 'reminder', title: 'Sahil Temizliği yarın', sub: 'Kilyos · 09:30 · 1 gün kaldı', time: '2 gün' },
  { kind: 'social', title: 'Zeynep ekibine katıldı', sub: 'Barınakta Gönüllü Günü · Haytap', time: '3 gün' },
]

function NotifRow({ notif }: { notif: Notif }) {
  const { colors: c } = useTheme()

  const iconConfig: Record<NotifKind, { bg: string; content: React.ReactNode }> = {
    karma: {
      bg: c.goldSoft,
      content: <KarmaDotToken size={18} />,
    },
    match: {
      bg: 'rgba(196,203,172,.15)',
      content: <Sparkles size={18} color={c.sage} />,
    },
    tier: {
      bg: c.goldSoft,
      content: <Star size={18} color={c.gold} />,
    },
    streak: {
      bg: c.goldSoft,
      content: <Flame size={18} color={c.gold} />,
    },
    reminder: {
      bg: 'rgba(233,207,194,.15)',
      content: <Clock size={18} color={c.blush} />,
    },
    social: {
      bg: 'rgba(244,238,223,.06)',
      content: <Users size={18} color={c.cream} />,
    },
  }

  const { bg, content } = iconConfig[notif.kind]
  return (
    <div
      style={{
        background: notif.fresh ? 'rgba(232,194,104,.04)' : c.ink800,
        border: notif.fresh ? `1px solid ${c.goldLine}` : `1px solid ${c.ink600}`,
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
          {notif.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: c.ink300,
            marginTop: 3,
          }}
        >
          {notif.sub}
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
        {notif.time}
      </div>

      {/* Fresh dot */}
      {notif.fresh && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: c.gold,
            boxShadow: `0 0 0 3px ${c.goldSoft}`,
          }}
        />
      )}
    </div>
  )
}

export default function NotificationsPage() {
  const { colors: c } = useTheme()
  const [allRead, setAllRead] = useState(false)

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
          padding: '58px 20px 0',
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
            Yeni{' '}
            <em
              style={{
                fontStyle: 'italic',
                color: c.gold,
              }}
            >
              iyilikler
            </em>
          </h1>
        </div>

        <button
          onClick={() => setAllRead(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: c.gold,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
            cursor: allRead ? 'default' : 'pointer',
            padding: 0,
          }}
        >
          {allRead ? 'OKUNDU ✓' : 'TÜMÜNÜ OKU'}
        </button>
      </div>

      {/* Today section */}
      <div>
        <div
          style={{
            padding: '24px 20px 8px',
            marginBottom: 10,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: c.gold,
          }}
        >
          BUGÜN
        </div>
        <div
          style={{
            padding: '0 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {todayNotifs.map((notif, i) => (
            <NotifRow key={i} notif={notif} />
          ))}
        </div>
      </div>

      {/* Earlier section */}
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
          DAHA ÖNCE
        </div>
        <div
          style={{
            padding: '0 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {earlierNotifs.map((notif, i) => (
            <NotifRow key={i} notif={notif} />
          ))}
        </div>
      </div>
    </div>
  )
}
