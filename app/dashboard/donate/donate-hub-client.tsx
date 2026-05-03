'use client'

// Vol-31.2 Donate Hub Client — STK keşfi + search + featured carousel.
// Akış:
//   - Sticky header (BAĞIŞ eyebrow + "Tüm STK'lar" + kurum sayısı)
//   - Sticky search input
//   - Search aktif: kategori chip + popüler etiket + son aramalar + filtered NGO list
//   - Search pasif: featured carousel + tüm NGO listesi + %100 manifesto

import { useMemo, useRef, useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import type { CampaignWithNGO, NGO } from '@/lib/supabase/types'
// Vol-58.1: HundredManifesto kaldırıldı — IntroCard zaten "Aracı olmadan,
// doğrudan kuruma" mesajını veriyor. Liste altındaki tekrar görsel
// kalabalık yapıyordu.
import { FeaturedCardCompact } from '@/components/donate/featured-card-compact'
import { NgoListCard } from '@/components/donate/ngo-list-card'

interface Props {
  ngos: NGO[]
  featured: CampaignWithNGO[]
  supportersByNgo: Record<string, number>
}

const POPULAR_TAGS = [
  '#çevre',
  '#deprem',
  '#çocuk',
  '#hayvan',
  '#eğitim',
  '#sağlık',
]

export function DonateHubClient({ ngos, featured, supportersByNgo }: Props) {
  const { colors: c, mode } = useTheme()
  const isDark = mode === 'dark'
  const [searchActive, setSearchActive] = useState(false)
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [featuredIdx, setFeaturedIdx] = useState(0)
  const railRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  // Featured carousel scroll → active dot
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const onScroll = () => {
      const cardWidth = rail.clientWidth
      const idx = Math.round(rail.scrollLeft / Math.max(1, cardWidth - 60))
      setFeaturedIdx(Math.min(featured.length - 1, Math.max(0, idx)))
    }
    rail.addEventListener('scroll', onScroll, { passive: true })
    return () => rail.removeEventListener('scroll', onScroll)
  }, [featured.length])

  // Kategori listesi (DB'deki distinct ngos.category)
  const categories = useMemo(() => {
    const map = new Map<string, number>()
    for (const n of ngos) {
      if (!n.category) continue
      map.set(n.category, (map.get(n.category) ?? 0) + 1)
    }
    return Array.from(map.entries())
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
  }, [ngos])

  // Search filter
  const filteredNgos = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ngos.filter((n) => {
      if (activeCat && n.category !== activeCat) return false
      if (!q) return true
      const hay = [
        n.name,
        n.short_name,
        n.tagline,
        n.description,
        n.category,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [ngos, query, activeCat])

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: c.ink900,
        color: c.cream,
        paddingBottom: 120,
      }}
    >
      {/* Sticky header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: c.ink900,
          paddingBottom: 12,
        }}
      >
        {!searchActive && (
          <div
            style={{
              padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  color: c.gold,
                  textTransform: 'uppercase',
                }}
              >
                BAĞIŞ
              </p>
              {/* Vol-58: "Tüm STK'lar" → daha sıcak, kullanıcı odaklı bir başlık.
                  STK kısaltması generic ve teknik; "öncülere destek" hem brand
                  ("İyiliğin öncüleri") tutarlı hem warm. */}
              <h1
                style={{
                  margin: '4px 0 0',
                  fontFamily: "'Fraunces', ui-serif, serif",
                  fontSize: 26,
                  fontWeight: 500,
                  letterSpacing: '-0.025em',
                  color: c.cream,
                  lineHeight: 1.1,
                }}
              >
                İyiliğin{' '}
                <em style={{ fontStyle: 'italic', color: c.gold }}>
                  öncülerine
                </em>{' '}
                destek
              </h1>
            </div>
            <div
              style={{
                fontSize: 10,
                color: c.ink400,
                paddingBottom: 4,
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: c.cream,
                  fontFamily: "'Fraunces', ui-serif, serif",
                  fontSize: 14,
                }}
              >
                {ngos.length}
              </div>
              kurum
            </div>
          </div>
        )}

        {/* Search bar */}
        <div
          style={{
            padding: searchActive
              ? 'calc(env(safe-area-inset-top, 20px) + 38px) 16px 0'
              : '14px 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              borderRadius: 14,
              background: c.ink800,
              border: searchActive
                ? `1px solid ${c.gold}66`
                : `1px solid ${c.ink600}`,
              boxShadow: searchActive ? `0 0 0 3px ${c.gold}15` : undefined,
              transition: 'border 200ms, box-shadow 200ms',
            }}
          >
            <Search size={14} color={searchActive ? c.gold : c.ink400} />
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Vakıf, kategori, şehir…"
              aria-label="STK ara — vakıf, kategori veya şehir"
              value={query}
              onFocus={() => setSearchActive(true)}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: c.cream,
                fontSize: 14,
                fontFamily: 'inherit',
                minWidth: 0,
              }}
            />
            {searchActive && query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Aramayı temizle"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: c.ink600,
                  color: c.cream,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <X size={11} />
              </button>
            )}
            {!searchActive && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: c.ink400,
                  padding: '3px 6px',
                  border: `1px solid ${c.ink600}`,
                  borderRadius: 5,
                }}
                aria-hidden
              >
                ⌘K
              </span>
            )}
          </div>
          {searchActive && (
            <button
              type="button"
              onClick={() => {
                setSearchActive(false)
                setQuery('')
                setActiveCat(null)
                searchInputRef.current?.blur()
              }}
              style={{
                fontSize: 13,
                color: c.gold,
                fontWeight: 600,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              İptal
            </button>
          )}
        </div>

        {/* Search active: kategori chip strip */}
        {searchActive && categories.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              padding: '12px 16px 4px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveCat(null)}
              style={{
                flexShrink: 0,
                padding: '7px 12px',
                borderRadius: 999,
                background: activeCat === null ? c.cream : c.ink800,
                color: activeCat === null ? c.ink900 : c.cream,
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Tümü
            </button>
            {categories.map((cat) => {
              const isActive = activeCat === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCat(isActive ? null : cat.id)}
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 12px',
                    borderRadius: 999,
                    background: isActive ? c.cream : c.ink800,
                    color: isActive ? c.ink900 : c.cream,
                    fontSize: 12,
                    fontWeight: 600,
                    border: isActive ? 'none' : `1px solid ${c.ink600}`,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.id}
                  <span style={{ fontSize: 10, color: isActive ? c.ink900 : c.ink400 }}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {searchActive ? (
        <SearchActiveContent
          query={query}
          filteredNgos={filteredNgos}
          supportersByNgo={supportersByNgo}
          c={c}
        />
      ) : (
        <HubContent
          ngos={ngos}
          featured={featured}
          featuredIdx={featuredIdx}
          railRef={railRef}
          supportersByNgo={supportersByNgo}
          c={c}
          isDark={isDark}
          mode={mode}
        />
      )}
    </div>
  )
}

// ─── Hub içerik (search pasifken) ─────────────────────────────────

function HubContent({
  ngos,
  featured,
  featuredIdx,
  railRef,
  supportersByNgo,
  c,
  mode,
}: {
  ngos: NGO[]
  featured: CampaignWithNGO[]
  featuredIdx: number
  railRef: React.MutableRefObject<HTMLDivElement | null>
  supportersByNgo: Record<string, number>
  c: ReturnType<typeof useTheme>['colors']
  isDark: boolean
  mode: 'light' | 'dark'
}) {
  return (
    <>
      {/* Vol-58: Intro tanıtım kartı — bu bölümde ne yapabilirsin? */}
      <IntroCard c={c} mode={mode} />

      {/* Featured carousel */}
      {featured.length > 0 && (
        <section style={{ padding: '20px 0 0' }}>
          <div
            style={{
              padding: '0 20px 10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: c.gold,
                textTransform: 'uppercase',
              }}
            >
              BU AYIN KAMPANYALARI
            </p>
            <span
              style={{
                fontSize: 10,
                color: c.ink400,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {featuredIdx + 1}/{featured.length}
            </span>
          </div>
          <div
            ref={railRef}
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              padding: '0 16px 4px',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {featured.map((cmp) => (
              <FeaturedCardCompact key={cmp.id} campaign={cmp} />
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 5,
              marginTop: 12,
            }}
          >
            {featured.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === featuredIdx ? 16 : 5,
                  height: 5,
                  borderRadius: 999,
                  background: i === featuredIdx ? c.gold : c.ink600,
                  transition: 'all 200ms',
                }}
                aria-hidden
              />
            ))}
          </div>
        </section>
      )}

      {/* PRIMARY — STK listesi
          Vol-58: "Tüm kurumlar" → "İyiliğin öncüleri" (dashboard NGORail ile
          tutarlı brand language). */}
      <section style={{ padding: '32px 16px 0' }}>
        <div
          style={{
            padding: '0 4px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div>
            {/* Vol-58.1: "Sıralama: Önerilen" satırı kaldırıldı — UI temiz. */}
            <h2
              style={{
                margin: 0,
                fontFamily: "'Fraunces', ui-serif, serif",
                fontSize: 22,
                fontWeight: 500,
                color: c.cream,
                letterSpacing: '-0.02em',
              }}
            >
              İyiliğin{' '}
              <em style={{ fontStyle: 'italic', color: c.gold }}>öncüleri</em>
            </h2>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ngos.map((ngo) => (
            <NgoListCard
              key={ngo.id}
              ngo={ngo}
              supporterCount={supportersByNgo[ngo.id] ?? 0}
            />
          ))}
        </div>
      </section>

      {/* Vol-58.1: HundredManifesto kaldırıldı — IntroCard'da zaten "Aracı
          olmadan, doğrudan kuruma" mesajı var, tekrar görsel kalabalık. */}
    </>
  )
}

// ─── Search active içerik ─────────────────────────────────────────

function SearchActiveContent({
  query,
  filteredNgos,
  supportersByNgo,
  c,
}: {
  query: string
  filteredNgos: NGO[]
  supportersByNgo: Record<string, number>
  c: ReturnType<typeof useTheme>['colors']
}) {
  const trimmed = query.trim()
  return (
    <>
      <div style={{ padding: '14px 20px 0' }}>
        <p style={{ margin: 0, fontSize: 11, color: c.ink400 }}>
          <span
            style={{
              color: c.cream,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {filteredNgos.length}
          </span>{' '}
          sonuç
          {trimmed && (
            <>
              {' · '}
              &quot;
              <span
                style={{
                  fontStyle: 'italic',
                  fontFamily: "'Fraunces', ui-serif, serif",
                  color: c.gold,
                }}
              >
                {trimmed}
              </span>
              &quot;
            </>
          )}
        </p>
      </div>

      <div
        style={{
          padding: '14px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {filteredNgos.map((ngo) => (
          <NgoListCard
            key={ngo.id}
            ngo={ngo}
            highlightTerm={trimmed || undefined}
            supporterCount={supportersByNgo[ngo.id] ?? 0}
          />
        ))}
      </div>

      {/* Popüler etiketler */}
      <section style={{ padding: '32px 16px 0' }}>
        <p
          style={{
            margin: '0 4px 12px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: c.gold,
            textTransform: 'uppercase',
          }}
        >
          POPÜLER ARAMALAR
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {POPULAR_TAGS.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '7px 12px',
                borderRadius: 999,
                background: c.ink800,
                border: `1px solid ${c.ink600}`,
                fontSize: 12,
                color: c.ink300,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
    </>
  )
}

// ─── Vol-58: Intro tanıtım kartı ─────────────────────────────────
// Kullanıcı bağış sekmesine ilk geldiğinde "ne yapabilirim?" sorusuna 1
// satırda yanıt verir. Üç pil — tek seferlik, düzenli, vergi indirimli —
// ile değer önermesi hızlıca okunur.
function IntroCard({ c, mode }: { c: ReturnType<typeof useTheme>['colors']; mode: 'light' | 'dark' }) {
  return (
    <section style={{ padding: '14px 16px 0' }}>
      <div
        style={{
          padding: '14px 16px',
          borderRadius: 16,
          // Vol-59.2: Light mode'da iki cream tonu çakışıyor (görsel hafif) — koyu tone ekle
          background: mode === 'light'
            ? `linear-gradient(135deg, ${c.goldSoft}, rgba(232,194,104,0.18))`
            : `linear-gradient(135deg, ${c.goldSoft}, ${c.ink800})`,
          border: `1px solid ${c.goldLine}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.55,
            color: c.cream,
          }}
        >
          Sevdiğin{' '}
          <em style={{ fontStyle: 'italic', color: c.gold, fontFamily: "'Fraunces', ui-serif, serif" }}>
            öncüye
          </em>{' '}
          tek seferlik veya düzenli bağış yap.
          Aracı olmadan, doğrudan kuruma.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            { label: 'Tek seferlik', icon: '⚡' },
            { label: 'Düzenli bağışçı', icon: '↻' },
            { label: 'Vergi indirimli', icon: '✓' },
          ].map((p) => (
            <span
              key={p.label}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 999,
                background: `${c.gold}1A`,
                color: c.gold,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span aria-hidden style={{ fontSize: 10 }}>{p.icon}</span>
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
