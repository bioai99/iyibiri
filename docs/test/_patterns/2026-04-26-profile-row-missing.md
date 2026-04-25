# Pattern H — Profile Row Missing (Trigger Fail Silent)

**Tespit eden:** test-engineer (Vol-6 regression, 2026-04-26)
**Tarih:** 2026-04-26
**Etkilenen bug'lar:** BUG-017 reopen, BUG-005 regression (yeni hali), BUG-011 reopen
**Severity:** **P0 (BLOCKER)** — yeni signup → profile yaratılmıyor → tüm flow bozuk
**Etkilenen kullanıcı segmenti:** **TÜM yeni kullanıcılar** (her signup, her seferinde)

## Kök neden

`bahadiroylumluu+t5@gmail.com` Vol-5 fix sonrası signup koşturuldu. Onboarding tamam → "Bitir" → welcome celebration → "Hadi başlayalım" → /onboarding/welcome'a yönlendi (loop). Network log'da PATCH /profiles 204 gözükmesine rağmen, sonradan `select * from profiles where id = <userId>` boş döndü.

**Profil satırı yaratılmamış.** `auth.users` row var ama `public.profiles` yok.

```
auth.users.id = 2fb778ae-7c0f-47ed-8cd5-e81212f55673
auth.users.email = bahadiroylumluu+t5@gmail.com
profiles WHERE id = ... → []  (BOŞ)
```

Sonuçlar (zincir):
1. Middleware `onboarding_completed` okuyamıyor → /onboarding/welcome'a redirect
2. Dashboard hero karma 0 (welcome bonus yok — karma_transactions da yok)
3. Greeting fallback "Hoş geldin" (full_name boş)
4. City PATCH 204 → satır yok (UPDATE 0 rows = 204 No Content, hata değil)

## Mimari hipotez

Migration 024 trigger'ı `EXCEPTION WHEN OTHERS THEN` ile sarılmış:

```sql
exception when others then
  raise warning 'handle_new_user error for user %: %', new.id, sqlerrm;
  return new;
end;
```

Trigger'ın bir yerinde hata atıyor → `raise warning` (Supabase log'da görülmeyebilir) → trigger sessizce `return new` yapıyor → auth signup başarılı, ama profil yaratılmıyor.

Olası error noktaları:
- A) Migration 024 hiç apply edilmedi → eski 004 trigger çalışıyor (`name`, `email` insert) ama belki o da column eksikliği nedeniyle başarısız
- B) Migration 024 apply edildi ama `karma_transactions.type` constraint update'i başarısız (eski constraint hâlâ aktif, 'welcome_bonus' reddediliyor)
- C) Migration 024 apply edildi ama `karma` kolonu profiles'a eklenemedi (örn. trigger function `karma=100` yazıyor, kolon yoksa hata)
- D) RLS denial — trigger `security definer` olduğu için mantıksız ama mümkün

Hangisi olursa olsun, **EXCEPTION handler hatayı yutuyor** → diagnostik imkânsız.

## Kanıt

### REST API doğrulama (Vol-6 in-browser query)

```javascript
// Aynı user'ın profil row'unu 3 farklı şekilde sorguladım
fetch('/profiles?id=eq.<userId>&select=*')      // [] empty
fetch('/profiles?select=*&limit=1')              // [] empty (RLS sadece kendi profile)
fetch('/profiles?email=eq.<email>&select=*')     // [] empty

// Sanity: auth.users row var
fetch('/auth/v1/user') // { id: <userId>, email: <email>, ... } ✅
```

### Network logs

```
PATCH /rest/v1/profiles?id=eq.<userId>
  Status: 204 No Content
  → UPDATE on 0 rows = 204 (PostgREST behavior)
```

### Symptom chain
- BUG-017 (loop): middleware redirects to /onboarding/welcome
- BUG-005 (greeting): getDisplayName fallback
- BUG-011 (karma): hero shows 0

**Hepsi tek kök sebepten:** profile row yok.

## Önerilen sistemik fix

### A — Migration 026 (NEW): repair + diagnostik

Yazıldı: `supabase/migrations/026_repair_missing_profiles.sql`

