import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SponsorPostForm } from '../../sponsor-post-form'

interface PageProps {
  params: Promise<{ sponsorId: string; id: string }>
}

export default async function EditSponsorPostPage({ params }: PageProps) {
  const { sponsorId, id } = await params
  const supabase = await createClient()
  const { data: post } = await (supabase as any)
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('sponsor_id', sponsorId)
    .eq('author_type', 'sponsor')
    .maybeSingle()
  if (!post) notFound()

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/sponsor/${sponsorId}/posts`}
        className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-cream"
      >
        <ArrowLeft size={16} /> Yazılara dön
      </Link>
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">Yazıyı düzenle</h1>
        <p className="text-ink-300 mt-1">{post.title}</p>
      </div>
      <SponsorPostForm sponsorId={sponsorId} initial={post} />
    </div>
  )
}
