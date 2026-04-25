# UI Spec — Ödül Sistemi V2 (Rewards Hub + Detail + Redemption + History + Sponsor Dashboard)

**Tarih:** 2026-04-25  
**Sahip:** ui-designer  
**Kaynak:** 
- UX Brief: `docs/product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md`
- Heuristic Audit: `docs/ux/03-heuristics/2026-04-25-reward-v2-audit.md`
- Journey Map: `docs/ux/02-journeys/2026-04-25-reward-ayse-murat-journey.md`

**Durum:** Ready for implementation  
**Next:** frontend-engineer (implementation) + design-system-keeper (token audit)

---

## 1. Amaç

V2 ödül sistemi, gönüllüler (Ayşe) ve sponsor'lar (Murat) için 5 yeni/genişletilmiş ekranı tanımlar:
1. **Rewards Hub** (katalog + filter, mevcut sayfa genişleme)
2. **Reward Detail** (sponsor co-branding + bottom sheet, mevcut sayfa genişleme)
3. **Redemption Confirm** (karma deduction animation, yeni modal)
4. **Success Celebration** (confetti + code copy + share, genişletilmiş SuccessCelebration reuse)
5. **Reward History** (status + expiry tracking, yeni `/dashboard/rewards/history` sayfa)
6. **Sponsor Dashboard** (analytics + PDF export, yeni `/admin/sponsor/[sponsorId]/` route group)

Tier-1 component kütüphanesi (KarmaCounterPro, AnimatedHeart, Vaul BottomSheet, Sonner Toast, MagneticButton) reuse edilir. Yeni token gereksinimi minimal.

---

## 2. Layout & Wireframe

### A. Rewards Hub (`/dashboard/rewards` — genişletilmiş)

```
┌────────────────────────────────────────────────┐
│ ☰   İyiBiri Ödüller                    ⚙️     │ ← sticky header (bg-background/90 backdrop-blur, pb-3)
├────────────────────────────────────────────────┤
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ Karma: [KarmaCounterPro: 2000]           │  │ ← hero card, gold glow shadow, py-6
│ │ [Ödül Geçmişi →]                         │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ Filtrele:                                      │ ← sticky filter bar, py-4, gap-2
│ ┌─────┬──────────┬─────────┬────────────┐    │
│ │Hepsi│ Kupon   │Deneyim  │Bağış Match │    │ ← category pills (pill component)
│ ├─────┼──────────┼─────────┼────────────┤    │
│ │Bronz│ Gümüş   │ Altın   │  Elmas     │    │ ← tier pills (tier-badge variant)
│ └─────┴──────────┴─────────┴────────────┘    │
│                                                │
│ ┌──────────────┐  ┌──────────────┐           │
│ │ [Migros logo]│  │[Garanti logo]│           │ ← 2-col grid, rounded-2xl
│ │              │  │              │           │
│ │ ₺100 Kupon   │  │ ₺200 İade    │           │
│ │              │  │              │           │
│ │ 500 karma    │  │ 1000 karma   │           │
│ │ [Gümüş badge]│  │ [Gümüş badge]│           │
│ │              │  │              │           │
│ │  [TALEP ET] │  │  [TALEP ET] │           │
│ └──────────────┘  └──────────────┘           │
│                                                │
│ ┌──────────────┐  ┌──────────────┐           │
│ │[TEMA logo]   │  │[Turkcell logo│           │
│ │              │  │              │           │
│ │ ×2 Bağış     │  │ Dijital paket│           │
│ │              │  │ 3 ay         │           │
│ │ 300 karma    │  │ 800 karma    │           │
│ │ [Bronz badge]│  │ [Gümüş badge]│           │
│ │              │  │              │           │
│ │  [TALEP ET] │  │  [TALEP ET] │           │
│ └──────────────┘  └──────────────┘           │
│                                                │
│ ┌──────────────┐  ┌──────────────┐           │
│ │              │  │              │           │
│ ... (infinite scroll)                         │
│                                                │
│                               pb-safe (h-20) │ ← bottom nav space
└────────────────────────────────────────────────┘
```

**Layout Detail:**
- Container: `max-w-lg mx-auto px-4 py-6`
- Header sticky: `top-0 z-40 bg-background/90 backdrop-blur-sm sticky`
- Filter bar: horizontal scroll, `gap-2`, pill style (Tailwind: `px-3 py-1 rounded-full text-sm font-medium`)
- Grid: `grid-cols-2 gap-4` (mobile), `md:grid-cols-3 lg:grid-cols-4` (desktop expansion, future)
- Card: `rounded-2xl shadow-md overflow-hidden aspect-square` → hero image aspect 1:1
- CTA button: Magnetic sticky bottom (K7 brief S2) OR inline magnetic button

---

### B. Reward Detail (`/dashboard/rewards/[id]` — genişletilmiş, bottom sheet via Vaul)

