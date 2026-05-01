-- migration NNN_konu.sql
-- Tarih: YYYY-MM-DD
-- Owner: supabase-backend
-- Bağlı ADR / Workstream: ADR-XXX, WS-XX
--
-- Amaç: [1-2 cümle açıklama]
--
-- Rollback notu:
--   - drop table public.X cascade;  -- yeni tablo rollback'i
--   - alter table public.Y drop column Z;  -- kolon ekleme rollback'i
--   - drop policy if exists "..." on public.X;  -- policy rollback'i
--
-- ADR-016 Accepted (2026-04-26): yeni migration'lar bu template'i kullanır.

begin;

-- ─────────────────────────────────────────────────────────────
-- 1. Schema (DDL)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.X (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('pending', 'active', 'cancelled')),
  amount numeric(10, 2) not null check (amount >= 0),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- Idempotent kolon ekleme (mevcut tabloya):
-- alter table public.Y
--   add column if not exists new_col text,
--   add column if not exists another_col integer not null default 0;

-- ─────────────────────────────────────────────────────────────
-- 2. RLS — yeni tabloda zorunlu (security default)
-- ─────────────────────────────────────────────────────────────

alter table public.X enable row level security;

-- Drop-then-create pattern idempotent policy için:
drop policy if exists "Users view own X" on public.X;
create policy "Users view own X" on public.X
  for select using (auth.uid() = user_id);

drop policy if exists "Users insert own X" on public.X;
create policy "Users insert own X" on public.X
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own X" on public.X;
create policy "Users update own X" on public.X
  for update using (auth.uid() = user_id);

-- NGO admin / super admin için ekstra policy (gerekiyorsa):
-- drop policy if exists "NGO admins view all X" on public.X;
-- create policy "NGO admins view all X" on public.X
--   for select using (public.is_ngo_admin(auth.uid(), ngo_id));

-- ─────────────────────────────────────────────────────────────
-- 3. Index — FK + sık where koşulu kolonları
-- ─────────────────────────────────────────────────────────────

-- Single-column index (FK ve sık filter):
create index if not exists X_user_idx on public.X(user_id);
create index if not exists X_status_idx on public.X(status);
create index if not exists X_created_idx on public.X(created_at desc);

-- Composite index — sık (user_id, status) kombinasyonu için
create index if not exists X_user_status_idx on public.X(user_id, status);

-- ─────────────────────────────────────────────────────────────
-- 4. Trigger / Function (gerekiyorsa)
-- ─────────────────────────────────────────────────────────────

create or replace function public.update_X_timestamp()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists on_X_update on public.X;
create trigger on_X_update
  before update on public.X
  for each row execute procedure public.update_X_timestamp();

-- ─────────────────────────────────────────────────────────────
-- 5. Seed (opsiyonel)
-- ─────────────────────────────────────────────────────────────

-- insert into public.X (user_id, status, amount)
-- values
--   ('uuid-1', 'active', 100.00),
--   ('uuid-2', 'pending', 50.00)
-- on conflict do nothing;  -- idempotent

-- ─────────────────────────────────────────────────────────────
-- 6. Backfill (sonradan eklenen kolonlar için)
-- ─────────────────────────────────────────────────────────────

-- update public.Y
--   set new_col = 'default_value'
--   where new_col is null;
-- -- where ... is null koşulu re-apply'da idempotent (0 satır günceller).

commit;

-- ─────────────────────────────────────────────────────────────
-- Apply sonrası test (opsiyonel — Supabase MCP ile):
-- ─────────────────────────────────────────────────────────────
-- 1. EXPLAIN ANALYZE: index'lerin gerçekten kullanıldığını doğrula
-- 2. RLS test: farklı user_id ile select/insert/update — policy doğru mu?
-- 3. Re-apply test: aynı migration'ı 2 kere çalıştır — hata vermez mi?
-- 4. Rollback test: rollback notlarındaki komutları çalıştır — temiz mi?
