'use client'

// Vol-30.4 NGO Posts Rail — "ÖNCÜLERDEN · Haberler" yatay scroll rail.
// Subscribed NGO postları gold border + ÜYE rozet ile öne çıkar.
//
// Kart: 280px wide · 140px image · Category badge sol üst · ÜYE badge sağ üst.

import Link from 'next/link'
import { useTheme } from '@/lib/theme'
import { SectionHeaderVol30 } from './section-header-vol30'
import type { PostWithAuthor } from '@/lib/supabase/types'

const CATEGORY_LABELS: Record<string, string> = {
  article: 'Makale',
  update: 'Güncelleme',
  story: 'Hikaye',
  tip: 'İpucu',
}

// Vol-30 v2 design palette
const CATEGORY_COLORS: Record<string, string> = {
  article: '#6B8E4E',
  update: '#C8553D',
  story: '#4A6FA5',
  tip: '#E8A838',
}

interface Props {
  posts: PostWithAuthor[]
  subscribedNgoIds?: string[]
  allHref?: string
}

export function PostsRailVol30({
  posts,
  subscribedNgoIds = [],
  allHref = '/dashboard/discover',
}: Props) {
  const { colors: c } = useTheme()
  if (!posts || posts.length === 0) return null
  const subSet = new Set(subscribedNgoIds)

  return (
    <section style={{ padding: '32px 0 0' }}>
      <SectionHeaderVol30
        eyebrow="ÖNCÜLERDEN"
        title="Haberler"
        right={
          <Link
            href={allHref}
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: c.gold,
              letterSpacing: '0.06em',
              textDecoration: 'none',
            }}
          >
            HEPSİ →
          </Link>
        }
      />
      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          padding: '0 16px 8px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            subscribed={post.ngo_id ? subSet.has(post.ngo_id) : false}
          />
        ))}
      </div>
    </section>
  )
}

interface PostCardProps {
  post: PostWithAuthor
  subscribed: boolean
}

function PostCard({ post, subscribed }: PostCardProps) {
  const { colors: c } = useTheme()
  const ngo = post.ngos
  const ngoColor = ngo?.color_accent || c.gold
  const ngoShort = ngo?.short_name || ngo?.name || ''
  const cat = post.category ?? ''
  const catColor = CATEGORY_COLORS[cat] ?? c.gold
  const catLabel = CATEGORY_LABELS[cat] ?? ''
  const cover = post.cover_image_url || ngo?.cover_image_url || null

  return (
    <Link
      href={`/dashboard/posts/${post.id}`}
      style={{
        width: 280,
        flexShrink: 0,
        borderRadius: 18,
        overflow: 'hidden',
        background: c.ink800,
        border: subscribed
          ? `1.5px solid ${c.gold}`
          : `1px solid ${c.ink600}`,
        boxShadow: subscribed
          ? `0 0 12px ${c.goldSoft}, 0 2px 8px rgba(0,0,0,.05)`
          : '0 2px 8px rgba(0,0,0,.05)',
        scrollSnapAlign: 'start',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
    >
      {/* Cover image */}
      <div
        style={{
          width: '100%',
          height: 140,
          backgroundImage: cover ? `url(${cover})` : undefined,
          backgroundColor: cover ? undefined : c.ink700,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {catLabel && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '4px 8px',
              borderRadius: 6,
              background: catColor,
              color: '#fff',
              textTransform: 'uppercase',
            }}
          >
            {catLabel}
          </span>
        )}
        {subscribed && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '4px 8px',
              borderRadius: 999,
              background: c.gold,
              color: '#fff',
            }}
          >
            ÜYE
          </span>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 8,
          }}
        >
          {ngoShort && (
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: ngoColor,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
              }}
              aria-hidden
            >
              {ngoShort[0]}
            </div>
          )}
          <span
            style={{ fontSize: 11, color: c.ink300, fontWeight: 500 }}
          >
            {ngoShort}
          </span>
          {post.read_time > 0 && (
            <span style={{ fontSize: 10, color: c.ink400 }}>
              · {post.read_time} dk okuma
            </span>
          )}
        </div>
        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: c.cream,
            lineHeight: 1.3,
            marginBottom: 6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </h3>
        {post.summary && (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: c.ink300,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.summary}
          </p>
        )}
      </div>
    </Link>
  )
}
