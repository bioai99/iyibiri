// app/admin/analytics/page.tsx
// WS-01 MAKE admin dashboard kartı — server component, Supabase view'ları okur.
// ADR-001: NSM = Aylık Karma Kazanan Kullanıcı.
// 2026-04-24 — frontend-engineer + supabase-backend

import {
  getMakeMonthly,
  getMakeRolling30d,
  getKarmaPerMake,
  getW4Retention,
  getFirstMissionTimeStats,
} from '@/lib/supabase/queries/analytics'

function formatMonth(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })
}

function formatNumber(n: number): string {
  return n.toLocaleString('tr-TR')
}

export default async function AnalyticsPage() {
  // Paralel fetch tüm view'ları
  const [monthly, rolling30d, karmaPerMake, w4, firstMissionStats] =
    await Promise.all([
      getMakeMonthly().catch(() => []),
      getMakeRolling30d().catch(() => null),
      getKarmaPerMake().catch(() => []),
      getW4Retention().catch(() => []),
      getFirstMissionTimeStats().catch(() => null),
    ])

  // Trend: son 2 ay karşılaştırma
  const currentMake = monthly[0]?.make_count ?? 0
  const previousMake = monthly[1]?.make_count ?? 0
  const trendPct = previousMake > 0
    ? Math.round(((currentMake - previousMake) / previousMake) * 100)
    : null

  // Hedef: Ay 12 MAKE ≥ 10.000 (konservatif) / 30.000 (orta)
  const targetConservative = 10_000
  const targetMid = 30_000

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <header>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            North-Star Metric ve engagement guardrail'leri · ADR-001
          </p>
        </header>

        {/* MAKE ana kart */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Son 30 gün MAKE
              </p>
              <p className="mt-2 font-display text-5xl font-black tabular-nums text-foreground">
                {formatNumber(rolling30d?.make_count ?? 0)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Monthly Active Karma Earner
              </p>
            </div>
            {trendPct !== null && (
              <div
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  trendPct >= 0
                    ? 'bg-success/10 text-success'
                    : 'bg-clay/10 text-clay'
                }`}
              >
                {trendPct >= 0 ? '↑' : '↓'} %{Math.abs(trendPct)} aylık
              </div>
            )}
          </div>

          {/* Hedef ilerleme */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Ay 12 hedef (konservatif)</span>
              <span>{formatNumber(targetConservative)}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gold"
                style={{
                  width: `${Math.min((currentMake / targetConservative) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* Guardrail grid */}
        <section className="grid gap-4 md:grid-cols-3">
          {/* Karma per MAKE */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Karma / MAKE
            </p>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums text-foreground">
              {formatNumber(karmaPerMake[0]?.avg_karma_per_make ?? 0)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Bu ay · hedef ≥ 200 (engagement derinlik)
            </p>
          </div>

          {/* W4 Retention */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              W4 Retention
            </p>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums text-foreground">
              %{w4[0]?.w4_retention_pct ?? 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Son cohort · benchmark %30-40
            </p>
          </div>

          {/* First mission median */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              İlk görev süresi (medyan)
            </p>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums text-foreground">
              {firstMissionStats?.medianHours != null
                ? `${firstMissionStats.medianHours} sa`
                : '—'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {firstMissionStats?.sampleSize ?? 0} kullanıcı · onboarding hızı
            </p>
          </div>
        </section>

        {/* Aylık MAKE trendi */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Aylık MAKE — son 12 ay
          </h2>
          {monthly.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Henüz veri yok. Karma transactions yazılmaya başlayınca burada görünecek.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2">Ay</th>
                    <th className="pb-2 text-right">MAKE</th>
                    <th className="pb-2 text-right">Tamamlama</th>
                    <th className="pb-2 text-right">Toplam Karma</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.map((row) => (
                    <tr
                      key={row.month}
                      className="border-b border-border/50 last:border-b-0"
                    >
                      <td className="py-3 font-medium text-foreground">
                        {formatMonth(row.month)}
                      </td>
                      <td className="py-3 text-right font-semibold tabular-nums text-foreground">
                        {formatNumber(row.make_count)}
                      </td>
                      <td className="py-3 text-right tabular-nums text-muted-foreground">
                        {formatNumber(row.total_mission_completions)}
                      </td>
                      <td className="py-3 text-right tabular-nums text-gold">
                        {formatNumber(row.total_karma_awarded)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Footer notu */}
        <footer className="text-xs text-muted-foreground">
          View kaynakları: <code>make_monthly</code>, <code>make_rolling_30d</code>,{' '}
          <code>karma_per_make</code>, <code>w4_retention_cohort</code>,{' '}
          <code>first_mission_time</code>. Migration: 011.
        </footer>
      </div>
    </main>
  )
}