İçerik:
1. **Schema safety:** `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` ile kolonları idempotent ekle
2. **Backfill:** Tüm `auth.users` için profile yoksa yarat (welcome bonus dahil)
3. **Re-trigger:** `handle_new_user` fonksiyonu yeniden tanımla, error handler `RAISE NOTICE` (görünür log) kullan + step tracking (`v_step` variable)
4. **Verification queries:** Migration sonunda yorum olarak SQL bırak, kullanıcı SQL Editor'dan koşturup doğrulasın

### B — Hata görünür hale getir

Eski:
```sql
exception when others then
  raise warning 'handle_new_user error for user %: %', new.id, sqlerrm;
```

Yeni (Migration 026):
```sql
declare
  v_step text;
begin
  v_step := 'extract_metadata';
  ...
  v_step := 'insert_profile';
  ...
  v_step := 'insert_karma_transaction';
  ...
exception when others then
  raise notice 'handle_new_user FAILED at step % for user % (email %): % / %',
    v_step, new.id, new.email, sqlstate, sqlerrm;
  return new;
end;
```

`RAISE NOTICE` Supabase Dashboard log'unda görünür. `v_step` ile **hangi adımda** kaldığını anlarız.

### C — Backfill mevcut +t5 user'ı için

Migration 026 backfill section bunu yapar:

```sql
insert into public.profiles (id, email, full_name, first_name, karma, onboarding_completed, ...)
select u.id, u.email, ...
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
```

`+t5` user için profile yaratılır → middleware artık satırı görür → tek başına onboarding_completed=false geri gelir, ama ikinci kez "Bitir" ile complete edilebilir.

VEYA: backfill query'sine `onboarding_completed = true` ekle eğer user zaten city seçimini yapmış (localStorage'da olabilir, ama backend güvenilir değil) → bu riskli, default false bırakalım.

### D — Verify

User Migration 026 apply edince:

1. **Apply 026 SQL Editor'dan:** kullanıcı manuel apply.
2. **Verify query 1:** `select count(*) from auth.users left join profiles ... where p.id is null` → 0
3. **Verify query 2:** +t5 user için `karma = 100, full_name`, `welcome_bonus_count = 1`
4. **Re-test Vol-7:** Yeni signup +t6 → trigger çalışıyor mu? (hata varsa Supabase log'da NOTICE)

### E — Frontend resilience (geleceğe yönelik)

Trigger başarısız olursa frontend'in de fail-safe olması iyi olur. Önerilen: city page handleSubmit'te `update` yerine `upsert`:

```typescript
const { error } = await supabase
  .from('profiles')
  .upsert({
    id: user.id,
    email: user.email,
    city: selected,
    age_range: selectedAge,
    onboarding_completed: true,
  }, { onConflict: 'id' })
```

Upsert profile yoksa yaratır, varsa update eder. Trigger çift garantisi gerekirse iyi olur — ama kök sorun **trigger düzeltmesi**, upsert sadece backup.

## Dosyalar etkilenen

- `supabase/migrations/026_repair_missing_profiles.sql` (NEW) — schema+backfill+trigger
- `app/onboarding/city/page.tsx` (öneri) — `update` → `upsert` (defensive backup)

## Estimated effort

- Migration 026 yazımı: ✅ tamam (~30 dk)
- User SQL Editor apply: 5 dk
- Verification queries: 5 dk
- Vol-7 regression (+t6 signup): 15 dk
- Frontend upsert defansif fix: 15 dk

**Toplam:** ~1 saat (kullanıcı apply hariç)

## Handoff

- **Lead:** supabase-backend (Migration 026 yazıldı, user apply edecek)
- **Support:** auth-capacitor (trigger doğrulaması + log inceleme)
- **Acil mi:** **P0 BLOCKER** — yeni kullanıcı flow tamamen bozuk. Vol-5 fix işe yaramıyor çünkü profile row yok.

## Handoff Log

- 2026-04-26 ~18:50 — test-engineer ✅ — Pattern memo açıldı + Migration 026 yazıldı.
- (bekleniyor) — kullanıcı 📥 — Migration 026 SQL Editor'dan apply.
- (bekleniyor) — test-engineer 📥 — Vol-7 regression: +t6 signup → dashboard ulaşma.
