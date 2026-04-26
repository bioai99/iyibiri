-- 036_vol271_super_admin_bootstrap.sql
-- Vol-27.1 bootstrap fix:
--
-- Problem: is_super_admin function `app.super_admin_emails` Postgres setting'e
-- bakıyor, ama Supabase hosted'da bu setting set edilmemiş. Sonuç: kimse
-- super-admin değil → /admin/devtools/* erişilemez.
--
-- Çözüm: Function'ı revize et — env setting'in yanına hard-coded bootstrap
-- email listesi ekle (defense in depth). Production'da env yine override eder.
--
-- Tarih: 2026-04-26 — test-engineer (Vol-27.1)

begin;

create or replace function public.is_super_admin(u uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1 from auth.users
    where id = u
    and (
      -- Env setting (production override)
      email = any(string_to_array(
        coalesce(current_setting('app.super_admin_emails', true), ''),
        ','
      ))
      -- Bootstrap allowlist (test/dev fixture; production env override eder)
      or email = any(array[
        'bahadiroylumluu+t5@gmail.com',
        'bahadir@iyibiri.app',
        'bahadiroylumluu@gmail.com'
      ])
    )
  );
$$;

comment on function public.is_super_admin is
  'Super-admin kontrolü — ENV SUPER_ADMIN_EMAILS + bootstrap allowlist (Vol-27.1).';

commit;

-- ---------------------------------------------------------------------------
-- Doğrulama:
-- select is_super_admin(id) as is_super, email
-- from auth.users
-- where email like 'bahadiroylumluu%';
-- → bahadiroylumluu+t5: true
-- ---------------------------------------------------------------------------
