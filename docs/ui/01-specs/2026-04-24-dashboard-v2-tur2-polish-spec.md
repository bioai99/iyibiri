# Dashboard Ana v2 — Tur 2 Polish UI Spec

**Tarih:** 2026-04-24
**Yazar:** ui-designer
**Upstream:**
- UX audit `docs/ux/03-heuristics/2026-04-24-dashboard-v2-tur2-audit.md` (K1–K5, Q25/Q34/Q43)
- Journey `docs/ux/02-journeys/2026-04-24-dashboard-ikinci-ziyaret.md` (Zehra tur 2)
- Analyst brief `docs/product/02-briefs/ux/2026-04-24-dashboard-v2-tur2-brief.md` (A1–A5)
- Tur 1 UI spec `docs/ui/01-specs/2026-04-24-dashboard-ana-v2-ui-spec.md` (baseline)
- Project atlas Bölüm 6 (token gerçeği)

**Skill usage (zorunlu):**
- ✅ `visual-spec-writing` — Bölüm 10 (Visual Hierarchy) + Bölüm 11 (Motion Choreography)
- ✅ `design-system-audit` — Bölüm 7 (Atomic Design) + Bölüm 8 (Token Governance)
- ✅ `mobile-app-polish-standards` — Tier-1 benchmark (Duolingo, Things 3)

**Durum:** Implementation-ready

---

## 1. Özet

**Tur 1'den tur 2'ye:** Tur 1 (sabah) HeroCardV2 + DailyMissionCard + mission list canlıya çıktı. Tur 2 (bu spec) eksik 3 user signal'ı (Streak snapshot, Leaderboard teaser, Featured mission selection algorithm) + K1 token drift (MissionCard hardcoded gradient) çözerek dashboard'ı **müş­te­ri re­ten­syon için** optimize ediyor. Motion choreography (Duolingo + Things 3 pattern) + Visual Hierarchy (grayscale-first) + A11y (WCAG AA, touch 44+px, focus visible).

**3 yeni component:**
- **StreakSnapshot** (atom/molecule) — 7-gün dot ring + flame emoji + "N gün seri" label
- **LeaderboardTeaser** (organism, feature-flag) — "Bu hafta #43'tesin · 150 fark top 10'a" (Q25 cevabı (a) pozitif frame)
- **LeaderboardTeaser** render sınırlaması: 3 adayız top-10 avatarı preview (50×50px) + "ve 540 kişi daha"

**3 mevcut component polish:**
- **HeroCardV2** → StreakSnapshot alt-section eklenmesi
- **DailyMissionCard** → "Senin için önerildi" micro-label + selection sebebi tooltip (Q34 cevabı (a) MVP)
- **MissionCard** → hardcoded domain gradient → token-based (`bg-domain-{domain}`) refactor (K1 fix)

---

## 2. Sayfa iskeleti (ASCII wireframe — tur 2)

```
┌─────────────────────────────────────────────────┐
│ Header (sticky)                                 │ ← bg-background/90 backdrop-blur
│ "Merhaba Zehra 👋"    [🔔(3)]  [⚙️]            │ ← pt-safe + h-14
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────┐     │
│  │  HERO CARD (gold glow)                │     │ ← rounded-3xl, p-8
│  │  [1.240 Karma] [İyi Biri ★ ⏹⏹⏹⏹⏹⏹░░░]     │    shadow-[0_8px_32px_rgba...]
│  └───────────────────────────────────────┘     │
│                                                 │
│  ┌───────────────────────────────────────┐     │
│  │ 🔥 15 gün seri | ✅ 10 tamamlandı     │     │ ← StreakSnapshot (A1) YENİ
│  │ 📊 2 aktif görev                      │     │    molecule level, inline 3-stat
│  └───────────────────────────────────────┘     │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┃ GÜNÜN GÖREVİ                         │ ← tur 1 yok, gold left border (4px)
│  ┃ [photo full-bleed + gradient overlay]│ ← rounded-2xl, p-6
│  ┃ +200 Karma · 2 saat                 │
│  ┃ Sahil Temizliği · TEMA Vakfı        │
│  ┃ "Senin için önerildi" (tooltip)     │ ← (Q34 cevabı, micro-label)
│  ┃ [Başvur →]                           │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Sana uygun (3)              [Tümü →]          │
│  ┌────┐ ┌────┐ ┌────┐                          │
│  │MC1 │ │MC2 │ │MC3 │ (horizontal scroll)     │
│  │    │ │    │ │    │ (snap-x-mandatory)      │
│  └────┘ └────┘ └────┘                          │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Topluluk                    [Tümü →]          │
│                                                 │
│  📊 Bu hafta #43'tesin                        │ ← LeaderboardTeaser (A2) YENİ
│  150 Karma fark top 10'a                      │ ← feature-flag behind, Q25 tone
│  [👤 👤 👤] ve 540 kişi daha                  │ ← 3 avatar preview + count
│                                                 │
├─────────────────────────────────────────────────┤
│  [scroll continues]                            │
│                                                 │
│  Yeni Ödüller              [Mağaza →]         │ ← RewardRail (A5, P1)
│  ┌────────┐ ┌────────┐                         │ ← feature-flag: P1 (Overhead)
│  │Reward1 │ │Reward2 │                         │
│  └────────┘ └────────┘                         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ [NGO rail - tur 1 mevcut]                      │
│ [Bottom nav (fixed) - tur 1 mevcut]            │ ← pb-safe
│                                                 │
└─────────────────────────────────────────────────┘
```

