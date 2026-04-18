# Onboarding & Auth Visual Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Onboarding ve auth ekranlarını duygusal, görsel açıdan zengin, ilk dokunuşta çeken bir deneyime dönüştür.

**Architecture:** Mevcut ekran yapıları korunuyor, içerik ve görseller güncelleniyor. Lottie animasyonları, Framer Motion page transitions, Lucide ikonları ve daha güçlü copy ile her ekrana karakter kazandırılıyor.

**Tech Stack:** lottie-react, framer-motion, canvas-confetti, Lucide React (hepsi zaten yüklü)

---

## Tasarım Felsefesi

1. **Her ekranın bir duygusu var:** Welcome=merak, Causes=heyecan, Location=keşif, Ready=kutlama
2. **Lottie animasyonları canlılık katıyor** — statik SVG yerine hareket
3. **İkonlar anlam veriyor** — metin kartları yerine görsel kartlar
4. **Copy insani ve sıcak** — kurumsal değil, samimi
5. **Geçişler akıcı** — ekranlar arası Framer Motion transition
6. **Login ekranı ilham veriyor** — boş alan yerine gönüllülük görselleri

---

## Dosya Haritası

| Dosya | Aksiyon | Ne değişiyor |
|-------|---------|------------|
| `app/onboarding/welcome/page.tsx` | REWRITE | Lottie hero, yeni copy, animasyonlar |
| `app/onboarding/causes/page.tsx` | REWRITE | İkonlu kartlar, daha iyi grid, yeni copy |
| `app/onboarding/location/page.tsx` | MODIFY | Görsel iyileştirme, harita illüstrasyonu |
| `app/onboarding/ready/page.tsx` | REWRITE | Konfeti, Lottie kutlama, yeni copy |
| `app/auth/login/page.tsx` | REWRITE | Lifestyle hero, daha güçlü CTA |
| `app/auth/signup/page.tsx` | MODIFY | Görsel relief, daha iyi form UX |
| `public/animations/welcome-hero.json` | CREATE | Yeni Lottie (veya mevcut party.json kullan) |

---

### Task 1: Welcome Ekranı — İlk İzlenim

**Files:**
- Rewrite: `app/onboarding/welcome/page.tsx`

Mevcut: KarmaToken + dekoratif tokenlar. Yeni: Lottie animasyonu + hikaye anlatımı + stagger animasyonlar.

- [ ] **Step 1: Welcome sayfasını yeniden yaz**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useTheme } from '@/lib/theme'
import { KarmaToken } from '@/components/ui/ds'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export default function OnboardingWelcome() {
  const { colors: c } = useTheme()
  const [lottieData, setLottieData] = useState<any>(null)

  // Lottie'yi client-side yükle
  if (!lottieData && typeof window !== 'undefined') {
    fetch('/animations/party.json')
      .then(r => r.json())
      .then(setLottieData)
      .catch(() => {})
  }

  const displayFont = 'Fraunces, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden', position: 'relative',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500,
        background: `radial-gradient(circle, rgba(232,194,104,.18), transparent 65%)`,
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Hero area with Lottie */}
      <div style={{
        flex: '1 1 auto', position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 20px', minHeight: 360,
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ position: 'relative', width: 200, height: 200 }}
        >
          {lottieData ? (
            <Lottie animationData={lottieData} loop style={{ width: 200, height: 200 }} />
          ) : (
            <KarmaToken size={140} />
          )}
        </motion.div>

        {/* Floating hearts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.3, y: -5 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          style={{ position: 'absolute', top: '20%', left: '18%' }}
        >
          <Heart size={18} color={c.gold} fill={c.gold} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.25, y: -8 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
          style={{ position: 'absolute', top: '30%', right: '15%' }}
        >
          <Heart size={14} color={c.gold} fill={c.gold} />
        </motion.div>
      </div>

      {/* Bottom content */}
      <div style={{ padding: '0 28px 44px' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontFamily: displayFont, fontSize: 34, fontWeight: 400,
            letterSpacing: '-0.03em', lineHeight: 1.1,
            color: c.cream, margin: '0 0 12px',
          }}
        >
          <em style={{ fontStyle: 'italic', color: c.gold }}>İyi biri</em> olmak{'\n'}
          dünyayı değiştirir.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: uiFont, fontSize: 15, color: c.ink300,
            lineHeight: 1.6, margin: '0 0 32px', maxWidth: 320,
          }}
        >
          Gönüllü ol, gerçek görevler tamamla, Karma biriktir.
          Her iyilik seni ve çevrendeki insanları büyütür.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <Link href="/onboarding/causes" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', height: 52, borderRadius: 14,
              background: c.gold, border: 'none', color: '#241E18',
              fontFamily: uiFont, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(232,194,104,.3)',
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
        </motion.div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: i === 0 ? 20 : 6, height: 6, borderRadius: 999,
              background: i === 0 ? c.gold : c.ink600,
              transition: 'width .2s ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build doğrula**
