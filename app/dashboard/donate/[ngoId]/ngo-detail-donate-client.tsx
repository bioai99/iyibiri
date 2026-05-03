'use client'

// Vol-60 NGO Detail Client — donate sekmesinde STK detay (systemik refactor).
//
// Akış:
//   Hero (240px cover + back/heart bezel)
//   → Identity row (logo + name + supporters/years — light mode visible)
//   → Purpose/Tagline (italic Fraunces)
//   → Aktif kampanyalar listesi (CampaignCard → campaign detail route)
//   → Kurum hakkında (HAKKINDA eyebrow + ngo.description uzun form)
//   → FactRow şeffaflık (kuruluş, yetki, üye, web)

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'
import type { Campaign, NGO } from '@/lib/supabase/types'
import { RegularDonorCard } from '@/components/donate/regular-donor-card'
import { CampaignCard } from '@/components/donate/campaign-card'
import { FactRow } from '@/components/donate/fact-row'

interface Props {
  ngo: NGO
  campaigns: Campaign[]
}

export function NgoDetailDonateClient({ ngo, campaigns }: Props) {
  const { colors: c, mode } = useTheme()
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
        paddingBottom: 120, // bottom nav offset
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
        {/* Vol-60: Hero scrim güçlendirildi — light mode'da title visibility.
            Vol-59.1 campaign-detail pattern'i: 0.25→0.55→0.95 gradient + alt %45 ekstra dark band */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(15,11,8,0.25) 0%, rgba(15,11,8,0.55) 50%, rgba(15,11,8,0.95) 100%)',
          }}
        />
        {/* Ekstra dark band alt bölüm — title okunabilirlik garantisi */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '45%',
            background:
              'linear-gradient(180deg, transparent 0%, rgba(15,11,8,0.85) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Bezel: back + heart → IconButtonDS theme="dark" */}
        <div
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 20px) + 38px)',
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          <button type="button" onClick={() => router.back()} style={{ all: 'unset' } as React.CSSProperties}>
            <IconButtonDS
              icon={<ArrowLeft size={16} />}
              theme="dark"
              ariaLabel="Geri"
            />
          </button>
          <IconButtonDS
            icon={<Heart size={14} />}
            theme="dark"
            ariaLabel="Favorilere ekle"
          />
        </div>

        {/* Vol-60: Title + supporters — hero üstünde, açık arka planda görünür */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 20,
            right: 20,
            zIndex: 5,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: "'Fraunces', ui-serif, serif",
              fontSize: 24,
              fontWeight: 600,
              color: '#F4EEDF',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              // Vol-60: Text shadow — light mode contrast
              textShadow: '0 2px 12px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)',
              marginBottom: 8,
            }}
          >
            {ngo.name}
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {verified && (
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '3px 6px',
                  borderRadius: 5,
                  background: 'rgba(93, 195, 149, 0.25)',
                  color: '#5DC395',
                  border: '1px solid rgba(93, 195, 149, 0.4)',
                  textTransform: 'uppercase',
                }}
              >
                ✓ Vergi İndirmli
              </span>
            )}
            <span
              style={{
                fontSize: 12,
                color: '#F4EEDF',
                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}
            >
              {totalSupporters > 0 &&
                `${totalSupporters.toLocaleString('tr-TR')} destekçi`}
              {totalSupporters > 0 && yearsActive !== null && ' · '}
              {yearsActive !== null && `${yearsActive} yıl`}
            </span>
          </div>
        </div>
      </div>

      {/* Purpose/Tagline */}
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

      {/* Aktif kampanyalar — Vol-60: h2 başlık + subtitle kaldırıldı, sadece eyebrow */}
      {campaigns.length > 0 && (
        <section style={{ padding: '32px 0 0' }}>
          <div style={{ padding: '0 20px 12px' }}>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: c.gold,
                textTransform: 'uppercase',
              }}
            >
              AKTİF KAMPANYALAR
            </p>
          </div>
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

      {/* Düzenli Destekçi Kartı — kampanyalar sonrası */}
      <section style={{ padding: '32px 16px 0' }}>
        <Link
          href={`/dashboard/donate/${ngo.id}/give?intent=regular`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <RegularDonorCard ngoShortName={label} startingAmount={50} />
        </Link>
      </section>

      {/* Vol-60: HAKKINDA section — ngo.description uzun form */}
      {ngo.description && (
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
            HAKKINDA
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.6,
              color: c.cream,
              whiteSpace: 'pre-line',
            }}
          >
            {ngo.description}
          </p>
        </section>
      )}

      {/* Kurum hakkında — şeffaflık bilgileri */}
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
          KURUM BİLGİLERİ
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
    </div>
  )
}
