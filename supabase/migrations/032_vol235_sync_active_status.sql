-- 032_vol235_sync_active_status.sql
-- Vol-23.5 hotfix BUG-053 (P1 sistemik):
--
-- missions tablosunda iki paralel kolon var:
--   active (boolean) — RLS policy + user-facing app filtresi
--   status (enum: draft/active/cancelled/completed) — backoffice yönetim
--
-- Bunlar sync edilmezse "cancelled" görev kullanıcıda hâlâ görünür çünkü
-- app eq('active', true) filtresi kullanıyor ama backoffice sadece status set ediyor.
--
-- Çözüm:
-- (a) Mevcut row'ları status'e göre rebuild et
-- (b) Trigger ekle — gelecek update'lerde status değişince active otomatik sync
--
-- Tarih: 2026-04-26 — test-engineer (Vol-23.5)

begin;

-- ---------------------------------------------------------------------------
-- (a) Mevcut row'ları sync et — status='active' ise active=true, değilse false
-- ---------------------------------------------------------------------------
update public.missions
set active = (status = 'active')
where active is distinct from (status = 'active');

-- ---------------------------------------------------------------------------
-- (b) Trigger — defense in depth, ileride status set edilirken active drift etmesin
-- ---------------------------------------------------------------------------
create or replace function public.sync_mission_active_from_status()
returns trigger
language plpgsql
as $$
begin
  -- Sadece status değişirse active'i türet
  -- (active manuel set edildiyse status'le çelişmediği sürece dokunma)
  if (tg_op = 'INSERT') then
    -- Insert'te active değeri verilmemişse status'ten türet
    if new.active is null then
      new.active := (new.status = 'active');
    end if;
  elsif (tg_op = 'UPDATE') then
    -- Update'te status değiştiyse active'i sync et
    if new.status is distinct from old.status then
      new.active := (new.status = 'active');
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sync_mission_active on public.missions;
create trigger trg_sync_mission_active
  before insert or update on public.missions
  for each row
  execute function public.sync_mission_active_from_status();

commit;

-- ---------------------------------------------------------------------------
-- Doğrulama:
-- select id, title, active, status,
--        case when active = (status = 'active') then '✓ sync'
--             else '⚠ MISMATCH' end as durum
-- from missions
-- where active is not null
-- order by durum desc, title;
--
-- Beklenen: hiç MISMATCH yok.
-- ---------------------------------------------------------------------------
