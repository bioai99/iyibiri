-- 016_ngo_documents_verify_simplify.sql
-- Yasal doküman yönetimi + verification simplification.
-- Tarih: 2026-04-24 — supabase-backend
--
-- Karar kuyruğu 2026-04-24:
--   Q41-UX sonrası iki kritik:
--   1. STK backoffice'e KVKK + Üyelik Sözleşmesi + Gönüllülük Sözleşmesi
--      PDF/URL yükleme alanları (Bahadır onay)
--   2. V1'de photo verification gizli — sadece QR / Code / Auto admin UI'da
--      gösterilir. Photo kodda kalıyor (breaking change yok), ama seed'teki
--      HAYTAP mama görevi 'code' yöntemine çevrilir.

begin;

-- ============================================================
-- 1. Doküman kolonları — ngos tablosu
-- ============================================================

alter table public.ngos
  add column if not exists kvkk_document_url text,
  add column if not exists membership_contract_url text,
  add column if not exists volunteer_consent_url text;

comment on column public.ngos.kvkk_document_url is
  'STK''nın KVKK Aydınlatma Metni (PDF/URL). Üyelik + görev onayında kullanıcıya gösterilir. Supabase Storage path veya dış URL.';

comment on column public.ngos.membership_contract_url is
  'Paralı üyelik sözleşmesi — Tüketici Kanunu 6502 çerçevesinde. Üyelik akışında onay gerektirir. Mevcut `membership_terms_url` ile dublike — V1.1''de konsolide edilir.';

comment on column public.ngos.volunteer_consent_url is
  'Hafif gönüllülük onayı — public mission için KVKK destekleyici PDF. Opsiyonel (yüklenmezse inline metin yeterli).';

-- ============================================================
-- 2. HAYTAP mama görevi — photo → code
-- ============================================================
-- Q41-UX Yol D: Photo verification V1'de kullanımı minimize. HAYTAP'ın
-- sokak hayvanı mama dağıtımı için STK yetkili gönüllüden kod verebilir
-- ("MAMA2026" gibi) veya QR kullanabilir.

update public.missions
  set verify_method = 'code',
      verify_code = 'MAMA2026',
      verify_hint = 'Dağıtım sonunda Haytap koordinatöründen kodu al.'
  where id = 'm-haytap-mama'
    and verify_method = 'photo';

-- Not: verify_method DB constraint'i 'photo' değerini yine kabul ediyor —
-- V1.1'de bir STK "photo lazım" derse ekleme kolay. UI tarafında default
-- gösterilmiyor.

-- ============================================================
-- Sanity check
-- ============================================================

do $$
declare
  methods_in_use text[];
begin
  select array_agg(distinct verify_method) into methods_in_use
    from public.missions where status = 'active';
  raise notice '[verify_method active missions]: %', methods_in_use;
end $$;

commit;
