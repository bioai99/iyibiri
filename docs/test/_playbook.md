# İyiBiri Test Playbook — Operasyonel Disiplin

> **Sahibi:** test-engineer agent
> **Son güncelleme:** 2026-04-25
> **Konum:** `docs/test/_playbook.md`
> **Bağlantılı:** `.claude/agents/test-engineer.md`, `docs/test/manual-test-scenarios.md`

Bu dosya test-engineer agent'ının her koşusundan önce okuduğu operasyonel referans. Faz tanımları, environment bilgileri, DB reset prosedürü, output format şablonları burada.

---

## 1. Plan-first protokol

Hiçbir test koşusu plan onayı almadan başlamaz.

### Plan dokümanı şablonu

```markdown
# Test Plan — [Faz adı] — YYYY-MM-DD

## Scope
- Hangi flow'lar dahil (manual-test-scenarios.md numaralarına referansla)
- Hangi user fixture (yeni / karma birikmiş / STK admin)
- Hangi cihaz (iPhone 14 Pro webkit + Pixel 7 chromium)
- Hangi tema (light + dark + ikisi)
- Hangi network (full + slow 3G)

## Out of scope
- Hangi flow'lar bu koşuda değil + sebep
- Hangi edge case'ler skipped + sebep

## Beklenen runtime
- Faz başına maksimum 2 saat. 2 saatten uzun planlar split edilir.

## Çıktılar
- `docs/test/<faz>/<tarih>-rapor.md`
- Bug repository (severity'ye göre)
- Pattern memo'lar (varsa)
- Lighthouse HTML çıktıları
- Screenshot artifact'leri
```

Kullanıcı bu plan'i görür, gereksizleri çıkarır, eksikleri ekler, **explicit "koştur" dedikten sonra** test başlar. Plan onayı yoksa: hiçbir Playwright spec dosyası yazılmaz, hiçbir test koşturulmaz.

---

## 2. Faz tanımları

### Faz 1 — Critical Path (P0)

**Amaç:** Yeni bir kullanıcı uygulamayı ilk açtığından karma kazanana kadar olan ana yolu. Bu kırılırsa hiçbir şey çalışmaz.

**Flow seti:**
1. App start splash → onboarding (welcome → causes → city → age)
2. Auth signup → email verify → first dashboard load
3. Dashboard hero karma kart (empty state) → carousel ilk kart görme
4. Mission detail → "Bu göreve katıl" → applied state
5. Mission complete (QR kod ile veya alternatif method) → karma kazanma → dashboard'da reflect
6. Leaderboard'da göründüğünü doğrulama

**Hedef runtime:** 60-90 dakika
**Cihaz:** iPhone 14 Pro + Pixel 7
**Tema:** Light + Dark
**Network:** Full + 1 kez slow 3G full pass

### Faz 2 — Secondary Flows (P1)

**Amaç:** Critical path dışındaki ana fonksiyonlar.

**Flow seti:**
1. Profil görüntüleme + düzenleme + ilgi alanları
2. Ödül listesi → detay → kullanma → karma düşüş doğrulama
3. NGO profil → "Gönüllü ol" → üyelik form → KVKK onay → ödeme placeholder → success
4. Görev paylaşma (native share API)
5. Bildirim ayarları + push permission flow
6. Saved missions, my missions, tabs
7. Blog post detail
8. Streak history page
9. Tier progression page
10. Search (NGO, mission, generic)

**Hedef runtime:** 90-120 dakika
**Cihaz:** iPhone 14 Pro + Pixel 7
**Tema:** Light + Dark

### Faz 3 — Edge & Polish (P2)

**Amaç:** Long Türkçe metin, network failure, offline PWA, accessibility, eski cached state.

**Flow seti:**
1. Long Türkçe metin (ç/ğ/ş/ı/ö/ü dahil) — title taşma, ellipsis, line clamp
2. `İstanbul.toLowerCase()` Türkçe locale bug'ı — search/filter
3. Uzun isim header taşması (40+ karakter)
4. Network failure — flow ortasında kesinti, recovery, queue
5. Offline PWA — install, add-to-home-screen, offline mission take queue
6. Service worker eski versiyon — cache invalidation prompt
7. Accessibility — keyboard nav full app, screen reader (VoiceOver/TalkBack), focus ring, ARIA
8. Cross-screen consistency — karma 3 ekranda aynı mı, NGO bilgi 2 ekranda aynı mı
9. Reduced motion preference — animation'lar respect ediyor mu
10. Eski cached state — local storage manipülasyonu sonrası uygulama davranışı

**Hedef runtime:** 90-120 dakika
**Cihaz:** iPhone 14 Pro + Pixel 7 + 1 kez Lighthouse mobile audit her ana sayfada

### Faz seçim kuralı

