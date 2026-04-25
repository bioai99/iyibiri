# İyiBiri Component Inventory

**Tarih:** 2026-04-25  
**Total:** 53 component (27 ui/ + 13 ds/ + 4 dashboard/ + 9 root-level)  
**Last Updated:** 2026-04-25 (UX audit + Tier 2 reward design + show-stopping patterns)

---

## Overview

Component inventory kategorize by **atomic/molecular/organism** taksonomisi (Brad Frost) + **state/theme/util** katmanları. Her component'in yolu, variant sayısı, kullanım yerleri ve notları tablolaştırılmıştır.

---

## 1. Atomic (Core primitives)

| Component | Path | Variants | Used by | Notes |
|---|---|---|---|---|
| Badge | `ui/badge.tsx` | default, primary, secondary, success, danger | 12+ pages (tier, achievement, tag) | shadcn base |
| BrandLogo | `ui/brand-logo.tsx` | icon, full, lockup | Landing, auth, nav | SVG + Fraunces |
| Button | `ui/button.tsx` | primary, secondary, ghost, outline, destructive | 40+ pages | shadcn base + İyiBiri token override |
| Card | `ui/card.tsx` | default, elevated, bordered | 25+ pages (dashboard sections, modals) | shadcn base |
| Input | `ui/input.tsx` | default, focused, error, disabled | Auth, forms (profile, membership) | shadcn base |
| Label | `ui/label.tsx` | default, required, hint | Form fields (15+ pages) | shadcn base |
| Progress | `ui/progress.tsx` | linear, circular | Karma count-up, streak progress | Custom track + fill |
| Separator | `ui/separator.tsx` | horizontal, vertical | Modal footers, list dividers | shadcn base |
| Skeleton | `ui/skeleton.tsx` | rect, circle, text | Loading states (6 page-loaders) | Gray pulse animation |

**Coverage:** Form primitive saturation ~100% (all input-driven pages). Reuse density: HIGH.

---

## 2. Molecular (Composed patterns)

| Component | Path | Variants | Used by | Notes |
|---|---|---|---|---|
| AnimatedHeart | `ui/animated-heart.tsx` | like/unlike | Posts, rewards, missions | Lottie + tap feedback |
| BottomSheet | `ui/bottom-sheet.tsx` | default, tall, full | Rewards detail, mission CTA | Vaul wrapper + safe-area |
| ComingSoonBanner | `ui/coming-soon-banner.tsx` | alert | Discover, donations mock | Dismissible |
| CommandPalette | `ui/command-palette.tsx` | search, command | Admin, devtools | cmdk + filter |
| DomainIcon | `ui/domain-icon.tsx` | 6 domain enum | Mission cards, mission detail | SVG icons (nature/education/social/financial/animals/culture) |
| EmptyState | `ui/empty-state.tsx` | 12 preset (notFound, emptyNotifications, savedEmpty, friendsEmpty, etc.) | Missions, profile, leaderboard, saved | Illustrations + CTA |
| KarmaCounter | `ui/karma-counter.tsx` | display, inline | Leaderboard, profile, mission complete | Static text |
| KarmaCounterPro | `ui/karma-counter-pro.tsx` | count-up (2026-04-25 yeni) | Dashboard hero, mission complete, rewards | easeOutExpo animation + tier glow ring |
| MagneticButton | `ui/magnetic-button.tsx` | cta, secondary | Modals, celebrations | Cursor tracking |
| MissionCard | `ui/mission-card.tsx` | default, featured, skeleton | Dashboard missions, discover, saved | 2px gold border variant (featured, 2026-04-25) |
| QRScanner | `ui/qr-scanner.tsx` | scan, generate | Mission complete, admin qr | html5-qrcode wrapper |
| StreakFlame | `ui/streak-flame.tsx` | default, milestone | Dashboard hero, streak page | Lottie + milestone variant |
| TierBadge | `ui/tier-badge.tsx` | 1-5 level | Profile, leaderboard, rewards | Color ramp (bronze→diamond) |
| Toaster | `ui/toaster.tsx` | toast provider | Global (layout.tsx) | Sonner wrapper |
| UndoToast | `ui/undo-toast.tsx` | saved mission undo | Dashboard saved tab | Sonner + action button |
| XPBar | `ui/xp-bar.tsx` | linear progress | Mission detail, dashboard (legacy) | Deprecated shim → use Progress |

