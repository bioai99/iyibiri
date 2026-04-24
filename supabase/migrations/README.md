# Supabase Migrations — İyiBiri

> Kronolojik sıralı Supabase migration'ları. Her biri `begin;` ile başlayıp `commit;` ile biter — atomik.

## Apply sırası

Supabase dashboard SQL editor'de **numaralı sırayla** apply edilir:

```
001_initial_schema.sql           (v1 ilk schema)
002_v2_fields.sql                (mission v2 kolonları)
003_onboarding_fields.sql        (profiles city + interests)
004_profile_email.sql            (profiles.email)
005_save_streak_subscribe.sql    (user_saved_missions + streak + subscriptions)
006_add_age_range.sql            (profiles.age_range)
007_blog_posts.sql               (posts tablosu)
008_ngo_memberships.sql          (ngo_memberships)
009_parametric_ngo_fee.sql       (ADR-007 — parametric fee config)
010_payment_routing.sql          (ADR-008 — 3-modlu payment + referrals)
011_make_analytics_views.sql     (WS-01 — MAKE + 5 analytics view)
012_membership_karma_type.sql    (karma_transactions.type → 'ngo_membership')
013_mission_lifecycle.sql        (P0 #3 — state machine + karma idempotent)
014_ngos_missions_seed.sql       (seed — 5 NGO + 12 mission, idempotent)
```

## V1 Lansman için minimum gereksinim

İlk lansmana kadar apply edilmesi gereken migration'lar: **001 → 014 (hepsi)**.

## 014 seed migration'u — sessiz bug uyarısı

Migration 009/010'daki `update public.ngos set ... where id='tema'` statement'ları, `ngos`
tablosunda ilgili row olmadığında **sessizce hiçbir şey yapmıyor**. V1 lansman pilot
STK'ları (TEMA, TEGV, LÖSEV, HAYTAP, Kodluyoruz) ancak **migration 014** apply edildikten
sonra görünür.

Önceki 009/010 zaten apply edildiyse bile 014'ün `insert ... on conflict (id) do nothing`
pattern'i idempotent — tekrar çalıştırılabilir.

## Idempotency kuralları

- Bütün `alter table` statement'ları `add column if not exists` kullanır.
- `insert` statement'ları `on conflict (id) do nothing`.
- `create index` statement'ları `if not exists`.
- Enum constraint genişletmeleri: `drop constraint if exists ... ; add constraint ...`.

Bu kural sayesinde her migration tekrar apply edilebilir, schema drift yapmaz.

## Dev fixtures (kullanıcı bazlı)

Migration'lar schema + deterministic data için. Her kullanıcının kendi test
user_missions + ngo_memberships + referrals'ı için `/admin/devtools` sayfasını kullan
(dev mode'da aktif, production'da `DEV_FIXTURES_ENABLED=1` + allowlist gerekir).

Ref:
- `lib/dev/user-fixtures.ts` — server action
- `app/admin/devtools/` — UI

## Self-check queries (apply sonrası doğrulama)

```sql
-- 1. Migration 014 seed sağlığı
select id, name, payment_mode, payment_processor,
       (membership_fee_config->>'mode') as fee_mode
from public.ngos order by id;
-- Beklenen: 5 row — haytap, kodluyoruz, losev, tegv, tema (her biri fee_mode dolu)

-- 2. Mission state çeşitliliği
select status, count(*) as n,
       count(*) filter (where spots_left = 0) as full_count,
       count(*) filter (where event_date < now()) as expired_count
from public.missions group by status;
-- Beklenen: active (en az 10) + cancelled (1) + draft (1)

-- 3. Karma idempotent index
select indexname from pg_indexes
where tablename = 'karma_transactions' and indexname = 'karma_transactions_mission_unique';
-- Beklenen: 1 row (tek unique index var)

-- 4. Referrals tablosu
select count(*) from public.referrals;
-- Apply edildikten sonra: 0 (referrals dev runtime'da oluşur)
```
