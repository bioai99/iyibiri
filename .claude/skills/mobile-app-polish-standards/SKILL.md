---
name: mobile-app-polish-standards
description: Mobil uygulama ekosisteminde "öne çıkan" kalite standartları — Linear, Arc, Duolingo, Things 3, Notion Mobile, Robinhood, Cash App, Apollo gibi premium app'lerin imza kalite desenleri. Native-feel mobil UX, motion choreography craft, typography hierarchy detay, dark mode layering, haptic feedback, loading state micro-polish, empty state illustration disiplini, touch target + gesture kuralları, iOS HIG + Material Design 3 buluşma noktası. UX researcher ve UI designer her ürün kararı öncesi bu benchmark'ları referans alır. "Quality threshold" tanımlayan skill — "iyi mi yoksa Linear-seviyesi mi" sorusunu cevaplar.
---

# Mobil App Ekosistem Kalite Standartları — İyiBiri için Benchmark

> **Bu skill ne zaman?** UX/UI agent ürettiği her output öncesi bu dosyayı okur. "Bu tasarım tier-1 app'lerin yanında durur mu?" sorusunu cevaplar. Yüzey seviyesinde "iyi görünüyor" demek yetmez — bu skill'deki craft detaylarına uyumu denetler.

## 1. Benchmark Takım — "Bu seviyede olmalıyız"

Mobile app ecosystem'da öne çıkan, craft-obsessed ürünler ve İyiBiri için kritik öğrenim noktaları:

### Linear
**Ne öğretir:** Keyboard-first productivity app sophistication. Minimal chrome, hızlı şimşek-hızı etkileşim, command palette, micro-animation. Dark mode paletinin doygunluğu.
**İyiBiri'de:** Command palette benzer yok ama Linear'ın "her animasyon 150-200ms, her cursor değişimi anlamlı" disiplini. Font weight hierarchy (Inter 400/500/600/700).

### Arc Browser (The Browser Company)
**Ne öğretir:** "Delightful details" — süper cılız değil ama her tıklamada mini reward. Spatial UI, soft gradients, custom cursor states. Boost feature brand storytelling.
**İyiBiri'de:** Karma counter animate'te "Arc-esque" micro-celebration. Empty state'te delight.

### Duolingo
**Ne öğretir:** Gamification polish — streak flame, level-up ceremony, owl mascot consistency. Loss aversion psychology. Haptic feedback her başarıda.
**İyiBiri'de:** **En yakın benchmark.** Karma counter + seri + seviye ceremony Duolingo pattern'iyle. Ama İyiBiri "bağırmayan" tonda — yumuşak gold vs Duolingo'nun agresif green.

### Things 3 (Cultured Code)
**Ne öğretir:** "Obsessive refinement" — her pixel, her transition, her gesture doğru. Slide-to-complete, pulled-down to create, magic list. iOS HIG'in mükemmel uygulaması.
**İyiBiri'de:** Mission complete gesture? Liste item swipe actions? Native iOS feel için referans.

### Robinhood + Cash App
**Ne öğretir:** Finansal app'te güven inşası + motion. Sayı countdown animate'leri, celebratory overlays, brand gradient. Tactile feel.
**İyiBiri'de:** Karma count-up animate pattern. Ödeme success state (ADR-008 embedded widget sonrası). Gradient kullanımı.

### Apollo (eski Reddit app — Christian Selig)
**Ne öğretir:** "Power user obsession" — 1000+ customization. Haptic choreography. Theme engine. Community adoration.
**İyiBiri'de:** Haptic patterns (light on tap, medium on complete, heavy on reward). Theme settings Yıl 2.

### Notion Mobile
**Ne öğretir:** Multi-context complexity UI'ı basit tutma. Database parametric display. Block-based primitives.
**İyiBiri'de:** NGO membership parametric form (ADR-007). Notion'un block editor disiplini.

### Revolut + Monzo
**Ne öğretir:** Card-as-hero. Every screen feels like a premium physical card. Color-as-identity.
**İyiBiri'de:** Mission card, NGO profile card, Karma token hero — fiziksel kart hissi.

---

## 2. Native-Feel Mobil UX Kuralları

