'use client'

/**
 * İyiBiri — Landing v5 (Vol-57 premium rebuild)
 *
 * 2026 best-in-class pattern'leri sentezleyen landing:
 *  - Animated mesh gradient hero (Stripe/Linear)
 *  - Word-by-word headline reveal (Framer/Apple)
 *  - Magnetic CTA buttons (Linear)
 *  - NGO infinite marquee (Vercel/Notion partner walls)
 *  - In-view animated counters (Stripe metrics)
 *  - Sticky-scroll mission storytelling (Apple iPhone showcase)
 *  - 5-tier butterfly metamorphosis sequential reveal (İyiBiri unique)
 *  - Bento grid features (Notion)
 *  - Testimonial carousel (Patreon/charity:water)
 *  - Spotlight final CTA (Linear)
 *
 * Tech: Framer Motion (zaten yüklü, ZERO yeni dep) + CSS keyframes (globals.css).
 * Asset: /public/ NGO + sponsor PNG/SVG, Fraunces + Plus Jakarta Sans variable fonts.
 * Tema: cream/gold/ink token sistemi (tailwind.config.ts) — landing kasıtlı LIGHT.
 *
 * Komponentler:
 *  - components/landing/mesh-gradient.tsx
 *  - components/landing/animated-counter.tsx
 *  - components/landing/magnetic.tsx
 *  - components/landing/marquee.tsx
 *  - components/landing/text-reveal.tsx
 */

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'

import { MeshGradient } from '@/components/landing/mesh-gradient'
import { AnimatedCounter } from '@/components/landing/animated-counter'
import { Magnetic, MagneticTilt } from '@/components/landing/magnetic'
import { Marquee } from '@/components/landing/marquee'
import { WordReveal } from '@/components/landing/text-reveal'

export default function LandingPage() {
  // Sticky nav scroll state
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-cream font-sans text-ink overflow-x-clip">
      <style dangerouslySetInnerHTML={{ __html: `
        html,body{overflow-y:auto!important;height:auto!important;scrollbar-width:thin;scrollbar-color:rgba(26,22,18,0.25) transparent}
        html::-webkit-scrollbar,body::-webkit-scrollbar{display:block!important;width:10px;height:10px}
        html::-webkit-scrollbar-track,body::-webkit-scrollbar-track{background:transparent}
        html::-webkit-scrollbar-thumb,body::-webkit-scrollbar-thumb{background:rgba(26,22,18,0.22);border-radius:5px;border:2px solid transparent;background-clip:content-box}
        html::-webkit-scrollbar-thumb:hover,body::-webkit-scrollbar-thumb:hover{background:rgba(26,22,18,0.4);background-clip:content-box}
        :root{--lp-gold:#B58F3D}
        .lp-ngo-logo{filter:grayscale(1) brightness(0.55) contrast(1.05);opacity:0.50;transition:filter .35s ease,opacity .35s ease}
        .lp-ngo-logo:hover{filter:grayscale(0) brightness(1);opacity:1}
        .lp-grid-pattern{background-image:linear-gradient(to right,rgba(26,22,18,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(26,22,18,0.04) 1px,transparent 1px);background-size:64px 64px}
      `}} />

      {/* ════════════ NAV ════════════ */}
      <motion.nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          backdropFilter: scrolled ? 'blur(14px) saturate(180%)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(180%)' : 'blur(0px)',
          background: scrolled ? 'rgba(244,238,223,0.78)' : 'transparent',
          borderBottom: scrolled ? '0.5px solid rgba(26,22,18,0.10)' : '0.5px solid transparent',
        }}
      >
        <div className="mx-auto max-w-[1200px] px-7 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-baseline font-display text-[22px] tracking-tight">
            <span className="font-medium">İyi</span>
            <span className="italic text-gold-dim font-normal">Biri</span>
          </Link>
          <div className="hidden md:flex gap-9 text-[14px] text-ink/75">
            {['Ürün', 'Karma', "STK'lar", 'Sponsorlar'].map((label, i) => (
              <Link
                key={label}
                href={['#urun', '#karma', '#stk', '#sponsor'][i]}
                className="relative group transition-colors hover:text-ink"
              >
                {label}
                <span className="absolute left-0 right-0 -bottom-1 h-px bg-gold-dim origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
              </Link>
            ))}
          </div>
          <Magnetic>
            <Link
              href="/auth/signin"
              className="rounded-full bg-ink text-cream text-[13px] font-medium px-5 py-2.5 hover:bg-ink/90 transition-colors"
            >
              Giriş yap
            </Link>
          </Magnetic>
        </div>
      </motion.nav>

      {/* ════════════ HERO ════════════ */}
      <Hero />

      {/* ════════════ NGO MARQUEE ════════════ */}
      <NgoMarquee />

      {/* ════════════ ANIMATED STATS ════════════ */}
      <Stats />

      {/* ════════════ STICKY-SCROLL MISSION SHOWCASE ════════════ */}
      <MissionShowcase />

      {/* ════════════ KARMA TIER METAMORPHOSIS ════════════ */}
      <TierJourney />

      {/* ════════════ BENTO FEATURES ════════════ */}
      <BentoFeatures />

      {/* ════════════ STK SECTION ════════════ */}
      <StkSection />

      {/* ════════════ SPONSOR SECTION ════════════ */}
      <SponsorSection />

      {/* ════════════ TESTIMONIALS ════════════ */}
      <Testimonials />

      {/* ════════════ FINAL CTA ════════════ */}
      <FinalCta />

      {/* ════════════ FOOTER ════════════ */}
      <Footer />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
 * HERO
 * ═══════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Hero phone parallax (yukarı doğru kayar — depth illusion)
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [0, -4])

  return (
    <section ref={ref} className="relative">
      <MeshGradient intensity="gold" />
      {/* Subtle grid */}
      <div className="absolute inset-0 lp-grid-pattern opacity-[0.5] pointer-events-none" />

      <div className="relative mx-auto max-w-[1200px] px-7 pt-20 pb-32 md:pt-28 md:pb-40 grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        {/* Left: text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-gold-dim mb-7"
          >
            <span className="w-4 h-px bg-gold-dim" />
            Mahalleden büyüyen iyilik
          </motion.div>

          <h1 className="font-display font-normal leading-[0.96] tracking-[-0.035em] text-ink text-[64px] md:text-[88px] lg:text-[108px] mb-7">
            <WordReveal text="İyilik" delay={0.15} />{' '}
            <WordReveal text="biriktirilir." emphasis={[0]} delay={0.55} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-[18px] leading-[1.55] text-ink/70 max-w-[520px] mb-10"
          >
            Türkiye&apos;nin sivil toplum kuruluşlarıyla, gerçek görevlerle, gerçek katkıyla.
            Bir saat de versen, bir gün de — hepsi birikiyor.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15 }}
            className="flex flex-wrap gap-3 items-center mb-12"
          >
            <Magnetic>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-ink text-cream rounded-xl text-[14px] font-medium hover:bg-ink/90 transition-colors shadow-lg shadow-ink/15"
              >
                <AppleIcon />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] tracking-wider opacity-70">İNDİR</span>
                  <span className="block text-[15px] font-medium">App Store</span>
                </span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-ink text-cream rounded-xl text-[14px] font-medium hover:bg-ink/90 transition-colors shadow-lg shadow-ink/15"
              >
                <PlayIcon />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] tracking-wider opacity-70">İNDİR</span>
                  <span className="block text-[15px] font-medium">Google Play</span>
                </span>
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-wrap items-center gap-4 text-[13px] text-ink/60"
          >
            <span className="inline-flex items-center gap-2">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              <span>
                <b className="font-medium text-ink">
                  <AnimatedCounter to={1380} duration={1600} /> kişi
                </b>{' '}
                şu an gönüllü
              </span>
            </span>
            <span className="text-ink/40">·</span>
            <span><AnimatedCounter to={248} duration={1400} /> STK ortağı</span>
            <span className="text-ink/40">·</span>
            <span><AnimatedCounter to={62103} duration={2000} /> görev</span>
          </motion.div>
        </div>

        {/* Right: parallax phone */}
        <motion.div
          style={{ y: phoneY, rotate: phoneRotate }}
          className="flex justify-center md:justify-end relative"
        >
          {/* Glow halo behind phone */}
          <div
            aria-hidden
            className="absolute inset-0 -m-12 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(232,194,104,0.35), transparent 60%)',
              filter: 'blur(40px)',
            }}
          />
          <div className="relative animate-float">
            <PhoneMission />
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[10px] tracking-[0.18em] text-ink/40"
      >
        <span>KAYDIR</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-6 bg-ink/30"
        />
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
 * NGO MARQUEE
 * ═══════════════════════════════════════════════════════════ */
