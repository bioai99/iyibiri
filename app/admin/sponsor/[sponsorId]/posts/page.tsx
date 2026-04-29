import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ sponsorId: string }>
}

export default async function SponsorPostsListPage({ params }: PageProps) {
  const { sponsorId } = await params
  const supabase = await createClient()
  const { data: posts } = await (supabase as any)
    .from('posts')
    .select('id, title, category, published, read_time, created_at')
    .eq('author_type', 'sponsor')
    .eq('sponsor_id', sponsorId)
    .order('created_at', { ascending: false })

  const list = posts ?? []
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-cream">Yazılar</h1>
          <p className="text-ink-300 mt-1">
            {list.length} yazı · {list.filter((p: any) => p.published).length} yayında
          </p>
        </div>
        <Link
          href={`/admin/sponsor/${sponsorId}/posts/new`}
          className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90"
        >
          + Yeni yazı
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl bg-ink-800 border border-ink-600 p-12 text-center">
          <p className="text-cream font-display text-xl mb-2">Henüz yazı yok</p>
          <p className="text-ink-300">
            Marka bloguna ilk yazını ekle — kullanıcılar bağış sekmesinde
            sponsor postları rail&apos;inde görecek.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((p: any) => (
            <div
              key={p.id}
              className="rounded-2xl bg-ink-800 border border-ink-600 p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      p.published
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-ink-700 text-ink-300'
                    }`}
                  >
                    {p.published ? 'Yayında' : 'Taslak'}
                  </span>
                  {p.category && (
                    <span className="text-xs text-ink-400 uppercase">
                      {p.category}
                    </span>
                  )}
                  <span className="text-xs text-ink-400">
                    {p.read_time} dk · {new Date(p.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="text-cream font-semibold truncate">{p.title}</div>
              </div>
              <Link
                href={`/admin/sponsor/${sponsorId}/posts/${p.id}/edit`}
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
