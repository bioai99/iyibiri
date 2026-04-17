'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import QRCode from 'qrcode'
import { createClient } from '@/lib/supabase/client'

interface Props {
  missionId: string
  verifyCode: string
  missionTitle: string
}

export function QRGenerator({ missionId, verifyCode, missionTitle }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, verifyCode, {
      width: 300,
      margin: 2,
      color: { dark: '#1C1917', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    })
  }, [verifyCode])

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qr-${missionId}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  async function handleSaveToDb() {
    const canvas = canvasRef.current
    if (!canvas) return
    setSaving(true)
    const dataUrl = canvas.toDataURL('image/png')
    await supabase
      .from('missions')
      .update({ qr_code_data: dataUrl })
      .eq('id', missionId)
    setSaving(false)
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border p-6 flex flex-col items-center gap-4">
        <canvas ref={canvasRef} className="rounded-xl" />
        <p className="text-sm text-text-muted text-center">
          Bu QR kodu etkinlik alanına asın.<br />
          Kullanıcılar tarayarak görevi tamamlar.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 py-3 bg-stone-900 text-white rounded-xl font-bold text-sm"
        >
          PNG İndir
        </button>
        <button
          onClick={handleSaveToDb}
          disabled={saving || saved}
          className="flex-1 py-3 border border-primary text-primary rounded-xl font-bold text-sm disabled:opacity-60"
        >
          {saved ? '✓ Kaydedildi' : saving ? 'Kaydediliyor...' : "DB'ye Kaydet"}
        </button>
      </div>

      <a href="/admin/missions" className="block text-center text-sm text-text-muted">
        ← Misyon listesine dön
      </a>
    </div>
  )
}
