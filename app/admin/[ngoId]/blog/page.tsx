'use server'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BlogListClient } from './blog-list-client'

interface AdminBlogPageProps {
  params: Promise<{ ngoId: string }>
}

async function getBlogPosts(ngoId: string) {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('posts')
    .select('id, title, content, cover_image_url, category, published, created_at')
    .eq('ngo_id', ngoId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export default async function AdminBlogPage({
  params,
}: AdminBlogPageProps) {
  const { ngoId } = await params
  const posts = await getBlogPosts(ngoId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-cream">
            Blog
          </h1>
          <p className="text-ink-300 mt-1">
            {posts.length} yazı{' '}
            {posts.filter((p: any) => p.published).length} yayında
          </p>
        </div>

        <Link
          href={`/admin/${ngoId}/blog/new`}
          className="px-6 py-3 bg-gold text-ink-900 rounded-xl font-semibold hover:bg-gold/90 transition-colors"
        >
          + Yeni Yazı
        </Link>
      </div>

      {/* Blog List */}
      <BlogListClient posts={posts} ngoId={ngoId} />
    </div>
  )
}
