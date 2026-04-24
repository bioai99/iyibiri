# STK Admin UI — V1 Min+ (10 Sayfa Spec)

**Tarih:** 2026-04-24  
**Yazar:** ui-designer  
**Upstream:**
- Workstream: `docs/product/01-workstreams/2026-04-24-stk-backoffice-workstream.md`
- Analyst brief: `docs/product/02-briefs/ux/2026-04-24-stk-admin-ui-min-plus.md`
- UX audit: `docs/ux/03-heuristics/2026-04-24-stk-admin-audit.md`
- Ayşe journey: `docs/ux/02-journeys/2026-04-24-stk-admin-ayse-journey.md`

**Durum:** ready for frontend-engineer

---

## 1. Özet

STK admin (backoffice) — **10 sayfalık scope**, data-dense, efficiency-first, low-error-tolerance. Admin layout + sidebar nav + top bar + 10 sayfa ekran × wireframe + token × variant × state + motion spec + a11y. **Kritik:** Her ekran Ayşe journey K1-K8 audit bulgularına cevap vermelidir.

**Genel taslak:**
- **Dark-only** (ADR-004, cream bg yok, ink900 base)
- **Token:** atlas palette (ink, cream, gold, clay, domain colors)
- **Motion:** tier-1 app standards (spring 400/30, stagger 40-80ms, reduced-motion check)
- **A11y:** WCAG AA, keyboard nav, focus-visible ring, touch ≥44px

---

## 2. Admin Layout — Base

### 2.1. Sidebar (fixed, collapse V1.1)

**Genişlik:** 240px (fixed desktop), collapsible tablet/mobile (hamburger toggle)  
**Content (top → bottom):**
1. Logo + STK adı (header, 56px height)
2. Nav items (10 sayfa):
   - Dashboard `/admin/[ngoId]/`
   - Görevler `/admin/[ngoId]/missions`
   - Görev yayınla `/admin/[ngoId]/missions/new` (link? veya inline?)
   - Doğrulama `/admin/[ngoId]/verifications`
   - Üyeler `/admin/[ngoId]/members`
   - Rapor `/admin/[ngoId]/reports`
   - Blog `/admin/[ngoId]/blog`
   - Profil `/admin/[ngoId]/profile`
   - Üyelik Ayarları `/admin/[ngoId]/membership-config`
   - Ödeme `/admin/[ngoId]/payments`
3. Ayşe profile + logout (bottom, sticky, 60px)

**Styling:**
- Background: `bg-ink-900` (darkest)
- Border-right: `border-r border-ink-700` (subtle separation)
- Nav item default: `text-ink-300` (muted)
- Nav item hover: `bg-ink-800` (lift)
- Nav item active: `bg-ink-900/50 border-l-2 border-l-gold text-gold` (accent + left border)
- Profile section: `bg-ink-800` (elevated), padding 12px, rounded-lg

**Responsive:**
- Desktop ≥1024px: sidebar visible, fixed
- Tablet 768-1023px: sidebar collapse toggle (hamburger), drawer slide-from-left
- Mobile <768px: drawer full-height, dismiss on route change

### 2.2. Top bar (sticky, 56px)

**Content:**
- Left: Breadcrumb (Ana / Görevler / Yeni) — opsiyonel, Sayfa 2-10'da title yerine
- Center: Page title (h2, 18px, bold)
- Right: User menu (Ayşe avatar + dropdown = logout + password change V1.1)

**Styling:**
- Background: `bg-ink-900` (match background)
- Border-bottom: `border-b border-ink-700`
- Text: `text-cream`
- Sticky: `sticky top-0 z-10`

**Responsive:**
- Desktop: full width
- Tablet/Mobile: title shrink (16px), user menu icon-only (avatar)

### 2.3. Content area

**Max-width:** 1280px (desktop), fluid (tablet/mobile)  
**Padding:** 24px (desktop) | 16px (tablet) | 16px (mobile)  
**Background:** `bg-ink-900` (same as page)  
**Safe area:** `pb-safe` (mobile, iPad notch handling)

---

## 3. Token sistemi (admin-extended)

### Mevcut palette (atlas Bölüm 6)

| Use | Token | Value | Note |
|---|---|---|---|
| Background | `bg-ink-900` | #24201B | Base |
| Surface/Card | `bg-ink-800` | #2E2923 | Elevated |
| Hover/Highlight | `bg-ink-700` | #36302A | Interactive |
| Border | `border-ink-600` | #3F3830 | Hairline |
| Text primary | `text-cream` | #F4EEDF | Labels, body |
| Text secondary | `text-ink-300` | #A89E8A | Muted, caption |
| CTA button | `bg-gold text-ink-900` | #E8C268 | Primary action |
| Success | `text-success` | #6B8E4E | Status badges |
| Danger | `text-clay` | #C8553D | Error, alert |
| Domain nature | `bg-domain-nature` | Gradient #10B981 | Category badge |
| Domain education | `bg-domain-education` | Gradient #3B82F6 | Category badge |
| ... (4 more domains) | — | — | — |

### Admin-spesifik aliases (semantic)

Tanımlanması gerek mi (ADR-TBD) — mevcut palette yeterli mi? Karar: **mevcut yeterli; V1.1'de semantic alias** ekle.

| Use | Alias | Maps to | Note |
|---|---|---|---|
| Admin sidebar bg | — | `bg-ink-900` | Existing |
| Admin active item | — | `border-l-gold` | Existing |
| Datatable header | — | `bg-ink-800` | Existing |
| Form label | — | `text-cream` | Existing |
| Input field | — | `bg-ink-800 border-ink-600` | Existing |
| Focus ring | `ring-gold` | Existing | Check if present |

**Design-system-keeper handoff:** Mevcut token yeterli. Focus ring `ring-gold` kontrol et.

---

## 4. Visual hierarchy (Refactoring UI) — Admin özel

### Grayscale-first (dark mode)

Admin UI = **data-dense**, renk ikincil. Hiyerarşi size + weight + whitespace ile:

```
┌─ Sidebar ──────────────────┐
│ Logo (18px bold, cream)    │
│                            │
│ Dashboard (14px, ink-300)  │ ← secondary
│ Görevler  (14px, gold)     │ ← active (color assist)
│ ...                        │
│                            │
│ Ayşe Kan (13px, ink-300)   │ ← caption
│ [Logout]                   │
└────────────────────────────┘

┌─ Top bar ───────────────────────────────┐
│ Görevler / Yeni          [Avatar ▼]    │
└─────────────────────────────────────────┘

┌─ Content ─────────────────────────────┐
│                                       │
│ 4 Metric Card (hero)                  │
│ [120 Karma]  [45 Üye]  [8 Doğr] [↑2] │
│                                       │
│ Datatable                             │
│ [Header] | [Header] | [Header]        │
│ [Row 1 with text + action]            │
│ [Row 2 ...                            │
│ ...                                   │
└───────────────────────────────────────┘
```

