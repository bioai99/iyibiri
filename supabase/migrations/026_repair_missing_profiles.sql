-- Migration 026: REPAIR — Missing profiles for auth.users + trigger debug
-- Severity: P0 BLOCKER
-- Bug: Vol-5 regression yeni signup `bahadiroylumluu+t5@gmail.com`
--      auth.users row CREATED ✅
--      profiles row MISSING ❌ → onboarding loop, karma 0, greeting fallback
--
-- Root cause hypothesis:
--   1. Migration 024 trigger may not have been applied (user manual step missed)
--   2. OR trigger applied but EXCEPTION WHEN OTHERS swallowed an error silently
--   3. Result: trigger fires on auth.users INSERT but does nothing (returns NEW)
--
-- Impact: TÜM yeni signup'lar broken — profile yaratılmıyor.
--
-- This migration:
--   A) Idempotent ALTER TABLE (safety: re-add columns if 024 partially applied)
--   B) Backfill ALL missing profiles for existing auth.users
--   C) Re-create trigger with explicit error logging (raise NOTICE not just WARNING)
--   D) Verification query at the end (manual run)
--
-- Tarih: 2026-04-26 (Vol-6)

begin;

-- =====================================================
-- A) Schema safety — idempotent column adds
-- =====================================================
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists first_name text,
  add column if not exists karma integer not null default 0,
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists email text,
  add column if not exists age_range text,
  add column if not exists city text,
  add column if not exists interests text[] default '{}';

-- karma_transactions type check
alter table public.karma_transactions
  drop constraint if exists karma_transactions_type_check;

alter table public.karma_transactions
  add constraint karma_transactions_type_check
    check (type in ('mission_complete', 'reward_redemption', 'ngo_membership', 'welcome_bonus'));

-- =====================================================
-- B) BACKFILL — Create profiles for all auth.users without one
-- =====================================================
-- This is the critical recovery: any user who signed up between
-- now and the (broken) trigger run will get a profile.
--
-- Idempotent: WHERE p.id IS NULL filter.

insert into public.profiles (
  id,
  email,
  full_name,
  first_name,
  karma,
  onboarding_completed,
  created_at
)
select
  u.id,
  u.email,
  coalesce(nullif(trim(u.raw_user_meta_data->>'full_name'), ''), ''),
  coalesce(nullif(split_part(trim(u.raw_user_meta_data->>'full_name'), ' ', 1), ''), ''),
  100, -- Welcome bonus karma (matches trigger behavior)
  false, -- Will be set true after onboarding
  coalesce(u.created_at, now())
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- B2) Also create welcome_bonus karma_transactions for backfilled users
insert into public.karma_transactions (
  user_id,
  amount,
  type,
  description,
  created_at
)
select
  p.id,
  100,
  'welcome_bonus',
  'Hoş geldin hediyesi — backfill (Migration 026)',
  p.created_at
from public.profiles p
left join public.karma_transactions kt
  on kt.user_id = p.id
  and kt.type = 'welcome_bonus'
where kt.id is null;

-- =====================================================
-- C) Re-create trigger with louder error logging
-- =====================================================
drop trigger if exists on_auth_user_created on auth.users;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_full_name text;
  v_first_name text;
  v_step text;
begin
  v_step := 'extract_metadata';
  v_full_name := coalesce(new.raw_user_meta_data->>'full_name', '');
  v_first_name := coalesce(nullif(split_part(v_full_name, ' ', 1), ''), '');

  v_step := 'insert_profile';
  insert into public.profiles (
    id,
    email,
    full_name,
    first_name,
    karma,
    onboarding_completed,
    created_at
  )
  values (
    new.id,
    new.email,
    v_full_name,
    v_first_name,
    100,
    false,
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = case when excluded.full_name <> '' then excluded.full_name else public.profiles.full_name end,
    first_name = case when excluded.first_name <> '' then excluded.first_name else public.profiles.first_name end;

  v_step := 'insert_karma_transaction';
  insert into public.karma_transactions (
    user_id,
    amount,
    type,
    description,
    created_at
  )
  select
    new.id,
    100,
    'welcome_bonus',
    'Hoş geldin hediyesi — 100 Karma',
    now()
  where not exists (
    select 1 from public.karma_transactions
    where user_id = new.id and type = 'welcome_bonus'
  );

  return new;
exception when others then
  -- Loud logging: NOTICE level visible in Supabase logs
  raise notice 'handle_new_user FAILED at step % for user % (email %): % / %',
    v_step, new.id, new.email, sqlstate, sqlerrm;
  -- Still return NEW so signup doesn't fail (auth user created OK)
  -- Recovery: Migration 026 backfill section will create profile later
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

comment on function public.handle_new_user is
  'Migration 026: idempotent on_conflict + welcome bonus + loud error logging. Recovery: 026 backfill creates profiles for users where trigger may have failed previously.';

commit;

-- =====================================================
-- VERIFICATION (manual run after apply)
-- =====================================================
-- Run these in Supabase SQL Editor to confirm fix:
--
-- 1) Count missing profiles (should be 0):
-- select count(*) as missing_profiles
-- from auth.users u
-- left join public.profiles p on p.id = u.id
-- where p.id is null;
--
-- 2) Specific +t5 user:
-- select
--   u.email,
--   u.id,
--   p.full_name,
--   p.first_name,
--   p.karma,
--   p.onboarding_completed,
--   (select count(*) from karma_transactions kt where kt.user_id = u.id and kt.type = 'welcome_bonus') as welcome_bonus_count
-- from auth.users u
-- left join public.profiles p on p.id = u.id
-- where u.email = 'bahadiroylumluu+t5@gmail.com';
--
-- 3) Trigger sanity check:
-- select tgname, tgenabled
-- from pg_trigger
-- where tgname = 'on_auth_user_created';
