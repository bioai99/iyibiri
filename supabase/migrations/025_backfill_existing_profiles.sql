-- Migration 025: Backfill existing profiles with full_name from auth.users.raw_user_meta_data
-- Context: Migration 024 (handle_new_user trigger) sadece YENİ user signup'lar için çalışır.
-- Bu migration trigger'dan ÖNCE kayıt olmuş existing user'lar için one-time backfill yapar.
--
-- Production durumu:
--   - Trigger öncesi user'lar (örn. bahadiroylumlu+t1@gmail.com, +t3@gmail.com, test user'lar):
--     * profiles.full_name → NULL/boş
--     * profiles.first_name → NULL/boş
--     * profiles.karma → 0 (welcome bonus eklenmemiş)
--   - Test dashboard'da "Günaydın, Hoş geldin" fallback gösteriyor (getDisplayName yedek kılavuzu)
--
-- Bu migration'ın görevi: Mevcut auth.users.raw_user_meta_data->>'full_name' değerlerini
-- profiles satırlarına backfill etmek (sadece empty olanlar için).
--
-- Idempotency: WHERE p.full_name IS NULL OR p.full_name = '' filter güvenli.
-- Birden fazla kez apply edilse de zaten dolu satırları geçer.

begin;

-- =====================================================
-- Main backfill: full_name + first_name
-- =====================================================
-- Sadece full_name boş olanları update et.
-- COALESCE(..., '') kullanarak NULL → '' dönüşümü de ele al.
-- first_name: split_part ile full_name'nin ilk kelimesi.

update public.profiles p
set
  full_name = coalesce(nullif(trim(u.raw_user_meta_data->>'full_name'), ''), ''),
  first_name = coalesce(
    nullif(split_part(trim(u.raw_user_meta_data->>'full_name'), ' ', 1), ''),
    ''
  )
from auth.users u
where p.id = u.id
  -- Only update if currently empty
  and (p.full_name is null or p.full_name = '')
  -- Only if auth.users'da meta data var
  and u.raw_user_meta_data->>'full_name' is not null
  and trim(u.raw_user_meta_data->>'full_name') != '';

-- =====================================================
-- Welcome bonus backfill (OPSİYONEL — commented out)
-- =====================================================
--
-- KARAR: Default OFF — Aşağıdaki iki query commented out.
--
-- Neden OFF?
--   1. İş mantığı riski: Existing user'lar zaten karma kazanmış olabilir (mission complete, vs).
--     Backfill 100 karma eklemesi veri tutarsızlığı oluşturabilir.
--   2. Fairness sorunu: Trigger'dan sonraki user'lar welcome 100 alır, ama eğer eski user'lara da
--     aynı bonus verilirse "2'nci welcome bonus" gibi görünür (geçmişte timeline'da).
--   3. Iş kararı gerekir: Eski user'lara backfill welcome bonus verilecek mi? Oransal karma da verilecek mi?
--     Bu tür kararlar PM/Admin seviyesi koordinasyon ile alınmalı.
--
-- Eğer ILERIDE "Evet, welcome bonus backfill yap" kararı alınırsa:
-- Uncomment + apply et.
--
-- Uncomment için:
-- 1. Aşağıdaki INSERT/UPDATE query'leri uncomment et
-- 2. Migration'ı revert + re-apply et (ya da manual SQL Editor'dan çalıştır)
-- 3. Verify query ile check et
--

-- -- Step 1: karma_transactions'a welcome_bonus_backfill kaydı ekle (idempotent)
-- insert into public.karma_transactions (
--   user_id,
--   amount,
--   type,
--   description,
--   created_at
-- )
-- select
--   p.id,
--   100,
--   'welcome_bonus',
--   'welcome_bonus_backfill — existing user',
--   p.created_at
-- from public.profiles p
-- left join public.karma_transactions kt
--   on kt.user_id = p.id
--   and kt.type = 'welcome_bonus'
-- where kt.id is null
--   -- Only backfill users who don't already have welcome bonus record
--   and p.created_at < (select min(created_at) from public.profiles where created_at > now() - interval '1 day');
--
-- -- Step 2: profiles.karma güncelle (welcome_bonus_backfill ise)
-- update public.profiles p
-- set karma = karma + 100
-- where p.id in (
--   select user_id from public.karma_transactions
--   where type = 'welcome_bonus' and description like '%backfill%'
-- );

commit;

-- =====================================================
-- VERIFICATION QUERY (migration apply sonrası manual çalıştır)
-- =====================================================
-- Uncomment + Supabase SQL Editor'dan çalıştır.
-- Backfill durumunu kontrol et.
--
-- Expected output:
--   - email: test user email'ler
--   - full_name: auth metadata'dan doldurulmuş
--   - first_name: full_name'nin ilk kelimesi
--   - status: ✅ BACKFILLED (boş olanlar için)
--

-- select
--   u.email,
--   u.created_at as auth_created_at,
--   p.full_name,
--   p.first_name,
--   p.karma,
--   u.raw_user_meta_data->>'full_name' as auth_meta_full_name,
--   case
--     when p.full_name is null or p.full_name = '' then '❌ STILL EMPTY'
--     else '✅ BACKFILLED: ' || p.full_name
--   end as status
-- from auth.users u
-- left join public.profiles p on p.id = u.id
-- where u.email like '%+t%@gmail.com'
--    or u.created_at > now() - interval '7 days'
-- order by u.created_at desc;
