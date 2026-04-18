# App v2 Pixel-Faithful Redesign

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite every dashboard screen to match the design-system `App v2.html` screens pixel-for-pixel — same colors, typography, spacing, layout, and component structure.

**Architecture:** Each screen is a standalone client component that receives data via props from a thin server-side page.tsx. Shared atoms (KarmaDotToken, KarmaPill, MetaChip, Badge, IconButton, Chip, FactCard, QuickAction, ImpactSummary) live in `components/ui/ds/`. App v2 uses inline styles with design tokens; we translate those to equivalent inline styles in React/Next.js (matching the DS exactly — not approximating with Tailwind utilities).

**Tech Stack:** Next.js 14 App Router, TypeScript, Framer Motion, Supabase, lucide-react icons, next/font (Fraunces + Plus Jakarta Sans)

**Reference files (DO NOT MODIFY — read-only reference):**
- `design-system/ds/tokens.js` — color, font, type, radius, shadow, motion tokens
- `design-system/ds/Components.jsx` — Button, Input, Chip, Badge, IconButton
- `design-system/ds/Blocks.jsx` — MissionCard, NGOCard, HeroCard, TierBadge, BottomNav, RewardCard
- `design-system/ds/Screens.jsx` — Dashboard, MissionDetail
- `design-system/ds/Screens2.jsx` — Discover, Rewards, Profile, Onboarding (4), Mission states (3), Notifications, Streak, Leaderboard
- `design-system/ds/Screens3.jsx` — NGOProfile, MembershipPlans, MembershipSuccess, Donation flows (4)
- `design-system/ds/icons.jsx` — SVG icon set
- `design-system/ds/KarmaToken.jsx` — KarmaToken, KarmaDotToken, KarmaPill
- `design-system/explore/data.js` — V2 data shapes (missions have photo, location, date, spotsLeft, category; NGOs have cover)

**Design tokens reference (use these exact values):**
```
ink:      #1A1612    ink900:   #24201B    ink800:   #2E2923
ink700:   #36302A    ink600:   #3F3830    ink500:   #574E42
ink400:   #7A6F5E    ink300:   #A89E8A    ink200:   #CEC5B2
ink100:   #E6DEC9    cream:    #F4EEDF
gold:     #E8C268    goldDim:  #B58F3D
goldSoft: rgba(232,194,104,.12)    goldLine: rgba(232,194,104,.32)
clay: #C8553D    blush: #E9CFC2    sage: #C4CBAC    wheat: #EADDB8
success: #6B8E4E    warning: #D19B3C    danger: #B84E3B
```

---

## File Structure

### New shared components (components/ui/ds/)
| File | Responsibility |
|------|---------------|
| `components/ui/ds/karma-dot-token.tsx` | Small gold gradient circle (inline in lists) |
| `components/ui/ds/karma-token.tsx` | Large gold coin SVG with monogram |
| `components/ui/ds/karma-pill.tsx` | "+150 Karma" pill badge |
| `components/ui/ds/meta-chip.tsx` | Duration/location chip with icon |
| `components/ui/ds/badge-ds.tsx` | Badge (neutral/gold/dark/onImage) |
| `components/ui/ds/icon-button-ds.tsx` | Circular blur button |
| `components/ui/ds/chip-ds.tsx` | Filter chip (dark/light) |
| `components/ui/ds/fact-card.tsx` | Key-fact tile (date/time/location/spots) |
| `components/ui/ds/quick-action.tsx` | 2×2 grid action button |
| `components/ui/ds/impact-summary.tsx` | Pastel community stats card |
| `components/ui/ds/hero-card.tsx` | Dashboard stat card with karma, tier, progress |
| `components/ui/ds/tier-badge-ds.tsx` | Gold star + tier name inline badge |
| `components/ui/ds/status-icon.tsx` | Mission state icons (hourglass/qr/check) |
| `components/ui/ds/step-item.tsx` | Numbered step row |
| `components/ui/ds/podium-place.tsx` | Leaderboard podium column |
| `components/ui/ds/notif-row.tsx` | Notification list item |

