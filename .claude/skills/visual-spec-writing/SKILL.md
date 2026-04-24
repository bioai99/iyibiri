---
name: visual-spec-writing
description: UI visual spec yazma metodu. Ekran kompozisyonu, hiyerarşi, token kullanımı, variant × state tablosu, motion spec, responsive kural, a11y kontrol listesi. ASCII wireframe kullanımı + Tailwind class referansları ile implementable ama prescriptive olmayan çıktı. Yeni ekran/component için UI spec çıkarırken bu skill'i kullan.
---

# Visual Spec Writing

Spec, UX brief'i alıp frontend-engineer/design-system-keeper için **implementable** bir görsel tarif üretir. Ama "tam JSX kodu" vermez — yeterli netlikte yönlendirir, uygulama kararı kodlama agent'ına bırakılır.

## 1. Felsefe

- **Outcome + kısıtlar.** "Primary buton" de, tam kod verme.
- **Token kullan.** Her renk/spacing/radius/shadow referansı Tailwind token adıyla (`bg-ink-800`, `shadow-md`, `rounded-2xl`).
- **Wireframe > mockup.** ASCII box yeter, pixel-perfect Figma şart değil.
- **Variant × state tablosu.** En değerli bölüm. Default / hover / active / disabled / loading / focus.
- **Atlas'a sadık.** Bölüm 6 tek yetkili renk/font/radius kaynağı.

## 2. Spec şablonu