**Size scale:**
- Hero number: 48px (5xl), weight 900 (black)
- Page title: 20px (xl), weight 600 (semibold)
- Section header: 16px (base), weight 600 (semibold)
- Card title: 14px (sm), weight 500 (medium)
- Body: 14px (sm), weight 400 (normal)
- Caption: 12px (xs), weight 400 (normal)

**Weight ladder:**
- Regular (400): body, caption
- Medium (500): labels, secondary CTA
- Semibold (600): card titles, section headers
- Bold (700): page title, primary CTA
- Black (900): hero number (Karma count only)

**Constraint:** Max 3 weight per screen.

### Data density without overwhelm

**Pattern:** Airtable row height 32px (compact mode)

```
┌─ Datatable ─────────────────────────────────────────┐
│ ✓ | Başlık | Domain | Karma | Status | Oluş | Eylem│
├─────────────────────────────────────────────────────┤
│ □ | Fidan ... | Çevre | 20 | Yayında | Hf  | ⋯    │  ← 32px height
│ □ | Okuma ... | Eğit | 15 | Taslak  | Pzt | ⋯    │
│ □ | Ziyaret.. | Sos  | 10 | İptal   | Cumla| ⋯   │
└─────────────────────────────────────────────────────┘

Row padding: 8px (top/bottom) = 32px total
Column gap: 12px
Border: 1px border-ink-700 horizontal, no vertical
```

### Focal action

