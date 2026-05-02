'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Leaf, BookOpen, Heart, Clock } from 'lucide-react'
import { PawPrint } from 'lucide-react'
import { MissionCard } from '@/components/ui/mission-card'
import type { MissionWithNGO, NGO, PostWithNGO } from '@/lib/supabase/types'
import { useTheme } from '@/lib/theme'

// Faz 1 (2026-04-26 perf-eng): post cover + NGO logo next/image.

interface DiscoverClientProps {
  missions: MissionWithNGO[]
  ngos: NGO[]
  posts: PostWithNGO[]
  subscribedNgoIds: string[]
  memberNgoIds?: string[]
  userId?: string
}

const categories = [
  { name: 'Çevre', count: 18, color: '#C4CBAC', bg: 'rgba(196,203,172,0.12)', icon: Leaf },
  { name: 'Eğitim', count: 32, color: '#EADDB8', bg: 'rgba(234,221,184,0.12)', icon: BookOpen },
  { name: 'Hayvanlar', count: 14, color: '#E9CFC2', bg: 'rgba(233,207,194,0.12)', icon: PawPrint },
  { name: 'Sağlık', count: 9, color: '#E8B4A8', bg: 'rgba(232,180,168,0.12)', icon: Heart },
]

const categoryBadgeColors: Record<string, { bg: string; text: string }> = {
  article: { bg: 'rgba(107,142,78,0.15)', text: '#6B8E4E' },    // green
  update: { bg: 'rgba(200,85,61,0.15)', text: '#C8553D' },      // clay/red
  story: { bg: 'rgba(74,111,165,0.15)', text: '#4A6FA5' },      // blue
  tip: { bg: 'rgba(232,168,56,0.15)', text: '#E8A838' },        // amber
}

const categoryLabels: Record<string, string> = {
  article: 'Makale',
  update: 'Güncelleme',
  story: 'Hikaye',
  tip: 'İpucu',
}

function PostCard({ post, isSubscribed, c }: { post: PostWithNGO; isSubscribed: boolean; c: any }) {
  const badge = post.category ? categoryBadgeColors[post.category] : null
  const label = post.category ? categoryLabels[post.category] : null

  return (
    <div
      style={{
        width: 320, minWidth: 320,
        background: c.ink800,
        borderRadius: 16,
        border: isSubscribed ? `1.5px solid ${c.goldLine}` : `1px solid ${c.ink600}`,
        overflow: 'hidden',
        scrollSnapAlign: 'start',
        boxShadow: isSubscribed ? '0 0 12px rgba(212,175,55,0.08), 0 1px 4px rgba(0,0,0,.06)' : '0 1px 4px rgba(0,0,0,.06)',
      }}
    >
      <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
        {post.cover_image_url && (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
           
            style={{ objectFit: 'cover' }}
            loading="lazy"
            quality={75}
          />
        )}
      </div>
      <div style={{ padding: 14, height: 150, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          {post.ngos?.logo_url ? (
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'white',
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src={post.ngos.logo_url}
                alt={post.ngos.short_name ?? ''}
                width={16}
                height={16}
                style={{ objectFit: 'contain' }}
               
                quality={80}
              />
            </div>
          ) : (
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: post.ngos?.color_accent ?? c.ink500,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {(post.ngos?.short_name ?? '?')[0]}
            </div>
          )}
          <span style={{ fontSize: 11, color: c.ink300, fontWeight: 500 }}>
            {post.ngos?.short_name ?? post.ngos?.name}
          </span>
          <span style={{ fontSize: 10, color: c.ink300 }}>
            · {post.read_time} dk
          </span>
          {badge && label && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                background: badge.bg,
                color: badge.text,
                padding: '2px 7px',
                borderRadius: 6,
              }}
            >
              {label}
            </span>
          )}
        </div>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: c.cream,
            margin: '0 0 4px',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}
        >
          {post.title}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: c.ink300,
            margin: 0,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}
        >
          {post.summary}
        </p>
      </div>
    </div>
  )
}