### Modified screens
| File | Changes |
|------|---------|
| `components/ui/mission-card.tsx` | Full rewrite to match Blocks.jsx MissionCard |
| `components/bottom-nav.tsx` | Update to match Blocks.jsx BottomNav |
| `app/dashboard/dashboard-client.tsx` | Full rewrite to match Screens.jsx Dashboard |
| `app/dashboard/missions/missions-client.tsx` | Redesign with v2 filter chips |
| `app/dashboard/missions/[id]/mission-detail-client.tsx` | Full rewrite to match Screens.jsx MissionDetail |
| `app/dashboard/rewards/rewards-client.tsx` | Full rewrite to match Screens2.jsx Rewards |
| `app/dashboard/profile/page.tsx` | Convert to client component, rewrite to match Screens2.jsx Profile |
| `app/dashboard/discover/page.tsx` | Full implementation to match Screens2.jsx Discover |

### New screens
| File | Screen |
|------|--------|
| `app/dashboard/missions/[id]/states-client.tsx` | Applied, CheckIn, Completed states |
| `app/dashboard/notifications/page.tsx` | Notifications screen |
| `app/dashboard/streak/page.tsx` | Streak visualization |
| `app/dashboard/leaderboard/page.tsx` | Leaderboard with podium |

### DB updates
| File | Changes |
|------|---------|
| `supabase/migrations/002_v2_fields.sql` | Add photo_url, location, date_label, spots_left to missions; add cover_image_url to ngos; add image_url to rewards |
| `lib/supabase/types.ts` | Add new fields to types |
| `scripts/seed.ts` | Update with photo URLs, locations, dates |

---

### Task 1: DB Schema Updates + Seed Data

**Files:**
- Create: `supabase/migrations/002_v2_fields.sql`
- Modify: `lib/supabase/types.ts`
- Modify: `scripts/seed.ts`

- [ ] **Step 1: Create migration file**

```sql
-- 002_v2_fields.sql
-- Add fields required by App v2 design

-- Missions: add photo, location, date label, spots
ALTER TABLE missions ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS date_label text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS spots_left integer DEFAULT 0;

-- NGOs: ensure cover_image_url exists
ALTER TABLE ngos ADD COLUMN IF NOT EXISTS cover_image_url text;

-- Rewards: add image_url for photo tiles
ALTER TABLE rewards ADD COLUMN IF NOT EXISTS image_url text;
```

- [ ] **Step 2: Update TypeScript types**

In `lib/supabase/types.ts`, add to the `missions` Row/Insert/Update types:
```typescript
photo_url: string | null
location: string | null
date_label: string | null
spots_left: number
```

Add to `rewards` Row/Insert/Update:
```typescript
image_url: string | null
```

Ensure `ngos` already has `cover_image_url` (it does).

