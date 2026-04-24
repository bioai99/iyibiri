-- 015_mission_access_level.sql
-- Yol D — Per-mission visibility. Her görev STK tarafından "herkese açık"
-- veya "sadece üyelerime" olarak işaretlenir.
--
-- Karar kuyruğu Q40-UX (Bahadır 2026-04-24):
--   Her görevin access_level'i vardır:
--     - 'public' (default) → herkes katılabilir, hafif KVKK onayı yeterli
--     - 'members_only' → sadece aktif NGO üyesi (ngo_memberships.status='active')
--
-- FSM derive (lib/missions/state.ts) bu kolonu okuyup `requires_membership`
-- state'ini sadece members_only görevler için tetikler.
--
-- Tarih: 2026-04-24 — supabase-backend

begin;

-- ============================================================
-- 1. missions.access_level
-- ============================================================

alter table public.missions
  add column if not exists access_level text default 'public';

-- Existing row'lar için default (idempotency)
update public.missions set access_level = 'public' where access_level is null;

do $$ begin
  alter table public.missions
    add constraint missions_access_level_check
      check (access_level in ('public', 'members_only'));
exception
  when duplicate_object then null;
end $$;

comment on column public.missions.access_level is
  'Görev erişim seviyesi. public = herkes katılabilir (hafif KVKK). members_only = sadece aktif NGO üyesi. STK admin paneli üzerinden STK yönetir.';

-- ============================================================
-- 2. Filter index — access_level bazlı sorgu performansı
-- ============================================================

create index if not exists missions_access_level_idx
  on public.missions (access_level);

comment on index missions_access_level_idx is
  'Public vs members_only filtering — dashboard recommendations + FSM derive.';

-- ============================================================
-- 3. Seed düzeltmesi — TEGV okuma atölyesi members_only
-- ============================================================
-- Çocukla 1:1 etkileşim olan görevler pre-screening ister — TEGV pilot senaryosu.

update public.missions
  set access_level = 'members_only'
  where id = 'm-tegv-okuma'
    and access_level = 'public';  -- sadece hâlâ public ise güncelle

-- Diğer 11 mission 'public' kalır (migration 014 seed'i ile uyumlu).

-- ============================================================
-- Sanity check
-- ============================================================

do $$
declare
  public_count int;
  members_only_count int;
begin
  select count(*) into public_count from public.missions where access_level = 'public';
  select count(*) into members_only_count from public.missions where access_level = 'members_only';
  raise notice '[access_level] public: %, members_only: %', public_count, members_only_count;
end $$;

commit;
