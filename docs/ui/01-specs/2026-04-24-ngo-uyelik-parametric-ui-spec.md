# UI Spec — NGO Üyelik Parametric Flow (V1'in en büyük P0)

**Tarih:** 2026-04-24
**Sahip:** ui-designer
**Durum:** ready-for-implementation
**Kaynaklar:**
- UX audit: `docs/ux/03-heuristics/2026-04-24-ngo-membership-parametric-heuristik-audit.md`
- UX brief: `docs/product/02-briefs/ux/2026-04-24-ngo-membership-parametric.md`
- ADR-005 (pilot 3 STK), ADR-007 (parametric fee), ADR-008 v2 (payment routing)

**Skill usage:**
- ✅ `visual-spec-writing` — spec şablonu
- ✅ `design-system-audit` — token doğrulama
- ✅ `mobile-app-polish-standards` — Stripe/Revolut/Monzo payment craft + iOS sheet pattern

---

## 1. Amaç

Üyelik akışının 5-step flow UI'ı. 3 fee mode (TEMA age_tiered, HAYTAP monthly, LÖSEV donation_based) + 3 payment routing (Embedded/Passthrough/Marketplace) aynı component mimarisinde farklı variant'larla render. UX audit'in Kritik 3 bulgusunu çözer: progress bar, KVKK enforcement, impact statement.

---

## 2. 5-Step Flow Layout

```
Adım 1 — Tier Seçim         Adım 2 — Form             Adım 3 — KVKK
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ ← ● ○ ○ ○ ○ ✕   │       │ ← ● ● ○ ○ ○ ✕   │       │ ← ● ● ● ○ ○ ✕   │
│  1/5  Adım 1    │       │  2/5  Adım 2    │       │  3/5  Adım 3    │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│  [TEMA hero]     │       │ Birkaç bilgi     │       │ Son adım         │
│  Üye olmak       │       │ gerekiyor        │       │                  │
│                  │       │                  │       │ ☐ İyiBiri KVKK   │
│  ● Yetiskin₺256 │       │ Meslek [____]    │       │ ☐ TEMA Aydınlat. │
│  ○ Genç ₺15     │       │ Neden [____]     │       │                  │
│                  │       │                  │       │ ℹ️ 14 gün cayma  │
│ Vergi indirimli✓ │       │ [otomatik dolu]  │       │                  │
│                  │       │                  │       │ [Ödemeye geç     │
│ Yıllık 12 ağaç   │       │                  │       │     — ₺256]      │
│ dikimi           │       │                  │       │                  │
│                  │       │                  │       │                  │
│ [Devam et →]     │       │ [Devam et →]     │       │ [Ödemeye geç →]  │
└──────────────────┘       └──────────────────┘       └──────────────────┘

Adım 4 — Ödeme             Adım 5 — Başarı
┌──────────────────┐       ┌──────────────────┐
│ ← ● ● ● ● ○ ✕   │       │      ● ● ● ● ●   │
│  4/5  Güvenli öd │       │      Başarı!     │
├──────────────────┤       ├──────────────────┤
│                  │       │                  │
│ [🍎 Apple Pay]   │       │   ●              │
│ [G Google Pay]   │       │  ═══  gold ring  │
│ veya             │       │  ✓                │
│                  │       │                  │
│ [processor       │       │ Üye oldun 🎉     │
│   iframe         │       │ +50 Karma hediye │
│   embed]         │       │                  │
│                  │       │ Yılda 12 ağaç    │
│ ℹ️ Kart saklamaz │       │ dikeceksin       │
│                  │       │                  │
│                  │       │ [Ana sayfaya dön]│
└──────────────────┘       └──────────────────┘
```

---

## 3. Progress Bar (UX Audit Kritik 1 çözümü)

Her sayfa üstünde sticky:
```tsx
<StepProgressBar current={2} total={5} label="Birkaç bilgi" />
```