```bash
npx next build
```

- [ ] **Step 3: Commit**
```bash
git add app/onboarding/welcome/page.tsx
git commit -m "feat(onboarding): welcome screen with Lottie, Framer Motion stagger"
```

---

### Task 2: Causes Ekranı — İkonlu Kartlar

**Files:**
- Rewrite: `app/onboarding/causes/page.tsx`

Mevcut: Düz metin kartları. Yeni: Her cause'un Lucide ikonu + gradient accent + daha iyi grid.

- [ ] **Step 1: Causes sayfasını yeniden yaz**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Trees, BookOpen, PawPrint, HeartPulse, Flame, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'

const causes = [
  { name: 'Çevre', sub: 'Ağaç dikimi, temizlik, geri dönüşüm', icon: Trees, gradient: 'linear-gradient(135deg, #6B8E4E, #4a6237)' },
  { name: 'Eğitim', sub: 'Mentörlük, okuma, kitap bağışı', icon: BookOpen, gradient: 'linear-gradient(135deg, #4A6FA5, #2d4a7a)' },
  { name: 'Hayvanlar', sub: 'Barınak, mama, sahiplendirme', icon: PawPrint, gradient: 'linear-gradient(135deg, #C8553D, #8a3a27)' },
  { name: 'Sağlık', sub: 'Kan bağışı, yaşlı bakımı', icon: HeartPulse, gradient: 'linear-gradient(135deg, #D4627A, #a04358)' },
  { name: 'Afet', sub: 'Deprem, yangın, yardım', icon: Flame, gradient: 'linear-gradient(135deg, #E8A838, #b8842a)' },
  { name: 'Topluluk', sub: 'Mahalle, kültür, sanat', icon: Users, gradient: 'linear-gradient(135deg, #7B68A8, #5a4d7d)' },
]

