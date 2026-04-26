-- 033_vol26_ngo_signup_requests.sql
-- Vol-26 BUG-044 fix: STK self-signup MVP
--
-- Problem: Yeni STK'lar platforma katılmak istediğinde sadece destek email
-- (onboarding@iyibiri.app) link vardı. Self-service signup yoktu.
--
-- Çözüm: Public form (anyone can insert) → super-admin queue (review + approve).
-- Approve sonrası super-admin elle ngos table'a insert + ngo_admin_users grant.
-- Tam otomatik onboarding Vol-27+'da (email verification + auto NGO row).
--
-- Tarih: 2026-04-26 — test-engineer (Vol-26)

begin;

-- ---------------------------------------------------------------------------
-- (a) Tablo
-- ---------------------------------------------------------------------------
create table if not exists public.ngo_signup_requests (
  id uuid primary key default gen_random_uuid(),
  -- STK bilgileri
  ngo_name text not null,
  short_name text,
  category text, -- 'environment', 'education', 'animals', 'health', 'disaster', 'community'
  city text,
  website text,
  description text,
  -- İletişim
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  -- Başvuru
  reason text not null, -- "Neden iyiBiri'ye katılmak istiyorsun?"
  -- Review
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'approved', 'rejected')),
  reviewer_notes text,
  reviewed_at timestamptz,
  -- Audit
  created_at timestamptz not null default now()
);

-- Index — super-admin queue için tarih sıralı
create index if not exists ngo_signup_requests_created_at_idx
  on public.ngo_signup_requests(created_at desc);

create index if not exists ngo_signup_requests_status_idx
  on public.ngo_signup_requests(status);

-- ---------------------------------------------------------------------------
-- (b) RLS — Anyone insert, super-admin read+update
-- ---------------------------------------------------------------------------
alter table public.ngo_signup_requests enable row level security;

-- Insert: anonim + giriş yapmış kullanıcı (yeni STK başvuran kişi)
drop policy if exists "Anyone can submit signup request" on public.ngo_signup_requests;
create policy "Anyone can submit signup request"
  on public.ngo_signup_requests
  for insert
  with check (true);

-- Read: sadece super-admin (queue UI için)
drop policy if exists "Super-admins read signup requests" on public.ngo_signup_requests;
create policy "Super-admins read signup requests"
  on public.ngo_signup_requests
  for select
  using (public.is_super_admin(auth.uid()));

-- Update: sadece super-admin (review status + notes)
drop policy if exists "Super-admins update signup requests" on public.ngo_signup_requests;
create policy "Super-admins update signup requests"
  on public.ngo_signup_requests
  for update
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

commit;

-- ---------------------------------------------------------------------------
-- Doğrulama:
-- select count(*), status from ngo_signup_requests group by status;
--
-- Manuel onay (super-admin):
-- update ngo_signup_requests
-- set status='approved', reviewer_notes='OK, NGO row + admin grant tamam', reviewed_at=now()
-- where id='<request_id>';
-- ---------------------------------------------------------------------------
