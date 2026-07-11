-- ============================================================
-- Migration 061 — Vol-64: Karma → Bağış dönüşümü
-- ============================================================
-- Kullanıcı biriktirdiği Karma'yı bir STK'ya bağışa çevirir. Gerçek TL
-- katkısını sponsor fonu karşılar (kullanıcı para ödemez). Oran: 10 Karma = ₺1.
--
-- İki parça:
--   1. handle_donation_karma_trigger() GUARD — payment_method='karma' olan
--      bağışlar karma İADE ETMEZ (yoksa harcanan karmanın ~%10'u geri gelir =
--      sonsuz sızıntı). Karma harcaması RPC içinde ayrıca yazılır.
--   2. redeem_karma_as_donation() RPC — atomik: bakiye kilitle+kontrol et,
--      donations insert (payment_method='karma'), karma_transactions insert
--      (-karma, type='reward_redemption'). Tek transaction → yarım kalma yok.
--
-- Idempotent: fonksiyon CREATE OR REPLACE; trigger yeniden bağlanır.

begin;

-- ── 1. Trigger guard (056'nın üzerine yaz, sadece guard eklendi) ──

create or replace function public.handle_donation_karma_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_karma_amount integer;
begin
  -- Vol-64: Karma-kaynaklı bağışlar karma KAZANDIRMAZ (kullanıcı zaten karma harcadı).
  if coalesce(new.payment_method, '') = 'karma' then
    return new;
  end if;

  -- Vol-62 Pkg-3: SADECE status='completed' olunca karma ver
  if new.status != 'completed' then
    return new;
  end if;

  v_karma_amount := floor(new.amount_try / 10)::integer;

  if new.is_recurring then
    v_karma_amount := floor(v_karma_amount * 1.2)::integer;
  end if;

  if v_karma_amount < 1 then
    v_karma_amount := 0;
  end if;

  insert into public.karma_transactions (
    user_id, amount, type, reference_id, donation_id, description, created_at
  ) values (
    new.user_id, v_karma_amount, 'donation', new.id::text, new.id,
    'Donation: ' || new.amount_try::text || ' TRY → ' || v_karma_amount::text || ' karma' ||
      case when new.is_recurring then ' (regular supporter +20%)' else '' end,
    new.completed_at
  )
  on conflict (donation_id) do nothing;

  return new;
end;
$$;

comment on function public.handle_donation_karma_trigger is
  'Vol-64: donations.status=completed tetiklemesinde karma ver. payment_method=karma ise ATLA (Karma→bağış geri-ödeme döngüsü önlenir). Idempotent.';

-- ── 2. RPC: Karma harcayıp bağış yarat (atomik) ──

create or replace function public.redeem_karma_as_donation(
  p_ngo_id text,
  p_campaign_id text default null,
  p_karma integer default 0
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_balance integer;
  v_amount numeric(10,2);
  v_scenario donation_scenario_type;
  v_donation_id uuid;
  -- CRITICAL: lib/donations/karma-formula.ts KARMA_TO_TRY_RATE ile eşleşmeli
  v_rate numeric := 0.1;
begin
  if v_user is null then
    raise exception 'AUTH: oturum bulunamadı';
  end if;

  if p_karma is null or p_karma < 100 then
    raise exception 'MIN: en az 100 Karma gerekir';
  end if;

  if not exists (select 1 from public.ngos where id = p_ngo_id) then
    raise exception 'NGO: kurum bulunamadı';
  end if;

  -- Kampanya verildiyse doğrula
  if p_campaign_id is not null
     and not exists (select 1 from public.campaigns where id = p_campaign_id and ngo_id = p_ngo_id) then
    raise exception 'CAMPAIGN: kampanya bulunamadı';
  end if;

  -- Bakiye satırını kilitle (race-condition / çift harcama önlemi)
  select karma_total into v_balance from public.profiles where id = v_user for update;
  if v_balance is null or v_balance < p_karma then
    raise exception 'BALANCE: yetersiz Karma';
  end if;

  v_amount := round(p_karma * v_rate, 2);
  if v_amount <= 0 then
    raise exception 'AMOUNT: geçersiz tutar';
  end if;

  v_scenario := case
    when p_campaign_id is not null then 'specific_campaign'::donation_scenario_type
    else 'general'::donation_scenario_type
  end;

  insert into public.donations (
    user_id, ngo_id, campaign_id, amount_try, scenario_type,
    intent_label, is_recurring, status, tax_eligible,
    payment_method, metadata, completed_at
  ) values (
    v_user, p_ngo_id, p_campaign_id, v_amount, v_scenario,
    'Karma bağışı', false, 'completed', false,
    'karma',
    jsonb_build_object('source', 'karma_conversion', 'karma_spent', p_karma, 'rate', v_rate),
    now()
  ) returning id into v_donation_id;

  -- Karma harcaması (negatif) — update_karma_total trigger bakiyeyi düşürür
  insert into public.karma_transactions (user_id, amount, type, reference_id, description)
  values (v_user, -p_karma, 'reward_redemption', v_donation_id::text,
          p_karma::text || ' Karma → ₺' || v_amount::text || ' bağış');

  return v_donation_id;
end;
$$;

comment on function public.redeem_karma_as_donation is
  'Vol-64: Kullanıcının Karma bakiyesini STK bağışına çevirir (10 Karma = ₺1). Atomik: bakiye kilitle+kontrol, donations(payment_method=karma) + karma_transactions(-karma) insert.';

grant execute on function public.redeem_karma_as_donation(text, text, integer) to authenticated;

commit;
