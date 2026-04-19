# Onboarding Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 3 ekranlık onboarding (Welcome → Causes → Ready), slide sayfa geçişleri, spring micro-interactions, Location'ı progressive'e taşı.

**Architecture:** Onboarding layout AnimatePresence wrapper olur. Her sayfa kendi `motion.div` ile slide giriş/çıkış yapar. Causes kartlarında spring seçim. Progress bar animasyonlu. Location onboarding'den çıkar, dashboard'da progressive olarak sorulur.

**Tech Stack:** Next.js 14, Framer Motion (motion), TypeScript

---

## Dosya Haritası

| Dosya | Aksiyon | Sorumluluk |
|-------|---------|------------|
| `app/onboarding/layout.tsx` | MODIFY | AnimatePresence wrapper ekle |
| `app/onboarding/welcome/page.tsx` | REWRITE | 3 adım progress, slide-ready, güncel copy |
| `app/onboarding/causes/page.tsx` | REWRITE | Spring kartlar, animasyonlu checkmark, slide-ready |
| `app/onboarding/ready/page.tsx` | REWRITE | 3 adım progress, causes'tan direkt gelir, güncel copy |
| `app/onboarding/location/page.tsx` | DELETE | Progressive'e taşınıyor |

---

### Task 1: Onboarding Layout — AnimatePresence + Slide Wrapper

**Files:**
- Modify: `app/onboarding/layout.tsx`

- [ ] **Step 1: Layout'u client component yap ve AnimatePresence ekle**

```tsx
'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider } from '@/lib/theme'

const slideVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <ThemeProvider initial="light">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  )
}
```

Not: `mode="wait"` eski sayfa çıkışını bekleyip sonra yenisini getirir. Geçiş 350ms, expo-out easing.

- [ ] **Step 2: Build doğrula**
```bash
npx next build
```

- [ ] **Step 3: Commit**
```bash
git add app/onboarding/layout.tsx
git commit -m "feat(onboarding): AnimatePresence slide transitions"
```

---

### Task 2: Welcome Ekranı — 3 Adım Progress + Temiz Layout

**Files:**
- Rewrite: `app/onboarding/welcome/page.tsx`

- [ ] **Step 1: Welcome sayfasını yeniden yaz**

```tsx
'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { BrandLogo } from '@/components/ui/brand-logo'

export default function OnboardingWelcome() {
  const { colors: c } = useTheme()
  const uiFont = 'var(--font-sans), system-ui, sans-serif'
  const displayFont = 'var(--font-display), Fraunces, serif'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden',
      height: '100%',
    }}>
      {/* Hero */}
      <div style={{
        flex: '1 1 auto',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'calc(env(safe-area-inset-top, 20px) + 40px) 24px 20px',
      }}>
        <BrandLogo size={130} animate idle showWordmark />
      </div>

      {/* Bottom */}
      <div style={{ padding: '0 28px calc(env(safe-area-inset-bottom, 16px) + 24px)' }}>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontFamily: displayFont, fontSize: 30, fontWeight: 400,
            letterSpacing: '-0.03em', lineHeight: 1.1,
            color: c.cream, margin: '0 0 8px',
          }}
        >
          <em style={{ fontStyle: 'italic', color: c.gold }}>İyilik</em> biriktirilir.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            fontFamily: uiFont, fontSize: 15, color: c.ink300,
            lineHeight: 1.6, margin: '0 0 28px', maxWidth: 300,
          }}
        >
          Gönüllü ol, görevler tamamla, Karma biriktir.
          Her iyilik seni de çevreni de büyütür.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
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
        </motion.div>

        {/* Progress — 3 adım */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              style={{
                width: i === 0 ? 24 : 8, height: 8, borderRadius: 999,
                background: i === 0 ? c.gold : c.ink600,
                transition: 'width 300ms ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build doğrula**
- [ ] **Step 3: Commit**

---

### Task 3: Causes Ekranı — Spring Kartlar + Animasyonlu Checkmark

**Files:**
- Rewrite: `app/onboarding/causes/page.tsx`

- [ ] **Step 1: Causes sayfasını yeniden yaz**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Trees, BookOpen, PawPrint, HeartPulse, Flame, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [selected, setSelected] = useState<string[]>([])
  const uiFont = 'var(--font-sans), system-ui, sans-serif'
  const displayFont = 'var(--font-display), Fraunces, serif'

  function toggle(name: string) {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: c.ink900, overflow: 'hidden',
      height: '100%',
    }}>
      {/* Header */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Link href="/onboarding/welcome" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>
        {/* Animated progress bar — 3 segments */}
        <div style={{ display: 'flex', flex: 1, gap: 4 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: c.ink600, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: i < 2 ? '100%' : '0%' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                style={{ height: '100%', background: c.gold, borderRadius: 999 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 24px 0' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.gold, margin: '0 0 8px' }}
        >
          ADIM 2 / 3
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            fontFamily: displayFont, fontSize: 28, fontWeight: 500,
            letterSpacing: '-0.025em', color: c.cream, margin: '0 0 6px', lineHeight: 1.15,
          }}
        >
          Neye <em style={{ fontStyle: 'italic', color: c.gold }}>gönlün</em> yatıyor?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: 14, color: c.ink300, margin: 0, lineHeight: 1.5 }}
        >
          Sana uygun görevler bulalım. Dilediğin kadar seç.
        </motion.p>
      </div>

      {/* Causes grid */}
      <div style={{
        padding: '16px 16px', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 10,
        flex: 1, overflowY: 'auto', alignContent: 'start',
      }}>
        {causes.map((cause, idx) => {
          const isSelected = selected.includes(cause.name)
          const Icon = cause.icon
          return (
            <motion.button
              key={cause.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.08, duration: 0.4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(cause.name)}
              style={{
                position: 'relative', textAlign: 'left', cursor: 'pointer',
                background: isSelected ? c.goldSoft : c.ink800,
                border: `1.5px solid ${isSelected ? c.gold : c.ink600}`,
                borderRadius: 16, padding: 0, overflow: 'hidden',
                transition: 'border-color 200ms ease, background 200ms ease',
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
                  fontFamily: displayFont, fontStyle: 'italic',
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

              {/* Animated checkmark */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 24, height: 24, borderRadius: '50%', background: c.gold,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,.12)',
                    }}
                  >
                    <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '0 16px calc(env(safe-area-inset-bottom, 16px) + 16px)' }}>
        <Link
          href="/onboarding/ready"
          onClick={() => localStorage.setItem('iyibiri_onboarding_interests', JSON.stringify(selected))}
          style={{ textDecoration: 'none' }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%', height: 52, background: c.gold, color: c.ink,
              border: 'none', borderRadius: 14, padding: '0 20px',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              fontFamily: uiFont,
              boxShadow: '0 2px 8px rgba(0,0,0,.08)',
            }}
          >
            {selected.length > 0 ? `${selected.length} alan seçtin — Devam` : 'Atla'}
          </motion.button>
        </Link>
      </div>
    </div>
  )
}
```

