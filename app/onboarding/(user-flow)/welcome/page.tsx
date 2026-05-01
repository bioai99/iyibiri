'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, Clock, Users, Star, Gift, Heart, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { BrandLogo } from '@/components/ui/brand-logo'
import { TIERS } from '@/lib/tiers'

export default function OnboardingWelcome() {
  const { colors: c } = useTheme()
  const [slide, setSlide] = useState(0)
  const uiFont = 'var(--font-sans), system-ui, sans-serif'
  const displayFont = 'var(--font-display), Fraunces, serif'

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % 3), 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: c.ink900, height: '100%',
    }}>
      {/* Full slide area */}
      <div style={{
        flex: '1 1 auto', position: 'relative',
        display: 'flex', flexDirection: 'column',
        padding: 'calc(env(safe-area-inset-top, 20px) + 20px) 24px 0',
        overflow: 'hidden',
      }}>
        <AnimatePresence mode="wait">
          {slide === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              }}
            >
              <BrandLogo size={140} animate idle />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{ marginTop: 20 }}
              >
                <div style={{
                  fontFamily: displayFont, fontSize: 32, fontWeight: 500,
                  letterSpacing: '-0.025em', color: c.cream,
                }}>
                  İyi<span style={{ fontStyle: 'italic', color: c.gold }}>Biri</span>
                </div>
                <p style={{
                  fontFamily: uiFont, fontSize: 14, color: c.ink300,
                  marginTop: 8, lineHeight: 1.5,
                }}>
                  Gönüllülerin buluşma noktası
                </p>
              </motion.div>
            </motion.div>
          )}

          {slide === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', gap: 16, padding: '0 4px',
              }}
            >
              {/* Büyük başlık */}
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{
                  fontFamily: displayFont, fontSize: 26, fontWeight: 400,
                  color: c.cream, margin: 0, lineHeight: 1.15, letterSpacing: '-0.02em',
                }}
              >
                Yakınındaki <em style={{ fontStyle: 'italic', color: c.gold }}>görevleri</em> bul, katıl
              </motion.h2>

              {/* İki görev kartı */}
              {[
                { title: 'Sahil Temizliği', org: 'TEMA', where: 'Kilyos', when: 'Bu Cumartesi', dur: '2 saat', karma: 200, color: '#6B8E4E', people: 28 },
                { title: 'Komşuma Yardım', org: 'İBB', where: 'İstanbul', when: 'Her gün', dur: '1 saat', karma: 150, color: '#1B3A5C', people: 45 },
              ].map((m, idx) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.15, duration: 0.4 }}
                  style={{
                    background: c.ink800, border: `1px solid ${c.ink600}`,
                    borderRadius: 16, padding: 0, overflow: 'hidden',
                  }}
                >
                  <div style={{
                    height: 6, background: m.color, borderRadius: '16px 16px 0 0',
                  }} />
                  <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: displayFont, fontSize: 16, fontWeight: 500, color: c.cream, marginBottom: 4 }}>
                        {m.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: c.ink300, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <MapPin size={10} /> {m.where}
                        </span>
                        <span style={{ fontSize: 11, color: c.ink300, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Clock size={10} /> {m.dur}
                        </span>
                        <span style={{ fontSize: 11, color: c.ink300, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Users size={10} /> {m.people}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      background: c.goldSoft, border: `1px solid ${c.goldLine}`,
                      borderRadius: 10, padding: '6px 10px', textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: displayFont, fontSize: 18, fontWeight: 600, color: c.gold }}>+{m.karma}</div>
                      <div style={{ fontSize: 9, color: c.ink300, marginTop: 1 }}>karma</div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{ fontSize: 13, color: c.ink300, lineHeight: 1.5, margin: 0 }}
              >
                Çevre, eğitim, hayvanlar, topluluk — sana uygun görevler bir dokunuş uzağında.
              </motion.p>
            </motion.div>
          )}

          {slide === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', gap: 20, padding: '0 4px',
              }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{
                  fontFamily: displayFont, fontSize: 26, fontWeight: 400,
                  color: c.cream, margin: 0, lineHeight: 1.15, letterSpacing: '-0.02em',
                }}
              >
                <em style={{ fontStyle: 'italic', color: c.gold }}>Karma</em> biriktir, ödüller kazan
              </motion.h2>

              {/* Karma card büyük */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                style={{
                  background: c.ink800, border: `1px solid ${c.ink600}`,
                  borderRadius: 20, padding: '20px 24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: c.goldSoft, border: `1px solid ${c.goldLine}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Sparkles size={22} color={c.gold} />
                  </div>
                  <div>
                    <div style={{ fontFamily: displayFont, fontSize: 36, fontWeight: 500, color: c.gold, letterSpacing: '-0.03em', lineHeight: 1 }}>
                      1.284
                    </div>
                    <div style={{ fontSize: 12, color: c.ink300, marginTop: 2 }}>Karma biriktirdin</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: c.ink300, marginBottom: 6 }}>
                    <span>{TIERS[1].name}</span>
                    <span style={{ color: c.gold, fontWeight: 600 }}>716 kaldı</span>
                  </div>
                  <div style={{ height: 6, background: c.ink600, borderRadius: 999, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '64%' }}
                      transition={{ delay: 0.6, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                      style={{ height: '100%', background: c.gold, borderRadius: 999 }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Ödül kartları */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                style={{ display: 'flex', gap: 8 }}
              >
                {[
                  { brand: 'Starbucks', reward: 'Kahve', karma: 500, icon: '☕' },
                  { brand: 'Nike', reward: '%15', karma: 1000, icon: '👟' },
                  { brand: 'Migros', reward: '50₺', karma: 750, icon: '🛒' },
                ].map(r => (
                  <div key={r.brand} style={{
                    flex: 1, background: c.ink800, border: `1px solid ${c.ink600}`,
                    borderRadius: 14, padding: '12px 10px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{r.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: c.cream }}>{r.brand}</div>
                    <div style={{ fontSize: 10, color: c.gold, fontWeight: 700, marginTop: 2 }}>{r.karma} K</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slide dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '16px 0' }}>
          {[0, 1, 2].map(i => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: slide === i ? 24 : 8, height: 8, borderRadius: 999,
                background: slide === i ? c.gold : c.ink600,
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 300ms ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom buttons */}
      <div style={{ padding: '0 28px calc(env(safe-area-inset-bottom, 16px) + 20px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/onboarding/causes" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', height: 52, borderRadius: 14,
              background: c.gold, border: 'none', color: c.ink,
              fontFamily: uiFont, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,.08)',
            }}>
              Başlayalım <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </Link>
          <Link href="/auth/signin" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', height: 48, borderRadius: 14,
              background: 'transparent', border: `1px solid ${c.ink600}`,
              color: c.ink300, fontFamily: uiFont, fontSize: 14,
              fontWeight: 600, cursor: 'pointer',
            }}>
              Zaten üyeyim
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