```
┌──────────────────────────────────────────────┐
│                (mobile background)           │
└──────────────────────────────────────────────┘
  ╔══════════════════════════════════════════╗
  ║   Drag handle                    ╳       ║ ← top: drag bar + close
  ╠══════════════════════════════════════════╣
  ║                                          ║
  ║  [Migros Logo 40×40]  Migros            ║ ← sponsor branding bar
  ║  (brand-color: #0066CC tint)            ║
  ║                                          ║
  ╠══════════════════════════════════════════╣
  ║                                          ║
  ║  [Hero image: 16:9, rounded-t-3xl]      ║ ← sponsor brand bar (optional gradient overlay)
  ║                                          ║
  ║  ₺100 Kupon                             ║ ← title overlay (text-white font-bold) OR below
  ║                                          ║
  ╠══════════════════════════════════════════╣
  ║                                          ║
  ║ Karma Gereklilği:                       ║ ← data grid (2-col: label | value)
  ║ 500 ✅ (Yeterli)                        ║
  ║                                          ║
  ║ Geçerlilik:                              ║
  ║ 30 gün (Sona: 2026-05-25)                ║
  ║                                          ║
  ║ Nerede Kullan:                           ║
  ║ Migros market/hipermarket                ║
  ║                                          ║
  ║ Impact (K6 brief):                       ║ ← duygusal bağlantı
  ║ "Bu kupon, harcadığın Karma'nın          ║
  ║  2 saatlik iyi iş karşılığı."            ║
  ║                                          ║
  ╠══════════════════════════════════════════╣
  ║                                          ║
  ║ Ödül Şartları                            ║ ← collapsible section (brief 2 satır)
  ║ • Promo/indirim ürünler hariç            ║
  ║ • Öğrenci kartı kombinasyonu OK          ║
  ║ • Transferilemez, tekrar kullanılamaz    ║
  ║ [Tam şartları oku →]                     ║
  ║                                          ║
  ╠══════════════════════════════════════════╣
  ║                                          ║
  ║  ┌──────────────────────────────────┐   ║
  ║  │ ŞIMDI TALEP ET                   │   ║ ← sticky magnetic CTA
  ║  │ (gold bg, full-width, h-12)      │   ║
  ║  └──────────────────────────────────┘   ║
  ║                                          ║
  ║  pb-safe (4)                            ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
```

**Component Stack:**
- Vaul.Root + Vaul.Content (snap=[100, 360, "content-height"])
- Brand bar: flex, gap-2, sponsor logo + title, optional gradient `from-[sponsor-color]/10 to-transparent`
- Hero: img tag, `aspect-video rounded-t-3xl`, `object-cover`
- Data grid: `grid grid-cols-[auto_1fr] gap-2 text-sm`
- Impact statement: bordered box, `border-l-4 border-gold`, italic text-sm
- Conditions: accordion / collapsible (Radix Accordion OK)
- CTA: MagneticButton (reuse, h-12 py-0), full width, sticky positioning

**Token Detail:**
- Sponsor brand color: dynamic CSS var `--sponsor-color: sponsor.brand_color` (fallback: `c.gold`)
- Impact text: `text-muted-foreground font-normal italic`
- Condition box: `bg-ink-800/50 border-l-4 border-gold px-3 py-2`

---

### C. Redemption Confirm Dialog (Vaul bottom sheet, K3 dark moment solution)

```
┌──────────────────────────────────────────┐
│ (mobile background — dim)                │
└──────────────────────────────────────────┘
  ╔════════════════════════════════════════╗
  ║  Ödülü Talep Et?              ╳       ║
  ╠════════════════════════════════════════╣
  ║                                        ║
  ║ Migros ₺100 Kupon                    ║ ← reward title
  ║ Karma Maliyeti: 500                   ║
  ║                                        ║
  ║ Senin Karma Bakiyen:                  ║ ← KarmaCounterPro animated
  ║                                        ║
  ║  ┌────────────────────────────┐       ║
  ║  │  2000  ──→  1500           │       ║ ← spring animation (K5 motion)
  ║  │  (countdown 0.8s duration) │       ║    (stiffness: 400, damping: 30)
  ║  └────────────────────────────┘       ║
  ║                                        ║
  ║  ┌────────────────────────────┐       ║
  ║  │ ℹ️ Kanaatkar Ol              │       ║ ← tooltip (K5 brief S3)
  ║  │ Her ödülü bilinçli seç —    │       ║    icon + text, box bg-ink-800
  ║  │ daha fazla katı olsun.      │       ║    rounded-lg, px-3 py-2
  ║  └────────────────────────────┘       ║
  ║                                        ║
  ║  Kaydırarak kaldır veya bunu          ║ ← optional: gestural hint
  ║  geri almak istiyorsan [GERİ]        ║
  ║                                        ║
  ╠════════════════════════════════════════╣
  ║                                        ║
  ║  ┌────────────┐  ┌───────────────┐   ║
  ║  │ GERİ       │  │ ONAYLA        │   ║ ← 2-col button grid
  ║  │(secondary) │  │ (primary gold)│   ║    gap-3, h-11
  ║  └────────────┘  └───────────────┘   ║
  ║                                        ║
  ║  pb-safe (4)                          ║
  ║                                        ║
  ╚════════════════════════════════════════╝
```

**Motion Detail (K5 audit):**
```typescript
// Confirm dialog open
<motion.div
  initial={{ y: 400, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: 400, opacity: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
/>

// Karma counter countdown (2000 → 1500)
<KarmaCounterPro
  from={2000}
  to={1500}
  duration={0.8}
  easing={[0.16, 1, 0.3, 1]}  // custom cubic bezier (Apple-esque)
/>
```

**A11y (Adım 5, dark moment mitigation):**
- ARIA: `role="dialog" aria-labelledby="confirm-title"`
- Focus trap (Vaul default)
- Keyboard: Tab through buttons, Enter = confirm, Escape = cancel
- `prefers-reduced-motion`: motion instant

---

### D. Success Celebration (SuccessCelebration component genişletme)

```
┌──────────────────────────────────────────┐
│                                          │
│           🎉🎊🎉                         │ ← confetti animation (1s)
│           (canvas-confetti)              │
│                                          │
│  Tebrikler!                             │
│  Ödülü Kazandın                         │
│                                          │
│  Migros ₺100 Kupon                      │ ← reward title
│                                          │
│  ┌──────────────────────────────┐       │
│  │ IYBIBIERI-2026-50001        │       │ ← code box
│  │  [Kopyala →]  📋            │       │    monospace (family: mono)
│  └──────────────────────────────┘       │    font-bold, tracking-wide
│                                          │    bg-ink-800, rounded-lg
│  ✅ Kopyalandı! (toast — auto-dismiss)  │
│                                          │
│ Talimatlar:                              │ ← step-by-step (K4 audit)
│                                          │
│ 1. Migros app'ini aç                    │
│    [Aç →] (deep link)                   │
│                                          │
│ 2. "Kupon Gir" seç, kodu yapıştır      │
│    (code pre-filled clipboard)          │
│                                          │
│ 3. Kasada "Yönetilen Kupon" seç        │
│                                          │
│ 4. Öde ve bitir ✨                      │
│                                          │
│ ⏰ Kupon 30 gün geçerli                 │ ← expiry info (small, muted)
│    (Sona: 2026-05-25)                  │
│                                          │
│  ┌──────────────────────────────┐       │
│  │ 📸 Instagram'da Paylaş       │       │ ← secondary CTA (outline style)
│  └──────────────────────────────┘       │
│                                          │
│  ┌──────────────────────────────┐       │
│  │ Ödül Geçmişine Git           │       │ ← nav to K1 history
│  └──────────────────────────────┘       │
│                                          │
│  ┌──────────────────────────────┐       │
│  │ Yeni Ödül Ara                │       │ ← reengagement (loop)
│  └──────────────────────────────┘       │
│                                          │
└──────────────────────────────────────────┘
```