### Touch target + gesture
- **Minimum 44×44pt** (iOS HIG) / **48×48dp** (Material) — İyiBiri'de Tailwind `min-h-11 min-w-11` veya icon butonda padding ile sağlanır.
- **Swipe actions** liste item'larda (Things 3 pattern).
- **Pull-to-refresh** feed sayfalarında (`/dashboard`, `/notifications`).
- **Pinch zoom** sadece ihtiyaç duyulan yerde (foto, harita) — App elsewhere disable.
- **Haptic feedback** (Capacitor plugin: `@capacitor/haptics`) her önemli başarıda:
  - **Light** — toggle, select
  - **Medium** — action complete (görev tamamlandı)
  - **Heavy** — reward (Karma bonus, seviye atlama)
  - **Notification** — streak kırıldı uyarı

### Safe-area + scroll
- `pb-safe` + `pt-safe` zorunlu (atlas Bölüm 6). `overscroll-behavior: none` (globals.css var).
- **Sticky header** dashboard + detay sayfalarında. Scroll sırasında `backdrop-blur + bg-background/90`.
- **Scroll-hide** bottom nav opsiyonel (aşağı scroll → gizle, yukarı → göster) — Instagram pattern. V1'de SABIT kalsın, V1.1'de değerlendir.

### Native transitions
- **iOS push transition** — sayfa sağdan gelir. Next.js default yok; Framer Motion page transition ile simüle:
  ```tsx
  <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -100, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  />
  ```
- **Modal bottom sheet** — iOS sheet pattern. `rounded-t-3xl` + drag handle.
- **Back gesture** — iOS swipe-from-left. Capacitor native handles; web için `@touch-action: pan-y` korun.

---

## 3. Motion Choreography Craft

### Timing hierarchy
| Türü | Süre | Kullanım |
|---|---|---|
| Micro (icon, check, toggle) | **80-120ms** | State flip |
| Small (button press) | **150-200ms** | Tap feedback |
| Medium (page scroll, card enter) | **300-400ms** | Entry animation |
| Large (hero reveal, ceremony) | **500-800ms** | Karma count-up, level-up |
| Celebration (confetti, overlay) | **1.5-3s** | Success milestone |

### Easing
- **Default spring:** `{type:'spring', stiffness:400, damping:30}` — snappy, not bouncy.
- **Celebration spring:** `{stiffness:200, damping:12}` — more bounce.
- **Entry ease:** `[0.16, 1, 0.3, 1]` — custom cubic bezier, "smooth land" (Apple-esque).
- **Exit ease:** `[0.4, 0, 1, 1]` — faster out.

### Staggered entry
```tsx
transition={{ delay: i * 0.04, duration: 0.4 }}
```
**Kural:** Stagger delay 40-80ms. 100ms+ = yavaş hisseder. 20ms- = hiç fark edilmez.

### Reduced motion
`useReducedMotion` hook — respect edilmeli. Alternative: opacity-only transitions, no transforms.

### Choreography örnekleri
**Mission complete ceremony:**
1. QR scan başarılı (0ms) — haptic medium
2. Check icon scale 0 → 1.2 → 1 (200ms spring)
3. "Görev tamamlandı" text fade-in (300ms ease)
4. KarmaCounter 0 → N count-up (800ms custom ease)
5. Impact statement fade-in (500ms, 400ms delay)
6. Celebration overlay confetti (1500ms)
7. "Devam et" CTA slide-up (400ms, 1200ms delay)

**Dashboard hero entrance:**
1. Hero card (0ms, scale 0.98 → 1, opacity 0 → 1, 500ms)
2. KarmaCounter count-up (0ms delay, 600ms)
3. Progress bar fill (200ms delay, 800ms)
4. Mission cards stagger (400ms delay + 60ms each, 400ms each)

---

## 4. Typography Hierarchy — İyiBiri Özel

### Scale (atlas Bölüm 6 × Plus Jakarta Sans + Fraunces)

