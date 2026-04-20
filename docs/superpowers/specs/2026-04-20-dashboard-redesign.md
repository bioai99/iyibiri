# Dashboard Redesign Spec

## Goal

Redesign the dashboard HeroCard with an animated butterfly that evolves across 5 tiers, replace QuickAction cards with a smarter mission filtering system, and fix several UI quality issues.

## 1. HeroCard — Butterfly Evolution

### Tier System

| Tier | Karma | Name | Butterfly Size | Visual |
|------|-------|------|---------------|--------|
| 1 | 0+ | İyi Biri | 48px | Sade renkler, yumusak nefes |
| 2 | 500+ | İyi Yürekli | 54px | Renkler canlanir, tek kanat cirpma |
| 3 | 2000+ | İyilik Elçisi | 60px | Tam canli, duzenli cirpma + hafif glow |
| 4 | 5000+ | İyilik Savaşçısı | 66px | Parlak, guclu cirpma + parcaciklar |
| 5 | 10000+ | İyiliğin Işığı | 72px | Altin halo, dramatik cirpma + parcacik patlamasi |

### Butterfly Animation (Framer Motion)

Each tier level adds animation complexity using the existing BrandLogo SVG paths:

**Tier 1 — İyi Biri:**
- Wing rotation: ±3°, 3s ease cycle
- No glow, no particles
- Gradient: muted/pastel version of existing wing colors

**Tier 2 — İyi Yürekli:**
- Wing rotation: ±5°, 2.6s cycle
- Single flutter burst every 4s: `[0, 15, -8, 5, 0]` over 0.6s, then rest
- Colors at normal saturation

**Tier 3 — İyilik Elçisi:**
- Wing rotation: ±6°, 2.4s cycle
- Flutter burst every 3.5s
- Soft gold glow behind butterfly (opacity 0.3, size * 0.8, blur 12px)
- Gentle vertical float: y ±3px

**Tier 4 — İyilik Savaşçısı:**
- Wing rotation: ±8°, 2.2s cycle
- Flutter burst every 3s with more amplitude: `[0, 25, -15, 10, -5, 0]`
- Gold glow pulsing (opacity 0.3→0.5)
- 4 gold particles orbiting slowly

**Tier 5 — İyiliğin Işığı:**
- Wing rotation: ±10°, 2s cycle
- Dramatic flutter every 2.5s: `[0, 30, -20, 15, -8, 3, 0]`
- Bright gold halo (opacity 0.5→0.7, pulsing)
- 8 gold particles, brighter, faster orbit
- Subtle scale pulse on whole butterfly: 1→1.02→1

### BrandLogo Component Changes

Add `tierLevel` prop (1-5) to `BrandLogo`:
- Controls: size override, gradient saturation, glow intensity, flutter pattern, particle count
- When `tierLevel` is set, it overrides `idle` behavior with tier-specific animation
- Existing `animate`, `idle`, `showWordmark` props continue to work for non-tier uses (splash, login, etc.)

### HeroCard Layout (Top → Bottom)

```
┌──────────────────────────────────┐
│         [gold glow area]         │
│        🦋 Butterfly (centered)   │
│                                  │
│     "İyilik Elçisi" (tier name)  │
│          italic, display font    │
│                                  │
│      ●  2.450  (karma, large)    │
│         Karma (label)            │
│                                  │
│  ── progress bar ──────────────  │
│  İyi Yürekli'ye    350 kaldı     │
│                                  │
│  ┌──────────┐  ┌──────────────┐  │
│  │ 12 görev │  │ 3 gün seri   │  │
│  │tamamlandı│  │  kesintisiz  │  │
│  └──────────┘  └──────────────┘  │
└──────────────────────────────────┘
```

- Background: `c.ink800` with `1px solid c.ink600`, borderRadius 20
- Decorative concentric arcs (existing) stay, opacity bumped to 0.15
- Tier name: Fraunces italic, fontSize 14, color `c.gold`
- Karma number: fontSize 48, fontWeight 700, color `c.gold`, tabular-nums
- Stats: 2-column grid instead of 3 (removed "SIRA")
- Streak shows actual `profile.streak` value (was using `profile.streak ?? 0`, already correct)

## 2. QuickAction Cards — Removed

Remove both QuickAction cards ("Bu hafta sonu" and "Önerilenler") and their grid container entirely from dashboard-client.tsx. These had hardcoded data and added no real value.

## 3. Filter Chips — Redesign

### Old chips
`['Tümü', 'Yakınımda', 'Bu hafta sonu', 'Online', 'Kısa', 'Uzun']` — cosmetic only, no filtering logic.

### New chips
Two functional tabs:

**"Senin için"** (default active):
- Server-side query: missions sorted by relevance
- Priority 1: missions from NGOs user is a member of (`ngo_memberships`)
- Priority 2: missions matching user's `interests` array against mission `domain`
- Priority 3: missions in user's `city`
- Already-taken/completed missions excluded
- Limit: 5 missions

**"Katıldıkların"**:
- User's missions with status `taken` or `completed`
- Sorted by most recent
- Shows status badge on each card ("Devam ediyor" / "Tamamlandı")

### Data flow
- `page.tsx` (server component) fetches both datasets in parallel
- Passes `recommendedMissions` and `userActiveMissions` as props
- Client toggles between them via `activeTab` state
- No additional API calls needed

## 4. UI Quality Fixes

### Bell icon color
Change `<Bell size={18} color={c.cream} />` to `<Bell size={18} color={c.gold} />` in dashboard header. Matches ThemeToggle's gold color, visible in both dark and light modes.

### ImpactSummary — real data
Current: hardcoded "48.620 gönüllü", "3.421.000 Karma", "#142"
Fix: Use `completed` and `karma` props that are already passed but ignored. For community totals, either:
- Query aggregate from profiles table (simple `sum(karma_total)` and `count(*)`)
- Or remove community stats and show only personal impact

Recommendation: show personal impact only (the passed props), remove fake community numbers. Keep it honest.

### Unused imports
Remove `UserPen` from dashboard-client.tsx imports.

### Section header update
"Senin için seçtik" section header stays, adapts text based on active tab:
- "Senin için" tab → "Senin için seçtik"
- "Katıldıkların" tab → "Görevlerin"

## 5. Files to Modify

| File | Change |
|------|--------|
| `components/ui/brand-logo.tsx` | Add `tierLevel` prop, tier-specific animations |
| `components/ui/ds/hero-card.tsx` | New centered layout, butterfly integration |
| `app/dashboard/dashboard-client.tsx` | Remove QuickAction, new tabs, bell fix, unused imports |
| `app/dashboard/page.tsx` | Fetch recommended + user missions data |
| `components/ui/ds/impact-summary.tsx` | Use real data, remove hardcoded values |

## 6. What's NOT Changing

- MissionCard component (already good quality)
- NGO horizontal rail
- BottomNav
- Dashboard layout structure
- Theme system
- Existing tier karma thresholds (0, 500, 2000, 5000, 10000)