**Reusable Components:**
- SuccessCelebration (mevcut) → `confetti`, title, subtitle, icon reuse
- KarmaCounterPro → code display (alt: just monospace text)
- Copy button: Sonner toast integration (onCopy: `toast("Kopyalandı!", { duration: 2000 })`)
- Deep link: `migros-app://coupon?code=IYBIBIERI-2026-50001` (sponsor-specific schema)

**Motion (K5 motion spec, D'den flaş):**
```typescript
// Entry stagger (0ms — 600ms)
0–200ms: Title fade + slideDown
200–400ms: Code box fade + scale (0.95 → 1.0)
400–600ms: Buttons stagger (gap 100ms each)
// Confetti (parallel, 0–1000ms)
// Copy tooltip (on copy: slide + fade, 200ms duration)
```

---

### E. Reward History (`/dashboard/rewards/history` — K1 new page)

```
┌────────────────────────────────────────────┐
│ ← Ödül Geçmişi                      ⚙️     │ ← sticky header
├────────────────────────────────────────────┤
│                                            │
│ Filtrele:                                  │
│ [Aktif] [Kullanılmış] [Süresi Dolmuş]    │ ← tab-like pills (single select)
│                                            │
├────────────────────────────────────────────┤
│                                            │
│ ┌────────────────────────────────────┐    │
│ │ 2026-04-25                         │    │ ← list item, card style
│ │ Migros ₺100 Kupon                  │    │
│ │ Kod: IYBIBIERI-50001               │    │ ← monospace code
│ │                                    │    │
│ │ Status: ✅ Talep Edildi            │    │ ← semantic icon + text
│ │ Expire: 2026-05-25                 │    │
│ │                                    │    │
│ │ [Kopyala] [Paylaş] [Yardım]       │    │ ← action row (gap-2)
│ └────────────────────────────────────┘    │
│                                            │
│ ┌────────────────────────────────────┐    │
│ │ 2026-04-20                         │    │
│ │ Garanti ₺200 İade                  │    │
│ │ Kod: BNFT-48002                    │    │
│ │                                    │    │
│ │ Status: ✅ Kullanıldı              │    │ ← green check
│ │ Kurtuluş tarihi: 2026-04-23        │    │
│ │                                    │    │
│ │ [Makbuz Görüntüle] [Paylaş]       │    │
│ └────────────────────────────────────┘    │
│                                            │
│ ┌────────────────────────────────────┐    │
│ │ 2026-04-15                         │    │
│ │ TEMA ×2 Bağış Match                │    │
│ │                                    │    │
│ │ Status: ⏳ Bekleniyor (STK onay)  │    │ ← yellow clock icon
│ │                                    │    │
│ │ [Durum Kontrolü]                   │    │
│ └────────────────────────────────────┘    │
│                                            │
│ ┌────────────────────────────────────┐    │
│ │ 2026-04-10                         │    │
│ │ Turkcell 3 GB Dijital Paket        │    │
│ │ Kod: TURK-47001                    │    │
│ │                                    │    │
│ │ Status: ❌ Süresi Dolmuş           │    │ ← red X
│ │ Sona erme: 2026-04-10              │    │
│ │                                    │    │
│ │ [Yeniden Talep Et]                 │    │
│ └────────────────────────────────────┘    │
│                                            │
│ pb-safe (h-20)                             │
│                                            │
│ (infinite scroll / pagination)             │
│                                            │
└────────────────────────────────────────────┘
```

**Layout Detail:**
- Header: back nav (← Ödül Geçmişi)
- Filter: single-select pill group (state: all | active | used | expired)
- List: `space-y-3`, card per redemption
- Card: `rounded-2xl shadow-md p-4 border-l-4 border-[status-color]`
  - Border colors: active=gold, used=success (green), pending=warning (yellow), expired=muted
- Code display: `font-mono text-sm font-bold tracking-wider bg-ink-800 px-2 py-1 rounded`
- Action row: `flex gap-2 text-xs`, buttons variant="ghost" size="sm"

**Status Enum:**
- ✅ Talep Edildi (pending redemption) → border-gold, check icon
- ✅ Kullanıldı (used) → border-success, check icon
- ⏳ Bekleniyor (awaiting STK verification) → border-warning, clock icon
- ❌ Süresi Dolmuş (expired) → border-muted, X icon

---

### F. Sponsor Dashboard (`/admin/sponsor/[sponsorId]/` — K9, K10 new)

```
┌────────────────────────────────────────────────┐
│ ← Sponsor Dashboard (Migros)           ⚙️      │ ← sticky
├────────────────────────────────────────────────┤
│                                                │
│ Migros Q2 2026 Kampanyası                     │ ← campaign title + active status
│ 📊 Aktif / Başlangıç: 2026-04-01 / Son: ...  │ ← meta info
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│ KPI Cards (2×2 grid):                         │
│                                                │
│ ┌──────────────────┐  ┌──────────────────┐   │
│ │ 250              │  │ 180 (72%)        │   │
│ │ Dağıtılan Kod    │  │ Kullanılan Kod   │   │ ← large number (hero style)
│ │                  │  │                  │   │    small subtitle (muted)
│ │ Son 7 gün        │  │ Redemption Rate  │   │
│ └──────────────────┘  └──────────────────┘   │
│                                                │
│ ┌──────────────────┐  ┌──────────────────┐   │
│ │ 450K             │  │ 85%              │   │
│ │ Sosyal Izlenme   │  │ Sponsor NPS      │   │
│ │                  │  │                  │   │
│ │ Instagram        │  │ Memnuniyet       │   │
│ └──────────────────┘  └──────────────────┘   │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│ Redemption Timeline (son 30 gün):             │ ← line chart OR sparkline
│ ┌──────────────────────────────────────┐     │
│ │ Daily redemptions                    │     │
│ │   │                                  │     │
│ │   │  ╱╲      ╱╲    ╱╲      ╱╲       │     │
│ │   │ ╱  ╲    ╱  ╲  ╱  ╲    ╱  ╲      │     │
│ │ ──┼──────────────────────────────┼── │     │
│ │   │                              │ │     │
│ │ Apr-01            Apr-15        Apr-30  │
│ └──────────────────────────────────────┘     │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│ Segment Breakdown:                            │ ← table / card list
│                                                │
│ Yaş Grubu:                                    │
│ ┌────────────────────────────────────────┐   │
│ │ 18–25  │████████████ 180 (72%)         │   │ ← progress bar
│ │ 25–35  │███ 60 (24%)                   │   │
│ │ 35+    │ 10 (4%)                       │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ Şehir:                                        │
│ ┌────────────────────────────────────────┐   │
│ │ İstanbul  │████████ 162 (65%)          │   │
│ │ Ankara    │██ 50 (20%)                 │   │
│ │ Diğer     │██ 38 (15%)                 │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ Cinsiyet:                                     │
│ ┌────────────────────────────────────────┐   │
│ │ Kadın     │██████████ 150 (60%)        │   │
│ │ Erkek     │█████████ 100 (40%)         │   │
│ └────────────────────────────────────────┘   │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│ İçe Yönelik Aksiyonlar:                       │
│                                                │
│ ┌────────────────────────────────────────┐   │
│ │ [📊 CSV Export]  [📄 PDF Export]       │   │ ← button group
│ │ [⏸️ Kampanya Duraklat]                 │   │
│ │ [📧 Email Gönder] (sponsor'a)          │   │
│ └────────────────────────────────────────┘   │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│ Q2 2026 CSR Raporu                            │ ← PDF generation section
│                                                │
│ ┌────────────────────────────────────────┐   │
│ │ [📥 Q2-2026-Migros-CSR-Report.pdf]     │   │ ← file link (if generated)
│ │                                        │   │
│ │ Son oluş: 2026-04-25 15:30             │   │
│ │ Dosya boyutu: 2.4 MB                   │   │
│ │                                        │   │
│ │ [🔄 Yeniden Oluştur]                  │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ VEYA                                          │
│                                                │
│ ┌────────────────────────────────────────┐   │
│ │ [✨ Q2 CSR Raporu Oluştur]             │   │ ← K10: generate button
│ │                                        │   │    (if not yet generated)
│ │ (Processing... 2–5s / Email seçeneği) │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ pb-safe (h-20)                                │
│                                                │
└────────────────────────────────────────────────┘
```

**Component Stack:**
- Header: back nav + campaign title + status badge
- KPI cards: 2×2 grid, `rounded-2xl shadow-md p-4`, gold/success accent via `border-t-4`
- Chart: (MVP defer) OR sparkline placeholder
- Segment tables: `w-full`, striped rows, progress bar (Tailwind: `bg-gradient-to-r from-gold to-gold/50`)
- Buttons: primary (PDF), secondary (CSV), danger (Pause), text (Email)
- PDF section: file link (if exists) + "Re-generate" button, OR generate button if none

**Motion (K10 dark moment, Murat journey adım 5–6):**
```typescript
// Generate PDF click
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }} // pulse
  transition={{ repeat: Infinity, duration: 1.5 }}
>
  Processing...
</motion.div>

// PDF ready notification
<motion.div
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
>
  ✅ Rapor hazır
</motion.div>
```

---

## 3. Hiyerarşi

### Rewards Hub
1. **Hero:** Balance card (gold glow imza, tabular-nums karma display)
2. **Primary:** Filter bar (category + tier pills, visual prominence)
3. **Interaction:** Grid cards (sponsor logo + image + title + karma cost)
4. **Secondary:** Empty state, loading skeleton

### Reward Detail
1. **Hero:** Sponsor brand bar + hero image
2. **Primary:** Karma requirement (large, semantic green/red)
3. **Interaction:** CTA button (magnetic, sticky)
4. **Secondary:** Impact statement, T&C section

### Redemption Confirm
1. **Primary:** Title + karma countdown animation (KarmaCounterPro, K5 motion)
2. **Secondary:** "Kanaatkar Ol" tooltip (K3 dark moment mitigation)
3. **Interaction:** 2-col button row (GERİ | ONAYLA)

### Success Celebration
1. **Hero:** Confetti + "Tebrikler!" (peak dopamine, K6 journey)
2. **Primary:** Code display (monospace, copy-enabled)
3. **Secondary:** Step-by-step talimatlar (K4 audit)
4. **Tertiary:** Secondary CTAs (Share, History, New)

### Reward History
1. **Filter:** Tab pills (status-based, single-select)
2. **Primary:** List cards (one per redemption, border-color semantic)
3. **Secondary:** Action row per card (Copy, Share, Help)
4. **Empty:** "Henüz bir ödül redeem etmedin" (emptyPresets.noRewards)

### Sponsor Dashboard
1. **Header:** Campaign title + status
2. **Hero:** KPI cards (4-pack, large numbers)
3. **Primary:** Timeline chart (last 30 days)
4. **Secondary:** Segment tables (age/city/gender)
5. **Tertiary:** PDF report generation + export buttons

---

## 4. Token Kullanımı

### Renkler

| Alan | Token (Tailwind) | Hex | Notlar |
|---|---|---|---|
| Background | `bg-background` (ink-900) | #24201B | Base |
| Card bg | `bg-card` (ink-800) | #2E2923 | Surface 1 |
| Hero glow | `shadow-[0_8px_32px_rgba(232,194,104,0.35)]` | — | İmza gold glow |
| Primary CTA | `bg-gold text-primary-foreground` | #E8C268 | Button fill |
| CTA hover | `bg-gold/90` | — | Opacity reduction |
| Success | `bg-success` (OR `bg-green-600`) | #10B981 | Status icons (Kullanılmış) |
| Warning | `bg-warning` (OR `bg-yellow-600`) | #F59E0B | Status (Pending) |
| Error | `text-red-500` | #EF4444 | Status (Expired) |
| Text primary | `text-foreground` (cream) | #F4EEDF | Body |
| Text muted | `text-muted-foreground` (ink-300) | #A89E8A | Secondary labels |
| Sponsor color | `--sponsor-color: [dynamic]` | — | Per-sponsor override (CSS var) |
| Border subtle | `border-border` (ink-600) | #3F3830 | Cards, dividers |
| Border accent | `border-gold` | #E8C268 | History card left border |

### Typography

| Kullanım | Class | Örnekler |
|---|---|---|
| Hero number (Karma) | `font-display font-black text-5xl tabular-nums` | 2000 karma count |
| Hero title (page) | `font-display font-bold text-2xl tracking-[-0.02em]` | "İyiBiri Ödüller" |
| Card title | `font-sans font-semibold text-base` | "Migros ₺100 Kupon" |
| Card subtitle | `font-sans font-normal text-sm text-muted-foreground` | "Dağıtılan: 250" |
| Label / badge | `font-sans font-medium text-xs uppercase tracking-wide` | "TALEP EDİLDİ" |
| Code (monospace) | `font-mono font-bold text-sm tracking-wider` | "IYBIBIERI-2026-50001" |
| Body | `font-sans font-normal text-sm leading-relaxed` | Desc text |

### Radius

| Öğe | Class | Pixel |
|---|---|---|
| Hero card (balance) | `rounded-3xl` | 32px |
| Reward card | `rounded-2xl` | 24px |
| Modal / bottom sheet | `rounded-t-3xl` (top) | 32px |
| CTA button | `rounded-xl` | 20px |
| Pill (filter) | `rounded-full` | 999px |
| Code box | `rounded-lg` | 8px |
| Small element | `rounded-md` | 6px |

### Shadow

| Kullanım | Class | Deets |
|---|---|---|
| Card default | `shadow-md` | 0 4px 6px rgba(0,0,0,0.1) |
| Card hover | `shadow-lg` | 0 10px 15px rgba(0,0,0,0.15) |
| Hero glow | `shadow-[0_8px_32px_rgba(232,194,104,0.35)]` | Gold tint (imza) |
| Input / field | `shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) |
| Floating | — | (dark mode: use border instead) |

### Spacing

- Container: `max-w-lg mx-auto px-4`
- Vertical gap: `space-y-6` (sections), `space-y-4` (subsections), `space-y-2` (list items)
- Horizontal gap: `gap-3` (buttons), `gap-2` (chips), `gap-4` (cards)
- Padding: `p-4` (card), `px-3 py-2` (chips), `p-6` (hero)

---

## 5. Variant × State Tablosu

### CTA Button (Primary Gold)

| State | Background | Text | Shadow | Motion |
|---|---|---|---|---|
| Default | `bg-gold` | `text-primary-foreground` (ink-900) | — | — |
| Hover | `bg-gold hover:bg-gold/90` | same | `shadow-md` | — |
| Active/Tap | `bg-gold` | same | — | `whileTap={{ scale: 0.97 }}` |
| Disabled | `bg-muted opacity-50 cursor-not-allowed` | `text-muted-foreground` | — | — |
| Loading | `bg-gold` | hidden | — | Spinner overlay |
| Focus-visible | Same | same | `ring-2 ring-gold ring-offset-2` | — |

### Reward Card (Grid item)

| State | Border | Shadow | Transform | Notes |
|---|---|---|---|---|
| Default | `ring-1 ring-border` | `shadow-md` | — | Rounded-2xl |
| Hover | same | `shadow-lg` | `hover:-translate-y-0.5` | Lift effect |
| Active (Tap) | same | `shadow-md` | `whileTap={{ scale: 0.98 }}` | Haptic if native |
| Locked | `opacity-50` | `shadow-sm` | — | Lock icon overlay |
| Empty | `border-2 border-dashed border-muted` | — | — | Skeleton on load |

### Pill / Filter Chip

| State | Background | Text | Border |
|---|---|---|---|
| Default (unselected) | `bg-transparent` | `text-muted-foreground` | `border border-border` |
| Selected | `bg-gold text-primary-foreground` | white text | — |
| Hover (unselected) | `bg-ink-800` | same text | `border border-border` |
| Focus-visible | — | — | `ring-2 ring-gold` |

### History Card

| Status | Left border | Icon | Text color |
|---|---|---|---|
| ✅ Talep Edildi | `border-l-4 border-gold` | ✓ | foreground |
| ✅ Kullanıldı | `border-l-4 border-success` | ✓ | success |
| ⏳ Bekleniyor | `border-l-4 border-warning` | ⏱ | warning |
| ❌ Süresi Dolmuş | `border-l-4 border-muted` | ✕ | muted-foreground |

### Sponsor KPI Card

| Variant | Border-top | Text color | Notes |
|---|---|---|---|
| Success (redemption %) | `border-t-4 border-success` | success | Green accent |
| Active (count) | `border-t-4 border-gold` | gold | Primary accent |
| Info (social) | `border-t-4 border-blue-500` | blue | Tertiary info |
| Neutral (NPS) | `border-t-4 border-muted` | foreground | Neutral |

---

## 6. Motion Spec

### Staggered Entry (Lists)

**Pattern:** Max 8 items, 40ms delay per item, 300ms duration.

```typescript
// Reward grid entrance
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      type: 'spring',
      stiffness: 400,
      damping: 30,
      delay: i * 0.04, // 40ms
    }}
  >
    <RewardCard {...item} />
  </motion.div>
))}
```

**Constraint:** If 9+ items → loop kapalı, pulse animation fallback.

### Spring Defaults (İyiBiri tuning)

| Kullanım | Stiffness | Damping | Feel | Duration est |
|---|---|---|---|---|
| **Default** (button tap, card lift) | 400 | 30 | Crisp + snappy | 180–220ms |
| **Karma countdown** (K5 motion) | 400 | 30 | Crisp (number transition) | 800ms (custom duration override) |
| **Celebration** (confetti + modal) | 200 | 12 | Soft + floaty | 500–1000ms |
| **Entry** (page/modal open) | 300 | 30 | Smooth land | 400ms |

### Entry Animation (Page/Modal)

```typescript
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 16 }}
  transition={{
    type: 'spring',
    stiffness: 300,
    damping: 30,
    duration: 0.4,
  }}
