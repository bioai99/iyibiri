'use client'

// Vol-32-B Public sponsor profile — kullanıcı tarafı.
// Hero (cover + brand logo + name + tagline) + posts grid + rewards grid + website link.

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import type { PostWithAuthor, Reward, Sponsor } from '@/lib/supabase/types'

interface Props {
  sponsor: Sponsor
  posts: PostWithAuthor[]
  rewards: Reward[]
}

export function SponsorPublicClient({ sponsor, posts, rewards }: Props) {
  const { colors: c } = useTheme()
  const router = useRouter()
  const accent = sponsor.brand_color || c.gold
  const initial = (sponsor.short_name ?? sponsor.name)[0]

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: c.ink900,
        color: c.cream,
        paddingBottom: 120,
      }}
    >
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          height: 220,
          backgroundImage: sponsor.cover_url ? `url(${sponsor.cover_url})` : undefined,
          backgroundColor: sponsor.cover_url ? undefined : c.ink700,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(15,11,8,0.55) 0%, transparent 35%, rgba(15,11,8,0.95) 100%), linear-gradient(135deg, ${accent}33, transparent 60%)`,
          }}
        />
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Geri"
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 20px) + 38px)',
            left: 16,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(15,11,8,0.7)',
            backdropFilter: 'blur(8px)',
            color: c.cream,
            border: `1px solid ${c.ink600}`,
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Fraunces', serif",
              fontSize: 28,
              fontWeight: 600,
              boxShadow: `0 8px 20px ${accent}88`,
            }}
            aria-hidden
          >
            {initial}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: c.gold,
                textTransform: 'uppercase',
              }}
            >
              SPONSOR MARKA
            </p>
            <h1
              style={{
                margin: '2px 0 0',
                fontFamily: "'Fraunces', ui-serif, serif",
                fontSize: 22,
                fontWeight: 500,
                color: c.cream,
              }}
            >
              {sponsor.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Description + website */}
      {(sponsor.description || sponsor.website) && (
        <section style={{ padding: '24px 20px 0' }}>
          {sponsor.description && (
            <p
              style={{
                fontFamily: "'Fraunces', ui-serif, serif",
                fontSize: 17,
                color: c.cream,
                lineHeight: 1.5,
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              &ldquo;{sponsor.description}&rdquo;
            </p>
          )}
          {sponsor.website && (
            <a
              href={
                sponsor.website.startsWith('http')
                  ? sponsor.website
                  : `https://${sponsor.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: c.gold,
                fontSize: 13,
                textDecoration: 'underline',
              }}
            >
              {sponsor.website.replace(/^https?:\/\/(www\.)?/, '')}
              <ExternalLink size={12} />
            </a>
          )}
        </section>
      )}

      {/* Posts */}
      {posts.length > 0 && (
        <section style={{ padding: '32px 0 0' }}>
          <h2
            style={{
              margin: '0 20px 14px',
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 20,
              fontWeight: 500,
              color: c.cream,
            }}
          >
            Marka yazıları
          </h2>
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/posts/${p.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  background: c.ink800,
                  border: `1px solid ${c.ink600}`,
                  borderRadius: 14,
                  padding: 14,
                  display: 'flex',
                  gap: 12,
                }}
              >
                {p.cover_image_url && (
                  <div
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: 10,
                      flexShrink: 0,
                      backgroundImage: `url(${p.cover_image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: c.cream,
                      lineHeight: 1.3,
                    }}
                  >
                    {p.title}
                  </h3>
                  {p.summary && (
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: 12,
                        color: c.ink300,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {p.summary}
                    </p>
                  )}
                  <p style={{ margin: '6px 0 0', fontSize: 11, color: c.ink400 }}>
                    {p.read_time} dk okuma
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Rewards */}
      {rewards.length > 0 && (
        <section style={{ padding: '32px 0 0' }}>
          <h2
            style={{
              margin: '0 20px 14px',
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 20,
              fontWeight: 500,
              color: c.cream,
            }}
          >
            Markanın ödülleri
          </h2>
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rewards.map((r) => (
              <div
                key={r.id}
                style={{
                  background: c.ink800,
                  border: `1px solid ${c.ink600}`,
                  borderRadius: 14,
                  padding: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: c.ink700,
                    backgroundImage: r.image_url ? `url(${r.image_url})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: c.cream,
                    }}
                  >
                    {r.title}
                  </h3>
                  {r.description && (
                    <p
                      style={{
                        margin: '2px 0 0',
                        fontSize: 11,
                        color: c.ink300,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {r.description}
                    </p>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: c.gold,
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                  }}
                >
                  {r.karma_required.toLocaleString('tr-TR')} ✦
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