- Yeni feature deploy edildiyse: Faz 1 mandatory (smoke). Pas geçti ise Faz 2 + 3 koşulabilir.
- Kritik bug fix ise: sadece o bug'ın bulunduğu Faz'ın ilgili senaryoları + regression suite.
- Major release öncesi: Faz 1 + 2 + 3 sırayla, her Faz raporu ayrı, her Faz arası bug fix penceresi.

---

## 3. Environment bilgileri

### Production
- **URL:** https://iyibiri.app (veya Vercel preview deploy URL)
- **Test yapma. Sadece smoke test, sadece read-only.**

### Staging / Preview
- **URL:** Vercel preview deploy `https://iyibiri-<branch>-<hash>-bahadir.vercel.app`
- **Faz 1 + 2 burada koşar.**

### Local emulator
- **URL:** `http://localhost:3000`
- **Komut:** `npm run dev` (Next.js dev server)
- **Capacitor iOS:** `npx cap run ios` (Xcode emulator gerekli)
- **Capacitor Android:** `npx cap run android` (Android Studio emulator gerekli)
- **Faz 3 PWA + Capacitor testleri burada koşar.**

### Supabase test instance
- **Project ref:** `<TEST_SUPABASE_PROJECT_REF>` — `.env.test.local` içinde, repo'da değil
- **URL:** `https://<TEST_SUPABASE_PROJECT_REF>.supabase.co`
- **Anon key:** `.env.test.local` `NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST`
- **Service role key (read-only):** `.env.test.local` `SUPABASE_SERVICE_ROLE_KEY_TEST` — sadece test-engineer DB doğrulama için kullanır, production-look-alike data ile dolu

> ⚠️ **Önemli:** Test instance ayrı bir Supabase project'idir. Production project'inde test koşturmazsın. Yoksa: `_playbook.md` Bölüm 8'deki "Setup checklist"i koştur.

### Test user fixture'ları

| Fixture | Email | Şifre | Karma | Rol | Açıklama |
|---------|-------|-------|-------|-----|----------|
| `user-fresh` | `fresh@test.iyibiri.app` | (env var) | 0 | user | Onboarding bitti, hiç görev yok |
| `user-active` | `active@test.iyibiri.app` | (env var) | 480 | user | 3 görev tamamladı, "İyi Biri" tier sınırında |
| `user-power` | `power@test.iyibiri.app` | (env var) | 2400 | user | Streak 14 gün, 3 NGO üyesi, "İyi Yürekli" tier |
| `ngo-admin-tema` | `admin@tema.test.iyibiri.app` | (env var) | — | ngo_admin | TEMA STK admin |
| `super-admin` | `super@test.iyibiri.app` | (env var) | — | super_admin | Genel admin paneli |

Şifreler `.env.test.local` içinde. Repo'ya commit edilmez.

---

## 4. DB reset prosedürü

### Her faz başlamadan önce

```bash
# 1. Test DB'yi reset et
psql $DATABASE_URL_TEST < supabase/migrations/_test/00-truncate-user-data.sql

# 2. Fixture user'ları seed et
psql $DATABASE_URL_TEST < supabase/migrations/_test/01-seed-users.sql

# 3. NGO + mission fixture'larını seed et
psql $DATABASE_URL_TEST < supabase/migrations/_test/02-seed-ngos.sql
psql $DATABASE_URL_TEST < supabase/migrations/_test/03-seed-missions.sql

# 4. Doğrula
psql $DATABASE_URL_TEST -c "SELECT count(*) FROM auth.users WHERE email LIKE '%@test.iyibiri.app';"
# Beklenen: 5
```

> ⚠️ Reset script'leri henüz repo'da yok (TODO: setup checklist Bölüm 8). Var olana kadar test-engineer manuel SQL ile reset yapabilir veya kullanıcıdan reset onayı alır.

### Faz arasında

