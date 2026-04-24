'use client'

import Link from 'next/link'

interface Activity {
  id: string
  title: string
  created_at: string
  status?: string
}

interface AdminActivityListProps {
  activities: Activity[]
}

/**
 * Activity list — 5 recent missions/members/etc
 * Spec: icon + timestamp + description + link
 */
export function AdminActivityList({ activities }: AdminActivityListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}d önce`
    if (hours < 24) return `${hours}s önce`
    return `${days}g önce`
  }

  return (
    <div className="bg-ink-800 rounded-2xl shadow-md overflow-hidden">
      {activities.length === 0 ? (
        <div className="p-6 text-center text-ink-300">
          Henüz aktivite yok
        </div>
      ) : (
        <div className="divide-y divide-ink-700">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 hover:bg-ink-700 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-cream">
                  {activity.title}
                </p>
                <p className="text-xs text-ink-300 mt-1">
                  {formatDate(activity.created_at)}
                </p>
              </div>

              {activity.status && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ink-700 text-ink-300">
                  {activity.status === 'published' ? '✅ Yayında' : '📝 Taslak'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