function NgoMarquee() {
  const all = [...NGO_LOGOS, ...NGO_LOGOS]
  return (
    <section className="border-y border-ink/10 py-10 bg-cream/60">
      <p className="text-center text-[11px] uppercase tracking-[0.18em] text-ink/50 mb-6 px-7">
        9 sivil toplum kuruluşu &middot; 6 marka ortağı &middot; 81 şehir
      </p>
      <Marquee speed={45}>
        {all.map((n, i) => (
          <div
            key={`${n.src}-${i}`}
            className="flex items-center justify-center shrink-0 h-12"
          >
            <Image
              src={n.src}
              alt={n.alt}
              width={n.w}
              height={n.h}
              className="lp-ngo-logo"
              style={{ height: '34px', width: 'auto' }}
            />
          </div>
        ))}
      </Marquee>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
 * STATS
 * ═══════════════════════════════════════════════════════════ */
function Stats() {
  return (
    <section className="py-24 border-b border-ink/10 bg-gradient-to-b from-cream to-cream/40">
      <div className="mx-auto max-w-[1200px] px-7">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-gold-dim mb-3">
            <span className="w-4 h-px bg-gold-dim" />
            Bugüne kadar
            <span className="w-4 h-px bg-gold-dim" />
          </div>
          <h2 className="font-display text-[40px] md:text-[56px] tracking-[-0.025em] leading-[1.05] max-w-[680px] mx-auto">
            Birikiyor &mdash; <em className="italic text-gold-dim">birlikte</em>.
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`px-6 ${i > 0 ? 'md:border-l border-ink/10' : ''}`}
            >
              <div className="font-display font-medium tracking-[-0.025em] leading-none text-[44px] md:text-[64px] mb-2 text-ink">
                <AnimatedCounter to={s.value} duration={2000} suffix={s.suffix ?? ''} />
              </div>
              <div className="text-[12px] text-ink/55 tracking-wide uppercase letter-spacing-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
 * STICKY-SCROLL MISSION SHOWCASE
 * Apple-style: phone sticky, content scrolls past
 * ═══════════════════════════════════════════════════════════ */
function MissionShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const stages = [
    {
      eyebrow: '01 · KEŞFET',
      title: 'Bir görev seç.',
      sub: 'Mahallenden, ilgi alanından, takvimine göre. Üye olduğun STK\'larınkiler önce.',
    },
    {
      eyebrow: '02 · BAŞVUR',
      title: 'Bir tıkla katıl.',
      sub: 'STK 24 saatte onaylar. Gerekiyorsa SMS ile detay yollar.',
    },
    {
      eyebrow: '03 · YAP',
      title: 'Konumda check-in.',
      sub: 'QR ile giriş, fotoğraf veya STK onayı ile tamamla.',
    },
    {
      eyebrow: '04 · BİRİKTİR',
      title: 'Karman büyür.',
      sub: 'Her görev hikâyene yazılır. Rütben yükselir, rozetler açılır.',
    },
  ]

  return (
    <section
      id="urun"
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-b from-cream/40 to-[#EBE0C5]"
    >
      <div className="mx-auto max-w-[1200px] px-7">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-20 max-w-[680px]"
        >
          <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-gold-dim mb-4">
            <span className="w-4 h-px bg-gold-dim" />
            Ürün
          </div>
          <h2 className="font-display font-normal leading-[1.0] tracking-[-0.03em] text-[44px] md:text-[68px] mb-5">
            Cebinde bir <em className="italic text-gold-dim">iyilik defteri.</em>
          </h2>
          <p className="text-[18px] leading-[1.6] text-ink/65 max-w-[560px]">
            Görev bul, başvur, yap — sade dört adım. Tüm hikâye telefonunda.
          </p>
        </motion.div>

        {/* Sticky scroll layout */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: stages */}
          <div className="flex flex-col gap-32 md:gap-44 md:py-24">
            {stages.map((s, i) => (
              <motion.div
                key={s.eyebrow}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30%' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="text-[11px] tracking-[0.22em] text-gold-dim mb-3">
                  {s.eyebrow}
                </div>
                <h3 className="font-display text-[34px] md:text-[44px] leading-[1.1] tracking-[-0.025em] mb-4">
                  {s.title}
                </h3>
                <p className="text-[16px] text-ink/65 leading-[1.55] max-w-[420px]">
                  {s.sub}
                </p>
                {/* Step number watermark */}
                <span
                  className="absolute -left-2 -top-8 font-display italic text-[140px] leading-none text-gold-dim/[0.08] pointer-events-none select-none"
                  aria-hidden
                >
                  {i + 1}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Right: sticky phone (changes content based on scroll) */}
          <div className="md:sticky md:top-24 md:h-[600px] flex items-center justify-center">
            <StickyMissionPhone progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* StickyMissionPhone — single phone whose inner content morphs with scroll */
function StickyMissionPhone({ progress }: { progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      // 4 stage between scroll 0.15 → 0.85
      const norm = Math.max(0, Math.min(1, (v - 0.15) / 0.7))
      setStage(Math.min(3, Math.floor(norm * 4)))
    })
    return () => unsub()
  }, [progress])

  return (
    <div className="relative animate-float">
      <div
        aria-hidden
        className="absolute inset-0 -m-12 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(232,194,104,0.30), transparent 60%)',
          filter: 'blur(40px)',
        }}
      />
      <PhoneShell>
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div key="discover" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              <PhoneDiscoverInner />
            </motion.div>
          )}
          {stage === 1 && (
            <motion.div key="apply" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              <PhoneMissionInner />
            </motion.div>
          )}
          {stage === 2 && (
            <motion.div key="checkin" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              <PhoneCheckinInner />
            </motion.div>
          )}
          {stage === 3 && (
            <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              <PhoneProfileInner />
            </motion.div>
          )}
        </AnimatePresence>
        <BottomNav active={['Anasayfa', 'Görevler', 'Görevler', 'Profil'][stage]} />
      </PhoneShell>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
 * KARMA TIER METAMORPHOSIS
 * ═══════════════════════════════════════════════════════════ */
function TierJourney() {
  return (
    <section id="karma" className="py-32 relative overflow-hidden">
      <MeshGradient intensity="soft" />
      <div className="relative mx-auto max-w-[1200px] px-7 grid md:grid-cols-[0.9fr_1.1fr] gap-16 lg:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-gold-dim mb-4">
            <span className="w-4 h-px bg-gold-dim" />
            Karma yolculuğu
          </div>
          <h2 className="font-display font-normal leading-[1.04] tracking-[-0.03em] text-[44px] md:text-[60px] mb-6">
            Beş aşama, <em className="italic text-gold-dim">tek defter.</em>
          </h2>
          <p className="text-[17px] leading-[1.6] text-ink/70 mb-3.5 max-w-[480px]">
            Her görev seni bir sonraki aşamaya yaklaştırır. Çiçeklenir, yapraklanır, kök salarsın.
            Ne yarış ne ego — sade bir defter.
          </p>
          <p className="text-[17px] leading-[1.6] text-ink/70 max-w-[480px]">
            Senin defterin.
          </p>
        </motion.div>

        {/* Tier ladder with butterflies + stagger */}
        <div className="flex flex-col gap-3">
          {TIERS.map((t, i) => (
            <TierRow key={t.name} tier={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TierRow({ tier, index }: { tier: typeof TIERS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center gap-5 px-6 py-5 rounded-2xl border transition-all ${
        tier.you
          ? 'bg-[#FFF8E5] border-gold-dim/40 shadow-[0_8px_24px_-12px_rgba(181,143,61,0.3)]'
          : 'bg-[#FAF3E0] border-ink/10'
      }`}
    >
      <span
        className="w-12 h-12 rounded-full shrink-0 shadow-inner"
        style={{ background: tier.color }}
      />
      <div className="flex-1">
        <div className="font-display font-medium text-[20px] tracking-[-0.015em]">
          {tier.name}
          {tier.you && (
            <em className="ml-2 not-italic text-[11px] font-sans text-gold-dim italic">· yakında</em>
          )}
        </div>
        <div className="text-[12px] text-ink/55">{tier.tag}</div>
      </div>
      <span className="font-display text-[15px] text-ink/60 shrink-0">{tier.karma}</span>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
 * BENTO GRID FEATURES
 * ═══════════════════════════════════════════════════════════ */
function BentoFeatures() {
  return (
    <section className="py-32 bg-gradient-to-b from-cream to-[#EBE0C5]">
      <div className="mx-auto max-w-[1200px] px-7">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-[680px] mx-auto"
        >
          <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-gold-dim mb-4">
            <span className="w-4 h-px bg-gold-dim" />
            Neler var
            <span className="w-4 h-px bg-gold-dim" />
          </div>
          <h2 className="font-display text-[40px] md:text-[56px] tracking-[-0.025em] leading-[1.05]">
            İyiliğin tüm <em className="italic text-gold-dim">altyapısı.</em>
          </h2>
        </motion.div>
        <div className="grid grid-cols-12 gap-4 md:gap-5">
          {BENTO_ITEMS.map((b, i) => (
            <BentoCard key={b.title} item={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BentoCard({ item, index }: { item: typeof BENTO_ITEMS[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`${item.span} group`}
    >
      <MagneticTilt strength={4}>
        <div className="h-full rounded-3xl border border-ink/10 bg-[#FFFCF4] p-7 md:p-8 relative overflow-hidden transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(26,22,18,0.18)]">
          {/* Decorative gradient */}
          <div
            aria-hidden
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 group-hover:opacity-60 transition-opacity"
            style={{ background: item.glow }}
          />
          <div className="relative">
            <div className="text-[11px] tracking-[0.18em] uppercase text-gold-dim mb-3">
              {item.eyebrow}
            </div>
            <h3 className="font-display text-[24px] md:text-[28px] tracking-[-0.02em] leading-[1.15] mb-3">
              {item.title}
            </h3>
            <p className="text-[14px] text-ink/65 leading-[1.55] max-w-[340px]">
              {item.desc}
            </p>
          </div>
          {item.visual && (
            <div className="mt-6 relative">{item.visual}</div>
          )}
        </div>
      </MagneticTilt>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
 * STK SECTION
 * ═══════════════════════════════════════════════════════════ */
function StkSection() {
  return (
    <section id="stk" className="py-32 bg-[#EBE0C5]">
      <div className="mx-auto max-w-[1200px] px-7 grid md:grid-cols-2 gap-16 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-gold-dim mb-4">
            <span className="w-4 h-px bg-gold-dim" />
            STK&apos;lar için
          </div>
          <h2 className="font-display font-normal leading-[1.05] tracking-[-0.025em] text-[40px] md:text-[52px] mb-5">
            Topluluğunuzu <em className="italic text-gold-dim">seferber</em> edin.
          </h2>
          <p className="text-[17px] leading-[1.55] text-ink/70 mb-8 max-w-[480px]">
            Görev yayınlayın, gönüllüleri davet edin, doğrulayın. Tek panel, sade akış.
          </p>
          <div className="flex flex-col gap-3.5 mb-9">
            {STK_FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="font-display text-[14px] text-gold-dim min-w-[28px] pt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px] leading-[1.55] text-ink/75">
                  <b className="font-medium text-ink">{f.label}</b> {f.text}
                </span>
              </motion.div>
            ))}
          </div>
          <Magnetic>
            <Link
              href="mailto:stk@iyibiri.app"
              className="inline-flex items-center gap-2 px-5 py-3 border border-ink rounded-full text-[14px] font-medium hover:bg-ink hover:text-cream transition-colors"
            >
              Demo isteyin
              <span>→</span>
            </Link>
          </Magnetic>
        </motion.div>
        <AdminPreview />
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
 * SPONSOR SECTION
 * ═══════════════════════════════════════════════════════════ */
function SponsorSection() {
  return (
    <section id="sponsor" className="py-32 bg-cream relative overflow-hidden">
      <MeshGradient intensity="soft" />
      <div className="relative mx-auto max-w-[1200px] px-7 grid md:grid-cols-2 gap-16 lg:gap-20 items-center">
        <SponsorPreview />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="md:order-2"
        >
          <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-gold-dim mb-4">
            <span className="w-4 h-px bg-gold-dim" />
            Markalar için
          </div>
          <h2 className="font-display font-normal leading-[1.05] tracking-[-0.025em] text-[40px] md:text-[52px] mb-5">
            İyilik <em className="italic text-gold-dim">marka</em> hikâyenize dokunsun.
          </h2>
          <p className="text-[17px] leading-[1.55] text-ink/70 mb-8 max-w-[480px]">
            CSR bütçesini gerçek aksiyona bağlayan bir mecra. Bir kampanya, bir görev seti, bir sponsorluk &mdash; şeffaf raporla.
          </p>
          <div className="flex flex-col gap-3.5 mb-9">
            {SPONSOR_FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="font-display text-[14px] text-gold-dim min-w-[28px] pt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px] leading-[1.55] text-ink/75">
                  <b className="font-medium text-ink">{f.label}</b> {f.text}
                </span>
              </motion.div>
            ))}
          </div>
          <Magnetic>
            <Link
              href="mailto:sponsor@iyibiri.app"
              className="inline-flex items-center gap-2 px-5 py-3 border border-ink rounded-full text-[14px] font-medium hover:bg-ink hover:text-cream transition-colors"
            >
              Konuşalım
              <span>→</span>
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
 * TESTIMONIALS
 * ═══════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section className="py-32 bg-[#1A1612] text-cream relative overflow-hidden">
      {/* Subtle gold radial */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(232,194,104,0.12), transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-7">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-[680px] mx-auto"
        >
          <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-gold mb-4">
            <span className="w-4 h-px bg-gold" />
            Sesleri
            <span className="w-4 h-px bg-gold" />
          </div>
          <h2 className="font-display text-[40px] md:text-[56px] tracking-[-0.025em] leading-[1.05] text-cream">
            Defterlerinden <em className="italic text-gold">birer satır.</em>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl p-7 md:p-8 bg-white/[0.04] border border-white/[0.08] hover:border-gold/30 transition-colors backdrop-blur"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#E8C268">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="font-display italic text-[18px] leading-[1.5] text-cream/90 mb-7">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display text-[15px] text-ink"
                  style={{ background: t.color }}
                >
                  {t.author[0]}
                </div>
                <div>
                  <div className="text-[14px] font-medium">{t.author}</div>
                  <div className="text-[12px] text-cream/55">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
 * FINAL CTA — Spotlight
 * ═══════════════════════════════════════════════════════════ */
function FinalCta() {
  return (
    <section className="py-40 text-center relative overflow-hidden">
      {/* Spotlight gold halo */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none animate-spotlight"
        style={{
          background:
            'radial-gradient(circle at center, rgba(232,194,104,0.40), transparent 60%)',
          filter: 'blur(50px)',
        }}
      />
      <div className="relative mx-auto max-w-[800px] px-7">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="font-display font-normal leading-[0.95] tracking-[-0.04em] text-[64px] md:text-[112px] mb-7"
        >
          Bugün <em className="italic text-gold-dim">bir iyilik</em> birik.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-[18px] text-ink/65 max-w-[520px] mx-auto mb-11 leading-[1.55]"
        >
          Mahallenden başla. Karma birikir, hikâyen büyür.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex flex-wrap justify-center gap-3"
        >
          <Magnetic>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-ink text-cream rounded-xl text-[14px] font-medium hover:bg-ink/90 transition-colors shadow-xl shadow-ink/20"
            >
              <AppleIcon />
              <span className="text-left leading-tight">
                <span className="block text-[10px] tracking-wider opacity-70">İNDİR</span>
                <span className="block text-[15px] font-medium">App Store</span>
              </span>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-ink text-cream rounded-xl text-[14px] font-medium hover:bg-ink/90 transition-colors shadow-xl shadow-ink/20"
            >
              <PlayIcon />
              <span className="text-left leading-tight">
                <span className="block text-[10px] tracking-wider opacity-70">İNDİR</span>
                <span className="block text-[15px] font-medium">Google Play</span>
              </span>
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
 * FOOTER
 * ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="py-14 border-t border-ink/10 bg-cream">
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
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-[14px] text-ink/70 hover:text-gold-dim transition-colors"
                  >
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
  )
}

/* ═══════════════════════════════════════════════════════════
 * DATA
 * ═══════════════════════════════════════════════════════════ */

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

const STATS: { value: number; label: string; suffix?: string }[] = [
  { value: 18247, label: 'Aktif gönüllü' },
  { value: 248, label: 'STK ortağı' },
  { value: 62103, label: 'Tamamlanan görev' },
  { value: 81, label: 'Şehir', suffix: ' / 81' },
]

const TIERS = [
  { name: 'İyi Biri',         karma: '0+',       tag: 'Başlangıç hediyesi 100 karma',  color: '#E0D6C0', you: false },
  { name: 'Çok İyi Biri',     karma: '500+',     tag: 'İlk birikim eşiği — yapraklanmaya hazır', color: 'radial-gradient(circle at 30% 30%, #F4D98A, #B58F3D)', you: true },
  { name: 'Yapraklanan',      karma: '2.000+',   tag: 'Aylık görev sürekliliği',       color: '#C5D5A8', you: false },
  { name: 'Çiçeklenen',       karma: '5.000+',   tag: 'Topluluğun gönüllü çekirdeği',   color: '#9FC18B', you: false },
  { name: 'Çınar',            karma: '15.000+',  tag: 'Bölgesel öncülük — kalıcı eser', color: 'radial-gradient(circle at 30% 30%, #4A3A22, #1A1612)', you: false },
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
  { title: 'Ürün', links: [{ label: 'İndir', href: '/auth/signin' }, { label: 'Karma sistemi', href: '#karma' }, { label: 'Yenilikler', href: '#' }] },
  { title: 'Topluluk', links: [{ label: "STK'lar", href: '#stk' }, { label: 'Sponsorlar', href: '#sponsor' }, { label: 'Blog', href: '#' }] },
  { title: 'İletişim', links: [{ label: 'hello@iyibiri.app', href: 'mailto:hello@iyibiri.app' }, { label: 'KVKK', href: '#' }, { label: 'Şartlar', href: '#' }] },
]

const TESTIMONIALS = [
  {
    quote: 'İlk haftada 12 saat verdim, üç komşumla tanıştım. Karma değil, hayat birikiyor.',
    author: 'Selin K.',
    role: 'Gönüllü · İstanbul',
    color: '#F4D98A',
  },
  {
    quote: 'Üye toplama, görev planlama, raporlama — hepsi bir panelde. Excel\'den çıktık.',
    author: 'Mehmet A.',
    role: 'TEMA Vakfı · Operasyon',
    color: '#C5D5A8',
  },
  {
    quote: 'CSR bütçemizi 8 ay içinde 4 kat etki ile dağıttık. Şeffaflık paha biçilmez.',
    author: 'Ayşe Y.',
    role: 'Garanti BBVA · Sürdürülebilirlik',
    color: '#E9CFC2',
  },
]

const BENTO_ITEMS = [
  {
    eyebrow: 'Görev keşfi',
    title: 'Sana göre,\nyakınında.',
    desc: 'İlgi alanın, şehrin, takvimin — algoritma yerine senin tercihin.',
    span: 'col-span-12 md:col-span-7 row-span-2',
    glow: 'radial-gradient(circle at center, rgba(232,194,104,0.4), transparent 70%)',
    visual: <BentoMissionVisual />,
  },
  {
    eyebrow: 'Karma',
    title: 'Birikiyor,\nyazılıyor.',
    desc: 'Her görev defterine geçer.',
    span: 'col-span-12 md:col-span-5',
    glow: 'radial-gradient(circle at center, rgba(196,203,172,0.45), transparent 70%)',
    visual: <BentoKarmaVisual />,
  },
  {
    eyebrow: 'Topluluk',
    title: 'STK\'lar yanında.',
    desc: '9+ öncü, 81 şehirde aktif.',
    span: 'col-span-12 md:col-span-5',
    glow: 'radial-gradient(circle at center, rgba(200,85,61,0.32), transparent 70%)',
    visual: <BentoNgoVisual />,
  },
  {
    eyebrow: 'Sponsorlar',
    title: 'Markaların\netki ortaklığı.',
    desc: 'Starbucks, Migros, Garanti BBVA — gerçek aksiyon, şeffaf rapor.',
    span: 'col-span-12 md:col-span-7',
    glow: 'radial-gradient(circle at center, rgba(232,194,104,0.30), transparent 70%)',
    visual: <BentoSponsorVisual />,
  },
  {
    eyebrow: 'Bağış',
    title: 'Bir tıkla, doğrudan.',
    desc: 'STK\'nın kendi altyapısı, biz ortada değiliz.',
    span: 'col-span-12 md:col-span-4',
    glow: 'radial-gradient(circle at center, rgba(232,194,104,0.32), transparent 70%)',
  },
  {
    eyebrow: 'Etki',
    title: 'Görünür\nve sayılabilir.',
    desc: 'Kaç kişi, kaç saat, kaç ton — her ay.',
    span: 'col-span-12 md:col-span-4',
    glow: 'radial-gradient(circle at center, rgba(196,203,172,0.35), transparent 70%)',
  },
  {
    eyebrow: 'Hikâye',
    title: 'Defterin senin.',
    desc: 'Yarış değil, izlek.',
    span: 'col-span-12 md:col-span-4',
    glow: 'radial-gradient(circle at center, rgba(233,207,194,0.45), transparent 70%)',
  },
]

/* ═══════════════════════════════════════════════════════════
 * BENTO VISUALS
 * ═══════════════════════════════════════════════════════════ */

function BentoMissionVisual() {
  return (
    <div className="relative h-[180px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#355322] to-[#6b8a45]">
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <span className="inline-block w-fit text-[10px] text-cream px-2.5 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 mb-2">Çevre</span>
        <h4 className="font-display text-[22px] text-cream tracking-[-0.02em] leading-[1.1]">Sahil Temizliği</h4>
        <div className="text-[11px] text-cream/80 mt-1 flex gap-2">
          <span>Kilyos</span><span>·</span><span>Cumartesi 09:00</span><span>·</span><span>+60 karma</span>
        </div>
      </div>
    </div>
  )
}

function BentoKarmaVisual() {
  return (
    <div className="mt-6 px-5 py-4 bg-cream rounded-2xl border border-ink/10">
      <div className="flex items-baseline gap-2">
        <span className="w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, #E8C268, #8A6420)' }} />
        <span className="font-display text-[40px] font-medium tracking-[-0.025em]">
          <AnimatedCounter to={1240} duration={1800} />
        </span>
        <span className="text-[12px] text-ink/55">karma</span>
      </div>
      <div className="mt-2 h-1.5 bg-ink/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '62%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-gold-dim rounded-full"
        />
      </div>
      <div className="text-[10px] text-ink/55 mt-2">Yapraklanan&apos;a 760 karma</div>
    </div>
  )
}

function BentoNgoVisual() {
  const logos = NGO_LOGOS.slice(0, 6)
  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      {logos.map((l) => (
        <div key={l.src} className="aspect-[1.6/1] bg-cream border border-ink/10 rounded-xl flex items-center justify-center p-2">
          <Image src={l.src} alt={l.alt} width={80} height={28} style={{ height: 'auto', maxHeight: '24px', width: 'auto', maxWidth: '80%', filter: 'grayscale(0.3)' }} />
        </div>
      ))}
    </div>
  )
}

function BentoSponsorVisual() {
  const logos = [
    { src: '/sponsors/starbucks.png', alt: 'Starbucks' },
    { src: '/sponsors/migros.png', alt: 'Migros' },
    { src: '/sponsors/nike.png', alt: 'Nike' },
    { src: '/sponsors/garanti-bbva.png', alt: 'Garanti BBVA' },
    { src: '/sponsors/trendyolgo.png', alt: 'Trendyol Go' },
  ]
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {logos.map((s) => (
        <div key={s.src} className="h-12 px-4 bg-cream border border-ink/10 rounded-xl flex items-center">
          <Image src={s.src} alt={s.alt} width={80} height={28} style={{ height: 'auto', maxHeight: '22px', width: 'auto' }} />
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
 * PHONE COMPONENTS — shared shells & inner contents
 * ═══════════════════════════════════════════════════════════ */

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-ink rounded-[44px] p-2 shadow-[0_30px_80px_-20px_rgba(26,22,18,0.35),0_8px_24px_-8px_rgba(26,22,18,0.18)]"
      style={{ width: 280 }}
    >
      <div className="bg-cream rounded-[36px] overflow-hidden relative" style={{ width: 264, height: 540 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[84px] h-[22px] bg-ink rounded-b-[14px] z-10" />
        <div className="px-6 pt-3.5 flex justify-between items-center text-[11px] font-semibold">
          <span>9:41</span>
          <span className="inline-flex items-center gap-1">
            <svg width="14" height="9" viewBox="0 0 18 11" fill="currentColor"><path d="M0 9V2h2v7zM4 9V0h2v9zM8 9V4h2v5zM12 9V6h2v3z" /></svg>
            <svg width="13" height="9" viewBox="0 0 13 9" fill="none" stroke="currentColor" strokeWidth="0.7"><rect x="0.5" y="0.5" width="10" height="8" rx="1.5" /><rect x="2" y="2" width="6.5" height="5" fill="currentColor" /><rect x="11" y="2.5" width="1.2" height="4" rx="0.5" fill="currentColor" /></svg>
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

function BottomNav({ active = 'Görevler' }: { active?: string }) {
  const items = [
    { name: 'Anasayfa', icon: <path d="M3 8 L9 3 L15 8 V15 H3 Z" /> },
    { name: 'Görevler', icon: <path d="M3 5 L7 9 L15 1 M3 13 L7 17 L9 15" /> },
    { name: 'Bağış', icon: <path d="M9 16 C9 16 1 11 1 6 C1 4 3 2 5 2 C7 2 8 3 9 4 C10 3 11 2 13 2 C15 2 17 4 17 6 C17 11 9 16 9 16 Z" /> },
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

/* ── Hero phone (reused from previous landing) ── */
function PhoneMission() {
  return (
    <PhoneShell>
      <PhoneMissionInner />
      <BottomNav active="Görevler" />
    </PhoneShell>
  )
}

function PhoneMissionInner() {
  return (
    <>
      <div
        className="relative h-[200px] mt-3"
        style={{
          background:
            'linear-gradient(140deg, #1f3818 0%, #355322 30%, #6b8a45 70%, #c9b878 100%)',
        }}
      >
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
          <div className="text-[10px] text-ink/55 mt-0.5">TEMA Vakfı 24 saat içinde yanıtlayacak.</div>
        </div>
      </div>
      <div className="px-5 mt-4 text-[9px] tracking-[0.14em] text-gold-dim uppercase">Sırada Ne Var</div>
      {[
        { n: 1, active: true, t1: 'TEMA Vakfı onayı', t2: '24 saat içinde katılımını onaylar' },
        { n: 2, active: false, t1: 'Hazırlık SMS\'i', t2: 'Görev öncesi buluşma detayı SMS ile' },
        { n: 3, active: false, t1: 'Görev günü check-in', t2: 'QR ile giriş yap' },
      ].map((s) => (
        <div key={s.n} className="px-5 py-2 flex items-start gap-3">
          <div
            className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold ${
              s.active ? 'bg-gold-dim text-white' : 'bg-cream border border-ink/10 text-ink/55'
            }`}
          >
            {s.n}
          </div>
          <div>
            <div className="text-[11px] font-semibold leading-tight">{s.t1}</div>
            <div className="text-[9px] text-ink/55 mt-0.5">{s.t2}</div>
          </div>
        </div>
      ))}
    </>
  )
}

function PhoneDiscoverInner() {
  return (
    <>
      <div className="px-5 pt-5">
        <h2 className="font-display text-[22px] leading-[1.1] tracking-[-0.02em] font-normal">
          Bugün <em className="italic text-gold-dim">iyi</em>
          <br />yapacağın şey?
        </h2>
      </div>
      <div className="mx-5 mt-3.5 h-[30px] bg-[#FFFCF4] border border-ink/10 rounded-full px-3 flex items-center gap-2 text-[10px] text-ink/55">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="4.5" cy="4.5" r="3.5" /><line x1="7" y1="7" x2="10" y2="10" /></svg>
        Öncü, kategori veya şehir
      </div>
      <div className="px-5 mt-4 text-[9px] tracking-[0.14em] text-gold-dim uppercase">Senin için</div>
      {[
        { color: '#6b8a45', cat: 'Çevre', title: 'Sahil Temizliği', meta: 'Kilyos · Cumartesi · +60' },
        { color: '#4A6FA5', cat: 'Eğitim', title: 'Hafta Sonu Mentörlüğü', meta: 'Online · 2 saat · +40' },
        { color: '#C8553D', cat: 'Hayvanlar', title: 'Mama Dağıtımı', meta: 'Beşiktaş · Pazar · +30' },
      ].map((m, i) => (
        <div key={i} className="mx-5 mt-2 p-2.5 bg-[#FFFCF4] border border-ink/10 rounded-xl flex gap-2.5 items-center">
          <div className="w-12 h-12 rounded-lg shrink-0" style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}aa)` }} />
          <div className="min-w-0 flex-1">
            <div className="text-[8px] tracking-[0.12em] uppercase font-semibold" style={{ color: m.color }}>{m.cat}</div>
            <div className="text-[12px] font-semibold leading-tight truncate">{m.title}</div>
            <div className="text-[9px] text-ink/55 mt-0.5 truncate">{m.meta}</div>
          </div>
        </div>
      ))}
    </>
  )
}

function PhoneCheckinInner() {
  return (
    <>
      <div className="px-5 pt-4 text-[10px] tracking-[0.14em] text-gold-dim uppercase">Görev Günü</div>
      <h2 className="px-5 mt-1 font-display text-[20px] leading-[1.1] tracking-[-0.02em]">
        Sahil Temizliği
      </h2>
      <div className="px-5 mt-1 text-[10px] text-ink/55">Kilyos Sahili · Cumartesi 09:00</div>
      <div className="mx-5 mt-5 p-5 bg-[#FFFCF4] border border-ink/10 rounded-2xl text-center">
        <div className="text-[10px] tracking-[0.14em] uppercase text-gold-dim mb-3">Katılım Kodu</div>
        <div className="font-display text-[36px] font-bold tracking-wider text-gold-dim leading-none">K7-3921</div>
        <div className="text-[10px] text-ink/55 mt-3">TEMA Vakfı sorumlusu kontrol edecek</div>
      </div>
      <div className="mx-5 mt-3 px-3.5 py-2.5 bg-[#FFFCF4] border border-ink/10 rounded-xl flex items-center justify-between">
        <div>
          <div className="text-[9px] tracking-[0.12em] uppercase text-gold-dim">Buluşma</div>
          <div className="text-[12px] font-semibold mt-0.5">Kilyos Sahili · 09:30</div>
        </div>
        <div className="text-[10px] px-2.5 py-1 border border-ink/15 rounded-full">Harita</div>
      </div>
      <div className="mx-5 mt-3 py-3 bg-gold-dim rounded-xl text-center text-[13px] font-semibold text-white">
        QR ile check-in yap
      </div>
    </>
  )
}

function PhoneProfileInner() {
  return (
    <>
      <div className="px-5 pt-5 flex justify-between">
        <div className="w-[30px] h-[30px] rounded-full bg-ink/6 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="7" cy="7" r="2" /><path d="M7 1 V3 M7 11 V13 M1 7 H3 M11 7 H13" /></svg>
        </div>
        <div className="w-[30px] h-[30px] rounded-full bg-ink/6 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="3" cy="7" r="1.5" /><circle cx="11" cy="3" r="1.5" /><circle cx="11" cy="11" r="1.5" /></svg>
        </div>
      </div>
      <div className="mx-auto mt-4 w-[70px] h-[70px] rounded-full bg-[#F4D98A] border-2 border-gold flex items-center justify-center font-display text-[30px] text-[#4A3514]">
        S
      </div>
      <div className="text-center font-display text-[18px] mt-3 tracking-[-0.01em]">Selin K.</div>
      <div className="text-center text-[11px] text-ink/55 mt-0.5">@selin · İstanbul</div>
      <div className="mx-5 mt-4 px-3.5 py-3 bg-[#FFFCF4] rounded-2xl border border-ink/10">
        <div className="flex items-baseline gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, #E8C268, #8A6420)' }} />
          <span className="font-display text-[22px] font-medium tracking-[-0.02em]">1.240</span>
          <span className="text-[11px] text-ink/55">Karma</span>
        </div>
        <div className="flex justify-between text-[9px] text-ink/55 mt-2 mb-1">
          <span><em className="font-display italic text-ink/75 text-[10px]">Yapraklanan</em>&apos;a</span>
          <span>760 kaldı</span>
        </div>
        <div className="h-1 bg-cream rounded-full overflow-hidden">
          <div className="h-full w-[62%] bg-gold-dim rounded-full" />
        </div>
      </div>
      <div className="px-5 mt-3 grid grid-cols-3 gap-2">
        {[
          { l: 'Görev', v: '12' },
          { l: 'Seri', v: '8' },
          { l: 'Saat', v: '34' },
        ].map((m) => (
          <div key={m.l} className="px-2 py-2 bg-[#FFFCF4] border border-ink/10 rounded-xl text-center">
            <div className="font-display text-[18px] font-medium">{m.v}</div>
            <div className="text-[8px] tracking-[0.12em] text-ink/55 uppercase mt-0.5">{m.l}</div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
 * STK ADMIN preview
 * ═══════════════════════════════════════════════════════════ */
function AdminPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="p-9 bg-[#FAF3E0] border border-ink/10 rounded-3xl"
    >
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
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
 * SPONSOR preview
 * ═══════════════════════════════════════════════════════════ */
function SponsorPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="md:order-1 p-9 bg-[#FAF3E0] border border-ink/10 rounded-3xl"
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink/55 mb-4">Pilot ortaklarımız</div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { src: '/sponsors/starbucks.png', alt: 'Starbucks' },
          { src: '/sponsors/migros.png', alt: 'Migros' },
          { src: '/sponsors/garanti-bbva.png', alt: 'Garanti BBVA' },
          { src: '/sponsors/nike.png', alt: 'Nike' },
          { src: '/sponsors/trendyolgo.png', alt: 'Trendyol Go' },
          { src: '/sponsors/cinemaximum.png', alt: 'Cinemaximum' },
        ].map((s) => (
          <div key={s.alt} className="aspect-[1.6/1] bg-[#FFFCF4] border border-ink/10 rounded-xl flex items-center justify-center p-3">
            <Image src={s.src} alt={s.alt} width={120} height={40} style={{ height: 'auto', maxHeight: '32px', width: 'auto', maxWidth: '90%' }} />
          </div>
        ))}
      </div>
      <div className="p-4 bg-cream rounded-xl font-display italic text-[14px] leading-[1.5] text-ink/75">
        İlk pilotta 4 haftada 1.200 çalışanımız 3.400 saat görev tamamladı. CSR yatırımı bir Excel dosyası olmaktan çıktı.
        <span className="block mt-2.5 not-italic font-sans text-[11px] text-ink/55">— Garanti BBVA Sürdürülebilirlik Direktörü</span>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
 * ICONS
 * ═══════════════════════════════════════════════════════════ */
function AppleIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 24 28" fill="currentColor">
      <path d="M17.4 14.7c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3-.5 7.5 1.2 10 .9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.2 3.1-2.4.7-.9 1-1.4 1.7-3.6-3.5-1-3.1-3.7-3.1-3.1zM15 5.7c.7-.8 1.2-2 1-3.2-1.1.1-2.4.7-3.1 1.6-.7.7-1.2 2-1 3.1 1.2.1 2.4-.7 3.1-1.5z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 24 28" fill="currentColor">
      <path d="M3.6 3.4c-.3.4-.5 1-.5 1.7v18.5c0 .7.2 1.3.5 1.7l.1.1L14 14.1v-.2L3.7 3.3l-.1.1zm14.2 12.5l-3.4-3.4 7.6-4.3c.6.4 1.1 1 .9 1.7 0 .7-.4 1.4-.9 1.7l-4.2 4.3zm-3.4 1.6l3.4-3.4 4.3 4.3c-.4.6-1 1-1.7 1L14 17.5h.4zM4 24.7l9.6-9.6 3.4 3.4-9.4 5.3c-.7.4-1.6.4-2.2.1-.7-.4-1.1-1.1-1.4-1.8z" />
    </svg>
  )
}
