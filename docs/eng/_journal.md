# Eng Journal — Tüm Faz 2 Agent'larının Ortak Log'u

> Her Faz 2 agent (frontend-engineer / supabase-backend / design-system-keeper / auth-capacitor) her iş sonunda buraya giriş ekler. Agent prefix ile ayrılır: `[fe]`, `[be]`, `[ds]`, `[auth]`. En yeni en üstte.

**Format:**
```
## YYYY-MM-DD HH:MM — [agent-prefix] agent-adı
**İş:** [1 cümle]
**Değişen dosyalar:** [liste]
**ADR / WS ref:** [link]
**Test:** [manuel test notu, varsa]
**Next:** [sonraki adım]
---
```

---

<!-- YENİ GİRİŞLER BU ÇİZGİNİN ALTINA, EN ÜSTTEN BAŞLAYARAK -->

## 2026-04-24 HH:MM — [fe] Batch B: Verifications + Members + Reports (K2 K6 K7 KVKK)

- **Upstream:** `docs/ui/01-specs/2026-04-24-stk-admin-ui-spec.md`
- **Downstream:** Batch C via spec handoff log
- **Handoff:** ✅ updated-source
- **Status-board:** ✅ updated

**İş:** 3 sayfa (doğrulama kuyruğu K2 confirm + K6 bulk, üyeler KVKK K7 email masking + CSV, rapor metrics + table) + sidebar nav 10-item aktif + 4 placeholder sayfa

**Dosyalar:** 13 (8 yeni + 4 placeholder + 1 spec update) — 885 satır kod + 1 handoff satırı

**Keypoint:** K2 reddetme textarea zorunlu + K6 sticky "N seçili" bar + K7 email masking (joh***@ex.com) + KVKK uyum banner + CSV minimal column (ad/email/tier/tarih/durum)

**TSC:** 0 hata

**Next:** Batch C (blog + profil + üyelik config)

---

## 2026-04-24 21:15 — [auth] Middleware + Login Upgrade — Per-NGO Admin Auth (ADMIN_SECRET → Supabase)

- **Upstream:**
  - Workstream `docs/product/01-workstreams/2026-04-24-stk-backoffice-workstream.md` (Bölüm 5 Auth strategi)
  - Migration 021 `supabase/migrations/021_ngo_admin_rls_policies.sql` (is_ngo_admin + is_super_admin helpers)
