'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Share2, ArrowRight, Flame } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { KarmaDotToken } from '@/components/ui/ds/karma-dot-token'
import { IconButtonDS } from '@/components/ui/ds/icon-button-ds'

const campaign = {
  title: 'Deprem bölgesine kış yardımı',
  ngo: 'Türk Kızılay',
  ngoLogo: '/kizilay-logo.png',
  cover: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900&q=80',
  goal: 2000000,
  raised: 1347000,
  donors: 8420,
  daysLeft: 23,
  desc: "Hatay, Adıyaman ve Kahramanmaraş'taki konteyner kentlerdeki ailelere mont, battaniye ve gıda kolisi ulaştırıyoruz.",
}

const impactLadder = [
  { amount: 100, desc: '1 aile için gıda kolisi' },
  { amount: 250, desc: '1 kişilik kışlık kıyafet seti' },
  { amount: 500, desc: 'Bir aileye battaniye + mont' },
]

export default function DonationCampaignPage({ params }: { params: { id: string } }) {
  const { colors: c } = useTheme()
  const router = useRouter()

  const pct = Math.round((campaign.raised / campaign.goal) * 100)
  const raisedK = (campaign.raised / 1000).toFixed(0)

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        paddingBottom: 110,
        position: 'relative',
      }}
    >
      {/* ── 1. Cover photo 4:3 ── */}
      <div style={{ position: 'relative', aspectRatio: '4/3', width: '100%', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={campaign.cover}
          alt={campaign.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg,rgba(26,22,18,.4) 0%,rgba(26,22,18,0) 35%,rgba(26,22,18,0) 65%,rgba(36,32,27,1) 100%)',
          }}
        />

        {/* Top row: back + share */}
        <div
          style={{
            position: 'absolute',
            top: 58,
            left: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <IconButtonDS icon={<ArrowLeft size={18} />} onClick={() => router.back()} />
          <IconButtonDS
            icon={<Share2 size={18} />}
            onClick={() => {
              try {
                if (navigator.share) navigator.share({ title: campaign.title, url: window.location.href })
              } catch { /* silent */ }
            }}
          />
        </div>

        {/* Bottom: urgency pill */}
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(200,85,61,0.18)',
              border: `1px solid rgba(200,85,61,0.45)`,
              borderRadius: 999,
              padding: '5px 12px',
            }}
          >
            <Flame size={13} color={c.clay} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: c.clay,
              }}
            >
              ACİL · {campaign.daysLeft} gün kaldı
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. NGO lockup + title ── */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#fff',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={campaign.ngoLogo}
              alt={campaign.ngo}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={e => {
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent) {
                  parent.style.background = c.clay
                  const span = document.createElement('span')
                  span.textContent = campaign.ngo[0]
                  span.style.cssText = `font-size:14px;font-weight:700;color:#fff`
                  parent.appendChild(span)
                }
              }}
            />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: c.ink300, letterSpacing: '.04em' }}>
            {campaign.ngo}
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '-0.024em',
            lineHeight: 1.15,
            color: c.cream,
            margin: 0,
          }}
        >
          {campaign.title}
        </h1>
      </div>

      {/* ── 3. Progress card ── */}
      <div style={{ padding: '20px 20px 0' }}>
        <div
          style={{
            background: c.ink800,
            border: `1px solid ${c.ink600}`,
            borderRadius: 16,
            padding: '18px 20px',
          }}
        >
          {/* Raised amount */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: c.gold,
              letterSpacing: '-0.02em',
              marginBottom: 4,
            }}
          >
            ₺{Number(raisedK).toLocaleString('tr-TR')}K toplandı
          </div>

          {/* Sub-label */}
          <div style={{ fontSize: 13, color: c.ink300, marginBottom: 14 }}>
            ₺{(campaign.goal / 1000).toFixed(0)}K hedefin %{pct}&apos;i
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: c.ink600,
              overflow: 'hidden',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(pct, 100)}%`,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${c.goldDim}, ${c.gold})`,
              }}
            />
          </div>

          {/* Donor count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <KarmaDotToken size={14} />
            <span style={{ fontSize: 13, color: c.ink200 }}>
              {campaign.donors.toLocaleString('tr-TR')} bağışçı
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. Impact ladder ── */}
      <div style={{ padding: '24px 20px 0' }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: c.gold,
            marginBottom: 12,
          }}
        >
          Bağışın etkisi
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {impactLadder.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 16px',
                background: i === 0 ? c.ink800 : 'transparent',
                borderRadius: 12,
                borderBottom: i < impactLadder.length - 1 ? `1px solid ${c.ink700}` : 'none',
              }}
            >
              <span style={{ fontSize: 14, color: c.ink200 }}>{row.desc}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: c.gold }}>₺{row.amount}</span>
                <ArrowRight size={14} color={c.ink500} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Description ── */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: c.ink300, margin: 0 }}>
          {campaign.desc}
        </p>
      </div>

      {/* ── 6. Sticky CTA ── */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, rgba(36,32,27,0), rgba(36,32,27,.96) 30%)`,
          backdropFilter: 'blur(12px)',
          padding: '16px 16px 32px',
        }}
      >
        <Link href={`/dashboard/donations/${params.id}/amount`} style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              background: c.gold,
              color: '#24201B',
              border: 'none',
              borderRadius: 16,
              padding: '16px 20px',
              fontSize: 16,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              letterSpacing: '.01em',
            }}
          >
            Bağış yap →
          </button>
        </Link>
      </div>
    </div>
  )
}