Değişiklikler:
- `whileTap={{ scale: 0.95 }}` — kart basma hissi
- Checkmark `AnimatePresence` ile spring giriş/çıkış (rotate + scale)
- Progress bar animasyonlu dolum
- Adım sayısı 4→3
- Varsayılan seçim yok (kullanıcı kendi seçsin)
- CTA: seçim yoksa "Atla" göster
- `causes → ready` direkt link (location atlandı)

- [ ] **Step 2: Build doğrula**
- [ ] **Step 3: Commit**

---

### Task 4: Ready Ekranı — 3 Adım Progress + Güncel Akış

**Files:**
- Modify: `app/onboarding/ready/page.tsx`

- [ ] **Step 1: Progress bar'ı 3 adıma güncelle**

Ready sayfasında progress bar 4 segment yerine 3 segment olmalı (hepsi dolu):

```tsx
// Değiştir: {[0, 1, 2, 3].map(i => (
// Yeni:
{[0, 1, 2].map(i => (
  <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: c.ink600, overflow: 'hidden' }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      transition={{ duration: 0.6, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
      style={{ height: '100%', background: c.gold, borderRadius: 999 }}
    />
  </div>
))}
```

- [ ] **Step 2: Build doğrula**
- [ ] **Step 3: Commit**

---

### Task 5: Location Sayfasını Kaldır + Causes → Ready Link

**Files:**
- Delete: `app/onboarding/location/page.tsx`
- Verify: `app/onboarding/causes/page.tsx` (Task 3'te zaten `href="/onboarding/ready"` yapıldı)

- [ ] **Step 1: Location sayfasını sil**
```bash
rm app/onboarding/location/page.tsx
```

- [ ] **Step 2: Tüm projede location referanslarını kontrol et**
```bash
grep -rn "onboarding/location" app/ --include="*.tsx" --include="*.ts"
```
Eğer başka referanslar varsa kaldır.

- [ ] **Step 3: Build doğrula**
```bash
npx next build
```

- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "feat(onboarding): remove location from upfront flow (progressive)"
```

---

### Task 6: Final Build + Push

- [ ] **Step 1: Full build**
```bash
npx next build
```

- [ ] **Step 2: Commit tüm değişiklikler**
```bash
git add -A
git commit -m "feat: onboarding redesign — 3 screens, slide transitions, spring interactions"
git push origin main
```

---

## Test Senaryoları

1. Welcome açılır → logo animasyonu + idle kanat nefesi
2. "Başlayalım" → **sağdan sola slide** ile Causes gelir
3. Causes: kart seçimi → **spring bounce** + **checkmark rotate-in**
4. Kart seçimi kaldırma → **checkmark rotate-out**
5. "Devam" / "Atla" → **sağdan sola slide** ile Ready gelir
6. Ready: progress bar tümü animasyonlu dolar
7. Geri butonu → **soldan sağa** slide (AnimatePresence exit)
8. Location sayfası artık yok, 404 verir