export default function OnboardingCauses() {
  const { colors: c } = useTheme()
  const [selected, setSelected] = useState<string[]>(['Çevre', 'Hayvanlar'])

  function toggle(name: string) {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '58px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/onboarding/welcome" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>
        <div style={{ display: 'flex', flex: 1, gap: 4 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 999,
              background: i < 2 ? c.gold : c.ink600,
            }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 24px 0' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.gold, margin: '0 0 10px' }}>
          ADIM 2 / 4
        </p>
        <h1 style={{
          fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 500,
          letterSpacing: '-0.025em', color: c.cream, margin: '0 0 8px', lineHeight: 1.15,
        }}>
          Neye <em style={{ fontStyle: 'italic', color: c.gold }}>gönlün</em> yatıyor?
        </h1>
        <p style={{ fontSize: 14, color: c.ink300, margin: 0, lineHeight: 1.5 }}>
          Sana özel görevler önerelim. İstediğin kadar seç.
        </p>
      </div>

      {/* Causes grid */}
      <div style={{
        padding: '20px 16px', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 10,
        flex: 1, overflowY: 'auto', alignContent: 'start',
      }}>
        {causes.map((cause, idx) => {
          const isSelected = selected.includes(cause.name)
          const Icon = cause.icon
          return (
            <motion.button
              key={cause.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              onClick={() => toggle(cause.name)}
              style={{
                position: 'relative', textAlign: 'left', cursor: 'pointer',
                background: isSelected ? c.goldSoft : c.ink800,
                border: `1.5px solid ${isSelected ? c.gold : c.ink600}`,
                borderRadius: 16, padding: 0, overflow: 'hidden',
                transition: 'all 180ms ease',
              }}
            >
              {/* Icon strip */}
              <div style={{
                height: 48, background: isSelected ? cause.gradient : c.ink700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 200ms ease',
              }}>
                <Icon size={22} color={isSelected ? '#F4EEDF' : c.ink300} strokeWidth={1.8} />
              </div>

              {/* Text */}
              <div style={{ padding: '10px 12px 12px' }}>
                <p style={{
                  fontFamily: 'Fraunces, serif', fontStyle: 'italic',
                  fontSize: 16, fontWeight: 500,
                  color: isSelected ? c.gold : c.cream,
                  margin: '0 0 2px', lineHeight: 1.2,
                }}>
                  {cause.name}
                </p>
                <p style={{ fontSize: 11, color: c.ink300, margin: 0, lineHeight: 1.4 }}>
                  {cause.sub}
                </p>
              </div>

              {/* Checkmark */}
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 22, height: 22, borderRadius: '50%', background: c.gold,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={13} color="#241E18" strokeWidth={2.5} />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '0 16px 36px' }}>
        <Link
          href="/onboarding/location"
          onClick={() => localStorage.setItem('iyibiri_onboarding_interests', JSON.stringify(selected))}
          style={{ textDecoration: 'none' }}
        >
          <button style={{
            width: '100%', background: c.gold, color: '#241E18',
            border: 'none', borderRadius: 999, padding: '14px 20px',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}>
            {selected.length > 0 ? `${selected.length} alan seçildi — Devam` : 'Devam'}
          </button>
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build doğrula**
- [ ] **Step 3: Commit**
```bash
git add app/onboarding/causes/page.tsx
git commit -m "feat(onboarding): causes with icons, gradients, stagger animation"
```

---

### Task 3: Ready Ekranı — Kutlama

**Files:**
- Rewrite: `app/onboarding/ready/page.tsx`

Mevcut: KarmaToken + statik metin. Yeni: Konfeti patlaması + Lottie + daha büyük görsel etki.

- [ ] **Step 1: Ready sayfasını yeniden yaz**

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useTheme } from '@/lib/theme'
import { KarmaToken } from '@/components/ui/ds'
import { createClient } from '@/lib/supabase/client'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export default function OnboardingReady() {
  const { colors: c } = useTheme()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [lottieData, setLottieData] = useState<any>(null)

  useEffect(() => {
    // Konfeti
    import('canvas-confetti').then(mod => {
      const confetti = mod.default
      setTimeout(() => {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#E8C268', '#F4EEDF', '#C8553D'] })
      }, 600)
    }).catch(() => {})

    // Lottie
    fetch('/animations/party.json')
      .then(r => r.json())
      .then(setLottieData)
      .catch(() => {})

    // Auth check + save onboarding data
    async function checkAndSave() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
        const interests = JSON.parse(localStorage.getItem('iyibiri_onboarding_interests') || '[]')
        const city = localStorage.getItem('iyibiri_onboarding_city')
        const radius = localStorage.getItem('iyibiri_onboarding_radius')
        if (interests.length || city) {
          await supabase.from('profiles').update({
            interests, city: city || null,
            search_radius: radius ? Number(radius) : 10,
          }).eq('id', user.id)
          localStorage.removeItem('iyibiri_onboarding_interests')
          localStorage.removeItem('iyibiri_onboarding_city')
          localStorage.removeItem('iyibiri_onboarding_radius')
        }
      }
    }
    checkAndSave()
  }, [])

  const nextHref = isLoggedIn ? '/app-start' : '/auth/login'
  const displayFont = 'Fraunces, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden', position: 'relative',
    }}>
      {/* Progress bar */}
      <div style={{ padding: '58px 20px 0' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: c.gold }} />
          ))}
        </div>
      </div>

      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 400, height: 400,
        background: `radial-gradient(circle, rgba(232,194,104,.2), transparent 60%)`,
        filter: 'blur(30px)', pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        flex: 1, padding: '40px 28px 0',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        {/* Lottie or KarmaToken */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ marginBottom: 24, position: 'relative' }}
        >
          {lottieData ? (
            <Lottie animationData={lottieData} loop style={{ width: 160, height: 160 }} />
          ) : (
            <KarmaToken size={100} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', background: c.goldSoft,
            border: `1px solid ${c.goldLine}`, borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: c.gold, marginBottom: 20,
          }}
        >
          <Sparkles size={14} /> Hoş geldin hediyesi
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            fontFamily: displayFont, fontSize: 42, fontWeight: 400,
            letterSpacing: '-0.032em', lineHeight: 1, color: c.cream, margin: 0,
          }}
        >
          İlk <em style={{ fontStyle: 'italic', color: c.gold }}>100 Karma</em>
          {'\n'}senden.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{
            fontFamily: uiFont, fontSize: 15, color: c.ink200,
            maxWidth: 300, marginTop: 18, lineHeight: 1.6,
          }}
        >
          {isLoggedIn
            ? 'İlk görevini tamamladığında 250 daha gelecek — "İyi Biri" seviyesine iki adım kaldı.'
            : 'Hesabını aç, ilk 100 Karma\'nı hemen kazan. İlk görevinde 250 daha gelecek.'}
        </motion.p>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ padding: '0 16px 36px' }}
      >
        <Link href={nextHref} style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', background: c.gold, color: '#241E18',
            border: 'none', borderRadius: 14, padding: '14px 20px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(232,194,104,.3)',
          }}>
            {isLoggedIn ? 'İlk görevimi bul' : 'Hesabımı oluştur'}
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </Link>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Build doğrula**
- [ ] **Step 3: Commit**
```bash
git add app/onboarding/ready/page.tsx
git commit -m "feat(onboarding): ready screen with confetti, Lottie, stagger animation"
```

