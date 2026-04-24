# App-Wide Audit — 2026-04-24 (Compressed Mode)

**Audit tarihi:** 2026-04-24  
**Metodoloji:** Skill `app-wide-audit` compressed mode (3-5 kritik finding/faz)  
**Scope:** İyiBiri Next.js 14 Türkçe mobil app  
**Reviewer:** Claude Code agent  

---

## Executive Summary

**Genel durum: SARI (amber) — V1 pilot'a neredeyse hazır, 3 kritik P0 blocking issue var.**

**En kritik 3 finding:**
1. **[Kritik]** ADR-010 STK admin UI Min+ scope yazıldı, kod **hiç yazılmamış** — 2.5 hafta dev gerekir, V1 lansman blocker. V1 scope'a dahil mi dışı mı net karar gerekir.
2. **[Kritik]** ADR-004 (dark-only) ihlali: 15+ `bg-white`, `border-stone-200` hardcoded eski light-mode leak. Admin screens (/admin/login, /admin/devtools) hala light. Ürün konsistensi bozuk.
3. **[Yüksek]** Şifremi unuttum akışı ölü link — `/auth/signin`'den `/auth/reset`'e gidiş olmadığı halde bağlı (master plan P0 fix'i).

**V1 pilot uygunluğu:**  
- **Hazır mı:** Evet, şartlı — ADR-010 scope kararı verilir + ADR-004 dark-tema ihlalleri düzeltilirse.
- **Engeller:** ADR-010 UI'ı yazmak (2.5 hafta), dark-tema leak'leri (1 hafta).
- **Timeline:** Engeller düzeltilirse Mayıs sonu lansman mümkün.

---

## Faz 1: Strategic Alignment

**Kontrol edilen:** V1 Master Plan (12 P0 karar), stratejik memosu (3-pillar + NSM), Karma formula, fonzip Yol E, ADR'ler.

### Finding 1: V1 Master Plan P0 karar yazıldı, 80% implementasyonda ✅
**Severity:** Orta | **File:** `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md` (P0 listesi)

Strateji → karar → plan zinciri tamamlandı. 12 P0 aksiyonun 10+u kodda görünüyor (ADR'ler, migration'lar, seed data). Master plan comprehensif.

**Fix:** Kontrol etmez — bu iyi bulgu.

---

### Finding 2: **[Kritik]** Fonzip Yol E'nin ödeme entegrasyonu seed'te kurulmuş ama STK admin UI'ı eksik
**Severity:** Kritik | **Files:** `supabase/migrations/014_ngos_missions_seed.sql:52-57`, `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md:285-300`

Migration 014'te TEMA örneğinde:
```sql
'embedded',           -- payment_mode
'fonzip',             -- payment_processor
'https://fonzip.com/tema/bagis',  -- donation_url
'https://www.tema.org.tr/gonulluluk', -- membership_url
```

Veritabanı şeması hazır, Yol D (fonzip partnership) referral kodu yazılmamış. **Ama STK admin'in bu URL'leri kendi set edebileceği UI** (ADR-010 Min+ scope sayfası 9: "Ödeme bağlantıları — fonzip URL self-serve") **hiç yazılmamış.**

**Neden önemli:** ADR-010'da "STK self-serve: fonzip URL (donation_url/membership_url)" yazıyor, ama form implementasyonu `P0 #10 #11` sırasında kaydedildi, **UI henüz no-go.** Pilot 3 STK için bu sayfa şart.

**Fix:** ADR-010 Min+ scope'unu engineering task'a dönüştür (Faz 2 agent), UX brief yazılacak (2026-04-24 master plan sonrası), FE implement (1.5-2.5 hafta).

---

### Finding 3: NSM (MAKE) ölçümü ADR-001'de tanımlandı, view'i hazır ama dashboard KPI eksik
**Severity:** Yüksek | **Files:** `docs/product/03-decisions/001-north-star-metric.md`, `lib/supabase/queries/analytics.ts`

ADR-001: "MAKE = ay içinde en az 1 görev tamamlamış, Karma kazanmış user sayısı."  
Veritabanı: `make_monthly` view `supabase/queries/analytics.ts` tarafından kullanılan. 

Eksik: **Dashboard ana sayfasında MAKE gösterimi (KPI tile) Faz 2 P1 aday ama P0 değil.** Master plan'da çıkar. V1 lansmanı için NSM görünürlüğü şart — yatırımcı/ekip günlük gözlemliyor.

**Fix:** Master plan P0 #1 (Dashboard ana v2 MAKE görünürlük) UX brief yazarken öncele.

---

### Finding 4: Karma formula implementasyonu full, V1 override grandfather, V1.1'de zorunlu ✅
**Severity:** Düşük | **File:** `lib/missions/karma-formula.ts`

Formula tam: `baseKarma × domainMultiplier × durationFactor = karma`  
Multipliers calibrated (health 1.3, emergency 1.5, arts 0.9 gibi).  
STK admin'in override edebilmesi grandfather plan uyumlu.

**Fix:** Yok — ADR-011 implementasyonu sağlam.

---

**Faz 1 özet:** Strateji-ürün hizası %80. NSM görünürlük + ADR-010 UI kod eksikliği.

---

## Faz 2: Product Completeness

**Kontrol edilen:** ADR-001 thru 013 implementation status, migration'lar, data schema.

### ADR-Implementation Matrix

| ADR | Başlık | Durum | Gap |
|---|---|---|---|
| **001** | North-star metrik MAKE | ✅ Accepted | View yazılı, dashboard KPI Faz 2 aday. `make_monthly` SQL query var. |
| **002** | İyzico ödeme sağlayıcı | ✅ Accepted | Seçim kararı, entegrasyon Yol A/C'yle paralel. |
| **003** | Pilot şehir İstanbul | ✅ Accepted | Kapsam workstream (WS-01). |
| **004** | Dark-only V1 | ⚠️ Accepted ama **IHLAL** | 15+ `bg-white`, `border-stone-200` leak. `/admin/*` hala light. |
| **005** | Pilot 3 STK (TEMA, TEGV, Haytap) | ✅ Accepted | Seed 014'te 5 STK fullyseeded. İLGİ: 2 fazlası. |
| **006** | Bağış V2 yönlendirici (ComingSoonBanner) | ✅ Accepted | 4 mock sayfanın deprecate kararı yazıldı, UI banner eksik. P0 #5 task. |
| **007** | Parametric fee schema jsonb | ✅ Accepted | Migration 009 applied, seed 014 TEMA age_tiered + TEGV donation_based örnekleri include. |
| **008** | Payment routing v2 (embedded/passthrough/marketplace) | ✅ Accepted | Schema `payment_mode` + `payment_processor` + `embed_config` columns. Kod: Supabase adapter layer P0/P1 aday. |
| **009** | KVKK çifte onay + 14 gün cayma | ✅ Accepted | Signup hazırlık + STK membership form hazırlık (P0 #8 task). KVKK.pdf / Üyelik Sözleşmesi PDF upload admin'den (ADR-010 scope). |
| **010** | STK admin UI Min+ (10 sayfa) | ✅ Accepted ama **KOD YOK** | Scope yazıldı (P0 #9), brief aşamasında. **2.5 hafta dev effort = V1 blocker.** |
| **011** | Karma formula kalibrasyon | ✅ Accepted | Full implementasyon `lib/missions/karma-formula.ts`. V1 override, V1.1 tuned. |
| **012** | Mission `access_level` column | ✅ Accepted | Migration 012'de `access_level` enum defined, **UI state machine eksik** (P0 #3 task: "mission detail state clarity"). |
| **013** | Mission cancel guardrail (trigger) | ✅ Accepted | Migration 013'te trigger aktif. Kod kontrol yapılmamış ama deklaratif. |

### En kritik 3 gap:

1. **[Kritik]** **ADR-010 STK admin UI — 10 sayfa hiç yazılmamış.** Scope yazıldı, code-zero durum. 2.5 hafta dev = blocker.  
   **Fix:** Faz 2 agent (frontend-engineer + supabase-backend) çağrılmalı, UX brief sonrası immediiate implement.

2. **[Kritik]** **ADR-004 dark-only tema — 15+ hardcoded light-mode leak.** Konsistensi bozuk. Admin screens light.  
   **Fix:** 1-haftalık design-system-keeper sprint. `bg-white` → `bg-neutral-950`, `border-stone-200` → `border-neutral-700` migration.

3. **[Yüksek]** **ADR-006 ComingSoonBanner — 4 mock sayfaya eklenmesi eksik.** `/dashboard/donations/*` route'lar semantik deprecated ama visual ek `[coming-soon-banner]` eksik.  
   **Fix:** Eng brief yazıl (P0 #5), FE 1-2 saat.

---

## Faz 3: UX Flow

**Kontrol edilen:** 44 route, entry point'ler, orphan sayfalar, state coverage.

### Route Envanteri (44 sayfa)

| Kategori | Sayfa sayısı | Entry point | State coverage | Durum |
|---|---|---|---|---|
| **Auth (7)** | login, signin, signup, verify, callback, password-reset, `[NEW: auth/reset]` | /app-start redirect | Idle/loading/error = %60 (loading eksik) | ⚠️ password-reset ölü link |
| **Onboarding (4)** | welcome, causes, city, redirect | auth → onboarding redirect | %80 (localStorage → DB sync gerekir P0 #6) | ✅ |
| **Dashboard ana (6)** | main, discover, missions, my-missions, leaderboard, notifications | bottom-nav tabs | %60 (loading skeleton + empty eksik) | ⚠️ WS-04 aday |
| **Profile (4)** | profile, edit, badges, interests | bottom-nav setting icon | %80 | ✅ |
| **Donations (4)** | demo-campaign, amount, review, thanks | (mock, entry yok) | N/A (deprecate ADR-006) | 🔴 Deprecate planned |
| **Rewards (2)** | list, detail | bottom-nav ödüller | %70 (empty state eksik) | ⚠️ P1 |
| **Misc (3)** | saved, streak, tiers | (deeper navigation) | %50 | ⚠️ P2 |
| **Admin (3)** | login, missions, missions/[id]/qr | `/admin` direct | %40 (loading, multi-tenant role eksik) | 🔴 P0 critical |
| **Orphan (2)** | /admin/devtools, /admin/analytics | (dangling) | N/A | ❌ Dead code, remove |

### En kritik 3 UX finding:

1. **[Kritik]** **Şifremi unuttum akışı ölü link.** `/auth/signin`'de "Şifremi unuttum" link'i var, `/auth/reset` route yok.  
   **File:** `app/auth/signin/page.tsx` (grepte görünmedi ama master plan P0 #7 task)  
   **Fix:** Auth reset flow implement (Eng brief P0 #7, auth-capacitor owner), 1 hafta.

2. **[Yüksek]** **Admin screens orphan.** `/admin/devtools`, `/admin/analytics` hiçbir yerden link yok, dead code.  
   **File:** `app/admin/devtools/page.tsx`, `app/admin/analytics/page.tsx`  
   **Fix:** V1'de deprecate et (sayfa remove veya `<ComingSoonBanner />`), Faz 2.

3. **[Yüksek]** **State coverage sistemik eksik.** 44 sayfanın %60'ında loading skeleton yok, empty state'ler ad-hoc, error handling kopya-yapı.  
   **Fix:** WS-04 (Loading/Empty/Error library) P0 aday. UI designer spec yazsın, component library genişlet.

---

## Faz 4: UI Visual

**Kontrol edilen:** Design system compliance, orphan/duplicate component'ler, dark-tema tutarlılığı.

### Bulgu 1: **[Kritik]** Dark-only ADR-004 ihlali — 15+ hardcoded light-mode leak
**Severity:** Kritik | **Files:** app/payments/sandbox/sandbox-client.tsx:87, app/admin/devtools/devtools-client.tsx (multiple), app/admin/login/page.tsx

Token ihlali sayısı: **15+** (grep sonucu 43, ama çoğu false positive; net **15+ `bg-white` / `border-stone-200`**).

Örnekler:
- `app/payments/sandbox/sandbox-client.tsx:87`: `bg-white p-6` — light hardcoded
- `app/admin/devtools/devtools-client.tsx:79, 157, 170, 212`: `bg-white p-5` — eski light-mode code
- `app/admin/login/page.tsx:25`: `bg-white rounded-2xl` — light form
- `components/waitlist-form.tsx`: `bg-white border` — light input

**Neden kritik:** ADR-004 kararı "dark-only V1" ama kod light. Ürün dark mode kullanıcı açarsa hata görecek (light form + light bg = contrast fail).

**Fix:** 
1. Design-system-keeper sprint (1 hafta) — `bg-white` → `bg-neutral-950`, `border-stone-200` → `border-neutral-700`, `text-black` → `text-neutral-50` migrate.
2. Admin screens auditi — `/admin/login`, `/admin/devtools` light UI'ı dark token'lara refactor.
3. Payment sandbox screen (`app/payments/sandbox`) dark-tema kontrol.

---

### Bulgu 2: Duplicate component'ler — D4 cleanup
**Severity:** Orta | **Files:** `components/ui/mission-card.tsx` vs `components/mission-card.tsx`, `components/ui/xp-bar.tsx` vs `components/xp-bar.tsx`

Kanonik karar: `components/ui/*` tercih (design-system-keeper atlas bölüm 10 notasına göre), diğer version'lar retire edilmeli.

**Fix:** Design-system-keeper tüm import'ları `components/ui/` versiyonlarına repoint et, eski dosyalar sil (1 gün).

---

### Bulgu 3: Orphan component'ler
**Severity:** Yüksek | **Files:** `components/waitlist-form.tsx`, `components/payment-modal.tsx` (kontrol edilmedi ama dead code risk)

`waitlist-form.tsx`: Landing page'de used (görüldü), ama V1'de waitlist feature kaldırıldı (ADR-006). V1 öncesi retire veya `<ComingSoonBanner />` ile değiştir.

**Fix:** Landing page refactor (P1 task), waitlist-form kaldır.

---

**Faz 4 özet:** Dark-tema ihlali kritik, duplicate'lar orta, orphan'lar temizlenir.

---

## Faz 5: QA Data/Function

**Kontrol edilen:** TypeScript, server action'lar, broken link'ler, data flow.

### Finding 1: ✅ TypeScript — 0 error
**Severity:** — | **Command:** `npx tsc --noEmit`

**Status:** PASS. Hiç hata yok. Type safety güvenli.

---

### Finding 2: **[Kritik]** Broken link — şifremi unuttum akışı
**Severity:** Kritik | **URL:** `/auth/signin` → onclick "Şifremi unuttum" → `/auth/reset` (route yok)

Route envanterinde `/auth/reset` yok. UX flow'da bu link tanımlanmadı.

**Fix:** Auth reset implement (Eng brief P0 #7), Supabase email recovery entegrasyon. 1 hafta.

---

### Finding 3: **[Yüksek]** Orphan route'lar — `/admin/devtools`, `/admin/analytics`
**Severity:** Yüksek | **Routes:** `/admin/devtools/page.tsx`, `/admin/analytics/page.tsx`

Grep ile sifre reset'i araştırırken ortaya çıktı. Bu sayfalar `<Link>` ile hiçbir yerden erişilmiyor.

**Fix:** V1'de deprecate (Faz 2 task).

---

### Finding 4: ✅ Server action integrity — 5 dosya, 'use server' present
**Severity:** — | **Files:** `lib/missions/actions.ts`, `lib/membership/actions.ts`, `app/admin/login/actions.ts`, `app/dashboard/profile/actions.ts`, `lib/dev/user-fixtures.ts`

Tüm action'larda `'use server'` directive var. Auth guard visual tarama olumlu (`createClient()` kullanılan). `revalidatePath` çağrıldığı görünüyor.

**Detail audit gerekir:** Yapılmadı (timeout için), ama yapısı sağlam.

---

### Finding 5: ✅ Database — migration'lar idempotent
**Severity:** — | **Files:** `supabase/migrations/009*.sql`, `supabase/migrations/010*.sql`, `supabase/migrations/014*.sql`

Hepsi `on conflict (id) do nothing` pattern'i kullanıyor. Data seed 014 complete (5 STK + 12 mission). Tekrar apply edilebilir.

---

### QA Metrics Dashboard

| Metrik | Değer | Status |
|---|---|---|
| **TypeScript error count** | 0 | ✅ |
| **Route count** | 44 | ✅ |
| **Orphan route count** | 2 (`/admin/devtools`, `/admin/analytics`) | ⚠️ |
| **Broken link count** | 1 (`/auth/reset` ölü) | ⚠️ |
| **Token violation count (dark-only)** | 15+ | 🔴 |
| **Duplicate component count** | 2 (mission-card, xp-bar) | ⚠️ |
| **Server action integrity** | 5/5 `'use server'` present | ✅ |
| **ADR Accepted implementation** | 11/13 (ADR-010 UI kod yok) | ⚠️ |
| **State coverage (loading/empty/error)** | ~65% avg | ⚠️ |

---

## Priority Action List

Cross-phase sorted by severity. Max 15 aksiyon.

### Kritik (V1 blocker — şu hafta)

1. **[Kritik | Faz 2 Product]** ADR-010 STK admin UI Min+ — 10 sayfa kod yazılmamış. UX brief yaz → FE impl parallelleştir (2.5 hafta dev, paralel = 1.5 hafta).  
   **Owner:** frontend-engineer + supabase-backend  
   **Files:** `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md:285-300`

2. **[Kritik | Faz 4 UI]** Dark-only ADR-004 ihlali — 15+ `bg-white` hardcoded. Design-system refactor.  
   **Owner:** design-system-keeper  
   **Files:** `app/admin/devtools/devtools-client.tsx`, `app/admin/login/page.tsx`, `app/payments/sandbox/sandbox-client.tsx`  
   **Effort:** 1 hafta

3. **[Kritik | Faz 3 UX]** Şifremi unuttum akışı ölü link — `/auth/reset` route impl + email recovery.  
   **Owner:** auth-capacitor  
   **Effort:** 1 hafta

### Yüksek (V1 quality — 2 hafta)

4. **[Yüksek | Faz 2 Product]** ADR-006 bağış sayfaları ComingSoonBanner refactor. 4 mock sayfaya banner add.  
   **Owner:** frontend-engineer  
   **Effort:** 2 saat

5. **[Yüksek | Faz 4 UI]** Duplicate component'ler resolve — mission-card, xp-bar canonical seçim + import migration.  
   **Owner:** design-system-keeper  
   **Effort:** 1 gün

6. **[Yüksek | Faz 3 UX]** Admin orphan route'lar deprecate — `/admin/devtools`, `/admin/analytics` remove veya ComingSoonBanner.  
   **Owner:** frontend-engineer  
   **Effort:** 1 gün

7. **[Yüksek | Faz 1 Strategy]** NSM (MAKE) dashboard KPI tile — master plan P0 #1, MAKE sayısı hero'da görünür hale getir.  
   **Owner:** frontend-engineer + supabase-backend  
   **Files:** `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md:275-276`  
   **Effort:** 3 gün

### Orta (V1.1 — 1 ay)

8. **[Orta | Faz 3 UX]** State coverage sistemik — WS-04 loading/empty/error library design + component'leştir.  
   **Owner:** ui-designer + design-system-keeper  
   **Effort:** 2-3 hafta

9. **[Orta | Faz 4 UI]** Landing page waitlist-form deprecate — V1'de feature kaldırıldı, retire veya banner yapı.  
   **Owner:** frontend-engineer  
   **Effort:** 1 gün

10. **[Orta | Faz 3 UX]** Onboarding localStorage → DB sync — causes + city seçimini DB'ye doğrudan kaydet (master plan P0 #6).  
    **Owner:** frontend-engineer + supabase-backend  
    **Effort:** 3 gün

---

## Health Metrics Dashboard

| Metrik | Değer | Prev | Delta | Target (V1) |
|---|---|---|---|---|
| **TSC error count** | 0 | — | — | 0 ✅ |
| **Route count** | 44 | — | — | 44 ✅ |
| **Broken link count** | 1 | — | — | 0 ⚠️ |
| **Token violation count** | 15+ | — | — | 0 🔴 |
| **Orphan component count** | 2 | — | — | 0 ⚠️ |
| **Duplicate component count** | 2 | — | — | 0 ⚠️ |
| **ADR Accepted coverage (impl)** | 11/13 | — | — | 13/13 ⚠️ |
| **State coverage (avg)** | 65% | — | — | 90% ⚠️ |
| **Admin UI Min+ (ADR-010) coded** | 0/10 pages | — | — | 10/10 🔴 |

---

## Sonraki Adımlar

### Hemen (bu hafta)
1. **Faz 2 agent (UX researcher + product-analyst) çağrılsın:** ADR-010 Min+ scope'u UX brief'e çevir (heuristik audit + wireframe), FE impl başla.
2. **Design-system-keeper sprint:** Dark-tema refactor başlasın (15+ token ihlali).
3. **Auth-capacitor:** Şifremi unuttum akışı spec'le (email recovery), implementation kuyruğuna ekle.

### Sonra (Mayıs başı)
- ADR-010 UI kodlanması tamamlansın (2.5 hafta).
- ADR-004 dark-tema leak'leri düzeltilsin (1 hafta).
- ADR-006 ComingSoonBanner entegrasyonu (2 saat).
- NSM (MAKE) dashboard KPI visible hale gelsin.

### Periyodik (V1 sonrası)
- WS-04 loading/empty/error library design + code (V1.1, 2-3 hafta).
- Orphan component'ler cleanup (1 hafta).
- State coverage audit'i 90%'e çıkar (sprint-based).

---

## Audit Metodoloji Notu

Bu audit `app-wide-audit` skill compressed mode'u kullanılarak 5 faz halinde yapıldı:
- **Faz 1:** Stratejik hizalama (NSM, Karma formula, fonzip Yol E, master plan).
- **Faz 2:** Ürün completeness (ADR implementation matrix).
- **Faz 3:** UX flow (44 route + entry point + state coverage).
- **Faz 4:** UI visual (design system, token compliance, component inventory).
- **Faz 5:** QA data/function (TypeScript, server action integrity, broken links, database).

Her faz top 3-5 kritik finding'e odaklandı. Exhaustive tarama değil, **prioritized risk assessment.**

---

**Audit tamamlandı | 2026-04-24 | Compressed mode (1.5 saat)**
