'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { deleteBlogPost, toggleBlogPostStatus } from '@/lib/admin/blog-actions'
import type { Post } from '@/lib/supabase/types'

interface BlogListClientProps {
  posts: Post[]
  ngoId: string
}

type FilterStatus = 'all' | 'draft' | 'published'

export function BlogListClient({ posts, ngoId }: BlogListClientProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = posts.filter((p) => {
    if (filter === 'draft') return !p.published
    if (filter === 'published') return p.published
    return true
  })

  const handleDelete = (postId: string) => {
    startTransition(async () => {
      const result = await deleteBlogPost(ngoId, postId)
      if (result.success) {
        setDeleteConfirm(null)
        router.refresh()
      } else {
        alert(`Hata: ${result.error}`)
      }
    })
  }

  const handleToggleStatus = (postId: string, published: boolean) => {
    startTransition(async () => {
      const newStatus = published ? 'draft' : 'published'
      const result = await toggleBlogPostStatus(ngoId, postId, newStatus)
      if (result.success) {
        router.refresh()
      } else {
        alert(`Hata: ${result.error}`)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink-300">Filtrele:</span>
        <div className="flex gap-2">
          {(['all', 'draft', 'published'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-gold text-ink-900'
                  : 'bg-ink-700 text-cream hover:bg-ink-600'
              }`}
            >
              {status === 'all' && 'Tümü'}
              {status === 'draft' && 'Taslak'}
              {status === 'published' && 'Yayında'}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12 bg-ink-800 rounded-2xl">
          <p className="text-ink-300 mb-4">
            {posts.length === 0
              ? 'Henüz yazı yok. Yeni yazı oluşturmak için başla.'
              : 'Seçtiğin filtrede yazı bulunamadı.'}
          </p>
          <Link
            href={`/admin/${ngoId}/blog/new`}
            className="inline-block px-4 py-2 bg-gold text-ink-900 rounded-lg font-semibold hover:bg-gold/90"
          >
            + Yeni Yazı
          </Link>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="bg-ink-800 rounded-2xl overflow-hidden border border-ink-700">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-700 border-b border-ink-600">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-cream">
                    Başlık
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-cream">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-cream">
                    Yayın Tarihi
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-cream">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700">
                {filtered.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-ink-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-cream">
                        {post.title}
                      </div>
                      {post.summary && (
                        <div className="text-xs text-ink-300 mt-1">
                          {post.summary.substring(0, 80)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? 'bg-success/20 text-success'
                            : 'bg-ink-600 text-ink-300'
                        }`}
                      >
                        {post.published ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-300 text-xs">
                      {new Date(post.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleToggleStatus(post.id, post.published)
                          }
                          disabled={pending}
                          className="px-2 py-1 text-xs rounded hover:bg-ink-600 transition-colors text-ink-300 hover:text-cream disabled:opacity-50"
                          title={
                            post.published
                              ? 'Taslak yap'
                              : 'Yayınla'
                          }
                        >
                          {post.published ? '⊘' : '◉'}
                        </button>
                        <Link
                          href={`/admin/${ngoId}/blog/${post.id}/edit`}
                          className="px-2 py-1 text-xs rounded hover:bg-ink-600 transition-colors text-ink-300 hover:text-cream"
                        >
                          Düzenle
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          disabled={pending}
                          className="px-2 py-1 text-xs rounded hover:bg-clay/20 transition-colors text-clay hover:text-clay disabled:opacity-50"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-ink-800 rounded-2xl p-6 max-w-sm mx-4 border border-ink-700">
            <h3 className="text-lg font-semibold text-cream mb-2">
              Yazıyı sil?
            </h3>
            <p className="text-ink-300 text-sm mb-6">
              Bu işlem geri alınamaz. Yazı ve tüm verileri silinecek.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={pending}
                className="px-4 py-2 rounded-lg bg-ink-700 text-cream font-medium hover:bg-ink-600 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={pending}
                className="px-4 py-2 rounded-lg bg-clay text-ink-900 font-medium hover:bg-clay/90 transition-colors disabled:opacity-50"
              >
                {pending ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
