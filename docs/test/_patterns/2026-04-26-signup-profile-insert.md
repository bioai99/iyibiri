# Pattern D — Signup → Profile Insert Eksik

**Tespit eden:** test-engineer (regression pass, 2026-04-26 15:45)
**Tarih:** 2026-04-26
**Etkilenen bug'lar:** BUG-005 regression (greeting "Hoş geldin"), BUG-011 (welcome bonus karma yok)
**Severity:** P0 (BUG-011 P0, BUG-005 P1)
**Etkilenen kullanıcı segmenti:** Tüm yeni kullanıcılar (her signup)

## Kök neden

Signup sırasında `auth.users` row'u oluşturuluyor (Supabase auth) ama `profiles` row'u **eksik kolonlarla** insert ediliyor:

- `profiles.full_name` — boş (signup formundaki ad input'u kaydedilmemiş)
- `profiles.first_name` — boş
- `profiles.karma` — 0 (welcome bonus 100 eklenmemiş)
- `profiles.onboarding_completed` — false (bu doğru)

Sonuç: dashboard'da getDisplayName fallback "Hoş geldin" gösteriyor, hero karma 0 görünüyor (welcome modal'da +100 vaadi yapılmasına rağmen).

## Kanıt

### BUG-005 regression — Greeting fallback
- Signup formuna girilen ad: "Test İyiBiri"
- Dashboard header: "Günaydın, **Hoş geldin**" (avatar "H")
- `getDisplayName({first_name: '', full_name: ''})` → fallback "Hoş geldin"
- Pattern B Sprint Vol-1'de getDisplayName düzeltildi ✅, ama gerçek problem auth tarafında.

### BUG-011 — Welcome bonus karma kayıp
- Welcome celebration modal: "Başlangıç hediyen karmana ekleniyor 🌱 / **100 KARMA**"
- "Hadi başlayalım" → /dashboard
- Hero kart: **"0 Karma"**
- `profiles.karma` 0 — welcome bonus insert eksik.
- `karma_transactions` tablosunda `reason='welcome_bonus'` satırı yok (tahmini, verify edilmedi)

**Ortak özellik:** İkisi de "signup → profile row eksik kolonlarla yaratılıyor" pattern'i.

## Mimari hipotez

Mevcut akış (tahmini):
```
1. /auth/signup → supabase.auth.signUp({ email, password })
2. Supabase auth.users insert
3. Trigger veya app code: profiles INSERT (sadece id, email, onboarding_completed=false)
   ❌ full_name kaydedilmiyor (form input ignored)
   ❌ karma=0 (welcome bonus yok)
4. → /onboarding/welcome
5. Onboarding completion → profiles UPDATE (interests, city, birth_year, onboarding_completed=true)
   ❌ karma still 0
```

Beklenen akış:
```
1. /auth/signup → supabase.auth.signUp({ email, password, options: { data: { full_name: 'Test İyiBiri' } } })
2. Supabase auth.users insert WITH user_metadata.full_name
3. Trigger handle_new_user() (varsa) veya app code:
   profiles INSERT (id, email, full_name, first_name, karma=100, onboarding_completed=false)
   karma_transactions INSERT (user_id, +100, reason='welcome_bonus')
4. → /auth/verify (email confirm) → /onboarding/welcome
5. Onboarding completion → profiles UPDATE (interests, city, birth_year, onboarding_completed=true)
```

## Önerilen sistemik fix

### A — Frontend signup handler

`app/auth/signup/page.tsx`'te signup çağrısı:

```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
    data: {
      full_name: fullName.trim(), // Signup formundaki "Ad Soyad" input
    },
  },
})
```

`options.data` Supabase auth.users.user_metadata'ya yazılır.

### B — Database trigger (önerilen)

Supabase'de mevcut bir `handle_new_user()` trigger varsa onu güncelle, yoksa yaz:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    first_name,
    karma,
    onboarding_completed,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 1), ''),
    100, -- Welcome bonus
    false,
    NOW()
  );

  -- Welcome bonus transaction
  INSERT INTO public.karma_transactions (
    user_id,
    amount,
    reason,
    created_at
  )
  VALUES (
    NEW.id,
    100,
    'welcome_bonus',
    NOW()
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Bu migration **idempotent** (DROP IF EXISTS + CREATE) — birden fazla apply güvenli.

### C — Verify (regression test)

Yeni signup → DB query:
```sql
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.first_name,
  p.karma,
  p.onboarding_completed,
  (SELECT amount FROM karma_transactions WHERE user_id = u.id AND reason = 'welcome_bonus') as bonus
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'bahadiroylumlu+t3@gmail.com';
```

Beklenen:
- `full_name = 'Test İyiBiri'`
- `first_name = 'Test'`
- `karma = 100`
- `bonus = 100`

## Dosyalar etkilenen

- `app/auth/signup/page.tsx` — signUp call options.data ekle
- `supabase/migrations/024_handle_new_user_trigger.sql` (NEW) — trigger + welcome bonus
- `lib/supabase/auth.ts` (varsa) — wrapper update

## Estimated effort

- Frontend signup options.data: 15 dk
- Migration 024 yazımı + apply: 30 dk
- Regression test (yeni signup, DB query): 15 dk
- Welcome celebration copy gözden geçirme (ya kaldır ya bonus reflect et): 15 dk

**Toplam:** ~1.5 saat

## Handoff

- **Lead:** auth-capacitor (signup handler + trigger SQL)
- **Support:** supabase-backend (migration apply + RLS check) + frontend-engineer (welcome celebration copy karar)
- **Acil mi:** P0 — yeni kullanıcı UX broken (greeting + karma).

## Handoff Log

- 2026-04-26 15:45 — test-engineer ✅ — Pattern memo açıldı.
- 2026-04-26 16:30 — auth-capacitor + supabase-backend ✅ — Pattern D fix done. Migration: supabase/migrations/024_handle_new_user_trigger.sql (NEW). Signup: app/auth/signup/page.tsx zaten `options.data.full_name` var. Schema: profiles.{full_name, first_name, karma, onboarding_completed, email}, karma_transactions.type += 'welcome_bonus'. User manual: SQL Editor → migration 024 apply.
