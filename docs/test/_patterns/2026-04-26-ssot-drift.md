# Pattern: Single Source of Truth Erozyonu

**Tarih:** 2026-04-26
**Tespit eden:** system-architect (v2 baseline audit)
**Severity:** 🔴 (TIERS + color), 🟡 (mission state + karma column + active/status)
**Audit ref:** [`docs/audit/2026-04-26-eng-arch-baseline-audit.md`](../../audit/2026-04-26-eng-arch-baseline-audit.md)

## Etkilenen entry'ler

- TD-001 🔴 — TIERS isim drift (8 dosya, 3 isim seti, 4 threshold)
- TD-002 🔴 — Hardcoded color leak (45 satır, 4 pattern)
- TD-009 🟡 — ESLint custom rule paketi yok
- TD-024 🟡 — Mission state literal hardcoded 30+ noktada
- TD-028 🟡 — `karma` vs `karma_total` dual kolon
- TD-029 🟡 — `active` vs `status` manuel sync

## Kök neden

İyiBiri'de **Single Source of Truth disiplini lint/CI tarafından enforce edilmiyor.** Engineer'lar lokal kopya yapma alışkanlığında — bir component yazıyor, ihtiyacı olan değeri (tier ismi, renk, state literal) yerinde hardcoded olarak tanımlıyor. Sonraki engineer aynı şeyi başka bir component'te tekrar yazıyor; canonical referans yok ya da var ama bilinmiyor.

Bu erozyon **doğrusal değil çığ etkili:**

1. **Faz 0 (1-2 dosya):** İlk drift ekleyen engineer, "geçici, sonra refactor" niyetiyle local copy yazar.
2. **Faz 1 (3-5 dosya):** Yeni engineer arıyor, canonical bulamıyor (lint enforce yok); local copy → yeni varyant.
3. **Faz 2 (6-10 dosya):** Birden fazla varyant rakip oluyor; "hangisi doğru?" sorusu cevaplanmıyor; herkes kendi kopyasını üretiyor.
4. **Faz 3 (10+ dosya):** Catastrophic drift — UI'da kullanıcı her sayfada farklı şey görüyor (TIERS örneği).

İyiBiri şu an **Faz 3'te** — TIERS 8 dosya, color 45 satır.

## Spesifik bulgu detayları

### A. TIERS drift (TD-001)

**8 dosya, 3 farklı isim seti × 4 farklı threshold × 4/5/6 farklı tier sayısı:**

| Dosya | Tier | İsim seti | Threshold |
|---|---|---|---|
| `lib/mock-data.ts:191-204` (canonical claim) | 6 | A+ "Oldukça İyi Biri" | level 1-2/3-4/5-7/... |
| `lib/karma-level.ts:9` | 5 (uses TIERS) | (mock-data) | KARMA_PER_LEVEL=500 |
| `lib/supabase/queries/profiles.ts:28-31` | 4 | A | karma 500/1500/3000 |
| `components/ui/tier-badge.tsx:13-17` | 5 | A | karma 500/2000/5000/10000 |
| `components/ui/ds/hero-card.tsx:11` | 5 | C ("İyi Yürekli/...") | (?) |
| `components/tier/tier-data.ts:32-104` | 5 | C | (?) |
| `components/ui/brand-logo.tsx:18-34` (yorum) | 5 | C | — |
| `app/dashboard/profile/profile-client.tsx:33-37` | 5 | A | (?) |

**Aynı kullanıcı (örn. 6500 karma):**
- `karma-level.ts` → level 14 → mock-data 6'lı tier 5 → "Çoook İyi Biri"
- `queries/profiles.ts` → "İyiliğin Öncüsü" (4-tier farklı eşik)
- `tier-badge.tsx` → tier 4 → "Gerçekten İyi Biri" (5-tier 5000<karma<10000)
- `hero-card.tsx` → "İyilik Savaşçısı" (Set C farklı isim)

**3 farklı UI'da 3 farklı tier ismi.**

### B. Hardcoded color leak (TD-002)

**45 satır, 4 pattern:**

- **Pattern A — `bg-black/50` modal overlay:** 8 dosya. Atlas token'da `c.modalOverlay`/`c.scrim` yok ya da bilinmiyor.
- **Pattern B — Admin tarafı light kalıntısı:** `app/admin/devtools/`, `app/admin/login/`, `app/admin/missions/`. ADR-004 (dark-only V1) kapsamına alınmamış olabilir.
- **Pattern C — Inline SVG `color="#FFFFFF"`:** 3+ dosya. Hex literal yerine CSS variable kullanılmamış.
- **Pattern D — Tailwind palette spam:** `bg-emerald-600`, `bg-amber-600`, `bg-rose-300`, `bg-stone-100/200/500/700/900`. Atlas token (`c.success`, `c.warning`, `c.danger`, `c.ink50`, `c.ink900`) bypass.

**Önceki audit'te 15 leak'ti, bugün 45 — 3x büyüme (regression).**

### C. Mission state literal (TD-024)

30+ noktada `'taken'`, `'completed'`, `'cancelled'`, `'expired'`, `'applied'` enum literal'ları. `lib/missions/state.ts` (8580 byte) **var ama enum export'u yaygın kullanılmıyor.**