**Görsel:**
- 5 segment ince çubuk (h-1 `bg-ink-700`)
- Current + önceki segmentler gold
- Dots YOK (Onboarding'deki stil ama 5-segment)
- Label sağ tarafta küçük: "2/5 · Birkaç bilgi"

---

## 4. Tier Seçim (Adım 1) — 3 Mode Variant

### Mode A: age_tiered (TEMA)

**Card-as-hero** (Revolut pattern) — her tier mini kart:

```
┌──────────────────────────────┐
│ ● Yetişkin (büyükşehir)      │  ← selected, gold accent
│   ₺256 / yıl                 │
│   ↳ Yıllık 12 ağaç dikimi   │  ← impact statement
├──────────────────────────────┤
│ ○ 14-24 yaş                  │
│   ₺15 / yıl                  │
│   ↳ Öğrenci paketi          │
├──────────────────────────────┤
│ ○ Yetişkin (diğer şehir)    │
│   ₺128 / yıl                 │
└──────────────────────────────┘
```

- Pre-selected: kullanıcının yaşına + şehrine otomatik match (`profiles.age_range` + `profiles.city`)
- Tap → selected state (haptic Light) + border gold
- Her kart altında impact statement (I3 çözüm)

### Mode B: monthly (HAYTAP)

Tek kart:
```
┌──────────────────────────────┐
│ ● Aylık destek               │
│   ₺30 / ay (günde ₺1)       │
│   ↳ Sokak hayvanlarına       │
│     sıcak mama                │
│                              │
│ ⓘ Her ay otomatik çekilir.   │  ← auto-renew açık uyarı
│   İstediğin an iptal.        │
└──────────────────────────────┘
```

### Mode C: donation_based (LÖSEV)

Chip list + custom input:
```
Suggested amounts:
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ 50  │ │ 100 │ │ 250 │ │ 500 │
└─────┘ └─────┘ └─────┘ └─────┘

Özel tutar:
┌──────────────────────────────┐
│ ₺ [____] .00                 │
└──────────────────────────────┘

↳ Her bağış üyelik kaydı doğurur
```

---

## 5. Token Kullanımı

| Alan | Token |
|---|---|
| Page bg | `bg-background` (dark: ink-900) |
| Progress bar track | `bg-ink-700` |
| Progress bar fill | `bg-gold` |
| Progress label | `text-ink-300` |
| Tier card default | `bg-card` + `border-ink-600` |
| Tier card selected | `bg-gold/5` + `border-gold` + ring-2 gold/20 |
| Tier price (hero) | `text-cream font-display text-2xl tabular-nums` |
| Impact statement | `text-gold text-xs italic` |
| Auto-renew uyarı | `bg-clay/10 border-clay/30 text-clay-light text-xs` |
| KVKK checkbox | `accent-gold` |
| 14-gün cayma info | `bg-gold/10 text-gold text-xs` |
| Primary CTA | `bg-gold text-ink rounded-xl h-13 font-bold` |
| Disabled CTA | `bg-ink-700 text-ink-400` + cursor-not-allowed |

---

## 6. KVKK Çifte Onay (Adım 3) — Kritik 2 çözüm

```tsx
<label className="flex items-start gap-3 p-4 rounded-2xl cursor-pointer active:bg-ink-800">
  <Checkbox checked={kvkk1} onChange={setKvkk1} size="lg" />
  <div>
    <p className="text-sm font-medium">
      İyiBiri Gizlilik Politikası'nı okudum, onaylıyorum
    </p>
    <Link href="/legal/kvkk" className="text-xs text-gold mt-1">
      Detayı oku →
    </Link>
  </div>
</label>

<label className="..."> {/* aynı pattern STK için */}
  <Checkbox checked={kvkk2} onChange={setKvkk2} size="lg" />
  <div>
    <p className="text-sm font-medium">
      TEMA Aydınlatma Metni'ni okudum, üyelik verimin
      paylaşılmasına izin veriyorum
    </p>
    <Link href={ngo.privacy_url} className="text-xs text-gold mt-1">
      Detayı oku →
    </Link>
  </div>
</label>

{/* 14-gün cayma hakkı banner */}
<div className="rounded-xl bg-gold/10 border border-gold/20 p-4 mt-4">
  <p className="text-xs">
    <strong>14 gün cayma hakkın var</strong> — İlk 14 gün içinde iptal edersen
    ödemenin tamamı iade edilir. (TR 6502 Tüketici Kanunu)
  </p>
</div>

<Button
  disabled={!kvkk1 || !kvkk2}
  title={!kvkk1 || !kvkk2 ? 'KVKK onaylarını kontrol et' : ''}
>
  Ödemeye geç — ₺256
</Button>
```

**Davranış:**
- Button disabled until **BOTH** checkbox checked
- Tooltip hover'da açıklayıcı
- Haptic Medium tap geçişte
- Server-side validation: API `form_data.kvkk_accepted_at` + `form_data.ngo_kvkk_accepted_at` timestamp ZORUNLU

---

## 7. Payment (Adım 4) — 3 Mod Variant

### Mod 1: Embedded (TEMA fonzip widget)

```
┌──────────────────────────────┐
│ ← ● ● ● ● ○ ✕               │
├──────────────────────────────┤
│                              │
│ Güvenli ödeme                │
│                              │
│ [🍎 Apple Pay] [G Google Pay]│  ← iyzico native, üstte
│                              │
│ ───── veya kart ile ─────    │
│                              │
│ ┌──────────────────────────┐ │
│ │                          │ │
│ │  [fonzip iframe]         │ │  ← embed widget
│ │                          │ │
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
│ ℹ️ Ödeme TEMA'nın fonzip     │
│   altyapısı üzerinden        │
│   güvenli işlenir.           │
│   İyiBiri kart bilgini       │
│   saklamaz.                  │
│                              │
└──────────────────────────────┘
```

### Mod 2: Passthrough (Kızılay — rare)

In-app browser modal overlay:
```tsx
<InAppBrowserModal url={ngo.payment_url} />
```
- Capacitor `Browser.open({ url, presentationStyle: 'popover' })`
- Callback return URL ile webhook → Karma

### Mod 3: Marketplace (TEGV, LÖSEV — iyzico sub-merchant)

Aynı iframe pattern as Mod 1, ama iyzico Checkout Form:
```
[iyzico Checkout Form iframe]
```

---

## 8. Success State (Adım 5) — Celebration

```tsx
<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
>
  <GoldRingCheckIcon size={96} />
</motion.div>

<h1 className="font-display text-3xl font-medium mt-6">
  Üye oldun 🎉
</h1>

<KarmaCounter from={0} to={50} label="+" /> {/* Karma bonus animate */}

<p className="text-sm italic text-gold mt-3">
  Yılda 12 ağaç dikeceksin
</p>

<Confetti duration={1500} /> {/* canvas-confetti */}

<Button className="mt-8">
  Ana sayfaya dön
</Button>
```

- Haptic Heavy + notification Success
- Celebration overlay 1.5s
- Karma count-up 800ms
- Share prompt (opsiyonel): "Arkadaşına söyle"

---

## 9. Motion Spec

| Event | Animation |
|---|---|
| Page enter (iOS push) | `x: 100 → 0`, spring 300/30 |
| Tier selected | Border pulse (gold) + haptic Light |
| KVKK checkbox | Check scale 0 → 1.2 → 1, spring + haptic Light |
| Button enabled | Opacity 0.5 → 1, 200ms |
| Iframe loading | skeleton 200ms delay → spinner |
| Success ring | scale spring + ring expand |
| Karma counter | count-up 800ms, cubic |
| Confetti | 1.5s 30 particles |

Reduced-motion: opacity-only, no transforms.

---

## 10. State Coverage

### Loading states
- Initial: skeleton tier cards (3-4 kart shape)
- Form submit: spinner in button
- Iframe loading: skeleton 200ms → iframe loaded event

### Error states
- Form validation: inline error text-clay + shake (haptic Warning)
- Payment fail: overlay with retry + alt kart + support
  - iyzico error code → TR mapping:
    - `CARD_NOT_VALID` → "Kartında bir sorun var. Numaranı kontrol et."
    - `INSUFFICIENT_FUNDS` → "Kart bakiyen yetersiz. Başka kart dene."
    - `INVALID_CVV` → "CVV kodu eksik veya yanlış."
    - Generic → "Ödeme tamamlanamadı. Tekrar dene veya destek yaz."
- Network fail: "Bağlantını kontrol et" + retry

### Empty states
- Donation_based'de min_amount altı: disabled "Minimum ₺{min} "

### Success state
- Full celebration (Adım 5, above)

---

## 11. Accessibility

- [x] Heading hierarchy h1 → h2
- [x] Checkbox `<input type="checkbox">` gerçek, aria-label
- [x] Touch target ≥44px
- [x] Focus-visible ring (gold offset-2)
- [x] Form error `aria-describedby`
- [x] Payment iframe `<iframe title="Ödeme formu">`
- [x] Progress bar `role="progressbar" aria-valuenow="2" aria-valuemax="5"`
- [x] Success state `role="status" aria-live="polite"`
- [x] KVKK metinleri SR okuyucu için expanded link

---

## 12. Responsive

Mobile-first (max-w-lg). Tablet'te iframe genişler (max-w-xl). Desktop V1'de optimize değil.

---

## 13. Components Needed

- `components/membership/step-progress-bar.tsx` (yeni)
- `components/membership/tier-card.tsx` (yeni) — 3 variant
- `components/membership/kvkk-checkbox.tsx` (yeni)
- `components/membership/payment-embed.tsx` (yeni) — 3 mode router
- `components/membership/success-celebration.tsx` (yeni)
- Existing: `components/ui/{button,input,label,checkbox}.tsx`

---

## 14. Implementation order (frontend-engineer)

1. Migration 009 + 010 apply (supabase-backend)
2. `lib/supabase/queries/ngo-memberships.ts` — fetch ngo + fee_config
3. Component scaffold 5 yeni dosya
4. Step flow state machine (5 adım)
5. Payment iframe integration (iyzico ilk, fonzip sonra)
6. KVKK enforcement + validation
7. Success celebration
8. Error mapping
9. Test: TEMA + HAYTAP + LÖSEV uçtan uca
10. A11y test

**Estimated:** 2-3 hafta.

---

## 15. Self-Audit

- [x] 5 step layout net
- [x] 3 fee mode variant (TEMA/HAYTAP/LÖSEV)
- [x] 3 payment mode variant (Embedded/Passthrough/Marketplace)
- [x] Token kullanımı atlas 6'ya referanslı
- [x] KVKK çifte onay + 14-gün cayma UI — audit Kritik 2 çözüm
- [x] Impact statement tier altında — Kritik 3 çözüm
- [x] Progress bar — Kritik 1 çözüm
- [x] Motion spec 5 event
- [x] State coverage (loading/empty/error/success)
- [x] Accessibility checklist
- [x] 3 app benchmark (Stripe + Revolut + Monzo)

✅ Pass — frontend-engineer implement başlayabilir.

## Handoff log

Bu spec'i alıp üreten agent'ların zinciri. Protokol: `.claude/skills/agent-communication-protocol/SKILL.md` Katman A.

- 2026-04-24 07:30 — **frontend-engineer** ✅ — **5 component scaffold**: `step-progress-bar.tsx` + `tier-card.tsx` + `kvkk-checkbox.tsx` + `payment-embed.tsx` + `success-celebration.tsx`. *(retroactive)*
- 2026-04-24 08:00 — **frontend-engineer + supabase-backend** ✅ — **full-stack integration + 28 unit test**: `lib/supabase/types.ts` + `lib/membership/fee-config.ts` + `lib/membership/actions.ts` + flow page + migration 012. *(retroactive)*
- 2026-04-24 08:30 — **frontend-engineer + supabase-backend** ✅ — **sandbox + celebration + webhook**: dev simulator + celebration-client + webhook iskelet. *(retroactive)*
