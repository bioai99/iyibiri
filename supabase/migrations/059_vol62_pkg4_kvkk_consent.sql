-- Vol-62 Migration 059: Pkg-4 KVKK Consent Column (P0 Yasal Compliance)
-- Tarih: 2026-05-03
--
-- Sorun: Kullanıcı signup'ta KVKK checkbox işaretliyor AMA DB'ye yazılmıyor —
-- yasal denetimde "kim ne zaman onayladı, hangi versiyon" sorusuna cevap yok.
--
-- Çözüm:
--   1. profiles.kvkk_accepted_at TIMESTAMPTZ — onay timestamp (NULL ise henüz kabul etmemiş)
--   2. profiles.kvkk_version VARCHAR(20) — onay verilen KVKK metin versiyonu
--      (gelecekte KVKK güncellenirse re-consent prompt'u tetiklemek için)
--   3. handle_new_user trigger güncelle: raw_user_meta_data'dan oku → set
--   4. Backfill: mevcut tüm kullanıcılara legacy KVKK (signup'ta zorlu olduğu için
--      hepsi onayladı sayılır) version='legacy-pre-vol62' + accepted_at=created_at
--   5. Index: kvkk_accepted_at IS NULL filter için partial index (compliance dashboard)
--
-- Idempotent: column add if not exists, backfill where NULL, trigger replace.

begin;

-- ──────────────────────────────────────────────────────────────────
-- 1. Column'lar — kvkk_accepted_at + kvkk_version
-- ──────────────────────────────────────────────────────────────────

alter table public.profiles
  add column if not exists kvkk_accepted_at timestamptz;

alter table public.profiles
  add column if not exists kvkk_version varchar(20);

comment on column public.profiles.kvkk_accepted_at is
  'Vol-62 Pkg-4: KVKK aydinlatma metni kabul timestamp. NULL = henuz kabul etmemis.';

comment on column public.profiles.kvkk_version is
  'Vol-62 Pkg-4: Onay verilen KVKK metin versiyonu (orn: 2026-05-03). Versiyon degisince re-consent prompt tetiklenir.';

-- ──────────────────────────────────────────────────────────────────
-- 2. Backfill: mevcut user'lar (signup'ta KVKK zorunlu olduğu için hepsi onayladı)
-- ──────────────────────────────────────────────────────────────────

update public.profiles
set
  kvkk_accepted_at = coalesce(kvkk_accepted_at, created_at, now()),
  kvkk_version = coalesce(kvkk_version, 'legacy-pre-vol62')
where kvkk_accepted_at is null
   or kvkk_version is null;

-- ──────────────────────────────────────────────────────────────────
-- 3. handle_new_user trigger güncelle — raw_user_meta_data'dan oku
-- ──────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_kvkk_at timestamptz;
  v_kvkk_ver varchar(20);
  v_full_name text;
begin
  -- Vol-56-A: Apple/Google OAuth full_name extraction (mevcut)
  v_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(coalesce(new.email, ''), '@', 1)
  );

  -- Vol-62 Pkg-4: KVKK onay parse (signup form gönderirse)
  -- raw_user_meta_data->>'kvkk_accepted_at' ISO string olarak gelir
  begin
    v_kvkk_at := (new.raw_user_meta_data->>'kvkk_accepted_at')::timestamptz;
  exception when others then
    v_kvkk_at := null;
  end;

  v_kvkk_ver := nullif(new.raw_user_meta_data->>'kvkk_version', '');

  insert into public.profiles (id, name, kvkk_accepted_at, kvkk_version)
  values (new.id, v_full_name, v_kvkk_at, v_kvkk_ver)
  on conflict (id) do update set
    name = coalesce(excluded.name, public.profiles.name),
    kvkk_accepted_at = coalesce(excluded.kvkk_accepted_at, public.profiles.kvkk_accepted_at),
    kvkk_version = coalesce(excluded.kvkk_version, public.profiles.kvkk_version);

  return new;
end;
$$;

comment on function public.handle_new_user is
  'Vol-62 Pkg-4: Yeni signup icin profil yarat + raw_user_meta_data.kvkk_accepted_at + kvkk_version persist et.';

-- ──────────────────────────────────────────────────────────────────
-- 4. Partial index — compliance dashboard ("KVKK onaysız kullanıcılar")
-- ──────────────────────────────────────────────────────────────────

create index if not exists idx_profiles_kvkk_pending
  on public.profiles (id)
  where kvkk_accepted_at is null;

-- ──────────────────────────────────────────────────────────────────
-- 5. Validation
-- ──────────────────────────────────────────────────────────────────

do $$
declare
  v_total int;
  v_with_consent int;
  v_without_consent int;
  v_legacy_backfill int;
begin
  select count(*) into v_total from public.profiles;
  select count(*) into v_with_consent from public.profiles where kvkk_accepted_at is not null;
  select count(*) into v_without_consent from public.profiles where kvkk_accepted_at is null;
  select count(*) into v_legacy_backfill from public.profiles where kvkk_version = 'legacy-pre-vol62';

  raise notice '[059_vol62 Pkg-4] total profiles: %, with KVKK consent: %, without: % (should be 0 after backfill), legacy backfilled: %',
    v_total, v_with_consent, v_without_consent, v_legacy_backfill;
end $$;

commit;
