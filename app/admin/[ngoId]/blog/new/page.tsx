'use server'

import { BlogForm } from '../blog-form'

interface AdminBlogNewPageProps {
  params: Promise<{ ngoId: string }>
}

export default async function AdminBlogNewPage({
  params,
}: AdminBlogNewPageProps) {
  const { ngoId } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Yeni Blog Yazısı
        </h1>
        <p className="text-ink-300 mt-1">
          STK'nızın haberlerini, hikayelerini ve öğütlerini paylaşın.
        </p>
      </div>

      <BlogForm ngoId={ngoId} />
    </div>
  )
}
