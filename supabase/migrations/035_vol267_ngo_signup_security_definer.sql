-- 035_vol267_ngo_signup_security_definer.sql
-- Vol-26.7 BUG-056 final fix:
--
-- Migration 033/034 ile RLS policy `to anon, authenticated with check (true)`
-- yazıldı ama supabase server client INSERT yine de RLS engeli alıyor.
-- (Olası neden: server action context'de auth role state belirsiz; cookie'siz
-- anon role role match etmiyor olabilir.)
--
-- Production-safe çözüm: SECURITY DEFINER function. Function owner (postgres)
-- haklarıyla çalışır → RLS bypass eder. Anyone (anon + authenticated) RPC ile
-- çağırabilir, insert kontrolü function içinde yapılır.
--
-- Tarih: 2026-04-26 — test-engineer (Vol-26.7)

begin;

create or replace function public.submit_ngo_signup_request(
  p_ngo_name text,
  p_short_name text,
  p_category text,
  p_city text,
  p_website text,
  p_description text,
  p_contact_name text,
  p_contact_email text,
  p_contact_phone text,
  p_reason text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  -- Basit validasyon (server action zaten yaptı ama defense in depth)
  if p_ngo_name is null or length(trim(p_ngo_name)) = 0 then
    raise exception 'STK adı zorunlu';
  end if;
  if p_contact_name is null or length(trim(p_contact_name)) = 0 then
    raise exception 'İletişim kişisi zorunlu';
  end if;
  if p_contact_email is null or position('@' in p_contact_email) = 0 then
    raise exception 'Geçerli e-posta adresi zorunlu';
  end if;
  if p_reason is null or length(trim(p_reason)) < 30 then
    raise exception 'Lütfen en az 30 karakter detay paylaş';
  end if;

  insert into public.ngo_signup_requests (
    ngo_name,
    short_name,
    category,
    city,
    website,
    description,
    contact_name,
    contact_email,
    contact_phone,
    reason
  ) values (
    trim(p_ngo_name),
    nullif(trim(coalesce(p_short_name, '')), ''),
    nullif(trim(coalesce(p_category, '')), ''),
    nullif(trim(coalesce(p_city, '')), ''),
    nullif(trim(coalesce(p_website, '')), ''),
    nullif(trim(coalesce(p_description, '')), ''),
    trim(p_contact_name),
    lower(trim(p_contact_email)),
    nullif(trim(coalesce(p_contact_phone, '')), ''),
    trim(p_reason)
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- Anyone (anon + authenticated) çağırabilir
grant execute on function public.submit_ngo_signup_request(
  text, text, text, text, text, text, text, text, text, text
) to anon, authenticated;

commit;

-- ---------------------------------------------------------------------------
-- Doğrulama (Supabase SQL Editor):
-- select submit_ngo_signup_request(
--   'Test STK', null, 'environment', 'İstanbul', null, null,
--   'Test Person', 'test@example.com', null,
--   'Test reason at least 30 characters long here.'
-- );
-- → uuid dönmeli.
--
-- select id, ngo_name, contact_email, status, created_at
-- from ngo_signup_requests order by created_at desc limit 5;
-- ---------------------------------------------------------------------------
