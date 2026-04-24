-- 021_ngo_admin_rls_policies.sql
-- STK admin RLS policies + eksik ngos kolonları
-- P0 #9 ADR-010 implementation — admin yazma politikaları + super-admin bypass
-- Tarih: 2026-04-24 — supabase-backend
--
-- Kapsam:
--   1. Eksik ngos kolonları (email, phone, sosyal linker)
--   2. is_super_admin(user_id) helper
--   3. Admin RLS policies (missions, user_missions, ngos, blog_posts, ngo_documents, ngo_memberships)
--   4. Super-admin policy'ler (tüm STK'lara erişim)
--
-- Rollback: migration 019'daki ngo_admin_users gerekli. Eksik kolonlar ADD column, policy'ler DROP policy.

begin;

-- ============================================================
-- 1. Eksik kolonlar — ngos tablosuna (idempotent)
-- ============================================================

alter table public.ngos
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists cover_image_url text,
  add column if not exists social_instagram text,
  add column if not exists social_twitter text,
  add column if not exists social_linkedin text;

comment on column public.ngos.email is
  'STK iletişim e-postası — backoffice profil sayfasından admin tarafından doldurulur.';
comment on column public.ngos.phone is
  'STK iletişim telefon — backoffice profil sayfasından admin tarafından doldurulur.';
comment on column public.ngos.cover_image_url is
  'STK kapak görseli (hero/cover) — backoffice profil sayfasından Supabase Storage''a upload.';
comment on column public.ngos.social_instagram is
  'Instagram handle (opsiyonel) — STK sosyal media link backoffice''te doldurulur.';
comment on column public.ngos.social_twitter is
  'Twitter handle (opsiyonel) — STK sosyal media link backoffice''te doldurulur.';
comment on column public.ngos.social_linkedin is
  'LinkedIn profile (opsiyonel) — STK sosyal media link backoffice''te doldurulur.';

-- ============================================================
-- 2. is_super_admin helper — ENV SUPER_ADMIN_EMAILS based
-- ============================================================

create or replace function public.is_super_admin(u uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1 from auth.users
    where id = u
    and email = any(string_to_array(
      coalesce(current_setting('app.super_admin_emails', true), ''),
      ','
    ))
  );
$$;

comment on function public.is_super_admin is
  'Super-admin kontrolü — ENV SUPER_ADMIN_EMAILS (virgül ayrılmış) listesine karşı. Pilot: platform ekibi için.';