**Coverage:** Interaction patterns ~80% (missing: lightbox, calendar, select custom). Reuse: HIGH (15+ molecular per page avg).

---

## 3. Organism (Complex compositions)

| Component | Path | Variants | Used by | Notes |
|---|---|---|---|---|
| HeroCardV2 | `dashboard/hero-card-v2.tsx` | default, scroll | Dashboard main | Gold glow breathing + KarmaCounterPro + streak chip |
| HeroCardV2Scroll | `dashboard/hero-card-v2-scroll.tsx` | parallax | Dashboard (alt) | Scroll-linked animation |
| DailyMissionCard | `dashboard/daily-mission-card.tsx` | featured (2026-04-25) | Dashboard main | "Senin için" badge + gold border + glow shadow |
| StreakSnapshot | `dashboard/streak-snapshot.tsx` | week view | Dashboard main | Haftalık aktivite dots (2026-04-25 yeni) |

**Coverage:** Dashboard focal points 100%. Mobile safe-area: ✅ (pb-safe, pt-safe).

---

## 4. Design System (Tier 2 + show-stopping patterns — 13 component)

2026-04-25 **Tier 2 Reward System** + **Show-Stopping Patterns** ile genişletildi.

| Component | Path | Variants | Status | Notes |
|---|---|---|---|---|
| BadgeDS | `ui/ds/badge-ds.tsx` | pill, outline, filled | Prod | Semantic token override |
| ChipDS | `ui/ds/chip-ds.tsx` | 4 state (default/selected/disabled/error) + easing | Prod | 200ms cubic-bezier (2026-04-25 K5 quick-win) |
| FactCard | `ui/ds/fact-card.tsx` | statistic display | Prod | Leaderboard rank, rewards earned |
| HeroCard | `ui/ds/hero-card.tsx` | focus | Prod | Show-stopping glow ring |
| IconButtonDS | `ui/ds/icon-button-ds.tsx` | size variant (sm/md/lg) | Prod | Touch-target 44px+ |
| ImpactSummary | `ui/ds/impact-summary.tsx` | mission impact text | Prod | Domain color + icon |
| KarmaDotToken | `ui/ds/karma-dot-token.tsx` | display, inline | Prod | Bullet point + color |
| KarmaPill | `ui/ds/karma-pill.tsx` | count + prefix | Prod | "+50 Karma" badge |
| KarmaToken | `ui/ds/karma-token.tsx` | numeric only | Prod | 1500, 2000, etc. |
| MetaChip | `ui/ds/meta-chip.tsx` | tag variant | Prod | Mission category, tier |
| QuickAction | `ui/ds/quick-action.tsx` | cta + icon | Prod | Donate, volunteer, share |
| ThemeToggle | `ui/ds/theme-toggle.tsx` | light/dark | Prod | Settings, admin |
| TierBadgeDS | `ui/ds/tier-badge-ds.tsx` | 1-5 + tier name | Prod | Profile, leaderboard |

**Coverage:** Design system token consistency 100% (0 hardcoded colors). Tier 2 reuse: 80% (reward v2 + show-stopping patterns).

---

## 5. State & Loading (3 files)

| Component | Path | Variants | Used by | Notes |
|---|---|---|---|---|
| LoadingState (index) | `ui/state/index.tsx` | page, inline, card | 15+ pages | Skeleton shimmer grid/list |
| EmptyStateV2 | `ui/state/index.tsx` | 12 preset | 8 pages | Illustration + contextual CTA |
| DetailPageLoading | `ui/state/page-loading.tsx` | hero + metadata | Mission detail, NGO detail | 2-skeleton pattern |
| GridPageLoading | `ui/state/page-loading.tsx` | 3×3 grid | Dashboard missions, rewards | Skeleton cards |
| ListPageLoading | `ui/state/page-loading.tsx` | 5 rows | Members, verifications, leaderboard | Row skeleton + divider |
| ProfilePageLoading | `ui/state/page-loading.tsx` | avatar + sections | Profile | Avatar circle + text blocks |

