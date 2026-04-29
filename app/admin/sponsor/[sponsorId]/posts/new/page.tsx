import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SponsorPostForm } from '../sponsor-post-form'

interface PageProps {
  params: Promise<{ sponsorId: string }>
}

export default async function NewSponsorPostPage({ params }: PageProps) {
  const { sponsorId } = await params
  return (
    <div className="space-y-6">
      <Link
        href={`/admin/sponsor/${sponsorId}/posts`}
        className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-cream"
      >
        <ArrowLeft size={16} /> Yazılara dön
      </Link>
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">Yeni yazı</h1>
        <p className="text-ink-300 mt-1">
          Bağış sekmesi sponsor rail&apos;inde gösterilecek bir blog yazısı.
        </p>
      </div>
      <SponsorPostForm sponsorId={sponsorId} />
    </div>
  )
}