### D. `karma` vs `karma_total` (TD-028)

Migration 024 `add column if not exists karma integer` plus original `001_initial_schema.sql` `profiles.karma_total`. **Dual kolon mu, geçici mi?** Trigger hangisini günceller?

### E. `active` vs `status` (TD-029)

`missions.active` boolean ile `missions.status` enum manuel sync (`lib/admin/missions-actions.ts:17-24`). DB tarafında trigger ile otomatize edilmemiş; race condition riski.

## Önerilen sistemik fix

### Faz 1 — Canonical dosyalar yarat (1 sprint)

1. **`lib/tiers.ts`** — TIERS canonical (ADR-014 ile).
2. **`lib/missions/state.ts`** — `MISSION_STATE` enum export (TD-024).
3. **Atlas Bölüm 6 token genişletme** — `c.scrim`, `c.success`, `c.warning`, `c.danger`, `c.tierBronze/Silver/Gold/Platinum/Diamond` (TD-002).
4. **Migration 028** (TD-028) — `karma` vs `karma_total` consolidate.
5. **Migration 029** (TD-029) — `missions` trigger ile `active = (status = 'active')` otomatize.

### Faz 2 — Migration sweep (1-2 sprint)

8 TIERS callsite + 45 color satır + 30+ mission state literal + UI → token migration.

### Faz 3 — Lint rule paketi (TD-009 ile birlikte, 1 hafta)

ESLint custom plugin (`@iyibiri/eslint-plugin`):

```js
// rules/no-hardcoded-color.js
export default {
  meta: { type: 'problem' },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string' && /^(bg|text)-(white|black|stone-\d+|emerald-\d+|amber-\d+|rose-\d+)/.test(node.value)) {
          context.report({ node, message: 'Hardcoded color yasak — atlas token kullan (c.ink50, c.scrim, c.success, ...).' })
        }
        if (typeof node.value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(node.value)) {
          context.report({ node, message: 'Hex color literal yasak — atlas token kullan veya CSS variable.' })
        }
      },
    }
  },
}
```

```js
// rules/no-magic-tier-name.js
const FORBIDDEN = ['İyi Biri', 'Çok İyi Biri', 'Çoook İyi Biri', 'Gerçekten İyi Biri', 'İyiliğin Öncüsü', 'İyi Yürekli', 'İyilik Elçisi', 'İyilik Savaşçısı', 'İyiliğin Işığı', 'Oldukça İyi Biri']

export default {
  meta: { type: 'problem' },
  create(context) {
    if (context.getFilename().endsWith('lib/tiers.ts')) return {} // canonical exempt
    return {
      Literal(node) {
        if (typeof node.value === 'string' && FORBIDDEN.includes(node.value)) {
          context.report({ node, message: `Tier ismi "${node.value}" hardcoded yasak — \`import { TIERS } from '@/lib/tiers'\`.` })
        }
      },
    }
  },
}
```

```js
// rules/prefer-mission-state-enum.js
const FORBIDDEN_LITERALS = ['taken', 'completed', 'cancelled', 'expired', 'applied']

export default {
  meta: { type: 'suggestion' },
  create(context) {
    return {
      'BinaryExpression[operator="==="] Literal': function(node) {
        if (typeof node.value === 'string' && FORBIDDEN_LITERALS.includes(node.value)) {
          context.report({ node, message: `Mission state literal "${node.value}" hardcoded — \`MISSION_STATE.${node.value.toUpperCase()}\` kullan.` })
        }
      },
    }
  },
}
```

### Faz 4 — Pre-commit hook + CI blocking

`.husky/pre-commit` + `.github/workflows/ci.yml`:
```yaml
- run: npm run lint  # blocks on any error
```

## Routing

| Bulgu | Sahip | Effort | Sprint |
|---|---|---|---|
| TD-001 TIERS canonical | frontend-engineer + design-system-keeper | L (3 gün) | Mayıs P0 |
| TD-002 Color sweep | design-system-keeper + frontend-engineer | M-L (1-2 hafta) | Mayıs P0 |
| TD-024 Mission state enum | frontend-engineer | S (1 gün) | Haziran P1 |
| TD-028 karma_total consolidate | supabase-backend | S (yarım gün) | Haziran P1 |
| TD-029 active/status trigger | supabase-backend | S (1 gün) | Haziran P1 |
| TD-009 Lint rule paketi | frontend-engineer + system-architect | M (1 hafta) | Mayıs P0 (base) + Haziran P1 (custom) |

## Bağlı ADR'ler

- ADR-014 Proposed — TIERS canonical (`docs/product/03-decisions/014-tiers-canonical.md`)
- ADR-015 Proposed — Server action template + lint rules
- ADR-016 Proposed — Migration template

## Handoff log

- 2026-04-26 19:40 — **system-architect** 📥 — Pattern memo açıldı. Routing: frontend-engineer + design-system-keeper + supabase-backend + system-architect. ADR-014 Proposed kuyruğa girdi.
- ⏸ Pending — User onay sonrası Faz 1 (canonical dosyalar) + Faz 3 (lint rule paketi) paralel başlar.