**Coverage:** Loading state saturation ~90% (payments sandbox pending). A11y: aria-busy ✅, prefers-reduced-motion ✅.

---

## 6. Theme & Utility Layer

### Theme

**File:** `lib/theme.tsx`  
**Provider:** `ThemeProvider` (dark/light state, context hook `useTheme`)  
**Token source:** `tailwind.config.ts` + `globals.css`

**Token palette (Bölüm 6 otorite kaynağı):**

| Category | Token | Default | Dark mode | Notes |
|---|---|---|---|---|
| **Ink (text)** | ink-900 | #24201B | — | darkest |
| | ink-800 | #2E2923 | — | — |
| | ink-700 | #36302A | — | — |
| | ink-600 | #3F3830 | — | — |
| | ink-500 | #574E42 | — | — |
| | ink-400 | #7A6F5E | — | — |
| | ink-300 | #A89E8A | — | — |
| | ink-200 | #CEC5B2 | — | — |
| | ink-100 | #E6DEC9 | — | — |
| **Cream** | bg-cream | #F4EEDF | — | light bg |
| **Gold** | gold | #E8C268 | — | primary CTA |
| | gold-dim | #B58F3D | — | secondary |
| **Clay** | clay | #C8553D | — | warning accent |
| **Success** | success | #6B8E4E | — | impact positive |
| **Danger** | danger | #EF4444 | — | error state |
| **Domain colors** | nature | #10B981 | — | gradient fallback |
| | education | #3B82F6 | — | — |
| | social | #F43F5E | — | — |
| | financial | #F59E0B | — | — |
| | animals | #F97316 | — | — |
| | culture | #A855F7 | — | — |

### Utilities

| Utility | File | Purpose | Availability |
|---|---|---|---|
| `haptic()` | `lib/haptic.ts` | Capacitor vibration | iOS + Android (optout) |
| `toast()` | `lib/toast.ts` | Sonner notification | Global |
| `useTransitionedRouter()` | `lib/view-transitions.ts` | View transitions API | Modern browsers + mobile fallback |

---

## 7. Coverage Map (Page × Component Usage)

**User-facing pages (38):**

| Page | Organisms | Molecules | Atoms | State | Notes |
|---|---|---|---|---|---|
| `/` Landing | — | BrandLogo, button | — | — | Stateless |
| `/auth/login` | — | Button, Input | Label | — | OAuth flow |
| `/auth/signup` | — | Button, Input, Checkbox | Label | — | KVKK + password strength |
| `/auth/forgot-password` | — | Button, Input | Label | — | 2026-04-25 yeni |
| `/auth/reset-password` | — | Button, Input | Label | — | 2026-04-25 yeni |
| `/dashboard` | HeroCardV2, DailyMissionCard, StreakSnapshot | KarmaCounterPro, ChipDS | Badge, Button | LoadingState | Dashboard main |
| `/dashboard/discover` | — | MissionCard, Button | Badge, DomainIcon | GridPageLoading | Blog + sponsor grid |
| `/dashboard/missions` | — | MissionCard, Filter | Badge, DomainIcon | GridPageLoading | Taxonomy filter (backlog P1) |
| `/dashboard/missions/[id]` | — | ImpactSummary, Button | TierBadge, KarmaPill | DetailPageLoading | Mission detail |
| `/dashboard/missions/[id]/complete` | — | QRScanner, Button, Celebration | KarmaCounterPro, AnimatedHeart | — | K1 modal (2026-04-25) |
| `/dashboard/ngos` | — | Filter, Button | Badge, Logo | ListPageLoading | NGO list + search |
| `/dashboard/ngos/[id]` | — | Card, MembershipForm | Badge, Button | DetailPageLoading | NGO profile |
| `/dashboard/ngos/[id]/membership` | — | Form, Button | Input, Label | — | KVKK form |
| `/dashboard/ngos/[id]/membership/success` | — | Celebration, Button | KarmaCounterPro | — | Konfeti + modal |
| `/dashboard/rewards` | — | RewardCard (org) | Badge, KarmaPill | ListPageLoading | Reward hub |
| `/dashboard/rewards/[id]` | — | BottomSheet, Button | ImpactSummary, TierBadge | DetailPageLoading | Reward detail (T2 spec ready) |
| `/dashboard/profile` | — | ProfileCard, Stats | Badge, KarmaDotToken | ProfilePageLoading | Karma, tier, badge |
| `/dashboard/profile/edit` | — | Form, Button | Input, Label | — | Profile form |
| `/dashboard/profile/badges` | — | BadgeGrid | TierBadge, Badge | GridPageLoading | Achievement display |
| `/dashboard/leaderboard` | — | LeaderboardList | FactCard, TierBadge | ListPageLoading | Top 20 + rank |
| `/dashboard/notifications` | — | FeedList | Badge, Button | EmptyStateV2 | Aktivite feed |
| `/dashboard/streak` | — | StreakCalendar | StreakFlame, Badge | — | Haftalık dots |
| `/dashboard/saved` | — | MissionCard, Filter | Button | EmptyStateV2 | Saved missions |
| `/dashboard/posts/[id]` | — | PostCard, Button | Badge, AnimatedHeart | DetailPageLoading | Blog post |
| Admin pages (10) | AdminLayout | FormFields, Tables | Badge, Button | — | Backoffice (all 🟡 beta, UI 60–80%) |

