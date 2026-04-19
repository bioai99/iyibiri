'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, Clock, Share2, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { createClient } from '@/lib/supabase/client'
import type { PostWithNGO } from '@/lib/supabase/types'

interface Props {
  post: PostWithNGO
  userId: string
  initialLiked: boolean
  initialLikeCount: number
  isMember?: boolean
}

const categoryLabels: Record<string, string> = {
  article: 'Makale', update: 'Güncelleme', story: 'Hikaye', tip: 'İpucu',
}

export function PostDetailClient({ post, userId, initialLiked, initialLikeCount, isMember = false }: Props) {
  const { colors: c } = useTheme()
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const displayFont = 'var(--font-display), Fraunces, serif'

  const toggleLike = useCallback(async () => {
    const prev = liked
    const prevCount = likeCount
    setLiked(!prev)
    setLikeCount(prev ? prevCount - 1 : prevCount + 1)

    try {
      const supabase = createClient()
      if (prev) {
        await supabase.from('post_likes').delete().eq('user_id', userId).eq('post_id', post.id)
      } else {
        await supabase.from('post_likes').insert({ user_id: userId, post_id: post.id })
      }
    } catch {
      setLiked(prev)
      setLikeCount(prevCount)
    }
  }, [liked, likeCount, userId, post.id])

  const ngo = post.ngos

  return (
    <div style={{ minHeight: '100vh', background: c.ink900, color: c.cream, paddingBottom: 100 }}>
      {/* Cover image */}
      {post.cover_image_url && (
        <div style={{ position: 'relative', height: 280 }}>
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,.3) 0%, transparent 40%, rgba(0,0,0,.5) 100%)',
          }} />
          {/* Back button */}
          <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 20px) + 12px)', left: 16 }}>
            <Link href="/dashboard/discover" style={{ textDecoration: 'none' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ArrowLeft size={18} color="#F4EEDF" />
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: post.cover_image_url ? '20px 20px 0' : 'calc(env(safe-area-inset-top, 20px) + 60px) 20px 0' }}>
        {/* NGO + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          {ngo?.logo_url ? (
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: 'white',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src={ngo.logo_url} alt={ngo.name} style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
            </div>
          ) : (
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: ngo?.color_accent ?? c.gold,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
            }}>
              {(ngo?.short_name ?? '?')[0]}
            </div>
          )}
          <span style={{ fontSize: 13, fontWeight: 600, color: c.cream }}>{ngo?.short_name ?? ngo?.name}</span>
          <span style={{ fontSize: 12, color: c.ink300 }}>·</span>
          <Clock size={12} color={c.ink300} />
          <span style={{ fontSize: 12, color: c.ink300 }}>{post.read_time} dk okuma</span>
          {post.category && (
            <span style={{
              marginLeft: 'auto', fontSize: 10, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              background: c.goldSoft, color: c.gold,
              padding: '3px 8px', borderRadius: 6,
            }}>
              {categoryLabels[post.category] ?? post.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: displayFont, fontSize: 26, fontWeight: 500,
          letterSpacing: '-0.025em', lineHeight: 1.2,
          color: c.cream, margin: '0 0 16px',
        }}>
          {post.title}
        </h1>

        {/* Summary */}
        {post.summary && (
          <p style={{
            fontSize: 16, lineHeight: 1.6, color: c.ink200,
            margin: '0 0 20px', fontWeight: 500,
          }}>
            {post.summary}
          </p>
        )}

        {/* Content */}
        {post.content && (
          <div style={{
            fontSize: 15, lineHeight: 1.7, color: c.ink300,
            margin: '0 0 32px',
            whiteSpace: 'pre-line',
          }}>
            {post.content}
          </div>
        )}

        {/* Membership CTA */}
        {!isMember && post.ngo_id && (
          <Link href={`/dashboard/ngos/${post.ngo_id}/membership`} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: c.goldSoft, border: `1px solid ${c.goldLine}`,
              borderRadius: 14, padding: '14px 16px', margin: '20px 0',
            }}>
              {ngo?.logo_url && (
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'white', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={ngo.logo_url} alt="" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: c.cream }}>{ngo?.short_name ?? ngo?.name} gönüllüsü ol</div>
                <div style={{ fontSize: 12, color: c.ink300 }}>Görevlerden öncelikli haberdar ol</div>
              </div>
              <ChevronRight size={16} color={c.gold} />
            </div>
          </Link>
        )}

        {/* Like + Share bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '16px 0', borderTop: `1px solid ${c.ink600}`,
        }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleLike}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 0,
            }}
          >
            <Heart
              size={22}
              style={{
                fill: liked ? '#C8553D' : 'none',
                color: liked ? '#C8553D' : c.ink300,
                transition: 'all 200ms ease',
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: liked ? '#C8553D' : c.ink300 }}>
              {likeCount > 0 ? likeCount : ''}
            </span>
          </motion.button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.title, text: post.summary ?? '', url: window.location.href })
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: c.ink300, padding: 0,
            }}
          >
            <Share2 size={18} />
            <span style={{ fontSize: 13 }}>Paylaş</span>
          </button>
        </div>
      </div>
    </div>
  )
}
