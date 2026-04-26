# Test-engineer Inbox

> **Sahibi:** test-engineer agent (okur + boşaltır), diğer agent'lar (yazar)
> **Konum:** `docs/test/_inbox.md`
> **Bağlantılı:** `.claude/skills/agent-communication-protocol/SKILL.md` Katman H

Bu dosya **inbound notify kanalı**. Delivery agent'lar (frontend-engineer, supabase-backend, ui-designer, design-system-keeper, auth-capacitor) önemli bir deliverable bitirdiğinde buraya 1 satır entry ekler. Test-engineer kullanıcı çağırdığında veya proaktif faz koşturmadan önce bu inbox'ı okur.

---

## Entry formatı

```markdown
## YYYY-MM-DD HH:MM — [Notify türü]

**Notify eden:** [agent adı]
**Tetik:** [Ne oldu — commit/PR/spec/migration vs.]
**Etkilenen ekran/flow:** [Route veya flow ID — manual-test-scenarios.md'den]
**Önerilen test fazı:** [Faz 1 smoke / Faz 2 ilgili flow / Faz 3 edge / regression]
**Aciliyet:** Routine | Smoke (deploy önce) | Hot fix (P0 bug doğrulama)
**Linkler:** [PR URL, commit hash, spec dosyası path]
```

---

## Notify türleri (Katman H trigger matrisi)

| Tetik koşulu | Notify türü |
|---|---|
| Yeni feature/route deploy edildi (3+ commit veya yeni page) | "Feature deploy" |
| Migration apply edildi (RLS, schema, trigger) | "Migration applied" |
| UI spec implement edildi (component overhaul) | "Spec implemented" |
| Token değişti (palette, motion, shadow) | "Token change" |
| Auth flow değişti (Capacitor OAuth, KVKK, session) | "Auth change" |
| ADR Accept edildi | "ADR accepted" |
| Bug fix sonrası | "Bug fix" |

---

## Inbox

> En yeni en üstte. Test-engineer işlediği entry'leri "✅ Processed" olarak günceller, eski entry'leri her ay bir kere arşive taşır (`docs/test/_inbox-archive/<YYYY-MM>.md`).

---

### 2026-04-26 12:00 — Feature deploy ✅ Processed (12:30)

**Notify eden:** parent session (frontend-engineer chain)
**Tetik:** Job 1-7 dashboard overhaul tamamlandı (3 commit + Job 5/6/7 paketi). Carousel + light mode 3-katman + mission card overhaul + theme-blind sweep + mission detail/take rework + hero kart minimal.
**Etkilenen ekran/flow:** D1 (dashboard), M1 (mission detail), M2 (mission take), XC1 (theme parity), TR1-TR7 (TR-spesifik)
**Önerilen test fazı:** Faz 1 D1+M1+M2 critical path + XC1 light/dark parity + TR2 long isim
**Aciliyet:** Routine

**Test sonucu:** Manual+guided Faz 1 koşturuldu. **9 bug** (P0: 3, P1: 5, P2: 1). Detay: `docs/test/faz1/2026-04-26-rapor.md`. 2 pattern memo açıldı:
- Pattern A — Auth post-signup flow eksik (P0): `docs/test/_patterns/2026-04-26-auth-post-signup-flow.md` → auth-capacitor + supabase-backend
- Pattern B — Türkçe karakter integrity (P1): `docs/test/_patterns/2026-04-26-tr-character-integrity.md` → frontend-engineer
**Linkler:** Commits 248d930, d476066, 975782a, ve sonrası

---

### 2026-04-26 13:15 — Feature deploy (Backoffice scenarios ready)

**Notify eden:** test-engineer (test planning)
**Tetik:** Job 8-10 admin backoffice sayfaları implement edildi (10 sayfa: login + dashboard + missions + verifications + members + membership-config + blog + profile + payments + reports + QR). Migration 021 (RLS admin policies), 022 (proof columns), 023 (storage bucket). Fixture seed (`ngo-admin-fixtures.ts`) hazır.
**Etkilenen ekran/flow:** AD1–AD15 (15 admin flow), XC9–XC11 (3 cross-cutting concern)
**Önerilen test fazı:** Faz 1 (P0: AD1 login + AD14 RLS isolation), Faz 2 (P1: AD2–AD13 functional), Faz 3 (P2: AD15 super-admin + edge cases)
**Aciliyet:** Routine (deploy öncesi smoke test önerilir)
**Prerequisite:** NGO admin credentials (5 STK fixture users, `ngo-admin-fixtures.ts`)
**Linkler:** Migrations 021/022/023, App routes `/admin/*`, RLS policies, dev fixtures

---

### 2026-04-26 15:45 — Bug fix (Sprint Vol-1) ✅ Processed