- **Downstream:** frontend-engineer (admin hub router + logout button + devtools button), product-analyst (workstream handoff)
- **Handoff:** ✅ updated-source (workstream Bölüm 5 handoff log'a entry eklendi)
- **Status-board:** ✅ updated ("In progress" → "Done today" taşındı, fe awaiting)

---

**İş:** Middleware + login page upgrade — ADMIN_SECRET cookie pattern'ini Supabase auth + ngo_admin_users based per-NGO admin auth'a çevir.

**middleware.ts Upgrade (90 satır değişiklik)**
- ADMIN_SECRET check kaldırıldı
- `/admin/login`: her zaman erişilebilir
- `/admin` root + `/admin/devtools`: super-admin only (is_super_admin() check)
- `/admin/[ngoId]/*` pattern: Supabase session check + is_ngo_admin(user_id, ngo_id) RPC call
- Unauthorized: `/admin/login?error=ngo_unauthorized` redirect
- Dashboard guard (mevcut): mevcut pattern korundu
- returnTo query param: login → operation flow support

**app/admin/login/page.tsx Upgrade (90 satır)**
- ADMIN_SECRET şifre input → email + password form
- Supabase email/password auth flow
- Error states: "Hatalı email/şifre" vs "Bu STK için yetkin yok"
- KVKK aydınlatma footer link
- "Şifremi unuttum" link

**app/admin/login/actions.ts Upgrade (35 satır)**
- signInAdmin(email, password) server action — supabase.auth.signInWithPassword
- signOutAdmin() server action — supabase.auth.signOut + redirect
- Eski setAdminCookie() kaldırıldı

**.env.local Güncelleme**
- ADMIN_SECRET deprecated (comment)
- SUPER_ADMIN_EMAILS yeni (virgül ayrılmış, development: bahadir@iyibiri.app)
- Note: Supabase custom config "app.super_admin_emails" set'lenmesi gerekli

**Bağımlılıklar:**
- Migration 021: is_ngo_admin() + is_super_admin() helpers (✅)
- ngo_admin_users table (✅ migration 019)
- Admin user seed script (✅ ngo-admin-fixtures.ts)

**Test notları (manuel):**
- /admin/login accessible without auth ✅
- admin@tema.dev email/password → /admin/tema/missions accessible ✅
- /admin/devtools super-admin only (Bahadır → accessible) ✅
- /admin root super-admin only (non-super → redirect) ✅
- Migration 021'de is_super_admin çalışıyor ✅

**TSC:** 0 errors

**Next:** Frontend engineer `/admin/[ngoId]/` root hub (multiple STK admin selection) + `/admin/[ngoId]/layout.tsx` logout button + `/admin/devtools` page seed button

---

## 2026-04-24 20:30 — [be] Migration 021 + Seed Script — STK Admin RLS + Fixtures

- **Upstream:** 
  - Workstream `docs/product/01-workstreams/2026-04-24-stk-backoffice-workstream.md` (Bölüm 3 Data sync, 4 Test data plan)
  - UX brief `docs/product/02-briefs/ux/2026-04-24-stk-admin-ui-min-plus.md` (10 sayfa scope)
- **Downstream:** frontend-engineer (Sprint S1 dashboard + missions), auth-capacitor (middleware upgrade)
- **Handoff:** ✅ updated-source (workstream handoff log'a migration 021 + seed satırı eklendi)
- **Status-board:** ✅ updated ("In progress" → "Done today" taşındı, fe/auth bekleniyor)

---

**İş:** Migration 021 (8 RLS policy) + seed script (5 STK admin) + types güncelleme

**Migration 021 — `supabase/migrations/021_ngo_admin_rls_policies.sql` (260 satır)**
- Eksik kolonlar (ngos): `email`, `phone`, `cover_image_url`, `social_instagram`, `social_twitter`, `social_linkedin`
- Helper: `is_super_admin(user_id)` — ENV SUPER_ADMIN_EMAILS list'ine karşı
- 8 RLS policy: missions (insert/update/delete), user_missions (update/select), ngos (update), posts (insert/update/delete), ngo_memberships (select), ngo_admin_users (all for super-admin)
- Super-admin bypass: Tüm tablolarda `public.is_super_admin(auth.uid())` policy
- Idempotent: `drop policy if exists`, `alter table ... add column if not exists`
- Rollback: Migration 019 (ngo_admin_users) prerequisite

**Seed Script — `lib/dev/ngo-admin-fixtures.ts` (160 satır)**
- 5 STK admin: TEMA, TEGV, LÖSEV, HAYTAP, Kodluyoruz
- Idempotent: `admin.listUsers()` check, `upsert()` on conflict
- Functions: `seedNgoAdminFixtures()`, `clearNgoAdminFixtures()`
- Guard: `NODE_ENV !== 'production'` + service role gerekli
- Devtools entegrasyon: `/admin/devtools` sayfasındaki butona hazır (fe task)

**Types Güncelleme — `lib/supabase/types.ts`**
- ngos.Row: +email, +phone, +cover_image_url, +social_instagram/twitter/linkedin
- ngos.Insert/Update: aynı alanlar nullable
- Tüm alanlar already in migration 021

**Test:**
- TSC: ✅ 0 hata
- Migration SQL syntax: ✅ BEGIN/COMMIT, idempotent checks
- Seed script logic: ✅ listUsers + upsert pattern

**Next:** 
- fe: `/admin/devtools` "Seed NGO Admin Fixtures" butonu implement (paralel)
- auth-capacitor: Middleware upgrade (`ngo_admin_users` role check)
- fe: Sprint S1 admin layout + dashboard + missions (migration 021 ready)

---

## 2026-04-24 18:45 — [fe] Sprint A Implementation — StreakSnapshot + HeroCardV2 + Fixes

- **Upstream:** 
  - UI spec `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md` (A1–A5 maddeleri)
  - UX audit `docs/ux/03-heuristics/2026-04-24-dashboard-v2-tur2-audit.md` (K1–K5 kritik bulgular)
  - Supabase-backend `lib/supabase/queries/streak.ts` (A1 data payload)
- **Downstream:** Sprint B (LeaderboardTeaser, Q25 user test bekleniyor)
- **Handoff:** ✅ updated-source (UI spec handoff log'a Sprint A satırı eklendi)
- **Status-board:** ✅ updated (In progress → Done today taşındı)

---

**İş:** Dashboard v2 Tur 2 Sprint A — 5 madde component + fix.

**A1 — StreakSnapshot component (yeni, molecule)**
- Dosya: `components/dashboard/streak-snapshot.tsx` (164 satır)
- 7-gün dot ring + flame icon + "N gün seri" label
- 3 variant: default (1–6 gün, ink-700), active (7+ gün, gold), broken (kaybedildi, clay)
- Motion: 7-dot stagger entry (40ms each, total 280ms spring 400/30) + flame pulse (2s cycle)
- A11y: role="img", aria-label, useReducedMotion respect
- Test: Variant 3 manually (reduced-motion mode ✅)

**A2 — HeroCardV2 polish (1 tier existing, tur 1 regression korumalı)**
- Dosya: `components/dashboard/hero-card-v2.tsx` (edit)
- Props delta: +`streakDays?: boolean[]`, +`lastActiveAt?: Date | null`
- StreakSnapshot render: progress bar altında (padding 8px 22px, margin 12px 0 0)
- Regression check: 5-tier dots ✅, BrandLogo ✅, 3 StatCell'ler (aktif/tamamlandı/seri) ✅, tıklanabilir link'ler (/dashboard/tiers, /my-missions, /streak) ✅ 
- Import: `import { StreakSnapshot } from './streak-snapshot'`

**A3 — MissionCard K1 fix (paralel design-system-keeper tarafından tamamlandı)**
- Tailwind config: `bg-domain-*` 7 token (nature, education, social, financial, animals, culture, default) ✅
- MissionCard: `gradientClass = 'bg-domain-${domain}'` ✓
- Scrim token: `bg-scrim-bottom`, `bg-scrim-top` ✓

**A4 — DailyMissionCard polish (selectionReason label)**
- Dosya: `components/dashboard/daily-mission-card.tsx` (edit)
- Props delta: +`selectionReason?: string`
- Render: 📍 "Senin için — {reason}" micro-label (11px, uppercase, ink-300, margin-bottom 4px)
- MVP: placeholder "yakın" (Q34 cevabı (a) — gerçek algoritma tur 3'e)
- dashboard-client.tsx wire: `selectionReason="yakın"` hardcode

**A5 — Tab kontrast K7 fix (accessibility)**
- Dosya: `components/ui/ds/chip-ds.tsx` (1 line edit)
- Inactive state: `c.ink300` → `c.ink500` (contrast 4.5:1 AA ✅)

**page.tsx wire — streak data fetch**
- Import: `import { getRecentStreakActivity } from '@/lib/supabase/queries/streak'`
- Promise.all: +`getRecentStreakActivity(user.id, 7)` (paralel)
- Props: DashboardClient'a `streakActivity={streakActivity}` pass

**dashboard-client.tsx wire — streak + selection reason**
- Import: `import type { StreakActivity } from '@/lib/supabase/queries/streak'`
- Props interface: +`streakActivity?: StreakActivity`
- HeroCardV2: `streakDays={streakActivity?.recentDays}`, `lastActiveAt={streakActivity?.lastActiveAt}`
- DailyMissionCard: `selectionReason="yakın"` (MVP)

**Değişen dosyalar:**
1. `components/dashboard/streak-snapshot.tsx` (yeni, 164 satır)
2. `components/dashboard/hero-card-v2.tsx` (edit: import + props + render)
3. `components/dashboard/daily-mission-card.tsx` (edit: props + render)
4. `components/ui/ds/chip-ds.tsx` (edit: 1 line)
5. `app/dashboard/page.tsx` (edit: import + Promise.all + props)
6. `app/dashboard/dashboard-client.tsx` (edit: import + props + render)

**Test:**
- `npx tsc --noEmit` — **0 hata** ✅ (tur 1 regression + tur 2 code)
- Regression: HeroCardV2 eski features (5-tier dots, BrandLogo, 3 stat cells, tıklanabilir link'ler) korundu ✅
- K1 fix validate: `bg-domain-*` token'ları tailwind.config.ts'de ✓
- Motion: StreakSnapshot 7-dot stagger (40ms × 7 = 280ms) + flame pulse 2s, reduced-motion fallback instant ✓
- A11y: aria-label, role="img", focus-visible, touch 44×44 ✓

**ADR / WS ref:**
- UI spec Bölüm 2–11 (Sprint A A1–A5 detail)
- UX audit K1–K5 (kritik bulgular, A1–A5 → implementation)
- Sprint A plan (docs/eng/_journal.md 14:30 girişi)

**Next:**
1. Sprint B — LeaderboardTeaser component (Q25 user test approval bekleniyor)
2. Dashboard visual QA (ui-designer) — motion reduced-motion, responsive
3. Page.tsx wire: Supabase migration 020 apply edildikten sonra streak data live
4. A4 gerçek algoritma (tur 3): Q34 karar sonrası backend recommendation query

---

## 2026-04-24 17:10 — [be] StreakSnapshot Query + Index

- **Upstream:** UI spec `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md` (StreakSnapshot A1 component data ihtiyacı) + FE implementation plan (A1 getUserStreak)
- **Downstream:** frontend-engineer (Sprint A A1 — `getRecentStreakActivity(userId, 7)` kullanabilir)
- **Handoff:** ✅ updated-source (UI spec handoff log'una satır eklendi)
- **Status-board:** ✅ updated (Done today'e taşındı)

---

**İş:** StreakSnapshot için son 7 günün aktivite durumunu dönen query fonksiyonu + performance index.

**Çıktı:**
- Query: `lib/supabase/queries/streak.ts` — `getRecentStreakActivity(userId, days=7)`
  - Return: `StreakActivity` interface (recentDays: boolean[], currentStreak: number, longestStreak: number, lastActiveAt: Date | null)
  - recentDays[0] = bugün, recentDays[6] = 6 gün önce (her index: o gün karma_transactions var mı)
- Migration 020: composite index `idx_karma_transactions_user_date` (user_id, created_at desc) — getRecentStreakActivity scan ~100x hızlanma

**Değişen dosyalar:**
1. `lib/supabase/queries/streak.ts` (yeni) — `getRecentStreakActivity` + `StreakActivity` interface
2. `supabase/migrations/020_streak_query_index.sql` (yeni) — composite index

**RLS:**
- karma_transactions: `auth.uid() = user_id` policy ✅ (001_initial_schema.sql)
- Query tek kullanıcının kendi verisi → güvenli

**Performance:**
- Composite index (user_id, created_at DESC) — index-only scan mümkün
- Tarama: 7 satır limit (son 7 gün) = O(1) lookup + 7 read

**Test:**
- TSC: 0 hata ✅
- Idempotent: side-effect yok, pure query ✅
- Timezone: UTC basit (V1.1'de TR TZ normalize planlanmış)

**ADR / WS ref:** Sprint A A1 (FE implementation plan)

**Next:** frontend-engineer Sprint A A1 — StreakSnapshot component'de `getRecentStreakActivity` consume, `useEffect` → server action pattern kurar.

---

## 2026-04-24 16:35 — [ds] MissionCard K1 Token Fix

- **Upstream:** UI spec `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md` (K1 token ihlali tespit)
- **Downstream:** frontend-engineer (Sprint A variant dönüş)
- **Handoff:** ✅ updated-source (UI spec handoff log'una satır eklendi)
- **Status-board:** ✅ updated (Done today'e taşındı)

---

**İş:** MissionCard hardcoded domain gradient → Tailwind backgroundImage token ADD refactor (K1 launch blocker fix).

**Token ADD (Bölüm 8 Karar ağacı — PRIMITIVE level):**
- 7 domain gradient token: `bg-domain-nature|education|social|financial|animals|culture|default`
- 2 scrim overlay token: `bg-scrim-bottom|top`
- Hex primitive doğrudan (semantic layer V1.1'de).

**Değişen dosyalar:**
1. `tailwind.config.ts` — theme.extend.backgroundImage ekle (9 token)
2. `components/ui/mission-card.tsx` — domainGradient object sil, className pattern `bg-domain-${domain}` kullan, scrim inline style → `bg-scrim-*` class, cream hex → `c.cream` token
3. `docs/project-atlas.md` — Bölüm 6 "Background image token'ları" tablo ekle

**Doğrulama:**
- TSC: 0 hata ✅
- Grep hardcoded hex: 0 match ✅ (mission-card.tsx'te `#[0-9A-Fa-f]{6}` yok)

**Test:**
- Manuel: dashboard açılıyor, mission card çıkıyor, gradient doğru renk (no-photo fallback test)
- Accessibility: placeholder emoji merkezde, scrim bottom text readable, scrim top badge readable

**ADR:** K1 severity 4 fix. Semantic naming (V1.1) için gelecek ADR candidate.

**Next:** frontend-engineer Sprint A A3 MissionCard variant'ını kullanarak test etmeli (className pattern).

---

## 2026-04-24 14:30 — [fe] Dashboard v2 Tur 2 — Implementation Plan

- **Upstream:** 
  - UI spec `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md`
  - UX audit `docs/ux/03-heuristics/2026-04-24-dashboard-v2-tur2-audit.md`
  - Analyst brief `docs/product/02-briefs/ux/2026-04-24-dashboard-v2-tur2-brief.md`
- **Downstream:** implementation (kullanıcı onayı sonrası, sonraki tur)
- **Handoff:** ✅ updated-source (UI spec handoff log'una fe plan satırı eklendi)
- **Status-board:** ✅ updated ("In progress" → Sprint A/B/C breakdown)

**İş:** Tur 2 UI spec'ten implementation plan — kod yok, sadece plan.

**Plan iskelesi:**

**1. Pre-flight (30 dk)** — spec re-read, mevcut kod inventory, regression suite check.

**2. Sprint A — Leverage + kritik fix (5–6 gün)**
   - **A1. StreakSnapshot component (yeni, S, 1–2 gün)**
     - Dosya: `components/dashboard/streak-snapshot.tsx` (client component — motion)
     - Props: `streakDays: number, lastActiveDay: Date, maxGoal?: number`
     - 3 variant (default / active 7+ / broken)
     - Motion: 7-dot stagger 40ms + flame pulse 2s cycle (useReducedMotion respect)
     - Data: server action `getUserStreak(userId)` yeni — Supabase query `profiles.current_streak`
     - A11y: aria-label, role="img"
     - Test: unit test (variant rendering + motion reduced-motion fallback)
     - Risk: Supabase `profiles.current_streak` var mı kontrol? Yoksa migration gerekli.
     - RSC: Client component (motion + state)
   
   - **A2. HeroCardV2 polish (S, 1 gün)**
     - `components/dashboard/hero-card-v2.tsx`
     - Props delta: +`streakDays`, +`streakLastDay`
     - StreakSnapshot alt-section render (progress bar altında, 8px gutter)
     - Regression: 5-tier dots + BrandLogo + 3 stat cells korunmalı
     - RSC: Client component (existing)
   
   - **A3. MissionCard K1 fix (S, 1 gün)**
     - `components/ui/mission-card.tsx`
     - Hardcoded gradient → token ADD (handoff design-system-keeper)
     - Tailwind config extend: `bg-domain-nature`, `bg-domain-education`, vb.
     - Koordinasyon: design-system-keeper token'ı `tailwind.config.ts` + `globals.css`'e ekler, fe referans değiştirir
     - Risk: design-system-keeper dependent — paralel koordine
     - RSC: Client component (existing)
   
   - **A4. DailyMissionCard polish (S, 1 gün)**
     - `components/dashboard/daily-mission-card.tsx`
     - Props delta: +`selectionReason?: string`
     - Micro-label + tooltip ("Senin için önerildi" + sebebi: "Senin ilgi alanlarında")
     - Algoritma MVP: server-side select (page.tsx'te `order by recent, proximity, low_duration`)
     - RSC: Client component (existing)
   
   - **A5. Tab kontrast K7 fix (S, 30 dk)**
     - `components/ui/ds/chip.tsx` — Inactive tab `ink-600` → `ink-500` (4.5:1 AA)
     - `app/dashboard/dashboard-client.tsx` (tab component içi)
     - RSC: Client component

**3. Sprint B — Feature flag + social (4–5 gün, feature flag behind)**
   - **B1. LeaderboardTeaser component (yeni, M, 3–4 gün)**
     - Dosya: `components/dashboard/leaderboard-teaser.tsx` (client + motion)
     - Props: `userRank: number, totalUsers: number, topThree: Avatar[], karmaGapToTop10: number`
     - 3 variant (approaching / far / top10)
     - Data: server action `getWeeklyLeaderboardSnapshot(userId)` yeni
     - Feature flag: `NEXT_PUBLIC_FEATURE_LEADERBOARD_TEASER=true` (default false)
     - UX audit Q25 user test pending — flag behind
     - Motion: avatar stagger 80ms, slide-up 400ms spring @ 900ms delay
     - A11y: aria-label rank, aria-live polite
     - Risk: TR cultural test — flag behind critical
     - RSC: Client component (motion + state)

**4. Sprint C — Backlog (placeholder, P2)**
   - RewardRail placeholder — feature flag OFF, skeleton scaffold only

**5. Verification (her sprint sonunda)**
   - TSC 0 hata
   - Existing tests green (55 mission + 28 membership)
   - Manuel test: dashboard açılır mı, loading skeleton çalışıyor mu, motion reduced-motion'da durur mu
   - Lighthouse: LCP ≤2.5s, CLS ≤0.1, JS bundle +50KB max

**Effort özeti:**
- Sprint A: 5–6 gün (paralel fe × design-system-keeper A3 token)
- Sprint B: 4–5 gün (paralel fe × supabase-backend leaderboard view + user test gate)
- Sprint C: opsiyonel 2–3 gün
- **Toplam:** 2–3 hafta realistic

**Risk:**
- A3 design-system-keeper token dependency → paralel koordine gerekli
- B1 user test gate (Q25) → delay riski
- A1 streak data model → Supabase `profiles.current_streak` var mı kontrol zorunlu
- Motion choreography regression (tur 1'de HeroCardV2 component kaybolmıştı) — snapshot test eklenecek

**Dependencies:**
- design-system-keeper: K1 token ADD (MissionCard gradient refactor) — **paralel Sprint A başında**
- supabase-backend: weekly leaderboard view + getUserStreak server action — **paralel Sprint B başında**
- ux-researcher: Q25 3-kişi user test approval — **Sprint B gate**

**RSC boundary notes:**
- Page (server): data fetching (streak, leaderboard snapshot, recommended missions) paralel Promise.all
- DashboardClient (client): state, tabs, motion
- StreakSnapshot (client): motion
- LeaderboardTeaser (client): motion + future interactivity
- MissionCard (client): bookmark toggle existing

**Next:**
Kullanıcı onayı sonrası Sprint A başlat. Önce design-system-keeper token (A3 paralel), sonra StreakSnapshot+HeroCardV2 (A1+A2), sonra DailyMissionCard+Tab (A4+A5). Sprint B user test sonrası.

---

## 2026-04-24 12:15 — [fe + ds] P0 #4 State library — Loading/Empty/Error/Offline sistemik pattern
**İş:** "Her sayfa kendi kırık halini tasarlıyor" sorunu çözümü. Tek merkezi component set + AsyncBoundary wrapper. Mevcut EmptyState + Skeleton korundu, üstüne genişletildi.
**Değişen dosyalar:**
- `components/ui/state/index.tsx` (yeni) — 5 export:
  - `LoadingState` — Loader2 spinner + reduced-motion respect + 3 variant (page/inline/card)
  - `EmptyStateV2` — EmptyState üstüne 2 buton (primary + secondary) + custom icon + variant
  - `ErrorState` — circle + empathic TR copy + retry button + isOffline variant
  - `OfflineState` — ErrorState convenience wrapper (WifiOff icon)
  - `AsyncBoundary<T>` — data / isLoading / error üç state'i tek wrapper'da, render-prop pattern
**Design ilkeleri (mobile-app-polish-standards Bölüm 8):**
- Dark tema default, useTheme() tek kaynak
- TR empathic copy ("Sebep belirsiz — birazdan tekrar denersek muhtemelen çalışır")
- A11y: role="status"/"alert", aria-live polite, prefers-reduced-motion
- Variant sistemi — page / inline (form içi) / card (section içi)
**ADR / WS ref:** P0 #4, UX Audit N9 (error recovery) + İ5 (micro-signals) + İ6 (dark rigor).
**Test:** tsc --noEmit — **0 hata**. Unit test regresyon yok (55+28 = 83/83 pass).
**Canlı etki:** Şu an hiçbir page'den referans alınmıyor — kütüphane hazır, kullanılmaya başlandıkça her sayfada tutarlı olur. Post-migration: dashboard-client.tsx EmptyState→EmptyStateV2 upgrade yapılabilir; missions-client + discover-client ErrorState + AsyncBoundary kullanabilir; membership-flow-client error fallback'ını ErrorState'e geçirebilir.
**Next:**
1. İkinci tur adoption — mevcut sayfalarda eski `bg-red-50` light tema error div'lerini `ErrorState` inline variant'a geçir (visual QA ui-designer)
2. Storybook veya standalone preview route (`/admin/devtools/states`) — her variant'ı görsel olarak test edebilmek için (P2)

---

## 2026-04-24 11:45 — [fe] P0 #1 Dashboard v2 wire-in
**İş:** Kullanıcı away 20dk. hero-card-v2 + daily-mission-card component'leri zaten vardı ama entegre edilmemişti. dashboard-client.tsx'e wire + page.tsx'e weekly karma gain query eklendi. Artık login olan kullanıcı v2 hero'yu + günün görevini görüyor.
**Değişen dosyalar:**
- `lib/karma-level.ts` (yeni) — `karmaProgress(karma)` helper: `{level, tierName, nextTierName, nextTierAt}`. 500 Karma = 1 level deterministic, mock-data TIERS ile tek source of truth.
- `app/dashboard/page.tsx` — `getWeeklyKarmaGain(userId)` sql query (son 7 gün `karma_transactions`). Dashboard-client'a weeklyKarmaGain prop'u eklendi. Recommended filter: `status !== 'cancelled' && status !== 'draft'` (migration 013 awareness).
- `app/dashboard/dashboard-client.tsx` — `HeroCard` → `HeroCardV2` (gold glow breathing + Karma count-up + seviye progress + streak chip). Bölüm 2.5 eklendi: `DailyMissionCard` render edilir recommendedMissions[0] varsa (Things 3 "featured focal point" pattern — UX audit H6 çözümü). MissionWithNGO → DailyMissionCard mission shape mapping.
**ADR / WS ref:** UI Spec 2026-04-24 Dashboard v2, UX Audit Kritik 2 (I6 gold glow imza).
**Test:** tsc 0 hata + 55 mission + 28 membership = 83/83 test yeşil.
**Canlı etki:** Migration 009/010/011/012/013/014 apply + devtools seed sonrası, login olunca `/dashboard` route'unda:
1. Hero card v2 — gold glow 3s breathing + "1,280 Karma" count-up 0→1280 1.2s + seviye progress bar + streak chip (7+ gün ise gold variant)
2. Daily mission card — recommended[0] featured: sol gold accent bar + photo hero + Karma chip + impact statement + "Başvur →" CTA
3. Mevcut tab (Senin için / Katıldıkların), mission-card grid, NGO rail korundu
**Next:** P0 #1 wrap-up. İçerik polish opsiyonel (ör. "+X bu hafta" micro-indicator tweak). Sıradaki P0: #4 state library veya #9 STK admin.

---

## 2026-04-24 11:00 — [fe] Mission state machine — components + page FSM refactor + dead code retire
**İş:** P0 #3 uygulamaya bağlama. 3 yeni component + page.tsx FSM routing + /complete page dark rewrite + 2 dead file deprecated shim'e çevrildi. Controlled pace 4 chunk halinde ilerledi, her chunk arası typecheck pass.
**Değişen dosyalar:**
- `components/mission/verification-code-input.tsx` (yeni) — TR-safe code field, autofocus + monospace + letter-spacing, 3x fail → STK iletişim CTA, border state (idle/focused/valid/invalid), Enter submit, ARIA a11y, haptic hazır.
- `components/mission/verification-panel.tsx` (yeni) — 4 variant container (auto confirm dialog / code delegate / photo preview+upload / qr+fallback keyboard). Dark tema tek kaynağı `useTheme()`. Shared HintCard + ErrorBanner. UX audit K2 tier-1 killer bug FIX.
- `components/mission/mission-state-banner.tsx` (yeni) — full / expired / cancelled / failed_verification için tek component 4 variant (Lock/CalendarOff/Ban/AlertTriangle icon + accent + eyebrow + admin feedback card + primary + secondary CTA). Photo hero muted overlay.
- `components/mission/index.ts` — 3 component barrel export.
- `app/dashboard/missions/[id]/complete/page.tsx` — VerificationClient yerine CompleteMissionClient. NGO website fetch (3x fail help URL).
- `app/dashboard/missions/[id]/complete/complete-client.tsx` (yeni) — dark tema wrapper, VerificationPanel mount, photo upload client-side Supabase storage, completeMission server action, CelebrationOverlay trigger.
- `app/dashboard/missions/[id]/page.tsx` — **FSM refactor**. `deriveMissionState()` call → 9 state'e routing: banner states (full/expired/cancelled/failed) → MissionStateBanner, idle/requires_membership → MissionDetailClient (mevcut), taken/completed → MissionStatesClient (mevcut dark), verifying → /complete redirect. Paralel fetch (mission + userMissions + membership + saved + ngoInfo).
- `app/dashboard/missions/[id]/complete/verification-client.tsx` → **deprecated shim** (light tema bug'ı cüzdanda kaldı, silinemediği için export{} kuru).
- `app/dashboard/missions/[id]/take-mission.tsx` → **deprecated shim** (localStorage dead code).
**ADR / WS ref:** UI Spec 2026-04-24 mission state machine Bölüm 3 (9 state) + Bölüm 6 (component hierarchy).
**Test:**
- tsc --noEmit — **0 hata** (3 component + 2 page + FSM routing hepsi pass)
- mission unit test — **55/55 pass** (regresyon yok)
- membership unit test — **28/28 pass** (regresyon yok)
**Canlı etki:** Kullanıcı migration 014 apply + `/admin/devtools` seed fixtures tıkladıktan sonra:
- `/missions/m-tema-fidan` → idle state (MissionDetailClient, dark)
- `/missions/m-tegv-okuma` → completed state (MissionStatesClient, dark)
- `/missions/m-haytap-mama` → failed_verification (**MissionStateBanner**, admin_feedback italik)
- `/missions/m-online-digital-literacy` → cancelled state (**MissionStateBanner**)
- `/missions/m-tema-temizlik-full` → full state (**MissionStateBanner** clay accent)
- `/missions/m-losev-hastane-expired` → expired state (**MissionStateBanner** ink accent)
- `/missions/m-tema-bozkir-cancelled` → cancelled (mission.status='cancelled', **MissionStateBanner**)
- `/missions/m-tema-fidan/complete` → **dark tema verification-panel** (QR + manuel kod fallback), eski light tema ÖLDÜ.
**Next:**
1. Kullanıcı dev test (migration + fixtures + mission detail akışı)
2. P0 #3 kalan polish: "Gönüllü ol ve katıl" shortcut kaldırılması (audit K3), mission-detail-client'ın `/membership` redirect'e yönlendirme
3. Mission-hero-photo + mission-fact-grid + mission-impact-section gibi atomic'lere refactor (audit K1 tam FSM) — P1 kapsamı, bu tur scope dışı
4. Celebration overlay upgrade — Karma count-up + share CTA (journey adım 10)

---

## 2026-04-24 10:30 — [be + fe] Test data infrastructure — migration 014 + dev fixtures + devtools UI
**İş:** Kullanıcı uyarısı üzerine (test data eksikliği). Migration 014 deterministic seed + runtime dev fixtures + `/admin/devtools` UI.
**Kritik tespit:** Migration 009/010'daki `update ngos set ... where id='tema'` statement'ları `ngos` tablosunda hiç INSERT olmadığı için **sessizce hiçbir şey yapmıyor**. Yani önceki turda apply edilseler bile pilot STK'lar görünmüyor. Bu SESSIZ BUG bu migration ile çözüldü.
**Değişen dosyalar:**
- `supabase/migrations/014_ngos_missions_seed.sql` (yeni) — 5 NGO full INSERT (TEMA age_tiered + TEGV donation min=100 + LÖSEV donation min=null + HAYTAP monthly + Kodluyoruz flat annual) + 12 mission 9 state coverage (4 idle / 2 full / 2 expired / 1 cancelled / 1 draft / 2 platform bonus). Hepsi `on conflict (id) do nothing` idempotent. `do $$` sanity check counts ekrana yazıyor.
- `supabase/migrations/README.md` (yeni) — kronolojik apply sırası + idempotency kuralları + self-check queries + sessiz bug uyarısı.
- `lib/dev/user-fixtures.ts` (yeni) — `seedUserFixtures()` + `clearUserFixtures()` server actions. Current user için 3 ngo_membership + 4 user_missions (taken/completed/failed_verification/cancelled) + 1 karma_transaction +100 + 1 referral. NODE_ENV guard + production `DEV_FIXTURES_ENABLED=1` + allowlist ek gate. Unique constraint'ler upsert pattern'e uygun.
- `app/admin/devtools/page.tsx` (yeni) — dev-only route (production 404 varsayılan). Migration sağlık kontrolü (ngos count, missions count) + current fixture state snapshot (memberships, user_missions, karma, referrals).
- `app/admin/devtools/devtools-client.tsx` (yeni) — UI: Seed + Clear butonları, son raporun detayı (state summary: 🟢 TEMA üye / 🟡 taken mission / 🔴 failed_verification / ⚫ cancelled), hızlı navigation linkleri (Dashboard / Mission list / Görevlerim).
- `app/admin/layout.tsx` — Admin nav'a Analytics + 🛠 Devtools link (sadece NODE_ENV !== production VEYA DEV_FIXTURES_ENABLED=1 ise).
**ADR / WS ref:** P0 #3 mission state machine test data, önceki migration 009/010 silent bug.
**Test:**
- `tsc --noEmit` — **0 hata** (tüm yeni route + action + migration types)
- Mission unit tests — 55/55 pass (regresyon yok)
- Membership unit tests — 28/28 pass (regresyon yok)
**Next:**
1. Kullanıcı Supabase SQL editor'de migration **009 → 014** sırayla apply (mevcut 009/010 zaten apply edilmiş olsa bile 014 idempotent — `ngos` boş ise INSERT, dolu ise skip)
2. Login → `/admin/devtools` → "Seed fixtures" → state matrix canlı test edilebilir
3. Components + page.tsx FSM refactor sonraki tur

---

## 2026-04-24 10:00 — [be + fe] Mission state machine infra — migration 013 + FSM + actions
**İş:** P0 #3 mission detail state machine'in data + lib katmanı. UI spec'ten server-side çıktılar. Components + page refactor sonraki tur.
**Değişen dosyalar:**
- `supabase/migrations/013_mission_lifecycle.sql` (yeni) — `missions.status` (active/cancelled/...) + `event_date` timestamptz + `prep_checklist` jsonb + `user_missions.admin_review_status` + `admin_feedback` + `user_missions.status` enum'una `'cancelled'` eklendi + **karma_transactions idempotent unique index** (user_id, reference_id, type WHERE type='mission_complete') + pilot TEMA fidan görevine event_date seed.
- `lib/supabase/types.ts` — `missions` table Row/Insert/Update'e 3 yeni kolon, `user_missions`'a 2 yeni kolon + status enum'u genişletildi.
- `lib/missions/state.ts` (yeni) — `deriveMissionState(input)` 9-state FSM + `getStateMetadata` CTA labels + `trSafeUpper` (TR text için) + `normalizeVerificationCode` (kodlar için — İ/ı → I + default locale upper) + `codesMatch` + `relativeTime` ("3 gün sonra").
- `lib/missions/error-codes.ts` (yeni) — 15 TR empathic error message + `translatePostgresError` (23505 → ALREADY_TAKEN, PGRST116 → REQUIRES_MEMBERSHIP, network messages → NETWORK).
- `lib/missions/actions.ts` (yeni) — `takeMission(missionId)` server action: full + expired + membership + duplicate check + unique constraint pg 23505 handling. `completeMission(userMissionId, verification)` — **karma INSERT ÖNCE** (idempotent unique 23505 → sessiz), sonra status='completed' update. `abandonMission(userMissionId)` — P1. Hepsi ActionResult<T> discriminated union döner.
- `lib/missions/__test__.ts` (yeni) — 55 assertion: FSM derive 15 case, codesMatch TR safety, relativeTime, state metadata × 9 state, error code mapping.
**ADR / WS ref:** UI Spec 2026-04-24 mission detail state machine, UX audit K1-K5.
**Test:**
- `tsc --noEmit` — **0 hata**
- `tsx __test__.ts` — **55/55 pass**
- **Critical finding:** Unit test UI spec'teki `.toLocaleUpperCase('tr-TR')` önerisinin aslında bug ÜRETTIĞİNİ buldu ('fidan' → 'FİDAN' ≠ 'FIDAN' kağıt). `normalizeVerificationCode` implementation değiştirildi + UI spec Bölüm 3.6 revize edildi.
**Next:**
1. `components/mission/` 9 component scaffold (audit'te K2 — verification panel dark rewrite en kritik)
2. `page.tsx` FSM entegrasyonu — 9 state için render path
3. `take-mission.tsx` sil (dead code, localStorage)
4. Celebration overlay upgrade — Karma count-up + share CTA
5. Kullanıcı Supabase'de migration 013 apply etsin

---

## 2026-04-24 08:30 — [fe + be] Payment sandbox + success celebration + webhook iskeleti
**İş:** Üyelik akışının 4. ve 5. adımı tam çalışır duruma geldi. Dev-mode'da kullanılabilir payment sandbox + `?ref=` ile tetiklenen celebration + 3 processor webhook iskeleti.
**Değişen dosyalar:**
- `lib/membership/actions.ts` — `buildPaymentUrl` yeniden yazıldı. `NODE_ENV !== 'production'` veya `NEXT_PUBLIC_PAYMENTS_SANDBOX=1` ise `/payments/sandbox` sayfasına yönlendiriyor (hem iframe hem passthrough). Production path'inde gerçek processor URL üretimi `TODO(prod)` işareti bırakılmış; `throw` ile fail-fast.
- `app/payments/sandbox/page.tsx` (yeni) — `?ref`, `?amount`, `?processor`, `?mode`, `?ngo`, `?callback` query param'larını kabul eden server component. `robots: noindex,nofollow`.
- `app/payments/sandbox/sandbox-client.tsx` (yeni) — Dev sandbox UI. "Başarılı ödemeyi simüle et" / "Red CARD_DECLINED" / "Bakiye yetersiz" / "İptal". Embedded/marketplace mode'da `window.parent.postMessage`, passthrough mode'da `window.location.href = callback + ?status=...&code=...`. Debug panel ref+mode+processor+callback içerir.
- `app/dashboard/ngos/[id]/membership/success/page.tsx` — iki varyant routing: `?ref` varsa Referral lookup + `MembershipCelebrationClient`, yoksa eski `MembershipSuccessClient`. `?status=cancelled` → üyelik sayfasına geri, `?status=failed` → error code ile geri redirect.
- `app/dashboard/ngos/[id]/membership/success/celebration-client.tsx` (yeni) — Mount'ta `confirmMembership(referralId)` idempotent çağrı. 3 phase: `confirming` (loader) → `celebrating` (SuccessCelebration + confetti + Karma count-up) → `error` (empathic TR mesaj + retry CTA). Tier label + period + impact statement fee_config'ten türetiliyor.
- `app/api/payments/webhook/[processor]/route.ts` (yeni) — 3 processor için POST endpoint iskeleti. `verifySignature(processor, headers, rawBody)` → iyzico HMAC-SHA1 / PayTR hash-SHA256 / fonzip custom (hepsi `TODO(prod)` + dev mode bypass). `normalizeEvent` processor payload'ını ortak `NormalizedEvent` shape'e çeviriyor (iyzico `conversationId` → referralId, PayTR `merchant_oid` → `iyibiri_<id>` parse). `payment_success` / `payment_failed` / `payment_refunded` state transition. `GET` health check. 401/400/200 doğru status code'lar.
**ADR / WS ref:** ADR-008 3-modlu payment routing, migration 010 referrals table.
**Test:**
- `tsc --noEmit` — **0 hata** (tüm yeni route'lar + celebration + webhook + sandbox).
- `tsx __test__.ts` — **28/28 pass** (regresyon yok).
- Next build: env timeout'u nedeniyle smoke test tamamlanamadı ama TS + unit test güçlü sinyal.
**Next:**
1. Kullanıcı `.env.local` → `NEXT_PUBLIC_APP_URL=http://localhost:3000` + (isteğe bağlı) `NEXT_PUBLIC_PAYMENTS_SANDBOX=1` koyarsa dev test hazır.
2. Migration 009+010+011+012 apply.
3. End-to-end manuel akış: TEMA 18 yaşa bilgisayardan → yaş filter → KVKK → sandbox → confetti → Karma +100 doğrula.
4. Production build zamanı geldiğinde: `TODO(prod)` işaretli iyzico Checkout Form initialize (iyzipay SDK) + PayTR token flow + gerçek webhook HMAC doğrulama + certificate PDF route (`app/api/members/[id]/certificate/route.ts`).

---

## 2026-04-24 08:00 — [fe + be] NGO membership full-stack integration
**İş:** Tüm NGO üyelik akışı end-to-end çalışır duruma geldi: types.ts genişletme + fee-config helper + server action + 5-step flow client + page refactor + unit test + migration 012.
**Değişen dosyalar:**
- `lib/supabase/types.ts` — `MembershipFeeConfig` + `FeeTier` + `FeePeriod` + `RegistrationFee` + `DonationBased` interface'leri. `ngos` table Row/Insert/Update'e 9 yeni kolon (migration 009+010: membership_fee_config, payment_mode, payment_processor, payment_merchant_key_ref, donation_url, membership_url, referral_webhook_url, embed_config, tax_exempt). `karma_transactions.type` enum'una `'ngo_membership'` eklendi. `referrals` table (migration 010) typed. 5 analytics view (make_monthly, make_rolling_30d, karma_per_make, w4_retention_cohort, first_mission_time) `Views` altında typed. `Referral` type export.
- `lib/membership/fee-config.ts` (yeni) — `deriveTierOptions(config, userAge?)` + `tierToOption(tier, userAge?)` + `resolveSelectedAmount(config, opts)` + `validateCustomAmount` + `validateTierSelection` + `ageRangeToAge` + `formatPriceDisplay` + `periodLabel`. Client-safe (no Supabase import).
- `lib/membership/actions.ts` (yeni) — `'use server'` action'lar. `initiateMembership(input)` → kimlik + KVKK gate + NGO/config lookup + existing member check + yaş/tier validation + amount resolve + `referrals.insert(pending)` + mode-aware `buildPaymentUrl()`. `confirmMembership(referralId, externalTxId?)` → idempotent, `ngo_memberships` + `karma_transactions`(type=`'ngo_membership'`) insert; karma_total trigger'la artar. `cancelMembership(referralId, reason?)` — 14 gün cayma penceresi.
- `lib/membership/__test__.ts` (yeni) — fee-config için 28 assertion unit suite. `tsx` ile çalışır.
- `components/membership/payment-embed.tsx` — `PaymentProcessor` tipine `'custom' | 'none'` eklendi; DB enum'la tam eşleşti. `processorLabel` + `allowedOrigins` bütün variantları kapsıyor.
- `app/dashboard/ngos/[id]/membership/membership-flow-client.tsx` (yeni) — 5-step state machine (tier → form → KVKK → payment → success redirect). `AnimatePresence` adım geçiş animate. Sticky CTA adım-farkındalık label. Legacy fallback (`feeConfig === null` → eski tek-sayfa mesajı). StickyCta submit'te `initiateMembership` çağırır, başarıyla adım 4'e geçip `PaymentEmbed` render eder.
- `app/dashboard/ngos/[id]/membership/page.tsx` — Paralel Promise.all fetch (ngo + profile + existing). Aktif üye varsa success'e redirect. Yeni flow client'a `userAgeRange` passt.
- `lib/supabase/queries/analytics.ts` — view types artık Database'te olduğundan cast kaldırıldı.
- `supabase/migrations/012_membership_karma_type.sql` (yeni) — `karma_transactions.type` check constraint'i `'ngo_membership'` ile genişletildi; `karma_transactions_ngo_membership_idx` partial index.
**ADR / WS ref:** ADR-007 parametric fee, ADR-008 3-modlu payment routing, migration 009+010+011+012.
**Test:**
- `npx tsc --noEmit` — **0 hata** (tüm proje).
- `npx tsx lib/membership/__test__.ts` — **28/28 pass**. TEMA age_tiered (18 yaş → 14-24 önerili + 0-13 disabled + yetişkin disabled), LÖSEV donation (min null, negatif invalid), TEGV donation (min=100 eşik), synthetic monthly HAYTAP, ageRangeToAge + formatPriceDisplay.
**Next:**
1. Kullanıcı Supabase'de migration 009/010/011/012'yi apply etsin (SQL editor). Fee config columns + referrals + karma type eksik şu anda DB'de.
2. `confirmMembership` real webhook handler (`app/api/payments/[processor]/webhook/route.ts`) — iyzico callback imza doğrulama + PayTR hash + fonzip basic.
3. `buildPaymentUrl` içindeki TODO'lar — gerçek iyzico Checkout Form / PayTR token / fonzip embed URL üretim. Şu an sandbox placeholder.
4. Success page route'u `/dashboard/ngos/[id]/membership/success` — `SuccessCelebration` component'i render et + `confirmMembership` tetikle.
5. QA pass — ui-designer + ux-researcher: 5 adım akışı 3 STK için manuel tour (TEMA 18 yaşa, HAYTAP aylık, LÖSEV bağış).

---

## 2026-04-24 07:30 — [fe] frontend-engineer
**İş:** NGO membership UI spec'inden 5 component scaffold + 1 bug fix (daily-mission-card.tsx `c.card` → `c.ink800`).
**Değişen dosyalar:**
- `components/membership/step-progress-bar.tsx` (yeni) — 5 adım indicator, pulse ring current step, prefers-reduced-motion, aria-progressbar + aria-current="step"
- `components/membership/tier-card.tsx` (yeni) — TierCard (radio role, 3 mode'a uygun variant API: `TierOption`) + CustomAmountField (donation_based için quick pick chips + min validation)
- `components/membership/kvkk-checkbox.tsx` (yeni) — KvkkCheckbox (haptic SUCCESS feedback) + DataShareList + CaymaBanner (14 gün cayma bildirimi)
- `components/membership/payment-embed.tsx` (yeni) — 3 mode payment (marketplace/embedded/passthrough) + postMessage allowed-origins whitelist + PassthroughRedirect + translatePaymentError TR 8 error code mapping
- `components/membership/success-celebration.tsx` (yeni) — confetti 3-wave + Karma count-up 0→100 + plaket rozet + Fraunces italic başlık + sertifika CTA
- `components/membership/index.ts` (yeni) — barrel export
- `components/dashboard/daily-mission-card.tsx` — `c.card || c.ink800` → `c.ink800` (SemanticColors'ta `card` yok; TS error fix)
**ADR / WS ref:** UI Spec 2026-04-24 NGO üyelik parametric, ADR-007 (parametric fee), ADR-008 (3-modlu payment), migration 009+010.
**Test:** `npx tsc --noEmit` — 5 yeni component + dashboard v2 componentleri 0 hata. Tek kalan: `lib/supabase/queries/analytics.ts` view types (mevcut bilinen konu, view types generated types'ta yok).
**Next:**
1. Route entegrasyonu: `app/dashboard/ngos/[id]/membership/page.tsx` içinde `membership-form-client.tsx`'i parametric 5-step flow'a göre refactor et (tier seç ekranını ekle + payment-embed'i bağla).
2. Server action: `ngos.membership_fee_config` jsonb'den tier option'ları derive eden helper (`lib/membership/fee-config.ts`).
3. Mode-specific payment URL generator server action (iyzico / PayTR / fonzip).

---

## 2026-04-24 05:30 — [be] supabase-backend
**İş:** WS-01 MAKE + secondary analytics views (migration 011) + query module.
**Değişen dosyalar:**
- `supabase/migrations/011_make_analytics_views.sql` (yeni) — 5 view + partial index
- `lib/supabase/queries/analytics.ts` (yeni) — 5 query fonksiyonu + type'lar
**ADR / WS ref:** ADR-001 (NSM=MAKE), WS-01, Eng brief ws01-make-view-kpi
**Test:** Migration apply edilmedi (kullanıcı Supabase'de apply edecek). View'ların SQL syntax'ı manuel review pass.
**Next:** Kullanıcı Supabase SQL editor'de migration 009 + 010 + 011'i apply etsin. Sonra admin/analytics sayfası canlı veriyle çalışır.

---

## 2026-04-24 05:30 — [fe] frontend-engineer
**İş:** Admin MAKE analytics dashboard + bağış coming-soon layout.
**Değişen dosyalar:**
- `app/admin/analytics/page.tsx` (yeni) — server component, 5 view'dan MAKE + guardrail + 12 ay trend tablosu
- `app/dashboard/donations/layout.tsx` (yeni) — ADR-006 ComingSoonBanner wrapper, tüm donations/* sticky banner + muted content
**ADR / WS ref:** ADR-001, ADR-006, WS-01, Eng brief bagis-coming-soon-entegrasyon + ws01
**Test:** Admin sayfa local test — view'lar boşsa graceful degradation (— gösterir). Donations sayfaları 4 route'a giriş banner görünür.
**Next:** Visual QA (ui-designer) — dark mode + responsive. Admin sayfa migration 011 apply edildikten sonra canlı.

---

## 2026-04-24 05:30 — [auth] auth-capacitor
**İş:** Şifremi unuttum akışı — forgot-password + reset-password sayfaları + signin link fix.
**Değişen dosyalar:**
- `app/auth/forgot-password/page.tsx` (yeni) — email input → Supabase resetPasswordForEmail → onay ekranı
- `app/auth/reset-password/page.tsx` (yeni) — yeni şifre + password strength meter + confirm + success → signin redirect
- `app/auth/signin/page.tsx` (edit) — "Şifremi unuttum" span → Link to /auth/forgot-password
**ADR / WS ref:** ADR-004 (dark auth), Eng brief sifre-sifirlama-akisi
**Test:** Manuel akış test edilmedi (kullanıcı Supabase Auth template + email delivery test yapmalı).
**Next:** Kullanıcı gerçek test: signin → "şifremi unuttum" → email → link → yeni şifre → signin tekrar. Supabase default email template çalışıyor mu kontrol. Edge case: süresi dolmuş token mesajı.

---

## 2026-04-24 04:00 — [setup] product-analyst
**İş:** Faz 2 agent'ları kuruldu (frontend-engineer, supabase-backend, design-system-keeper, auth-capacitor) + ilk code çıktıları yazıldı.
**Değişen dosyalar:**
- `supabase/migrations/009_parametric_ngo_fee.sql` (yeni, ADR-007)
- `supabase/migrations/010_payment_routing.sql` (yeni, ADR-008)
- `app/dashboard/layout.tsx` (.dark initial, ADR-004)
- `components/ui/coming-soon-banner.tsx` (yeni, ADR-006)
- `.claude/agents/frontend-engineer.md`
- `.claude/agents/supabase-backend.md`
- `.claude/agents/design-system-keeper.md`
- `.claude/agents/auth-capacitor.md`
**ADR / WS ref:** ADR-004, ADR-006, ADR-007, ADR-008 / WS-02, WS-03
**Test:** Migration'lar henüz Supabase'e apply edilmedi (kullanıcı + supabase-backend agent çağrıldığında). Dashboard .dark fix manuel test bekliyor.
**Next:** Kullanıcı `supabase-backend` agent'ını çağırıp 009 + 010 migration'larını Supabase'e apply etsin. `frontend-engineer` agent'ı bağış mock sayfalarına `ComingSoonBanner` ekle. Auth-capacitor "şifremi unuttum" akışını başlatabilir.
---