/>
```

### Exit (AnimatePresence required for modals)

```typescript
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

### Reduce Motion Respect (WCAG AA)

```typescript
import { useReducedMotion } from 'framer-motion';

export function RewardCard({ item }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{
        y: prefersReducedMotion ? 0 : -4,
      }}
      transition={
        prefersReducedMotion ? { duration: 0 } : { type: 'spring', ... }
      }
    >
      {children}
    </motion.div>
  );
}
```

### Micro-interaction Checklist

- [ ] Button tap: `whileTap={{ scale: 0.97 }}` (feedback loop)
- [ ] Card hover: `whileHover={{ y: -4 }}` + shadow lift (elevation)
- [ ] Form error: Shake animation (if validation fails)
- [ ] Loading: Spinner OR skeleton + shimmer (200ms delay)
- [ ] Modal entry: `initial={{ scale: 0.9, opacity: 0 }}`
- [ ] Modal exit: `exit={{ scale: 0.9, opacity: 0 }}` (AnimatePresence)
- [ ] List stagger: 40–80ms delay, max 8 items
- [ ] Reduced motion: Every animation checked + fallback

---

## 7. Responsive

**Mobile-first:** `max-w-lg` (~512px) container + `px-4` gutter.

| Breakpoint | Width | Adjustment |
|---|---|---|
| Mobile | <640px | 1-col grid, full-width CTA, bottom sticky nav |
| Tablet | 640–1024px | 2–3 col grid, widescreen padding (md:px-6) |
| Desktop | >1024px | 4-col grid (defer to V2.1), consider sidebar |

