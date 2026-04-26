-- 034_vol265_ngo_signup_rls_fix.sql
-- Vol-26.5 BUG-056 hotfix:
--
-- Problem: Migration 033 ile yazılan "Anyone can submit signup request" policy
-- `with check (true)` olmasına rağmen INSERT reddediliyor:
--   "new row violates row-level security policy for table ngo_signup_requests"
--
-- Kök neden: Postgres RLS default `to public` her zaman aktif değil. Supabase
-- server client `authenticated` role kullanıyor olabilir; policy explicit role
-- specification olmadan match etmeyebilir.
--
-- Çözüm: Policy'yi `to anon, authenticated` ile explicit yeniden tanımla.
-- (`to public` PostgreSQL'de pseudo-role, anon + authenticated dahil olur ama
-- bazı edge case'lerde davranış değişebilir.)
--
-- Tarih: 2026-04-26 — test-engineer (Vol-26.5)

begin;

-- Eski policy'yi tamamen drop et (ad değişikliği yapmadan, idempotent)
drop policy if exists "Anyone can submit signup request" on public.ngo_signup_requests;

-- Yeniden tanımla — explicit roles
create policy "Anyone can submit signup request"
  on public.ngo_signup_requests
  for insert
  to anon, authenticated
  with check (true);

-- Belki "all" policy başka bir restrictive ile conflict yapıyor — kontrol et
-- (eğer varsa logla, yoksa pas geç)
do $$
declare
  restrictive_count integer;
begin
  select count(*)
    into restrictive_count
  from pg_policies
  where schemaname = 'public'
    and tablename = 'ngo_signup_requests'
    and permissive = 'RESTRICTIVE';

  if restrictive_count > 0 then
    raise notice 'WARN: ngo_signup_requests tablosunda % restrictive policy var', restrictive_count;
  end if;
end $$;

commit;

-- ---------------------------------------------------------------------------
-- Doğrulama:
-- 1. Anon insert (Supabase Dashboard → SQL Editor → Run as anon role veya
--    direkt `set role anon; insert into ngo_signup_requests (...)` yap):
--    insert into public.ngo_signup_requests
--      (ngo_name, contact_name, contact_email, reason)
--    values
--      ('Test STK', 'Test Person', 'test@example.com', 'Test reason 30+ char.');
--    → Başarılı dönmeli.
--
-- 2. Listeyi gör:
-- select id, ngo_name, contact_email, status, created_at
-- from ngo_signup_requests
-- order by created_at desc
-- limit 10;
-- ---------------------------------------------------------------------------