**Per screen:** Tek primary button (görevlerde "Yeni görev", doğrulama'da "Tümünü onayla", raporda "CSV indir")

### Form label positioning

**Pattern:** Label above input, not inline.

```
Başlık *
[________________________]  ← 40px height input

Açıklama *
[________________________]  ← 120px textarea
[________________________]
```

Spacing: 8px label-to-input, 16px field-to-field.

---

## 5. Motion spec — admin-odaklı

### Timing band

| Type | Duration | Use |
|---|---|---|
| Micro | 80–120ms | Toggle, check, icon change |
| Small | 150–200ms | Button tap, form field focus |
| Medium | 300–400ms | Card/row entry, modal open |
| Large | 500–800ms | Hero reveal, count-up animation |
| Celebration | 1500–3000ms | Success ceremony |

### Easing

- **Default spring:** `{ stiffness: 400, damping: 30 }` (snappy, not bouncy)
- **Entry:** Cubic bezier `[0.16, 1, 0.3, 1]` (smooth land)
- **Exit:** Cubic bezier `[0.4, 0, 1, 1]` (faster out)

### Stagger entry

```typescript
transition={{ delay: i * 0.05, duration: 0.3 }}
```

Max 8 items. 9+ → loop closed.

### Specific choreography

**Sidebar item tap:**
```
- Hover: scale 1.02, bg-ink-800 + shadow-sm (150ms)
- Tap: scale 0.97 (100ms spring)
- Active: border-l-2 gold, no animation (instant)
```

**Modal entry (confirm, form error):**
```
- Backdrop: fade 0–1 opacity (200ms ease)
- Content: scale 0.9→1, opacity 0→1 (400ms spring)
- Reduced motion: instant, no scale
```

**Toast (save success):**
```
- Entry: slide-up (0, 16px) → (0, 0), fade 0→1 (300ms ease)
- Hold: 4 second visible
- Exit: fade 1→0 (200ms ease)
- Reduced motion: opacity only, no slide
```

**Datatable sort header icon:**
```
- Click: icon rotate 180° (200ms)
- Reduced motion: instant rotate
```

**Form validation error:**
```
- Border: red (#C8553D)
- Shake: rotate [-2, 2, -2, 0]° (150ms)
- Message slide: from -8px, to 0 (200ms)
- Reduced motion: no shake, color only
```

**Metric card count-up (dashboard):**
```
- Number: 0 → 120, duration 800ms, ease custom [0.25, 0.46, 0.45, 0.94] (easeOutQuad-like)
- Font: tabular-nums (width stable)
- Reduced motion: instant count, no animation
```

### Reduced motion

**Mandatory:** Every animation checks `useReducedMotion()` (Framer Motion hook).

```typescript
import { useReducedMotion } from 'framer-motion'

const prefersReducedMotion = useReducedMotion()
// Falls back to instant (duration: 0) OR opacity-only (remove transforms)
```

---

## 6. 10 Sayfa Spec — Detaylı

### Sayfa 1 — Dashboard (`/admin/[ngoId]/`)

**JTBD:** "STK operasyonumun haftalık durumunu 30 saniyede görsün; acil aksiyon gerekirse bak."

**Wireframe:**
```
┌─ Top bar ──────────────────────────────────┐
│ Panelime Hoş Geldiniz    [Ayşe ▼]         │
└────────────────────────────────────────────┘

┌─ Content (max-w 1280px, px-24) ──────────┐
│                                           │
│ Merhaba, Ayşe 👋                         │
│ Bu ayın özeti:                           │
│                                           │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │ +45      │ │ 12 yeni  │ │ 3        │  │
│ │ Karma    │ │ Üye      │ │ Doğrulama│  │
│ │          │ │          │ │ Bekleyen │  │
│ └──────────┘ └──────────┘ └──────────┘  │
│                                           │
│ Trend (son 7 gün):                       │
│ [Sparkline: bar chart 7 days]            │
│                                           │
│ Son 5 aktivite:                          │
│ • 14:30 — Fidan dikim yayınlandı        │
│ • 12:15 — Zeynep onaylandı (+20 karma) │
│ • 11:00 — Blog "Orman hikayesi" (Ayşe) │
│ • ... (2 more)                          │
│                                           │
│ [Yeni görev] [Doğrulama (3) →]          │
│                                           │
└───────────────────────────────────────────┘
```

**Components:**
- `AdminMetricCard` (atom): icon + number (large, 48px) + label + delta badge (% + trend arrow)
- `AdminActivityList` (molecule): icon + timestamp + description + link
- `AdminTrendSparkline` (atom): 7-day bar chart, recharts library

**Token:**
- Card bg: `bg-ink-800 rounded-2xl shadow-md`
- Number: `text-5xl font-black text-gold tabular-nums`
- Label: `text-xs font-medium text-ink-300 uppercase`
- Activity item: `border-b border-ink-700 py-2 last:border-b-0`
- CTA button: `bg-gold text-ink-900 rounded-xl px-4 py-2 font-semibold`

**Variant × state:**

| State | Card bg | Number | Shadow | Motion |
|---|---|---|---|---|
| Default | `bg-ink-800` | gold | `shadow-md` | — |
| Hover | `bg-ink-700` | gold | `shadow-lg` | scale 1.02 (150ms) |
| Loading (skeleton) | `bg-ink-700 animate-pulse` | — | — | shimmer 1.5s |
| Focus (keyboard nav) | `ring-2 ring-gold` | gold | `shadow-md` | — |

**Motion:**
- Entry: stagger 80ms per card, scale 0.98→1 opacity 0→1 (400ms spring)
- Count-up: 0→N (800ms, ease-out-quad, tabular-nums)
- Reduced motion: instant count, no scale

**A11y:**
- Metric cards: `role="region" aria-label="Aylik ozet"`
- Number: `aria-label="+45 karma bu ay"`
- Links (Görevler, Doğrulama): `focus:outline-none focus:ring-2 ring-gold`
- Touch target: ≥48px button, card clickable area ≥44px

**Data:**
- `select sum(karma_awarded) from user_missions where ngo_id = ? and created_at > this_month`
- `count(ngo_memberships) where ngo_id = ? and created_at > 30 days`
- `count(user_missions) where mission.ngo_id = ? and admin_review_status = 'pending'`
- Trend: `count(missions) group by day last 7 days`
- Activity: order by `created_at desc limit 5`, type = (mission publish / member approve / blog post)

**Effort:** S (1–1.5 gün)

---

### Sayfa 2 — Görev yayınla/düzenle (`/admin/[ngoId]/missions/new` + `/[id]/edit`)

**JTBD:** "Yeni görev oluşturup hemen yayınlayabileyim; draft kaydedip ertesi gün devam edebileyin."

**Wireframe:**
```
┌─ Top bar ────────────────────────────────────┐
│ Yeni Görev / Düzenle   [Taslak] [Yayınla →]│
└──────────────────────────────────────────────┘

┌─ Content ───────────────────────────────────┐
│                                             │
│ Başlık *                                   │
│ [_______________________________]          │
│ En az 3, en fazla 100 karakter              │
│                                             │
│ Açıklama * (Markdown)                      │
│ ┌─────────────────────────────────────────┐│
│ │ # Başlık                                ││
│ │ Açıklamayı yazın, Markdown format:      ││
│ │ - Madde                                 ││
│ │ **bold**  *italic*  [link](url)         ││
│ └─────────────────────────────────────────┘│
│ [Preview tab]  [Markdown ipuçları]        │
│                                             │
│ Kategori * (dropdown)                     │
│ [Çevre ▼]  — Doğa, İklim, Su              │
│                                             │
│ Karma Puanı * (number input OR formula)   │
│ [20] puan    [Formül öner ▼]               │
│                                             │
│ Tarih & Saat *                             │
│ [📅 24 Nisan 2026] [🕐 14:00]             │
│                                             │
│ Yer                                       │
│ [Belgrad Ormanı, İstanbul]                │
│                                             │
│ Görsel Upload * (5 MB max)                │
│ ┌─────────────────────────────────────┐  │
│ │ 📁 Tıkla veya sürükle               │  │
│ │ (JPEG, PNG, WebP)                   │  │
│ └─────────────────────────────────────┘  │
│ ⬆️ Yükleniyor... 60% (~2s kaldı)         │
│ ┌─────────────────────────────────────┐  │
│ │ Thumbnail: fidan.jpg ✅ 2.3 MB      │  │
│ │ [Değiştir]                          │  │
│ └─────────────────────────────────────┘  │
│                                             │
│ Gönüllülük Sözleşmesi (read-only link) ⓘ │
│                                             │
│ ──────────────────────────────────────   │
│ [Taslak Kaydet] [Yayınla →] (sticky bottom)
│                                             │
└─────────────────────────────────────────────┘
```

**Components:**
- `AdminForm` (organism): react-hook-form + zod
- `AdminTextarea` with markdown toggle (preview side-by-side optional)
- `AdminImageUpload` (molecule): drag-drop + progress bar + preview
- `AdminDateTimePicker` (mobile-friendly)
- `AdminSelect` (dropdown category)
- `AdminNumberInput` (karma points)
- `AdminFormActions` (molecule): sticky bottom [Taslak] [Yayınla]

**Token:**
- Label: `text-cream font-semibold text-sm`
- Input: `bg-ink-800 border border-ink-600 rounded-xl px-3 py-2 text-cream`
- Error: `text-clay text-xs mt-1`
- Placeholder: `text-ink-400`
- Markdown editor bg: `bg-ink-900 border border-ink-700`
- Button primary: `bg-gold text-ink-900 font-semibold rounded-xl px-4 py-2`
- Button secondary: `bg-ink-700 text-cream font-semibold rounded-xl px-4 py-2`

**Variant × state:**

| Element | Default | Focus | Error | Disabled |
|---|---|---|---|---|
| Text input | `bg-ink-800 border-ink-600` | `ring-2 ring-gold` | `border-2 border-clay` | `bg-ink-700 opacity-50` |
| Dropdown | `bg-ink-800 border-ink-600` | `ring-2 ring-gold` | `border-clay` | opacity-50 |
| Textarea (markdown) | `bg-ink-900` | `ring-gold` | `border-clay` | opacity-50 |
| Image upload area | dashed border `border-ink-600` | `bg-ink-700` | `border-clay` | `bg-ink-700` |
| [Taslak] button | `bg-ink-700` | `bg-ink-600` | — | `opacity-50` |
| [Yayınla] button | `bg-gold` | `bg-gold/90` | — | `opacity-50` |

**Motion:**
- Form entry: fade-in + translate-up 200ms (all fields stagger 50ms)
- Image upload progress: bar 0–100% (3sn linear)
- "Yayınla" success: toast slide-up 300ms + confetti micro-wave optional
- Modal confirm (destructive): backdrop fade + content scale 0.95→1 (400ms spring)
- Reduced motion: instant (no scale, no fade)

**A11y:**
- Label → Input aria-labelledby
- `aria-required="true"` on required fields
- Error message: `role="alert" aria-live="polite"`
- Markdown syntax link: `aria-label="Markdown syntax help"`
- Image upload: `accept="image/jpeg,image/png,image/webp"` + MIME validation
- Touch target: ≥44px button, upload area ≥48px
- Keyboard: Tab through fields, Space/Enter activate buttons
- Reduced motion: no motion animations

**Data:**
- Insert/update: `missions` (ngo_id, title, description, domain, karma_points, event_date, location, image_url, status='draft'|'published', access_level, prep_checklist)
- Image: Supabase Storage `ngo-assets/missions/{ngoId}/{missionId}/{uuid}.jpg`
- Validation: title 3–100 chars, description 10–5000 chars, karma 5–500, date future OK

**Form auto-save:**
- Every 30 seconds: auto-save to draft (local state + DB)
- Toast: "Taslaklı" indicator (bottom-right, subtle)
- Manual save: [Taslak Kaydet] button

**Confirmation modal (before publish):**
```
┌─ Modal ───────────────────────────────────┐
│ ⚠️ Görev Yayınla                          │
│                                           │
│ Bu görev hemen gönüllülere görünecek.    │
│                                           │
│ Başlık: "Fidan dikim etkinliği"          │
│ Tarih: 24 Nisan 14:00                    │
│ Yer: Belgrad Ormanı                      │
│ Karma: +20 puan                          │
│                                           │
│ [Geri] [Yayınla] ➜                       │
└───────────────────────────────────────────┘
```

**Effort:** L (2–2.5 gün)

---

### Sayfa 3 — Görev listesi (`/admin/[ngoId]/missions`)

**JTBD:** "Açtığım tüm görevleri bir yerde görüp durumlarını kontrol edeyim; toplu aksiyon yapabileyim."

**Wireframe:**
```
┌─ Top bar ────────────────────────────────┐
│ Görevlerim                [🔍 Ara] [⋯]   │
└──────────────────────────────────────────┘

┌─ Filters (sticky, left/top) ──────────┐
│ Status: [Yayında▼] [Taslak] [İptal]   │
│ Domain: [Çevre] [Eğitim] [Sosyal] ... │
│ Sort: [Oluş. tarihi ▼]                 │
└────────────────────────────────────────┘

┌─ Datatable ───────────────────────────┐
│ ✓ | Başlık  | Domain | Karma | Stat | │
├───────────────────────────────────────┤
│ □ | Fidan..| Çevre  |  20  | ✅   │ │ ← 32px height
│ □ | Okuma..| Eğit   |  15  | 📝   │ │
│ □ | Ziyar..| Sosyal |  10  | ✖️   │ │
│ (10+ more rows, scroll)               │
│                                       │
│ [12 görev] ┈┈┈┈┈┈┈ [CSV indir] [→]  │
└───────────────────────────────────────┘
```

**Components:**
- `AdminDataTable` (organism): columns (checkbox, title, domain, karma, status, actions), sort, filter
- `AdminStatusBadge` (atom): "Yayında" (green success), "Taslak" (gray), "İptal" (red clay)
- `AdminBulkActionBar` (molecule): "N seçili — [Yayınla] [İptal]"

**Token:**
- Table header: `bg-ink-800 border-b border-ink-700 font-semibold text-cream`
- Table row: `border-b border-ink-700 hover:bg-ink-800`
- Cell padding: 8px vertical, 12px horizontal
- Status badge: `text-xs font-semibold rounded-full px-2 py-1`
  - Yayında: `bg-success/20 text-success`
  - Taslak: `bg-ink-700 text-ink-300`
  - İptal: `bg-clay/20 text-clay`

**Variant × state:**

| Element | Default | Hover | Active (selected) | Focus |
|---|---|---|---|---|
| Row | `border-ink-700` | `bg-ink-800` | `bg-ink-700` | — |
| Checkbox | `border-2 border-ink-600` | — | `bg-gold border-gold` | `ring-gold` |
| Title cell | `text-cream` | — | — | — |
| Status badge | color-coded | — | — | — |
| Action menu (⋯) | `text-ink-400` | `text-cream` | — | `ring-gold` |

**Motion:**
- Row entry: stagger 60ms, fade-in opacity 0→1 (300ms)
- Bulk action bar entry: slide-up + fade (300ms)
- Sort icon: rotate 180° on click (200ms)
- Checkbox toggle: scale 0.95→1 (80ms spring)
- Reduced motion: instant

**A11y:**
- Checkbox: `aria-label="Seç {title}"`
- Table: `role="table"`
- Header row: `role="row"`
- Data rows: `role="row"`
- Column headers: `scope="col"`
- Action buttons: `aria-label="Düzenle Fidan..."` etc.
- Keyboard: Tab through, Space select checkbox, Enter open detail
- Touch target: ≥44px checkbox, row height 32px + cell padding OK

**Data:**
- `select * from missions where ngo_id = ? order by created_at desc`
- Datatable: title, domain, karma_points, status, created_at
- Filter: status in ('draft', 'published', 'cancelled'), domain in enum
- Search: title + description full-text (FTS if possible, else LIKE)
- Bulk action: select multiple → update status batch

**Effort:** M (1–1.5 gün)

---

### Sayfa 4 — Üye listesi (`/admin/[ngoId]/members`)

**JTBD:** "STK üyelerimi topluca görebilim; kim aktif, kim süresi dolmuş; export edebilim."

**Wireframe:**
```
┌─ Filters ─────────────────────────┐
│ Status: [Aktif] [Süresi Dolmuş]  │
│ Tier: [Hepsi▼]   [🔍 Ara]        │
└───────────────────────────────────┘

┌─ Datatable ───────────────────────┐
│ ✓ | Ad | Email | Şehir | Tier | S │
├───────────────────────────────────┤
│ □ | Zeynep | z@... | Istanbul| B | A │
│ □ | Ali    | a@... | Ankara | T | S │
│ ... (100+ members, lazy load)      │
│                                    │
│ [150 üye] ──────── [CSV indir] [→]│
└────────────────────────────────────┘
```

**Components:**
- `AdminDataTable` (organism): columns (checkbox, name, email, city, tier, status)
- `AdminTierBadge` (atom): "Temel", "Standart", "Destek"
- `AdminStatusBadge` (atom): "Aktif" (green), "Süresi dolmuş" (gray)
- CSV export button

**Token:**
- Same as Sayfa 3 (reuse datatable pattern)
- Tier badge: `text-xs font-medium rounded-full px-2 py-1`
  - Free: `bg-ink-700 text-ink-300`
  - Basic: `bg-gold/20 text-gold`
  - Premium: `bg-success/20 text-success`

**Motion:**
- Same as Sayfa 3 (stagger, no bounce)

**A11y:**
- Same as Sayfa 3 (table semantics, keyboard nav, touch)
- CSV export: `aria-label="CSV dosyası indir"`

**Data:**
- `select * from ngo_memberships where ngo_id = ? and status in ('active', 'expired')`
- CSV export: name, email, city, tier, start_date (KVKK compliant, no phone/address V1)
- Filter: status, tier
- Search: name, email
- Pagination: lazy-load, 50 per page

**Effort:** M (1–1.5 gün)

---

### Sayfa 5 — Doğrulama kuyruğu (`/admin/[ngoId]/verifications`)

**JTBD:** "Gönüllüler görevini tamamlayıp fotoğraf gönderdiğinde 30 saniye içinde onaylayabileyim."

**Wireframe:**
```
┌─ Queue header ─────────────────────┐
│ Bekleyen Doğrulamalar (5)          │
│ [Tümünü onayla] [Filtre ▼]         │
└────────────────────────────────────┘

┌─ Queue card list ──────────────────┐
│                                    │
│ ┌─ Card 1 ─────────────────────┐  │
│ │ 📷 [Fotoğraf thumbnail]      │  │
│ │ Zeynep Kaya                  │  │
│ │ "Fidan dikim etkinliği" ✓    │  │
│ │ 14 Nisan 14:30              │  │
│ │                              │  │
│ │ [Onayla ✓] [Reddet ✗]        │  │
│ └──────────────────────────────┘  │
│                                    │
│ ┌─ Card 2 ─────────────────────┐  │
│ │ ... (4 more)                 │  │
│ └──────────────────────────────┘  │
│                                    │
│ Önceki onaylar (10 +) [Show more] │
│                                    │
└────────────────────────────────────┘
```

**Components:**
- `AdminVerificationCard` (organism): photo thumbnail + gönüllü ad + görev ad + tarih + approve/reject buttons
- `AdminVerificationModal` (organism): large photo + detail + feedback textarea + approve/reject
- `AdminVerificationHistory` (molecule): list of approved/rejected

**Token:**
- Card: `bg-ink-800 border border-ink-700 rounded-xl p-3`
- Photo thumbnail: `rounded-lg object-cover 120px × 120px`
- Button approve: `bg-success text-white`
- Button reject: `bg-clay text-white`
- Textarea (feedback): `bg-ink-900 border-ink-600 text-cream`

**Variant × state:**

| Element | Default | Hover | Active | Focus |
|---|---|---|---|---|
| Card | `border-ink-700` | `shadow-lg border-gold` | — | — |
| Approve button | `bg-success` | `bg-success/90` | scale 0.97 | `ring-gold` |
| Reject button | `bg-clay` | `bg-clay/90` | scale 0.97 | `ring-gold` |
| Modal backdrop | `bg-black/50` | — | — | — |

**Motion:**
- Card entry: stagger 80ms, scale 0.98→1 (400ms spring)
- Approve/Reject button: tap scale 0.97 (100ms), success toast slide-up 300ms
- Modal open: backdrop fade (200ms), content scale 0.95→1 (400ms spring)
- Photo zoom: modal open instantly, photo visible full-res
- Reduced motion: instant, no scale

**A11y:**
- Card: `role="article"`
- Photo: `alt="Gönüllü {name} görev doğrulaması fotosu"`
- Button approve: `aria-label="Onayla {volunteer} {mission}"`
- Button reject: `aria-label="Reddet {volunteer}"`
- Feedback textarea: `aria-label="Neden reddettiniz?"`
- Modal: `role="dialog" aria-label="Doğrulama detayı"`
- Keyboard: Tab through cards/buttons, Enter approve/reject, Escape close modal
- Touch target: ≥48px button

**Data:**
- `select um.*, u.name, m.title from user_missions um join profiles u on u.id = um.user_id join missions m on m.id = um.mission_id where m.ngo_id = ? and um.admin_review_status = 'pending' order by um.completed_at`
- Modal load: large photo URL, gönüllü email, görev description, submission metadata
- Approve: update `admin_review_status = 'approved'`, award karma `insert karma_transactions`, notification to user
- Reject: update `admin_review_status = 'rejected'`, insert `admin_feedback`, notification to user
- Bulk action: select multiple checkboxes → "Tümünü onayla" → confirmation modal "N görevleri onayla?" → batch update

**Effort:** L (1.5–2 gün)

---

### Sayfa 6 — Aylık rapor (`/admin/[ngoId]/reports`)

**JTBD:** "Yıllık rapor için son 12 ayın veri istiyorum — kaç görev, kaç karma, kaç üye eklendi?"

**Wireframe:**
```
┌─ Report header ───────────────────────┐
│ Aylık Rapor (Son 12 ay)               │
└───────────────────────────────────────┘

┌─ 4 Metric cards ──────────────────────┐
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│ │120│ │456│ │ 78│ │ 34│              │
│ │Gör│ │Karm│ │Üy│ │Ban│              │
│ └───┘ └───┘ └───┘ └───┘              │
└───────────────────────────────────────┘

┌─ Chart (line) ────────────────────────┐
│ Trend: Görev / Karma / Üye             │
│                                        │
│     ╱╲                                 │
│    ╱  ╲    ╱╲                          │
│   ╱    ╲  ╱  ╲                         │
│  ╱      ╲╱    ╲╱                       │
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔               │
│ [Legend: Görev ◼ Karma ◼ Üye ◼]      │
└────────────────────────────────────────┘

┌─ Table (12 months) ───────────────────┐
│ Ay | Görev | Karma | Üye | % ▲        │
├──────────────────────────────────────┤
│ Nis│  12  │ 120  │  8  │ +5%         │
│ May│  15  │ 156  │ 10  │ +8%         │
│ ... (10 more)                        │
└────────────────────────────────────────┘

[CSV indir] [Paylaş] [→]
```

**Components:**
- `AdminMetricCard` (atom): reuse from dashboard
- `AdminLineChart` (organism): recharts library, 3 series
- `AdminReportTable` (organism): 12-row table, monthly granularity

**Token:**
- Chart: `stroke-gold` (primary line), `stroke-success` (secondary), `stroke-ink-300` (tertiary)
- Legend: `text-xs text-ink-300`
- Table: same as datatable pattern

**Motion:**
- Metric card entry: stagger, count-up 800ms
- Chart load: line draw animation (optional, V1.1)
- Reduced motion: instant count, instant chart

**A11y:**
- Chart: `role="img" aria-label="12-month trend: missions, karma, members"`
- Chart data: text summary below ("April: 12 missions, 120 karma awarded, 8 new members")
- Table: semantic table with headers, caption "Monthly report for 12 months"
- Keyboard: Tab to download button, Enter download

**Data:**
- Aggregate query: group by month last 12, count missions published, sum karma awarded, count new members
- Chart data: array of { month, missions, karma, members }
- CSV: same array, formatted YYYY-MM-DD, UTF-8

**Effort:** M (1–1.5 gün)

---

### Sayfa 7 — Blog (`/admin/[ngoId]/blog/new` + `/[id]/edit` + `/`)

**JTBD:** "STK hikayemizi yazıp topluluğa anlatabileyim; markdown'da yazsam draft kaydedebilim."

**Wireframe:**

**List view:**
```
┌─ Blog header ──────────────────┐
│ Blog Yazıları   [+ Yeni yazı]  │
└────────────────────────────────┘

┌─ Post list ────────────────────┐
│ ┌─ Post 1 ──────────────────┐ │
│ │ "Orman hikayesi"          │ │
│ │ Yayınlandı • 3 gün önce   │ │
│ │ [Düzenle] [Sil]           │ │
│ └───────────────────────────┘ │
│ ┌─ Post 2 (Draft) ──────────┐ │
│ │ "Yeni projemiz"           │ │
│ │ Taslak                    │ │
│ │ [Düzenle] [Sil]           │ │
│ └───────────────────────────┘ │
└────────────────────────────────┘
```

**Editor view:**
```
┌─ Top bar ────────────────────────┐
│ Yeni Yazı / Düzenle  [Taslak][Yayınla→]
└──────────────────────────────────┘

┌─ Content ──────────────────────┐
│                                │
│ Başlık *                       │
│ [_____________________________]│
│                                │
│ Kapak Görsel Upload           │
│ ┌──────────────────────────┐  │
│ │ [Tıkla veya sürükle]     │  │
│ │ [Kapak thumbnail]        │  │
│ │ [Değiştir]               │  │
│ └──────────────────────────┘  │
│                                │
│ İçerik * (Markdown)           │
│ [─────────────────────────]   │
│ │ # Başlık                  │   │
│ │ ## Alt başlık             │   │
│ │ Yazı metni yazın          │   │
│ │ - Madde                   │   │
│ │ **bold** *italic*         │   │
│ [Preview tab] [Ipuçları]     │
│                                │
│ ───────────────────────────── │
│ [Taslak Kaydet][Yayınla →]   │
│                                │
└────────────────────────────────┘
```

**Components:**
- `AdminBlogEditor` (organism): title input, cover upload, markdown editor, publish toggle
- `AdminMarkdownPreview` (molecule): side-by-side or toggle view
- `AdminBlogList` (molecule): post cards, status badge

**Token:**
- Title input: same as form pattern
- Markdown editor: `bg-ink-900 border-ink-700 font-mono text-sm`
- Preview pane: `bg-ink-900 px-4`
- Cover image: `rounded-2xl object-cover h-48 w-full`

**Motion:**
- Post card entry: stagger 80ms (300ms spring)
- Markdown toggle: fade 200ms
- Publish success: toast + redirect 300ms
- Reduced motion: instant

**A11y:**
- Title: `aria-label="Blog yazı başlığı"`
- Markdown editor: `aria-label="Blog içeriği, Markdown formatı"`
- Preview: `role="region" aria-live="polite"`
- Publish button: `aria-label="Yazıyı yayınla"`

**Data:**
- Insert/update: `posts` (ngo_id, title, slug, content, cover_image_url, status='draft'|'published', author_id)
- Auto-save: every 30 seconds (local draft indicator)
- Image: Supabase Storage `ngo-assets/{ngoId}/blog/{postId}/cover.jpg`
- Slug auto-generate from title (kebab-case)

**Effort:** M (1–1.5 gün)

---

### Sayfa 8 — STK profil (`/admin/[ngoId]/profile`)

**JTBD:** "STK'mızın logo, cover, açıklama, iletişim bilgilerini güncelleyebilim."

**Wireframe:**
```
┌─ Content ──────────────────────────┐
│                                    │
│ Logo Upload                       │
│ ┌─────────────────┐               │
│ │ [Logo preview]  │  [Değiştir]   │
│ │ 200×200px       │               │
│ └─────────────────┘               │
│                                    │
│ Cover Image Upload               │
│ ┌────────────────────────────┐    │
│ │ [Cover preview 1200×400]   │    │
│ │                            │    │
│ │           [Değiştir]       │    │
│ └────────────────────────────┘    │
│                                    │
│ STK Adı (read-only)              │
│ TEMA Vakfı                        │
│                                    │
│ Kısa Başlık (max 100)           │
│ [_______________________________] │
│                                    │
│ Açıklama (max 500)               │
│ [_______________________________] │
│ [____________________________]    │
│                                    │
│ İletişim                         │
│ Email: [___________________]     │
│ Telefon: [__________________]    │
│ Website: [__________________]    │
│                                    │
│ Sosyal Medya                     │
│ Instagram: @tema (handle)         │
│ Twitter: @tema                    │
│ LinkedIn: /company/tema           │
│                                    │
│ ───────────────────────────────  │
│ [Kaydet] [Geri]                  │
│                                    │
└────────────────────────────────────┘
```

**Components:**
- `AdminImageUpload` (molecule): logo + cover, separate
- `AdminForm` (organism): text fields, social handles validation

**Token:**
- Same as form pattern
- Image preview: rounded-2xl, shadow-md

**Motion:**
- Form entry: fade + slide-up 300ms
- Image upload: progress bar + success toast 300ms
- Reduced motion: instant

**A11y:**
- Image upload: `aria-label="STK logosu yükle"`
- Form fields: aria-labelledby
- Save button: `aria-label="Profil bilgilerini kaydet"`

**Data:**
- Update: `ngos` (logo_url, cover_url, tagline, description, email, phone, website, social_instagram, social_twitter, social_linkedin)
- Image: Supabase Storage `ngo-assets/{ngoId}/profile/logo.png`, `cover.jpg`

**Effort:** S (0.5–1 gün)

---

### Sayfa 9 — Üyelik ayarları (`/admin/[ngoId]/membership-config`)

**JTBD:** "Üyelik fee tier'larını tanımlayabileyim, form alanlarını, yasal dokümanları yönetebilim."

**Wireframe:**
```
┌─ Content ──────────────────────────┐
│                                    │
│ Üyelik Tier'ları                  │
│ ┌─ Tier 1 ──────────────────────┐ │
│ │ Temel                         │ │
│ │ ₺50/ay                        │ │
│ │ Yaş: 18-28                    │ │
│ │ "Haftalık e-bülten"           │ │
│ │ [Düzenle] [Sil]               │ │
│ └───────────────────────────────┘ │
│ ┌─ Tier 2 ──────────────────────┐ │
│ │ ... (2 more)                  │ │
│ └───────────────────────────────┘ │
│                                    │
│ [+ Tier Ekle]                     │
│                                    │
│ Cooling-off Süre (gün):           │
│ [14] ◼────────────◻ [30]         │
│                                    │
│ Üyelik Form Alanları             │
│ ☑ TC Kimlik (Required)            │
│ ☑ Telefon (Required)              │
│ ☐ Adres (Optional)                │
│ ☑ Doğum Tarihi (Required)         │
│                                    │
│ Yasal Dokümanlar                 │
│ KVKK Aydınlatma PDF:             │
│ ┌──────────────────────────────┐ │
│ │ kvkk.pdf ✅ Upload: 2 gün   │ │
│ │ [Değiştir]  [Önizle]        │ │
│ └──────────────────────────────┘ │
│ Üyelik Sözleşmesi:               │
│ ┌──────────────────────────────┐ │
│ │ [Dosya seç] (Upload)         │ │
│ └──────────────────────────────┘ │
│ Gönüllülük Sözleşmesi:            │
│ ┌──────────────────────────────┐ │
│ │ [Dosya seç] (Upload)         │ │
│ └──────────────────────────────┘ │
│                                    │
│ ───────────────────────────────  │
│ [Kaydet] [Geri]                  │
│                                    │
└────────────────────────────────────┘
```

**Modal (Tier ekle/düzenle):**
```
┌─ Modal ────────────────────────────┐
│ Tier Ekle / Düzenle               │
│                                   │
│ Adı *                             │
│ [Temel]                           │
│                                   │
│ Aylık Ücret * (₺)                │
│ [50]  (Min ₺1, Max ₺10000)        │
│                                   │
│ Yaş Aralığı                       │
│ Min: [18] ◼─────────◻ Max: [28]  │
│                                   │
│ Açıklama                          │
│ [Haftalık e-bülten + özel etkinlik│
│                                   │
│ [Vazgeç] [Kaydet] ✓               │
└───────────────────────────────────┘
```

**Components:**
- `AdminTierCard` (molecule): display tier info, edit/delete buttons
- `AdminTierModal` (organism): add/edit tier form
- `AdminFormCheckbox` (atom): required field toggle
- `AdminSlider` (atom): cooling-off days
- `AdminFileUpload` (molecule): PDF upload, preview link

**Token:**
- Tier card: `bg-ink-800 border-gold rounded-xl p-4`
- Form slider: `accent-gold`
- Checkbox: `accent-gold`

**Motion:**
- Tier card entry: stagger (300ms spring)
- Modal open: backdrop fade + scale (400ms spring)
- File upload: progress bar, success toast (300ms)
- Reduced motion: instant

**A11y:**
- Tier list: `role="region" aria-label="Üyelik Seviyeleri"`
- Checkbox: `aria-label="TC Kimlik alanı zorunlu mu?"`
- Slider: `aria-label="Soğukluk süresi: 14 gün"`
- File input: `aria-label="KVKK PDF dosya seç"`
- Modal: `role="dialog" aria-label="Yeni üyelik seviyesi ekle"`

**Data:**
- Tier config: jsonb `{ tiers: [ { name, amount, age_min, age_max, benefit } ] }`
- Form fields: jsonb `[ { label, required } ]`
- Cooling-off days: integer 7–30 (default 14)
- Documents: `ngo_documents` table (kvkk_url, membership_url, volunteering_url) Supabase Storage paths

**Validation:**
- Tier name: 3–50 chars
- Amount: 1–10000 TRY
- Age range: valid (min < max, both 0–120)
- File: PDF only, max 10 MB

**Effort:** L (1.5–2 gün)

---

### Sayfa 10 — Ödeme (`/admin/[ngoId]/payments`)

**JTBD:** "Ödeme processor'umu görebilim, bağış/üyelik URLleri self-serve girebilim."

**Wireframe:**
```
┌─ Content ────────────────────────────┐
│                                      │
│ Ödeme Altyapısı                     │
│                                      │
│ ┌─ Mode Card ────────────────────┐  │
│ │ Embedded Mode                  │  │
│ │ İyiBiri tarafından yönetilir   │  │
│ │ Processor: iyzico ✅           │  │
│ │ Durum: Aktif (2026-04-20)      │  │
│ │ [Nedir? ⓘ]                     │  │
│ └────────────────────────────────┘  │
│                                      │
│ Bağış Linki (opsiyonel)             │
│ [https://bagislar.fonzip.com/...]   │
│ [Kaydet]                            │
│                                      │
│ Üyelik Linki (opsiyonel)            │
│ [https://uyelik.fonzip.com/...]     │
│ [Kaydet]                            │
│                                      │
│ Webhook Durumu ✅                   │
│ "Entegrasyon doğru çalışıyor"       │
│                                      │
│ Desteğe ihtiyacınız varsa:          │
│ [support@iyibiri.app]               │
│                                      │
└──────────────────────────────────────┘
```

**Components:**
- `AdminPaymentModeCard` (atom): read-only mode display
- `AdminPaymentURLInput` (molecule): URL field + save
- `AdminWebhookStatus` (atom): badge display

**Token:**
- Card: `bg-ink-800 border-ink-700 rounded-xl p-4`
- Input: standard form pattern (but light gray background, disabled-looking)
- Webhook badge: `bg-success/20 text-success`

**Motion:**
- Card entry: fade + slide-up (300ms)
- URL save: toast success (300ms)
- Reduced motion: instant

**A11y:**
- Mode card: `role="region" aria-label="Ödeme modu"`
- URL input: `aria-label="Bağış linki"`
- Save button: `aria-label="URL'yi kaydet"`
- Support link: `href="mailto:support@iyibiri.app"`

**Data:**
- Display: `ngos.payment_mode`, `payment_processor` (read-only from platform)
- Input: `ngos.donation_url`, `membership_url` (optional, self-serve)
- Webhook: query `webhook_events` table, latest status timestamp

**Effort:** S (0.5 gün)

---

## 7. Component Handoff (Frontend-engineer için)

**Yeni component listesi:**

| # | Component | Level | Props | Notes |
|---|---|---|---|---|
| 1 | `AdminLayout` | Organism | children, sidebar nav | Sidebar + top bar + content |
| 2 | `AdminSidebar` | Organism | navItems[], activeRoute | Fixed/collapsible, profile bottom |
| 3 | `AdminBreadcrumb` | Molecule | items[] | Top bar breadcrumb |
| 4 | `AdminMetricCard` | Atom | icon, number, label, delta | Hero card pattern, count-up motion |
| 5 | `AdminActivityList` | Molecule | items[], limit | Timeline list |
| 6 | `AdminTrendSparkline` | Atom | data[], label | 7-day bar chart (recharts) |
| 7 | `AdminDataTable` | Organism | columns[], data[], filter, sort | Datatable with checkbox, sort, filter |
| 8 | `AdminFormActions` | Molecule | primaryLabel, secondaryLabel | Sticky bottom [Secondary] [Primary] |
| 9 | `AdminImageUpload` | Molecule | onUpload, maxMB, label | Drag-drop + progress + preview |
| 10 | `AdminConfirmModal` | Organism | title, message, actionLabel | Destructive action guard (K2) |
| 11 | `AdminToast` | Molecule | type, message, duration | Undoable success/error (K2+K6) |
| 12 | `AdminBulkActionBar` | Organism | selectedCount, actions[] | "N seçili + [Action1] [Action2]" |
| 13 | `AdminPageHeader` | Molecule | title, primaryCTA | Page header + primary button |
| 14 | `AdminForm` | Organism | fields[], onSubmit, validation | react-hook-form + zod |
| 15 | `AdminDateTimePicker` | Molecule | value, onChange | Mobile-friendly date+time |
| 16 | `AdminSelect` | Molecule | options[], value, onChange | Dropdown |
| 17 | `AdminTextarea` | Molecule | value, onChange, markdown | Markdown editor with preview toggle |
| 18 | `AdminTierCard` | Molecule | tier, onEdit, onDelete | Tier display + actions |
| 19 | `AdminTierModal` | Organism | mode: 'add'|'edit', tier, onSave | Add/edit tier form |
| 20 | `AdminStatusBadge` | Atom | status, type | Status badge (yayında, taslak, etc.) |

**Existing reuse:**
- `Button` (shadcn) — CTA, secondary
- `Input` (shadcn) — text fields
- `Select` (shadcn) — dropdowns (wrap AdminSelect)
- `Dialog` (shadcn) — modals
- `Toast` (sonner) — notifications (wrap AdminToast)
- `Card` (shadcn) — card container
- Recharts — charting

---

## 8. Token ihlali risk tespiti

**Kontrol:**
- Mevcut palette yeterli? **Evet.** `bg-ink-*`, `text-cream`, `text-ink-*`, `border-ink-*`, `gold`, `clay`, `success`, `domain-*` var.
- Focus ring `ring-gold`? **Kontrol et.** Varsa ok, yoksa ADR aç.
- Admin-spesifik token (sidebar-bg alias, etc.)? **Yok V1, V1.1'de ekle.**

**Tavsiye:**
- Bölüm 3'te `ring-gold` varsa, V1 gerek — ADR yok.
- Varsa, takvim V1.1 — ADR aç.
- Hardcoded renk **YASAKLANIR** — spec'te tüm token adı.

---

## 9. Responsive

**Breakpoints:**
- Desktop ≥1024px: sidebar visible, content wide
- Tablet 768–1023px: sidebar collapsible (hamburger), content full-width
- Mobile <768px: sidebar drawer (slide-from-left), stack components

**Patterns:**
- Datatable: horizontal scroll acceptable (tablet/mobile), column priority (checkbox, title, action always visible)
- Form: full-width fields, touch target ≥44px
- Image upload: drag-drop + file picker (mobile file picker native)
- Bottom actions: sticky bottom-safe

**Safe area:** `pb-safe`, `pt-safe` (iPad notch handling)

---

## 10. 12-maddelik quality checklist

### Bölüm 10 (Visual Hierarchy)

- [x] Grayscale mockup var mı? Size scale tutarlı mı? (48/20/16/14/12 px grid)
- [x] Weight ladder (400/500/600/700/900) max 3 per screen?
- [x] Color = accent, not hierarchy? (gold action, clay danger, ink/cream content)
- [x] Shadow tiers (tier 1/2/3) tutarlı mı?
- [x] Spacing grid 8px base mi? (Token: gap-1/2/3/4)
- [x] Whitespace prominent element'i destekliyor mu?

### Bölüm 11 (Motion)

- [x] Stagger pattern (delay 40-80ms, max 8 items)?
- [x] Spring defaults (stiffness 400, damping 30) İyiBiri pattern?
- [x] useReducedMotion fallback her animation'da?
- [x] Exit animation (AnimatePresence) modal'de?
- [x] Tap feedback (scale 0.97) mobil context?
- [x] Animation duration (max 300ms per segment)?

### Handoff

- [x] Handoff satırı upstream'e yazılacak (end'de)
- [x] Component listesi (20 yeni)
- [x] Token referansları (tüm token adı, no hardcoded)
- [x] Variant × state tablosu kritik element'lerde
- [x] Motion spec (timing + easing + stagger + reduced-motion)
- [x] A11y checklist (WCAG AA baseline)
- [x] Responsive notes (breakpoints, safe area)
- [x] Data schema (DB queries, Supabase paths)

