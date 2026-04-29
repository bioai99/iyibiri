-- Vol-32 Migration 041: Sponsor admin role + signup requests + RLS write policies.
--
-- Vol-31 sponsors entity'sini kurmuştu ama yazma henüz super-admin'e bağlıydı.
-- Vol-32 sponsor admin'leri ekler:
--   - sponsor_admin_users tablosu (NGO admin pattern: ngo_admin_users)
--   - is_sponsor_admin RPC (auth helper)
--   - RLS write policies — sponsor admin kendi marka kayıtlarını güncelleyebilir
--   - sponsor_signup_requests tablosu (Vol-26 NGO signup pattern)
--   - submit_sponsor_signup_request SECURITY DEFINER function

begin;

-- ─────────────────────────────────────────────────────────────────
-- 1. sponsor_admin_users tablosu (NGO admin pattern)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.sponsor_admin_users (
  id          uuid        primary key default gen_random_uuid(),
  sponsor_id  text        not null references public.sponsors(id) on delete cascade,
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  role        text        not null default 'admin'
              check (role in ('admin', 'editor', 'viewer')),
  created_at  timestamptz not null default now(),
  unique (sponsor_id, user_id)
);

alter table public.sponsor_admin_users enable row level security;

drop policy if exists "Users view own sponsor admin records" on public.sponsor_admin_users;
create policy "Users view own sponsor admin records"
  on public.sponsor_admin_users
  for select
  using (auth.uid() = user_id);

create index if not exists idx_sponsor_admin_user
  on public.sponsor_admin_users (user_id);

-- ─────────────────────────────────────────────────────────────────
-- 2. is_sponsor_admin RPC
-- ─────────────────────────────────────────────────────────────────
create or replace function public.is_sponsor_admin(target_sponsor_id text, target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.sponsor_admin_users
    where sponsor_id = target_sponsor_id
      and user_id = target_user_id
  );
$$;

comment on function public.is_sponsor_admin is
  'Vol-32: sponsor admin auth helper. RLS policy ve UI auth gate için.';

-- ─────────────────────────────────────────────────────────────────
-- 3. Sponsor admin RLS write policies (sponsors / posts / rewards)
-- ─────────────────────────────────────────────────────────────────

-- sponsors tablosu — sponsor admin kendi markasını güncelleyebilir
drop policy if exists "Sponsor admin can update own sponsor" on public.sponsors;
create policy "Sponsor admin can update own sponsor"
  on public.sponsors
  for update
  using (public.is_sponsor_admin(id, auth.uid()))
  with check (public.is_sponsor_admin(id, auth.uid()));

-- posts tablosu — sponsor admin author_type='sponsor' olan kendi post'larını yönetebilir
drop policy if exists "Sponsor admin can manage own posts" on public.posts;
create policy "Sponsor admin can manage own posts"
  on public.posts
  for all
  using (
    author_type = 'sponsor'
    and sponsor_id is not null
    and public.is_sponsor_admin(sponsor_id, auth.uid())
  )
  with check (
    author_type = 'sponsor'
    and sponsor_id is not null
    and public.is_sponsor_admin(sponsor_id, auth.uid())
  );

-- rewards tablosu — sponsor admin kendi sponsor'ına bağlı ödülleri yönetebilir
drop policy if exists "Sponsor admin can manage own rewards" on public.rewards;
create policy "Sponsor admin can manage own rewards"
  on public.rewards
  for all
  using (
    sponsor_id is not null
    and public.is_sponsor_admin(sponsor_id, auth.uid())
  )
  with check (
    sponsor_id is not null
    and public.is_sponsor_admin(sponsor_id, auth.uid())
  );

-- ─────────────────────────────────────────────────────────────────
-- 4. sponsor_signup_requests tablosu (Vol-26 NGO signup pattern)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.sponsor_signup_requests (
  id              uuid        primary key default gen_random_uuid(),
  brand_name      text        not null,
  brand_short     text,
  brand_color     text,
  website         text,
  contact_name    text        not null,
  contact_email   text        not null,
  contact_phone   text,
  tax_number      text,
  description     text,
  status          text        not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  reviewed_by     uuid        references public.profiles(id),
  reviewed_at     timestamptz,
  approved_sponsor_id text    references public.sponsors(id),
  rejection_reason text,
  created_at      timestamptz not null default now()
);

alter table public.sponsor_signup_requests enable row level security;

-- Anonymous insert via SECURITY DEFINER function (no direct insert policy)
-- Sadece super-admin select'leyebilir (Vol-26 NGO signup pattern)
drop policy if exists "Super admin can view sponsor requests" on public.sponsor_signup_requests;
create policy "Super admin can view sponsor requests"
  on public.sponsor_signup_requests
  for select
  using (public.is_super_admin(auth.uid()));

drop policy if exists "Super admin can update sponsor requests" on public.sponsor_signup_requests;
create policy "Super admin can update sponsor requests"
  on public.sponsor_signup_requests
  for update
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

create index if not exists idx_sponsor_signup_status
  on public.sponsor_signup_requests (status, created_at desc);

-- ─────────────────────────────────────────────────────────────────
-- 5. submit_sponsor_signup_request SECURITY DEFINER function
--    (Vol-26.7 pattern: RLS bypass for anonymous signup)
-- ─────────────────────────────────────────────────────────────────
create or replace function public.submit_sponsor_signup_request(
  p_brand_name      text,
  p_brand_short     text,
  p_brand_color     text,
  p_website         text,
  p_contact_name    text,
  p_contact_email   text,
  p_contact_phone   text,
  p_tax_number      text,
  p_description     text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request_id uuid;
begin
  -- Rate limit: aynı email son 24 saatte 3'ten fazla pending request varsa reddet
  if (select count(*) from public.sponsor_signup_requests
      where contact_email = p_contact_email
        and created_at > now() - interval '24 hours'
        and status = 'pending') >= 3 then
    raise exception 'Çok fazla başvuru. 24 saat sonra tekrar deneyin.';
  end if;

  insert into public.sponsor_signup_requests (
    brand_name, brand_short, brand_color, website,
    contact_name, contact_email, contact_phone, tax_number, description
  ) values (
    p_brand_name, p_brand_short, p_brand_color, p_website,
    p_contact_name, p_contact_email, p_contact_phone, p_tax_number, p_description
  )
  returning id into v_request_id;

  return v_request_id;
end $$;

grant execute on function public.submit_sponsor_signup_request to anon, authenticated;

comment on function public.submit_sponsor_signup_request is
  'Vol-32: Sponsor self-signup (Vol-26.7 SECURITY DEFINER pattern). Anonim insert + rate limit.';

commit;

-- DOĞRULAMA:
--   select count(*) from public.sponsor_admin_users;     -- 0 (henüz user assign edilmedi)
--   select public.is_sponsor_admin('patagonia', auth.uid());  -- false
--   select count(*) from public.sponsor_signup_requests; -- 0