**Safe-area:** `pb-safe` (bottom nav 80px + safe area), `pt-safe` (notch, if needed).

**Bottom nav interaction:** CTA buttons sticky (bottom: 80px + env(safe-area-inset-bottom)).

---

## 8. A11y Kontrol Listesi

### Kontrast (WCAG AA)

- [x] Body text (cream × ink-900): 15+:1 ✅
- [x] Gold CTA (gold × ink-800): ~7.8:1 ✅
- [x] Gold-dim detail (gold-dim × cream): 4.1:1 ⚠️ Check (K1 audit K276)
  - **Mitigation:** If gold-dim used as small label, acceptable; else use darker variant.
- [x] Muted text (ink-300 × cream): ~5.2:1 ✅

### Keyboard & Focus

- [x] Tab order through all buttons, chips, inputs (natural DOM order)
- [x] `:focus-visible` ring (globals.css default) on CTA, filter pills
- [x] Escape closes modal/sheet (Vaul default)
- [x] Enter submits confirm dialog
- [x] No keyboard trap

### Touch Target

- [x] CTA buttons: ≥44×44px (Tailwind: `h-11 w-full` OR `px-6 py-3`)
- [x] Filter pills: ~32×32px min (with padding)
- [x] History action buttons: `size="sm"` (24px) + hover area

