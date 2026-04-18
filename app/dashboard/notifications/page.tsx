'use client'

import { useState } from 'react'
import { Sparkles, Star, Flame, Clock, Users } from 'lucide-react'
import { KarmaDotToken } from '@/components/ui/ds'

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

const iconConfig: Record<NotifKind, { bg: string; content: React.ReactNode }> = {
  karma: {
    bg: 'rgba(232,194,104,.15)',
    content: <KarmaDotToken size={18} />,
  },
  match: {
    bg: 'rgba(196,203,172,.15)',
    content: <Sparkles size={18} color="#C4CBAC" />,
  },
  tier: {
    bg: 'rgba(232,194,104,.15)',
    content: <Star size={18} color="#E8C268" />,
  },
  streak: {
    bg: 'rgba(232,194,104,.15)',
    content: <Flame size={18} color="#E8C268" />,
  },
  reminder: {
    bg: 'rgba(233,207,194,.15)',
    content: <Clock size={18} color="#E9CFC2" />,
  },
  social: {
    bg: 'rgba(244,238,223,.06)',
    content: <Users size={18} color="#F4EEDF" />,
  },
}

function NotifRow({ notif }: { notif: Notif }) {
  const { bg, content } = iconConfig[notif.kind]
  return (
    <div
      style={{
        background: notif.fresh ? 'rgba(232,194,104,.04)' : '#2E2923',
        border: notif.fresh ? '1px solid rgba(232,194,104,.32)' : '1px solid #3F3830',
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
            color: '#F4EEDF',
            paddingTop: 2,
          }}
        >
          {notif.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: '#A89E8A',
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
          color: '#7A6F5E',
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
            background: '#E8C268',
            boxShadow: '0 0 0 3px rgba(232,194,104,.2)',
          }}
        />
      )}
    </div>
  )
}

export default function NotificationsPage() {
  const [allRead, setAllRead] = useState(false)

  return (
    <div
      style={{
        background: '#24201B',
        color: '#F4EEDF',
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
              color: '#A89E8A',
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
                color: '#E8C268',
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
            color: '#E8C268',
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
            color: '#E8C268',
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
            color: '#A89E8A',
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