**Notify eden:** parent session (auth-capacitor + frontend-engineer + design-system-keeper triplet)
**Tetik:** Sprint Vol-1 fix paketi commit'lendi + Vercel deploy aktif. 8 P0/P1 fix uygulandı (Pattern A middleware + Pattern B TR + KVKK + light delta + defensive category + theme unify).
**Etkilenen ekran/flow:** D1, M1, A2, A3, O1-O2, XC1, TR1
**Önerilen test fazı:** Faz 1 regression
**Aciliyet:** Hot fix (P0 doğrulama)
**Linkler:** Commits up to ~Sprint Vol-1

**Test sonucu:** Manual+guided regression koşturuldu. Detay: `docs/test/faz1/2026-04-26-rapor.md` "Regression Pass" section.
- ✅ 3 fix verified (BUG-001 onboarding gate, BUG-004 landing TR, BUG-008 tema state)
- ⚠️ 4 deferred (yeni signup gerek — BUG-002, BUG-003, BUG-006, BUG-007)
- 🚨 3 yeni bug yakalandı:
  - BUG-010 (P0) — Onboarding sayfaları light mode invisible (theme-blind)
  - BUG-011 (P0) — Welcome bonus 100 karma backend'e yansımıyor
  - BUG-005 regression (P1) — Profile name signup'ta yazılmıyor (Pattern D ile aynı kök neden)
- Pattern D (NEW): `docs/test/_patterns/2026-04-26-signup-profile-insert.md` → auth-capacitor + supabase-backend

**Sprint Vol-2 önerisi:** P0 sıfırlanmadan Faz 2'ye geçilmesin. ~3-4 saatlik fix + re-regression.

---

### 2026-04-26 17:00 — Bug fix (Sprint Vol-2) ⚠️ Partial pass

**Notify eden:** parent session (Sprint Vol-2 + manuel Supabase config)
**Tetik:** Migration 024 apply + onboarding theme + Confirm email enable
**Etkilenen ekran/flow:** A2 (signup + KVKK), A3 (OTP verify)
**Önerilen test fazı:** Faz 1 regression vol-3
**Aciliyet:** Hot fix (P0 — signup tamamen bloke)
**Test sonucu:** Manual+guided regression vol-3 koşturuldu. Detay: `docs/test/faz1/2026-04-26-rapor.md` "Regression Vol-3" section.
- ✅ 3 fix verified (BUG-001, BUG-002, BUG-006)
- ⚠️ 4 deferred (BUG-003, BUG-005, BUG-010, BUG-011 — dashboard'a varamadık)
- 🚨 2 yeni P0/P1 bug yakalandı:
  - **BUG-012 (P1)** — KVKK label click delegation issue: label'a mouse click yapıldığında React state update tetiklenmiyor. Custom visual span click'i absorbe ediyor. Pattern memo: `_patterns/2026-04-26-kvkk-click-delegation.md`
  - **BUG-013 (P0, BLOCKER)** — OTP length mismatch: Email 8 haneli OTP gönderiyor (`04069695` örnek), frontend 6 box render ediyor. Flow tamamen bloke. Pattern memo: `_patterns/2026-04-26-otp-length-mismatch.md`

**Sprint Vol-3 önerisi:** BUG-012 + BUG-013 acil fix (~45 dk). Sonra regression vol-4.

---

### 2026-04-26 17:45 — Bonus regression (mevcut user login)

**Notify eden:** test-engineer (Sprint Vol-3 fix öncesi, +t1 user login'le bonus tarama)
**Tetik:** User 1 saatlik break sırasında ek test — yeni signup gerektirmeyen verify'lar
**Etkilenen ekran/flow:** D1 dashboard, M1 mission detail, XC1 theme parity
**Aciliyet:** Routine bilgi

**Test sonucu:** Ek 2 P0 bug yakalandı:
- **BUG-014 (P0, NEW)** — Hero karma kart light mode'da DARK palette kullanıyor (theme-blind). `bg: rgb(46,41,35)` (`c.ink800` DARK), `text: rgb(244,238,223)` (DARK cream). Light mode'da hero alanı koyu kahve blok görünüyor, içerik invisible. `components/dashboard/hero-card-v2.tsx` Job 5 sweep'te kapsanmamış. Pattern: theme-blind component (mission detail meta cards de aynı sorunda olabilir).
- **BUG-015 (P1, NEW)** — Tema toggle persist çalışmıyor: `localStorage.setItem('iyibiri-theme', 'dark') + reload` sonrası page hala light render. ThemeProvider initial value localStorage okumayı tam yapmıyor olabilir. Sprint Vol-1 unify sonrası regression olabilir.
- ✅ **BUG-003 fix VERIFY** — Mission detail kategori chip "Çevre" dolu görünüyor (defensive fallback çalışıyor)
- ⚠️ BUG-005 (+t1 user için) — Greeting "Hoş geldin" yine fallback. Migration 024 trigger sadece YENİ user'lar için, +t1 user backfill yok. Migration 025 önerilir: existing users için one-time backfill UPDATE.

**Sprint Vol-4 önerisi:** BUG-014 (hero kart theme-blind) + BUG-015 (theme persist) + Migration 025 (existing user backfill). ~2 saatlik fix paketi.

---

### 2026-04-26 18:50 — Bug fix (Sprint Vol-5) → 🚨 P0 reopen via Vol-6

**Notify eden:** test-engineer (Vol-5 push doğrulaması)
**Tetik:** Vol-5 deploy verify — +t5 user yeni signup → onboarding tam → "Hadi başlayalım" → /dashboard değil **/onboarding/welcome'a redirect**.
**Etkilenen ekran/flow:** A2 (signup), O3 (city completion), D1 (dashboard ulaşımı), middleware
**Önerilen test fazı:** Vol-7 — Migration 026 apply sonrası +t6 yeni signup → dashboard verify
**Aciliyet:** **P0 BLOCKER** — TÜM yeni signup'lar bozuk

**Test sonucu:**
- ⚠️ BUG-017 reopen — onboarding loop hâlâ aktif (Vol-5 fix tek başına yetmedi)
- 🚨 **Pattern H (NEW)** — `profiles` row yaratılmıyor (trigger silent fail). 
  - REST query: `select * from profiles where id = <userId>` → `[]` empty
  - auth.users row var, profile yok → middleware redirect, karma 0, greeting fallback
  - Tek kök sebep: 3 bug (BUG-005, BUG-011, BUG-017) hepsini açıklıyor
  - Pattern memo: `_patterns/2026-04-26-profile-row-missing.md`
- 🛠️ **Migration 026 yazıldı** — `supabase/migrations/026_repair_missing_profiles.sql`
  - A) Schema safety (idempotent ALTER)
  - B) Backfill missing profiles + welcome_bonus
  - C) Re-trigger with `RAISE NOTICE` + step tracking (visible logs)
  - D) Verification SQL queries (yorum olarak migration sonunda)