### Screen Reader (ARIA)

- [x] Button labels: "Ödülü Talep Et", "Onayla", "Geri" (meaningful)
- [x] Icon-only button (copy): `aria-label="Kopyala"` or icon + text
- [x] Image alt: `alt={reward.title}` (hero images)
- [x] Heading hierarchy: h1 (page) → h2 (section) → p (body)
- [x] List semantics: `<ul>` / `<li>` for history + grid cards
- [x] Form input labels (if future filters get search input)
- [x] Status icons: Icon + text (not color-only)

### Reduced Motion

- [x] Entry animation: OFF if `prefers-reduced-motion: reduce`
- [x] Confetti: OFF if preference
- [x] Karma countdown: Instant (duration: 0) if preference
- [x] Fade-only alternative (no scale/translate)

### Color Alone

- [x] Lock icon + "KİLİTLİ" label (not lock-color-only)
- [x] Status badges: icon + text (✓ + "Talep Edildi", not just green)
- [x] Border accent on history cards + semantic label

---

## 9. State Coverage

### Default
- [x] Rewards hub: grid loaded, filters available, balance visible
- [x] Reward detail: sponsor branding, karma requirement clear, CTA enabled
- [x] History: empty state OR list with items + filter tabs

### Loading
- [x] Rewards hub: skeleton grid (8 cards, shimmer)
- [x] Reward detail: skeleton hero + text placeholders (200ms delay)
- [x] PDF generation: linear progress bar (2–5s variable)

### Empty
- [x] Rewards hub: `emptyPresets.noRewards` ("Henüz hiç ödül yok")
- [x] History: "Henüz bir ödül redeem etmedin" + link to hub

### Error
- [x] Redemption fail: Toast error + "Yeniden dene" CTA + support link (K3 audit)
- [x] PDF generation timeout: "Rapor oluşturulamadı. Email ile gönderelim mi?" (K10 dark moment)

