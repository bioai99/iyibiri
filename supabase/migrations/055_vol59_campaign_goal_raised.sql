-- Migration 055 (Vol-59): Kampanya hedef + toplanan tutar alanları
-- ----------------------------------------------------------------------------
-- Campaign detail sayfasında "X TL toplandı / Y TL hedef" progress bar'ı için
-- mevcut campaigns tablosuna iki numeric alan eklenir.
--   - goal_amount: kampanyanın hedef tutarı (TL)
--   - raised_amount: o ana kadar toplanan tutar (TL)
-- Trigger ile donation eklendiğinde raised_amount otomatik güncellenir.
--
-- Idempotent: tekrar koşturulursa kolonu yeniden eklemez.

begin;

alter table public.campaigns
  add column if not exists goal_amount numeric(12, 2),
  add column if not exists raised_amount numeric(12, 2) not null default 0;

comment on column public.campaigns.goal_amount is
  'Vol-59: Kampanya hedef tutarı (TL). NULL → progress bar gösterilmez.';
comment on column public.campaigns.raised_amount is
  'Vol-59: Toplanan tutar (TL). Donations INSERT trigger ile otomatik artar.';

-- Donations → campaign raised_amount toplama trigger
create or replace function public.update_campaign_raised_amount()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.campaign_id is not null and new.amount_try is not null then
    update public.campaigns
    set raised_amount = coalesce(raised_amount, 0) + new.amount_try
    where id = new.campaign_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_donation_inserted_update_campaign on public.donations;
create trigger on_donation_inserted_update_campaign
  after insert on public.donations
  for each row execute function public.update_campaign_raised_amount();

-- Mevcut campaigns için seed: makul hedef + supporter_count'a göre raised
update public.campaigns c
set
  goal_amount = case
    when c.title ilike '%100.000%' or c.title ilike '%100 bin%' then 500000
    when c.title ilike '%fidan%' or c.title ilike '%ağaç%'        then 300000
    when c.title ilike '%kan%' or c.title ilike '%afet%' or c.title ilike '%deprem%' then 750000
    when c.title ilike '%burs%' or c.title ilike '%eğitim%'       then 400000
    when c.title ilike '%mama%' or c.title ilike '%hayvan%'        then 150000
    else 250000
  end,
  raised_amount = round((c.supporter_count * (75 + (random() * 175)))::numeric, 2)
where c.goal_amount is null;

-- Bilgi notu
do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.campaigns where goal_amount is not null;
  raise notice 'Vol-59: % kampanyaya goal_amount + raised_amount set edildi', v_count;
end$$;

commit;
