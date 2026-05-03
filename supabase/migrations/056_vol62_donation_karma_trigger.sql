-- Vol-62 Migration 056: Donation → Karma Transaction Trigger (P0 BLOCKER)
-- Tarih: 2026-05-03
-- Sorun: Kullanıcı bağış yapınca karma kazanmıyor. Mission complete'inde karma zinciri var ama donation insert için trigger YOK.
-- Çözüm: `donations` tablosuna `INSERT` trigger ekle (SADECE status='completed'), karma_transactions insert et, idempotent yap.
--
-- Kapsam:
--   1. karma_transactions.donation_id column varsa kontrol et, yoksa ekle (nullable FK)
--   2. karma_transactions.type check constraint'ine 'donation' ekle
--   3. donations tablosuna INSERT trigger yaz:
--      - SADECE status='completed' tetiklenince karma ver
--      - karma_amount = floor(amount_try / 10)
--      - is_recurring=true ise +%20 bonus
--      - ON CONFLICT idempotent: donation_id deyse skip
--      - profiles.karma_total auto-update'ı zaten var (Migration 001)
--   4. Validation DO block

begin;

-- ──────────────────────────────────────────────────────────────────
-- 1. karma_transactions.donation_id column ekle (if not exists)
-- ──────────────────────────────────────────────────────────────────

alter table public.karma_transactions
  add column if not exists donation_id uuid references public.donations(id) on delete set null;

comment on column public.karma_transactions.donation_id is
  'Vol-62: Bağış ile ilişkili karma işlemi. FK donations(id) — idempotent trigger için.';

-- ──────────────────────────────────────────────────────────────────
-- 2. karma_transactions.type constraint'ine 'donation' ekle
-- ──────────────────────────────────────────────────────────────────

alter table public.karma_transactions
  drop constraint if exists karma_transactions_type_check;

alter table public.karma_transactions
  add constraint karma_transactions_type_check
    check (type in ('mission_complete', 'reward_redemption', 'ngo_membership', 'donation', 'welcome_bonus'));

-- ──────────────────────────────────────────────────────────────────
-- 3. Trigger: donations INSERT → karma_transactions insert
-- ──────────────────────────────────────────────────────────────────

create or replace function public.handle_donation_karma_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_karma_amount integer;
begin
  -- Vol-62 Pkg-3: SADECE status='completed' olunca karma ver
  if new.status != 'completed' then
    return new;
  end if;

  -- karma_amount = floor(amount_try / 10)
  -- Örnek: 10 TRY → 1 karma, 99 TRY → 9 karma
  v_karma_amount := floor(new.amount_try / 10)::integer;

  -- is_recurring=true (regular_supporter) ise +%20 bonus
  if new.is_recurring then
    v_karma_amount := floor(v_karma_amount * 1.2)::integer;
  end if;

  -- Eğer v_karma_amount < 1 ise sıfırlı karma işlemi ekle (example: 5 TRY → 0 karma)
  -- Bu case bile audit trail için kaydediyoruz
  if v_karma_amount < 1 then
    v_karma_amount := 0;
  end if;

  -- karma_transactions.donation_id zaten varsa skip (idempotent)
  -- ON CONFLICT: donation_id = NEW.id deyse, zaten işlendi demektir
  insert into public.karma_transactions (
    user_id,
    amount,
    type,
    reference_id,
    donation_id,
    description,
    created_at
  ) values (
    new.user_id,
    v_karma_amount,
    'donation',
    new.id::text,
    new.id,
    'Donation: ' || new.amount_try::text || ' TRY → ' || v_karma_amount::text || ' karma' ||
      case when new.is_recurring then ' (regular supporter +20%)' else '' end,
    new.completed_at
  )
  on conflict (donation_id) do nothing;

  -- profiles.karma_total auto-update trigger zaten var (Migration 001)
  -- on_karma_transaction → update_karma_total()
  return new;
end;
$$;

comment on function public.handle_donation_karma_trigger is
  'Vol-62 Pkg-3: donations.status=completed tetiklemesinde karma_transactions insert et. is_recurring ise +20% bonus. Idempotent.';

-- Trigger'i oluştur (varsa sil)
drop trigger if exists on_donation_completed on public.donations;

create trigger on_donation_completed
  after insert on public.donations
  for each row
  execute procedure public.handle_donation_karma_trigger();

-- ──────────────────────────────────────────────────────────────────
-- 4. Index: donation_id üzerinde query hızlama
-- ──────────────────────────────────────────────────────────────────

create index if not exists idx_karma_transactions_donation_id
  on public.karma_transactions (donation_id)
  where donation_id is not null;

-- ──────────────────────────────────────────────────────────────────
-- 5. Validation: Trigger çalışıp çalışmadığını kontrol et
-- ──────────────────────────────────────────────────────────────────

do $$
declare
  v_trigger_exists boolean;
  v_column_exists boolean;
  v_constraint_exists boolean;
  v_donation_count int;
  v_existing_karma_tx int;
begin
  -- Check trigger
  select exists(
    select 1 from information_schema.triggers
    where trigger_name = 'on_donation_completed'
    and event_object_table = 'donations'
  ) into v_trigger_exists;

  -- Check column
  select exists(
    select 1 from information_schema.columns
    where table_name = 'karma_transactions'
    and column_name = 'donation_id'
  ) into v_column_exists;

  -- Check constraint
  select exists(
    select 1 from information_schema.table_constraints
    where table_name = 'karma_transactions'
    and constraint_name = 'karma_transactions_type_check'
  ) into v_constraint_exists;

  -- Count existing donations
  select count(*) into v_donation_count from public.donations where status = 'completed';

  -- Count existing donation karma transactions
  select count(*) into v_existing_karma_tx from public.karma_transactions where type = 'donation';

  raise notice '[056_vol62] Trigger oluşturuldu: %, donation_id column: %, type constraint: %, mevcut completed donations: %, mevcut donation karma tx: %',
    v_trigger_exists, v_column_exists, v_constraint_exists, v_donation_count, v_existing_karma_tx;
end $$;

commit;

-- ──────────────────────────────────────────────────────────────────
-- DOĞRULAMA SORGULARI:
-- ──────────────────────────────────────────────────────────────────
-- SELECT pg_get_triggerdef(oid) FROM pg_trigger WHERE tgname = 'on_donation_completed';
-- SELECT COUNT(*) FROM public.karma_transactions WHERE type = 'donation';
-- INSERT INTO public.donations (...) VALUES (...) — Trigger'in tetiklenip tetiklenmediğini kontrol et.
-- ──────────────────────────────────────────────────────────────────
