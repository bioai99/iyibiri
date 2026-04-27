'use client'

// Vol-30.4 Sponsor Posts Rail — "SPONSORLARDAN · Sosyal Sorumluluk".
// Brand color overlay (110px image üstüne brand alpha gradient) +
// brand kısaltma badge + brand isim. Karma rozeti opsiyonel (sponsor + reward bağlantısı).
//
// Kart: 240px wide · 110px image (smaller than NGO post).

import Link from 'next/link'
import { useTheme } from '@/lib/theme'
import { SectionHeaderVol30 } from './section-header-vol30'
import type { PostWithAuthor } from '@/lib/supabase/types'

interface Props {
  posts: PostWithAuthor[]
  allHref?: string
}

export function SponsorPostsRailVol30({
  posts,
  allHref = '/dashboard/discover',
}: Props) {
  const { colors: c } = useTheme()
  if (!posts || posts.length === 0) return null

  return (
    <section style={{ padding: '32px 0 0' }}>
      <SectionHeaderVol30
        eyebrow="SPONSORLARDAN"
        title="Sosyal sorumluluk"
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
          <SponsorCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

function SponsorCard({ post }: { post: PostWithAuthor }) {
  const { colors: c } = useTheme()
  const sponsor = post.sponsors
  const brandColor = sponsor?.brand_color || c.gold
  const brandShort =
    (sponsor?.short_name || sponsor?.name || '?').slice(0, 3).toUpperCase()
  const brandName = sponsor?.name || ''
  const cover = post.cover_image_url || null

  return (
    <Link
      href={`/dashboard/posts/${post.id}`}
      style={{
        width: 240,
        flexShrink: 0,
        borderRadius: 18,
        overflow: 'hidden',
        background: c.ink800,
        border: `1px solid ${c.ink600}`,
        cursor: 'pointer',
        position: 'relative',
        textDecoration: 'none',
        color: 'inherit',
        scrollSnapAlign: 'start',
        display: 'block',
      }}
    >
      {/* Cover with brand color overlay */}
      <div
        style={{
          height: 110,
          backgroundImage: cover ? `url(${cover})` : undefined,
          backgroundColor: cover ? undefined : c.ink700,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, transparent 40%, ${brandColor}cc 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: '#fff',
              color: brandColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
            aria-hidden
          >
            {brandShort}
          </div>
          {brandName && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.04em',
              }}
            >
              {brandName}
            </span>
          )}
        </div>
      </div>
      <div style={{ padding: 12 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: c.cream,
            lineHeight: 1.3,
            marginBottom: 4,
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
              fontSize: 11,
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
