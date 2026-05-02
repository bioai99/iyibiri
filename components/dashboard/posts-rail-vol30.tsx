'use client'

// Vol-30.4 / Vol-40 unified Posts Rail.
//
// Tek kart yapısı, hem NGO hem sponsor postları aynı zenginlikte gösterir
// (cover image, kategori badge, author avatar+isim, okuma süresi, başlık,
// özet). Author tipi post.sponsors varsa sponsor, yoksa post.ngos kullanılır.
//
// Vol-40 öncesi: NGO ve sponsor için 2 farklı tasarım vardı —
// SponsorPostsRail daha sadeydi (cover overlay + brand color, badge yok,
// okuma süresi yok). Brand kimliği sergileme ihtiyacı vardı ama bu yan-yana
// gösterimde tutarsızlık yarattı. Şimdi her ikisi de aynı tipografi/spacing.
//
// Vol-43 (2026-05-02): PostCard avatar artık logo + initial fallback chain
// kullanıyor (önce sadece initial gösteriyordu — logo varken bile harf
// görünüyordu). Cover image için onError state ile fallback gradient eklendi
// (kırık image icon yerine author renk + büyük initial).

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  /** NGO post railinde, kullanıcı subscribed olduğu NGO'lara gold-border + ÜYE rozeti gösterir. Sponsor postları için boş/atlanabilir. */
  subscribedNgoIds?: string[]
  /** Section header eyebrow — örn. "ÖNCÜLERDEN" / "SPONSORLARDAN" */
  eyebrow?: string
  /** Section header başlığı — örn. "Haberler" / "Sosyal sorumluluk" */
  title?: string
  /** "HEPSİ →" link hedefi */
  allHref?: string
}

export function PostsRailVol30({
  posts,
  subscribedNgoIds = [],
  eyebrow = 'ÖNCÜLERDEN',
  title = 'Haberler',
  allHref = '/dashboard/discover',
}: Props) {
  const { colors: c } = useTheme()
  if (!posts || posts.length === 0) return null
  const subSet = new Set(subscribedNgoIds)

  return (
    <section style={{ padding: '32px 0 0' }}>
      <SectionHeaderVol30
        eyebrow={eyebrow}
        title={title}
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

  // Vol-40: Author tipini runtime'da tespit et — sponsor varsa sponsor, yoksa NGO.
  // Sponsor postları için subscribed yoktur (kullanıcı sponsor'a üye olmaz).
  const sponsor = post.sponsors
  const ngo = post.ngos
  const isSponsorPost = !!sponsor && !ngo

  const authorColor =
    (isSponsorPost ? sponsor?.brand_color : ngo?.color_accent) || c.gold
  const authorShort =
    (isSponsorPost
      ? sponsor?.short_name || sponsor?.name
      : ngo?.short_name || ngo?.name) || ''
  const authorName =
    (isSponsorPost ? sponsor?.name : ngo?.name) || authorShort
  const authorLogo =
    (isSponsorPost ? sponsor?.logo_url : ngo?.logo_url) || null

  const cat = post.category ?? ''
  const catColor = CATEGORY_COLORS[cat] ?? c.gold
  const catLabel = CATEGORY_LABELS[cat] ?? ''

  // Sponsor için cover fallback yok (SponsorBrief type'ında cover_image_url
  // yok); cover yoksa author renginden gradient + initial gösterilir.
  const initialCover =
    post.cover_image_url ||
    (isSponsorPost ? null : ngo?.cover_image_url) ||
    null

  // Vol-43: onError state'leri — broken image URL'lerinde fallback'e düş.
  const [coverBroken, setCoverBroken] = useState(false)
  const [logoBroken, setLogoBroken] = useState(false)
  const cover = coverBroken ? null : initialCover
  const showLogo = !!authorLogo && !logoBroken

  // Sponsor postları için subscribed badge yok; gold border'ı sadece subscribed
  // NGO postlarında uygula.
  const accentBorder = subscribed && !isSponsorPost

  return (
    <Link
      href={`/dashboard/posts/${post.id}`}
      style={{
        width: 280,
        flexShrink: 0,
        borderRadius: 18,
        overflow: 'hidden',
        background: c.ink800,
        border: accentBorder
          ? `1.5px solid ${c.gold}`
          : `1px solid ${c.ink600}`,
        boxShadow: accentBorder
          ? `0 0 12px ${c.goldSoft}, 0 2px 8px rgba(0,0,0,.05)`
          : '0 2px 8px rgba(0,0,0,.05)',
        scrollSnapAlign: 'start',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
    >
      {/* Cover image — Faz 1 (perf-eng 2026-04-26): backgroundImage → next/image (-WebP/AVIF + lazy) */}
      <div
        style={{
          width: '100%',
          height: 140,
          backgroundColor: cover ? undefined : c.ink700,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {cover && (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            style={{ objectFit: 'cover' }}
            loading="lazy"
            quality={75}
            aria-hidden="true"
            onError={() => setCoverBroken(true)}
          />
        )}
        {!cover && authorShort && (
          // Cover yoksa: author renginden gradient + büyük initial — boş
          // dikdörtgen yerine author kimliğini sürdür.
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${authorColor}33, ${authorColor}11)`,
              fontSize: 48,
              fontWeight: 700,
              fontFamily: "'Fraunces', ui-serif, Georgia, serif",
              color: authorColor,
              letterSpacing: '-0.02em',
            }}
            aria-hidden
          >
            {authorShort[0]}
          </div>
        )}
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
        {accentBorder && (
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
          {authorShort && (
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: showLogo ? '#fff' : authorColor,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                border: showLogo ? `1px solid ${authorColor}33` : 'none',
              }}
              aria-hidden
            >
              {showLogo ? (
                <Image
                  src={authorLogo!}
                  alt=""
                  fill
                  sizes="20px"
                  style={{ objectFit: 'contain', padding: 2 }}
                  quality={85}
                  onError={() => setLogoBroken(true)}
                />
              ) : (
                authorShort[0]
              )}
            </div>
          )}
          <span
            style={{ fontSize: 11, color: c.ink300, fontWeight: 500 }}
          >
            {authorName}
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