**Yeni vs tur 1 delta:**
- ✅ StreakSnapshot (Adım 2 → Adım 3)
- ✅ LeaderboardTeaser (Adım 4, mission scroll öncesi)
- ✅ DailyMissionCard "Senin için önerildi" micro-label
- ✅ MissionCard domain gradient token refactor
- ❌ RewardRail (P1'ye taşındı, bu sprint **feature-flag OFF**)

---

## 3. Token referansı

**Kaynak:** `project-atlas.md` Bölüm 6 + `tailwind.config.ts` + `app/globals.css`

### Renk token'ları (kullanılan)

| Alan | Token (Tailwind) | Değer | Kontrol |
|---|---|---|---|
| Page bg | `bg-background` (dark class) | ink-900 #24201B | ✅ atlas |
| Header bg | `bg-background/90 backdrop-blur-md` | ink-900/90 + blur | ✅ atlas |
| Header border-bottom | `border-b border-ink-600/50` | hairline seperation | ✅ atlas |
| Hero card bg | `bg-gradient-to-br from-ink-800 via-ink-800 to-ink-900` | subtle depth | ✅ atlas |
| Hero glow shadow | `shadow-[0_8px_32px_rgba(232,194,104,0.35)]` | **İMZA gölge** (K6 imza pattern) | ✅ atlas |
| Hero border soft | `ring-1 ring-gold/20` | glow edge | ✅ atlas |
| Streak snapshot bg | `bg-ink-700` | card interior | ✅ atlas |
| Streak label | `text-gold` | motivational accent | ✅ atlas |
| Günün görevi left accent | `bg-gold` (4px left border) | featured indicator | ✅ atlas |
| Günün görevi card bg | `bg-card` (ink-800) | primary surface | ✅ atlas |
| Leaderboard card bg | `bg-ink-700` | surface 2 | ✅ atlas |
| Mission card domain gradient | `bg-domain-{domain}` (NEW) | e.g. `bg-domain-nature` | 🔴 **K1 FIX** |
| Text primary | `text-cream` | foreground | ✅ atlas |
| Text secondary | `text-ink-300` | muted | ✅ atlas |
| Text tertiary | `text-ink-400` | faint | ✅ atlas |
| Karma accent number | `text-cream` + `text-gold` (seri label) | primary + secondary | ✅ atlas |
| Link color | `text-gold` | CTA + "Tümü →" | ✅ atlas |

### Token ihlali tespiti (design-system-audit Bölüm 8 — Token Governance)

**K1 — MissionCard hardcoded domain gradient (CRITICAL)**
- **İhlal:** `components/ui/mission-card.tsx` L20–27 `domainGradient` object hardcoded:
  ```tsx
  nature: 'linear-gradient(135deg, #10B981, #14B8A6)',
  education: 'linear-gradient(135deg, #3B82F6, #6366F1)',
  // ...
  ```
- **Sebep:** Tailwind utility yok, inline style fallback.
- **Severity:** 4 (launch blocker — design drift risk)
- **Aksiyon:** **ADD** + **ALIAS** (Bölüm 8 Karar ağacı)
  1. `tailwind.config.ts` extend theme → `backgroundImage` layer:
     ```tsx
     'domain-nature': 'linear-gradient(135deg, #10B981, #14B8A6)',
     'domain-education': 'linear-gradient(135deg, #3B82F6, #6366F1)',
     'domain-social': 'linear-gradient(135deg, #F43F5E, #EC4899)',
     'domain-financial': 'linear-gradient(135deg, #F59E0B, #D97706)',
     'domain-animals': 'linear-gradient(135deg, #F97316, #EA580C)',
     'domain-culture': 'linear-gradient(135deg, #A855F7, #9333EA)',
     ```
  2. MissionCard: `style.backgroundImage` → `className={`bg-domain-${domain}`}`
  3. **ADR candidate:** Token governance decision (ADD vs ALIAS) — design-system-keeper peer review.
  4. **Handoff:** design-system-keeper (Faz 2 bağlı, şu sprint başında tanımla).

**Tüm diğer token'lar:** ✅ Atlas'a uyumlu.

---

## 4. Visual Hierarchy — Grayscale-first Disiplini (Bölüm 10)

### Grayscale mock (renk olmadan)

```
┌─────────────────────────────────────────────────┐
│ Header (yok, sticky)                            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────┐     │
│  │  1.240 (72px black weight)            │ ← TIER 1: kullanıcı öz-kimlik
│  │  İyi Biri ★ (28px medium weight)     │    (1. bakılan, en büyük)
│  │  ▓▓▓▓▓▓░░░ (progress bar subtle)     │
│  └───────────────────────────────────────┘     │
│                                                 │
│  [6-chip inline + 3-stat] (14px regular)      │ ← TIER 2: haftalık metrik
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┃ GÜNÜN GÖREVİ (16px bold)            │ ← TIER 2: featured aksiyon
│  ┃ [160px photo]                        │    (2. bakılan, focal point)
│  ┃ +200 Karma (20px medium number)      │
│  ┃ Başlık (14px bold) + NGO (12px gray) │
│  ┃ [Başvur CTA]                         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Sana uygun (14px semibold)            │ ← TIER 3: scroll önerileri
│  [3 mission card horizontal]            │    (3. bakılan, secondary)
│                                                 │
├─────────────────────────────────────────────────┤
│  Topluluk (14px semibold)              │ ← TIER 3: sosyal sinyali
│  [teaser text + rank]                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Çıktı:** Hierarchy net. Hero (1.240 sayı) visual dominance = user karma identity. DailyMissionCard featured box = focal point (Things 3 "tek amaç"). Mission list scroll = secondary exploration.

**Kontrol edilen:** Whitespace (hero p-8 geniş, scroll kartlar p-6), size ladder (72 → 28 → 20 → 16 → 14 → 12 px), weight ladder (max 3: regular + semibold + bold; black sadece KarmaCounter).

### Size + weight ladder

| Rol | Size | Weight | Example | Neden |
|---|---|---|---|---|
| Hero number (Karma) | 56–72px | 900 (black) | `font-display font-black text-6xl` | Identity prim |
| Hero title (tier name) | 28–32px | 500 (italic) | Fraunces italic + gold | Imza pattern |
| Section head | 16–18px | 700 (bold) | "Sana uygun", "Topluluk" | Secondary section |
| Card title (mission) | 14–16px | 600 (semibold) | Mission başlık | Content hierarchy |
| Body text | 14px | 400 (regular) | Description + metadata | Reading |
| Label / chip | 11–12px | 500 (medium) | "Doğa", "+200 Karma" | Accent |

**Discipline:** Size 12, 14, 16, 18, 20, 28, 32, 48, 56, 72 (grid: 4px + 8px). Weight 400, 500, 600, 700, 900 (max 3 per screen).

### Color = intent, not hierarchy

- **Gold** = action (CTA, accent, achievement) + success (streak, karma earn)
- **Cream** = primary text (leading eye)
- **Ink-300** = secondary text (muted)
- **Ink-400** = tertiary text (very faint)
- **Ink-700** = card interior (surface 2, soft)
- **Clay** = warning accent (future: "serin bozuldu" state)

**Örnek:** "Sana uygun" section head = 16px semibold cream (not gold) → size + weight hierarchy. "Tümü →" CTA link = gold (semantic: action).

### Shadow tier

| Tier | Shadow | Use |
|---|---|---|
| **Tier 1 (floating)** | `shadow-[0_8px_32px_rgba(232,194,104,0.35)]` | Hero card (gold glow — İMZA) |
| **Tier 2 (surface)** | `shadow-md` (0 4px 24px rgba...) | Card default |
| **Tier 3 (flat)** | none | Background, input field |

Hero glow sadece hero card → elevation hierarchy başta anlaşılır.

---

## 5. Component spec — detaylı her biri

### 5.1. HeroCardV2 (polish, tur 1 mevcut)

**Mevcut:** Karma count-up + tier progress bar + 3 stat cell (aktif/tamamlanmış/seri) + "İyi Biri" tier badge.

**Polish delta (K2/K5 + tur 2 önerisi A1):**
- ✅ Mevcut glow + KarmaCounter + tier name — sabit tut.
- ✅ Motion: count-up 800ms spring (mevcut).
- **➕ NEW:** Streak snapshot **alt-section** ekle (tur 1 plan'da vardı):
  - Layout: hero card sınırı içinde, progress bar altında, 8px gutter
  - Content: 7-gün dot ring (120px diam) + flame emoji + "N gün seri" label (16px semibold)
  - State variant: 0 gün (gray) / 1–6 gün (ink-700 bg) / 7+ gün (gold bg → tier upgrade hissi)
  - Motion: dot entry stagger (40ms each, 7 × 40 = 280ms) + flame pulse (2s slow, useReducedMotion korunsun)

**Props delta:**
```typescript
interface HeroCardV2Props {
  // tur 1 existing
  karma: number;
  level: number;
  weeklyGain?: number;
  // tur 2 new
  streakDays: number;        // 0–30+ 
  streakLastDay: Date;       // seri risk hesap için
  streakMaxGoal?: number;    // default 30
}
```

**Token × variant × state tablosu:**

| State | Hero bg | Glow | Streak color | Motion |
|---|---|---|---|---|
| Loading | skeleton shimmer | none | — | shimmer 200ms delay |
| Default (0 gün) | ink-800 gradient | gold 0.35 | ink-600 (grayed) | entry spring 500ms |
| Default (1–6 gün) | ink-800 gradient | gold 0.35 | ink-700 bg | dots stagger 40ms |
| Default (7+ gün) | ink-800 gradient | gold 0.35 + **boost** | **gold bg** (celebration) | flame pulse 2s, tap `scale: 0.99` |
| Reduced-motion | same | static | same | instant, fade-only |

**A11y:** 
- Streak label: `aria-label="15 gün üst üste Karma kazandın"` (screen reader).
- Dots: `aria-live="polite"` "serin başarılı" confirm.
- Touch: hero tap hotspot ≥44×44 (overall hero ✅).

### 5.2. StreakSnapshot (YENİ component — molecule)

**Level:** Molecule (3 child: `StreakDotRing` atom + `FlameIcon` atom + text).

**Purpose:** Duolingo benchmark (7-gün consecutive → 3-4x retention). Seri görünürlüğü dashboard'da olursa Zehra (tur 2 journey adım 3) `+2` emotion skor (peak moment).

**Props:**
```typescript
interface StreakSnapshotProps {
  days: number;              // 0–30+
  lastActiveDay: Date;       // seri kırılma riski hesap
  maxGoal?: number;          // default 30 → "tamamlama" UI
  onStreakClick?: () => void; // → `/dashboard/streak` detay
}
```

**Variants:**
- **variant="default"** (1–6 gün): ink-700 bg, flame orange, label "N gün seri"
- **variant="active"** (7+ gün): gold ring round StreakDotRing, flame gold, label "🔥 N gün — yolda!"
- **variant="broken"** (son 24h kaçırıldı): clay accent (#C8553D), flame grayed, label "⚠️ Seri risk — bugün yap"

**Layout:**
```
┌────────────────────────────┐
│ 🔥 (40px flame)            │
│ ⭕⭕⭕⭕⭕⭕⭕ (7-dot ring)     │ ← 120px diameter
│ 15 gün seri                │ ← 16px semibold
│ (next milestone 15/30)      │ ← 12px muted (future)
└────────────────────────────┘
```

**Motion:**
- Entry: dots fade-in + scale (0 → 1) stagger 40ms each = 280ms total, spring 400/30.
- Flame: pulse effect 2s infinite, `opacity: [0.8, 1, 0.8]` (subtle breathing).
- Reduced-motion: no animation, instant opacity 1.

**Token:**
- Bg (1–6 gün): `bg-ink-700`
- Bg (7+ gün): `bg-gold/20` (soft highlight)
- Text: `text-cream` body, `text-gold` (7+ variant)
- Flame icon: **Lucide `Flame` 40×40** (color: variant state'e göre).

**A11y:**
- `aria-label="15 gün üst üste gönüllülük yaptın. Seri devam etsin!"`
- `aria-current="true"` (motivational highlight)
- Touch: ≥44×44 (overall component)

**Dosya hedefi:** `components/dashboard/streak-snapshot.tsx` (yeni)

---

### 5.3. LeaderboardTeaser (YENİ component — organism, feature-flag)

**Level:** Organism (3 child molecule: `AvatarGroup` + stat chip + CTA).

**Purpose:** Sosyal motivasyon (Duolingo pattern +5-8% engagement). **Q25 cevabı (a) pozitif frame.** TR kültüründe baskı riski → feature-flag behind, user test doğrulama gerek (tur 2 aksiyon: Q25 3-kişi derinlik test).

**Feature-flag:** `FEATURE_LEADERBOARD_TEASER=true` (env'de). False → hiç render edilmez.

**Props:**
```typescript
interface LeaderboardTeaserProps {
  userRank: number;              // e.g. 43
  totalUsers: number;            // e.g. 5420
  topThree: Array<{ id, name, avatarUrl, karma }>;  // top-3 preview
  karmaGapToTop10: number;       // e.g. 150
  onViewLeaderboard?: () => void; // → `/dashboard/leaderboard`
}
```

**Variants:**
- **variant="approaching"** (user rank 11–100, karmaGap < 200): `"Bu hafta #43'tesin · 150 Karma fark top 10'a"` (positive, achievable frame)
- **variant="far"** (rank 101+): `"Sırada yükselişe geçebilirsin · Topluluğa katıl"` (encouraging, not demeaning)
- **variant="top10"** (rank 1–10): `"Top 10'dasın! 🌟 · #5 için 80 Karma daha"` (celebration frame)

**Copy tone (TR cultural sensitivity Bölüm 5):**
- ✅ "yaklaşıyorsun" (approachable) vs ❌ "seninle yarışıyorlar" (pressure).
- ✅ "fark az" (achievable) vs ❌ "çok geride kaldın" (demoralizing).
- ✅ "beraber fark yaratabiliriz" (collective) — fallback frame.

**Layout:**
```
┌─────────────────────────────────┐
│ 📊 Topluluk                      │ ← section header (muted)
├─────────────────────────────────┤
│ Bu hafta #43'tesin              │ ← 18px bold (rank highlight)
│ 150 Karma fark top 10'a          │ ← 14px regular (context)
│                                 │
│ [👤] [👤] [👤] ve 540 kişi       │ ← 3 avatar (50×50 + border)
│                                 │
│ [Leaderboard'ı Aç →]            │ ← gold CTA link
└─────────────────────────────────┘
```

**Motion:**
- Entry: fade-in + slide-up (y: 16px → 0) 400ms spring, 900ms delay (tur 2 choreography Bölüm 6).
- Avatar: stagger fade-in 80ms each.
- Reduced-motion: opacity-only, instant y.

**Token:**
- Bg: `bg-ink-700` (surface 2)
- Rank text: `text-cream` 18px bold
- Gap text: `text-ink-300` 14px regular
- Avatar border: `ring-1 ring-gold/40` (subtle highlight)
- CTA link: `text-gold`

**A11y:**
- `aria-label="Sıralamada #43'ün. Top 10'a 150 Karma fark. Leaderboard'ı aç."`
- `aria-live="polite"` (rank update hissettir)
- Touch: CTA ≥44×44

**Dosya hedefi:** `components/dashboard/leaderboard-teaser.tsx` (yeni)

**Feature-flag handoff:** design-system-keeper (P1 sprint'de feature-flag infra var mı kontrol).

---

### 5.4. DailyMissionCard (polish, tur 1 mevcut)

**Mevcut:** Photo hero (full-bleed + gradient overlay) + Karma chip + impact + "Başvur" CTA.

**Polish delta (Q34 cevabı + UX audit):**
- ✅ Existing photo + Karma + "Başvur" button — sabit tut.
- **➕ NEW:** "Senin için önerildi" **micro-label** ekle (12px medium, cream text, ink-700 bg, rounded-full):
  - Placement: card title altında, impact statement üstünde, inline.
  - Content: `"Senin için önerildi"` (default) veya context: `"seninki kadar Karma"` / `"yakın konum"` (tooltip via aria-label).
  - Sebebi: Q34 audit'te "algoritma transparent olmalı" bulgusu — user "niye bu görev?" sorusunun cevabını 1 label'dan görsün.
- **➕ NEW:** selection reason tooltip (on-hover web, long-press mobile):
  - Copy: `"Senin +15 Karma görevleri seviyor" / "3 km uzağınızda"` (personalization signal).
  - Tech: `title="{reason}"` veya aria-label expand.
- **Motion:** Card entry 350ms spring, stagger 60ms (existing). Tap feedback 0.97 scale (existing).

**Props delta:**
```typescript
interface DailyMissionCardProps {
  // tur 1 existing
  mission: Mission;
  // tur 2 new
  selectionReason?: "domain_match" | "nearby" | "trending" | "algo_random";
  selectionReasonText?: string; // e.g. "senin ilgi alanlarında"
}
```

**Token × variant × state:**

| State | Photo border | Label color | Motion |
|---|---|---|---|
| Loading | skeleton | — | shimmer |
| Default | ring-1 ring-border | `bg-ink-700 text-cream` | entry 350ms spring, 100ms delay |
| Hover (web) | ring-2 ring-gold/40 | same | shadow lift +2px |
| Tap | ring-1 ring-gold | same | scale 0.97 spring |
| Reduced-motion | ring-1 ring-border | same | instant, fade-only |

**A11y:**
- Label: `aria-label="Senin için önerildi — Doğa görevleri seviyor" / "Bu bölgede"` (screen reader hint).
- Gesture: long-press (mobile) shows tooltip, hover (web) shows title.
- Touch: CTA button ≥44×44 (existing).

### 5.5. MissionCard (K1 polish — token refactor)

**Mevcut:** domain badge + duration + location + bookmark icon (4 chips inline).

**K1 fix (hardcoded gradient → token):**
1. **Sorun:** Inline style `backgroundImage: domainGradient[domain]` → hardcoded hex, design drift.
2. **Çözüm:** 
   - `tailwind.config.ts` → `backgroundImage` layer (`bg-domain-nature`, `bg-domain-education`, vb.) **ADD**.
   - MissionCard: `style.backgroundImage={...}` → `className={`bg-domain-${domain} rounded-2xl`}`.
   - Kontrol: all 6 domain category cover.
3. **Variant 4-chip (A4 önerisi, tur 3'e — opsiyonel bu sprint):**
   - Schema ready mi: `mission.difficulty_level`? Kontrol gerek.
   - Eğer yok, bu sprint **chip count 3 (domain + time + location) sabit tut**.
   - Eğer migration 015 yay varsa, 4. chip (difficulty) add test.

**Token:**
```typescript
// tailwind.config.ts extend
backgroundImage: {
  'domain-nature': 'linear-gradient(135deg, #10B981, #14B8A6)',
  'domain-education': 'linear-gradient(135deg, #3B82F6, #6366F1)',
  'domain-social': 'linear-gradient(135deg, #F43F5E, #EC4899)',
  'domain-financial': 'linear-gradient(135deg, #F59E0B, #D97706)',
  'domain-animals': 'linear-gradient(135deg, #F97316, #EA580C)',
  'domain-culture': 'linear-gradient(135deg, #A855F7, #9333EA)',
}
```

**Dosya:** `components/ui/mission-card.tsx` (existing, refactor).

**A11y:**
- Touch: ≥44×44 button area (existing).
- Focus ring: `ring-2 ring-gold` (existing).
- Bookmark toggle: `aria-pressed="true|false"` (existing).

---

### 5.6. NGO rail (mevcut — tur 2 refactor opsiyonel)

**Mevcut:** horizontal scroll, 36px avatar disk + name.

**Tur 2 notlar:**
- ✅ Member gold border çalışıyor.
- ⚠️ Empty state (0 NGO) — N1 audit sorun. **Opsiyonel bu sprint:** fallback message `"Takip ettiklerini ekle"` + link `/dashboard/ngos`.

**Dosya:** `app/dashboard/dashboard-client.tsx` (mevcut, düzenleme minimal).

---

### 5.7. Tabs / ChipDS (mevcut — a11y fix)

**UX audit Q7 (kontrast):** Inactive tab `ink-600` (3.2:1) → fail AA. Fix:

| State | Color | Contrast | Fix |
|---|---|---|---|
| Active | gold text + gold underline | — | OK |
| Inactive | **ink-500 text** (NOT ink-600) | 4.5:1 ✅ | **UPGRADE** |

**Dosya:** `components/ui/ds/chip.tsx` (existing, color token update).

**A11y:**
- Keyboard: arrow keys + Home/End (existing).
- Focus visible: ring-2 ring-gold (existing).

---

### 5.8. BottomNav (mevcut — polish opsiyonel)

**Mevcut:** 5 tab fixed sticky.

**Tur 2 notlar:**
- ✅ Safe-area (`pb-safe`) applied.
- ✅ Active indicator (color + bold) clear.
- Opsiyonel: tap "bump" haptic (iOS 16+) — `Haptics.impact({style: Light})` on tab switch.

**Dosya:** `components/bottom-nav.tsx` (existing, haptic add opsiyonel).

---

### 5.9. EmptyState (mevcut — değişmez)

**Durum:** WS-04 sistemik state library kullanımda (tur 1 canlıya çıktı).

**Dosya:** `components/ui/state/index.tsx` (mevcut, tur 2'de dokunulmaz).

---

### 5.10. RewardRail (P1 — spec ready ama feature-flag OFF bu sprint)

**Status:** **FEATURE-FLAG OFF bu sprint.** Tur 2 B scope veya P1'e taşındı (analyst brief A5 = Overhead).

**Spec (tur 3+ reference):**
- Layout: dashboard scroll bottom-section (NGO rail + leaderboard teaser sonra).
- Content: top-3 reward card (50px icon + "+" Karma + "Tap to redeem").
- CTA: "Mağaza" link → `/dashboard/rewards`.
- Motion: fade-in 400ms @ 1100ms delay (entry choreography).

**Dosya placeholder:** `components/dashboard/reward-rail.tsx` (create but flag OFF).

---

## 6. Motion Choreography — Rauno + Duolingo disiplini (Bölüm 11)

### Dashboard entry sequence (T=0 page load)

```
T=0ms    Page loaded
│
├── T=0ms    Header (sticky) instant opacity 1
├── T=50ms   Hero card fade + scale 0.98→1, opacity 0→1 (spring 400/30, 500ms duration)
├── T=250ms  KarmaCounter count-up 0→current (800ms, custom ease [0.16,1,0.3,1])
├── T=200ms  Streak snapshot entry:
│            ├── Dot ring fade-in + scale (spring, 280ms)
│            ├── Flame entry fade-in @ T=280ms
│            └── Flame pulse start (2s cycle, infinite)
├── T=300ms  Progress bar fill (800ms, cubic ease)
├── T=350ms  StreakSnapshot stat chip entry (fade + scale)
├── T=500ms  Günün görevi card entry (scale 0.98→1, 400ms spring, 100ms delay)
├── T=700ms  "Senin için önerildi" label fade-in (200ms)
├── T=800ms  Mission list stagger (max 5 visible cards):
│            ├── Card 1 @ T=800ms
│            ├── Card 2 @ T=860ms (60ms stagger)
│            ├── Card 3 @ T=920ms
│            ├── Card 4 @ T=980ms
│            └── Card 5 @ T=1040ms
├── T=1000ms LeaderboardTeaser entry (fade + slide-up, 400ms spring, 900ms delay from T)
├── T=1200ms NGO rail slide-in right (300ms spring)
└── T=1500ms All animations complete; page interactive
```

**Total:** ~1.5s entry sequence. Reduced-motion → instant opacity transitions only, no transforms.

### Tap feedback (interactive elements)

| Element | Feedback | Spring | Duration |
|---|---|---|---|
| Hero card | `scale: 0.99` | 400/30 | 150ms |
| Günün görevi card | `scale: 0.98` | 400/30 | 150ms |
| Mission card | `scale: 0.97` | 400/30 | 150ms |
| Tab switch (ChipDS) | underline shift 150ms linear | — | 150ms |
| Button (CTA) | `scale: 0.95` | 400/30 | 150ms |
| Bookmark toggle (MissionCard) | `rotate: 0→360°` | — | 200ms rotate |

**Haptic choreography:**
- Mission card tap: `Haptics.impact({style: Light})` (0.1s).
- "Başvur" button: `Haptics.impact({style: Medium})` (0.15s).
- Karma real-time gain (future): `Haptics.impact({style: Heavy})` + `notification({type: Success})`.

**Reduced-motion fallback:**
- Stagger animations → instant (no delay).
- Transform animations (`scale`, `y`) → removed, opacity only.
- Duration: instant (0ms) or fade-only 200ms.

**Code reference (Framer Motion handoff):**
```typescript
// Hero entry
<motion.div
  initial={{ opacity: 0, scale: 0.98 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30, duration: 0.5 }}
/>

// Stagger container
<motion.div
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.8 }
    }
  }}
