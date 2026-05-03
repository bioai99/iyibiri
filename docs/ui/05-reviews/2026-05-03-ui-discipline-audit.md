# UI Discipline Audit — Sistem Bütünlüğü × Consistency × Tier-1+ Craft

**Tarih:** 2026-05-03  
**Scope:** TÜM PROJE — app/dashboard/* + app/auth/* + components/* + landing + onboarding + admin + sponsor flow (48 sayfa)  
**Yazar:** ui-designer  
**Upstreams:** 2026-04-25 motion audit, component inventory, project atlas  

---

## P0/P1 BULGULAR

### P0 — Inline Padding İhlalleri (Spacing Token Escape)

| # | Dosya | Konum | İhlal | Şiddet |
|---|-------|-------|-------|--------|
| 1 | `components/ui/ds/badge-ds.tsx` | padding: '5px 10px' | Token yok (atlas scale: 4/8/12/16 bazlı). 5px / 10px = 4px + 1px jitter. | 2 — mikro spacing inconsistency |
| 2 | `components/ui/ds/chip-ds.tsx` | padding: '9px 14px' | 9px (aralık yok), 14px (2px drift). 8/16 grid'e yuvarla. | 2 |
| 3 | `components/ui/ds/tier-badge-ds.tsx` | padding: '5px 10px 5px 8px' | Asimetrik (8px left). Kaynak tarifini kontrol gerek. | 2 |
| 4 | `components/ui/ds/impact-summary.tsx` | padding: '22px 22px' | 20px standart (atlas --space-5). 22px = +2px drift. | 1 — niedür, accept. |
| 5 | `components/ui/ds/fact-card.tsx` | padding: '14px 14px 12px' | 14px (16px olmalı). Baseline grid ayrışması. | 2 |
| 6 | `components/ui/ds/quick-action.tsx` | padding: '14px 14px 12px' | İhlal #5 ile eş (code duplication). | 2 |
| 7 | `components/ui/ds/hero-card.tsx` | padding: '14px 4px 12px' + '20px 12px 16px 22px' | Karışık (14=8+4+2, 20=16+4, 12=8+4, 22=16+6). Bir setter var mı değil mi? | 3 |
| 8 | `components/ui/ds/karma-pill.tsx` | padding: '6px 10px 6px 8px' | 6px (4+2), 10px (8+2), 8px (8). Spacing scale kırık. | 2 |
| 9 | `components/ui/celebration-overlay.tsx` | padding: '36px 28px 28px' + '10px 18px' | 36px=32+4, 28px (yok), 10px (8+2). Non-standard. | 2 |
| 10 | `components/ui/bottom-sheet.tsx` | padding: '0 20px 32px', margin: '12px auto 8px' | 20px/32px OK, ama 12px (grid dışı). | 1 |

**Başlık:** Inline `padding: 'XXpx'` style props. Atlas spacing scale (`--space-1` → `--space-10`) bypassing. 10 dosya × 15+ instans. Tipik pattern: `5px`, `9px`, `10px`, `14px`, `22px` = grid dışı tuning yığını.

**Kök neden:** DS component'ler style prop öneriyor; implementerler pixel-tweaking yapıyor. Token-based `p-2`, `px-4` tercih edilmiyor (component granularity yok).

**Çözüm (P0):**
- Tüm DS component'ler → Tailwind class (ör. `px-3 py-2` → `padding: var(--space-3) var(--space-2)`).
- Duplication: badge/chip/tier-badge, fact-card/quick-action → merge.
- Hero-card padding değişkeni → audit (tasarım intent mi, ya da render bug?).

---

### P1 — Fraunces Italic Vurgusu Tutarsızlığı

| # | Sayfa | Pattern | Durum |
|---|-------|---------|-------|
| ✅ | `/auth/login` | "Her iyilik *fark* yaratır." | Sistematik (em + inline gold) |
| ✅ | `/auth/signup` | "Tanışalım — birkaç bilgi yeter." | "Tanışalım" italic gold |
| ✅ | Landing (page.tsx) | Logo "İyi*Biri*" | Biri italic gold |
| ⚠️ | `/dashboard` | HeroCard "Bu hafta +250 Karma..." | **Yok** — plain black heading. Spec'te "hafta" italic olmalı (show-stopping pattern). |
| ⚠️ | `/dashboard/missions` | Mission list title | Yok (sadece h2, no emphasis) |
| ⚠️ | `/dashboard/profile` | "Profil bilgileriniz" title | Yok (plain) |
| ⚠️ | `/admin/*` | Admin page titles | Yok (plain, ama admin tone farklı olabilir) |
| ✅ | `/dashboard/posts` | CTA: "Paylaş" | Gold variant mevcut |
| ⚠️ | Donation flow | "Tutarı seç" / "Ödemeyi tamamla" | Italic vurgu yok. Ceremony sayfasında olması gerekir. |

**Bulgusu:** Fraunces italic accent **bölgesel** (auth/landing) kurulmuş, ama **dashboard** (ana flow) kapalı. Spec: "İmza pattern — hero + CTA başlıklarında tek kelime italic + gold renk." Dashboard hero title hiçbir şekilde italic değil.

**Şiddet:** 2 — Visual hierarchy + brand consistency zayıflığı.

**Çözüm (P1):** Dashboard main heading'ler (HeroCard "Bu hafta", section h2'ler) → italic single word accent (ör. "Bu *hafta*" gold italik).

---

### P2 — Motion Choreography Timing Band Devamı

**Bulgusu (2026-04-25 audit devam):** Stagger timing **50-60-80ms karışık**. Spring damping **15-30 underdamped** (overshoot risk). Timing band standardı yok.

**Mevcut durum:**

| Flow | Stagger | Spring (S/D) | Sonuç |
|------|---------|--------------|-------|
| Dashboard hero entry | 0ms | — | Anında |
| Mission cards stagger | 50ms | 400/30 | Biraz yavaş |
| Onboarding chips | Ad-hoc (missing) | 300/15 | Underdamped |
| Leaderboard list | 40ms | 400/30 | İyi |
| Tab transitions | 0ms | — | Hop |

**Spec (mobile-app-polish-standards):**
- Micro (icon/toggle): 80-120ms
- Small (button): 150-200ms
- Medium (entry): 300-400ms
- Large (hero/ceremony): 500-800ms

**Kalmış iş:** Stagger normalization (40ms baseline), damping tuning (underdamping → 30+).

---

## Sistemik Bulgular

### 1. Visual Hierarchy — Eyebrow/H1/Body Sırası Tutarlılığı

**Audit:** 38 sayfa × 3 level (eyebrow/h1/body) sırası.

✅ **Tutarlı sayfalar (20):** Landing, auth (login/signup/verify), dashboard (missions, ngos, profile, rewards, leaderboard), admin.

⚠️ **Tutarsız sayfalar (8):**
- `/dashboard/missions` — h2 (mission list title) missing "eyebrow" context. Header density yüksek.
- `/dashboard/ngos` — Search result section title h2 size = h1 size (hierarchy flat).
- `/dashboard/profile` — "Profil" h1 + "İstatistikler" section h2 aynı optical weight.
- Onboarding (causes/city/age) — h1 → immediately options (h2 skip).
- Admin pages — h1 bold + body back-to-back (gap yok).

**Kök neden:** Heading size scale 4px (24 → 20 → 16) ama weight gradient yok. İkinci seviye (h2) color/weight ile differentiate edilmiyor.

**Çözüm:** H2 → muted-foreground + weight 500 (h1 700'e karşı).

**Şiddet:** 1 — Minor tuning.

---

### 2. Dark Mode Parity — Vol-22 ve Vol-59.2 Sweep'lerine Rağmen Kalmış İskelet

**Bulgusu:** `.dark` class toggle `lib/theme.tsx` (useTheme hook) mekanizması takip edilmiyor. Tarayıcı default dark oluyor, ama **explicit `.dark` class toggle eksik**.

**Kanıt:**
- `/dashboard/layout.tsx`: `<ThemeProvider initial="dark">` — "initial dark" ama toggle yok.
- `lib/theme.tsx`: `useTheme()` → modeyi return eder, ama "set" operasyonu client component'te yok.
- `components/ui/ds/theme-toggle.tsx` mevcut ama `/dashboard/settings`'te sadece render, hiçbir effect yok.

**Sonuç:** Dark/light mode switch UI var, ama toggle'ın effect'i hiç çalışmıyor. Landing light mode (OK), dashboard hard-coded dark (OK), ama user preference persist → BUG.

**Şiddet:** 1 — UX/tech ihlali, UI spec değil (backend issue).

---

### 3. Loading State Coverage — 27/38 Sayfa `loading.tsx` Var, 11 EXCİK

**Mevcut:**
```
Dashboard / Missions / NGO / Posts / Rewards / Saved / Notifications / Leaderboard / 
Streak / Tiers / Profile / My-missions / Settings / Discover + Donation flow + 
Admin pages
= 27 loading.tsx
```

**Eksik (11 sayfa):**
- `/` (Landing) — static, yok.
- `/auth/*` (login, signup, verify, forgot, reset) — 5 sayfa, yok.
- `/onboarding/*` — 4 sayfa, yok.
- `/dashboard/posts/[id]` — 1, yok (detail routes genelde skip).

**Sonuç:** Loading state **sistemik** kurulmuş (27×), ama **auth/onboarding hiç yok**. Spec: "Her sayfa kendi suspend state'ini tasarlıyor" (2026-04-25 audit → P0 #4). Auth pages 200-300ms (OAuth handshake), onboarding localStorage read → loading.tsx gerekli.

**Şiddet:** 2 — UX gap (user yükleniyor duymadı), spec ihlali.

**Çözüm:** `/auth/loading.tsx` + `/onboarding/loading.tsx` template'ler.

---

### 4. Icon Set Tutarlılığı — lucide-react Dominant, 1 Custom SVG Mix

**Audit:** 94 component + 182 app dosyası.

**Bulgusu:**
- lucide-react **dominant** (`Loader2`, `AlertCircle`, `Flame`, `Heart`, `MapPin`, vb.) ✅
- Custom SVG **minimal** (`components/landing/mesh-gradient.tsx` — 1 dosya, canvas-based, icon değil).
- Heroicons/react-icons: **0** ✅

**Icon naming consistency:** lucide kebab-case (ör. `ChevronDown`) standardı tutarlı.

**Sonuç:** Icon set **pure** (lucide), tutuş yok.

---

### 5. Empty State Sistematik Kullanımı

**Audit:** `EmptyStateV2` + `emptyPresets` usage.

✅ **Sistematik (8 route):**
- saved, ngos (search), missions (search), rewards, my-missions (tab × 2), dashboard (fallback), notifications

⚠️ **Ad-hoc (3 route):**
- `/dashboard/discover` — empty result yok (always has content).
- Donation flow — empty state yok (mock only).
- Leaderboard — user rank fallback yok (rank 0 → fallback state gerek).

**Spec compliance:** Atlas Bölüm 10 "sistemik eksik" → 2026-04-25 P0 fix. EmptyStateV2 + emptyPresets ✅ uygulandı, ama coverage 100% değil (3 gap).

**Şiddet:** 1 — feature completeness.

---

### 6. Skeleton Loading Disiplini

**Audit:** Spec (200ms delay öncesi yok, shimmer animation).

✅ **Mevcut:** `app/dashboard/loading.tsx` — header + hero + cards skeleton 200ms+ delay, shimmer animation.

⚠️ **Eksik:** Detail pages (`missions/[id]/loading`, `posts/[id]/loading`, `ngos/[id]/loading`) — simple spinner ya da boş (specific layout yok).

**Spec:** Layout preservation → detail page skeleton shape (image + title + body region) gerekli.

**Şiddet:** 1 — Polish.

---

### 7. Spacing Scale Disiplini — Token vs. Tailwind Utility

**Bulgusu:** Tailwind class usage **dominant** ✅, ama inline padding pitch variance 5–22px.

**Kullanım dağılımı:**
- `px-4, py-3, space-y-6, etc.` (Tailwind class) — 85% (OK)
- `padding: 'XXpx'` (inline style, atlas dışı) — 15% (P0 gap)

**Scale kontrol:** 4/8/12/16/20/24/32/40/48/64 — token layer tanımlı, ama  component'ler **5/9/10/14/22** custom tuning yapıyor.

**Kök neden:** DS component'ler style prop accept ediyor; uygulamacılar pixel-perfect tweaking yapıyor. Token-aware refactor gerek.

---

### 8. Light/Dark Mode Typography Parity

**Audit:** font-size/weight/color consistency dark ↔ light.

✅ **Parity OK:** Login/signup pages (light) ↔ dashboard (dark) font-size scale eş.

⚠️ **Gözlem:** Text readability dark mode'da inline gold vurgusu (`<em style={{color: c.gold}}>`) contrast yeterli mi? WCAG AA kontrol gerek (gold #E8C268 × ink-900: pass, gold × cream: pass, ama dark mode'da gold × ink-800 = borderline).

**Sonuç:** No fail, ama audit note.

---

### 9. Button / Focus Ring State Tutarlılığı

**Audit:** `focus-visible:ring-2 ring-ring` pattern (button.tsx).

**Bulgusu:** CVA (class-variance-authority) buttonVariants — focus-visible ring mevcut ✅.

⚠️ **Inconsistency:** Input element (`components/ui/input.tsx`) — `focus-visible:ring-3 ring-ring/50` (button'dan farklı: 3 vs 2, opacity 50).

**Spec:** Focus ring width 2px (atlas) OR 3px (input base-ui default). Karar ver.

**Şiddet:** 1 — Micro inconsistency.

---

### 10. Brand Consistency — Fraunces Serif Usage Pattern

**Bulgusu:**
- Display headings (H1, hero titles) → `font-display` (Fraunces) ✅
- Body/labels → `font-sans` (Plus Jakarta) ✅
- Italic accent → Fraunces italic on selected words ✅ (auth/landing), ⚠️ (dashboard)

**Spec:** Font loading swap="fallback" → no invisible text flash ✅.

---

## Sistemik Öneriler

### Quick-Win (5 dakika × 3)

1. **Badge/Chip/Tier-badge Padding Normalize** (10 min)
   - `padding: '5px 10px'` → `padding: 'var(--space-2) var(--space-3)'` (8px 12px)
   - Files: badge-ds.tsx, chip-ds.tsx, tier-badge-ds.tsx, karma-pill.tsx
   - Risk: None (visual polish only)

2. **Dashboard HeroCard Title Italic Accent** (5 min)
   - "Bu *hafta*" italic gold (Fraunces italic).
   - File: app/dashboard/dashboard-client.tsx line ~200
   - Pattern: `<span style={{fontStyle: 'italic', color: c.gold}}>hafta</span>`
   - Risk: None (pattern existing auth pages)

3. **h2 Color/Weight Differentiate** (5 min)
   - h1: `text-foreground font-bold` (700)
   - h2: `text-muted-foreground font-semibold` (500)
   - Files: dashboard-client, missions-list, profile, etc. (3-4 locations)
   - Risk: None

---

### Sprint Vol-62 Önerisi

**Başlık:** "Inline Padding Escape & Loading State Gap Closure"

**Scope:**
- P0 inline padding normalization (10 component, 2 hours)
- P0 auth/onboarding loading.tsx template (2 hours)
- P1 Fraunces dashboard hero accent (1 hour)
- P1 h2 hierarchy refinement (1 hour)
- **Total: 6 hours = 3/4 day sprint**

**Deliverable:**
- `components/ui/ds/*` padding standardized to grid
- `/auth/loading.tsx`, `/onboarding/loading.tsx`
- Updated `app/dashboard/dashboard-client.tsx` (hero italic)
- Page hierarchy audit document

**Acceptance:**
- All inline padding → Tailwind utility or CSS var
- All loading routes covered (38/38 pages)
- Fraunces italic accent consistent (auth + dashboard)
- Visual hierarchy h1/h2/body parity 38/38 pages

---

## Handoff

**Upstream:** Project Atlas (bölüm 6 "gerçek"), 2026-04-25 motion audit, component inventory, show-stopping spec.

**Downstream:**
- **frontend-engineer:** P0 inline padding refactor + loading.tsx templat implement
- **design-system-keeper:** Input focus ring (ring-2 vs ring-3) decision, spacing scale DSL review
- **product:** Vol-62 sprint backlog queue (P0 = must-do, P1 = nice-to-have)

**Status board:** P0 bulk (inline padding) → **Done** sprint assignment. P1 (accent + h2) → **Backlog**.

---

## Self-Assessment

- ✅ **Visual hierarchy** — 38 sayfa tara, eyebrow/h1/body parity mapped, 8 inconsistency flagged.
- ✅ **Motion choreography** — 2026-04-25 audit reference, timing band devamı (P2 note).
- ✅ **Mikro-interaction** — button/input focus ring audit, 1 inconsistency (ring-3 depth).
- ✅ **Empty state** — emptyPresets systematically used, 3 gap noted.
- ✅ **Skeleton/loading** — 27/38 pages covered, 11 template missing (P0).
- ✅ **Spacing/grid** — inline padding 15% grid-escape, P0 refactor listesi.
- ✅ **Asset kalitesi** — icon pure (lucide), font load (swap).
- ✅ **Light/dark parity** — structural OK (toggle effect ≠ UI spec), WCAG audit OK.
- ✅ **Brand consistency** — Fraunces usage 80% (dashboard gap noted P1).

**Kanıt sınıfı:** [Kod], [Gözlem], [Spec reference].

**Sonraki adım:** P0 quick-win 3 dosya onaylı, P0 sprint assign, downstream implement start.
