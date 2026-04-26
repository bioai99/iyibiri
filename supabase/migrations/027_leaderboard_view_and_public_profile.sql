-- Migration 027: Leaderboard view + public profile read access
-- Severity: P0 sistemik (BUG-028)
-- Bug: profiles RLS "Users can view own profile" → leaderboard query sadece kendi profili döner.
--
-- Fix: SECURITY DEFINER view (`leaderboard_top`) — sadece public columns expose,
-- RLS bypass. Leaderboard sayfası bu view'dan okur.
--
-- Tarih: 2026-04-26 (Vol-14)

begin;

-- =====================================================
-- A) Leaderboard view — public top users
-- =====================================================
-- SECURITY DEFINER bypass'lı, sadece güvenli kolonlar expose:
--   id, full_name (display name), karma_total, avatar_type
-- E-posta, city, age_range gibi private alanlar HARİÇ.

create or replace view public.leaderboard_top as
select
  p.id,
  coalesce(nullif(trim(p.full_name), ''), nullif(trim(p.first_name), ''), p.name, 'Bilinmeyen') as display_name,
  p.karma_total,
  p.avatar_type
from public.profiles p
where p.karma_total > 0
order by p.karma_total desc
limit 100;

-- View ownership + grant — anon ve authenticated rolleri de okuyabilsin
alter view public.leaderboard_top set (security_invoker = false);
grant select on public.leaderboard_top to anon, authenticated;

comment on view public.leaderboard_top is
  'BUG-028 fix: leaderboard için SECURITY DEFINER view (top 100 by karma_total). RLS bypass, sadece public-safe columns.';

-- =====================================================
-- B) User rank function — kullanıcının kendi sırası
-- =====================================================

create or replace function public.get_user_rank(target_user_id uuid)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  v_user_karma integer;
  v_rank integer;
begin
  select karma_total into v_user_karma
  from public.profiles
  where id = target_user_id;

  if v_user_karma is null then
    return null;
  end if;

  select count(*) + 1 into v_rank
  from public.profiles
  where karma_total > v_user_karma;

  return v_rank;
end;
$$;

grant execute on function public.get_user_rank to authenticated;

comment on function public.get_user_rank is
  'BUG-028 fix: kullanıcının kendi rank''ını leaderboard sıralamasına göre döner. RLS bypass.';

commit;

-- =====================================================
-- VERIFICATION (manual run after apply)
-- =====================================================
-- 1) Top 10 leaderboard:
-- select * from public.leaderboard_top limit 10;
--
-- 2) Test user rank:
-- select public.get_user_rank('2fb778ae-7c0f-47ed-8cd5-e81212f55673');
