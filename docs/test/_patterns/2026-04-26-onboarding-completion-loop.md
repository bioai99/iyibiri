# Pattern G — Onboarding Completion Loop

**Tespit eden:** test-engineer (Vol-4 regression, 2026-04-26 18:30)
**Tarih:** 2026-04-26
**Etkilenen bug'lar:** BUG-017 (onboarding loop, P0), BUG-018 (city validation eksik, P1), BUG-019 (city CTA copy, P2)
**Severity:** **P0 (BLOCKER)** — yeni kullanıcı dashboard'a hiç ulaşamıyor
**Etkilenen kullanıcı segmenti:** Tüm yeni kullanıcılar (her signup)

## Kök neden

Onboarding flow'unun son adımı (city/age) `profiles.onboarding_completed = true` flag'ini set etmiyor. Sonuç:

1. User signup → /auth/verify → /onboarding/welcome → /onboarding/causes → /onboarding/city
2. City sayfasında selection olmasa bile "Hesabımı oluştur" button (→ city CTA copy yanlış, BUG-019) tıklanabiliyor (validation yok, BUG-018)
3. Submit handler welcome celebration modal aç (KarmaCounterPro 100 anim)
4. "Hadi başlayalım" → router.push('/dashboard') beklenir
5. Ama middleware `profile.onboarding_completed === false` → /onboarding/welcome'a redirect
6. **Loop:** /onboarding/welcome → causes → city → celebration → /dashboard → middleware redirect → /onboarding/welcome → ...

Pattern A middleware doğru çalışıyor (gate aktif), ama onboarding completion endpoint city sayfasında çağrılmıyor → flag false kalıyor → middleware her seferinde geri atıyor.

## Kanıt

### BUG-017 — Onboarding loop
- Vol-4 regression: yeni signup `bahadiroylumluu+t4@gmail.com` → flow tamam → "Hadi başlayalım" → URL `/onboarding/welcome` (dashboard değil)
- Welcome celebration modal görünür ama backend'e `onboarding_completed=true` UPDATE yapmamış
- Middleware kullanıcıyı sürekli onboarding'e atıyor

### BUG-018 — City validation eksik
- City sayfasında **şehir seçmeden** "Hesabımı oluştur" tıklanabiliyor
- Beklenen: `disabled={!cityValue}` veya inline error "Şehir seç"
- Şu an empty submit kabul ediliyor → onboarding completion handler tetiklenir ama partial data ile

### BUG-019 — City CTA copy yanlış
- City sayfasında bottom CTA: "**Hesabımı oluştur** →"
- Mantıken kullanıcı zaten hesap açtı (signup + verify). City step **onboarding'in son adımı**, "**Tamamla**" veya "**Bitir**" demeli.
- Cognitive dissonance: "hesap zaten var" vs "hesabımı oluştur" mesajı

## Mimari hipotez

Şu anki akış (tahmini):

```typescript
// app/onboarding/city/page.tsx (varsayılan)
async function handleSubmit() {
  // ❌ city validation yok
  // ❌ profiles UPDATE yok
  // ❌ onboarding_completed = true set edilmiyor
  setShowCelebration(true)  // sadece UI modal
}

function CelebrationModal() {
  return (
    <button onClick={() => router.push('/dashboard')}>
      Hadi başlayalım
    </button>
  )
}
```

**Beklenen:**

```typescript
async function handleSubmit() {
  // ✅ Validation
  if (!cityValue) {
    setError('Lütfen şehir seç')
    return
  }
  
  // ✅ DB update
  const { error } = await supabase
    .from('profiles')
    .update({
      city: cityValue,
      birth_year: birthYearValue ?? null,
      interests: causesFromContext, // önceki step'ten
      onboarding_completed: true,    // ← KRİTİK
    })
    .eq('id', user.id)
  
  if (error) {
    setError('Bir şey ters gitti, tekrar dene')
    return
  }
  
  setShowCelebration(true)
}
```

VEYA: "Hadi başlayalım" handler'ı backend'e completion endpoint çağırıyor olabilir. Ama dashboard'a düşemediğimize göre o da çalışmıyor.

## Önerilen sistemik fix

### A — City sayfası completion endpoint (kritik)