```markdown
# [Feature / Ekran] — UI Spec

**Tarih / Sahip (ui-designer) / İlgili UX brief / Durum: draft|ready**

## 1. Amaç (1 paragraf)
Ne ekran, kim için, hangi yaşantıya hizmet ediyor.

## 2. Layout (ASCII wireframe)
```
┌──────────────────────────────┐ ← sticky header (bg-background/90 backdrop-blur)
│ ← Geri         Başlık     ⋯ │
├──────────────────────────────┤
│                              │
│   Hero card                  │ ← rounded-3xl, gold glow shadow
│   (gold gradient band üstte) │
│                              │
│   +250 Karma hero            │
│                              │
├──────────────────────────────┤
│                              │
│   Mission card #1            │ ← rounded-2xl, shadow-md
│   Mission card #2            │
│   Mission card #3            │
│                              │
├──────────────────────────────┤
│  Bottom nav (fixed)          │ ← pb-safe
└──────────────────────────────┘
```

## 3. Hiyerarşi
1. Hero card (dikkat merkezinde)
2. Mission list (ana etkileşim)
3. Header navigation (sekonder)
4. Bottom nav (persistent)

## 4. Token kullanımı

### Renkler
| Alan | Token (Tailwind) | Notes |
|---|---|---|
| Background | `bg-background` (light: cream, dark: ink-900) | Atlas 6 |
| Card | `bg-card` | — |
| Hero band | `bg-gradient-to-r from-gold-dim to-gold` | İmza gradient |
| Hero glow | `shadow-[0_8px_32px_rgba(232,194,104,0.35)]` | **İmza gölge** — kullanımı kontrol |
| Text primary | `text-foreground` | Light: ink-900, dark: cream |
| Text muted | `text-muted-foreground` | Secondary |
| Primary CTA | `bg-gold text-primary-foreground` | gold #E8C268 × ink-900 |
| Karma accent | `text-gold font-display tabular-nums` | — |

### Typography
| Öğe | Class | Örnek |
|---|---|---|
| Hero number | `font-display font-black text-5xl tabular-nums` | "+250" |
| Hero title | `font-display font-bold text-2xl tracking-[-0.02em]` | "Bu hafta..." |
| Card title | `font-sans font-semibold text-base` | Mission başlık |
| Body | `font-sans font-normal text-sm text-muted-foreground` | Açıklama |
| Label/chip | `font-sans font-medium text-xs uppercase tracking-wide` | "Doğa" |

### Radius
| Kart türü | Class |
|---|---|
| Hero | `rounded-3xl` (32px) |
| Mission card | `rounded-2xl` (24px) |
| Chip / small pill | `rounded-full` |
| Form input | `rounded-xl` (20px) |
| Button (primary) | `rounded-xl` (20px) |

### Shadow
| Use | Class |
|---|---|
| Kart default | `shadow-md` |
| Kart hover | `shadow-lg` |
| Hero | İmza gold glow (arbitrary, yukarıda) |

### Spacing
- Container: `max-w-lg mx-auto px-4`
- Section arası: `space-y-6` (24px)
- Kart arası: `space-y-3` (12px)

## 5. Variant × state tablosu

### Primary Button

| State | Background | Text | Shadow | Motion |
|---|---|---|---|---|
| Default | `bg-gold` | `text-primary-foreground` | — | — |
| Hover | `bg-gold/90` | same | `shadow-md` | — |
| Active (pressed) | `bg-gold` | same | — | `whileTap={scale:0.97}` |
| Disabled | `bg-muted` | `text-muted-foreground` | — | opacity-50 |
| Loading | `bg-gold` | hidden | — | Spinner overlay |
| Focus-visible | same | same | `ring-2 ring-ring ring-offset-2` | — |

### Mission Card

| State | Border | Shadow | Transform |
|---|---|---|---|
| Default | `ring-1 ring-border` | `shadow-md` | — |
| Hover | same | `shadow-lg` | `-translate-y-0.5` |
| Active | same | `shadow-md` | `whileTap={scale:0.98}` |
| Loading (skeleton) | — | — | shimmer animation |
| Empty slot | `border-dashed border-muted` | — | — |

## 6. Motion spec

- **Entry:** `initial={{opacity:0, y:16}} animate={{opacity:1, y:0}}`, stagger `i*0.05`
- **Tap:** `whileTap={{scale:0.97}}` (Kart), `{scale:0.93}` (Buton — daha sıkı feedback)
- **Hero Karma counter:** `animate(from, to, {duration:0.8, ease:[0.16, 1, 0.3, 1]})` + scale pulse
- **Reduced motion:** `useReducedMotion` hook → entry kapalı, opacity-only.

## 7. Responsive
- Mobile-first. Container `max-w-lg` (~512px).
- Tablet+: aynı container, sadece padding-x artar (`md:px-6`).
- Landing (bu spec dışı): `max-w-6xl`.

## 8. A11y kontrol listesi
- [ ] Primary CTA kontrast AA (gold × ink-900 OK, kontrol gold-dim × cream)
- [ ] Touch target ≥ 44×44 (bottom nav item, chip)
- [ ] Focus-visible ring her interaktif element için
- [ ] `<button>` kullan, `onClick div` değil
- [ ] Icon-only button → `aria-label`
- [ ] Heading hierarchy: h1 → h2 → h3 (atlanmadan)
- [ ] `prefers-reduced-motion` sayılı

## 9. State coverage (zorunlu)
- [ ] Default
- [ ] Loading (skeleton)
- [ ] Empty
- [ ] Error
- [ ] Success (varsa)

## 10. Visual Hierarchy Discipline

**Kaynaklar:**
- [Refactoring UI — Adam Wathan + Steve Schoger](https://refactoringui.com/)
- [Josh Comeau — Typographic Hierarchy](https://www.joshwcomeau.com/)
- [Pimp my Type — Type Scale](https://pimpmytype.com/hierarchy/)

**Temel ilke:** "Renk son aşama" (constraint-based design). Grayscale mockup'ta hierarchy var mı?

### Grayscale-first approach

1. **Renksiz mockup yap.** Sadece spacing + size + weight ile hierarchy.
2. **Aşağıdan yukarı oku:** Hangi element ilk okunur? İkinci?
3. **Whitespace = prominence.** Çok boşluk = az önem, sıkı spacing = yüksek önem.

**Example (İyiBiri dashboard):**

```
┌─────────────────────────────────┐
│ Header (sticky)                 │ ← Min spacing, dense
├─────────────────────────────────┤
│                                 │
│  +250 Karma                     │ ← Large gutter (prominent)
│  (Number dominant)              │
│                                 │
├─────────────────────────────────┤
│ Mission card                    │ ← Medium spacing
│ Card title + desc               │
├─────────────────────────────────┤
│ Footer                          │ ← Minimal
└─────────────────────────────────┘
```

Grayscale: +250 sayısı baskın (size + weight) ve white space → karşısındaki öğeler secondary.

### Size scale disiplini

**İyiBiri typography:**

| Use | Size (px) | Line height | Weight | Note |
|---|---|---|---|---|
| Hero number | 48 (5xl) | 1.2 | 900 (black) | Karma counter |
| Hero title | 24 (2xl) | 1.3 | 700 (bold) | "Bu hafta..." |
| Card title | 16 (base) | 1.5 | 600 (semibold) | Mission başlık |
| Card body | 14 (sm) | 1.6 | 400 (normal) | Description |
| Label/chip | 12 (xs) | 1.4 | 500 (medium) | Category tag |
| Caption | 12 (xs) | 1.4 | 400 (normal) | Timestamp |

**Discipline:** 4px grid. 12 → 14 → 16 → 20 → 24 → 32 → 48. Keyfi değer yasak (e.g., 17px).

### Font weight hierarchy

**Atlas palette:**
- **Regular (400):** Body text + descriptions
- **Medium (500):** Labels + chips + secondary CTA
- **Semibold (600):** Card titles + section headers
- **Bold (700):** Page title + hero text + primary CTA
- **Black (900):** Hero number (Karma counter only)

**Rule:** Max 3 weight per screen. Tip: Regular + Semibold + Bold = enough. Black sadece imza element'te.

### Color = tertiary (not primary)

**Mistake:** "Renk = hierarchy creator" (red, green, gold). Yanlış.

**Right:** Size + weight → hierarchy. Renk = semantik (success/warning/info/action).

**Example:**

```
GRAYSCALE DONE FIRST:
┌──────────┐
│ HERO     │ ← Size 48 + weight 900
│ body txt │ ← Size 14 + weight 400
│ [Button] │ ← Size 16, weight 600, ← EMPHASIS already
└──────────┘

