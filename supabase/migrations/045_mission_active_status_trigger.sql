-- migration 045_mission_active_status_trigger.sql
-- Tarih: 2026-04-26
-- Owner: supabase-backend (system-architect örnek; supabase-backend review)
-- Bağlı: ADR-016 Accepted (Migration template), v2 audit SS-006 + TD-029
--
-- Amaç: missions.active boolean ile missions.status enum sync'i DB trigger ile otomatize et.
-- Eski durum: server action'larda manuel `statusToActive(status)` çağrısı (BUG-053 fix).
-- Risk: race condition / drift. Trigger ile DB tarafında garanti altına alınır.
--
-- Rollback notu:
--   drop trigger if exists on_mission_status_change on public.missions;
--   drop function if exists public.sync_mission_active();

begin;

-- 1. Trigger function — status değişiminde active otomatik türetilir
create or replace function public.sync_mission_active()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.active := (new.status = 'active');
  return new;
end;
$$;

-- 2. Trigger — insert + update of status
drop trigger if exists on_mission_status_change on public.missions;
create trigger on_mission_status_change
  before insert or update of status on public.missions
  for each row execute procedure public.sync_mission_active();

-- 3. Mevcut satırları sync (idempotent backfill)
update public.missions
  set active = (status = 'active')
  where active is distinct from (status = 'active');

commit;

-- Apply sonrası test:
--   1. INSERT INTO missions (status='draft', ...) → active = false (otomatik)
--   2. UPDATE missions SET status='active' WHERE id=X → active = true (otomatik)
--   3. UPDATE missions SET status='cancelled' WHERE id=X → active = false (otomatik)
--
-- Server action tarafında `statusToActive` çağrısı kalsa da zarar vermez (idempotent);
-- ama gelecek refactor'da silinebilir (lib/admin/missions-actions.ts:22-24).
