-- Migration 024: handle_new_user trigger — Pattern D fix
-- Bug: BUG-011 (welcome bonus karma yok) + BUG-005 regression (profile.full_name boş)
-- Fix: auth.users INSERT trigger → profiles row tam doldurulur + welcome bonus 100 karma
-- Tarih: 2026-04-26

begin;

-- Add missing columns to profiles table (idempotent)
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists first_name text,
  add column if not exists karma integer not null default 0,
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists email text;

-- Update karma_transactions type constraint to include 'welcome_bonus'
alter table public.karma_transactions
  drop constraint if exists karma_transactions_type_check;

alter table public.karma_transactions
  add constraint karma_transactions_type_check
    check (type in ('mission_complete', 'reward_redemption', 'ngo_membership', 'welcome_bonus'));

-- Drop existing trigger if any (idempotent)
drop trigger if exists on_auth_user_created on auth.users;

-- Create or replace function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_full_name text;
  v_first_name text;
begin
  -- Extract full_name from auth metadata (signup options.data.full_name)
  v_full_name := coalesce(new.raw_user_meta_data->>'full_name', '');
  v_first_name := coalesce(nullif(split_part(v_full_name, ' ', 1), ''), '');

  -- Insert or update profile row with all required columns
  insert into public.profiles (
    id,
    email,
    full_name,
    first_name,
    karma,
    onboarding_completed,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    v_full_name,
    v_first_name,
    100, -- Welcome bonus karma
    false,
    now(),
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    first_name = excluded.first_name,
    karma = excluded.karma,
    updated_at = now();

  -- Insert welcome bonus karma transaction (idempotent)
  insert into public.karma_transactions (
    user_id,
    amount,
    type,
    description,
    created_at
  )
  values (
    new.id,
    100,
    'welcome_bonus',
    'Hoş geldin hediyesi — 100 Karma',
    now()
  )
  on conflict do nothing;

  return new;
exception when others then
  -- Log error but don't block signup
  raise warning 'handle_new_user error for user %: %', new.id, sqlerrm;
  return new;
end;
$$;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

comment on function public.handle_new_user is
  'Pattern D: auto-creates profile row + welcome bonus 100 karma on signup. Idempotent. Reads full_name from auth.users.raw_user_meta_data.';

commit;
