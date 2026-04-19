-- Üyelik tablosu
create table public.ngo_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  ngo_id text references public.ngos not null,
  status text not null default 'active' check (status in ('pending','active','rejected','expired','cancelled')),
  tier text default 'free' check (tier in ('free','basic','premium')),
  form_data jsonb default '{}',
  joined_at timestamptz not null default now(),
  expires_at timestamptz,
  unique(user_id, ngo_id)
);
alter table public.ngo_memberships enable row level security;
create policy "Users can view own memberships" on public.ngo_memberships for select using (auth.uid() = user_id);
create policy "Users can insert own memberships" on public.ngo_memberships for insert with check (auth.uid() = user_id);
create policy "Users can update own memberships" on public.ngo_memberships for update using (auth.uid() = user_id);

-- NGO tablosuna üyelik ayarları
alter table public.ngos
  add column if not exists membership_enabled boolean default true,
  add column if not exists membership_form_fields jsonb default '[]',
  add column if not exists membership_approval_required boolean default false,
  add column if not exists membership_description text,
  add column if not exists membership_terms_url text;
