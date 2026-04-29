'use client'

// Vol-31.3 NGO Detail Client — donate sekmesinde STK detay.
//
// Akış:
//   Hero (240px cover + back/heart bezel + identity row alt)
//   → Purpose (italic Fraunces tagline)
//   → RegularDonorCard (gold, /give?intent=regular)
//   → Aktif kampanyalar listesi (CampaignCard)
//   → Kurum hakkında (FactRow şeffaflık)
//   → %100 manifesto compact

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import type { Campaign, NGO } from '@/lib/supabase/types'
import { RegularDonorCard } from '@/components/donate/regular-donor-card'
import { CampaignCard } from '@/components/donate/campaign-card'
import { FactRow } from '@/components/donate/fact-row'
import { HundredManifesto } from '@/components/donate/hundred-manifesto'

interface Props {
  ngo: NGO
  campaigns: Campaign[]
}

export function NgoDetailDonateClient({ ngo, campaigns }: Props) {
  const { colors: c } = useTheme()
  const router = useRouter()

  const accent = ngo.color_accent || c.gold
  const label = ngo.short_name || ngo.name
  const initial = label[0] ?? '?'
  const cover = ngo.cover_image_url || null
  const totalSupporters = campaigns.reduce(
    (sum, cmp) => sum + (cmp.supporter_count ?? 0),
    0,
  )
  const yearsActive = ngo.founded ? new Date().getFullYear() - ngo.founded : null
  const verified = ngo.tax_exempt === true

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: c.ink900,
        color: c.cream,
        paddingBottom: 140, // sticky CTA + bottom nav
      }}
    >
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          height: 240,
          backgroundImage: cover ? `url(${cover})` : undefined,
          backgroundColor: cover ? undefined : c.ink700,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(15,11,8,0.55) 0%, transparent 35%, rgba(15,11,8,0.95) 100%)',
          }}
        />

        {/* Bezel: back + heart */}
        <div
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 20px) + 38px)',
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Geri"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(15,11,8,0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: c.cream,
              border: `1px solid ${c.ink600}`,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Favorilere ekle"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(15,11,8,0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: c.cream,
              border: `1px solid ${c.ink600}`,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Heart size={14} />
          </button>
        </div>

        {/* Identity row */}
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
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 28,
              fontWeight: 600,
              boxShadow: `0 8px 20px ${accent}88`,
              flexShrink: 0,
            }}
            aria-hidden
          >
            {initial}
          </div>
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Fraunces', ui-serif, serif",
                fontSize: 22,
                fontWeight: 500,
                color: c.cream,
                letterSpacing: '-0.02em',
              }}
            >
              {ngo.name}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 4,
                flexWrap: 'wrap',
              }}
            >
              {verified && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    padding: '3px 7px',
                    borderRadius: 6,
                    background: `${c.success ?? '#5DC395'}22`,
                    color: c.success ?? '#5DC395',
                    border: `1px solid ${c.success ?? '#5DC395'}55`,
                  }}
                >
                  ✓ VERGİ İNDİRİMLİ
                </span>
              )}
              <span style={{ fontSize: 10, color: c.ink300 }}>
                {totalSupporters > 0 &&
                  `${totalSupporters.toLocaleString('tr-TR')} destekçi`}
                {totalSupporters > 0 && yearsActive !== null && ' · '}
                {yearsActive !== null && `${yearsActive} yıl`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Purpose */}
      {ngo.tagline && (
        <section style={{ padding: '24px 20px 0' }}>
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
            AMACI
          </p>
          <p
            style={{
              margin: '8px 0 0',
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 17,
              color: c.cream,
              lineHeight: 1.45,
              fontStyle: 'italic',
            }}
          >
            &ldquo;{ngo.tagline}&rdquo;
          </p>
        </section>
      )}

      {/* RegularDonorCard */}
      <section style={{ padding: '24px 16px 0' }}>
        <Link
          href={`/dashboard/donate/${ngo.id}/give?intent=regular`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <RegularDonorCard ngoShortName={label} startingAmount={50} />
        </Link>
      </section>

      {/* Aktif kampanyalar */}
      {campaigns.length > 0 && (
        <section style={{ padding: '32px 0 0' }}>
          <div
            style={{
              padding: '0 20px 4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0 }}>
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
                AKTİF KAMPANYALAR
              </p>
              <h2
                style={{
                  margin: '4px 0 0',
                  fontFamily: "'Fraunces', ui-serif, serif",
                  fontSize: 20,
                  fontWeight: 500,
                  color: c.cream,
                  letterSpacing: '-0.02em',
                }}
              >
                Hangi konuya bağışlamak istersin?
              </h2>
            </div>
            <span
              style={{
                fontSize: 11,
                color: c.ink400,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {campaigns.length}
            </span>
          </div>
          <p
            style={{
              margin: '6px 20px 14px',
              fontSize: 11,
              color: c.ink400,
              fontStyle: 'italic',
              fontFamily: "'Fraunces', ui-serif, serif",
              lineHeight: 1.4,
            }}
          >
            Aynı anda farklı amaçlar için bağış toplanıyor — sen seç.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '0 16px',
            }}
          >
            {campaigns.map((cmp) => (
              <CampaignCard key={cmp.id} campaign={cmp} ngoId={ngo.id} />
            ))}
          </div>
        </section>
      )}

      {/* Kurum hakkında */}
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
          KURUM HAKKINDA
        </p>
        <div
          style={{
            padding: 16,
            borderRadius: 16,
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {ngo.founded && (
            <FactRow label="Kuruluş" value={String(ngo.founded)} />
          )}
          <FactRow
            label="Yetki belgesi"
            value={
              ngo.tax_exempt
                ? 'Vergi muafiyeti · Bakanlar Kurulu'
                : 'Belirtilmemiş'
            }
          />
          {ngo.member_count > 0 && (
            <FactRow
              label="Üye"
              value={`${ngo.member_count.toLocaleString('tr-TR')} kişi`}
            />
          )}
          {ngo.website && (
            <FactRow
              label="Web"
              value={ngo.website.replace(/^https?:\/\/(www\.)?/, '')}
              href={
                ngo.website.startsWith('http')
                  ? ngo.website
                  : `https://${ngo.website}`
              }
              last
            />
          )}
        </div>
      </section>

      <section style={{ padding: '24px 0 0' }}>
        <HundredManifesto compact />
      </section>

      {/* Sticky CTA footer */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          background: `linear-gradient(180deg, transparent, ${c.ink900} 30%)`,
          paddingTop: 24,
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            margin: '0 16px 88px',
            // 88px: bottom nav offset (64px) + 12px gap + 12px breathing
            display: 'flex',
            gap: 8,
            pointerEvents: 'auto',
          }}
        >
          <Link
            href={`/dashboard/donate/${ngo.id}/give`}
            style={{
              flex: 1,
              padding: '14px',
              background: c.gold,
              color: c.ink900,
              border: 'none',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: `0 8px 24px ${c.gold}40`,
            }}
          >
            Bağışla →
          </Link>
        </div>
      </div>
    </div>
  )
}
