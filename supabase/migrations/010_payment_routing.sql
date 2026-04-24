-- 010_payment_routing.sql
-- ADR-008 v2 — 3-modlu hibrit payment routing (Embedded + Passthrough + Marketplace)
-- Tarih: 2026-04-24
--
-- STK başına payment mode + processor adapter + attribution altyapısı.

begin;

-- Payment mode enum (3 mod)
do $$ begin
  create type payment_mode as enum ('embedded', 'passthrough', 'marketplace');
exception
  when duplicate_object then null;
end $$;

-- Processor türü
do $$ begin
  create type payment_processor as enum ('iyzico', 'paytr', 'fonzip', 'custom', 'none');
exception
  when duplicate_object then null;
end $$;

-- ngos tablosuna payment routing alanları
alter table public.ngos
  add column if not exists payment_mode payment_mode default 'marketplace',
  add column if not exists payment_processor payment_processor default 'iyzico',
  add column if not exists payment_merchant_key_ref text,
    -- Supabase Vault reference; actual key DB'de saklanmaz (güvenlik)
  add column if not exists donation_url text,
  add column if not exists membership_url text,
  add column if not exists referral_webhook_url text,
  add column if not exists embed_config jsonb default '{}'::jsonb,
  add column if not exists tax_exempt boolean default false;
    -- Bakanlar Kurulu muafiyetli vakıf veya kamu yararına dernek statüsü
    -- UI'da "Vergi indirimli ✓" etiketi için

comment on column public.ngos.payment_mode is
  'embedded = processor widget iframe İyiBiri içinde; passthrough = STK''nın URL''ine yönlendirme; marketplace = iyzico sub-merchant İyiBiri altında.';

comment on column public.ngos.payment_merchant_key_ref is
  'Supabase Vault reference (ör. "vault.tema_iyzico_key"). Actual API key DB''de değil, Vault''ta.';

comment on column public.ngos.tax_exempt is
  'Bakanlar Kurulu tarafından muafiyet verilmiş vakıf veya kamu yararına dernek — vergi indirimi geçerli. UI''da etiket için.';

-- Pilot 3 STK payment routing seed
update public.ngos
  set payment_mode = 'embedded',
      payment_processor = 'fonzip',
      donation_url = 'https://fonzip.com/tema/bagis',
      membership_url = 'https://www.tema.org.tr/gonulluluk/gonullumuz-olun',
      tax_exempt = true,
      embed_config = jsonb_build_object(
        'widget_type', 'fonzip_donation',
        'note', 'TEMA fonzip müşterisi. Silent technical integration (Yol D.2).'
      )
  where id = 'tema';

update public.ngos
  set payment_mode = 'marketplace',
      payment_processor = 'iyzico',
      tax_exempt = true,
      embed_config = jsonb_build_object(
        'widget_type', 'iyzico_checkout_form',
        'note', 'TEGV fonzip''te değil — İyiBiri iyzico Marketplace sub-merchant olarak onboarding.'
      )
  where id = 'tegv';

update public.ngos
  set payment_mode = 'marketplace',
      payment_processor = 'iyzico',
      tax_exempt = true,
      embed_config = jsonb_build_object(
        'widget_type', 'iyzico_checkout_form',
        'note', 'LÖSEV fonzip''te değil — İyiBiri iyzico Marketplace sub-merchant.'
      )
  where id = 'losev';

-- Referrals tablosu — attribution tracking
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  ngo_id text references public.ngos(id) not null,
  referral_type text not null check (referral_type in ('membership', 'donation', 'subscription')),
  amount_try numeric(10,2),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'failed', 'cancelled', 'refunded')),
  external_transaction_id text,
  external_order_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unique (user_id, external_transaction_id)
);

alter table public.referrals enable row level security;

create policy "Users view own referrals" on public.referrals
  for select using (auth.uid() = user_id);

create policy "System inserts referrals" on public.referrals
  for insert with check (auth.uid() = user_id);

-- İndex performance için
create index if not exists referrals_user_idx on public.referrals(user_id);
create index if not exists referrals_ngo_idx on public.referrals(ngo_id);
create index if not exists referrals_status_idx on public.referrals(status);
create index if not exists referrals_created_idx on public.referrals(created_at desc);

comment on table public.referrals is
  'ADR-008 payment routing attribution — kullanıcı × STK × işlem eşleştirmesi. Karma bonus trigger + SaaS fee faturalama kaynağı.';

commit;
