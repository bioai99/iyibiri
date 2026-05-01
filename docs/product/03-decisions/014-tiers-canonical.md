# 014. TIERS canonical — tek source of truth, 5 tier, Set A naming

**Tarih:** 2026-04-26
**Durum:** **Accepted (2026-04-26)** ✅ (system-architect, 2026-04-26)
**Önerici:** system-architect
**Bağlı:** TD-001 ([Tech Debt Ledger](../../eng/_tech-debt.md#td-001-)), [v2 audit SS-001](../../audit/2026-04-26-eng-arch-baseline-audit.md#ss-001-)

## Bağlam

İyiBiri'de **5 seviyeli tier sistemi** kullanıcının karma birikimine göre seviye atlama deneyimini şekillendirir. Atlas Bölüm 6 (design system) bu sistemi kavramsal olarak referans alır ama **canonical kod tanımı yok** — engineer'lar kendi callsite'larında lokal kopya tanımlamış.

v2 audit (2026-04-26) tespit etti:

| Dosya | Tier sayısı | İsim seti | Threshold |
|---|---|---|---|
| `lib/mock-data.ts:191-204` | 6 | İyi Biri / **Oldukça İyi Biri** / Çok İyi Biri / Gerçekten İyi Biri / Çoook İyi Biri / İyiliğin Öncüsü | level-tabanlı 1-2 / 3-4 / 5-7 / 8-10 / 11-15 / 16-99 |
| `lib/karma-level.ts:9` | (uses TIERS) | KARMA_PER_LEVEL = 500 | level n*500 karma |
| `lib/supabase/queries/profiles.ts:28-31` | **4** | İyi Biri / Çok İyi Biri / Gerçekten İyi Biri / İyiliğin Öncüsü | karma 500 / 1500 / 3000 |
| `components/ui/tier-badge.tsx:13-17` | 5 | İyi Biri / Çok İyi Biri / Çoook İyi Biri / Gerçekten İyi Biri / İyiliğin Öncüsü | karma 500 / 2000 / 5000 / 10000 |
| `components/ui/ds/hero-card.tsx:11` | 5 | **İyi Biri / İyi Yürekli / İyilik Elçisi / İyilik Savaşçısı / İyiliğin Işığı** | (?) |
| `components/tier/tier-data.ts:32-104` | 5 | İyi Biri / İyi Yürekli / İyilik Elçisi / İyilik Savaşçısı / İyiliğin Işığı | (?) |
| `components/ui/brand-logo.tsx:18-34` (yorumlar) | 5 | (alternatif set) | — |
| `app/dashboard/profile/profile-client.tsx:33-37` | 5 | İyi Biri / Çok İyi Biri / Çoook İyi Biri / Gerçekten İyi Biri / İyiliğin Öncüsü | (?) |
| `app/page.tsx:388-389` | landing | İyi Biri / Çok İyi Biri | hardcoded |
| `app/onboarding/(user-flow)/welcome/page.tsx:203` | onboarding | Çok İyi Biri | hardcoded |

**3 farklı naming convention × 4 farklı threshold sistemi × 4/5/6 farklı tier sayısı.**

Aynı kullanıcı (örn. 6500 karma) için sistem 3 farklı UI'da 3 farklı tier ismi gösterebiliyor. Brand integrity ihlali, QA testing belirsizliği, analytics tier dağılımı sorgulanabilir.

## Karar (Proposed)

**`lib/tiers.ts` canonical dosyası** İyiBiri tier sisteminin tek source of truth'u olur. **5 tier, Set A naming, karma-tabanlı threshold:**

```ts
// lib/tiers.ts
//
// İyiBiri tier sistemi — TEK SOURCE OF TRUTH.
// Bu dosya dışında tier ismi/eşik hardcoded olamaz; lint rule ile enforce edilir.

export interface Tier {
  id: 1 | 2 | 3 | 4 | 5
  name: string
  emoji: string
  minKarma: number
  maxKarma: number | null  // null = open-ended (üst tier)
  color: string            // atlas Bölüm 6 token referansı
}

export const TIERS: Tier[] = [
  { id: 1, name: 'İyi Biri',           emoji: '🌱', minKarma: 0,     maxKarma: 500,    color: 'tierBronze' },
  { id: 2, name: 'Çok İyi Biri',       emoji: '⭐', minKarma: 500,   maxKarma: 2000,   color: 'tierSilver' },
  { id: 3, name: 'Çoook İyi Biri',     emoji: '🌟', minKarma: 2000,  maxKarma: 5000,   color: 'tierGold' },
  { id: 4, name: 'Gerçekten İyi Biri', emoji: '🏆', minKarma: 5000,  maxKarma: 10000,  color: 'tierPlatinum' },
  { id: 5, name: 'İyiliğin Öncüsü',    emoji: '👑', minKarma: 10000, maxKarma: null,   color: 'tierDiamond' },
]

export function getTierByKarma(karma: number): Tier {
  return TIERS.find(t =>
    karma >= t.minKarma && (t.maxKarma === null || karma < t.maxKarma)
  ) ?? TIERS[0]
}

export function getTierName(level: number): string {
  return TIERS.find(t => t.id === level)?.name ?? 'İyi Biri'
}

export function nextTier(currentTierId: 1 | 2 | 3 | 4 | 5): Tier | null {
  if (currentTierId === 5) return null
  return TIERS[currentTierId] // index = id (since 0-indexed array, currentTierId=1 → TIERS[1] = tier 2)
}

export function karmaToNextTier(karma: number): { current: Tier; next: Tier | null; karmaNeeded: number } {
  const current = getTierByKarma(karma)
  const next = nextTier(current.id)
  const karmaNeeded = next ? next.minKarma - karma : 0
  return { current, next, karmaNeeded }
}
```

### Neden 5 tier (4 ya da 6 değil)?

- **Mevcut çoğunluk:** 8 dosyada 5 tier kullanan 5 dosya, 4 tier kullanan 1 dosya, 6 tier kullanan 1 dosya.
- **`tier-badge.tsx`** zaten 5 tier + threshold 500/2000/5000/10000 — UI'da yaygın.
- **6 tier** mock-data'da "Oldukça İyi Biri" interpolation → çok yumuşak ilerleme, motivasyon eğrisi düzleşir.
- **4 tier** queries/profiles.ts'te karma 500/1500/3000 → ikinci tier çok hızlı, beşinci tier ulaşılamaz hissi.
- **5 tier** Duolingo/Strava benchmark ile uyumlu.

### Neden Set A naming ("Çoook İyi Biri" + "İyiliğin Öncüsü")?

- **Marka tonu:** "sen" dili, sıcak, samimi (atlas Bölüm 1 kimlik). "Çoook İyi Biri" mizahi, hafif espri kabul ile uyumlu — "İyilik Savaşçısı" daha asker tonu, marka ile uyumsuz.
- **Mevcut kullanım:** 5 dosyada Set A, 3 dosyada Set C ("İyi Yürekli/İyilik Elçisi/..."). Set A çoğunluk.
- **`tier-badge.tsx`** zaten Set A — UI'da kullanıcının gördüğü tek doğrulanabilir nokta.

### Neden karma-tabanlı threshold (level-tabanlı değil)?

- **Karma kullanıcı için somut.** "1500 karma'ya 300 var" anlaşılır; "level 4'e karma 1500 var" çift soyutlama.
- **`tier-badge.tsx` zaten karma-tabanlı.** UI seviyesi karma karşılaştırması yapıyor.
- **Level kavramı korunabilir** — `lib/karma-level.ts` `levelFromKarma` ayrı bir UX kavramı, tier'a referans değil.

### Threshold seçimi 500/2000/5000/10000

- **Mevcut tier-badge.tsx** zaten bu eşikleri kullanıyor — engineer'ların görsel üretiminde kullandıkları sistem.
- **Geometrik artış (~3-4x)** motivasyon eğrisi tier ilerledikçe yavaşlar (Duolingo benchmark).
- **`KARMA_PER_LEVEL = 500`** — Tier 1 = level 1, Tier 2 = level 2-4, Tier 3 = level 5-10, Tier 4 = level 11-20, Tier 5 = level 21+. Level kavramı tier'a paralel ama bağımsız kalır.

## Implementation

### Faz 1 — `lib/tiers.ts` yarat ve callsite migration (1 gün, frontend-engineer)

1. **`lib/tiers.ts` yarat** (yukarıdaki kod).
2. **`lib/karma-level.ts`** — `KARMA_PER_LEVEL` kalır; TIERS referansını `lib/tiers.ts`'ten al, mock-data'dan değil.
3. **`lib/mock-data.ts:191-204`** — TIERS array sil; sadece `lib/tiers.ts` referansı.
4. **`lib/supabase/queries/profiles.ts:27-32`** — `getKarmaLevel` fonksiyonu sil; `getTierByKarma` import.
5. **`components/ui/tier-badge.tsx:12-18`** — local `tierConfig` array sil; `TIERS` import.
6. **`components/ui/ds/hero-card.tsx:11`** — `TIER_NAMES` array sil; `TIERS.map(t => t.name)` veya direct import.
7. **`components/tier/tier-data.ts`** — `name` alanlarını `TIERS` referansıyla doldur (extra metadata animation/avatar lokalde kalır).
8. **`components/ui/brand-logo.tsx:18-34`** — yorumları Set A ile güncelle.
9. **`app/dashboard/profile/profile-client.tsx:32-39`** — local TIER_NAMES sil; `TIERS` import.
10. **`app/page.tsx:388-389`** — `TIERS[0].name`, `TIERS[1].name` referans.
11. **`app/onboarding/(user-flow)/welcome/page.tsx:203`** — `TIERS[1].name` template.
12. **TSC pass + manuel UI smoke test (3 sayfa: dashboard, profile, leaderboard).**

### Faz 2 — Lint rule (1 gün, frontend-engineer + system-architect, ADR-015 ile birleşik)

ESLint custom rule paketi (`.eslintrc.json` + custom plugin):
- `no-magic-tier-name` — bu 5 string literal kod-tabanında yasaklı.
- `prefer-tier-import-from-tiers` — tier name kullanımı yalnızca import'tan.

Plus pre-commit hook + CI lint blocking.

### Faz 3 — Test (yarım gün, test-engineer)

- `lib/tiers.test.ts` — `getTierByKarma(0)` → tier 1, `getTierByKarma(500)` → tier 2, `getTierByKarma(99999)` → tier 5.
- Manuel cross-screen test: dashboard hero + profile + tiers + leaderboard tier ismi senkron.
- Pattern memo'da regression suite (test-engineer next phase).

## Sonuçlar

**İyi:**
- Brand integrity restore — kullanıcı her sayfada aynı tier ismi/threshold görür.
- Drift surface kapanır — yeni engineer hardcoded array yazmaya kalkarsa lint engeller.
- QA + analytics belirginleşir — tier dağılımı tek tanım üzerinden ölçülür.
- ADR-008 v3 (payment) gibi gelecek ADR'ler tier'a referans verirken canonical'ı kullanır.

**Kötü:**
- `lib/supabase/queries/profiles.ts:28-31` 4-tier sistemi kaldırılırken hangi level'da kullanıcılar olduğunu kontrol etmek gerekir — sürpriz tier shift olabilir (örn. 4-tier'da "İyiliğin Öncüsü" 3000+ karma'ydı; 5-tier'da 10000+ olur). DB'de retroactive update gerekir mi? **Hayır** — DB'de tier kaydı yok, on-the-fly hesaplanıyor. Ama UI'da kullanıcı gördüğü tier düşebilir; communication ile yönet.
- 8 callsite migration risk yüzeyi — TSC + UI smoke test ile mitigated.
- "İyi Yürekli/İyilik Elçisi/İyiliğin Işığı" naming bazı yerlerde (logo animasyonları, tier ekranları) atmosferik referans olabilir — sadece display naming değişir; animation/avatar metadata `components/tier/tier-data.ts`'te lokal kalabilir.

**Operasyonel:**
- ADR Accepted sonrası 5-dosya checklist (skill `agent-communication-protocol` Bölüm 5):
  1. Bu ADR — `Proposed` → `Accepted` + tarih.
  2. `docs/product/04-questions/open.md` — Q ekleyip resolved.md'ye taşı.
  3. `docs/product/04-questions/resolved.md` — yeni satır.
  4. `docs/product/01-workstreams/...` — TD-001 fix workstream'i.
  5. `docs/_status-board.md` — TD-001 "Backlog" → "In progress".

## Bağlı kararlar

- ADR-011 (Karma formula) — kalibrasyon devam, tier ile ortogonal.
- ADR-015 Proposed (Server action template) — lint rule'lar paralel kurulur.
- ADR-009 (KVKK) — paylaşımlı bir module değişikliği etkilemez.

## Açık sorular

- **Q45 🟡** — `components/tier/tier-data.ts` 5 tier "İyi Yürekli/..." naming animation/avatar metadata için tutulmalı mı? **Önerim:** Display name `TIERS`'ten gelir; animation/avatar metadata local kalır; `name` alanı kullanım dışı veya kaldırılır.
- **Q46 🟡** — `lib/karma-level.ts` `KARMA_PER_LEVEL = 500` ile tier threshold tutarlı mı? **Önerim:** Tutarlı, tier-bazlı vs level-bazlı paralel kavramlar (level her 500 karma, tier 5 grup içinde).
- **Q47 🟢** — UI'da 4-tier → 5-tier geçişte kullanıcılara "tier sistemi güncellendi" iletisi göstermek lazım mı? **Önerim:** Pilot 3 STK küçük cohort olduğu için gerek yok; lansman sonrası release notes.

## Referanslar

- v2 audit: [`docs/audit/2026-04-26-eng-arch-baseline-audit.md`](../../audit/2026-04-26-eng-arch-baseline-audit.md) Bölüm 5 SS-001
- Tech Debt Ledger TD-001: [`docs/eng/_tech-debt.md`](../../eng/_tech-debt.md#td-001-)
- Atlas Bölüm 6 (design system, tier color tokens): [`docs/project-atlas.md`](../../project-atlas.md)
- Pattern memo: `docs/test/_patterns/2026-04-26-ssot-drift.md`

**İlgili sorular:** Q45-47 — Proposed, kullanıcı/coordinator onayı bekliyor.

## Handoff log

- 2026-04-26 19:30 — **system-architect** ⏸ Proposed — `docs/product/03-decisions/014-tiers-canonical.md`. User/coordinator onayı bekleniyor; Accept sonrası frontend-engineer + design-system-keeper Faz 1 implementasyona başlar.