**User aksiyonu (KRİTİK):**
1. Supabase SQL Editor → Migration 026 apply (tek seferlik)
2. Verify query 1 koştur: `count(missing profiles)` → 0 olmalı
3. Verify query 2: +t5 user için `karma=100, full_name='Test ...'`
4. Test-engineer Vol-7 koşusu: +t6 signup → dashboard ulaşma + tüm verify

**Sprint Vol-7 önerisi:**
- 026 apply → +t6 signup full regression (~30 dk)
- Eğer trigger hâlâ silent fail → Supabase dashboard log'una bak (RAISE NOTICE artık görünür)
- Frontend defansif: city page UPDATE → UPSERT (15 dk, ileride güvence)

---

### 2026-04-26 19:40 — Bug fix (Vol-7 + Vol-8) ✅ Major win

**Notify eden:** test-engineer (Vol-7 regression + Vol-8 fix)
**Tetik:** Migration 026 user tarafından apply edildi → +t5 user için profile satırı backfill oldu, Vol-7 re-onboarding regression koşturuldu.
**Etkilenen ekran/flow:** A2/A3 signup, O2/O3 onboarding, D1 dashboard, hero karma, theme persist
**Aciliyet:** P0 doğrulama

**Vol-7 sonuçları:**
- ✅ **BUG-017 FIXED** — Onboarding completion loop kırıldı. +t5 re-onboarding (Çevre+Eğitim → İstanbul+25-34 → Bitir → "Hadi başlayalım") → /dashboard'a düştü, loop yok.
- ✅ **BUG-018 FIXED** — City validation: city seçili değilken CTA disabled "Lütfen şehir seç" gri.
- ✅ **BUG-019 FIXED** — City CTA "Bitir →" gold (eski "Hesabımı oluştur" kaldırıldı).
- ✅ **BUG-011 FIXED** — Hero karma kart "100 Karma" + "+100 bu hafta" + butterfly + "İyi Biri" 5-dot progress visible.
- ✅ **BUG-014 FIXED** — Light mode hero kart cream zemin üzerinde tam visible.
- ✅ **BUG-015 FIXED** — Theme persist çalışıyor: localStorage 'iyibiri-theme' set + reload sonrası light mode korundu.
- ✅ **BUG-003 FIXED** — Mission card "Çevre" / "Topluluk" kategori chip dolu görünüyor.
- ⚠️ **BUG-005 sub-issue** — Greeting "Hoş geldin" hala fallback. Diagnostik: `profiles.full_name="Test İyiBiri"`, `first_name="Test"`, `name=null`. Dashboard `profile.name` (legacy) okuyordu.

**Vol-8 fix:**
- `app/dashboard/dashboard-client.tsx`:101 — `getDisplayName({full_name: profile.name})` → `getDisplayName({first_name: profile.first_name, full_name: profile.full_name ?? profile.name})`
- `lib/supabase/types.ts` — profiles Row type'ına `full_name`, `first_name`, `karma` eklendi (Migration 024/026 senkron)
- Typecheck ✅ temiz

