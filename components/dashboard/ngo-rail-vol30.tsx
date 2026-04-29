'use client'

// Vol-30.5 NGORail — "Senin topluluğun · Üye olduğun" + "Keşfet · İyiliğin öncüleri".
// İki rail: kullanıcının üye olduğu NGO'lar (varsa) + keşfedilebilecek NGO'lar.
// 110px wide NGO kart: avatar (Fraunces initial) + NGO ismi + "N aktif görev".
//
// Üye NGO kartı: kenarda accent renk + sağ üstte ÜYE rozeti.

import Link from 'next/link'
import { useTheme } from '@/lib/theme'
import { SectionHeaderVol30 } from './section-header-vol30'
import type { NGO } from '@/lib/supabase/types'

interface RailNgo {
  ngo: NGO
  activeMissionCount: number
}

interface Props {
  memberNgos: RailNgo[]
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

  return (
    <section style={{ padding: '32px 0 0' }}>
      {memberNgos.length > 0 && (
        <>
          <SectionHeaderVol30
            eyebrow="SENİN TOPLULUĞUN"
            title="Üye olduğun"
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
            {memberNgos.map((r) => (
              <NGOCard key={r.ngo.id} item={r} member />
            ))}
          </div>
        </>
      )}

      {discoverNgos.length > 0 && (
        <>
          <SectionHeaderVol30
            eyebrow="KEŞFET"
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
            {discoverNgos.map((r) => (
              <NGOCard key={r.ngo.id} item={r} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function NGOCard({ item, member }: { item: RailNgo; member?: boolean }) {
  const { colors: c } = useTheme()
  const accent = item.ngo.color_accent || c.gold
  const label = item.ngo.short_name || item.ngo.name
  return (
    <Link
      href={`/dashboard/ngos/${item.ngo.id}`}
      style={{
        flexShrink: 0,
        width: 110,
        borderRadius: 16,
        background: c.ink800,
        border: `1px solid ${member ? `${accent}55` : c.ink600}`,
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
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 12px ${accent}55`,
          fontFamily: "'Fraunces', serif",
          fontSize: 18,
          fontWeight: 600,
          color: '#fff',
          marginBottom: 10,
        }}
        aria-hidden
      >
        {label[0]}
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
            color: accent,
            textTransform: 'uppercase',
          }}
        >
          ÜYE
        </div>
      )}
    </Link>
  )
}
