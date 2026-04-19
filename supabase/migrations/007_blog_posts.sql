-- İyilik Öncüsü blog/post sistemi
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  ngo_id text references public.ngos not null,
  title text not null,
  summary text,
  content text,
  cover_image_url text,
  category text check (category in ('article','update','story','tip')),
  read_time integer default 3,
  published boolean default true,
  created_at timestamptz not null default now()
);
alter table public.posts enable row level security;
create policy "Anyone can view published posts" on public.posts for select using (published = true);

-- Post beğenileri
create table public.post_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  post_id uuid references public.posts on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(user_id, post_id)
);
alter table public.post_likes enable row level security;
create policy "Users can view own likes" on public.post_likes for select using (auth.uid() = user_id);
create policy "Users can insert own likes" on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Users can delete own likes" on public.post_likes for delete using (auth.uid() = user_id);