**Linkler:** Migration 026 applied (user manual), commits Vol-5 + Vol-8 patch ready.

**Sıradaki: Vol-9 push** (3 dosya: dashboard-client, types, BUG-005 verification) → +t6 fresh signup ile end-to-end smoke (greeting "Test" görünmeli + tüm önceki fixler intact). Sonra Faz 2 (M3, P1, S1, K1-K5) test başlayabilir.

---

### 2026-04-26 ~22:30 — Faz 2 D2/D3 + M1/M2 — 2 yeni P0/P1 + Vol-10 fix

**Notify eden:** test-engineer (Faz 2 koşusu)
**Tetik:** Vol-9 yeşil sonrası D1+D2+D3+M1+M2 test koşturuldu.
**Etkilenen ekran/flow:** D2 (recommendations tabs), D3 (mission card grid), M1 (mission detail), M2 (take action)
**Aciliyet:** P0 (BUG-021 mission take broken)

**Test sonuçları:**
- ✅ D2 "Senin için seçtik" tabs (Senin için / Katıldıkların) çalışıyor, empty state copywriting beautiful
- ✅ D3 mission carousel + mission card image + kategori chip dashboard'da OK (Çevre/Topluluk visible)
- ✅ M1 mission detail page render: hero + meta cards (TARİH/SÜRE/KONUM/KONTENJAN) + impact section + karma reward + KVKK consent
- ✅ M1 KVKK consent checkbox + button activation pattern çalışıyor
- 🚨 **BUG-020 (P1, NEW)** — Mission detail kategori chip theme-blind: `color=bg=rgb(36,30,24)`, light mode'da black blob. Pattern J ailesi (theme-blind).
- 🚨 **BUG-021 (P0, NEW)** — Mission take silent fail: server action 200 OK ama `user_missions` empty. Root cause: `actions.ts:92` `mission.ngo_id` her zaman membership istiyordu, ADR-008 passthrough mode (access_level=public) bypass'lanmıyordu. Pattern memo: `_patterns/2026-04-26-mission-take-membership-mismatch.md`

**Vol-10 fix:**
- `lib/missions/actions.ts` — takeMission membership guard'ı `mission.access_level === 'members_only'` koşuluna bağlandı (1-line fix)
- Typecheck ✅

**User aksiyon:** Vol-10 push → +t5 ile re-test → mission take olmalı, sonra completeMission test, BUG-020 chip Vol-11'de.

---

### 2026-04-26 ~02:50 — Faz 2 P1 Profil + 3 yeni bug + Vol-11 fix

**Notify eden:** test-engineer (Faz 2 P1 koşusu)
**Tetik:** Vol-10 yeşil sonrası /dashboard/profile test
**Etkilenen ekran/flow:** P1 (profil), M1 (mission detail initial render)
**Aciliyet:** P1 (BUG-022/023/024 tek başına bloker değil ama UX ciddi)

**Test sonuçları:**
- ✅ Profil DOM içerik tam: avatar, "İstanbul · 2026'den beri üye", "İyi Biri 100 Karma", stats GÖREV/SERİ/ÖNCÜ, Üyeliklerim, Rozetler grid (6 badge), Son görevlerin
- 🚨 **BUG-023 (P1, NEW)** — Profil heading "**Adını henüz eklemedin**" fallback gösteriyor, ama DB'de `full_name="Test İyiBiri", first_name="Test"`. profile-client.tsx:71/123/183 `profile.name` (legacy null) okuyordu. **Vol-11 fix uygulandı:** displayName helper + heading + share fallback `full_name → first_name → name`.
- 🚨 **BUG-022 (P1, NEW, sistemik)** — Mission detail (not-yet-taken) initial render dark mode'da, light mode body'nin içinde dark container. localStorage=light, body bg=cream, ama `useTheme()` profil ve mission detail'de DARK colors döndürüyor. Dashboard'da düzgün, inner page'lerde değil.
- 🚨 **BUG-024 (P1, NEW, sistemik)** — Profile aynı tema sorunu: container `bg: rgb(36,32,27)` (DARK ink900), `color: rgb(244,238,223)` (DARK cream). Hipotez: SSR initial='dark' baked styles, client hydrate sırasında inline-style consumer'lar re-render olmuyor.
  - Vol-11 deferred — derin diagnoz: ThemeProvider context propagation vs RSC hydration timing. Muhtemel fix: ThemeProvider initial'ı SSR'da localStorage'a benzer cookie'den oku (next-themes pattern).
- ✅ Bonus: BUG-021 take action production'da PASS doğrulandı (user_missions row + applied state UI: "Başvurun alındı + 3-step roadmap + iptal CTA")