THEN ADD COLOR:
┌──────────────┐
│ +250         │ ← gold (semantik: success accent)
│ You earned   │ ← ink-800 (neutral, body)
│ [Claim >]    │ ← gold bg (CTA color = primary action)
└──────────────┘
```

Renk, hierarchy destekler, yaratmaz.

### Depth via shadow + layer

**Shadow = visual depth (tier):**

| Tier | Shadow | Use | Example |
|---|---|---|---|
| **Tier 1 (floating)** | `shadow-lg` + blur 16px | Elevated card, modal overlay | Mission card on hover |
| **Tier 2 (surface)** | `shadow-md` + blur 8px | Card default, dropdown | Mission card default |
| **Tier 3 (flat)** | `shadow-sm` / none | Background, input field | Form field, background |

**İyiBiri hero card:** `shadow-[0_8px_32px_rgba(232,194,104,0.35)]` (gold glow) = **imza detail** → tier 1 prominence.

### Spacing scale disiplini

**8px base grid:**

| Value | Use |
|---|---|
| 4px (0.5) | Micro-spacing (icon gap) |
| 8px (1) | Button padding horizontal |
| 12px (1.5) | Card padding top/bottom |
| 16px (2) | Section gap, card gap |
| 24px (3) | Major section gap |
| 32px (4) | Hero section gap |

**Consistency check:** Spec'te `16px` yaz, Tailwind: `gap-4`. Pixel ≠ Tailwind token — token kullan.

### Kontrol listesi — Visual Hierarchy

- [ ] Grayscale mockup var mı? (Renk olmadan hierarchy görülüyor mu?)
- [ ] Size scale tutarlı mı? (12 → 14 → 16 → 20 → 24 arasında mı?)
- [ ] Weight ladder tutarlı mı? (Max 3 weight, her biri neden?)
- [ ] Color = accent, not hierarchy (primary info size + weight ile mi gösterildi?)
- [ ] Shadow tiers (tier 1/2/3) tutarlı mı?
- [ ] Spacing grid 8px base mi? (Token'lar gap-1 / gap-2 / gap-3 / gap-4 mi?)
- [ ] Whitespace prominent element'i destekliyor mu?

---

## 11. Motion Choreography Patterns

**Kaynaklar:**
- [Rauno Freiberg — Invisible Details of Interaction Design](https://every.to/p/invisible-details-of-interaction-design)
- [Emil Kowalski — Sonner/Vaul motion patterns](https://sonner.emilkowal.ski/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [UX Tools — Walt Disney Motion Principles](https://www.uxtools.co/blog/your-ui-needs-more-walt-disney)

**Temel ilke:** Motion = feedback, not decoration. Robustness = network delay + user interruption altında test et.

### Staggered delays anatomy

**Problem:** Simultaneous animation = mechanical, insan gözü takip edemez.

**Solution:** Staggered delay (sequential start times).

```
List entrance (3 items):