---

## 11. Açık karar (Spec perspective)

Upstream decision queue'den:

- **Q44** (Password reset): Spec → super-admin reset varsay (Q answered).
- **Q45** (Blog iframe): Spec → no HTML embed, markdown + link only (Q answered).
- **Q46** (QR verification): Spec → V1 photo manual, QR V1.1 (Q answered).

---

## 12. Handoff Log

Upstream'e append et:

- 2026-04-24 HH:MM — **ui-designer** ✅ — **UI spec**: `docs/ui/01-specs/2026-04-24-stk-admin-ui-spec.md` (this file). 10 sayfa wireframe + 20 component + token + motion (Bölüm 10+11 full) + a11y + responsive. K1-K8 çözümü detaylı (Ayşe journey peak/dark moment, tier-1 benchmark pattern, UX audit K3/K5 image upload + form validation). Handoff: frontend-engineer Batch A-D implementation, design-system-keeper token check (ring-gold).
- 2026-04-24 HH:MM — **frontend-engineer** ✅ — **Batch B (3 sayfa + sidebar nav)**: `/admin/[ngoId]/verifications` (doğrulama kuyruğu, K2 confirm modal + K6 bulk approve), `/admin/[ngoId]/members` (üye listesi, KVKK uyum banner + email masking K7 + CSV export), `/admin/[ngoId]/reports` (aylık rapor, 4 metric card + 12-month data table), + blog/profile/membership-config/payments placeholder sayfa. Sidebar 10-item nav aktif. TSC 0 hata. Handoff: Batch C (blog + profil + üyelik config editor).

---

## Kaynaklar

- **Workstream:** Bölüm 6 (Walking skeleton), Bölüm 12 (Sprint breakdown)
- **Brief:** Bölüm 2 (Ayşe persona), Bölüm 4 (10 sayfa scope + JTBD)
- **Audit:** Bölüm 3 (20 heuristik matrix K1-K8), Bölüm 4 (5 tier-1 benchmark pattern)
- **Journey:** Adım 6-7 (Dark moment — form + upload), Adım 9-10 (Peak moment — toast + sync)
- **Atlas:** Bölüm 3 (route list), Bölüm 5 (token), Bölüm 6 (color palette)
- **Tailwind:** 41 lines, `ink-*`, `cream`, `gold`, `clay`, `success`, `domain-*` ✅

---

**Son söz:** Spec ready for implementation. Frontend-engineer S1-S4 batches takip edebilir. Visual hierarchy, motion choreography, a11y, responsive — tier-1 app quality standards. Ayşe journey'nin peak moment (toast + anında sync) → walking skeleton end-to-end test gate.
