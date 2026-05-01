'use client'

import { useEffect, useRef, useState } from 'react'
import type { Html5Qrcode as Html5QrcodeType } from 'html5-qrcode'

// Faz 4 (2026-04-26 perf-eng): html5-qrcode dynamic import. Initial bundle -200KB.
// Sadece kamera scanner aktive edildiğinde yüklenir.

interface QRScannerProps {
  onScan: (result: string) => void
  onError?: (error: string) => void
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [started, setStarted] = useState(false)
  const scannerRef = useRef<Html5QrcodeType | null>(null)
  const containerId = 'qr-scanner-container'

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  async function startScanner() {
    if (started) return
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode(containerId)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (text) => {
          scanner.stop().catch(() => {})
          onScan(text)
        },
        () => {}
      )
      setStarted(true)
    } catch {
      onError?.('Kamera erişimi reddedildi')
    }
  }

  return (
    <div className="space-y-4">
      <div
        id={containerId}
        className="w-full aspect-square bg-stone-900 rounded-2xl overflow-hidden"
      />
      {!started && (
        <button
          onClick={startScanner}
          className="w-full py-3 bg-primary text-white rounded-xl font-bold"
        >
          Kamerayı Aç
        </button>
      )}
    </div>
  )
}
