-- Migration 030: Grant +t5 test user TEMA admin role for backoffice testing
-- Severity: P2 (test fixture)
-- Goal: bahadiroylumluu+t5@gmail.com kullanıcısı TEMA Vakfı admin'i yap.
-- Bu test-engineer'in /admin sidebar + AD1-AD15 backoffice flow'larını test edebilmesi için.
-- Tarih: 2026-04-26 (Vol-20)
--
-- Notes:
--   - ngo_admin_users table'ında (user_id, ngo_id) unique constraint var, ON CONFLICT DO NOTHING idempotent
--   - SECURITY DEFINER context (bu migration service_role ile çalışır, RLS bypass)

begin;

insert into public.ngo_admin_users (user_id, ngo_id, role)
select
  u.id,
  'tema',
  'admin'
from auth.users u
where u.email = 'bahadiroylumluu+t5@gmail.com'
on conflict (user_id, ngo_id) do nothing;

commit;

-- =====================================================
-- VERIFICATION (manual)
-- =====================================================
-- select au.role, n.name, p.email
-- from public.ngo_admin_users au
-- join public.profiles p on p.id = au.user_id
-- join public.ngos n on n.id = au.ngo_id
-- where p.email = 'bahadiroylumluu+t5@gmail.com';
