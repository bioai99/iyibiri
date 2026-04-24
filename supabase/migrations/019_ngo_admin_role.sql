-- 019_ngo_admin_role.sql
-- STK admin rol sistemi + RLS — P0 #9 (ADR-010 scope).
-- Tarih: 2026-04-24 — supabase-backend
--
-- STK admin kullanıcıları için link table + RLS policies.
-- Bir kullanıcı birden fazla STK'nın admin'i olabilir (multi-tenant).

begin;

-- ============================================================
-- 1. ngo_admin_users — link table (user × ngo × permissions)
-- ============================================================

create table if not exists public.ngo_admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  ngo_id text references public.ngos(id) on delete cascade not null,
  role text not null default 'admin'
    check (role in ('admin', 'editor', 'viewer')),
  permissions jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, ngo_id)
);

comment on table public.ngo_admin_users is
  'STK admin rol atama — ADR-010 Min+ scope. Bir kullanıcı birden fazla STK''nın admin''i olabilir. Role: admin (tam), editor (görev/blog), viewer (sadece oku).';

create index if not exists ngo_admin_users_user_idx
  on public.ngo_admin_users (user_id);
create index if not exists ngo_admin_users_ngo_idx
  on public.ngo_admin_users (ngo_id);

alter table public.ngo_admin_users enable row level security;

-- Kullanıcı kendi admin rol listelerini görebilir
create policy "Users see own admin roles" on public.ngo_admin_users
  for select using (auth.uid() = user_id);

-- Admin rol atamaları sadece super-admin (env var check) veya database-level yapılır
-- RLS insert/update/delete: şimdilik kullanıcı kendi rolünü değiştiremez
-- Super-admin service role (bypass RLS) ile atama yapar

-- ============================================================
-- 2. Helper: is_ngo_admin(user_id, ngo_id) boolean
-- ============================================================

create or replace function public.is_ngo_admin(u uuid, n text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.ngo_admin_users
    where user_id = u and ngo_id = n and role in ('admin', 'editor')
  );
$$;

comment on function public.is_ngo_admin is
  'STK admin kontrolü — RLS policies içinde kullanılır. admin + editor true, viewer false (ayrı fonksiyon gerekirse).';

-- ============================================================
-- 3. RLS policies — ngos tablosunda admin update izni
-- ============================================================
-- Mevcut: ngos herkes okuyabilir (public read). Update yok.
-- Yeni: STK admin kendi NGO'sunu update edebilir (logo, profil, fee config, vs.)

do $$ begin
  create policy "NGO admins update own ngo" on public.ngos
    for update using (public.is_ngo_admin(auth.uid(), id));
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- 4. RLS policies — missions tablosunda admin CRUD
-- ============================================================
-- Mevcut: missions public read (ADR-004 gereği — onboarding öncesi list).
-- Yeni: STK admin kendi NGO'sunun görevlerini CRUD edebilir.

do $$ begin
  create policy "NGO admins insert missions" on public.missions
    for insert with check (public.is_ngo_admin(auth.uid(), ngo_id));
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create policy "NGO admins update missions" on public.missions
    for update using (public.is_ngo_admin(auth.uid(), ngo_id));
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create policy "NGO admins delete missions" on public.missions
    for delete using (public.is_ngo_admin(auth.uid(), ngo_id));
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- 5. RLS policies — posts (blog) tablosunda admin CRUD
-- ============================================================

do $$ begin
  create policy "NGO admins insert posts" on public.posts
    for insert with check (public.is_ngo_admin(auth.uid(), ngo_id));
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create policy "NGO admins update posts" on public.posts
    for update using (public.is_ngo_admin(auth.uid(), ngo_id));
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create policy "NGO admins delete posts" on public.posts
    for delete using (public.is_ngo_admin(auth.uid(), ngo_id));
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- 6. RLS policies — ngo_memberships, user_missions (admin görüntüleme)
-- ============================================================
-- STK admin kendi NGO'suna üye olan kullanıcıları görür (ad+e-posta liste)
-- ve göreve katılım/tamamlama durumlarını görür.

do $$ begin
  create policy "NGO admins view memberships" on public.ngo_memberships
    for select using (public.is_ngo_admin(auth.uid(), ngo_id));
exception
  when duplicate_object then null;
end $$;

-- user_missions için — admin sadece kendi NGO'sunun mission'larına ait olanları görür
do $$ begin
  create policy "NGO admins view user_missions" on public.user_missions
    for select using (
      exists (
        select 1 from public.missions m
        where m.id = user_missions.mission_id
          and public.is_ngo_admin(auth.uid(), m.ngo_id)
      )
    );
exception
  when duplicate_object then null;
end $$;

-- Admin_review_status + admin_feedback update için RLS
do $$ begin
  create policy "NGO admins update user_missions review" on public.user_missions
    for update using (
      exists (
        select 1 from public.missions m
        where m.id = user_missions.mission_id
          and public.is_ngo_admin(auth.uid(), m.ngo_id)
      )
    );
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- 7. Sanity check — schema + role kayıtları
-- ============================================================

do $$
declare
  admin_count int;
begin
  select count(*) into admin_count from public.ngo_admin_users;
  raise notice '[ngo_admin_users]: % kayıt', admin_count;
  raise notice '[RLS policies]: ngos, missions, posts, ngo_memberships, user_missions güncellendi';
end $$;

-- ============================================================
-- 8. Dev helper seed — geliştirme/pilot için ilk admin ataması
-- ============================================================
-- Production'da manuel atama service role ile; burada dev fixture için
-- örnek insertion yorumda:
--
-- insert into public.ngo_admin_users (user_id, ngo_id, role)
-- values ('<user-uuid>', 'tema', 'admin')
-- on conflict (user_id, ngo_id) do nothing;
--
-- `/admin/devtools` içinde "Beni TEMA admin'i yap" butonu eklenecek (dev only).

commit;