export function DiscoverClient({ missions, ngos, posts, subscribedNgoIds, memberNgoIds = [], userId }: DiscoverClientProps) {
  const { colors: c } = useTheme()
  const [query, setQuery] = useState('')

  // BUG-045 fix (Vol-19): query string ile post filter et (title + description + NGO name + city + category)
  const q = query.trim().toLocaleLowerCase('tr-TR')
  const matchesQuery = (p: PostWithNGO) => {
    if (!q) return true
    const ngo = ngos.find((n) => n.id === p.ngo_id)
    const haystack = [
      p.title,
      (p as { excerpt?: string | null }).excerpt,
      (p as { body?: string | null }).body,
      p.category,
      ngo?.name,
      ngo?.short_name,
    ]
      .filter(Boolean)
      .map((s) => String(s).toLocaleLowerCase('tr-TR'))
      .join(' ')
    return haystack.includes(q)
  }

  const trendingMission = missions[missions.length - 1] ?? null

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        paddingBottom: 140,
      }}
    >
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0' }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-fraunces), Fraunces, serif',
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: c.cream,
            lineHeight: 1.25,
          }}
        >
          Bugün{' '}
          <em
            style={{
              fontStyle: 'italic',
              color: c.gold,
            }}
          >
            iyi
          </em>{' '}
          yapacağın şey?
        </h1>
      </div>

      {/* Search input */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6B6154',
              pointerEvents: 'none',
            }}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Öncü, kategori veya şehir"
            aria-label="Öncüleri ara"
            style={{
              width: '100%',
              background: c.ink800,
              border: `1px solid ${c.ink600}`,
              borderRadius: 14,
              padding: '14px 16px 14px 44px',
              fontSize: 15,
              color: c.cream,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 180ms ease',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = c.gold }}
            onBlur={(e) => { e.currentTarget.style.borderColor = c.ink600 }}
          />
        </div>
      </div>

      {/* Blog posts section */}
      {posts.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ padding: '0 20px', marginBottom: 14 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: c.gold,
                marginBottom: 6,
              }}
            >
              Öncülerden
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-fraunces), Fraunces, serif',
                fontSize: 20,
                fontWeight: 500,
                color: c.cream,
                letterSpacing: '-0.02em',
              }}
            >
              Öncülerden Haberler
            </h2>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              padding: '0 16px',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {posts.filter(p => {
              const ngoCategory = ngos.find(n => n.id === p.ngo_id)?.category
              return ngoCategory !== 'sponsor' && matchesQuery(p)
            }).map((post) => (
              <Link key={post.id} href={`/dashboard/posts/${post.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <PostCard
                  post={post}
                  isSubscribed={post.ngo_id ? subscribedNgoIds.includes(post.ngo_id) : false}
                  c={c}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sponsor posts */}
      {posts.filter(p => {
        const ngoCategory = ngos.find(n => n.id === p.ngo_id)?.category
        return ngoCategory === 'sponsor' && matchesQuery(p)
      }).length > 0 && (
        <div style={{ padding: '28px 0 0' }}>
          <div style={{ padding: '0 20px 12px' }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: c.gold, marginBottom: 4,
            }}>
              Sponsorlardan
            </div>
            <h2 style={{
              margin: 0, fontFamily: 'var(--font-display), Fraunces, serif',
              fontSize: 20, fontWeight: 500, color: c.cream, letterSpacing: '-0.02em',
            }}>
              Sosyal Sorumluluk
            </h2>
          </div>
          <div style={{
            display: 'flex', gap: 12, overflowX: 'auto', padding: '0 16px',
            scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none', scrollbarWidth: 'none',
          }}>
            {posts.filter(p => {
              const ngoCategory = ngos.find(n => n.id === p.ngo_id)?.category
              return ngoCategory === 'sponsor' && matchesQuery(p)
            }).map((post) => (
              <Link key={post.id} href={`/dashboard/posts/${post.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <PostCard
                  post={post}
                  isSubscribed={post.ngo_id ? subscribedNgoIds.includes(post.ngo_id) : false}
                  c={c}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories — horizontal scroll chips */}
      <div style={{ padding: '28px 20px 0' }}>
        <h2
          style={{
            margin: '0 0 12px',
            fontFamily: 'var(--font-fraunces), Fraunces, serif',
            fontSize: 20,
            fontWeight: 500,
            color: c.cream,
            letterSpacing: '-0.02em',
          }}
        >
          Kategoriler
        </h2>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: '0 16px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.name}
              href="/dashboard/missions"
              style={{ textDecoration: 'none', flexShrink: 0 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: c.ink800,
                  border: `1px solid ${c.ink600}`,
                  borderRadius: 100,
                  padding: '10px 16px 10px 12px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,.06)',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: cat.bg,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={14} style={{ color: cat.color }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: c.cream, whiteSpace: 'nowrap' }}>
                  {cat.name}
                </span>
                <span style={{ fontSize: 11, color: '#6B6154' }}>
                  {cat.count}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Trending section */}
      <div style={{ padding: '32px 20px 14px' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: c.gold,
            marginBottom: 6,
          }}
        >
          Bu hafta
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-fraunces), Fraunces, serif',
            fontSize: 20,
            fontWeight: 500,
            color: c.cream,
            letterSpacing: '-0.02em',
          }}
        >
          Trend olanlar
        </h2>
      </div>

      {trendingMission && (
        <div style={{ padding: '0 16px' }}>
          <MissionCard mission={trendingMission} isMember={memberNgoIds.includes(trendingMission.ngo_id ?? '')} userId={userId} />
        </div>
      )}
    </div>
  )
}
