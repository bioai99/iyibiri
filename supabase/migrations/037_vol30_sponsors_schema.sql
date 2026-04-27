-- Vol-30 Migration 037: Sponsors schema + posts.author_type + rewards.sponsor_id NOT NULL
--
-- Bağlam (Bahadır kararı, 2026-04-26):
--   "Reward'lar her zaman sponsor markalar tarafından verilecek."
--   Posts tarafında da sponsor markalar olacak (NGO + sponsor karma rail).
--
-- Bu migration:
--   1. public.sponsors tablosu (NGO benzeri minimal entity)
--   2. Mevcut rewards.brand string'lerinden sponsors'a backfill
--   3. rewards.sponsor_id (NOT NULL) kolonu eklenir, brand'den slug ile bağlanır
--   4. posts.author_type ('ngo' | 'sponsor') + posts.sponsor_id eklenir
--   5. posts.ngo_id nullable yapılır (sponsor postlarında NULL olur)
--   6. Check constraint: tam olarak biri (ngo_id XOR sponsor_id) NULL olmamalı
--   7. RLS: anyone can view active sponsors; admin yazma Vol-31'de
--
-- Vol-31 backlog (bu migration KAPSAM DIŞI, sadece şema):
--   - sponsor_admin_users role + RLS write policy
--   - /admin/sponsor/[sponsorId] backoffice
--   - /onboarding/sponsor self-signup
--   - /dashboard/sponsors/[id] public profile

begin;

-- ─────────────────────────────────────────────────────────────────
-- 1. sponsors tablosu
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.sponsors (
  id              text        primary key,
  name            text        not null,
  short_name      text,
  brand_color     text,            -- hex: #RRGGBB (rail kart kenarı için)
  logo_url        text,
  cover_url       text,
  description     text,
  website         text,
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now()
);

alter table public.sponsors enable row level security;

drop policy if exists "Anyone can view active sponsors" on public.sponsors;
create policy "Anyone can view active sponsors"
  on public.sponsors
  for select
  using (is_active = true);

-- ─────────────────────────────────────────────────────────────────
-- 2. Mevcut rewards.brand'dan distinct sponsor seed
--    Slug: lower + non-alnum→'-' + trim
-- ─────────────────────────────────────────────────────────────────
insert into public.sponsors (id, name, short_name, brand_color, is_active)
select
  trim(both '-' from regexp_replace(lower(brand), '[^a-z0-9]+', '-', 'g')) as id,
  brand                                                                    as name,
  brand                                                                    as short_name,
  '#C8553D'                                                                as brand_color, -- default clay; admin sonra düzenler
  true                                                                     as is_active
from (
  select distinct brand
  from public.rewards
  where brand is not null and length(trim(brand)) > 0
) s
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────
-- 3. rewards.sponsor_id (önce nullable, backfill, sonra NOT NULL)
-- ─────────────────────────────────────────────────────────────────
alter table public.rewards
  add column if not exists sponsor_id text references public.sponsors(id);

update public.rewards
set sponsor_id = trim(both '-' from regexp_replace(lower(brand), '[^a-z0-9]+', '-', 'g'))
where sponsor_id is null
  and brand is not null;

-- Yetim reward varsa migration patlasın (asla ölü FK kalmasın)
do $$
declare
  orphan_count int;
begin
  select count(*) into orphan_count
  from public.rewards
  where sponsor_id is null;

  if orphan_count > 0 then
    raise exception 'Vol-30 Migration 037: % reward sponsor''a bağlanamadı, brand alanı boş olabilir.', orphan_count;
  end if;
end $$;

alter table public.rewards
  alter column sponsor_id set not null;

-- ─────────────────────────────────────────────────────────────────
-- 4. posts.author_type + posts.sponsor_id + ngo_id nullable
-- ─────────────────────────────────────────────────────────────────
alter table public.posts
  add column if not exists author_type text not null default 'ngo'
    check (author_type in ('ngo', 'sponsor'));

alter table public.posts
  add column if not exists sponsor_id text references public.sponsors(id);

-- Mevcut postların hepsi NGO yazarı, dokunma. Sadece sponsor seçeneği için ngo_id nullable yap:
alter table public.posts
  alter column ngo_id drop not null;

-- 5. Check constraint: posts.ngo_id XOR posts.sponsor_id (tam biri dolu)
alter table public.posts
  drop constraint if exists posts_author_xor;

alter table public.posts
  add constraint posts_author_xor
  check (
    (author_type = 'ngo'     and ngo_id     is not null and sponsor_id is null)
    or
    (author_type = 'sponsor' and sponsor_id is not null and ngo_id     is null)
  );

-- ─────────────────────────────────────────────────────────────────
-- 6. Index — dashboard SponsorPostsRail için
-- ─────────────────────────────────────────────────────────────────
create index if not exists idx_posts_author_type_created
  on public.posts (author_type, created_at desc)
  where published = true;

create index if not exists idx_rewards_sponsor_active
  on public.rewards (sponsor_id, active);

commit;

-- DOĞRULAMA SORGULARI (manuel kontrol için):
--
--   select count(*) from public.sponsors;                   -- ≥ 6 olmalı (mevcut 6 brand)
--   select count(*) from public.rewards where sponsor_id is null;  -- 0 olmalı
--   select s.name, count(r.id) as reward_count
--     from public.sponsors s
--     left join public.rewards r on r.sponsor_id = s.id
--     group by s.name order by reward_count desc;
--
--   -- Posts şema kontrolü:
--   select column_name, is_nullable, data_type
--     from information_schema.columns
--     where table_schema='public' and table_name='posts'
--     order by ordinal_position;