-- ============================================================
-- 3. Missions — admin write policy (kendi STK'sına)
-- ============================================================

-- Drop existing (idempotent)
drop policy if exists "NGO admins insert missions" on public.missions;
drop policy if exists "NGO admins update missions" on public.missions;
drop policy if exists "NGO admins delete missions" on public.missions;
drop policy if exists "Super admins manage all missions" on public.missions;

-- Insert: admin kendi STK'sının görevini oluşturabilir
create policy "NGO admins insert missions" on public.missions
  for insert
  with check (public.is_ngo_admin(auth.uid(), ngo_id));

-- Update: admin kendi STK'sının görevini düzenleyebilir
create policy "NGO admins update missions" on public.missions
  for update
  using (public.is_ngo_admin(auth.uid(), ngo_id))
  with check (public.is_ngo_admin(auth.uid(), ngo_id));

-- Delete: admin kendi STK'sının görevini silebilir (soft-delete via status)
create policy "NGO admins delete missions" on public.missions
  for delete
  using (public.is_ngo_admin(auth.uid(), ngo_id));

-- Super-admin: tüm görevleri yönetebilir
create policy "Super admins manage all missions" on public.missions
  for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- ============================================================
-- 4. User_missions — admin review update (verification flow)
-- ============================================================

drop policy if exists "NGO admins update user_missions review" on public.user_missions;
drop policy if exists "NGO admins view user_missions" on public.user_missions;

-- Admin sadece kendi STK'sının görevini alan user'ların user_missions kaydını UPDATE edebilir (admin_review_status, admin_feedback)
create policy "NGO admins update user_missions review" on public.user_missions
  for update
  using (
    exists(
      select 1 from public.missions m
      where m.id = user_missions.mission_id
      and public.is_ngo_admin(auth.uid(), m.ngo_id)
    )
  )
  with check (
    exists(
      select 1 from public.missions m
      where m.id = user_missions.mission_id
      and public.is_ngo_admin(auth.uid(), m.ngo_id)
    )
  );

-- Admin kendi STK'sının user_missions görüntüleyebilir
create policy "NGO admins view user_missions" on public.user_missions
  for select
  using (
    exists(
      select 1 from public.missions m
      where m.id = user_missions.mission_id
      and public.is_ngo_admin(auth.uid(), m.ngo_id)
    )
  );

-- Super-admin: tüm user_missions'ları yönetebilir
drop policy if exists "Super admins manage all user_missions" on public.user_missions;
create policy "Super admins manage all user_missions" on public.user_missions
  for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- ============================================================
-- 5. Ngos — admin update own STK profile
-- ============================================================

drop policy if exists "NGO admins update own ngo" on public.ngos;
drop policy if exists "Super admins update all ngos" on public.ngos;

create policy "NGO admins update own ngo" on public.ngos
  for update
  using (public.is_ngo_admin(auth.uid(), id))
  with check (public.is_ngo_admin(auth.uid(), id));

create policy "Super admins update all ngos" on public.ngos
  for update
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- ============================================================
-- 6. Posts (blog) — admin manage own STK posts
-- ============================================================

drop policy if exists "NGO admins insert posts" on public.posts;
drop policy if exists "NGO admins update posts" on public.posts;
drop policy if exists "NGO admins delete posts" on public.posts;
drop policy if exists "Super admins manage all posts" on public.posts;

create policy "NGO admins insert posts" on public.posts
  for insert
  with check (public.is_ngo_admin(auth.uid(), ngo_id));

create policy "NGO admins update posts" on public.posts
  for update
  using (public.is_ngo_admin(auth.uid(), ngo_id))
  with check (public.is_ngo_admin(auth.uid(), ngo_id));

create policy "NGO admins delete posts" on public.posts
  for delete
  using (public.is_ngo_admin(auth.uid(), ngo_id));

create policy "Super admins manage all posts" on public.posts
  for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- ============================================================
-- 7. Ngo_memberships — admin view own STK members (KVKK minimal — select only)
-- ============================================================

drop policy if exists "NGO admins view memberships" on public.ngo_memberships;
drop policy if exists "Super admins manage all memberships" on public.ngo_memberships;

create policy "NGO admins view memberships" on public.ngo_memberships
  for select
  using (public.is_ngo_admin(auth.uid(), ngo_id));

create policy "Super admins manage all memberships" on public.ngo_memberships
  for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- ============================================================
-- 8. Ngo_admin_users — super-admin rol atama policy
-- ============================================================

drop policy if exists "Super admins manage all admin roles" on public.ngo_admin_users;
drop policy if exists "Users see own admin roles" on public.ngo_admin_users;

-- Kullanıcılar kendi admin rol listelerini görebilir
create policy "Users see own admin roles" on public.ngo_admin_users
  for select
  using (auth.uid() = user_id);

-- Super-admin tüm admin rol atamalarını yönetebilir (insert, update, delete)
create policy "Super admins manage all admin roles" on public.ngo_admin_users
  for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- ============================================================
-- 9. Sanity check — policy'ler kuruldu mu
-- ============================================================

do $$
declare
  ngos_col_count int;
  missions_policy_count int;
  is_super_fn_exists boolean;
begin
  -- Check ngos kolonları
  select count(*) into ngos_col_count
    from information_schema.columns
    where table_name = 'ngos'
    and column_name in ('email', 'phone', 'cover_image_url', 'social_instagram', 'social_twitter', 'social_linkedin');

  -- Check missions policies
  select count(*) into missions_policy_count
    from pg_policies
    where tablename = 'missions'
    and policyname like '%admin%' or policyname like '%super%';

  -- Check is_super_admin function
  select exists(select 1 from pg_proc where proname = 'is_super_admin') into is_super_fn_exists;

  raise notice '[021_admin_rls] ngos yeni kolonlar: %, missions policies: %, is_super_admin fn: %',
    ngos_col_count, missions_policy_count, is_super_fn_exists;
end $$;

commit;
