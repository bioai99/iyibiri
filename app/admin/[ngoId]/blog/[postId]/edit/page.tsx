'use server'

import { createClient } from '@/lib/supabase/server'
import { BlogForm } from '../../blog-form'

interface AdminBlogEditPageProps {
  params: Promise<{ ngoId: string; postId: string }>
}

async function getBlogPost(postId: string, ngoId: string) {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('ngo_id', ngoId)
    .single()

  if (error) throw error
  return data
}

export default async function AdminBlogEditPage({
  params,
}: AdminBlogEditPageProps) {
  const { ngoId, postId } = await params
  const post = await getBlogPost(postId, ngoId)

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-clay text-lg">Yazı bulunamadı</p>
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
