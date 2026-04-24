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

## 10. Handoff
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

## 4. Kontrol listesi

- [ ] ASCII wireframe var mı?
- [ ] Hiyerarşi açık mı (sayılı liste)?
- [ ] Token tablosu eksiksiz (renk + typo + radius + shadow + spacing)?
- [ ] Variant × state tablosu en az 1 kritik element için var mı?
- [ ] Motion spec (veya "bu ekranda motion yok" beyanı) var mı?
- [ ] Responsive not var mı?
- [ ] A11y kontrol listesi işaretli mi?
- [ ] State coverage 5 başlık kontrol edildi mi?
- [ ] Handoff satırı (kime, nereye) yazıldı mı?

Checklist tam değilse spec frontend'e devredilemez.