- Faz 1 sonrası bug fix sonra Faz 1 re-test → DB reset şart (taken mission'lar kalmasın)
- Faz 1 → Faz 2 geçiş → DB reset şart (state sızıntısı sıfır)

### Reset olmadığında ne olur

- "User zaten katılmış" false positive (P0 bug raporu yazarsın, aslında bug yok, sadece eski state)
- Karma sayısı tutmaz, leaderboard yanıltır
- Notification count yanlış

Reset = her zaman birinci adım.

---

## 5. Output format detayları

### Bug raporu zorunlu alanlar

`.claude/agents/test-engineer.md` Bölüm 4'te tanımlı. Her alan dolu olmadan rapor kapatılmaz:

- Severity (P0 | P1 | P2)
- Ekran (route)
- Flow (faz + step)
- Cihaz/Viewport (tek seçilmediyse "Both")
- Tema (Light | Dark | Both)
- Beklenen davranış
- Gerçekleşen davranış
- Repro adımları (numbered)
- Screenshot path'leri (light + dark, sorunluysa her ikisi)
- Console error log
- Supabase state (data integrity bug ise)
- Kök neden hipotezi (en az 1 cümle)
- Önerilen fix
- ADR ihlali (varsa explicit)

### Severity tanımları

| Severity | Tanım | Örnek |
|----------|-------|-------|
| **P0 — Blocker** | Critical path kırık. Deploy bloke. | Login çalışmıyor. Mission take 500 error. Karma DB sync bozuk. |
| **P1 — Serious** | Major flow kırık ama workaround var. Deploy uyarı. | Light mode'da bazı text invisible. NGO üyelik form submit'te hata, retry ile geçiyor. |
| **P2 — Polish** | Cosmetic veya rare edge case. Backlog. | Long Türkçe isim header'da ellipsis, ama hala okunuyor. Lighthouse a11y 94 (95 hedef). |

### Faz raporu konumu

- `docs/test/<faz>/<YYYY-MM-DD>-rapor.md` — Faz raporu
- `docs/test/_artifacts/<faz>/<flow>/<step>.png` — Screenshot
- `docs/test/_artifacts/lighthouse/<page>-<theme>.html` — Lighthouse çıktıları
- `docs/test/_patterns/<YYYY-MM-DD>-<pattern-adı>.md` — Pattern memo
- `docs/test/_journal.md` — Unified journal (4 alan entry)

---

## 6. Pattern detection rehberi

3+ bug aynı kök nedene işaret ediyorsa ayrı bir pattern memo aç. Bu memo frontend-engineer veya supabase-backend agent'a handoff için.

### Pattern memo şablonu

```markdown
# Pattern — [Adı] — YYYY-MM-DD

**Tespit eden:** test-engineer
**Etkilenen bug'lar:** BUG-003, BUG-007, BUG-012, BUG-014, BUG-019
**Severity:** P0 | P1 | P2 (en yüksek bug'a göre)
**Etkilenen ekran sayısı:** N
**Etkilenen kullanıcı segmenti:** Yeni | Aktif | Power | Tüm

## Kök neden
Tek cümle.

## Kanıt
- Bug detayları (her birine kısa referans)
- Ortak özellik (örn. "Hepsi `c.cream` text rengini light mode'da kullanıyor")

## Önerilen sistemik fix
- Component-level mi, util-level mi, pattern-level mi
- Dosya path'leri
- Estimated effort

## Handoff
- frontend-engineer | supabase-backend | design-system-keeper
- Acil mi (P0 ise evet) | Sprint backlog (P1) | Backlog (P2)
```

### Sık görülen pattern örnekleri

- **Theme-blind component** — Hardcoded HSL/HEX text/bg → light mode'da invisible
- **Optimistic UI eksik** — Mutation'da loading + revert pattern yok
- **Idempotency eksik** — Aynı butona 2 kere basınca duplicate insert
- **Locale bug** — `toLowerCase()` Türkçe karakterde yanlış sonuç
- **Safe-area çakışması** — Bottom nav + CTA çakışması
- **Skeleton mismatch** — Loading state ile loaded state arasında farklı bg/text rengi
- **Cross-screen data drift** — Aynı veri 2 ekranda farklı
- **Reduced motion ihlal** — Animation `useReducedMotion` saygısız

---

## 7. Tooling kurulum (ilk kez koşturuluyorsa)

### Playwright

```bash
# 1. Install
npm install -D @playwright/test
npx playwright install chromium webkit

# 2. Config (eğer yoksa)
# playwright.config.ts oluştur (test-engineer kendi yazar)

# 3. Test dizini
mkdir -p tests/e2e/{faz1,faz2,faz3}/specs
mkdir -p tests/fixtures
mkdir -p tests/_artifacts/{faz1,faz2,faz3,lighthouse}
```

Minimum `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false, // sequential to avoid DB state sızıntısı
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'tests/_artifacts/playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.TEST_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'iPhone 14 Pro',
      use: { ...devices['iPhone 14 Pro'] },
    },
    {
      name: 'Pixel 7',
      use: { ...devices['Pixel 7'] },
    },
  ],
})
```

### Lighthouse

```bash
# Global install (sadece bir kez)
npm install -g lighthouse

# Komut
npx lighthouse <url> \
  --output=html \
  --output-path=tests/_artifacts/lighthouse/<page>-<theme>.html \
  --preset=mobile \
  --chrome-flags="--headless"
```

### Auth fixture

```typescript
// tests/fixtures/auth.ts
import { test as base, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL_TEST!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST!

type AuthFixtures = {
  freshUserPage: import('@playwright/test').Page
  activeUserPage: import('@playwright/test').Page
  powerUserPage: import('@playwright/test').Page
}

export const test = base.extend<AuthFixtures>({
  freshUserPage: async ({ page }, use) => {
    await loginAs(page, 'fresh@test.iyibiri.app')
    await use(page)
  },
  activeUserPage: async ({ page }, use) => {
    await loginAs(page, 'active@test.iyibiri.app')
    await use(page)
  },
  powerUserPage: async ({ page }, use) => {
    await loginAs(page, 'power@test.iyibiri.app')
    await use(page)
  },
})

async function loginAs(page: import('@playwright/test').Page, email: string) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
  const password = process.env[`TEST_PASSWORD_${email.split('@')[0].toUpperCase()}`]
  if (!password) throw new Error(`Missing password env for ${email}`)

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

  await page.context().addCookies([
    { name: 'sb-access-token', value: data.session!.access_token, url: process.env.TEST_BASE_URL ?? 'http://localhost:3000' },
    { name: 'sb-refresh-token', value: data.session!.refresh_token, url: process.env.TEST_BASE_URL ?? 'http://localhost:3000' },
  ])
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/dashboard/)
}

export { expect }
```

---

## 8. Setup checklist (ilk kez kullanılıyorsa)

Bu checklist henüz tamamlanmadıysa test-engineer çalışamaz. Önce kullanıcıya bildir, eksikleri seninle setup edelim.

- [ ] Supabase test project oluşturuldu (production'dan ayrı)
- [ ] `.env.test.local` dosyası var (gitignore'da, repo'da değil)
- [ ] Test fixture user'ları (5 adet) test DB'sinde oluşturuldu
- [ ] Test fixture NGO + mission'ları seed edildi
- [ ] DB reset script'leri `supabase/migrations/_test/` altında hazır
- [ ] Playwright kuruldu + config var
- [ ] Lighthouse global install edildi
- [ ] `tests/` klasör yapısı oluşturuldu
- [ ] `tests/fixtures/auth.ts` yazıldı
- [ ] CI'de test job'u var (opsiyonel — Vercel preview deploy + GitHub Actions)

---

## 9. İletişim ritüeli

Her faz koşusu sonunda:

1. **`docs/test/_journal.md`'ye entry ekle:**
   ```markdown
   ## YYYY-MM-DD HH:MM — test-engineer

   **Prompt:** [Kullanıcının istediği faz adı]
   **Input:** Plan onayı YYYY-MM-DD HH:MM, fixture set, viewport matrix.
   **Output:** Faz X raporu (`docs/test/<faz>/<tarih>-rapor.md`), N bug, M pattern memo.
   **Self-assessment:** Plan-first ✓, 6-rubric ✓, DB reset ✓, adversarial ✓, TR-spesifik ✓, Lighthouse ✓, pattern detection ✓.
   **Next:** P0 fix bekleniyor → re-test, sonra Faz X+1.
   ```

2. **`docs/_status-board.md`'ye satır ekle:**
   ```markdown
   ## Done today (YYYY-MM-DD)
   - test-engineer ✅ — Faz 1 critical path tamam, N bug (P0: X, P1: Y, P2: Z), M pattern memo. Detay: `docs/test/faz1/<tarih>-rapor.md`.
   ```

3. **Pattern memo handoff:**
   - Pattern memo varsa → ilgili agent'ı (frontend-engineer / supabase-backend / design-system-keeper) explicit etiketle
   - Coordinator'a "P0 bug pattern: <pattern-adı>" notify (varsa)

---

## 10. Sık sorulan sorular

**S: Plan-first protokolünü atlayabilir miyim?**
H: Hayır. Plan onayı yoksa test koşmazsın. İstisna yok.

**S: DB reset her seferde gerek mi?**
H: Evet. Faz başında + Faz arasında. Re-test öncesinde de.

**S: "Çalışıyor görünüyor" diyebilir miyim?**
H: Hayır. Spesifik ol: "X koşulda çalışıyor, Y koşulda kırılıyor." Veya: "Functional ✓, Data integrity ✓, Light parity ✓, Dark parity ✓, Cross-screen ✓, Edge case ✗ (ı/İ locale)."

**S: Bir Faz'da P0 bulursam Faz'ı durdurmalı mıyım?**
H: Hayır, devam et. P0 raporlanır, log'lanır, ama Faz tamamlanır. Faz raporu sonunda kullanıcı karar verir (block / continue).

**S: Kod yazabilir miyim?**
H: Sadece test spec'leri (`tests/e2e/...`). Production code'a dokunmazsın. Bug fix önerisi metin olarak verirsin, frontend-engineer veya supabase-backend implement eder.

**S: Production DB'ye dokunabilir miyim?**
H: Hayır. Sadece test instance.

---

**Status:** Setup checklist tamamlanmadan kullanılamaz. İlk koşturuluş öncesinde Bölüm 8'i kullanıcıyla beraber işaretle.
