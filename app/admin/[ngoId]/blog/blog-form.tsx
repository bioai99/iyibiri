'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBlogPost, updateBlogPost } from '@/lib/admin/blog-actions'
import { AdminImageUpload } from '@/components/admin/admin-image-upload'
import type { Post } from '@/lib/supabase/types'

interface BlogFormProps {
  ngoId: string
  post?: Post
}

const CATEGORIES = [
  { value: 'article', label: 'Makale' },
  { value: 'update', label: 'Güncelleme' },
  { value: 'story', label: 'Hikaye' },
  { value: 'tip', label: 'İpucu' },
]

export function BlogForm({ ngoId, post }: BlogFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [showPreview, setShowPreview] = useState(false)

  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    cover_image_url: post?.cover_image_url || '',
    category: (post?.category || 'article') as 'article' | 'update' | 'story' | 'tip',
    status: (post?.published ? 'published' : 'draft') as 'draft' | 'published',
  })

  const handleChange = (
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert('Başlık zorunlu')
      return
    }

    if (!formData.content.trim()) {
      alert('İçerik zorunlu')
      return
    }

    startTransition(async () => {
      try {
        let result
        if (post) {
          result = await updateBlogPost(ngoId, post.id, formData)
        } else {
          result = await createBlogPost(ngoId, formData)
        }

        if (result.success) {
          router.push(`/admin/${ngoId}/blog`)
          router.refresh()
        } else {
          alert(`Hata: ${result.error}`)
        }
      } catch (err) {
        alert(`Hata: ${(err as Error).message}`)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-cream mb-2">
          Başlık *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Yazı başlığını gir"
          maxLength={150}
          className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <p className="text-xs text-ink-300 mt-1">
          {formData.title.length} / 150 karakter
        </p>
      </div>

      {/* Category + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-cream mb-2">
            Kategori
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-cream mb-2">
            Durum
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 text-cream focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </div>
      </div>

      {/* Cover Image URL */}
      <AdminImageUpload
        folder={`${ngoId}/blog`}
        fileName={post?.id || Math.random().toString(36).substr(2, 9)}
        currentUrl={formData.cover_image_url}
        onUploaded={(url) => handleChange('cover_image_url', url)}
        label="Blog Kapak Resmi"
        aspectRatio="16:9"
      />
      <details style={{ marginTop: 8 }}>
        <summary style={{ fontSize: 12, color: 'var(--ink-400)', cursor: 'pointer' }}>
          Alternatif: URL yapıştır
        </summary>
        <input
          type="url"
          value={formData.cover_image_url}
          onChange={(e) => handleChange('cover_image_url', e.target.value)}
          placeholder="https://example.com/image.jpg"
          style={{ width: '100%', marginTop: 8, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--ink-600)', backgroundColor: 'var(--ink-800)', color: 'var(--cream)', fontSize: '14px' }}
        />
      </details>

      {/* Content with Preview Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-cream">
            İçerik (Markdown) *
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-gold hover:text-gold/80 font-medium"
          >
            {showPreview ? 'Düzenleme' : 'Önizleme'}
          </button>
        </div>

        {!showPreview ? (
          <textarea
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="Yazının içeriğini gir. Markdown destekliyor."
            rows={12}
            className="w-full px-4 py-3 rounded-xl bg-ink-900 border border-ink-600 text-cream placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold font-mono text-sm"
          />
        ) : (
          <div className="bg-ink-900 border border-ink-600 rounded-xl p-4 prose prose-invert max-w-none">
            <div
              className="prose prose-invert max-w-none text-sm text-cream"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(formData.content),
              }}
            />
          </div>
        )}

        <p className="text-xs text-ink-300 mt-2">
          {formData.content.split(' ').length} kelime,{' '}
          {Math.ceil(formData.content.split(' ').length / 200)} dakikalık okuma
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-6 border-t border-ink-700">
        <Link
          href={`/admin/${ngoId}/blog`}
          className="px-6 py-3 rounded-xl bg-ink-700 text-cream font-semibold hover:bg-ink-600 transition-colors"
        >
          İptal
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 rounded-xl bg-gold text-ink-900 font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          {pending
            ? 'Kaydediliyor...'
            : post
              ? 'Güncelle'
              : 'Yayınla'}
        </button>
      </div>
    </form>
  )
}

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-gold hover:underline">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')

  return `<p>${html}</p>`
    .replace(/<p><\/p>/g, '')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h1><\/p>/g, '</h1>')
    .replace(/<\/h2><\/p>/g, '</h2>')
    .replace(/<\/h3><\/p>/g, '</h3>')
}