Update `MissionWithNGO` to include the new mission fields (they're already part of `Mission` after the type update).

- [ ] **Step 3: Update seed data**

Update `scripts/seed.ts` — add photo URLs, locations, date labels, spots_left to each mission. Add cover_image_url to each NGO. Add image_url to each reward. Use these exact values from the design system:

NGOs cover images:
```typescript
const ngos = [
  { id: 'tema', ..., cover_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80&auto=format&fit=crop' },
  { id: 'cydd', ..., cover_image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80&auto=format&fit=crop' },
  { id: 'haytap', ..., cover_image_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&auto=format&fit=crop' },
  { id: 'kodluyoruz', ..., cover_image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop' },
  { id: 'kizilay', ..., cover_image_url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80&auto=format&fit=crop' },
]
```

Mission updates:
```typescript
{ id: 'beach-cleanup', ..., photo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80&auto=format&fit=crop', location: 'İstanbul, Kilyos', date_label: 'Bu Cumartesi', spots_left: 8, category: 'Çevre' },
{ id: 'reading-support', ..., photo_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80&auto=format&fit=crop', location: 'Online', date_label: 'Pazartesi 19:00', spots_left: 22, category: 'Eğitim' },
{ id: 'shelter-donation', ..., photo_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80&auto=format&fit=crop', location: 'Ankara', date_label: 'Hafta sonu', spots_left: 3, category: 'Hayvanlar' },
{ id: 'code-mentoring', ..., photo_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop', location: 'Online', date_label: 'Esnek', spots_left: 11, category: 'Eğitim' },
{ id: 'blood-donation', ..., photo_url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900&q=80&auto=format&fit=crop', location: 'Kadıköy', date_label: 'Her gün', spots_left: 15, category: 'Sağlık' },
{ id: 'tree-planting', ..., photo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80&auto=format&fit=crop', location: 'İstanbul', date_label: 'Bu Pazar', spots_left: 20, category: 'Çevre' },
```

Reward updates (add image_url):
```typescript
{ id: 'starbucks-coffee', ..., image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&q=80' },
{ id: 'migros-voucher', ..., image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&q=80' },
{ id: 'trendyol-discount', ..., image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&q=80' },
{ id: 'cinema-ticket', ..., image_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=700&q=80' },
{ id: 'nike-discount', ..., image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&q=80' },
{ id: 'garanti-cashback', ..., image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&q=80' },
```

- [ ] **Step 4: Run migration and re-seed**

```bash
npx supabase db push
npx tsx scripts/seed.ts
```

- [ ] **Step 5: Verify**

Open Supabase dashboard or run:
```bash
npx tsx -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
sb.from('missions').select('id,photo_url,location').then(r => console.log(r.data));
"
```

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/002_v2_fields.sql lib/supabase/types.ts scripts/seed.ts
git commit -m "feat: add v2 schema fields (photo, location, spots) and update seed data"
```

---

### Task 2: Shared Design System Atoms

**Files:**
- Create: `components/ui/ds/karma-dot-token.tsx`
- Create: `components/ui/ds/karma-token.tsx`
- Create: `components/ui/ds/karma-pill.tsx`
- Create: `components/ui/ds/meta-chip.tsx`
- Create: `components/ui/ds/badge-ds.tsx`
- Create: `components/ui/ds/icon-button-ds.tsx`
- Create: `components/ui/ds/chip-ds.tsx`
- Create: `components/ui/ds/fact-card.tsx`
- Create: `components/ui/ds/quick-action.tsx`
- Create: `components/ui/ds/impact-summary.tsx`
- Create: `components/ui/ds/hero-card.tsx`
- Create: `components/ui/ds/tier-badge-ds.tsx`

These are direct TypeScript ports of `design-system/ds/KarmaToken.jsx`, `Blocks.jsx`, `Components.jsx`, and `Screens.jsx` atoms. Each component must match the design system EXACTLY — same colors, padding, border-radius, font sizes, font weights, letter-spacing, and line-heights.

- [ ] **Step 1: Create all atom components**

Port each component from the design system reference files. Use inline styles (not Tailwind) to ensure pixel-exact match. Use lucide-react icons where the DS uses custom SVG icons (map: `Icon.clock` → `Clock`, `Icon.pin` → `MapPin`, `Icon.flame` → `Flame`, etc.). For custom SVGs not in lucide (like the star in TierBadge), include the inline SVG.

**Key design rules:**
- Font family: use `var(--font-display)` for Fraunces (serif), default sans for Plus Jakarta Sans
- All colors from tokens (see reference above)
- `fontVariantNumeric: 'tabular-nums'` on all number displays
- Border radius: cards 16px, pills 999px, buttons 999px, chips 999px
- Motion: transitions use `220ms cubic-bezier(.2,.8,.2,1)` (base speed)

Each file is a `'use client'` component with typed props.

Reference for each component:
- `karma-dot-token.tsx` → port `KarmaDotToken` from `KarmaToken.jsx:44-57`
- `karma-token.tsx` → port `KarmaToken` from `KarmaToken.jsx:6-41`
- `karma-pill.tsx` → port `KarmaPill` from `KarmaToken.jsx:60-78`
- `meta-chip.tsx` → port `MetaChip` from `Blocks.jsx:94-108`
- `badge-ds.tsx` → port `Badge` from `Components.jsx:162-183`
- `icon-button-ds.tsx` → port `IconButton` from `Components.jsx:186-201`
- `chip-ds.tsx` → port `Chip` from `Components.jsx:134-159`
- `fact-card.tsx` → port `FactCard` from `Screens.jsx:246-260`
- `quick-action.tsx` → port `QuickAction` from `Screens.jsx:102-122`
- `impact-summary.tsx` → port `ImpactSummary` from `Screens.jsx:124-141`
- `hero-card.tsx` → port `HeroCard` from `Blocks.jsx:143-206` + `HeroStat` from `Blocks.jsx:209-224`
- `tier-badge-ds.tsx` → port `TierBadge` from `Blocks.jsx:227-244`

- [ ] **Step 2: Verify components render**

Start dev server, import a few atoms into a test page and visually verify they match the DS.

- [ ] **Step 3: Commit**

```bash
git add components/ui/ds/
git commit -m "feat: add design system atom components (pixel-faithful ports from App v2)"
```

---

### Task 3: MissionCard Rewrite

**Files:**
- Modify: `components/ui/mission-card.tsx`

Rewrite to match `Blocks.jsx:14-92` exactly.

- [ ] **Step 1: Rewrite MissionCard**

Key differences from current implementation:
1. Photo section: use `photo_url` (required now via seed), remove emoji fallback gradient
2. Gradient scrim: `linear-gradient(180deg, rgba(26,22,18,0) 55%, rgba(26,22,18,.55) 100%)` — not 45%/72%
3. Top row: use `BadgeDS variant="onImage"` for category + `IconButtonDS` for heart (not raw button)
4. NGO lockup: same position/size (26px disk on photo bottom-left), use `NGOBrief.name` not short_name
5. Body: title uses `h2` style (fontSize:20, fontWeight:700), not 15px
6. Impact text below title: `bodySm` style (13px, ink300)
7. Meta row: `MetaChip` for duration + location (not difficulty badge), `KarmaPill` right-aligned
8. Urgency row: show `spotsLeft <= 5` with flame icon + "Son {n} kişi · {date}" in gold
9. No difficulty badge in meta row (differs from current)
10. No compact mode — App v2 always shows full-width cards in Dashboard
11. Press animation: `scale(0.985)` on mousedown

Props:
```typescript
interface MissionCardProps {
  mission: MissionWithNGO
  onClick?: () => void
}
```

- [ ] **Step 2: Verify card renders correctly**

Check on dashboard — cards should have real photos, NGO lockup on image, meta chips, karma pill.

- [ ] **Step 3: Commit**

```bash
git add components/ui/mission-card.tsx
git commit -m "feat: rewrite MissionCard to match App v2 design pixel-for-pixel"
```

---

### Task 4: BottomNav Update

**Files:**
- Modify: `components/bottom-nav.tsx`

Update to match `Blocks.jsx:247-287` exactly.

- [ ] **Step 1: Update BottomNav**

Key changes:
1. Background: `rgba(26,22,18,.85)` (was .88)
2. Blur: `blur(18px) saturate(140%)` (same)
3. Border top: `1px solid #3F3830` (same)
4. Padding: `10px 8px 28px` (DS has larger bottom for safe area)
5. Nav items: use SVG icons from `icons.jsx` — but since we use lucide-react, keep lucide but match: Home/Search/ListChecks/Gift/User
6. Active: gold `#E8C268`, inactive: `#A89E8A` ink300
7. Active glow: `goldSoft` (rgba(232,194,104,.12)) circle behind icon
8. Label: fontSize 10, fontWeight 600, letterSpacing '.02em'
9. Icon size: 22px (was 20px)
10. Position: `absolute` not `fixed` in DS (but keep `fixed` for Next.js since it's in layout)

- [ ] **Step 2: Commit**

```bash
git add components/bottom-nav.tsx
git commit -m "feat: update BottomNav to match App v2 design exactly"
```

---

### Task 5: Dashboard Screen Rewrite

**Files:**
- Modify: `app/dashboard/dashboard-client.tsx`

Rewrite to match `Screens.jsx:9-100` (Dashboard function) exactly.

- [ ] **Step 1: Rewrite Dashboard**

The App v2 Dashboard has this structure (top to bottom):
1. **Header row**: Date eyebrow (e.g. "18 NİSAN · CUMARTESİ") + greeting "Günaydın, {firstName}" in Fraunces italic + right side: bell IconButton + avatar circle (gold gradient, Fraunces initial letter)
2. **HeroCard**: Full-width at `padding:'20px 16px 0'`
3. **Quick actions grid**: 2×2 grid of QuickAction buttons ("Bu hafta sonu" + "Önerilenler")
4. **Filter chips**: Horizontal scroll row — 'Tümü','Yakınımda','Bu hafta sonu','Online','Kısa','Uzun' using Chip component
5. **Section header**: "Senin için seçtik" in Fraunces display + "TÜMÜ →" in gold
6. **Mission cards**: Vertical list (not horizontal scroll!), 3 cards with 16px gap
7. **NGO rail section**: "Ortaklar" eyebrow in gold + "İyiliğin öncüleri" in Fraunces + "TÜMÜ →" + horizontal scroll of NGOCard tiles (158px wide)
8. **Impact summary**: ImpactSummary card at bottom

Key differences from current:
- Remove avatar picker (Lottie mascots) — App v2 uses simple letter initial in gold circle
- Remove in-progress missions horizontal rail
- Remove discover grid
- Add date header, quick actions, filter chips, impact summary
- Mission list is VERTICAL (not horizontal scroll)
- Section headers use Fraunces display font
- NGO cards use cover images (1:1 aspect ratio)

- [ ] **Step 2: Visual verification**

Compare with `design-system/App v2.html` opened in browser.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/dashboard-client.tsx
git commit -m "feat: rewrite Dashboard to match App v2 exactly (header, hero, quick actions, filters, missions, NGOs, impact)"
```

---

### Task 6: Mission Detail Screen Rewrite

**Files:**
- Modify: `app/dashboard/missions/[id]/mission-detail-client.tsx`

Rewrite to match `Screens.jsx:145-244` (MissionDetail function) exactly.

- [ ] **Step 1: Rewrite MissionDetail**

App v2 MissionDetail structure:
1. **Full-bleed hero photo** (4:3 aspect) with gradient overlay + back/share/heart IconButtons at top + category Badge + title in Fraunces display (34px) at bottom-left
2. **NGO lockup row**: 40px logo disk + name + "27 yıldır · 12.4K gönüllü" + "Takip et" ghost button
3. **Facts grid**: 2×2 grid of FactCard (DATE, DURATION, LOCATION, SPOTS) with gold icons
4. **Impact section**: gold eyebrow "Bu Görevin Etkisi" + impact quote in Fraunces italic 22px + description in 14px
5. **Karma reward card**: ink800 bg, goldLine border, "Kazanacağın" eyebrow + KarmaDotToken + "+{karma}" in gold 32px + KarmaToken 56px
6. **Participants**: "Katılanlar" eyebrow + avatar stack (colored circles with initials) + "17 kişi katıldı" text
7. **Sticky CTA**: "Bu göreve katıl" primary button at bottom with gradient background fade

Key differences from current:
- Remove white cards with shadows → everything is ink800/ink900 dark
- Remove Tailwind utility classes → inline styles matching DS tokens
- Add full-bleed photo hero (not gradient band)
- Add facts grid, karma reward card, participants section
- Fraunces serif for title and headings

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/missions/[id]/mission-detail-client.tsx
git commit -m "feat: rewrite MissionDetail to match App v2 (hero photo, facts grid, karma card, participants)"
```

---

### Task 7: Mission Flow States

**Files:**
- Create: `app/dashboard/missions/[id]/states-client.tsx`

Implement Applied, CheckIn, Completed states matching `Screens2.jsx:574-757`.

- [ ] **Step 1: Create MissionFlowStates component**

Three state views that overlay the base MissionDetail:
1. **Applied**: Status strip (hourglass icon, sage tone, "Başvurun alındı") + 3 numbered steps (NGO onayı → Hazırlık SMS → Check-in) + "Katılımı iptal et" ghost button
2. **CheckIn**: Status strip (QR icon, gold tone, "Görev günü — Check-in") + participation code display (IBM Plex Mono, 44px, gold, "K7-3921") + meeting info card + "QR ile check-in yap" primary button
3. **Completed**: Status strip (check icon, cream tone, "Tamamlandı") + karma earned banner ("+{karma}" in gold 48px with concentric rings) + impact quote in Fraunces italic + photo grid (3 columns) + NGO rating (5 stars) + Share/New mission buttons

Use `StatusIcon`, `Step` sub-components from the DS.

- [ ] **Step 2: Wire into mission detail page routing**

Update `app/dashboard/missions/[id]/page.tsx` to check `user_missions.status` and render the appropriate state view.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/missions/[id]/states-client.tsx app/dashboard/missions/[id]/page.tsx
git commit -m "feat: add mission flow states (applied, check-in, completed) matching App v2"
```

---

### Task 8: Discover Screen

**Files:**
- Modify: `app/dashboard/discover/page.tsx` (convert to client component wrapper)
- Create: `app/dashboard/discover/discover-client.tsx`

Implement matching `Screens2.jsx:9-111` (Discover function) exactly.

- [ ] **Step 1: Create Discover screen**

Structure:
1. **Header**: "Bugün *iyi* yapacağın şey?" in Fraunces 30px (italic "iyi" in gold)
2. **Search input**: Airbnb-style floating label Input component (dark theme)
3. **Map preview**: 16:9 aspect, ink800 background with grid pattern SVG, 4 mission pins (numbered circles with connector lines), location pill ("İstanbul · 47 görev"), expand button
4. **Categories grid**: 2×2 buttons (Çevre/sage, Eğitim/wheat, Hayvanlar/blush, Sağlık/blush darker) — each with 40px colored icon circle + label + mission count
5. **Trending section**: "Bu hafta" gold eyebrow + "Trend olanlar" Fraunces heading + 1 MissionCard
6. **BottomNav** active="search"

- [ ] **Step 2: Create server page wrapper**

`app/dashboard/discover/page.tsx` should fetch missions + NGOs and pass to client component.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/discover/
git commit -m "feat: implement Discover screen with search, map, categories, trending (App v2)"
```

---

### Task 9: Rewards / Karma Market Screen Rewrite

**Files:**
- Modify: `app/dashboard/rewards/rewards-client.tsx`

Rewrite to match `Screens2.jsx:114-241` (Rewards + RewardTileLite functions) exactly.

- [ ] **Step 1: Rewrite Rewards screen**

Structure:
1. **Header**: "KARMA MARKETİ" eyebrow + "İyilik *ödüllerle* döner" Fraunces heading (italic "ödüllerle" in gold)
2. **Balance card**: ink800→#36302A gradient, goldLine border, 18px radius. Left: "Bakiyen" eyebrow + KarmaDotToken + karma in gold 36px. Right: "GEÇMİŞ" ghost button. Concentric ring SVG decoration.
3. **Filter chips**: Hepsi/Kupon/Deneyim/Bağış/Kilitli — using Chip component
4. **Featured tile**: 16:9, left gradient overlay (85% to 15%), "ÖZEL İŞBİRLİĞİ" gold Badge, title in Fraunces italic, karma cost
5. **Grid**: 2-column grid of `RewardTileLite` cards:
   - 4:3 photo with gradient scrim
   - Lock icon (top-right) when insufficient karma
   - Partner logo+name on photo (bottom-left, 18px disk)
   - Title 12px
   - Bottom bar: KarmaDotToken + cost in gold + "TAKAS →" or "KİLİTLİ"
   - Opacity 0.65 when locked

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/rewards/rewards-client.tsx
git commit -m "feat: rewrite Rewards/Karma Market to match App v2 (balance card, featured tile, 2-col grid)"
```

---

### Task 10: Profile Screen Rewrite

**Files:**
- Modify: `app/dashboard/profile/page.tsx`

Rewrite to match `Screens2.jsx:244-374` (Profile function) exactly.

- [ ] **Step 1: Rewrite Profile**

Convert from server component to hybrid (server fetches data, client renders). Structure:

1. **Cover photo**: Full-width 180px height with Unsplash image + gradient overlay + settings/share IconButtons
2. **Avatar**: 84px gold gradient circle with Fraunces initial letter, pulled up -42px over cover, 3px ink900 border
3. **Name + tier**: Fraunces display 26px + location pin ("İstanbul · 2024'ten beri") + TierBadge
4. **Karma card**: ink800, 16px radius. KarmaDotToken + karma in gold 32px + "Karma". Progress bar to next tier (same as HeroCard).
5. **Stats strip**: 3-column grid (GÖREV/SAAT/NGO) — eyebrow label + big number + description
6. **Achievements**: "Rozetler" Fraunces heading + 3-column grid of badge cards (gold gradient for unlocked, ink700 for locked, 0.5 opacity when locked)
7. **Activity timeline**: "Son görevlerin" heading + vertical timeline with gold dots + connector lines + mission title + NGO + date + karma earned
8. **BottomNav** active="profile"

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/profile/
git commit -m "feat: rewrite Profile to match App v2 (cover, avatar, karma, badges, timeline)"
```

---

### Task 11: Notifications Screen

**Files:**
- Create: `app/dashboard/notifications/page.tsx`

Implement matching `Screens2.jsx:775-842` (Notifications + NotifRow) exactly.

- [ ] **Step 1: Create Notifications page**

Structure:
1. **Header**: "BİLDİRİMLER" eyebrow + "Yeni *iyilikler*" Fraunces heading (gold italic) + "TÜMÜNÜ OKU" gold button
2. **Today section**: "BUGÜN" gold eyebrow + notification rows
3. **Earlier section**: "DAHA ÖNCE" ink300 eyebrow + notification rows
4. **NotifRow**: ink800 bg (or goldSoft bg for fresh), goldLine border for fresh. 40px icon square (colored bg) + title (supports HTML) + subtitle + time + gold dot for fresh

Mock data for now (hardcoded notification items like the DS).

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/notifications/
git commit -m "feat: add Notifications screen matching App v2"
```

---

### Task 12: Streak Screen

**Files:**
- Create: `app/dashboard/streak/page.tsx`

Implement matching `Screens2.jsx:844-915` (Streak function) exactly.

- [ ] **Step 1: Create Streak page**

Structure:
1. **Header**: Back IconButton + "SERİ" eyebrow + share IconButton
2. **Big coin**: 200px gold gradient circle with flame icon + "7" in 72px + "GÜN" label. Radial glow behind.
3. **Headline**: "Yedi günlük iyi hal." Fraunces italic + description text
4. **Days row**: ink800 card, 7 columns (Pzt-Paz), each with 36px circle (gold with check when filled, ink700 when empty) + day label
5. **Milestones**: "SIRADAKİ KİLOMETRE TAŞLARI" eyebrow + 3 rows (14 days/30 days/100 days) with number, name, bonus, days remaining

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/streak/
git commit -m "feat: add Streak visualization screen matching App v2"
```

---

### Task 13: Leaderboard Screen

**Files:**
- Create: `app/dashboard/leaderboard/page.tsx`

Implement matching `Screens2.jsx:918-1020` (Leaderboard + PodiumPlace) exactly.

- [ ] **Step 1: Create Leaderboard page**

Structure:
1. **Header**: "SIRALAMA" gold eyebrow + "Şehrin en *iyileri*" Fraunces heading
2. **Scope chips**: Arkadaşlar/İstanbul/Türkiye
3. **Period segmented control**: ink800 pill with 3 buttons (Bu hafta/Bu ay/Tüm zamanlar), active = gold bg
4. **Podium**: 3 columns (#2 left 130px, #1 center 170px gold, #3 right 110px). Each: avatar circle + name + karma + podium bar (gold gradient for #1, ink700 for others)
5. **Ranked list**: Rows #4-#7 + #142 (user, highlighted with goldSoft bg + goldLine border). Each: rank number + avatar circle + name + KarmaDotToken + karma
6. **BottomNav** active="profile"

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/leaderboard/
git commit -m "feat: add Leaderboard with podium matching App v2"
```

---

### Task 14: Missions List Redesign

**Files:**
- Modify: `app/dashboard/missions/missions-client.tsx`

Update filter chips and layout to match App v2 style consistency.

- [ ] **Step 1: Update missions page**

Changes:
1. Replace gradient-background filter chips with `ChipDS` component (gold border/bg when active, ink600 border when inactive)
2. Page header: Use Fraunces display font for "Görevler" heading
3. Keep domain-based filtering but use category labels from v2: Çevre, Eğitim, Hayvanlar, Sağlık (not nature/education etc.)
4. Mission cards are now full-width vertical (already the case)
5. Ensure cards use the updated MissionCard component

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/missions/missions-client.tsx
git commit -m "feat: update Missions list with v2 filter chips and typography"
```

---

### Task 15: Final Polish + Visual Audit

**Files:**
- Modify: `app/dashboard/layout.tsx` (if needed)
- Modify: `app/globals.css` (if needed)

- [ ] **Step 1: Visual audit**

Open each screen side-by-side with `App v2.html` in browser (both at 390px width). Check:
- Color matches (ink900 bg, cream text, gold accents)
- Typography (Fraunces for display headings, Plus Jakarta Sans for UI)
- Spacing and padding
- Component shapes (border radius, shadows)
- Animation/transition feel

- [ ] **Step 2: Fix any discrepancies found**

- [ ] **Step 3: Commit all fixes**

```bash
git add -A
git commit -m "fix: visual audit polish pass for App v2 pixel fidelity"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- [x] Dashboard (Task 5) → Screens.jsx Dashboard
- [x] MissionDetail (Task 6) → Screens.jsx MissionDetail
- [x] Mission states: Applied/CheckIn/Completed (Task 7) → Screens2.jsx MissionDetailWithState
- [x] Discover (Task 8) → Screens2.jsx Discover
- [x] Rewards/Karma Market (Task 9) → Screens2.jsx Rewards
- [x] Profile (Task 10) → Screens2.jsx Profile
- [x] Notifications (Task 11) → Screens2.jsx Notifications
- [x] Streak (Task 12) → Screens2.jsx Streak
- [x] Leaderboard (Task 13) → Screens2.jsx Leaderboard
- [x] Missions list (Task 14) — style update
- [x] DB schema (Task 1) — photo, location, date, spots fields
- [x] Shared atoms (Task 2) — all DS components ported
- [x] MissionCard (Task 3) — full rewrite
- [x] BottomNav (Task 4) — update
- [ ] Onboarding (4 screens) — NOT included (separate flow, lower priority for demo)
- [ ] NGO Profile/Membership (3 screens) — NOT included (Screens3.jsx, Phase 2)
- [ ] Donation flows (4 screens) — NOT included (Screens3.jsx, Phase 2)

**2. Placeholder scan:** No TBD/TODO found.

**3. Type consistency:** `MissionWithNGO` includes new fields via `Mission` type. `NGOBrief` already has `cover_image_url`. `Reward` gets `image_url`.