Item 1: ──[Animate]──────
Item 2: ─────[Animate]───
Item 3: ────────[Animate]
        0ms   50ms   100ms (delay increment)
```

**Pattern:**

```typescript
// Framer Motion
{items.map((item, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.05 }} // 50ms stagger
  >
    {item}
  </motion.div>
))}
```

**Constraint:** Max 8 item. 9+ → loop kapalı, tekil pulse animation.

### Spring defaults — İyiBiri tuning

**İyiBiri default (tier-1 app pattern):**

```typescript
spring: { stiffness: 400, damping: 30 }
// Mass ~1 (implicit), damping ratio ~0.75 (crisp + lively)
```

**Alternative:**

| Stiffness | Damping | Feel | Use |
|---|---|---|---|
| 400 | 30 | Crisp + snappy | Default (button tap, card lift) |
| 200 | 20 | Soft + floaty | Delightful (hero counter animation) |
| 170 | 26 | Molasses-y | Slow emphasis (loading state) |

### Reduce motion respect (WCAG critical)

**Mandatory:** Her animation'ın `useReducedMotion` check'i.

```typescript
import { useReducedMotion } from 'framer-motion';

export function AnimatedCard({ children }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={{ y: prefersReducedMotion ? 0 : -4 }}
      transition={prefersReducedMotion ? { duration: 0 } : undefined}
    >
      {children}
    </motion.div>
  );
}
```

**Fallback:** Reduction = instant (duration: 0) OR opacity-only (remove y/x transform).

### Exit animation pattern (AnimatePresence)

**Context:** Modal kapalı, component unmount. Animation tamamlanmadan DOM silinme = hecking abrupt.

**Pattern:**

```typescript
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

### Hover vs. Tap — Web + Mobile fark

**Desktop (web):** `whileHover` mevcut (mouse over).  
**Mobile:** Hover = touch + hold (awkward). Tap'a odaklan.

```typescript
// Desktop: hover feedback
<motion.button whileHover={{ scale: 1.02 }} />

// Mobile: tap feedback (haptic + scale)
<motion.button whileTap={{ scale: 0.97 }} />

// Best: both
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.97 }}
/>
```

**İyiBiri constraint:** Mobile-first, desktop hover secondary.

### Micro-interaction checklist

- [ ] Button tap: `whileTap={{ scale: 0.93 }}`? (Feedback loop)
- [ ] Card hover: `whileHover={{ y: -4 }}` + shadow lift? (Elevation)
- [ ] Form error: Shake animation? (`rotate: [-2, 2, -2, 0]` + stagger)
- [ ] Loading state: Spinner OR skeleton + shimmer?
- [ ] Modal entry: `initial={{ scale: 0.9, opacity: 0 }}`?
- [ ] Modal exit: `exit={{ scale: 0.9, opacity: 0 }}` (AnimatePresence)?
- [ ] List entrance: Stagger (max 8 item)?
- [ ] Reduced motion fallback: Her animation'da `useReducedMotion` check?

### Example: İyiBiri mission-card stagger + tap