| Rol | Font | Weight | Size | Letter-spacing | Özel |
|---|---|---|---|---|---|
| Hero number (Karma) | Fraunces/display | 900 | 56-72px | -0.02em | tabular-nums |
| Hero title | Fraunces/display | 500 (italic aksan) | 28-32px | -0.02em | — |
| Section title | Plus Jakarta Sans | 700 | 18-20px | -0.01em | — |
| Card title | Plus Jakarta Sans | 600 | 15-16px | 0 | — |
| Body | Plus Jakarta Sans | 400 | 14-15px | 0 | line-height 1.55 |
| Small body | Plus Jakarta Sans | 400 | 13px | 0 | — |
| Label/caption | Plus Jakarta Sans | 600 | 11px | 0.06em | UPPERCASE |
| Micro | Plus Jakarta Sans | 500 | 10px | 0.08em | UPPERCASE |

### İmza patterns
- **Fraunces italic kelime vurgusu:** Hero + CTA başlıklarında tek kelime italik + gold renk. Örn. "Tekrar *hoş geldin*." — "tekrar" kelimesi Fraunces italic gold. (Signin sayfasında mevcut pattern.)
- **Numeric tabular-nums zorunlu** — Karma, leaderboard rank, streak gün sayısı. Monospace olmadan sayılar düzensiz genişler.

---

## 5. Dark Mode Layering

### Katman sistemi (atlas Bölüm 6 + craft)
```
bg (en arka)    ink-900 (#24201B)
surface 1       ink-800 (#2E2923)   — kart
surface 2       ink-700 (#36302A)   — kart içi vurgu
surface 3       ink-600 (#3F3830)   — interaktif hover
border hairline ink-600 (#3F3830) @ 50% opacity
text primary    cream (#F4EEDF)
text secondary  ink-300 (#A89E8A)
text tertiary   ink-400 (#7A6F5E)
accent          gold (#E8C268)
```

### Shadow sistemi dark mode
- Siyah shadow **yetmez** — sürükleyici değil. Kullan `shadow-md` sadece light mode'da.
- Dark mode'da shadow yerine **border tone** + subtle inner glow (ink-600 hairline).
- Hero glow istisnası: `shadow-[0_8px_32px_rgba(232,194,104,0.35)]` — gold tint imza gölge.

### Gradient craft
- Hero card: `bg-gradient-to-br from-ink-800 via-ink-800 to-ink-900` — subtle, tek yönlü.
- CTA button: `bg-gold` düz; hover state `bg-gold/90`.
- Brand gradient (sadece hero/milestone): `from-gold-dim to-gold` 45°.

---

## 6. Empty/Error/Success State Illustration Disiplini

### Empty state
- **Illustration 120-160px** — SVG, stroke-based (Lucide tarzı) + minimal fill.
- **Gold accent** tek vurgu noktası (ring, circle, highlight).
- **Kopyalama ton:** "sen" dili + sebep + çıkış yolu (atlas Bölüm 10).
- Örnek: "Henüz görev yok" + SVG (boş takvim + gold saat ikonu) + "Keşfet sayfasında sana uygun görevleri bul." + [Keşfet →] button.