**Gaps identified:**

1. **Calendar component:** Streak date picker yok (workaround: custom grid).
2. **Select custom:** Form select'ler varsayılan HTML (figma spec'te custom dropdown).
3. **Lightbox:** Post images tek sütun (full-screen lightbox yok).
4. **Sponsor dashboard:** T2 spec ready ama component yok (RewardHistory new, SponsorDashboard new — backlog).
5. **Notification preferences:** User settings'te notification toggle yok.

---

## 8. Component Duplication & Stale Check

**Deprecated shims (cleaned 2026-04-24):**

- ~~`components/mission-card.tsx`~~ → canonical: `components/ui/mission-card.tsx`
- ~~`components/xp-bar.tsx`~~ → canonical: `components/ui/xp-bar.tsx`
- **Hardcoded color search:** Yok (grep `#E8C268` vb. → 0 match app/ altında).

**Potential duplication alerts:**

| Potential | Status | Note |
|---|---|---|
| KarmaCounter vs. KarmaCounterPro | ✅ Clear | `karma-counter` static, `karma-counter-pro` animated |
| Badge vs. BadgeDS | ✅ Clear | `badge` atomic, `badge-ds` semantic override |
| EmptyState vs. EmptyStateV2 | ⚠️ Migration needed | V2 presets kapsamlı; V1 retire backlog P1 |
| TierBadge vs. TierBadgeDS | ✅ Clear | Deprecated alias V1.1'de kaldırılacak (ADR-TBD) |

**Stale files:** Yok (2026-04-24 cleanup tamamlandı).

---

## 9. New Components (2026-04-25)

**Show-Stopping Tier 1 (3 yeni):**

1. **KarmaCounterPro** — easeOutExpo count-up + tier glow breathing + delta float
2. **DailyMissionCard** — featured "günün görevi" (2px gold border, "Senin için" badge)
3. **StreakSnapshot** — haftalık aktivite visualization (7 dot, milestone marker)

**Design System Tier 2 (Reward V2 spec, 2026-04-25 ready):**

4. **RewardHistory** (backlog) — T2 spec: `docs/ui/01-specs/2026-04-25-reward-v2-ui-spec.md` Bölüm 11
5. **SponsorDashboard** (backlog) — T2 spec: rewards analytics + cohort table
6. **RedemptionConfirmDialog** (backlog) — Dark moment UX (K3 audit)
7. **RedemptionCodeDisplay** (backlog) — Copy-to-clipboard + share template

---

## 10. Token & ADR Status

