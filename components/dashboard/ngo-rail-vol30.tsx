'use client'

// Vol-30.5 / Vol-47 NGORail — "İyiliğin öncüleri" tek rail.
//
// Vol-47 (2026-05-02): Eski 2 ayrı rail (Senin topluluğun + Keşfet) tek
// listede birleştirildi. Üye olunan NGO'lar başta gelir + gold border +
// ÜYE rozeti ile öne çıkar. Diğerleri aktif görev sayısına göre sıralanır.
// Logo render eklendi: NGO'nun logo_url'i varsa Image, yoksa initial.
//
// Card: 110×var · daire avatar (logo veya initial) + name + "N aktif görev"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/lib/theme'
import { SectionHeaderVol30 } from './section-header-vol30'
import type { NGO } from '@/lib/supabase/types'

interface RailNgo {
  ngo: NGO
  activeMissionCount: number
}

interface Props {
  /** Kullanıcının üye olduğu NGO'lar — listenin başında gold border + ÜYE rozetiyle */
  memberNgos: RailNgo[]
  /** Üye olunmayan NGO'lar — başlıktan sonra, mission count desc sıralanmış */
  discoverNgos: RailNgo[]
  allHref?: string
}

export function NGORailVol30({
  memberNgos,
  discoverNgos,
  allHref = '/dashboard/ngos',
}: Props) {
  const { colors: c } = useTheme()
  if (memberNgos.length === 0 && discoverNgos.length === 0) return null

  // Vol-47: Birleşik liste — üye olanlar önce, sonra keşfet edilebilenler
  const combined = [
    ...memberNgos.map((r) => ({ ...r, member: true })),
    ...discoverNgos.map((r) => ({ ...r, member: false })),
  ]
  // Vol-47: Eyebrow dinamik — kullanıcı üye ise "Senin topluluğun" hissi
  // verelim; üye değilse keşif tonunda kalsın.
  const eyebrow = memberNgos.length > 0 ? 'SENİN TOPLULUĞUN' : 'KEŞFET'

  return (
    <section style={{ padding: '32px 0 0' }}>
      <SectionHeaderVol30
        eyebrow={eyebrow}
        title="İyiliğin öncüleri"
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
          gap: 10,
          overflowX: 'auto',
          padding: '0 20px 24px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {combined.map((r) => (
          <NGOCard key={r.ngo.id} item={r} member={r.member} />
        ))}
      </div>
    </section>
  )
}

function NGOCard({ item, member }: { item: RailNgo; member?: boolean }) {
  const { colors: c } = useTheme()
  const accent = item.ngo.color_accent || c.gold
  const label = item.ngo.short_name || item.ngo.name
  const logoUrl = item.ngo.logo_url || null
  const [logoBroken, setLogoBroken] = useState(false)
  const showLogo = !!logoUrl && !logoBroken

  return (
    <Link
      href={`/dashboard/ngos/${item.ngo.id}`}
      style={{
        flexShrink: 0,
        width: 110,
        borderRadius: 16,
        background: c.ink800,
        // Vol-47: Üye NGO'larda daha belirgin border (1.5px solid accent)
        border: member
          ? `1.5px solid ${accent}`
          : `1px solid ${c.ink600}`,
        boxShadow: member
          ? `0 0 0 1px ${accent}22, 0 4px 14px ${accent}33`
          : 'none',
        padding: 12,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}40, transparent 70%)`,
        }}
        aria-hidden
      />
      {/* Avatar — Vol-47: logo varsa Image, yoksa initial */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: showLogo
            ? '#fff'
            : `linear-gradient(135deg, ${accent}, ${accent}88)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 12px ${accent}55`,
          fontFamily: "'Fraunces', serif",
          fontSize: 18,
          fontWeight: 600,
          color: '#fff',
          marginBottom: 10,
          overflow: 'hidden',
          border: showLogo ? `1px solid ${accent}33` : 'none',
        }}
        aria-hidden
      >
        {showLogo ? (
          <Image
            src={logoUrl!}
            alt=""
            width={36}
            height={36}
            style={{ objectFit: 'contain', width: '82%', height: '82%' }}
            quality={85}
            onError={() => setLogoBroken(true)}
          />
        ) : (
          label[0]
        )}
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: c.cream,
            marginBottom: 2,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 10, color: c.ink400 }}>
          {item.activeMissionCount} aktif görev
        </div>
      </div>
      {member && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#fff',
            textTransform: 'uppercase',
            background: accent,
            padding: '2px 6px',
            borderRadius: 4,
            zIndex: 2,
          }}
        >
          ÜYE
        </div>
      )}
    </Link>
  )
}
