import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ sponsorId: string }>
}

export default async function SponsorRewardsPage({ params }: PageProps) {
  const { sponsorId } = await params
  const supabase = await createClient()
  const { data: rewards } = await (supabase as any)
    .from('rewards')
    .select('id, title, karma_required, category, active, image_url')
    .eq('sponsor_id', sponsorId)
    .order('karma_required', { ascending: true })
  const list = rewards ?? []
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-cream">Ödüller</h1>
          <p className="text-ink-300 mt-1">
            {list.length} ödül · {list.filter((r: any) => r.active).length} aktif
          </p>
        </div>
        <Link
          href={`/admin/sponsor/${sponsorId}/rewards/new`}
          className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90"
        >
          + Yeni ödül
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl bg-ink-800 border border-ink-600 p-12 text-center">
          <p className="text-cream font-display text-xl mb-2">Henüz ödül yok</p>
          <p className="text-ink-300">
            Markandan kullanıcılara sunabileceğin ilk ödülü ekle — karma ile alınır.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((r: any) => (
            <div
              key={r.id}
              className="rounded-2xl bg-ink-800 border border-ink-600 p-4 flex items-center gap-4"
            >
              <div
                className="w-16 h-16 rounded-xl bg-ink-700 bg-cover bg-center flex-shrink-0"
                style={{
                  backgroundImage: r.image_url ? `url(${r.image_url})` : undefined,
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      r.active
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-ink-700 text-ink-300'
                    }`}
                  >
                    {r.active ? 'Aktif' : 'Pasif'}
                  </span>
                  {r.category && (
                    <span className="text-xs text-ink-400 uppercase">{r.category}</span>
                  )}
                </div>
                <div className="text-cream font-semibold truncate">{r.title}</div>
                <div className="text-sm text-gold tabular-nums">
                  {r.karma_required.toLocaleString('tr-TR')} ✦
                </div>
              </div>
              <Link
                href={`/admin/sponsor/${sponsorId}/rewards/${r.id}/edit`}
                className="px-4 py-2 bg-gold/10 text-gold border border-gold/30 rounded-lg text-sm font-semibold"
              >
                Düzenle
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