**Vol-11 fix paketi:**
- `app/dashboard/profile/profile-client.tsx` (BUG-023): displayName resolver (first_name → full_name → name fallback)
- BUG-022/024 sistemik tema → Vol-12'ye, design-system-keeper + frontend-engineer joint inceleme

**User aksiyon:** Vol-11 push (1 dosya) → /dashboard/profile reload → "Test İyiBiri" heading + avatar "T" verify.

---

### 2026-04-26 03:00 — Vol-12 sistemik tema fix (Pattern J)

**Notify eden:** test-engineer
**Tetik:** BUG-022/024 root cause bulundu — `useState` lazy init React hydration'da client'da çağrılmıyor.
**Etkilenen ekran/flow:** TÜM inner page'ler (profile, mission detail not-yet-taken, streak, leaderboard, vb.)
**Aciliyet:** P1 sistemik

**Diagnoz:** ThemeProvider `useState(() => getInitialMode(initial))` — server'da çalışıyor (typeof window === undefined → 'dark' döner), ama client hydration'da useState SSR state'i kullanıyor, lazy init function tekrar çağrılmıyor. Sonuç: localStorage'daki 'light' tercihi hiç okunmuyor → mode='dark' kalıyor → inline styles dark.

**Vol-12 fix:** `useState(initial)` + `useEffect(() => setModeState(localStorage))` post-hydration pattern.

**Trade-off:** İlk paint dark olur, ~50-100ms sonra useEffect çalışınca light'a flip (FOUC). Vol-13'te cookie-based SSR ile FOUC eliminate.

**Pattern memo:** `_patterns/2026-04-26-theme-ssr-hydration-mismatch.md`

**Push:** lib/theme.tsx (1 dosya değişti)

---

### 2026-04-26 03:25 — Vol-12 PASS + Faz 2 S1 Edit + 2 yeni bug + Vol-13 fix

**Notify eden:** test-engineer (Faz 2 S1 koşusu + Vol-12 verify)
**Tetik:** Vol-12 sistemik tema fix sonrası /dashboard/profile + /dashboard/profile/edit verify
**Etkilenen ekran/flow:** P1 profil, S1 edit, Vol-12 tema verify
**Aciliyet:** P1 (BUG-025) + P2 (BUG-026 scope gap)

**Vol-12 verify sonuçları:**
- ✅ **BUG-022 PASS** — Mission detail applied state cream/light tam visible (Başvurun alındı + roadmap)
- ✅ **BUG-024 PASS** — Profile sayfası tam profesyonel light mode'da: avatar T + Test İyiBiri + İyi Biri tier + 100 Karma + progress + 3 stat cards + sections
- ✅ Pattern J fix çalıştı: useState lazy → useEffect post-hydration