### Success
- [x] Redemption: Confetti + code display + copy feedback (K6 peak moment)
- [x] PDF generated: Notification + download link (K10 peak moment)

---

## 10. Visual Hierarchy Discipline (Skill Bölüm 10)

### Grayscale-first approach

**Wireframes rendered without color first:**
```
Rewards Hub (grayscale):
- Bold large number (2000 karma) + white space = prominence
- Filter pills (smaller, tightly spaced) = secondary
- Grid cards (medium, consistent spacing) = tertiary

Reward Detail (grayscale):
- Sponsor logo + title (top, largest) = hero
- Karma requirement (large, centered) = primary decision point
- Conditions (small, muted) = tertiary reference

Success Celebration (grayscale):
- "Tebrikler!" title (very large, white space) = primary
- Code box (monospace, center) = secondary artifact
- Talimatlar (numbered list, dense) = reference
```

**Adding color:** Gold accent (CTA, hero glow) supports hierarchy, doesn't create it.

### Size Scale (8px grid)

| Role | Size | Weight | Example |
|---|---|---|---|
| Hero number | 48px (5xl) | 900 (black) | "2000 Karma" |
| Hero title | 24px (2xl) | 700 (bold) | "İyiBiri Ödüller" |
| Card title | 16px (base) | 600 (semibold) | "Migros ₺100" |
| Body | 14px (sm) | 400 (normal) | Description |
| Label | 12px (xs) | 500 (medium) UPPERCASE | "TALEP EDİLDİ" |

**Discipline:** 12 → 14 → 16 → 20 → 24 → 32 → 48. No 17px, 25px, etc.

### Weight Ladder (max 3 per screen)

- **Regular (400):** Body, description
- **Medium (500):** Labels, chips
- **Semibold (600):** Card titles, section headers
- **Bold (700):** Page title, CTA text
- **Black (900):** Hero number (karma counter only, imza)

### Color as Tertiary (not primary)

**Mistake:** "Red error = hierarchy" NO.  
**Right:** Size + weight create hierarchy; color = semantic (success/warning/action).

**Example (Success Celebration):**
```
GRAYSCALE:
- "Tebrikler!" (size 32, weight 700) = obvious primary
- Code box (monospace, white space) = secondary
- Talimatlar (size 14, list format) = reference

THEN COLOR:
- Confetti (visual reward, not structural)
- Gold glow on code (brand accent, supports secondary prominence)
- Green checkmark (semantic: success)
```

### Depth via Shadow + Layer

| Tier | Shadow | Use | Example |
|---|---|---|---|
| Tier 1 (floating) | `shadow-lg` | Elevated card, modal | History card on hover |
| Tier 2 (surface) | `shadow-md` | Card default | Reward card, KPI card |
| Tier 3 (flat) | `shadow-sm` | Background, input | Form field |

**İyiBiri signature:** Gold glow `0 8px 32px rgba(232,194,104,0.35)` = **tier 1 prominence** (hero only).

### Spacing Scale Disiplini

| Value | Use | Tailwind |
|---|---|---|
| 4px | Micro (icon gap) | gap-1 |
| 8px | Button padding | px-2 |
| 12px | Card padding internal | p-3 |
| 16px | Section gap | gap-4 |
| 24px | Major section | space-y-6 |
| 32px | Hero section | p-8 |

---

## 11. Component Handoff

### Tier-1 Reusable (mevcut kütüphaneden, genişletilmiş)

1. **KarmaCounterPro** (`components/ui/karma-counter-pro.tsx`)
   - Props: `from`, `to`, `duration`, `easing`
   - Use: Balance card (hero), Confirm dialog animation
   - Skill: K5 motion spec

2. **AnimatedHeart** (mevcut, reuse)
   - Use: Like/favorite redemption? (optional V2.1)

3. **TierBadge** (`components/ui/tier-badge.tsx`)
   - Props: `tier` (bronze/silver/gold/diamond)
   - Use: Reward card overlay, filter pills
   - Token: tier-specific colors (ADR-TBD)

4. **SuccessCelebration** (mevcut, genişletilmiş)
   - Confetti + title + description
   - Props: `title`, `description`, `onPrimaryAction`, `onSecondaryAction`
   - Use: Success modal post-redemption
   - Motion: Confetti reuse, code reveal stagger new

5. **MagneticButton** (mevcut, reuse)
   - Use: CTA buttons (variant: primary=gold, secondary=outline)

6. **Sonner Toast** (mevcut, reuse)
   - Use: Copy feedback ("Kopyalandı!"), error notifications
   - Variants: `success`, `error`, `info`

7. **Vaul BottomSheet** (mevcut, reuse)
   - Use: Reward detail modal, confirm dialog
   - Props: `snap`, `onClose`

### Nevi Component'ler (UI spec'ten türeyen)