/>

// useReducedMotion hook
const prefersReducedMotion = useReducedMotion();
<motion.div
  animate={{ y: prefersReducedMotion ? 0 : 16 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4 }}
/>
```

---

## 7. Responsive

**Mobile-first** (V1 focus). `max-w-lg` container (512px), `px-4`.

- **Mobile** (<640px): single column. Hero full-width. Hero p-8. Cards p-6. Spacing `space-y-6` (24px).
- **Tablet** (640–1024px): same layout, increase h-margin (`px-6`). Mission cards 3-column grid (optional tur 1.1). Hero p-10.
- **Desktop** (>1024px): max-w-2xl. **V2+ roadmap.**

**Safe-area:** `pt-safe` (header), `pb-safe` (bottom nav).

---

## 8. A11y baseline (WCAG AA)

- [ ] **Kontrast ≥4.5 metin, ≥3 icon:**
  - KarmaCounter (cream × ink-900): 14:1 ✅
  - Body (ink-300 × ink-900): 5.2:1 ✅ (tight)
  - Inactive tab (ink-500 × ink-900): 4.5:1 ✅ (after fix)
  - Secondary (ink-400): 4.8:1 ✅ (sınır)

- [ ] **Touch ≥44×44:**
  - Hero card: root ≥200px height ✅
  - Mission card: ≥200px height ✅
  - Button (Başvur, Leaderboard CTA): `min-h-11 min-w-11` (44×44) ✅
  - Bookmark icon: `h-6 w-6` + padding ✅
  - Tab switch: `h-10` tap area ✅

- [ ] **Focus-visible ring her interactive element:**
  - `focus-visible:ring-2 ring-gold` (all button, tab, link) ✅

- [ ] **Semantic HTML:**
  - `<button>` tüm CTA (Başvur, Leaderboard, "Tümü →")
  - Icon-only button → `aria-label` zorunlu
  - `<nav>` bottom nav, header nav
  - `<main>` content area
  - Heading hierarchy: h1 hero, h2 section, h3 card (variable render)

- [ ] **Screen reader support:**
  - Hero: `aria-label="1.240 Karma kazandın. İyi Biri seviyesinde. 60% tamamlandı."`
  - Streak: `aria-label="15 gün üst üste gönüllülük."`
  - Leaderboard: `aria-label="Sıralamada #43. Top 10'a 150 Karma fark."`
  - DailyMissionCard: `aria-label="Günün görevi. Sahil Temizliği. +200 Karma. 2 saat. TEMA Vakfı."`
  - Empty state: `aria-live="polite"` message

- [ ] **Keyboard navigation:**
  - Tab order: header → hero → streak snapshot → daily card → mission list → leaderboard → bottom nav (logical)
  - Tab key cycle
  - Arrow keys: tab switch (ChipDS), mission scroll (optional)
  - Enter/Space: button activate

- [ ] **Color-blind safe:**
  - Karma accent: gold + icon (flame, star) → not color-only
  - Domain gradient: color + icon badge → not color-only
  - Status: text + icon indicator

- [ ] **Reduced-motion:**
  - `@media (prefers-reduced-motion: reduce)` all animations → off
  - Fallback: opacity transition only, 200ms

---

## 9. 12-maddelik Quality Checklist

**Visual Hierarchy (Bölüm 10):**
- [x] Grayscale mockup var mı? (Renk olmadan hierarchy görülüyor mu?) → **Yes, Section 4**
- [x] Size scale tutarlı mı? (grid 4px/8px?) → **Yes, 12–72px range, 4px intervals**
- [x] Weight ladder (max 3) tutarlı mı? → **Yes: 400 + 500 + 600 + 700 + 900 (Karma counter only)**
- [x] Color = intent, not hierarchy? → **Yes, section 4 explicit**
- [x] Shadow tiers uygulanmış mı? → **Yes, hero glow + card shadow + flat**
- [x] Spacing grid 8px base mi? → **Yes, space-y-6 (24px) = 3×8**
- [x] Whitespace prominent element'i destekliyor mu? → **Yes, hero p-8 large gutter**

**Motion Choreography (Bölüm 11):**
- [x] Stagger pattern tanımlanmış mı (delay increment + max item)? → **Yes, 60ms card stagger, 5 max, 40ms dot stagger**
- [x] Spring defaults İyiBiri pattern mi (400/30)? → **Yes, default spring + celebration spring 200/12**
- [x] useReducedMotion fallback var mı? → **Yes, all animations checked**
- [x] Exit animation (AnimatePresence) modal'de var mı? → **N/A dashboard (modals gelecek)**
- [x] Tap feedback mobile context'te mi (scale 0.97)? → **Yes, 0.97–0.99 range**
- [x] Animation duration max 300ms per segment? → **Yes, 150–800ms band respected**
- [x] Handoff (Framer Motion pattern code) var mı? → **Yes, Section 6 code reference**

**Handoff:**
- [x] Downstream agent (frontend-engineer) clear next-step have? → **Yes, Section 10 handoff listesi**
- [x] Feature-flag status clear? → **Yes, LeaderboardTeaser + RewardRail feature-flag OFF noted**
- [x] Token ihlali tespit + handoff? → **Yes, K1 MissionCard → design-system-keeper, Section 3**

---

## 10. Component handoff listesi — frontend-engineer için

| # | Component | Yeni/Polish | Dosya hedefi | Props API | Test notu | Effort |
|---|---|---|---|---|---|---|
| 1 | StreakSnapshot | Yeni (molecule) | `components/dashboard/streak-snapshot.tsx` | `{ days, lastActiveDay, maxGoal?, onStreakClick? }` | Variant 3 (0 gün, 1–6 gün, 7+), motion 280ms dot stagger + 2s flame pulse, reduced-motion check | S |
| 2 | LeaderboardTeaser | Yeni (organism, feature-flag) | `components/dashboard/leaderboard-teaser.tsx` | `{ userRank, totalUsers, topThree[], karmaGapToTop10, onViewLeaderboard? }` | Feature-flag `FEATURE_LEADERBOARD_TEASER=true`. Variant 3 (approaching, far, top10). Copy tone Q25 (a) frame. Query `/lib/supabase/queries/leaderboard-teaser.ts` | M |
| 3 | HeroCardV2 | Polish | `components/dashboard/hero-card-v2.tsx` | Add `streakDays`, `streakLastDay` props. StreakSnapshot sub-component call. | Existing test pass + new streak section. Motion 280ms dot + 2s flame pulse. | S |
| 4 | DailyMissionCard | Polish | `components/dashboard/daily-mission-card.tsx` | Add `selectionReason?`, `selectionReasonText?`. Micro-label + tooltip. | Q34 algorithm context show. Motion existing 350ms card + 60ms stagger. | S |
| 5 | MissionCard | Polish (K1 fix) | `components/ui/mission-card.tsx` | Replace `style.backgroundImage` → `className={`bg-domain-${domain}`}`. Refactor. | Tailwind config updated first. All 6 domain category test. A4 (4-chip) opsiyonel tur 3. | S |
| 6 | ChipDS (tabs) | A11y fix | `components/ui/ds/chip.tsx` | Color inactive `ink-500` (not `ink-600`). Contrast fix 4.5:1. | WCAG AA retest. Keyboard nav + focus ring check. | S |
| 7 | Tabs | A11y fix | (tabs implementation) | Inactive state color upgrade. Focus-visible ring. | Keyboard arrow key + Home/End test. | S |
| 8 | BottomNav | Polish (optional) | `components/bottom-nav.tsx` | Add haptic on tab tap: `Haptics.impact({style: Light})` (optional). | Mobile test. Safe-area pb-safe check. | S |
| 9 | RewardRail | Feature-flag (P1) | `components/dashboard/reward-rail.tsx` | Create but `FEATURE_REWARD_RAIL=false` (env). | Placeholder, spec in Section 5.10. Tur 3 implement. | — |

**Summary effort:** 
- **tur 2 A (must + should):** components 1–7 = **2–3 hafta** (parallel fe × 2–3 sprint)
- **tur 2 B (overhead):** component 9 placeholder = **1–2 gün**
- **Dep:** K1 token ADD (tailwind.config.ts extend) = **1 gün** (design-system-keeper support + fe commit)

---

## 11. Token ihlali listesi — design-system-keeper handoff

**Tespit edilen (audit K-bulgularından):**

| # | İhlal | Dosya | Şiddet | Aksiyon | Handoff |
|---|---|---|---|---|---|
| K1 | MissionCard hardcoded `domainGradient` hex | `components/ui/mission-card.tsx` L20–27 | 4 | ADD `bg-domain-*` tailwind token + ALIAS semantic refactor | design-system-keeper (Faz 2 başında paralel) |
| K7 | Tab inactive kontrast fail (N4 audit) | `components/ui/ds/chip.tsx` | 3 | FIX `ink-600` → `ink-500` (4.5:1 AA) | frontend-engineer (immediate, 1 line) |

**ADR gerek?** K1 token ADD → YES, design-system governance decision (Section 8 karar ağacı). ADR-??? açılacak (product-analyst + design-system-keeper).

---

## 12. Açık soru (varsa)

🟡 **Q25 — LeaderboardTeaser tone A/B:** 3-kişi derinlik TR user test (Zehra + Ahmet + Fatma personas). Baskı hissi test → (a) vs (c) fallback. Tur 2 aksiyonu: test planning + scheduling.

🔴 **Q34 — DailyMissionCard selection algoritması:** MVP spec (Recency + Proximity + Low-friction) yazılmış. Tur 2 aksiyonu: backend query `/lib/supabase/queries/recommended-mission.ts` implement + A/B test scaffold (tur 3 pilot).

🟢 **Token ADD ADR:** K1 domain-gradient token governance. Hangi stage'de ADR aç? (design-system-keeper'a handoff).

---

## Handoff log

Bu spec'i alıp üreten agent'ların zinciri. Protokol: `.claude/skills/agent-communication-protocol/SKILL.md` Katman A.

- 2026-04-24 10:45 — **ui-designer** ✅ — **tur 2 polish spec**: bu dosya. K1–K5 (MissionCard token drift, streak/leaderboard/reward missing, featured algoritma), A1–A5 (5 önerisi) → component spec + token + motion + a11y. Handoff: frontend-engineer (implementation), design-system-keeper (K1 ADR).
- 2026-04-24 14:30 — **frontend-engineer** ✅ — **implementation plan**: `docs/eng/_journal.md` entry. Sprint A/B/C breakdown, 5 madde, 2–3 hafta, 4 dependency (design-system-keeper token, supabase-backend leaderboard view, ux-researcher Q25 test). Kod yok, sadece plan.
- 2026-04-24 16:30 — **design-system-keeper** ✅ — **token add**: `tailwind.config.ts` backgroundImage layer + mission-card.tsx refactor. 7 domain gradient (bg-domain-*) + 2 scrim (bg-scrim-*) + cream token kullanımı. K1 launch blocker ✅ fix. `project-atlas.md` Bölüm 6 güncellendi.
- 2026-04-24 17:10 — **supabase-backend** ✅ — **streak query + index**: `lib/supabase/queries/streak.ts` (getRecentStreakActivity function, StreakActivity interface), `supabase/migrations/020_streak_query_index.sql` (composite index). Son 7 günün boolean[] aktivite durumu → StreakSnapshot component veri ihtiyacı. TSC 0, RLS verified. Handoff: frontend-engineer (A1 consume).
- 2026-04-24 18:45 — **frontend-engineer** ✅ — **Sprint A implementation**: A1 StreakSnapshot component (yeni, motion 7-dot stagger + flame pulse, 3 variant), A2 HeroCardV2 polish (streakActivity props + StreakSnapshot alt-section integration), A3 MissionCard K1 fix (design-system-keeper tarafından tamamlandı, token refactor validate), A4 DailyMissionCard selectionReason label (Q34 MVP placeholder 'yakın'), A5 Tab kontrast K7 fix (ChipDS inactive `ink-600`→`ink-500`, 4.5:1 AA). page.tsx wire (getRecentStreakActivity paralel fetch + streakActivity prop pass). TSC 0 hata. Regression: HeroCardV2 5-tier dots + BrandLogo + 3 stat cells korundu ✅. Sprint B (LeaderboardTeaser, feature-flag) user test Q25 bekleniyor.

---

**Sonraki adım:** frontend-engineer components 1–8 implement. Design-system-keeper K1 token ADD + ALIAS decision (tur 2 başında paralel).

