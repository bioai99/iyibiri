'use client'

import { useState } from 'react'

interface MonthlyData {
  month: string
  missions_count: number
  completed_count: number
  karma_distributed: number
  new_members: number
}

interface ReportsClientProps {
  monthlyData: MonthlyData[]
  ngoId: string
}

const METRIC_CARD_COLORS: Record<string, { bg: string; accent: string }> = {
  missions: { bg: 'from-ink-800 to-ink-900', accent: 'text-gold' },
  completed: { bg: 'from-success/20 to-success/10', accent: 'text-success' },
  karma: { bg: 'from-gold/20 to-gold/10', accent: 'text-gold' },
  members: { bg: 'from-domain-nature/20 to-domain-nature/10', accent: 'text-domain-nature' },
}

export function ReportsClient({ monthlyData, ngoId }: ReportsClientProps) {
  const [timePeriod, setTimePeriod] = useState<'30' | '90' | '365'>('365')

  // Calculate totals
  const totalMissions = monthlyData.reduce((sum, m) => sum + m.missions_count, 0)
  const totalCompleted = monthlyData.reduce((sum, m) => sum + m.completed_count, 0)
  const totalKarma = monthlyData.reduce((sum, m) => sum + m.karma_distributed, 0)
  const totalMembers = monthlyData.reduce((sum, m) => sum + m.new_members, 0)

  return (
    <div className="space-y-8">
      {/* Time period selector */}
      <div className="flex gap-2">
        {(['30', '90', '365'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setTimePeriod(period)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timePeriod === period
                ? 'bg-gold text-ink-900'
                : 'bg-ink-800 text-cream hover:bg-ink-700'
            }`}
          >
            {period === '30'
              ? 'Bu Ay'
              : period === '90'
                ? 'Son 3 Ay'
                : 'Son 12 Ay'}
          </button>
        ))}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Toplam Görev"
          value={totalMissions}
          color="missions"
          unit="görev"
        />
        <MetricCard
          label="Tamamlanan"
          value={totalCompleted}
          color="completed"
          unit="görev"
        />
        <MetricCard
          label="Dağıtılan Karma"
          value={totalKarma}
          color="karma"
          unit="puan"
        />
        <MetricCard
          label="Yeni Üye"
          value={totalMembers}
          color="members"
          unit="üye"
        />
      </div>

      {/* Chart placeholder (V1.1 — recharts integration) */}
      <div className="bg-ink-800 rounded-2xl border border-ink-700 p-6 text-center text-ink-300">
        <p className="text-sm">
          📊 12 aylık trend chart V1.1'de eklenecektir (recharts)
        </p>
      </div>

      {/* Monthly table */}
      <div className="bg-ink-800 rounded-2xl border border-ink-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-700 bg-ink-900">
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase">
                Ay
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase">
                Görevler
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase">
                Tamamlanan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase">
                Karma
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-cream uppercase">
                Üyeler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700">
            {monthlyData.map((m, i) => (
              <tr
                key={i}
                className="hover:bg-ink-700 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-cream">
                  {new Date(m.month + '-01').toLocaleDateString('tr-TR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-ink-300">
                  {m.missions_count}
                </td>
                <td className="px-6 py-4 text-sm text-success font-semibold">
                  {m.completed_count}
                </td>
                <td className="px-6 py-4 text-sm text-gold font-semibold">
                  {m.karma_distributed}
                </td>
                <td className="px-6 py-4 text-sm text-domain-nature font-semibold">
                  {m.new_members}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export placeholder */}
      <div className="bg-ink-800 rounded-2xl border border-ink-700 p-6">
        <h3 className="text-lg font-semibold text-cream mb-3">
          Dışa Aktarım
        </h3>
        <div className="flex gap-3">
          <button
            disabled
            className="px-6 py-3 bg-ink-700 text-cream rounded-lg font-semibold cursor-not-allowed opacity-50"
            title="PDF dışa aktarım V1.1'de eklenecektir"
          >
            📄 PDF Rapor (Yakında)
          </button>
          <button
            disabled
            className="px-6 py-3 bg-ink-700 text-cream rounded-lg font-semibold cursor-not-allowed opacity-50"
            title="CSV dışa aktarım V1.1'de eklenecektir"
          >
            📥 CSV Dışa Aktar (Yakında)
          </button>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: number
  color: string
  unit: string
}

function MetricCard({ label, value, color, unit }: MetricCardProps) {
  const colors = METRIC_CARD_COLORS[color] || METRIC_CARD_COLORS.missions

  return (
    <div
      className={`bg-gradient-to-br ${colors.bg} rounded-2xl border border-ink-700 p-6 backdrop-blur-sm`}
    >
      <p className="text-sm text-ink-300 font-medium mb-2">{label}</p>
      <div className={`text-4xl font-bold ${colors.accent} font-display`}>
        {value.toLocaleString('tr-TR')}
      </div>
      <p className="text-xs text-ink-400 mt-2">{unit}</p>
    </div>
  )
}