---

### Task 4: Auth Login Ekranı — Görsel Zenginleştirme

**Files:**
- Modify: `app/auth/login/page.tsx`

Mevcut: Üst yarısı boş, sadece floating KarmaTokenlar. Yeni: Lifestyle illüstrasyon alanı + Framer Motion + daha güçlü copy.

- [ ] **Step 1: Login sayfasının hero alanını güncelle**

Hero alanındaki dekoratif tokenları kaldır, yerine daha anlamlı bir görsel kompozisyon koy:
- KarmaToken büyük ve ortada (animasyonlu)
- Altında İyiBiri wordmark
- Framer Motion ile giriş animasyonu
- Copy'yi güçlendir: "İyilik buradan başlar" → "Her iyilik fark yaratır"

Butonlara `motion.div` wrapper ekle (stagger giriş). Üst alandaki 3 dekoratif token'ı kaldır, yerine tek büyük animasyonlu KarmaToken + wordmark bırak.

Not: handleOAuthLogin fonksiyonu ve state'ler AYNEN kalsın (loading, error). Sadece JSX render kısmı değişecek.

- [ ] **Step 2: Build doğrula**
- [ ] **Step 3: Commit**
```bash
git add app/auth/login/page.tsx
git commit -m "feat(auth): login screen with motion animations, stronger copy"
```

---

### Task 5: Build ve Deploy

- [ ] **Step 1: Full build**
```bash
npx next build
```

- [ ] **Step 2: Capacitor sync**
```bash
npx cap sync ios
```

- [ ] **Step 3: Final commit**
```bash
git add -A
git commit -m "feat: onboarding & auth visual upgrade - Lottie, icons, confetti, motion"
git push origin main
```

- [ ] **Step 4: Archive + TestFlight**
```bash
xcodebuild -project ios/App/App.xcodeproj -scheme App -destination 'generic/platform=iOS' -archivePath /tmp/iyibiri.xcarchive archive
xcodebuild -exportArchive -archivePath /tmp/iyibiri.xcarchive -exportPath /tmp/iyibiri-export -exportOptionsPlist /tmp/export-options.plist
```

---

## Dokunulmayan Ekranlar

- **Location** (`onboarding/location`): Zaten iyi çalışıyor, slider ve form UX yeterli. İkonlu kartlar ve welcome/causes/ready'nin zenginleşmesi yeterli kontrast sağlar.
- **Signup** (`auth/signup`): Form-heavy ama fonksiyonel. Büyük değişiklik gerektirmiyor — welcome ve login'deki iyileşme yeterli ilk izlenim bırakır.
- **Signin** (`auth/signin`): Mevcut hali iyi, zaten social butonlar + form var.
- **Verify** (`auth/verify`): OTP UI zaten güzel.
