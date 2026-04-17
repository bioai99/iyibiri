-- profiles: auth.users extend
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  avatar_url text,
  karma_total integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  last_active date,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auth trigger: yeni kullanici kaydinda profil olustur
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ngos
create table public.ngos (
  id text primary key,
  name text not null,
  short_name text,
  tagline text,
  description text,
  category text,
  color_accent text,
  logo_url text,
  website text,
  member_count integer default 0,
  volunteer_count integer default 0,
  founded integer
);
alter table public.ngos enable row level security;
create policy "Anyone can view ngos" on public.ngos for select using (true);

-- missions
create table public.missions (
  id text primary key,
  title text not null,
  description text,
  long_description text,
  ngo_id text references public.ngos,
  category text,
  difficulty text check (difficulty in ('easy','medium','hard')),
  karma integer not null default 50,
  duration text,
  domain text check (domain in ('nature','education','social','financial')),
  style text check (style in ('remote','outside','both')),
  verify_method text not null check (verify_method in ('auto','code','photo','qr')),
  verify_code text,
  verify_hint text,
  featured boolean default false,
  active boolean default true,
  steps jsonb default '[]',
  impact_statement text,
  qr_code_data text,
  participants integer default 0
);
alter table public.missions enable row level security;
create policy "Anyone can view active missions" on public.missions for select using (active = true);

-- rewards
create table public.rewards (
  id text primary key,
  title text not null,
  brand text not null,
  brand_logo text,
  description text,
  karma_required integer not null,
  category text,
  active boolean default true
);
alter table public.rewards enable row level security;
create policy "Anyone can view active rewards" on public.rewards for select using (active = true);

-- user_missions
create table public.user_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  mission_id text references public.missions not null,
  status text not null default 'taken' check (status in ('taken','completed')),
  taken_at timestamptz not null default now(),
  completed_at timestamptz,
  verification_data jsonb,
  karma_awarded integer,
  unique(user_id, mission_id)
);
alter table public.user_missions enable row level security;
create policy "Users can view own missions" on public.user_missions for select using (auth.uid() = user_id);
create policy "Users can insert own missions" on public.user_missions for insert with check (auth.uid() = user_id);
create policy "Users can update own missions" on public.user_missions for update using (auth.uid() = user_id);

-- karma_transactions
create table public.karma_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  amount integer not null,
  type text not null check (type in ('mission_complete','reward_redemption')),
  reference_id text,
  description text,
  created_at timestamptz not null default now()
);
alter table public.karma_transactions enable row level security;
create policy "Users can view own karma" on public.karma_transactions for select using (auth.uid() = user_id);
create policy "Users can insert own karma" on public.karma_transactions for insert with check (auth.uid() = user_id);

-- karma trigger: karma_total otomatik guncelle
create or replace function public.update_karma_total()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles
  set karma_total = karma_total + new.amount
  where id = new.user_id;
  return new;
end;
$$;
create trigger on_karma_transaction
  after insert on public.karma_transactions
  for each row execute procedure public.update_karma_total();

-- reward_redemptions
create table public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  reward_id text references public.rewards not null,
  karma_spent integer not null,
  status text not null default 'pending' check (status in ('pending','completed')),
  created_at timestamptz not null default now()
);
alter table public.reward_redemptions enable row level security;
create policy "Users can view own redemptions" on public.reward_redemptions for select using (auth.uid() = user_id);
create policy "Users can insert own redemptions" on public.reward_redemptions for insert with check (auth.uid() = user_id);
