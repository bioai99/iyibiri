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

> ⬇️ Yeni entry'ler buraya eklenir