### Error state
- **Clay color (#C8553D)** — alert ama agresif değil.
- **Icon 48px** (alert triangle veya benzeri) + heading + body + retry button + support link.
- "Yeniden dene" + "Destek yaz" ikili CTA.

### Success state
- **Gold ring animation** + center check (scale 0 → 1.2 → 1, spring).
- KarmaCounter count-up.
- Impact statement.
- Primary CTA "Devam et" + secondary "Paylaş".

---

## 7. Loading State Craft

### Skeleton disiplin
- **200ms delay öncesi yok** — flash of skeleton önler.
- **Shimmer** `@keyframes shimmer` + `background-size: 200%` (globals.css mevcut).
- **Layout preservation** — gerçek layout'a uygun boyutlar (yanlış shimmer = layout jump).
- **aria-busy="true"** accessibility.

### Spinner sadece 400ms+ bekleyişte
Hızlı yanıtlarda spinner = flicker. Örn. auth signin `loading` state'inde button disabled ama spinner yok — sadece text "Giriş yapılıyor..." (mevcut pattern).

---

## 8. Haptic Feedback Choreography (Capacitor)

```typescript
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

// Toggle, select
Haptics.impact({ style: ImpactStyle.Light })

// Görev başvuru, üyelik tıklama
Haptics.impact({ style: ImpactStyle.Medium })

// Karma reward, seviye atlama
Haptics.impact({ style: ImpactStyle.Heavy })

// Streak kırıldı
Haptics.notification({ type: NotificationType.Warning })

// Başarı
Haptics.notification({ type: NotificationType.Success })
```

**Kural:** Haptic web'de yok — Capacitor detect et, fail-safe ignore.

---

## 9. Quality Checklist — Her UX/UI çıktısı için

Bir spec, brief veya implementation bırakmadan önce:

### UX tarafı
- [ ] Heuristik audit Nielsen 10 × İyiBiri 6 özel pass (skill: ux-heuristics)
- [ ] User journey emotion curve (skill: user-journey-mapping)
- [ ] 3+ app ekosistem benchmark referansı (bu skill'den — Linear/Duolingo/Things/vs.)
- [ ] Micro-interaction + haptic davranış listesi
- [ ] Empty/loading/error/success 4 state coverage
- [ ] Accessibility WCAG AA kontrast + focus + touch target
- [ ] `prefers-reduced-motion` respect

### UI tarafı
- [ ] Token kullanımı (atlas Bölüm 6) — hardcoded renk yok
- [ ] Typography hierarchy doğru (yukarıdaki tablo)
- [ ] Dark mode layering (4+ katman, shadow yerine border)
- [ ] Motion timing uygun band'de (80-120 / 150-200 / 300-400)
- [ ] Easing doğru tür (default spring / celebration / entry)
- [ ] Staggered entry 40-80ms delay
- [ ] Variant × state tablosu (default/hover/active/disabled/loading/focus)
- [ ] Mobile-first — safe-area, touch target, gesture
- [ ] Responsive breakpoint noktaları

**Checklist tam değilse çıktı bırakılmaz.**

---

## 10. Anti-patterns — Kaçınılacaklar

- **"Generic admin panel" görünümü** — Shadcn default mavi-gri + sans-serif kombinasyonu. İyiBiri brand'i kaybolur.
- **Over-designed empty state** — illustration devasa, copy uzun, 3 CTA. Birini seç.
- **Motion her yerde** — `animate` her componente eklemek. Sadece anlamlı olduğunda.
- **Hardcoded renk** — `style={{ color: '#E8C268' }}` — token'a çevir.
- **Uncalibrated shadow** — siyah koyu gölge dark mode'da batağa saplanıyor. Border veya glow.
- **Random font weight** — 400, 500, 600, 700 arası "500 de kullan" deme. Hierarchy'ye sadık kal.
- **Emoji in UI chrome** — button label, nav item'da emoji. Sadece avatar + rozet + celebration state'te.
- **İngilizce teknik terim UI'da** — "Loading..." değil "Yükleniyor..."; "Error" değil "Sorun".

---

## 11. İyiBiri "imza" craft noktaları (korumalı)

Bu 6 detay İyiBiri kimliğidir, yok edilmez:

1. **Gold glow hero shadow** `0 8px 32px rgba(232,194,104,0.35)` — premium hissi.
2. **Fraunces italic vurgu** hero başlıklarda tek kelime italik + gold.
3. **Cream × ink-900 kontrast** — paper-in-dark hissi.
4. **Rounded-3xl hero / rounded-2xl card / rounded-xl input / rounded-full chip** — radius scale tutarlı.
5. **KarmaCounter tabular-nums font-display** — number as identity.
6. **"Sen" dili microcopy** — her CTA, her empty state, her hata mesajı.

---

## 12. Kaynak + okuma listesi

- **iOS Human Interface Guidelines** — developer.apple.com/design/human-interface-guidelines
- **Material Design 3** — m3.material.io
- **Refactoring UI** (Steve Schoger) — design detail bible
- **Mobbin** — mobbin.com (mobile app screenshot reference library)
- **Dribbble "mobile dark app"** — craft inspiration (filter quality)
- **Linear changelog** — linear.app/changelog (craft storytelling)
- **The Browser Company blog** — thebrowser.company (design rationale)

---

## Son söz

Bu skill "iyi görünüyor" seviyesinden "tier-1 app'lerin yanında öne çıkıyor" seviyesine yükseltir. Her UX/UI çıktısı öncesi bu dosya OKUNUR — sadece referans değil, uygulanmış. Checklist tam değilse çıktı hazır değil.
