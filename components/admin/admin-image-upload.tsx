'use client'
/**
 * AdminImageUpload — molecule
 *
 * Supabase Storage ngo-assets bucket'a image upload. Progress bar + preview + URL döner.
 *
 * Klasör pattern (migration 023 RLS compliance):
 *   ngo-assets/{ngoId}/logo.{ext}
 *   ngo-assets/{ngoId}/cover.{ext}
 *   ngo-assets/{ngoId}/missions/{missionId}.{ext}
 *   ngo-assets/{ngoId}/blog/{postId}.{ext}
 *   ngo-assets/proofs/{userId}/{userMissionId}.{ext}
 */

import { useState, useRef, useCallback } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Upload, X, Replace, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/lib/theme'

interface AdminImageUploadProps {
  bucket?: 'ngo-assets'
  folder: string
  fileName: string
  currentUrl?: string | null
  onUploaded: (url: string | null) => void
  accept?: string
  maxSizeMB?: number
  label?: string
  aspectRatio?: string
}

export function AdminImageUpload({
  bucket = 'ngo-assets',
  folder,
  fileName,
  currentUrl,
  onUploaded,
  accept = 'image/*',
  maxSizeMB = 10,
  label = 'Görsel yükle',
  aspectRatio = '1:1',
}: AdminImageUploadProps) {
  const { colors: c } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const inputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [localUrl, setLocalUrl] = useState<string | null>(currentUrl ?? null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    setError(null)

    // Validate
    if (!file.type.startsWith('image/')) {
      setError('Sadece görsel dosyalar (JPEG, PNG, WebP, GIF)')
      return
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Dosya ${maxSizeMB}MB'tan büyük olamaz`)
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `${folder}/${fileName}.${ext}`

      // Upload
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        setError(`Yükleme hatası: ${uploadError.message}`)
        setUploading(false)
        return
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      const url = publicData.publicUrl
      const cachedUrl = `${url}?t=${Date.now()}`

      setLocalUrl(cachedUrl)
      setProgress(100)
      setUploading(false)
      onUploaded(cachedUrl)
    } catch (err) {
      setError(`Beklenmeyen hata: ${(err as Error).message}`)
      setUploading(false)
    }
  }, [bucket, folder, fileName, maxSizeMB, onUploaded])

  const handleClear = () => {
    setLocalUrl(null)
    setError(null)
    onUploaded(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div style={{ width: '100%' }}>
      <label style={{
        display: 'block',
        fontSize: 12,
        fontWeight: 600,
        color: c.ink300,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        {label}
      </label>

      <AnimatePresence mode="wait">
        {localUrl ? (
          <motion.div
            key="preview"
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? {} : { opacity: 0 }}
            style={{
              position: 'relative',
              borderRadius: 12,
              overflow: 'hidden',
              border: `1px solid ${c.ink600}`,
              aspectRatio,
              background: c.ink800,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={localUrl}
              alt={label}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 6,
            }}>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                aria-label="Değiştir"
                style={{
                  padding: 8,
                  background: c.ink + 'CC',
                  border: `1px solid ${c.ink600}`,
                  borderRadius: 8,
                  color: c.cream,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  transition: 'all 200ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = c.gold + '80'
                  e.currentTarget.style.borderColor = c.gold
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = c.ink + 'CC'
                  e.currentTarget.style.borderColor = c.ink600
                }}
              >
                <Replace size={14} />
              </button>
              <button
                type="button"
                onClick={handleClear}
                aria-label="Kaldır"
                style={{
                  padding: 8,
                  background: c.ink + 'CC',
                  border: `1px solid ${c.clay}40`,
                  borderRadius: 8,
                  color: c.clay,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  transition: 'all 200ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = c.clay + '20'
                  e.currentTarget.style.borderColor = c.clay
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = c.ink + 'CC'
                  e.currentTarget.style.borderColor = c.clay + '40'
                }}
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? {} : { opacity: 0 }}
            onClick={() => !uploading && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              position: 'relative',
              border: `2px dashed ${dragging ? c.gold : c.ink600}`,
              borderRadius: 12,
              padding: '32px 16px',
              background: dragging ? c.goldSoft : c.ink800,
              cursor: uploading ? 'wait' : 'pointer',
              textAlign: 'center',
              transition: 'border-color 200ms, background 200ms',
              aspectRatio,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {uploading ? (
              <>
                <div style={{
                  width: 32,
                  height: 32,
                  border: `3px solid ${c.ink600}`,
                  borderTopColor: c.gold,
                  borderRadius: '50%',
                  animation: shouldReduceMotion ? undefined : 'spin 1s linear infinite',
                }} />
                <p style={{ fontSize: 13, color: c.ink300, margin: 0 }}>
                  Yükleniyor… {progress}%
                </p>
                <div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} style={{
                  width: '80%',
                  height: 3,
                  background: c.ink700,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    style={{
                      height: '100%',
                      background: c.gold,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <Upload size={24} color={c.ink400} />
                <p style={{
                  fontSize: 14,
                  color: c.cream,
                  margin: 0,
                  fontWeight: 500,
                }}>
                  Görseli bırak veya tıkla
                </p>
                <p style={{ fontSize: 12, color: c.ink400, margin: 0 }}>
                  JPEG, PNG, WebP · max {maxSizeMB}MB
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            style={{
              marginTop: 8,
              padding: '8px 12px',
              background: c.claySoft,
              border: `1px solid ${c.clay}40`,
              borderRadius: 8,
              fontSize: 12,
              color: c.clay,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/*
Kullanım örnekleri:

// STK profili logo
<AdminImageUpload
  folder={ngoId}
  fileName="logo"
  currentUrl={ngo.logo_url}
  onUploaded={(url) => setValue('logo_url', url)}
  label="STK Logo"
  aspectRatio="1:1"
/>

// Kapak resmi
<AdminImageUpload
  folder={ngoId}
  fileName="cover"
  currentUrl={ngo.cover_image_url}
  onUploaded={(url) => setValue('cover_image_url', url)}
  label="Kapak Resmi"
  aspectRatio="16:9"
/>

// Görev görseli
<AdminImageUpload
  folder={`${ngoId}/missions`}
  fileName={missionId}
  currentUrl={mission.image_url}
  onUploaded={(url) => setValue('image_url', url)}
  label="Görev Görseli"
  aspectRatio="16:9"
/>

// Blog cover
<AdminImageUpload
  folder={`${ngoId}/blog`}
  fileName={postId}
  currentUrl={post.cover_image_url}
  onUploaded={(url) => setValue('cover_image_url', url)}
  label="Blog Kapak"
  aspectRatio="16:9"
/>
*/
