'use server'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BlogForm } from '../../blog-form'

interface AdminBlogEditPageProps {
  params: Promise<{ ngoId: string; postId: string }>
}

// BUG-051 fix (Vol-23): cross-NGO erişim yapılırsa generic 500 error UI
// fırlatılıyordu. maybeSingle ile null'a düşür + custom unauthorized blok göster.
async function getBlogPost(postId: string, ngoId: string) {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('ngo_id', ngoId)
    .maybeSingle()

  if (error) {
    console.error('Blog edit fetch error:', error)
    return null
  }
  return data
}

export default async function AdminBlogEditPage({
  params,
}: AdminBlogEditPageProps) {
  const { ngoId, postId } = await params
  const post = await getBlogPost(postId, ngoId)

  if (!post) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="bg-ink-800 border border-clay/40 rounded-2xl p-6">
          <h1 className="text-2xl font-display font-bold text-clay mb-2">
            Yazı bulunamadı
          </h1>
          <p className="text-cream mb-4">
            Bu blog yazısı bu STK'ya ait değil veya silinmiş. Yetkin olmayan
            bir kayda erişmeye çalışmış olabilirsin.
          </p>
          <Link
            href={`/admin/${ngoId}/blog`}
            className="inline-block px-4 py-2 bg-gold text-ink-900 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
          >
            ← Blog listesine dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Yazıyı Düzenle
        </h1>
        <p className="text-ink-300 mt-1">
          {post.title}
        </p>
      </div>

      <BlogForm ngoId={ngoId} post={post} />
    </div>
  )
}
