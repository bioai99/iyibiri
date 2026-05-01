'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

/**
 * İyiBiri — Landing v4
 * - Pattern A 2-col hero
 * - Real Fraunces (font-display) + Plus Jakarta Sans (font-sans) from app/layout.tsx
 * - Real NGO logos from /public/
 * - Cream / gold / ink tokens from tailwind.config.ts
 * - No 3D coin, no canvas particles, no marquee — sadece sticky nav blur + scroll-reveal
 */
export default function LandingPage() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    document.querySelectorAll('.lp-r').forEach((el) => io.observe(el))

    const onScroll = () => {
      const nav = document.getElementById('lp-nav')
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 12)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <style dangerouslySetInnerHTML={{ __html: 'html,body{overflow-y:auto!important;height:auto!important;scrollbar-width:thin;scrollbar-color:rgba(26,22,18,0.25) transparent}html::-webkit-scrollbar,body::-webkit-scrollbar{display:block!important;width:10px;height:10px}html::-webkit-scrollbar-track,body::-webkit-scrollbar-track{background:transparent}html::-webkit-scrollbar-thumb,body::-webkit-scrollbar-thumb{background:rgba(26,22,18,0.22);border-radius:5px;border:2px solid transparent;background-clip:content-box}html::-webkit-scrollbar-thumb:hover,body::-webkit-scrollbar-thumb:hover{background:rgba(26,22,18,0.4);background-clip:content-box}.lp-r{opacity:0;transform:translateY(20px);transition:opacity .9s ease-out,transform .9s ease-out}.lp-r.in{opacity:1;transform:translateY(0)}#lp-nav{border-bottom:0.5px solid transparent;transition:border-color .25s ease}#lp-nav.scrolled{border-bottom-color:rgba(26,22,18,0.10)}.lp-ngo-logo{filter:grayscale(1) brightness(0.55) contrast(1.1);opacity:0.55;transition:filter .25s,opacity .25s}.lp-ngo-logo:hover{filter:grayscale(0) brightness(1);opacity:1}' }} />

      {/* ════════ NAV ════════ */}
      <nav
        id="lp-nav"
        className="sticky top-0 z-50 backdrop-blur-md backdrop-saturate-150 bg-cream/82"
      >
        <div className="mx-auto max-w-[1200px] px-7 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-baseline font-display text-[22px] tracking-tight">
            <span className="font-medium">İyi</span>
            <span className="italic text-gold-dim font-normal">Biri</span>
          </Link>
          <div className="hidden md:flex gap-9 text-[14px] text-ink/75">
            <Link href="#urun" className="hover:text-ink transition-colors">Ürün</Link>
            <Link href="#karma" className="hover:text-ink transition-colors">Karma</Link>
            <Link href="#stk" className="hover:text-ink transition-colors">STK&apos;lar</Link>
            <Link href="#sponsor" className="hover:text-ink transition-colors">Sponsorlar</Link>
          </div>
          <Link
            href="/auth/login"
            className="rounded-full bg-ink text-cream text-[13px] font-medium px-5 py-2.5 hover:opacity-85 transition-opacity"
          >
            Giriş yap
          </Link>
        </div>
      </nav>

      {/* ════════ HERO — Pattern A 2-col ════════ */}
      <section className="relative">
        <div className="mx-auto max-w-[1200px] px-7 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-gold-dim mb-7">
              <span className="w-4 h-px bg-gold-dim" />
              Mahalleden büyüyen iyilik
            </div>
            <h1 className="font-display font-normal leading-[0.96] tracking-[-0.035em] text-ink text-[64px] md:text-[88px] lg:text-[108px] mb-7">
              İyilik <em className="italic text-gold-dim">biriktirilir.</em>
            </h1>
            <p className="text-[18px] leading-[1.55] text-ink/70 max-w-[520px] mb-10">
              Türkiye&apos;nin sivil toplum kuruluşlarıyla, gerçek görevlerle, gerçek katkıyla.
              Bir saat de versen, bir gün de — hepsi birikiyor.
            </p>
            <div className="flex flex-wrap gap-3 items-center mb-12">
              <Link href="/auth/login" className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-ink text-cream rounded-xl text-[14px] font-medium hover:opacity-85 transition-opacity">
                <svg width="18" height="22" viewBox="0 0 24 28" fill="currentColor">
                  <path d="M17.4 14.7c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3-.5 7.5 1.2 10 .9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.2 3.1-2.4.7-.9 1-1.4 1.7-3.6-3.5-1-3.1-3.7-3.1-3.1zM15 5.7c.7-.8 1.2-2 1-3.2-1.1.1-2.4.7-3.1 1.6-.7.7-1.2 2-1 3.1 1.2.1 2.4-.7 3.1-1.5z" />
                </svg>
                <span className="text-left leading-tight">
                  <span className="block text-[10px] tracking-wider opacity-70">İNDİR</span>
                  <span className="block text-[15px] font-medium">App Store</span>
                </span>
              </Link>
              <Link href="/auth/login" className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-ink text-cream rounded-xl text-[14px] font-medium hover:opacity-85 transition-opacity">
                <svg width="18" height="22" viewBox="0 0 24 28" fill="currentColor">
                  <path d="M3.6 3.4c-.3.4-.5 1-.5 1.7v18.5c0 .7.2 1.3.5 1.7l.1.1L14 14.1v-.2L3.7 3.3l-.1.1zm14.2 12.5l-3.4-3.4 7.6-4.3c.6.4 1.1 1 .9 1.7 0 .7-.4 1.4-.9 1.7l-4.2 4.3zm-3.4 1.6l3.4-3.4 4.3 4.3c-.4.6-1 1-1.7 1L14 17.5h.4zM4 24.7l9.6-9.6 3.4 3.4-9.4 5.3c-.7.4-1.6.4-2.2.1-.7-.4-1.1-1.1-1.4-1.8z" />
                </svg>
                <span className="text-left leading-tight">
                  <span className="block text-[10px] tracking-wider opacity-70">İNDİR</span>
                  <span className="block text-[15px] font-medium">Google Play</span>
                </span>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-ink/60">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span><b className="font-medium text-ink">1.380 kişi</b> şu an gönüllü</span>
              </span>
              <span className="text-ink/40">·</span>
              <span>248 STK ortağı</span>
              <span className="text-ink/40">·</span>
              <span>62.103 görev</span>
            </div>
          </div>

          {/* Right: Mission detail phone (hero showcase) */}
          <div className="flex justify-center md:justify-end">
            <PhoneMission />
          </div>
        </div>
      </section>

      {/* ════════ NGO TRUST STRIP ════════ */}
      <section className="border-y border-ink/10 py-12 bg-cream/50">
        <div className="mx-auto max-w-[1200px] px-7">
          <p className="text-center text-[11px] uppercase tracking-[0.16em] text-ink/50 mb-8">
            Türkiye&apos;nin sivil toplum kuruluşlarıyla
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-x-8 gap-y-6 items-center">
            {NGO_LOGOS.map((n) => (
              <div key={n.src} className="flex justify-center">
                <Image
                  src={n.src}
                  alt={n.alt}
                  width={n.w}
                  height={n.h}
                  className="lp-ngo-logo"
                  style={{ height: '32px', width: 'auto' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section className="py-20 border-b border-ink/10">
        <div className="mx-auto max-w-[1200px] px-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`px-6 ${i > 0 ? 'md:border-l border-ink/10' : ''}`}
              >
                <div className="font-display font-medium tracking-[-0.025em] leading-none text-[42px] md:text-[56px] mb-1.5">
                  {s.value}
                </div>
                <div className="text-[12px] text-ink/55 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ÜRÜN — 3 PHONES ════════ */}
      <section id="urun" className="py-32 bg-gradient-to-b from-cream to-[#EBE0C5]">
        <div className="mx-auto max-w-[1200px] px-7">
          <div className="lp-r">
            <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-gold-dim mb-4">
              <span className="w-4 h-px bg-gold-dim" />
              Ürün
            </div>
            <h2 className="font-display font-normal leading-[1.0] tracking-[-0.03em] text-[44px] md:text-[68px] max-w-[820px] mb-5">
              Cebinde bir <em className="italic text-gold-dim">iyilik defteri.</em>
            </h2>
            <p className="text-[18px] leading-[1.6] text-ink/65 max-w-[560px]">
              Görev kartından tamamlama akışına, kendi rütbenden mahalledeki STK&apos;lara — sade, sıcak, gerçek.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 mt-20">
            <PhoneCard caption="Bir görev, üç adım" sub="Başvur, onay bekle, check-in." Phone={PhoneMission} />
            <PhoneCard caption="Karman, hikâyen" sub="Birikiyor, rütben yükseliyor." Phone={PhoneProfile} />
            <PhoneCard caption="Hikâyeyi keşfet" sub="Öncülerden ve sponsorlardan." Phone={PhoneDiscover} />
          </div>
        </div>
      </section>

      {/* ════════ KARMA EDITORIAL ════════ */}
      <section id="karma" className="py-32">
        <div className="mx-auto max-w-[1200px] px-7 grid md:grid-cols-2 gap-20 items-center">
          <div className="lp-r">
            <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-gold-dim mb-4">
              <span className="w-4 h-px bg-gold-dim" />
              Karma sistemi
            </div>
            <h2 className="font-display font-normal leading-[1.05] tracking-[-0.03em] text-[44px] md:text-[60px] mb-6">
              Yaptığın her iyilik <em className="italic text-gold-dim">bir hikâye.</em>
            </h2>
            <p className="text-[17px] leading-[1.6] text-ink/70 mb-3.5 max-w-[480px]">
              Karma — yapıp ettiklerinin görünür hâli. Bir saat de versen, bir gün de — hepsi birikiyor. Tamamladığın her görev seni bir sonraki rütbeye yaklaştırıyor, yeni rozetler açıyor.
            </p>
            <p className="text-[17px] leading-[1.6] text-ink/70 max-w-[480px]">
              Ne yarış ne ego — sade bir defter. Senin defterin.
            </p>
          </div>
          <div className="lp-rflex flex-col rounded-2xl overflow-hidden border border-ink/10 bg-[#FAF3E0]">
            {TIERS.map((t, i) => (
              <div
                key={t.name}
                className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? 'border-t border-ink/10' : ''} ${t.you ? 'bg-[#FFF8E5]' : ''}`}
              >
                <span
                  className="w-7 h-7 rounded-full shrink-0"
                  style={{ background: t.color }}
                />
                <span className="font-display font-medium text-[17px] tracking-[-0.01em] flex-1">
                  {t.name}
                  {t.you && (
                    <em className="ml-2 not-italic text-[12px] font-sans text-gold-dim italic">· yakında</em>
                  )}
                </span>
                <span className="font-display text-[14px] text-ink/55">{t.karma}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ STK SECTION ════════ */}
      <section id="stk" className="py-32 bg-[#EBE0C5]">
        <div className="mx-auto max-w-[1200px] px-7 grid md:grid-cols-2 gap-20 items-center">
          <div className="lp-r">
            <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-gold-dim mb-4">
              <span className="w-4 h-px bg-gold-dim" />
              STK&apos;lar için
            </div>
            <h2 className="font-display font-normal leading-[1.05] tracking-[-0.025em] text-[40px] md:text-[52px] mb-5">
              Topluluğunuzu <em className="italic text-gold-dim">seferber</em> edin.
            </h2>
            <p className="text-[17px] leading-[1.55] text-ink/70 mb-7 max-w-[480px]">
              Görev yayınlayın, gönüllüleri davet edin, doğrulayın. Tek panel, sade akış.
            </p>
            <div className="flex flex-col gap-3.5 mb-9">
              {STK_FEATURES.map((f, i) => (
                <div key={f.label} className="flex items-start gap-4">
                  <span className="font-display text-[14px] text-gold-dim min-w-[24px] pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] leading-[1.55] text-ink/75">
                    <b className="font-medium text-ink">{f.label}</b> {f.text}
                  </span>
                </div>
              ))}
            </div>
            <Link href="mailto:stk@iyibiri.app" className="inline-flex items-center gap-2 px-5 py-3 border border-ink rounded-full text-[14px] font-medium hover:bg-ink hover:text-cream transition-colors">
              Demo isteyin
              <span>→</span>
            </Link>
          </div>
          <AdminPreview />
        </div>
      </section>

      {/* ════════ SPONSOR SECTION ════════ */}
      <section id="sponsor" className="py-32">
        <div className="mx-auto max-w-[1200px] px-7 grid md:grid-cols-2 gap-20 items-center">
          <div className="md:order-2 lp-r">
            <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-gold-dim mb-4">
              <span className="w-4 h-px bg-gold-dim" />
              Markalar için
            </div>
            <h2 className="font-display font-normal leading-[1.05] tracking-[-0.025em] text-[40px] md:text-[52px] mb-5">
              İyilik <em className="italic text-gold-dim">marka</em> hikâyenize dokunsun.
            </h2>
            <p className="text-[17px] leading-[1.55] text-ink/70 mb-7 max-w-[480px]">
              CSR bütçesini gerçek aksiyona bağlayan bir mecra. Bir kampanya, bir görev seti, bir sponsorluk — şeffaf raporla.
            </p>
            <div className="flex flex-col gap-3.5 mb-9">
              {SPONSOR_FEATURES.map((f, i) => (
                <div key={f.label} className="flex items-start gap-4">
                  <span className="font-display text-[14px] text-gold-dim min-w-[24px] pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] leading-[1.55] text-ink/75">
                    <b className="font-medium text-ink">{f.label}</b> {f.text}
                  </span>
                </div>
              ))}
            </div>
            <Link href="mailto:sponsor@iyibiri.app" className="inline-flex items-center gap-2 px-5 py-3 border border-ink rounded-full text-[14px] font-medium hover:bg-ink hover:text-cream transition-colors">
              Konuşalım
              <span>→</span>
            </Link>
          </div>
          <SponsorPreview />
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="py-40 text-center">
        <div className="mx-auto max-w-[800px] px-7">
          <h2 className="lp-rfont-display font-normal leading-[0.95] tracking-[-0.04em] text-[64px] md:text-[112px] mb-7">
            Bugün <em className="italic text-gold-dim">bir iyilik</em> birik.
          </h2>
          <p className="lp-rtext-[18px] text-ink/65 max-w-[520px] mx-auto mb-11 leading-[1.55]">
            Mahallenden başla. Karma birikir, hikâyen büyür.
          </p>
          <div className="lp-rinline-flex flex-wrap justify-center gap-3">
            <Link href="/auth/login" className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-ink text-cream rounded-xl text-[14px] font-medium hover:opacity-85 transition-opacity">
              <svg width="18" height="22" viewBox="0 0 24 28" fill="currentColor">
                <path d="M17.4 14.7c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3-.5 7.5 1.2 10 .9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.2 3.1-2.4.7-.9 1-1.4 1.7-3.6-3.5-1-3.1-3.7-3.1-3.1zM15 5.7c.7-.8 1.2-2 1-3.2-1.1.1-2.4.7-3.1 1.6-.7.7-1.2 2-1 3.1 1.2.1 2.4-.7 3.1-1.5z" />
              </svg>
              <span className="text-left leading-tight">
                <span className="block text-[10px] tracking-wider opacity-70">İNDİR</span>
                <span className="block text-[15px] font-medium">App Store</span>
              </span>
            </Link>
            <Link href="/auth/login" className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-ink text-cream rounded-xl text-[14px] font-medium hover:opacity-85 transition-opacity">
              <svg width="18" height="22" viewBox="0 0 24 28" fill="currentColor">
                <path d="M3.6 3.4c-.3.4-.5 1-.5 1.7v18.5c0 .7.2 1.3.5 1.7l.1.1L14 14.1v-.2L3.7 3.3l-.1.1zm14.2 12.5l-3.4-3.4 7.6-4.3c.6.4 1.1 1 .9 1.7 0 .7-.4 1.4-.9 1.7l-4.2 4.3zm-3.4 1.6l3.4-3.4 4.3 4.3c-.4.6-1 1-1.7 1L14 17.5h.4zM4 24.7l9.6-9.6 3.4 3.4-9.4 5.3c-.7.4-1.6.4-2.2.1-.7-.4-1.1-1.1-1.4-1.8z" />
              </svg>
              <span className="text-left leading-tight">
                <span className="block text-[10px] tracking-wider opacity-70">İNDİR</span>
                <span className="block text-[15px] font-medium">Google Play</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="py-14 border-t border-ink/10">
        <div className="mx-auto max-w-[1200px] px-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-baseline font-display text-[20px] tracking-tight">
                <span className="font-medium">İyi</span>
                <span className="italic text-gold-dim font-normal">Biri</span>
              </Link>
              <p className="text-[14px] text-ink/55 mt-4 max-w-[260px] leading-[1.55]">
                Mahalleden büyüyen bir iyilik hareketi. Türkiye&apos;nin sivil toplum kuruluşlarıyla.
              </p>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h5 className="text-[11px] uppercase tracking-[0.14em] text-ink/55 mb-4 font-medium">{col.title}</h5>
                <div className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <Link key={l.label} href={l.href} className="text-[14px] text-ink/70 hover:text-gold-dim transition-colors">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-ink/10 flex justify-between text-[12px] text-ink/50">
            <span>© 2026 İyiBiri</span>
            <span>Türkiye&apos;de tasarlandı</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ═══════════ Data ═══════════ */

const NGO_LOGOS = [
  { src: '/tema-logo.png', alt: 'TEMA Vakfı', w: 120, h: 40 },
  { src: '/cydd-logo.png', alt: 'ÇYDD', w: 120, h: 40 },
  { src: '/haytap-logo.png', alt: 'HAYTAP', w: 120, h: 40 },
  { src: '/kodluyoruz-logo.png', alt: 'Kodluyoruz', w: 120, h: 40 },
  { src: '/kizilay-logo.png', alt: 'Türk Kızılay', w: 120, h: 40 },
  { src: '/tog-logo.svg', alt: 'TOG', w: 120, h: 40 },
  { src: '/ibb-logo.png', alt: 'İBB', w: 120, h: 40 },
  { src: '/garanti-bbva-logo.svg', alt: 'Garanti BBVA', w: 120, h: 40 },
  { src: '/trendyol-logo.svg', alt: 'Trendyol', w: 120, h: 40 },
]

const STATS = [
  { value: '18.247', label: 'Aktif gönüllü' },
  { value: '248', label: 'STK ortağı' },
  { value: '62.103', label: 'Tamamlanan görev' },
  { value: '81 / 81', label: 'Şehir' },
]

// ADR-014 Accepted (2026-04-26): Bu landing TIERS dizisi **kasıtlı** olarak ayrı bir
// pazarlama/anlatım sistemi — sistem tier'ı değildir. "Yapraklanan/Çiçeklenen/Çınar"
// landing storytelling metaforu (ağaç büyüme); kullanıcının dashboard'da gördüğü sistem
// tier'ları için `lib/tiers.ts` canonical kullanılır. Custom lint rule
// `no-magic-tier-name` (TD-009) kurulduğunda bu satır eslint-disable comment ile exempt edilir.
const TIERS = [
  { name: 'İyi Biri', karma: '0+', color: '#E0D6C0', you: false },
  { name: 'Çok İyi Biri', karma: '500+', color: 'radial-gradient(circle at 30% 30%, #F4D98A, #B58F3D)', you: true },
  { name: 'Yapraklanan', karma: '2.000+', color: '#C5D5A8', you: false },
  { name: 'Çiçeklenen', karma: '5.000+', color: '#9FC18B', you: false },
  { name: 'Çınar', karma: '15.000+', color: 'radial-gradient(circle at 30% 30%, #4A3A22, #1A1612)', you: false },
]

const STK_FEATURES = [
  { label: 'Görev tanımı 2 dakikada.', text: 'Konum, kontenjan, doğrulama yöntemi.' },
  { label: 'QR, fotoğraf veya STK onayı.', text: 'Doğrulama yöntemini siz seçersiniz.' },
  { label: 'Aylık etki raporu.', text: 'Kim, kaç görev, kaç saat — şeffaf.' },
  { label: 'Üyelik & bağış akışları aynı yerde.', text: 'İçerik blogunuzla beraber.' },
]

const SPONSOR_FEATURES = [
  { label: 'Branded mission set.', text: 'Kendi temanızla görev paketi.' },
  { label: 'Etki raporu.', text: 'Ulaşılan kişi, saat, görev, geri dönüş.' },
  { label: 'Çalışan engagement.', text: 'Ekibinizle birlikte görev tamamlayın.' },
  { label: 'Şeffaf dağıtım.', text: 'Bütçenin nereye gittiği görünür.' },
]

const FOOTER_COLS = [
  { title: 'Ürün', links: [{ label: 'İndir', href: '/auth/login' }, { label: 'Karma sistemi', href: '#karma' }, { label: 'Yenilikler', href: '#' }] },
  { title: 'Topluluk', links: [{ label: "STK'lar", href: '#stk' }, { label: 'Sponsorlar', href: '#sponsor' }, { label: 'Blog', href: '#' }] },
  { title: 'İletişim', links: [{ label: 'hello@iyibiri.app', href: 'mailto:hello@iyibiri.app' }, { label: 'KVKK', href: '#' }, { label: 'Şartlar', href: '#' }] },
]

/* ═══════════ Phone components ═══════════ */

function PhoneCard({ caption, sub, Phone }: { caption: string; sub: string; Phone: React.ComponentType }) {
  return (
    <div className="lp-rflex flex-col items-center">
      <Phone />
      <div className="mt-7 text-center">
        <div className="font-display font-medium text-[20px] tracking-[-0.01em] mb-1">{caption}</div>
        <div className="text-[13px] text-ink/55">{sub}</div>
      </div>
    </div>
  )
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-ink rounded-[44px] p-2 shadow-[0_30px_80px_-20px_rgba(26,22,18,0.18),0_8px_24px_-8px_rgba(26,22,18,0.10)]" style={{ width: 280 }}>
      <div className="bg-cream rounded-[36px] overflow-hidden relative" style={{ width: 264, height: 540 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[84px] h-[22px] bg-ink rounded-b-[14px] z-10" />
        <div className="px-6 pt-3.5 flex justify-between items-center text-[11px] font-semibold">
          <span>9:41</span>
          <span className="inline-flex items-center gap-1">
            <svg width="14" height="9" viewBox="0 0 18 11" fill="currentColor"><path d="M0 9V2h2v7zM4 9V0h2v9zM8 9V4h2v5zM12 9V6h2v3z"/></svg>
            <svg width="13" height="9" viewBox="0 0 13 9" fill="none" stroke="currentColor" strokeWidth="0.7"><rect x="0.5" y="0.5" width="10" height="8" rx="1.5"/><rect x="2" y="2" width="6.5" height="5" fill="currentColor"/><rect x="11" y="2.5" width="1.2" height="4" rx="0.5" fill="currentColor"/></svg>
          </span>
        </div>
        {children}
        <BottomNav />
      </div>
    </div>
  )
}

function BottomNav({ active = 'Görevler' }: { active?: string }) {
  const items = [
    { name: 'Anasayfa', icon: <path d="M3 8 L9 3 L15 8 V15 H3 Z" /> },
    { name: 'Keşfet', icon: <><circle cx="8" cy="8" r="5" /><line x1="12" y1="12" x2="15" y2="15" /></> },
    { name: 'Görevler', icon: <path d="M3 5 L7 9 L15 1 M3 13 L7 17 L9 15" /> },
    { name: 'Ödüller', icon: <><rect x="3" y="6" width="12" height="9" rx="1" /><path d="M6 6 V4 Q6 2 9 2 Q12 2 12 4 V6" /></> },
    { name: 'Profil', icon: <><circle cx="9" cy="6" r="3" /><path d="M3 16 Q3 11 9 11 Q15 11 15 16" /></> },
  ]
  return (
    <div className="absolute bottom-0 left-0 right-0 px-3 pt-2.5 pb-5 flex justify-around bg-cream/92 backdrop-blur border-t border-ink/10">
      {items.map((it) => {
        const isActive = it.name === active
        return (
          <div key={it.name} className={`flex flex-col items-center gap-1 text-[10px] ${isActive ? 'text-gold-dim' : 'text-ink/55'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-gold/18' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2">{it.icon}</svg>
            </div>
            {it.name}
          </div>
        )
      })}
    </div>
  )
}

/* PHONE 1 — Mission detail (Sahil Temizliği) */
function PhoneMission() {
  return (
    <PhoneShell>
      {/* hero photo */}
      <div className="relative h-[200px] mt-3" style={{
        background: 'linear-gradient(140deg, #1f3818 0%, #355322 30%, #6b8a45 70%, #c9b878 100%)',
      }}>
        <svg className="absolute bottom-0 left-1/2 -translate-x-1/2" width="200" height="120" viewBox="0 0 200 120" fill="none">
          <ellipse cx="100" cy="60" rx="35" ry="22" fill="#3d2818" opacity="0.7" />
          <path d="M70 60 Q60 35 50 25 Q55 45 65 55 Z M75 65 Q70 45 60 35 Q63 50 70 60 Z" fill="#4d6228" opacity="0.85" />
          <path d="M130 60 Q140 35 150 25 Q145 45 135 55 Z M125 65 Q130 45 140 35 Q137 50 130 60 Z" fill="#4d6228" opacity="0.85" />
          <ellipse cx="100" cy="65" rx="20" ry="10" fill="#2a1f10" />
          <path d="M85 55 Q90 40 95 35 Q92 50 88 58 Z M115 55 Q110 40 105 35 Q108 50 112 58 Z" fill="#3d6622" />
        </svg>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(26,22,18,0.65) 100%)' }} />
        <span className="absolute top-4 left-5 text-[10px] text-cream px-2.5 py-1 rounded-full bg-cream/15 backdrop-blur border border-cream/20 z-10">Çevre</span>
        <h3 className="absolute bottom-4 left-5 right-5 font-display text-[24px] text-cream tracking-[-0.02em] leading-[1.05] z-10">
          Sahil Temizliği
        </h3>
      </div>
      {/* Applied card */}
      <div className="mx-5 mt-4 px-3.5 py-3 bg-[#FFFCF4] rounded-2xl border border-ink/10 flex gap-3 items-center">
        <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="3" y="1" width="8" height="2" rx="0.5" />
            <rect x="3" y="11" width="8" height="2" rx="0.5" />
            <path d="M4 3 L4 5 Q4 6.5 7 7 Q10 6.5 10 5 L10 3" />
            <path d="M4 11 L4 9 Q4 7.5 7 7 Q10 7.5 10 9 L10 11" />
          </svg>
        </div>
        <div>
          <div className="text-[12px] font-semibold leading-tight">Başvurun alındı</div>
          <div className="text-[10px] text-ink/55 mt-0.5">NGO 24 saat içinde yanıtlayacak.</div>
        </div>
      </div>
      <div className="px-5 mt-4 text-[9px] tracking-[0.14em] text-gold-dim uppercase">Sırada Ne Var</div>
      {[
        { n: 1, active: true, t1: 'NGO onayı', t2: 'TEMA Vakfı 24 saat içinde katılımını onaylar' },
        { n: 2, active: false, t1: "Hazırlık SMS'i", t2: 'Görev öncesi buluşma detayı SMS ile gelir' },
        { n: 3, active: false, t1: 'Görev günü check-in', t2: 'Konuma vardığında QR ile giriş yap' },
      ].map((s) => (
        <div key={s.n} className="px-5 py-2 flex items-start gap-3">
          <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold ${s.active ? 'bg-gold-dim text-white' : 'bg-cream border border-ink/10 text-ink/55'}`}>{s.n}</div>
          <div>
            <div className="text-[11px] font-semibold leading-tight">{s.t1}</div>
            <div className="text-[9px] text-ink/55 mt-0.5">{s.t2}</div>
          </div>
        </div>
      ))}
      <div className="mx-5 mt-4 py-2.5 border border-ink/15 rounded-full text-center text-[11px] text-ink/70">
        Katılımı iptal et
      </div>
    </PhoneShell>
  )
}

/* PHONE 2 — Profile */
function PhoneProfile() {
  return (
    <PhoneShell>
      <div className="px-5 pt-5 flex justify-between">
        <div className="w-[30px] h-[30px] rounded-full bg-ink/6 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="7" cy="7" r="2"/><path d="M7 1 V3 M7 11 V13 M1 7 H3 M11 7 H13" /></svg>
        </div>
        <div className="w-[30px] h-[30px] rounded-full bg-ink/6 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="3" cy="7" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="11" cy="11" r="1.5"/></svg>
        </div>
      </div>
      <div className="mx-auto mt-4 w-[70px] h-[70px] rounded-full bg-[#F4D98A] border-2 border-gold flex items-center justify-center font-display text-[30px] text-[#4A3514]">T</div>
      <div className="text-center font-display text-[18px] mt-3 tracking-[-0.01em]">Test Gönüllü</div>
      <div className="text-center text-[11px] text-ink/55 mt-0.5">@test · İstanbul</div>
      <div className="mx-5 mt-4 px-3.5 py-3 bg-[#FFFCF4] rounded-2xl border border-ink/10">
        <div className="flex items-baseline gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, #E8C268, #8A6420)' }} />
          <span className="font-display text-[22px] font-medium tracking-[-0.02em]">100</span>
          <span className="text-[11px] text-ink/55">Karma</span>
        </div>
        <div className="flex justify-between text-[9px] text-ink/55 mt-2 mb-1">
          <span><em className="font-display italic text-ink/75 text-[10px]">Çok İyi Biri</em>&apos;ye</span>
          <span>400 kaldı</span>
        </div>
        <div className="h-1 bg-cream rounded-full overflow-hidden">
          <div className="h-full w-1/5 bg-gold-dim rounded-full" />
        </div>
      </div>
      <div className="px-5 mt-3 grid grid-cols-3 gap-2">
        {[
          { l: 'Görev', v: '0', s: 'tamamlandı' },
          { l: 'Seri', v: '0', s: 'gün' },
          { l: 'Öncü', v: '0', s: 'destek' },
        ].map((m) => (
          <div key={m.l} className="px-2 py-2.5 bg-[#FFFCF4] border border-ink/10 rounded-xl text-center">
            <div className="text-[8px] tracking-[0.12em] text-gold-dim uppercase">{m.l}</div>
            <div className="font-display text-[18px] font-medium my-0.5">{m.v}</div>
            <div className="text-[8px] text-ink/55">{m.s}</div>
          </div>
        ))}
      </div>
      <div className="px-5 mt-4 font-display text-[14px] font-medium">Rozetler</div>
      <div className="px-5 mt-2 grid grid-cols-4 gap-1.5">
        {[
          { fill: '#B89657', path: 'M8 4c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2zm6 4c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2zm-2 4c-2 0-3 1-3 3v5h6v-5c0-2-1-3-3-3z' },
          { fill: '#3B6D11', path: 'M12 3 C8 5 6 9 6 13 C6 17 8 20 12 21 C16 20 18 17 18 13 C18 9 16 5 12 3 Z' },
          { fill: '#A32D2D', path: 'M12 21 C12 21 4 16 4 10 C4 7 6 5 8 5 C10 5 11 6 12 8 C13 6 14 5 16 5 C18 5 20 7 20 10 C20 16 12 21 12 21 Z' },
        ].map((r, i) => (
          <div key={i} className="aspect-square rounded-xl bg-[#FFFCF4] border border-ink/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={r.fill}><path d={r.path} /></svg>
          </div>
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={`l-${i}`} className="aspect-square rounded-xl bg-cream border border-ink/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A89E8A" strokeWidth="1.5" opacity="0.5"><circle cx="12" cy="12" r="6" /></svg>
          </div>
        ))}
      </div>
      <BottomNav active="Profil" />
    </PhoneShell>
  )
}

/* PHONE 3 — Discover */
function PhoneDiscover() {
  return (
    <PhoneShell>
      <div className="px-5 pt-5">
        <h2 className="font-display text-[22px] leading-[1.1] tracking-[-0.02em] font-normal">
          Bugün <em className="italic text-gold-dim">iyi</em><br />yapacağın şey?
        </h2>
      </div>
      <div className="mx-5 mt-3.5 h-[30px] bg-[#FFFCF4] border border-ink/10 rounded-full px-3 flex items-center gap-2 text-[10px] text-ink/55">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="4.5" cy="4.5" r="3.5" /><line x1="7" y1="7" x2="10" y2="10" /></svg>
        Öncü, kategori veya şehir
      </div>
      <div className="px-5 mt-4 text-[9px] tracking-[0.14em] text-gold-dim uppercase">Öncülerden</div>
      <div className="px-5 font-display text-[16px] mt-1 font-medium tracking-[-0.01em]">Öncülerden Haberler</div>
      {[
        { bg: 'linear-gradient(135deg, #2a2118 0%, #4d3a23 100%)', pub: 'Kodluyoruz', dur: '5 dk', title: 'Mezunlarımızdan: "Kodlama Hayatımı Değiştirdi"' },
        { bg: 'linear-gradient(135deg, #4a6228 0%, #8aa547 100%)', pub: 'İBB', dur: '3 dk', title: 'İstanbul Parkları Çiçek Açıyor' },
        { bg: 'linear-gradient(135deg, #355322 0%, #6b8a45 100%)', pub: 'TEMA', dur: '3 dk', title: 'Kilyos Sahili Temizliği: 340 kg Atık Toplandı' },
      ].map((s, i) => (
        <div key={i} className={`mx-5 ${i === 0 ? 'mt-2.5' : 'mt-2.5'} bg-[#FFFCF4] border border-ink/10 rounded-2xl overflow-hidden ${i === 2 ? 'mb-20' : ''}`}>
          <div className="h-[70px]" style={{ background: s.bg }} />
          <div className="px-3 pt-2 flex items-center gap-1.5 text-[9px]">
            <span className="w-3 h-3 rounded-full bg-cream" />
            <span>{s.pub}</span>
            <span className="text-ink/55">· {s.dur}</span>
            <span className="ml-auto px-1.5 py-0.5 bg-gold/15 text-gold-dim rounded-full text-[7px] tracking-[0.08em]">HİKAYE</span>
          </div>
          <div className="px-3 pb-2.5 pt-1 font-display text-[12px] font-medium leading-tight tracking-[-0.01em]">
            {s.title}
          </div>
        </div>
      ))}
      <BottomNav active="Keşfet" />
    </PhoneShell>
  )
}

/* ═══════════ STK admin preview ═══════════ */
function AdminPreview() {
  return (
    <div className="lp-rp-9 bg-[#FAF3E0] border border-ink/10 rounded-3xl">
      <div className="bg-ink rounded-2xl p-5 text-cream text-[13px]">
        <div className="flex gap-3.5 border-b border-cream/12 pb-2.5 mb-3.5 text-[11px]">
          <span className="text-gold relative">Genel<span className="absolute -bottom-[11px] left-0 right-0 h-px bg-gold" /></span>
          <span className="text-cream/55">Görevler</span>
          <span className="text-cream/55">Üyeler</span>
          <span className="text-cream/55">Raporlar</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3.5">
          {[
            { v: '312', l: 'Aktif gönüllü' },
            { v: '48', l: 'Bu ay görev' },
            { v: '2.140', l: 'Saat katkı' },
          ].map((s) => (
            <div key={s.l} className="px-3 py-2.5 bg-cream/5 rounded-lg">
              <div className="font-display text-[20px] font-medium">{s.v}</div>
              <div className="text-[10px] text-cream/55 mt-px">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="text-[9px] tracking-[0.14em] text-cream/40 mb-2">SON GÖREVLER</div>
        {[
          { name: 'Sahil Temizliği — Kilyos', count: '12/15', live: true },
          { name: 'Bahçe Düzenleme — Cuma', count: '8/10', live: true },
          { name: 'Çocuk Atölyesi — Ekim', count: '—', live: false },
        ].map((r) => (
          <div key={r.name} className="px-3 py-2.5 bg-cream/4 rounded-lg flex items-center gap-2.5 text-[11px] mb-1">
            <span className="flex-1">{r.name}</span>
            <span className="text-[10px] text-cream/55">{r.count}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${r.live ? 'bg-[#97C45929] text-[#BDD9A0]' : 'bg-cream/10 text-cream/55'}`}>
              {r.live ? 'Yayında' : 'Taslak'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════ Sponsor preview ═══════════ */
function SponsorPreview() {
  return (
    <div className="lp-rmd:order-1 p-9 bg-[#FAF3E0] border border-ink/10 rounded-3xl">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink/55 mb-4">Pilot ortaklarımız</div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { src: '/garanti-bbva-logo.svg', alt: 'Garanti BBVA' },
          { src: '/trendyol-logo.svg', alt: 'Trendyol' },
          { src: '/ibb-logo.png', alt: 'İBB' },
        ].map((s) => (
          <div key={s.alt} className="aspect-[1.6/1] bg-[#FFFCF4] border border-ink/10 rounded-xl flex items-center justify-center p-3">
            <Image src={s.src} alt={s.alt} width={120} height={40} style={{ height: 'auto', maxHeight: '32px', width: 'auto', maxWidth: '90%' }} />
          </div>
        ))}
        {[1, 2, 3].map((i) => (
          <div key={`e-${i}`} className="aspect-[1.6/1] border border-dashed border-ink/20 rounded-xl flex items-center justify-center text-[12px] text-ink/40 italic font-display">
            + markanız
          </div>
        ))}
      </div>
      <div className="p-4 bg-cream rounded-xl font-display italic text-[14px] leading-[1.5] text-ink/75">
        İlk pilotta 4 haftada 1.200 çalışanımız 3.400 saat görev tamamladı. CSR yatırımı bir excel dosyası olmaktan çıktı.
        <span className="block mt-2.5 not-italic font-sans text-[11px] text-ink/55">— Garanti BBVA Sürdürülebilirlik Direktörü</span>
      </div>
    </div>
  )
}
