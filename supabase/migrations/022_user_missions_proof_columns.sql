-- 022_user_missions_proof_columns.sql
-- user_missions tablosuna proof görüntülemek için dedicated kolonlar
-- Şu an verification_data jsonb'de gizli — admin verifications UI'da direkt okunabilir kolon olsun
-- Backward compat: eski verification_data korunur
--
-- Tarih: 2026-04-25 — supabase-backend
-- Dependency: migration 013 (mission lifecycle)

begin;

alter table public.user_missions
  add column if not exists proof_type text
    check (proof_type in ('photo', 'code', 'qr', 'auto') or proof_type is null),
  add column if not exists proof_url text,
  add column if not exists submitted_at timestamptz;

comment on column public.user_missions.proof_type is
  'Verification proof tipi — admin verifications UI için. photo: görsel, code: kısa kod, qr: QR tarama, auto: otomatik onay (zincir).';

comment on column public.user_missions.proof_url is
  'Supabase Storage veya external image URL (photo type için zorunlu, diğerleri nullable).';

comment on column public.user_missions.submitted_at is
  'Verification submit zamanı (admin review için ordering). completed_at ile aynı veya sonra.';

-- Index: pending verification kuyruğu hızlı çekmek için
create index if not exists idx_user_missions_pending_review
  on public.user_missions (admin_review_status, submitted_at desc)
  where admin_review_status = 'pending_review';

-- Legacy veri migration: verification_data jsonb'den kolonları doldur (varsa)
update public.user_missions
  set
    proof_type = coalesce(proof_type, verification_data->>'proof_type'),
    proof_url = coalesce(proof_url, verification_data->>'proof_url'),
    submitted_at = coalesce(submitted_at, completed_at)
  where verification_data is not null
    and (proof_type is null or proof_url is null);

commit;