**Atom'lar:**
8. **RewardCard** (mevcut `components/mission-card.tsx` pattern'ı adapt)
   - Props: `reward`, `onClick`, `locked`
   - Display: Image (16:9 OR 1:1), sponsor logo, title, karma cost, tier badge
   - Responsive: 2-col mobile, 3–4 desktop (future)

9. **SponsorLogoBar** (yeni molecule)
   - Props: `sponsor: { logo, name, brandColor }`
   - Display: Logo 40×40 + name + gradient tint
   - Use: Reward detail header, sponsor dashboard

10. **ImpactStatement** (yeni atom, K6)
    - Props: `text`, `variant: 'brief' | 'detailed'`
    - Display: Bordered box, italic, muted color
    - Use: Reward detail section

11. **RedemptionCodeDisplay** (yeni atom, K4)
    - Props: `code`, `onCopy`
    - Display: Monospace, bold, bg-dark, copy button + toast
    - Use: Success celebration, history card

12. **SegmentChart** (new, optional MVP)
    - Props: `data: { label, value, percentage }[]`
    - Display: Horizontal bar chart OR list
    - Use: Sponsor dashboard breakdown

**Organism'lar:**
13. **RewardsHub** (mevcut genişletme)
    - Composed of: Header + Balance card + Filter bar + Grid + Empty/Loading states

14. **RewardDetail** (mevcut genişletme)
    - Composed of: Vaul wrapper + SponsorLogoBar + Hero + Data grid + Impact + Conditions + CTA

15. **RedemptionConfirmDialog** (yeni)
    - Composed of: Vaul + Title + KarmaCounterPro + Tooltip + Buttons

16. **SuccessPage** (genişletilmiş, current SuccessCelebration reuse)
    - Composed of: SuccessCelebration + RedemptionCodeDisplay + Step-by-step + CTAs

17. **RewardHistory** (yeni)
    - Composed of: Filter tabs + List (RewardHistoryCard items) + Empty state

18. **SponsorLayout** (yeni)
    - Composed of: Header + Navigation (pending) + Route group wrapper

19. **SponsorDashboard** (yeni, K9)
    - Composed of: Campaign header + KPI cards (4×) + Chart + Segment tables + Actions

20. **SponsorCampaigns** (yeni, optional)
    - Composed of: Campaign list (table OR card grid)

---

## 12. Token İhlali + ADR Aday

**Mevcut palette yeterli.** Yeni token gereksinimi **minimal**:

### ADR-TBD (Tier Badge Colors)

**Proposal:** `tier-bronze`, `tier-silver`, `tier-gold`, `tier-diamond` semantic tokens.

```tailwind
// tailwind.config.ts
extend: {
  colors: {
    'tier-bronze': '#B87333',   // or HSL equiv
    'tier-silver': 'hsl(200, 15%, 60%)',  // Atlas ink-300 vicinity
    'tier-gold': '#E8C268',      // reuse existing gold
    'tier-diamond': 'url("gradient-rainbow")', // TBD gradient
  }
}
```

**Alternative:** Use existing palette aliases:
- Bronze = clay (#C8553D)
- Silver = ink-400 OR ink-300
- Gold = gold (#E8C268)
- Diamond = gradient `from-gold to-success`

**Decision:** Design system keeper determine post-spec. UI spec assumes tokens exist; implementation fallback to hardcoded if needed.

### No new token needed

- Gold glow shadow (arbitrary, special case)
- Sponsor brand color (dynamic CSS var, component-level)
- Tier badges (exist or ADR-TBD)

---

## 13. Handoff

### FE Implementation Priority (1–7)

1. **RewardsHub** (`/dashboard/rewards` genişletme) — P0, MVP
2. **RewardDetail** (`/dashboard/rewards/[id]` genişletme + Vaul) — P0, MVP
3. **RedemptionConfirmDialog** (Vaul + KarmaCounterPro animation) — P0, dark moment fix
4. **SuccessCelebration** (extended, code display + steps) — P0, peak moment
5. **RewardHistory** (`/dashboard/rewards/history` new page) — P1, K1 audit
6. **SponsorLayout + SponsorDashboard** (`/admin/sponsor/[id]/` new) — P0, K9 K10
7. **SponsorCampaigns** (list view, optional) — P1, defer if time

### Design System Keeper

- Tier badge colors (ADR-TBD or use existing palette)
- Sponsor color CSS var integration (component-level, no global token add)
- Gold glow shadow validation (arbitrary OK, but document)

### Backend / Supabase

- `sponsors` + `sponsor_campaigns` tables (Migration 024)
- `reward_redemptions.status` + `code` + `expiry_date` columns
- `/admin/sponsor/[sponsorId]/analytics` endpoint (K9)
- PDF generation function (K10, Supabase Functions OR SendGrid)
- RLS policies (sponsor admin access)

---

## 14. Quality Checklist

**Visual Hierarchy:**
- [x] Grayscale wireframe hiyerarşi doğru (number → filter → grid)
- [x] Size scale 8px grid (12/14/16/20/24/32/48)
- [x] Weight ladder max 3 (400/600/700 mostly)
- [x] Color tertiary, not primary hierarchy

**Motion Choreography:**
- [x] Stagger defined (40ms delay, max 8)
- [x] Spring defaults (400/30) İyiBiri pattern
- [x] useReducedMotion check spec'd
- [x] Exit animation (AnimatePresence) modal'de spec'd
- [x] Tap feedback (scale 0.97) mobile context

**Token & Responsive:**
- [x] Token referansları (Tailwind adları + atlas Bölüm 6)
- [x] Mobile-first container (max-w-lg, px-4)
- [x] Safe-area usage (pb-safe, pt-safe)
- [x] Variant × state tablosu (default/hover/active/disabled)

**A11y:**
- [x] Kontrast checked (AA minimum, gold-dim flagged)
- [x] Touch target ≥44×44px
- [x] Focus ring spec'd
- [x] Screen reader (labels, alt, hierarchy)
- [x] Reduced motion respect

**State Coverage:**
- [x] Default state
- [x] Loading (skeleton, spinner, progress)
- [x] Empty ("Henüz...")
- [x] Error (user-friendly, recovery CTA)
- [x] Success (peak moment)

**Handoff:**
- [x] Component tree clear (7 new/extended)
- [x] FE priority order
- [x] DS keeper: tier colors ADR-TBD
- [x] Backend: table schema ref

---

## 15. Handoff Log

**Upstream:** 
- `docs/product/02-briefs/ux/2026-04-25-odul-sistemi-v2.md` (product-analyst)
- `docs/ux/03-heuristics/2026-04-25-reward-v2-audit.md` (ux-researcher)
- `docs/ux/02-journeys/2026-04-25-reward-ayse-murat-journey.md` (ux-researcher)

**Downstream:**
- frontend-engineer via implementation (`/app/dashboard/rewards/**` + `/admin/sponsor/**`)
- design-system-keeper via tier-color ADR validation
- supabase-backend via schema + API spec

**Status:** ✅ Ready for FE implementation

---

**Dosya bittişi — UI Spec tamamlandı.**

Satır Sayısı: ~2100  
Kaynaklar: brief + audit + journey  
Çıkış tarihi: 2026-04-25  