`app/onboarding/city/page.tsx`:

```typescript
const [city, setCity] = useState<string>('')
const [birthYear, setBirthYear] = useState<number | null>(null)
const [submitting, setSubmitting] = useState(false)
const [error, setError] = useState<string | null>(null)

async function handleSubmit() {
  if (!city) {
    setError('Lütfen yaşadığın şehri seç')
    return
  }
  
  setSubmitting(true)
  setError(null)
  
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    router.push('/auth/signin')
    return
  }
  
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      city,
      birth_year: birthYear,
      onboarding_completed: true,
    })
    .eq('id', user.id)
  
  if (updateError) {
    setError(updateError.message || 'Kayıt başarısız, tekrar dene')
    setSubmitting(false)
    return
  }
  
  // Önceki step'ten interests context'inde tutuluyorsa update'e ekle
  // Veya causes sayfası kendi UPDATE'ini yapıyorsa burada ek bir şey gerekmez
  
  setShowCelebration(true)  // Modal'ı aç
}
```

### B — Welcome Celebration "Hadi başlayalım" doğru route

`components/onboarding/welcome-celebration.tsx`:

```typescript
<button onClick={() => router.push('/dashboard')}>
  Hadi başlayalım →
</button>
```

Bu zaten doğru olabilir, ama problem: `router.push('/dashboard')` → middleware `onboarding_completed=false` görür → /onboarding/welcome'a yönlendirir. Yani BU FİX'in başarılı olması için **A fix** (DB update) önce uygulanmalı.

### C — City CTA copy

`app/onboarding/city/page.tsx` — bottom button text:

```typescript
<button>
  {city ? 'Bitir →' : 'Lütfen şehir seç'}
</button>
```

Veya daha brand-aligned:
```typescript
{city ? 'Hadi başlayalım →' : 'Şehrini seç'}
```

### D — Verify (regression test)

Yeni signup `+t5@gmail.com` → causes seç → city seç → "Bitir" → welcome celebration → "Hadi başlayalım" → /dashboard'a düşmeli (loop yok).

DB query ile doğrula:
```sql
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.city,
  p.interests,
  p.birth_year,
  p.onboarding_completed,
  p.karma
FROM profiles p
WHERE p.email = 'bahadiroylumluu+t5@gmail.com';
```

Beklenen:
- `city = 'İstanbul'` (veya seçilen)
- `interests = ['nature', 'education']` (veya seçilen)
- `onboarding_completed = true`
- `karma = 100` (Migration 024 trigger)

## Dosyalar etkilenen

- `app/onboarding/city/page.tsx` — completion endpoint çağrısı + validation + CTA copy
- `components/onboarding/welcome-celebration.tsx` (varsa) — `router.push('/dashboard')` doğrula
- `app/onboarding/causes/page.tsx` — interests state'i city'ye nasıl aktarılıyor (context veya URL state) — kontrol et

## Estimated effort

- City completion endpoint: 30 dk
- City validation + CTA copy: 15 dk
- Welcome celebration redirect doğrulama: 5 dk
- Causes → city interests state aktarımı kontrol: 15 dk
- Regression test: 15 dk

**Toplam:** ~1.5 saat

## Handoff

- **Lead:** frontend-engineer (city page handler + CTA copy)
- **Support:** auth-capacitor (welcome celebration redirect logic)
- **Acil mi:** **P0 — yeni kullanıcı flow tamamen bloke**. Sıradaki sprint'in #1 önceliği.

## Handoff Log

- 2026-04-26 18:30 — test-engineer ✅ — Pattern memo açıldı.
- 2026-04-26 18:50 — frontend-engineer ✅ — Sprint Vol-5 fix completed. Files: app/onboarding/city/page.tsx (completion endpoint + validation + CTA copy), lib/supabase/types.ts (onboarding_completed column). Causes → city interests UPDATE confirmed (causes sayfası kendi UPDATE yapıyor, city'ye localStorage/context ile aktarılmıyor, ek işlem gerek yok). Welcome celebration redirect zaten doğru (/dashboard). Test: yeni signup → onboarding → "Bitir" → welcome modal → "Hadi başlayalım" → /dashboard (loop yok). Typecheck ✅.
