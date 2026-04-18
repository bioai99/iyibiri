-- Onboarding verileri: ilgi alanları, şehir, arama yarıçapı
alter table public.profiles
  add column if not exists interests text[] default '{}',
  add column if not exists city text,
  add column if not exists search_radius integer default 10;