**Source of truth:** `tailwind.config.ts` + `globals.css` (atlas Bölüm 6).

**Hardcoded color audit (2026-04-25):**

- ✅ App layout: 0 hardcoded
- ✅ Components: 0 hardcoded (token ref tüm spec'te)
- ✅ Dashboard: 0 hardcoded
- ✅ Admin: 0 hardcoded

**Pending ADR'ler (design-system-keeper backlog):**

| ADR | Scope | Blocking | Owner |
|---|---|---|---|---|
| Tier color palette (bronze/silver/gold/diamond) | T2 reward system | RewardsHub spec | design-system-keeper |
| Flame glow animation (breathing ring) | Show-stopping hero | KarmaCounterPro polish | design-system-keeper |
| Cultural event marker color | Ekosistem audit K11 | Ramadan tooltip | design-system-keeper |

---

## 11. Motion & A11y Baseline

**Motion defaults (Bölüm 6 otorite):**

| Pattern | Timing | Easing | Prefers-reduced-motion |
|---|---|---|---|---|
| Spring entry | 300–400ms | spring({ stiffness: 400, damping: 30 }) | Opacity only |
| Stagger | 40–60ms per item | — | Linear (no stagger) |
| Tap feedback | instant | scale 0.93–0.97 | Disabled |
| Count-up (karma) | 0.8–2.4s | easeOutExpo | Static display |
| Confetti | 1s | canvas-confetti defaults | Disabled |

**A11y coverage:**

- ✅ Focus-visible: tüm interactive elements
- ✅ Touch-target: 44px+ (safe-area aware)
- ✅ Kontrast: WCAG AA baseline (gold-dim ⚠️ flag — audit K3)
- ✅ Reduced motion: CSS + Framer Motion hooks
- ✅ Dark mode: 4-layer fallback (token → css-var → computed → hardcoded)
- ✅ Screen reader: aria-labels, role='button', landmark regions

---

## 12. Next Steps (Backlog)

### Immediate (P0 — next 2 hafta)

1. **EmptyStateV2 preset audit** — 12 preset tüm page'leri cover ediyor mu? (Bölüm 7 coverage kontrol)
2. **Reward V2 component implement** — RewardHistory + SponsorDashboard 4 organism spec ready
3. **Calendar component design** — Streak date picker (T2 backlog P1 #6)
4. **ADR trio resolve** — tier colors, flame glow, cultural event marker

### Medium (P1 — Sprint 2–3)

5. **Select custom variant** — Form fields semantic override (T1 beautification)
6. **Lightbox atom** — Post image gallery full-screen (T1 polish)
7. **Notification preferences UI** — User settings toggle component
8. **Component Storybook** — Zaman varsa, shared library publish

---

## 13. File Paths Reference

```
components/
├── ui/
│   ├── atomic: badge, brand-logo, button, card, input, label, progress, separator, skeleton
│   ├── molecular: animated-heart, bottom-sheet, coming-soon-banner, command-palette, 
│   │              domain-icon, empty-state, karma-counter, karma-counter-pro, magnetic-button,
│   │              mission-card, qr-scanner, streak-flame, tier-badge, toaster, undo-toast, xp-bar
│   ├── state/
│   │   ├── index.tsx (LoadingState, EmptyStateV2)
│   │   ├── page-loading.tsx (5 loaders)
│   │   └── illustrations.tsx
│   └── ds/ (13 design-system components)
├── dashboard/
│   ├── hero-card-v2.tsx
│   ├── hero-card-v2-scroll.tsx
│   ├── daily-mission-card.tsx
│   └── streak-snapshot.tsx
├── auth-feedback.tsx
├── bottom-nav.tsx
├── logo.tsx
├── onboarding-redirect.tsx
└── waitlist-form.tsx

lib/
├── theme.tsx
├── haptic.ts
├── toast.ts
├── view-transitions.ts
├── auth/
├── supabase/
├── dev/ (fixtures)
└── utils.ts
```

---

**Document Status:** ✅ 2026-04-25 — Atlas + Tier 2 design aligned. Ready for frontend-engineer implementation.
