'use server'

import { AdminMissionForm } from '../mission-form'

interface AdminNewMissionPageProps {
  params: Promise<{ ngoId: string }>
}

export default async function AdminNewMissionPage({
  params,
}: AdminNewMissionPageProps) {
  const { ngoId } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-cream">
          Yeni Görev Oluştur
        </h1>
        <p className="text-ink-300 mt-1">
          Görev bilgilerini doldurup taslak veya yayında yayınlayabilirsiniz
        </p>
      </div>

      <AdminMissionForm ngoId={ngoId} />
    </div>
  )
}