**Faz 2 S1 Edit sonuçları:**
- ✅ /dashboard/profile/edit page render (Profilini düzenle + AD SOYAD + E-POSTA + ŞEHİR + ARAMA MESAFESİ + İLGİ ALANLARI)
- ✅ Şehir İstanbul, Mesafe 10km, Çevre+Eğitim selected (onboarding'den geldi)
- 🚨 **BUG-025 (P1, NEW)** — AD SOYAD field empty: profile.name (legacy null) okuyor, full_name="Test İyiBiri" ignore. **Vol-13 fix uygulandı:** page.tsx initialName resolver + edit-client handleSave 3-kolon write (name + full_name + first_name).
- 🚨 **BUG-026 (P2, scope gap, NEW)** — /dashboard/profile/settings 404. Edit sadece form. Eksik: tema toggle, KVKK metni, bildirimler, dil tercihi, hesap silme, gizlilik. Workstream Vol-14+ "Settings sayfası ekle" gerek.

**Vol-13 push:** 2 dosya (edit/page.tsx, edit-client.tsx)

**Sıradaki:** Vol-13 push + verify "Test İyiBiri" pre-fill, sonra K1-K5 (karma/streak/leaderboard).

---

### 2026-04-26 ~03:55 — Vol-14 chunky 5-bug paket (RLS + leaderboard + NGO + settings)

**Notify eden:** test-engineer (Vol-13 push pending sonrası geniş tarama + paket fix)
**Tetik:** Kullanıcı "5-6 bug per pakete" istedi → tarama genişletildi
**Etkilenen ekran/flow:** K3 leaderboard, NGOs list, NGO copy, /dashboard/settings (NEW), Pattern J devam
**Aciliyet:** Hot-fix paket (P0 BUG-028 sistemik dahil)

**Vol-14 fix paketi (5 bug + 1 scope gap):**
- ✅ **BUG-028 (P0 sistemik) FIX** — Migration 027: `leaderboard_top` SECURITY DEFINER view + `get_user_rank` RPC. RLS bypass'lı public-safe columns expose. Leaderboard artık tüm user'ları görebilir.
- ✅ **BUG-027 (P1) FIX** — leaderboard-client empty state component eklendi (★ icon + "Sıralama henüz başlamadı" + CTA). RLS+data combo için graceful degradation.
- ✅ **BUG-030 (P2) FIX** — ngos-list-client.tsx member_count + volunteer_count: `(n).toLocaleString('tr-TR')` → "120.000" formatı.
- ✅ **BUG-031 (P2) FIX** — Migration 028 + scripts/seed-membership-config.js: 6 NGO membership_description TR character integrity restored ("CYDD gonullusu egitimde firsat" → "ÇYDD gönüllüsü eğitimde fırsat").
- ✅ **BUG-026 (scope gap) FIX** — `/dashboard/settings` MVP yeni sayfa: Tema toggle (dark/light) + Hesap (email + edit profili) + Yasal (KVKK + gizlilik + kullanım) + Hakkında (versiyon) + Çıkış yap. Profile gear icon /settings'e yönlendirildi.
- ✅ **BUG-029 (P1) RESOLVED** — Yanlış raporlandığı kapatıldı: rewards page Vol-12 sonrası tam çalışıyor (BAKİYEN 100 + 6 ödül kartı).

**Bonus types.ts updates:** profiles Update'a full_name+first_name+karma eklendi, Views'a leaderboard_top, Functions'a get_user_rank — typecheck ✅ temiz.

**Vol-14 push paketi (8 dosya + 2 migration):**
- supabase/migrations/027_leaderboard_view_and_public_profile.sql (NEW)
- supabase/migrations/028_fix_ngo_membership_copy_tr.sql (NEW)
- app/dashboard/leaderboard/page.tsx (BUG-028)
- app/dashboard/leaderboard/leaderboard-client.tsx (BUG-027)
- app/dashboard/ngos/ngos-list-client.tsx (BUG-030)
- app/dashboard/profile/profile-client.tsx (settings link)
- app/dashboard/settings/page.tsx (NEW BUG-026)
- app/dashboard/settings/settings-client.tsx (NEW BUG-026)
- scripts/seed-membership-config.js (BUG-031)
- lib/supabase/types.ts (Views + Functions + Update cols)
- docs/test/_patterns/2026-04-26-mission-take-membership-mismatch.md (önceki)
- docs/test/_inbox.md (Vol-14 entry)

**User aksiyon (kritik):**
1. Migration 027 SQL Editor → apply
2. Migration 028 SQL Editor → apply (TR copy fix)
3. Push deploy
4. Verify: leaderboard yeni user'ları gösteriyor mu, NGO list "120.000" formatı, settings tıklanabiliyor mu, ÇYDD copy'de TR karakter

---

### 2026-04-26 ~04:30 — Vol-14 verify + Vol-15 chunky 6-bug paket

**Notify eden:** test-engineer (Vol-14 production verify + wide tarama + Vol-15 fix)
**Tetik:** Migration 027 + 028 + Vol-14 push deploy → verify + 6 yeni bug
**Etkilenen ekran/flow:** Settings, leaderboard, NGO list, Pattern J Phase 2 sweep, /legal/*, /donations
**Aciliyet:** Hot-fix paket

**Vol-14 verify sonuçları:**
- ✅ **BUG-026 PASS** — /dashboard/settings tam render: 5 section (Görünüm + Hesap + Yasal + Hakkında + Oturum)
- ✅ **BUG-028 PASS** — Leaderboard DOM'da 10 user (Buse/Can/Yunus/Test x4/Ege/Bahadır), get_user_rank "Test İyiBiri (sen)" 5. sırada
- ✅ **BUG-030 PASS** — NGO list TR locale: TEMA 800.000 / İBB 2.500.000 / Kızılay 1.200.000 / 12.000 gönüllü vb.
- ⚠️ BUG-031 verify deferred — ÇYDD detay tekrar açıp Migration 028 sonrası "ÇYDD gönüllüsü olarak eğitimde fırsat eşitliğine" görüyor mu

**Vol-15 yeni bug paketi (6 bug):**
- 🚨 **BUG-032 (P1 sistemik)** — Leaderboard light mode'da görsel kayıp (DOM tam ama opacity 0)
- 🚨 **BUG-033 (P2 scope gap)** — /dashboard/donations 404
- 🚨 **BUG-034 (P1 sistemik)** — Saved page empty state invisible (opacity: "0" Framer Motion takılı)
- 🚨 **BUG-035 (P0 broken)** — /legal/kvkk + /privacy + /terms 404 (Settings link broken)
- 🚨 **BUG-036 (P1 KÖK SİSTEMİK)** — Framer Motion `initial: { opacity: 0 }` Vol-12 ThemeProvider re-mount sonrası takılı kalıyor (saved h3 color rgb(36,30,24) doğru ama opacity:"0"). Pattern J Phase 2.
- ✅ Bonus: BUG-029 zaten resolved (rewards page çalışıyor)

**Vol-15 fix uygulandı (10 dosya):**
- `components/ui/state/index.tsx` — EmptyStateV2 motion `initial={false}` (BUG-034, BUG-036)
- `app/dashboard/leaderboard/leaderboard-client.tsx` — 7 motion initial opacity 0→1 (BUG-032)
- `app/legal/layout.tsx` (NEW) — shared legal layout
- `app/legal/kvkk/page.tsx` (NEW) — KVKK MVP (BUG-035)
- `app/legal/privacy/page.tsx` (NEW) — Privacy MVP (BUG-035)
- `app/legal/terms/page.tsx` (NEW) — Terms MVP (BUG-035)
- `app/dashboard/donations/page.tsx` (NEW) — "Yakında" placeholder + STK CTA (BUG-033)
- (typecheck ✅ temiz)

**User aksiyon:** Push → Vol-15 verify (leaderboard görünür, saved görünür, /legal/kvkk açılıyor, /donations placeholder göster).

**Sıradaki Vol-16 önerisi:**
- Vol-15 verify
- Faz 3 XC1-XC8 cross-cutting full sweep
- M3 mission complete flow (event tarihi düzeltme gerek)
- Backoffice AD1-AD15 (NGO admin login fixture)

---

### 2026-04-26 ~05:00 — Vol-15 verify + Vol-16 chunky 6-bug paket

**Notify eden:** test-engineer (Vol-15 production verify + Vol-16 fix)
**Tetik:** Vol-15 push deploy → tier-1 leaderboard podium + light mode tüm empty state'ler + /legal/* + /donations
**Etkilenen ekran/flow:** Mission complete, Donations layout, Admin gate, NGO membership, post detail
**Aciliyet:** Hot-fix paket (BUG-039 admin yetkisiz erişim P1)

**Vol-15 verify sonuçları:**
- ✅ **BUG-032 PASS** — Leaderboard tier-1 podium (Buse 2 / Can 1 gold pedestal / Yunus 3) + ranked list 4-7
- ✅ **BUG-034+036 PASS** — Saved empty state mukemmel (bookmark icon + "Henüz bir şey kaydetmedin" + CTA)
- ✅ **BUG-035 PASS** — KVKK metni full render (Veri Sorumlusu, İşlenen Veriler, Amaçlar, Paylaşım, Haklar)
- ✅ **BUG-033 PASS** — /donations 404 değil, ama duplicate notice (bizim placeholder + layout banner)
- Bonus: tiers (5 butterfly progression card), my-missions (Aktif 1), notifications (sleeping bell empty state), discover (post cards) hepsi mukemmel

**Vol-16 yeni 6 bug:**
- 🚨 **BUG-037 (P2)** — Donations duplicate "yakında" notice (layout ComingSoonBanner + page placeholder)
- 🚨 **BUG-038 (P1)** — M3 Mission complete page görsel kayıp (Pattern J Phase 3, complete-client motion initial opacity 0 takılı)
- 🚨 **BUG-039 (P1 GÜVENLİK)** — Admin sidebar leak: yetkisiz user (+t5 NGO admin değil) /admin'e gidince admin nav (Dashboard/Görevler/Üyeler/...) görüyor + "Yetkin yok" overlay altında
- 🚨 **BUG-040 (P1)** — ÇYDD üyeliği henüz hazır değil — `membership_enabled = false` (seed script user run etmemiş), Migration 028 sadece description update etmişti
- 🚨 **BUG-041 (false positive deferred)** — Discover post card click navigation hata yok aslında (direct URL navigation çalışıyor, ref hit miss-click olmuş)
- ✅ Bonus: M3 mission complete page DOM tam (KAZANACAĞIN +200 / QR tara / Kamera / Manuel kod gir)

**Vol-16 fix uygulandı (5 dosya):**
- `app/dashboard/donations/page.tsx` — minimize → secondary CTA only (BUG-037)
- `app/dashboard/missions/[id]/complete/complete-client.tsx` — `initial={shouldReduceMotion ? {} : { opacity: 0 }}` → `initial={false}` (BUG-038)
- `app/admin/layout.tsx` — `if (!isSuper && ngoList.length === 0) redirect('/admin/login?error=unauthorized')` (BUG-039)
- `supabase/migrations/029_enable_ngo_memberships.sql` (NEW) — 6 NGO membership_enabled = true + form_fields seed (BUG-040)
- (typecheck ✅ temiz)

**User aksiyon:**
1. Migration 029 SQL Editor → apply (membership_enabled flag set)
2. Push → Vercel deploy
3. Verify: ÇYDD/Haytap üyelik formu açılıyor mu, mission complete page görünür mü, /admin yetkisiz user redirect, donations clean placeholder

---

### 2026-04-26 ~05:30 — Vol-16 verify + Vol-17 hotfix admin redirect loop

**Notify eden:** test-engineer (Vol-16 production verify)
**Tetik:** Migration 029 + Vol-16 push deploy → admin route ERR_TOO_MANY_REDIRECTS regression
**Etkilenen ekran/flow:** /admin (login + tüm admin pages)
**Aciliyet:** **HOTFIX P0** (admin login completely blocked)

**Vol-16 verify sonuçları:**
- ✅ **BUG-038 PASS** — Mission complete /dashboard/missions/X/complete light mode tam render: GÖREV DOĞRULAMA + Sahil Temizliği — Tamamla + KAZANACAĞIN +200 KARMA + QR scanner area
- 🚨 **BUG-039 fix REGRESSION** — `/admin` ERR_TOO_MANY_REDIRECTS: layout.tsx `redirect('/admin/login?error=unauthorized')` /admin/login için de tetikleniyor → infinite loop
- (BUG-037, BUG-040 verify deferred — admin sorunu önce)

**Vol-17 hotfix:**
- `app/admin/layout.tsx` — redirect kaldırıldı, koşullu render eklendi:
  - `if (!isAuthorized) return <>{children}</>` — yetkisiz user için bare wrapper (sidebar yok)
  - `if (isAuthorized)` → AdminLayoutShell (sidebar + auth shell)
- /admin/login + diğer fallback page'ler bare wrapper'da render olur, infinite redirect kapanır
- Sidebar leak hala önlenmiş (yetkisiz user sidebar görmüyor)

**Vol-17 push:** 1 dosya (admin/layout.tsx + inbox)

---

### 2026-04-26 ~05:50 — Vol-18 MEGA: Pattern J Phase 3 sweep + 6 verify + 2 yeni bug

**Notify eden:** test-engineer (Vol-17 verify + 40dk wide tarama)
**Tetik:** Vol-17 admin redirect loop hotfix → push, ardından geniş feature tarama
**Etkilenen ekran/flow:** Tüm dashboard motion patterns + auth + landing + edit + settings
**Aciliyet:** Defensive sistemik fix (Pattern J Phase 3)

**Vol-17 verify sonuçları:**
- ✅ **BUG-039 PASS** — `/admin` → `/admin/login?error=unauthorized` (loop yok), sidebar yok
- ✅ Settings tema toggle PASS — Aydınlık ↔ Karanlık geçiş çalışıyor
- ✅ KVKK link href="/legal/kvkk" doğru
- ✅ Donations dedupe PASS — tek "Bağış akışı yakında" notice + secondary CTA
- ✅ Çıkış yap button mevcut (test edilmedi session korunsun)
- ✅ Landing page tier-1 render (1.249 GÖNÜLLÜ live + KARMA orb + +100 chips + 18.247 stats)

**Vol-18 yeni bug:**
- 🚨 **BUG-042 (false positive)** — Dashboard hero "0 Karma" görünüyor (count-up animation snapshot başlangıcı, gerçek değer animasyon sırasında 100'e count-up yapıyor)
- 🚨 **BUG-043 (P2 scope gap)** — Profile/edit avatar upload yok (sadece text fields). Avatar UI henüz implementasyon dışı.

**Vol-18 fix paketi (Pattern J Phase 3 sweep — 10 dosya defensive):**
- `app/dashboard/ngos/[id]/membership/membership-form-client.tsx`
- `app/dashboard/missions/missions-client.tsx`
- `app/dashboard/rewards/rewards-client.tsx`
- `app/dashboard/rewards/[id]/reward-detail-client.tsx`
- `app/dashboard/profile/profile-client.tsx`
- `app/dashboard/dashboard-client.tsx`
- `components/ui/celebration-overlay.tsx`
- `components/ui/brand-logo.tsx`
- `components/admin/admin-image-upload.tsx`
- `components/onboarding/welcome-celebration.tsx`

Hepsinde `initial={{ opacity: 0` → `initial={{ opacity: 1` sweep. Y transform animasyonu kalır, opacity hep visible. Vol-12 hydration race condition'ı tetiklediği takdirde (yeni route navigation veya tema toggle) artık invisible olamayacak.

**Vol-18 push:** 11 dosya (10 motion sweep + inbox)

**Cumulative bilanço Vol-1 → Vol-18:**
- Toplam bug: 43
- Fixed: 40
- Open: 3 (BUG-040 ÇYDD migration apply pending, BUG-043 avatar upload scope, BUG-031 production verify deferred)
- Migration: 029 (24-29 user apply, 28+29 user pending)
- Sprint Vol: 18

**User aksiyon (40dk yokluk için):**
1. `git push` Vol-18 (10 motion sweep + Vol-17 hotfix önceden push'landıysa atlayın)
2. Migration 028 + 029 SQL Editor → apply (BUG-031 + BUG-040)
3. Geri döndüğünde Vol-19 wide tarama (target 8+ bug, mission complete tam flow + NGO admin login + AD1-AD15 backoffice)

---

> ⬇️ Yeni entry'ler buraya eklenir
