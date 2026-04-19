-- Kaydedilen görevler (bookmark)
create table public.user_saved_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  mission_id text references public.missions not null,
  saved_at timestamptz not null default now(),
  unique(user_id, mission_id)
);
alter table public.user_saved_missions enable row level security;
create policy "Users can view own saves" on public.user_saved_missions for select using (auth.uid() = user_id);
create policy "Users can insert own saves" on public.user_saved_missions for insert with check (auth.uid() = user_id);
create policy "Users can delete own saves" on public.user_saved_missions for delete using (auth.uid() = user_id);

-- STK bildirimleri (subscribe)
create table public.user_ngo_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  ngo_id text references public.ngos not null,
  subscribed_at timestamptz not null default now(),
  unique(user_id, ngo_id)
);
alter table public.user_ngo_subscriptions enable row level security;
create policy "Users can view own subs" on public.user_ngo_subscriptions for select using (auth.uid() = user_id);
create policy "Users can insert own subs" on public.user_ngo_subscriptions for insert with check (auth.uid() = user_id);
create policy "Users can delete own subs" on public.user_ngo_subscriptions for delete using (auth.uid() = user_id);

-- Streak kolonları profiles'a ekle
alter table public.profiles
  add column if not exists current_streak integer not null default 0,
  add column if not exists longest_streak integer not null default 0,
  add column if not exists last_mission_week text;
