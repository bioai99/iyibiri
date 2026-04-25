# Pattern B — Türkçe Karakter Integrity

**Tespit eden:** test-engineer
**Tarih:** 2026-04-26 12:30
**Etkilenen bug'lar:** BUG-004 (landing TR copy), BUG-005 (greeting "Biri" parse)
**Severity:** P1
**Etkilenen kullanıcı segmenti:** Tüm kullanıcılar (her sayfa görüntüleme)

## Kök neden

Türkçe karakter handling iki kritik yerde bozuk:

1. **Static copy yazımı** — Landing sayfası gibi marketing copy'lerinde yazar TR klavye kullanmamış, raw text "Iyilik biriktirilir" / "gercek gorevler" / "yasliya yardim etti" şeklinde girilmiş. Brand inconsistency: bazı yerler doğru ("İyilik Öncüleri"), bazı yerler ASCII.

2. **String manipulation locale-blind** — Greeting parse logic "Test İyiBiri" inputundan "Biri" çıkartıyor. Muhtemel sebep: `String.split(' ')` + son element + brand kelime "İyi" prefix strip mantığı, Türkçe locale aware değil.

## Kanıt

### BUG-004 — Landing TR copy systemic
Landing'de tutarsız stripping:
- ❌ "IyiBiri" (logo wordmark)
- ❌ "Nasil calisir" (nav)
- ❌ "Su an X kisi gonullu" (eyebrow)
- ❌ "Iyilik biriktirilir." (h1!)
- ❌ "gercek gorevler", "katki degerli", "gonullu ol"
- ❌ Live feed: "gida dagitimi yapti", "yasliya yardim etti", "32dk once"
- ✅ Title `<title>İyiBiri</title>`, "İyilik Öncüleri" (nav), "İYİLİK BİRİKTİR" (badge)

Yani aynı sayfada hem doğru hem yanlış — sistemik copy review gerek.

### BUG-005 — Greeting "Biri"
- Input: "Test İyiBiri" (full name field)
- Output: "Günaydın, **Biri**" (header)
- Beklenen: "Günaydın, **Test**" veya "Günaydın, **Test İyiBiri**"

Hipotez: `display_name` parse logic'i `name.split(' ').pop()` + brand kelimesi (İyi/İyiBiri) detect + strip yapıyor → "Biri" kalıyor.

## Önerilen sistemik fix

### A — Copy review pass (landing)

Tüm `app/page.tsx` (veya `app/(marketing)/landing/*`) içindeki static copy'leri bir TR karakter normalize pass'inden geçir:

```regex
# Search patterns (sadece marketing copy'sinde):
\b(I)([yY]i)\b              → İyi
\b(N)(asil)\b               → Nasıl
\b(g)(idi)\b                → gidi (zaten doğru)
\b(g)(onullu|orevler|ercek) → gönüllü/görevler/gerçek
\b(s)(u an|ifre)\b          → şu an / şifre
\b(k)(isi|atki)\b           → kişi / katkı
\b(o)(nce|nculeri)\b        → önce / öncüleri
\b(d)(egerli|agitimi)\b     → değerli / dağıtımı
\b(y)(asliya|ardim)\b       → yaşlıya / yardım
```

Manuel review zorunlu — auto-replace tehlikeli (regex false positive yapabilir, "Iyi" özel isim olabilir).

### B — Display name parse util (lib/utils.ts)

```typescript
/**
 * Türkçe-safe display name parse.
 * "Test İyiBiri" → "Test"
 * "İyiBiri" → "İyiBiri"
 * "" / null → "Hoş geldin"
 */
export function getDisplayName(profile: { full_name?: string | null; first_name?: string | null }): string {
  if (profile.first_name?.trim()) return profile.first_name.trim()
  if (profile.full_name?.trim()) {
    const firstWord = profile.full_name.trim().split(/\s+/)[0]
    if (firstWord) return firstWord
  }
  return 'Hoş geldin'
}
```

**Kritik:** Brand kelimesi strip ETMEYELİM. Kullanıcının adı "İyiBiri" olabilir, problem değil — kullanıcı kendi adını yazdı.

### C — Locale-aware string ops (proje çapında)

Her yerde:
```typescript
// ❌ Yanlış
'İstanbul'.toLowerCase() === 'istanbul' // false! ('İ' → 'i̇' combining)

// ✅ Doğru
'İstanbul'.toLocaleLowerCase('tr-TR') === 'istanbul' // true
```

`lib/utils.ts`'e helper:
```typescript
export const trLower = (s: string) => s.toLocaleLowerCase('tr-TR')
export const trUpper = (s: string) => s.toLocaleUpperCase('tr-TR')
```

ESLint rule (opsiyonel): `no-restricted-syntax` ile `.toLowerCase()` çağrılarını yakala, `trLower` kullan dedirt.

## Dosyalar etkilenen

- `app/page.tsx` (veya marketing landing component'leri) — copy normalize pass
- `lib/utils.ts` — `getDisplayName` + `trLower/trUpper` helpers
- Greeting kullanan component (`components/dashboard/dashboard-client.tsx`?) — `getDisplayName` migrate
- Project-wide `.toLowerCase()` audit (ileride)

## Estimated effort

- Landing copy normalize pass: 1 saat (manuel TR review)
- `getDisplayName` util: 30 dk
- Greeting component migrate: 30 dk
- Project-wide toLowerCase audit + migration: 2-3 saat (büyük scope)
**MVP:** Sadece landing copy + greeting fix → 2 saat
**Tam:** + proje çapında locale-aware migration → 5-6 saat

## Handoff

- **Lead:** frontend-engineer
- **Support:** ux-researcher (copy review brief)
- **Acil mi:** P1 — Brand quality, sprint backlog (bir sonraki sprint'te P1 öncesi)

## Handoff Log

- 2026-04-26 12:30 — test-engineer ✅ — Pattern memo açıldı.
- 2026-04-26 — frontend-engineer ✅ — Pattern B fix done. Files: lib/utils.ts (NEW helpers getDisplayName/trLower/trUpper), app/page.tsx (landing copy normalize ~17 string), app/dashboard/dashboard-client.tsx (greeting migrate to getDisplayName), app/auth/signup/page.tsx (KVKK native checkbox a11y), components/ui/mission-card.tsx + mission-detail-client.tsx (defensive category fallback). Typecheck: pass.