```typescript
// Spec:
// - List entrance: 50ms stagger per item, max 8 cards
// - Tap feedback: scale 0.97 + haptic (if native)
// - Reduced motion: Entrance off, tap instant

// Handoff to frontend:
export const MissionCardStagger = {
  container: {
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1,
        },
      },
    },
  },
  item: {
    variants: {
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0 },
    },
  },
  tap: {
    whileTap: { scale: 0.97 },
  },
};
```

### Anti-pattern: Motion abuse

- **Animation > 300ms + no skip:** User interrupt frustration.
- **Simultaneous 5+ element:** Chaos, muddled.
- **Bounce spring (damping < 20):** Playful but tier-1 apps don't bounce (iOS, Linear, Arc don't).
- **Disable reduced motion:** A11y violation.

### Kontrol listesi — Motion Choreography

- [ ] Stagger defined (delay increment + max item)?
- [ ] Spring defaults (stiffness/damping) İyiBiri pattern ile mi?
- [ ] useReducedMotion check her animation'da?
- [ ] Exit animation (AnimatePresence) modal/overlay'de?
- [ ] Hover vs. tap separated (desktop vs. mobile)?
- [ ] Micro-interaction checklist (button/card/form/error/loading) done?
- [ ] Animation duration (max 300ms per segment)?
- [ ] Spec → handoff (Framer Motion pattern code) var mı?

---

## 12. Handoff
- **Target agent:** frontend-engineer (implementation) + design-system-keeper (yeni token varsa).
- **Dosya:** `docs/ui/01-specs/[...].md`
- **ADR:** [varsa link, yoksa "gerekmedi"]
- **Sonraki tur:** Frontend uyguladıktan sonra `05-reviews/` altında visual QA.
```

## 3. Pişmanlık listesi (kaçınılacaklar)

- **Tam JSX kodu yazma.** Agent spec yazar, implementer kodlar.
- **Pixel değerleri keyfi.** 17px radius önerme. Atlas'taki 16/20/24/32 arasından seç.
- **Variant eksik.** Hover var ama focus yok → klavye kullanıcıları için bozuk.
- **State listesi eksik.** Default + loading → yeterli değil, en az default+loading+empty+error.
- **"Güzel görünsün" kelimesi.** Ölçülebilir kriter: contrast ratio, spacing consistency.
- **Atlas dışında bir token kullanma.** Yeni token → ADR → design-system-keeper.

## 13. Kontrol listesi — Spec hazırlığı

**Core:**
- [ ] ASCII wireframe var mı?
- [ ] Hiyerarşi açık mı (sayılı liste)?
- [ ] Token tablosu eksiksiz (renk + typo + radius + shadow + spacing)?
- [ ] Variant × state tablosu en az 1 kritik element için var mı?
- [ ] Motion spec (veya "bu ekranda motion yok" beyanı) var mı?
- [ ] Responsive not var mı?
- [ ] A11y kontrol listesi işaretli mi?
- [ ] State coverage 5 başlık kontrol edildi mi?

**Visual Hierarchy (Bölüm 10):**
- [ ] Grayscale mockup var mı?
- [ ] Size scale tutarlı mı? (8px/12px/14px/16px/20px/24px grid)
- [ ] Weight ladder (max 3) tutarlı mı?
- [ ] Color semantic (success/warning/action), not hierarchy?
- [ ] Shadow tiers uygulanmış mı?

**Motion Choreography (Bölüm 11):**
- [ ] Stagger pattern (delay increment + max 8 item) tanımlanmış mı?
- [ ] Spring defaults (stiffness 400, damping 30) İyiBiri pattern mi?
- [ ] useReducedMotion fallback var mı?
- [ ] Exit animation (AnimatePresence) modal'de var mı?
- [ ] Tap feedback (scale 0.97) mobil context'te mi?
- [ ] Animation duration (max 300ms) tutarlı mı?

**Handoff:**
- [ ] Handoff satırı (kime, nereye) yazıldı mı?

Kontrol listesi tam değilse spec frontend'e devredilemez.
