import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { QRGenerator } from './qr-generator'
import type { Mission } from '@/lib/supabase/types'

async function getMission(id: string): Promise<Mission | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export default async function QRPage({ params }: { params: { id: string } }) {
  const mission = await getMission(params.id)
  if (!mission || !mission.verify_code) notFound()

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-display font-extrabold text-xl text-text-primary mb-2">
        {mission.title}
      </h1>
      <p className="text-text-muted text-sm mb-6">
        QR kod içeriği: <code className="font-mono bg-stone-100 px-2 py-0.5 rounded">{mission.verify_code}</code>
      </p>
      <QRGenerator missionId={mission.id} verifyCode={mission.verify_code} missionTitle={mission.title} />
    </div>
  )
}
