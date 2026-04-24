-- 017_mission_cancel_guardrail.sql
-- Business rule: Tamamlanmış görev iptal edilemez.
-- Tarih: 2026-04-24 — supabase-backend
--
-- Karar kuyruğu Q42-UX (Bahadır 2026-04-24):
--   "Bir görev tamamlandıysa kullanıcılar tarafından iptal edilemez."
--   Yani: STK admin, en az 1 user_missions.status='completed' kaydı
--   bulunan görevi 'cancelled' yapamaz. Ancak 'completed' işaretleyebilir.
--
-- Buradaki 'completed' = etkinlik gerçekleşti (past tense), 'cancelled' =
-- etkinlik YAŞANMAYACAK (future tense). İkisi farklı anlamlar.
--
-- Trigger: before update on missions — status 'cancelled'a geçiş engellenir
-- eğer en az 1 kullanıcı görevi tamamlamışsa.

begin;

-- ============================================================
-- Trigger function
-- ============================================================

create or replace function public.prevent_completed_mission_cancel()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  completion_count int;
begin
  -- Sadece 'cancelled'a GEÇİŞ'te kontrol et (diğer geçişler etkilenmez)
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    select count(*) into completion_count
      from public.user_missions
      where mission_id = new.id
        and status = 'completed';

    if completion_count > 0 then
      raise exception using
        message = format(
          'Bu görev %s kullanıcı tarafından tamamlanmış — iptal edilemez. Ancak ''tamamlandı'' olarak işaretleyebilirsin.',
          completion_count
        ),
        errcode = 'check_violation',
        hint = 'missions.status = ''completed'' deneyin';
    end if;
  end if;

  return new;
end;
$$;

comment on function public.prevent_completed_mission_cancel is
  'Q42-UX business rule — tamamlanmış görev iptal edilemez. STK admin ancak completed işaretleyebilir.';

-- ============================================================
-- Trigger attach
-- ============================================================

drop trigger if exists tg_prevent_completed_mission_cancel on public.missions;

create trigger tg_prevent_completed_mission_cancel
  before update of status on public.missions
  for each row
  when (new.status is distinct from old.status)
  execute function public.prevent_completed_mission_cancel();

-- ============================================================
-- Sanity test — var olan data ile kontrol
-- ============================================================
-- Bu migration'dan ÖNCE m-tema-bozkir-cancelled seed row'u status='cancelled'
-- olarak kayıtlı. Bu row'u update edersek trigger çalışır mı sanity:

do $$
declare
  tema_bozkir_status text;
begin
  select status into tema_bozkir_status
    from public.missions where id = 'm-tema-bozkir-cancelled';

  if tema_bozkir_status is null then
    raise notice '[guardrail test] m-tema-bozkir-cancelled bulunamadı (migration 014 henüz apply edilmemiş olabilir — sorun değil)';
  else
    raise notice '[guardrail test] m-tema-bozkir-cancelled status: %', tema_bozkir_status;
  end if;
end $$;

commit;
