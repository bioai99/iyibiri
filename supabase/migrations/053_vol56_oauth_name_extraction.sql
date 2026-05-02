-- Migration 053 (Vol-56-A): OAuth (Apple/Google) için isim çıkarımı genişletilir
-- ----------------------------------------------------------------------------
-- Bug: Apple ile login olunca dashboard greeting "Hoş geldin" fallback'ine
-- düşüyordu. Eski handle_new_user yalnız raw_user_meta_data->>'full_name'
-- okuyordu — bu signup form'undan gelir. Apple OAuth ise:
--   - raw_user_meta_data->>'name'           ("First Last" string)
--   - raw_user_meta_data->'name'->>'firstName'  (yapılandırılmış, rare)
--   - raw_user_meta_data->>'preferred_username'
--   - identity_data içinde
-- Google OAuth:
--   - raw_user_meta_data->>'full_name'
--   - raw_user_meta_data->>'name'
--   - raw_user_meta_data->>'given_name'  ("First")
--
-- Fix:
--   1. handle_new_user trigger fonksiyonunu çoklu kaynak coalesce ile yenile.
--   2. AUTH UPDATE trigger ekle — kullanıcı sonradan ad güncellerse profile
--      satırı senkron kalır (idempotent).
--   3. Mevcut OAuth kullanıcıları için backfill: profiles.first_name NULL
--      ise auth.users.raw_user_meta_data'dan derive et.

begin;

-- ── 1. handle_new_user fonksiyonunu yenile ────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_meta jsonb;
  v_full_name text;
  v_first_name text;
begin
  v_meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);

  -- full_name çoklu kaynak:
  --   - email signup form'u: meta.full_name
  --   - Google OAuth: meta.full_name veya meta.name
  --   - Apple OAuth (ilk login): meta.name (string) veya meta.name.firstName + lastName
  v_full_name := nullif(trim(coalesce(
    v_meta->>'full_name',
    v_meta->>'name',
    -- Apple'ın yapılandırılmış name objesi
    nullif(trim(coalesce(v_meta->'name'->>'firstName','') || ' ' || coalesce(v_meta->'name'->>'lastName','')), ''),
    -- Google given_name + family_name fallback
    nullif(trim(coalesce(v_meta->>'given_name','') || ' ' || coalesce(v_meta->>'family_name','')), ''),
    ''
  )), '');

  -- first_name: önce explicit alanlar, sonra full_name split
  v_first_name := nullif(trim(coalesce(
    v_meta->>'first_name',
    v_meta->>'given_name',
    v_meta->'name'->>'firstName',
    nullif(split_part(coalesce(v_full_name, ''), ' ', 1), ''),
    ''
  )), '');

  insert into public.profiles (
    id, email, full_name, first_name,
    karma, onboarding_completed,
    created_at, updated_at
  )
  values (
    new.id,
    new.email,
    v_full_name,
    v_first_name,
    100,
    false,
    now(),
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    -- Sadece NULL veya boşsa güncelle (manuel düzenlemeyi ezme)
    full_name = coalesce(nullif(public.profiles.full_name, ''), excluded.full_name),
    first_name = coalesce(nullif(public.profiles.first_name, ''), excluded.first_name),
    updated_at = now();

  -- Welcome bonus karma transaction (idempotent: bir kez)
  insert into public.karma_transactions (user_id, amount, type, description, created_at)
  values (new.id, 100, 'welcome_bonus', 'Hoş geldin hediyesi — 100 Karma', now())
  on conflict do nothing;

  return new;
exception when others then
  raise warning 'handle_new_user error for user %: %', new.id, sqlerrm;
  return new;
end;
$$;

-- ── 2. AUTH UPDATE trigger — meta sonradan değişirse profile senkron ────
-- (Apple ilk login'de bazen meta gecikmeli yazılır)
create or replace function public.handle_user_meta_update()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_meta jsonb;
  v_full_name text;
  v_first_name text;
begin
  v_meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);

  v_full_name := nullif(trim(coalesce(
    v_meta->>'full_name',
    v_meta->>'name',
    nullif(trim(coalesce(v_meta->'name'->>'firstName','') || ' ' || coalesce(v_meta->'name'->>'lastName','')), ''),
    nullif(trim(coalesce(v_meta->>'given_name','') || ' ' || coalesce(v_meta->>'family_name','')), ''),
    ''
  )), '');

  v_first_name := nullif(trim(coalesce(
    v_meta->>'first_name',
    v_meta->>'given_name',
    v_meta->'name'->>'firstName',
    nullif(split_part(coalesce(v_full_name, ''), ' ', 1), ''),
    ''
  )), '');

  -- Sadece profile.first_name boşsa güncelle
  update public.profiles
  set
    full_name = coalesce(nullif(full_name, ''), v_full_name),
    first_name = coalesce(nullif(first_name, ''), v_first_name),
    updated_at = case
      when (full_name is null or full_name = '') and v_full_name is not null then now()
      when (first_name is null or first_name = '') and v_first_name is not null then now()
      else updated_at
    end
  where id = new.id
    and (
      (first_name is null or first_name = '') and v_first_name is not null
      or (full_name is null or full_name = '') and v_full_name is not null
    );

  return new;
exception when others then
  raise warning 'handle_user_meta_update error for user %: %', new.id, sqlerrm;
  return new;
end;
$$;

drop trigger if exists on_auth_user_meta_updated on auth.users;
create trigger on_auth_user_meta_updated
  after update of raw_user_meta_data on auth.users
  for each row execute function public.handle_user_meta_update();

-- ── 3. Mevcut OAuth kullanıcıları için backfill ─────────────────────────
do $$
declare
  r record;
  v_meta jsonb;
  v_full_name text;
  v_first_name text;
  v_count int := 0;
begin
  for r in
    select u.id, u.raw_user_meta_data
    from auth.users u
    join public.profiles p on p.id = u.id
    where p.first_name is null or p.first_name = ''
  loop
    v_meta := coalesce(r.raw_user_meta_data, '{}'::jsonb);
    v_full_name := nullif(trim(coalesce(
      v_meta->>'full_name',
      v_meta->>'name',
      nullif(trim(coalesce(v_meta->'name'->>'firstName','') || ' ' || coalesce(v_meta->'name'->>'lastName','')), ''),
      nullif(trim(coalesce(v_meta->>'given_name','') || ' ' || coalesce(v_meta->>'family_name','')), ''),
      ''
    )), '');
    v_first_name := nullif(trim(coalesce(
      v_meta->>'first_name',
      v_meta->>'given_name',
      v_meta->'name'->>'firstName',
      nullif(split_part(coalesce(v_full_name, ''), ' ', 1), ''),
      ''
    )), '');

    if v_first_name is not null or v_full_name is not null then
      update public.profiles
      set
        full_name = coalesce(nullif(full_name, ''), v_full_name),
        first_name = coalesce(nullif(first_name, ''), v_first_name),
        updated_at = now()
      where id = r.id;
      v_count := v_count + 1;
    end if;
  end loop;
  raise notice 'Vol-56-A backfill: % kullanıcıda first_name/full_name güncellendi', v_count;
end$$;

comment on function public.handle_new_user is
  'Vol-56-A: OAuth (Apple/Google) + email signup için 5 metadata kaynağından first_name çıkarır.';
comment on function public.handle_user_meta_update is
  'Vol-56-A: auth.users.raw_user_meta_data UPDATE olduğunda (Apple gecikmeli meta vs.) profiles satırını senkronlar. Mevcut dolu alanları ezmez.';

commit;
